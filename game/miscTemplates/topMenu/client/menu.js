Template.menu.helpers({
	smallScreen: function() {
		var screenWidth = Session.get('screenWidth');
		if (screenWidth) {
			return Session.get('screenWidth') < 800;
		}
	},

	summary_active: function() {
		if (Session.get('show_summary_panel')) { return 'active'; } else { return ''; }
	},

	numUnreadAlerts: function() {
		return UnreadAlerts.find().count();
	},

	alerts_active: function() {
		if (Session.get('show_alerts_panel')) { return 'active' } else { return '' }
	},

	market_active: function() {
		if (Session.get('show_market_panel')) { return 'active' } else { return '' }
	},

	stats_active: function() {
		if (Session.get('show_stats_panel')) { return 'active' } else { return '' }
	},

	chatrooms_active: function() {
		if (Session.get('show_chatrooms_panel')) { return 'active' } else { return '' }
	},

	forumsActive: function() {
		if (Session.get('showForumsPanel')) { return 'active'; } else { return ''; }
	},

	rankings_active: function() {
		if (Session.get('show_rankings_panel')) { return 'active' } else { return '' }
	},

	settings_active: function() {
		if (Session.get('show_settings_panel')) { return 'active' } else { return '' }
	},

	help_active: function() {
		if (Session.get('show_help_panel')) { return 'active' } else { return '' }
	},

	admin_active: function() {
		if (Session.get('show_admin_panel')) { return 'active' } else { return '' }
	},

	store_active: function() {
		if (Session.get('show_store_panel')) { return 'active'; } else { return ''; }
	},

	tree_active: function() {
		if (Session.get('show_tree_panel')) { return 'active'; } else { return ''; }
	},

	pro_active: function() {
		if (Session.get('show_pro_panel')) { return 'active'; } else { return ''; }
	},

	isNewForumPost: function() {
		if (Session.get('forumTemplate') == 'forumList') {
			return false;
		}

		// posts older than two weeks are not new
		var cutoff = moment().subtract(2, 'weeks');
		var postDate = moment(new Date(this.createdAt));
		if (postDate.isBefore(cutoff)) {
			return false;
		}

		var lastPostDate = Forumlatestpost.findOne();
		if (lastPostDate) {
			var lastPost = moment(new Date(lastPostDate.latestPost));
			var viewedForumList = Cookie.get('forumList');
			if (moment(new Date(viewedForumList)).isBefore(lastPost)) {
				return true;
			}
		}
	},

	is_new_chat: function() {
		var isNew = false;
		var page_title = s.game_name + " : " + _.capitalize(Meteor.settings.public.GAME_ID);

		Roomlist.find().forEach(function(room) {
			var selectedId = Session.get('selectedChatroomId');
			if (room._id != selectedId || !Session.get('windowHasFocus')) {
				var recent = Recentchats.findOne({room_id:room._id})
				if (recent) {
					var latest_open = Cookie.get('room_'+room._id+'_open')
					if (latest_open) {
						if (moment(new Date(recent.updated_at)).isAfter(moment(new Date(latest_open)))) {
							document.title = page_title
							isNew = true
						}
					} else {
						// they don't have a cookie so give them one
						var date = new Date(TimeSync.serverTime(null, 5000))
						Cookie.set('room_'+room._id+'_open', moment(date).subtract(1, 's').toDate(), {years: 10})
						isNew = true
					}
				}
			}
		})
		return isNew
	}
})



