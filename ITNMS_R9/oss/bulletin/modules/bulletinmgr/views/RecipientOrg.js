/** [组织多选的弹出框] */
define([
	"text!bulletin/modules/bulletinmgr/templates/RecipientOrg.html",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"stafforg/modules/stafforg/actions/StaffOrgAction"
], function(selTemplate, i18nStaffOrg, staffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(selTemplate),

		initialize: function(options) {		
			this.resource = fish.extend({}, i18nStaffOrg);
		},

		render: function() {
			this.$el.html(this.template(this.resource));
		},

		afterRender: function() {
			var that = this;
			var $grid = that.orgTree = that.$(".js-org-grid").grid({
				autowidth: true,
				colModel: [{
					name: 'orgId',
					label: '',
					key: true,
					hidden: true				
				}, {
					name: 'partyCode',
					label: that.resource.STAFFORG_ORG_CODE,
					width: 200,
					search: true
				}, {
					name: 'type',
					label: '',
					hidden: true
				}],
				treeGrid: true,
				multiselect: true,
				ExpandColumn: "partyCode",			
				onSelectAll: function(ee, checked){		
					
					if (checked){
						var selrows = $grid.grid("getCheckRows");
						fish.trigger("rowChecked", selrows, 1);
					}
					else{
						var selrows = $grid.grid("getRowData");
						fish.trigger("rowUnChecked", selrows, 1);
					}
				}
			});

			staffOrgAction.qryRootOrgListByStaffId(function(data) {
				var root = data;				
				staffOrgAction.qryStaffMasterOrgList(function(data) {
					var subList = data;
					fish.forEach(subList, function(staff) {
						staff.partyCode = staff.orgCode;
						staff.type = 1;
					});
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
					that.orgTree.grid("reloadData", orgs);
					if (orgs && orgs.length > 0) {
						that.orgTree.grid("setSelection", orgs[0]).grid("expandNode", this.orgTree.grid("getSelection"));
					}
					that.$(".js-org-grid tbody .jqgrow [type='checkbox']").on("click",function(){
						$(this.parentElement.parentElement).click();
						var selrow = that.orgTree.grid("getSelection");
						if (this.checked){
							fish.trigger("rowChecked", selrow, 1);
						}
						else{
							fish.trigger("rowUnChecked", selrow, 1);
						}
					});		
					// if (this.selectedOrgs && this.selectedOrgs.length > 0) {
					// 	var selectedOrgIds = [];
					// 	for (var i = 0; i < this.selectedOrgs.length; i++) {
					// 		selectedOrgIds[i] = this.selectedOrgs[i].orgId;
					// 	}
					// 	this.orgTree.grid("setCheckRows", selectedOrgIds, true);
					// 	this.orgTree.grid("setCheckDisabled", selectedOrgIds, true);
					// }
					
				}.bind(this));
			}.bind(this));		
			
		}

	});
});
