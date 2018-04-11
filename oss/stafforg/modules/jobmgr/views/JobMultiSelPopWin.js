define([
	"text!stafforg/modules/jobmgr/templates/JobMultiSelPopWinTemplate.html",
	"i18n!stafforg/modules/jobmgr/i18n/jobmgr",
	"stafforg/modules/jobmgr/actions/JobMgrAction"
], function(jobTemplate, i18nJob, jobAction) {
	return portal.BaseView.extend({
		template: fish.compile(jobTemplate),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},

		initialize: function(options) {
			this.options = options;
			if (this.options.resource) {
				this.resource = fish.extend({}, i18nJob, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nJob);
			}
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			this.jobGrid = this.$(".js-job-grid").grid({
				autowidth: true,
				searchbar: true,
				colModel: [{
					name: 'jobId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'jobName',
					label: this.resource.JOBMGR_JOB_NAME,
					width: 500,
					search: true
				}],
				multiselect: true
			});
            var d1 = jobAction.qryActiveJobs();
            var d2;
            if (this.options.selectedJob) {
                d2 = jobAction.queryUsedJobIdsByOrgId(this.options.orgId);
            }
            $.when(d1, d2).done(function (data1, data2) {
                if (data1[0]) {
                    this.jobGrid.grid("reloadData", data1[0]);
                    if (this.options.selectedJob) {
                        var selected = [];
                        for (var i in this.options.selectedJob) {
                            selected[selected.length] = this.options.selectedJob[i].jobId;
                        }
                        this.jobGrid.grid("setCheckRows", selected);
                        this.jobGrid.grid("setCheckDisabled", data2[0], true);
                    }
                }
            }.bind(this));
		},

		okClick: function() {
			var selectedRows = this.jobGrid.grid("getCheckRows");
			if (!this.options.canSelectedEmpty) { //可以选择空的，默认是不能的
				if (selectedRows && selectedRows.length < 0) {
					fish.warn(this.resource.JOBMGR_MUST_SEL_ROW);
					return;
				}
			}
			this.popup.close(selectedRows);
		}
	});
});