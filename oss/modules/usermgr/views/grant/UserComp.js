define([
	'text!modules/common/templates/GridCellEdit.html',
	'modules/grant/models/CompGrantItem',
	'modules/grant/models/DirMenuItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'modules/usermgr/actions/UserMgrAction',
	'i18n!modules/usermgr/i18n/usermgr',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr',
	'i18n!modules/componentmgr/i18n/componentmgr'
], function(embedEditTpl, CompGrantItem, DirMenuItem, GrantItems, Grant3View,
	UserMgrAction, usermgrI18N, dirmenumgrI18N, compmgrI18N) {
	var CompGrantItems = GrantItems.extend({
		model: CompGrantItem
	}),
		DirMenuItems = GrantItems.extend({
		model: DirMenuItem
	});

	return Grant3View.extend({
		templateEmbedEdit: fish.compile(embedEditTpl),

		i18nData: fish.extend({
			header: true,
			PRIV_TYPE: 'C',
			GRANT_HEADER_TITLE: usermgrI18N.USERMGR_COMP_PRIV_MGR
		}, usermgrI18N, dirmenumgrI18N, compmgrI18N),

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
					label: this.i18nData.USERMGR_PORTAL_DIR_MENU_NAME,
					width: "100%"			
				}],
				grantItems: new DirMenuItems(),
				loadGrid: function() {
				    var userId = this.model.get('userId');
				    UserMgrAction.qryPortalListByUserId(userId, function(data) {
						var portalList = data;
						fish.forEach(portalList, function(portal) {
							portal.keyId = portal.portalId + "p";
							portal.children = [];
						});
						this.tabItemInfo.grantItems.reset(portalList);
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
						UserMgrAction.qryDirMenuListByPartyId(qryOpts.parentId,qryOpts.portalId, function(data) {
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
								// } else if (dirMenu.type === '1') {
								// 	switch (dirMenu.isHold) {
								// 	case 'Y':
								// 		dirMenu.isHoldStr = this.i18nData.COMMON_YES;
								// 		break;
								// 	case 'N':
								// 		dirMenu.isHoldStr = this.i18nData.COMMON_NO;
								// 		break;
								// 	default:
								// 		break;
								// 	}
								}
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
						UserMgrAction.qryCompListByMenuId(this.model.get("userId"), rowdata.partyId, function(data) {
							var compList = data || [];
                            var that = this;
							fish.forEach(compList, function(comp) {
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
		    UserMgrAction.qryCompListByUserId(this.model.get('userId'), function(data) {
				var compList = data || [];
				this.grantItemsD.reset(compList);
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
			var userId = this.model.get('userId');
			var $grid = this.getActiveTabGrid(),
				rowdata = $grid.grid("getSelection");			
			selrows = fish.map(selrows, function(row){ 
				row.menuName = rowdata.partyName;
				return row; 
			});
            UserMgrAction.grantPrivToUser(userId, selrows, function(data) {
                success(new CompGrantItems(selrows).toJSON());
                fish.success(this.i18nData.USERMGR_ADD_COMP_PRIV_SUCCESS);
            }.bind(this));
		},

		degrantConfirm: function(selrows, success) {
			var that = this;
		    var userId = that.model.get('userId');
			fish.confirm(that.i18nData.USERMGR_RM_COMP_PRIV_CONFIRM,function() {
                    UserMgrAction.degrantPrivFromUser(userId, selrows, function(data) {
						success();
						fish.success(that.i18nData.USERMGR_RM_COMP_PRIV_SUCCESS);
					});
				}, $.noop);
		}
	});
});
