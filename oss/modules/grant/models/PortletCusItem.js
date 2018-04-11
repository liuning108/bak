define(function() {
	return fish.Model.extend({
		idAttribute: 'PORTLET_ID',

		defaults: {
			PORTLET_ID: null,
			SHOW_NAME: null,
			CLASS_NAME: null,
			DEFAULT_TITLE: null
		},

		initialize: function() {
		}
    });
});