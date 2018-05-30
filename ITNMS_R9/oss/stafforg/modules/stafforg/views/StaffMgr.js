define([
	"text!stafforg/modules/stafforg/templates/StaffUnderOrg.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"modules/common/actions/CommonAction",
	"text!stafforg/modules/stafforg/templates/StaffGridTitlebarEdit.html",
	"text!stafforg/modules/stafforg/templates/StaffGridRowEdit.html",
	"text!stafforg/modules/stafforg/templates/StaffGridBottomEdit.html",
	'webroot'
], function(staffUnderOrgTemplate, staffOrgAction, i18nStaffOrg, commonAction, staffGridTitlebarEditTemplate, staffGridEditTemplate, bottomEditTemplate, webroot) {
	return portal.BaseView.extend({

		template: fish.compile(staffUnderOrgTemplate),
		titlebarEditTemplate: fish.compile(staffGridTitlebarEditTemplate),
		rowEditTemplate: fish.compile(staffGridEditTemplate),
		bottomEditTemplate: fish.compile(bottomEditTemplate),

		events: {
			"change .js-show-all-staff": "qryStaffByOrg",
			"change .js-check-batch": "buttonsVisibleChange",
			"click .js-new": "newClick",
			"click .js-edit": "editClick",
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick",
			"click .js-btn-org-change-his": "orgChangeHisClick",
			"click .js-btn-job-mgr": "jobMgrClick",
			"click .js-btn-staff-reliation": "staffRelationMgrClick",
			"click .js-btn-batch-disable": "disableStaffBatchClick",
			"click .js-btn-batch-enable": "enableStaffBatchClick",
			"click .js-btn-batch-add-jobs": "staffBatchAddJob",
			"click .js-btn-batch-join-org": "addToOrgBatchClick",
			"click .js-btn-org-export": "staffExportClick"
		},

		initialize: function() {
			this.staffStates = {
				"A": i18nStaffOrg.COMMON_ACTIVE,
				"X": i18nStaffOrg.COMMON_INACTIVE
			};
		},

		render: function() {
			this.setElement(this.template(i18nStaffOrg));
//			this.$el.html(this.template(i18nStaffOrg));
			this.titlebarEditHtml = this.titlebarEditTemplate(i18nStaffOrg);
			this.bottomEditHtml = this.bottomEditTemplate(i18nStaffOrg);

			this.newBtn = this.$(".js-new");
			this.editBtn = this.$(".js-edit");
			this.okBtn = this.$(".js-ok");
			this.cancelBtn = this.$(".js-cancel");
			this.checkAddUser = this.$(".js-add-user");
			this.spanAddUser = this.$(".js-add-user-label");

			this.on("orgChange", this.orgChange, this);
		},

		afterRender: function(contentHeight) { //dom加载完成的事件
			
			this.staffGrid = this.$(".js-staff-grid").grid({
				// height:320,
				searchbar: true,
				colModel: [{
					name: 'staffId',
					key: true,
					hidden: true
				}, {
					name: 'staffName',
					label: i18nStaffOrg.STAFFORG_STAFF_NAME,
					width: "15%",
					sortable: false,
					search: true
				}, {
					name: "staffCode",
					label: i18nStaffOrg.STAFFORG_STAFF_CODE,
					width: "15%",
					sortable: false,
					search: true
				}, {
					name: "phone",
					label: i18nStaffOrg.STAFFORG_STAFF_PHONE,
					width: "15%",
					sortable: false,
					search: true
				}, {
					name: "email",
					label: i18nStaffOrg.STAFFORG_STAFF_EMAIL,
					width: "25%",
					sortable: false,
					search: true
				}, {
					name: "state",
					label: i18nStaffOrg.COMMON_STATE,
					width: "10%",
					sortable: false,
					formatter: function(cellValue, rowId, rowData) {
						return this.staffStates[cellValue];
					}.bind(this)
				}, {
					name: "options",
					label: '',
					//width: 600,
					exportable: false,
					width: "20%",
					sortable: false,
					align: 'center',
					formatter: function(cellValue, rowId, rowData) {
						i18nStaffOrg.STATE = rowData.state;
						return this.rowEditTemplate(i18nStaffOrg);
					}.bind(this)
				}],
				// toolbar: [true, 'bottom'],
				pagebar: true,
				onSelectRow: this.rowSelect.bind(this),
				onChangeRow: this.changeRow.bind(this),
				multiselect: true,
				onSelectAll: this.buttonsVisibleChange.bind(this),
				create: function() {
					var $grid = this.$(".js-staff-grid");
					var content = this.bottomEditHtml;
					var grid_id = $grid.attr("id");
					var $td = $grid.find("#" + grid_id + "_pager_right");
					$td.append(content);
					this.checkBatch = this.$(".js-check-batch", $td);
					//显示所有员工
					var $titlebar = $grid.find('.ui-jqgrid-titlebar');
					var checkboxContent = this.titlebarEditHtml;
					$titlebar.append(checkboxContent);
					this.showAllStaffCheck = this.$(".js-show-all-staff");

				}.bind(this)
			});
			this.staffGrid.grid("navButtonAdd",[{
                caption: i18nStaffOrg.COMMON_EXPORT,
                cssprop: "js-btn-org-export"
            },{
                caption: i18nStaffOrg.STAFFORG_JOB_MGR,
                cssprop: "js-btn-job-mgr"
            },{	
                caption: i18nStaffOrg.STAFFORG_STAFF_RELATION,
                cssprop: "js-btn-staff-reliation"
            },{
                caption: i18nStaffOrg.STAFFORG_STAFF_ORG_CHANGE_HIS,
                cssprop: "js-btn-org-change-his"          
            },{ //需更名为widget
                caption: i18nStaffOrg.STAFFORG_STAFF_BATCH_ENABLE,
                cssprop: "js-btn-batch-enable"
            },{
                caption: i18nStaffOrg.STAFFORG_STAFF_BATCH_DISABLE,
                cssprop: "js-btn-batch-disable"
            },{
                caption: i18nStaffOrg.STAFFORG_STAFF_BATCH_ADD_JOB,
                cssprop: "js-btn-batch-add-jobs"
            },{
                caption: i18nStaffOrg.STAFFORG_STAFF_BATCH_JOIN_ORG,
                cssprop: "js-btn-batch-join-org"
            }]);			

			/*this.$(".js-searchbar").searchbar({
				target: this.staffGrid
			});*/
			
			//查看员工是否必须有email的配置
			commonAction.qryUserHasEmail(function(data) {
				var mustHasEmail = false;
				if (data) {
					mustHasEmail = (data + "").toLocaleUpperCase() == "TRUE";
				}
				this.staffMustHasEmail = mustHasEmail;
				if (mustHasEmail) {
					this.$(".js-email-div").addClass("required");
					this.$(".js-email").attr("data-rule", i18nStaffOrg.STAFFORG_STAFF_EMAIL + ":required;email;length[1~125]");
				} else {
					this.$(".js-email").attr("data-rule", "email;length[0~125]");
				}
			}.bind(this));

            this.detailForm = this.$(".js-staff-detail-form").form().form("disable");

            staffOrgAction.initStaffAttrWithLinkageFormItem(function(status) {
			    var json = status;
			    require([webroot+"frm/portal/PropertyList"], function() {
                    this.$(".staff-attr-list").propertylist({
                        data: json,
                        colCssp: "col-md-6 col-sm-6",
                        labelCssp: "col-md-4 col-sm-4",
                        elCssp: "col-md-8 col-sm-8"
                    });
                    this.detailForm.form().form("disable");
                }.bind(this));
			}.bind(this));
			this.detailForm.form().slimscroll({height: 150});
            this.detailForm.validator({
				rules: {
					userCode: function(element, param, field) {
						var hasUpperCase = /[A-Z]/.test(element.value);
						var hasLowerCase = /[a-z]/.test(element.value);
						var hasDigistChar = /[0-9]/.test(element.value);
						switch (this.userCodeComposition) {
							case "1":
							case "3":
								if (!hasDigistChar && !(hasLowerCase || hasUpperCase)) {
									return i18nStaffOrg.STAFFORG_USER_CODE_CONTAINS_NUMBER_OR_CHAR;
								}
								break;
							case "2":
							case "4":
								if (!hasDigistChar || !(hasLowerCase || hasUpperCase)) {
									return i18nStaffOrg.STAFFORG_USER_CODE_CONTAINS_NUMBER_AND_CHAR;
								}
								break;
						}
						return true;
					}.bind(this)
				}
			});
			//查看相应的安全等级信息
			commonAction.qrySecurityLevel(function(data) {
				var securityLevel = data;
				commonAction.qrySecurityRuleByLevelCode(securityLevel, function(data) {
					if (data && data.USER_CODE_COMPOSITION) {
						this.userCodeMinLength = data.USER_CODE_MIN_LENGTH;
						this.userCodeMaxLength = data.USER_CODE_MAX_LENGTH;
						this.userCodeComposition = data.USER_CODE_COMPOSITION;
						this.detailForm.validator("setField", "USER_CODE", i18nStaffOrg.COMMON_USER_CODE + ':required;length[' + this.userCodeMinLength + '~' + this.userCodeMaxLength + '];userCode');
					} else {
						this.detailForm.validator("setField", "USER_CODE", i18nStaffOrg.COMMON_USER_CODE + ':required;length[0~60]');
					}
				}.bind(this));
			}.bind(this));
			//查看SSO模式相关信息
			this.isSso = portal.appGlobal.get('ssoMode');
			
			this.buttonsVisibleChange(); //修改表格下面一堆按钮的状态信息
			this.statusChange(); //修改初始的按钮的状态
			
		},

		orgChange: function(org) {
			this.org = org;
			this.qryStaffByOrg();
		},

		qryStaffByOrg: function() {
			if (this.org) {
				if (this.showAllStaffCheck.prop("checked")) {
					staffOrgAction.queryAllStaffByOrgId(this.org.orgId, function(data) {
						this.qryCallBack(data);
					}.bind(this));
				} else {
					staffOrgAction.queryStaffByOrgId(this.org.orgId, function(data) {
						this.qryCallBack(data);
					}.bind(this));
				}
			}
		},
		qryCallBack: function(data) {
			var staffs = null;
			if (data && data.length > 0) {
				staffs = data;
			} else {
				staffs = [];
			}
			this.staffGrid.grid("reloadData", staffs);
			if (staffs.length > 0) {
				this.staffGrid.grid("setSelection", staffs[0]); //选择第一条记录
			} else {
				this.detailForm.form("clear");
				this.statusChange();
			}
			this.buttonsVisibleChange();
		},

		staffExportClick: function(){
			var param = {};
			if (this.showAllStaffCheck.prop("checked")) {
				param.orgId = this.org.orgId;
			} else {
				param.orgId = this.org.orgId;
				param.state = 'A';
			}
			this.staffGrid.grid("exportDataAysn",{
    		    serviceParam:param,
    		    url : 'stafforg/orgs/staffs/export',
    		    fileName : "staffs"
			});
		},

		rowSelect: function(ee, rowid, state) { //选中行
			var that = this;
			var e = ee && ee.originalEvent || (void 0);
			var rowData = that.staffGrid.grid("getSelection");
			if(!$.isEmptyObject(rowData)){
				//更新attr组件的值
				staffOrgAction.qryAttrDataByStaffId(rowData.staffId,function(result) {				
					if(result){
						var attrList = result;
						for(var j = 0; j < attrList.length; j++){
							var tempValue = attrList[j].attrValue;
                            if (tempValue.indexOf("|") > 0) {
                                rowData[attrList[j].attrId] = tempValue.split('|');
                            }else{
                                rowData[attrList[j].attrId] = tempValue;
                            }
						}
						that.detailForm.form("clear");
						that.detailForm.form("value", rowData);
						that.buttonsVisibleChange();
						if (e && e.target) {
							var action = $(e.target).attr("action");
							switch (action) {
								case "disable":
									that.disableStaffClick(rowData);
									break;
								case "enable":
									that.enableStaffClick(rowData);
									break;
								case "staffHis":
									that.staffHisClick(rowData);
									break;
								case "quitFormOrg":
									that.quitFormOrgClick(rowData);
									break;
								case "addToOrg":
									that.addToOrgClick(rowData);
									break;
							}
						}
					}					
				}.bind(that));
			}	
		},

		disableStaffClick: function(staffData) { //disable员工按钮按下去的相关事件
			fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_DISABLE_STAFF,function() {
				if(staffData.userCode){
					var delTypeResource = {
						TITLE: i18nStaffOrg.STAFFORG_OPERATE_TYPE,
						SEL_LABEL: i18nStaffOrg.STAFFORG_OPERATE_TYPE
					},
						delTypeDataSource = [{
						text: i18nStaffOrg.STAFFORG_DISABLE_STAFF_TOO,
						value: "1"
					}, {
						text: i18nStaffOrg.STAFFORG_JUST_DISABLE_STAFF,
						value: "0"
					}],
						delTypeOptions = {
						resource: delTypeResource,
						mustSelOne: true,
						dataSource: delTypeDataSource
					};
					fish.popupView({
						url: "modules/common/views/PopOneSelectorView",
						viewOption: {
							resource: delTypeResource,
							mustSelOne: true,
							dataSource: delTypeDataSource
						},
						close: function(msg) {
							if (msg === '0') {
								this.disableStaff(staffData.staffId, false);
							} else if (msg === '1') {
								this.disableStaff(staffData.staffId, true);
							}
						}.bind(this)
					});
				} else {
					this.disableStaff(staffData.staffId, false);
				}
			}.bind(this), $.noop);
		},

		disableStaff: function(staffId, operateUser) {
			staffOrgAction.disableStaff(staffId, operateUser, function(data) {
				var selrow = this.staffGrid.grid("getSelection");
				if (this.showAllStaffCheck.prop("checked")) {
					selrow.state = "X";
					selrow.options = "1";
					this.staffGrid.grid("setRowData", selrow);
				} else {
					this.staffGrid.grid('setNextSelection', selrow, true).grid("delRowData", selrow);
					if ($.isEmptyObject(this.staffGrid.grid("getSelection"))) {
						this.detailForm.form("clear");
						this.status == null;
						this.statusChange();
					}
				}
				fish.success(i18nStaffOrg.STAFFORG_DISABLE_STAFF_SUCCESS);
			}.bind(this));
		},

		disableStaffBatch: function(rowdata, operuser) {
			// var pickedRowdata = []
			// fish.forEach(rowdata, function(data){
			// 	var pickedData = fish.pick(data, "staffId");
			// 	pickedRowdata.push(pickedData);
			// });
			staffOrgAction.disableStaffBatch(rowdata, operuser, function(status) {
				// var staffList = status || [];
				if (this.showAllStaffCheck.prop("checked")) {
					fish.forEach(rowdata, function(staff) {
						staff.state = "X";
						staff.options = "1";
						this.staffGrid.grid("setRowData", staff);
					}, this);
					this.staffGrid.grid("setCheckRows",
						fish.pluck(rowdata, 'staffId'), false);
				} else {
					fish.forEach(rowdata, function(staff) {
						this.staffGrid.grid("delRowData", staff);
					}, this);
					if ($.isEmptyObject(this.staffGrid.grid("getSelection"))) {
						this.detailForm.form("clear");
						this.status == null;
						this.statusChange();
					}
				}
				fish.success(i18nStaffOrg.STAFFORG_DISABLE_STAFF_SUCCESS);
			}.bind(this));
		},

		disableStaffBatchClick: function(e) {
			var that = this;
			var rowdata = that.staffGrid.grid("getCheckRows");
			fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_DISABLE_STAFF,function() {
					var delTypeResource = {
						TITLE: i18nStaffOrg.STAFFORG_OPERATE_TYPE,
						SEL_LABEL: i18nStaffOrg.STAFFORG_OPERATE_TYPE
					},
						delTypeDataSource = [{
						text: i18nStaffOrg.STAFFORG_DISABLE_STAFF_TOO,
						value: "1"
					}, {
						text: i18nStaffOrg.STAFFORG_JUST_DISABLE_STAFF,
						value: "0"
					}];
					fish.popupView({
						url: "modules/common/views/PopOneSelectorView",
						viewOption: {
							resource: delTypeResource,
							mustSelOne: true,
							dataSource: delTypeDataSource
						},
						close: function(msg) {
							if (msg === '1') {
								that.disableStaffBatch(rowdata, true);
							} else if (msg === '0') {
								that.disableStaffBatch(rowdata, false);
							}
							that.disableBtn(that.$(".js-btn-batch-disable"));
							that.disableBtn(that.$(".js-btn-batch-enable"));
							that.disableBtn(that.$(".js-btn-batch-add-jobs"));
							that.disableBtn(that.$(".js-btn-batch-join-org"));
						}
					});
				}, $.noop);
		},

		enableStaffClick: function(staffData) { //disable员工按钮按下去的相关事件
			fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_ENABLE_STAFF,function() {
				if(staffData.userCode){
					var enableTypeResource = {
						TITLE: i18nStaffOrg.STAFFORG_OPERATE_TYPE,
						SEL_LABEL: i18nStaffOrg.STAFFORG_OPERATE_TYPE
					};
					var	enableTypeDataSource = [{
						text: i18nStaffOrg.STAFFORG_ENABLE_STAFF_TOO,
						value: "1"
					}, {
						text: i18nStaffOrg.STAFFORG_JUST_ENABLE_STAFF,
						value: "0"
					}];
					fish.popupView({
						url: "modules/common/views/PopOneSelectorView",
						viewOption: {
							resource: enableTypeResource,
							mustSelOne: true,
							dataSource: enableTypeDataSource
						},
						close: function(msg) {
							if (msg === '1') {
								this.enableStaff(staffData.staffId, true);
							} else if (msg === '0') {
								this.enableStaff(staffData.staffId, false);
							}
						}.bind(this)
					});
				} else {
					this.enableStaff(staffData.staffId, false);
				}
			}.bind(this), $.noop);
		},

		enableStaff: function(staffId, operateUser) {
			staffOrgAction.enableStaff(staffId, operateUser, function(data) {
				var selrow = this.staffGrid.grid("getSelection");
				if (this.showAllStaffCheck.prop("checked")) {
					selrow.state = "A";
					selrow.options = '1';
					this.staffGrid.grid("setRowData", selrow);
				}
				this.staffGrid.grid("setCheckRows", selrow.staffId, false);
				fish.success(i18nStaffOrg.STAFFORG_ENABLE_STAFF_SUCCESS);
			}.bind(this));
		},

		enableStaffBatch: function(rowdata, operuser) {	
			// var pickedRowdata = []
			// fish.forEach(rowdata, function(data){
			// 	var pickedData = fish.pick(data, "staffId");
			// 	pickedRowdata.push(pickedData);
			// });		
			staffOrgAction.enableStaffBatch(rowdata, operuser, function(status) {
				// var staffList = status || [];
				if (this.showAllStaffCheck.prop("checked")) {
					fish.forEach(rowdata, function(staff) {
						staff.state = "A";
						staff.options = '1';
						this.staffGrid.grid("setRowData", staff);
					}, this);
				}
				this.staffGrid.grid("setCheckRows",
					fish.pluck(rowdata, 'staffId'), false);
				fish.success(i18nStaffOrg.STAFFORG_ENABLE_STAFF_SUCCESS);
			}.bind(this));
		},

		enableStaffBatchClick: function(e) {
			var that = this;
			var rowdata = that.staffGrid.grid("getCheckRows");
			fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_ENABLE_STAFF,function() {
					var enableTypeResource = {
						TITLE: i18nStaffOrg.STAFFORG_OPERATE_TYPE,
						SEL_LABEL: i18nStaffOrg.STAFFORG_OPERATE_TYPE
					},
						enableTypeDataSource = [{
						text: i18nStaffOrg.STAFFORG_ENABLE_STAFF_TOO,
						value: "1"
					}, {
						text: i18nStaffOrg.STAFFORG_JUST_ENABLE_STAFF,
						value: "0"
					}];
					fish.popupView({
						url: "modules/common/views/PopOneSelectorView",
						viewOption: {
							resource: enableTypeResource,
							mustSelOne: true,
							dataSource: enableTypeDataSource
						},
						close: function(msg) {
							if (msg === '1') {
								that.enableStaffBatch(rowdata, true);
							} else if (msg === '0') {
								that.enableStaffBatch(rowdata, false);
							}
							that.disableBtn(that.$(".js-btn-batch-disable"));
							that.disableBtn(that.$(".js-btn-batch-enable"));
							that.disableBtn(that.$(".js-btn-batch-add-jobs"));
							that.disableBtn(that.$(".js-btn-batch-join-org"));
						}
					});
				}, $.noop);
		},

		staffHisClick: function(staffInfo) {
			fish.popupView({
				url: "stafforg/modules/stafforg/views/StaffOperateHisPopWin",
				viewOption: {
					staffId: staffInfo.staffId
				}
			});
		},

		addToOrgClick: function(selrow) { //添加到组织的按钮按下事件
			staffOrgAction.qryOrgListByStaffId(selrow.staffId, function(data) {
				var selectedOrgs = null;
				if (data && data.length > 0) {
					selectedOrgs = data;
				} else {
					selectedOrgs = [];
				}
				fish.popupView({
					url: "stafforg/modules/stafforg/views/OrgMultiSelPopWin",
					viewOption: {
						resource: i18nStaffOrg,
						selectedOrgs: selectedOrgs,
						model: new fish.Model({staffId: selrow.staffId})
					},
					close: function(msg) {
						var staffId = selrow.staffId;
						var orgIdList = new Array();
						for(var i in msg.addedOrgs){
							var org = {};
							org.orgId = msg.addedOrgs[i].orgId;
							orgIdList.push(org);
						}
						staffOrgAction.addStaffToOrgs(staffId,
							orgIdList,
							msg.newDefaultOrgId
						, function(status) {
							fish.success(i18nStaffOrg.STAFFORG_ADD_STAFF_TO_ORGS_SUCCESS);
						}.bind(this));
					}.bind(this)
				});
			}.bind(this));
		},

		addToOrgBatchClick: function(e) {
			var that = this;
			var rowdata = that.staffGrid.grid("getCheckRows");
			fish.popupView({
				url: "stafforg/modules/stafforg/views/OrgBatchMultiSelPopWin",
				viewOption: {
					resource: i18nStaffOrg,
					selectedOrgs: []
				},
				close: function(msg) {
					var staffList = rowdata,
						orgList = msg.ADDED_ORGS || [],
						orgIdList = fish.pluck(orgList, 'orgId');
					// var pickedStaffList = [];
					// fish.forEach(staffList, function(staff){
					// 	var pickedStaff = fish.pick(staff, "staffId", "spId");
					// 	pickedStaffList.push(pickedStaff);
					// });
					staffOrgAction.addStaffToOrgsBatch(staffList, orgIdList, function(status) {
						var staffIdList = fish.pluck(staffList, 'staffId');
						that.staffGrid.grid("setCheckRows", staffIdList, false);
						fish.success(i18nStaffOrg.STAFFORG_ADD_STAFF_TO_ORGS_SUCCESS);
						that.disableBtn(that.$(".js-btn-batch-disable"));
						that.disableBtn(that.$(".js-btn-batch-enable"));
						that.disableBtn(that.$(".js-btn-batch-add-jobs"));
						that.disableBtn(that.$(".js-btn-batch-join-org"));
					});
				}
			});
		},

		quitFormOrgClick: function(staffInfo) {
			fish.confirm(i18nStaffOrg.STAFFORG_SURE_TO_QUIT_FROM_ORG,function() {
					staffOrgAction.qryOrgListByStaffId(staffInfo.staffId, function(count) {
						if (count && count.length <= 1) {
							fish.warn(i18nStaffOrg.STAFFORG_STAFF_QUIT_ONLY_ORG);
						} else {
							staffOrgAction.qryStaffDefaultOrg(staffInfo.staffId, function(status) {
								var defaultOrg = status && status[0];
								if (defaultOrg && defaultOrg.orgId == staffInfo.staffId) {
									fish.warn(i18nStaffOrg.STAFFORG_STAFF_QUIT_DEFAULT);
								} else {
									staffOrgAction.qryStaffJobCountInOrg(staffInfo.staffId, this.org.orgId, function(data) {
										if (data && data.length > 0) {
											fish.warn(i18nStaffOrg.STAFFORG_STAFF_QUIT_HAS_STAFF_JOB_IN_ORG);
										} else {
											staffOrgAction.delStaffFromOrg(staffInfo.staffId, this.org.orgId, function(result) {
												this.staffGrid.grid('setNextSelection', staffInfo, true).grid("delRowData", staffInfo);
												if ($.isEmptyObject(this.staffGrid.grid("getSelection"))) {
													this.detailForm.form("clear");
													this.status == null;
													this.statusChange();
												}
												fish.success(i18nStaffOrg.STAFFORG_REMOVE_STAFF_FROM_ORG_SUCCESS);
											}.bind(this));
										}
									}.bind(this));
								}
							}.bind(this));
						}
					}.bind(this));
				}.bind(this), $.noop);
		},

		orgChangeHisClick: function() { //用户组织变化的历史按钮按下
			var staffInfo = this.staffGrid.grid("getSelection");
			fish.popupView({
				url: "stafforg/modules/stafforg/views/StaffOrgChangeHisPopWin",
				viewOption: {
					staffId: staffInfo.staffId
				}
			});
		},

		jobMgrClick: function() {
			var that = this;
			var staff = that.staffGrid.grid("getSelection");
			if (!staff || !staff.staffId) {
				return;
			}
			fish.popupView({
				url: "stafforg/modules/stafforg/views/StaffJobManagerPopWin",
				viewOption: {
					STAFF: staff
				}
			});
		},

		staffBatchAddJob: function(e) {
			var that = this,
				$grid = this.staffGrid,
				rowdata = $grid.grid("getCheckRows");
			fish.popupView({
				url: "stafforg/modules/stafforg/views/JobSelInOrgPopWin",
				viewOption: {
					ORG: that.org
				},
				close: function(msg) {
					var jobList = msg,
						staffList = rowdata;
					fish.forEach(jobList, function(job) {
//					job.STATE_DATE = new Date(job.STATE_DATE)
//						.format("yyyy-MM-dd hh:mm:ss");
						job.stateDate = fish.dateutil.format(fish.dateutil.parse(job.stateDate,fish.config.get("dateParseFormat.datetime")),fish.config.get("dateParseFormat.datetime"));
					});
					// var pickedList = [];
					// fish.forEach(staffList, function(staff){
					// 	var pickedStaff = fish.pick(staff, "staffOrgId");
					// 	pickedList.push(pickedStaff);
					// });
					staffOrgAction.addJobsToStaffBatch(staffList, jobList, function(status) {
						//deselect
						$grid.grid("setCheckRows", fish.pluck(staffList, "staffId"), false);
						fish.success(i18nStaffOrg.STAFFORG_BATCH_ADD_JOBS_SUCCESS);
						that.disableBtn(that.$(".js-btn-batch-disable"));
						that.disableBtn(that.$(".js-btn-batch-enable"));
						that.disableBtn(that.$(".js-btn-batch-add-jobs"));
						that.disableBtn(that.$(".js-btn-batch-join-org"));
					});
				}
			});
		},

		staffRelationMgrClick: function() {
			var staffInfo = this.staffGrid.grid("getSelection");
			fish.popupView({
				url: "stafforg/modules/stafforg/views/StaffRelaMgrPopWin",
				viewOption: {
					STAFF: staffInfo
				}
			});
		},

		changeRow: function(e, rowid, oldRowId, state) { //选中的行改变
			this.status = null;
			this.statusChange();
		},
		newClick: function() {
			this.status = "NEW";
			this.checkAddUser.prop("checked", true);
			this.statusChange();
		},
		editClick: function() {
			this.status = "EDIT";
			this.statusChange();
		},
		okClick: function() {
			if (this.detailForm.isValid()) {
				if (this.status === "NEW") {
					this.newStaff();
				} else if (this.status === "EDIT") {
					this.editStaff();
				}
			}
		},
		cancelClick: function() {
			this.status = null;
			this.rowSelect();
			this.statusChange();
		},

		newStaff: function() {
			if (this.org) {
				var staff = this.detailForm.form("value");
				if (this.checkAddUser.prop("checked")) { //如果同时增加用户
					staff.needAddUser = "true";
				}
				staff.orgId = this.org.orgId;
				staff.attrData = new Array();
				for(var i = 0;i < this.$(".staff-attr-list input").length; i++)
				{
					if(this.$(".staff-attr-list input")[i].name !== ""){
						var attr = {};
						attr.attrId = $(".staff-attr-list input")[i].name;
						attr.attrValue = staff[$(".staff-attr-list input")[i].name];
						staff.attrData.push(attr);
					}
				}
				staffOrgAction.addStaff(staff, function(data) {
					this.staffGrid.grid("addRowData", data);
					this.staffGrid.grid("setSelection", data.STAFF_ID);
					this.status = null;
					this.statusChange();
					fish.success(i18nStaffOrg.STAFFORG_ADD_SUCCESS);
				}.bind(this));
			} else {
				fish.warn(i18nStaffOrg.STAFFORG_STAFF_ADD_NO_ORG);
			}
		},

		editStaff: function() {
			var staff = this.detailForm.form("getValue", false);
			var oldStaff = this.staffGrid.grid("getSelection");
			staff.orgId = oldStaff.orgId;
			staff.staffId = oldStaff.staffId;
			staff.staffOrgId = oldStaff.staffOrgId;
			staff.attrData = new Array();
			for(var i = 0;i < this.$(".staff-attr-list input").length; i++)
			{
				if(this.$(".staff-attr-list input")[i].name !== ""){
					var attr = {};
					attr.attrId = $(".staff-attr-list input")[i].name;
					attr.attrValue = staff[$(".staff-attr-list input")[i].name];
					staff.attrData.push(attr);
				}
			}
            for(var i = 0;i < this.$(".staff-attr-list select").length; i++)
            {
                if(this.$(".staff-attr-list select")[i].name !== ""){
                    var attr = {};
                    attr.attrId = $(".staff-attr-list select")[i].name;
                    attr.attrValue = $(".staff-attr-list select[name=" + attr.attrId + "]").multiselect('value').join('|')
                    staff.attrData.push(attr);
                }
            }
			staffOrgAction.modStaff(staff, function(data) {
				this.staffGrid.grid("setRowData", staff);
				this.status = null;
				this.statusChange();
				fish.success(i18nStaffOrg.STAFFORG_MOD_SUCCESS);
			}.bind(this));
		},

		statusChange: function() {
			if (this.status && (this.status == "NEW" || this.status == "EDIT")) {
				this.newBtn.hide();
				this.editBtn.hide();
				this.okBtn.show();
				this.cancelBtn.show();
				this.detailForm.form("enable");
				if (this.status == "NEW") {
					this.checkAddUser.show();
					this.spanAddUser.show();
					this.detailForm.form("clear");
				}
				if (this.status == "EDIT") {
					this.checkAddUser.hide();
					this.spanAddUser.hide();
                    this.$(".js-user-code").attr("disabled", true);
				}
			} else {
				this.newBtn.show();
				this.editBtn.show();
				this.okBtn.hide();
				this.cancelBtn.hide();
				this.checkAddUser.hide();
				this.spanAddUser.hide();
				this.detailForm.form("disable");
				this.detailForm.resetValid();
				if ($.isEmptyObject(this.staffGrid.grid("getSelection"))) {
					this.editBtn.hide();
				} else {
					this.editBtn.show();
				}
			}
		},
		hideNoBatchBtns: function() {
			this.$(".js-btn-job-mgr").addClass('hidden');
			this.$(".js-btn-org-change-his").addClass('hidden');
			this.$(".js-btn-staff-reliation").addClass('hidden');
			this.$(".js-btn-org-export").addClass('hidden');
		},

		showNoBatchBtns: function() {
			this.$(".js-btn-job-mgr").removeClass('hidden');
			this.$(".js-btn-org-change-his").removeClass('hidden');
			this.$(".js-btn-staff-reliation").removeClass('hidden');
			this.$(".js-btn-org-export").removeClass('hidden');
		},

		hideBatchBtns: function() {		
			this.$(".js-btn-batch-disable").addClass('hidden');
			this.$(".js-btn-batch-enable").addClass('hidden');
			this.$(".js-btn-batch-add-jobs").addClass('hidden');
			this.$(".js-btn-batch-join-org").addClass('hidden');
		},

		showBatchBtns: function() {
			this.$(".js-btn-batch-disable").removeClass('hidden');
			this.$(".js-btn-batch-enable").removeClass('hidden');
			this.$(".js-btn-batch-add-jobs").removeClass('hidden');
			this.$(".js-btn-batch-join-org").removeClass('hidden');
			this.disableBtn(this.$(".js-btn-batch-disable"));
			this.disableBtn(this.$(".js-btn-batch-enable"));
			this.disableBtn(this.$(".js-btn-batch-add-jobs"));
			this.disableBtn(this.$(".js-btn-batch-join-org"));
		},

		enableBtn: function($btn) {
			$btn.prop("disabled", false);
		},

		disableBtn: function($btn) {
			$btn.prop("disabled", true);
		},

		buttonsVisibleChange: function() { //按钮的可见状态改变事件	
			this.hideNoBatchBtns();
			this.hideBatchBtns();

			var batchOperate = this.checkBatch.prop("checked");
			if (batchOperate) {
				var parentWidth = this.staffGrid.parent().innerWidth();
				this.staffGrid.grid('showCol', 'cb').grid('setGridWidth', parentWidth);
				this.showBatchBtns();

				var checkedRows = this.staffGrid.grid("getCheckRows"); //获取所有选中的行
				var selectedStaffAllEnabled = true; //只要有一条记录是X，则表明有启用状态的用户
				for (var i = 0; i < checkedRows.length; i++) {
					if (checkedRows[i].state == "X") {
						selectedStaffAllEnabled = false; //不是所有的都是Enabled的
						break;
					}
				}
				var selectedStaffAllDisabled = true; //所有的都是Disabled的情况
				for (var i = 0; i < checkedRows.length; i++) {
					if (checkedRows[i].state == "A") {
						selectedStaffAllDisabled = false;
						break;
					}
				}
				if (checkedRows && checkedRows.length > 0) {
					if (selectedStaffAllEnabled) {
						this.enableBtn(this.$(".js-btn-batch-disable"));
						this.enableBtn(this.$(".js-btn-batch-join-org"));
						this.enableBtn(this.$(".js-btn-batch-add-jobs"));
					} else if (selectedStaffAllDisabled) {
						this.enableBtn(this.$(".js-btn-batch-enable"));
					}
				}
			} else {
				this.staffGrid.grid('hideCol', 'cb');
				var selection = this.staffGrid.grid("getSelection");
				if (!$.isEmptyObject(selection) && selection.state == "A") {
					this.showNoBatchBtns();
				}
			}
			this.staffGrid.grid('navButtonRefresh');
		}
	});
});
