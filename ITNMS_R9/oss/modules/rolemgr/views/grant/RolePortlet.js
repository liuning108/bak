define([
	'modules/grant/models/PortletGrantItem',
	'modules/grant/models/PortletNavItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'modules/rolemgr/actions/RoleMgrAction',
	'text!modules/common/templates/GridCellEdit.html',
	'i18n!modules/rolemgr/i18n/rolemgr'
], function(PortletGrantItem, PortletNavItem, GrantItems, Grant3View, RoleMgrAction,
	embedEditTpl, i18nRoleMgr) {
	var PortletGrantItems = GrantItems.extend({
		model: PortletGrantItem
	}),
		PortletNavItems = GrantItems.extend({
		model: PortletNavItem
	});

	return Grant3View.extend({
		templateEmbedEdit: fish.compile(embedEditTpl),

		i18nData: fish.extend({
			header: false,
			PRIV_TYPE: 'M'
		}, i18nRoleMgr),

		initialize: function() {
			this.tabItemInfo = [{
				name: 'byPortal',
				label: this.i18nData.ROLEMGR_BY_PORTAL,
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'portalName',
					label: this.i18nData.ROLEMGR_PORTAL_DIR_NAME
				}],
				/*treeIcons: {
					plus: 'glyphicon glyphicon-list',
                    minus: 'glyphicon glyphicon-list',
                    leaf: 'glyphicon glyphicon-list'
				},*/
				grantItems: new PortletNavItems(),
				loadGrid: function() {
				    var roleId = this.model.get("roleId");
					RoleMgrAction.qryPortalListByRoleId(roleId, function(status) {
						var portalList = status;
						fish.forEach(portalList, function(portal) {
							portal.keyId = portal.portalId + "p";
							portal.children = [];
						});
						this.tabItemInfo[0].grantItems.reset(portalList);
						this.grantItemsU.reset([]);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					return;
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
						portalId: rowdata.portalId,
						roleId: this.model.get("roleId")
					};
					RoleMgrAction.qryPortletListByPortalIdLeftJoinRoleOwnedInfo(qryOpts,
						function(status) {
							var portletList = status || [];
                            var that = this;
							fish.forEach(portletList, function(portlet) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(portlet.privId)}))) {
                                    portlet._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(portletList);
						}.bind(this)
					);
				}
			}, {
				name: 'byType',
				label: this.i18nData.ROLEMGR_BY_TYPE,
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'typeName',
					label: this.i18nData.ROLEMGR_TYPE_NAME
				}],
				/*treeIcons:{plus: 'glyphicon glyphicon-list',
                    minus: 'glyphicon glyphicon-list',
                    leaf: 'glyphicon glyphicon-list'},*/
				grantItems: new PortletNavItems(),
				loadGrid: function() {
					RoleMgrAction.qryAllPortletType(function(status) {
						var typeList = status || [];
						fish.forEach(typeList, function(type) {
							type.keyId = type.typeId + "p";
							type.children = [];
						});
						this.tabItemInfo[1].grantItems.reset(typeList);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					return;
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
						roleId: this.model.get("roleId"),
						typeId: rowdata.typeId
					};
					RoleMgrAction.qryPortletListByTypeIdLeftJoinRoleOwnedInfo(qryOpts,
						function(status) {
							var portletList = status || [];
                            var that = this;
							fish.forEach(portletList, function(portlet) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(portlet.privId)}))) {
                                    portlet._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(portletList);
						}.bind(this)
					);
				}
			}];

			this.grantItemsU = new PortletGrantItems();
			this.grantItemsD = new PortletGrantItems();

			this.colModelU = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.ROLEMGR_PORTLET_NAME,
				width: "35%"
			}, {
				name: 'url',
				label: this.i18nData.ROLEMGR_URL,
				width: "65%"
			}];

			this.colModelD = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.ROLEMGR_PORTLET_NAME,
				width: "45%",
			}, {
				name: 'url',
				label: this.i18nData.ROLEMGR_URL,
				width: "55%"		
			// }, {
			// 	name: 'operate',
			// 	label: '',
			// 	formatter: 'actions',
			// 	width: "20%",
			// 	formatoptions: {
			// 		delbutton: false,
			// 		editbutton: true
			// 	}
			}];

			this.listenTo(this.model, 'change', this.reload);

			return Grant3View.prototype.initialize.call(this);
		},

		reload: function() {
			Grant3View.prototype.reload.call(this);
		    RoleMgrAction.qryRoleOwnedPortletList(this.model.get("roleId"), function(status) {
		    	var portletList = status || [];
				this.grantItemsD.reset(portletList);
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
		    var roleId = this.model.get('roleId');
            RoleMgrAction.grantPrivToRole(roleId, selrows,
                function(status) {
                    var privList = selrows || [];
                    success(new PortletGrantItems(privList).toJSON());
                    fish.success(this.i18nData.ROLEMGR_ADD_PORTLET_PRIV_SUCCESS);
                }.bind(this)
            );
		},

		degrantConfirm: function(selrows, success) {
		    var roleId = this.model.get('roleId');
			fish.confirm(this.i18nData.ROLEMGR_RM_PORTLET_PRIV_CONFIRM,function() {
					RoleMgrAction.degrantPrivFromRole(roleId, fish.pluck(selrows, "privId"),
						function(data) {
							success();
							fish.success(this.i18nData.ROLEMGR_RM_PORTLET_PRIV_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$gridU, delta / 2);
			portal.utils.gridIncHeight(this.$gridD, delta - delta / 2);
			this.tabresize();
		}
	});
});
