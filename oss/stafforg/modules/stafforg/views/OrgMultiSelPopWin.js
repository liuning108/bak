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
				multiselect: true,
				ExpandColumn: "orgName",
				onSelectRow: function(ee, rowid, state, checked) {
					var selrows = $grid.grid("getCheckRows"),
						defaultOrg = this.model.get("defaultOrg"),
						$combobox = this.$("[name='orgId']"),
						selDefaultOrg = null;
					// selrows.unshift({
					// 	ORG_NAME: this.resource.COMMON_PLS_SEL,
					// 	ORG_ID: '#'
					// });
					// if (defaultOrg && fish.where(selrows, {ORG_ID: defaultOrg.ORG_ID}) == 0) {
					// 	selrows.push(defaultOrg);
					// }
					selDefaultOrg = $combobox.combobox('value');
					$combobox.combobox('option', 'dataSource', selrows);
					$combobox.combobox('value', selDefaultOrg.orgId);
				}.bind(this)
			});
			this.$(".js-searchbar").searchbar({
				target: this.orgTree
			});

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

			var arr = fish.clone(this.selectedOrgs);
			// arr.unshift({
			// 	ORG_NAME: this.resource.COMMON_PLS_SEL,
			// 	ORG_ID: '#'
			// });
			staffOrgAction.qryStaffDefaultOrg(this.model.get("staffId"), function(status) {
				var defaultOrgRaw = status || [];
				if (defaultOrgRaw.length > 0) {
					this.model.set("defaultOrg", defaultOrgRaw[0]);
					if (fish.where(arr, {orgId: defaultOrgRaw[0].orgId}).length == 0) {
						arr.push(defaultOrgRaw[0]);
					}
				}
				this.$("[name='orgId']").combobox({
					dataTextField: 'orgName',
					dataValueField: 'orgId',
					dataSource: arr
				});
				if (defaultOrgRaw.length > 0) {
					this.$("[name='orgId']").combobox('value', defaultOrgRaw[0].orgId);
				} else {
					this.$("[name='orgId']").combobox('value', arr[0].orgId);
				}
			}.bind(this));
		},

		okClick: function() {
			var selOrgs = this.orgTree.grid("getCheckRows");
			var realSelOrgs = [];
			var $combobox = this.$("[name='orgId']");
			if (!$combobox.isValid()) {
				return;
			}
			var defaultOrgId = $combobox.combobox('value');
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
			if (realSelOrgs.length > 0 || (!this.model.get("defaultOrg") || this.model.get("defaultOrg").orgId != defaultOrgId) ){
				var rs = {
					addedOrgs: realSelOrgs
				}
				if(!this.model.get("defaultOrg") || this.model.get("defaultOrg").orgId != defaultOrgId) {
					rs.newDefaultOrgId = parseInt(defaultOrgId);
				} else {
					rs.newDefaultOrgId = 0;
				}
				this.popup.close(rs);
			} else {
				fish.warn(this.resource.STAFFORG_ORG_MUL_SEL_NOT_EMPYT);
			}
		}
	});
});
