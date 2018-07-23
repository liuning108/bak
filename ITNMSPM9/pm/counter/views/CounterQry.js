portal.define([
	'text!oss_core/pm/counter/templates/CounterQry.html',
	'text!oss_core/pm/counter/templates/Tabs.html',
	'i18n!oss_core/pm/counter/i18n/counter',
	'oss_core/pm/counter/actions/CounterAction',
	'oss_core/pm/meta/measure/actions/MeasureAction',
	'oss_core/pm/meta/kpi/actions/KpiAction',
	'oss_core/pm/util/views/Util',
],function(counterTpl,tabsTpl, i18nCounter, counterAction, measureAction, kpiAction, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(counterTpl),
		tabs: fish.compile(tabsTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nCounter),
		events: {
			"click .js-counter-setting":'counterSetting',
			"click .js-counter-data-filter": 'showDataFilter',
			"click .js-counter-data-order": 'showDataOrder',
			"click .js-counter-date-btn": 'dateFormat',
			"click .js-counter-data-grid-exit": 'exitCountQry',
			'click .js-counter-query':'query',
			'click .js-counter-data-download':'download',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.kpiCode = options.kpiCode;
			this.dimValue = options.dimValue;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.timeFormat = pmUtil.parameter("timeFormat").val();
			this.zeroTimeStr = " 00:00:00";
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.colModel = [];
			this.counterList = [];
			this.FilterData = null ;
			this.orderData = null ;
			if(!this.kpiCode){ 
				this.doComplete();
			}	
		},
		doComplete: function(){
			this.$form = this.$(".js-counter-qry-form");
			this.moObj = {};		
			if(this.kpiCode){ 
				this.$(".js-counter-condition-panel").hide();
			}

			this.$("[data-toggle='tooltip']").tooltip();
			this.$("input[name='B_TIME']").datetimepicker({
				buttonIcon: '',
				viewType: 'datetime',
				format	: this.timeFormat,
			});
			
			this.$("input[name='E_TIME']").datetimepicker({
				buttonIcon: '',
				viewType: 'datetime',
				format	: this.timeFormat,
			});

			this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date')+this.zeroTimeStr);
			this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), 1))+this.zeroTimeStr);
			this.loadTab();
			this.getEMSInfo();
			this.getCounterList();
		},
		
		getEMSInfo: function(){
			pmUtil.utilAction.qryEMSInfo(function(data) {
				if (data){
					this.emsData = data;
				}
			}.bind(this));
		},
		resize: function(delta){
			var moCode = this.$(".js-counter-qry-tab > .ui-tabs-panel:visible").attr('id') ;
			if(moCode){
				var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
				$grid.jqGrid('setGridWidth',100) ;
			}
			
			var H = 130 ;
			if(!this.$(".js-counter-condition-panel").is(':visible')){
				H = 60 ;
			}
			this.$(".js-counter-qry-tab > .ui-tabs-panel").height(this.$el.parent().height() - H); //alert(this.$el.parent().height())
			
			this.resizeGrid(moCode);
		},
		resizeGrid:function(moCode){
			
			if(!moCode) return false;
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
			$grid.jqGrid('setGridWidth',$grid.parents(".js-counter-qry-tab > .ui-tabs-panel").width() );
			$grid.jqGrid('setGridHeight',$grid.parents(".js-counter-qry-tab > .ui-tabs-panel").height()-40) ;
			
		},
		loadTab: function(){
			var $tab = this.$(".js-counter-qry-tab");
			$tab.tabs({
				activate: function(e, ui) {
					this.resizeGrid(ui.newPanel.attr("id"));
				}.bind(this),
			});
		},
		getCounterList:function(){
			var kpi = ''; //P______00001
			if(this.kpiCode){ 
				kpi = this.kpiCode ;
			}
			if(!kpi) return false;
			
			counterAction.qryCounterList({'KPI_CODE':kpi},function(data) {
				if(data && data.counterList){ 
					this.counterList = data.counterList ;
					this.getMoCounter();
				}
			}.bind(this),true);
					
		},
		
		getMoCounter:function(){
			var $tab = this.$(".js-counter-qry-tab");
			$.each(this.moObj, function(mo_code, obj) {  
				$tab.tabs("remove",mo_code);
			}.bind(this));
			this.moObj = {};
			
			fish.forEach(this.counterList,function(field){
				var moCode = field['MO_CODE'];
				if(this.moObj[moCode]){
					this.moObj[moCode]['MO_NAME'] = field['MO_NAME'];
					//this.moObj[moCode]['FIELD'].push(field);
					this.moObj[moCode]['COUNTER'].push({'FIELD_CODE':field['FIELD_CODE'],'FIELD_NAME':field['FIELD_NAME']});
					this.moObj[moCode]['MODEL_CODE'] = field['MODEL_CODE'];
				}else{
					this.moObj[moCode] = {
						'MO_NAME':field['MO_NAME'],
						//'FIELD':[field],
						'COUNTER':[{'FIELD_CODE':field['FIELD_CODE'],'FIELD_NAME':field['FIELD_NAME']}],
						'MODEL_CODE':field['MODEL_CODE'],
						};
				}
			}.bind(this));
			
			$.each(this.moObj, function(mo_code, obj) {  
				if(obj['MODEL_CODE']){
					this.$(".js-counter-qry-tab").tabs("add",{
						active:true,
						id:mo_code,
						label:obj['MO_NAME'],
						content:this.tabs(this.i18nData),
					}); 
					if(!this.kpiCode){ 
						this.$(".js-counter-data-grid-exit").hide();
					}
					this.resize();
					this.getGridCount(mo_code, obj['MODEL_CODE']);
				}
			}.bind(this));
		},
		
		loadGrid: function(moCode, modelCode){
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
			
			var moGrid = $grid.jqGrid({
				colModel: this.colModel,//this.moObj[moCode]['colModel']
				shrinkToFit:this.colModel?(this.colModel.length < 10):true,//(this.moObj[moCode]['colModel'].length < 10)
				pagebar: true,
				pager: true,
				rowNum: 20,
			    rowList: [10, 20, 50, 100],
			    datatype: 'json',
			   	pageData: function(page, rowNum){
			   		this.loadGridData(moCode, modelCode, page, rowNum);
			   		return false;
			   	}.bind(this),
			});
			this.moObj[moCode]['moGrid'] = moGrid ;
			this.$("[role='columnheader']").css("background-color", "#039cfd");
			this.$(".ui-jqgrid-sortable").css("color", "#ffffff");

		},
		
		getGridCount: function(moCode, modelCode){
			
			var params = this.getParams(moCode, modelCode);	
			params['counterList'] = this.moObj[moCode]['COUNTER'];		
			counterAction.qryCounterData(params,function(data) {
				if(data && data.counterData){ 
					this.colModel = data.colModel ;
					var moGrid = this.moObj[moCode]['moGrid'] ;
					if(!moGrid){
						this.loadGrid(moCode, modelCode);
					}
					if(data.counterData.length > 0){
						var count = parseInt(data.counterData[0]['COUNT']);
						this.moObj[moCode]['dataCount'] = count;
						this.loadGridData(moCode, modelCode, "1", null);
					}
				}
			}.bind(this));
		},
		loadGridData: function(moCode, modelCode, page, rowNum){
			
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
			if(!$grid) return false;
			
			rowNum = rowNum || $grid.jqGrid("getGridParam", "rowNum");
			if(!rowNum) return false;
			
			var params = this.getParams(moCode, modelCode);
			params['counterList'] = this.moObj[moCode]['COUNTER'];
			params['page'] = page;
			params['rowNum'] = rowNum;
			counterAction.qryCounterData(params,function(data) {
				if(data && data.counterData){ 
					var result =  {
				        "rows": data.counterData,
				        "page": page,
				        "records": this.moObj[moCode]['dataCount'],
				    };
				    _.delay(function () {
				        $grid.jqGrid("reloadData", result);
				        this.resizeGrid(moCode);
				    }.bind(this), 300);
				}
			}.bind(this));	
		},
		getParams: function(moCode, modelCode){
			var params = {};
				params['BTIME'] = this.bTime;
				params['ETIME'] = this.eTime;
				params['MO_CODE'] = moCode;
				params['MODEL_CODE'] = modelCode;
				params['page'] = "0";
				params['rowNum'] = "0";
				if(this.FilterData){
					params['condition_option'] = this.FilterData['condition_option'];
					params['filter_condition'] = this.FilterData['condition'];
				}
				if(this.orderData){
					params['order_condition'] = this.orderData['condition'];
				}
				if(this.dimValue){
					params['dimValList'] = [];
				    $.each(this.dimValue,function(code,value){
				    	if(code.toLowerCase()=='btime'){
				    		code = 'BTIME';
				    	}
				    	if(code.toLowerCase()=='etime'){
				    		code = 'ETIME';
				    	}
				    	params['dimValList'].push({'FIELD_CODE':code,'FIELD_VALUE':value});
				    });
				}
			
			return params;
		},
		counterSetting: function(){
			var options = {
				i18nData : this.i18nData,
				pmUtil	 : pmUtil,
				measureAction : measureAction,
				emsData	 : this.emsData,
				counterData:this.counterData,
			};
			
			fish.popupView({
				url: "oss_core/pm/counter/views/CounterSet",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					this.counterData = retData ;
				}.bind(this),
			});
		},
		query:function(){
			if(this.$form.isValid()){
				this.bTime = this.$form.find("[name='B_TIME']").datetimepicker("value");
				this.eTime = this.$form.find("[name='E_TIME']").datetimepicker("value"); 
				
				if(this.counterData){
					this.counterList = this.counterData['detail'] ;
					this.getMoCounter();
				}else{
					fish.info(this.i18nData.PLS_SET_COUNTER);
				}
			}
		},
		showDataFilter: function(event){
			var moCode = $(event.target).parents('div[tab]').parent().attr('id');
			
			var options = {
					i18nData : this.i18nData,
					pmUtil	 : pmUtil,
					colModel : this.colModel,
					FilterData: this.FilterData ,
				};
			
			fish.popupView({
				url: "oss_core/pm/counter/views/DataFilter",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					var modelCode = this.moObj[moCode]['MODEL_CODE'] ;
					this.FilterData = retData ;
					//this.moObj[moCode]['setFilter'] = retData['where'];
					this.getGridCount(moCode,modelCode);
				}.bind(this),
			});
		},
		
		showDataOrder: function(event){
			var moCode = $(event.target).parents('div[tab]').parent().attr('id');
			var options = {
					i18nData : this.i18nData,
					pmUtil	 : pmUtil,
					colModel : this.colModel,
					orderData: this.orderData ,
				};
			
			fish.popupView({
				url: "oss_core/pm/counter/views/DataOrder",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					var modelCode = this.moObj[moCode]['MODEL_CODE'] ;
					this.orderData = retData ;
					//this.moObj[moCode]['setOrder'] = retData['order'];
					this.getGridCount(moCode, modelCode);
				}.bind(this),
			});
		},
		dateFormat:function(event,day){
			var b = parseInt($(event.target).attr('b'));
			var e = parseInt($(event.target).attr('e'));
			var dateType = $(event.target).attr('date_type');
			if(dateType=="time"){
				this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('time',fish.dateutil.addHours(new Date(), b)).substr(0, 13)+":00:00"	);
				this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('time',fish.dateutil.addHours(new Date(), e)).substr(0, 13)+":00:00"	);
			}else{
				this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), b))+this.zeroTimeStr);
				this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), e))+this.zeroTimeStr);
			}
			
			
		},
		exitCountQry: function(){
			this.trigger("exitCountQry");
		},
		download: function(event){
			var moCode = $(event.target).parents('div[tab]').parent().attr('id');
			var modelCode = this.moObj[moCode]['MODEL_CODE'] ;
			var params = this.getParams(moCode, modelCode);	
			params['isExport'] = "1";
			params['counterList'] = this.moObj[moCode]['COUNTER'];		
			counterAction.qryCounterData(params,function(data) {
				if(data){ 
					
					try {
						
						var fileName =data.fileName;
						var url = portal.appGlobal.attributes.webroot + "/download?filePath=" + fileName;
						var elemIF = document.createElement("iframe");
						elemIF.src = url;
						elemIF.style.display = "none";
						document.body.appendChild(elemIF);
					} catch(e) {
						
					} 
				}
			}.bind(this));
		},
	});
});