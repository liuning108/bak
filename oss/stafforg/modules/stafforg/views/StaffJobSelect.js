define([
	'text!stafforg/modules/stafforg/templates/StaffJobManagerPopWin.html',
	'i18n!stafforg/modules/stafforg/i18n/stafforg',
	'stafforg/modules/stafforg/actions/StaffOrgAction'
], function(StaffJobMgrPWTpl, i18nStaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(StaffJobMgrPWTpl),

		events: {
			"click .js-ok": "okClick"
		},

		initialize: function(options) {
			this._staffList = options.list;
		},

		render: function() {
			i18nStaffOrg.isEnable = 'false';
			this.setElement(this.template(fish.extend({},i18nStaffOrg,{cssprop:this.options.cssprop,STAFFORG_STAFF_JOB_MANAGER:i18nStaffOrg.PLS_SELECT_STAFF_ORG})));
		},

		afterRender: function() {
			var that = this;
			var $grid = that.$(".js-job-grid").grid({
				autowidth: true,
				colModel: [{
					name: "staffJobId",
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: i18nStaffOrg.STAFFORG_ORG_NAME,
					sortable: false
				}, {
					name: 'jobName',
					label: i18nStaffOrg.STAFFORG_JOB_NAME,
					sortable: false
				}],
				multiselect: false,
				onDblClickRow: function(e, rowid, iRow, iCol){
					var job = that.$(".js-job-grid").grid("getSelection");
					that.popup.close(job);	
				}
			});			
			
			$grid.grid("reloadData", that._staffList);
			$grid.grid("setSelection", that._staffList[0]);
		},

		okClick: function() {
			var job = this.$(".grid").grid("getSelection");	
			this.popup.close(job);			
		}
	});
});
