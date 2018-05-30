define([
	"text!modules/portletmgr/templates/PortletMgrTemplate.html",
	"modules/portletmgr/actions/PortletMgrAction",
	"i18n!modules/portletmgr/i18n/portletmgr"
],function(widgetMgrTpl, widgetMgrAction, i18nWidget){
	return portal.BaseView.extend({
		//className: "container_left panel panel-default",

		template: fish.compile(widgetMgrTpl),

		events:{
			"click .js-new": "newClick",
			"click .js-edit": "editClick",
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},

		render: function() {
			this.$el.html(this.template(i18nWidget));	
			this.newBtn = this.$(".js-new");
			this.editBtn = this.$(".js-edit");
			this.okBtn = this.$(".js-ok");
			this.cancelBtn = this.$(".js-cancel");
			this.statusChange();			
		},

		afterRender: function() { //dom加载完成的事件
			this.$widgetTree = this.$(".js-widget-grid").grid({
				colModel:[{
					name: 'portletId',
					key: true,
					hidden: true
				}, {
					name: 'portletName',
					label: i18nWidget.PORTLET_NAME,
					sortable: false,
					search: true
				},{
					name: 'url',
					label: i18nWidget.PORTAL_URL,
					sortable: false,
					search: true
				},{
					name: 'defaultTitle',
					label: i18nWidget.PORTLET_DEFAULT_TITLE,
					sortable: false,
					search: true
				}],
				treeGrid: true,
				searchbar: true,				
				expandColumn: "portletName",
				onSelectRow: this.rowSelectCallback.bind(this),
				onChangeRow: this.rowSelectCallback.bind(this)
			});
						
			this.detailForm = this.$(".js-widget-detail-form").form("disable");
			this.detailForm.find("[name='state']").combobox();
			this.detailForm.find("[name='isPublic']").combobox();
			this.detailForm.find("[name='maxable']").combobox();
			this.detailForm.find("[name='collapsable']").combobox();
			this.detailForm.find("[name='closable']").combobox();
			this.detailForm.find("[name='showHeader']").combobox();
			this.detailForm.find("[name='settable']").combobox();
			this.detailForm.find("[name='refreshable']").combobox();
			var that = this;
			//this.detailForm.form().slimscroll({height: 200});

			widgetMgrAction.queryAllPortletType(function(data){
				if(data && data.length > 0){		
					for (var item1 in data){
						data[item1].portletName = data[item1].typeName;
					}
					widgetMgrAction.queryAllPortlets(function(result){
						if(result && result.length > 0){
							data = this.createTreeData(data,result,1);
						}
						this.portlets = data;

						var widgets = portal.utils.getTree(this.portlets, "portletId", "parentId", null); 
						this.$widgetTree.grid("reloadData", widgets);
						if (widgets && widgets.length > 0) {
							this.$widgetTree.grid("setSelection", widgets[0]);
							var rd = this.$widgetTree.grid("getSelection");
							if(!rd.isLeaf)
							    this.$widgetTree.grid("expandNode", rd);
						}
					}.bind(this));
					that.detailForm.find("[name='typeId']").combobox({
						placeholder: i18nWidget.COMMON_PLS_SEL,
						dataTextField: 'typeName',
						dataValueField: 'typeId',
						dataSource: data
					});
				}
			}.bind(this));
			this.statusChange();
		},
		statusChange: function() {	
			if (this.status && (this.status == "NEW" || this.status == "EDIT")) {
				this.newBtn.hide();
				this.editBtn.hide();
				this.okBtn.show();
				this.cancelBtn.show();
				if (this.detailForm) {
					this.detailForm.form("enable");
					if (this.status == "NEW") {
						this.detailForm.form('clear');
						this.detailForm.find("[name='state']").combobox('value','A');
					}
//					this.detailForm.find("[name='state']").combobox('disable');
				}
			} else {
				this.newBtn.show();
				this.editBtn.show();
				this.okBtn.hide();
				this.cancelBtn.hide();
				if (this.detailForm) {
					this.detailForm.form("disable");
				}
			}
        },
        okClick: function() {
			if (this.detailForm.isValid()) {
				var formData = this.detailForm.form("value");
				var portlet = {
					// typeId : 1
				};
				var current = this.$widgetTree.grid("getSelection");
				if (this.status == "NEW") {
					portlet = fish.extend(portlet, formData);	
					portlet.privName = portlet.portletName;	
					portlet.privType = 'P';		
					widgetMgrAction.addPortlets(portlet, function(data) {
						var arr = new Array();
						if (current && current.parentId == undefined){
							data.parentId = current.portletId;
						}
						else
						{
							data.parentId = current.parentId;
						}
						arr.push(data);
						this.$widgetTree.grid("addTreeNodes", arr, data.parentId);
						this.$widgetTree.grid("setSelection", data.portletId);
						this.status = null;
						this.statusChange();
						fish.success(i18nWidget.PORTLET_ADD_SUCCESS);
					}.bind(this));
				} else if (this.status == "EDIT") {
					portlet = fish.extend(current, formData);	
					portlet.privName = portlet.portletName;	
					portlet.privType = 'P';	
					widgetMgrAction.modPortlets(portlet, function(data) {
						this.$widgetTree.grid("setRowData", portlet);
						if(data){
							this.status = null;
							this.statusChange();
							fish.success(i18nWidget.PORTLET_MODIFY_SUCCESS);
						}
						
					}.bind(this));
				}
			}
		},
        rowSelectCallback:function(){
			this.detailForm.form().form("clear");
			var rowdata = this.$widgetTree.grid('getSelection');
			this.detailForm.form("value", rowdata);
			this.status = null;
			this.statusChange();
			if (rowdata && rowdata.parentId == undefined){
				this.editBtn.hide();
			}					
		},
        newClick: function() {
			this.status = "NEW";
			this.statusChange();
		},
		editClick: function() {
			this.status = "EDIT";
			this.statusChange();
		},
		cancelClick: function() {
			this.detailForm.form('clear');
			this.rowSelectCallback();
			this.detailForm.resetValid();
		},
		createTreeData: function(dataFrom,treeData,flag){
			var loadData = new Array();
			for(var index = 0;index < dataFrom.length; index++){
				dataFrom[index].portletId = -index + "";				
				loadData.push(dataFrom[index]);
			}			
			if(flag == 1){
				for(var l = 0;l < dataFrom.length; l++){	
					for(var m = 0;m < treeData.length; m++){
						if(treeData[m].typeId == dataFrom[l].typeId && treeData[m].state == "A"){
							treeData[m].parentId = dataFrom[l].portletId;
							loadData.push(treeData[m]);
						}
					}
				}
			}
			// if(flag == 2){
			// 	for(var n = 0;n < dataFrom.length; n++){
			// 		for(var o = 0;o < treeData.length; o++){
			// 			if(treeData[o].typeId == dataFrom[n].typeId && treeData[o].state == "X"){
			// 				treeData[o].parentId = dataFrom[n].portletId;
			// 				loadData.push(treeData[o]);
			// 			}
			// 		}
			// 	}
			// }
			return loadData;
		}
	});
});
