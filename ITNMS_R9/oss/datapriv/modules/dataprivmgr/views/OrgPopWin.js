define([
	"text!datapriv/modules/dataprivmgr/templates/OrgPopWin.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"i18n!datapriv/modules/dataprivmgr/i18n/dataprivmgr"
], function(orgPopWinTpl, staffOrgAction,
	i18nStaffOrg, i18nDataPrivMgr) {
	return portal.BaseView.extend({
		template: fish.compile(orgPopWinTpl),

		resource: fish.extend({}, i18nStaffOrg, i18nDataPrivMgr),

		events: {
			"click .js-ok": "ok"
		},

		initialize: function(options) {
			this.root = {};
			fish.extend(this.root, options);
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			this.$orgTree = this.$(".js-org-grid").grid({
				colModel: [{
					name: 'orgId',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: this.resource.STAFFORG_ORG_NAME,
					sortable: false,
					search: true
				}, {
					name: "orgCode",
					label: this.resource.STAFFORG_ORG_CODE,
					sortable: false,
					search: true
				}],
				treeGrid: true,
				searchbar: true,
				expandColumn: "orgName"
			});
			// this.$orgTree.prev().children("div").searchbar({target: this.$orgTree});

			staffOrgAction.qryRootOrgListByStaffId(function(data) {
				var root = data;
				staffOrgAction.qryStaffMasterOrgList(function(data) {
					var subList = data;
					for (var rootKey in root) {
						var rootItem = root[rootKey];
						for (var subKey in subList) {
							var subItem = subList[subKey];
							if (rootItem.orgId == subItem.orgId) {
								subItem.parentOrgId = null;
								break;
							}
						}
					}
					var orgs = portal.utils.getTree(subList, "orgId", "parentOrgId", null);
					this.$orgTree.grid("reloadData", orgs);
					if (orgs && orgs.length > 0) {
						this.$orgTree.grid("setSelection", orgs[0])
							.grid("expandNode", this.$orgTree.grid("getSelection"));
					}
					if (this.root.orgId) {
						this.$orgTree.grid("setSelection", this.root.orgId);
					}
				}.bind(this));
			}.bind(this));

		},
		ok: function() {
			var rowdata = this.$orgTree.grid("getSelection");
			this.popup.close(rowdata);
		}
	});
});
