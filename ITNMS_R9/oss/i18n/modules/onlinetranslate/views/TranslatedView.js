define([
	'text!i18n/modules/onlinetranslate/templates/TranslatedGrid.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction'
], function(translateTemplate, i18nTranslate, onlineTranslateAction) {
	var TranslateTemplate = portal.BaseView.extend({
		template: fish.compile(translateTemplate),
		events: {
			"click .btn-translate-cancel": 'transCancel',
			"click .btn-translate-save": 'transSave'
		},
		initialize: function(option) {			
			this.type = option.type;
			this.rowData = option.rowData;
			fish.on("rowChange.onlineTranslate", function(rowData){
				this.rowData = rowData;
				this.loadGrid(true);
			}.bind(this));
			fish.on("tabsChange.onlineTranslate", function(type){
				this.type = type;
				this.rowData && this.loadGrid(true);

			}.bind(this));

		},
		render: function() {
			this.$el.html(this.template(i18nTranslate));
		},
		afterRender: function() {
			var that = this;			
			// $(".grid_container").css("margin-bottom",0);
			that.$transGrid = that.$(".js-translated-grid").grid({
		   	    // data: [],
	    	    colModel: [{
		              name: '_id_',
		              hidden: true,
		              key: true
		          },
		          {
		              name: 'initialValue',
		              label: i18nTranslate.ORIGINAL_VALUE,
		              sortable: false,
		              search: true,
		              width: "45%"
		          },
		          {
		              name: 'globalValue',
		              label: i18nTranslate.DESTINED_VALUE,
		              editable: true,
		              sortable: false,
		              search: true,
		              width: "45%"
		          },
		          {
		          	  name: 'operate',
					  label: '',
					  formatter: 'actions',
					  width: "10%",
					  formatoptions: {
						  delbutton: true,
						  editbutton: false
					  }
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
				beforeDeleteRow: function(e, rowid, rowdata) {
					var area = rowdata;
					fish.confirm(i18nTranslate.PROMPT_DEL_GLOBAL_RES,function() {
							var nextrow = that.$transGrid.grid("getNextSelection", area),
							prevrow = that.$transGrid.grid("getPrevSelection", area),
							parerow = that.$transGrid.grid("getNodeParent", area);
						var inParam = that.getParam();		
						// var item = that.$transGrid.grid("getSelection") ;
						var item = that.$transGrid.grid('getRowData', rowid);
						var key = item.initialValue; 
						inParam.engHashValue = key;
						onlineTranslateAction.delDBRes(inParam, function(status) {
							if (nextrow) {
								that.$transGrid.grid("setSelection", nextrow);
							} else if (prevrow) {
								that.$transGrid.grid("setSelection", prevrow);
							} else {
								that.$transGrid.grid("setSelection", parerow);
							}
							that.$transGrid.grid("delRow", rowdata._id_, {
								trigger: false
							});
							fish.success(i18nTranslate.HINT_DEL_LANGUAGE_RES_SUCCESS);
							// that.trigger("afterSave");
							fish.trigger("tabsChange.onlineTranslate", this.type);
						}.bind(that));
					}.bind(that), $.noop);
					return false;
				}.bind(that),
				pager: true,
				datatype: 'json',
				rowNum: 100,
				pageData: function(page) {that.loadGrid(false);}.bind(that),
				pginput: false,
				pgRecText: false,
				searchbar: true,
				cellEdit:true
			});
			that.$transGrid.grid("navButtonAdd",[{
				caption: i18nTranslate.COMMON_SAVE,
                cssprop: "btn-translate-save"
			}]);
			// that.$(".js-translated-search").searchbar({target: that.$transGrid});
			this.rowData && this.loadGrid(true);
			return that;
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
		loadGrid: function(reset) {			
			var inParam = this.getParam();		
			//table_name不存在，表示当前选中的是目录，不是具体的菜单项，所以不需要调借口，直接返回	
			if(inParam.isCatalog){
				this.$transGrid.grid("reloadData", []);
				this.$(".btn-translate-save").prop("disabled",true);
				return;
			}
			else
			{
				this.$(".btn-translate-save").prop("disabled",false);
				// onlineTranslateAction.qryDBResCount(inParam, function(data){
					// var records = data;
					inParam.pageLen = this.$transGrid.grid("getGridParam", "rowNum");
					inParam.pageIndex = reset ? 0 : this.$transGrid.grid("getGridParam", "page") - 1;									
					onlineTranslateAction.qryDBRes(inParam, function(data){
						var list = data.list || [];
						this.$transGrid.grid("reloadData", {
							'rows': list,
							'page': inParam.pageIndex + 1,
							'records': data.total
						});
					}.bind(this));
				// }.bind(this));
				
			}
		},
		getParam: function(){
			var inParam = {};
			inParam.tableName = this.rowData.tableName;
			inParam.colName = this.rowData.colName;			
			inParam.language = 	this.type;	
			inParam.resObjectId = this.rowData.resObjectId;
			inParam.isCatalog = this.rowData.isCatalog;
			return inParam;
		},
		transSave: function(){
			var inParam = this.getParam();
			inParam.globalRes  = new Array();
			var rowData = this.$transGrid.grid("getRowData");
			var len = rowData.length;	
			var cusCells = this.$transGrid.grid("getChangedCells");
			for(var j=0;j<cusCells.length;j++){
				for(var i=0;i<len;i++)
				{							
					var obj = this.getParam();
					obj.engHashValue = rowData[i].initialValue;
					if(cusCells[j].initialValue === obj.engHashValue){
						obj.value = cusCells[j].globalValue;
					}
					else
					{
						continue;
					}
					inParam.globalRes.push(obj);
				}		
			}
			onlineTranslateAction.modDBRes(inParam.globalRes, function(data){
				if(data == "success"){
					fish.info(i18nTranslate.HINT_MOD_LANGUAGE_RES_SUCCESS);
					this.loadGrid(true);
				}
			}.bind(this));
		},
		formatId: function(sid){
			return String(sid).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g,"\\$&");
		},
		resize:function(delta){
			portal.utils.gridIncHeight(this.$(".js-translated-grid"), delta);
		},
		cleanup: function(){
			fish.off("rowChange.onlineTranslate");
			fish.off("tabsChange.onlineTranslate");
		}
	});
	return TranslateTemplate;
});
