define([
	"text!modules/portlets/iframe/templates/Iframe.html"
], function(IframeTpl) {
	return portal.PortletView.extend({
		template: fish.compile(IframeTpl),

		events: {
		},

		initialize: function(options) {
		},

		render: function() {
			this.$el.html(this.template);
			return this;
		}
	});
});