define([
	'text!oss_core/inms/pm/meta/measure/templates/MeasureMgr.html',
	'text!oss_core/inms/pm/meta/measure/templates/MeasureBase.html',
	'text!oss_core/inms/pm/meta/measure/templates/MeasureField.html',
	'i18n!oss_core/inms/pm/meta/measure/i18n/measure',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
	'oss_core/inms/pm/util/views/Util',
],function(measureTpl, measureBaseTpl, measureFieldTpl, i18nMeasure, measureAction, pmUtil){
	return fish.View.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(measureTpl),
		baseTpl: fish.compile(measureBaseTpl),
		fieldTpl: fish.compile(measureFieldTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nMeasure),
		events: {
			"click .js-measure-add-copy .js-new": 'addMeasure',
			"click .js-measure-add-copy .js-copy-new": 'addCopyMeasure',
			"click .js-field-add": 'addField',
			"click .js-measure-ok": 'ok',
			"click .js-measure-cancel": 'cancel',
			"keyup .js-mo-code":'codeToUpper',
			"blur  .js-mo-code":'codeToUpper',
			"click .js-field-batch-add": 'addBatchField',
			"click .js-field-batch-edit":'editBatchField',
			"click .js-field-batch-del":'delField',
			"click .js-filename-rule-btn":'showFileNameRuleBox',
			"click .js-proc-rule-btn":'showProcRuleBox',
			"click .js-filename-rule-param-btn":'addParam',
			"click .js-proc-rule-param-btn":'addParam',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.FILENAME_RULE = "";
			this.PROC_RULE = "";
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.defaultNYear = parseInt(pmUtil.parameter("defaultNYear").val());
			this.codePrefix = pmUtil.parameter("codePrefix").val();
			//alert(JSON.stringify(pmUtil.paraToGridSel(pmUtil.paravalue("FIELD_TYPE"))));
			this.colMeasureModel = [{
				name: 'MO_NAME',
				label: this.i18nData.MO_NAME,
				width: "20%",
				sortable: true,
				editable: true,
				search: true
			}, {
				name: "MO_CODE",
				label: this.i18nData.MO_CODE,
				width: "20%",
				sortable: true,
				editable: true,
				search: true
			}, {
				name: 'EFF_TIME',
				label: this.i18nData.EFF_DATE,
				width: "12%",
				sortable: true,
				editable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat
                }
			}, {
				name: "EXP_TIME",
				label: this.i18nData.EXP_DATE,
				width: "12%",
				sortable: true,
				editable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat
                }
			}, {
				name: "MO_NAME_DESC",
				label: this.i18nData.MO_NAME_DESC,
				width: "28%",
				sortable: true,
				editable: true
			}, {
				sortable: false,
				label: "",
				width: "8%",
				formatter: 'actions',
				formatoptions: {
					editbutton: true,
					delbutton: true
				}
			}];
			this.fieldModel = [{
				name: 'FIELD_NAME',
				label: this.i18nData.FIELD_NAME,
				width: "30",
				editable: true,
				//editrules:"required;"
			}, {
				name: "FIELD_CODE",
				label: this.i18nData.FIELD_CODE,
				width: "15",
				editable: true,
				//editrules:"required;"
			}, {
				name: 'EFF_TIME',
				label: this.i18nData.EFF_DATE,
				width: "12",
				editable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat
                },
				//editrules:"required;",
				default:pmUtil.sysdate('date'),
			}, {
				name: 'FIELD_TYPE',
				label: this.i18nData.FIELD_TYPE,
				width: "12",
				editable: true,
				formatter: "select",
                edittype: "select",
                editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("FIELD_TYPE")),
				default:"1",
			}, {
				name: "DATA_TYPE",
				label: this.i18nData.DATA_TYPE,
				width: "12",
				editable: true,
				formatter: "select",
        edittype: "select",
        editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("DATA_TYPE")),
				//editrules:"required;",
				default:"1",
			}, {
				name: "VAFIELD",
				label: this.i18nData.FILE_FIELD_CODE,
				width: "15",
				editable: true
			}, {
				sortable: false,
				label: "",
				width: "4",
				formatter: 'actions',
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];
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
			this.$(".js-measure-base").html(this.baseTpl(this.i18nData));
			this.$(".js-measure-field").html(this.fieldTpl(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.fileNamePlugin = [];
			this.procRulePlugin = [];
			this.paraToRadio(this.$(".js-mo-type-div"),"MO_TYPE");
			this.$form = this.$(".js-measure-detail-form");

			this.$form.find("[name='EFF_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});

			this.$form.find("[name='EXP_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});

			pmUtil.utilAction.qryPluginSpec({'PLUGIN_TYPE':'03'}, function(data) {
				if (data && data.pluginList){
					this.fileNamePlugin = data.pluginList;
					this.$("[name='FILENAME_RULE_SPEC']").combobox({
						dataTextField: 'PLUGIN_NAME',
				        dataValueField: 'PLUGIN_SPEC_NO',
				        dataSource: data.pluginList
					});
				}
			}.bind(this),true);

			pmUtil.utilAction.qryPluginSpec({'PLUGIN_TYPE':'04'}, function(data) {
				if (data && data.pluginList){
					this.procRulePlugin = data.pluginList;
					this.$("[name='PROC_RULE_SPEC']").combobox({
						dataTextField: 'PLUGIN_NAME',
				        dataValueField: 'PLUGIN_SPEC_NO',
				        dataSource: data.pluginList
					});
				}
			}.bind(this),true);


			this.$(".js-measure-detail-tab").tabs({
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
						case "tabs-active-measure":
							$(".js-measure-field-button").hide();
							break;
						case "tabs-inactive-measure":
							portal.utils.gridIncHeight(this.$(".js-measure-field-grid:visible"),this.$(".js-measure-field").height()-this.$(".js-measure-field-grid").outerHeight());
							$(".js-measure-field-button").show();
							break;
					}
				}.bind(this)
			});

			this.loadParamGrid(this.$(".js-filename-rule-param-grid"));
			this.loadParamGrid(this.$(".js-proc-rule-param-grid"));
			this.loadTree();
			this.loadMeasureGrid();
			this.loadFieldGrid();
			this.$(".js-measure-detail-button").height($('.js-measure-grid .ui-jqgrid-pager').outerHeight());
		},
		loadParamGrid: function($grid){
			var that = this;

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

		loadTree: function(){
			var $tree = this.$(".js-catalog-tree");
			this.catTree = $tree.jqGrid({
				colModel: [{
					name: 'CAT_NAME',
					label: "",
					width: "100",
				}, {
					name: "REL_ID",
					label: "",
					width: "0",
					key: true,
					hidden:true
				}],

				expandColumn: "CAT_NAME",
				treeGrid: true,
				colHide: true,
				pagebar: true,
				onSelectRow: function(e, rowid, state) {
					var selectRow = this.catTree.jqGrid("getRowData", rowid);
					var type = selectRow.type;
					if(type=="VER"){
						var parent = this.catTree.jqGrid("getNodeParent", selectRow);
						//var emsNode = this.catTree.jqGrid("getNodeParent", parent);
						this.EMS_CODE = parent.CAT_CODE;
						this.getMeasureByEMS(parent.REL_ID,selectRow.CAT_CODE);
					}
				}.bind(this)
			});
			pmUtil.loadEMSTree(this.catTree);

		},
		loadMeasureGrid: function(){
			var $grid = this.$(".js-measure-grid");
			this.measureGrid = $grid.jqGrid({
				colModel: this.colMeasureModel,
				pagebar: true,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editMeasure(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.MO_DEL_CONFIRM,function(t) {
						this.delMeasure(rowdata);
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this.selMeasure(rowid);
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[
			/*{
		        caption: this.i18nData.COMMON_NEW,
		        cssprop: "js-new"
            },
            {
                caption: this.i18nData.COPY_NEW,
                cssprop: "js-copy-new"
            }*/
            ]);
		},
		loadFieldGrid: function(){
			var that = this;
			var $grid = this.$(".js-measure-field-grid");
			this.fieldGrid = $grid.jqGrid({
				colModel: this.fieldModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				multiselect: true,
                multiselectWidth: 30,
				rownumbers:true,

				afterEditCell: function (e,rowid,name,value,iRow,iCol) {

		            if($.inArray(name, ["EFF_TIME","EXP_TIME"])>=0){

			            $("#" + rowid+"_" + name, ".js-measure-field-grid").datetimepicker({
			                buttonIcon: '',
			                viewType: 'date',
			                format	: this.dateFormat,
			            });
			        }
			        if(name=="FIELD_CODE"){
			        	$("#" + rowid+"_" + name).attr("maxLength","32")
			        	$("#" + rowid+"_" + name).keyup(function(){
			        		var val = $("#" + rowid+"_" + name).val();
								val = val.replace(/[^\w]/g, "").replace(/^\-/g, "");
								$("#" + rowid+"_" + name).val(val);
			        	});
			        }
			        if(name=="FIELD_NAME"){
			        	$("#" + rowid+"_" + name).attr("maxLength","512");
			        }
			        if(name=="VAFIELD"){
			        	$("#" + rowid+"_" + name).attr("maxLength","256");
			        }

		        }.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {

					that.delField(rowdata);
					return false;

				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					return false;
				}.bind(this)
			});
			this.$(".js-measure-field-grid").jqGrid('sortableRows');
		},
		resize: function(delta){
			if(this.$(".js-measure-right-panel").is(":visible")){
				if (this.$(".js-measure-left-panel").height() >= this.$(".js-measure-right-panel").height()) {
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
					portal.utils.gridIncHeight(this.$(".js-measure-grid"), this.$(".js-measure-left-panel").height() - this.$(".js-measure-right-panel").height());

				} else {
					portal.utils.gridIncHeight(this.$(".js-measure-grid"),delta);
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-measure-right-panel").height() - this.$(".js-measure-left-panel").height());
				}
			}else if(this.$(".js-measure-detail-panel").is(":visible")){

				if (this.$(".js-measure-left-panel").height() >= this.$(".js-measure-detail-panel").height()) {
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
					var hDiff = this.$(".js-measure-left-panel").height() - this.$(".js-measure-detail-panel").height() ;
					portal.utils.incHeight(this.$(".js-measure-detail-panel"), hDiff);
					portal.utils.incHeight(this.$(".js-measure-detail-tab"), hDiff);
					portal.utils.incHeight(this.$(".js-measure-base"),hDiff);
					portal.utils.incHeight(this.$(".js-measure-field"),hDiff);
					portal.utils.gridIncHeight(this.$(".js-measure-field-grid:visible"),hDiff);
				} else {
					portal.utils.incHeight(this.$(".js-measure-detail-panel"),delta);
					portal.utils.incHeight(this.$(".js-measure-detail-tab"),delta);
					portal.utils.incHeight(this.$(".js-measure-base"),delta);
					portal.utils.incHeight(this.$(".js-measure-field"),delta);
					portal.utils.gridIncHeight(this.$(".js-measure-field-grid:visible"),delta);
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-measure-detail-panel").height() - this.$(".js-measure-left-panel").height());
				}
				this.$(".js-measure-base").parent().height(this.$(".js-measure-base").height());
				this.$(".js-measure-field").parent().height(this.$(".js-measure-field").height());
				this.$(".js-measure-base").slimscroll({height:this.$(".js-measure-base").height()});
			}
		},
		showDetailPanel: function(){
			var h = this.$(".js-measure-right-panel").height();
			$('.js-measure-right-panel').hide();
			$('.js-measure-detail-panel').fadeIn(1500);
			this.$(".js-measure-detail-panel").height(h);
			this.$(".js-measure-detail-tab").height(h-this.$(".js-measure-detail-button").height());
			var tabHeight = this.$(".js-measure-detail-tab").height()-this.$(".js-measure-detail-tab .tabs__navbar").height();
			this.$(".js-measure-base").height(tabHeight);
			this.$(".js-measure-field").height(tabHeight);
			this.$(".js-measure-base").slimscroll({height:tabHeight});
			portal.utils.gridIncHeight(this.$(".js-measure-field-grid:visible"),this.$(".js-measure-field").height()-this.$(".js-measure-field-grid").outerHeight());
			this.$form.resetValid();
			this.$(".js-filename-rule-param-grid").jqGrid("reloadData",[]);
			this.$(".js-proc-rule-param-grid").jqGrid("reloadData",[]);
		},
		hideDetailPanel: function(){
			var h = this.$(".js-measure-detail-panel").height();
			$('.js-measure-detail-panel').hide();
			$('.js-measure-right-panel').fadeIn(1500);
			portal.utils.gridIncHeight(this.$(".js-measure-grid"),this.$(".js-measure-left-panel").height()-this.$(".js-measure-right-panel").height());
		},
		selMeasure: function(rowid){

		},
		addMeasure: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			this.showBlockUI(false);
			this.showDetailPanel();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-measure-ok").data("type", "add");
			this.$form.form('clear');
			this.codePrefixShow(true);
			this.$form.find("[name='EFF_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$form.find("[name='EXP_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), this.defaultNYear)));
			this.$form.find('input[name="MO_TYPE"]').eq(0).prop('checked', 'checked');
			var filenameSpec = (this.fileNamePlugin && this.fileNamePlugin.length > 0)?this.fileNamePlugin[0]['PLUGIN_SPEC_NO']:'';
			var procRuleSpec = (this.procRulePlugin && this.procRulePlugin.length > 0)?this.procRulePlugin[0]['PLUGIN_SPEC_NO']:'';
			this.$form.find("[name='FILENAME_RULE_SPEC']").combobox('value', filenameSpec);
			this.$form.find("[name='PROC_RULE_SPEC']").combobox('value', procRuleSpec);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$form.find("[name='MO_NAME']").focus();
			this.fieldGrid.jqGrid("reloadData",[]);
			this.FILENAME_RULE = "";
			this.PROC_RULE = "";
		},
		addCopyMeasure: function(){
			var rowdata = this.measureGrid.jqGrid('getSelection');
			if(!rowdata["MO_CODE"]){//没有选中数据,走普通新建
				this.addMeasure();
				return false;
			}
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-measure-ok").data("type", "add");
			this.$form.form('clear');

			this.$form.form("value", rowdata);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='MO_CODE']").val(rowdata['MO_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='MO_NAME']").focus();
			this.loadMeasureField(rowdata["MO_CODE"]);
			this.FILENAME_RULE = "";
			this.PROC_RULE = "";
			if(rowdata['FILENAME_RULE']){
				this.loadPluginParam(this.$(".js-filename-rule-param-grid"),{"PLUGIN_NO":rowdata['FILENAME_RULE'],"PLUGIN_TYPE":"03"});
			}
			if(rowdata['PROC_RULE']){
				this.loadPluginParam(this.$(".js-proc-rule-param-grid"),{"PLUGIN_NO":rowdata['PROC_RULE'],"PLUGIN_TYPE":"04"});
			}
		},
		editMeasure: function(rowdata){
			var that = this;
			this.showBlockUI(true);
			this.showDetailPanel();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.codePrefixShow(false);
			this.$form.form('clear');
			this.$form.form("value", rowdata);
			this.FILENAME_RULE = rowdata["FILENAME_RULE"];
			this.PROC_RULE = rowdata["PROC_RULE"];
			this.$(".js-measure-ok").data("type", "edit");
			this.$form.find(":input[name='MO_CODE']").attr("disabled",true);
			this.$form.find(":input[name='MO_NAME']").focus();

			//var moCode = this.$form.find(":input[name='MO_CODE']").val();
			this.loadMeasureField(rowdata["MO_CODE"]);
			if(rowdata['FILENAME_RULE']){
				this.loadPluginParam(this.$(".js-filename-rule-param-grid"),{"PLUGIN_NO":rowdata['FILENAME_RULE'],"PLUGIN_TYPE":"03"});
			}
			if(rowdata['PROC_RULE']){
				this.loadPluginParam(this.$(".js-proc-rule-param-grid"),{"PLUGIN_NO":rowdata['PROC_RULE'],"PLUGIN_TYPE":"04"});
			}
		},
		delMeasure: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			if(value["FILENAME_RULE"]){
				value["fileNamePlugin"] = {"OPER_TYPE":value["OPER_TYPE"],"PLUGIN_TYPE":'03'};
				value["fileNamePlugin"]["PLUGIN_NO"] = value["FILENAME_RULE"];
			}
			if(value["PROC_RULE"]){
				value["procRulePlugin"] = {"OPER_TYPE":value["OPER_TYPE"],"PLUGIN_TYPE":'04'};
				value["procRulePlugin"]["PLUGIN_NO"] = value["PROC_RULE"];
			}
			measureAction.operMeasure(value, function(data) {
				that.measureGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.MO_DEL_SUCCESS);
			}.bind(this));
		},
		addBatchField: function() {
			this.batchField();
		},
		editBatchField: function() {
			var rowsData = this.fieldGrid.jqGrid("getCheckRows");
			if(rowsData.length > 0){
				this.batchField(rowsData);
			}else{
				fish.info(this.i18nData.SEL_FIELD_EDIT);
				return false;
			}
		},
		batchField:function(datas){
			var that = this;
			var options = {
						i18nData: this.i18nData,
						measureAction: measureAction,
						pmUtil:pmUtil,
						data:datas,
					};
			fish.popupView({
				url: "oss_core/inms/pm/meta/measure/views/MeasureBatchMgr",
				viewOption: options,
				callback: function(popup, view) {
					//alert(view.batchData);
				}.bind(this),
				close: function(retData) {
					if(datas){//批量编辑
						var rowsData = that.fieldGrid.jqGrid("getCheckRows");
						//alert(rowsData.length+"||"+retData.length);
						if(rowsData.length >= retData.length){
							fish.forEach(rowsData, function(row,index) {
								if(retData[index]){
									that.fieldGrid.jqGrid("setRowData",fish.extend({}, row, retData[index]));
								}else{
									that.fieldGrid.jqGrid("delRowData",row);
								}
							});
						}else{
							fish.forEach(retData, function(ret,index) {
								if(rowsData[index]){
									that.fieldGrid.jqGrid("setRowData",fish.extend({}, rowsData[index], ret));
								}else{
									that.fieldGrid.jqGrid("addRowData",ret, 'last');
								}
							});
						}
					}else{//批量新增
						that.fieldGrid.jqGrid("addRowData", retData, 'last');
					}
				}
			});
		},
		cancel: function() {
			this.showBlockUI(false);
			this.hideDetailPanel();
			this.codePrefixShow(false);
		},
		ok: function() {
			if (this.$form.isValid()) {
				if(!this.EMS_VER_CODE){
					fish.info(this.i18nData.SEL_EMS_VER);
					return false;
				}
				var that = this;
				var value = this.$form.form("value");
				value["BP_ID"] = this.bpId;
				value["OPER_TYPE"] = this.$(".js-measure-ok").data("type");
				value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				value["EMS_VER_CODE"] = this.EMS_VER_CODE;
				value["EMS_CODE"] = this.EMS_CODE;
				value["IS_COL_HEADER"] = value["IS_COL_HEADER"]?value["IS_COL_HEADER"]:"0";
				value["IS_QUOT"] = value["IS_QUOT"]?value["IS_QUOT"]:"0";
				if(value["OPER_TYPE"] == "add"){
					value["MO_CODE"] = value["CODE_PREFIX"]+value["MO_CODE"];
				}

				value["fileNamePlugin"] = {"OPER_TYPE":(this.FILENAME_RULE?'edit':'add'),
					"CODE_PREFIX":this.codePrefix,"PLUGIN_TYPE":'03',
					"PLUGIN_SPEC_NO":value["FILENAME_RULE_SPEC"],
					"BP_ID":this.bpId};
				fish.forEach(this.fileNamePlugin,function(plugin,index){
					if(plugin['PLUGIN_SPEC_NO'] == value["FILENAME_RULE_SPEC"]){
						value["fileNamePlugin"]["PLUGIN_CLASSPATH"] = plugin['PLUGIN_CLASSPATH'] ;
						value["fileNamePlugin"]["PLUGIN_NAME"] = plugin['PLUGIN_NAME']
					}
				});
				value["fileNamePlugin"]["PLUGIN_NO"] = this.FILENAME_RULE?this.FILENAME_RULE:"";
				value["fileNamePlugin"]["pluginParam"] = this.$(".js-filename-rule-param-grid").jqGrid("getRowData");

				value["procRulePlugin"] = {"OPER_TYPE":(this.PROC_RULE?'edit':'add'),
					"CODE_PREFIX":this.codePrefix,"PLUGIN_TYPE":'04',
					"PLUGIN_SPEC_NO":value["PROC_RULE_SPEC"],
					"BP_ID":this.bpId};
				fish.forEach(this.procRulePlugin,function(plugin,index){
					if(plugin['PLUGIN_SPEC_NO'] == value["PROC_RULE_SPEC"]){
						value["procRulePlugin"]["PLUGIN_CLASSPATH"] = plugin['PLUGIN_CLASSPATH'] ;
						value["procRulePlugin"]["PLUGIN_NAME"] = plugin['PLUGIN_NAME']
					}
				});
				value["procRulePlugin"]["PLUGIN_NO"] = this.PROC_RULE?this.PROC_RULE:"";
				value["procRulePlugin"]["pluginParam"] = this.$(".js-proc-rule-param-grid").jqGrid("getRowData");
				value["moField"] = this.fieldGrid.jqGrid("getRowData");

				var fieldValid = true;
				var fieldCodeArr = [];
				fish.forEach(value["moField"],function(moField,index){
					if(!$.trim(moField['FIELD_NAME'])){
						fieldValid = false;
						fish.info(this.i18nData.FIELD_NAME_ISNULL);
						return false;
					}
					var fieldCode = $.trim(moField['FIELD_CODE']).toUpperCase() ;
					if(!fieldCode){
						fieldValid = false;
						fish.info(this.i18nData.FIELD_CODE_ISNULL);
						return false;
					}else{

						if($.inArray(fieldCode, fieldCodeArr)>=0){
							fieldValid = false;
							fish.info(this.i18nData.FIELD_CODE_REPEAT);
							return false;
						}else{
							fieldCodeArr.push(fieldCode);
						}
					}
				}.bind(this));
				if(!fieldValid) return ;
				measureAction.operMeasure(value, function(data) {

					if(that.$(".js-measure-ok").data("type")=="edit"){
						var	rowdata = this.measureGrid.jqGrid("getSelection");
						that.measureGrid.jqGrid("setRowData",fish.extend({}, rowdata, data));
						fish.success(that.i18nData.MO_EDIT_SUCCESS);
					}else{
						that.measureGrid.jqGrid("addRowData", data, 'last');
						that.measureGrid.jqGrid("setSelection", data);
						fish.success(that.i18nData.MO_NEW_SUCCESS);
					}
					that.cancel();
				}.bind(this));
			}else{
				$(".js-measure-detail-tab").tabs("option", "active",0);
				return false;
			}
		},
		btnDisabled: function(bool){
			$('.js-measure-ok').attr("disabled",bool);
			$('.js-measure-cancel').attr("disabled",bool);
		},
		addField: function(){
			var rowsData =  this.fieldGrid.jqGrid("getCheckRows");
			if(rowsData.length <= 0){
				var rowsData = [];
				var rowid = this.fieldGrid.jqGrid("getGridParam", "selrow");
				if(rowid){
					rowsData.push(this.fieldGrid.jqGrid("getSelection",rowid));
				}else{
					rowsData.push({});
				}
			}
			var that = this;
			fish.forEach(rowsData, function(row) {
				var data = {};
				fish.forEach(that.fieldModel, function(col) {
					data[col.name] = row[col.name]?row[col.name]:col.default;
				});
				that.fieldGrid.jqGrid("addRowData", data, 'last');
				that.fieldGrid.jqGrid("setSelection",data);
			});
		},
		delField: function(event){
			var rowsData = [];
			if(event && !event.target){
				if(!event["FIELD_CODE"]){
					//this.fieldGrid.jqGrid("delRowData", event);
					//return false ;
				}
				rowsData.push(event);
			}else{
				rowsData = this.fieldGrid.jqGrid("getCheckRows");
			}
			if(rowsData.length > 0){
				var that = this;
				fish.confirm(this.i18nData.FIELD_DEL_CONFIRM,function(t) {
					fish.forEach(rowsData, function(row) {
						that.fieldGrid.jqGrid("delRowData", row);
					});
				}.bind(this));
			}else{
				fish.info(this.i18nData.SEL_FIELD_DEL);
				return false;
			}
		},
		getMeasureByEMS:function(REL_ID,VER_CODE){
			if(!this.EMS_TYPE_REL_ID
				|| !this.EMS_VER_CODE
				|| this.EMS_TYPE_REL_ID!=REL_ID
				|| this.EMS_VER_CODE!=VER_CODE){

				this.EMS_TYPE_REL_ID = REL_ID;
				this.EMS_VER_CODE = VER_CODE;
				var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
				measureAction.qryMeasure(param, function(data) {
					if (data && data.moList){
						this.measureGrid.jqGrid("reloadData",data.moList);
					}
				}.bind(this));
			}
		},
		codeToUpper:function(event){
			if(this.$(".js-measure-ok").data("type")=="add"){
				var val = $(event.target).val();
				val = val.replace(/[^\w]/g, "").replace(/^\-/g, "");
				$(event.target).val(val.toUpperCase());
			}
		},
		codePrefixShow:function(flag){
			if(flag){
				$(".js-code-prefix-div").show();
				$(".js-mo-code-div").css("width","85%");
			}else{
				$(".js-code-prefix-div").hide();
				$(".js-mo-code-div").css("width","100%");
			}
		},
		showBlockUI: function(show){
			if(show){
				this.$(".js-measure-left-panel").blockUI({baseZ:1,blockMsgClass:'fade'}).data('blockui-content', true);
	        }else{
	        	this.$(".js-measure-left-panel").unblockUI().data('blockui-content', false);
	        }
		},
		loadMeasureField: function(moCode){
			this.fieldGrid.jqGrid("reloadData",[]);
			if(!moCode) return false;
			var that = this;
			measureAction.qryMeasureField({"MO_CODE":moCode}, function(data) {
				if (data && data.moField){
					that.fieldGrid.jqGrid("reloadData",data.moField);
				}
			}.bind(this))
		},
		loadPluginParam: function($grid,param){
			pmUtil.utilAction.qryPluginParam(param,function(data) {
				if(data && data.pluginParam){
					$grid.jqGrid("reloadData",data.pluginParam);
				}
			},true);
		},
		paraToRadio:function(parent,paraName){
			if(!parent) return "";
			fish.forEach(pmUtil.paravalue(paraName),function(para,index){
        		parent.append("<label class=\"radio-inline\">"
							+"    <input type='radio' name='"+paraName+"' class='form-control' value='"+para[pmUtil.parakey.val]+"' />"+para[pmUtil.parakey.name]
							+"</label> ");
        	});
		},
		showFileNameRuleBox: function(){
			$('.js-filename-rule-param-box').toggleClass('fadeInUp animated block');
			this.$(".js-filename-rule-param-grid:visible").jqGrid("setGridHeight", 120);
			this.$(".js-filename-rule-param-grid:visible").jqGrid("setGridWidth", this.$(".js-filename-rule-param-grid").parent().width());

		},
		showProcRuleBox: function(){
			$('.js-proc-rule-param-box').toggleClass('fadeInUp animated block');
			this.$(".js-proc-rule-param-grid:visible").jqGrid("setGridHeight", 120);
			this.$(".js-proc-rule-param-grid:visible").jqGrid("setGridWidth", this.$(".js-proc-rule-param-grid").parent().width());
		},
		addParam: function(event){
			var data = {};
			$("."+$(event.target).attr('grid')).jqGrid("addRowData", data, 'last');
			$("."+$(event.target).attr('grid')).jqGrid("setSelection",data);
		},
		delParam: function(rowdata,$grid){
			fish.confirm(this.i18nData.PARAM_DEL_CONFIRM,function(t) {
				$grid.jqGrid("delRowData", rowdata);
			}.bind(this));
		},
	});
});
