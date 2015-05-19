Template.forumNewPost.helpers({
    hasReports: function() {
        var num = Reports.find().count();
        if (num && num > 0) {
            return true;
        }
    },

    reportTimeLeft: function() {
        var fields = {createdAt:1};
        var sort = {createdAt:1};
        var oldest = Reports.findOne({}, {sort:sort, fields:fields});
        var numReports = Reports.find().count();
        if (oldest) {
            var reportDate = moment(oldest.createdAt);
            var pastTime = moment() - reportDate;
            var length = reportDuration(numReports);
            var timeLeft = length - pastTime;
            return moment.duration(timeLeft).humanize();
        }
    }
});

Template.forumNewPost.events({
    'click #newPostButton': function(event, template) {
        var textarea = template.find('#newPostTextarea');
        var text = textarea.value;
        var alert = template.find('#newPostAlert');
        var button = event.currentTarget;
        var buttonText = $(button).text();

        $(button).text('Creating Post...');
        $(button).prop('disabled', true);
        $(alert).hide();

        Meteor.call('forumNewPost', template.data.tagId, template.data._id, text, function(error, result) {
            $(button).text(buttonText);
            $(button).prop('disabled', false);

            if (error) {
                $(alert).show();
                $(alert).text(error.error);
            } else {
                Cookie.set('forumList', moment().add(1, 'seconds').toDate(), {years: 10});
                $(textarea).val('');
            }
        });
    }
});
