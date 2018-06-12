portal.define([
	'text!oss_core/pm/meta/model/phy/templates/ModelPhyMgr.html',
	'text!oss_core/pm/meta/model/phy/templates/ModelPhyDetail.html',
	'i18n!oss_core/pm/meta/model/phy/i18n/model.phy',
	'oss_core/pm/meta/model/phy/actions/ModelPhyAction',
	'oss_core/pm/util/views/Util',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(modelTpl, modelDetailTpl, i18nModel, modelAction, pmUtil, codemirror){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(modelTpl),
		detailTpl: fish.compile(modelDetailTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nModel),
		events: {
			"click .js-model-phy-grid .js-new": 'addModel',
			"click .js-model-phy-grid .js-copy-new": 'addCopyModel',
			"click .js-model-phy-grid .js-batch-new": 'addBatchModel',
			"keyup .js-model-phy-code":'codeToUpper',
			"blur  .js-model-phy-code":'codeToUpper',
			"click .js-model-phy-ok": 'ok',
			"click .js-model-phy-cancel": 'cancel',
			"click .js-model-phy-script-ul li a":'clickScriptTabs',
			"click :radio[name='MODEL_TYPE']":'clickModelType',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.defaultNYear = parseInt(pmUtil.parameter("defaultNYear").val());
			this.codePrefix = pmUtil.parameter("codePrefix").val();
			this.colModel = [{
				name: 'MODEL_PHY_NAME',
				label: this.i18nData.MODEL_PHY_NAME,
				width: "25%",
				sortable: true,
				search: true
			}, {
				name: "MODEL_PHY_CODE",
				label: this.i18nData.MODEL_PHY_CODE,
				width: "25%",
				sortable: true,
				search: true
			}, {
				name: "MODEL_TYPE",
				label: this.i18nData.MODEL_TYPE,
				width: "12%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("MODEL_TYPE")),
			}, {
				name: 'EFF_TIME',
				label: this.i18nData.EFF_DATE,
				width: "15",
				sortable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat 
                }
			}, {
				name: "EXP_TIME",
				label: this.i18nData.EXP_DATE,
				width: "15",
				sortable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat 
                }
			}, {
				sortable: false,
				label: "",
				width: "8",
				formatter: 'actions',
				formatoptions: {
					editbutton: true,
					delbutton: true
				}
			}];
			
			
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			this.$(".js-model-phy-detail-content").html(this.detailTpl(this.i18nData));
			return this;
		},
		afterRender: function(){
			//this.resize();
			this.$form = this.$(".js-model-phy-detail-form");
			
			this.$form.find("[name='EFF_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});
			
			this.$form.find("[name='EXP_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});
			this.paraToRadio(this.$(".js-model-type-div"),"MODEL_TYPE");
			this.loadTree();
			this.loadGrid();
			this.loadScriptTab();
			this.loadDBSource();
			this.$(".js-model-phy-detail-button").height(this.$(".js-model-phy-grid  .ui-jqgrid-pager").outerHeight());
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
						this.getModelByEMS(parent.REL_ID,selectRow.CAT_CODE);
					}else if(type=="EMS"){
						this.EMS_CODE = selectRow.CAT_CODE;
						this.getModelByEMS(selectRow.REL_ID,'-1');
					}
					
				}.bind(this)
			});
			pmUtil.loadEMSTree(this.catTree);
			
		},
		
		loadDBSource: function(){

			this.dbid = "1000000";
			pmUtil.utilAction.qryDataSource({},function(data) {
				if(data){ 
					var dataSource = "";
					fish.forEach(data.sourceList, function(result,index) {
						if(dataSource){
							dataSource += ";"+result['ID'] + ":" + result['NAME'] ;
						}else{
							dataSource = result['ID'] + ":" + result['NAME'] ;
							this.dbid = result['ID'];
						}
					});
					this.granuModel = [{
						name: 'GRANU',
						label: this.i18nData.GRANU,
						width: "15",
						key:true,
						editable: false,
						editrules:"required;",
						formatter: "select",
		                editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("GRANU")),
					}, {
						name: "TABLE_MODE",
						label: this.i18nData.TABLE_MODE,
						width: "15",
						editable: true,
						editrules:"required;",
						formatter: "select",
		                edittype: "select",
						editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("TABLE_MODE")),
					}, {
						name: "DATA_SOURCE",
						label: this.i18nData.DATA_SOURCE,
						width: "15",
						editable: true,
						editrules:"required;",
						formatter: "select",
		                edittype: "select",
		                editoptions: {value:dataSource},
					}];
					 
				}
			}.bind(this));	
			
		},
		loadGrid: function(){
			var $grid = this.$(".js-model-phy-grid");
			this.modelGrid = $grid.jqGrid({
				colModel: this.colModel,
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
			$grid.grid("navButtonAdd",[{
                //title: this.i18nData.COMMON_ADD,
		        //buttonicon: 'fa fa-download',
		        caption: this.i18nData.COMMON_NEW,
		        cssprop: "js-new"
            },{
                caption: this.i18nData.COPY_NEW,
                cssprop: "js-copy-new"
            }
            /**
            ,{
                caption: this.i18nData.BATCH_NEW,
                cssprop: "js-batch-new"
            }**/
            ]);
			
		},
		loadGranuGrid: function(){
			if(!this.granuModel) return false;
			var that = this;
			var $grid = this.$(".js-granu-grid");
			this.granuGrid = $grid.jqGrid({
				colModel: this.granuModel,
				pagebar: false,
				sortable:true,
				cellEdit: true,
				multiselect: true,	
				height:138,		
				afterEditCell: function (e,rowid,name,value,iRow,iCol) {
			        
		        },
				onSelectRow: function(e, rowid, state) {
					return false;
				}.bind(this)
			});
			var granuPara = pmUtil.paravalue("GRANU") ;
			var granuList = [];
			fish.forEach(granuPara, function(granu,index) {
				/*
				var tm = '_YYYYMMDD' ;
				var gu = granu[pmUtil.parakey.val] ;
				if( $.inArray(gu, ["_D","_W"]) >= 0){
					tm = '_YYYYMM' ;
				}else if($.inArray(gu, ["_M"]) >= 0){
					tm = '_YYYY' ;
				}else if($.inArray(gu, ["_Y","None"]) >= 0){
					tm = 'None' ;
				}
				*/
				granuList.push({"GRANU":granu[pmUtil.parakey.val],"TABLE_MODE":"None","DATA_SOURCE":(this.dbid?this.dbid:'1000000')});
			}.bind(this));
			this.granuGrid.jqGrid("reloadData",granuList);
			
		},
		loadScriptTab: function(){
			this.editors = {};
			fish.forEach(pmUtil.paravalue("DB_DIALECT"),function(para,index){
				var script_type = para[pmUtil.parakey.val] ;
				this.$(".js-model-phy-script-ul").append("<li><a href='#demo-tabs-box-"+script_type+"' script_type='"+script_type+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+para[pmUtil.parakey.name]+"</a></li>") ;
        		this.$(".js-model-phy-script-content").append(
        			"<div id='demo-tabs-box-"+script_type+"' >"
					+"    <textarea name='SCRIPT' index='"+index+"' script_type='"+script_type+"' rows='4' class='form-control' ></textarea>"
					+"</div>"
        		);
        		var scriptText = document.getElementsByName('SCRIPT')[index] ;
        		var editor = codemirror.fromTextArea(scriptText, {
				    mode: 'text/x-plsql',
				    indentWithTabs: true,		    
				    smartIndent: true,
				    lineNumbers: true,
				    matchBrackets : true,
				    //autofocus: true,
				    //scrollbarStyle: 'null',
				});
				editor.setSize('height','220px');	
				editor.on("update",function(self){ 
					var val = $.trim(self.getValue()); 
					this.$tab.checked(index,!!val);
				}.bind(this));  
				this.editors[script_type] = editor ;
        	}.bind(this));
			this.$tab = pmUtil.tab(this.$('.js-model-phy-script-tab'),{});
		},
		/*
		loadTab: function(){
			$(".js-model-phy-script-tab").tabs();
			var dbDialect = pmUtil.paravalue("DB_DIALECT") ;
			fish.forEach(dbDialect, function(script,index) {
				$(".js-model-phy-script-tab").tabs("add",{
					id:script[pmUtil.parakey.val],
					label:script[pmUtil.parakey.name],
					active:(index==0),
					content:"<textarea name=\"SCRIPT\" script_type=\""+script[pmUtil.parakey.val]+"\" class=\"form-control\" ></textarea>"
				});
			});
		},
		*/
		resize: function(delta){
			
			if (this.$(".js-model-phy-left-panel").height() >= this.$(".js-model-phy-right-panel").height()) {
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
				var hDiff = this.$(".js-model-phy-left-panel").height() - this.$(".js-model-phy-right-panel").height();
				portal.utils.gridIncHeight(this.$(".js-model-phy-grid:visible"), hDiff);
				if(this.$(".js-model-phy-detail").is(":visible")){ 
					portal.utils.incHeight(this.$(".js-model-phy-detail"), hDiff);
					this.$(".js-model-phy-detail-content").height(this.$(".js-model-phy-detail").height()-this.$(".js-model-phy-detail-button").height());
					this.$(".js-model-phy-detail-content").parent().height(this.$(".js-model-phy-detail-content").height());
					this.$(".js-model-phy-detail-content").slimscroll({height:this.$(".js-model-phy-detail-content").height()});	
					//this.$(".js-model-phy-detail-button").height(this.$(".js-model-phy-detail-button").height());
				}
				
			} else {
				portal.utils.gridIncHeight(this.$(".js-model-phy-grid:visible"),delta);
				if(this.$(".js-model-phy-detail").is(":visible")){ 
					portal.utils.incHeight(this.$(".js-model-phy-detail"),delta);
					this.$(".js-model-phy-detail-content").height(this.$(".js-model-phy-detail").height()-this.$(".js-model-phy-detail-button").height());//
					this.$(".js-model-phy-detail-content").parent().height(this.$(".js-model-phy-detail-content").height());
					this.$(".js-model-phy-detail-content").slimscroll({height:this.$(".js-model-phy-detail-content").height()});	
					//this.$(".js-model-phy-detail-button").height(this.$(".js-model-phy-detail-button").height());
				}
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-model-phy-right-panel").height() - this.$(".js-model-phy-left-panel").height());
			}
			//alert(this.$(".js-model-phy-detail-button").height());
		},
		showDetailPanel: function(){
			var h = this.$(".js-model-phy-grid").height();
			$('.js-model-phy-grid').hide();
			$('.js-model-phy-detail').fadeIn(1000);
			if(!this.granuGrid){
				this.loadGranuGrid();
			}
			this.$(".js-model-phy-detail-content").height(h-this.$(".js-model-phy-detail-button").height());
			this.$(".js-model-phy-detail-content").parent().height(this.$(".js-model-phy-detail-content").height());
			this.$(".js-model-phy-detail-content").slimscroll({height:this.$(".js-model-phy-detail-content").height()});	
			this.$(".js-model-phy-detail").height(h);
			this.$(".js-model-phy-detail-panel").html(this.i18nData.COMMON_DETAIL);
			this.$form.resetValid();
			$.each(this.editors, function(script_type, editor) {  
				editor.refresh();
			});
		},
		hideDetailPanel: function(){
			var h = this.$(".js-model-phy-detail").height();
			$('.js-model-phy-detail').hide();
			$('.js-model-phy-grid').fadeIn(1000);
			this.$(".js-model-phy-grid").jqGrid("setGridHeight", h);
			this.$(".js-model-phy-detail-panel").html(this.i18nData.MODEL_LIST);
		},
		selModel: function(rowid){
			
		},
		addModel: function(){
			if(!this.EMS_VER_CODE && !this.EMS_CODE){
				fish.info(this.i18nData.SEL_EMS_OR_VER);
				return false;
			}
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-model-phy-ok").data("type", "add");
			this.$form.form('clear');
			this.$form.find('input[name="DIRT"]').eq(0).prop('checked', 'checked');
			this.$form.find('input[name="MODEL_TYPE"]').eq(0).prop('checked', 'checked');
			this.$form.find('input[name="DATA_TYPE"]').eq(0).prop('checked', 'checked');
			this.$form.find("[name='UNIT']").combobox('value', '1');
			this.$form.find("[name='MODEL_AGG']").combobox('value', '1');
			this.$form.find("[name='EFF_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$form.find("[name='EXP_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), this.defaultNYear)));
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$form.find(":input[name='MODEL_PHY_NAME']").focus();
			//this.granuGrid.jqGrid("setAllCheckRows",true);
			this.setModelType();
			this.clearEditors();
		},
		clearEditors: function(){
			$.each(this.editors, function(script_type, editor) {  
				editor.setValue("");
				var index = this.$form.find(":input[name='SCRIPT'][script_type='"+script_type+"']").attr('index');
				this.$tab.checked(parseInt(index),false);
			}.bind(this));
		},
		addCopyModel: function(){
			var rowdata = this.modelGrid.jqGrid('getSelection'); 
			if(!rowdata["MODEL_PHY_CODE"]){//没有选中数据,走普通新建
				this.addModel();
				return false;
			}
			if(!this.EMS_VER_CODE && !this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_OR_VER);
				return false;
			}
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-model-phy-ok").data("type", "add");
			this.$form.form('clear');
			this.clearEditors();
			this.setModelType();
			this.$form.form("value", rowdata);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='MODEL_PHY_CODE']").val(rowdata['MODEL_PHY_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='MODEL_PHY_NAME']").focus();
			this.setScript_Granu(rowdata);
		},
		editModel: function(rowdata){
			this.showBlockUI(true);
			this.showDetailPanel();
			this.codePrefixShow(false);	
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.form('clear');
			this.clearEditors();
			
			this.$form.form("value", rowdata);
			this.$form.find(":input[name='MODEL_PHY_CODE']").attr("disabled",true);		
			this.$form.find(":input[name='MODEL_PHY_NAME']").focus();
			this.$(".js-model-phy-ok").data("type", "edit");
			
			this.setScript_Granu(rowdata);
		},
		setScript_Granu: function(rowdata){
			var that = this;
			if(!rowdata || !rowdata['MODEL_PHY_CODE']) return false;
			var modelCode = rowdata['MODEL_PHY_CODE'];
			modelAction.qryModelScript({"MODEL_PHY_CODE":modelCode}, function(data) {
				if (data && data.modelScript){
					fish.forEach(data.modelScript, function(script) { 
						
						$.each(this.editors, function(script_type, editor) {  
							if(script_type == script["SCRIPT_TYPE"]){
								var val = editor.getValue();
								editor.setValue( (val?val:"") + (script["SCRIPT"]?script["SCRIPT"]:"") );
								
								if($.trim(editor.getValue())){
									var index = that.$form.find(":input[name='SCRIPT'][script_type='"+script_type+"']").attr('index');
									that.$tab.checked(parseInt(index),true);
								}
							}
						});
						
						/*
						fish.forEach($(":input[name='SCRIPT']"), function(scriptText) { 
							if($(scriptText).attr("script_type") == script["SCRIPT_TYPE"]){
								$(scriptText).val( $(scriptText).val() + script["SCRIPT"]);
							}
						});
						*/ 
					}.bind(this));
				} 
			}.bind(this));
			
			
			var that = this;
			that.granuGrid.jqGrid("setAllCheckRows",false);
			fish.forEach($.parseJSON(rowdata["GRANU_MODE"]), function(granuMode) { 
				that.granuGrid.jqGrid("setRowData",granuMode);
				that.granuGrid.jqGrid("setCheckRows",[granuMode["GRANU"]],true);
			});
			
			modelAction.qryModelDataSource({"MODEL_PHY_CODE":modelCode}, function(data) {
				if (data && data.modelDataSource){
					fish.forEach(data.modelDataSource, function(dataSource) { 
						that.granuGrid.jqGrid("setRowData",dataSource);
					});
				} 
			}.bind(this));
		},
		delModel: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			modelAction.operModel(value, function(data) { 
				that.modelGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.MODEL_DEL_SUCCESS);
			}.bind(this));
		},
		addBatchModel: function(data) {
			var options = {
						i18nData: this.i18nData,
						modelAction: this.modelAction
					};
			fish.popupView({
				url: "oss_core/pm/meta/model/views/ModelBatchAdd",
				viewOption: options,
				callback: function(popup, view) {
					//this.userDetail.trigger('change');
				}.bind(this)
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
				value["OPER_TYPE"] = this.$(".js-model-phy-ok").data("type");
				value["EMS_CODE"]  = this.EMS_CODE;
				value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				value["EMS_VER_CODE"] = this.EMS_VER_CODE;
				if(value["OPER_TYPE"] == "add"){
					value["MODEL_PHY_CODE"] = value["CODE_PREFIX"]+value["MODEL_PHY_CODE"];
				}
				value["modelDataSource"] = [];
				var granuMode = [];
				var rowsData = this.granuGrid.jqGrid("getCheckRows");
				if(rowsData.length > 0){
					fish.forEach(rowsData, function(granu,index) {
						granuMode.push({GRANU:granu["GRANU"],TABLE_MODE:granu["TABLE_MODE"]});
						granu["BP_ID"] = this.bpId;
						value["modelDataSource"].push(granu);
					});
				}else{
					fish.info(this.i18nData.SEL_GRANU); 
					return false;
				}
				value["GRANU_MODE"] = JSON.stringify(granuMode); 
				value["modelScript"] = [];
				$.each(this.editors, function(script_type, editor) {  
					if($.trim(editor.getValue())){
						value["modelScript"].push({
							"MODEL_PHY_CODE":value["MODEL_PHY_CODE"],
							"SCRIPT_TYPE":script_type,
							"SCRIPT": $.trim(editor.getValue()),
							"SCRIPT_NO":"1",
							"BP_ID":that.bpId
						});
					}
				});
				/*
				fish.forEach($(":input[name='SCRIPT']"), function(script,index) {
					if($(script).val()){
						value["modelScript"].push({
							"MODEL_PHY_CODE":value["MODEL_PHY_CODE"],
							"SCRIPT_TYPE":$(script).attr("script_type"),
							"SCRIPT": $(script).val(),
							"SCRIPT_NO":"1",
							"BP_ID":that.bpId
						});
					}
				});
				*/
				if(value["modelScript"].length<=0){
					fish.info(this.i18nData.MODEL_SCRIPT_NULL);
					return false;
				}
				//alert(JSON.stringify(value));
				modelAction.operModel(value, function(data) { 
				
					if(that.$(".js-model-phy-ok").data("type")=="edit"){
						var	rowdata = that.modelGrid.jqGrid("getSelection");
						that.modelGrid.jqGrid("setRowData",fish.extend({}, rowdata, value));
						fish.success(that.i18nData.MODEL_EDIT_SUCCESS);
					}else{
						that.modelGrid.jqGrid("addRowData", value, 'last');
						that.modelGrid.jqGrid("setSelection", value);
						fish.success(that.i18nData.MODEL_NEW_SUCCESS);
					}
					that.cancel();
				}.bind(this));
			}
		},
		btnDisabled: function(bool){
			$('.js-model-phy-ok').attr("disabled",bool);
			$('.js-model-phy-cancel').attr("disabled",bool);
		},
		getModelByEMS: function(REL_ID,VER_CODE){
			if(!this.EMS_TYPE_REL_ID 
				|| !this.EMS_VER_CODE
				|| this.EMS_TYPE_REL_ID!=REL_ID
				|| this.EMS_VER_CODE!=VER_CODE){
				
				this.EMS_TYPE_REL_ID = REL_ID;
				this.EMS_VER_CODE = VER_CODE;
				
				this.setModelType();
				
				var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
				modelAction.qryModel(param, function(data) {
					if (data && data.modelList){
						this.modelGrid.jqGrid("reloadData",data.modelList);
					}
				}.bind(this));
			}
		},
		setModelType: function(){
			
			if(this.EMS_VER_CODE == '-1'){
				this.$form.find('input[name="MODEL_TYPE"][value="1"]').prop('checked', 'checked');
				this.$form.find('input[name="MODEL_TYPE"]').attr("disabled","disabled");
			}else{
				this.$form.find('input[name="MODEL_TYPE"]').removeAttr("disabled");
			}
			this.clickModelType();
		},
		codePrefixShow:function(flag){
			if(flag){
				$(".js-code-prefix-div").show();
				$(".js-model-phy-code-div").css("width","85%");
			}else{
				$(".js-code-prefix-div").hide();
				$(".js-model-phy-code-div").css("width","100%");
			}
		},
		codeToUpper:function(event){
			if(this.$(".js-model-phy-ok").data("type")=="add"){
				var val = $(event.target).val();
				val = val.replace(/[^\w]/g, "").replace(/^\-/g, "");
				$(event.target).val(val.toUpperCase());
			}
		},
		showBlockUI: function(show){
			if(show){
				this.$(".js-model-phy-left-panel").blockUI({baseZ:1,blockMsgClass:'fade'}).data('blockui-content', true);
	        }else{
	        	this.$(".js-model-phy-left-panel").unblockUI().data('blockui-content', false);
	        }
		},
        paraToRadio:function(parent,paraName){
			if(!parent) return "";
			fish.forEach(pmUtil.paravalue(paraName),function(para,index){
        		parent.append("<label class=\"radio-inline\">"
							+"    <input type='radio' name='"+paraName+"' class='form-control' value='"+para[pmUtil.parakey.val]+"' />"+para[pmUtil.parakey.name]
							+"</label> ");
        	});
		},
		clickScriptTabs:function(event){
			var script_type = $(event.target).attr('script_type');
			(this.editors[script_type]).refresh();
		},
		clickModelType: function(){
			if(!this.granuGrid) return false;
			var val = this.$form.find(":radio[name='MODEL_TYPE']:checked").val();
			this.granuGrid.jqGrid("setAllCheckRows",false);
			if(val=='0'){
				this.granuGrid.jqGrid("setCheckRows",['None'],true);
			}else{
				fish.forEach(pmUtil.paravalue("GRANU"),function(para,index){
					var granu = para[pmUtil.parakey.val] ;
					if(granu!='None'){
						this.granuGrid.jqGrid("setCheckRows",[granu],true);
					}
				}.bind(this));
			}
		},
		
	});
});