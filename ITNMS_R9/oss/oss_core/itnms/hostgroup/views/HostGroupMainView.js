define(
	[
		'oss_core/itnms/hostgroup/actions/HostGroupAction',
		'oss_core/itnms/host/actions/HostAction',
		'oss_core/itnms/hostgroup/views/HostGroupUtil',
		'oss_core/itnms/host/components/kdoTree/kdoTree',
		'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
		'oss_core/itnms/host/components/views/HostListView',
		'oss_core/itnms/templatemgr/views/TemplateMgrView',
		'text!oss_core/itnms/hostgroup/templates/HostGroupMain.html',
		'i18n!oss_core/itnms/hostgroup/i18n/hostgroup',
		"css!oss_core/itnms/hostgroup/css/hostgroup",
		"css!oss_core/itnms/hostgroup/css/hg-component",
		"css!oss_core/itnms/host/css/kdo.css",
		"css!oss_core/itnms/host/css/host.css"
	], function(hostGroupAction, hostAction, hostGroupUtil, kdoTree, kdoDSelect, HostView,
				templateMgrView, hostGroupMain, i18nData) {
		return fish.View.extend({
			template : fish.compile(hostGroupMain),
			resource: fish.extend({}, i18nData),
			events : {
				"keyup div" : 'escKeyPress',
				"click #hg-createhostgroup-btn" : 'showCreateHostGroupView',
				"click #hg-creategroup-ok" : 'createGroupOk',
				"click #hg-movegroup-ok" : 'moveGroupOk',
				"click #hg-creategroup-cancel" : 'createGroupCancel',
				"click #hg-createview-close" : 'createGroupCancel',
				"click #hg-moveview-close" : 'moveGroupCancel',
				"click #hg-movegroup-cancel" : 'moveGroupCancel',
				"keyup #hg-create-container" : 'escKeyPress',
				"keyup #hg-available-search" : "availableDataSearch",
				"keyup #hg-selected-search" : "selectedDataSearch",
				"click .hg-grid-btngroup" : "gridBtnGroupClick"
			},

			initialize : function() {
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				this.hostGroupList = [];
				this.groupRelaList = [];
				this.curSubtype = "";
				this.curGroupid;
				this.$groupForm;
				this.availableAndSelectedDataMap = new hostGroupUtil.HashMap();
				this.availableDataMap = new hostGroupUtil.HashMap();
				this.selectedDataMap = new hostGroupUtil.HashMap();
				this.groupFilterList = [];
			},

			render : function() {
				this.$el.html(this.template(i18nData));
			},

			initCss: function() {
				this.$el.parent().css({'padding': '0px'})
			},

			initEvent: function() {
				var self = this;
				this.$('.allHostShow').bind("click", function(){
					self.reloadAllGroup();
				});
			},

			afterRender : function() {
				var self = this;
				this.initCss();
				this.initEvent();
				hostAction.getCategoryTree().then(function(data) {
					self.LeftTree(data)
				});
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
				self.initHostGroupTree();
			},

			reloadAllGroup: function (subtypes_no) {
				if(!subtypes_no){
					this.curSubtype = "";
				}else{
					this.curSubtype = subtypes_no;
				}
				this.initHostGroupTree();
			},

			initHostGroupTree: function () {
				var self = this;
				this.categoryList = [];
				this.subtypesList = [];
				this.catalogList = [];
				this.groupRelaList = [];
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
					self.initHostGroupGrid();
					self.qryHostGroup();
				});
			},

			initHostGroupGrid: function () {
				var self = this;
				var opt = {
					colModel: [{
						name: 'groupid',
						label: '',
						key:true,
						search: false,
						hidden: true
					}, {
						name: 'name',
						label: this.resource.NAME,
						search: true,
						sortable: false,
						align: "center",
						width: 200
					}, {
						name: 'hosts',
						label: this.resource.NODES,
						sortable: false,
						align: "center",
						search: false,
						width: 200
					}, {
						name: 'templates',
						label: this.resource.TEMPLATES,
						search: false,
						sortable: false,
						align: "center",
						width: 400
					}, {
						name: 'action',
						label: '',
						search: false,
						width: 200,
						formatter: function (cellval, opts, rwdat, _act) {
							var groupid = rwdat.groupid;
							return'<div class="groupMoreOp">' +
								'<div class="btn-group">' +
								'<button type="button" title="'+self.resource.EDIT+'" class="btn hg-link-btn hg-groupmore-edit" id="editbtn-' + groupid + '"><i class="glyphicon glyphicon-pencil"></i></button>' +
								'<button type="button" title="'+self.resource.NODES+'" class="btn hg-link-btn hg-groupmore-host" id="hostbtn-' + groupid + '"><i class="fa fa-server"></i></button>' +
								'<button type="button" title="'+self.resource.TEMPLATES+'" class="btn hg-link-btn hg-groupmore-tpl" id="tplbtn-' + groupid + '"><i class="fa fa-clipboard "></i></button>' +
								'</div>' +
								'<div class="dropdown hg-grid-more-dropdown">' +
								'<button type="button" class="btn hg-link-btn" data-toggle="dropdown" ><i class="glyphicon glyphicon-option-vertical"></i></button>' +
								'<ul class="dropdown-menu hg-dropdown-menu" role="menu" aria-labelledby="dLabel">'+
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-move" id="movebtn-' + groupid + '" role="menuitem" tabindex="-1" href="#">'+self.resource.MOVE+'</a></li>' +
								'<li role="presentation"><a style="color:#646464" class="hg-groupmore-del" id="delbtn-' + groupid + '" role="menuitem" tabindex="-1" href="#">'+self.resource.DELETE+'</a></li>' +
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
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').parent().css('overflow', "visible");
						//绑定自定义按钮事件
						//删除
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find('.hg-groupmore-del').bind("click", function(e){
							var groupid = e.currentTarget.id.substring(7);//delbtn-xxx
							self.deleteGroup(groupid);
						});
						//移动
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find('.hg-groupmore-move').bind("click", function(e){
							var groupid = e.currentTarget.id.substring(8);//movebtn-xxx
							self.showMoveHostGroupView(groupid);
						});
						//编辑
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find('.hg-groupmore-edit').bind("click", function(e){
							var groupid = e.currentTarget.id.substring(8);//movebtn-xxx
							self.showEditHostGroupView(groupid);
						});
						//主机
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find('.hg-groupmore-host').bind("click", function(e){
							var groupid = e.currentTarget.id.substring(8);//hostbtn-xxx
							self.showHostView(groupid);
						});
						//模板
						self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find('.hg-groupmore-tpl').bind("click", function(e){
							var groupid = e.currentTarget.id.substring(7);//tplbtn-xxx
							self.showHostGroupTplView(groupid);
						});
						if(self.$el.find(".hg-hostgroup-grid").find('.groupMoreOp').find(".dropdown").length<=0) return;
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
						self.$el.find(".hg-hostgroup-grid").find('[type="checkbox"]').bind("change", function(e){
							var selrow = self.$el.find(".hg-hostgroup-grid").grid("getCheckRows");
							self.groupGridCheck(selrow);
						});
					}
				};
				this.$(".hg-hostgroup-grid").empty();
				this.groupGridCheck([]);
				this.$grid = this.$el.find(".hg-hostgroup-grid").grid(opt);
				this.$grid.jqGrid("setGridHeight", this.leftTreeHeight-80);
			},

			groupGridCheck: function (selrow) {
				if(selrow.length>0){
					this.$('#hg-grid-btngroup').show();
				}else{
					this.$('#hg-grid-btngroup').hide();
				}
			},

			filterHostGroupList: function (event, category_no, subtypes_no) {
				var self = this;
				this.curSubtype = "";
				if(subtypes_no){
					this.curSubtype = subtypes_no;
				}else if(!category_no){
					this.$("a[class$='curSelectedNode']").removeClass("curSelectedNode");
				}
				var relaGroups = [];
				fish.forEach(self.groupRelaList, function(relaItem){
					var flag = false;
					if(category_no && category_no==relaItem.CATEGORY_NO){
						flag = true;
					}
					if(!flag && subtypes_no && subtypes_no==relaItem.SUBTYPES_NO){
						flag = true;
					}
					if(!category_no && !subtypes_no){

					}else if(flag){
						relaGroups[relaGroups.length] = relaItem;
					}
				});
				var filterGroupList = [];
				fish.forEach(self.hostGroupList, function(hostgroup){
					var flag = false;
					if(!category_no && !subtypes_no){
						flag = true;
					}else {
						fish.forEach(relaGroups, function (relahostgroup) {
							if (hostgroup.groupid == relahostgroup.GROUPID) {
								flag = true;
							}
						});
					}
					if(flag){
						var hosts = "Nodes";
						if(hostgroup.hosts.length>0){
							hosts += " (" + hostgroup.hosts.length + ")";
						}
						var templates = "Templates";
						if(hostgroup.templates.length>0){
							templates += " (" + hostgroup.templates.length + ")";
						}
						filterGroupList[filterGroupList.length] = {
							groupid: hostgroup.groupid,
							hosts: hosts,
							templates: templates,
							name: hostgroup.name
						};
					}
				});
				self.$(".hg-hostgroup-grid").jqGrid("reloadData", filterGroupList);
			},

			qryHostGroup: function () {
				var self = this;
				self.hostGroupList = [];
				self.groupFilterList = []
				self.groupFilterList[0] = {groupid:"all", name:"All"};
				var gridDataList = [];
				hostGroupAction.qryHostGroup(function(retJsonObj) {
					if(retJsonObj && retJsonObj.result){
						fish.forEach(retJsonObj.result, function(hostgroup){
							self.hostGroupList[self.hostGroupList.length] = hostgroup;
							self.groupFilterList[self.groupFilterList.length] = hostgroup;
							//
							var hosts = "Nodes";
							if(hostgroup.hosts.length>0){
								hosts += " (" + hostgroup.hosts.length + ")";
							}
							var templates = "Templates";
							if(hostgroup.templates.length>0){
								templates += " (" + hostgroup.templates.length + ")";
							}
							gridDataList[gridDataList.length] = {
								groupid: hostgroup.groupid,
								hosts: hosts,
								templates: templates,
								name: hostgroup.name
							}
						});
						//
						self.$(".hg-hostgroup-grid").jqGrid("reloadData", gridDataList);
						//
						if(self.curSubtype){
							self.filterHostGroupList(event, undefined, self.curSubtype);
						}
					}
				});
			},

			treeOnClick: function (treeNodeId) {
				var self = this;
				self.hideHostGroupTplView();
				var category_no;
				var subtypes_no;
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
					this.reloadAllGroup(subtypes_no);
				}
			},

			showCreateHostGroupView: function () {
				var self = this;
				var panelWidth = (this.$el.parents(".portal-page-content").outerWidth()-212)/2;
				var leftPosition = panelWidth + 212;
				var topPosition = 35;
				var containerHeight = this.leftTreeHeight+39;
				this.$("#hg-create-container").css("left", leftPosition);
				this.$("#hg-create-container").css("top", topPosition+7);
				this.$("#hg-create-container").css("width", panelWidth);
				this.$("#hg-create-container").css("height", containerHeight-7);
				//显示遮罩层
				this.$("#hg-create-container").slideDown(0, function() {
					self.$('.hg-lock').css({
						height: containerHeight,
						width: leftPosition,
						top: topPosition,
						display: "block"
					});
				});
				this.initCreateView();
			},

			showEditHostGroupView: function (groupid) {
				var self = this;
				var panelWidth = (this.$el.parents(".portal-page-content").outerWidth()-212)/2;
				var leftPosition = panelWidth + 212;
				var topPosition = 35;
				var containerHeight = this.leftTreeHeight+39;
				this.$("#hg-create-container").css("left", leftPosition);
				this.$("#hg-create-container").css("top", topPosition+7);
				this.$("#hg-create-container").css("width", panelWidth);
				this.$("#hg-create-container").css("height", containerHeight-7);
				//显示遮罩层
				this.$("#hg-create-container").slideDown(0, function() {
					self.$('.hg-lock').css({
						height: containerHeight,
						width: leftPosition,
						top: topPosition,
						display: "block"
					});
				});
				this.initCreateView(groupid);
			},

			showHostView: function(groupid) {
				var self = this;
				var groups = [];
				groups[groups.length] = {
					groupid: groupid, name:""
				};
				self.$('#hg-group').hide();
				self.$('#hg-host').show();
				if(self.hostListView) return;
				self.hostListView = new HostView(
					{
						el: self.$el.find('#hg-host'),
						'tableH': self.leftTreeHeight-80,
						'groups': groups,
						'bisId': self.curSubtype,
						'callback':function(){
							self.hideHostView()
						}
					}
				)
				self.hostListView.render();
			},

			showHostGroupTplView: function (groupid) {
				var self = this;
				self.$('#hg-group').hide();
				self.$('#hg-template').show();
				if(self.templateView) return;
				var option = {
					el: self.$el.find('#hg-template'),
					groupid: groupid,
					callback: function(){
						self.hideHostGroupTplView();
					}
				};
				self.templateView = new templateMgrView(option);
				self.templateView.render();
			},

			hideHostGroupTplView: function () {
				var self = this;
				self.$('#hg-group').show();
				self.$('#hg-template').hide();
				self.templateView = null;
			},

			hideHostView: function () {
				var self = this;
				self.$('#hg-group').show();
				self.$('#hg-host').hide();
				self.hostListView = null;
			},

			showMoveHostGroupView: function (groupids) {
				var self = this;
				var panelWidth = (this.$el.parents(".portal-page-content").outerWidth()-212)/2;
				var leftPosition = panelWidth + 212;
				var topPosition = 35;
				var containerHeight = this.leftTreeHeight+39;
				this.$("#hg-move-container").css("left", leftPosition);
				this.$("#hg-move-container").css("top", topPosition+7);
				this.$("#hg-move-container").css("width", panelWidth);
				this.$("#hg-move-container").css("height", containerHeight-7);
				//显示遮罩层
				this.$("#hg-move-container").slideDown(0, function() {
					self.$('.hg-lock').css({
						height: containerHeight,
						width: leftPosition,
						top: topPosition,
						display: "block"
					});
				});
				this.initMoveView(groupids);
			},

			initMoveView: function (groupids) {
				var self = this;
				self.curMovedGroupids = groupids;
				var groupids = groupids.split(",");
				var movedGroupsName = "";
				var movedGroupCategoryMap = new hostGroupUtil.HashMap();
				var movedGroupTo = "";
				fish.forEach(groupids, function(groupid){
					fish.forEach(self.hostGroupList, function(group){
						if(group.groupid == groupid){
							movedGroupsName += group.name + ",";
						}
					});
					fish.forEach(self.groupRelaList, function(groupRela){
						if(groupRela.GROUPID == groupid){
							var categoryName = "";
							var category_no = groupRela.CATEGORY_NO;
							var subtypes_no = groupRela.SUBTYPES_NO;
							fish.forEach(self.categoryList, function(category){
								if(category.CATEGORY_NO == category_no){
									categoryName += category.CATEGORY_NAME + "/";
								}
							})
							fish.forEach(self.subtypesList, function(subtypes){
								if(subtypes.SUBTYPES_NO == subtypes_no){
									categoryName += subtypes.SUBTYPES_NAME;
								}
							})
							movedGroupCategoryMap.put(categoryName, 1);
						}
					})

				});
				//
				self.$groupMoveForm = self.$('#hg-group-move-form').form();
				//名称控件
				movedGroupsName = movedGroupsName.substring(0, movedGroupsName.length-1);
				self.$("#hg-moved-group").val(movedGroupsName);
				//From控件
				var movedGroupsFromName = "";
				fish.forEach(movedGroupCategoryMap.keySet(), function(name){
					movedGroupsFromName += name + ",";
				});
				if(movedGroupsFromName!=""){
					movedGroupsFromName = movedGroupsFromName.substring(0, movedGroupsFromName.length-1);
				}
				self.$("#hg-moved-group-from").val(movedGroupsFromName);
				//To控件
				var fNodes = [];
				fish.forEach(self.catalogList, function(catalogItem){
					fNodes[fNodes.length] = {
						disabled: true,
						category_no: catalogItem.category_no,
						children: catalogItem.children,
						id: catalogItem.id,
						name: catalogItem.name,
						nodeType: catalogItem.nodeType,
						open: true
					}
				});
				var options = {
					view: {
						selectedMulti: false,
						showIcon: false
					},
					placeholder: "Please select",
					data: {
						simpleData: {
							enable: true
						}
					},
					fNodes : fNodes
				};
				self.$moveCategoryCombobox = self.$('#hg-moved-group-to-sel').combotree(options);
				self.$('#hg-moved-group-to-sel').combotree('clear');
			},

			initCreateView: function (groupid) {
				var self = this;
				self.curGroupid = groupid;
				self.$("#hg-create-title").text(self.resource.CREATE_HOST_GROUP);
				self.availableAndSelectedDataMap = new hostGroupUtil.HashMap();
				self.availableDataMap = new hostGroupUtil.HashMap();
				self.selectedDataMap = new hostGroupUtil.HashMap();
				self.filterNodeSel = null;
				//
				self.$groupForm = self.$('#hg-group-form').form();
				//名称控件
				self.$("#hg-group-name-input").val("");
				//分类控件
				var fNodes = [];
				fish.forEach(self.catalogList, function(catalogItem){
					fNodes[fNodes.length] = {
						disabled: true,
						category_no: catalogItem.category_no,
						children: catalogItem.children,
						id: catalogItem.id,
						name: catalogItem.name,
						nodeType: catalogItem.nodeType,
						open: true
					}
				});
				var options = {
					view: {
						selectedMulti: false,
						showIcon: false
					},
					placeholder: "Please select",
					data: {
						simpleData: {
							enable: true
						}
					},
					fNodes : fNodes
				};
				self.$categoryCombobox = self.$('#hg-group-category-sel').combotree(options);
				self.$('#hg-group-category-sel').combotree('enable');
				if(self.curSubtype){
					var subtypeName;
					fish.forEach(self.subtypesList, function(item){
						if(item.SUBTYPES_NO == self.curSubtype){
							subtypeName = item.SUBTYPES_NAME;
						}
					});
					self.$('#hg-group-category-sel').combotree('value', subtypeName);
				}else{
					self.$('#hg-group-category-sel').combotree('clear');
				}
				//过滤控件
				self.$filterCombobox = self.$('#hg-filter-sel').combobox({
					placeholder: 'Please select',
					dataTextField: 'name',
					dataValueField: 'groupid',
					dataSource: self.groupFilterList
				});
				self.$filterCombobox.on('combobox:change', function () {
					self.groupFilterChange();
				});
				if(self.groupFilterList.length>1) {
					self.$filterCombobox.combobox('value', self.groupFilterList[1].groupid);
				}else{
					self.$filterCombobox.combobox('value', self.groupFilterList[0].groupid);
				}
				//groupid不为空时 为编辑操作
				if(groupid){
					self.$("#hg-create-title").text(self.resource.EDIT_HOST_GROUP);
					self.setGroupDetailInView(groupid);
				}
			},

			setGroupDetailInView: function (groupid) {
				var self = this;
				var groupName;
				var hosts = [];
				var templates = [];
				fish.forEach(self.hostGroupList, function(group){
					if(group.groupid == groupid){
						groupName = group.name;
						hosts = group.hosts;
						templates = group.templates;
					}
				});
				self.$("#hg-group-name-input").val(groupName);
				//
				var subtypes_no;
				fish.forEach(self.groupRelaList, function(groupRela){
					if(groupRela.GROUPID == groupid){
						subtypes_no = groupRela.SUBTYPES_NO;
					}
				});
				fish.forEach(self.subtypesList, function(item){
					if(item.SUBTYPES_NO == subtypes_no){
						subtypeName = item.SUBTYPES_NAME;
						self.$('#hg-group-category-sel').combotree('value', subtypeName);
					}
				});
				self.$('#hg-group-category-sel').combotree('disable');
				//
				var rList = self.filterNodeSel.valL();
				var lList = [];
				if(hosts.length>0){
					fish.forEach(hosts, function(hostItem){
						lList[lList.length] = {
							value: "host_" + hostItem.hostid,
							name: hostItem.host
						};
					})
				}
				if(templates.length>0){
					fish.forEach(templates, function(templateItem){
						lList[lList.length] = {
							value: "template_" + templateItem.templateid,
							name: templateItem.name
						};
					})
				}
				self.setKdoDSelect(lList, rList);
			},

			groupFilterChange: function () {
				var self = this;
				var groupid = this.$filterCombobox.combobox('value');
				self.setAvailableAndSelectedData(groupid);
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
						self.availableAndSelectedDataMap.put("host_"+host.hostid, host.host);
						self.availableDataMap.put("host_"+host.hostid, host.host);
					});
					fish.forEach(group.templates, function(template){
						self.availableAndSelectedDataMap.put("template_"+template.templateid, template.name);
						self.availableDataMap.put("template_"+template.templateid, template.name);
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

 			createGroupCancel: function () {
				this.$("#hg-create-container").slideUp(0, function() {
					self.$('.hg-lock').css({
						display: "none"
					});
				});
			},

			moveGroupCancel: function () {
				this.$("#hg-move-container").slideUp(0, function() {
					self.$('.hg-lock').css({
						display: "none"
					});
				});
			},

			createGroupOk: function () {
				var self = this;
				var groupDetailObj = this.validateGroupForm();
				if(groupDetailObj){
					hostGroupAction.addHostGroup(groupDetailObj, function(groupid) {
						self.createGroupCancel();
						if(groupDetailObj.groupid){
							self.qryHostGroup();
							fish.toast('info', self.resource.GROUP_UPDATED);
						}else{
							self.groupRelaList[self.groupRelaList.length] = {
								CATEGORY_NO: groupDetailObj.category_no,
								SUBTYPES_NO: groupDetailObj.subtypes_no,
								GROUPID: groupid
							};
							self.qryHostGroup();
							hostGroupAction.modGroupRela({
								category_no: groupDetailObj.category_no,
								subtypes_no: groupDetailObj.subtypes_no,
								groupids: groupid
							});
							fish.toast('info', self.resource.GROUP_ADDED);
						}
					});
				}
			},

			moveGroupOk: function () {
				var self = this;
				var groupMoveObj = this.validateMoveGroupForm();
				if(groupMoveObj){
					hostGroupAction.modGroupRela(groupMoveObj, function(groupid) {
						self.moveGroupCancel();
						fish.forEach(groupMoveObj.groupids.split(","), function(groupid){
							fish.forEach(self.groupRelaList, function(groupRela){
								if(groupRela.GROUPID == groupid){
									groupRela.CATEGORY_NO = groupMoveObj.category_no;
									groupRela.SUBTYPES_NO = groupMoveObj.subtypes_no;
								}
							});
						});
						self.qryHostGroup();
						fish.toast('info', self.resource.GROUP_MOVED);
					});
				}
			},

			deleteGroup: function(groupids) {
				var self = this;
				fish.confirm(self.resource.GROUP_DELETE_CONFIRM).result.then(function() {
					hostGroupAction.delHostGroup({
						groupids: groupids
					}, function(){
						fish.forEach(groupids.split(","), function(groupid){
							for(var i=0;i<self.groupRelaList.length;i++){
								var groupRela = self.groupRelaList[i];
								if(groupRela.GROUPID == groupid){
									self.groupRelaList.splice(i--, 1);
								}
							}
						});
						self.qryHostGroup();
						fish.toast('info', self.resource.GROUP_DELETED);
					});
				});
			},

			changeNodesStatus: function (groupids, status) {
				var self = this;
				var tip;
				switch (status){
					case "0": tip = self.resource.ENABLE_NODES_TIP;break;
					case "1": tip = self.resource.DISABLE_NODES_TIP;break;
				}
				fish.confirm(tip).result.then(function() {
					hostGroupAction.changeNodesStatus({
						groupids: groupids,
						status: status
					}, function(retStatus){
						if(retStatus==0) {
							fish.toast('info', "Nodes Enabled");
						}else if(retStatus==1) {
							fish.toast('info', "Nodes Disabled");
						}
						self.$(".hg-hostgroup-grid").grid("setAllCheckRows",false);
					});
				});
			},

			validateMoveGroupForm: function () {
				var self = this;
				var validFlag = true;
				var groupMoveObj = null;
				var category_no;
				var subtypes_no;
				var categoryObj = self.$('#hg-moved-group-to-sel').combotree('value');
				if (!categoryObj) {
					validFlag = false;
					fish.toast('info', "Category is required");
				}else{
					category_no = categoryObj.pId;
					subtypes_no = categoryObj.subtypes_no;
				}
				if(validFlag){
					groupMoveObj = {
						groupids: self.curMovedGroupids,
						category_no: category_no,
						subtypes_no: subtypes_no
					}
				}
				return groupMoveObj;
			},

			validateGroupForm: function () {
				var self = this;
				var validFlag = true;
				var groupDetailObj = null;
				var category_no;
				var subtypes_no;
				var hostOrTemplates = self.filterNodeSel.val();
				var groupName = hostGroupUtil.trim(this.$('#hg-group-name-input').val());
				if(groupName == ''){
					validFlag = false;
					fish.toast('info', "Group name is required");
				}else {
					fish.forEach(self.hostGroupList, function(group){
						if(group.name == groupName && self.curGroupid!=group.groupid){
							validFlag = false;
							fish.toast('info', "Group name existed");
						}
					});
				}
				if(validFlag) {
					var categoryObj = self.$('#hg-group-category-sel').combotree('value');
					if (!categoryObj) {
						validFlag = false;
						fish.toast('info', "Category  is required");
					}else{
						category_no = categoryObj.pId;
						subtypes_no = categoryObj.subtypes_no;
					}
				}
				if(validFlag){
					groupDetailObj = {
						groupid: self.curGroupid,
						name: groupName,
						hostOrTemplates: hostOrTemplates,
						category_no: category_no,
						subtypes_no: subtypes_no
					}
				}
				return groupDetailObj;
			},

			escKeyPress: function (e) {
				if (event.keyCode == "27") {
					this.createGroupCancel();
					this.moveGroupCancel();
				}
			},

			gridBtnGroupClick: function (e) {
				var self = this;
				var selrow = self.$el.find(".hg-hostgroup-grid").grid("getCheckRows");
				var groupids = "";
				fish.forEach(selrow,function(row){
					groupids += row.groupid + ",";
				});
				groupids = groupids.substring(0, groupids.length-1);
				var btnid = e.currentTarget.id;
				switch (btnid) {
					case "hg-enable-nodes-btn": self.changeNodesStatus(groupids, "0");break;
					case "hg-disable-nodes-btn": self.changeNodesStatus(groupids, "1");break;
					case "hg-move-btn": self.showMoveHostGroupView(groupids);break;
					case "hg-delete-btn": self.deleteGroup(groupids);break;
				}
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

			resize : function(delta) {
				this.uiContainerHeight = this.$el.parents(".portal-page-content").outerHeight();
				this.leftTreeHeight = this.uiContainerHeight - 74;
				this.$el.find("#hg-left-tree").css({'height': +this.leftTreeHeight + 'px'});
			}
		});
	}
);
