/**
 * Title: UserQryCondition.js
 * Description: User Query Condition In User Manager
 * Author: wu.yangjin
 * Created Date: 15-4-3 下午16:32
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		defaults: {
			'state': null,
			'userName': null,
			'userCode': null,
			'isLocked': null,
			'portalId': null
//		},
//
//		initialize: function() {
//			if (this.get('STATE') === '#') {
//				this.unset('STATE');
//			}
//			if (this.get('IS_LOCKED') === '#') {
//				this.unset('IS_LOCKED');
//			}
//			if (this.get('PORTAL_ID') === '#' || this.get('PORTAL_ID') === '') {
//				this.unset('PORTAL_ID');
//			}
//			if (this.get('USER_NAME') === "") {
//				this.unset('USER_NAME');
//			}
//			if (this.get('USER_CODE') === "") {
//				this.unset('USER_CODE');
//			}
		}
	});
});
