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
			fish.on("rowChange.webOnlineTranslate", function(rowData){
				this.rowData = rowData;
				this.loadGrid(true);
			}.bind(this));
			fish.on("tabsChange.webOnlineTranslate", function(type){
				this.type = type;
				this.rowData && this.loadGrid(true);
			}.bind(this));
		},
		render: function() {
			this.$el.html(this.template(i18nTranslate));
		},
		afterRender: function() {
			var that = this;			
			that.$(".js-untranslated-grid").grid({
	    	    colModel: [{
		              name: '_id_',
		              hidden: true,
		              key: true
		          },
		          {
		              name: 'resKey',
		              label: i18nTranslate.ORIGINAL_VALUE,
		              sortable: true,
		              search: true
		          },
		          {
		              name: 'resValue',
		              label: i18nTranslate.DESTINED_VALUE,
		              sortable: false,
		              search: true,
		              formatter: function() {
						return "<input type='" + "text" + "' name='" + "text" + "' style='" + "width:100%" + "'>";
		              }
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
							return false;
						}
					}
				},
				pager: true,
				rowNum: 100,
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
			that.rowData && that.loadGrid(true);
			return that;
		},
		loadGrid: function(reset) {			
			var inParam = this.getParam();		
			
			if(inParam.path == undefined){
				this.$(".js-untranslated-grid").grid("reloadData", []);
				this.$(".btn-untranslate-save").prop("disabled",true);
				this.$(".btn-untranslate-cancel").prop("disabled",true);
				$("#translateAllButton").prop("disabled",true);
				return;
			}
			else
			{				
				// onlineTranslateAction.qryTransWebResCount(inParam, function(data){
				// 	var records = data.COUNT;
				// 	var pageObject = {};
				// 	pageObject.page_size = this.$(".js-untranslated-grid").grid("getGridParam", "rowNum");
				// 	pageObject.page_index = reset ? 0 : this.$(".js-untranslated-grid").grid("getGridParam", "page") - 1;	
					// inParam.zsmart_query_page = null;										
					onlineTranslateAction.qryTransWebRes(inParam, function(data){
						var list = data || [];
						this.$(".js-untranslated-grid").grid("reloadData", list);
						if (list.length > 0) {
							this.$(".js-untranslated-grid").grid("setSelection", list[0]);
							this.$(".btn-untranslate-save").prop("disabled",false);
							this.$(".btn-untranslate-cancel").prop("disabled",false);
							$("#translateAllButton").prop("disabled",false);
						} 
						else
						{
							this.$(".btn-untranslate-save").prop("disabled",true);
							this.$(".btn-untranslate-cancel").prop("disabled",true);
							$("#translateAllButton").prop("disabled",true);
						}
					}.bind(this));
				// }.bind(this));
				
			}
		},
		getParam: function(){
			var inParam = {};		
			inParam.lang = 	this.type;	
			inParam.path = this.rowData.path;
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
					obj.resKey = rowData[i].resKey;
					obj.resValue = value;
					inParam.globalRes.push(obj);
				}
			}
			onlineTranslateAction.modWebRes(inParam, function(data){
				// if(data == "success"){
					fish.info(i18nTranslate.HINT_ADD_LANGUAGE_RES_SUCCESS);
					this.loadGrid(true);
					fish.trigger("tabsChange.webOnlineTranslate", this.type);
				// }
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
			fish.off("rowChange.webOnlineTranslate");
			fish.off("tabsChange.webOnlineTranslate");
		}
	});
	return UnTranslateTemplate;
});
