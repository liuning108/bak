define(function() {
	return fish.Model.extend({
		defaults: {
			roleName: null,
			roleCode: null,
			roleId: null,
			ownedDataPriv: null,
			ownedType: null
		},

		initialize: function() {
			if (this.get('ownedDataPriv') === '#') {
				this.unset('ownedDataPriv');
			}
			if (this.get('roleName') === '') {
				this.unset('roleName');
			}
			if (this.get('roleCode') === '') {
				this.unset('roleCode');
			}
			if (this.get('ownedType') === '#') {
				this.unset('ownedType');
			}			
		}
	});
});
