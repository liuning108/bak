define([
	"text!datapriv/modules/dataprivmgr/templates/StaffPopWin.html",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"i18n!datapriv/modules/dataprivmgr/i18n/dataprivmgr",
	"stafforg/modules/stafforg/actions/StaffOrgAction"
], function(staffPopWinTpl, i18nStaffOrg, i18nDataPrivMgr,
	staffOrgAction) {
	return portal.BaseView.extend({

		template: fish.compile(staffPopWinTpl),

		resource: fish.extend({}, i18nStaffOrg, i18nDataPrivMgr),

		events: {
			"click .js-ok": "ok"
		},

		initialize: function(options) {
			this.root = {};
			fish.extend(this.root, options);
			return this.render();
		},

		render: function() {
			this.setElement(this.template(this.resource));
			this.$el.appendTo("body");
		},

		afterRender: function() {
			// this.$orgTree = this.$(".js-org-grid").grid({
			// 	colModel: [{
			// 		name: 'orgId',
			// 		key: true,
			// 		hidden: true
			// 	}, {
			// 		name: 'orgName',
			// 		label: this.resource.STAFFORG_ORG_NAME,
			// 		sortable: false,
			// 		search: true
			// 	}, {
			// 		name: "orgCode",
			// 		label: this.resource.STAFFORG_ORG_CODE,
			// 		sortable: false,
			// 		search: true
			// 	}],
			// 	treeGrid: true,
			// 	searchbar: true,
			// 	expandColumn: "orgName"
			// });			

			this.$staffGrid = this.$(".js-staff-grid").grid({
				autowidth: true,
//				height: 350,
				colModel: [{
					name: 'staffId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'staffName',
					label: this.resource.STAFFORG_STAFF_NAME,
					search: true
				}, {
					name: 'staffCode',
					label: this.resource.STAFFORG_STAFF_CODE,
					search: true
				}],
				multiselect: true,
				searchbar: true
			});

			staffOrgAction.qryStaffUserInfoByOrgId(this.root.orgId,
				function(status) {
					if (status) {
						// var list = [];
						// fish.forEach(status, function(result) {
						// 	var dto = fish.extend({}, result.staffDto, result.user, {_chkd_: false});							
						// 	list.push(dto);
						// });
						this.$staffGrid.grid("reloadData", status);
						if (this.root.staffIds) {
							this.$staffGrid.grid("setCheckRows",
								this.root.staffIds.split(','));
						}
					}
				}.bind(this)
			);
		},

		ok: function() {
			var selrows = this.$staffGrid.grid("getCheckRows");
			// this.trigger("ok", selrows);
			this.popup.close(selrows);
		}
	});
});