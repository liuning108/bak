portal.define([
	'text!oss_core/pm/report/collect/templates/CollectLog.html',
	'text!oss_core/pm/report/collect/templates/Tabs.html',
	'i18n!oss_core/pm/report/collect/i18n/collect',
	//'oss_core/pm/report/collect/actions/collectLogAction',
	'oss_core/pm/util/views/Util',
],function(collectLogTpl,tabsTpl, i18nCollectLog, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(collectLogTpl),
		tabs: fish.compile(tabsTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nCollectLog),
		events: {
			"click .js-collect-log-date-btn": 'dateFormat',
			'click .js-collect-log-query':'query',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.kpiCode = options.kpiCode;
			this.dimValue = options.dimValue;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.timeFormat = pmUtil.parameter("timeFormat").val();
			this.colModel = [{
					name: 'COLLECT_MONAME',
					label: this.i18nData.MO,
					width: "120",
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
			//this.$("[name='B_TIME']").datetimepicker("value", '2017-05-18');
			//this.$("[name='E_TIME']").datetimepicker("value", '2017-05-19');
			this.$("[name='B_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$("[name='E_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addDays(new Date(), 1)));
			this.loadTab();
			this.getEMSInfo();
			
		},
		getEMSInfo: function(){
			pmUtil.utilAction.qryEMSInfo(function(data) {
				if (data){
					this.emsData = data;
					this.loadEmsType();
				}
			}.bind(this));
		},
		loadEmsType: function(){
			if(!this.emsData) this.emsData = {};
			var emsTypeInfo = [];
			fish.forEach(this.emsData['emsList'], function(ems) {
				var info = {'EMS_TYPE':ems['EMS_TYPE'],'EMS_TYPE_CODE':ems['EMS_TYPE_CODE']} ;
				var isExist = false;
				$.each(emsTypeInfo,function(i,obj){
					if(obj['EMS_TYPE_CODE'] == ems['EMS_TYPE_CODE']){
						isExist = true;
						return false;
					}
				});
				if(!isExist){
					emsTypeInfo.push(info);
				}
			});
			
			this.$("input[name='EMS_TYPE']").combobox({
				dataTextField: 'EMS_TYPE',
		        dataValueField: 'EMS_TYPE_CODE',
		        dataSource:  emsTypeInfo
			});
			this.$("input[name='EMS']").combobox({});
			
			this.$("input[name='EMS_TYPE']").on('combobox:change', function () {
				this.loadEms();
			}.bind(this));
			
		},
		loadEms:function(ems){
			var emsType = this.$("input[name='EMS_TYPE']").combobox('value');
			var emsInfo = [];
			fish.forEach(this.emsData['emsList'], function(ems) {
				if(ems['EMS_TYPE_CODE'] == emsType){
					emsInfo.push({'EMS_NAME':ems['EMS_NAME'],'EMS_CODE':ems['EMS_CODE']}) ;
				}
			});
			this.$("input[name='EMS']").combobox({
				dataTextField: 'EMS_NAME',
		        dataValueField: 'EMS_CODE',
		        dataSource:  emsInfo
			});
			
			if(ems){
				this.$("input[name='EMS']").combobox('value',ems);
			}else{
				this.$("input[name='EMS']").combobox('value',(emsInfo.length > 0)?emsInfo[0]['EMS_CODE']:'');
			}
		},
		
		resize: function(){
			
			var emsCode = this.$(".js-collect-log-qry-tab > .ui-tabs-panel:visible").attr('id') ;
			if(emsCode){
				var $grid = this.$(".js-collect-log-qry-tab div[id="+emsCode+"]").find(".js-collect-log-data-grid");
				$grid.jqGrid('setGridWidth',100) ;
				$grid.jqGrid('setGridHeight',100) ;
			}
			
			var H = 110 ;
			
			this.$(".js-collect-log-qry-tab > .ui-tabs-panel").height(this.$el.parent().height() - H); //alert(this.$el.parent().height())
			
			this.resizeGrid(emsCode);
		},
		resizeGrid:function(emsCode){
			if(!emsCode) return false;
			var $grid = this.$(".js-collect-log-qry-tab div[id="+emsCode+"]").find(".js-collect-log-data-grid");
			var H = 105 ;
			$grid.jqGrid('setGridHeight',$grid.parents(".js-collect-log-qry-tab > .ui-tabs-panel").height()-H) ;
			$grid.jqGrid('setGridWidth',$grid.parents(".js-collect-log-qry-tab > .ui-tabs-panel").width() );
		},
		loadTab: function(){
			var $tab = this.$(".js-collect-log-qry-tab");
			$tab.tabs({
				activate: function(e, ui) {
					this.resizeGrid(ui.newPanel.attr("id"));
				}.bind(this),
			});
		},
		
		query:function(){
			
			var $tab = this.$(".js-collect-log-qry-tab");
			$.each(this.emsObj, function(emsCode, obj) {  
				$tab.tabs("remove",emsCode);
			}.bind(this));
			
			this.emsObj = {} ;
			this.bTime = this.$("[name='B_TIME']").datetimepicker("value");
			this.eTime = this.$("[name='E_TIME']").datetimepicker("value"); 
			this.emsType = this.$("[name='EMS_TYPE']").combobox('value');
			this.ems = this.$("[name='EMS']").combobox('value');
			
			var sql ="with distinct_inst as	\n"
					+" (select distinct a.ftp_ip, a.ftp_user, b.ems_type_rel_id	\n"
					+"    from pm_task_collect_inst_log a, pm_adapter_info b	\n"
					+"   where a.adapter_no = b.adapter_no	\n"
					+"	  and btime >= to_date('"+this.bTime+"','yyyy-mm-dd')  \n"
					+"	  and etime <= to_date('"+this.eTime+"','yyyy-mm-dd') \n"
					+" )	\n"
					+"select distinct a.ems_name, b.ems_code, c.ftp_ip, c.ftp_user	\n"
					+"  from pm_ems a, pm_ems_type_rel b, distinct_inst c	\n"
					+" where a.ems_code = b.ems_code	\n"
					+"   and b.ems_type_rel_id = c.ems_type_rel_id(+)	\n"
					+(this.emsType?" and b.ems_type_rel_id in (select ems_type_rel_id from pm_ems_type_rel r where r.ems_type_code = '"+this.emsType+"') \n":"")
					+(this.ems?" and b.ems_code = '"+this.ems+"'	\n":"")
					+" order by ems_name	\n";
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data){ 
					fish.forEach(data.resultList, function(result) {
						var emsCode = result['EMS_CODE'] ;
						if(this.emsObj[emsCode]){
							if(this.emsObj[emsCode]['FTP_IP']){
								this.emsObj[emsCode]['FTP_IP'].push(result['FTP_IP']);
							}else{
								this.emsObj[emsCode]['FTP_IP'] = [result['FTP_IP']];
							}
							if(this.emsObj[emsCode]['FTP_USER']){
								this.emsObj[emsCode]['FTP_USER'].push(result['FTP_USER']);
							}else{
								this.emsObj[emsCode]['FTP_USER'] = [result['FTP_USER']];
							}
						}else{
							this.emsObj[emsCode] = {'EMS_NAME':result['EMS_NAME'],'FTP_IP':[result['FTP_IP']],'FTP_USER':[result['FTP_USER']]}
						}
					}.bind(this));
					
					
					
					$.each(this.emsObj, function(emsCode, obj) {  
						this.$(".js-collect-log-qry-tab").tabs("add",{
							active:true,
							id:emsCode,
							label:obj['EMS_NAME'],
							content:this.tabs(this.i18nData),
						}); 
						this.resize();
						this.loadGrid(emsCode);
					}.bind(this));
					
				}
			}.bind(this),true);	
			
		},
		
		loadGrid: function(emsCode){
			var $emsDiv = this.$(".js-collect-log-qry-tab div[id="+emsCode+"]") ;
			$emsDiv.find(".js-collect-log-ems-label").html("<b>"+this.emsObj[emsCode]['EMS_NAME']+"</b>");
			$emsDiv.find(".js-collect-log-ftp-svr-label").html("<b>"+this.emsObj[emsCode]['FTP_IP']+"</b>");
			$emsDiv.find(".js-collect-log-ftp-user-label").html("<b>"+this.emsObj[emsCode]['FTP_USER']+"</b>"); 
			var $grid = $emsDiv.find(".js-collect-log-data-grid");
			//COLLECT_MONAME,SOURCE_FILE_NAME,TASK_STATE,BTIME,SOURCE_FILE_TIME,REMOTE_PATH
			this.Grid = $grid.jqGrid({
				colModel: this.colModel,
				shrinkToFit:true,
				pagebar: true,
				pager: true,
				rowNum: 20,
			    rowList: [10, 20, 50, 100],
			    datatype: 'json',
			    rownumbers:true,
			   	pageData: function(page, rowNum){
			   		this.loadGridData(emsCode,page, rowNum);
			   		return false;
			   	}.bind(this),
			});
			
			this.$("[role='columnheader']").css("background-color", "#039cfd");
			this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
			this.loadGridCount(emsCode,1,null);
		},
		loadGridCount: function(emsCode,page, rowNum){
			var sql ="select count(1) as count	\n"
					+"  from (	\n"
					+"	 select 1 from pm_task_collect_inst_log a,pm_adapter_info b 	\n"
					+"	where  a.adapter_no = b.adapter_no \n"
					+"	 and b.ems_code = '"+emsCode+"'  \n"
					+"	 and a.btime >= to_date('"+this.bTime+"','yyyy-mm-dd')  \n"
					+"	 and a.etime <= to_date('"+this.eTime+"','yyyy-mm-dd') \n"
					+(this.emsType?" and b.ems_type_rel_id in (select ems_type_rel_id from pm_ems_type_rel r where r.ems_type_code = '"+this.emsType+"') \n":"")
					+") s	\n"	;		
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					if(data.resultList.length > 0){
						this.emsObj[emsCode]['dataCount'] = data.resultList[0]['COUNT'];
						this.loadGridData(emsCode,page, rowNum);
					}
				}
			}.bind(this),true);			
		},
		loadGridData: function(emsCode,page, rowNum){
			
			var $grid = this.$(".js-collect-log-qry-tab div[id="+emsCode+"]").find(".js-collect-log-data-grid");
			rowNum = rowNum || $grid.jqGrid("getGridParam", "rowNum");
			if(!rowNum) return false;
			var sql ="select collect_moname,source_file_name,task_state,	\n"
       				+"   to_char(btime, 'yyyy-mm-dd hh24:mi:ss') as btime,	\n"
       				+"   source_file_time,remote_path,	\n"
       				+"   (select b.ems_type from pm_ems_type_rel a,pm_ems_type b \n"
       				+"     where a.ems_type_code = b.ems_type_code \n"
       				+"      and a.ems_type_rel_id = w.ems_type_rel_id) as ems_type	\n"
					+"  from ( select rownum as num, s.* from (	\n"
					+"	 select a.*,b.ems_type_rel_id \n"
					+"	  from pm_task_collect_inst_log a,pm_adapter_info b \n"
					+"	where  a.adapter_no = b.adapter_no \n"
					+"	 and b.ems_code = '"+emsCode+"'  \n"
					+"	 and a.btime >= to_date('"+this.bTime+"','yyyy-mm-dd')  \n"
					+"	 and a.etime <= to_date('"+this.eTime+"','yyyy-mm-dd') \n"
					+(this.emsType?" and b.ems_type_rel_id in (select ems_type_rel_id from pm_ems_type_rel r where r.ems_type_code = '"+this.emsType+"') \n":"")
					+" ) s ) w	\n"
					+" where w.num > "+parseInt((page-1)*rowNum)+" and w.num <= "+parseInt(page*rowNum);
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
		
	});
});