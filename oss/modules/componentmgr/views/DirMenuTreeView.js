define([
	'text!modules/componentmgr/templates/DirMenuTreeTemplate.html',
	'i18n!modules/componentmgr/i18n/componentmgr',
	'modules/dirmenumgr/actions/DirMenuAction'
], function(dirMenuTreeTemplate, i18n_component, dirMenuAction) {
	return portal.BaseView.extend({
		//className:"container_left panel panel-default",
		template: fish.compile(dirMenuTreeTemplate),

		initialize: function() {
			this.colModel = [{
				name: 'keyId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'partyName',
				label: i18n_component.COMPONENT_DIR_MENU_NAME,
				width: 500,
				sortable: false,
				search: true
			}];
		},

		render: function() {
			this.$el.html(this.template(i18n_component));
		},

		afterRender: function() {
			var dirMenus = this.addRootToRecord([]);
			dirMenus[0].children = [];
			this.dirMenuGrid = this.$(".js-grid-mgr").grid({
				autowidth: true,
				colModel: this.colModel,
				data: dirMenus,
				treeGrid: true,
				expandColumn: "partyName",
				searchbar: true,
				// height: contentHeight - 62,
				/*treeIcons: {
					plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				onSelectRow: this.rowSelectCallback.bind(this),
				onRowExpand: this.rowExpandCallback.bind(this)
			});

			this.rowExpandCallback(null, this.dirMenuGrid.grid("getSelection")); //手动触发一次展开事件
			return this;
		},

		addRootToRecord: function(dirMenuArray) {
			dirMenuArray = this.setParentToRootWhenNoParent(dirMenuArray);
			var rootItem = {
				partyId: "0",
				partyName: i18n_component.COMPONENT_MENU_ROOT,
				seq: "0",
				state: "A",
				type: "0",
				keyId: -1,
				expanded: true
			};
			dirMenuArray.unshift(rootItem); //加到最前面
			return dirMenuArray;
		},

		setParentToRootWhenNoParent: function(dirMenuArray) {
			for (var key in dirMenuArray) {
				var item = dirMenuArray[key];
				if (!item.PARENT_ID) {
					item.PARENT_ID = "-1";
				}
			}
			return dirMenuArray;
		},

		rowSelectCallback: function(e, rowid, state) {
			var rowdata = this.dirMenuGrid.grid('getRowData', rowid);
			this.trigger("partyChange", rowdata);
		},

		rowExpandCallback: function(e, rowData) { //展开的时候触发的事件
			if (!rowData.HAS_LOAD_CHILDREN && rowData.type == "0") {
				dirMenuAction.qryDirMenuList(rowData.partyId, function(data) {
					var dirMenuList = [];
					if(rowData.partyId == 0 || typeof(rowData.partyId)=="undefined") {
						var dirList = null;
						if (data && data.dirList && data.dirList.length > 0) {
							dirList = data.dirList;
						} else {
							dirList = [];
						}
						for (var key in dirList) {
							var item = dirList[key];
							item.partyId = item.dirId;
							item.partyName = item.dirName;
							item.type = 0;
							item.children = [];
							dirMenuList[dirMenuList.length] = item;
						}
					} else {
						var menuList = null;
						if (data && data.menuList&& data.menuList.length > 0) {
							menuList = data.menuList;
						} else {
							menuList = [];
						}
						for (var key in menuList) {
							var item = menuList[key];
							item.partyName = item.privName;
							item.partyId = item.menuId;
							item.type = 1;
							dirMenuList[dirMenuList.length] = item;
						}
					}
					
					if (rowData.partyId === '0') {
						dirMenuAction.qryNoDirMenuList(function(status) {
							var noDirMenuList = status || [];
							fish.forEach(noDirMenuList, function(menu) {
								menu.partyName = menu.privName;
								menu.partyId = menu.menuId;
								menu.type = 1;
							});
							noDirMenuList = this.generateKeys(noDirMenuList, rowData.partyId);
							this.dirMenuGrid.grid("addChildNodes", noDirMenuList, rowData);
						}.bind(this));
					}
					dirMenuList = this.generateKeys(dirMenuList, rowData.partyId);
					this.dirMenuGrid.grid("addChildNodes", dirMenuList, rowData);
					rowData.HAS_LOAD_CHILDREN = true;
				}.bind(this));
			}
		},

		generateKeys: function(array, parentId) {
			for (var item in array) {
				array[item].keyId = parentId + "_" + array[item].partyId
			}
			return array;
		}
	});
});
