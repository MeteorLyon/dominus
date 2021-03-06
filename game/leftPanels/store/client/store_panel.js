Template.store_panel.helpers({
	_store: function() {
		return _store;
	},
});


Template.store_panel.events({
	'click .store_donate_button': function(event, template) {
		var button = $(event.currentTarget);
		var button_html = $(button).html();
		var error_alert = template.find('#donation_error_alert');
		var success_alert = template.find('#donation_success_alert');
		var amount = event.currentTarget.getAttribute('data-amount');

		$(error_alert).hide();
		$(success_alert).hide();

		$(button).attr('disabled', true);
		$(button).html('<i class="fa fa-refresh fa-spin"></i> Please Wait');

		var handler = StripeCheckout.configure({
			key: Meteor.settings.public.stripe_publishable_key,
			image: '/stripe_logo.jpg',
			bitcoin: true,
			token: function(token) {
				Meteor.call('stripe_donation_checkout', amount * 100, token, function(error, charge_id) {
					if (error) {
						$(button).attr('disabled', false);
						$(button).html(button_html);
						$(error_alert).show();
						$(error_alert).html('Error charging card.  Card declined.');
					} else {
						$(button).attr('disabled', false);
						$(button).html(button_html);
						$(success_alert).show();
						$(success_alert).html('Donated $'+amount+'. Thanks!');
					}
				});
			}
		});

		handler.open({
			name: s.game_name,
			description: 'Donate $'+amount+' to '+s.game_name,
			amount: amount * 100,
			email: get_user_property("emails")[0].address
		});
	}
});



Template.store_panel.created = function() {
	this.autorun(function() {
		Meteor.subscribe('store_charges');
	});
};


Template.store_panel.rendered = function() {
	this.firstNode.parentNode._uihooks = leftPanelAnimation;
};
