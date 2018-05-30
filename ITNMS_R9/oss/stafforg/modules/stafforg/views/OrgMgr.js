define([
	"text!stafforg/modules/stafforg/templates/OrgMgrTemplate.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"text!modules/common/templates/GridCellDeleteTemplate.html",
	"stafforg/modules/areamgr/actions/AreaAction",
	"webroot"
], function(orgTemplate, staffOrgAction, i18nStaffOrg, gridCellDelTemplate, areaAction, webroot) {
	return portal.BaseView.extend({

		template: fish.compile(orgTemplate),
		cellDelTemplate: fish.compile(gridCellDelTemplate),

		events: {
			"click .js-new": "newClick",
			"click .js-edit": "editClick",
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick",
			"click .js-btn-export": "exportClick"
		},

		initialize: function() {
			this.jobResource = fish.extend({}, {
				MULTI_JOB_SEL_TITLE: i18nStaffOrg.STAFFORG_ORG_JOB_SELECTOR
			});
			this.leaderResource = fish.extend({}, {
				STAFF_SEL_POP_WIN: i18nStaffOrg.STAFFORG_ORG_LEADER_SELECTOR
			});
		},

		render: function() {
			this.setElement(this.template(i18nStaffOrg));
//			this.$el.html(this.template(i18nStaffOrg));
			this.delHtml = this.cellDelTemplate(i18nStaffOrg);
			this.newBtn = this.$(".js-new");
			this.editBtn = this.$(".js-edit");
			this.okBtn = this.$(".js-ok");
			this.cancelBtn = this.$(".js-cancel");
			this.statusChange();
			return this;
		},

		afterRender: function() { //dom加载完成的事件
			this.orgTree = this.$(".js-org-grid").grid({
				// height:320,
				colModel: [{
					name: 'orgId',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: i18nStaffOrg.STAFFORG_ORG_NAME,
					sortable: false,
					search: true,
					width: "45%",
				}, {
					name: "orgCode",
					label: i18nStaffOrg.STAFFORG_ORG_CODE,
					sortable: false,
					search: true,
					width: "45%",
				}, {
					name: "areaId",
					label: i18nStaffOrg.STAFFORG_ORG_AREA,
					exportable: true,
					hidden: true
				}, {
					name: "leaderStaffName",
					label: i18nStaffOrg.STAFFORG_ORG_LEADER,
					hidden: true,
					exportable: true
				}, {
					name: "leader",
					label: i18nStaffOrg.STAFFORG_ORG_LEADER,
					hidden: true,
					exportable: true
				}, {
					name: 'operate',
					label: '',
					width: "10%",
					formatter: function() {
						return this.delHtml;
					}.bind(this)
				}],
				treeGrid: true,
				exportFeature: function(){
					return {
						serviceName:"QryStaffMasterOrgList"
					}
				}.bind(this),
				/*treeIcons: {
				    plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: "orgName",
				pagebar: true,
				searchbar: true,
				onSelectRow: this.rowSelectCallback.bind(this),
				onChangeRow: this.onChangeRow.bind(this),
				//onRowExpand: this.expandRowCommon.bind(this)
				onRowExpand: function(e, rowdata, target) {
				    this.expandRowCommon(rowdata);
				}.bind(this)
            });


			this.jobPopEdit = this.$(".js-job-popwin").popedit({
				open: function() {
                    var orgInfo = this.orgTree.grid("getSelection");
                    var selectedJobValue = this.jobPopEdit.popedit("getValue");
					fish.popupView({
						url: "stafforg/modules/jobmgr/views/JobMultiSelPopWin",
						viewOption: {
							resource: this.jobResource,
							selectedJob: selectedJobValue ? selectedJobValue.Value : null,
                            orgId: orgInfo.orgId
						},
						close: function(msg) {
							this.jobPopEdit.popedit("setValue", {
								Value: msg,
								Text: this.getPopJobText(msg)
							});
						}.bind(this)
					});
				}.bind(this),
				dataTextField: "Text",
				dataValueField: "Value"
			});

			this.areaPopEdit = this.$(".js-area-popwin").popedit({ //初始化Area的popEdit
				dataTextField: "Text",
				dataValueField: "Value",
				open: function() {
					var selectedAreaValue = this.areaPopEdit.popedit("getValue");
					fish.popupView({
						url: "stafforg/modules/areamgr/views/AreaSingleSelPopWin",
						viewOption: {
							selectedArea: selectedAreaValue ? selectedAreaValue.Value : null
						},
						close: function(msg) {
							this.areaPopEdit.popedit("setValue", {
								Value: msg,
								Text: msg.areaName
							});
						}.bind(this)
					});
				}.bind(this)
			});

			this.leaderPopEdit = this.$(".js-leader-popwin").popedit({
				dataTextField: "Text",
				dataValueField: "Value",
				open: function() {
					var leaderValue = this.leaderPopEdit.popedit("getValue");
					var orgInfo = this.orgTree.grid("getSelection");
					fish.popupView({
						url: "stafforg/modules/stafforg/views/StaffInOrgSingleSelPopWin",
						viewOption: {
							resource: this.leaderResource,
							selectedStaffId: leaderValue ? leaderValue.Value : null,
							orgId: orgInfo.orgId,
							canSelectedEmpty: true
						},
						close: function(msg) {
							this.leaderPopEdit.popedit("setValue", {
								Value: msg,
								Text: msg.staffName
							});
						}.bind(this)
					});
				}.bind(this)
			});

            this.detailForm = this.$(".js-org-detail-form").form();
//            this.detailForm.slimscroll({height: 160});
			staffOrgAction.qryOrgAttrDefJSON(function(status) {
			    var json = status;
			    require([webroot+"frm/portal/PropertyList"], function() {
	                this.$(".org-attr-list").propertylist({
	                    data: json,
	                    colCssp: "col-md-12 col-sm-12",
	                    labelCssp: "col-md-4 col-sm-4",
	                    elCssp: "col-md-8 col-sm-8"
	                });
	                this.detailForm.form("disable");
			    }.bind(this));
			}.bind(this));

			this.detailForm.form().slimscroll({height: 150});

            staffOrgAction.qryRootOrgListByStaffId(function(data) {
				var root = data;
				if(root.length == 0)
					this.editBtn.hide();
				if (data.length > 0) {
					fish.forEach(data, function(org) {
                        org.children = []; 
                    }.bind(this));
                }
				this.orgTree.jqGrid("reloadData", data);
				this.orgTree.jqGrid("setSelection", data[0]);
//				var orgs = portal.utils.getTree(data, "orgId", "parentOrgId", null);
//				this.orgTree.grid("reloadData", orgs);
//				if (orgs && orgs.length > 0) {
//					this.orgTree.grid("setSelection", orgs[0]);
//					var rd = this.orgTree.grid("getSelection");
//				}
				//ToDo:修改为懒加载
//				staffOrgAction.qryStaffMasterOrgList(function(data) {
//					var subList = data;
//					for (var rootKey in root) {
//						var rootItem = root[rootKey];
//						for (var subKey in subList) {
//							var subItem = subList[subKey];
//							if (rootItem.orgId == subItem.orgId) {   
//								subItem.parentOrgId = null;
//								break;
//							}
//						}
//					}
//					var orgs = portal.utils.getTree(subList, "orgId", "parentOrgId", null);
//					this.orgTree.grid("reloadData", orgs);
//					if (orgs && orgs.length > 0) {
//						this.orgTree.grid("setSelection", orgs[0]);
//						var rd = this.orgTree.grid("getSelection");
//						if(!rd.isLeaf)
//						    this.orgTree.grid("expandNode", rd);
//					}
//				}.bind(this));
			}.bind(this));
            
            staffOrgAction.queryOrgType(function(data) {
				this.$(".js-org-detail-form").find(
						":input[name='orgType']").combobox({
					dataTextField : 'orgTypeName',
					dataValueField : 'orgType',
					dataSource : data
				});
			}.bind(this));
            
			this.statusChange();
		},

//		resize: function(delta) {	
//			this.orgTree.grid("setGridHeight", this.orgTree.height() + delta);
//		},

		rowSelectCallback: function(ee, rowid, state) {
			var e = ee && ee.originalEvent || (void 0);
			var rowdata = this.orgTree.grid('getSelection');
			staffOrgAction.qryAttrDataByOrgId(rowdata.orgId,function(result) {				
				if(result){
					var attrList = result;
					for(var j = 0; j < attrList.length; j++){
						rowdata[attrList[j].attrId] = attrList[j].attrValue;
					}
					// this.detailForm.form("clear");
                    rowdata.leader = {"Value":rowdata.leader,"Text":rowdata.leaderStaffName};
					this.detailForm.form("value", rowdata);		
					require([webroot+"frm/portal/PropertyList"], function() {	
						this.$(".org-attr-list").propertylist("linkageRefresh");
					});				}					
			}.bind(this));
			// this.detailForm.form("value", rowdata);

			staffOrgAction.qryJobListByOrgId(rowdata.orgId, function(data) {
				// if (data && data.JOB_LIST) {
				// 	rowdata.JOB_LIST = data.JOB_LIST;
				// } else {
					rowdata.jobList = data;
				// }
				this.jobPopEdit.popedit("setValue", {
					Value: rowdata.jobList,
					Text: this.getPopJobText(rowdata.jobList)
				});
			}.bind(this));

			if (rowdata.areaId) {
				areaAction.qryAreaById(rowdata.areaId, function(area) {
					rowdata.areaInfo = area;
					this.areaPopEdit.popedit("setValue", {
						Value: area,
						Text: (area ? area.areaName : "")
					});
				}.bind(this));
			}

			// this.leaderPopEdit.popedit("setValue", {
			// 	Value: rowdata.leader,
			// 	Text: rowdata.leaderStaffName
			// });		

			if (e && e.target) {
				var action = $(e.target).attr("action");
				if (action) {
					if (action == "delete") {
						if (!this.orgTree.grid("getNodeParent", rowdata)) {
							fish.warn(i18nStaffOrg.STAFFORG_CAN_NOT_DEL_ROOT_ORG);
							return;
						}
						var children = this.orgTree.grid("getNodeChildren", rowdata);
						if (children && children.length > 0) { //如果有子项
							fish.warn(i18nStaffOrg.STAFFORG_CAN_NOT_DEL_ORG_HAS_SUB);
							return;
						}
						fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_DEL_ORG,function() {
								staffOrgAction.disableOrg(rowdata.orgId, function() {
									var selrow = this.orgTree.grid("getSelection");
									var nextrow = this.orgTree.grid("getNextSelection", selrow); //获取下一条数据
									if (nextrow == null) {
										nextrow = this.orgTree.grid("getPrevSelection", selrow); //获取上一条同级数据
									}
									if (nextrow == null) {
										nextrow = this.orgTree.grid("getNodeParent", selrow);
									}
									this.orgTree.grid("delTreeNode", selrow);
									if (nextrow != null) {
										this.orgTree.grid("setSelection", nextrow);
									}
									fish.success(i18nStaffOrg.STAFFORG_DEL_ORG_SUCCESS);
								}.bind(this));
							}.bind(this), $.noop);
					}
				}
			}
		},

		onChangeRow: function() {
			this.status = null;
			this.statusChange();
			this.trigger("orgChange", this.orgTree.grid('getSelection'));
		},

		getPopJobText: function(jobList) {
			if (jobList && jobList.length > 0) {
				var text = "";
				for (var i = 0; i < jobList.length; i++) {
					if(typeof(jobList[i])==undefined)
						continue;
					if (i > 0) {
						text += ("," + jobList[i].jobName);
					} else {
						text += jobList[i].jobName;
					}
				}
				return text;
			}
			return "";
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
						this.leaderPopEdit.popedit('disable');
					}
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
		newClick: function() {
			this.status = "NEW";
			this.statusChange();
		},
		editClick: function() {
			this.status = "EDIT";
			this.statusChange();
		},
		okClick: function() {
			if (this.detailForm.isValid()) {
				var formData = this.detailForm.form("value");
				var jobIdList = [];
				if (formData.job) {
					for (var i = 0; i < formData.job.length; i++) {
						jobIdList[jobIdList.length] = formData.job[i].jobId;
					}
				}
				var org = {
					orgName: formData.orgName,
					areaId: formData.area.areaId,
					orgCode: formData.orgCode,
					orgType: formData.orgType,
					jobIdList: jobIdList
				};
				var current = this.orgTree.grid("getSelection");
				var formValue = this.detailForm.form("value");
				if (this.status == "NEW") {
					org.parentOrgId = current.orgId;
					org.attrData = new Array();
					for(var i = 0;i < this.$(".org-attr-list input").length; i++)
					{
						if(this.$(".org-attr-list input")[i].name !== ""){
							var attr = {};
							attr.attrId = $(".org-attr-list input")[i].name;
							attr.attrValue = formValue[$(".org-attr-list input")[i].name];
							org.attrData.push(attr);
						}
					}
					staffOrgAction.addOrg(org, function(data) {
						var parent = this.orgTree.grid("getSelection");
						this.orgTree.grid("addChildNodes", [data], parent);
						this.orgTree.grid("setSelection", data.orgId);
						this.status = null;
						this.statusChange();
						fish.success(i18nStaffOrg.STAFFORG_ORG_ADD_SUCCESS);
					}.bind(this));
				} else if (this.status == "EDIT") {
					org.parentOrgId = current.parentOrgId;
					org.orgId = current.orgId;
					org.leader = formData.leader;					
					org.state = current.state;
					org.orgType = formData.orgType;
					org.attrData = new Array();
					for(var i = 0;i < this.$(".org-attr-list input").length; i++)
					{
						if(this.$(".org-attr-list input")[i].name !== ""){
							var attr = {};
							attr.attrId = $(".org-attr-list input")[i].name;
							attr.attrValue = formValue[$(".org-attr-list input")[i].name];
							org.attrData.push(attr);
						}
					}
					staffOrgAction.modOrg(org, function(data) {
						// data.LEADER_STAFF_NAME = this.detailForm.find("[name='LEADER']").val();
						this.orgTree.grid("setRowData", org);
						this.status = null;
						this.statusChange();
						fish.success(i18nStaffOrg.STAFFORG_ORG_MODIFY_SUCCESS);
					}.bind(this));
				}
			}
		},

		cancelClick: function() {
			this.status = null;
			this.detailForm.form('clear');
			this.rowSelectCallback();
			this.statusChange();
			this.detailForm.resetValid();
		},
		
		expandRowCommon: function(rowdata) {
			//var rowdata = this.orgTree.grid('getSelection');
			var that = this;
		    that.orgTree.grid("setSelection", rowdata);
            if (!rowdata.loaded) { 
            	if(!isNaN(rowdata.orgId)) 
				{ 
            		staffOrgAction.queryOrgListByParentId(rowdata.orgId, function(data) {
	                    var orgList = data || [];
	                    var rows = [];
	                    if (orgList.length > 0) {
	                        fish.forEach(orgList, function(org) {
	                        	org.children = []; 
	                            rows[rows.length] = org;
	                        }.bind(that));
	                        this.orgTree.grid("addChildNodes", rows, rowdata); 
	                    }
	                }.bind(that));
	                rowdata.loaded = true;
				}
				else
				{
					fish.info(i18nStaffOrg.STAFFORG_ORG_NEW_ERROR);
				}                
            }
		}
	});
});
