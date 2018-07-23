portal.define([
	'text!oss_core/pm/config/task/templates/alarm/AlarmDetail.html',
	'text!oss_core/pm/config/task/templates/alarm/AlarmLevelTab.html',
	'text!oss_core/pm/config/task/templates/alarm/AlarmRuleStep.html',
	'oss_core/pm/util/actions/UtilAction',
	'oss_core/pm/meta/dim/actions/DimAction',
	'oss_core/pm/meta/kpi/actions/KpiAction',
	'oss_core/pm/meta/model/busi/actions/ModelBusiAction',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(alarmTpl,alarmLevelTabTpl,alarmRuleTpl, utilAction, dimAction, kpiAction, modelBusiAction, codemirror){
	return portal.BaseView.extend({
		template: fish.compile(alarmTpl),
		alarmLevelTab: fish.compile(alarmLevelTabTpl),
		alarmRule: fish.compile(alarmRuleTpl),
		events: {
			'click .js-alarm-add-step': 'alarmAddStep',
			'click .js-alarm-del-step': 'alarmDelStep',
			
			"click .js-alarm-o-list-add":'getList',
			"click .js-alarm-o-list-ok":'returnList',
			"click .js-alarm-o-list-cancel":'cancelList',
			"click .js-alarm-o-list-close":'closeList',
			"click .js-alarm-o-list-checkbox":'selingList',
			
			"click .js-alarm-rule-set": 'alarmRuleSet',
			"click .js-alarm-rule-kpi-add": 'alarmRuleKpiAdd',
			
			"click .js-busy-hour-sel-all": 'busyHourSelAll',
			"click .js-busy-hour-clear-all": 'busyHourClearAll',
			'keyup .js-alarm-o-list-seling-search':'searchSeling',
			'click .js-alarm-o-list-seling-all':'selingAll',
			'click .js-alarm-level-tab-a':'clickLevelTab',
			
			"click .js-notify-obj-btn":'showNotifyObjBox',
			"click .js-notify-obj-param-btn":'addParam',
			"click .js-alarm-notice-set":'alarmNoticeSet',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.operType = options.operType;
			this.i18nData =	options.i18nData;
			this.taskAction = options.taskAction;
			this.pmUtil = options.pmUtil;
			this.EMS_CODE = options.EMS_CODE;
			this.EMS_TYPE_REL_ID =	options.EMS_TYPE_REL_ID;
			this.EMS_VER_CODE	=	options.EMS_VER_CODE;
			this.datas = options.datas;
			this.seq = 0;
		
			this._L8 = "";
			for(var i=0;i<8;i++){
				this._L8 += "_";
			}
			this.paramModel = [{
				name: "PARAM_CODE",
				label: this.i18nData.PARAM_CODE,
				width: "45",
				editable: true,
				editrules:"required;"
			}, {
				name: 'PARAM_VALUE',
				label: this.i18nData.PARAM_VALUE,
				width: "45",
				editable: true,
				editrules:"required;"
			}, {
				sortable: false,
				label: "",
				width: "10",
				formatter: 'actions',
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.maxRowNum = this.pmUtil.parameter("maxRowNum").val();
			if(!this.maxRowNum) this.maxRowNum = 500;
			this.maxRowNum = parseInt(this.maxRowNum);
			this.$("span[name='spanMaxRow']").text(this.maxRowNum);
			this.pmUtil.extContains();
		},
		domComplete: function(){
			this.editorArr = [];
			this.fieldObj = {}; //{MODEL_BUSI_CODE:[FIELD_CODE]}
			this.modelObj = {}; //{MODEL_BUSI_CODE:MODEL_BUSI_NAME}
			this.$form = $(".js-alarm-detail-form");
			$(".js-alarm-detail-div").slimscroll({height:300,width:770});
			this.loadAlarmLevelTabs();
			
			this.$form.find("[name='ALARMOBJ_TYPE']").combobox({});
			this.$form.find("[name='ALARMOBJ_TYPE']").combobox('setEditable', false);
			
			this.$form.find("[name='MODEL_CODE']").combobox({});
			this.$form.find("[name='GRANU']").combobox({});
			this.$form.find("[name='MODEL_CODE']").combobox('setEditable', false);
			this.$form.find("[name='MODEL_CODE']").on('combobox:change', function () {
				var modelCode = this.$form.find("[name='MODEL_CODE']").combobox('value');
				this.modelComboxChange(modelCode);
			}.bind(this));
			
			this.$form.find("[name='ALARMOBJ_TYPE']").on('combobox:open', function (e) {
				var dimCode = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('value');
				if(dimCode){
		    		fish.toast('info', this.i18nData.ALARMOBJ_TYPE_CHANGE_TIP);
		    	}
		    }.bind(this));
			this.$form.find("[name='ALARMOBJ_TYPE']").on('combobox:change', function () {
				this.changeAlarmObjType();
			}.bind(this));
			
			this.$form.find("[name='ALARM_DATE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("ALARM_DATE")
			});
			this.$form.find("[name='DELAY_TYPE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("DELAY_TYPE")
			});
			this.$form.find("[name='NOTIFY_TYPE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("NOTIFY_TYPE")
			});
			this.$form.find("input[name='NOTIFY_TYPE']").on('combobox:change', function(){
				this.changeNotifyType();
			}.bind(this));
			
			dimAction.qryDim({}, function(data) {
					
				if (data && data.dimList){
					this.dimList = data.dimList;
					this.scriptList = data.scriptList;
					
				}
			}.bind(this));
			var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE,"MODE":'ALL'} ; //,'FIELD_TYPE':'0',"MODE":'DISTINCT'
			modelBusiAction.qryModelField(param, function(data) {
					
				if (data){
					this.$form.find("[name='ALARMOBJ_TYPE']").combobox({
						dataTextField: 'FIELD_NAME',
				        dataValueField: 'KEY', //FIELD_TYPE|FIELD_CODE|DIM_CODE
				        dataSource: data.DIMS
					});
					this.modelField = data.modelField;
					fish.forEach(data.modelField,function(field){
						this.modelObj[field['MODEL_BUSI_CODE']] = {'name':field['MODEL_BUSI_NAME'],'granu':field['GRANU_MODE']} ;
						
						if(this.fieldObj[field['MODEL_BUSI_CODE']]){
			    			this.fieldObj[field['MODEL_BUSI_CODE']].push(field['FIELD_CODE']);
			    		}else{
			    			this.fieldObj[field['MODEL_BUSI_CODE']] = [field['FIELD_CODE']];
			    		}
			    	}.bind(this));
					
					this.kpiList = data.KPIS;
					this.loadAlarmDetailParam();
					
				}
			}.bind(this));
			
			this.loadParamGrid();
			this.$(".js-alarm-notice-set").prop("checked",false);
			this.alarmNoticeSet();
		},
		changeNotifyType:function(val){
			var notifyType = this.$form.find("[name='NOTIFY_TYPE']").combobox('value');
			if(notifyType=="2"){
				this.$(".js-notify-obj-btn").removeClass('hide');
				this.pmUtil.utilAction.qryPluginSpec({'PLUGIN_TYPE':'07'}, function(data) {
					if (data && data.pluginList){
						this.$form.find("[name='NOTIFY_OBJ']").combobox({
							dataTextField: 'PLUGIN_NAME',
					        dataValueField: 'PLUGIN_SPEC_NO',
					        dataSource: data.pluginList
						});
						this.$form.find("[name='NOTIFY_OBJ']").combobox('value',val);
					}
				}.bind(this),true);
			}else{
				this.$form.find("[name='NOTIFY_OBJ']").combobox('destroy');
				this.$(".js-notify-obj-btn").addClass('hide');
				this.$form.find("[name='NOTIFY_OBJ']").val(val);
			}
			
		},
		loadAlarmLevelTabs:function(){
			fish.forEach(this.pmUtil.paravalue("ALARM_LEVEL"),function(para,index){
				var val = JSON.parse(para[this.pmUtil.parakey.val]);
				this.$(".js-alarm-level-ul").append("<li>"
					+"<a href='#demo-tabs-box-"+val['level']+"' style='color:"+val['color']+"' class='js-alarm-level-tab-a'	\"> "
					+"<span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "
					+para[this.pmUtil.parakey.name]+"</a></li>") ;
        		this.$(".js-alarm-level-content").append(this.alarmLevelTab(fish.extend({},this.i18nData,{'alarm-level':val['level'],'alarm-level-name':para[this.pmUtil.parakey.name]})));
        	}.bind(this));
			this.$tab = this.pmUtil.tab(this.$('.js-alarm-level-tab'),{});
		},
		changeAlarmObjType:function(AlarmObjNo){
			var alarmObjType = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('value');
				
			fish.forEach(this.$form.find("div[classify]") , function(classify,index) {
				if(!$(classify).find(".js-alarm-o-list-cancel").hasClass('hide')){//用ok或cacel按钮更准确,因为后面有对add按钮特殊处理逻辑
					this.siwtchBtn(classify);
				}
				$(classify).find(".js-alarm-o-list-ul").empty();
				var dimCode = "";
				if(alarmObjType){ 
					var arr = alarmObjType.split("|");
					if(arr.length > 2 ){
						dimCode = arr[2];
					}
				}
				if($(classify).attr('type')=='dim'){
					var dimScript ;
					fish.forEach(this.scriptList, function(dim,index) {
						if(dim['DIM_CODE'] == dimCode){
							dimScript = dim['DIM_SCRIPT'];
							return false;
						}
					});
					if(!AlarmObjNo) AlarmObjNo = "";

					if(!dimScript){
						$(classify).find(".js-alarm-o-list-ul").append(
							"<textarea name=\"ALARMOBJ_NO\" rows=\"4\"class=\"form-control\" value='"+AlarmObjNo+"' data-rule=\"{{ALARM_O}}:length[1~10240, true]\"  placeholder=\""+this.i18nData.NO_O_SEL_P_INPUT+this.i18nData.FOR_EXAMPLE+":ABC,DEF,XYZ\">"+AlarmObjNo+"</textarea>	\n"
						);
						$(classify).find(".js-alarm-o-list-add").addClass('hide');
					}else{
						$(classify).find(".js-alarm-o-list-add").removeClass('hide');
						if(AlarmObjNo){
							utilAction.qryScriptResult({'DIM_CODE':dimCode,'IDS':AlarmObjNo}, function(data) {
								if (data && data.resultList){
									//this.resultList = data.resultList;
									fish.forEach(data.resultList, function(dimObj,index) {
										this.addMoItem(this.$form.find("div[classify][type='dim']"),dimObj['ID'],dimObj['NAME']);
									}.bind(this));
								}
								
							}.bind(this));
						}
					}
					
				}
			}.bind(this));
			this.resetStep();
			this.setModelCombo();
		},
		
		ok: function(){
			
			if (this.$form.isValid()) {
				
				var that = this;
				this.$form.find(".js-alarm-o-list-seling-item").empty(); //将可选列表清空，防止被取到
				var value = this.$form.form("value");
				var isNotice = this.$(".js-alarm-notice-set").prop("checked");
				if(isNotice){
					value['ALARM_NOTICE'] = '1';
					if(!value['ALARM_DATE'] || !value['DELAY_TYPE'] || !value['NOTIFY_TYPE'] || !value['NOTIFY_OBJ']){
						fish.info(this.i18nData.ALARM_NOTICE_NULL);
						return false;
					}
				}else{
					value['ALARM_NOTICE'] = '0';
				}
				
				var alarmObj = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('getSelectedItem');
				if(alarmObj){
					value['ALARMOBJ_TYPE'] = alarmObj['FIELD_CODE'];
					value['ALARMOBJ_TYPE_NAME'] = alarmObj['FIELD_NAME'];
					if(alarmObj['DIM_CODE']){ 
						value[' ALARMOBJ_DIMCODE'] = alarmObj['DIM_CODE'];
					}
				}
				
				if(!this.$form.find("div[classify][type='dim']").find(".js-alarm-o-list-add").hasClass('hide')){
					value["ALARMOBJ_NO"] = "";
					fish.forEach(this.$form.find("div[classify][type='dim']").find(".js-alarm-o-list-ul .list-group-item"), function(item,index) {
						if(!value["ALARMOBJ_NO"]){
							value["ALARMOBJ_NO"] = $(item).attr("code");
						}else{
							value["ALARMOBJ_NO"] += ","+$(item).attr("code");
						}
					});
				}
				
				value["ALARM_KPI"] = "";
				fish.forEach(this.$form.find("div[classify][type='kpi']").find(".js-alarm-o-list-ul .list-group-item"), function(item,index) {
					if(!value["ALARM_KPI"]){
						value["ALARM_KPI"] = $(item).attr("code");
					}else{
						value["ALARM_KPI"] += ","+$(item).attr("code");
					}
				});

				var stepObj = this.getStepObj();
				if(!stepObj){ 
					return false;
				}
				value['ALARM_LEVEL'] = stepObj['ALARM_LEVEL'];
				value['ALARM_CODE'] = stepObj['ALARM_CODE'];
				if(stepObj["stepList"].length < 1){
					fish.info(this.i18nData.TASK_DETAIL_NULL);
					return false;
				}
				stepObj["paramList"] = [];
				$.each(value, function(code, val) {  
					
					
					if(code =="NOTIFY_OBJ" && value['NOTIFY_TYPE'] == "2"){
				
						var pluginObj = {};
						pluginObj["PLUGIN_NO"] = "";
						pluginObj["CODE_PREFIX"] = this.pmUtil.parameter("codePrefix").val();
						pluginObj["PLUGIN_TYPE"] = '07';
						pluginObj["PLUGIN_SPEC_NO"] = val;
						
						var nofifyObj = this.$form.find("[name='NOTIFY_OBJ']").combobox('getSelectedItem');
						if(nofifyObj){
							pluginObj['PLUGIN_CLASSPATH'] = nofifyObj['PLUGIN_CLASSPATH'];
						}
						
						pluginObj["pluginParam"] = this.$(".js-notify-obj-param-grid").jqGrid("getRowData");
						
						stepObj["paramList"].push( {'PARAM_CODE':'NOTIFY_OBJ', 'PARAM_VALUE':"", 'plugin':pluginObj} );
					}else{
						stepObj["paramList"].push({"PARAM_CODE":code, "PARAM_VALUE":val});
					}
					
				}.bind(this));
				stepObj['PLUGIN_TYPE'] = '07';
				return stepObj;
			}else{
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
		},
		loadAlarmDetailParam: function(){
			
			if(!this.datas || !this.datas.TASK_NO){ 
				return false;
			}
			
			this.taskAction.qryDetail({"TASK_NO":this.datas.TASK_NO, 'TYPE':'param', 'PLUGIN_TYPE':'07','PARAM_CODE':'NOTIFY_OBJ'}, function(data) {
				if (data){
					var paramObj = {};
					fish.forEach(data.paramList, function(param,index) {
						paramObj[param["PARAM_CODE"]] = param["PARAM_VALUE"];
					}.bind(this));
					fish.forEach(this.modelField, function(field) {
						if(field['MODEL_BUSI_CODE'] == paramObj['MODEL_CODE']
							&& field['FIELD_CODE'] == paramObj['ALARMOBJ_TYPE']){
								
								paramObj['ALARMOBJ_TYPE'] = (field['FIELD_TYPE']?field['FIELD_TYPE']:"")
									+"|"+(field['FIELD_CODE']?field['FIELD_CODE']:"")
									+"|"+(field['DIM_CODE']?field['DIM_CODE']:"") 
									+"|"+(field['DATA_TYPE']?field['DATA_TYPE']:"") ;
						}
					});
					
					
					this.$form.form("value",paramObj);
					if(paramObj['NOTIFY_TYPE']=='2'){//告警前传
						if(data.pluginList && data.pluginList.length > 0){
							this.changeNotifyType(data.pluginList[0]['PLUGIN_SPEC_NO']);
							this.$(".js-notify-obj-param-grid").jqGrid("reloadData",data.pluginParam);
							
						}else{
							this.changeNotifyType();
						}
					}else{
						this.changeNotifyType(paramObj['NOTIFY_OBJ']);
					}
					if(paramObj['ALARM_NOTICE']=="1"){
						this.$(".js-alarm-notice-set").prop("checked",true);
					}else{
						this.$(".js-alarm-notice-set").prop("checked",false);
					}
					this.alarmNoticeSet();
					
					this.changeAlarmObjType(paramObj['ALARMOBJ_NO']);
					if(paramObj['ALARM_KPI']){
						fish.forEach(paramObj['ALARM_KPI'].split(","), function(kpiCode,index) {
							
							fish.forEach(this.kpiList, function(kpiObj,index) {
								if(kpiObj['FIELD_CODE'] == kpiCode){
									
									this.addMoItem(this.$form.find("div[classify][type='kpi']"),kpiCode,kpiObj['FIELD_NAME']?kpiObj['FIELD_NAME']:kpiCode);

									return false;
								}
							}.bind(this));
							
						}.bind(this));
					}
					this.setModelCombo();
					this.$form.find("[name='MODEL_CODE']").combobox('value',paramObj['MODEL_CODE']);
					this.modelComboxChange(paramObj['MODEL_CODE'],paramObj['GRANU']);
					//this.$form.find("[name='GRANU']").combobox('value',paramObj['GRANU']);

					fish.forEach(data.stepList, function(step) {
						var stepId = step["TASK_STEP_ID"];
						var paramObj = {"TASK_STEP_ID":stepId};
						fish.forEach(data.stepParamList, function(stepParam,index) {
							if(stepParam["TASK_STEP_ID"] == stepId){
								paramObj[stepParam["PARAM_CODE"]] = (stepParam["PARAM_VALUE"]?stepParam["PARAM_VALUE"]:"")
									+ (stepParam["PARAM_VALUE1"]?stepParam["PARAM_VALUE1"]:"")
									+ (stepParam["PARAM_VALUE2"]?stepParam["PARAM_VALUE2"]:"")
									+ (stepParam["PARAM_VALUE3"]?stepParam["PARAM_VALUE3"]:"")
									+ (stepParam["PARAM_VALUE4"]?stepParam["PARAM_VALUE4"]:"")
									+ (stepParam["PARAM_VALUE5"]?stepParam["PARAM_VALUE5"]:"") ;
							}
						}.bind(this));
						
						var ruleSet = this.$(".js-alarm-level-content").find("[name='ALARM_LEVEL'][value='"+paramObj['ALARM_LEVEL']+"']") ;
						$(ruleSet).attr("checked",'checked'); 
						this.alarmRuleSet(null,ruleSet);
						
						var tabs = $(ruleSet).parents('div[tabs]');
						$(tabs).find("[name='ALARM_CODE']").val(paramObj['ALARM_CODE']?paramObj['ALARM_CODE']:"");
						
						this.alarmAddStep(null,ruleSet,paramObj);
					}.bind(this));
				}
			}.bind(this));
			
		},
		alarmAddStep: function(event,target,paramObj){
			if(!event && !target) return false;
			if(!target) target = event.target ;
			
			var tabs = $(target).parents("div[tabs]");
			$(tabs).find(".js-alarm-step-div").append(this.alarmRule(this.i18nData));
			var stepForm = this.alarmUpdateStepSeq(tabs);
			
			this.loadRuleEditor(stepForm);
			this.paraToRadio($(stepForm).find(".js-alarm-rule-threshold-type"),"THRESHOLD_TYPE");
			this.paraToRadio($(stepForm).find(".js-alarm-rule-busyhour-type"),"BUSYHOUR_TYPE");
			var h24 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23] ;
			fish.forEach(h24,function(hour,index){
        		$(stepForm).find(".js-alarm-rule-busy-hour").append(
        			"<label class=\"checkbox-inline\" ><input type=\"checkbox\" group='BUSY_HOUR' value='"+hour+"'>"+hour+"</label>"
        		);
        	}.bind(this));
			
			
			fish.forEach(this.$form.find("div[classify][type='kpi']").find(".js-alarm-o-list-ul .list-group-item"), function(item,index) {
				
				this.setStepKpi($(item).attr("code"),$(item).attr("value"),stepForm);
			}.bind(this));
			
			if(paramObj){
				$(stepForm).form('value',paramObj);
				if(this.operType=='add'){
					this.seq++;
					$(stepForm).attr("task_step_id",(this._L8+this.seq+this._L8));//生成一个前后8个下划线的临时ID,后台保存时,如果判断是此规则的ID ,则重新生成ID,否则直接使用
				}else{
					$(stepForm).attr("task_step_id",paramObj['TASK_STEP_ID']);
				}
				
				$(stepForm).find("input[type=checkbox][group='BUSY_HOUR']").each(function(){
					
					if((","+paramObj['BUSY_HOUR']+",").indexOf(","+$(this).val()+",") >= 0 ){
						
						$(this).attr("checked","checked");
					}
				});
				fish.forEach(this.editorArr, function(arr,index) {
					if(arr['form'] == stepForm && arr['editor']){
						(arr['editor']).setValue(paramObj['ALARM_RULE']?paramObj['ALARM_RULE']:"");
					}
				});
			}else{
				this.seq++;
				$(stepForm).attr("task_step_id",(this._L8+this.seq+this._L8));//生成一个前后8个下划线的临时ID,后台保存时,如果判断是此规则的ID ,则重新生成ID,否则直接使用
			}
			
		},
		alarmDelStep: function(event){
			var tabs = $(event.target).parents("div[tabs]");
			$(event.target).parents("form").parent().remove(); 	
			this.alarmUpdateStepSeq(tabs);
		},
		alarmUpdateStepSeq:function(tabs){
			var lastForm ;
			fish.forEach($(tabs).find(".js-alarm-step-div form[step_no]"), function(form,index) {
				$(form).find(".js-alarm-step-seq").text(index+1);
				lastForm = form;
			}.bind(this));
			return lastForm;
		},
		
		initMoItem: function(form,code,name){
			$(form).find(".js-alarm-o-list-seling-item").append("<label class=\"checkbox-inline\" title='"+name+"("+code+")"+"'><input type=\"checkbox\" class='js-alarm-o-list-checkbox' code='"+code+"' value='"+name+"'>"+name+"</label>");
		},
		addMoItem: function(form,code,name){
			$(form).find(".js-alarm-o-list-ul").append("<li class='list-group-item' code='"+code+"' value='"+name+"' title='"+name+"("+code+")"+"'>"+name+"<div class=\"listclose\"><i class=\"fa fa-close js-alarm-o-list-close\"></i></div></li>");
		},
		getList: function(event){
			var dimScript;
			var dimCode = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('value');
			if(!dimCode){
				fish.info(this.i18nData.ALARMOBJ_TYPE_SEL);
				return false;
			}
			var classify = $(event.target).parents("div[classify]") ;
			var type = $(classify).attr('type');
			var key_code = '',key_name = '';
			var eachList = [];
			var distinctKpiField = "";
			if(type=='dim'){
				eachList = null; //this.resultList
				key_code = 'ID';
				key_name = 'NAME';
			}else if(type=='kpi'){
				key_code = 'FIELD_CODE';
				key_name = 'FIELD_NAME';
				eachList = this.kpiList;
				distinctKpiField = ","+(this.distinctModelField()).toString()+",";
			}
			
			
			this.siwtchBtn(classify);
			$(classify).find(".js-alarm-o-list-seling-item").empty();
			$(classify).find(".js-alarm-o-list-seling-search").val("");
			$(classify).find(".js-alarm-o-list-seling-all").attr('checked', false);
            $(classify).find(".js-alarm-o-list-seling-all").prop('checked', false);
			
			var initCnt = 0;
			fish.forEach(eachList, function(list,index) {
				
				var isValid = true;
				fish.forEach($(classify).find(".js-alarm-o-list-ul .list-group-item"), function(item,index) {
					if(list[key_code] == $(item).attr("code")){
						isValid = false;
						return false;
					}
				});
				
				if(type=='kpi'){
					if(distinctKpiField.indexOf(","+list[key_code]+",") == -1){
						isValid = false;
					}
				}
				
				if(isValid){
					this.initMoItem(classify,list[key_code],list[key_name]);
					initCnt++;
				}
			}.bind(this));
			if(initCnt<=0){
				$(classify).find(".js-alarm-o-list-seling-item").html(this.i18nData.NO_O_SEL);
			}
		},
		returnList: function(event){
			var classify = $(event.target).parents("div[classify]") ;
			var type = $(classify).attr('type');
			var that = this;
			
			
			var $selingObj = $(classify).find(".js-alarm-o-list-seling-item input[type=checkbox]:checked");
			var $seledObj = $(classify).find(".js-alarm-o-list-ul .list-group-item");
			if($selingObj.length + $seledObj.length > this.maxRowNum){
				fish.info(this.i18nData.BEYOND_MAXIMUM);
				return false;
			}else{
				$selingObj.each(function(){
					that.addMoItem(classify,$(this).attr("code"),$(this).attr("value"));
					if(type=='kpi'){
						that.setStepKpi($(this).attr("code"),$(this).attr("value"));
					}  
				});
				this.siwtchBtn(classify);
				this.setModelCombo();
			}
		},
		cancelList: function(event){
			var classify = $(event.target).parents("div[classify]") ;
			this.siwtchBtn(classify);
		},
		closeList: function(event){
			var classify = $(event.target).parents("div[classify]") ;
			$(event.target).parent().parent().remove();
			if($(classify).attr('type') == 'kpi'){
				this.setModelCombo();
			}
		},
		selingList:function(event){
			var classify = $(event.target).parents("div[classify]") ;
			if($(classify).attr('type') == 'kpi'){
				var distinctKpiField = ","+(this.distinctModelField(true)).toString()+",";
				
				$(classify).find(".js-alarm-o-list-seling-item input[type=checkbox]").each(function(){
					if(distinctKpiField.indexOf(","+$(this).attr('code')+",") == -1){
						$(this).parent().addClass('hide');
					}else{
						$(this).parent().removeClass('hide');
					}
				});
			}
		},
		siwtchBtn:function(form){
			$(form).find(".js-alarm-o-list-add").toggleClass("hide");  
			$(form).find(".js-alarm-o-list-ok").toggleClass("hide");
			$(form).find(".js-alarm-o-list-cancel").toggleClass("hide");
			//$(form).find(".js-alarm-o-list-seled-div").toggleClass("hide");
			$(form).find(".js-alarm-o-list-seling-div").toggleClass("hide");
		},
		
		getStepObj: function(){ 
			var pubForm = this.$form;
			var isValid = true;
			
			var value = {"stepList":[],"stepParamList":[] };
			value['ALARM_LEVEL'] = "";
			value['ALARM_CODE'] = "";
			var isExist = false;
			var isAlarmCode = true;
			var isAlarmRule = true;
			var isValidKpiCode = true;
			fish.forEach(this.$(".js-alarm-level-content").find("[name='ALARM_LEVEL']"), function(level,index) {
				if($(level).is(":checked")){
					isExist = true;
					var alarmLevel = $(level).val();
					var alarmLevelName = $(level).attr("text");
					var alarmCode = $(level).parents("div[tabs]").find("[name='ALARM_CODE']").val();
					alarmCode = $.trim(alarmCode);
					
					
					if(!value['ALARM_LEVEL']){
						value['ALARM_LEVEL'] = alarmLevel;
					}else{
						value['ALARM_LEVEL'] += ","+alarmLevel;
					}
					if(!value['ALARM_CODE']){
						value['ALARM_CODE'] = alarmCode;
					}else{
						value['ALARM_CODE'] += ","+alarmCode;
					}
					
					fish.forEach($(level).parents("div[tabs]").find(".js-alarm-rule-step-div form[step_no]"), function(form,index) {
						
						if(!alarmCode){
							isAlarmCode = false;
							isValid = false;
							return false;
						}
						
						if ($(form).isValid()){
							var stepNo = $(form).attr("step_no");
							var step = {'TASK_STEP_ID':$(form).attr('task_step_id'),'STEP_NO':stepNo ,'TASK_STEP_NAME':$(form).attr("step_name") };
							
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'ALARM_LEVEL', 'PARAM_VALUE':alarmLevel}) );
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'ALARM_LEVEL_NAME', 'PARAM_VALUE':alarmLevelName}) ); 
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'ALARM_CODE', 'PARAM_VALUE':alarmCode}) );
							
							
							var param = $(form).form("value");
							
							if(!$.trim(param['ALARM_RULE'])){
								isAlarmRule = false;
								isValid = false;
								return false;
							}
							var alarmRule = param['ALARM_RULE'] ;
							var r = /\[(.+?)\]/g;
							 
							var kpiCodeArr = alarmRule.match(r);
							
							if(kpiCodeArr && kpiCodeArr.length > 0){
								fish.forEach(kpiCodeArr, function(patternKpiCode) {
									var isKpiCode = false;
									var kpiCode = $.trim(patternKpiCode.replace('[',"").replace(']',"")) ;
									fish.forEach($(pubForm).find("div[classify][type='kpi']").find(".js-alarm-o-list-ul .list-group-item"), function(item) {
										if($(item).attr("code") == kpiCode){
											alarmRule = alarmRule.replace(patternKpiCode, $(item).attr("value"));
											isKpiCode = true;
											return false;
										}
									});
									if(!isKpiCode){
										isValidKpiCode = false;
										isValid = false;
										return false;
									}
									
								});
							}else{
								isValidKpiCode = false;
								isValid = false;
								return false;
							}
							
							param['ALARM_RULE_DESC'] = alarmRule;
							
							$(form).find("input[type=checkbox][group='BUSY_HOUR']:checked").each(function(){
								if(!param['BUSY_HOUR']){
									param['BUSY_HOUR'] = $(this).val();
								}else{
									param['BUSY_HOUR'] += ","+$(this).val();
								}
							});
							$.each(param, function(code, val) {  
								value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':code, 'PARAM_VALUE':val}) );
							}); 
							
							value["stepList"].push( fish.extend({},step,{'STEP_SEQ':value["stepList"].length,'TASK_STEP_SEQ':value["stepList"].length}) ) ;
						}else{
							isValid = false;
							return false;
						}
					});
					
					if(!isValid){
						return false;
					}
				}
			}.bind(this));
			if(!isExist){
				fish.info(this.i18nData.ALARM_LEVEL_ISNULL);
				return false;
			}
			if(!isAlarmCode){
				fish.info(this.i18nData.ALARM_CODE_NULL);
				return false;
			}
			if(!isAlarmRule){
				fish.info(this.i18nData.ALARM_RULE_NULL);
				return false;
			}
			if(!isValidKpiCode){
				fish.info(this.i18nData.ALARM_RULE_KPI_CODE);
				return false;	
			}
			if(!isValid){
				
				return false;
			}else{
				return value;
			}
		},
		resetStep: function(form){
			var forms = [];
			if(form){
				forms.push(form);
			}else{
				forms = $(".js-alarm-step-div form[step_no]");
			}
			fish.forEach(forms, function(stepForm,index) {
				$(stepForm).find(".js-alarm-rule-kpi-seling-ul").empty();
				//$(stepForm).find("[name='ALARM_RULE']").val("");
			});
			this.clearEditors();
		},
		clearEditors: function(){
			fish.forEach(this.editorArr, function(arr,index) {
				if(arr['editor']){
					(arr['editor']).setValue("");
				}
			});
		},
		setStepKpi: function(code,name,form){
			var forms = [];
			if(form){
				forms.push(form);
			}else{
				forms = this.$(".js-alarm-step-div form[step_no]");
			}
			
			fish.forEach(forms, function(stepForm,index) {
				$(stepForm).find(".js-alarm-rule-kpi-seling-ul").append(
					"<li class='ui-sortable-handle'><span title='"+name+"("+code+")'>"+name+"</span><a href='#' class='js-alarm-rule-kpi-add' code='"+code+"' name='"+name+"' >添加</a></li>"
				);
				$(stepForm).find(".js-alarm-rule-kpi-seling-ul").slimscroll({height:140,width:215});
			});
		},
		alarmRuleSet: function(event,target){
			if(!event && !target) return false;
			if(!target) target = event.target;
			var tabs = $(target).parents("div[tabs]");
			if($(target).is(":checked")){
				$(tabs).find(".js-alarm-rule-div").removeClass('hide');
			}else{
				$(tabs).find(".js-alarm-rule-div").addClass('hide');
			}
			var index = this.$('.js-alarm-level-content div[tabs]').index(tabs); 
			this.$tab.checked(index,$(target).is(":checked"));
		},
		alarmRuleKpiAdd: function(event){
			var form = $(event.target).parents("form")[0] ;
			
			fish.forEach(this.editorArr, function(arr,index) {
				if(arr['form'] == form && arr['editor']){
					var val = (arr['editor']).getValue();
					if(val){
						val += "\n"+" AND " ;
					}else{
						val = "";
					}
					(arr['editor']).setValue(val+"["+$(event.target).attr('code')+"] ");
				}
			});
		},
		paraToRadio:function(parent,paraName){
			if(!parent) return "";
			fish.forEach(this.pmUtil.paravalue(paraName),function(para,index){
        		parent.append("<label class=\"radio-inline\">"
							+"    <input type='radio' name='"+paraName+"' class='form-control' value='"+para[this.pmUtil.parakey.val]+"' />"+para[this.pmUtil.parakey.name]
							+"</label> ");
        	}.bind(this));
        	parent.find("input[name='"+paraName+"']").eq(0).prop('checked', 'checked');	
		},
		getFields: function(isSeling){//isSeling {false/null/undefind:'获取当前已设置的字段',true:'需要同时获取正在勾选KPI'}
			var fields = [];
			var alarmObjType = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('value');
			if(alarmObjType){ 
				var arr = alarmObjType.split("|");
				if(arr.length > 1 ){
					fields.push(arr[1]);
				}
			}
			fish.forEach(this.$form.find("div[classify][type='kpi']").find(".js-alarm-o-list-ul .list-group-item"), function(item,index) {
				fields.push($(item).attr("code"));
			});
			if(isSeling){
				var classify = this.$form.find("div[classify][type='kpi']") ;
				$(classify).find(".js-alarm-o-list-seling-item input[type=checkbox]:checked").each(function(){
					fields.push($(this).attr("code"));
				});
			}
			return fields ;
		},
		filterModel: function(isSeling){
			var modelList = [];
			var checkArr  = this.getFields(isSeling);
			
			$.each(this.fieldObj, function(modelCode, fieldArr) {  
				if(this.isContained(fieldArr,checkArr)){
					modelList.push({'MODEL_BUSI_CODE':modelCode,'MODEL_BUSI_NAME':this.modelObj[modelCode]['name']});
				}
			}.bind(this));
			
			return modelList ;
		},
		setModelCombo: function(){
			var oldModelCode = this.$form.find("[name='MODEL_CODE']").combobox('value');
			var isExist = false;
			var modelList = this.filterModel();
			fish.forEach(modelList, function(model) {  
				if(model['MODEL_BUSI_CODE'] == oldModelCode){
					isExist = true;
				}
			}.bind(this));
			
			this.$form.find("[name='MODEL_CODE']").combobox({
				dataTextField: 'MODEL_BUSI_NAME',
		        dataValueField: 'MODEL_BUSI_CODE',
		        dataSource:  modelList
			});
			if(isExist){
				this.$form.find("[name='MODEL_CODE']").combobox('value',oldModelCode);
			}else{
				this.$form.find("[name='MODEL_CODE']").combobox('value',(modelList.length > 0)?modelList[0]['MODEL_BUSI_CODE']:null);
			}
		},
		isContained:function(mainArr,checkArr){
			
		 	var mainStr = ","+mainArr.toString()+",";
		    for(var i = 0, len = checkArr.length; i < len; i++){
		       if(mainStr.indexOf(","+checkArr[i]+",") == -1) return false;
		    }
		    return true;
		},
		distinctModelField: function(isSeling){
			var modelList = this.filterModel(isSeling);
			var distinctField = [];
			fish.forEach(modelList, function(model) {  
				$.merge(distinctField,this.fieldObj[model['MODEL_BUSI_CODE']]);
			}.bind(this));
			
			return $.unique(distinctField);
		},
		busyHourSelAll: function(event){
			var form = $(event.target).parents("form") ;	
			
			$(form).find("input[type=checkbox][group='BUSY_HOUR']").each(function(){
				$(this).attr("checked",true);
				$(this).prop("checked",true);
			});
		},
		busyHourClearAll: function(event){
			var form = $(event.target).parents("form") ;	
			
			$(form).find("input[type=checkbox][group='BUSY_HOUR']").each(function(){
				$(this).attr("checked",false);
				$(this).prop("checked",false);
			});
		},
		refreshEditor:function(){
			fish.forEach(this.editorArr, function(arr,index) {
				if(arr['editor']){
					(arr['editor']).refresh();
				}
			});
		},
		loadRuleEditor:function(form){
			
			var ruleText = $(form).find(":input[name='ALARM_RULE']")[0] ;
    		var editor = codemirror.fromTextArea(ruleText, {
			    mode: 'text/x-plsql',
			    indentWithTabs: true,		    
			    smartIndent: true,
			    lineNumbers: true,
			    matchBrackets : true,
			    
			    //autofocus: true,
			    //scrollbarStyle: 'null',
			});
			editor.setSize('height','150px');
			editor.on("update",function(self){  
				var val = $.trim(self.getValue()); 
				$(ruleText).val(val);
			}.bind(this));
			this.editorArr.push({'editor':editor,'form':form});
		},
		searchSeling: function(event){
			var classify = $(event.target).parents("div[classify]") ;
			var val = $.trim($(event.target).val());
			if($(classify).attr('type')=='dim'){
				if(event.keyCode==13){
					$(classify).find(".js-alarm-o-list-seling-item").empty();
					var alarmObj = this.$form.find("[name='ALARMOBJ_TYPE']").combobox('getSelectedItem');
					if(alarmObj && alarmObj['DIM_CODE']){
						var exAlarmObjNo = "";
						fish.forEach($(classify).find(".js-alarm-o-list-ul .list-group-item"), function(item) {
							if(!exAlarmObjNo){
								exAlarmObjNo = $(item).attr("code");
							}else{
								exAlarmObjNo += ","+$(item).attr("code");
							}
						});
						
						utilAction.qryScriptResult({'DIM_CODE':alarmObj['DIM_CODE'],'NAME':val,'exIDS':exAlarmObjNo,'maxRowNum':this.maxRowNum}, function(data) {
							if (data && data.resultList && data.resultList.length > 0){
								fish.forEach(data.resultList, function(result,index) {
									this.initMoItem(classify,result['ID'],result['NAME']);
								}.bind(this));
							}else{
								$(classify).find(".js-alarm-o-list-seling-item").html(this.i18nData.NO_O_SEL);
							}
						
						}.bind(this));
					}
				}
			}else{
				if(val){
					$(classify).find(".js-alarm-o-list-seling-item label").hide();
					$(classify).find(".js-alarm-o-list-seling-item label").filter(":contains('"+val+"')").show();
				}else{
					$(classify).find(".js-alarm-o-list-seling-item label").show();
				}
			}		
		},
		selingAll:function(event){
			var checked = $(event.target).is(':checked') ;
			var classify = $(event.target).parents("div[classify]") ;
			$(classify).find(".js-alarm-o-list-seling-item input[type=checkbox]:visible").each(function(){
				$(this).attr('checked', checked);
                $(this).prop('checked', checked);
			});
		},
		modelComboxChange:function(modelCode,granu_value){
			
			if(!modelCode || !this.modelObj[modelCode]) return false;
			
			var granu = this.modelObj[modelCode]['granu'];
			
			var granuArr = [];
			if(granu){
				granuArr = JSON.parse(granu);
			}
			
			fish.forEach(granuArr, function(granuObj,index) {
				var isExist = false;
				fish.forEach(this.pmUtil.paravalue("GRANU"), function(para) {
					if(para[this.pmUtil.parakey.val] == granuObj['GRANU']){
						granuObj['GRANU_NAME'] = para[this.pmUtil.parakey.name];
						isExist = true;
						return false;
					}
				}.bind(this));
				if(!isExist){
					granuObj['GRANU_NAME'] = granuObj['GRANU'];
				}
			}.bind(this));
			
			this.$("[name='GRANU']").combobox({
				dataTextField: "GRANU_NAME",
		        dataValueField: "GRANU",
		        dataSource:  granuArr, 
			});
			if(!granu_value) granu_value = '';
			if(granu_value){
				this.$("[name='GRANU']").combobox('value',granu_value);
			}else{
				this.$("[name='GRANU']").combobox('value',(granuArr.length > 0)?granuArr[0]['GRANU']:'');
			}
			
		},
		clickLevelTab:function(){
			this.refreshEditor();
		},
		loadParamGrid: function(){
			var that = this;
			var $grid = this.$(".js-notify-obj-param-grid");
			$grid.jqGrid({
				colModel: this.paramModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				rownumbers:true,
				autowidth:true,
				
				afterEditCell: function (e,rowid,name,value,iRow,iCol) {
					return false;
		        },
				beforeDeleteRow: function(e, rowid, rowdata) {
					that.delParam(rowdata,$grid);
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					return false;
				}.bind(this)
			});
		},
		showNotifyObjBox: function(){
			this.$('.js-notify-obj-param-box').toggleClass('fadeInUp animated block');
			this.$(".js-notify-obj-param-grid:visible").jqGrid("setGridHeight", 120);
			this.$(".js-notify-obj-param-grid:visible").jqGrid("setGridWidth", this.$(".js-notify-obj-param-grid").parent().width());
			
		},
		addParam: function(event){
			var data = {};
			this.$(".js-notify-obj-param-grid").jqGrid("addRowData", data, 'last');
			this.$(".js-notify-obj-param-grid").jqGrid("setSelection",data);
		},
		delParam: function(rowdata,$grid){
			fish.confirm(this.i18nData.PARAM_DEL_CONFIRM,function(t) {
				$grid.jqGrid("delRowData", rowdata);
			}.bind(this));
		},
		alarmNoticeSet:function(){
			var isNotice = this.$(".js-alarm-notice-set").prop("checked") ;
			if(isNotice){
				this.$(".js-alarm-notice-div").show();
			}else{
				this.$(".js-alarm-notice-div").hide();
			}
		},
	});
	
});