/**
 * Title: PortalItem.js
 * Description: Portal Item
 * Author: wu.yangjin
 * Created Date: 15-4-28 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		idAttribute: 'portalId',

		defaults: {
			'portalId': null,
			'portalName': null,
			'comments': "",
			'url': "",
			'iconUrl': "",
			'indexId': null
		}
    });
});
