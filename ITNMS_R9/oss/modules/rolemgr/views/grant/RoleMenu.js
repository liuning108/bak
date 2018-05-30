define([
	'text!modules/common/templates/GridCellEdit.html',
	'modules/grant/models/MenuGrantItem',
	'modules/grant/models/DirPartyItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'modules/rolemgr/actions/RoleMgrAction',
	'i18n!modules/rolemgr/i18n/rolemgr',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr'
], function(embedEditTpl, MenuGrantItem, DirPartyItem, GrantItems, Grant3View, RoleMgrAction,
	 i18nRoleMgr, i18nDirMenuMgr) {
	var MenuGrantItems = GrantItems.extend({
		model: MenuGrantItem
	}),
		DirPartyItems = GrantItems.extend({
		model: DirPartyItem
	});

	return Grant3View.extend({
		templateEmbedEdit: fish.compile(embedEditTpl),

		i18nData: fish.extend({
			header: false,
			PRIV_TYPE: 'M'
		}, i18nRoleMgr, i18nDirMenuMgr),

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
					name: 'partyName',
					label: this.i18nData.ROLEMGR_PORTAL_DIR_NAME
				}],
				grantItems: new DirPartyItems(),
				loadGrid: function() {
					var roleId = this.model.get("roleId");
					RoleMgrAction.qryPortalListByRoleId(roleId, function(data) {
						var portalList = data;
						fish.forEach(portalList, function(portal) {
							portal.partyId = portal.keyId;
							portal.children = [];
						});
						this.tabItemInfo[0].grantItems.reset(portalList);
						this.grantItemsU.reset([]);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					var $grid = this.getActiveTabGrid(),
						qryOpts = {
						portalId: rowdata.portalId
						};
					if (!rowdata.childrenLoaded) {
						if (rowdata.type == "-1") { // portal
							qryOpts.parentId = 0;
						} else {
							qryOpts.parentId = rowdata.partyId;
						}
						RoleMgrAction.qryDirListByPartyId(qryOpts.parentId,rowdata.portalId,
							function(data) {
								var dirList = data || [],
									rowList = [];
								rowdata.childrenLoaded = true;
								fish.forEach(dirList, function(dir) {
									dir.keyId = rowdata.type
										+ "_" + rowdata.partyId
										+ "_" + dir.type
										+ "_" + dir.partyId
									dir.children = [];
									rowList[rowList.length] = dir;
								}.bind(this));
								$grid.grid("addChildNodes", rowList, rowdata);
							}.bind(this)
						);
					}
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
							portalId: rowdata.portalId,
							roleId: this.model.get("roleId")
						};
					if (rowdata.parent !== null) {
						qryOpts.parentId = rowdata.partyId;
					} else {
						qryOpts.parentId = 0;
					}
					RoleMgrAction.qryMenuListByPartyId(qryOpts.parentId,rowdata.portalId,this.model.get("roleId"),
						function(menuList) {
                            var that = this;
							fish.forEach(menuList, function(menu) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(menu.privId)}))) {
                                    menu._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(menuList);
						}.bind(this)
					);
				}
			}, {
				name: 'byDir',
				label: this.i18nData.ROLEMGR_BY_DIR,
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'dirName',
					label: this.i18nData.DIRMENUMGR_DIR_MENU_NAME
				}],
				grantItems: new DirPartyItems(),
				loadGrid: function() {
					var rootNode = {
						keyId: "-1",
						partyId: "-1",
						type: "0",
						children: [],
						dirId: "-1",
						dirName: this.i18nData.DIRMENUMGR_DIR_MENU_ROOT
					};
					this.tabItemInfo[1].grantItems.reset([rootNode]);
				},
				rowExpandCallback: function(e, rowdata) {
					var dirId = rowdata.dirId === "-1" ? 0 : rowdata.dirId,
						$grid = this.getActiveTabGrid();
					if (!rowdata.childrenLoaded) {
						RoleMgrAction.qryDirListByDirId(dirId,
							function(data) {
								var dirList = data || [],
									rowList = [];
								rowdata.childrenLoaded = true;
								fish.forEach(dirList, function(dir) {
									dir.keyId = rowdata.dirId + "_" + dir.dirId;
									dir.children = [];
									rowList[rowList.length] = dir;
								});
								$grid.grid("addChildNodes", rowList, rowdata);
							}.bind(this)
						);
					}
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
							roleId: this.model.get("roleId"),
							dirId: rowdata.dirId
						};
					RoleMgrAction.qryMenuListByDirId(qryOpts,
						function(menuList) {
                            var that = this;
							fish.forEach(menuList, function(menu) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(menu.privId)}))) {
                                    menu._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(menuList);
						}.bind(this)
					);
				}
			}];

			this.grantItemsU = new MenuGrantItems();
			this.grantItemsD = new MenuGrantItems();

			this.colModelU = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: this.i18nData.DIRMENUMGR_MENU_NAME,
				sortable: false,
				width: "40%"
			}, {
				name: 'url',
				label: this.i18nData.DIRMENUMGR_MENU_URL,
				width: "60%"
			}];

			this.colModelD = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: this.i18nData.DIRMENUMGR_MENU_NAME,
				sortable: false,
				width: "45%"
			}, {
				name: 'url',
				label: this.i18nData.DIRMENUMGR_MENU_URL,
				width: "55%"
			
			// }, {
			// 	name: 'autoOpen',
			// 	label: this.i18nData.DIRMENUMGR_AUTO_OPEN,
			// 	width: "15%"
			
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
			RoleMgrAction.qryMenuListByRoleId(this.model.get("roleId"), function(data) {
				var menuList = data;
				this.grantItemsD.reset(menuList);
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
            RoleMgrAction.grantPrivToRole(roleId, selrows,
                function() {
                    success(selrows);
                    fish.success(this.i18nData.ROLEMGR_ADD_MENU_PRIV_SUCCESS);
                }.bind(this)
            );
		},

		degrantConfirm: function(selrows, success) {
			var roleId = this.model.get("roleId");
			fish.confirm(this.i18nData.ROLEMGR_RM_MENU_PRIV_CONFIRM,function() {
					RoleMgrAction.degrantPrivFromRole(roleId, fish.pluck(selrows, "privId"),
						function() {
							success();
							fish.success(this.i18nData.ROLEMGR_RM_MENU_PRIV_SUCCESS);
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
