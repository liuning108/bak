define([
    "text!modules/componentmgr/templates/ComponentMgrTemplate.html",
    "modules/componentmgr/views/DirMenuTreeView",
    "modules/componentmgr/views/PartyComponentMgrView"
], function(CompoTpl, DirMenuTree, PartyComponentMgr) {
    var ComponentMgrView = portal.BaseView.extend({
        tagName: "div",
        className: "clearfix",
        template: fish.compile(CompoTpl),
        initialize: function() {
            this.setViews({
                '.js-layout-left':new DirMenuTree(),
                '.js-layout-right':new PartyComponentMgr()
            })
        },
        render: function() {           
            this.$el.html(this.template());

            this.getView(".js-layout-left").on("partyChange", this.partyChange, this);
        },
        afterRender: function() {
        },
        partyChange: function(party) {
            this.getView(".js-layout-right").trigger("partyChange", party);
        },

        resize: function(delta) {
			portal.utils.gridIncHeight(this.$(".js-grid-mgr"), delta);
            portal.utils.gridIncHeight(this.$(".js-grid-component"), delta);
            //this.$(".js-grid-component").grid("setGridHeight",  this.$(".js-layout-left").height());
        }
    });
    return ComponentMgrView;
});
