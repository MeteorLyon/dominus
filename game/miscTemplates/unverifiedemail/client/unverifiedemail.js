Template.unverifiedemail.helpers({
    show: function() {
        var user = Meteor.users.findOne(Meteor.userId(), {fields: {emails:1}});
        if (user && user.emails) {
            var verified = user.emails[0].verified;
            if (!verified) {
                return true;
            }
        }
    },

    email: function() {
        var user = Meteor.users.findOne(Meteor.userId(), {fields: {emails:1}});
        if (user && user.emails) {
            return user.emails[0].address;
        }
    }
});

Template.unverifiedemail.events({
    'click #resendVerificationEmailButton': function(event, template) {
        var alert = template.find('#emailVerificationSentAlert')
        $(alert).hide()

        Meteor.call('resendVerificationEmail', function(error, result) {
            if (error) {
                console.log(error)
            } else {
                $(alert).show(100)
            }
        })
    }
})
