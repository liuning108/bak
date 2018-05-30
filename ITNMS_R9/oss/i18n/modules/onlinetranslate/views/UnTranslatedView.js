define([
	'text!i18n/modules/onlinetranslate/templates/UnTranslatedGrid.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction'
], function(unTranslateTemplate, i18nTranslate, onlineTranslateAction) {
	var UnTranslateTemplate = portal.BaseView.extend({
		template: fish.compile(unTranslateTemplate),
		events: {
			"click .btn-untranslate-cancel": 'untransCancel',
			"click .btn-untranslate-save": 'untransSave'
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
			that.$(".js-untranslated-grid").grid({
	    	    colModel: [{
		              name: '_id_',
		              hidden: true,
		              key: true
		          },
		          {
		              name: 'initialValue',
		              label: i18nTranslate.ORIGINAL_VALUE,
		              sortable: false,
		              search: true
		          },
		          {
		              name: 'globalValue',
		              label: i18nTranslate.DESTINED_VALUE,
		              sortable: false,
		              search: true,
		              formatter: function() {
						return "<input type='" + "text" + "' name='" + "text" + "' style='" + "width:100%" + "'>";
					}.bind(that)
		          }],				
				autowidth: true,
				multiselect: false,
				onPaging: function(e,onpaging){
					var rowData = that.$(".js-untranslated-grid").grid("getRowData");
					var len = rowData.length;	
					for(var i=0;i<len;i++)
					{
						var id=rowData[i]._id_;
						var value = $("#"+that.formatId(id)).find("input").val();
						if(value!=null&&value!="")
						{				
							fish.warn(i18nTranslate.WARN_SAVE_CURPAGE_DATA);
							return false
						}
					}
				}.bind(that),
				pager: true,
				datatype: 'json',
				rowNum: 100,
				pageData: function(page) {that.loadGrid(false);}.bind(that),
				pginput: false,
				searchbar: true,
				pgRecText: false
			});
			that.$(".js-untranslated-grid").grid("navButtonAdd",[{
				caption: i18nTranslate.COMMON_SAVE,
                cssprop: "btn-untranslate-save"
			},{
				caption: i18nTranslate.COMMON_CANCEL,
                cssprop: "btn-untranslate-cancel"
			}]);
			this.rowData && this.loadGrid(true);
			return that;
		},
		loadGrid: function(reset) {			
			var inParam = this.getParam();		
			
			//table_name不存在，表示当前选中的是目录，不是具体的菜单项，所以不需要调借口，直接返回	
			if(inParam.isCatalog){
				this.$(".js-untranslated-grid").grid("reloadData", []);
				this.$(".btn-untranslate-save").prop("disabled",true);
				this.$(".btn-untranslate-cancel").prop("disabled",true);
				return;
			}
			else
			{
				this.$(".btn-untranslate-save").prop("disabled",false);
				this.$(".btn-untranslate-cancel").prop("disabled",false);
//				onlineTranslateAction.qryTransDBResCount(inParam, function(data){
//					var records = data;
					inParam.pageLen = this.$(".js-untranslated-grid").grid("getGridParam", "rowNum");
					inParam.pageIndex = reset ? 0 : this.$(".js-untranslated-grid").grid("getGridParam", "page") - 1;									
					onlineTranslateAction.qryTransDBRes(inParam, function(data){
						var list = data.list || [];
						this.$(".js-untranslated-grid").grid("reloadData", {
							'rows': list,
							'page': inParam.pageIndex + 1,
							'records': data.total
						});
					}.bind(this));
//				}.bind(this));
				
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
		untransCancel: function(){
			this.$(".js-untranslated-grid :input").val("");
		},
		untransSave: function(){
			var inParam = this.getParam();
			inParam.globalRes = new Array();
			var rowData = this.$(".js-untranslated-grid").grid("getRowData");
			var len = rowData.length;	
			for(var i=0;i<len;i++)
			{
				var id=rowData[i]._id_;
				var value = $("#"+this.formatId(id)).find("input").val();
				if(value!=null&&value!="")
				{				
					var obj = this.getParam();
					obj.engHashValue = rowData[i].initialValue;
					obj.value = value;
					inParam.globalRes.push(obj);
				}
			}
			onlineTranslateAction.addDBRes(inParam.globalRes, function(data){
				if(data == "success"){
					fish.info(i18nTranslate.HINT_ADD_LANGUAGE_RES_SUCCESS);
					this.loadGrid(true);
					fish.trigger("tabsChange.onlineTranslate", this.type);	
				}		
			}.bind(this));
		},
		formatId: function(sid){
			return String(sid).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g,"\\$&");
		},
		resize:function(delta){
//			delta = delta - this.$("#tabs-untranslated > .search-bar")
			portal.utils.gridIncHeight(this.$(".js-untranslated-grid"), delta);
		},
		cleanup: function(){
			fish.off("rowChange.onlineTranslate");
			fish.off("tabsChange.onlineTranslate");
		}
	});
	return UnTranslateTemplate;
});
