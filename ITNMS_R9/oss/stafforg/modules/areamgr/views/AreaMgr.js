define([
	"text!stafforg/modules/areamgr/templates/AreaMgrTemplate.html",
	'i18n!stafforg/modules/areamgr/i18n/areamgr',
	'stafforg/modules/areamgr/actions/AreaAction'
], function(AreaMgrTpl, i18nAreaMgr, areaAction) {
	return portal.BaseView.extend({
		template: fish.compile(AreaMgrTpl),

		events: {
			"click .js-new-root": "newRootArea",
			"click .js-new-sub": "newSubArea"
		},

		initialize: function() {
			this.colModel = [{
				name: 'areaId',
				key: true,
				hidden: true
			}, {
				name: 'areaName',
				label: i18nAreaMgr.AREA_NAME,
				width: "20%",
				sortable: false,
				search: true,
				editable: true,
				editrules: i18nAreaMgr.AREA_NAME + ":required;length[1~60, true]"
			}, {
				name: "areaCode",
				label: i18nAreaMgr.AREA_CODE,
				width: "20%",
				sortable: false,
				search: true,
				editable: true,
				editrules: i18nAreaMgr.AREA_CODE + ":required;length[1~60, true]"
			}, {
				name: "comments",
				label: i18nAreaMgr.COMMON_REMARKS,
				width: "50%",
				sortable: false,
				search: true,
				editable: true,
				editrules: "length[1~255, true]"
			}, {
				name: 'operate',
				label: '',
				formatter: 'actions',
				width: "10%",
				formatoptions: {
					delbutton: true,
					editbutton: true
				}
			}];
		},

		render: function() {
			this.$el.html(this.template(i18nAreaMgr));
			return this;
		},

		afterRender: function() {
			this.areaTree = this.$(".js-grid").grid({
				treeGrid: true,
				expandColumn: "areaName",
				colModel: this.colModel,
				searchbar: true,
				pagebar: true,
				leafChange:true,
				beforeDeleteRow: function(e, rowid, rowdata) {
					this.expandRowCommon(rowdata);
					fish.confirm(i18nAreaMgr.AREAMGR_DEL_AREA_CONFIRM,function() {
							var area = this.$(".js-grid").grid("getRowData", rowid);
							var children = this.areaTree.grid("getNodeChildren", area);
							if (children.length>0) {
								fish.warn(i18nAreaMgr.AREAMGR_DEL_AREA_FAILURE);
								return;
							}
							areaAction.delArea(area.areaId, function(status) {
								var nextrow = this.areaTree.grid("getNextSelection", area);
								if (nextrow) {
									this.areaTree.grid("setSelection", nextrow);
								} else {
									var prevrow = this.areaTree.grid("getPrevSelection", area);
									if (prevrow) {
										this.areaTree.grid("setSelection", prevrow);
									} else {
										var parerow = this.areaTree.grid("getNodeParent", area);
										this.areaTree.grid("setSelection", parerow);
									}
								}
								this.areaTree.grid("delRow", rowdata.areaId, {
									trigger: false
								});
								fish.success(i18nAreaMgr.AREAMGR_DEL_AREA_SUCCESS);
							}.bind(this)
						);
					}.bind(this));
					return false;
				}.bind(this),
				beforeAddRow: function(e, rowid, rowdata, options){
					if(this.$(".grid-new-row").length > 0){
						return false;
					}
				}.bind(this),
				beforeSaveRow: function(e, rowid, rowdata, options) {
					switch (options.oper) {
					case 'edit':
						var _rowdata = fish.clone(rowdata);
						delete _rowdata.areaId;
						delete _rowdata.expanded;
						delete _rowdata.isLeaf;
						delete _rowdata.level;
						delete _rowdata.parent;
						delete _rowdata.children;
						areaAction.modArea(rowid, _rowdata, function(status) {
							this.areaTree.grid("saveRow", rowid, {trigger: false});
							fish.success(i18nAreaMgr.AREAMGR_MOD_AREA_SUCCESS);
						}.bind(this));
						break;
					case 'add':
						var parent = this.areaTree.grid('getNodeParent', rowdata);
						var _rowdata = fish.clone(rowdata);
						delete _rowdata.areaId;
						delete _rowdata.expanded;
						delete _rowdata.isLeaf;
						delete _rowdata.level;
						delete _rowdata.parent;
						if(parent !== null){
							_rowdata.parentId = parent.areaId;
						}
						areaAction.addArea(_rowdata, function(status) {
							var area = status;
							this.areaTree.grid('saveRow', rowid, {trigger: false});
							this.areaTree.grid('delRow', rowid, {trigger: false});
							this.areaTree.grid('addChildNode', area, parent);
							this.areaTree.grid('setSelection', area);
							fish.success(i18nAreaMgr.AREAMGR_ADD_AREA_SUCCESS);
						}.bind(this));
						break;
					default:
						break;
					}
					return false;
				}.bind(this),
				onRowExpand: function(e, rowdata, target) {
				    this.expandRowCommon(rowdata);
				}.bind(this),
				afterRestoreRow: function(e, rowid, rowdata, options) {
					var prevRow = null;
					switch (options.oper) {
					case 'add':
						if (rowdata.parent) {
							prevRow = this.areaTree.grid("getPrevSelection", rowdata);
							if (!prevRow) {
								prevRow = this.areaTree.grid("getNodeParent", rowdata);
							}
						} else {
							var allrows = this.areaTree.grid('getRowData');
							if (allrows && allrows.length > 0) {
								prevRow = allrows[0];
							}
						}
						if (prevRow) {
							setTimeout(function() {
								this.areaTree.grid("setSelection", prevRow);
							}.bind(this), 0);
						}
						break;
					case 'edit':
						return;
						break;
					default:
						break;
					}
				}.bind(this)
			});
			this.areaTree.grid("navButtonAdd",[{
                caption: i18nAreaMgr.AREAMGR_NEW_ROOT,
                cssprop: "js-new-root"
            },{	
                caption: i18nAreaMgr.AREAMGR_NEW,
                cssprop: "js-new-sub"
            }]);
			areaAction.qryAreaListByParentId(0, function(data) {
				if (data){
					if (data.length > 0) {
                        fish.forEach(data, function(area) {
                            area.children = []; 
                        }.bind(this));
                    }
					this.areaTree.grid("reloadData", data);
					this.areaTree.grid("setSelection", data[0]);
				}
			}.bind(this));
		},

		expandRowCommon: function(rowdata) {
			var that = this;
		    that.areaTree.grid("setSelection", rowdata);
            if (!rowdata.loaded) { 
            	//area_id必须是数字，后台要将其转换成long类型
            	//父节点不存在时，自动给area_id添加了字符串值，引起报错
            	if(!isNaN(rowdata.areaId)) 
				{ 
				   areaAction.qryAreaListByParentId(rowdata.areaId, function(data) {
	                    var areaList = data || [];
	                    var rows = [];
	                    if (areaList.length > 0) {
	                        fish.forEach(areaList, function(area) {
	                            area.children = []; 
	                            rows[rows.length] = area;
	                        }.bind(that));
	                        this.areaTree.grid("addChildNodes", rows, rowdata); 
	                    }
	                }.bind(that));
	                rowdata.loaded = true;
				}
				else
				{
					//提示将父节点填上
					fish.info(i18nAreaMgr.AREAMGR_NEW_ERROR);
				}                
            }
		},

		newRootArea: function() {
			this.areaTree.grid("addRow")
		},

		newSubArea: function() {
			var $grid = this.$(".js-grid"),
				rowdata = $grid.grid("getSelection");
			$grid.grid("expandNode", rowdata, true);
			$grid.grid("addRow", {
				parent: rowdata,
				initdata: {
					parentId: rowdata.areaId
				}				
			});
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$(".js-grid"), delta);
		}
	})
});
