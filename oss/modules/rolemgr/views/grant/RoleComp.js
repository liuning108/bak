define([
	'text!modules/common/templates/GridCellEdit.html',
	'modules/grant/models/CompGrantItem',
	'modules/grant/models/DirMenuItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'modules/rolemgr/actions/RoleMgrAction',
	'i18n!modules/rolemgr/i18n/rolemgr',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr',
	'i18n!modules/componentmgr/i18n/componentmgr'
], function(embedEditTpl, CompGrantItem, DirMenuItem, GrantItems, Grant3View,
	RoleMgrAction, rolemgrI18N, dirmenumgrI18N,
	compmgrI18N) {
	var CompGrantItems = GrantItems.extend({
		model: CompGrantItem
	}),
		DirMenuItems = GrantItems.extend({
		model: DirMenuItem
	});

	return Grant3View.extend({
		templateEmbedEdit: fish.compile(embedEditTpl),

		i18nData: fish.extend({
			header: false,
			PRIV_TYPE: 'C'
		}, rolemgrI18N, dirmenumgrI18N, compmgrI18N),

		initialize: function() {
			this.tabItemInfo = {
				name: 'byPortal',
				label: ' ',
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'partyName',
					label: this.i18nData.ROLEMGR_PORTAL_DIR_MENU_NAME,
					width: "100%"
				}],
				grantItems: new DirMenuItems(),
				loadGrid: function() {
					var roleId = this.model.get("roleId");
					RoleMgrAction.qryPortalListByRoleId(roleId, function(data) {
						var portalList = data;
						fish.forEach(portalList, function(portal) {
							portal.keyId = portal.portalId + "p";
							portal.children = [];
						});
						this.tabItemInfo.grantItems.reset(portalList);
						this.grantItemsU.reset([]);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					var $grid = this.getActiveTabGrid(),
						qryOpts = {
							portalId: rowdata.portalId
						};
					if (!rowdata.CHILDREN_LOADED) {
						if (rowdata.type === "-1") { // portal
							qryOpts.parentId = 0;
						} else {
							qryOpts.parentId = rowdata.partyId;
						}
						RoleMgrAction.qryDirMenuListByPartyId(qryOpts.parentId,qryOpts.portalId, function(data) {
							var dirMenuList = data || [],
								rowList = [];
							rowdata.CHILDREN_LOADED = true;
							fish.forEach(dirMenuList, function(dirMenu) {
								dirMenu.keyId = rowdata.type
									+ "_" + rowdata.partyId
									+ "_" + dirMenu.type
									+ "_" + dirMenu.partyId;
								if (dirMenu.type === '0') {
									dirMenu.children = [];
								} 
								// else if (dirMenu.type === '1') {
									// switch (dirMenu.isHold) {
									// case 'Y':
									// 	dirMenu.isHoldStr = this.i18nData.COMMON_YES;
									// 	break;
									// case 'N':
									// 	dirMenu.isHoldStr = this.i18nData.COMMON_NO;
									// 	break;
									// default:
									// 	break;
									// }
								// }
								rowList[rowList.length] = dirMenu;
							}, this);
							$grid.grid("addChildNodes", rowList, rowdata);
						}.bind(this));
					}
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid);
					if (rowdata.type && rowdata.type === "1") {
						RoleMgrAction.qryCompListByMenuId(this.model.get("roleId"), rowdata.partyId, function(data) {
							var compList = data || [];
                            var that = this;
							fish.forEach(compList, function(comp) {
								comp.menuName = rowdata.partyName;
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(comp.privId)}))) {
                                    comp._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(compList);
						}.bind(this));
					} else {
						this.grantItemsU.reset([]);
					}
				}
			};

			this.grantItemsU = new CompGrantItems();
			this.grantItemsD = new CompGrantItems();

			this.colModelU = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: this.i18nData.COMPONENT_NAME,
				sortable: false,
				width: "100%"
		
			}];

			this.colModelD = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'menuName',
				label: this.i18nData.DIRMENUMGR_MENU_NAME,
				sortable: false,
				width: "45%"
			}, {
				name: 'privName',
				label: this.i18nData.COMPONENT_NAME,
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
			RoleMgrAction.qryCompListByRoleId(this.model.get("roleId"), function(data) {
				var compList = data || [];
				this.grantItemsD.reset(compList);
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
            RoleMgrAction.grantPrivToRole(roleId, selrows,
                function() {
                    success(new CompGrantItems(selrows).toJSON());
                    fish.success(this.i18nData.ROLEMGR_ADD_COMP_PRIV_SUCCESS);
                }.bind(this)
            );
		},

		degrantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			fish.confirm(this.i18nData.ROLEMGR_RM_COMP_PRIV_CONFIRM,function() {
					RoleMgrAction.degrantPrivFromRole(roleId, fish.pluck(selrows, "privId"),
						function(data) {
							success();
							fish.success(this.i18nData.ROLEMGR_RM_COMP_PRIV_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		resize: function(delta,leftHeight) {
			portal.utils.gridIncHeight(this.$gridU, delta / 2);
			portal.utils.gridIncHeight(this.$gridD, delta - delta / 2);
			this.tabresize();
		}
	});
});
