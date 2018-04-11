define([
	'modules/grant/models/PortletCusItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant2HView',
	'modules/portletmgr/actions/PortletMgrAction',
	'text!modules/portletmgr/templates/PortletCusGrant.html',
	'i18n!modules/portletmgr/i18n/portletmgr'
], function(WidgetCusItem, GrantItems, Grant2HView, widgetMgrAction,
	cusGrantTpl, i18nWidgetMgr) {
	var WidgetCusItems = GrantItems.extend({
		model: WidgetCusItem
	});

	return Grant2HView.extend({
		templateTopRow: fish.compile(cusGrantTpl),

		//用不着，去掉
//		templateDRHalf: fish.compile(""),

		i18nData: fish.extend({
			multisel: true,
			treeGrid: true,
			expandColumn: "portletName",
			GRANT_LEFT_TITLE: i18nWidgetMgr.PORTLET_BOUND,
			GRANT_RIGHT_TITLE: i18nWidgetMgr.PORTLET_PORTLET,
			GRANT_HEADER_TITLE: i18nWidgetMgr.PORTLET_BIND_PRIVATE
		}, i18nWidgetMgr),

		initialize: function(initData) {
			this.selectedPortlet = initData;
			fish.extend(this.i18nData, {
				portalName: this.selectedPortlet.portalName
			});

			this.grantItemsR = new WidgetCusItems();
			this.grantItemsL = new WidgetCusItems();

			this.colModelR = [{
				name: 'portletId',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.PORTLET_NAME,
				sortable: false,
				search: true
			},{
				name: 'url',
				label: this.i18nData.PORTLET_URL,
				sortable: false,
				search: true
			},{
				name: 'defaultTitle',
				label: this.i18nData.PORTLET_DEFAULT_TITLE,
				sortable: false,
				search: true
			}];

			this.colModelL = [{
				name: 'portletId',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.PORTLET_NAME,
				sortable: false,
				search: true
			},{
				name: 'url',
				label: this.i18nData.PORTLET_URL,
				sortable: false,
				search: true
			},{
				name: 'defaultTitle',
				label: this.i18nData.PORTLET_DEFAULT_TITLE,
				sortable: false,
				search: true
			}];

			return Grant2HView.prototype.initialize.call(this);
		},

		afterRender: function() {
			Grant2HView.prototype.afterRender.call(this);
			this.$gridL.grid("setGridHeight", this.$gridR.parent().innerHeight());
			//this.$(".role__btn-group.vertical").css("margin-top","70px");
			this.reload();
		},

		reload: function() {
			var treeData = new Array();
			//左侧直接取选中的portlet的children属性
			this.grantItemsL.reset(this.selectedPortlet.children);
			widgetMgrAction.queryAllPortletType(function(data){
				if(data && data.length > 0){	
					for (var item1 in data){
						data[item1].isType = true;
						data[item1].children = new Array();
						data[item1].portletName = data[item1].typeName;
					}
					widgetMgrAction.queryAllPortlets(function(result){
						if(result && result.length > 0){
							var xResult = [];
							for(var j=0; j<result.length; j++){
								if(result[j].isPublic == "N" || result[j].state == "X"){
									xResult.push(result[j]);
								}
							}
							treeData = this.createTreeData(data,xResult);							
						}
						//获取全部的portlet，并将portlet中与左侧重复的去除，然后生成树
						for(var i=0; i<treeData.length; i++){
							if(this.selectedPortlet.children){
								for(var j=0; j<this.selectedPortlet.children.length; j++){
									if(treeData[i].portletName == this.selectedPortlet.children[j].portletName){
										treeData.splice(i,1);
									}
								}
							}							
						}
						//将经过筛选的treeData，放到右侧grid展示。
						this.widgets = portal.utils.getTree(treeData, "portletId", "parentId", null); 
						this.grantItemsR.reset(this.widgets);
					}.bind(this));
				}
			}.bind(this));
			this.hideDRHalf();
		},

		createTreeData: function(dataFrom,treeData){
			var loadData = new Array();
			for(var index = 0;index < dataFrom.length; index++){
				dataFrom[index].portletId = -index + "";
				dataFrom[index].isPublic = "#";

				loadData.push(dataFrom[index]);
			}			
			
			for(var n = 0;n < dataFrom.length; n++){
				for(var o = 0;o < treeData.length; o++){
					if(treeData[o].typeId == dataFrom[n].typeId){
						treeData[o].parentId = dataFrom[n].portletId;
						loadData.push(treeData[o]);
					}
				}
			}
			return loadData;
		},
		//解除绑定
		grant: function() {
			var selrows = this.i18nData.multisel
				&& fish.clone(this.$gridL.grid("getCheckRows"))
				|| [this.$gridL.grid("getSelection")],
				// makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsL.model.prototype.idAttribute;

			for(var i=0; i<selrows.length; i++){				
				selrows[i].parent = selrows[i].parentId								
			}
			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridL.grid("getRowid", row),
						nextrow = this.$gridL.grid("getNextSelection", row),
						prevrow = this.$gridL.grid("getPrevSelection", row);
					// if (nextrow) {
					// 	this.$gridL.grid("setSelection", nextrow);
					// } else if (prevrow) {
					// 	this.$gridL.grid("setSelection", prevrow);
					// }
					this.$gridL.grid("delRowData", rowid);
					for(var i=0; i<this.widgets.length; i++){
						if(this.widgets[i].typeId == row.typeId){
							this.$gridR.grid("addChildNode", rowid, this.widgets[i],row);
						}
					}
					// this.$gridR.grid("setSelection", row);
				}, this);

				this.grantItemsL.remove(fish.pluck(selrows, id));
				this.grantItemsR.add(selrows);
			}.bind(this));
		},
		//批量解除绑定
		grantBatch: function() {
			var selrows = fish.clone(this.$gridL.grid("getRowData")),
				id = this.grantItemsL.model.prototype.idAttribute;
			for(var i=0; i<selrows.length; i++){				
				selrows[i].parent = selrows[i].parentId								
			}
			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridL.grid("getRowid", row);
					this.$gridL.grid("delRowData", rowid);
					for(var i=0; i<this.widgets.length; i++){
						if(this.widgets[i].typeId == row.typeId){
							this.$gridR.grid("addChildNode", rowid, this.widgets[i],row);
						}
					}
				}, this);

				this.grantItemsL.remove(fish.pluck(selrows, id));
				this.grantItemsR.add(selrows);
			}.bind(this));
		},
		//绑定
		degrant: function() {
			var selrows = this.i18nData.multisel
				&& fish.clone(this.$gridR.grid("getCheckRows"))
				|| [this.$gridR.grid("getSelection")],
				id = this.grantItemsR.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridR.grid("getRowid", row),
						nextrow = this.$gridR.grid("getNextSelection", row),
						prevrow = this.$gridR.grid("getPrevSelection", row);
					// if (nextrow) {
					// 	this.$gridR.grid("setSelection", nextrow);
					// } else if (prevrow) {
					// 	this.$gridR.grid("setSelection", prevrow);
					// }
					
					//当前选中不能是根节点
					if(row.isPublic !== "#"){
						this.$gridR.grid("delRowData", rowid);
						this.$gridL.grid("addRowData", rowid, row);
						// this.$gridL.grid("setSelection", row);
					}
					
				}, this);
			}.bind(this));

			this.grantItemsR.remove(fish.pluck(selrows, id));
			this.grantItemsL.add(selrows);
		},
		//批量绑定
		degrantBatch: function() {
			var selrows = fish.filter(this.$gridR.grid("getRowData"), function(row) {
					return row._rowd_ ? false : true; // `_rowd_' denotes row disabled
				}),
				id = this.grantItemsR.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridR.grid("getRowid", row);
					//当前选中不能是根节点
					if(row.isPublic !== "#"){
						this.$gridR.grid("delRowData", rowid);
						this.$gridL.grid("addRowData", rowid, row);
					}
				}, this);

				this.grantItemsR.remove(fish.pluck(selrows, id));
				this.grantItemsL.add(selrows);
			}.bind(this));
		},

		dialogOk: function(){
			//更新portal下面的portlet组件列表（先删除后增加），成功之后关闭dialog
			var param = {};
			param.portalId = this.selectedPortlet.portalId;
//			param.spId = 0;
//			param.appId = 1;
			param.portletIdList = fish.pluck(this.$gridL.grid("getRowData"), "portletId");
			widgetMgrAction.updatePortalPortletList(param, function(result){
				//if(result.isSuccess){
					// this.trigger("ok",result.PORTLET_LIST);
					var rs = this.$gridL.grid("getRowData");
					fish.each(rs,function(one){
						one.portalName = one.portletName;
					})
					this.popup.close(rs);
					this.reload();
				//}
			}.bind(this));
			
		},

		hideDRHalf: function() {
			this.$(".modal-footer").css("display", "block");
			var height = this.$(".grant-grid-l").height();
			this.$(".js-drh").remove();
			this.$gridR.grid("setGridHeight", height);
		}
	});
});
