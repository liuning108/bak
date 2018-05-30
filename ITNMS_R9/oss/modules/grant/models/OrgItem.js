define(function() {
	return fish.Model.extend({
		idAttribute: 'orgId',

		defaults: {
			orgId: null,
			orgName: null,
			orgCode: null
		},

		initialize: function() {
		}
    });
});