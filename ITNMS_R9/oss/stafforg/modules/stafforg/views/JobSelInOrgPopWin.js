define([
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"text!stafforg/modules/stafforg/templates/JobSelInOrg.html",
	"i18n!stafforg/modules/stafforg/i18n/stafforg"
], function(StaffOrgAction, jobSelInOrgTpl, i18nStaffOrg) {
	return portal.BaseView.extend({
		template: fish.compile(jobSelInOrgTpl),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},

		initialize: function(options) {
			this._org = options.ORG;
		},

		render: function() {
			this.setElement(this.template(i18nStaffOrg));
		},

		afterRender: function() {
			var $grid = this.$(".grid").grid({
				autowidth: true,
				searchbar: true,
				colModel: [{
					name: 'jobId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'jobName',
					label: i18nStaffOrg.STAFFORG_JOB_NAME,
					search: true
				}],
				multiselect: true
			}),
				that = this;
			$grid.prev().children().searchbar({target: $grid});
			StaffOrgAction.qryJobListByOrgId(this._org.orgId, function(status) {
				var jobList = status || [];
				$grid.grid("reloadData", jobList);
				if (jobList.length > 0) {
					$grid.grid("setSelection", jobList[0]);
				// } else {
				// 	fish.info(i18nStaffOrg.HINT_SEARCH_MATCH_NULL);
				}
			});
		},

		okClick: function() {
			var $grid = this.$(".grid"),
				selectedRows = $grid.grid("getCheckRows");
//			if (!this.options.canSelectedEmpty) { //可以选择空的，默认是不能的
//				if (selectedRows && selectedRows.length < 0) {
//					fish.warn(i18nStaffOrg.JOBMGR_MUST_SEL_ROW);
//					return;
//				}
//			}
			this.popup.close(selectedRows);
		}
	});
});
