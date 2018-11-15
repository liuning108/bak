define([
	'text!oss_core/inms/pm/meta/model/busi/templates/ModelBusiMgr.html',
	'text!oss_core/inms/pm/meta/model/busi/templates/ModelBusiBase.html',
	'text!oss_core/inms/pm/meta/model/busi/templates/ModelBusiField.html',
	'i18n!oss_core/inms/pm/meta/model/busi/i18n/model.busi',
	'oss_core/inms/pm/meta/model/busi/actions/ModelBusiAction',
	'oss_core/inms/pm/meta/model/phy/actions/ModelPhyAction',
	'oss_core/inms/pm/util/views/Util',
],function(modelTpl, modelBaseTpl, modelFieldTpl, i18nModel, modelAction, modelPhyAction, pmUtil){
	return fish.View.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(modelTpl),
		baseTpl: fish.compile(modelBaseTpl),
		fieldTpl: fish.compile(modelFieldTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nModel),
		events: {
			"click .js-model-add-copy .js-new": 'addModel',
			"click .js-model-add-copy .js-copy-new": 'addCopyModel',
			"click .js-field-add": 'addField',
			"click .js-model-busi-ok": 'ok',
			"click .js-model-busi-cancel": 'cancel',
			"keyup .js-mo-code":'codeToUpper',
			"blur  .js-mo-code":'codeToUpper',
			"click .js-field-batch-add": 'addBatchField',
			"click .js-field-batch-edit":'editBatchField',
			"click .js-field-batch-del":'delField',
			"click .js-busy-search":'search',
			"click .js-busy-reset":'reset',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.defaultNYear = parseInt(pmUtil.parameter("defaultNYear").val());
			this.codePrefix = pmUtil.parameter("codePrefix").val();
			this.colModelModel = [{
				name: 'MODEL_BUSI_NAME',
				label: this.i18nData.MODEL_BUSI_NAME,
				width: "18%",
				sortable: true,
				editable: true,
				search: true
			}, {
				name: "MODEL_BUSI_CODE",
				label: this.i18nData.MODEL_BUSI_CODE,
				width: "18%",
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
				name: "MODEL_PHY",
				label: this.i18nData.MODEL_PHY,
				width: "36%",
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
				width: "15",
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
				width: "14",
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
				width: "10",
				editable: true,
				formatter: "select",
                edittype: "select",
                editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("FIELD_TYPE")),
				//editrules:"required;",
				default:"1",
			}, {
				name: "DATA_TYPE",
				label: this.i18nData.DATA_TYPE,
				width: "10",
				editable: true,
				formatter: "select",
                edittype: "select",
                editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("DATA_TYPE")),
				//editrules:"required;",
				default:"2",
			}, {
				name: "DIM_CODE",
				label: this.i18nData.DIM_CODE,
				width: "14",
				editable: true
			}, {
				name: "PHY_COL",
				label: this.i18nData.PHY_COL,
				width: "18",
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
			if (options.iframeHeight) {
                this.tableH = options.iframeHeight ? options.iframeHeight : $(".ui-tabs-panel").height();
            }
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			this.$(".js-model-busi-base").html(this.baseTpl(this.i18nData));
			this.$(".js-model-busi-field").html(this.fieldTpl(this.i18nData));
			return this;
		},
		afterRender: function(){
			//this.resize();
			this.$form = this.$(".js-model-busi-detail-form");
			this.$form.find("[name='EFF_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});

			this.$form.find("[name='EXP_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});
			this.$(".js-model-busi-detail-tab").tabs({
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
						case "tabs-active-model":
							$(".js-model-busi-field-button").hide();
							break;
						case "tabs-inactive-model":
							portal.utils.gridIncHeight(this.$(".js-model-busi-field-grid:visible"),this.$(".js-model-busi-field").height()-this.$(".js-model-busi-field-grid").outerHeight());
							$(".js-model-busi-field-button").show();
							break;
					}
				}.bind(this)
			});
			this.loadTree();
			this.loadModelGrid();
			this.loadFieldGrid();
			this.$(".js-model-busi-detail-button").height($('.js-model-busi-grid .ui-jqgrid-pager').outerHeight());
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
				height: this.tableH,
				expandColumn: "CAT_NAME",
				treeGrid: true,
				colHide: true,
				pagebar: true,
				onSelectRow: function(e, rowid, state) {
					var selectRow = this.catTree.jqGrid("getRowData", rowid);
					var type = selectRow.type;
					if(type=="VER"){
						var parent = this.catTree.jqGrid("getNodeParent", selectRow);
						this.getModelByEMS(parent.REL_ID,selectRow.CAT_CODE);
					}else if(type=="EMS"){
						this.EMS_CODE = selectRow.CAT_CODE;
						this.getModelByEMS(selectRow.REL_ID,'-1');
					}
				}.bind(this)
			});

			pmUtil.loadEMSTree(this.catTree);

		},
		renderModelPhyCode: function(rowdata){
			var id = this.catTree.jqGrid('getGridParam','selrow');
			var selectRow = this.catTree.jqGrid("getRowData", id);
			var type = selectRow.type;
			if(type=="VER"){
				var parent = this.catTree.jqGrid("getNodeParent", selectRow);
				var REL_ID = parent.REL_ID;
				var VER_CODE = selectRow.CAT_CODE
			}else if(type=="EMS"){
				var REL_ID = selectRow.REL_ID;
				var VER_CODE = '-1';
			}
			var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
			modelPhyAction.qryModel(param, function(data) {
				if (data && data.modelList){
					this.$form.find("[name='MODEL_PHY_CODE']").combobox({
						dataTextField: 'MODEL_PHY',
				        dataValueField: 'MODEL_PHY_CODE',
				        dataSource: data.modelList
					});
					if(rowdata && rowdata.MODEL_PHY){
						this.$form.find("[name='MODEL_PHY_CODE']").combobox('value',rowdata.MODEL_PHY_CODE);
					}
				}
			}.bind(this));
		},
		loadModelGrid: function(){
			var $grid = this.$(".js-model-busi-grid");
			this.modelGrid = $grid.jqGrid({
				colModel: this.colModelModel,
				pagebar: true,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editModel(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.MODEL_DEL_CONFIRM,function(t) {
						this.delModel(rowdata);
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this.selModel(rowid);
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[
			// {
		 //        caption: this.i18nData.COMMON_NEW,
		 //        cssprop: "js-new"
   //          },{
   //              caption: this.i18nData.COPY_NEW,
   //              cssprop: "js-copy-new"
   //          }
            ]);
		},
		loadFieldGrid: function(){
			var that = this;
			var $grid = this.$(".js-model-busi-field-grid");
			this.fieldGrid = $grid.jqGrid({
				colModel: this.fieldModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				multiselect: true,
				rownumbers:true,

				afterEditCell: function (e,rowid,name,value,iRow,iCol) {

		            if($.inArray(name, ["EFF_TIME","EXP_TIME"])>=0){

			            $("#" + rowid+"_" + name, ".js-model-busi-field-grid").datetimepicker({
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
			        	$("#" + rowid+"_" + name).attr("maxLength","64");
			        }
			        if(name=="DIM_CODE"){
			        	$("#" + rowid+"_" + name).attr("maxLength","32");
			        }
			        if(name=="PHY_COL"){
			        	$("#" + rowid+"_" + name).attr("maxLength","32");
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
			this.$(".js-model-busi-field-grid").jqGrid('sortableRows');
		},
		resize: function(delta){
			if(this.$(".js-model-busi-right-panel").is(":visible")){
				if (this.$(".js-model-busi-left-panel").height() >= this.$(".js-model-busi-right-panel").height()) {
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
					portal.utils.gridIncHeight(this.$(".js-model-busi-grid"), this.$(".js-model-busi-left-panel").height() - this.$(".js-model-busi-right-panel").height());

				} else {
					portal.utils.gridIncHeight(this.$(".js-model-busi-grid"),delta);
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-model-busi-right-panel").height() - this.$(".js-model-busi-left-panel").height());
				}
			}else if(this.$(".js-model-busi-detail-panel").is(":visible")){

				if (this.$(".js-model-busi-left-panel").height() >= this.$(".js-model-busi-detail-panel").height()) {
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
					var hDiff = this.$(".js-model-busi-left-panel").height() - this.$(".js-model-busi-detail-panel").height() ;
					portal.utils.incHeight(this.$(".js-model-busi-detail-panel"), hDiff);
					portal.utils.incHeight(this.$(".js-model-busi-detail-tab"), hDiff);
					portal.utils.incHeight(this.$(".js-model-busi-base"),hDiff);
					portal.utils.incHeight(this.$(".js-model-busi-field"),hDiff);
					portal.utils.gridIncHeight(this.$(".js-model-busi-field-grid:visible"),hDiff);
				} else {
					portal.utils.incHeight(this.$(".js-model-busi-detail-panel"),delta);
					portal.utils.incHeight(this.$(".js-model-busi-detail-tab"),delta);
					portal.utils.incHeight(this.$(".js-model-busi-base"),delta);
					portal.utils.incHeight(this.$(".js-model-busi-field"),delta);
					portal.utils.gridIncHeight(this.$(".js-model-busi-field-grid:visible"),delta);
					portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-model-busi-detail-panel").height() - this.$(".js-model-busi-left-panel").height());
				}
				this.$(".js-model-busi-base").parent().height(this.$(".js-model-busi-base").height());
				this.$(".js-model-busi-field").parent().height(this.$(".js-model-busi-field").height());
				this.$(".js-model-busi-base").slimscroll({height:this.$(".js-model-busi-base").height()});
			}
		},
		showDetailPanel: function(){
			var h = this.$(".js-model-busi-right-panel").height();
			$('.js-model-busi-right-panel').hide();
			$('.js-model-busi-detail-panel').fadeIn(1500);
			this.$(".js-model-busi-detail-panel").height(h);
			this.$(".js-model-busi-detail-tab").height(h-this.$(".js-model-busi-detail-button").height());
			var tabHeight = this.$(".js-model-busi-detail-tab").height()-this.$(".js-model-busi-detail-tab .tabs__navbar").height();
			this.$(".js-model-busi-base").height(tabHeight);
			this.$(".js-model-busi-field").height(tabHeight);
			this.$(".js-model-busi-base").slimscroll({height:tabHeight});
			portal.utils.gridIncHeight(this.$(".js-model-busi-field-grid:visible"),this.$(".js-model-busi-field").height()-this.$(".js-model-busi-field-grid").outerHeight());
			this.$form.resetValid();
		},
		hideDetailPanel: function(){
			var h = this.$(".js-model-busi-detail-panel").height();
			$('.js-model-busi-detail-panel').hide();
			$('.js-model-busi-right-panel').fadeIn(1500);
			portal.utils.gridIncHeight(this.$(".js-model-busi-grid"),this.$(".js-model-busi-left-panel").height()-this.$(".js-model-busi-right-panel").height());
		},
		selModel: function(rowid){

		},
		addModel: function(){
			if(!this.EMS_VER_CODE && !this.EMS_CODE){
				fish.info(this.i18nData.SEL_EMS_OR_VER);
				return false;
			}
			this.renderModelPhyCode();
			this.showBlockUI(false);
			this.showDetailPanel();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-model-busi-ok").data("type", "add");
			this.$form.form('clear');
			this.codePrefixShow(true);
			this.$form.find("[name='EFF_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$form.find("[name='EXP_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), this.defaultNYear)));
			this.$form.find('input[name="MODEL_TYPE"]').eq(0).prop('checked', 'checked');
			this.$form.find("[name='FILENAME_RULE']").combobox('value', 'AL');
			this.$form.find("[name='PROC_RULE']").combobox('value', 'AL');
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$form.find("[name='MODEL_BUSI_NAME']").focus();
			this.fieldGrid.jqGrid("reloadData",[]);
		},
		addCopyModel: function(){
			var rowdata = this.modelGrid.jqGrid('getSelection');
			if(!rowdata["MODEL_BUSI_CODE"]){//没有选中数据,走普通新建
				this.addModel();
				return false;
			}
			if(!this.EMS_VER_CODE && !this.EMS_CODE){
				fish.info(this.i18nData.SEL_EMS_OR_VER);
				return false;
			}
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-model-busi-ok").data("type", "add");
			this.$form.form('clear');
			this.$form.form("value", rowdata);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='KPI_CODE']").val(rowdata['KPI_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='MODEL_BUSI_NAME']").focus();
			this.loadModeField(rowdata['MODEL_BUSI_CODE']);
		},
		editModel: function(rowdata){
			var that = this;
			this.renderModelPhyCode(rowdata);
            this.modelGrid.jqGrid("setSelection", rowdata);
			this.showBlockUI(true);
			this.showDetailPanel();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.codePrefixShow(false);
			this.$form.form('clear');
			this.$form.form("value", rowdata);
			this.$(".js-model-busi-ok").data("type", "edit");
			this.$form.find(":input[name='MODEL_BUSI_CODE']").attr("disabled",true);
			this.$form.find(":input[name='MODEL_BUSI_NAME']").focus();

			this.loadModeField(rowdata["MODEL_BUSI_CODE"]);
		},
		delModel: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			modelAction.operModel(value, function(data) {
				that.modelGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.MODEL_DEL_SUCCESS);
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
						modelAction: modelAction,
						pmUtil:pmUtil,
						data:datas,
					};
			fish.popupView({
				url: "oss_core/inms/pm/meta/model/busi/views/ModelBusiBatchMgr",
				viewOption: options,
				callback: function(popup, view) {
					//alert(view.batchData);
				}.bind(this),
				close: function(retData) {
					if(datas){//批量编辑
						var rowsData = that.fieldGrid.jqGrid("getCheckRows");
						/*
						fish.forEach(rowsData, function(row,index) {
							that.fieldGrid.jqGrid("setRowData",fish.extend({}, row, (retData[index]?retData[index]:{})));
						});
						*/
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
				value["OPER_TYPE"] = this.$(".js-model-busi-ok").data("type");
				value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				value["EMS_VER_CODE"] = this.EMS_VER_CODE;
				if(value["OPER_TYPE"] == "add"){
					value["MODEL_BUSI_CODE"] = value["CODE_PREFIX"]+value["MODEL_BUSI_CODE"];
				}
				value["MODEL_PHY"] = this.$form.find("[name='MODEL_PHY_CODE']").combobox('text');
				value["modelField"] 	= this.fieldGrid.jqGrid("getRowData");
				var fieldValid = true;
				var fieldCodeArr = [];
				fish.forEach(value["modelField"],function(modelField,index){
					if(!$.trim(modelField['FIELD_NAME'])){
						fieldValid = false;
						fish.info(this.i18nData.FIELD_NAME_ISNULL);
						return false;
					}
					var fieldCode = $.trim(modelField['FIELD_CODE']).toUpperCase() ;
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

				modelAction.operModel(value, function(data) {

					if(that.$(".js-model-busi-ok").data("type")=="edit"){
						var	rowdata = this.modelGrid.jqGrid("getSelection");
						that.modelGrid.jqGrid("setRowData",fish.extend({}, rowdata, data));
						fish.success(that.i18nData.MODEL_EDIT_SUCCESS);
					}else{
						that.modelGrid.jqGrid("addRowData", data, 'last');
						that.modelGrid.jqGrid("setSelection", data);
						fish.success(that.i18nData.MODEL_NEW_SUCCESS);
					}
					that.cancel();
				}.bind(this));
			}else{
				$(".js-model-busi-detail-tab").tabs("option", "active",0);
				return false;
			}
		},
		btnDisabled: function(bool){
			$('.js-model-busi-ok').attr("disabled",bool);
			$('.js-model-busi-cancel').attr("disabled",bool);
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

		getModelByEMS:function(REL_ID,VER_CODE){
			if(!this.EMS_TYPE_REL_ID
				|| !this.EMS_VER_CODE
				|| this.EMS_TYPE_REL_ID!=REL_ID
				|| this.EMS_VER_CODE!=VER_CODE){

				this.EMS_TYPE_REL_ID = REL_ID;
				this.EMS_VER_CODE = VER_CODE;
				var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
				modelAction.qryModel(param, function(data) {
					if (data && data.modelList){
						this.modelGrid.jqGrid("reloadData",data.modelList);
					}
				}.bind(this));
				modelPhyAction.qryModel(param, function(data) {
					if (data && data.modelList){
						this.$form.find("[name='MODEL_PHY_CODE']").combobox({
							dataTextField: 'MODEL_PHY',
					        dataValueField: 'MODEL_PHY_CODE',
					        dataSource: data.modelList
						});
					}
				}.bind(this));
			}
		},
		codeToUpper:function(event){
			if(this.$(".js-model-busi-ok").data("type")=="add"){
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
				this.$(".js-model-busi-left-panel").blockUI({baseZ:1,blockMsgClass:'fade'}).data('blockui-content', true);
	        }else{
	        	this.$(".js-model-busi-left-panel").unblockUI().data('blockui-content', false);
	        }
		},
		loadModeField: function(modelCode){
			this.fieldGrid.jqGrid("reloadData",[]);
			if(!modelCode) return false;
			var that = this;
			modelAction.qryModelField({"MODEL_BUSI_CODE":modelCode}, function(data) {
				if (data && data.modelField){
					that.fieldGrid.jqGrid("reloadData",data.modelField);
				}
			}.bind(this));
		},
		search:function(){
			if(!this.EMS_VER_CODE && !this.EMS_CODE){
				return false;
			}
			var ModelVal = $.trim(this.$(".js-busy-search-input").val());
			var id = this.catTree.jqGrid('getGridParam','selrow');
			var selectRow = this.catTree.jqGrid("getRowData", id);
			var type = selectRow.type;
			if(type=="VER"){
				var parent = this.catTree.jqGrid("getNodeParent", selectRow);
				var REL_ID = parent.REL_ID;
				var VER_CODE = selectRow.CAT_CODE
			}else if(type=="EMS"){
				var REL_ID = selectRow.REL_ID;
				var VER_CODE = '-1';
			}
			var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
			if(ModelVal){
				param['MODEL_BUSI_NAME'] = ModelVal;
			}
			modelAction.qryModel(param, function(data) {
				if (data && data.modelList){
					this.modelGrid.jqGrid("reloadData",data.modelList);
				}
			}.bind(this));
		},
		reset:function(){
			this.$(".js-busy-search-input").val("");
			this.search();
		}
	});
});
