/**
 * Title: PortletNavItem.js
 * Description: Portlet Navigation Item
 * Author: wu.yangjin
 * Created Date: 15-5-22 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		idAttribute: 'keyId',

		defaults: {
			portalId: null,
			portalName: null,
			state: null,
			typeId: null,
			stateDate: null,
			typeName: null,
			partyId: null,
			partyName: null,
			seq: null,
			type: null
		},

		initialize: function() {
			if (this.has('portalId')) {
				this.set('partyId', this.get('portalId') + "");
				this.set('partyName', this.get('portalName'));
				this.set('type', "-1"); // -1 marks portal
			}
		}
    });
});