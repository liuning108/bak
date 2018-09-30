define([
	'text!oss_core/inms/pm/config/task/templates/collect/MultiParam.html',
],function(ftpParamMultiTpl){
	return portal.BaseView.extend({
		template: fish.compile(ftpParamMultiTpl),
		//scheduleHtml: fish.compile(scheduleTpl),
		events: {
			"click .js-adapter-param-btn":'addParam',
			"click .js-ok":'ok',
		},
		initialize: function(options) {
			this.options = options ;
			this.pmUtil = options.pmUtil;
			this.multiParam = options.multiParam;
			this.i18nData =	options.i18nData;
			this.protocolType = options.protocolType;
			this.paramModel = [{
				name: "PARAM_CODE",
				label: this.i18nData.PARAM_CODE,
				width: "47",
				editable: true,
				editrules:"required;"
			}, {
				name: 'PARAM_VALUE',
				label: this.i18nData.PARAM_VALUE,
				width: "47",
				editable: true,
				editrules:"required;"
			}, {
				sortable: false,
				label: "",
				width: "6",
				formatter: 'actions',
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
		},

		afterRender: function(){
			this.$form = this.$(".js-ftp-cfg-form");
			if(this.protocolType=="00"){ //ftp
				//this.$(".js-ftp-param").show();
				this.$(".js-jdbc-param").remove();

				this.$form.find("[name='IS_COMPRESS']").combobox({
					dataTextField: this.pmUtil.parakey.name,
			        dataValueField: this.pmUtil.parakey.val,
			        dataSource:  this.pmUtil.paravalue("IS_COMPRESS")
				});
				var compressArr = this.pmUtil.paravalue("IS_COMPRESS");
				this.$form.find("[name='IS_COMPRESS']").combobox('value',(compressArr&&compressArr.length > 0)?compressArr[0][this.pmUtil.parakey.val]:"");

				if(this.multiParam){
					this.multiParam["IS_DEL"] = (this.multiParam["IS_DEL"]=="1")?"on":"off";
				}
			}else if(this.protocolType=="01"){
				this.$(".js-ftp-param").remove();
				//this.$(".js-jdbc-param").show();
				this.$form.find("[name='SOURCE_DB_DIALECT']").combobox({
					dataTextField: this.pmUtil.parakey.name,
			        dataValueField: this.pmUtil.parakey.val,
			        dataSource:  this.pmUtil.paravalue("DB_DIALECT")
				});
				var dbDialectArr = this.pmUtil.paravalue("DB_DIALECT");
				this.$form.find("[name='SOURCE_DB_DIALECT']").combobox('value',(dbDialectArr&&dbDialectArr.length > 0)?dbDialectArr[0][this.pmUtil.parakey.val]:"");

				this.pmUtil.utilAction.qryDataSource({},function(data) {
					if(data){
						this.$form.find("[name='SOURCE_DB_NAME']").combobox({
							dataTextField: "NAME",
					        dataValueField: "ID",
					        dataSource:  data.sourceList
						});
						this.$form.find("[name='SOURCE_DB_NAME']").combobox('value',(data.sourceList&&data.sourceList.length > 0)?data.sourceList[0]['ID']:"");
					}
				}.bind(this));
			}else{
				this.$(".js-ftp-param").remove();
				this.$(".js-jdbc-param").remove();
			}
			this.loadParamGrid();

			if(this.multiParam){
				this.$form.form("value",this.multiParam);
				this.paramGrid.jqGrid("reloadData",this.multiParam['attrParam']);
			}

		},
		ok: function(){

			if (this.$form.isValid()) {
				var value = this.$form.form("value");
				value["IS_DEL"] = (value["IS_DEL"]=="on")?"1":"0";
				value["attrParam"] = this.paramGrid.jqGrid("getRowData");
				//alert(value["attrParam"].length);
				this.popup.close(value);
			}

		},

		loadParamGrid: function(){
			var that = this;
			var $grid = this.$(".js-param-grid");
			this.paramGrid = $grid.jqGrid({
				colModel: this.paramModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				rownumbers:true,
				height:150,
				afterEditCell: function (e,rowid,name,value,iRow,iCol) {
					return false;
		        },
				beforeDeleteRow: function(e, rowid, rowdata) {
					that.delParam(rowdata);
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					return false;
				}.bind(this)
			});
		},
		addParam: function(){
			var data = {};
			this.paramGrid.jqGrid("addRowData", data, 'last');
			this.paramGrid.jqGrid("setSelection",data);
		},
		delParam: function(rowdata){
			fish.confirm(this.i18nData.PARAM_DEL_CONFIRM,function(t) {
				this.paramGrid.jqGrid("delRowData", rowdata);
			}.bind(this));
		},

	});
});
