define(function() {
	return fish.Model.extend({
		idAttribute: 'staffId',

		defaults: {
			staffId: null,
			userName: null,
			userCode: null
		},

		initialize: function() {
		}
    });
});