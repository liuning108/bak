define([
	'text!oss_core/inms/pm/config/task/templates/ext/ExtDetail.html',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
],function(aggTpl, codemirror){
	return portal.BaseView.extend({
		template: fish.compile(aggTpl),

		events: {
			'click .js-task-ext-mode-add': 'checkRuleAdd',
			'click .js-task-ext-mode-del': 'checkRuleDel',
			'click .js-task-ext-mode-cog': 'checkRuleConfig',
			'click .js-task-ext-mode-param-add': 'checkRuleAddParam',
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
			this.editors = [];
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
			this.pmUtil.extContains();
		},
		domComplete: function(){
			this.$(".js-task-ext-detail-div").slimscroll({height:300,width:760});
			this.$form = this.$(".js-task-ext-detail-form");
			this.$form.find("[name='EXT_MODE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("EXT_MODE")
			});

			this.$form.find("[name='EXT_MODE']").combobox('setEditable', false);
			this.$form.find("[name='EXT_MODE']").on('combobox:change', function () {
				var extMode = this.$form.find("[name='EXT_MODE']").combobox('value') ;
				if(extMode=='1'){//脚本
					this.$(".js-task-ext-label").html(this.i18nData.EXT_SQL);

					this.$form.find(".js-task-ext-data-source").append(
					"<div class='form-group required'>	"
					+"    <div class='col-md-12'>"
					+"        <label class='control-label'>"+this.i18nData.DATA_SOURCE+"</label>"
					+"    </div>"
					+"    <div class='col-md-12'>"
					+"       <input name='DATA_SOURCE' class='form-control' data-rule='"+this.i18nData.DATA_SOURCE+":required;' placeholder='"+this.i18nData.COMMON_PLS_SEL+"'>"
					+"    </div>"
					+"</div>");

					if(!this.sourceList){
						this.getDataSource();
					}
					if(this.sourceList){
						this.$form.find("[name='DATA_SOURCE']").combobox({
							dataTextField: 'NAME',
					        dataValueField: 'ID',
					        dataSource:  this.sourceList,
						});
					}

				}else if(extMode=='2'){//服务
					this.$(".js-task-ext-label").html(this.i18nData.SERVICE_SERV);

					this.$form.find(".js-task-ext-data-source").empty();

				}

				this.$(".js-task-ext-mode-div").empty();
				this.checkRuleAdd();
		    }.bind(this));
			this.$form.find("[name='EXT_MODE']").combobox('value', '1');


			this.loadTaskExtDetail();

		},
		getDataSource:function(){

			this.pmUtil.utilAction.qryDataSource({},function(data) {
				if(data){
					this.sourceList = data.sourceList ;
				}
			}.bind(this),true);
		},
		loadTaskExtDetail:function(){
			if(!this.datas || !this.datas.TASK_NO){
				return false;
			}
			var param = {"TASK_NO":this.datas.TASK_NO, 'TYPE':'param', 'PLUGIN_TYPE':'05','PARAM_CODE':'SERVICE_SERV'} ;
			this.taskAction.qryDetail(param, function(data) {
				if (data){
					var stepParamList = data.stepParamList ;
					fish.forEach(data.stepList, function(stepObj,index) {
						if(stepObj['STEP_NO']=='1'){

							var groupObj = {};
							fish.forEach(stepParamList, function(stepParam) {
								if(stepObj["TASK_STEP_ID"] == stepParam["TASK_STEP_ID"]
									&& stepObj["STEP_NO"] == stepParam["STEP_NO"] ){

										var code = stepParam["PARAM_CODE"];
										var value = (stepParam["PARAM_VALUE"]?stepParam["PARAM_VALUE"]:"")
												+ (stepParam["PARAM_VALUE1"]?stepParam["PARAM_VALUE1"]:"")
												+ (stepParam["PARAM_VALUE2"]?stepParam["PARAM_VALUE2"]:"")
												+ (stepParam["PARAM_VALUE3"]?stepParam["PARAM_VALUE3"]:"")
												+ (stepParam["PARAM_VALUE4"]?stepParam["PARAM_VALUE4"]:"")
												+ (stepParam["PARAM_VALUE5"]?stepParam["PARAM_VALUE5"]:"") ;
										if(code=='EXT_MODE'){
											this.$form.find("[name='EXT_MODE']").combobox('value', value);
											this.$(".js-task-ext-mode-div").empty();
										}else if(code=='DATA_SOURCE'){
											this.$form.find("[name='DATA_SOURCE']").combobox('value', value);
										}else if(code=='EXT_SQL'){
											this.checkRuleAdd(value);
										}else if(code == 'SERVICE_SERV'){

											this.checkRuleAdd();
											var pluginObj = $.grep( data.pluginList, function(plugin,i){
												return (value == plugin["PLUGIN_NO"]);
											});
											if(pluginObj.length > 0){
												this.$form.find(":input[group='SERVICE_SERV']:last").val(pluginObj[0]["PLUGIN_CLASSPATH"]);
											}

											var rowData = $.grep( data.pluginParam, function(param,i){
												return (value == param["PLUGIN_NO"]);
											});

											this.$form.find(".js-task-ext-mode:last").prop("rowData",rowData);
										}
									}
							}.bind(this));


						}
					}.bind(this));
				}
			}.bind(this));
		},

		ok: function(){
			var isValid = true;

			var stepObj = {'stepList':[],'stepParamList':[]};
			var index = 0 ;
			if (this.$form.isValid()) {
				var stepId = this.$form.attr('task_step_id') ;
				if(!stepId){
					stepId = this._L8+index+this._L8 ;
				}
				var step = {'TASK_STEP_ID':stepId,'STEP_NO':this.$form.attr("step_no") ,'TASK_STEP_NAME':this.$form.attr("step_name") };
				stepObj["stepList"].push(fish.extend({},step,{'STEP_SEQ':stepObj["stepList"].length,'TASK_STEP_SEQ':stepObj["stepList"].length }));
				stepObj["PLUGIN_TYPE"] = '05';
				stepObj["PARAM_CODE"] = 'SERVICE_SERV';
				var extMode = this.$form.find("[name='EXT_MODE']").combobox('value') ;
				stepObj["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'EXT_MODE', 'PARAM_VALUE':extMode }) );
				if(extMode=='1'){

					var dataSrc = this.$form.find("[name='DATA_SOURCE']").combobox('value') ;
					if(!dataSrc){
						fish.info(this.i18nData.DATA_SOURCE_NULL);
						return false;
					}
					stepObj["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'DATA_SOURCE', 'PARAM_VALUE':dataSrc }) );

					var isExist = false;
					fish.forEach(this.$form.find(":input[name='EXT_SQL']"), function(sql,seq) {
						var extSql = $(sql).val() ;
						if(extSql){
							isExist = true;
						}
						stepObj["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'EXT_SQL', 'PARAM_VALUE':extSql}) );

					}.bind(this));

					if(!isExist){
						fish.info(this.i18nData.EXT_SQL_ISNULL);
						return false;
					}
				}else if(extMode=='2'){
					var isExist = false;
					fish.forEach(this.$form.find(":input[group='SERVICE_SERV']"), function(service,seq) {
						if($.trim($(service).val())){
							var pluginObj = {};
							pluginObj["PLUGIN_NO"] = "";
							pluginObj["CODE_PREFIX"] = this.pmUtil.parameter("codePrefix").val();
							pluginObj["PLUGIN_TYPE"] = '05';
							pluginObj["PARAM_CODE"] = 'SERVICE_SERV';
							pluginObj["PLUGIN_CLASSPATH"] = $.trim($(service).val());
							pluginObj["pluginParam"] = $(service).parents(".js-task-ext-mode").prop("rowData");

							stepObj["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'SERVICE_SERV', 'PARAM_VALUE':""}, {'plugin':pluginObj} ) );
							isExist = true;
						}
					}.bind(this));
					if(!isExist){
						fish.info(this.i18nData.SERVICE_SERV_ISNULL);
						return false;
					}


				}

				if(stepObj["stepParamList"].length <= 0){
					fish.info(this.i18nData.TASK_DETAIL_NULL);
					return false;
				}

			}else{
				isValid = false;
			}


			if(isValid){
				return stepObj;
			}else{
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
			//alert(JSON.stringify(stepObj));

		},

		checkRuleAdd:function(val){
			var extMode = this.$form.find("[name='EXT_MODE']").combobox('value') ;
			if(extMode=='1'){//脚本
				this.$(".js-task-ext-mode-div").append(
					"    <div class=\"m-t-xs input-group js-task-ext-mode\" mode-group >	"
                    +"		<textarea name=\"EXT_SQL\" class=\"form-control\" rows='4' ></textarea> "
                    +"		<span class=\"input-group-addon js-task-ext-mode-del\"><i class=\"fa fa-close\"></i></span>	"
                	+"	</div>");

            	var scriptText = this.$form.find(":input[name='EXT_SQL']:last")[0] ;

        		var editor = codemirror.fromTextArea(scriptText, {
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
					$(scriptText).val(val);
				}.bind(this));
				if(val) editor.setValue(val);
				this.editors.push(editor);
			}else if(extMode=='2'){//服务
				this.$(".js-task-ext-mode-div").append(
					" <div class='js-task-ext-mode'> "
					+"    <div class=\"m-t-xs input-group\" mode-group> "
					+"        <input group=\"SERVICE_SERV\" class=\"form-control\" data-rule=\""+this.i18nData.SERVICE_SERV+":required;length[1~2048, true]\" placeholder=\""+this.i18nData.FOR_EXAMPLE+":com.ztesoft.zsmart.oss.core.pm.CheckRule\"> "
					+"        <span class=\"input-group-addon js-task-ext-mode-cog\"><i class=\"fa fa-cog\"></i></span> "
					+"        <span class=\"input-group-addon js-task-ext-mode-del\"><i class=\"fa fa-close\"></i></span> "
					+"    </div> "
					+"</div> ");
			}

		},
		checkRuleDel:function(event){

			$(event.target).parents(".js-task-ext-mode").remove();
		},
		checkRuleConfig:function(event){
			if($(event.target).parents("div[mode-group]").next().hasClass("js-task-ext-mode-param-div")){
				$(".js-task-ext-mode-param-div").remove();
				return false;
			}
			$(".js-task-ext-mode-param-div").remove();
			$(event.target).parents("div[mode-group]").after(
				"<div class=\"wrapper bg-light js-task-ext-mode-param-div\"> "
				+"    <div class=\"m-b-sm overflow-y-h\"> "
				+"        <b>"+this.i18nData.SERVICE_SERV_PARAM+"</b> "
				+"        <a href=\"#\" class=\"ad-link pull-right js-task-ext-mode-param-add\" ><i class=\"fa fa-plus\"></i></a> "
				+"    </div> "
				+"    <div class=\"table-responsive ad-table  m-b-none js-task-ext-mode-param-grid\"></div> "
				+"</div> ");

			var $grid = this.$(".js-task-ext-mode-param-grid");
			this.paramGrid = $grid.jqGrid({
				colModel: this.paramModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				rownumbers:true,

				afterEditCell: function (e,rowid,name,value,iRow,iCol) {
					return false;
		        },
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.PARAM_DEL_CONFIRM,function(t) {
						this.paramGrid.jqGrid("delRowData", rowdata);
					}.bind(this));
					return false;
				}.bind(this),
				afterSaveCell : function(e,rowid,name,value,iRow,iCol) {
					$(".js-task-ext-mode-param-div").parents(".js-task-ext-mode").prop("rowData",this.paramGrid.jqGrid("getRowData"));
		        }.bind(this),
			});
			this.paramGrid.jqGrid("setGridHeight", 100);
			this.paramGrid.jqGrid("reloadData", $(event.target).parents(".js-task-ext-mode").prop("rowData"));
		},
		checkRuleAddParam: function(){
			var data = {};
			this.paramGrid.jqGrid("addRowData", data, 'last');
			this.paramGrid.jqGrid("setSelection",data);
		},
		refreshEditor:function(){
			fish.forEach(this.editors, function(editor,index) {
				if(editor){
					(editor).refresh();
				}
			}.bind(this));
		},

	});
});
