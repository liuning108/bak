define([
	'modules/grant/models/PortalGrantItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant2View',
	'modules/rolemgr/actions/RoleMgrAction',
	'i18n!modules/rolemgr/i18n/rolemgr',
	'i18n!modules/portalmgr/i18n/portalmgr'
], function(PortalGrantItem, GrantItems, Grant2View, RoleMgrAction,
	 i18nRoleMgr, i18nPortalMgr) {
	var PortalGrantItems = GrantItems.extend({
		model: PortalGrantItem
	});

	return Grant2View.extend({
		i18nData: fish.extend({
			header: false,
			multisel: true,
			GRANT_DOWN_TITLE: i18nRoleMgr.ROLEMGR_PORTAL_OF_ROLE,
			GRANT_UP_TITLE: i18nRoleMgr.ROLEMGR_PORTAL
		}, i18nRoleMgr, i18nPortalMgr),

		initialize: function() {
			this.grantItemsD = new PortalGrantItems();
			this.grantItemsU = new PortalGrantItems();

			this.colModelD = [{
				name: 'portalId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portalName',
				label: this.i18nData.PORTAL_NAME,
				search: true
			}, {
				name: 'url',
				label: this.i18nData.PORTAL_URL,
				search: true
			}];

			this.colModelU = [{
				name: 'portalId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portalName',
				label: this.i18nData.PORTAL_NAME,
				search: true
			}, {
				name: 'url',
				label: this.i18nData.PORTAL_URL,
				search: true
			}];

			this.listenTo(this.model, 'change', this.reload);			
			Grant2View.prototype.initialize.call(this);
			this.changeGrantDownTitle();
		},

		reload: function() {
			
			var that = this;
			this.changeGrantDownTitle();
			
//			var defer1 = RoleMgrAction.qryPortalList;
//			
//			var defer2 = function(){
//				return RoleMgrAction.qryPortalListByRoleId(that.model.get("roleId"));
//			}
//			
//			$.parallel([defer1,defer2]).then(function(portalList,rolePortals){
//				fish.forEach(rolePortals, function(portal) {
//					portal._rowd_ = false;
//				});
//				this.grantItemsD.reset(rolePortals);
//				this.grantItemsU.reset(fish.filter(portalList, function(portal) {
//					return fish.where(rolePortals, {
//						portalId: Number(portal.portalId)
//					}).length === 0;
//				}));
//			});
//			
			RoleMgrAction.qryPortalList(function(data) {
				var portalList = data,
					roleId = this.model.get("roleId");
				RoleMgrAction.qryPortalListByRoleId(roleId, function(data) {
					var rolePortals = data;
					fish.forEach(rolePortals, function(portal) {
						portal._rowd_ = false;
					});
					this.grantItemsD.reset(rolePortals);
					this.grantItemsU.reset(fish.filter(portalList, function(portal) {
						return fish.where(rolePortals, {
							portalId: Number(portal.portalId)
						}).length === 0;
					}));
				}.bind(this));
			}.bind(this));
		},

		changeGrantDownTitle: function(){
			this.RESOURCE_ROLEMGR_PORTAL_OF_ROLE = fish.compile(this.i18nData.ROLEMGR_PORTAL_OF_ROLE);
										
			var grantDownTitle = this.RESOURCE_ROLEMGR_PORTAL_OF_ROLE({
				roleName: this.model.get('portalName')
			});
			this.$(".grant-grid-d .ui-jqgrid-title").html(grantDownTitle);
			this.$(".grant-grid-d .ui-jqgrid-title").prop("title",grantDownTitle);
		},

		grantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			
			fish.confirm(this.i18nData.ROLEMGR_GRANT_PORTAL_CONFIRM,function() {
					var grantPortals = this.grantItemsD.clone().add(selrows);
					RoleMgrAction.grantPortal2Role(roleId, grantPortals.toJSON(),
						function() {
							success();
							fish.success(this.i18nData.ROLEMGR_GRANT_PORTAL_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		degrantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			fish.confirm(this.i18nData.ROLEMGR_DEGRANT_PORTAL_CONFIRM,function() {
					var grantPortals = this.grantItemsD.clone().remove(selrows);
					RoleMgrAction.grantPortal2Role(roleId, grantPortals.toJSON(),
						function() {
							success();
							fish.success(this.i18nData.ROLEMGR_DEGRANT_PORTAL_SUCCESS);
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
