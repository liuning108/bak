define([
    'modules/grant/models/RoleGrantItem',
    'modules/grant/collections/GrantItems',
   	'modules/grant/views/Grant2View',
   	'modules/usermgr/actions/UserMgrAction',
	'i18n!modules/usermgr/i18n/usermgr',
	'i18n!modules/rolemgr/i18n/rolemgr'
], function(RoleGrantItem, GrantItems, Grant2View, UserMgrAction,
	i18nUserMgr, i18nRoleMgr) {
	var RoleGrantItems = GrantItems.extend({
		model: RoleGrantItem
	});

	return Grant2View.extend({
		i18nData: fish.extend({
			header: true,
			footer: false,
			multisel: true,
			GRANT_DOWN_TITLE: i18nUserMgr.USERMGR_ROLE_OF_USER,
			GRANT_UP_TITLE: i18nUserMgr.USERMGR_ROLE,
			GRANT_HEADER_TITLE: i18nUserMgr.USERMGR_ROLE_MGR
		}, i18nUserMgr, i18nRoleMgr),

		initialize: function() {
			this.grantItemsD = new RoleGrantItems();
			this.grantItemsU = new RoleGrantItems();

			this.colModelD = [{
				name: 'roleId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'roleName',
				label: this.i18nData.ROLEMGR_ROLE_NAME,
				search: true
			}, {
				name: 'roleCode',
				label: this.i18nData.ROLEMGR_ROLE_CODE,
				search: true
			}];

			this.colModelU = [{
				name: 'roleId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'roleName',
				label: this.i18nData.ROLEMGR_ROLE_NAME,
				search: true
			}, {
				name: 'roleCode',
				label: this.i18nData.ROLEMGR_ROLE_CODE,
				search: true
			}];

			this.listenTo(this.model, 'change', this.reload);

			return Grant2View.prototype.initialize.call(this);
		},

		reload: function() {
			UserMgrAction.qryRoleList(function(data) {
				var userId = this.model.get('userId'),
					roleList = data;
				UserMgrAction.qryRoleListByUserId(userId, function(userRoles) {
					this.grantItemsD.reset(userRoles);
					this.grantItemsU.reset(fish.filter(roleList, function(role) {
						return fish.where(userRoles, {
							roleId: Number(role.roleId)
						}).length === 0;
					}));
				}.bind(this));
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
			var userId = this.model.get('userId');
			fish.confirm(this.i18nData.USERMGR_GRANT_ROLE_CONFIRM,function() {
					UserMgrAction.grantRole2User(userId, fish.pluck(selrows,"roleId"), function(data) {
						success();
						fish.success(this.i18nData.USERMGR_GRANT_ROLE_SUCCESS);
					}.bind(this));
				}.bind(this), $.noop);
		},

		degrantConfirm: function(selrows, success) {
			var userId = this.model.get('userId');
			fish.confirm(this.i18nData.USERMGR_DEGRANT_ROLE_CONFIRM,function() {
					var grantRoles = this.grantItemsD.clone().remove(selrows);
					//UserMgrAction.degrantRole2User(userId, grantRoles.toJSON(), function(data) {
					UserMgrAction.degrantRole2User(userId, fish.pluck(selrows,"roleId"), function(data) {
						success();
						fish.success(this.i18nData.USERMGR_DEGRANT_ROLE_SUCCESS);
					}.bind(this));
				}.bind(this), $.noop);
		}
	});
});
