define([
	'stafforg/modules/jobmgr/actions/JobMgrAction',
	'text!stafforg/modules/jobmgr/templates/RoleSelPopWin.html',
	'i18n!stafforg/modules/jobmgr/i18n/jobmgr'
], function(JobMgrAction, RoleSelPopWinTpl, i18nJobMgr) {
	return portal.BaseView.extend({
		template: fish.compile(RoleSelPopWinTpl),

		events: {
			"click .js-ok": 'ok'
		},

		initialize: function(options) {
			this._job = options.JOB;
			this.colModel = [{
				name: 'roleId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'roleName',
				label: i18nJobMgr.JOBMGR_ROLE_NAME,
				width: "20%",
				search: true
			}, {
				name: 'roleCode',
				label: i18nJobMgr.JOBMGR_ROLE_CODE,
				width: "20%",
				search: true
			}, {
				name: 'isLockedStr',
				label: i18nJobMgr.JOBMGR_IS_LOCKED,
				width: "10%"
			}, {
				name: 'comments',
				label: i18nJobMgr.JOBMGR_REMARKS,
				width: "50%",
				search: true
			}];
		},

		render: function() {
			this.setElement(this.template(i18nJobMgr));
		},

		afterRender: function() {
			var $grid = this.$(".js-grid-role");

			$grid.grid({
				colModel: this.colModel,
				searchbar: true,
				caption: i18nJobMgr.JOBMGR_JOB_NAME + ": " + this._job.jobName,
				multiselect: true//,
			});
			$grid.prev().children("div").searchbar({target: $grid});

			//this.$(".js-add-type").combobox();
			// this.$(".js-job-name").append(this._job.jobName);

			JobMgrAction.qryUserInfoByJobId(this._job.jobId, function(status) {
				this._userInfo = status || [];
				if (this._userInfo.length > 0) {
					this.$(".js-add-type").removeClass('invisible');
					this.$(".js-add-type").parent().form();
				}
			}.bind(this));
		},

		loadGrid: function(data) {
			this.$(".js-grid-role").grid("reloadData", data);
			if (data.length > 0) {
				this.$(".js-grid-role").grid("setSelection", data[0]);
			}
		},

		ok: function() {
			var addType;
			if (this._userInfo.length > 0) {
				addType = this.$(".js-add-type").form('value').addType;
				if (!addType) {
					fish.info(i18nJobMgr.JOBMGR_PLS_SEL_TYPE);
					return;
				}
			}
			var roleList = this.$(".js-grid-role").grid("getCheckRows");
			if (roleList.length > 0) {
				this.popup.close({
					USER_INFO: this._userInfo,
					ROLE_LIST: roleList,
					ADD_TO_USER: addType === 'U' ? true : false
				});
			} else {
				fish.info(i18nJobMgr.JOBMGR_PLS_SEL_ROLE);
			}
		}
	});
});