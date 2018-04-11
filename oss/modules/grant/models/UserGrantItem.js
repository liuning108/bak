/**
 * Title: UserGrantItem.js
 * Description: User Grant Item
 * Author: wu.yangjin
 * Created Date: 15-5-21 下午17:03
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		idAttribute: 'userId',

		defaults: {
			'userId': null,
			'userName': "",
			'userCode': "",
			'state': 'A'
		},

		initialize: function() {
			if (this.get('state') === 'A') {
				this.set('stateStr', 'Active');
			} else if (this.get('state') === 'X') {
				this.set('stateStr', 'Inactive');
			}
		}
    });
});
