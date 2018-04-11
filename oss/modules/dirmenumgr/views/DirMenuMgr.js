define([
	'text!modules/dirmenumgr/templates/DirMenuMgr.html',
	'modules/dirmenumgr/actions/DirMenuAction',
	'modules/dirmenumgr/collections/DirOrMenuItems',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr',
	'frm/portal/fonticonpicker/fonticonpicker',
	'css!frm/portal/fonticonpicker/fonticonpicker.css'
], function(dirMenuMgrTpl, dirMenuAction, DirOrMenuItems,
	i18nDirMenuMgr,fonticonpicker) {
	return portal.BaseView.extend({
		template: fish.compile(dirMenuMgrTpl),

		events: {
			"click .js-menu-sel": "selectMenu",
			"click .js-menu-mgr": "manageMenu",
			"click .js-new-dir": 'newDir'
		},

		render: function() {
			this.$el.html(this.template(i18nDirMenuMgr));
		},

		afterRender: function() {
			this.fonticons = [];
			this.$tree = this.$(".grid").grid({
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'privName',
					label: i18nDirMenuMgr.DIRMENUMGR_DIR_MENU_NAME,
					width: "20%",
					editable: true,
					search: true,
					editrules:"required;length[1~60]"
				}, {
					name: 'url',
					label: i18nDirMenuMgr.DIRMENUMGR_MENU_URL,
					editable: true,
					search: true,
					width: "40%"
				}, {
					name: 'iconUrl',
					label: i18nDirMenuMgr.DIRMENUMGR_ICON_URL,
					width: "18%",
					editable: true			
				}, {
					name: 'privCode',
					label: i18nDirMenuMgr.DIRMENUMGR_PRIV_CODE,
					width: "10%",
					editable: true
				}, {
					name: 'operate',
					label: '',
					formatter: 'actions',
					width: "12%",
					formatoptions: {
						editbutton: true, //默认开启编辑功能
						delbutton: true //默认开启删除功能
					}
				}],
				treeGrid: true,
				/*treeIcons: {
					plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: "privName",
				searchbar: true,
				pagebar: true,
				onRowExpand: function(e, rowdata, target) {
				    this.expandRowCommon(rowdata, target);
				}.bind(this), //row展开事件
				onSelectRow: this.rowSelectCallback.bind(this), //选中事件
				onRowCollapse: function(e, rowData) {
					this.$tree.grid("setSelection", rowData); //选中当前展开的行
				}.bind(this),
				beforeEditRow: function(e, rowid, rowdata, option) {
					if (rowdata.dirId + "" === "-1") {
						return false;
					}
					if (rowdata.type === 'DIR') {
						this.$tree.grid("setColProp","url",{editable: false});
						this.$tree.grid("setColProp","privCode",{editable: false});
						return true;
					} else if (rowdata.type === 'MENU') {
						// this.manageMenuInit();
						this.$tree.grid("setColProp","url",{editable: true});
						this.$tree.grid("setColProp","privCode",{editable: true});
						return true;
					}
					return false;
				}.bind(this),
		        afterEditRow: function (e, rowid, data, option) {
		        	this.$("#" + rowid + "_iconUrl").fonticonpicker({
						value: this.$("#" + rowid + "_iconUrl").val(),
						dataSource: this.fonticons
		        	});	
		        }.bind(this),
				beforeRestoreRow : function(){
					this.$tree.grid("setColProp","url",{editable: true});
					this.$tree.grid("setColProp","privCode",{editable: true});
				}.bind(this),
				beforeSaveRow: function(e, rowid, rowdata, option) {
					if (rowdata.dirId + "" === "-1") {
						return false;
					}
					if (rowdata.type === 'MENU') {
						dirMenuAction.modMenu({
			        		privName: rowdata.privName,
			        		privType: "M",
			        		menuId: rowdata.privId,
			        		iconUrl: rowdata.iconUrl,
			        		url: rowdata.url,
			        		privCode: rowdata.privCode
			        	}, function(status) {
							this.$tree.grid("saveRow", rowid, {trigger:false});
							fish.success(i18nDirMenuMgr.DIRMENUMGR_MOD_MENU_SUCCESS);
						}.bind(this));
					}else if(rowdata.type === 'DIR'){
						dirMenuAction.modDir({
			        		dirName: rowdata.privName,
			        		dirId: rowdata.dirId,
			        		iconUrl: rowdata.iconUrl
			        	}, function(status) {
			        		this.$tree.grid("saveRow", rowid, {trigger:false});
							//$grid.grid("setRowData", data);
							fish.success(i18nDirMenuMgr.DIRMENUMGR_MOD_DIR_SUCCESS);
			        	}.bind(this));
					}		        	
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					var children = this.$tree.grid("getNodeChildren", rowdata);
					if (rowdata.dirId + "" === "-1") {
						return false;
					}
					if (rowdata.type === 'DIR') {
						if (!rowdata.childrenLoaded) {
							dirMenuAction.qryDirMenuList(rowdata.privId,
								function(status) {
									var dirList = status.dirList || [],
										menuList = status.menuList || [];
									if (dirList.concat(menuList).length > 0) {
										this.confirmAndRemDir(rowdata,
											i18nDirMenuMgr.DIRMENUMGR_REM_DIR_SUB_CONFIRM);
									} else {
										this.confirmAndRemDir(rowdata,
											i18nDirMenuMgr.DIRMENUMGR_REM_DIR_CONFIRM);
									}
								}.bind(this)
							);
						} else if (children.length > 0) {
							this.confirmAndRemDir(rowdata,
								i18nDirMenuMgr.DIRMENUMGR_REM_DIR_SUB_CONFIRM);
						} else if (children.length === 0) {
							this.confirmAndRemDir(rowdata,
								i18nDirMenuMgr.DIRMENUMGR_REM_DIR_CONFIRM);
						}
						return false;
					} else if (rowdata.type === 'MENU') {
						this.confirmAndRemMenu(rowdata);
					}
					return false;
				}.bind(this),
				onChangeRow: function(e, rowid, oldrowid) {
					this.$tree.grid("restoreRow", oldrowid);
				}.bind(this)
			});
			this.$(".grid").grid("navButtonAdd",[{
                caption: i18nDirMenuMgr.DIRMENUMGR_MENU_SEL,
                cssprop: "js-menu-sel"
            },{	
                caption: i18nDirMenuMgr.DIRMENUMGR_NEW_DIR,
                cssprop: "js-new-dir"
            },{
                caption: i18nDirMenuMgr.DIRMENUMGR_MENU_MGR,
                cssprop: "js-menu-mgr"
            }]);	
            this.btnMenuSelector = this.$(".js-menu-sel");
			this.btnNewDir = this.$(".js-new-dir");
			this.btnMenuMgr = this.$("js-menu-mgr");
			// this.$(".grid").prev().children('div').searchbar({target: this.$tree});

			dirMenuAction.qryFonticons(function(data){
				this.fonticons = data;
			}.bind(this));
			dirMenuAction.qryRootDirList(function(data) {
				var rootNode = this.getFullObject({
					'dirId': -1,
					'dirName': i18nDirMenuMgr['DIRMENUMGR_DIR_MENU_ROOT'],
					'childrenLoaded': true
				}, null);
				rootNode.children = [];
				fish.forEach(data, function(dir) {
					dir.children = []; //为了让其可以展开
					rootNode.children[rootNode.children.length] = this.getFullObject(dir, rootNode);
				}.bind(this));
				var data = [rootNode];
				this.$tree
					.grid("reloadData", data)
					.grid("expandNode", rootNode)
					.grid("setSelection", rootNode);
				
				//-1的节点不允许删除
				this.$(".grid").find("#jEditButton_-1").hide();
				this.$(".grid").find("#jDeleteButton_-1").hide();
			}.bind(this));
		},

		confirmAndRemDir: function(rowdata, confirm) {
			var dirId = rowdata.dirId;
			fish.confirm(confirm,function() {
					dirMenuAction.delDir(dirId, function(status) {
						var nextrow = this.$tree.grid("getNextSelection", rowdata),
							prevrow = this.$tree.grid("getPrevSelection", rowdata),
							parerow = this.$tree.grid("getNodeParent", rowdata);
						if (nextrow) {
							this.$tree.grid("setSelection", nextrow);
						} else if (prevrow) {
							this.$tree.grid("setSelection", prevrow);
						} else if (parerow) {
							this.$tree.grid("setSelection", parerow);
						}
						this.$tree.grid("delRow", rowdata.keyId, {trigger: false});
						fish.success(i18nDirMenuMgr.DIRMENUMGR_REM_DIR_SUCCESS);
					}.bind(this));
				}.bind(this), $.noop);
		},

		seekBeforeRemRow: function($grid, rowdata) {
		    var nextrow = this.$tree.grid("getNextSelection", rowdata),
                prevrow = this.$tree.grid("getPrevSelection", rowdata),
                parerow = this.$tree.grid("getNodeParent", rowdata);
		    if (nextrow) {
		        $grid.grid("setSelection", nextrow);
		    } else if (prevrow) {
		        $grid.grid("setSelection", prevrow);
		    } else if (parerow) {
		        $grid.grid("setSelection", parerow);
		    }
		},

		confirmAndRemMenu: function(rowdata) {
		    var parent = this.$tree.grid("getRowData", rowdata.parent);
			fish.confirm(i18nDirMenuMgr.DIRMENUMGR_DEL_MENU_FROM_DIR_CONFIRM,function() {
				    dirMenuAction.delMenuFromDir([{
                        menuId: rowdata.menuId
                    }], parent.dirId, function(status) {
                        this.seekBeforeRemRow(this.$tree, rowdata);
                        this.$tree.grid("delRow", rowdata.keyId, {trigger: false});
                        fish.success(i18nDirMenuMgr.DIRMENUMGR_DEL_MENU_FROM_DIR_SUCCESS);
                    }.bind(this));
				}.bind(this), $.noop);
		},

		expandRowCommon: function(rowdata, target) {
		    this.$tree.grid("setSelection", rowdata); //选中当前展开的行
            if (!rowdata.childrenLoaded) { //如果子元素没有加载
                dirMenuAction.qryDirMenuList(rowdata.privId, function(data) {
                    var dirList = data.dirList || [];
                    var menuList = data.menuList || [];
                    var rows = [];
                    if (dirList.length > 0) {
                        fish.forEach(dirList, function(dir) {
                            dir.children = []; //为了让其可以后续展开
                            rows[rows.length] = this.getFullObject(dir, rowdata);
                        }.bind(this));
                    }
                    if (menuList.length > 0) {
                        fish.forEach(menuList, function(menu) {
                            rows[rows.length] = this.getFullObject(menu, rowdata);
                        }.bind(this));
                    }
                    rowdata.childrenLoaded = true;
                    this.$tree.grid("addChildNodes", rows, rowdata); //增加子项
                    if (target) {
                        for (var row in rows) {
                            if (row.dirId === target.dirId) {
                                this.$tree.grid("setSelection", row);
                                break;
                            }
                        }
                    }
                }.bind(this));
            }
		},

		rowSelectCallback: function(e, rowid, state) { //选中对应的row
//			var oldEditRow = this._oldEditRow;
//			if (oldEditRow && oldEditRow.KEY_ID !== rowid) {
//				this.$tree.grid("restoreRow", oldEditRow.KEY_ID, {trigger: false});
//				this._oldEditRow = null;
//			}
			this.editButtonStatusChange(rowid); //触发编辑按钮的状态改变
		},

		qryDirUnmountedMenus: function(success) {
			var _this = this;
			var selrow = this.$tree.grid('getSelection'); //获取选中的数据行
			if (selrow && selrow.type == "DIR" && selrow.privId != -1) { //不是-1的DIR
				dirMenuAction.qryMenuList(selrow.privId, function(data) {
					var subMenuList = data;
					dirMenuAction.qryAllMenus(function(data) {
						var allMenus = data;
						var arr = $.grep(allMenus, function(n, i) {
							n.menuId = n.privId;
							for (var item in subMenuList) {
								if (subMenuList[item].menuId == n.menuId) {
									return false;
								}
							}
							return true;
						});
						success.call(_this, arr);
					});
				})
			}
		},

		selectMenu: function() { //选择菜单
			var that = this;
			if (!!this.btnMenuSelector.attr('disabled')) {//有效的时候才触发click事件
				return;
			}
			this.qryDirUnmountedMenus(function(allMenus) {
				var currentDir = that.$tree.grid('getSelection');
				var options = {
					i18nData: i18nDirMenuMgr,
					menus: allMenus,
					dirName: currentDir.privName
				};
				fish.popupView({
	            	url:'modules/dirmenumgr/views/MenuSelector',
	            	viewOption: options,
	            	close:function(selectedMenus){
	            		var currentDir = that.$tree.grid('getSelection');
						dirMenuAction.addDirMenu(currentDir.dirId, selectedMenus, function(data) {
							var parentDir = that.$tree.grid('getSelection'); //获取当前的行
							if (!parentDir.childrenLoaded) { //如果还没有加载过，则直接用expand事件去后台加载数据
								that.expandRowCommon(parentDir); //如果已经加载过，则直接增加数据节点
							} else { //如果已经加载过，则直接增加数据节点
								var addedMenus = [];
								for (var item in selectedMenus) {
									addedMenus[addedMenus.length] = that.getFullObject(selectedMenus[item], parentDir);
								}
								that.$tree.grid("addChildNodes", addedMenus, parentDir);
							}
							that.$tree.grid("expandNode", parentDir);
							fish.success(i18nDirMenuMgr.DIRMENUMGR_ADD_MENU_TO_DIR_SUCCESS);
						})
	            	}
	            });
			});
		},

		manageMenu: function() {
			fish.popupView({
            	url: 'modules/dirmenumgr/views/MenuMgr',
            	viewOption: {rowdata: null}
            })
		},

		manageMenuInit: function() {
			var rowdata = this.$tree.grid("getSelection");
			fish.popupView({
            	url:'modules/dirmenumgr/views/MenuMgr',
            	viewOption: {rowdata: rowdata},
            	callback:function(popup, view){
            		this.listenTo(view, 'edit-close', function(msg) {
						var menu = fish.extend({}, rowdata, msg);
						this.$tree.grid("setRowData", menu);	
						popup.dismiss();					
					}.bind(this));
            	}.bind(this)
            })
		},

		newDir: function() {
			var that = this;
			if (!!this.btnNewDir.attr("disabled")) {//如果new按钮有效才触发事件
				return;
			}
			var currentDir = this.$tree.grid('getSelection');
			fish.popupView({
            	url:'modules/dirmenumgr/views/NewDir',
            	viewOption: currentDir,
            	close:function(msg){
            		var param = {
			    		dirName: msg.dirName,
			    		parentId: currentDir.privId === -1 ? null : currentDir.privId
			    	};
			    	if ($.trim(msg.iconUrl)) {
			    		param.iconUrl = $.trim(msg.iconUrl);
			    	}
			    	dirMenuAction.addDir(param, function(object) {
			    		var parentDir = that.$tree.grid('getSelection'); //获取当前的行
			    		var addedDir = that.getFullObject(object);
			    		addedDir.children = [];
			    		if (!parentDir.childrenLoaded) { //如果还没有加载过，则直接用expand事件去后台加载数据
			    			that.expandRowCommon(parentDir, addedDir);
			    		} else { //如果已经加载过，则直接增加数据节点
			    			that.$tree.grid("addChildNodes", [addedDir], parentDir);
			    			that.$tree.grid("setSelection", addedDir);
			    		}
			    		that.$tree.grid("expandNode", parentDir);
			    		fish.success(i18nDirMenuMgr.DIRMENUMGR_ADD_DIR_SUCCESS);
			    	})
            	}
            });
		},

		addDirNode: function(event) {
			var parentDir = this.newDirDialog.parentDir;
			this.$(".grid").grid("addChildNode", event.toJSON(), parentDir);
			this.$(".grid").grid("setSelection", event.toJSON());
		},

		getFullObject: function(object, parent) {
			if (object['dirId']) {
				if (!object['privId']) {
					object['privId'] = object['dirId'];
				}
				if (!object['privName']) {
					object['privName'] = object['dirName'];
				}
				object["type"] = "DIR";
			} else if (object['menuId']) {
				if (!object['privId']) {
					object['privId'] = object['menuId'];
				}
				if (!object['privName']) {
					object['privName'] = object['menuName'];
				}
				if (!object['url']) {
					object['url'] = object['menuUrl'];
				}
				object["type"] = "MENU";
			} else if (object['privId']) {
				if (object['privType'] === 'M') {
					if (!object['menuId'])
						object['menuId'] = object['privId'];
					if (!object['menuName'])
						object['menuName'] = object['privName'];
					if (!object['menuUrl'])
						object['menuUrl'] = object['url'];
					object["type"] = "MENU";
				}
			}
			object.keyId = parent ? (parent.privId + "_" + object.privId) : object.privId;
			
			return object;
		},

		editButtonStatusChange: function(selectedRowId) {
			var rowData = this.$tree.grid("getSelection", selectedRowId);
			var btnMenuSelectorDisable = false; //选择菜单的btn是否有效
			var btnNewDirDisable = false; //新建Dir的菜单是否有效
			if (rowData && rowData.type) {
				if (rowData.type === "MENU") { //为菜单或者根目录的时候disable
					btnMenuSelectorDisable = true;
					btnNewDirDisable = true; //为菜单的时候无效
				}
				if (rowData.privId === -1) { //为根目录的时候，选择菜单按钮无效
					btnMenuSelectorDisable = true;
				}
			}
			this.btnMenuSelector.attr('disabled', btnMenuSelectorDisable);
			this.btnNewDir.attr("disabled", btnNewDirDisable);
			this.btnMenuSelector.prop('disabled', btnMenuSelectorDisable);
			this.btnNewDir.prop("disabled", btnNewDirDisable);
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$(".grid"), delta);
		}
	});
});
