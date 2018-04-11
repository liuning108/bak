define([
	"text!stafforg/modules/stafforg/templates/StaffInOrgSingleSelPopWin.html",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"stafforg/modules/stafforg/actions/StaffOrgAction"
], function(staffTemplate, i18nStaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(staffTemplate),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick",
			"click .js-empty": "emptyClick"
		},

		initialize: function(options) {
			this.options = options;
			if (this.options.resource) {
				this.resource = fish.extend({}, i18nStaffOrg, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nStaffOrg);
			}
			this.orgId = this.options.orgId;
			this.selectedStaffId = this.options.selectedStaffId;
		},

		render: function() {
			this.setElement(this.template(this.resource));
			if (this.options.canSelectedEmpty) { //如果可以选择为空的话，出现EMPTY按钮
				this.$(".js-empty").show();
			} else {
				this.$(".js-empty").hide();
			}
		},

		afterRender: function() {
			this.staffGrid = this.$(".js-staff-grid").grid({
				autowidth: true,
				searchbar: true,
				colModel: [{
					name: 'staffId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'staffName',
					label: this.resource.STAFFORG_STAFF_NAME,
					width: 500,
					search: true
				}, {
					name: 'staffCode',
					label: this.resource.STAFFORG_STAFF_CODE,
					width: 500,
					search: true
				}, {
					name: 'phone',
					label: this.resource.STAFFORG_STAFF_PHONE,
					width: 500,
					search: true
				}, {
					name: 'email',
					label: this.resource.STAFFORG_STAFF_EMAIL,
					width: 800,
					search: true
				}]
			});
			staffOrgAction.qryStaffUserInfoByOrgId(this.orgId, function(data) {
				if (data) {
					var list = [];
					fish.forEach(data, function(result) {
						var dto = fish.extend({}, result, {_chkd_: false});							
						list.push(dto);
					});
					this.staffGrid.grid("reloadData", list);
					if (this.selectedStaffId) {
						this.staffGrid.grid("setSelection", this.selectedStaffId);
					}
				}
			}.bind(this));
		},
		okClick: function() {
			var selected = this.staffGrid.grid("getSelection");
			if (!this.options.canSelectedEmpty) { //可以选择空的，默认是不能的
				if ($.isEmptyObject(selected)) {
					fish.warn(this.resource.STAFFORG_STAFF_SEL_IS_EMPTY);
					return;
				}
			}
			this.popup.close(selected);
		},
		emptyClick: function() {
			this.staffGrid.grid("resetSelection");
		}
	});
});
