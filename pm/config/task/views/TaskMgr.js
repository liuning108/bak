portal.define([
	'text!oss_core/pm/config/task/templates/TaskMgr.html',
	'i18n!oss_core/pm/config/task/i18n/task',
	'oss_core/pm/config/task/actions/TaskAction',
	'oss_core/pm/util/views/Util',
],function(taskTpl, i18nTask, taskAction, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(taskTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nTask),
		events: {
			"click .js-task-add": 'addTask',
			"click .js-task-add-li": 'addTask',
			"click .js-task-copy-add": 'addCopyTask',
			"click .js-task-search": 'searchTask',
			"click .js-task-reset": 'resetTask',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.task_type = options.task_type;
			this.colModel = [{
				name: 'TASK_NO',
				label: this.i18nData.TASK_NO,
				width: "22%",
				sortable: true,
				search: true
			}, {
				name: "TASK_NAME",
				label: this.i18nData.TASK_NAME,
				width: "30%",
				sortable: true,
				search: true
			}, {
				name: 'TASK_TYPE',
				label: this.i18nData.TASK_TYPE,
				width: "10%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("TASK_TYPE")),
			}, {
				name: 'STATE',
				label: this.i18nData.STATE,
				width: "6%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("PM_TASK.STATE")),
			}, {
				name: "OPER_USER_NAME",
				label: this.i18nData.OPER_USER,
				width: "10%",
				sortable: true,
				search: true
			}, {
				name: "OPER_DATE",
				label: this.i18nData.OPER_DATE,
				width: "14%",
				sortable: true,
				search: true
			},{
				sortable: false,
				label: "",
				width: "8%",
				formatter: 'actions',
				formatoptions: {
					editbutton: true,
					delbutton: true
				}
			}];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			if(this.task_type){
				this.$('.js-task-dropdown-btn').addClass('hide');
				this.$('.js-task-add-span').attr('task_type',this.task_type);
				this.$('.js-task-add-span').html(this.i18nData.COMMON_NEW); 
			}else{
				fish.forEach(pmUtil.paravalue("TASK_TYPE"),function(para,index){
					var task_type = para[pmUtil.parakey.val];
					var task_name = para[pmUtil.parakey.name];
					if($.inArray(task_type,['00','03']) < 0){ 
            			this.$(".js-task-dropdown-ul").append("<li><a href='#' task_type='"+task_type+"' class='js-task-add-li'>"+task_name+"</a></li>");
            			if(!this.$(".js-task-add-span").attr('task_type')){
            				this.$('.js-task-add-span').attr('task_type',task_type);
							this.$('.js-task-add-span').html(task_name); 
            			}
            		}
            	});

			}
			
			this.loadTree();
			this.loadGrid();
		},
		resize: function(delta){
			this.catTree.jqGrid("setGridHeight",this.$(".js-task-left-panel").height() - this.$(".js-task-left-panel-h3").height()-35);
			this.taskGrid.jqGrid("setGridHeight",this.$(".js-task-left-panel").height() - this.$(".js-task-left-panel-h3").height()-70);
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
				pagebar: false,
				onSelectRow: function(e, rowid, state) {
					var selectRow = this.catTree.jqGrid("getRowData", rowid);
					var type = selectRow.type;
					if(type=="VER"){
						var parent = this.catTree.jqGrid("getNodeParent", selectRow);
						//var emsNode = this.catTree.jqGrid("getNodeParent", parent);
						this.EMS_CODE = parent.CAT_CODE;
						this.getTaskByEMS(parent.REL_ID,selectRow.CAT_CODE);
						this.resetTask();
					}
				}.bind(this)
			});
			
			pmUtil.loadEMSTree(this.catTree);
		},
		loadGrid: function(){
			var $grid = this.$(".js-catalog-grid");
			this.taskGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: false,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editTask(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.TASK_DEL_CONFIRM,function(t) {
						this.delTask(rowdata);	
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					//this.selKpi(rowid);
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
		getTaskByEMS: function(REL_ID,VER_CODE){
			if(!this.EMS_TYPE_REL_ID 
				|| !this.EMS_VER_CODE 
				|| this.EMS_TYPE_REL_ID!=REL_ID
				|| this.EMS_VER_CODE!=VER_CODE){
				
				this.EMS_TYPE_REL_ID = REL_ID;
				this.EMS_VER_CODE = VER_CODE;
				var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
				
				this.loadTask(param);
			}
		},
		loadTask: function(param){
			if(!param) param = {} ;
			if(this.task_type){
				param["TASK_TYPE"] = this.task_type;
			}else{
				param["EX_TASK_TYPE"] = "00,03";//采集和告警
			}
			taskAction.qryTask(param, function(data) {
				if (data && data.taskList){
					this.taskGrid.jqGrid("reloadData",data.taskList);
				}
			}.bind(this));
		},
		addTask: function(event){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			
			if($(event.target)[0].tagName=='A'){
				this.$('.js-task-add-span').attr('task_type',$(event.target).attr('task_type') );
				this.$('.js-task-add-span').html($(event.target).html());
			}
			var task_type = this.$('.js-task-add-span').attr('task_type');
			this.showDetailModal("add",task_type);
		},
		addCopyTask: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			var rowdata = this.taskGrid.jqGrid('getSelection'); 
			var task_type = rowdata['TASK_TYPE'];
			
			if(!task_type){ 
				task_type = this.$('.js-task-add-span').attr('task_type');
				this.showDetailModal("add",task_type);
			}else{
				this.showDetailModal("add",task_type,rowdata);
			}
		},
		editTask: function(rowdata){
			this.showDetailModal("edit",rowdata['TASK_TYPE'],rowdata);
		},
		delTask: function(value){
			value["OPER_TYPE"] = "del";
			value["PLUGIN_TYPE"] = "00";
			taskAction.operTask(value, function(data) { 
				this.taskGrid.jqGrid("delRowData", value);
				fish.success(this.i18nData.TASK_DEL_SUCCESS);
			}.bind(this));
		},
		showDetailModal: function(operType,task_type,rowdata){
			if(!task_type){
				fish.info(this.i18nData.TASK_TYPE_SEL);
				return false;
			}
			var options = {
						bpId : this.bpId,
						operType : operType,
						i18nData : this.i18nData,
						taskAction: taskAction,
						pmUtil:pmUtil,
						EMS_CODE : this.EMS_CODE,
						EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID ,
						EMS_VER_CODE: this.EMS_VER_CODE ,
						datas:rowdata,
						task_type:task_type,
					};
			fish.popupView({
				url: "oss_core/pm/config/task/views/TaskModal",
				viewOption: options,
				callback: function(popup, view) {
					
				}.bind(this),
				close: function(retData) {
					if(retData){
						if(operType=="edit"){
							var	rowdata = this.taskGrid.jqGrid("getSelection");
							this.taskGrid.jqGrid("setRowData",fish.extend({}, rowdata, retData));
						}else{
							this.taskGrid.jqGrid("addRowData", retData, 'last');
							this.taskGrid.jqGrid("setSelection", retData);
						}
					}
				}.bind(this),
			});
		},
		searchTask: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			var taskName = this.$(".js-task-search-input").val();
			var param =  {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
			if(taskName && $.trim(taskName)){
				param['TASK_NAME'] = $.trim(taskName) ;
			}
			this.loadTask(param);
		},
		resetTask: function(){
			this.$(".js-task-search-input").val('');
		},
	});
});