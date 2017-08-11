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
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.kpiCode = options.kpiCode;
			this.dimValue = options.dimValue;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.timeFormat = pmUtil.parameter("timeFormat").val();
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			if(!this.kpiCode){ 
				this.doComplete();
			}	
		},
		doComplete: function(){
			this.moObj = {};		
			if(this.kpiCode){ 
				this.$(".js-counter-condition-panel").hide();
			}

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
			this.$("[name='B_TIME']").datetimepicker("value", '2017-05-18');
			this.$("[name='E_TIME']").datetimepicker("value", '2017-05-19');
			//this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			//this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), 1)));
			this.loadTab();
			this.getEMSInfo();
			this.getKpiForm();
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
			
			var H = 110 ;
			if(!this.$(".js-counter-condition-panel").is(':visible')){
				H = 60 ;
			}
			this.$(".js-counter-qry-tab > .ui-tabs-panel").height(this.$el.parent().height() - H); //alert(this.$el.parent().height())
			
			this.resizeGrid(moCode);
		},
		resizeGrid:function(moCode){
			if(!moCode) return false;
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
			$grid.jqGrid('setGridHeight',$grid.parents(".js-counter-qry-tab > .ui-tabs-panel").height()-70) ;
			$grid.jqGrid('setGridWidth',$grid.parents(".js-counter-qry-tab > .ui-tabs-panel").width() );
		},
		loadTab: function(){
			var $tab = this.$(".js-counter-qry-tab");
			$tab.tabs({
				activate: function(e, ui) {
					this.resizeGrid(ui.newPanel.attr("id"));
				}.bind(this),
			});
		},
		getKpiForm:function(){
			var kpi = ''; //P______00001
			if(this.kpiCode){ 
				kpi = this.kpiCode ;
			}
			if(!kpi) return false;
			var sql ="select kpi_form	\n"
					+"  from pm_kpi_form	\n"
					+" where (case	\n"
					+"         when (select kpi_type from pm_kpi where kpi_code = '"+kpi+"') = '2' then	\n"
					+"          (select kpi_form from pm_kpi_form where kpi_code = '"+kpi+"')	\n"
					+"         else	\n"
					+"          '"+kpi+"'	\n"
					+"       end) like '%' || kpi_code || '%'	\n";
			
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					var kpiForm = "";
					fish.forEach(data.resultList,function(kpi){
						kpiForm += kpi['KPI_FORM'];
					});
					this.getCounterInfo(kpiForm);
				}
			}.bind(this),true);
					
		},
		getCounterInfo:function(counterStr){
			var $tab = this.$(".js-counter-qry-tab");
			$.each(this.moObj, function(mo_code, obj) {  
				$tab.tabs("remove",mo_code);
			}.bind(this));
			this.moObj = {};
			
			var sql ="select a.mo_code,	\n"
					+"       a.field_code,	\n"
					+"       a.field_name,	\n"
					+"       a.field_type,	\n"
					+"       a.data_type,	\n"
					+"       b.mo_name,	\n"
					+"       b.mo_name,	\n"
					+"       (select m.model_code	\n"
					+"          from pm_adapter_mo m	\n"
					+"         where m.mo_code = a.mo_code	\n"
					+"           and rownum = 1) as model_code	\n"
					+"  from pm_mo_detail a, pm_mo b	\n"
					+" where a.mo_code = b.mo_code	\n"
					+"   and '"+counterStr+"' like '%[' || field_code || ']%'	\n";
			
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					this.getMoCounter(data.resultList);
				}
			}.bind(this),true);		
		},
		getMoCounter:function(counterList){
			
			fish.forEach(counterList,function(field){
				var moCode = field['MO_CODE'];
				if(this.moObj[moCode]){
					this.moObj[moCode]['MO_NAME'] = field['MO_NAME'];
					//this.moObj[moCode]['FIELD'].push(field);
					this.moObj[moCode]['COUNTER'].push(field['FIELD_CODE']);
					this.moObj[moCode]['MODEL_CODE'] = field['MODEL_CODE'];
				}else{
					this.moObj[moCode] = {
						'MO_NAME':field['MO_NAME'],
						//'FIELD':[field],
						'COUNTER':[field['FIELD_CODE']],
						'MODEL_CODE':field['MODEL_CODE'],
						};
				}
			}.bind(this));
			
			$.each(this.moObj, function(mo_code, obj) {  
				this.$(".js-counter-qry-tab").tabs("add",{
					active:true,
					id:mo_code,
					label:obj['MO_NAME'],
					content:this.tabs(this.i18nData),
				}); 
				if(!this.kpiCode){ 
					this.$(".js-counter-data-grid-exit").hide();
				}
				this.getTableField(mo_code,obj['MODEL_CODE'],obj['COUNTER']);
			}.bind(this));
		},
		getTableField: function(moCode,modelCode,counterField){
			var b_time = this.bTime?this.bTime:'2017/5/18 00:00:00';
			var e_time = this.eTime?this.eTime:'2017/5/18 23:00:00';

			this.moObj[moCode]['mainSql']="select a.* from "+modelCode+" a	\n" ;
				//+" where collecttime >=	\n"
				//+"       to_date('"+b_time+"', 'yyyy-mm-dd hh24:mi:ss')	\n"
				//+"   and collecttime <	\n"
				//+"       to_date('"+e_time+"', 'yyyy-mm-dd hh24:mi:ss')	\n";
			this.moObj[moCode]['setWhere'] = "";
			this.moObj[moCode]['setOrder'] = "";
			//var moCode = 'RANDOMACC';
			var sql = "select column_name	\n"
					+"  from user_tab_cols	\n"
					+" where table_name = '"+modelCode+"'";
			
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					var tableField = [];
					fish.forEach(data.resultList,function(field){
						tableField.push(field['COLUMN_NAME']);
					});
					this.getMoField(moCode,tableField,counterField);
				}
			}.bind(this),true);
		},
		getMoField: function(moCode, tableField, counterField){
			this.moObj[moCode]['mainWhere']  = " where 1=1 ";
			if(this.dimValue){
				$.each(this.dimValue,function(code,value){
			    	if(code=='BTIME'){
						this.moObj[moCode]['mainWhere'] += " and collecttime >= to_date('"+value+"', 'yyyy-mm-dd hh24:mi:ss')	\n"
					}else if(code=='ETIME'){
						this.moObj[moCode]['mainWhere'] += " and collecttime < to_date('"+value+"', 'yyyy-mm-dd hh24:mi:ss')	\n"
					}
			    }.bind(this));
			}else{
				if(this.bTime){
					this.moObj[moCode]['mainWhere'] += " and collecttime >= to_date('"+this.bTime+"', 'yyyy-mm-dd hh24:mi:ss')	\n"
				}
				if(this.eTime){
					this.moObj[moCode]['mainWhere'] += " and collecttime < to_date('"+this.eTime+"', 'yyyy-mm-dd hh24:mi:ss')	\n"
				}
			}
			
			
			measureAction.qryMeasureField({"MO_CODE":moCode}, function(data) {
				if (data){
					if(this.moObj[moCode]){
						this.moObj[moCode]['colModel'] = [] ;
						this.moObj[moCode]['colStr'] = "";
						fish.forEach(data.moField,function(field){
							var fieldCode = field['FIELD_CODE'];
							var fieldType = field['FIELD_TYPE'];
							var dataType = field['DATA_TYPE'];
							var isShow = false;
							if(fieldType != '1' && $.inArray(fieldCode, tableField)>=0){	
								isShow = true;
						    }
						    if(fieldType == '1' && $.inArray(fieldCode, counterField)>=0){	
								isShow = true;
						    }
						    if(isShow){
							    
								var colObj = {
										name: field['FIELD_CODE'].toUpperCase(),
										label: field['FIELD_NAME'],
										field_type: fieldType,
										data_type: dataType,
										width: 120,
										sortable: false
									} ;
								if(fieldType=='0'){
									if(dataType=='2'){//时间维度
										colObj['width'] = 180;
										colObj['formatter'] = "date";
						                colObj['formatoptions'] = {newformat: this.timeFormat};
						                fieldCode = "to_char("+fieldCode+",'yyyy-mm-dd hh24:mi:ss') as "+fieldCode ; 
						            }else{
						            	colObj['width'] = 150;
						            }
						        }else if(fieldType=='1'){//指标
						        	//colObj['align'] = "right";
						        }
						        this.moObj[moCode]['colModel'].push(colObj);
						        if(fieldCode!='CYCLE'){
							        if(!this.moObj[moCode]['colStr']){
						            	this.moObj[moCode]['colStr'] = fieldCode ;
						            }else{
						            	this.moObj[moCode]['colStr'] += ","+fieldCode ;
						            }
						        }
						    }
						    if(this.dimValue){
							    $.each(this.dimValue,function(code,value){
							    	if( code.toUpperCase() ==  fieldCode.toUpperCase() ){
							    		if(dataType=='2'){
								    		value = "to_date('"+value+"', 'yyyy-mm-dd hh24:mi:ss')";
								    	}else if(dataType!='1'){
								    		value = "'"+value+"'";
								    	}
							    		this.moObj[moCode]['mainWhere'] += " and "+fieldCode+" = "+ value+" \n " ;
							    	}
							    }.bind(this));
							}
						    
						}.bind(this));
	
						this.loadGrid(moCode);
					}
				}
			}.bind(this))
		},
		loadGrid: function(moCode){
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
		
			this.Grid = $grid.jqGrid({
				colModel: this.moObj[moCode]['colModel'],
				shrinkToFit:(this.moObj[moCode]['colModel'].length < 10),
				pagebar: true,
				pager: true,
				rowNum: 20,
			    rowList: [10, 20, 50, 100],
			    datatype: 'json',
			   	pageData: function(page, rowNum){
			   		this.loadGridData(moCode,page, rowNum);
			   		return false;
			   	}.bind(this),
			});
			this.$("[role='columnheader']").css("background-color", "#039cfd");
			this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
			this.loadGridCount(moCode,1,null);
		},
		loadGridCount: function(moCode,page, rowNum){
			var sql ="select count(1) as count	\n"
					+"  from (	\n"
					+	this.moObj[moCode]['mainSql']
					+	this.moObj[moCode]['mainWhere']
					+	(this.moObj[moCode]['setWhere']?(" and "+this.moObj[moCode]['setWhere']):"")
					+	(this.moObj[moCode]['setOrder']?(" order by "+this.moObj[moCode]['setOrder']):" order by collecttime ")
					+") s	\n"			
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					if(data.resultList.length > 0){
						this.moObj[moCode]['dataCount'] = data.resultList[0]['COUNT'];
						this.loadGridData(moCode,page, rowNum);
					}
				}
			}.bind(this),true);			
		},
		loadGridData: function(moCode,page, rowNum){
			if(!this.moObj[moCode]['colStr']) return false;
			
			var $grid = this.$(".js-counter-qry-tab div[id="+moCode+"]").find(".js-counter-data-grid");
			rowNum = rowNum || $grid.jqGrid("getGridParam", "rowNum");
			if(!rowNum) return false;
			var sql ="select "+this.moObj[moCode]['colStr']+"	\n"
					+"  from ( select rownum as num, s.* from (	\n"
					+	this.moObj[moCode]['mainSql']
					+	this.moObj[moCode]['mainWhere']
					+	(this.moObj[moCode]['setWhere']?(" and "+this.moObj[moCode]['setWhere']):"")
					+	(this.moObj[moCode]['setOrder']?(" order by "+this.moObj[moCode]['setOrder']):" order by collecttime ")
					+" ) s ) w	\n"
					+" where w.num > "+parseInt((page-1)*rowNum)+" and w.num <= "+parseInt(page*rowNum);
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					var result =  {
				        "rows": data.resultList,
				        "page": page,
				        "records": this.moObj[moCode]['dataCount'],
				    };
				    _.delay(function () {
				        $grid.jqGrid("reloadData", result);
				        this.resize();
				    }.bind(this), 100);
				}
			}.bind(this),true);	
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
			this.bTime = this.$("[name='B_TIME']").datetimepicker("value");
			this.eTime = this.$("[name='E_TIME']").datetimepicker("value"); 
			if(this.counterData){
				//alert(this.counterData['counter']);
				this.getCounterInfo(this.counterData['counter']);
			}
		},
		showDataFilter: function(event){
			var moCode = $(event.target).parents('div[tab]').parent().attr('id');
			var options = {
					i18nData : this.i18nData,
					pmUtil	 : pmUtil,
					colModel : this.moObj[moCode]['colModel'],
				};
			
			fish.popupView({
				url: "oss_core/pm/counter/views/DataFilter",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					this.moObj[moCode]['setWhere'] = retData['where'];
					this.loadGridCount(moCode,1,null);
				}.bind(this),
			});
		},
		
		showDataOrder: function(event){
			var moCode = $(event.target).parents('div[tab]').parent().attr('id');
			var options = {
					i18nData : this.i18nData,
					pmUtil	 : pmUtil,
					colModel : this.moObj[moCode]['colModel'],
				};
			
			fish.popupView({
				url: "oss_core/pm/counter/views/DataOrder",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					this.moObj[moCode]['setOrder'] = retData['order'];
					this.loadGridCount(moCode,1,null);
				}.bind(this),
			});
		},
		dateFormat:function(event,day){
			var b = parseInt($(event.target).attr('b'));
			var e = parseInt($(event.target).attr('e'));
			
			this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), b)));
			this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), e)));
			
		},
		exitCountQry: function(){
			this.trigger("exitCountQry");
		},
		initSlick:function(){
			/*
			this.$('#slick').empty();
			fish.forEach(retData['detail'], function(detail) {
				this.$('#slick').append("<button class='btn btn-default' type='button' code='"+detail['code']+"' title='"+detail['title']+"'>"+detail['name']+"</button>");
			}.bind(this));
			_.delay(function () {
		        this.initSlick();
		    }.bind(this), 500);
			*/
			this.$('#slick').slick({
				infinite: true,
	            speed: 500,
	            lazyLoad: 'ondemand',
	            slidesToShow: 3,
	            variableWidth: true,
	            slidesToScroll: 3,
	            //autoplay: true,
	            //autoplaySpeed: 2000
		    });
		},
	});
});