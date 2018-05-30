define(["text!modules/portalmgr/templates/PortalMenuEditTemplate.html",
	"modules/portalmgr/actions/PortalAction",
	"i18n!modules/portalmgr/i18n/portalmgr",
	"text!modules/portalmgr/templates/GridCellDeleteTemplate.html",
	'modules/dirmenumgr/actions/DirMenuAction',
	"i18n!modules/dirmenumgr/i18n/dirmenumgr"
], function(portalMenuEditTemplate, portalAction, i18Data, gridCellDeleteTemplate, dirMenuAction, dirmenumgri18n) {
	var PortalMenuEditView = portal.BaseView.extend({
		gridCellDelHtml: "",
		//className: "container_right panel panel-default",
		template: fish.compile(portalMenuEditTemplate),
		gridCellDelTemplate: fish.compile(gridCellDeleteTemplate),
		dirMenuTree: null,
		portal: null,
		dirmenumgrResource: null, //菜单选择的相关资源文件
		events: {
			"click #btnDirMenuSelector": 'dirMenuSelectorClick',
			"click #btnPortalMenuSelector": "portalMenuSelector"
		},

		initialize: function() {
			var dirmenumgrResource = fish.extend({}, dirmenumgri18n);
			dirmenumgrResource.DIRMENUMGR_DIR_NAME = i18Data.PORTAL_NAME;
			this.dirmenumgrResource = dirmenumgrResource;
		},

		render: function() {
			this.$el.html(this.template(i18Data));
			var resource1 = fish.extend({}, i18Data, {
				COMMON_DELETE: i18Data.COMMON_REMOVE
			});
			this.gridCellDelHtml = this.gridCellDelTemplate(resource1);
			
			this.on("portalChange", this.portalChange, this);
			return this;
		},

		afterRender: function() {
			var _this = this;
			this.dirMenuTree = this.$("#portalDirMenuTree").grid({
				colModel: [{
					name: 'keyId',
					key: true,
					hidden: true
				}, {
					name: 'partyName',
					label: i18Data.PORTAL_PARTY_NAME,
					width: 300,
					search: true
				}, {
					name: 'url',
					label: i18Data.COMMON_URL,
					width: 400,
					search: true				
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					align: 'center',
					width: 200,
					formatter: function(cellValue, opts, rowData) {
						if (opts.rowId !== 0) {
							return _this.gridCellDelHtml;
						}
						return "";
					}
				}],
				treeGrid: true,
				/*treeIcons: {
					plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: "partyName",
				searchbar: true,
				pagebar: true,
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent;
					var rowData = this.dirMenuTree.grid("getRowData", rowid);
					var dirMenuSelectorDisabled = true;
					var menuSelectorDisabled = true;
					if (rowData.type == 0) { //表示的是目录
						dirMenuSelectorDisabled = false;
					}
					if (rowData.partyId == 0) { //表示的是根目录
						menuSelectorDisabled = false;
					}
					this.$("#btnDirMenuSelector").attr("disabled", dirMenuSelectorDisabled);
					this.$("#btnPortalMenuSelector").attr("disabled", menuSelectorDisabled);

					if (e && e.target) {
						var action = $(e.target).attr("action");
						if (action) {
							if (action == "delete") { //如果是删除
								this.deleteRow(rowData);
							} else if (action == "up") {
								this.upDisplayOrder(rowData);
							} else if (action == "down") {
								this.downDisplayOrder(rowData);
							}
						}
					}
				}.bind(this),
				onRowExpand: function(e, rowData) {
					this.dirMenuTree.grid("setSelection", rowData);
				}.bind(this)
			});
			this.dirMenuTree.grid("navButtonAdd",[{
                caption: i18Data.PORTAL_DIR_MENU_SELECTOR,
                id: "btnDirMenuSelector"
            },{
                caption: i18Data.PORTAL_PORTAL_MENU_SELECTOR,
                id: "btnPortalMenuSelector"
            }]);
		},

		portalChange: function(portall,rowData) {
			var _this = this;
			this.portal = portall;
			if (portall) {
				portalAction.qryDirMenuListByPortalId(portall.portalId, function(data) {
					var dirMenus = [];
					data = _this.generateKeys(data);
					if (data) {
						dirMenus = _this.addRootToRecord(data);
						dirMenus = portal.utils.getTree(dirMenus, "partyId", "parentId", null);
					} else {
						dirMenus.length = 0;
						dirMenus = _this.addRootToRecord(dirMenus);
					}

					_this.dirMenuTree.grid("reloadData", dirMenus);
					if (dirMenus.length > 0 && rowData == undefined) {
						_this.dirMenuTree.grid("setSelection", dirMenus[0]);
					}
					else if(rowData != undefined){
						_this.dirMenuTree.grid("setSelection", rowData);
					}
				});
			}
		},
		addRootToRecord: function(dirMenuArray) {
			dirMenuArray = this.setParentToRootWhenNoParent(dirMenuArray)
			var rootItem = {
				partyId: "0",
				partyName: i18Data.PORTAL_MENU_ROOT,
				seq: "0",
				state: "A",
				type: "0",
				keyId: "0",
				children: [],
				expanded: true
			};
			dirMenuArray.unshift(rootItem); //加到最前面
			return dirMenuArray;
		},
		setParentToRootWhenNoParent: function(dirMenuArray) {
			for (var key in dirMenuArray) {
				var item = dirMenuArray[key];
				if (!item.parentId) {
					item.parentId = "0";
				}
			}
			return dirMenuArray;
		},
		dirMenuSelectorClick: function() {
			var that = this;
			if (!that.$("#btnDirMenuSelector").attr("disabled")) { //如果有效
				var selectedNode = that.dirMenuTree.grid('getSelection');
				dirMenuAction.qryDirMenuList(selectedNode.partyId, function(data) {
					var dirList = null;
					var menuList = null;
					if (data && data.dirList && data.dirList.length > 0) {
						dirList = data.dirList;
					} else {
						dirList = [];
					}
					if (data && data.menuList && data.menuList.length > 0) {
						menuList = data.menuList;
					} else {
						menuList = [];
					}
					var dirMenuList = [];
					for (var key in dirList) {
						var item = dirList[key];
						item.partyId = item.dirId;
						item.partyName = item.dirName;
						item.type = 0;
						dirMenuList[dirMenuList.length] = item;
					}
					for (var key in menuList) {
						var item = menuList[key];
						item.partyName = item.privName;
						item.partyId = item.menuId;
						item.type = 1;
						
						dirMenuList[dirMenuList.length] = item;
					}
					var hasOwnedNodes = that.dirMenuTree.grid('getNodeChildren', selectedNode);

					dirMenuList = $.grep(dirMenuList, function(n, i) {
						for (var item in hasOwnedNodes) {
							if (hasOwnedNodes[item].type == n.type && (hasOwnedNodes[item].partyId == n.partyId || hasOwnedNodes[item].dirId == n.partyId || hasOwnedNodes[item].menuId == n.partyId || hasOwnedNodes[item].privId == n.partyId)) { //是菜单的时候
								return false;
							}
						}
						return true;
					});

					var options = {
						i18nData: i18Data,
						dirmenus: dirMenuList,
						parentName: selectedNode.partyName
					};
					fish.popupView({
						url: 'modules/portalmgr/views/PortalDirMenuSelector',
						viewOption: options,
						close: function(selectedDirMenus) {
							var cloneMenus = new Array();
							var parentId = selectedNode.partyId;
							for (var key in selectedDirMenus) {
								var item = selectedDirMenus[key];
								var menu = {};
								// menu.appId = item.appId;		
								menu.partyId = item.partyId;
								menu.partyName = item.partyName;
								// menu.spId = item.spId;									
								menu.state = item.state;
								menu.type = item.type;
								menu.url = item.url;
								if(parentId!='0'){
									menu.parentId = parentId;
								} 
								if(item.addCascade != undefined){
									menu.addCascade = item.addCascade;
								}
								cloneMenus.push(menu);
							}
							portalAction.addDirMenuToPortal(that.portal.portalId, cloneMenus, function(data) {
								var dirMenus = data;
								dirMenus = that.generateKeys(dirMenus);
								dirMenus = that.setParentToRootWhenNoParent(dirMenus);
								var parentDir = that.dirMenuTree.grid('getSelection');
								dirMenus = portal.utils.getTree(dirMenus, "partyId", "parentId", parentDir.partyId);
								that.dirMenuTree
									.grid("addChildNodes", dirMenus, parentDir)
									.grid("expandNode", parentDir);
								that.dirMenuTree.grid("setSelection", dirMenus[0]);
								fish.success(i18Data.PORTAL_ADD_MENU_AND_DIR_SUCCESS);
							});
						}
					});
				});
			}
		},
		portalMenuSelector: function() {
			var that = this;
			if (!that.$("#btnPortalMenuSelector").attr("disabled")) { //如果是有效的，则去加载
				dirMenuAction.qryAllMenus(function(data) {
					var allMenus = data;
					var selectedNode = that.dirMenuTree.grid('getSelection');
					var children = that.dirMenuTree.grid("getNodeChildren", selectedNode);

					var arr = $.grep(allMenus, function(n, i) {
						for (var item in children) {
							if (children[item].type == 1 && children[item].partyId == n.privId) { //是菜单的时候
								return false;
							}
						}
						return true;
					});

					var options = {
						i18nData: that.dirmenumgrResource,
						menus: arr,
						dirName: that.portal.portalName
					};
					fish.popupView({
						url: "modules/dirmenumgr/views/MenuSelector",
						viewOption: options,
						close: function(selectedMenus) {
							if (selectedMenus) {
								var cloneMenus = new Array();
								for (var key in selectedMenus) {
									var item = selectedMenus[key];
									var menu = {};
									// menu.appId = item.appId;								
									
									menu.partyId = item.privId;
									menu.partyName = item.privName;
									// menu.spId = item.spId;									
									menu.state = item.state;
									menu.type = 1;
									menu.url = item.url;
									cloneMenus.push(menu);
								}
								portalAction.addDirMenuToPortal(that.portal.portalId, cloneMenus, function(data) {
									var menus = data;
									menus = that.generateKeys(menus);
									menus = that.setParentToRootWhenNoParent(menus);
									var parentDir = that.dirMenuTree.grid('getSelection');
									that.dirMenuTree.grid("addChildNodes", menus, parentDir).grid("expandNode", parentDir);
									fish.success(i18Data.PORTAL_ADD_MENU_SUCCESS);
								});
							}
						}
					});
				});
			}
		},

		generateKeys: function(array) {
			for (var item in array) {
				var parentId = array[item].parentId;
				if (!parentId) {
					parentId = 0;
				}
				array[item].keyId = parentId + "_" + array[item].partyId;
				
			}
			return array;
		},

		deleteRow: function(rowData) { //删除菜单目录，以及目录目录的关系
			if (rowData.partyId == 0) {
				fish.warn(i18Data.PORTAL_NOT_DELETE_ROOT_DIR);
				return;
			};
			var children = this.dirMenuTree.grid("getNodeChildren", rowData);
			var hasChildren = false;
			if (!children || children.length <= 0) { //表示删除的是目录
				hasChildren = false;
			} else {
				hasChildren = true;
			}
			var tooltip = hasChildren ? i18Data.PORTAL_SURE_TO_DELETE_DIR_AND_SUB : i18Data.PORTAL_SURE_TO_DELETE_MENU_OR_DIR;
			fish.confirm(tooltip,function() {
					portalAction.delDirMenuFromPortal(this.portal.portalId, rowData.partyId, rowData.seq, 
						function(data) {
							var rowId = this.dirMenuTree.grid("getRowid", rowData);
							var parentData = this.dirMenuTree.grid("getNodeParent", rowData); //获取父节点
							this.dirMenuTree.grid("setPrevSelection", rowData);
							this.dirMenuTree.grid("delTreeNode", rowData);
							if (rowData.partyId == 0) { //表示删除的是根目录
								var dirMenus = [];
								dirMenus.length = 0;
								dirMenus = this.addRootToRecord(dirMenus);
								this.dirMenuTree.grid("reloadData", dirMenus)
									.grid("setSelection", dirMenus[0]);
							}
							fish.success(i18Data.PORTAL_DEL_MENU_OR_DIR_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		upDisplayOrder: function(rowData) {
			var selectedItem = $("#portalList").grid("getSelection");
			var that = this;
			if (rowData.partyId == 0) {
				fish.warn(i18Data.PORTAL_MODIFY_FOOT_ORDER_WARN);
				return;
			}
			var brothers = this.getBrothers(rowData); //因为一定包含自身，所以大小一定大于0
			if (brothers[0].keyId == rowData.keyId) { //说明当前行已经在同级的最外层
				fish.info(i18Data.PORTAL_MODIFY_ORDER_IS_HIGHEST);
			} else {
				var index = 0;
				for (index = 0; index < brothers.length; index++) {
					if (brothers[index].keyId == rowData.keyId) {
						break;
					}
				}
				var brotherRow = brothers[index - 1]; //index肯定大于0，因为index等于0的情况已经在上面排除了

				var portalDirMenuList = [];
				portalDirMenuList[0] = {
					partyId: rowData.partyId,
					seq: brotherRow.seq,
					oldSeq: rowData.seq
				};
				portalDirMenuList[1] = {
					partyId: brotherRow.partyId,
					seq: rowData.seq,
					oldSeq: brotherRow.seq
				};
				portalAction.modPortalMenuSeq(this.portal.portalId, portalDirMenuList, function(status) {
					this.dirMenuTree.grid("setRowData", fish.extend(rowData, {seq: portalDirMenuList[0].seq}));
					this.dirMenuTree.grid("setRowData", fish.extend(brotherRow, {seq: portalDirMenuList[1].seq}));
					var changeAll = this.dirMenuTree.grid("getFullTreeNode", rowData);
				    this.dirMenuTree.grid("delTreeNode", rowData);
				    this.dirMenuTree.grid("addTreeNodes", changeAll, brotherRow.parent, "before", brotherRow.keyId);
				    this.dirMenuTree.grid("setSelection", rowData);
				}.bind(this));
			}
		},

		downDisplayOrder: function(rowData) {
			var selectedItem = $("#portalList").grid("getSelection");
			var that = this;
			if (rowData.partyId == 0) {
				fish.warn(i18Data.PORTAL_MODIFY_FOOT_ORDER_WARN);
				return;
			}
			var brothers = this.getBrothers(rowData);

			if (brothers[brothers.length - 1].keyId == rowData.keyId) { //说明当前行已经在同级的最外层
				fish.info(i18Data.PORTAL_MODIFY_ORDER_IS_LOWEST);
			} else {
				var index = 0;
				for (index = 0; index < brothers.length - 1; index++) {
					if (brothers[index].keyId == rowData.keyId) {
						break;
					}
				}
				var brotherRow = brothers[index + 1]; //index肯定大于0，因为index等于0的情况已经在上面排除了

				var portalDirMenuList = [];
				portalDirMenuList[0] = {
					partyId: rowData.partyId,
					seq: brotherRow.seq,
					oldSeq: rowData.seq
				};
				portalDirMenuList[1] = {
					partyId: brotherRow.partyId,
					seq: rowData.seq,
					oldSeq: brotherRow.seq
				};
				portalAction.modPortalMenuSeq(this.portal.portalId, portalDirMenuList, function(data) {
					this.dirMenuTree.grid("setRowData", fish.extend(rowData, {seq: portalDirMenuList[0].seq}));
					this.dirMenuTree.grid("setRowData", fish.extend(brotherRow, {seq: portalDirMenuList[1].seq}));
					var changeAll = this.dirMenuTree.grid("getFullTreeNode", rowData);
				    this.dirMenuTree.grid("delTreeNode", rowData);
				    this.dirMenuTree.grid("addTreeNodes", changeAll, brotherRow.parent, "after", brotherRow.keyId);
				    this.dirMenuTree.grid("setSelection", rowData);
				}.bind(this));
			}
		},
		getBrothers: function(rowData) { //获取当前节点的所有兄弟节点(根节点除外)
			var parent = this.dirMenuTree.grid("getNodeParent", rowData); //获取父亲节点
			return this.dirMenuTree.grid("getNodeChildren", parent);
		}
	});
	return PortalMenuEditView;
});
