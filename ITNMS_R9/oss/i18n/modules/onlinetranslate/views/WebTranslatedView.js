define([
	'text!i18n/modules/onlinetranslate/templates/TranslatedGrid.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction'
], function(translateTemplate, i18nTranslate, onlineTranslateAction) {
	var TranslateTemplate = portal.BaseView.extend({
		template: fish.compile(translateTemplate),
		events: {
			"click .btn-translate-cancel": 'transCancel',
			// "click .btn-translate-refresh": 'transRefresh',
			"click .btn-translate-save": 'transSave'
		},
		initialize: function(option) {			
			this.type = option.type;
			this.rowData = option.rowData;	
			fish.on("rowChange.webOnlineTranslate", function(rowData){
				this.rowData = rowData;
				this.loadGrid(true);
			}.bind(this));
			fish.on("tabsChange.webOnlineTranslate", function(type){
				this.type = type;
				this.rowData && this.loadGrid(true);
				if(this.type != "en" && this.type != "zh"){
					this.$transGrid.grid("hideCol","cusValue");
					this.$transGrid.grid("setGridWidth",this.$transGrid.width());
					this.$transGrid.grid("setColProp","resValue",{editable: true});
				}
				else
				{
					this.$transGrid.grid("setColProp","resValue",{editable: false});
					this.$transGrid.grid("showCol","cusValue");
					this.$transGrid.grid("setGridWidth",this.$transGrid.width());	
				}
			}.bind(this));
		},
		render: function() {
			this.$el.html(this.template(i18nTranslate));
		},
		afterRender: function() {
			var that = this;			
			that.$transGrid = that.$(".js-translated-grid").grid({
	    	    colModel: [{
			              name: '_id_',
			              hidden: true,
			              key: true
			          },
			          {
			              name: 'resKey',
			              label: i18nTranslate.ORIGINAL_VALUE,
			              sortable: true,
			              search: true,
			              width: "30%"
			          },
			          {
			              name: 'resValue',
			              label: i18nTranslate.DESTINED_VALUE,
			              editable: false,
			              sortable: false,
			              search: true,
			              width: "30%"
			          },
			          {
			              name: 'cusValue',
			              label: i18nTranslate.CUSTOMIZATION,
			              editable: true,
			              sortable: false,
			              search: true,
			              width: "30%"
					  }],				
				autowidth: true,
				multiselect: false,
				
				onSelectRow: that.rowSelect.bind(that),
				onPaging: function(e,onpaging){
					var cusCells = that.$transGrid.grid("getChangedCells");
					if(cusCells && cusCells.length > 0){
						fish.warn(i18nTranslate.WARN_SAVE_CURPAGE_DATA);
						return false
					}
				}.bind(that),
				pager: true,
				// datatype: 'json',
				rowNum: 100,
				// pageData: function(page) {that.loadGrid(false);}.bind(that),
				pginput: false,
				pgRecText: false,
				searchbar: true,
				cellEdit:true
				
			});
			that.$transGrid.grid("navButtonAdd",[{
				caption: i18nTranslate.COMMON_SAVE,
                cssprop: "btn-translate-save",
			}]);
			this.rowData && that.loadGrid(true);
			return that;
		},
		loadGrid: function(reset) {			
			var inParam = this.getParam();		
			if(inParam.path == undefined){
				this.$transGrid.grid("reloadData", []);
				this.$(".btn-translate-save").prop("disabled",true);
				return;
			}
			else
			{
				this.$(".btn-translate-save").prop("disabled",false);
				//资源文件直接一次性读取，并加载
				// onlineTranslateAction.qryWebResCount(inParam, function(data){
				// 	var records = data.COUNT;					
				// 	var pageObject = {};
				// 	pageObject.page_size = this.$transGrid.grid("getGridParam", "rowNum");
				// 	pageObject.page_index = reset ? 0 : this.$transGrid.grid("getGridParam", "page") - 1;	
					// inParam.zsmart_query_page = null;								
					onlineTranslateAction.qryWebRes(inParam, function(data){
						var list = data || [];
						this.$transGrid.grid("reloadData", list);
						if (list.length > 0) {
							this.$transGrid.grid("setSelection", list[0]);
						} 
					}.bind(this));
				// }.bind(this));
				
			}
		},
		rowSelect: function(ee, rowid, state) { //选中行
			var e = ee && ee.originalEvent || (void 0);
			var rowData = this.$transGrid.grid("getSelection");
			if (e && e.target) {
				var action = $(e.target).attr("action");
				switch (action) {
					case "edit":
						this.editClick(rowid);
						break;
				}
			}
		},
		editClick: function(rowid){
			this.$transGrid.grid("editCell",this.$transGrid.grid("getInd",rowid), 3,true);
		},
		getParam: function(){
			var inParam = {};		
			inParam.lang = 	this.type;	
			inParam.path = this.rowData.path;
			return inParam;
		},
		transSave: function(){
			var inParam = this.getParam();
			inParam.globalRes = new Array();
			inParam.cusGlobalRes = new Array();
			var rowData = this.$transGrid.grid("getRowData");
			var cusCells = this.$transGrid.grid("getChangedCells");
			var len = rowData.length;	
			for(var j=0;j<cusCells.length;j++){
				for(var i=0;i<len;i++)
				{							
					var obj = this.getParam();
					obj.resKey = rowData[i].resKey;
					if(cusCells[j].resKey === obj.resKey){
						obj.resValue = cusCells[j].resValue;
					}
					else
					{
						continue;
					}
					inParam.globalRes.push(obj);
				}		
			
				for(var i=0;i<len;i++)
				{							
					var obj = this.getParam();
					obj.resKey = rowData[i].resKey;
					if(cusCells[j].resKey === obj.resKey){
						obj.resValue = cusCells[j].cusValue;
					}
					else
					{
						continue;
					}
					inParam.cusGlobalRes.push(obj);
				}
			}
			onlineTranslateAction.modWebRes(inParam, function(data){
				// if(data == "success"){
					fish.info(i18nTranslate.HINT_MOD_LANGUAGE_RES_SUCCESS);
					this.loadGrid(true);
					// this.trigger("afterSave");
				// }
			}.bind(this));
		},
		formatId: function(sid){
			return String(sid).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g,"\\$&");
		},
		resize:function(delta){
			portal.utils.gridIncHeight(this.$(".js-translated-grid"), delta);
		},
		cleanup: function(){
			fish.off("rowChange.webOnlineTranslate");
			fish.off("tabsChange.webOnlineTranslate");
		}
	});
	return TranslateTemplate;
});
