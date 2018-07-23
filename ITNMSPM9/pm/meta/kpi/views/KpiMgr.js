define([
	'text!oss_core/pm/meta/kpi/templates/KpiMgr.html',
	'text!oss_core/pm/meta/kpi/templates/KpiDetail.html',
	'i18n!oss_core/pm/meta/kpi/i18n/kpi',
	'oss_core/pm/meta/kpi/actions/KpiAction',
	'oss_core/pm/util/views/Util',
	'oss_core/pm/meta/measure/actions/MeasureAction',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(kpiTpl, kpiDetailTpl, i18nKpi, kpiAction, pmUtil, measureAction, codemirror){
	return fish.View.extend({
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
			"click .js-kpi-search":'search',
			"click .js-kpi-reset":'reset',
			"click .js-kpi-form-check":'checkKpiForm',
			"click .js-kpi-form-seling":'formSeling',
			"click .js-kpi-mo-config":'moConfig',
		},
		initialize: function(options) {
			this.verList = [];
			this.allEmsVer = [{"EMS_VER_CODE":"-1","EMS_VER_NAME":this.i18nData.ALL_EMS}] ;
			this.kpiType = "";
			this.bpId = options.bpId;
			this.dateFormat = pmUtil.parameter("dateFormat").val();
			this.defaultNYear = parseInt(pmUtil.parameter("defaultNYear").val());
			this.codePrefix = pmUtil.parameter("codePrefix").val();
			this.customKpiMode = pmUtil.parameter("customKpiMode").val();
			this.counterMo = {};
			this.counterMoCfg = {};
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

							//this.loadTab();
						}
						this.loadFormulaTabs();
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
            ]);

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

			var val = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			var verArr = [];
			if(val=='1'){
				verArr = this.verList ;
			}else{
				verArr = this.allEmsVer;
			}

			fish.forEach(verArr,function(ver){
				if((ver["EMS_CODE"] == this.EMS_CODE) || ver["EMS_VER_CODE"]=="-1"){
					var index = document.getElementsByName('KPI_FORM').length;
					var ver_code = ver["EMS_VER_CODE"] ;
					this.$(".js-kpi-formula-ul").append("<li><a href='#demo-tabs-box-"+ver_code+"' ver_code='"+ver_code+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+ver["EMS_VER_NAME"]+"</a></li>") ;
	        		this.$(".js-kpi-formula-content").append(
	        			"<div id='demo-tabs-box-"+ver_code+"' ver_code='"+ver_code+"'>"
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
					var self =this;
        	this.$tab = pmUtil.tab(this.$('.js-kpi-formula-tab'),
					                             {activate:function(e,ui){
																				          self.tabChange(e,ui);
																								  }  });
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

			if(this.customKpiMode=='1'){
				if(this.$(".js-kpi-ok").data("type")=="add"){
					this.$form.find(".js-kpi-code-form").css('visibility','hidden');
					this.$form.validator("setField", "KPI_CODE", null);
				}else{
					this.$form.find(".js-kpi-code-form").css('visibility','visible');
					this.$form.validator("setField", "KPI_CODE", this.i18nData.KPI_CODE+':required');
				}
			}
			this.$(".js-kpi-search-div").hide();
		},
		hideDetailPanel: function(){
			var h = this.$(".js-kpi-detail").height();
			$('.js-kpi-detail').hide();
			$('.js-kpi-grid').fadeIn(1000);
			this.$(".js-kpi-grid").jqGrid("setGridHeight", h);
			this.$(".js-kpi-detail-panel").html(this.i18nData.KPI_LIST);
			this.$(".js-kpi-search-div").show();
		},
		selKpi: function(rowid){

		},
		addKpi: function(){
			if(!this.EMS_TYPE_REL_ID){
				fish.info(this.i18nData.SEL_EMS);
				return false;
			}
			this.$(".js-kpi-ok").data("type", "add");
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);

			this.$form.form('clear');
			this.$form.find('input[name="DIRT"]').eq(0).prop('checked', 'checked');
			this.$form.find('input[name="KPI_TYPE"]').eq(0).prop('checked', 'checked');
			this.clickKpiType();
			this.$form.find('input[name="KPI_TYPE"]').attr('disabled', false);
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
				editor.refresh();
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
			this.$(".js-kpi-ok").data("type", "add");
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);

			this.$form.form('clear');

			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.$form.find('input[name="KPI_TYPE"]').prop('disabled', false);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='KPI_CODE']").val(rowdata['KPI_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.loadKpiForm(rowdata['KPI_CODE'], rowdata['KPI_TYPE']);
			this.clearEditors();
		},
		editKpi: function(rowdata){
			this.$(".js-kpi-ok").data("type", "edit");
			this.showBlockUI(true);
			this.showDetailPanel();
			this.codePrefixShow(false);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.form('clear');
			rowdata["IS_ANALYSIS"] = (rowdata["IS_ANALYSIS"]=="1")?"on":"off";
			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.clearEditors();
			this.$form.find('input[name="KPI_TYPE"]').attr('disabled', true);
			this.$form.find(":input[name='KPI_CODE']").attr("disabled",true);
			this.$form.find(":input[name='KPI_NAME']").focus();

			//var kpiCode = rowdata['KPI_CODE'];
			this.loadKpiForm(rowdata['KPI_CODE'], rowdata['KPI_TYPE']);
		},
		delKPI: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			value["customKpiMode"] = this.customKpiMode ;
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
				var value = this.getFromValue();
				if(!value) return false;
				if(!value["kpiFormular"] || value["kpiFormular"].length<=0){
					fish.info(this.i18nData.KPI_FORM_NULL);
					return false;
				}
				//alert(JSON.stringify(value));
				if(this.setCounterMo(value["kpiFormular"])){
					kpiAction.operKPI(value, function(data) {

						if(that.$(".js-kpi-ok").data("type")=="edit"){
							var	rowdata = that.kpiGrid.jqGrid("getSelection");
							that.kpiGrid.jqGrid("setRowData",fish.extend({}, rowdata, value));
							fish.success(that.i18nData.KPI_EDIT_SUCCESS);
						}else{
							value['KPI_CODE'] = data['KPI_CODE'];
							that.kpiGrid.jqGrid("addRowData", value, 'last');
							that.kpiGrid.jqGrid("setSelection", value);
							fish.success(that.i18nData.KPI_NEW_SUCCESS);
						}
						that.cancel();
					}.bind(this));
				}
			}
		},
		getFromValue:function(){
			var value = this.$form.form("value");
			value["BP_ID"] = this.bpId;
			value["customKpiMode"] = this.customKpiMode ;
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
			var isCheck = true;
			$.each(this.editors, function(ver_code, editor) {
				var kpiForm = $.trim(editor.getValue()) ;
				if(kpiForm){
					var ver_name = "";
					fish.forEach(this.verList,function(ver){
						if(ver_code == ver["EMS_VER_CODE"]){
							ver_name = ver["EMS_VER_NAME"];
						}
					});
					var counterList = [];
					if(value["KPI_TYPE"]=='1'){

						var val = kpiForm ;
						var r = /\[(.+?)\]/g;

						var counterArr = val.match(r);
						if(counterArr && counterArr.length < 1){
							isCheck = false;
							fish.error(this.i18nData.SEL_COUNTER);
							return false;
						}else{
							fish.forEach(counterArr,function(counter){
								var counterCode = $.trim(counter.replace('[',"").replace(']',"")) ;
								if(!counterCode){
									isCheck = false;
									fish.error(this.i18nData.KPI_FORM_CHECK_NOT_THROUGH+"["+ver_name+"]");
									return false;
								}
								var moCode = "";
								if(this.counterMoCfg && this.counterMoCfg[ver_code]){//先以counterMoCfg为准
									moCode = this.counterMoCfg[ver_code][counterCode] ;
								}
								if(!moCode && this.counterMo && this.counterMo[ver_code]){
									moCode = this.counterMo[ver_code][counterCode] ;
								}
								var isExist = false;

								fish.forEach(counterList,function(list){
									if(counterCode == list['COUNTER_CODE']){
										isExist = true;
										return false;
									}
								});
								if(!isExist){
									counterList.push({'COUNTER_CODE':counterCode, 'MO_CODE':moCode});
								}

								val = val.replace(counter,"(1)");
							}.bind(this));
							if(!isCheck){
								return false;
							}
							if(val.indexOf('{') > -1 || val.indexOf('[]') > -1){
								isCheck = false;
								fish.error(this.i18nData.KPI_FORM_CHECK_NOT_THROUGH+"["+ver_name+"]");
								return false;
							}
							try{
								eval(val)
							}catch(e){
								isCheck = false;
								fish.error(this.i18nData.KPI_FORM_CHECK_NOT_THROUGH+"["+ver_name+"]");
								return false;
							}
						}
					}


					value["kpiFormular"].push({
						"KPI_CODE":value["KPI_CODE"],
						"EMS_CODE":value["EMS_CODE"],
						"EMS_VER_CODE": ver_code,
						"EMS_VER_NAME": ver_name,
						"KPI_AGG": value["KPI_AGG"],
						"KPI_FORM": kpiForm,
						"KPI_COND": "",
						"KPI_VERSION": "0",
						"BP_ID":this.bpId,
						"counterList":counterList,
					});
				}
			}.bind(this));
			if(!isCheck){
				return false;
			}else{
				return value;
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
				this.getKpiList(param);
			}
		},
		getKpiList: function(param){
			kpiAction.qryKPI(param, function(data) {
				if (data && data.kpiList){
					this.kpiGrid.jqGrid("reloadData",data.kpiList);
				}
			}.bind(this));
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
			this.counterMo = {};
			this.counterMoCfg = {};
			val = this.$form.find(":radio[name='KPI_TYPE']:checked").val();

			if(val=='1'){
				this.$form.find(".js-kpi-agg-div").css('visibility','visible');
				this.$form.validator("setField", "KPI_AGG", this.i18nData.KPI_AGG+':required');
				this.$(".js-kpi-form-for-example").text("[DLSTRVOL]+[DLINTBGVOL]");
				this.$(".js-kpi-mo-config").show();
			}else if(val=='2'){
				this.$form.find(".js-kpi-agg-div").css('visibility','hidden');
				this.$form.validator("setField", "KPI_AGG", null);
				this.$(".js-kpi-form-for-example").text("case when sum(PA2EOSB00001)=0 then 100.0 else 100.0*round(sum(PA2EOSB00002)/sum(PA2EOSB00001),5)  end");
				this.$(".js-kpi-mo-config").hide();
			}
			this.$form.resetValid();
			if(this.kpiType != val){
				this.kpiType = val ;
				this.loadFormulaTabs();
			}
		},
		showBlockUI: function(show){
			if(show){
				this.$(".js-kpi-left-panel").blockUI({baseZ:1,blockMsgClass:'fade'}).data('blockui-content', true);
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
		loadKpiForm:function(kpiCode, kpiType){
			if(!kpiCode) return false;
			var that = this;
			var param = {"KPI_CODE":kpiCode};
			if(kpiType=="1"){
				param['isCounterMoRela'] = "1"
			}

			kpiAction.qryKPIFormular(param, function(data) {
				if (data){
					fish.forEach(data.kpiFormular, function(formular) {
						that.$form.find("[name='KPI_AGG']").combobox('value', formular["KPI_AGG"]);

						$.each(that.editors, function(ver_code, editor) {
							if((ver_code == formular["EMS_VER_CODE"]) || ver_code=='-1'){
								var val = $.trim(formular["KPI_FORM"]?formular["KPI_FORM"]:"")
								editor.setValue(val);

								if(val){
									var index = that.$form.find(":input[name='KPI_FORM'][ver_code='"+ver_code+"']").attr('index');
									that.$tab.checked(parseInt(index),true);
								}
							}
						});

					});
					if(kpiType=="1"){
						fish.forEach(data.kpiCounterMo, function(counterMo) {
							var ver_code = counterMo['EMS_VER_CODE'] ;
							if(!this.counterMoCfg[ver_code]){
								this.counterMoCfg[ver_code] = {};
							}
							this.counterMoCfg[ver_code][counterMo['COUNTER_CODE']] = counterMo['MO_CODE'] ;
						}.bind(this));
					}
				}
			}.bind(this));
		},
		clickFormulaTabs:function(event){
			var ver_code = $(event.target).attr('ver_code');
			(this.editors[ver_code]).refresh();
		},
		search:function(){
			if(!this.EMS_TYPE_REL_ID) return false;
			var kpiVal = $.trim(this.$(".js-kpi-search-input").val());
			var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID} ;
			if(kpiVal){
				param['KPI_NAME'] = kpiVal;
			}
			this.getKpiList(param);
		},
		reset:function(){
			this.$(".js-kpi-search-input").val("");
			this.search();
		},
		checkKpiForm:function(){
			var value = this.getFromValue();
			if(!value) return false;
			if(!value["kpiFormular"] || value["kpiFormular"].length<=0){
				fish.info(this.i18nData.KPI_FORM_NULL);
				return false;
			}
			if(this.setCounterMo(value["kpiFormular"])){
				value["OPER_TYPE"] = "add";
				value["isOnlyCheck"] = "1";
				kpiAction.operKPI(value, function(data) {
					fish.success(this.i18nData.KPI_FORM_CHECK_THROUGH);
				}.bind(this));
			}
		},
		setCounterMo:function(kpiFormular){
			var isValid = true;
			//alert(JSON.stringify(kpiFormular));
			fish.forEach(kpiFormular,function(formular,index){

				var ver_code = formular["EMS_VER_CODE"] ;
				var ver_name = formular["EMS_VER_NAME"] ;

        		var counterList = formular["counterList"];
        		var counterStr = "";
        		fish.forEach(counterList,function(counter){
        			if(!counter['MO_CODE']){//找出未设置MO的
	        			if(!counterStr){
	        				counterStr = counter['COUNTER_CODE'];
	        			}else{
	        				counterStr += ","+counter['COUNTER_CODE'];
	        			}
	        		}
        		});
        		//alert(counterStr);
        		if(counterStr){
	        		var param = {};
	        		param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID ;
	        		param["EMS_VER_CODE"] = ver_code ;
	        		param["FIELD_CODES"] = counterStr ;
	        		param["FIELD_TYPE"] = "1";

	        		measureAction.qryMeasureField(param,function(data) {
	        			fish.forEach(counterList,function(counter){
		        			if(!isValid) return false;
		        			var moList = [];
		        			fish.forEach(data.moField,function(field){
		        				if(counter['COUNTER_CODE'] == field['FIELD_CODE']){
		        					moList.push(field);
		        				}
		        			});
		        			if(moList.length < 1){
		        				isValid = false;
		        				fish.error(ver_name+"["+counter['COUNTER_CODE']+"]"+this.i18nData.NO_CONFIG_MO);
		        				return false;
		        			}else if(moList.length > 1){
		        				isValid = false;
		        				fish.error(ver_name+"["+counter['COUNTER_CODE']+"]"+this.i18nData.NO_CONFIG_MO);
		        				return false;
		        			}else{
		        				counter['MO_CODE'] = moList[0]['MO_CODE'] ;
		        			}
		        		}.bind(this));
		        	}.bind(this),true);//同步call服务
	        		if(!isValid){
	        			return false;
	        		}
	        	}
        	}.bind(this));
        	return isValid ;
		},
		tabChange: function(e, ui ){
			this.EMS_VER_CODE = ui.newPanel.attr("ver_code");
		},
		formSeling:function(){
			alert(this.EMS_VER_CODE);
			var kpiType = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			var options = {
					i18nData : this.i18nData,
					pmUtil:pmUtil,
					kpiType:kpiType,
					EMS_TYPE_REL_ID:this.EMS_TYPE_REL_ID,
					EMS_VER_CODE:this.EMS_VER_CODE,
				};
			fish.popupView({
				url: "oss_core/pm/meta/kpi/views/KpiCounterList",
				viewOption: options,
				callback: function(popup, view) {

				}.bind(this),
				close: function(retData) {

					fish.forEach(retData, function(data) {
						var kpiCounter ="";
						if(kpiType=="1"){
							kpiCounter = "["+data["FIELD_CODE"]+"]";
							if(!this.counterMo[this.EMS_VER_CODE]){
								this.counterMo[this.EMS_VER_CODE] = {};
							}
							this.counterMo[this.EMS_VER_CODE][data["FIELD_CODE"]] = data["MO_CODE"] ;

						}else{
							kpiCounter = "SUM("+data["KPI_CODE"]+")";
						}
						var editor = this.editors[this.EMS_VER_CODE] ;
						if(editor){
							if($.trim(editor.getValue())){
								editor.setValue(editor.getValue()+"+"+kpiCounter);
							}else{
								editor.setValue(editor.getValue()+kpiCounter);
							}
						}
					}.bind(this));
				}.bind(this),
			});
		},
		moConfig:function(){
			var kpiType = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			if(kpiType!="1") return false;
			var value = this.getFromValue();
			if(!value) return false;
			if(!value["kpiFormular"] || value["kpiFormular"].length<=0){
				fish.info(this.i18nData.KPI_FORM_NULL);
				return false;
			}
			var options = {
					i18nData : this.i18nData,
					pmUtil:pmUtil,
					kpiType:kpiType,
					EMS_TYPE_REL_ID:this.EMS_TYPE_REL_ID,
					kpiFormular:value["kpiFormular"],
				};
			fish.popupView({
				url: "oss_core/pm/meta/kpi/views/CounterMoList",
				viewOption: options,
				callback: function(popup, view) {

				}.bind(this),
				close: function(retData) {
					this.counterMoCfg = retData ;
				}.bind(this),
			});
		},
	});
});
