/**
 * Title: JobMgr.js
 * Description: Job Management View
 * Author: wu.yangjin
 * Created Date: 15-5-14 上午11:01
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!stafforg/modules/jobmgr/templates/JobMgr.html',
	'stafforg/modules/jobmgr/actions/JobMgrAction',
	'i18n!stafforg/modules/jobmgr/i18n/jobmgr'
], function(jobMgrTpl, JobMgrAction, i18nJobMgr) {
	return portal.BaseView.extend({
		i18nData: fish.extend({}, i18nJobMgr),

		template: fish.compile(jobMgrTpl),

		events: {
			"click .js-jrt-grid .js-add": 'addJobRole',
			"click #tabs-active-jobs .grid .inline-disable": 'disableJob',
			"click #tabs-inactive-jobs .grid .inline-enable": 'enableJob'
		},

		initialize: function() {
		},

		render: function() {
			this.$el.html(this.template(i18nJobMgr));
            return this;
		},

		afterRender: function() {
			var $grid = this.$(".js-jrt-grid");

			$grid.grid({
				colModel: [{
					name: 'roleId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'roleName',
					label: i18nJobMgr.JOBMGR_ROLE_NAME,
					width: "20%",
					editable: true,
					search: true
				}, {
					name: 'roleCode',
					label: i18nJobMgr.JOBMGR_ROLE_CODE,
					width: "20%",
					search: true
				}, {
					name: 'isLockedStr',
					label: i18nJobMgr.JOBMGR_IS_LOCKED,
					width: "10%",
					align: 'center'
				}, {
					name: 'comments',
					label: i18nJobMgr.JOBMGR_REMARKS,
					search: true,
					width: "40%"
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					width: "10%",
					formatter: 'actions',
					formatoptions: {
						editbutton: false,
						delbutton: true
					}
				}],
				// toolbar: [true, 'bottom'],
				pagebar: true,
				searchbar: true,
				caption: i18nJobMgr.JOBMGR_JOB_ROLE_TPL_MGR,
				beforeDeleteRow: function(e, rowid, rowdata) {
					JobMgrAction.qryUserInfoByJobId(this._jobdata.jobId,
						function(status) {
							var userList = status || [];
							if (userList.length > 0) {
								this.remRoleFromJobAndUsers(userList, rowdata);
							} else {
								fish.confirm(i18nJobMgr.JOBMGR_DEL_ROLE_FROM_JOB_CONFIRM,function() {
										this.remRoleFromJob(rowdata);
									}.bind(this), $.noop);
							}
						}.bind(this)
					);
					return false;
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[{
                caption: i18nJobMgr.COMMON_ADD,
                cssprop: "js-add"
            }]);
			$grid.prev().children("div").searchbar({target: $grid});

			var jobActive = [];
			var jobInactive = [];
			this.$(".js-job-tab").tabs({
				//activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id'),
						$grid = this.$("#" + id + " .grid");
					this.$(".js-jrt-grid").grid("clearData");
					switch (id) {
						case "tabs-active-jobs":
							this._jobdata && jobInactive.push(this._jobdata);
							if ($grid.hasClass("ui-jqgrid")) {
								if (jobActive.length > 0) {
									$grid.grid("setSelection", jobActive.pop());
								}
							} else {
								this.initgridActive($grid);
								this.loadDataActive($grid);
							}
							break;
						case "tabs-inactive-jobs":
							this._jobdata && jobActive.push(this._jobdata);
							if ($grid.hasClass("ui-jqgrid")) {
								if (jobInactive.length > 0) {
									$grid.grid("setSelection", jobInactive.pop());
								}
							} else {
								this.initgridInactive($grid);
								this.loadDataInactive($grid);
							}
							break;
					}
				}.bind(this)
			});
		},

		remRoleFromJob: function(rowdata) {
			var $grid = this.$(".js-jrt-grid");
			JobMgrAction.delRoleFromJob(this._jobdata.jobId, rowdata.roleId,
				function(data) {
					this.seekBeforeRemRow($grid, rowdata);
					$grid.grid('delRowData', rowdata);
					fish.success(i18nJobMgr.JOBMGR_DEL_ROLE_FROM_JOB_SUCCESS);
				}.bind(this)
			);
		},

		remRoleFromJobAndUsers0: function(userList, rowdata) {
			var $grid = this.$(".js-jrt-grid");
			JobMgrAction.delRoleFromJobAndUsers(this._jobdata.jobId,
				rowdata.roleId,
				fish.pluck(userList, 'userId'),
				function(status) {
					this.seekBeforeRemRow($grid, rowdata);
					$grid.grid("delRowData", rowdata);
					fish.success(i18nJobMgr.JOBMGR_DEL_ROLE_FROM_JOB_USER_SUCCESS);
				}.bind(this)
			);
		},

		remRoleFromJobAndUsers: function(userList, rowdata) {
			fish.popupView({
				url: "stafforg/modules/jobmgr/views/RemType",
				close: function(msg) {
					switch (msg.remType) {
					case 'T':
						this.remRoleFromJob(rowdata);
						break;
					case 'U':
						fish.popupView({
							url: "stafforg/modules/jobmgr/views/UserSelPopWin",
							viewOption: {
								JOB: this._jobdata,
								OPER_ROLES: rowdata.roleName + ";",
								USER_INFO: userList
							},
							close: function(msg) {
								var userList = msg.USER_LIST;
								this.remRoleFromJobAndUsers0(userList, rowdata);
							}.bind(this)
						});
						break;
					default:
						break;
					}
				}.bind(this)
			});
		},

		initgridActive: function($grid, gridHeight) {
			$grid.grid({
			    // height: gridHeight,
				colModel: [{
					name: 'jobId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'jobName',
					label: i18nJobMgr.JOBMGR_JOB_NAME,
					editable: true,
					search: true,
					width: "50%",
					editrules: i18nJobMgr.JOBMGR_JOB_NAME + ":required;length[1~255, true]"
				}, {
					name: 'state',
					label: i18nJobMgr.JOBMGR_JOB_STATE,
					width: "30%",
					search: false,
					formatter: "select",
					formatoptions: {
						value: {
							'A': i18nJobMgr.COMMON_ACTIVE,
							'X': i18nJobMgr.COMMON_INACTIVE
						}
					}
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					width: "20%",
					formatter: 'actions',
					formatoptions: {
						editbutton: true,
						delbutton: false,
						inlineButtonAdd: [{
							id: "job-disable",
							className: "inline-disable",
							icon: "iconfont icon-ban",
							title: i18nJobMgr.COMMON_DISABLE
	                    }]
					}
				}],
				onSelectRow: this.selectRowActive.bind(this),
				// toolbar: [true, 'bottom'],
				pagebar: true,
				searchbar: true,
				afterAddRow: function(e, rowid, rowdata, option) {
					$grid.find("#job-disable_" + rowid).hide();
				}.bind(this),
				afterEditRow: function(e, rowid, rowdata, option) {
					$grid.find("#job-disable_" + rowid).hide();
				}.bind(this),
				beforeSaveRow: function(e, rowid, rowdata, option) {
					switch (option.oper) {
					case 'edit':
						JobMgrAction.modJob(rowid, rowdata.jobName, function(data) {
							$grid.grid("saveRow", rowid, {trigger: false});
							//$grid.grid("setRowData", data);
							$grid.find("#job-disable_" + rowid).show();
							fish.success(i18nJobMgr.JOBMGR_MOD_JOB_SUCCESS);
						}.bind(this));
						break;
					case 'add':
						JobMgrAction.addJob(rowdata.jobName, 'A', function(status) {
							$grid.grid("saveRow", rowid, {trigger: false});
							$grid.grid('delRow', rowid, {trigger: false});
							$grid.grid('addRowData', status, 'last');
							$grid.grid('setSelection', status);
							fish.success(i18nJobMgr.JOBMGR_ADD_JOB_SUCCESS);
						}.bind(this));
						break;
					default:
						break;
					}
					return false;
				}.bind(this),
				afterRestoreRow: function(e, rowid, data, options) {
					var rowdata = $grid.grid("getRowData", rowid);
					var prevRow = null;
					switch (options.oper) {
					case 'add':
						prevRow = $grid.grid("getPrevSelection", rowdata);
						if (prevRow) {
							setTimeout(function() {
								$grid.grid("setSelection", prevRow);
							}, 0);
						}
						break;
					case 'edit':
						$grid.find("#job-disable_" + rowid).show();
						return;
						break;
					default:
						break;
					}
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[{
                caption: i18nJobMgr.COMMON_ADD,
                cssprop: "js-new",
                onClick: function(e) {
                	$grid.grid("addRow", {
                		initdata: {
                			jobName: "",
                			state: "A",
                			inadd: true
                		},
                		position: "last"
                	});
				}
            }]);
			// $grid.prev().children("div").searchbar({target: $grid});
		},

		initgridInactive: function($grid, gridHeight) {
			$grid.grid({
			    // height: gridHeight,
				colModel: [{
					name: 'jobId',
					key: true,
					hidden: true
				}, {
					name: 'jobName',
					label: i18nJobMgr.JOBMGR_JOB_NAME,
					editable: true,					
					width: "50%",
					search: true,
					editrules: i18nJobMgr.JOBMGR_JOB_NAME + ":required;length[1~255, true]"
				}, {
					name: 'state',
					label: i18nJobMgr.JOBMGR_JOB_STATE,
					width: "30%",
					search: false,
					formatter: "select",
					formatoptions: {
						value: {
							'A': i18nJobMgr.COMMON_ACTIVE,
							'X': i18nJobMgr.COMMON_INACTIVE
						}
					}
				}, {
					name: 'operate',
					label: '',
					sortable: false,					
					formatter: 'actions',
					width: "20%",
					formatoptions: {
						editbutton: true,
						delbutton: false,
						inlineButtonAdd: [{
							id: "job-enable",
							className: "inline-enable",
							icon: "iconfont icon-circle-o",
							title: i18nJobMgr.COMMON_ENABLE
	                    }]
					}
				}],
				onSelectRow: this.selectRowInactive.bind(this),
				// toolbar: [true, 'bottom'],
				searchbar: true,
				pagebar: true,
				afterAddRow: function(e, rowid, rowdata, option) {
					$grid.find("#job-enable_" + rowid).hide();
				}.bind(this),
				afterEditRow: function(e, rowid, rowdata, option) {
					$grid.find("#job-enable_" + rowid).hide();
				}.bind(this),
				beforeSaveRow: function(e, rowid, rowdata, option) {
					switch (option.oper) {
					case 'edit':
						JobMgrAction.modJob(rowid, rowdata.jobName, function(data) {
							$grid.grid("saveRow", rowid, {trigger: false});
							$grid.find("#job-enable_" + rowid).show();
							//$grid.grid("setRowData", data);
							fish.success(i18nJobMgr.JOBMGR_MOD_JOB_SUCCESS);
						}.bind(this));
						break;
					case 'add':
						JobMgrAction.addJob(rowdata.jobName, 'X', function(job) {
							// var job = portal.utils.filterUpperCaseKey(status);
							$grid.grid('addRowData', job, 'last');
							$grid.grid('setSelection', job);
							$grid.grid("saveRow", rowid, {trigger: false});
							$grid.grid('delRow', rowid, {trigger: false});
							fish.success(i18nJobMgr.JOBMGR_ADD_JOB_SUCCESS);
						}.bind(this));
						break;
					default:
						break;
					}
					return false;
				}.bind(this),
				afterRestoreRow: function(e, rowid, data, options) {
					var prevRow = null;
					var rowdata = $grid.grid("getRowData", rowid);					
					switch (options.oper) {
					case 'add':
						prevRow = $grid.grid("getPrevSelection", rowdata);
						if (prevRow) {
							setTimeout(function() {
								$grid.grid("setSelection", prevRow);
							}, 0);
						}
						break;
					case 'edit':
						$grid.find("#job-enable_" + rowid).show();
						return;
						break;
					default:
						break;
					}
				}.bind(this)
			});
			$grid.grid("navButtonAdd",[{
                caption: i18nJobMgr.COMMON_ADD,
                cssprop: "js-new",
                onClick: function(e) {
                	$grid.grid("addRow", {
                		initdata: {
                			jobName: "",
                			state: "X",
                			inadd: true
                		},
                		position: "last"
                	});
				}
            }]);
			$grid.prev().children("div").searchbar({target: $grid});
		},
		selectRowInactive: function(e, rowid, state) {
			var that = this;
			var rowdata = that.$(".js-grid-inactive").grid('getSelection');
			if (rowdata.inadd) {
				return;
			}
			this._jobdata = rowdata;
			JobMgrAction.qryRoles(rowdata.jobId, function(data) {
				var roleList = data || [],
					$grid = that.$(".js-jrt-grid");
				fish.forEach(roleList, function(role) {
					role.isLockedStr = that.getBoolStr(role.isLocked);
				}, this);
				$grid.grid('reloadData', roleList);
				if (roleList.length > 0) {
					$grid.grid('setSelection', roleList[0]);
				}
			});
		},
		selectRowActive: function(e, rowid, state) {
			var that = this;
			var rowdata = that.$(".js-grid-active").grid('getSelection');
			if (rowdata.inadd) {
				return;
			}
			this._jobdata = rowdata;
			JobMgrAction.qryRoles(rowdata.jobId, function(data) {
				var roleList = data || [],
					$grid = that.$(".js-jrt-grid");
				fish.forEach(roleList, function(role) {
					role.isLockedStr = that.getBoolStr(role.isLocked);
				}, this);
				$grid.grid('reloadData', roleList);
				if (roleList.length > 0) {
					$grid.grid('setSelection', roleList[0]);
				}
			});
		},
		seekBeforeRemRow: function($grid, rowdata) {
			var nextrow = $grid.grid("getNextSelection", rowdata),
				prevrow = $grid.grid("getPrevSelection", rowdata);
			if (nextrow) {
				$grid.grid("setSelection", nextrow);
			} else if (prevrow) {
				$grid.grid("setSelection", prevrow);
			// } else {
			// 	this._jobdata = null;
			}
		},

		disableJob: function(e) {
			fish.confirm(i18nJobMgr.JOBMGR_DISABLE_JOB_CONFIRM,function() {
					var $grid = this.$("#tabs-active-jobs .grid"),
						rowid = $(e.target).closest("tr.jqgrow").attr("id"),
						rowdata = $grid.grid("getRowData", rowid);
					JobMgrAction.disableJob(rowdata.jobId,
						function() {
							this.seekBeforeRemRow($grid, rowdata);
							$grid.grid("delRowData", rowdata, {trigger: false});
							fish.success(i18nJobMgr.JOBMGR_DISABLE_JOB_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		enableJob: function(e) {
			fish.confirm(i18nJobMgr.JOBMGR_ENABLE_JOB_CONFIRM,function() {
					var $grid = this.$("#tabs-inactive-jobs .grid"),
						rowid = $(e.target).closest("tr.jqgrow").attr("id"),
						rowdata = $grid.grid("getRowData", rowid);
					JobMgrAction.enableJob(rowdata.jobId,
						function() {
							this.seekBeforeRemRow($grid, rowdata);
							$grid.grid("delRowData", rowdata, {trigger: false});
							fish.success(i18nJobMgr.JOBMGR_ENABLE_JOB_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},

		getBoolStr: function(bool) {
			if (bool === 'Y') {
				return i18nJobMgr.COMMON_YES;
			} else if (bool === 'N') {
				return i18nJobMgr.COMMON_NO;
			} else {
				return '';
			}
		},

		loadDataActive: function($grid) {
			JobMgrAction.qryActiveJobs(function(jobList) {
				$grid.grid("reloadData", jobList);
				if ($grid.grid("getRowData").length > 0) {
					$grid.grid("setSelection", jobList[0]);
				}
			}.bind(this));
		},

		loadDataInactive: function($grid) {
			JobMgrAction.qryInactiveJobs(function(jobList) {
				$grid.grid("reloadData", jobList);
				if ($grid.grid("getRowData").length > 0) {
					$grid.grid("setSelection", jobList[0]);
				}
				this.resize();
			}.bind(this));
		},

		addJobRole: function() {
			fish.popupView({
				url: "stafforg/modules/jobmgr/views/RoleSelPopWin",
				viewOption: {
					JOB: this._jobdata
				},
				callback: function(popup, view) {
					this.qryJobUnmountedRoles(function(roles) {
						fish.forEach(roles, function(role) {
							role.isLockedStr = this.getBoolStr(role.isLocked);
						}, this);
						view.loadGrid(roles);
					});
				}.bind(this),
				close: function(msg) {
					this.okSelRole(msg);
				}.bind(this)
			});
		},

		okSelRole: function(msg) {
			var $grid = this.$(".js-jrt-grid"),
				roleList = msg.ROLE_LIST;
			if (msg.ADD_TO_USER) {
				var operRoles = "";
				fish.forEach(roleList, function(role) {
					operRoles += role.roleName + "; "
				});
				fish.popupView({
					url: "stafforg/modules/jobmgr/views/UserSelPopWin",
					viewOption: {
						JOB: this._jobdata,
						OPER_ROLES: operRoles,
						USER_INFO: msg.USER_INFO
					},
					close: function(msg) {
						var userList = msg.USER_LIST;
						JobMgrAction.addRoles2JobAndUsers(this._jobdata.jobId,
							fish.pluck(roleList, 'roleId'),
							fish.pluck(userList, 'userId'),
							function(status) {
								$grid.grid("addRowData", roleList, 'last');
								$grid.grid("setSelection", roleList[0]);
								fish.success(i18nJobMgr.JOBMGR_ADD_ROLE_TO_JOB_USER_SUCCESS);
							}.bind(this)
						);
					}.bind(this)
				});
			} else {
				JobMgrAction.addRoles2Job(this._jobdata.jobId,
					fish.pluck(roleList, 'roleId'), function(status) {
						$grid.grid("addRowData", roleList, 'last');
						$grid.grid("setSelection", roleList[0]);
						fish.success(i18nJobMgr.JOBMGR_ADD_ROLE_TO_JOB_SUCCESS);
					}.bind(this)
				);
			}
		},

		qryJobUnmountedRoles: function(success) {
			JobMgrAction.qryAllRoles(function(roles) {
				var jobId = this._jobdata.jobId;
				JobMgrAction.qryRoles(jobId, function(data) {
					var mounted = data;
					success.call(this, fish.filter(roles, function(role) {
						return fish.where(mounted, {
							'roleId': Number(role.roleId)
						}).length === 0;
					}));
				}.bind(this));
			}.bind(this));
		},

		resize: function(delta) {
			if (this.$(".js-layout-left").height() >= this.$(".js-layout-right").height()) {
				portal.utils.gridIncHeight(this.$(".js-job-tab .grid:visible"), delta);
				portal.utils.gridIncHeight(this.$(".js-jrt-grid"), this.$(".js-layout-left").height() - this.$(".js-layout-right").height() + 3);
			} else {
				portal.utils.gridIncHeight(this.$(".js-jrt-grid"), delta);
				portal.utils.gridIncHeight(this.$('.js-job-tab .grid:visible'), this.$(".js-layout-right").height() - this.$(".js-layout-left").height());
			}
			//有tabspanel需要限定tabspanel的高度
//			var subHeight = this.$(".container_right").height() - this.$(".js-job-tab > .ui-tabs-nav").outerHeight();
//			this.$(".js-job-tab > .ui-tabs-panel").outerHeight(subHeight);
			//tabspanel内的grid做自适应
//			this.$(".grid:visible").grid("setGridHeight", this.$(".js-job-tab > .ui-tabs-panel").height()-this.$(".js-job-tab > .ui-tabs-panel >.search-bar").outerHeight() );
		}
	});
});
