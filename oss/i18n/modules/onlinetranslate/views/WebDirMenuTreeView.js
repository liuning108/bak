define([
	'text!i18n/modules/onlinetranslate/templates/DirMenuTreeTemplate.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction',
], function(webDirMenuTreeTemplate, i18n_component, onlineTranslateAction) {
	return portal.BaseView.extend({
		template: fish.compile(webDirMenuTreeTemplate),
		initialize: function() {
			this.colModel = [{
				name: 'name',
				label: i18n_component.COMMON_RESOURCE_CATALOG,
				width: 350,
				sortable: false,
				key: true
			}];
		},
		render: function() {
			this.$el.html(this.template(i18n_component));
		},
		afterRender: function(contentHeight) {
			var that = this;
			var dirMenus = null;
			that.webDirMenuGrid = that.$(".js-grid-mgr").grid({
				autowidth: true,
				colModel: that.colModel,
				colHide: true,
				treeGrid: true,
				expandColumn: "name",
				caption: i18n_component.COMMON_RESOURCE_CATALOG,
				/*treeIcons: {
					plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				onSelectRow: that.rowSelectCallback.bind(that),
				pagebar:true
			});
			// that.webDirMenuGrid.grid("navButtonAdd",[{
            //     caption: i18n_component.CLEAR_CACHE,
            //     onClick: function() {
            //     	fish.confirm(i18n_component.COMFIRM_TO_CLEAR_CACHE,function(){
            //     		onlineTranslateAction.clearWebCache(function(){
            //         		fish.success(i18n_component.SUCCESS_TO_CLEAR_CACHE);
            //         	})
            //     	});
            //     }
            // },{
            // 	caption: i18n_component.TRANSLATE,
            // 	id: "translateAllButton",
            //     onClick: function() {
        	// 		fish.trigger("translateAll.webOnlineTranslate",i18n_component.COMFIRM_TO_TRANSLATE_ALL,i18n_component.SUCCESS_TO_TRANSLATE_ALL);
            //     }.bind(this)
            // },{
            // 	caption: i18n_component.COMMON_EXPORT,
            //     onClick: function() {
        	// 		fish.trigger("exportAll.webOnlineTranslate",i18n_component.COMFIRM_TO_EXPORT_ALL);
            //     }.bind(this)
            // }]);			
			
			onlineTranslateAction.qryResFileDirList(function(data){
				if(data && data.length>0){					
					that.webDirMenuGrid.grid("reloadData",data);
					that.webDirMenuGrid.grid("setSelection", data[0]);
					
				}
			}.bind(this));		
			return that;
		},
		rowSelectCallback: function(e, rowid, state) {
			var rowdata = this.webDirMenuGrid.grid('getRowData', rowid);
			fish.trigger("rowChange.webOnlineTranslate", rowdata);
		},
		subResize :function(delta){
			portal.utils.gridIncHeight(this.$(".js-grid-mgr"), delta);
		}
	
	});
});
