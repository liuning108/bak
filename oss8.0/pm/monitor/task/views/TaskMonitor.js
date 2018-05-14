portal.define([
	'text!oss_core/pm/monitor/task/templates/TaskMonitor.html',
	"oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
	'i18n!oss_core/pm/monitor/task/i18n/task.monitor',
	'oss_core/pm/monitor/task/actions/TaskMonitorAction',
	'oss_core/pm/util/views/Util',
],function(taskTpl, echarts, i18nDim, taskAction, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(taskTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nDim),
		events: {
			'click .js-task-monitor-tab':'switchTab',
			'click .js-task-monitor-grid-click':'cellLinkClick',
			'click .js-task-monitor-search':'taskSearch',
			'click .js-task-monitor-reset':'taskReset',
			'click .js-task-inst-monitor-search':'taskInstSearch',
			'click .js-task-inst-monitor-reset':'taskInstReset',
			'click .js-task-inst-oper':'taskInstOper',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.taskColModel = [{
				name: 'TASK_NO',
				label: this.i18nData.TASK_NO,
				width: "25",
				sortable: true,
				search: true
			}, {
				name: "TASK_NAME",
				label: this.i18nData.TASK_NAME,
				width: "30",
				sortable: true,
				search: true
			}, {
				name: 'TASK_TYPE',
				label: this.i18nData.TASK_TYPE,
				width: "8",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("TASK_TYPE")),
			}, {
				name: 'TASK_COUNT',
				label: this.i18nData.TASK_COUNT,
				width: "10",
				sortable: true,
				formatter: function (cellvalue, options, rowObject,_act) {
					var rowId = this.taskGrid.jqGrid('getRowid',rowObject);
					if(cellvalue && parseInt(cellvalue) > 0){
                    	return "<a class='js-task-monitor-grid-click' state_name='"+this.i18nData.ALL+"' task_state='' rowid='"+rowId+"' style='text-decoration:underline;color:blue'>" + cellvalue + "</a>";
                    }else{
                    	return cellvalue ;
                    }
                }.bind(this),
			}];
			
			this.taskTypes = pmUtil.paravalue("TASK_TYPE") ;
			this.states = pmUtil.paravalue("MONITOR_TASK_STATE");
			this.initTotalPanel();
			this.initChart();
			this.initGrid();
			
			//this.switchTab(null,this.$("a[tab-content='demo-tabs-box-1']"));
			this.loadData();
			
			this.$("[name='TASK_TYPE']").combobox({
				dataTextField: pmUtil.parakey.name,
		        dataValueField: pmUtil.parakey.val,
		        dataSource:  pmUtil.paravalue("TASK_TYPE")
			});
			this.$("[name='TASK_TYPE_INST']").combobox({
				dataTextField: pmUtil.parakey.name,
		        dataValueField: pmUtil.parakey.val,
		        dataSource:  pmUtil.paravalue("TASK_TYPE")
			});
			this.taskSearch();
		},
		resize: function(){
			if(this.$(".js-task-monitor-grid").is(":visible")){ 
				if(this.$chart){ 
					this.$chart.resize();
				}
				if(this.taskGrid){
					this.taskGrid.jqGrid("setGridHeight",this.$(".js-task-monitor-div").height() - 405);
				}
			}
			
			if(this.$(".js-task-monitor-inst-grid").is(":visible")){ 
				if(this.taskInstGrid){
					this.taskInstGrid.jqGrid("setGridHeight",this.$(".js-task-monitor-div").height() - 125);
				}
			}
		},
		switchTab: function(event,target){
			var $target = event?$(event.target):$(target);
			var tabContent = $target.attr("tab-content");
			$target.parent().siblings().removeClass("active");
			$target.parent().addClass("active");
			this.$("#"+tabContent).siblings().removeClass("active in");
			this.$("#"+tabContent).addClass("active in");	
			if(tabContent=='demo-tabs-box-2'){
				this.initInstGrid();
			}
			this.resize();
		},
		initTotalPanel: function(){
			this.$(".js-task-monitor-total-div").empty();
			var width = parseFloat(100/this.states.length);
			
			this.stateCol = [];
			this.stateSumCol = "";
			this.monitorTaskState = "";
			fish.forEach(this.states, function(state,index) {
				var val = JSON.parse(state[pmUtil.parakey.val]);
				if(val['db_col']){
	        		this.$(".js-task-monitor-total-div").append(
		        		"<div class='col-md-2' style='width:"+width+"%'>	\n"
		        		+"    <div class='panel panel-show wrapper text-center' state_col='"+val['db_col']+"'>	\n"
						+"            <img src='"+val['img']+"' style='width: 32px;float:left' /> \n" 
						+"            <h6 style='font-size:20px'>"+state[pmUtil.parakey.name]+"</h6>	\n"
						+"            <h3 style='color:"+val['color']+"'>0</h3>	\n"
						+"    </div>	\n"
						+"</div>	\n"
	        		);
	        		this.stateCol.push({'code':val['db_col'],'name':state[pmUtil.parakey.name],'color':val['color']});
	        		this.taskColModel.push(
	        		{
						name: val['db_col'].toUpperCase(),
						label: state[pmUtil.parakey.name],
						width: "10",
						sortable: true,
						formatter: function (cellvalue, options, rowObject,_act) {
							var rowId = this.taskGrid.jqGrid('getRowid',rowObject);
							if(cellvalue && parseInt(cellvalue) > 0){
                            	return "<a class='js-task-monitor-grid-click' state_name='"+state[pmUtil.parakey.name]+"' task_state='"+val['task_state']+"' rowid='"+rowId+"' style='text-decoration:underline;color:blue'>" + cellvalue + "</a>";
                            }else{
                            	return cellvalue ;
                            }
                        }.bind(this),

					});
					if(val['task_state']){
						this.stateSumCol += ", sum(case when n.task_state in ("+val['task_state']+") then n.num else 0 end) as "+val['db_col'] +"\n";
						this.monitorTaskState += " when task_state in ("+val['task_state']+")  then '"+val['db_col']+"' \n";
					}
				}
				
			}.bind(this));
			
			if(this.monitorTaskState){
				this.monitorTaskState = " ( case "+this.monitorTaskState+" end ) as monitor_task_state \n" ;
			}else{
				this.monitorTaskState = " '' as monitor_task_state \n"
			}
			
		},
		initChart: function(){
			
			this.$chart = echarts.init(this.$(".js-task-monitor-chart")[0]);
			
		},
		initGrid: function(){
			
			var $grid = this.$(".js-task-monitor-grid");
			this.taskGrid = $grid.jqGrid({
				colModel: this.taskColModel,
				pagebar: false,
			});
			
		},
		loadData: function(){
			this.legendData = [];
			this.yAxisData = [];
			this.seriesData = [];
			
			var nullData = [];
			fish.forEach(this.taskTypes, function(task_type,index) {
				nullData.push(0);
			}.bind(this));
			
			fish.forEach(this.stateCol, function(col,index) {
				this.legendData.push(col['name']);
				this.seriesData.push(
					{
			            name: col['name'],
			            code: col['code'],
			            type: 'bar',
			            
			            stack: '总量',
			            label: {
			                normal: {
			                    //show: true,
			                    position: 'insideRight'
			                }
			            },
			            itemStyle: {normal: {color:col['color']}},
			            data: nullData.concat(), //[], //320, 302, 301, 334, 390, 330, 320
			        }
			    );
			}.bind(this));
			
			
			this.$("div[state_col]").find('h3').attr('number','0');
			this.$("div[state_col]").find('h3').html('0');
			
			var sql ="select n.task_type,	\n"
					+" sum(n.num) as task_count \n"
					+ this.stateSumCol
					+"  from (select s.task_no, s.task_type, s.task_state, count(1) as num	\n"
					+"          from (select task_no, task_type, task_state	\n"
					+"                  from pm_task_inst	\n"
					+"                 where task_exec_date <= sysdate	\n"
					+"                union all	\n"
					+"                select task_no, task_type, task_state	\n"
					+"                  from pm_task_inst_his	\n"
					+"                 where to_char(arch_time, 'yyyy-mm-dd') =	\n"
					+"                       to_char(sysdate, 'yyyy-mm-dd')) s	\n"
					+"         group by s.task_no, s.task_type, s.task_state) n	\n"
					+" group by n.task_type	\n";
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data){ 
					var taskTypeData = {};
					fish.forEach(data.resultList, function(result) {
						var isExist = false;
						fish.forEach(this.taskTypes, function(task_type,index) {
							if(task_type[pmUtil.parakey.val] == result['TASK_TYPE']){
								this.setSeriesData(result, index);
								isExist = true;
								return false;
							}
						}.bind(this));
						
						if(!isExist){
							var nTaskType = {};
							nTaskType[pmUtil.parakey.val] = result['TASK_TYPE'];
							nTaskType[pmUtil.parakey.name] = result['TASK_TYPE'];
							this.taskTypes.push(nTaskType);
							this.setSeriesData(result, this.taskTypes.length-1);
						}
					}.bind(this));
					
					this.loadChart();
				}
			}.bind(this));	
		},
		setSeriesData:function(result,index){

			fish.forEach(this.seriesData, function(series) { 

				var col = series['code'] ;
				
				if(col){
					var $div = this.$("div[state_col='"+col+"']") ;
					var val = result[col.toUpperCase()];
					var num = $div.attr('number');
					$div.attr('number',parseInt(num?num:0)+parseInt(val?val:0));
					$div.find('h3').html($div.attr('number'));
					
					var data = series['data'] ;
					if(!data) data = [];
					var oldVal = data[index];
					
					data[index] = parseInt(oldVal?oldVal:0)+parseInt(val?val:0) ;
					
				}
				
			}.bind(this));
			
		},
		loadChart: function(){
			fish.forEach(this.taskTypes, function(task_type,index) {
				this.yAxisData.push(task_type[pmUtil.parakey.name]);
			}.bind(this));
			
			var chartOption = {
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    legend: {
			        data: this.legendData,//['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
			    },
			    grid: {
			        left: '5',
			        right: '10',
			        bottom: '5',
			        top: '25',
			        containLabel: true
			    },
			    xAxis:  {
			        type: 'value'
			    },
			    yAxis: {
			        type: 'category',
			        data: this.yAxisData,//['周一','周二','周三','周四','周五','周六','周日']
			    },
			    series: this.seriesData,
			};
			
			this.$chart.setOption(chartOption);
			
		},
		cellLinkClick:function(event){
 			var rowid = $(event.target).attr("rowid");
 			var task_state = $(event.target).attr("task_state");
 			var state_name = $(event.target).attr("state_name");
			var rowdata = this.taskGrid.jqGrid('getRowData',rowid); 
			
			var task_name = rowdata['TASK_NAME'];
			var task_type = rowdata['TASK_TYPE'];
			var task_type_name = task_type;
			var task_no = rowdata['TASK_NO'];
			fish.forEach(this.taskTypes, function(taskType,index) {
				if(taskType[pmUtil.parakey.val] == task_type){
					task_type_name = taskType[pmUtil.parakey.name];
					return false;
				}
			}.bind(this));
			var dataPath = "/"+	task_type_name +"/"+	task_name +"/"+ state_name ;
			this.$(".js-task-monitor-inst-data-path").html(dataPath);
			this.switchTab(null,this.$("a[tab-content='demo-tabs-box-2']"));
			this.instParams = {task_no:task_no,task_type:task_type,task_state:task_state} ;
			this.taskInstReset();
			this.$(".js-task-type-inst-div").hide();
			this.loadInstGrid();
		},
		
		initInstGrid: function(){
			if(!this.taskInstGrid){
				
				var colModel = [{
					name: '',
					label: '',
					width: 80,
					sortable:false, 
					formatter: function(cellval, opts, rwdat, _act) {
						var rowId = this.taskInstGrid.jqGrid('getRowid',rwdat);
						var taskId = rwdat['TASK_ID'];
						var state = rwdat['MONITOR_TASK_STATE'] ;
						var attr = ' rowid="'+rowId+'"'+' task_id="'+taskId+'"';
						var execution = "";
						var archive = "";
								
						if(state=='fail'){
							execution ='<button type="button" '+attr+' oper="reexec" class="btn btn-link js-task-inst-oper" title="'+this.i18nData.RE_EXCE+'"><i class="fa fa-reply" ></i></button>' ;
						}else{
							execution ='<button type="button" class="btn btn-link"></button>' ;
						}
						
						if(state!='handling' && state!='archived'){ 
							archive = '<button type="button" '+attr+' oper="archive" class="btn btn-link js-task-inst-oper" title="'+this.i18nData.ARCHIVE+'"><i class="fa fa-archive"></i></button>' ;
				        }else{
				        	archive = '<button type="button" class="btn btn-link" ></button>' ;
						}
						return '<div class="btn-group">'+execution+archive+'</div>';
			            
			        }.bind(this),
				}, {
					name: '',
					label: '',
					width: 80,
					sortable:false, 
					formatter: function(cellval, opts, rwdat, _act) {
						var state = rwdat['MONITOR_TASK_STATE'] ;
						
						var stateObj = {};
						
						fish.forEach(this.stateCol, function(col,index) {
							
							if(col['code'] == state){
								stateObj = col ;
								return false;
							}
						});
						return '<span style="color:'+stateObj['color']+'">'+stateObj['name']+'</span>';
			            
			        }.bind(this),
				}, {
					name: 'TASK_ID',
					label: this.i18nData.TASK_ID,
					width: 200,
					sortable: true,
				}, {
					name: 'TASK_NO',
					label: this.i18nData.TASK_NO,
					width: 200,
					sortable: true,
				}, {
					name: "TASK_NAME",
					label: this.i18nData.TASK_NAME,
					width: 250,
					sortable: true,
				}, {
					name: 'TASK_TYPE',
					label: this.i18nData.TASK_TYPE,
					width: 100,
					sortable: true,
					formatter: "select",
					editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("TASK_TYPE")),
				}, {
					name: "TASK_SERV_IP",
					label: 'TASK_SERV_IP',
					width: 150,
					sortable: true,
				}, {
					name: "TASK_SERV_USER",
					label: 'TASK_SERV_USER',
					width: 150,
					sortable: true,
				}, {
					name: "TASK_EXCEPT_INFO",
					label: 'TASK_EXCEPT_INFO',
					width: 250,
					sortable: true,
				}];
				var colArr = ["BTIME",
					"ETIME",
					"DELAY_TIME",
					"TASK_CREATE_DATE",
					"TASK_EXEC_DATE",
					"TASK_FINISH_DATE",
					"TASK_EXEC_DURATION",
					"TASK_EXEC_TIMES"] ;
				
				fish.forEach(colArr, function(col,index) {
					colModel.push({
						name: col,
						label: col,
						width: 100,
						sortable: true,
					});
				}.bind(this));
				
				
				var $grid = this.$(".js-task-monitor-inst-grid");
				this.taskInstGrid = $grid.jqGrid({
					colModel: colModel,
					pagebar: false,
					shrinkToFit: false,
				});
			}
		},
		loadInstGrid: function(){
			var condition = "";
			var taskType = this.$("[name='TASK_TYPE_INST']").combobox('value');
			var taskName = this.$('.js-task-inst-monitor-search-input').val();
			
			if(taskName && $.trim(taskName)){
				taskName = $.trim(taskName) ;
			}
			if(this.instParams){
				condition = (this.instParams['task_no']?" and task_no = '"+this.instParams['task_no']+"' \n":"")
					+ (this.instParams['task_type']?" and task_type = '"+this.instParams['task_type']+"' \n":"")
					+ (this.instParams['task_state']?" and task_state in ("+this.instParams['task_state']+") \n":"") ;
				}
			var sql ="select task_no,					         \n"
						+"       task_id,                            \n"
						+"       task_name,                          \n"
						+"       task_type,                          \n"
						+"       task_serv_ip,                       \n"
						+"       task_serv_user,                     \n"
						+"       task_except_info,                   \n"
						+"       btime,                              \n"
						+"       etime,                              \n"
						+"       delay_time,                         \n"
						+"       task_create_date,                   \n"
						+"       task_exec_date,                     \n"
						+"       task_finish_date,                   \n"
						+"       task_exec_duration,                 \n"
						+"       task_exec_times,                    \n"
						+ this.monitorTaskState
						+"  from pm_task_inst                        \n"
						+" where task_exec_date <= sysdate           \n"
						+ (condition?condition:"")
						+(taskType?" and task_type = '"+taskType+"'":'')
						+(taskName?" and upper(task_name) like '%'||upper('"+taskName+"')||'%' \n":"")
						+"union all                                  \n"
						+"select task_no,                            \n"
						+"       task_id,                            \n"
						+"       task_name,                          \n"
						+"       task_type,                          \n"
						+"       task_serv_ip,                       \n"
						+"       task_serv_user,                     \n"
						+"       task_except_info,                   \n"
						+"       btime,                              \n"
						+"       etime,                              \n"
						+"       delay_time,                         \n"
						+"       task_create_date,                   \n"
						+"       task_exec_date,                     \n"
						+"       task_finish_date,                   \n"
						+"       task_exec_duration,                 \n"
						+"       task_exec_times,                    \n"
						+ this.monitorTaskState
						+"  from pm_task_inst_his                    \n"
						+" where to_char(arch_time, 'yyyy-mm-dd') = to_char(sysdate, 'yyyy-mm-dd')	\n"
						+ (condition?condition:"") 
						+(taskType?" and task_type = '"+taskType+"'":'')
						+(taskName?" and upper(task_name) like '%'||upper('"+taskName+"')||'%' \n":"") ;

				//alert(sql);
				pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
					if(data){ 
						_.delay(function () {
					        this.taskInstGrid.jqGrid("reloadData", data.resultList);
					    }.bind(this), 100);
					}
				}.bind(this));
		},
		
		taskSearch: function(){
			this.loadTaskGrid();
		},
		taskReset: function(){
			this.$('.js-task-monitor-search-input').val('');
			this.$("[name='TASK_TYPE']").combobox('value','');
		},
		taskInstSearch: function(){
			this.loadInstGrid();
		},
		taskInstReset: function(){
			this.$('.js-task-inst-monitor-search-input').val('');
			this.$("[name='TASK_TYPE_INST']").combobox('value','');
		},
		loadTaskGrid:function(){
			var taskType = this.$("[name='TASK_TYPE']").combobox('value');
			var taskName = this.$('.js-task-monitor-search-input').val();
			
			if(taskName && $.trim(taskName)){
				taskName = $.trim(taskName) ;
			}
			var sql ="select n.task_no, t.task_name, n.task_type,	\n"
					+" sum(n.num) as task_count \n"
					+ this.stateSumCol
					+"  from (select s.task_no, s.task_type, s.task_state, count(1) as num	\n"
					+"          from (select task_no, task_type, task_state	\n"
					+"                  from pm_task_inst	\n"
					+"                 where task_exec_date <= sysdate	\n"
					+(taskType?" and task_type = '"+taskType+"'":'')
					+"                union all	\n"
					+"                select task_no, task_type, task_state	\n"
					+"                  from pm_task_inst_his	\n"
					+"                 where to_char(arch_time, 'yyyy-mm-dd') =	\n"
					+"                       to_char(sysdate, 'yyyy-mm-dd') \n"
					+(taskType?" and task_type = '"+taskType+"' \n":"")
					+"	) s	\n"
					+"         group by s.task_no, s.task_type, s.task_state) n	\n"
					+"  left join pm_task_info t	\n"
					+"    on n.task_no = t.task_no	\n"
					+(taskName?" where upper(t.task_name) like '%'||upper('"+taskName+"')||'%' \n":"")
					+" group by n.task_no, t.task_name, n.task_type	\n";
					//alert(sql);
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data){ 
					_.delay(function () {
				        this.taskGrid.jqGrid("reloadData", data.resultList);
				    }.bind(this), 100);
				}
			}.bind(this));	
		},
		taskInstOper: function(event){ 
			var oper = $(event.target).attr("oper");
			var rowid = $(event.target).attr("rowid");
 			var task_id = $(event.target).attr("task_id");
 			
 			if(oper=='reexec'){
 				var options = {
 						i18nData : this.i18nData,
						pmUtil:pmUtil,
 					};
 				fish.popupView({
					url: "oss_core/pm/monitor/task/views/DateInput",
					viewOption: options,
					callback: function(popup, view) {
						
					}.bind(this),
					close: function(retData) {
						if(!retData) retData = {};
						retData['task_id'] = task_id ;
						retData['rowid'] = rowid ;
						this.operTask(oper,retData);
					}.bind(this),
				});
 			}else if(oper=='archive'){
 				fish.confirm((this.i18nData.CONFIRM_ARCHIVE).replace('$1',task_id),function(t) {
					this.operTask(oper,{'task_id':task_id,'rowid':rowid});	
				}.bind(this));
 			}
		},
		operTask: function(oper,param){
			var sql ;
			var rowid = param['rowid'] ;
			if(oper=='reexec'){
				sql = "update pm_task_inst set task_state = '0' ,task_exec_date = to_date('"+param['TASK_EXEC_DATE']+"','yyyy-mm-dd hh24:mi:ss') where task_id = '"+param['task_id']+"' ";
			}else if(oper=='archive'){
				sql = "update pm_task_inst set task_state = '3'  where task_id = '"+param['task_id']+"'";
			}
			if(!sql) return false;
			pmUtil.utilAction.qryScriptResult({SCRIPT:sql,TYPE:'update'},function(data) {
				if(data){ 
					var rowdata = this.taskInstGrid.jqGrid('getRowData',rowid); 
					if(oper=='reexec'){
						this.taskInstGrid.jqGrid("setRowData",fish.extend({}, rowdata, {MONITOR_TASK_STATE:'waiting'}));
					}else if(oper=='archive'){
						this.taskInstGrid.jqGrid("setRowData",fish.extend({}, rowdata, {MONITOR_TASK_STATE:'archived'}));
					}
					this.taskInstGrid.trigger("reloadGrid");
					fish.success(this.i18nData.OPER_SUCC );
				}
			}.bind(this));
		},
		
	});
});