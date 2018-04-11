define([
	"text!stafforg/modules/stafforg/templates/StaffOrgTemplate.html",
	"stafforg/modules/stafforg/views/OrgMgr",
	"stafforg/modules/stafforg/views/StaffMgr",
	"css!stafforg/modules/stafforg/css/orgstaff"
	], function(tpl, orgMgrView, staffMgrView) {
		var StaffOrgMrgView = portal.BaseView.extend({
//		template: fish.compile(tpl),
		initialize: function() {
			this.setViews({
                ".js-layout-left": new orgMgrView(),
				".js-layout-right": new staffMgrView()
            });
		},

		render: function() {
			this.setElement(tpl);
			this.getView(".js-layout-left").on("orgChange", this.orgChange, this);
		},
		orgChange: function(portal) {
			this.getView(".js-layout-right").trigger("orgChange", portal);
		},
		resize: function(delta){
			portal.utils.gridIncHeight(this.$(".js-org-grid"), delta);
			//this.$(".js-staff-grid").grid("setGridHeight", this.$(".js-org-grid").height() - 41);
			this.$(".js-staff-grid").grid("setGridHeight", this.$(".js-org-grid").grid('getSize').height);
		}
	});
	return StaffOrgMrgView;
});
