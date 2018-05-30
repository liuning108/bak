define(
	[
		'oss_core/itnms/templatemgr/actions/TemplateMgrAction',
		'oss_core/itnms/host/actions/HostAction',
		'oss_core/itnms/hostgroup/actions/HostGroupAction',
		'oss_core/itnms/hostgroup/views/HostGroupUtil',
		'oss_core/itnms/host/components/kdoTree/kdoTree',
		'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
		'oss_core/itnms/host/components/kdoTabs/KdoTabs',
		'oss_core/itnms/templatemgr/views/CreateTemplateView',
		'oss_core/itnms/items/components/views/ItemListView',
		'oss_core/itnms/templatemgr/views/ImportTemplateView',
		'oss_core/itnms/host/components/views/TemplatePageView',
		'oss_core/itnms/host/components/views/MacroPageView',
		'text!oss_core/itnms/templatemgr/templates/TemplateMgrMain.html',
		'i18n!oss_core/itnms/templatemgr/i18n/templatemgr',
		"css!oss_core/itnms/templatemgr/css/templatemgr",
		"css!oss_core/itnms/hostgroup/css/hg-component",
		"css!oss_core/itnms/host/css/kdo.css",
		"css!oss_core/itnms/host/css/host.css"
	], function(templateAction, hostAction, hostGroupAction, hostGroupUtil, kdoTree, kdoDSelect, kdoTabs,
				createTemplateView, itemsView, importTemplateView, TemplatePageView, MacroPageView, templateMgrMain,
				i18nData) {
		return fish.View.extend({
			template : fish.compile(templateMgrMain),
			resource: fish.extend({}, i18nData),

			events : {
				"click #tm-import-btn" : 'showImportView',
				"click .tm-grid-btngroup" : "gridBtnGroupClick",
				"click #tm-back-btn" : 'backFromTplView'
			},

			initialize : function(option) {
				this.option = option;
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				this.hostGroupList = [];
				this.groupRelaList = [];
				this.curSubtype = "";
				this.curTemplateid;
				this.availableAndSelectedDataMap = new hostGroupUtil.HashMap();
				this.availableDataMap = new hostGroupUtil.HashMap();
				this.selectedDataMap = new hostGroupUtil.HashMap();
				this.groupFilterList = [];
				this.ALL_VALUE = "all";
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
					self.hideCreateTemplateView();
					self.hideImportTemplateView();
					self.getGroupData();
				})
				this.$('#tm-createtemplate-btn').bind("click", function(){
					self.showCreateTemplateView();
				})
			},

			afterRender : function() {
				var self = this;
				this.initCss();
				this.initEvent();
				hostAction.getCategoryTree().then(function(data) {
					self.LeftTree(data)
				})
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
				self.initTemplateGrid();
				self.getGroupData();
			},

			getGroupData: function (subtypes_no) {
				var self = this;
				if(subtypes_no){
					this.curSubtype = subtypes_no;
				}
				this.groupRelaList = [];
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				hostGroupAction.qryCategoryAndSubtypes(function(categoryList){
					if(categoryList){
						fish.forEach(categoryList, function(item){
							if(item.hasOwnProperty("GROUPID")){
								self.groupRelaList[self.groupRelaList.length] = item;
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
					self.qryHostGroup();
					self.qryTemplate();
				});
			},

			qryHostGroup: function () {
				var self = this;
				self.hostGroupList = [];
				self.groupFilterList = []
				self.groupFilterList[0] = {groupid: self.ALL_VALUE, name: "All"};
				var gridDataList = [];
				hostGroupAction.qryHostGroup(function(retJsonObj) {
					if(retJsonObj && retJsonObj.result){
						fish.forEach(retJsonObj.result, function(hostgroup){
							self.hostGroupList[self.hostGroupList.length] = hostgroup;
							self.groupFilterList[self.groupFilterList.length] = hostgroup;
						});
					}
					self.initGroupSel();
				});
			},

			initTemplateGrid: function () {
				var self = this;
				var opt = {
					colModel: [{
						name: 'templateid',
						label: '',
						key:true,
						search: false,
						hidden: true
					}, {
						name: 'name',
						label: 'Name',
						search: true,
						sortable: false,
						align: "center",
						width: 200
					}, {
						name: 'hosts',
						label: 'Nodes',
						sortable: false,
						align: "center",
						search: false,
						width: 200
					}, {
						name: 'templates',
						label: 'Templates',
						search: false,
						sortable: false,
						align: "center",
						width: 200
					}, {
						name: 'items',
						label: 'Items',
						search: false,
						sortable: false,
						align: "center",
						width: 200
					},{
						name: 'action',
						label: '',
						search: false,
						width: 200,
						formatter: function (cellval, opts, rwdat, _act) {
							var templateid = rwdat.templateid;
							return'<div class="groupMoreOp">' +
								'<div class="btn-group">' +
								'<button type="button" title="Edit" class="btn hg-link-btn tm-templatemore-edit" id="editbtn-' + templateid + '"><i class="glyphicon glyphicon-pencil"></i></button>' +
								'<button type="button" title="Item" class="btn hg-link-btn tm-templatemore-item" id="itembtn-' + templateid + '"><i class="glyphicon glyphicon-list-alt"></i></button>' +
								'<button type="button" title="Graph" class="btn hg-link-btn"><i class="glyphicon glyphicon-signal "></i></button>' +
								'</div>' +
								'<div class="dropdown hg-grid-more-dropdown">' +
								'<button type="button" title="More" class="btn hg-link-btn" data-toggle="dropdown" ><i class="glyphicon glyphicon-option-vertical"></i></button>' +
								'<ul class="dropdown-menu hg-dropdown-menu" role="menu" aria-labelledby="dLabel">'+
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-move" id="movebtn-' + templateid + '" role="menuitem" tabindex="-1" href="#">应用</a></li>' +
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-move" id="movebtn-' + templateid + '" role="menuitem" tabindex="-1" href="#">监测点</a></li>' +
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-move" id="movebtn-' + templateid + '" role="menuitem" tabindex="-1" href="#">触发器</a></li>' +
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-move" id="movebtn-' + templateid + '" role="menuitem" tabindex="-1" href="#">自动发现</a></li>' +
								'<li role="presentation"><a style="color:#646464" class="tm-templatemore-del" id="delbtn-' + templateid + '" role="menuitem" tabindex="-1" href="#">删除</a></li>' +
								'</ul>' +
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
						self.$el.find(".tm-template-grid").find('.groupMoreOp').parent().css('overflow', "visible");
						//绑定自定义按钮事件
						//删除
						self.$el.find(".tm-template-grid").find('.groupMoreOp').find('.tm-templatemore-del').bind("click", function(e){
							var templateid = e.currentTarget.id.substring(7);//delbtn-xxx
							self.deleteTemplate(templateid);
						});
						//监控项
						self.$el.find(".tm-template-grid").find('.groupMoreOp').find('.tm-templatemore-item').bind("click", function(e){
							var templateid = e.currentTarget.id.substring(8);//editbtn-xxx
							self.showTemplateItemView(templateid);
						});
						//编辑
						self.$el.find(".tm-template-grid").find('.groupMoreOp').find('.tm-templatemore-edit').bind("click", function(e){
							var templateid = e.currentTarget.id.substring(8);//editbtn-xxx
							self.showEditTemplateView(templateid);
						});
						if(self.$el.find(".tm-template-grid").find('.groupMoreOp').find(".dropdown").length<=0) return;
						self.$(".dropdown").on("dropdown:open",function () {
							var $ul = $(this).children(".dropdown-menu");
							var $button = $(this).children(".dropdown-toggle");
							var ulOffset = $ul.offset();
							var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
							var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
							if (spaceDown <100 && (spaceUp >= 0 || spaceUp > spaceDown))
								$(this).addClass("dropup");
						})
						self.$(".dropdown").on("dropdown:close", function() {
							$(this).removeClass("dropup");
						});
						//
						self.$el.find(".tm-template-grid").find('[type="checkbox"]').bind("change", function(e){
							var selrow = self.$el.find(".tm-template-grid").grid("getCheckRows");
							self.groupGridCheck(selrow);
						});
					}
				};
				this.$(".tm-template-grid").empty();
				this.$grid = this.$el.find(".tm-template-grid").grid(opt);
				this.$grid.jqGrid("setGridHeight", this.leftTreeHeight-120);
			},

			initGroupSel: function () {
				var self = this;
				self.$groupFilterCombobox = self.$('#tm-group-sel').combobox({
					placeholder: 'Please select',
					dataTextField: 'name',
					dataValueField: 'groupid',
					dataSource: self.groupFilterList
				});
				self.$groupFilterCombobox.on('combobox:change', function () {
					self.groupFilterChange();
				});
				self.$groupFilterCombobox.combobox('value', self.groupFilterList[0].groupid);
				if(self.option.groupid && self.$groupFilterCombobox){
					self.$groupFilterCombobox.combobox('value', self.option.groupid);
				}
			},

			groupFilterChange: function () {
				var self = this;
				var selValue = this.$groupFilterCombobox.combobox('value');
				var selGroupList = [];
				if(selValue == self.ALL_VALUE) {
					fish.forEach(self.groupFilterList, function(hostgroup){
						if(hostgroup.groupid != self.ALL_VALUE){
							selGroupList[selGroupList.length] = hostgroup.groupid;
						}
					})
				}else {
					selGroupList[selGroupList.length] = selValue;
				}
				var filterTemplateList = [];
				fish.forEach(self.hostGroupList, function (hostgroup) {
					fish.forEach(selGroupList, function(groupid){
						if (hostgroup.groupid == groupid) {
							fish.forEach(hostgroup.templates, function (hostTemplate) {
								fish.forEach(self.templateList, function (template) {
									if (hostTemplate.templateid == template.templateid) {
										var hosts = "Nodes";
										if (template.hosts.length > 0) {
											hosts += " (" + template.hosts.length + ")";
										}
										var templates = "Templates";
										if (template.templates.length > 0) {
											templates += " (" + template.templates.length + ")";
										}
										var items = "Items"
										if (template.items.length > 0) {
											items += " (" + template.items.length + ")";
										}
										filterTemplateList[filterTemplateList.length] = {
											templateid: template.templateid,
											hosts: hosts,
											templates: templates,
											items: items,
											name: template.name,
											description: template.description
										}
									}
								})

							});
						}
					});
				});
				self.$(".tm-template-grid").jqGrid("reloadData", filterTemplateList);
			},

			groupGridCheck: function (selrow) {
				if(selrow.length>0){
					this.$('#tm-grid-btngroup').show();
				}else{
					this.$('#tm-grid-btngroup').hide();
				}
			},

			gridBtnGroupClick: function (e) {
				var self = this;
				var selrow = self.$el.find(".tm-template-grid").grid("getCheckRows");
				var templateids = "";
				fish.forEach(selrow,function(row){
					templateids += row.templateid + ",";
				});
				templateids = templateids.substring(0, templateids.length-1);
				var btnid = e.currentTarget.id;
				switch (btnid) {
					case "tm-delete-btn": self.deleteTemplate(templateids);break;
				}
			},

			filterTemplateList: function (event, category_no, subtypes_no) {
				var self = this;
				this.curSubtype = "";
				if(!subtypes_no){
					//显示全部模板
					self.showAllTemplates();
				}else {
					this.curSubtype = subtypes_no;
					var relaGroups = [];
					fish.forEach(self.groupRelaList, function (relaItem) {
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
					var filterGroupList = [];
					fish.forEach(self.hostGroupList, function (hostgroup) {
						var flag = false;
						if (!category_no && !subtypes_no) {
							flag = true;
						} else {
							fish.forEach(relaGroups, function (relahostgroup) {
								if (hostgroup.groupid == relahostgroup.GROUPID) {
									flag = true;
								}
							});
						}
						if (flag) {
							filterGroupList[filterGroupList.length] = hostgroup;
						}
					});
					self.groupFilterList.splice(1,self.groupFilterList.length-1);
					//
					self.filterTemplateMap = new hostGroupUtil.HashMap();
					fish.forEach(filterGroupList, function (hostgroup) {
						self.groupFilterList[self.groupFilterList.length] = hostgroup;
						fish.forEach(hostgroup.templates, function (template) {
							self.filterTemplateMap.put(template.templateid, template.name);
						});
					});
					//刷新组下拉选择内容
					self.initGroupSel();
					var filterTemplateList = [];
					fish.forEach(self.filterTemplateMap.keySet(), function (templateid) {
						fish.forEach(self.templateList, function (template) {
							if (template.templateid == templateid) {
								//
								var hosts = "Nodes";
								if (template.hosts.length > 0) {
									hosts += " (" + template.hosts.length + ")";
								}
								var templates = "Templates";
								if (template.templates.length > 0) {
									templates += " (" + template.templates.length + ")";
								}
								var items = "Items"
								if (template.items.length > 0) {
									items += " (" + template.items.length + ")";
								}
								filterTemplateList[filterTemplateList.length] = {
									templateid: template.templateid,
									hosts: hosts,
									templates: templates,
									items: items,
									name: template.name,
									description: template.description
								}
							}
						});
					});
					self.$(".tm-template-grid").jqGrid("reloadData", filterTemplateList);
				}
			},

			showAllTemplates: function () {
				var self = this;
				//
				self.groupFilterList.splice(1,self.groupFilterList.length-1);
				fish.forEach(self.hostGroupList, function (hostgroup) {
					self.groupFilterList[self.groupFilterList.length] = hostgroup;
				});
				self.initGroupSel();
				//刷新组下拉选择内容
				self.initGroupSel();
				var filterTemplateList = [];
				fish.forEach(self.templateList, function (template) {
					var hosts = "Nodes";
					if (template.hosts.length > 0) {
						hosts += " (" + template.hosts.length + ")";
					}
					var templates = "Templates";
					if (template.templates.length > 0) {
						templates += " (" + template.templates.length + ")";
					}
					var items = "Items"
					if (template.items.length > 0) {
						items += " (" + template.items.length + ")";
					}
					filterTemplateList[filterTemplateList.length] = {
						templateid: template.templateid,
						hosts: hosts,
						templates: templates,
						items: items,
						name: template.name,
						description: template.description
					}
				});
				self.$(".tm-template-grid").jqGrid("reloadData", filterTemplateList);
			},

			qryTemplate: function () {
				var self = this;
				self.templateList = [];
				var gridDataList = [];
				templateAction.qryTemplate(function(retJsonObj) {
					if(retJsonObj && retJsonObj.result){
						fish.forEach(retJsonObj.result, function(template){
							self.templateList[self.templateList.length] = template;
							//
							var hosts = "Nodes";
							if(template.hosts.length>0){
								hosts += " (" + template.hosts.length + ")";
							}
							var templates = "Templates";
							if(template.templates.length>0){
								templates += " (" + template.templates.length + ")";
							}
							var items = "Items"
							if(template.items.length>0){
								items += " (" + template.items.length + ")";
							}
							gridDataList[gridDataList.length] = {
								templateid: template.templateid,
								hosts: hosts,
								templates: templates,
								items: items,
								name: template.name,
								description: template.description
							}
						});
						//
						self.$(".tm-template-grid").jqGrid("reloadData", gridDataList);
						//
						if(self.curSubtype){
							self.filterTemplateList(event, undefined, self.curSubtype);
						}
						//
						if(self.$groupFilterCombobox && self.$groupFilterCombobox.combobox('value') != self.ALL_VALUE){
							self.groupFilterChange();
						}
						if(self.option.groupid && self.$groupFilterCombobox){
							self.$groupFilterCombobox.combobox('value', self.option.groupid);
						}
					}
				});
			},

			treeOnClick: function (treeNodeId) {
				var self = this;
				var category_no;
				var subtypes_no;
				self.hideCreateTemplateView();
				self.hideImportTemplateView();
				self.hideTemplateItemView();
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
					this.getGroupData(subtypes_no);
				}
			},

			showCreateTemplateView: function (templateid) {
				var self = this;
				self.$('#tm-homepage').hide();
				self.$('#tm-importtemplate').hide();
				self.$('#tm-createtemplate').show();
				self.initCreateView(templateid);
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

			showEditTemplateView: function (templateid) {
				this.showCreateTemplateView(templateid);
			},

			showImportView: function () {
				var self = this;
				self.$('#tm-homepage').hide();
				self.$('#tm-createtemplate').hide();
				self.$('#tm-importtemplate').show();
				self.initImportTemplateView(self.$el.find('#tm-importtemplate'));
			},

			hideCreateTemplateView: function () {
				var self = this;
				self.$('#tm-homepage').show();
				self.$('#tm-importtemplate').hide();
				self.$('#tm-createtemplate').hide();
				self.createTemplateView = null;
				self.templatePageView = null;
				self.macroPageView = null;
				self.curTemplateid = null;
			},

			hideImportTemplateView: function () {
				var self = this;
				self.$('#tm-homepage').show();
				self.$('#tm-importtemplate').hide();
				self.$('#tm-createtemplate').hide();
				self.importTemplateView = null;
			},

			initCreateView: function (templateid) {
				var self = this;
				var curTemplate;
				self.curTemplateid = templateid;
				if(templateid){
					self.$("#tm-create-title").text(self.resource.EDIT_TEMPLATE);
					fish.forEach(self.templateList, function(template){
						if(template.templateid == templateid){
							curTemplate = template;
						}
					});
					var selectedGroups = new hostGroupUtil.HashMap();
					fish.forEach(self.hostGroupList, function(group){
						fish.forEach(group.templates, function(tpl){
							if(tpl.templateid == self.curTemplateid){
								selectedGroups.put(group.groupid, group.name);
							}
						})
					});
					var groups = [];
					fish.forEach(selectedGroups.keySet(), function(groupid){
						groups[groups.length] = {
							groupid: groupid,
							name: selectedGroups.get(groupid)
						}
					});
					curTemplate["groups"] = groups;
					self.curTemplate = curTemplate;
				}else{
					self.$("#tm-create-title").text(self.resource.CREATE_TEMPLATE);
				}
				//
				var kdoTabsComp = new kdoTabs(
					{
						"el":self.$el.find('.kdo-right-page-cotent'),
						"data":[
							{name:'模板', id: "CreateTemplate", view:function($el){self.initCreateTemplateView($el, curTemplate)}},
							{name:'关联模板', id: "LinkTemplate", view:function($el){self.TemplatePage($el, curTemplate)}},
							{name:'宏', id: "Macro", view:function($el){self.MacroPage($el, curTemplate)}}
						],
						startPage:'CreateTemplate',
						"isMore":false,
						more:{
							name : '...'
						}
					}
				);
				kdoTabsComp.render();
			},

			TemplatePage: function ($el) {
				var self =this;
				if(self.templatePageView) return;
				this.templatePageView = new TemplatePageView({
					el:$el,
					positionEL:self.$el,
					'templates':self.curTemplate?self.curTemplate.parentTemplates:[],
					'cancel':function(){
						self.hideCreateTemplateView();
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
					'macros':self.curTemplate?self.curTemplate.macros:[],
					'cancel':function(){
						self.hideCreateTemplateView();
					},
					'ok':function() {
						self.addTemplate();
					}
				})
				this.macroPageView.render();
			},

			initCreateTemplateView: function ($el, curTemplate) {
				var self = this;
				if(self.createTemplateView) return;
				var option = {
					el: $el,
					templateList: self.templateList,
					groupList: self.hostGroupList,
					groupRelaList: self.groupRelaList,
					catalogList: self.catalogList,
					subtypesList: self.subtypesList,
					curSubtype: self.curSubtype,
					curTemplate: curTemplate
				};
				self.createTemplateView = new createTemplateView(option);
				self.createTemplateView.render();
				self.listenTo(self.createTemplateView, 'cancelEvent', function () {
					self.hideCreateTemplateView();
				});
				self.listenTo(self.createTemplateView, 'okEvent', function () {
					self.addTemplate();
				});
			},

			initImportTemplateView: function ($el) {
				var self = this;
				if(self.importTemplateView) return ;
				var option = {
					el: $el
				};
				self.importTemplateView = new importTemplateView(option);
				self.importTemplateView.render();
				self.listenTo(self.importTemplateView, 'cancelEvent', function () {
					self.hideImportTemplateView();
				});
			},

			setAvailableAndSelectedData: function (groupid) {
				var self = this;
				var selectedGroups = [];
				var selectedDatas = [];
				if(self.filterNodeSel){
					selectedDatas = self.filterNodeSel.val();
				}
				fish.forEach(self.hostGroupList,function(group){
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
						self.groupFilterChange();
					}
				});
			},

			groupCategoryClick: function (e, treeNode) {
				self.setAvailableAndSelectedData();
			},

			deleteTemplate: function(templates) {
				var self = this;
				fish.confirm("Are you sure you want to delete template ?").result.then(function() {
					templateAction.delTemplate({
						templates: templates
					}, function(data){
						if(data.error){
							fish.toast('warn', data.error.message+" : "+data.error.data);
						}else {
							self.qryTemplate();
							fish.toast('info', "Template deleted");
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

			addTemplate: function () {
				var self =this;
				if(!this.createTemplateView.validateInfo()){
					return;
				}
				var baseInfo = this.createTemplateView.templateInfo;
				if(this.templatePageView){
					var templatesInfo =this.templatePageView.getInfo();
					baseInfo.templates=templatesInfo.templates;
					baseInfo.templates_clear=templatesInfo.templates_clear;
				}else{
					baseInfo.templates =null;
					baseInfo.templates_clear=null;
				}
				if(this.macroPageView){
					baseInfo.macros=this.macroPageView.getInfo();
				}
				templateAction.addTemplate(baseInfo, function(data){
					if(data.error){
						fish.toast('warn', data.error.message+" : "+data.error.data);
					}else{
						fish.toast('info', "Template added");
						if(data.groupids && data.category_no && data.subtypes_no){
							hostGroupAction.modGroupRela({
								groupids: data.groupids,
								category_no: data.category_no,
								subtypes_no:data.subtypes_no
							},function(ret){
								self.hideCreateTemplateView();
								self.getGroupData();
							});
						}else{
							self.hideCreateTemplateView();
							self.getGroupData();
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
