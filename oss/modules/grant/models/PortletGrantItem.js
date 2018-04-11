/**
 * Title: PortletGrantItem.js
 * Description: Portlet Grant Item
 * Author: wu.yangjin
 * Created Date: 15-4-24 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	"i18n!i18n/common"
], function(i18nCommon) {
	var i18nData = fish.extend({}, i18nCommon);

	return fish.Model.extend({
		idAttribute: 'privId',

		defaults: {
			privId: null,
			privName: null,
			portletId: null,
			portletName: null,
			state: null,
			stateDate: null			
		},

		initialize: function() {
			if (this.has('privId')) {
				if (this.get('privType') === 'P') {
					this.set('portletId', this.get('privId'));
					this.set('portletName', this.get('privName'));
				}
			}
			if (fish.isNumber(this.get('privId'))) {
				this.set('privId', "" + this.get('privId'));
			}
			
		}
	});
});