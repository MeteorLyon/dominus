Accounts.validateNewUser(function(user) {
	// TODO: fix this
	// var bannedEmails = EJSON.parse(process.env.BANNED_EMAILS);
	// if (_.contains(bannedEmails, user.emails[0].address)) {
	// 	throw new Meteor.Error('403', 'User banned.');
	// } else {
	// 	return true;
	// }

	// admin can always create account
	if (user.emails[0].address == process.env.DOMINUS_ADMIN_EMAIL) {
		return true;
	}

	// max players
	var numPlayers = Meteor.users.find().count();
	if (numPlayers >= s.serverMaxPlayers) {
		throw new Meteor.Error(403, 'Game full.');
	}

	// only let admin create account if before start date
	var setting = Settings.findOne({name:'gameStartDate'});
	if (setting && setting.value !== null) {
		var startDate = moment(new Date(setting.value));
		if (startDate.isValid()) {
			if (moment().isAfter(startDate)) {
				return true;
			}
		}
	}

	return false;
});


// this is called before validateNewUser()
// don't do anything here except setup user object
Accounts.onCreateUser(function(options, user) {
	if (options.profile) {
		user.profile = options.profile;
	} else {
		user.profile = {};
	}

	// set admin
	user.admin = false;

	// if using a service to sign in put that email into user.emails
	// create username
	if (user.services) {
		var email = null;
		if (user.services.google) {
			email = user.services.google.email;
			var verified = user.services.google.verified_email;
			user.emails = [{address:email, verified:verified}];
			user.username = user.profile.name;

			if (user.services.google.email == process.env.DOMINUS_ADMIN_EMAIL) {
				user.admin = true;
			}
		}

		if (user.services.facebook) {
			email = user.services.facebook.email;
			user.emails = [{address:email, verified:true}];
			user.username = user.profile.name;
		}
	}

	// limit username to 25 character
	if (user.username.length > 25) {
		user.username = user.username.substring(0,25);
	}

	if (Meteor.isServer && process.env.NODE_ENV == 'development') {
		user.emails[0].verified = true;
	}

	user = setupNewUser(user);

	return user;
});


Cue.addJob('subscribeToNewsletter', {retryOnError:true, maxMs:1000*60*5}, function(task, done) {
	subscribeToNewsletter(task.data.email, task.data.name);
	done();
});

// subscribe to mailing list
subscribeToNewsletter = function(email, name) {
	if (Meteor.isServer && process.env.NODE_ENV != 'development') {
		// add to home base mailing list
		landingConnection.call('addPlayerToMailinglist', process.env.DOMINUS_KEY, email, name);
	}
};



// check when user logs in if they have a castle
// if not then they are a new user
// this gets called multiple times per user, careful
Accounts.onLogin(function(data) {
	if (data.user && !data.user.castle_id) {
		onCreateUser(data.user._id);
	}

	// reset this
	// flag for has notification that your account will soon been deleted been sent to this user
	Meteor.users.update(data.user._id, {$set:{accountDelNotificationSent:false}});
});


onCreateUser = function(userId) {
	check(userId, String);
	var fields = {emails:1, username:1, castle_id:1, admin:1};
	var user = Meteor.users.findOne(userId, {fields:fields});
	if (user && !user.castle_id) {
		Cue.addTask('subscribeToNewsletter', {isAsync:true, unique:true}, {email:user.emails[0].address, name:user.username});
		Cue.addTask('removeDominus', {isAsync:true, unique:true}, {});
		Cue.addTask('create_castle', {isAsync:false, unique:true}, {user_id:userId});
		Cue.addTask('initDailystatsForNewUser', {isAsync:false, unique:true}, {user_id:userId});
		Cue.addTask('setupEveryoneChatroom', {isAsync:false, unique:true}, {});

		// create profile
		var options = {username: user.username, admin:user.admin};
		callLandingMethod('profile_newPlayer', user.emails[0].address, options);

		// let home base know that a new player has joined
		var numPlayers = Meteor.users.find().count();
		landingConnection.call('newPlayerJoinedGame', process.env.GAME_ID, process.env.DOMINUS_KEY, numPlayers);
	}
};


Meteor.startup(function() {
	if (process.env.DOMINUS_WORKER == 'true') {
		Accounts.loginServiceConfiguration.remove({service:'google'});
		Accounts.loginServiceConfiguration.remove({service:'facebook'});
		Accounts.loginServiceConfiguration.insert(Meteor.settings.googleLogin);
		Accounts.loginServiceConfiguration.insert(Meteor.settings.facebookLogin);
	}
});


// also called in tests
setupNewUser = function(user) {
	user.gold = s.starting_resources.gold;
	user.grain = s.starting_resources.grain;
	user.lumber = s.starting_resources.lumber;
	user.ore = s.starting_resources.ore;
	user.clay = s.starting_resources.clay;
	user.glass = s.starting_resources.glass;
	user.wool = s.starting_resources.wool;
	user.created_at = new Date();
	user.lord = null;
	user.vassals = [];
	//user.allies = []
	user.allies_below = [];
	user.allies_above = [];
	user.team = [];
	user.is_king = true;
	user.king = null;
	user.is_dominus = false;
	user.show_welcome_screen = true;
	user.num_vassals = 0;
	//user.num_allies = 0
	user.num_allies_above = 0;
	user.num_allies_below = 0;
	user.res_update = {
		gold: 0,
		grain: 0,
		lumber: 0,
		ore: 0,
		wool: 0,
		clay: 0,
		glass: 0
	};
	user.lp_show_armies = true;
	user.lp_show_lords = true;
	user.lp_show_allies = true;
	user.hex_scale = 1;
	user.income = 0;
	user.purchases = {
		castles: [s.castle.starting_image]
	};
	user.losses = {};
	user.losses_worth = 0;
	user.losses_num = 0;
	user.sp_show_coords = false;
	user.sp_show_minimap = true;
	user.lastActive = new Date();
	user.net = {
		armies:0,
		villages:0,
		castle:0,
		user:0
	};

	// flag for has notification that your account will soon been deleted been sent to this user
	user.accountDelNotificationSent = false;

	return user;
};


Accounts.config({
	sendVerificationEmail:true,
	loginExpirationInDays: null
});

Accounts.emailTemplates.siteName = 'Dominus';
Accounts.emailTemplates.from = 'Dominus <dan@dominusgame.net>';
Accounts.emailTemplates.verifyEmail.subject = function(user) {
	return 'Email verification for Dominus';
};

Accounts.emailTemplates.verifyEmail.html = function(user, url) {
	var email = '<div><img src="https://dominusgame.net/emails/emailBanner.jpg" style="max-width:100%;max-height:283px;"><br><br><p>Hello,</p><p>To verify your email, simply click the link below.</p><p><a href="'+url+'">'+url+'</a></p><p>Inactive unverified accounts are deleted after 48 hours.</p><p>Thanks.</p><p><a href="https://dominusgame.net">Dominus</a></p></div>';
	return email;
};
