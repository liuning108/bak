portal.define([
	'text!oss_core/pm/report/sla/templates/SlaDaily.html',
	'i18n!oss_core/pm/report/sla/i18n/sla.daily',
	//'oss_core/pm/report/collect/actions/slaDailyAction',
	'oss_core/pm/util/views/Util',
],function(collectLogTpl, i18nCollectLog, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(collectLogTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nCollectLog),
		events: {
			"click .js-collect-log-date-btn": 'dateFormat',
			"click .js-collect-log-query":'query',
			"click .js-sla-daily-set-li":"setting",
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.net_type = options.net_type;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.timeFormat = pmUtil.parameter("timeFormat").val();
			this.colModel = [{
					name: 'COLLECT_MONAME',
					label: this.i18nData.MO,
					width: "100",
					sortable: false,
				}, {
					name: 'SOURCE_FILE_NAME',
					label: this.i18nData.FILE_NAME,
					width: "250",
					sortable: false,
				}, {
					name: 'TASK_STATE',
					label: this.i18nData.STATE,
					width: "80",
					sortable: false,
					formatter: "select",
					editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("COLLECT_TASK_STATE")),
				}, {
					name: 'BTIME',
					label: this.i18nData.CHECK_POINT,
					width: "120",
					sortable: false,
				}, {
					name: 'SOURCE_FILE_TIME',
					label: this.i18nData.SOURCE_FILE_TIME,
					width: "120",
					sortable: false,
				}, {
					name: 'EMS_TYPE',
					label: this.i18nData.EMS_TYPE,
					width: "100",
					sortable: false,
				}, {
					name: 'REMOTE_PATH',
					label: this.i18nData.REMOTE_PATH,
					width: "250",
					sortable: false,
				} ] ;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.doComplete();	
		},
		doComplete: function(){
			this.emsObj = {};		

			this.$("[data-toggle='tooltip']").tooltip();
			this.$("input[name='B_TIME']").datetimepicker({
				buttonIcon: '',
				viewType: 'date',
				format	: this.dateFormat,
			});
			
			this.$("input[name='E_TIME']").datetimepicker({
				buttonIcon: '',
				viewType: 'date',
				format	: this.dateFormat,
			});
			this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), 1)));
			this.initGrid();
			
		},
		
		resize: function(delta){
			
			this.Grid.jqGrid('setGridHeight',this.$el.parent().height()-130) ;
		},

		
		
		initGrid: function(){
			var colModel = [
		            {name: 'Date',label: 'Date', width: '80', 
		            	sorttype: "date", formatter: "date",
		                formatoptions: {
		                    newformat: this.dateFormat 
		                },
		            }
		        ];
		    if(this.net_type && this.net_type.toUpperCase() == '3G'){
		    	this.$('.js-collect-log-ems-label').html('3G Performance SLA Daily Report');
		    	this.kpis = [
			    	{kpi_code:'PA3ZV3C00003', target:['>97%',	'>97%',	'>97%',	     ], kpi_name:'RRC Establishment Success Rate (V3)' }, 
					{kpi_code:'PA3ZU3C00003', target:['>97%',	'>97%',	'>97%',	     ], kpi_name:'RRC Establishment Success Rate (V4)' }, 
					{kpi_code:'PA3ZV3C00006', target:['>97.5%',	'>97.5%',	'>97.5%',	 ], kpi_name:'RAB Establishment Success Rate, CS(V3)' }, 
					{kpi_code:'PA3ZU3C00006', target:['>97.5%',	'>97.5%',	'>97.5%',	 ], kpi_name:'RAB Establishment Success Rate, CS(V4)' }, 
					{kpi_code:'PA3ZV3C00009', target:['>98.5%',	'>98.5%',	'>98.5%',	 ], kpi_name:'RAB Establishment Success Rate, PS(V3)' }, 
					{kpi_code:'PA3ZU3C00009', target:['>98.5%',	'>98.5%',	'>98.5%',	 ], kpi_name:'RAB Establishment Success Rate, PS(V4)' }, 
					{kpi_code:'PA3ZV3C00012', target:['<1.5%',	'<1.5%',	'<1.5%',	 ], kpi_name:'Cell Call Drop Rate CS(V3)' }, 
					{kpi_code:'PA3ZU3C00142', target:['<1.5%',	'<1.5%',	'<1.5%',	 ], kpi_name:'Cell Call Drop Rate CS(V4)' }, 
					{kpi_code:'PA3ZV3C00015', target:['<3.5%',	'<3.5%',	'<3.5%',	 ], kpi_name:'Cell Call Drop Rate PS(V3)' }, 
					{kpi_code:'PA3ZU3C00021', target:['<3.5%',	'<3.5%',	'<3.5%',	 ], kpi_name:'Cell Call Drop Rate PS(V4)' }, 
					{kpi_code:'PA3ZV3C00018', target:['<-100dbm','<-100dbm','<-100dbm',  ], kpi_name:'Average Cell Freq RTWP(V3)' }, 
					{kpi_code:'PA3ZU3C00070', target:['<-100dbm','<-100dbm','<-100dbm',  ], kpi_name:'Average Cell Freq RTWP(V4)' }, 
					{kpi_code:'PA3ZU3C00145', target:['>94%',	'>94%',	'>94%',	     ], kpi_name:'Handover Successful Rate(3G)-hard HO' }, 
					{kpi_code:'PA3ZV3C00021', target:['>93%',	'>93%',	'>93%',	     ], kpi_name:'Inter-RAT CS Handover Success Rate V3(WCDMA->GSM)' }, 
					{kpi_code:'PA3ZU3C00051', target:['>93%',	'>93%',	'>93%',	     ], kpi_name:'Inter-RAT CS Handover Success Rate V4(WCDMA->GSM)' }, 
					{kpi_code:'PA3ZV3C00024', target:['>92%',	'>92%',	'>92%',	     ], kpi_name:'Inter-RAT PS Outgoing Handover Success Rate V3(WCDMA)->(GPRS)' }, 
					{kpi_code:'PA3ZU3C00054', target:['>92%',	'>92%',	'>92%',	     ], kpi_name:'Inter-RAT PS Outgoing Handover Success Rate V4(WCDMA)->(GPRS)' }, 
					{kpi_code:'PA3ZV3C00027', target:['<55%',	'<55%',	'<55%',	     ], kpi_name:'Cell percentage of Average non-HSDPA TCP utilization(V3)' }, 
					{kpi_code:'PA3ZU3C00148', target:['<55%',	'<55%',	'<55%',	     ], kpi_name:'Cell percentage of Average non-HSDPA TCP utilization(V4)' }, 
					{kpi_code:'PA3ZV3C00036', target:['<70%',	'<70%',	'<70%',	     ], kpi_name:'Site percentage of Average CE uplink Utilization per site(V3)' }, 
					{kpi_code:'PA3ZU3C00086', target:['<70%',	'<70%',	'<70%',	     ], kpi_name:'CE Utilisation UL' }, 
					{kpi_code:'PA3ZV3C00030', target:['>512kbps','>512kbps','>512kbps',  ], kpi_name:'Cell HSDPA throughput per User(V3)' }, 
					{kpi_code:'PA3ZV3C00030', target:['>512kbps','>512kbps','>512kbps',  ], kpi_name:'Cell HSDPA throughput per User(V4)' }, 
					{kpi_code:'PA3ZV3C00033', target:['>40%',	'>40%',	'>40%',	     ], kpi_name:'Code resource availability(V3)' }, 
					{kpi_code:'PA3ZU3C00154', target:['>40%',	'>40%',	'>40%',	     ], kpi_name:'Code resource availability(V4)' }, 
				];
		    }else{    
		    	this.$('.js-collect-log-ems-label').html('2G Performance SLA Daily Report');
			    this.kpis = [
			    		{kpi_code:'PA2ZU3C00071', target:['<1%' , '<1%' , '<1%' ],  kpi_name:'TCH Drop Rate(Excluding HO)' },
						{kpi_code:'PA2ZU3C00060', target:['>96%', '>96%', '>96%'],  kpi_name:'Handover success Rate (%)' },
						{kpi_code:'PA2ZU3C00074', target:['>90%', '>75%', '>90%'],  kpi_name:'DL Rxquality (0-3) (%)' },
						{kpi_code:'PA2ZU3C00077', target:['>96%', '>96%', '>96%'],  kpi_name:'TCH assignment success rate (%)' },
						{kpi_code:'PA2ZU3C00080', target:['>93%', '>93%', '>93%'],  kpi_name:'SDCCH assignment success rate(%)' },
						{kpi_code:'PA2ZU3C00083', target:['>93%', '>93%', '>93%'],  kpi_name:'Ratio of Uplink TBF Establish Link successfully (%)' },
						{kpi_code:'PA2ZU3C00086', target:['>95%', '>95%', '>95%'],  kpi_name:'Ratio of Downlink TBF Establish Link successfully (%)' },
						{kpi_code:'PA2ZU3C00089', target:['<1%' , '<1%' , '<1%' ],  kpi_name:'TBF DROP RATE (DL) (%)' },
						{kpi_code:'PA2ZU3C00092', target:['<1%' , '<1%' , '<1%' ],  kpi_name:'TBF DROP RATE (UL) (%)' },
						{kpi_code:'PA2ZU3C00095', target:['<3%' , '<3%' , '<3%' ],  kpi_name:'PDCH congestion Rate(%)' },
			    	] ;
			}
		    var col2 = [];
		    var col3 = [{startColumnName: 'Date', numberOfColumns: 1, titleText: 'Agreement ratio of qualified cells'}];	
		    var col4 = [{startColumnName: 'Date', numberOfColumns: 1, titleText: 'Target'}];		
		    fish.forEach(this.kpis, function(kpi) { 	
		    	colModel.push({name: 'DU_'+kpi['kpi_code'],label:'DU' , width: '80'});
		    	colModel.push({name: 'SU_'+kpi['kpi_code'],label:'SU' , width: '80'});
		    	colModel.push({name: 'RU_'+kpi['kpi_code'],label:'RU' , width: '80'});
		    	
		    	col2.push({startColumnName: 'DU_'+kpi['kpi_code'], numberOfColumns: 3, titleText: kpi['kpi_name']});
		    	
		    	col3.push({startColumnName: 'DU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][0]});
		    	col3.push({startColumnName: 'SU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][1]});
		    	col3.push({startColumnName: 'RU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][2]});
		    	
		    	col4.push({startColumnName: 'DU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][0]});
		    	col4.push({startColumnName: 'SU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][1]});
		    	col4.push({startColumnName: 'RU_'+kpi['kpi_code'], numberOfColumns: 1, titleText: kpi['target'][2]});
		    });
			var $grid = this.$(".js-collect-log-data-grid");
			this.Grid = $grid.jqGrid({
				//data:mydata2,
				shrinkToFit: false,
		        height: 400,
		        colModel: colModel
			});
			
			$grid.jqGrid('setGroupHeaders', {
			    useColSpanStyle: true,
			    groupHeaders: col4
			});
			
			/**
			$grid.jqGrid('setGroupHeaders', {
			    useColSpanStyle: true,
			    groupHeaders: col3
			});
			**/
			$grid.jqGrid('setGroupHeaders', {
			    useColSpanStyle: true,
			    groupHeaders: col2
			});
			this.$("[role='columnheader']").css("background-color", "#039cfd");
			this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
		},
		query:function(){

			var bTime = this.$("[name='B_TIME']").datetimepicker("value");
			var eTime = this.$("[name='E_TIME']").datetimepicker("value"); 
			var bt = new Date(bTime);
			var et = new Date(eTime);
			var datas = [];
			while(bt < et){
				var data = {'Date':pmUtil.sysdate('date',bt)};
				fish.forEach(this.kpis, function(kpi) { 
					data['DU_'+kpi['kpi_code']] = (Math.random()*(75-100)+100).toFixed(2)+'%';
			    	data['SU_'+kpi['kpi_code']] = (Math.random()*(75-100)+100).toFixed(2)+'%';
			    	data['RU_'+kpi['kpi_code']] = (Math.random()*(75-100)+100).toFixed(2)+'%';
				});
				datas.push(data);
				bt = fish.dateutil.addDays(bt, 1) ;
			}
			_.delay(function () {
		        this.Grid.jqGrid("reloadData", datas);
		    }.bind(this), 500);
			
		},
		loadGridData: function(){
			
			var sql = "";
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					var result =  {
				        "rows": data.resultList,
				        "page": page,
				        "records": this.emsObj[emsCode]['dataCount'],
				    };
				    
				    
				    _.delay(function () {
				        $grid.jqGrid("reloadData", result);
				        this.resizeGrid(emsCode);
				    }.bind(this), 100);
				}
			}.bind(this),true);	
		},
		
		
		
		dateFormat:function(event,day){
			var b = parseInt($(event.target).attr('b'));
			var e = parseInt($(event.target).attr('e'));
			
			this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), b)));
			this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), e)));
			
		},
		setting:function(event){
			var type = $(event.target).attr('type');
			
			var options = {
				i18nData : this.i18nData,
				pmUtil	 : pmUtil,
			};
			
			var popupUrl = '';
			
			if(type=='group'){
				popupUrl = "oss_core/pm/report/sla/views/GroupSet" ;
			}else if(type=='threshold'){
				popupUrl = "oss_core/pm/report/sla/views/ThresholdSet" ;
			}
			
			if(popupUrl){
				fish.popupView({
					url: popupUrl,
					viewOption: options,
					callback: function(popup, view) {
						
					}.bind(this),
					close: function(retData) {
						this.counterData = retData ;
					}.bind(this),
				});
			}
			
		},
		
		
	});
});