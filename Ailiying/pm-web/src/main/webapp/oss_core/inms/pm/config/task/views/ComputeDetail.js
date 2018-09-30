define([
	'text!oss_core/inms/pm/config/task/templates/compute/ComputeDetail.html',
	'text!oss_core/inms/pm/config/task/templates/compute/DataCheckStep.html',
	'text!oss_core/inms/pm/config/task/templates/compute/DataMergeStep.html',
	'text!oss_core/inms/pm/config/task/templates/compute/DataMapStep.html',
	'oss_core/inms/pm/config/task/views/merge/MergeView',
	'oss_core/inms/pm/meta/model/phy/actions/ModelPhyAction',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
],function(computeTpl, dataCheckTpl, dataMergeTpl, dataMapTpl, merge, modelPhyAction, measureAction, codemirror){
	return portal.BaseView.extend({
		template: fish.compile(computeTpl),
		dataCheck: fish.compile(dataCheckTpl),
		dataMerge: fish.compile(dataMergeTpl),
		//dataKpi: fish.compile(dataKpiTpl),
		dataMap: fish.compile(dataMapTpl),
		events: {
			'click .js-compute-add-step': 'computeAddStep',
			'click .js-compute-del-step': 'computeDelStep',

			'click .js-compute-check-add': 'checkRuleAdd',
			'click .js-compute-check-del': 'checkRuleDel',
			'click .js-compute-check-cog': 'checkRuleConfig',
			'click .js-compute-check-param-add': 'checkRuleAddParam',

			"click .js-compute-merge-mo-list-add":'getMoList',
			"click .js-compute-merge-mo-list-ok":'returnMoList',
			"click .js-compute-merge-mo-list-cancel":'cancelMoList',
			//"click .js-compute-merge-mo-list-close":'closeMoList',
			"click .js-compute-map-ul li a":'clickScriptTabs',
			'keyup .js-compute-merge-mo-list-seling-search':'searchSeling',
			'click .js-compute-merge-mo-list-seling-all':'selingAll',
		},
		initialize: function(options) {
			this.pluginType = '02';
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
			this.pmUtil.extContains();
		},
		domComplete: function(){
			this.pluginList = [];
			this.editors = {};
			if(this.EMS_TYPE_REL_ID && this.EMS_VER_CODE){
				var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
				this.getMo(param);
			}
			this.pmUtil.utilAction.qryPluginSpec({'PLUGIN_TYPE':this.pluginType}, function(data) {
				if (data && data.pluginList){
					this.pluginList = data.pluginList;
				}
			}.bind(this),true);
			$(".js-compute-detail-div").slimscroll({height:300,width:635});
		},
		getMo:function(param){
			param["FIELD_TYPE"] = '0';
			measureAction.qryMeasure(param, function(data) {
				if (data && data.moList){
					this.moList = data.moList;
					this.getModelPhy();
				}
			}.bind(this));
		},
		getModelPhy:function(){
			var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID} ;//,"EMS_VER_CODE":this.EMS_VER_CODE
			param["MODEL_TYPE"] = '1'; //Statistical model
			modelPhyAction.qryModel(param, function(data) {

				if (data && data.modelList){
					this.modelPhyList = data.modelList;
					this.getMoField(param);
				}
			}.bind(this));
		},
		getMoField:function(param){
			param["FIELD_TYPE"] = '0';
			measureAction.qryMeasureField(param, function(data) {
				if (data){
					this.moField = data.moField;
					this.loadComputeDetail();
				}
			}.bind(this));
		},
		getMoField:function(param){
			param["FIELD_TYPE"] = '0';
			measureAction.qryMeasureField(param, function(data) {
				if (data){
					this.moField = data.moField;
					this.loadComputeDetail();
				}
			}.bind(this));
		},
		ok: function(){

			var stepObj = this.getStepObj();
			if(!stepObj){
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
			if(stepObj["stepList"].length < 1){
				fish.info(this.i18nData.TASK_DETAIL_NULL);
				return false;
			}

			return stepObj;
		},
		loadComputeDetail: function(){
			$(".js-compute-step-div").append(this.dataCheck(this.i18nData));
			$(".js-compute-step-div").append(this.dataMerge(this.i18nData));
			//$(".js-compute-step-div").append(this.dataKpi(this.i18nData));

			this.computeUpdateStepSeq();
			this.mergeViewInit();

			this.loadComputeDetailParam();
		},
		loadComputeDetailParam:function(){
			if(!this.datas || !this.datas.TASK_NO){
				this.checkRuleAdd();
				this.computeAddStep();
				return false;
			}
			var param = {"TASK_NO":this.datas.TASK_NO, 'TYPE':'param', 'PLUGIN_TYPE':this.pluginType,'PARAM_CODE':'CHECK_SERV'} ;
			this.taskAction.qryDetail(param, function(data) {
				if (data){
					//data.plugin;
					//data.pluginParam;

					//data.stepList;
					//data.stepParamList;
					var stepParamList = data.stepParamList ;
					fish.forEach(data.stepList, function(stepObj,index) {
						if(stepObj['STEP_NO']=='1'){

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
									if(code == 'CHECK_SERV'){
										this.checkRuleAdd();
										var pluginObj = $.grep( data.pluginList, function(plugin,i){
											return (value == plugin["PLUGIN_NO"]);
										});
										if(pluginObj.length > 0){

											$("input[group='CHECK_SERV']:last").combobox('value',pluginObj[0]["PLUGIN_SPEC_NO"]);
										}

										var rowData = $.grep( data.pluginParam, function(param,i){
											return (value == param["PLUGIN_NO"]);
										});

										$(".js-compute-check-rule:last").prop("rowData",rowData);
									}
								}
							}.bind(this));
						}
						if(stepObj['STEP_NO']=='3'){
							var isMergeCol = [false];
							var isOutCol = [false];
							var mergeData = {};
							var fieldCols = [];
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
									var maxIndex = 0;
									if($.inArray(code,['MERGE_COL_NO','OUT_COL_NO','OTHER_COL_NO'])>=0){ //'OUT_COL_NO',
										var existIdx = -1;
										fish.forEach(fieldCols, function(fieldCol,index) {
											if(fieldCol==value){
												existIdx = index;
												return false;
											}
										});
										if(existIdx < 0){
											fieldCols.push(value);
											var fields = value.split(",");
											fish.forEach(fields, function(mo_field) {

												var mo = mo_field.substring(0,mo_field.indexOf('.'));
												var field = mo_field.substring(mo_field.indexOf('.')+1,mo_field.length);

												if(!mergeData[mo]){
													mergeData[mo] = [];
												}
												for(var i=mergeData.length;i<maxIndex;i++){
													mergeData[mo].push("");
												}
												mergeData[mo].push(field);

											});
										}

										if(existIdx < 0){
											if(code=='MERGE_COL_NO'){
												isMergeCol.push(true);
											}else{
												isMergeCol.push(false);
											}
											if(code=='OUT_COL_NO'){
												isOutCol.push(true);
											}else{
												isOutCol.push(false);
											}
										}else{
											if(code=='MERGE_COL_NO'){
												isMergeCol[existIdx+1] = true;
											}
											if(code=='OUT_COL_NO'){
												isOutCol[existIdx+1] = true;
											}
										}
										++maxIndex;
									}
								}
							}.bind(this));

							//alert(JSON.stringify(mergeData));

							$.each(mergeData, function(moCode, fieldArr) {
								var fields = [];
								var moName;

								fish.forEach(fieldArr, function(field) {
									if(field){
										var fieldObj = $.grep( this.moField, function(mo_field,i){
											return (moCode == mo_field["MO_CODE"] && field == mo_field["FIELD_CODE"]);
										});
										if(fieldObj.length > 0){
											fields.push({'code':field,'name':fieldObj[0]["FIELD_NAME"]});
											moName = fieldObj[0]["MO_NAME"];
										}else{
											fields.push({});
										}
									}else{
										fields.push({});
									}
								}.bind(this));
								this.mergeMoAdd(moCode,moName,fields);
							}.bind(this));

							this.mergeView.putMergeCol(isMergeCol);
							this.mergeView.putOutCol(isOutCol);
						}
						if(stepObj['STEP_NO']=='5'){
							this.computeAddStep(stepObj, stepParamList);
						}
					}.bind(this));

				}
			}.bind(this));
		},
		computeAddStep: function(stepObj,stepParamList){

			$(".js-compute-step-div").append(this.dataMap(this.i18nData));
			var addForm = this.computeUpdateStepSeq();

			$(addForm).find("[name='BUSINESS_MODEL']").combobox({
				dataTextField: "MODEL_PHY_NAME",
		        dataValueField: "MODEL_PHY_CODE",
		        dataSource:  this.modelPhyList,
			});
			$(addForm).find("[name='GRANU']").combobox({});

			$(addForm).find("[name='BUSINESS_MODEL']").on('combobox:change', function () {
				var modelCode = $(addForm).find("[name='BUSINESS_MODEL']").combobox('value') ;
				this.modelComboxChange(addForm,modelCode);
		    }.bind(this));

			this.loadComputeMapTabs(addForm);
			//this.pmUtil.tab($(addForm).find('.js-compute-map-tab'),{});

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
							formObj[code] = value;
						}
					}
				}.bind(this));

				$(addForm).form('value',formObj);
				this.modelComboxChange(addForm,formObj['BUSINESS_MODEL']);
				$(addForm).find("[name='GRANU']").combobox('value',formObj['GRANU']?formObj['GRANU']:'');


				$.each(groupObj, function(no, obj) {
					if(typeof obj === 'object'){


						$.each(this.editors, function(db_dialect, editorArr) {
							if(db_dialect == obj["DB_DIALECT"]){
								fish.forEach(editorArr, function(arr) {
									if(arr['form'] == addForm){
										var val = $.trim(obj["EXT_SQL"]?obj["EXT_SQL"]:"") ;

										(arr['editor']).setValue(val);

										if(val){
											var $tab = this.pmUtil.tab($(addForm).find('.js-compute-map-tab'),{}) ;
											var index = $(addForm).find(":input[group='EXT_SQL'][db_dialect='"+db_dialect+"']").attr('index');
											$tab.checked(parseInt(index),true);
										}
										return false;
									}
								}.bind(this));
							}
						}.bind(this));

						/*
						fish.forEach($(addForm).find(":input[group='EXT_SQL']"), function(extSql,seq) {
							if($(extSql).attr("db_dialect") == obj["DB_DIALECT"]){
								$(extSql).val(obj["EXT_SQL"]);
								return false;
							}
						});
						*/
					}
				}.bind(this));

			}else{
				this.seq++;
				$(addForm).attr("task_step_id",(this._L8+this.seq+this._L8));//生成一个前后8个下划线的临时ID,后台保存时,如果判断是此规则的ID ,则重新生成ID,否则直接使用
			}

		},
		computeDelStep: function(event){
			$(event.target).parents("form").parent().remove();

			this.computeUpdateStepSeq();
		},
		computeUpdateStepSeq:function(){
			var lastForm ;
			fish.forEach($(".js-compute-step-div form[step_no]"), function(form,index) {
				$(form).find(".js-compute-step-seq").text(index+1);
				if(!$(form).attr("task_step_id")){
					this.seq++;
					$(form).attr("task_step_id",this._L8+this.seq+this._L8);
				}
				lastForm = form;
			}.bind(this));
			return lastForm;
		},



		checkRuleAdd:function(){
			this.$(".js-compute-check-rule-div").append(
				"<div class=\"col-md-12 m-t-xs js-compute-check-rule\">	"
				+"    <div class=\"input-group js-compute-check-rule-group\" style='width:100%' > "
				+"        <input group=\"CHECK_SERV\" class=\"form-control\" data-rule=\""+this.i18nData.DATA_CHECK_RULE+":required;\" placeholder=\""+this.i18nData.COMMON_PLS_SEL+"\"> "
				+"        <span class=\"input-group-addon js-compute-check-cog\"><i class=\"fa fa-cog\"></i></span> "
				+"        <span class=\"input-group-addon js-compute-check-del\"><i class=\"fa fa-close\"></i></span> "
				+"    </div> "
				+"</div> ");

			this.$("input[group='CHECK_SERV']:last").combobox({
						dataTextField: 'PLUGIN_NAME',
				        dataValueField: 'PLUGIN_SPEC_NO',
				        dataSource: this.pluginList
					});

		},
		checkRuleDel:function(event){
			$(event.target).parents(".js-compute-check-rule").remove();
		},
		checkRuleConfig:function(event){
			if($(event.target).parents(".js-compute-check-rule-group").next().hasClass("js-compute-check-param-div")){
				$(".js-compute-check-param-div").remove();
				return false;
			}
			$(".js-compute-check-param-div").remove();
			$(event.target).parents(".js-compute-check-rule-group").after(
				"<div class=\"wrapper bg-light js-compute-check-param-div\"> "
				+"    <div class=\"m-b-sm overflow-y-h\"> "
				+"        <b>"+this.i18nData.DATA_CHECK_RULE_PARAM+"</b> "
				+"        <a href=\"#\" class=\"ad-link pull-right js-compute-check-param-add\" ><i class=\"fa fa-plus\"></i></a> "
				+"    </div> "
				+"    <div class=\"table-responsive ad-table  m-b-none js-compute-check-param-grid\"></div> "
				+"</div> ");

			var $grid = this.$(".js-compute-check-param-grid");
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
						$(".js-compute-check-param-div").parents(".js-compute-check-rule").prop("rowData",this.paramGrid.jqGrid("getRowData"));
					}.bind(this));
					return false;
				}.bind(this),
				afterSaveCell : function(e,rowid,name,value,iRow,iCol) {
					$(".js-compute-check-param-div").parents(".js-compute-check-rule").prop("rowData",this.paramGrid.jqGrid("getRowData"));
		        }.bind(this),
			});
			this.paramGrid.jqGrid("setGridHeight", 100);
			this.paramGrid.jqGrid("reloadData", $(event.target).parents(".js-compute-check-rule").prop("rowData"));
		},
		checkRuleAddParam: function(){
			var data = {};
			this.paramGrid.jqGrid("addRowData", data, 'last');
			this.paramGrid.jqGrid("setSelection",data);
		},

		mergeViewInit:function(){
			var options = {};
			options.i18nData = this.i18nData;
			this.mergeView = new merge(options);
            $('.js-compute-merge-div').html(this.mergeView.render().$el);
            this.mergeView.afterRender();
        },
		initMoItem: function(form,moCode,moName){
			$(form).find(".js-compute-merge-mo-list-seling-item").append("<label class=\"checkbox-inline\" title='"+moName+"("+moCode+")"+"'><input type=\"checkbox\" mo_code='"+moCode+"' mo_name='"+moName+"'>"+moName+"</label>");
		},
		getMoList: function(event){

			var that = this;
			$(".js-compute-merge-mo-list-ok:visible").each(function(){
					that.siwtchMoBtn($(this).parents("form"));
				}
			);

			var form = $(event.target).parents("form") ;
			this.siwtchMoBtn(form);
			$(form).find(".js-compute-merge-mo-list-seling-item").empty();
			$(form).find(".js-compute-merge-mo-list-seling-search").val("");
			$(form).find(".js-compute-merge-mo-list-seling-all").attr('checked', false);
            $(form).find(".js-compute-merge-mo-list-seling-all").prop('checked', false);


			var mergeMo = this.mergeView.getData();

			var initCnt = 0;
			fish.forEach(this.moList, function(molist,index) {

				var isValid = true;
				fish.forEach(mergeMo, function(moItem,index) {
					if(molist["MO_CODE"] == moItem[0]){
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
				$(form).find(".js-compute-merge-mo-list-seling-item").html(this.i18nData.NO_O_SEL);
			}
		},
		returnMoList: function(event){
			var form = $(event.target).parents("form") ;

			var that = this;
			$(form).find(".js-compute-merge-mo-list-seling-item input[type=checkbox]:checked").each(function(index,mo){
				var moName = $(mo).attr("mo_name"),moCode = $(mo).attr("mo_code");

				var fields = [];
				fish.forEach(this.moField, function(field) {
					if(field['MO_CODE'] == moCode){
						fields.push({'code':field["FIELD_CODE"],'name':field["FIELD_NAME"]});
					}
				});
				this.mergeMoAdd(moCode,moName,fields,true);


			}.bind(this));

			this.siwtchMoBtn(form);
		},
		cancelMoList: function(event){
			var form = $(event.target).parents("form") ;
			this.siwtchMoBtn(form);
		},
		/*
		closeMoList: function(event){
			$(event.target).parent().parent().remove();
		},
		*/
		siwtchMoBtn:function(form){
			$(form).find(".js-compute-merge-mo-list-add").toggleClass("hide");
			$(form).find(".js-compute-merge-mo-list-ok").toggleClass("hide");
			$(form).find(".js-compute-merge-mo-list-cancel").toggleClass("hide");
			$(form).find(".js-compute-merge-mo-list-seled-div").toggleClass("hide");
			$(form).find(".js-compute-merge-mo-list-seling-div").toggleClass("hide");
		},
		mergeMoAdd:function(moCode,moName,fields,isGrouping){
			model={};
			model.no=moCode;
			model.name=moName?moName:moCode;
			model.datas=[];
			var mergeMo = this.mergeView.getData();
			for(var i=0;i<fields.length;i++){
				var data={};
				data.no=fields[i]['code']?fields[i]['code']:"";
				data.name=fields[i]['name']?fields[i]['name']:"";
				data.index= (mergeMo.length-2 <= 0)?1:(mergeMo.length-1);
				model.datas.push(data);
			}

			this.mergeView.putAll([model],isGrouping);
		},

		getStepObj: function(){
			var isValid = true;
			var value = {"stepList":[],"stepParamList":[] };
			value['PLUGIN_TYPE'] = this.pluginType;
			value['PARAM_CODE'] = 'CHECK_SERV';
			fish.forEach($(".js-compute-step-div form[step_no]"), function(form,index) {
				var stepNo = $(form).attr("step_no");
				var step = {'TASK_STEP_ID':$(form).attr('task_step_id'),'STEP_NO':stepNo ,'TASK_STEP_NAME':$(form).attr("step_name") };

				if(stepNo=="1"){//CFG_CHECK
					var isExistCheckServ = false;
					fish.forEach($(form).find(":input[group='CHECK_SERV']"), function(check,seq) {
						if($.trim($(check).val())){
							var pluginObj = {};
							pluginObj["PLUGIN_NO"] = "";
							pluginObj["CODE_PREFIX"] = this.pmUtil.parameter("codePrefix").val();
							pluginObj["PLUGIN_TYPE"] = this.pluginType;
							pluginObj["PLUGIN_SPEC_NO"] = $(check).combobox('value');

							fish.forEach(this.pluginList,function(plugin,index){
								if(plugin['PLUGIN_SPEC_NO'] == pluginObj["PLUGIN_SPEC_NO"]){
									pluginObj["PLUGIN_CLASSPATH"] = plugin['PLUGIN_CLASSPATH'] ;
								}
							});

							pluginObj["pluginParam"] = $(check).parents(".js-compute-check-rule").prop("rowData");

							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'CHECK_SERV', 'PARAM_VALUE':""}, {'plugin':pluginObj} ) );
							isExistCheckServ = true;
						}
					}.bind(this));
					if(!isExistCheckServ){
						isValid = false;
						fish.info(this.i18nData.DATA_CHECK_RULE_ISNULL);
						return false;
					}
				}
				if(stepNo=="3"){//CFG_MERG
					var mergeData = this.mergeView.getData();
					if(mergeData.length <= 2){
						isValid = false;
						fish.info(this.i18nData.TASK_MERGE_NULL);
						return false;
					}
					this.seq++;
					var moStep = {'TASK_STEP_ID':(this._L8+this.seq+this._L8),'STEP_NO':'2' ,'TASK_STEP_NAME':'CFG_ADDMO'};
					value["stepList"].push(fish.extend({},moStep,{'STEP_SEQ':value["stepList"].length,'TASK_STEP_SEQ':value["stepList"].length }));

					var isExistMergeCol = false;
					for(var i=0;i < mergeData[0].length;i++){
						var mergeCol = "";
						var outCol = "";
						var otherCol = "";
						fish.forEach(mergeData, function(data) {
							if(typeof data[0] === 'string'){
								if(i==0){
									value["stepParamList"].push( fish.extend({},moStep,{'PARAM_CODE':'MO_NO', 'PARAM_VALUE':data[0]}) );
								}else{
									if(mergeData[0][i]){
										if(!data[i]){
											isValid = false;
											fish.info(this.i18nData.TASK_MERGE_VALUE_NULL);
											return false;
										}
										if(mergeCol){
											mergeCol += ","+data[0]+"."+data[i];
										}else{
											mergeCol = data[0]+"."+data[i];
										}
									}
									if(mergeData[mergeData.length-1][i] && data[i]){
										if(outCol){
											outCol += ","+data[0]+"."+data[i];
										}else{
											outCol = data[0]+"."+data[i];
										}
									}
									if(!mergeData[0][i] && !mergeData[mergeData.length-1][i] && data[i]){
										if(otherCol){
											otherCol += ","+data[0]+"."+data[i];
										}else{
											otherCol = data[0]+"."+data[i];
										}
									}
								}
							}
						}.bind(this));

						if(mergeCol){
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'MERGE_COL_NO', 'PARAM_VALUE':mergeCol}) );
							isExistMergeCol = true;
						}
						if(outCol){
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'OUT_COL_NO', 'PARAM_VALUE':outCol}) );
						}
						if(otherCol){
							value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':'OTHER_COL_NO', 'PARAM_VALUE':otherCol}) );
						}
					}

					if(mergeData.length >=4 && !isExistMergeCol){
						isValid = false;
						fish.info(this.i18nData.TASK_MERGE_COL_NULL);
						return false;
					}
				}
				if(stepNo=="5"){//CFG_DATAMAP
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
					if (!$(form).isValid()) {
						isValid = false;
						return false;
					}
					var isExist = false;
					fish.forEach($(form).find(":input[group='EXT_SQL']"), function(sql,seq) {
						if($.trim($(sql).val())){
							value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':1,'PARAM_CODE':'DB_DIALECT', 'PARAM_VALUE':$(sql).attr("db_dialect")}) );
							value["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':2,'PARAM_CODE':'EXT_SQL', 'PARAM_VALUE':$.trim($(sql).val()) }) );
							isExist = true;
						}
					}.bind(this));
					if(!isExist){
						isValid = false;
						fish.info(this.i18nData.DATA_MAP_SQL_ISNULL);
						return false;
					}
				}

				var param = $(form).form("value");
				$.each(param, function(code, val) {
					value["stepParamList"].push( fish.extend({},step,{'PARAM_CODE':code, 'PARAM_VALUE':val}) );
				});
				value["stepList"].push( fish.extend({},step,{'STEP_SEQ':value["stepList"].length,'TASK_STEP_SEQ':value["stepList"].length}) ) ;

			}.bind(this));
			if(!isValid) return false;
			return value;
		},
		loadComputeMapTabs:function(form){

			fish.forEach(this.pmUtil.paravalue("DB_DIALECT"),function(para,index){
				var db_dialect = para[this.pmUtil.parakey.val] ;
				$(form).find(".js-compute-map-ul").append("<li><a href='#demo-tabs-box-"+db_dialect+"' db_dialect='"+db_dialect+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+para[this.pmUtil.parakey.name]+"</a></li>") ;
        		$(form).find(".js-compute-map-content").append(
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
					var $tab = this.pmUtil.tab($(tabForm).find('.js-compute-map-tab'),{}) ;
					$tab.checked(index,!!val);
				}.bind(this));

				if(this.editors[db_dialect]){
					this.editors[db_dialect].push({'editor':editor,'form':tabForm});
				}else{
					this.editors[db_dialect] = [{'editor':editor,'form':tabForm}];
				}
        	}.bind(this));
			this.pmUtil.tab($(form).find('.js-compute-map-tab'),{});
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
				this.$(".js-compute-merge-mo-list-seling-item label").hide();
				this.$(".js-compute-merge-mo-list-seling-item label").filter(":contains('"+val+"')").show();
			}else{
				this.$(".js-compute-merge-mo-list-seling-item label").show();
			}
		},
		selingAll:function(event){
			var checked = $(event.target).is(':checked') ;

			$(".js-compute-merge-mo-list-seling-item input[type=checkbox]:visible").each(function(){
				$(this).attr('checked', checked);
                $(this).prop('checked', checked);
			});
		},
		modelComboxChange:function(form, modelCode){
			var granu ;

			fish.forEach(this.modelPhyList,function(mo_field){
				if(mo_field['MODEL_PHY_CODE']==modelCode){
					granu = mo_field['GRANU_MODE'] ;
					return false;
				}
			});

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

			$(form).find("[name='GRANU']").combobox({
				dataTextField: "GRANU_NAME",
		        dataValueField: "GRANU",
		        dataSource:  granuArr,
			});
			$(form).find("[name='GRANU']").combobox('value',(granuArr.length>0)?granuArr[0]["GRANU"]:'');
		},


	});
});
