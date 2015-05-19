Template.adminReports.helpers({
    reports: function() {
        return Reports.find({}, {sort:{createdAt:-1}});
    }
});

Template.adminReports.onCreated(function() {
    this.subscribe('adminReports');
});
