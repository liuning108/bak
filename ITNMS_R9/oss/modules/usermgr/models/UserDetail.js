/**
 * Title: UserDetail.js
 * Description: User Detail
 * Author: wu.yangjin
 * Created Date: 15-4-7 下午17:03
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		defaults: {
			userId: null,
			userName: null,
			userCode: null,
			contactInfo: null,
			userEffDate: null,
			userExpDate: null,
			memo: null,
			isEffectiveNow: null,
			ipAddress: null
		},

		initialize: function() {
			if (this.get('userEffNow') === 'on') {
				this.set('isEffectiveNow', 'Y');
				this.set('userEffDate', null);
			}
		}
    });
});