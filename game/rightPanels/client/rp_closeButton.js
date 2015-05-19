Template.rp_closeButton.helpers({
    selectedType: function() {
        return Session.get('selected_type');
    },

    selectedId: function() {
        return Session.get('selected_id');
    }
});


Template.rp_closeButton.events({
    'click #closeRpButton': function(event, template) {
        deselect_all();
        remove_all_highlights();
    }
});
