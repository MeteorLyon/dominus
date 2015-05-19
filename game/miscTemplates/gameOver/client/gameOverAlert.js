Template.gameOverAlert.helpers({
    show: function() {
        var setting = Settings.findOne({name:'isGameOver'});
        if (setting && setting.value) {
            return true;
        }
    },

    winner: function() {
    	var setting = Settings.findOne({name:'winner'});
        if (setting) {
            return setting.value;
        }
    },

    gameOverDate: function() {
    	var gameOverDate = Settings.findOne({name:'gameOverDate'});
    	if (gameOverDate) {
    		return gameOverDate.value;
    	}
    },

    resetDate: function() {
        var gameOverDate = Settings.findOne({name:'gameOverDate'});
        if (gameOverDate && gameOverDate.value !== null) {
            var goDate = moment(new Date(gameOverDate.value));
            return goDate.add(s.gameOverPhaseTime, 'ms').toDate();
        }
    },

    nextGameDelay: function() {
        var duration = moment.duration(s.gameClosedPhaseTime);
        return duration.humanize();
    }
});


Template.gameOverAlert.events({
    'click #gameOverUserLink': function(event, template) {
        var self = this;

        var setting = Settings.findOne({name:'winner'});
        if (setting) {
            var winner = setting.value;

            if (winner) {
                check(winner.x, validNumber);
                check(winner.y, validNumber);
                Meteor.call('coords_to_id', winner.x, winner.y, 'hex', function(error, hexId) {
                    if (!error && hexId) {
                        center_on_hex(winner.x, winner.y);
                        Session.set('selected_type', 'hex');
                        Session.set('selected_id', hexId);
                        Session.set('selected_coords', {x:winner.x, y:winner.y});
                    }
                });
            }
        }
    }
});


Template.gameOverAlert.onCreated(function() {
    this.subscribe('isGameOver');
    this.subscribe('gameOverDate');
    this.subscribe('winner');
});
