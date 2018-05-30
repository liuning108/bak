/** [组织多选的弹出框] */
define([
	"text!stafforg/modules/stafforg/templates/OrgMultiSelPopWin.html",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"stafforg/modules/stafforg/actions/StaffOrgAction"
], function(selTemplate, i18nStaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(selTemplate),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},
		initialize: function(options) {
			this.options = options;
			if (this.options.resource) {
				this.resource = fish.extend({}, i18nStaffOrg, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nStaffOrg);
			}
			this.selectedOrgs = this.options.selectedOrgs;
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			var $grid = this.orgTree = this.$(".js-org-grid").grid({
				autowidth: true,
				searchbar: true,
				colModel: [{
					name: 'orgId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: this.resource.STAFFORG_ORG_NAME,
					width: 200,
					search: true
				}, {
					name: 'orgCode',
					label: this.resource.STAFFORG_ORG_CODE,
					width: 200,
					search: true
				}],
				treeGrid: true,
				/*treeIcons: {
					plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				ExpandColumn: "orgName",
				multiselect: true
			});
			/*this.$(".js-searchbar").searchbar({
				target: this.orgTree
			});*/

			this.$("form").addClass("invisible");

			staffOrgAction.qryRootOrgListByStaffId(function(data) {
				var root = data;
				staffOrgAction.qryStaffMasterOrgList(function(data) {
					var subList = data;
					for (var i = 0; i < root.length; i++) {
						root[i].expanded = true;
					}
					for (var i = 0; i < subList.length; i++) {
						subList[i].expanded = true;
					}
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
					this.orgTree.grid("reloadData", orgs);
					if (this.selectedOrgs && this.selectedOrgs.length > 0) {
						var selectedOrgIds = [];
						for (var i = 0; i < this.selectedOrgs.length; i++) {
							selectedOrgIds[i] = this.selectedOrgs[i].orgId;
						}
						this.orgTree.grid("setCheckRows", selectedOrgIds, true);
						this.orgTree.grid("setCheckDisabled", selectedOrgIds, true);
					}
					if (orgs && orgs.length > 0) {
						this.orgTree.grid("setSelection", 0).grid("expandNode", this.orgTree.grid("getSelection"));
					}
				}.bind(this));
			}.bind(this));
		},

		okClick: function() {
			var selOrgs = this.orgTree.grid("getCheckRows");
			var realSelOrgs = [];
			for (var i = 0; i < selOrgs.length; i++) {
				var selItem = selOrgs[i];
				var exclude = false;
				for (var j = 0; j < this.selectedOrgs.length; j++) {
					if (selItem.orgId == this.selectedOrgs[j].orgId) {
						exclude = true
						break;
					}
				}
				if (!exclude) {
					realSelOrgs[realSelOrgs.length] = selItem;
				}
			}
			if (realSelOrgs.length > 0) {
				this.popup.close({
					ADDED_ORGS: realSelOrgs
				});
			} else {
				fish.warn(this.resource.STAFFORG_ORG_MUL_SEL_NOT_EMPYT);
			}
		}
	});
});
