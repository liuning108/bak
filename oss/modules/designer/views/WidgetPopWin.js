define([
    'modules/dynamicmenu/views/WidgetPopWin',
    'modules/designer/actions/DesignerAction'
], function(WidgetPopWin,designerAction) {
	return WidgetPopWin.extend({
		loadWidgetList:function(){
	        designerAction.QryUserPortletListByPortalId(portal.appGlobal.get("portalId"), function(result){
				this.loadWidgetsCallback(result);
			}.bind(this))
		}
	})
});