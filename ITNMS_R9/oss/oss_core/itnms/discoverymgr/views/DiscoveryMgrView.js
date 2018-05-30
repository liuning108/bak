define(
	[
		'oss_core/itnms/discoverymgr/actions/DiscoveryMgrAction',
		'oss_core/itnms/host/actions/HostAction',
		'oss_core/itnms/hostgroup/actions/HostGroupAction',
		'oss_core/itnms/hostgroup/views/HostGroupUtil',
		'oss_core/itnms/host/components/kdoTree/kdoTree',
		'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
		'oss_core/itnms/host/components/kdoTabs/KdoTabs',
		'oss_core/itnms/discoverymgr/views/CreateDruleView',
		'oss_core/itnms/items/components/views/ItemListView',
		'oss_core/itnms/host/components/views/TemplatePageView',
		'oss_core/itnms/host/components/views/MacroPageView',
		'text!oss_core/itnms/discoverymgr/templates/DiscoveryMgrMain.html',
		'i18n!oss_core/itnms/discoverymgr/i18n/discoverymgr',
		"css!oss_core/itnms/discoverymgr/css/discoverymgr",
		"css!oss_core/itnms/hostgroup/css/hg-component",
		"css!oss_core/itnms/host/css/kdo.css",
		"css!oss_core/itnms/host/css/host.css"
	], function(discoveryAction, hostAction, hostGroupAction, hostGroupUtil, kdoTree, kdoDSelect, kdoTabs,
				createDruleView, itemsView, TemplatePageView, MacroPageView, discoveryMgrMain,
				i18nData) {
		return fish.View.extend({
			template : fish.compile(discoveryMgrMain),
			resource: fish.extend({}, i18nData),

			events : {
				"click .dr-grid-btngroup" : "gridBtnGroupClick",
				"click #tm-back-btn" : 'backFromTplView'
			},

			initialize : function(option) {
				this.option = option;
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				this.drList = [];
				this.druleRelaList = [];
				this.curSubtype = "";
				this.curDruleid;
				this.availableAndSelectedDataMap = new hostGroupUtil.HashMap();
				this.availableDataMap = new hostGroupUtil.HashMap();
				this.selectedDataMap = new hostGroupUtil.HashMap();
				this.statusFilterList = [
					{id: -1, name: this.resource.ANY},
					{id: 0, name: this.resource.ENABLED},
					{id: 1, name: this.resource.DISABLED}
				];
				this.ALL_VALUE = "-1";
				if(this.option.el){
					this.$el= $(this.option.el);
				}
			},

			render : function() {
				this.$el.html(this.template(i18nData));
			},

			initCss: function() {
				this.$el.parent().css({'padding': '0px'});
				if(this.option.el){
					this.$('.kdo_left').hide();
					this.$('#tm-back-btn').show();
					this.$('#tm-homepage').css({'width': '100%'});
					this.$('#tm-template-item').css({'width': '100%'});
					this.$('#tm-createtemplate').css({'width': '100%'});
					this.$('#tm-importtemplate').css({'width': '100%'});
				}
			},

			initEvent: function() {
				var self = this;
				this.$('.allHostShow').bind("click", function(){
					self.curSubtype = "";
					self.hideCreateDruleView();
					self.getDruleRelaData();
				})
				this.$('#dr-createdrule-btn').bind("click", function(){
					self.showCreateDruleView();
				})
			},

			afterRender : function() {
				var self = this;
				this.initCss();
				this.initEvent();
				hostAction.getCategoryTree().then(function(data) {
					self.LeftTree(data);
					self.initStatusSel();
				});
			},

			backFromTplView: function() {
				this.option.callback();
			},

			LeftTree: function(data) {
				var self = this;
				var kTree = new kdoTree({
					'el': self.$el.find('.tree-content'),
					'data': data,
					'rootId': 'R',
					'callback': function(id) {
						self.treeOnClick(id);
					}
				});
				kTree.render();
				self.initDiscoveryGrid();
				self.getDruleRelaData();
			},

			getDruleRelaData: function (subtypes_no) {
				var self = this;
				if(subtypes_no){
					this.curSubtype = subtypes_no;
				}
				this.druleRelaList = [];
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				discoveryAction.qryCategoryAndSubtypes(function(categoryList){
					if(categoryList){
						fish.forEach(categoryList, function(item){
							if(item.hasOwnProperty("DRULEID")){
								self.druleRelaList[self.druleRelaList.length] = item;
							}else if(item.hasOwnProperty("SUBTYPES_NO")){
								self.subtypesList[self.subtypesList.length] = item;
							}else{
								self.categoryList[self.categoryList.length] = item;
								self.catalogList[self.catalogList.length] = {
									id: item.CATEGORY_NO, category_no: item.CATEGORY_NO, name: item.CATEGORY_NAME, open: true, nodeType: -1,
									children: []
								}
							}
						});
					}
					fish.forEach(self.catalogList, function(catalogItem){
						fish.forEach(self.subtypesList, function(subtypesItem){
							if(subtypesItem.CATEGORY_NO == catalogItem.id){
								catalogItem.children[catalogItem.children.length] = {
									id: subtypesItem.SUBTYPES_NO, subtypes_no: subtypesItem.SUBTYPES_NO, name: subtypesItem.SUBTYPES_NAME, open: true, nodeType: -1
								}
							}
						});
					});
					self.qryDiscoveryRule();
				});
			},

			initDiscoveryGrid: function () {
				var self = this;
				var opt = {
					colModel: [{
						name: 'druleid',
						label: '',
						key:true,
						search: false,
						hidden: true
					}, {
						name: 'name',
						label: self.resource.NAME,
						search: true,
						sortable: false,
						align: "center",
						width: 300
					}, {
						name: 'iprange',
						label: self.resource.IP_RANGE,
						sortable: false,
						align: "center",
						search: false,
						width: 200
					}, {
						name: 'delay',
						label: self.resource.INTERVAL,
						search: false,
						sortable: false,
						align: "center",
						width: 200
					}, {
						name: 'status',
						label: self.resource.STATUS,
						search: false,
						sortable: false,
						align: "center",
						width: 200,
						formatter: function(cellval, opts, rwdat, _act) {
							if (cellval == "0") {
								return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/itnms/host/images/right.png'/><span>"+self.resource.ENABLED+"</span></div>"
							} else {
								return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/itnms/host/images/error.png'/><span>"+self.resource.DISABLED+"</span></div>"
							}
						}
					},{
						name: 'action',
						label: '',
						search: false,
						width: 100,
						formatter: function (cellval, opts, rwdat, _act) {
							var druleid = rwdat.druleid;
							return'<div class="groupMoreOp">' +
								'<div class="btn-group">' +
								'<button type="button" class="btn hg-link-btn dr-drule-edit" id="editbtn-' + druleid + '"><i class="glyphicon glyphicon-pencil"></i></button>' +
								'<button type="button" class="btn hg-link-btn dr-drule-del" id="delbtn-' + druleid + '"><i class="glyphicon glyphicon-trash"></i></button>' +
								'</div>' +
								'</div>';
						}
					}],
					pager: true,
					rowNum : 500,
					rowList : [50,150,500],
					multiselect:true,
					searchbar: true,
					gridComplete: function() {
						self.$el.find(".dr_grid").find('.groupMoreOp').parent().css('overflow', "visible");
						//绑定自定义按钮事件
						//删除
						self.$el.find(".dr_grid").find('.groupMoreOp').find('.dr-drule-del').bind("click", function(e){
							var druleid = e.currentTarget.id.substring(7);//delbtn-xxx
							self.deleteDrule(druleid);
						});
						//编辑
						self.$el.find(".dr_grid").find('.groupMoreOp').find('.dr-drule-edit').bind("click", function(e){
							var druleid = e.currentTarget.id.substring(8);//editbtn-xxx
							self.showEditDruleView(druleid);
						});
						//
						self.$el.find(".dr_grid").find('[type="checkbox"]').bind("change", function(e){
							var selrow = self.$el.find(".dr_grid").grid("getCheckRows");
							self.groupGridCheck(selrow);
						});
					}
				};
				this.$(".dr_grid").empty();
				this.$grid = this.$el.find(".dr_grid").grid(opt);
				this.$grid.jqGrid("setGridHeight", this.leftTreeHeight-120);
			},

			initStatusSel: function () {
				var self = this;
				self.$statusFilterCombobox = self.$('#dr-status-sel').combobox({
					placeholder: '',
					dataTextField: 'name',
					dataValueField: 'id',
					dataSource: self.statusFilterList
				});
				self.$statusFilterCombobox.on('combobox:change', function () {
					self.statusFilterChange();
				});
				self.$statusFilterCombobox.combobox('value', self.statusFilterList[0].id);
			},

			statusFilterChange: function () {
				var self = this;
				if(self.curSubtype){
					self.filterDruleList(event, undefined, self.curSubtype);
				}else{
					self.filterDruleList(event, undefined, undefined);
				}
			},

			groupGridCheck: function (selrow) {
				if(selrow.length>0){
					this.$('#dr-grid-btngroup').show();
				}else{
					this.$('#dr-grid-btngroup').hide();
				}
			},

			gridBtnGroupClick: function (e) {
				var self = this;
				var selrow = self.$el.find(".dr_grid").grid("getCheckRows");
				var druleids = "";
				fish.forEach(selrow,function(row){
					druleids += row.druleid + ",";
				});
				druleids = druleids.substring(0, druleids.length-1);
				var btnid = e.currentTarget.id;
				switch (btnid) {
					case "dr-delete-btn": self.deleteDrule(druleids);break;
					case "dr-disable-drule-btn": self.changeDrulesStatus(druleids, "1");break;
					case "dr-enable-drule-btn": self.changeDrulesStatus(druleids, "0");break;
				}
			},

			changeDrulesStatus: function (druleids, status) {
				var self = this;
				var tip;
				switch (status){
					case "0": tip = self.resource.ENABLE_DRULES_TIP;break;
					case "1": tip = self.resource.DISABLE_DRULES_TIP;break;
				}
				fish.confirm(tip).result.then(function() {
					discoveryAction.changeDrulesStatus({
						druleids: druleids,
						status: status
					}, function(retStatus){
						if(retStatus==0) {
							fish.toast('info', self.resource.DRULES_ENABLED);
						}else if(retStatus==1) {
							fish.toast('info', self.resource.DRULES_DISABLED);
						}
						self.qryDiscoveryRule();
						self.$(".dr_grid").grid("setAllCheckRows",false);
					});
				});
			},

			filterDruleList: function (event, category_no, subtypes_no) {
				var self = this;
				this.curSubtype = "";
				var selValue = this.$statusFilterCombobox.combobox('value');
				if(!subtypes_no){
					//显示全部发现规则
					self.showAllDrules();
				}else {
					this.curSubtype = subtypes_no;
					var relaGroups = [];
					fish.forEach(self.druleRelaList, function (relaItem) {
						var flag = false;
						if (category_no && category_no == relaItem.CATEGORY_NO) {
							flag = true;
						}
						if (!flag && subtypes_no && subtypes_no == relaItem.SUBTYPES_NO) {
							flag = true;
						}
						if (!category_no && !subtypes_no) {

						} else if (flag) {
							relaGroups[relaGroups.length] = relaItem;
						}
					});
					var filterDruleList = [];
					fish.forEach(self.drList, function (drule) {
						var flag = false;
						if (!category_no && !subtypes_no) {
							flag = true;
						} else {
							fish.forEach(relaGroups, function (reladrule) {
								if (drule.druleid == reladrule.DRULEID) {
									flag = true;
								}
							});
						}
						if (flag) {
							if(drule.status == selValue || selValue == self.ALL_VALUE) {
								filterDruleList[filterDruleList.length] = drule;
							}
						}
					});
					//
					self.$(".dr_grid").jqGrid("reloadData", filterDruleList);
				}
			},

			showAllDrules: function () {
				var self = this;
				var filterDruleList = [];
				var selValue = this.$statusFilterCombobox.combobox('value');
				fish.forEach(self.drList, function (drule) {
					if(drule.status == selValue || selValue == self.ALL_VALUE) {
						filterDruleList[filterDruleList.length] = {
							druleid: drule.druleid,
							iprange: drule.iprange,
							name: drule.name,
							delay: drule.delay,
							status: drule.status
						}
					}
				});
				self.$(".dr_grid").jqGrid("reloadData", filterDruleList);
			},

			qryDiscoveryRule: function () {
				var self = this;
				self.drList = [];
				var gridDataList = [];
				discoveryAction.qryDiscoveryRule(function(retJsonObj) {
					if(retJsonObj && retJsonObj.result){
						fish.forEach(retJsonObj.result, function(drule){
							self.drList[self.drList.length] = drule;
							//
							gridDataList[gridDataList.length] = {
								druleid : drule.druleid,
								iprange : drule.iprange,
								name : drule.name,
								delay : drule.delay,
								status : drule.status
							}
						});
						//
						self.$(".dr_grid").jqGrid("reloadData", gridDataList);
						//
						if(self.curSubtype){
							self.filterDruleList(event, undefined, self.curSubtype);
						}
					}
				});
			},

			treeOnClick: function (treeNodeId) {
				var self = this;
				var category_no;
				var subtypes_no;
				self.hideCreateDruleView();
				fish.forEach(self.categoryList, function(category){
					if(category.CATEGORY_NO == treeNodeId){
						category_no = treeNodeId;
					}
				});
				fish.forEach(self.subtypesList, function(subtypes){
					if(subtypes.SUBTYPES_NO == treeNodeId){
						subtypes_no = treeNodeId;
					}
				});
				if(subtypes_no){
					this.getDruleRelaData(subtypes_no);
				}
			},

			showCreateDruleView: function (druleid) {
				var self = this;
				self.$('#tm-homepage').hide();
				self.$('#tm-createtemplate').show();
				self.initCreateView(druleid);
			},

			showTemplateItemView: function (templateid) {
				var self = this;
				self.$('#tm-homepage').hide();
				self.$('#tm-template-item').show();
				self.initItemView(self.$el.find('#tm-template-item'), templateid);
			},

			initItemView: function ($el, templateid) {
				var self = this;
				if(self.templateItemView) return;
				var option = {
					el: $el,
					templateids: templateid,
					callback: function(){
						self.hideTemplateItemView();
					}
				};
				self.templateItemView = new itemsView(option);
				self.templateItemView.render();
			},

			hideTemplateItemView: function () {
				var self = this;
				self.$('#tm-homepage').show();
				self.templateItemView = null;
				self.$('#tm-template-item').hide();
			},

			showEditDruleView: function (druleid) {
				this.showCreateDruleView(druleid);
			},

			hideCreateDruleView: function () {
				var self = this;
				self.$('#tm-homepage').show();
				self.$('#tm-importtemplate').hide();
				self.$('#tm-createtemplate').hide();
				self.createDruleView = null;
				self.templatePageView = null;
				self.macroPageView = null;
				self.curDruleid = null;
			},

			initCreateView: function (druleid) {
				var self = this;
				var curDrule;
				self.curDruleid = druleid;
				if(druleid){
					self.$("#dr-create-title").text(self.resource.EDIT_DRULE);
					fish.forEach(self.drList, function(drule){
						if(drule.druleid == druleid){
							curDrule = drule;
						}
					});
					self.curDrule = curDrule;
				}else{
					self.$("#dr-create-title").text(self.resource.CREATE_DRULE);
				}
				//
				self.initCreateDruleView(curDrule);
			},

			TemplatePage: function ($el) {
				var self =this;
				if(self.templatePageView) return;
				this.templatePageView = new TemplatePageView({
					el:$el,
					positionEL:self.$el,
					'templates':self.curDrule?self.curDrule.parentTemplates:[],
					'cancel':function(){
						self.hideCreateDruleView();
					},
					'ok':function() {
						self.addTemplate();
					}
				})
				this.templatePageView.render();
			},

			MacroPage: function($el) {
				var self =this;
				if(self.macroPageView) return;
				this.macroPageView = new MacroPageView({
					el:$el,
					'macros':self.curDrule?self.curDrule.macros:[],
					'cancel':function(){
						self.hideCreateDruleView();
					},
					'ok':function() {
						self.addTemplate();
					}
				})
				this.macroPageView.render();
			},

			initCreateDruleView: function (curDrule) {
				var self = this;
				if(self.createDruleView) return;
				var option = {
					el: self.$el.find('.kdo-right-page-cotent'),
					drList: self.drList,
					groupList: self.drList,
					druleRelaList: self.druleRelaList,
					catalogList: self.catalogList,
					subtypesList: self.subtypesList,
					curSubtype: self.curSubtype,
					curDrule: curDrule
				};
				self.createDruleView = new createDruleView(option);
				self.createDruleView.render();
				self.listenTo(self.createDruleView, 'cancelEvent', function () {
					self.hideCreateDruleView();
				});
				self.listenTo(self.createDruleView, 'okEvent', function () {
					self.addDrule();
				});
			},

			setAvailableAndSelectedData: function (groupid) {
				var self = this;
				var selectedGroups = [];
				var selectedDatas = [];
				if(self.filterNodeSel){
					selectedDatas = self.filterNodeSel.val();
				}
				fish.forEach(self.drList,function(group){
					if(groupid == "all") {
						selectedGroups[selectedGroups.length] = group;
					}else if (group.groupid == groupid){
						selectedGroups[selectedGroups.length] = group;
					}
				});
				self.availableDataMap = new hostGroupUtil.HashMap();
				fish.forEach(selectedGroups, function(group){
					fish.forEach(group.hosts, function(host){
						self.availableAndSelectedDataMap.put(host.hostid, host.host);
						self.availableDataMap.put(host.hostid, host.host);
					});
					fish.forEach(group.templates, function(template){
						self.availableAndSelectedDataMap.put(template.templateid, template.name);
						self.availableDataMap.put(template.templateid, template.name);
					});
				});
				var tmpMap = self.availableDataMap;
				var dp_r = [];
				fish.forEach(tmpMap.keySet(), function(keyCode) {
					dp_r[dp_r.length] = {
						value: keyCode,
						name: tmpMap.get(keyCode) + ""
					}
				});
				self.setKdoDSelect(selectedDatas, dp_r);
			},

			// 设置左右互选控件
			setKdoDSelect: function (dp_l, dp_r) {
				var self = this;
				self.filterNodeSel = new kdoDSelect({
					el: self.$el.find('.hg-filternode-sel'),
					L: dp_r,
					R: dp_l
				});
				self.filterNodeSel.render();
			},

			// 可选表格数据项选择事件
			selectAvailableData: function (dataId) {
				var self = this;
				this.$('#hg-available-add-'+dataId).unbind();
				this.$('#hg-available-'+dataId).remove();
				//fish.forEach(self.availableAndSelectedDataMap.keySet(), function(keyCode) {
				//	if(keyCode == dataId){
						var dataName = self.availableAndSelectedDataMap.get(dataId);
						var htmlText = '<li name="hg-selected-item" id="hg-selected-'+dataId+'">'
							+ dataName + '<a id="hg-selected-remove-' + dataId + '" href="#"><i class="fa fa-trash"></i></a></li>';
						self.$('[name=hg-selected-grid]').append(htmlText);
						self.$('#hg-selected-remove-' + dataId).unbind();
						self.$('#hg-selected-remove-' + dataId).bind("click", function(event){
							self.cancelSelectedData(this.id.substring(19));
						});
						self.availableDataMap.remove(dataId);
						self.selectedDataMap.put(dataId, dataName);
				//	}
				//});
			},

			cancelSelectedData: function (dataId) {
				var self = this;
				this.$('#hg-selected-remove-'+dataId).unbind();
				this.$('#hg-selected-'+dataId).remove();
				var tmpMap = self.availableAndSelectedDataMap;
				fish.forEach(self.availableAndSelectedDataMap.keySet(), function(keyCode) {
					if(keyCode == dataId){
						var dataName = tmpMap.get(keyCode);
						/*var htmlText = '<li name="hg-available-item" id="hg-available-' + keyCode + '"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
							+ dataName + '<a id="hg-available-add-' + keyCode + '" href="#"><i class="fa fa-plus"></i></a></li>';
						this.$('[name=hg-available-grid]').append(htmlText);
						this.$('#hg-available-add-' + keyCode).unbind();
						this.$('#hg-available-add-' + keyCode).bind("click", function(event){
							self.selectAvailableData(this.id.substring(17));
						});*/
						self.selectedDataMap.remove(dataId);
						self.availableDataMap.put(dataId, dataName);
						self.statusFilterChange();
					}
				});
			},

			groupCategoryClick: function (e, treeNode) {
				self.setAvailableAndSelectedData();
			},

			deleteDrule: function(druleid) {
				var self = this;
				fish.confirm(this.resource.DEL_TIP).result.then(function() {
					discoveryAction.delDrule({
						druleid: druleid
					}, function(data){
						if(data.error){
							fish.toast('warn', data.error.message+" : "+data.error.data);
						}else {
							self.qryDiscoveryRule();
							fish.toast('info', self.resource.DEL_SUCCESS);
						}
					});
				});
			},

			availableDataSearch: function () {
				var searchCont = this.$('#hg-available-search').val();
				var selectableList = this.getSelectableList();
				this.$('[name=hg-available-grid]').empty();
				if(searchCont == ''){
					for (var i = 0, l =  selectableList.length; i < l ; i++) {
						var item =  selectableList[i];
						this.cancelSelectedData(item.id);
					}
				}else {
					var matchCount = 0;
					for (var i = 0, l =  selectableList.length; i < l ; i++) {
						var item =  selectableList[i];
						if (item.name.indexOf(searchCont) != -1) {
							this.cancelSelectedData(item.id);
							matchCount++;
						}
					}
				}
			},

			selectedDataSearch: function () {
				var searchCont = this.$('#hg-selected-search').val();
				var selectedList = this.getSelectedList();
				this.$('[name=hg-selected-grid]').empty();
				if(searchCont == ''){
					for (var i = 0, l =  selectedList.length; i < l ; i++) {
						var item =  selectedList[i];
						this.selectAvailableData(item.id);
					}
				}else {
					var matchCount = 0;
					for (var i = 0, l =  selectedList.length; i < l ; i++) {
						var item =  selectedList[i];
						if (item.name.indexOf(searchCont) != -1) {
							this.selectAvailableData(item.id);
							matchCount++;
						}
					}
				}
			},

			getSelectableList: function() {
				var self = this;
				var selectableList = [];
				fish.forEach(self.availableDataMap.keySet(), function(keyCode){
					selectableList[selectableList.length] = {
						id: keyCode,
						name: self.availableDataMap.get(keyCode)
					};
				});
				return selectableList;
			},

			getSelectedList: function() {
				var self = this;
				var selectedList = [];
				fish.forEach(self.selectedDataMap.keySet(), function(keyCode){
					selectedList[selectedList.length] = {
						id: keyCode,
						name: self.selectedDataMap.get(keyCode)
					};
				});
				return selectedList;
			},

			addDrule: function () {
				var self = this;
				if(!this.createDruleView.validateInfo()){
					return;
				}
				var baseInfo = this.createDruleView.druleInfo;
				discoveryAction.addDrule(baseInfo, function(data){
					if(data.error){
						fish.toast('warn', data.error.message+" : "+data.error.data);
					}else{
						if(baseInfo.druleid!=""){
							fish.toast('info', self.resource.UPDATE_DRULE_SUCCESS);
						}else{
							fish.toast('info', self.resource.ADD_DRULE_SUCCESS);
						}
						if(data.druleid && data.category_no && data.subtypes_no){
							discoveryAction.modDiscoveryRela({
								druleids: data.druleid,
								category_no: data.category_no,
								subtypes_no:data.subtypes_no
							},function(ret){
								self.hideCreateDruleView();
								self.getDruleRelaData();
							});
						}else{
							self.hideCreateDruleView();
							self.getDruleRelaData();
						}
					}
				});
			},

			resize : function(delta) {
				this.uiContainerHeight = this.$el.parents(".portal-page-content").outerHeight();
				this.leftTreeHeight = this.uiContainerHeight - 35;
				this.$el.find("#tm-createtemplate-container").css({'height': +this.leftTreeHeight + 'px'});
			}
		});
	}
);
