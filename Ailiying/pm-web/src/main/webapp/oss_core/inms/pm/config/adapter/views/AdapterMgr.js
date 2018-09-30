define([
	'text!oss_core/inms/pm/config/adapter/templates/AdapterMgr.html',
	'i18n!oss_core/inms/pm/config/adapter/i18n/adapter',
	'oss_core/inms/pm/config/adapter/actions/AdapterAction',
	'oss_core/inms/pm/util/views/Util',
],function(dimTpl, i18nDim, adapterAction, pmUtil){
	return portal.BaseView.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(dimTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nDim),
		events: {
			"click .js-adapter-add": 'addAdapter',
			"click .js-adapter-copy-add": 'addCopyAdapter',
			"click .js-adapter-search": 'searchAdapter',
			"click .js-adapter-reset": 'resetAdapter',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.colModel = [{
				name: 'ADAPTER_NO',
				label: this.i18nData.ADAPTER_NO,
				width: "22%",
				sortable: true,
				search: true
			}, {
				name: "ADAPTER_NAME",
				label: this.i18nData.ADAPTER_NAME,
				width: "28%",
				sortable: true,
				search: true
			}, {
				name: 'PROTOCOL_TYPE',
				label: this.i18nData.PROTOCOL_TYPE,
				width: "8%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("PROTOCOL_TYPE")),
			}, {
				name: "PLUGIN_NAME",
				label: this.i18nData.ADAPTER_SERV,
				width: "28%",
				sortable: true,
				search: true
			}, {
				name: 'STATE',
				label: this.i18nData.STATE,
				width: "6%",
				sortable: true,
				search: true,
				formatter: "select",
				editoptions: pmUtil.paraToGridSel(pmUtil.paravalue("PM_TASK.STATE")),
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
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$form = this.$(".js-dim-detail-form");
			this.loadTree();
			this.loadGrid();
		},
		resize: function(delta){
			this.catTree.jqGrid("setGridHeight",this.$(".js-adapter-left-panel").height() - this.$(".js-adapter-left-panel-h3").height()-40);
			this.adapterGrid.jqGrid("setGridHeight",this.$(".js-adapter-left-panel").height() - this.$(".js-adapter-left-panel-h3").height()-75);
			//portal.utils.gridIncHeight(this.$(".js-catalog-grid"),delta);
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
						this.getAdapterByEMS(parent.REL_ID,selectRow.CAT_CODE);
						this.resetAdapter();
					}
				}.bind(this)
			});

			pmUtil.loadEMSTree(this.catTree);
		},
		loadGrid: function(){
			var $grid = this.$(".js-catalog-grid");
			this.adapterGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: false,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.adapterGrid.jqGrid("setSelection", rowdata);
					this.editAdapter(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.ADAPTER_DEL_CONFIRM,function(t) {
						this.delAdapter(rowdata);
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
		getAdapterByEMS: function(REL_ID,VER_CODE){
			if(!this.EMS_TYPE_REL_ID
				|| !this.EMS_VER_CODE
				|| this.EMS_TYPE_REL_ID!=REL_ID
				|| this.EMS_VER_CODE!=VER_CODE){

				this.EMS_TYPE_REL_ID = REL_ID;
				this.EMS_VER_CODE = VER_CODE;
				var param = {"EMS_TYPE_REL_ID":REL_ID,"EMS_VER_CODE":VER_CODE} ;
				this.loadAdapter(param);
			}
		},
		loadAdapter: function(param){
			adapterAction.qryAdapter(param, function(data) {
				if (data && data.adapterList){
					this.adapterGrid.jqGrid("reloadData",data.adapterList);
				}
			}.bind(this));
		},
		addAdapter: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			this.showDetailModal("add");
		},
		addCopyAdapter: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			var rowdata = this.adapterGrid.jqGrid('getSelection');
			this.showDetailModal("add",rowdata);
		},
		editAdapter: function(rowdata){
			this.showDetailModal("edit",rowdata);
		},
		delAdapter: function(value){
			value["OPER_TYPE"] = "del";
			value["PLUGIN_TYPE"] = "00";
			adapterAction.operAdapter(value, function(data) {
				this.adapterGrid.jqGrid("delRowData", value);
				fish.success(this.i18nData.ADAPTER_DEL_SUCCESS);
			}.bind(this));
		},
		showDetailModal: function(operType,rowdata){
			var options = {
						bpId : this.bpId,
						operType : operType,
						i18nData : this.i18nData,
						adapterAction: adapterAction,
						pmUtil:pmUtil,
						EMS_CODE : this.EMS_CODE,
						EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID ,
						EMS_VER_CODE: this.EMS_VER_CODE ,
						datas:rowdata,
					};
			fish.popupView({
				url: "oss_core/inms/pm/config/adapter/views/AdapterDetail",
				viewOption: options,
				callback: function(popup, view) {

				}.bind(this),
				close: function(retData) {
					if(retData){
						if(operType=="edit"){
							var	rowdata = this.adapterGrid.jqGrid("getSelection");
							this.adapterGrid.jqGrid("setRowData",fish.extend({}, rowdata, retData));
						}else{
							this.adapterGrid.jqGrid("addRowData", retData, 'last');
							this.adapterGrid.jqGrid("setSelection", retData);
						}
					}
				}.bind(this),
			});
		},
		searchAdapter: function(){
			if(!this.EMS_VER_CODE){
				fish.info(this.i18nData.SEL_EMS_VER);
				return false;
			}
			var adapterName = this.$(".js-adapter-search-input").val();
			var param =  {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID,"EMS_VER_CODE":this.EMS_VER_CODE} ;
			if(adapterName && $.trim(adapterName)){
				param['ADAPTER_NAME'] = $.trim(adapterName) ;
			}
			this.loadAdapter(param);
		},
		resetAdapter: function(){
			this.$(".js-adapter-search-input").val('');
		},

	});
});
