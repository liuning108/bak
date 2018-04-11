define([
	'text!i18n/modules/onlinetranslate/templates/DirMenuTreeTemplate.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction'
], function(dirMenuTreeTemplate, i18n_component, onlineTranslateAction) {
	return portal.BaseView.extend({
		template: fish.compile(dirMenuTreeTemplate),
		initialize: function() {
			this.colModel = [{
				name: 'key',
				label: '',
				hidden: true,
				sortable: false,
				key: true
			},
			{
				name: 'value',
				label: i18n_component.COMMON_RESOURCE_CATALOG,
				width: 350,
				sortable: false
			}];
		},
		render: function() {
			this.$el.html(this.template(i18n_component));
			// return this;
		},
		afterRender: function(contentHeight) {
			var that = this;
			var dirMenus = null;
			that.dirMenuGrid = that.$(".js-grid-mgr").grid({
				autowidth: true,
				colModel: that.colModel,
				colHide: true,
				treeGrid: true,
				expandColumn: "value",
				caption: i18n_component.COMMON_RESOURCE_CATALOG,
				onSelectRow: that.rowSelectCallback.bind(that),
				onRowExpand: function(e, rowdata, target) {
				    that.expandRowCommon(rowdata, target);
				}.bind(that),
				pagebar:true
			});
			// that.dirMenuGrid.grid("navButtonAdd",{
			// 	caption: i18n_component.CLEAR_CACHE,
            //     onClick: function() {
            //     	fish.confirm(i18n_component.COMFIRM_TO_CLEAR_CACHE,function(){
            //     		onlineTranslateAction.clearDBCache(function(){
            //         		fish.success(i18n_component.SUCCESS_TO_CLEAR_CACHE);
            //         	})
            //     	});
            //     }
            // });
			onlineTranslateAction.qryDBResCataLogList(function(data){
				if(data){
					dirMenus = data;
					for(var i=0; i < dirMenus.length; i++){
						dirMenus[i].children = [];
					}
					that.dirMenuGrid.grid("reloadData",dirMenus);
				}
			}.bind(that));		
			return that;
		},
		clearCache: function() {
			fish.confirm(i18n_component.COMFIRM_TO_CLEAR_CACHE,function() {
					onlineTranslateAction.clearCache(function() {
						fish.success(i18n_component.SUCCESS_TO_CLEAR_CACHE);
					}.bind(this));
				}.bind(this), $.noop);
		},
		rowSelectCallback: function(e, rowid, state) {
			var rowdata = this.dirMenuGrid.grid('getRowData', rowid);
			fish.trigger("rowChange.onlineTranslate", rowdata);
		},
		expandRowCommon: function(rowdata, target){
			this.dirMenuGrid.grid("setSelection", rowdata); //选中当前展开的行
            if (!rowdata.CHILDREN_LOADED) { //如果子元素没有加载
                onlineTranslateAction.qryDBResList(rowdata.value, function(data) {
                    var dirList = data || [];                   
                    var rows = [];
                    if (dirList.length > 0) {
                        fish.forEach(dirList, function(dir) {
                            // dir.children = []; //为了让其可以后续展开
                            rows[rows.length] = dir;
                        }.bind(this));
                    }                   
                    rowdata.CHILDREN_LOADED = true;
                    this.dirMenuGrid.grid("addChildNodes", rows, rowdata); //增加子项                    
                }.bind(this));
            }
		},
		subResize :function(delta){
			portal.utils.gridIncHeight(this.$(".js-grid-mgr"), delta);
		}
	
	});
});
