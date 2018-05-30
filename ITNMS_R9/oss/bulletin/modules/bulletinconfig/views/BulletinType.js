define([
	"text!bulletin/modules/bulletinconfig/templates/BulletinType.html",
	'i18n!bulletin/modules/bulletinconfig/i18n/bulletinconfig',
	'bulletin/modules/bulletinconfig/actions/BulletinConfigAction'
], function(tpl, i18n, bulletinConfigAction) {
	return portal.BaseView.extend({
		template: fish.compile(tpl),

		events: {
			"click .js-new-root": "newRoot",
			"click .js-new-sub": "newSub"
		},

		initialize: function() {
			this.colModel = [{
				name: 'typeId',
				key: true,
				hidden: true
			}, {
				name: 'typeName',
				label: i18n.BULLETIN_CONFIG_TYPE_NAME,
				width: "90%",
				sortable: false,
				search: true,
				editable: true,
				editrules: i18n.BULLETIN_CONFIG_TYPE_NAME + ":required;length[1~60, true]"				
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
			this.$el.html(this.template(i18n));
		},

		afterRender: function() {
			this.typeTree = this.$(".js-grid").grid({
				treeGrid: true,
				expandColumn: "typeName",
				colModel: this.colModel,
				searchbar: true,
				pagebar: true,
				leafChange:true,
				beforeDeleteRow: function(e, rowid, rowdata) {
					this.expandRowCommon(rowdata);
					fish.confirm(i18n.BULLETIN_CONFIG_DEL_TYPE,function() {
							var type = this.$(".js-grid").grid("getRowData", rowid);
							var children = this.typeTree.grid("getNodeChildren",type);
							if (children.length>0) {
								fish.warn(i18n.BULLETIN_CONFIG_DEL_TYPE_FAIL);
								return;
							}
							bulletinConfigAction.delBulletinType(type.typeId, function(status) {
								var nextrow = this.typeTree.grid("getNextSelection", type);
								if (nextrow) {
									this.typeTree.grid("setSelection", nextrow);
								} else {
									var prevrow = this.typeTree.grid("getPrevSelection", type);
									if (prevrow) {
										this.typeTree.grid("setSelection", prevrow);
									} else {
										var parerow = this.typeTree.grid("getNodeParent", type);
										this.typeTree.grid("setSelection", parerow);
									}
								}
								this.typeTree.grid("delRow", rowdata.typeId, {
									trigger: false
								});
								fish.success(i18n.BULLETIN_CONFIG_DEL_TYPE_SUCCESS);
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
						delete _rowdata.typeId;
						delete _rowdata.expanded;
						delete _rowdata.isLeaf;
						delete _rowdata.level;
						delete _rowdata.parent;
						delete _rowdata.children;
						bulletinConfigAction.modBulletinType(rowid, _rowdata, function(status) {
							this.typeTree.grid("saveRow", rowid, {trigger: false});
							fish.success(i18n.BULLETIN_CONFIG_EDIT_TYPE);
						}.bind(this));
						break;
					case 'add':
						var parent = this.typeTree.grid('getNodeParent', rowdata);
						var _rowdata = fish.clone(rowdata);
						delete _rowdata.typeId;
						delete _rowdata.expanded;
						delete _rowdata.isLeaf;
						delete _rowdata.level;
						delete _rowdata.parent;
						if(parent !== null){
							_rowdata.parentTypeId = parent.typeId;
						}
						bulletinConfigAction.addBulletinType(_rowdata, function(status) {
							var type = status;
							this.typeTree.grid('saveRow', rowid, {trigger: false});
							this.typeTree.grid('delRow', rowid, {trigger: false});
							this.typeTree.grid('addChildNode', type, parent);
							this.typeTree.grid('setSelection', type);
							fish.success(i18n.BULLETIN_CONFIG_ADD_TYPE);
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
							prevRow = this.typeTree.grid("getPrevSelection", rowdata);
							if (!prevRow) {
								prevRow = this.typeTree.grid("getNodeParent", rowdata);
							}
						} else {
							var allrows = this.typeTree.grid('getRowData');
							if (allrows && allrows.length > 0) {
								prevRow = allrows[0];
							}
						}
						if (prevRow) {
							setTimeout(function() {
								this.typeTree.grid("setSelection", prevRow);
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
			this.typeTree.grid("navButtonAdd",[{
                caption: i18n.BULLETIN_CONFIG_TYPE_NEW_ROOT,
                cssprop: "js-new-root"
            },{	
                caption: i18n.BULLETIN_CONFIG_TYPE_NEW,
                cssprop: "js-new-sub"
            }]);
			bulletinConfigAction.qryBulletinTypeByParentId(0, function(data) {
				if (data){
					if (data.length > 0) {
                        fish.forEach(data, function(type) {
                            type.children = []; 
                        }.bind(this));
                    }
					this.typeTree.grid("reloadData", data);
					this.typeTree.grid("setSelection", data[0]);
				}
			}.bind(this));
		},

		expandRowCommon: function(rowdata) {
			var that = this;
		    that.typeTree.grid("setSelection", rowdata);
            if (!rowdata.loaded) { 
            	//area_id必须是数字，后台要将其转换成long类型
            	//父节点不存在时，自动给area_id添加了字符串值，引起报错
            	if(!isNaN(rowdata.typeId)) 
				{ 
				   bulletinConfigAction.qryBulletinTypeByParentId(rowdata.typeId, function(data) {
	                    var typeList = data || [];
	                    var rows = [];
	                    if (typeList.length > 0) {
	                        fish.forEach(typeList, function(type) {
	                            type.children = []; 
	                            rows[rows.length] = type;
	                        }.bind(that));
	                        this.typeTree.grid("addChildNodes", rows, rowdata); 
	                    }
	                }.bind(that));
	                rowdata.loaded = true;
				}
				else
				{
					//提示将父节点填上
					fish.info(i18n.BULLETIN_CONFIG_TYPE_NEW_ERROR);
				}                
            }
		},

		newRoot: function() {
			this.typeTree.grid("addRow")
		},

		newSub: function() {
			var $grid = this.$(".js-grid"),
				rowdata = $grid.grid("getSelection");
			$grid.grid("expandNode", rowdata, true);
			$grid.grid("addRow", {
				parent: rowdata,
				initdata: {
					parentTypeId: rowdata.typeId
				}				
			});
		},

		resize: function(delta) {
			this.$(".js-grid").grid("setGridHeight", this.$(".js-grid").parent().parent().parent().parent().parent().parent().parent().parent().height() - this.$(".js-grid").parent().parent().parent().outerHeight(true) + this.$(".js-grid").height() - 45);
		}
	})
});
