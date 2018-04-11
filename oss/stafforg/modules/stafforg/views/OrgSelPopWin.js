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
				this.resource = fish.extend({}, i18nStaffOrg, {"STAFFORG_JOIN_TO_OTHER_ORG": "Organization Selector"}, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nStaffOrg, {"STAFFORG_JOIN_TO_OTHER_ORG": "Organization Selector"});
			}
			if(this.options.multiselect === undefined){
				this.options.multiselect = false;
			}
			this.selectedOrgs = this.options.selectedOrgs;
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			var $grid = this.orgTree = this.$(".js-org-grid").grid({
				searchbar: true,
				autowidth: true,
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
				ExpandColumn: "orgName",
				multiselect: this.options.multiselect
			});
			
			this.$("form").addClass("invisible");
			staffOrgAction.qryRootOrgListByStaffId(function(data) {
				var root = data;
				staffOrgAction.qryStaffMasterOrgList(function(data) {
					var subList = data;
					for (var i = 0; i < root.length; i++) {
						root[i].expanded = true;
					}
					for (var i = 0; i < subList.length; i++) {
						subList[i].expanded  = true;
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
					var orgs = portal.utils.getTree(subList,"orgId", "parentOrgId", null);
					this.orgTree.grid("reloadData", orgs);
					if (this.selectedOrgs && this.selectedOrgs.length > 0) {
						var selectedOrgIds = [];
						for (var i = 0; i < this.selectedOrgs.length; i++) {
							selectedOrgIds[i] = this.selectedOrgs[i].orgId;
						}
						if(this.options.multiselect){
							this.orgTree.grid("setCheckRows", selectedOrgIds, true);
						} else {
							this.orgTree.grid("setSelection", selectedOrgIds[0], true);
						}
					}
					if (orgs && orgs.length > 0) {
						this.orgTree.grid("setSelection", 0).grid("expandNode", this.orgTree.grid("getSelection"));
					}
				}.bind(this));
			}.bind(this));
		},

		okClick: function() {
			var selOrgs;
			if(this.options.multiselect){ 
				selOrgs = this.orgTree.grid("getCheckRows");
			} else {
				selOrgs = [this.orgTree.grid("getSelection")];
			}
			if (selOrgs.length > 0) {
				this.popup.close({
					selOrgs: selOrgs
				});
			} else {
				fish.warn(this.resource.STAFFORG_ORG_MUL_SEL_NOT_EMPYT);
			}
		}
	});
});
