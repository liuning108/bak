portal.define([
	'text!oss_core/pm/config/task/templates/collect/CollectDetail.html',
	"text!oss_core/pm/config/task/templates/collect/FtpParam.html",
	"text!oss_core/pm/config/task/templates/collect/JdbcParam.html",
	"text!oss_core/pm/config/task/templates/collect/FtpStep.html",
	"text!oss_core/pm/config/task/templates/collect/JdbcStep.html",
	'oss_core/pm/config/adapter/actions/AdapterAction',
	'oss_core/pm/meta/measure/actions/MeasureAction',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(collectTpl, ftpParamTpl, jdbcParamTpl, ftpStepTpl, jdbcStepTpl, adapterAction, measureAction, codemirror){
	return portal.BaseView.extend({
		template: fish.compile(collectTpl),
		ftpParam: fish.compile(ftpParamTpl),
		jdbcParam: fish.compile(jdbcParamTpl),
		ftpStep:   fish.compile(ftpStepTpl),
		jdbcStep:  fish.compile(jdbcStepTpl),
		events: {
			'click .js-collect-add-step': 'collectAddStep',
			'click .js-collect-del-step': 'collectDelStep',
			"click .js-collect-mo-list-add":'getMoList',
			"click .js-collect-mo-list-ok":'returnMoList',
			"click .js-collect-mo-list-cancel":'cancelMoList',
			"click .js-collect-mo-list-close":'closeMoList',
			"click .js-collect-map-ul li a":'clickScriptTabs',
			'keyup .js-collect-mo-list-seling-search':'searchSeling',
			'click .js-collect-mo-list-seling-all':'selingAll',
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
			this.adapterList = [];
			
			this.ftpParamObj = {}; 
			this.jdbcParamObj = {}; 
			this.ftpStepList = []; 
			this.jdbcStepList = []; 
			this.ftpStepParamList = [];
			this.jdbcStepParamList = [];
			
			this._L8 = "";
			for(var i=0;i<8;i++){
				this._L8 += "_";
			}
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.pmUtil.extContains(); 
		},
		domComplete: function(){
			this.editors = {};
			this.$form = $(".js-collect-detail-form");
			$(".js-collect-detail-div").slimscroll({height:300});
			
			if(this.EMS_TYPE_REL_ID && this.EMS_VER_CODE){
				var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
				measureAction.qryMeasure(param, function(data) {
					
					if (data && data.moList){
						this.moList = data.moList;
					}
				}.bind(this));
			}
			this.loadCollectDetail();
		},
		ok: function(){
			if (this.$form.isValid()) {
				var that = this;
				var value = this.$form.form("value");
				
				var stepObj = this.getStepObj(true);
				if(!stepObj) return false;
				if(stepObj["stepList"].length < 1){
					fish.info(this.i18nData.TASK_DETAIL_NULL);
					return false;
				}
				stepObj["paramList"] = [];
				$.each(value, function(code, val) {  
					stepObj["paramList"].push({"PARAM_CODE":code, "PARAM_VALUE":val});
				});
				
				return stepObj;
			}else{
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
		},
		loadCollectDetail: function(){
			this.$form.find("[name='ADAPTER_NO']").combobox({});
			this.$form.find("[name='PROTOCOL_TYPE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("PROTOCOL_TYPE")
			});
			this.$form.find("[name='PROTOCOL_TYPE']").combobox('setEditable', false);
			this.$form.find("[name='PROTOCOL_TYPE']").on('combobox:open', function (e) {//打开协议下拉框时,保存当前界面数据
		        var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
		        var stepObj = this.getStepObj();
		        
		        if(protocolType=='00'){//ftp
					this.ftpParamObj = this.$form.form('value'); 
					this.ftpStepList = stepObj['stepList'];
					this.ftpStepParamList = stepObj['stepParamList'];
				}else if(protocolType=='01'){//jdbc
					this.jdbcParamObj = this.$form.form('value'); 
					this.jdbcStepList = stepObj['stepList']; 
					this.jdbcStepParamList = stepObj['stepParamList'];
				}
		    }.bind(this));
			this.$form.find("[name='PROTOCOL_TYPE']").on('combobox:change', function () {
				var adapterBox = [];
				var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
				fish.forEach(this.adapterList, function(adapter,index) {
					if(adapter["PROTOCOL_TYPE"] == protocolType){
						adapterBox.push(adapter);
					}
				});
				
				//alert(JSON.stringify(adapterBox));
				this.$form.find("[name='ADAPTER_NO']").combobox({
					dataTextField: "ADAPTER_NAME",
			        dataValueField: "ADAPTER_NO",
			        dataSource:  adapterBox
				});
				
				var paramObj = {}; 
				var stepList = []; 
				var stepParamList = [];
				var tpl ;
				if(protocolType=="00"){ //jdbc
					tpl = this.ftpParam;
					paramObj = this.ftpParamObj; 
					stepList = this.ftpStepList; 
					stepParamList = this.ftpStepParamList;
				}else if(protocolType=="01"){
					tpl = this.jdbcParam;
					paramObj = this.jdbcParamObj; 
					stepList = this.jdbcStepList; 
					stepParamList = this.jdbcStepParamList;
				}
				
				if(tpl){
					this.$form.find(".js-collect-param-div").html(tpl(this.i18nData));
							
					this.$form.find("[name='SOURCE_DB_NAME']").combobox({
						dataTextField: this.pmUtil.parakey.name,
				        dataValueField: this.pmUtil.parakey.val,
				        dataSource:  this.pmUtil.paravalue("DB_NAME")
					});
					this.$form.find("[name='SOURCE_DB_DIALECT']").combobox({
						dataTextField: this.pmUtil.parakey.name,
				        dataValueField: this.pmUtil.parakey.val,
				        dataSource:  this.pmUtil.paravalue("DB_DIALECT")
					});
					paramObj["PROTOCOL_TYPE"] = protocolType;
					
					this.$form.form("value",paramObj);
				}
				$(".js-collect-step-div").empty();
				
				fish.forEach(stepList, function(step,index) {
					this.collectAddStep(step);
				}.bind(this));
				
				
			}.bind(this));
			
			
			var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
			adapterAction.qryAdapter(param, function(data) {
				if (data){
					this.adapterList = data.adapterList;
					this.loadCollectDetailParam();
				}
			}.bind(this));
		},
		collectAddStep: function(stepObj){
			
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			var tpl;
			if(protocolType=="00"){
				tpl = this.ftpStep;
			}else if(protocolType=="01"){
				tpl = this.jdbcStep;
			}
			
			if(tpl){
					
				var tplHtml = tpl(fish.extend({}, this.i18nData, {'__seq__':this.seq}));
				var stepParamList = {};
				this.seq++;
				if(protocolType=="00"){//ftp
					stepParamList = this.ftpStepParamList;
				} 
				$(".js-collect-step-div").append(tplHtml);
				var addForm = this.collectUpdateStepSeq();
				if(protocolType=="01"){//jdbc
					stepParamList = this.jdbcStepParamList;
					$(addForm).find("[name='MO_NO']").combobox({
						dataTextField: "MO_NAME",
				        dataValueField: "MO_CODE",
				        dataSource:  this.moList,
					});
					this.loadCollectMapTabs(addForm);
					//this.pmUtil.tab($(addForm).find('.js-collect-map-tab'),{});
				}
				if(stepObj && stepObj["TASK_STEP_ID"]){
					
					if(this.operType=='add'){
						this.seq++;
						$(addForm).attr("task_step_id",(this._L8+this.seq+this._L8));//生成一个前后8个下划线的临时ID,后台保存时,如果判断是此规则的ID ,则重新生成ID,否则直接使用
					}else{
						$(addForm).attr("task_step_id",stepObj["TASK_STEP_ID"]);
					}
					
					var groupObj = {};
					var formObj  = {};
					fish.forEach(stepParamList, function(stepParam,index) {
						if(stepObj["TASK_STEP_ID"] == stepParam["TASK_STEP_ID"]
							&& stepObj["STEP_NO"] == stepParam["STEP_NO"] ){
							var groupNo = stepParam["GROUP_NO"];
							var code = stepParam["PARAM_CODE"];
							var value = (stepParam["PARAM_VALUE"]?stepParam["PARAM_VALUE"]:"")
									+ (stepParam["PARAM_VALUE1"]?stepParam["PARAM_VALUE1"]:"")
									+ (stepParam["PARAM_VALUE2"]?stepParam["PARAM_VALUE2"]:"")
									+ (stepParam["PARAM_VALUE3"]?stepParam["PARAM_VALUE3"]:"")
									+ (stepParam["PARAM_VALUE4"]?stepParam["PARAM_VALUE4"]:"")
									+ (stepParam["PARAM_VALUE5"]?stepParam["PARAM_VALUE5"]:"") ;

							if(groupNo==0) groupNo = "0";
							if(groupNo){
								if(!groupObj[groupNo]) groupObj[groupNo] = {};
								groupObj[groupNo][code] = value; 
							}else{
								if(code=="MO_NO" && protocolType=="00"){
									var isExist = false;
									fish.forEach(this.moList, function(mo,index) {
										if(mo['MO_CODE'] == value){
											this.addMoItem(addForm,value,mo['MO_NAME']);
											isExist = true;
											return true;
										}
									}.bind(this));
									if(!isExist){
										this.addMoItem(addForm,value,value);
									}
								}else{
									formObj[code] = value;
								}
							}
						}
					}.bind(this));
					
					formObj["IS_DEL"] = (formObj["IS_DEL"]=="1")?"on":"off";
					formObj["IS_COMPRESS"] = (formObj["IS_COMPRESS"]=="1")?"on":"off";
					$(addForm).form('value',formObj);
					
					if(protocolType=="01"){//jdbc
						
						$.each(groupObj, function(no, obj) {  
							if(typeof obj === 'object'){
								$.each(this.editors, function(db_dialect, editorArr) {  
									if(db_dialect == obj["DB_DIALECT"]){
										fish.forEach(editorArr, function(arr) {
											if(arr['form'] == addForm){
												var val = $.trim(obj["EXT_SQL"]?obj["EXT_SQL"]:"") ;

												(arr['editor']).setValue(val);
												
												if(val){
													var $tab = this.pmUtil.tab($(addForm).find('.js-collect-map-tab'),{}) ;
													var index = $(addForm).find(":input[group='EXT_SQL'][db_dialect='"+db_dialect+"']").attr('index');
													$tab.checked(parseInt(index),true);
												}
												return false;
											}
										}.bind(this));
									}
								}.bind(this));
								
								/**
								fish.forEach($(addForm).find(":input[group='EXT_SQL']"), function(extSql,seq) {
									if($(extSql).attr("db_dialect") == obj["DB_DIALECT"]){
										$(extSql).val(obj["EXT_SQL"]);
										return false;
									}
								});
								*/
							}
						}.bind(this));
					}
					
				}else{
					$(addForm).attr("task_step_id",this._L8+this.seq+this._L8);//生成一个前后8个下划线的临时ID,后台保存时,如果判断是此规则的ID ,则重新生成ID,否则直接使用
				}
				
			}
		},
		loadCollectMapTabs:function(form){
			
			fish.forEach(this.pmUtil.paravalue("DB_DIALECT"),function(para,index){
				var db_dialect = para[this.pmUtil.parakey.val] ;
				$(form).find(".js-collect-map-ul").append("<li><a href='#demo-tabs-box-"+db_dialect+"' db_dialect='"+db_dialect+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+para[this.pmUtil.parakey.name]+"</a></li>") ;
        		$(form).find(".js-collect-map-content").append(
        			"<div id='demo-tabs-box-"+db_dialect+"' class='form-group'>"
					+"    <textarea group='EXT_SQL' index='"+index+"' db_dialect='"+db_dialect+"' rows='4' class='form-control' ></textarea>"
					+"</div>"
        		);
        		var scriptText = $(form).find(":input[group='EXT_SQL']")[index] ;
        		
        		var editor = codemirror.fromTextArea(scriptText, {
				    mode: 'text/x-plsql',
				    indentWithTabs: true,		    
				    smartIndent: true,
				    lineNumbers: true,
				    matchBrackets : true,
				    
				    //autofocus: true,
				    //scrollbarStyle: 'null',
				});
				var tabForm = form ;
				editor.setSize('height','150px');	  
				editor.on("update",function(self){  
					var val = $.trim(self.getValue()); 
					$(scriptText).val(val);
					var $tab = this.pmUtil.tab($(tabForm).find('.js-collect-map-tab'),{}) ;
					$tab.checked(index,!!val);
				}.bind(this)); 
				
				if(this.editors[db_dialect]){
					this.editors[db_dialect].push({'editor':editor,'form':tabForm});
				}else{
					this.editors[db_dialect] = [{'editor':editor,'form':tabForm}];
				}
        	}.bind(this));
			this.pmUtil.tab($(form).find('.js-collect-map-tab'),{});
		},
		collectDelStep: function(event){
			$(event.target).parents("form").parent().remove(); 
			
			this.collectUpdateStepSeq();
		},
		collectUpdateStepSeq:function(){
			var lastForm ;
			fish.forEach($(".js-collect-step-div form[step_no]"), function(form,index) {
				$(form).find(".js-collect-step-seq").text(index+1);
				//$(form).attr("id",'js-collect-step-form-'+(index+1));
				lastForm = form;
			}.bind(this));
			return lastForm;
		},
		
		initMoItem: function(form,moCode,moName){
			$(form).find(".js-collect-mo-list-seling-item").append("<label class=\"checkbox-inline\" title='"+moName+"("+moCode+")"+"'><input type=\"checkbox\" mo_code='"+moCode+"' mo_name='"+moName+"'>"+moName+"</label>");
		},
		addMoItem: function(form,moCode,moName){
			$(form).find(".js-collect-mo-list-ul").append("<li class='list-group-item' mo_code='"+moCode+"' title='"+moName+"("+moCode+")"+"'>"+moName+"<div class=\"listclose\"><i class=\"fa fa-close js-collect-mo-list-close\"></i></div></li>");
		},
		getMoList: function(event){
			var that = this;
			$(".js-collect-mo-list-ok:visible").each(function(){
					that.siwtchMoBtn($(this).parents("form"));
				}
			);
			
			var form = $(event.target).parents("form") ;
			this.siwtchMoBtn(form);
			$(form).find(".js-collect-mo-list-seling-item").empty();
			$(form).find(".js-collect-mo-list-seling-search").val("");
			$(form).find(".js-collect-mo-list-seling-all").attr('checked', false);
            $(form).find(".js-collect-mo-list-seling-all").prop('checked', false);
			
			var initCnt = 0;
			fish.forEach(this.moList, function(molist,index) {
				
				var isValid = true;
				fish.forEach($(".js-collect-mo-list-ul .list-group-item"), function(moItem,index) {
					if(molist["MO_CODE"] == $(moItem).attr("mo_code")){
						isValid = false;
						return false;
					}
				});
				if(isValid){
					this.initMoItem(form,molist["MO_CODE"],molist["MO_NAME"]);
					initCnt++;
				}
			}.bind(this));
			if(initCnt<=0){
				$(form).find(".js-collect-mo-list-seling-item").html(this.i18nData.NO_O_SEL);
			}
		},
		returnMoList: function(event){
			var form = $(event.target).parents("form") ;
			
			var that = this;
			$(form).find(".js-collect-mo-list-seling-item input[type=checkbox]:checked").each(function(){
					that.addMoItem(form,$(this).attr("mo_code"),$(this).attr("mo_name"));
				}
			);
			this.siwtchMoBtn(form);
		},
		cancelMoList: function(event){
			var form = $(event.target).parents("form") ;
			this.siwtchMoBtn(form);
		},
		closeMoList: function(event){
			$(event.target).parent().parent().remove();
		},
		siwtchMoBtn:function(form){
			$(form).find(".js-collect-mo-list-add").toggleClass("hide");  
			$(form).find(".js-collect-mo-list-ok").toggleClass("hide");
			$(form).find(".js-collect-mo-list-cancel").toggleClass("hide");
			$(form).find(".js-collect-mo-list-seled-div").toggleClass("hide");
			$(form).find(".js-collect-mo-list-seling-div").toggleClass("hide");
		},
		loadCollectDetailParam:function(){
			
			if(!this.datas || !this.datas.TASK_NO){ 
				this.$form.find("[name='PROTOCOL_TYPE']").combobox('value','00');
				this.collectAddStep();
				return false;
			}
			
			this.taskAction.qryDetail({"TASK_NO":this.datas.TASK_NO, 'TYPE':'param'}, function(data) {
				if (data){
					var paramObj = {};
					fish.forEach(data.paramList, function(param,index) {
						paramObj[param["PARAM_CODE"]] = param["PARAM_VALUE"];
					}.bind(this));
					if(paramObj['PROTOCOL_TYPE']=='00'){//ftp
						this.ftpParamObj = paramObj;
						this.ftpStepList = data.stepList;
						this.ftpStepParamList = data.stepParamList;
					}else if(paramObj['PROTOCOL_TYPE']=='01'){//jdbc
						this.jdbcParamObj = paramObj; 
						this.jdbcStepList = data.stepList; 
						this.jdbcStepParamList = data.stepParamList;
					}
					this.$form.find("[name='PROTOCOL_TYPE']").combobox('value',paramObj['PROTOCOL_TYPE']);
				}
			}.bind(this));
		},
		getStepObj: function(isCheck){ //isCheck 是否需要校验
			var isValid = true;
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			
			var value = {"stepList":[],"stepParamList":[] };
			fish.forEach($(".js-collect-step-div form[step_no]"), function(form,index) {
				if(isCheck && !$(form).isValid()){
					isValid = false;
					fish.toast('info', this.i18nData.TIP_INFO);
					return false;
				}else{
					var step = {'TASK_STEP_ID':$(form).attr('task_step_id'),'STEP_NO':$(form).attr("step_no") ,'TASK_STEP_NAME':$(form).attr("step_name") };
					var param = $(form).form("value");
					
					if(protocolType=="00"){
						param["IS_COMPRESS"] = (param["IS_COMPRESS"]=="on")?"1":"0";
						param["IS_DEL"] = (param["IS_DEL"]=="on")?"1":"0";
						
						var moItemList = $(form).find(".js-collect-mo-list-ul .list-group-item") ;
						fish.forEach(moItemList, function(moItem) {
							value["stepParamList"].push(fish.extend({},step,{'PARAM_CODE':'MO_NO', 'PARAM_VALUE':$(moItem).attr("mo_code")}) );
						});
						if(moItemList.length < 1){
							isValid = false;
							if(isCheck){
								fish.info((this.i18nData.TASK_DETAIL_MO_NULL).replace("{N}",  $(form).find(".js-collect-step-seq").text() ));
								return false;
							}
						}
						
					}else if(protocolType=="01"){
						/*
						var groupNo = 0 ;
						$.each(this.editors, function(db_dialect, editorArr) {  
							fish.forEach(editorArr, function(arr) {
								if(arr['form'] == form){
									var val = $.trim( (arr['editor']).getValue() ) ;
									if(val){
										value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':groupNo,'GROUP_SEQ':1,'PARAM_CODE':'DB_DIALECT', 'PARAM_VALUE':db_dialect}) );
										value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':groupNo,'GROUP_SEQ':2,'PARAM_CODE':'EXT_SQL', 'PARAM_VALUE':val }) );
									}
									groupNo++
								}
							});
						});
						*/
						
						
						fish.forEach($(form).find(":input[group='EXT_SQL']"), function(sql,seq) {
							if($.trim($(sql).val())){
								value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':1,'PARAM_CODE':'DB_DIALECT', 'PARAM_VALUE':$(sql).attr("db_dialect")}) );
								value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':2,'PARAM_CODE':'EXT_SQL', 'PARAM_VALUE':$.trim($(sql).val()) }) );
							}
						});
						
					}
					
					$.each(param, function(code, val) {  
						value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':code, 'PARAM_VALUE':val}) );
					});
					value["stepList"].push( fish.extend({},step,{'STEP_SEQ':index,'TASK_STEP_SEQ':index}) ) ;
				}
			}.bind(this));
			
			if(isCheck && !isValid){
				return false;
			}else{
				return value;
			}
		},
		refreshEditor:function(){
			$.each(this.editors, function(db_dialect, editorArr) {  
				fish.forEach(editorArr, function(arr,index) {
					if(arr['editor']){
						(arr['editor']).refresh();
					}
				}.bind(this));
			}.bind(this));
		},
		clickScriptTabs:function(event){
			var db_dialect = $(event.target).attr('db_dialect'); 
			var form = $(event.target).parents("form")[0] ;
			
			fish.forEach(this.editors[db_dialect], function(arr,index) {
				if(arr['form'] == form){
					(arr['editor']).refresh();
					return false;
				}
			});
		},
		searchSeling: function(event){
			var val = $(event.target).val();
			if(val){
				this.$(".js-collect-mo-list-seling-item label").hide();
				this.$(".js-collect-mo-list-seling-item label").filter(":contains('"+val+"')").show();
			}else{
				this.$(".js-collect-mo-list-seling-item label").show();
			}		
		},
		selingAll:function(event){
			var checked = $(event.target).is(':checked') ;
			
			$(".js-collect-mo-list-seling-item input[type=checkbox]:visible").each(function(){
				$(this).attr('checked', checked);
                $(this).prop('checked', checked);
			});
		},
		
	});
});