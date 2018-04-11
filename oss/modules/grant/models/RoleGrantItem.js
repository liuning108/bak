/**
 * Title: RoleGrantItem.js
 * Description: Role Grant Item
 * Author: wu.yangjin
 * Created Date: 15-4-23 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		idAttribute: 'ROLE_ID',

		defaults: {
			'roleName': null,
			'roleCode': null,
			'roleId': null,
			'isLocked': null,
			'comments': null
		}
    });
});
