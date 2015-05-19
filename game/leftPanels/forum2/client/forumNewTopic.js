Template.forumNewTopic.helpers({
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
    },

    tags: function() {
        return Forumtags.find();
    }
});


Template.forumNewTopic.events({
    'click #saveNewTopicButton': function(event, template) {
        var title = template.find('#topicTitleInput').value;
        var tag = template.find('#topicTagSelect').value;
        var text = template.find('#topicTextarea').value;
        var alert = template.find('#topicAlert');
        var button = event.currentTarget;
        var buttonText = $(button).text();

        $(button).text('Creating Topic...');
        $(button).prop('disabled', true);
        $(alert).hide();

        Meteor.call('forumNewTopic', title, tag, text, function(error, result) {
            $(button).text(buttonText);
            $(button).prop('disabled', false);

            if (error) {
                $(alert).show();
                $(alert).text(error.error);
            } else {
                Cookie.set('forumList', moment().add(1, 'seconds').toDate(), {years: 10});
                Session.set('forumTemplate', 'forumList');
            }
        });
    },

    'click #cancelNewTopicButton': function(event, template) {
        Session.set('forumTemplate', 'forumList');
    },
});
