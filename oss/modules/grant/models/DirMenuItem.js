define(function() {
	return fish.Model.extend({
		idAttribute: 'keyId',

		defaults: {
			keyId: null,
			portalId: null,
			portalName: null,
			iconUrl: null,
			state: null,
			stateDate: null,
			partyId: null,
			partyName: null,
			seq: null,
			type: null,
		},

		initialize: function() {
			if (this.has('portalId')) {
				this.set('partyId', this.get('portalId') + "");
				this.set('partyName', this.get('portalName'));
				this.set('type', "-1");
			}
		}
    });
});