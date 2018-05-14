portal.define([
	'text!oss_core/pm/meta/dim/templates/DimMgr.html',
	'text!oss_core/pm/meta/dim/templates/DimDetail.html',
	'i18n!oss_core/pm/meta/dim/i18n/dim',
	'oss_core/pm/meta/dim/actions/DimAction',
	'oss_core/pm/util/views/Util',
	'oss_core/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/pm/third-party/codemirror/lib/codemirror.css",
],function(dimTpl, dimDetailTpl, i18nDim, dimAction, pmUtil, codemirror){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(dimTpl),
		detailTpl: fish.compile(dimDetailTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nDim),
		events: {
			"click .js-dim-grid .js-new": 'addDim',
			"click .js-dim-grid .js-batch-new": 'addBatchDim',
			"keyup .js-dim-code":'codeToUpper',
			"blur  .js-dim-code":'codeToUpper',
			"click .js-dim-ok": 'ok',
			"click .js-dim-cancel": 'cancel',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.codePrefix = pmUtil.parameter("codePrefix").val();
			this.colModel = [{
				name: 'DIM_NAME',
				label: this.i18nData.DIM_NAME,
				width: "55%",
				sortable: true,
				search: true
			}, {
				name: "DIM_CODE",
				label: this.i18nData.DIM_CODE,
				width: "45%",
				sortable: true,
				search: true
			}, {
				sortable: false,
				label: "",
				width: "30",
				formatter: 'actions',
				formatoptions: {
					editbutton: true,
					delbutton: true
				}
			}];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			this.$(".js-dim-detail-content").html(this.detailTpl(this.i18nData));
			return this;
		},
		afterRender: function(){
			
			this.$form = this.$(".js-dim-detail-form");
			this.editor = codemirror.fromTextArea(document.getElementById('script-text'), {
			    mode: 'text/x-plsql',
			    indentWithTabs: true,
　　			//styleActiveLine: true,		    
			    smartIndent: true,
			    lineNumbers: true,
			    matchBrackets : true,
			    autofocus: true,
			    scrollbarStyle: 'null',
			  });
			//this.resize();
			this.loadGrid();
			this.cancel();
		},
		loadGrid: function(){
			var $grid = this.$(".js-dim-grid");
			this.dimGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: true,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editDim(rowdata);
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.DIM_DEL_CONFIRM,function(t) {
							
						this.delDim(rowdata);
						
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this.selDim(rowid);
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[{
                //title: this.i18nData.COMMON_ADD,
		        //buttonicon: 'fa fa-download',
		        caption: this.i18nData.COMMON_NEW,
		        cssprop: "js-new"
            }
            /**
            ,{
                caption: this.i18nData.BATCH_NEW,
                cssprop: "js-batch-new"
            }
            */
            ]);
			this.dimGrid.prev().children('div').searchbar({target: this.dimGrid});
			this.scriptList = null;
			dimAction.qryDim(null, function(data) {
				
				if (data){
					if(data.dimList) this.dimGrid.jqGrid("reloadData", data.dimList);
					if(data.scriptList) this.scriptList = data.scriptList;
				}
			}.bind(this));
		},
		resize: function(delta){
			//portal.utils.gridIncHeight(this.$(".js-dim-grid"),delta);
			
			if (this.$(".js-dim-left-panel").height() > this.$(".js-dim-right-panel").height()) {
				portal.utils.gridIncHeight(this.$(".js-dim-grid"),delta);
				portal.utils.incHeight(this.$(".CodeMirror"), this.$(".js-dim-left-panel").height() - this.$(".js-dim-right-panel").height() );
				//portal.utils.incHeight(this.$(".js-dim-right-panel"), this.$(".js-dim-left-panel").height() - this.$(".js-dim-right-panel").height() );
			} else {
				portal.utils.incHeight(this.$(".CodeMirror"), delta);
				//portal.utils.incHeight(this.$(".js-dim-right-panel"),delta);
				portal.utils.gridIncHeight(this.$('.js-dim-grid'), this.$(".js-dim-right-panel").height() - this.$(".js-dim-left-panel").height());
			}
		},
		setDimScript:function(rowdata){
			var scripts = this.scriptList;
			var dim_script = "";
			if(rowdata && rowdata.scriptList){
				scripts = rowdata.scriptList;
			}
			if(scripts){
				fish.forEach(scripts, function(script) {
					if(script && script["DIM_CODE"] == rowdata["DIM_CODE"]){
						dim_script += script["DIM_SCRIPT"]?script["DIM_SCRIPT"]:"";
					}
				});
			}	
			this.$form.find("[name='DIM_SCRIPT']").val(dim_script);
			this.editor.setValue(dim_script);
		},
		selDim: function(rowid){
			var rowdata = this.dimGrid.jqGrid('getRowData', rowid);
			this.$form.form('clear');
			this.$form.form("value", rowdata);
			this.setDimScript(rowdata);
		},
		addDim: function(){
			this.showBlockUI(true);
			this.$form.resetValid();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.form('clear');
			this.$form.find(":input[name='DIM_NAME']").focus();
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$(".js-dim-ok").data("type", "add");
			this.codePrefixShow(true);
			this.editor.setOption('readOnly',false);
		},
		editDim: function(rowdata){
			this.showBlockUI(true);
			this.$form.resetValid();
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.find(":input[name='DIM_NAME']").focus();
			this.$form.find(":input[name='DIM_CODE']").attr("disabled",true);
			this.$(".js-dim-ok").data("type", "edit");
			this.codePrefixShow(false);
			this.editRowId = this.dimGrid.jqGrid("getGridParam", "selrow");
			this.editor.setOption('readOnly',false);
		},
		delDim: function(value){
			var that = this;
			value["OPER_TYPE"] = "del";
			dimAction.operDim(value, function(data) { 
				that.dimGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.DIM_DEL_SUCCESS);
				that.cancel();
			}.bind(this));
		},
		addBatchDim: function(data) {
			//alert(this.$el.parent().height());
			var options = {
						i18nData: this.i18nData,
						dimAction: this.dimAction,
						$elHeight: this.$el.height()
					};
			fish.popupView({
				url: "oss_core/pm/meta/dim/views/DimBatchAdd",
				viewOption: options,
				callback: function(popup, view) {
					//this.userDetail.trigger('change');
				}.bind(this)
			});
			
		},
		cancel: function() {
			this.showBlockUI(false);
			this.$form.form('disable');
			this.btnDisabled(true);
			this.$form.form('clear');
			this.$form.resetValid();
			var	rowdata = this.dimGrid.jqGrid("getSelection");
			this.$form.form("value", rowdata);
			this.setDimScript(rowdata);
			this.$(".js-dim-ok").data("type","");
			this.codePrefixShow(false);
			this.editor.setOption('readOnly','nocursor');
		},
		ok: function() {
			
			if (this.$form.isValid()) {
				var that = this;
				var value = this.$form.form("value");
				value["BP_ID"] = that.bpId;
				value["OPER_TYPE"] = this.$(".js-dim-ok").data("type");
				if(value["OPER_TYPE"] == "add"){
					value["DIM_CODE"] = value["CODE_PREFIX"]+value["DIM_CODE"];
				}
				
				value["scriptList"] = [
					{"DIM_CODE":value["DIM_CODE"],"SCRIPT_TYPE":"o","DIM_SCRIPT":this.editor.getValue(),"BP_ID":that.bpId},
					//{"DIM_CODE":value["DIM_CODE"],"SCRIPT_TYPE":"mysql","DIM_SCRIPT":value["DIM_SCRIPT"],"BP_ID":that.bpId}
				];
				//alert(JSON.stringify(value));
				dimAction.operDim(value, function(data) { 
				
					if(that.$(".js-dim-ok").data("type")=="edit" && that.editRowId){
						var	rowdata = that.dimGrid.jqGrid("getRowData",that.editRowId);
						that.dimGrid.jqGrid("setRowData",fish.extend({}, rowdata, value));
						that.dimGrid.jqGrid("setSelection", fish.extend({}, rowdata, value));
						fish.success(that.i18nData.DIM_EDIT_SUCCESS);
					}else{
						that.dimGrid.jqGrid("addRowData", value, 'last');
						that.dimGrid.jqGrid("setSelection", value);
						fish.success(that.i18nData.DIM_NEW_SUCCESS);
					}
					that.cancel();
				}.bind(this));
			}
		},
		btnDisabled: function(bool){
			$('.js-dim-ok').attr("disabled",bool);
			$('.js-dim-cancel').attr("disabled",bool);
		},
		codePrefixShow:function(flag){
			if(flag){
				$(".js-code-prefix-div").show();
				$(".js-dim-code-div").css("width","85%");
			}else{
				$(".js-code-prefix-div").hide();
				$(".js-dim-code-div").css("width","100%");
			}
		},
		codeToUpper:function(event){
			if(this.$(".js-dim-ok").data("type")=="add"){
				var val = $(event.target).val();
				val = val.replace(/[^\w]/g, "").replace(/^\-/g, "");
				$(event.target).val(val.toUpperCase());
			}
		},
		showBlockUI: function(show){
			//alert(show);
			if(show){
				this.$(".grid_container").blockUI({baseZ:1,blockMsgClass:'fade'}).data('blockui-content', true);
	        }else{
	        	this.$(".grid_container").unblockUI().data('blockui-content', false);
	        }
		}
	});
});