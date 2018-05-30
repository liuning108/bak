/**
 * Title: DirPartyItem.js
 * Description: Directory Party Item
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
			iconUrl: null,
			state: null,
			dirId: null,
			stateDate: null,
			dirName: null,
			partyId: null,
			partyName: null,
			sql: null,
			type: null,			
			'url': null,
			'comments': null,
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