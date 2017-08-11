portal.define([
	'text!oss_core/pm/config/task/templates/TaskModal.html',
	'text!oss_core/pm/config/task/templates/BaseInfo.html',
],function(modalTpl, baseInfoTpl){
	return portal.BaseView.extend({
		template: fish.compile(modalTpl),
		baseInfoHtml: fish.compile(baseInfoTpl),
		//scheduleHtml: fish.compile(scheduleTpl),
		events: {
			"click .js-nav-tabs":'clickNavTabs',
			"click .js-task-previous-btn":'previousTab',
			"click .js-task-next-btn":'nextTab',
		},
		initialize: function(options) {
			this.options = options ;
			this.bpId = options.bpId;
			this.operType = options.operType;
			this.i18nData =	options.i18nData;
			this.taskAction = options.taskAction;
			this.pmUtil = options.pmUtil;
			this.EMS_CODE = options.EMS_CODE;
			this.EMS_TYPE_REL_ID =	options.EMS_TYPE_REL_ID;
			this.EMS_VER_CODE	=	options.EMS_VER_CODE;
			this.datas = options.datas;
			this.task_type = options.task_type;
			
			this.scheduleInit=[
					{
						'CYCLE_SCHDULE_TYPE':'0',
						'RUNTIME_SETING_FLAG':false, 
						'TRIGGER_DATE': this.pmUtil.sysdate('date'),
						'TRIGGER_TIME': "1:0",
					},{
						'CYCLE_SCHDULE_TYPE':'1',
						'RUNTIME_SETING_FLAG':false,
						'TRIGGER_TIME': "1:0",
						'EFF_DATE': this.pmUtil.sysdate('date'),
						'EXP_DATE': this.pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), parseInt(this.pmUtil.parameter("defaultNYear").val()))),
						'INTERVAL_PERIOD': "15",
					},{
						'CYCLE_SCHDULE_TYPE':'2',
						'RUNTIME_SETING_FLAG':false,
						'TRIGGER_TIME': "1:0",
						'EFF_DATE': this.pmUtil.sysdate('date'),
						'EXP_DATE': this.pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), parseInt(this.pmUtil.parameter("defaultNYear").val()))),
						'INTERVAL_PERIOD': "1",
					},{
						'CYCLE_SCHDULE_TYPE':'3',
						'RUNTIME_SETING_FLAG':false,
						'TRIGGER_TIME': "1:0",
						'EFF_DATE': this.pmUtil.sysdate('date'),
						'EXP_DATE': this.pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), parseInt(this.pmUtil.parameter("defaultNYear").val()))),
						'INTERVAL_PERIOD': "1",
					},{
						'CYCLE_SCHDULE_TYPE':'4',
						'RUNTIME_SETING_FLAG':false,
						'TRIGGER_TIME': "1:0",
						'EFF_DATE': this.pmUtil.sysdate('date'),
						'EXP_DATE': this.pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), parseInt(this.pmUtil.parameter("defaultNYear").val()))),
						'INTERVAL_PERIOD': "1",
						'MW': [1],
					},{
						'CYCLE_SCHDULE_TYPE':'5',
						'RUNTIME_SETING_FLAG':false,
						'TRIGGER_TIME': "1:0",
						'EFF_DATE': this.pmUtil.sysdate('date'),
						'EXP_DATE': this.pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), parseInt(this.pmUtil.parameter("defaultNYear").val()))),
						'INTERVAL_PERIOD': "1",
						'MW': [1,2,3,4,5,6,7,8,9,10,11,12],
					}
                ];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			this.$("#js-task-wizard-tab1").html(this.baseInfoHtml(this.i18nData));
			portal.require(['oss_core/pm/util/views/ScheduleView'],
				function(schedule){
	                this.scheduleView = new schedule();
	                $('#js-task-wizard-tab2').html(this.scheduleView.render().$el);
	                var options = {'dateformat':this.pmUtil.parameter("dateFormat").val()} ;
	                if(this.task_type=='02'){
	                	options['visible'] = {'type':'show','tabs':[1,2,3]} ;
	                	options['mode']	= 'multiple' ;
	                }else{
	            		options['visible'] = {'type':'show','tabs':[1,2,3,4,5]}  ;
	            	}
	                this.scheduleView.afterRender(options);
	                this.scheduleView.setAll(this.scheduleInit);
	                if(this.datas && this.datas.TASK_NO){
						var param = {"TASK_NO":this.datas.TASK_NO, "TYPE":"schdule"};
						this.taskAction.qryDetail(param, function(data) {
							if (data){
								fish.forEach(data.schduleList, function(schdule,index) {
									schdule['RUNTIME_SETING_FLAG'] = true;
									this.scheduleView.set(schdule);
								}.bind(this));
							}
						}.bind(this));
	                }
	            }.bind(this)
            );
			
			return this;
		},
		
		afterRender: function(){
			if(this.operType=="edit"){
				$(".js-task-detail-title").html(this.i18nData.TASK_EDIT);
			}else{
				$(".js-task-detail-title").html(this.i18nData.TASK_NEW);
			}
			this.$form = this.$(".js-task-detail-form");
			this.$form.find("[name='TASK_TYPE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("TASK_TYPE")
			});
			this.$form.find("[name='TASK_TYPE']").combobox('disable');
			this.$form.find("[name='TASK_TYPE']").on('combobox:change', function () {
				var taskType = this.$form.find("[name='TASK_TYPE']").combobox('value');
				var detailUrl;
				if(taskType=='00'){//采集任务
					detailUrl = 'oss_core/pm/config/task/views/CollectDetail';
				}else if(taskType=='01'){//计算任务
					detailUrl = 'oss_core/pm/config/task/views/ComputeDetail';
				}else if(taskType=='03'){//告警任务
					detailUrl = 'oss_core/pm/config/task/views/AlarmDetail';
				}else if(taskType=='02'){//数据汇聚
					detailUrl = 'oss_core/pm/config/task/views/AggDetail';
				}else if(taskType=='05'){//数据抽取
					detailUrl = 'oss_core/pm/config/task/views/ExtDetail';
				}
				if(detailUrl){
					portal.require([detailUrl], 
						function (detail) {
							this.detailView = new detail(this.options);
			                this.$('#js-task-wizard-tab3').append(this.detailView.render().$el);
			                this.detailView.domComplete();
			            }.bind(this)
		            );
		        }
				
			}.bind(this));
			
			if(this.datas){
				
				this.datas["IS_STATE"] = (this.datas["STATE"]=="1")?"on":"off";
				this.$form.find("[name='TASK_TYPE']").combobox('value',this.datas['TASK_TYPE']);
				this.$form.form("value",this.datas);
			}else{
				if(this.task_type){
					this.$form.find("[name='TASK_TYPE']").combobox('value',this.task_type);
				}else{
					this.$form.find("[name='TASK_TYPE']").combobox('value','01');
				}
			}
			
			this.tabSwitch(0);
		},
		ok: function(){
			
			if (!this.$form.isValid()) {
				this.tabSwitch(0);
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
			var schedule,param;
			if(!this.scheduleView){
				this.tabSwitch(1);
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}else{
				schedule = this.scheduleView.getChecked() ;
				if(!schedule || schedule.length < 1){
					this.tabSwitch(1);
					if(schedule && schedule.length < 1){
						fish.info(this.i18nData.TASK_SCHEDULE_NULL);
					}else{
						fish.toast('info', this.i18nData.TIP_INFO);
					}
					return false;
				}
			}
			if(!this.detailView){
				this.tabSwitch(2);
				return false;
			}else{
				param = this.detailView.ok() ;
				if(!param){
					this.tabSwitch(2);
					return false;
				}
			}
			//return false;
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			var that = this;
			var value = fish.extend({}, this.$form.form("value"),{"schduleList": schedule}, param);
			value["STATE"] = (value["IS_STATE"]=="on")?"1":"0";
			value["OPER_TYPE"] = this.operType;
			value["CODE_PREFIX"] = this.pmUtil.parameter("codePrefix").val();
			value["EMS_CODE"] = this.EMS_CODE;
			value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
			value["EMS_VER_CODE"] = this.EMS_VER_CODE;
			value["BP_ID"] = this.bpId; 
			if(this.operType=="edit" && this.datas){
				value["TASK_NO"] = this.datas["TASK_NO"];
			}
			//alert(JSON.stringify(value));
			//return false;
			this.taskAction.operTask(value, function(data) { 
			
				if(this.operType=="edit"){
					fish.success(this.i18nData.TASK_EDIT_SUCCESS);
				}else{
					value["TASK_NO"] = data["TASK_NO"];
					value["OPER_USER_NAME"] = data["OPER_USER_NAME"];
					value["OPER_DATE"] = data["OPER_DATE"];
					fish.success(this.i18nData.TASK_NEW_SUCCESS);
				}
				this.popup.close(value);
			}.bind(this));
		},

		clickNavTabs: function(event,target){
			var $target = target;
			if(event){
				$target = $(event.target)
			}
			
			var tabContent = $target.attr("tab-content");
			$target.parent().siblings().removeClass("active");
			$target.parent().addClass("active");
			$("#"+tabContent).siblings().removeClass("active");
			$("#"+tabContent).addClass("active");
			if(tabContent=='js-task-wizard-tab3'){
				if(this.detailView && this.detailView.refreshEditor){
					this.detailView.refreshEditor(); 
				}
			}
			
			if(tabContent=='js-task-wizard-tab1'){
				this.$(".js-task-previous-btn").hide();
				this.$(".js-task-next-btn").html(this.i18nData.NEXT);
			}else if(tabContent=='js-task-wizard-tab3'){
				this.$(".js-task-previous-btn").show();
				this.$(".js-task-next-btn").html(this.i18nData.SAVE);
			}else{
				this.$(".js-task-previous-btn").show();
				this.$(".js-task-next-btn").html(this.i18nData.NEXT);
			} 
			
			
			return false;
		},
		previousTab:function(){
			this.tabSwitch(null,'previous');			
		},
		nextTab:function(){
			this.tabSwitch(null,'next');
		},
		tabSwitch:function(tabIdx,action){
			var tabNum = $(".js-nav-tabs").length;
			if(action){
				fish.forEach($(".js-nav-tabs"), function(tab,index) {
	        		if($(tab).parent().hasClass("active")){
	        			tabIdx = index;
	        			return false;
	        		}
				}.bind(this));
				if(action=='next'){
					if((tabIdx+1) >= tabNum){
						this.ok();
					}else{
						this.clickNavTabs(null,$(".js-nav-tabs").eq(tabIdx+1));
					}
				}else if(action=='previous'){
					if((tabIdx-1) >= 0){
						this.clickNavTabs(null,$(".js-nav-tabs").eq(tabIdx-1));
					}
				}
			}else{
				this.clickNavTabs(null,$(".js-nav-tabs").eq(tabIdx));
			}
		},
		
	});
});