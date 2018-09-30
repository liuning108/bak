define([
	'text!oss_core/inms/pm/config/task/templates/collect/CollectDetail.html',
	"text!oss_core/inms/pm/config/task/templates/collect/FtpParam.html",
	"text!oss_core/inms/pm/config/task/templates/collect/JdbcParam.html",
	"text!oss_core/inms/pm/config/task/templates/collect/FtpStep.html",
	"text!oss_core/inms/pm/config/task/templates/collect/JdbcStep.html",
	'oss_core/inms/pm/config/adapter/actions/AdapterAction',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
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
			'click .js-add-ftp-cfg':'addFtpCfg',
			'click .js-del-ftp-cfg':'delFtpCfg',
			"click .js-multi-connection-set":'multiConnectionSet',
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
			this.ftpAttrParamList = [];
			this.jdbcAttrParamList = [];
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
			this.$(".js-collect-detail-div").slimscroll({height:300,width:640});
			this.multiConnectionSet();
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
				value["IS_MULTICONN"] = (value["IS_MULTICONN"]=="on")?"1":"0";
				$.each(value, function(code, val) {
					if(code != 'CONNINST_ID'){
						stepObj["paramList"].push({"PARAM_CODE":code, "PARAM_VALUE":val});
					}
				});
				var isMulti = this.$(".js-multi-connection-set").prop("checked") ;
				if(isMulti){
					var multiGroupArr = this.$(".js-collect-multi-param-div").find("div[multi-group][oper!='add']");
					if(multiGroupArr.length < 1){
						fish.info(this.i18nData.CONNECTION_ISNULL);
						return false;
					}else{
						fish.forEach(multiGroupArr, function(multiGroup) {
							var attrParam = [];
							$.each($(multiGroup).prop("multi-group"), function(key, value) {
								if(key!="attrParam"){
									attrParam.push({"ATTR_CODE":key,"ATTR_VALUE":value,"ATTR_TYPE":"0"});
								}else{
									fish.forEach(value, function(gridObj) {
										if(gridObj && gridObj['PARAM_CODE']){
											attrParam.push({"ATTR_CODE":gridObj['PARAM_CODE'],"ATTR_VALUE":gridObj['PARAM_VALUE'],"ATTR_TYPE":"1"});
										}
									});
								}
							});

							stepObj["paramList"].push({"PARAM_CODE":"CONNINST_ID", "PARAM_VALUE":"","attrParam":attrParam});
						}.bind(this));
					}

				}

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
		        this.savePageInfo();
		    }.bind(this));
			this.$form.find("[name='PROTOCOL_TYPE']").on('combobox:change', function () {
				this.changeProtocol();
			}.bind(this));


			var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
			adapterAction.qryAdapter(param, function(data) {
				if (data){
					this.adapterList = data.adapterList;
					this.loadCollectDetailParam();
				}
			}.bind(this));
		},
		changeProtocol:function(){
			var adapterBox = [];
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			fish.forEach(this.adapterList, function(adapter,index) {
				if(adapter["PROTOCOL_TYPE"] == protocolType){
					adapterBox.push(adapter);
				}
			});

			this.$form.find("[name='ADAPTER_NO']").combobox({
				dataTextField: "ADAPTER_NAME",
		        dataValueField: "ADAPTER_NO",
		        dataSource:  adapterBox
			});

			var paramObj = {};
			var attrParamList = [];
			var stepList = [];
			var stepParamList = [];
			var tpl ;
			if(protocolType=="00"){ //jdbc
				paramObj = this.ftpParamObj;
				attrParamList = this.ftpAttrParamList;
				stepList = this.ftpStepList;
				stepParamList = this.ftpStepParamList;
			}else if(protocolType=="01"){
				tpl = this.jdbcParam;
				paramObj = this.jdbcParamObj;
				attrParamList = this.jdbcAttrParamList;
				stepList = this.jdbcStepList;
				stepParamList = this.jdbcStepParamList;
			}
			this.initParamInfo();
			paramObj["PROTOCOL_TYPE"] = protocolType;
			paramObj["IS_MULTICONN"] = (paramObj["IS_MULTICONN"]=="1" || paramObj["IS_MULTICONN"]=="on")?"on":"off";
			this.$form.form("value",paramObj);


			this.multiConnectionSet(false);
			this.$(".js-collect-step-div").empty();

			fish.forEach(stepList, function(step,index) {
				this.collectAddStep(step);
			}.bind(this));

		},
		savePageInfo:function(){
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
	        var isMulti = this.$(".js-multi-connection-set").prop("checked") ;

	        var attrParamList = [];
	        var multiGroupArr = this.$(".js-collect-multi-param-div").find("div[multi-group][oper!='add']");

			fish.forEach(multiGroupArr, function(multiGroup) {
				attrParamList.push($(multiGroup).prop("multi-group"));
			}.bind(this));

	        var stepObj = this.getStepObj();
	        if(protocolType=='00'){//ftp

	        	if(isMulti){
	        		this.ftpAttrParamList = attrParamList;
	        	}else{
	        		this.ftpParamObj = this.$form.form('value');
	        	}
	        	this.ftpParamObj['IS_MULTICONN'] = isMulti?"1":"0";
	        	this.ftpParamObj['ADAPTER_NO'] = this.$form.find(":input[name='ADAPTER_NO']").val();
				this.ftpStepList = stepObj['stepList'];
				this.ftpStepParamList = stepObj['stepParamList'];

			}else if(protocolType=='01'){//jdbc

				if(isMulti){
					this.jdbcAttrParamList = attrParamList;
				}else{
					this.jdbcParamObj = this.$form.form('value');
				}
				this.jdbcParamObj['IS_MULTICONN'] = isMulti?"1":"0";
				this.jdbcParamObj['ADAPTER_NO'] = this.$form.find("[name='ADAPTER_NO']").val();
				this.jdbcStepList = stepObj['stepList'];
				this.jdbcStepParamList = stepObj['stepParamList'];
			}


		},
		initParamInfo:function(){
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			var tpl ;
			var paramObj = {};
			if(protocolType=="00"){
				tpl = this.ftpParam;
				paramObj = this.ftpParamObj;
			}else if(protocolType=="01"){//jdbc
				tpl = this.jdbcParam;
				paramObj = this.jdbcParamObj;
			}

			if(tpl){
				this.$form.find(".js-collect-param-div").html(tpl(this.i18nData));
				if(protocolType=="01"){
					this.pmUtil.utilAction.qryDataSource({},function(data) {
						if(data){
							this.$form.find("[name='SOURCE_DB_NAME']").combobox({
								dataTextField: "NAME",
						        dataValueField: "ID",
						        dataSource:  data.sourceList
							});
							this.$form.find("[name='SOURCE_DB_NAME']").combobox('value',paramObj['SOURCE_DB_NAME']);
						}
					}.bind(this));
					this.$form.find("[name='SOURCE_DB_DIALECT']").combobox({
						dataTextField: this.pmUtil.parakey.name,
				        dataValueField: this.pmUtil.parakey.val,
				        dataSource:  this.pmUtil.paravalue("DB_DIALECT")
					});
					var dbDialectArr = this.pmUtil.paravalue("DB_DIALECT");
					this.$form.find("[name='SOURCE_DB_DIALECT']").combobox('value',(dbDialectArr&&dbDialectArr.length > 0)?dbDialectArr[0][this.pmUtil.parakey.val]:"");
				}
			}


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

				this.$(".js-collect-step-div").append(tplHtml);
				//this.multiConnectionSet();
				var addForm = this.collectUpdateStepSeq();

				if(protocolType=="00"){//ftp
					stepParamList = this.ftpStepParamList;
					$(addForm).find("[name='IS_COMPRESS']").combobox({
						dataTextField: this.pmUtil.parakey.name,
				        dataValueField: this.pmUtil.parakey.val,
				        dataSource:  this.pmUtil.paravalue("IS_COMPRESS")
					});
				}

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
					//formObj["IS_COMPRESS"] = (formObj["IS_COMPRESS"]=="1")?"on":"off";
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

			if(!this.datas || !this.datas.TASK_NO){ //新建
				this.$form.find("[name='PROTOCOL_TYPE']").combobox('value','00');
				this.collectAddStep();
				return false;
			}

			this.taskAction.qryDetail({"TASK_NO":this.datas.TASK_NO, 'TYPE':'param'}, function(data) {
				if (data){
					var paramObj = {};
					var attrParamList = [];
					fish.forEach(data.paramList, function(param,index) {
						paramObj[param["PARAM_CODE"]] = param["PARAM_VALUE"];
					}.bind(this));


					fish.forEach(data.paramAttrList, function(param,index) {
						var isExist = false;
						fish.forEach(attrParamList, function(attr,index) {
							if(param["PARAM_SEQ"]==attr["PARAM_SEQ"]
								&& param["PARAM_CODE"]==attr["PARAM_CODE"]){

								isExist = true;

								if(param["ATTR_TYPE"]=="1"){//扩展属性
									if(attr["attrParam"]){
										attr["attrParam"].push({"PARAM_CODE": param['ATTR_CODE'], "PARAM_VALUE": param['ATTR_VALUE']});
									}else{
										attr["attrParam"] = [{"PARAM_CODE": param['ATTR_CODE'], "PARAM_VALUE": param['ATTR_VALUE']}];
									}
								}else{
									attr[param['ATTR_CODE']] = param['ATTR_VALUE'] ;
								}
							}
						}.bind(this));
						if(!isExist){
							var obj = {"PARAM_SEQ":param['PARAM_SEQ'], "PARAM_CODE":param['PARAM_CODE']};
							if(param["ATTR_TYPE"]=="1"){//扩展属性
								obj["attrParam"] = [{"PARAM_CODE": param['ATTR_CODE'], "PARAM_VALUE": param['ATTR_VALUE']}];
							}else{
								obj[param['ATTR_CODE']] = param['ATTR_VALUE'] ;
							}
							attrParamList.push(obj)
						}
					}.bind(this));

					if(paramObj['PROTOCOL_TYPE']=='00'){//ftp
						this.ftpParamObj = paramObj;
						this.ftpAttrParamList = attrParamList ;
						this.ftpStepList = data.stepList;
						this.ftpStepParamList = data.stepParamList;
					}else if(paramObj['PROTOCOL_TYPE']=='01'){//jdbc
						this.jdbcParamObj = paramObj;
						this.jdbcAttrParamList = attrParamList ;
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
			var isMulti = this.$(".js-multi-connection-set").prop("checked") ;
			if(protocolType=='00' && isMulti){//ftp多连接方式，不要检查步骤中的表单
				isCheck = false;
			}

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
						if(isMulti){ //FTP多连接，将报步骤表单信息置空
							param = {};
						}else{
							param["IS_DEL"] = (param["IS_DEL"]=="on")?"1":"0";
						}


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
		delFtpCfg:function(event){
			var $cfgDiv = $(event.target).parents("div[multi-group]") ;
			if(!$cfgDiv) return false;
			$cfgDiv.remove();
		},
		addFtpCfg:function(event){
			var $cfgDiv = $(event.target).parents("div[multi-group]") ;
			if(!$cfgDiv) return false;
			var multiParam = $cfgDiv.prop("multi-group");
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			var options = {};
			options.i18nData = this.i18nData;
			options.pmUtil = this.pmUtil;
			options.multiParam = multiParam;
			options.protocolType = protocolType;
			fish.popupView({
				url: "oss_core/inms/pm/config/task/views/collect/MultiParam",
				viewOption: options,
				callback: function(popup, view) {


				}.bind(this),
				close: function(retData) {
					if(multiParam){//修改
						$cfgDiv.prop("multi-group",retData );
						if(protocolType=='00'){
							$cfgDiv.find(":input[name='CONNINST_ID']").val(retData['FTP_IP']+":"+retData['FTP_PORT']);
						}else if(protocolType=='01'){
							$cfgDiv.find(":input[name='CONNINST_ID']").val(retData['SOURCE_DB_NAME']+":"+retData['SOURCE_DB_DIALECT']);
						}

					}else{//新增
						this.addMultiGroup($cfgDiv,retData);
					}

				}.bind(this),
			});
		},
		addMultiGroup:function($cfgDiv,retData){
			if(!$cfgDiv) return false;
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');
			$cfgDiv.before(
				"<div class='col-md-4' multi-group>"
				+"    <div class='m-t-xs input-group'> "
				+"	    <input name='CONNINST_ID' class='form-control' readonly >"
				+"	    <span class='input-group-addon js-add-ftp-cfg'><i class='fa fa-cog'></i></span> "
				+"	    <span class='input-group-addon js-del-ftp-cfg'><i class='fa fa-close'></i></span> "
				+"	</div>"
				+"</div>"
			);
			$cfgDiv.prev().prop("multi-group",retData);
			if(retData){
				if(protocolType=='00'){
					$cfgDiv.prev().find(":input[name='CONNINST_ID']").val(retData['FTP_IP']+":"+retData['FTP_PORT']);
				}else if(protocolType=='01'){
					$cfgDiv.prev().find(":input[name='CONNINST_ID']").val(retData['SOURCE_DB_NAME']+":"+retData['SOURCE_DB_DIALECT']);
				}
			}
		},
		multiConnectionSet:function(isSave){
			var protocolType = this.$form.find("[name='PROTOCOL_TYPE']").combobox('value');

			var isMulti = this.$(".js-multi-connection-set").prop("checked") ;

			if(isSave){
				var attrParamList = [];
		        var multiGroupArr = this.$(".js-collect-multi-param-div").find("div[multi-group][oper!='add']");

				fish.forEach(multiGroupArr, function(multiGroup) {
					attrParamList.push($(multiGroup).prop("multi-group"));
				}.bind(this));

		        if(!isMulti){ //这里要用!isMulti，控件切换为非多连接之后，立即将数据保存。
		        	if(protocolType=='00'){//ftp
			        	this.ftpAttrParamList = attrParamList;
			        }else if(protocolType=='01'){//jdbc
						this.jdbcAttrParamList = attrParamList;
					}
				}else{

					if(protocolType=='00'){//ftp
			        	this.ftpParamObj = this.$form.form('value');
			        }else if(protocolType=='01'){//jdbc
						this.jdbcParamObj = this.$form.form('value');
					}
				}
			}


			this.$(".js-collect-multi-param-div").find("div[multi-group][oper!='add']").remove();


			if(isMulti){
				this.$(".js-collect-multi-param-div").show();
				this.$(".js-collect-param-div").hide();
				this.$(".js-collect-param-div").empty();
				this.$(".js-collect-ftp-base-info").hide();

				var attrParamList = [];
				if(protocolType=="00"){ //jdbc
					attrParamList = this.ftpAttrParamList;
				}else if(protocolType=="01"){
					attrParamList = this.jdbcAttrParamList;
				}
				//alert(attrParamList.length);
				fish.forEach(attrParamList, function(attr,index) {
					var $cfgDiv = this.$(".js-collect-multi-param-div").find("div[multi-group][oper='add']")
					this.addMultiGroup($cfgDiv, attr);
				}.bind(this));


			}else{
				this.$(".js-collect-multi-param-div").hide();
				this.$(".js-collect-param-div").show();
				this.$(".js-collect-ftp-base-info").show();
				this.initParamInfo();

				var paramObj = {};
				if(protocolType=='00'){//ftp
		        	paramObj = this.ftpParamObj;
		        }else if(protocolType=='01'){//jdbc
					paramObj = this.jdbcParamObj;
				}
				paramObj['IS_MULTICONN'] = "off";
				this.$form.form("value",paramObj);

			}
		},

	});
});