Template.menu.events({
	'click #show_summary_panel_button': function(event, template) {
		event.preventDefault()
		if (Session.get('show_summary_panel')) {
			Session.set('show_summary_panel', false)
		} else {
			Session.set('show_summary_panel', true)
		}
	},

	'click #show_admin_panel_button': function(event, template) {
		if (Session.get('show_admin_panel')) {
			Session.set('show_admin_panel', false)
		} else {
			Session.set('show_admin_panel', true)
		}
	},

	'click #show_market_panel_button': function(event, template) {
		if (Session.get('show_market_panel')) {
			Session.set('show_market_panel', false)
		} else {
			Session.set('show_market_panel', true)
		}
	},

	'click #show_settings_panel_button': function(event, template) {
		if (Session.get('show_settings_panel')) {
			Session.set('show_settings_panel', false)
		} else {
			Session.set('show_settings_panel', true)
		}
	},

	'click #show_chatrooms_panel_button': function(event, template) {
		if (Session.get('show_chatrooms_panel')) {
			Session.set('show_chatrooms_panel', false)
		} else {
			Session.set('show_chatrooms_panel', true)
		}
	},

	'click #showForumsButton': function(event, template) {
		if (Session.get('showForumsPanel')) {
			Session.set('showForumsPanel', false)
			Cookie.set('forum_close', new Date(), {years: 10})
		} else {
			Session.set('showForumsPanel', true)
			Cookie.clear('forum_close')
		}
	},

	'click #show_alerts_panel_button': function(event, template) {
		if (Session.get('show_alerts_panel')) {
			Session.set('show_alerts_panel', false)
		} else {
			Session.set('show_alerts_panel', true)
		}
	},

	'click #show_help_panel_button': function(event, template) {
		if (Session.get('show_help_panel')) {
			Session.set('show_help_panel', false)
		} else {
			Session.set('show_help_panel', true)
		}
	},

	'click #show_stats_panel_button': function(event, template) {
		if (Session.get('show_stats_panel')) {
			Session.set('show_stats_panel', false)
		} else {
			Session.set('show_stats_panel', true)
		}
	},

	'click #show_rankings_panel_button': function(event, template) {
		if (Session.get('show_rankings_panel')) {
			Session.set('show_rankings_panel', false)
		} else {
			Session.set('show_rankings_panel', true)
		}
	},

	'click #show_store_panel_button': function(event, template) {
		if (Session.get('show_store_panel')) {
			Session.set('show_store_panel', false)
		} else {
			Session.set('show_store_panel', true)
		}
	},

	'click #show_tree_panel_button': function(event, template) {
		if (Session.get('show_tree_panel')) {
			Session.set('show_tree_panel', false)
		} else {
			Session.set('show_tree_panel', true)
		}
	},

	'click #show_pro_panel_button': function(event, template) {
		if (Session.get('show_pro_panel')) {
			Session.set('show_pro_panel', false)
		} else {
			Session.set('show_pro_panel', true)
		}
	},
})



Template.menu.rendered = function() {
	Session.setDefault('show_summary_panel', true)
	Session.setDefault('show_help_panel', false)
	Session.setDefault('show_alerts_panel', false)
	Session.setDefault('show_admin_panel', false)
	Session.setDefault('show_market_panel', false)
	Session.setDefault('show_settings_panel', false)
	Session.setDefault('showForumsPanel', false)
	Session.setDefault('show_chatrooms_panel', false)
	Session.setDefault('show_rankings_panel', false)
	Session.setDefault('show_stats_panel', false)
	Session.setDefault('show_store_panel', false)
	Session.setDefault('show_tree_panel', false)
	Session.setDefault('show_pro_panel', false)
	Session.setDefault('show_coords', false)

	this.autorun(function() {
		Meteor.subscribe('unreadAlerts')
		Meteor.subscribe('room_list')
		Meteor.subscribe('market')
		Meteor.subscribe('recentchats')

		// villages must always be loaded
		// so that we know how many villages a player has
		Meteor.subscribe('left_panel_villages')
		Meteor.subscribe('left_panel_castle')
	})


	Session.setDefault('rightPanelInfoLoaded', false)
	this.autorun(function() {
		var selected_id = Session.get('selected_id')
		var selected_type = Session.get('selected_type')

		if (selected_id && selected_type) {
			switch (selected_type) {
				case 'castle':
					var infoHandle = Meteor.subscribe('castleForHexInfo', Session.get('selected_id'))
					Session.set('rightPanelInfoLoaded', infoHandle.ready())
					break
				case 'army':
					var infoHandle = Meteor.subscribe('armyForHexInfo', Session.get('selected_id'))
					Session.set('rightPanelInfoLoaded', infoHandle.ready())
					break
				case 'village':
					var infoHandle = Meteor.subscribe('villageForHexInfo', Session.get('selected_id'))
					Session.set('rightPanelInfoLoaded', infoHandle.ready())
					break
			}
		}
	})
}
