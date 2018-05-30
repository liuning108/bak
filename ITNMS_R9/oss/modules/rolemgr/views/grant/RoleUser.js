define([
    'modules/grant/models/UserGrantItem',
    'modules/grant/collections/GrantItems',
   	'modules/grant/views/Grant2View',
   	'modules/rolemgr/actions/RoleMgrAction',
	'i18n!modules/rolemgr/i18n/rolemgr',
	'i18n!modules/usermgr/i18n/usermgr'
], function(UserGrantItem, GrantItems, Grant2View, RoleMgrAction,
	 i18nRoleMgr, i18nUserMgr) {
	var UserGrantItems = GrantItems.extend({
		model: UserGrantItem
	});

	return Grant2View.extend({
		i18nData: fish.extend({header: false,
			multisel: true,
			GRANT_DOWN_TITLE: i18nRoleMgr.ROLEMGR_USER_OF_ROLE,
			GRANT_UP_TITLE: i18nRoleMgr.ROLEMGR_USER
		}, i18nRoleMgr, i18nUserMgr),

		initialize: function() {
			this.grantItemsD = new UserGrantItems();
			this.grantItemsU = new UserGrantItems();

			this.colModelD = [{
				name: 'userId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'userName',
				label: this.i18nData.USERMGR_USER_NAME,
				search: true
			}, {
				name: 'userCode',
				label: this.i18nData.USERMGR_USER_CODE,
				search: true
			}, {
				name: 'stateStr',
				label: this.i18nData.USERMGR_USER_STATE
			}];

			this.colModelU = [{
				name: 'userId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'userName',
				label: this.i18nData.USERMGR_USER_NAME,
				search: true
			}, {
				name: 'userCode',
				label: this.i18nData.USERMGR_USER_CODE,
				search: true
			}, {
				name: 'stateStr',
				label: this.i18nData.USERMGR_USER_STATE
			}];

			this.listenTo(this.model, 'change', this.reload);

			Grant2View.prototype.initialize.call(this);
			this.changeGrantDownTitle();
		},

		reload: function() {
			this.changeGrantDownTitle();
			RoleMgrAction.qryUserList(function(userList) {
				var roleId = this.model.get("roleId");
				RoleMgrAction.qryUserListByRoleId(roleId, function(data) {
					var roleUsers = data || [];
					this.grantItemsD.reset(roleUsers);
					this.grantItemsU.reset(fish.filter(userList.list, function(user) {
						return fish.where(roleUsers, {
							userId: Number(user.userId)
						}).length === 0;
					}));
				}.bind(this));
			}.bind(this));
		},

		changeGrantDownTitle: function(){
			this.RESOURCE_ROLEMGR_USER_OF_ROLE = fish.compile(this.i18nData.ROLEMGR_USER_OF_ROLE);
										
			var grantDownTitle = this.RESOURCE_ROLEMGR_USER_OF_ROLE({
				roleName: this.model.get('roleName')
			});
			this.$(".grant-grid-d .ui-jqgrid-title").html(grantDownTitle);
			this.$(".grant-grid-d .ui-jqgrid-title").prop("title",grantDownTitle);
		},

		grantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			fish.confirm(this.i18nData.ROLEMGR_GRANT_USER_CONFIRM,function() {
					var grantUsers = this.grantItemsD.clone();
					grantUsers.add(selrows);
					RoleMgrAction.grantUser2Role(roleId, grantUsers.toJSON(),
						function(data) {
							success();
							fish.success(this.i18nData.ROLEMGR_GRANT_USER_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		degrantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			fish.confirm(this.i18nData.ROLEMGR_DEGRANT_USER_CONFIRM,function() {
					var grantUsers = this.grantItemsD.clone();
					grantUsers.remove(selrows);
					RoleMgrAction.grantUser2Role(roleId, grantUsers.toJSON(),
						function(data) {
							success();
							fish.success(this.i18nData.ROLEMGR_DEGRANT_USER_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$gridU, delta / 2);
			portal.utils.gridIncHeight(this.$gridD, delta - delta / 2);
		}
	});
});