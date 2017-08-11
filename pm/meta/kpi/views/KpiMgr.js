portal.define([
	'text!oss_core/pm/meta/kpi/templates/KpiMgr.html',
	'text!oss_core/pm/meta/kpi/templates/KpiDetail.html',
	'i18n!oss_core/pm/meta/kpi/i18n/kpi',
	'oss_core/pm/meta/kpi/actions/KpiAction',
	'oss_core/pm/util/views/Util',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(kpiTpl, kpiDetailTpl, i18nKpi, kpiAction, pmUtil, codemirror){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(kpiTpl),
		detailTpl: fish.compile(kpiDetailTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nKpi),
		events: {
			"click .js-kpi-grid .js-new": 'addKpi',
			"click .js-kpi-grid .js-copy-new": 'addCopyKpi',
			"click .js-kpi-grid .js-batch-new": 'addBatchKpi',
			"keyup .js-kpi-code":'codeToUpper',
			"blur  .js-kpi-code":'codeToUpper',
			"click .js-kpi-ok": 'ok',
			"click .js-kpi-cancel": 'cancel',
			"click :radio[name='KPI_TYPE']":'clickKpiType',
			"click .js-kpi-formula-ul li a":'clickFormulaTabs',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.defaultNYear = parseInt(pmUtil.parameter("defaultNYear").val());
			this.codePrefix = pmUtil.parameter("codePrefix").val();

			this.colModel = [{
				name: 'KPI_NAME',
				label: this.i18nData.KPI_NAME,
				width: "23%",
				sortable: true,
				search: true
			}, {
				name: "KPI_CODE",
				label: this.i18nData.KPI_CODE,
				width: "13%",
				sortable: true,
				search: true
			}, {
				name: 'DIRT',
				label: this.i18nData.DIRT,
				width: "8%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("DIRT")),
			}, {
				name: "KPI_TYPE",
				label: this.i18nData.KPI_TYPE,
				width: "10%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("KPI_TYPE")),
				
			}, {
				name: 'UNIT',
				label: this.i18nData.UNIT,
				width: "8",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("UNIT")),
			}, {
				name: "IS_ANALYSIS",
				label: this.i18nData.IS_ANALYSIS,
				width: "10",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("YES_NO")),
			}, {
				name: 'EFF_TIME',
				label: this.i18nData.EFF_DATE,
				width: "10",
				sortable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat 
                }
			}, {
				name: "EXP_TIME",
				label: this.i18nData.EXP_DATE,
				width: "10",
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
			this.$(".js-kpi-detail-content").html(this.detailTpl(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.paraToRadio(this.$(".js-kpi-type-div"),"KPI_TYPE");
			this.paraToRadio(this.$(".js-dirt-div"),"DIRT");
			this.paraToRadio(this.$(".js-data_type-div"),"DATA_TYPE");
			this.$form = this.$(".js-kpi-detail-form");
			
			this.$form.find("[name='EFF_TIME']").datetimepicker({
				viewType: 'date'
			});
			this.$form.find("[name='EXP_TIME']").datetimepicker({
				viewType: 'date'
			});
			this.$form.find("[name='UNIT']").combobox({
				dataTextField: pmUtil.parakey.name,
		        dataValueField: pmUtil.parakey.val,
		        dataSource:  pmUtil.paravalue("UNIT")
			});
			this.$form.find("[name='KPI_AGG']").combobox({
				dataTextField: pmUtil.parakey.name,
		        dataValueField: pmUtil.parakey.val,
		        dataSource:  pmUtil.paravalue("KPI_AGG")
			});
			this.$form.find("[name='EFF_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});
			
			this.$form.find("[name='EXP_TIME']").datetimepicker({
				viewType: 'date',
				format	: this.dateFormat,
			});
			
			this.loadTree();
			this.loadGrid();
			//this.loadTab();
			this.$(".js-kpi-detail-button").height(this.$(".js-kpi-grid  .ui-jqgrid-pager").outerHeight());
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
					if(type=="EMS"){
						//var parentRow = this.catTree.jqGrid("getNodeParent", selectRow);
						if(!this.EMS_CODE || this.EMS_CODE!=selectRow.CAT_CODE){
							this.EMS_CODE = selectRow.CAT_CODE;
							this.loadFormulaTabs();
							//this.loadTab();
						}
						this.getKPIByEMS(selectRow.REL_ID);
					}
				}.bind(this)
			});
			pmUtil.loadEMSTree(this.catTree,'noVer');
			pmUtil.utilAction.qryEMSInfo(function(data) {
				if (data && data.verList){
					this.verList = data.verList;
				}
			}.bind(this));
		},
		loadGrid: function(){
			var $grid = this.$(".js-kpi-grid");
			this.kpiGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: true,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editKpi(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.KPI_DEL_CONFIRM,function(t) {
						this.delKPI(rowdata);	
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this.selKpi(rowid);
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
			//this.kpiGrid.prev().children('div').searchbar({target: this.kpiGrid});
			
			//var data = {KPI_LIST:[{KPI_NAME:"SSS",KPI_CODE:"SSSSSS"},{KPI_NAME:"DDD",KPI_CODE:"DDDD",PARENT_ID:"SSSSSS"}]};
			//this.kpiGrid.jqGrid("reloadData",data.KPI_LIST);

		},
		loadFormulaTabs:function(){
			
			this.editors = {};
			
			this.$(".js-kpi-formula").empty();
			this.$(".js-kpi-formula").append(
				 "<div class='tabs-pill ui-tabs js-kpi-formula-tab'>"
				+"    <ul class='ui-tabs-nav js-kpi-formula-ul'></ul>"
				+"    <div class='m-t-sm tab-content js-kpi-formula-content'></div>"
				+"</div>"
			);
			
			fish.forEach(this.verList,function(ver){
				if(ver["EMS_CODE"] == this.EMS_CODE){
					var index = document.getElementsByName('KPI_FORM').length;
					var ver_code = ver["EMS_VER_CODE"] ;
					this.$(".js-kpi-formula-ul").append("<li><a href='#demo-tabs-box-"+ver_code+"' ver_code='"+ver_code+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+ver["EMS_VER_NAME"]+"</a></li>") ;
	        		this.$(".js-kpi-formula-content").append(
	        			"<div id='demo-tabs-box-"+ver_code+"' >"
						+"    <textarea id='kpi-form-"+ver_code+"' name='KPI_FORM' index='"+index+"' ver_code='"+ver_code+"' rows='4' class='form-control' ></textarea>"
						+"</div>"
	        		);
	        		var kpiFormText = document.getElementById('kpi-form-'+ver_code);
	        		var editor = codemirror.fromTextArea(kpiFormText, {
					    mode: 'text/x-plsql',
					    indentWithTabs: true,		    
					    smartIndent: true,
					    lineNumbers: true,
					    matchBrackets : true,
					    //autofocus: true,
					    //scrollbarStyle: 'null',
					});
					editor.setSize('height','120px');	
					editor.on("update",function(self){ 
						var val = $.trim(self.getValue()); 
						this.$tab.checked(index,!!val);
					}.bind(this));  
					this.editors[ver_code] = editor ;
				}
        	}.bind(this));
        	this.$tab = pmUtil.tab(this.$('.js-kpi-formula-tab'),{});
		},
		
		resize: function(delta){
			
			if (this.$(".js-kpi-left-panel").height() >= this.$(".js-kpi-right-panel").height()) {
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"),delta);
				var hDiff = this.$(".js-kpi-left-panel").height() - this.$(".js-kpi-right-panel").height();
				portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"), hDiff);
				if(this.$(".js-kpi-detail").is(":visible")){ 
					portal.utils.incHeight(this.$(".js-kpi-detail"), hDiff);
					this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height()-this.$(".js-kpi-detail-button").height());
					this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
					this.$(".js-kpi-detail-content").slimscroll({height:this.$(".js-kpi-detail-content").height()});	
					//this.$(".js-kpi-detail-button").height(this.$(".js-kpi-detail-button").height());
				}
				
			} else {
				portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"),delta);
				if(this.$(".js-kpi-detail").is(":visible")){ 
					portal.utils.incHeight(this.$(".js-kpi-detail"),delta);
					this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height()-this.$(".js-kpi-detail-button").height());//
					this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
					this.$(".js-kpi-detail-content").slimscroll({height:this.$(".js-kpi-detail-content").height()});	
					//this.$(".js-kpi-detail-button").height(this.$(".js-kpi-detail-button").height());
				}
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-kpi-right-panel").height() - this.$(".js-kpi-left-panel").height());
			}
			//alert(this.$(".js-kpi-detail-button").height());
		},
		showDetailPanel: function(){
			var h = this.$(".js-kpi-grid").height();
			$('.js-kpi-grid').hide();
			$('.js-kpi-detail').fadeIn(1000);
			this.$(".js-kpi-detail-content").height(h-this.$(".js-kpi-detail-button").height());
			this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
			this.$(".js-kpi-detail-content").slimscroll({height:this.$(".js-kpi-detail-content").height()});	
			this.$(".js-kpi-detail").height(h);
			this.$(".js-kpi-detail-panel").html(this.i18nData.COMMON_DETAIL);
			this.$form.resetValid();
			$.each(this.editors, function(ver_code, editor) {  
				editor.refresh();
			});
		},
		hideDetailPanel: function(){
			var h = this.$(".js-kpi-detail").height();
			$('.js-kpi-detail').hide();
			$('.js-kpi-grid').fadeIn(1000);
			this.$(".js-kpi-grid").jqGrid("setGridHeight", h);
			this.$(".js-kpi-detail-panel").html(this.i18nData.KPI_LIST);
		},
		selKpi: function(rowid){
			
		},
		addKpi: function(){
			if(!this.EMS_TYPE_REL_ID){
				fish.info(this.i18nData.SEL_EMS);
				return false;
			}
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-kpi-ok").data("type", "add");
			this.$form.form('clear');
			this.$form.find('input[name="DIRT"]').eq(0).prop('checked', 'checked');
			this.$form.find('input[name="KPI_TYPE"]').eq(0).prop('checked', 'checked');
			this.clickKpiType();
			this.$form.find('input[name="DATA_TYPE"]').eq(0).prop('checked', 'checked');
			this.$form.find("[name='UNIT']").combobox('value', '1');
			this.$form.find("[name='KPI_AGG']").combobox('value', '1');
			this.$form.find("[name='EFF_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$form.find("[name='EXP_TIME']").datetimepicker("value", pmUtil.sysdate('date',fish.dateutil.addYears(new Date(), this.defaultNYear)));
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$form.find("[name='IS_ANALYSIS']").prop('checked', 'on');
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.clearEditors();
		},
		clearEditors: function(){
			$.each(this.editors, function(ver_code, editor) {  
				editor.setValue("");
				var index = this.$form.find(":input[name='KPI_FORM'][ver_code='"+ver_code+"']").attr('index');
				this.$tab.checked(parseInt(index),false);
			}.bind(this));
		},
		addCopyKpi: function(){
			var rowdata = this.kpiGrid.jqGrid('getSelection'); 
			if(!rowdata["KPI_CODE"]){//没有选中数据,走普通新建
				this.addKpi();
				return false;
			}
			if(!this.EMS_TYPE_REL_ID){
				fish.info(this.i18nData.SEL_EMS);
				return false;
			}
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$(".js-kpi-ok").data("type", "add");
			this.$form.form('clear');
			this.clearEditors();
			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='KPI_CODE']").val(rowdata['KPI_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.loadKpiForm(rowdata['KPI_CODE']);
		},
		editKpi: function(rowdata){
			this.showBlockUI(true);
			this.showDetailPanel();
			this.codePrefixShow(false);	
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.form('clear');
			this.clearEditors();
			rowdata["IS_ANALYSIS"] = (rowdata["IS_ANALYSIS"]=="1")?"on":"off";
			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.$form.find(":input[name='KPI_CODE']").attr("disabled",true);		
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.$(".js-kpi-ok").data("type", "edit");
			//var kpiCode = rowdata['KPI_CODE'];
			this.loadKpiForm(rowdata['KPI_CODE']);
		},
		delKPI: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			kpiAction.operKPI(value, function(data) { 
				that.kpiGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.KPI_DEL_SUCCESS);
			}.bind(this));
		},
		addBatchKpi: function(data) {
			var options = {
						i18nData: this.i18nData,
						kpiAction: this.kpiAction
					};
			fish.popupView({
				url: "oss_core/pm/meta/kpi/views/KpiBatchAdd",
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
				if(!this.EMS_TYPE_REL_ID){
					fish.info(this.i18nData.SEL_EMS);
					return false;
				}
				var that = this;
				var value = this.$form.form("value");
				value["BP_ID"] = this.bpId;
				value["OPER_TYPE"] = this.$(".js-kpi-ok").data("type");
				value["EMS_CODE"] = this.EMS_CODE;
				value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				value["IS_ANALYSIS"] = (value["IS_ANALYSIS"]=="on")?"1":"0";
				if(value["OPER_TYPE"] == "add"){
					value["KPI_CODE"] = value["CODE_PREFIX"]+value["KPI_CODE"];
				}
				if(value["KPI_TYPE"]=='2'){
					value["KPI_AGG"] = "";
				}
				value["kpiFormular"] = [];
				$.each(this.editors, function(ver_code, editor) {  
					var val = $.trim(editor.getValue()) ;
					if(val){
						value["kpiFormular"].push({
							"KPI_CODE":value["KPI_CODE"],
							"EMS_CODE":value["EMS_CODE"],
							"EMS_VER_CODE": ver_code,
							"KPI_AGG": value["KPI_AGG"],
							"KPI_FORM": val,
							"KPI_COND": "",
							"KPI_VERSION": "0",
							"BP_ID":that.bpId
						});
					}
				});
				/*
				fish.forEach($(":input[name='KPI_FORM']"), function(formular,index) {
					if($(formular).val()){
						value["kpiFormular"].push({
							"KPI_CODE":value["KPI_CODE"],
							"EMS_CODE":$(formular).attr("ems_code"),
							"EMS_VER_CODE": $(formular).attr("ems_ver_code"),
							"KPI_AGG": value["KPI_AGG"],
							"KPI_FORM": $(formular).val(),
							"KPI_COND": "",
							"KPI_VERSION": "0",
							"BP_ID":that.bpId
						});
					}
				});
				*/
				if(value["kpiFormular"].length<=0){
					fish.info(this.i18nData.KPI_FORM_NULL);
					return false;
				}
				//alert(JSON.stringify(value));
				kpiAction.operKPI(value, function(data) { 
				
					if(that.$(".js-kpi-ok").data("type")=="edit"){
						var	rowdata = that.kpiGrid.jqGrid("getSelection");
						that.kpiGrid.jqGrid("setRowData",fish.extend({}, rowdata, value));
						fish.success(that.i18nData.KPI_EDIT_SUCCESS);
					}else{
						that.kpiGrid.jqGrid("addRowData", value, 'last');
						that.kpiGrid.jqGrid("setSelection", value);
						fish.success(that.i18nData.KPI_NEW_SUCCESS);
					}
					that.cancel();
				}.bind(this));
			}
		},
		btnDisabled: function(bool){
			$('.js-kpi-ok').attr("disabled",bool);
			$('.js-kpi-cancel').attr("disabled",bool);
		},
		getKPIByEMS: function(REL_ID){
			if(!this.EMS_TYPE_REL_ID || this.EMS_TYPE_REL_ID!=REL_ID){
				this.EMS_TYPE_REL_ID = REL_ID;
				var param = {"EMS_TYPE_REL_ID":REL_ID} ;
				kpiAction.qryKPI(param, function(data) {
					if (data && data.kpiList){
						this.kpiGrid.jqGrid("reloadData",data.kpiList);
					}
				}.bind(this));
			}
		},
		codePrefixShow:function(flag){
			if(flag){
				$(".js-code-prefix-div").show();
				$(".js-kpi-code-div").css("width","85%");
			}else{
				$(".js-code-prefix-div").hide();
				$(".js-kpi-code-div").css("width","100%");
			}
		},
		codeToUpper:function(event){
			if(this.$(".js-kpi-ok").data("type")=="add"){
				var val = $(event.target).val();
				val = val.replace(/[^\w]/g, "").replace(/^\-/g, "");
				$(event.target).val(val.toUpperCase());
			}
		},
		clickKpiType:function(){
			var val = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			
			if(val=='1'){
				this.$form.find(".js-kpi-agg-div").css('visibility','visible');
				this.$form.validator("setField", "KPI_AGG", this.i18nData.KPI_AGG+':required');
			}else if(val=='2'){
				this.$form.find(".js-kpi-agg-div").css('visibility','hidden');
				this.$form.validator("setField", "KPI_AGG", null);
			}
			this.$form.resetValid(); 
		},
		showBlockUI: function(show){
			if(show){
				this.$(".js-kpi-left-panel").blockUI({baseZ:1}).data('blockui-content', true);
	        }else{
	        	this.$(".js-kpi-left-panel").unblockUI().data('blockui-content', false);
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
		loadKpiForm:function(kpiCode){
			if(!kpiCode) return false;
			var that = this;
			kpiAction.qryKPIFormular({"KPI_CODE":kpiCode}, function(data) {
				if (data && data.kpiFormular){
					fish.forEach(data.kpiFormular, function(formular) {  
						that.$form.find("[name='KPI_AGG']").combobox('value', formular["KPI_AGG"]);
						
						$.each(that.editors, function(ver_code, editor) {  
							if(ver_code == formular["EMS_VER_CODE"]){
								var val = $.trim(formular["KPI_FORM"]?formular["KPI_FORM"]:"")
								editor.setValue(val);
								
								if(val){
									var index = that.$form.find(":input[name='KPI_FORM'][ver_code='"+ver_code+"']").attr('index');
									that.$tab.checked(parseInt(index),true);
								}
							}
						});
						
						/*
						fish.forEach($(":input[name='KPI_FORM']"), function(kpiformText) { 
							if($(kpiformText).attr("ems_ver_code") == formular["EMS_VER_CODE"]){
								$(kpiformText).val( formular["KPI_FORM"]);
							}
						}); 
						*/
					});
				}
			}.bind(this));
		},
		clickFormulaTabs:function(event){
			var ver_code = $(event.target).attr('ver_code');
			(this.editors[ver_code]).refresh();
		},
		
		
	});
});