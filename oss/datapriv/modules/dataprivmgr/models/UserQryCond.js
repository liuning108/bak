define(function() {
	return fish.Model.extend({
		defaults: {
			userName: null,
			userCode: null,
			roleId: null,
			orgId: null,
			staffIds: null,
			state: "A",
			ownedDataPriv: null,
			ownedType: null
		},

		initialize: function() {
			if (this.get('state') === '#') {
				this.unset('state');
			}
			if (this.get('orgId') === '') {
				this.unset('orgId');
			}
			if (this.get('staffIds') === '') {
				this.unset('staffIds');
			}
			if (this.get('roleId') === '#') {
				this.unset('isLocked');
			}
			if (this.get('ownedType') === '#') {
				this.unset('ownedType');
			}
			if (this.get('ownedDataPriv') === '#') {
				this.unset('ownedDataPriv');
			}
			if (this.get('userName') === "") {
				this.unset('userName');
			}
			if (this.get('userCode') === "") {
				this.unset('userCode');
			}
		}
	});
});
