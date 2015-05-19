Router.route('/admin/settings', function() {
    this.layout('adminLayout');
    this.render('adminSettings');
});

Router.route('/admin/reports', function() {
    this.layout('adminLayout');
    this.render('adminReports');
});

Router.route('/admin', function() {
    this.layout('adminLayout');
    this.render('admin');
});


Router.map(function() {

	this.route('adminCharges', {
		path: '/admin/charges',
		waitOn: function() { return Meteor.subscribe('admin_charges'); }
	});

	this.route('adminFacts', {
		path: '/admin/facts'
	});

	this.route('adminGamestats', {
		path: '/admin/gamestats',
		waitOn: function() { return Meteor.subscribe('admin_gamestats'); }
	});

	this.route('adminJobs', {
		path: '/admin/jobs'
	});

	this.route('adminJobqueue', {
		path: '/admin/admin_jobqueue',
	});

	this.route('adminJobstats', {
		path: '/admin/jobstats',
	});

	this.route('adminUsersOnline', {
		path: '/admin/admin_users_online',
		waitOn: function() { return Meteor.subscribe('admin_users_online'); }
	});

	this.route('adminCommands', {
		path: '/admin/admin_commands',
	});

	this.route('adminChatrooms', {
		path: '/admin/admin_chatrooms',
		waitOn: function() { return Meteor.subscribe('admin_chatrooms');}
	});

    this.route('adminLogin', {
        path: '/admin/login',
    });

});
