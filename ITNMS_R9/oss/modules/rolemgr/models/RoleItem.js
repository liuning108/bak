/**
 * Title: RoleItem.js
 * Description: RoleItem.js
 * Author: wu.yangjin
 * Created Date: 15-5-19 18:40pm
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function () {
	return fish.Model.extend({
		idAttribute: 'roleId',

		defaults: {
			"roleId": null,
			"roleName": null,
			"roleCode": "",
			"isLocked": "N",
			"comments": ""
		},

		initialize: function() {
			if (this.has("roleId")) {
				this.set("id", this.get("roleId"));
			}
			if (this.has("roleName")) {
				this.set("name", this.get("roleName"));
			}
		}
    });
});
