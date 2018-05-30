define([
	"i18n!i18n/common"
], function(i18nCommon) {
	var i18nData = fish.extend({}, i18nCommon);

	return fish.Model.extend({
		idAttribute: 'privId',

		defaults: {
			state: null,
			stateDate: null,
			menuId: null,
			menuName: null,
			privId: null,
			privName: null,
			componentName: null,					
			objId: null
		},

		initialize: function() {
			if (this.has('privId')) {
				this.set('componentName', this.get('privName'));
			}
			if (fish.isNumber(this.get('privId'))) {
				this.set('privId', "" + this.get('privId'));
			}
			
		}
	});
});