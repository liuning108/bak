
define([
    'modules/dynamicmenu/views/DynamicView',
    'modules/workspace/actions/WorkspaceAction'
], function(DynamicView,WorkspaceAction) {
    return DynamicView.extend({
        
        afterRender: function () {
            var that = this;
            this.gridstack = this.$('.grid-stack').gridStack({
                disableDrag: true,
                disableResize: true
            });
            WorkspaceAction.QryUserLayout(portal.appGlobal.get("portalId"), function (result) {
                try {
                    that.gridstack.loadGrid(JSON.parse(result.widgets));
                    console.log("triggerWorkspaceInit... ");

                } catch (e) {
                    console.error(e);
                }
            });
        }
    })
})
