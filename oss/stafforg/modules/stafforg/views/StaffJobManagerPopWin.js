define([
	'text!stafforg/modules/stafforg/templates/StaffJobManagerPopWin.html',
	'i18n!stafforg/modules/stafforg/i18n/stafforg',
	'stafforg/modules/stafforg/actions/StaffOrgAction'
], function(StaffJobMgrPWTpl, i18nStaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(StaffJobMgrPWTpl),

		events: {
			"click .js-cancel": "cancelClick",
			"click .js-ok": "okClick"
		},

		initialize: function(options) {
			this._staff = options.STAFF;
		},

		render: function() {
			i18nStaffOrg.isEnable = 'true';
			this.setElement(this.template(i18nStaffOrg));

			this.okBtn = this.$(".js-ok");
			this.cancelBtn = this.$(".js-cancel");
			this.editBtn = this.$(".js-edit");
		},

		afterRender: function() {
			console.log(i18nStaffOrg.STAFFORG_JOB_NAME);
			var that = this;
			var $grid = this.$(".js-job-grid").grid({
				autowidth: true,
				searchbar: true,
				colModel: [{
					name: "key",
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: i18nStaffOrg.STAFFORG_ORG_NAME,
					search: true
				}, {
					name: 'jobName',
					label: i18nStaffOrg.STAFFORG_JOB_NAME,
					search: true
				}],
				multiselect: true
			});

			staffOrgAction.qryJobListInOrgByStaffId(this._staff.staffId, function(data) {
				var jobList = data || [];
				that.generateKey(jobList);
				$grid.grid("reloadData", jobList);
				if (jobList && jobList.length > 0) {
					$grid.grid("setSelection", jobList[0]);
				}
				staffOrgAction.qryOrgJobListByStaffId(that._staff.staffId, function(data) {
					var jobList = data || [];
					that.generateKey(jobList);
					that.selectedJobs = jobList;
					if (jobList && jobList.length > 0) {
						$grid.grid("setCheckRows", fish.pluck(jobList, "key"), true, false);
					}
					// $grid.grid('setAllCheckDisabled', true);
				});
			});

			this.statusChange();
		},

		okClick: function() {
			var jobs = this.$(".grid").grid("getCheckRows");
			var removedJobs = [];
			var addedJobs = [];
			for (var i = 0; i < jobs.length; i++) {
				var jobItem = jobs[i];
				var inSelected = false;
				for (var j = 0; j < this.selectedJobs.length; j++) {
					var selectedJobItem = this.selectedJobs[j];
					if (selectedJobItem.staffOrgId == jobItem.staffOrgId && selectedJobItem.jobId == jobItem.jobId) {
						inSelected = true;
						break;
					}
				}
				if (!inSelected) {
					var addJob = {};
					addJob.jobId = jobItem.jobId;
					addJob.staffOrgId = jobItem.staffOrgId;
					addedJobs[addedJobs.length] = addJob;
				}
			}
			for (var j = 0; j < this.selectedJobs.length; j++) {
				var selectedItem = this.selectedJobs[j];
				var removed = true;
				for (var i = 0; i < jobs.length; i++) {
					var jobItem = jobs[i];
					if (selectedItem.staffOrgId == jobItem.staffOrgId && selectedItem.jobId == jobItem.jobId) {
						removed = false;
						break;
					}
				}
				if (removed) {
					var removeJob = {};
					removeJob.jobId = selectedItem.jobId;
					removeJob.staffOrgId = selectedItem.staffOrgId;
					removedJobs[removedJobs.length] = removeJob;
				}
			}
			staffOrgAction.modStaffJobs(addedJobs, removedJobs, function(data) {
				this.selectedJobs = addedJobs;
				this.popup.close();
			}.bind(this));
		},

		statusChange: function() {
			var $grid = this.$(".grid");
			this.okBtn.show();
			this.cancelBtn.show();
			this.editBtn.hide();
			$grid.grid('setAllCheckDisabled', false);
		},

		generateKey: function(jobArray) {
			$.each(jobArray, function(idx, val) {
				val.key = val.staffOrgId + "_" + val.jobId;
			});
		}
	});
});
