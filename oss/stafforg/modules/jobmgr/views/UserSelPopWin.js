define([
	'stafforg/modules/jobmgr/actions/JobMgrAction',
	'text!stafforg/modules/jobmgr/templates/UserSelPopWin.html',
	'i18n!stafforg/modules/jobmgr/i18n/jobmgr'
], function(JobMgrAction, UserSelPopWinTpl, i18nJobMgr) {
	return portal.BaseView.extend({
		template: fish.compile(UserSelPopWinTpl),

		events: {
			"click .js-ok": 'ok'
		},

		initialize: function(options) {
			this._userInfo = options.USER_INFO;
			this._operRoles = options.OPER_ROLES;
			this._job = options.JOB;

			this.colModel = [{
				name: 'userId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'userName',
				label: i18nJobMgr.JOBMGR_USER_NAME,
				width: "20%",
				search: true
			}, {
				name: 'userCode',
				label: i18nJobMgr.JOBMGR_USER_CODE,
				width: "20%",
				search: true
			}, {
				name: 'staffName',
				label: i18nJobMgr.JOBMGR_STAFF_NAME,
				width: "20%",
				search: true
			}, {
				name: 'orgName',
				label: i18nJobMgr.JOBMGR_ORG_NAME,
				width: "20%",
				search: true
			}, {
				name: 'areaName',
				label: i18nJobMgr.JOBMGR_AREA_NAME,
				width: "20%",
				search: true
			}];
		},

		render: function() {
			this.setElement(this.template(i18nJobMgr));
		},

		afterRender: function() {
			var $grid = this.$(".grid");

			$grid.grid({
				//height: 345,
				searchbar: true,
				caption: i18nJobMgr.JOBMGR_JOB_NAME + ': ' + this._job.jobName,
				data: this._userInfo,
				colModel: this.colModel,
				multiselect: true
			});
			$grid.prev().children("div").searchbar({target: $grid});
			$grid.grid("setSelection", this._userInfo[0]);

			this.$(".js-oper-roles").append(portal.utils.htmlEncodeAllData(this._operRoles));
		},

		ok: function() {
			var userList = this.$(".grid").grid("getCheckRows");
			if (userList.length > 0) {
				this.popup.close({
					USER_LIST: userList
				});
			} else {
				fish.info(i18nJobMgr.JOBMGR_PLS_SEL_USER);
			}
		}
	});
});
