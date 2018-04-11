/**
 * Title: PortalGrantItem.js
 * Description: Portal Grant Item
 * Author: wu.yangjin
 * Created Date: 15-4-23 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(["i18n!modules/usermgr/i18n/usermgr"], function(i18nUserMgr) {
	var i18nData = fish.extend({}, i18nUserMgr);

	return fish.Model.extend({
		idAttribute: 'keyId',

		defaults: {
			keyId: null,
			portalId: null,
			portalName: null,
			url: "",
			portalType: null
		},

		initialize: function() {
			if (this.has('roleId') && this.get('_rowd_') !== false) {
				this.set('portalType', i18nData.USERMGR_ROLE_PORTAL);
				this.set('keyId', this.get('portalId') + "R");
				this.set('_rowd_', true); // which means row disabled
			} else {
				this.set('portalType', i18nData.USERMGR_USER_PORTAL);
				this.set('keyId', this.get('portalId') + "U");
			}
		}
    });
});