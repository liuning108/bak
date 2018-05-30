define([
	'text!stafforg/modules/stafforg/templates/StaffOperateHisPopWin.html',
	'i18n!stafforg/modules/stafforg/i18n/stafforg',
	'stafforg/modules/stafforg/actions/StaffOrgAction'
], function(template, i18StaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		userCode: null,
		events: {
			"click .js-query": "qryClick"
		},
		initialize: function(options) {
			this.stateString = {
				"A": i18StaffOrg.COMMON_ACTIVE,
				"X": i18StaffOrg.COMMON_INACTIVE
			};
			this.colModel = [{
				name: 'staffName',
				label: i18StaffOrg.STAFFORG_STAFF_NAME,
				width: 400
			}, {
				name: 'staffCode',
				label: i18StaffOrg.STAFFORG_STAFF_CODE,
				width: 400
			}, {
				name: 'state',
				label: i18StaffOrg.COMMON_STATE,
				width: 400,
				formatter: function(cellValue, id, rowdata) {
					if (cellValue) {
						return this.stateString[cellValue];
					}
					return "";
				}.bind(this)
			}, {
				name: 'recUserName',
				label: i18StaffOrg.COMMON_OPERATE_USER_NAME,
				width: 600
			}, {
				name: 'recUserCode',
				label: i18StaffOrg.COMMON_OPERATE_USER_CODE,
				width: 600
			}, {
				name: 'ipAddress',
				label: i18StaffOrg.COMMON_OPERATE_USER_IP,
				width: 600
			}, {
				name: 'recCreateDate',
				label: i18StaffOrg.COMMON_OPERATE_DATE,
				width: 600
			}, {
				name: 'comments',
				label: i18StaffOrg.COMMON_REMARKS,
				width: 1000
			}];
			this.options = options;
			this.staffId = this.options.staffId;
		},
		render: function() {
			this.setElement(this.template(i18StaffOrg));
		},
		afterRender: function() {
			this.qryForm = this.$(".js-query-form").form();
			this.$(".js-date-begin").datetimepicker();
			this.$(".js-date-end").datetimepicker();

			this.hisGrid = this.$(".js-grid-his").grid({
				autowidth: true,
				colModel: this.colModel
			});
			this.qryClick();
			this.$(".js-query").focus();
		},
		qryClick: function() {
			var param = this.qryForm.form("value");
			param.staffId = this.staffId;
			staffOrgAction.qryStaffHistory(param, function(data) {
				this.hisGrid.grid("reloadData", data || []);
				if (data && data.length > 0) {
					this.hisGrid.grid("setSelection", 0);
				}
			}.bind(this));
		}
	})
});