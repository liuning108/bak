portal.define([
	'text!oss_core/pm/meta/kpi/templates/KpiCounterList.html',
	'oss_core/pm/meta/kpi/actions/KpiAction',
	'oss_core/pm/meta/measure/actions/MeasureAction',
],function(kpiCounterTpl, kpiAction, measureAction){
	return portal.BaseView.extend({
		template: fish.compile(kpiCounterTpl),
		events: {
			"click .js-ok": 'ok',
			"click .js-search": 'search',
			"click .js-reset": 'reset',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.pmUtil = options.pmUtil;
			this.kpiType = options.kpiType;
			this.EMS_TYPE_REL_ID = options.EMS_TYPE_REL_ID;
			this.EMS_VER_CODE = options.EMS_VER_CODE;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			if(this.kpiType=="1"){
				this.$(".js-mo-code-div").show();
				this.$(".js-kpi-counter-title").text(this.i18nData.COUNTER);
				this.$(".js-search-input").attr("placeholder",this.i18nData.COUNTER_INPUT);
				this.colModel = [{
					name: 'MO_NAME',
					label: this.i18nData.MO_NAME,
					width: "300",
					editable: true,
					//editrules:"required;"
				}, {
					name: 'FIELD_NAME',
					label: this.i18nData.COUNTER_NAME,
					width: "300",
					editable: true,
					//editrules:"required;"
				}, {
					name: "FIELD_CODE",
					label: this.i18nData.COUNTER_CODE,
					width: "200",
					editable: true,
					//editrules:"required;"
				}];
				this.loadFieldGrid();
				this.loadMoCode();
			}else{
				this.$(".js-mo-code-div").hide();
				this.$(".js-kpi-counter-title").text(this.i18nData.KPI);
				this.$(".js-search-input").attr("placeholder",this.i18nData.KPI_INPUT);
				this.colModel = [{
					name: 'KPI_NAME',
					label: this.i18nData.KPI_NAME,
					width: "300",
					editable: true,
					//editrules:"required;"
				}, {
					name: "KPI_CODE",
					label: this.i18nData.KPI_CODE,
					width: "200",
					editable: true,
					//editrules:"required;"
				}];
				this.loadFieldGrid();
				this.loadGridData();
			}
			
		},
		loadMoCode: function(){
			var param = {};
				param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				param["EMS_VER_CODE"] = this.EMS_VER_CODE ;
				measureAction.qryMeasure(param, function(data) {
					if (data){
						
						this.$("#MO_CODE").combobox({
							dataTextField: 'MO_NAME',
					        dataValueField: 'MO_CODE',
					        dataSource:  data.moList
						});
						this.$("#MO_CODE").combobox('value',(data.moList.length > 0)?data.moList[0]['MO_CODE']:'');
						this.loadGridData();
					}
				}.bind(this));
		},
		loadFieldGrid: function(){
			var that = this;
			var $grid = this.$(".js-kpi-counter-grid");
			this.ListGrid = $grid.jqGrid({
				colModel: this.colModel,
				height:'320px',
				pagebar: false,
				multiselect: true,
				rownumbers:true,
				
			});
			
		},
		loadGridData: function(){
			if(this.kpiType=="1"){
				var param = {};
				param["MO_CODE"] = this.$("#MO_CODE").combobox('value');
				param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				param["FIELD_TYPE"] = "1";
				param["EMS_VER_CODE"] = this.EMS_VER_CODE ;
				param["FIELD_NAME"] = $.trim(this.$(".js-search-input").val());
				measureAction.qryMeasureField(param, function(data) {
					if (data && data.moField){
						this.ListGrid.jqGrid("reloadData",data.moField);
					}
				}.bind(this));
			}else{
				var param = {};
				param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				param["KPI_TYPE"] = "1";
				param["KPI_NAME"] = $.trim(this.$(".js-search-input").val());
				kpiAction.qryKPI(param, function(data) {
					if (data && data.kpiList){
						this.ListGrid.jqGrid("reloadData",data.kpiList);
					}
				}.bind(this));
			}
		},
		ok: function(){
			var retData = this.ListGrid.jqGrid("getCheckRows");

			this.popup.close(retData);
		},
		search: function(){
			this.loadGridData();
		},
		reset: function(){
			this.$(".js-search-input").val("");
			this.loadGridData();
		}
	});
});