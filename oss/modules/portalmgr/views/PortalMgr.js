/**
 * [Portal管理的View，又是两个小View组成的，分别是PortalEditView和PortalMenuEditView]
 * @author [wang.hui]
 */
define([
	"text!modules/portalmgr/templates/PortalTemplate.html",
	"modules/portalmgr/views/PortalEdit",
	"modules/portalmgr/views/PortalMenuEditView",
    "css!modules/portalmgr/css/portalmgr"
], function(tpl, PortalEditView, PortalMenuEditView) {
	var PortalMrgView = portal.BaseView.extend({
		tagName: "div",
		template: fish.compile(tpl),
		initialize: function() {
            this.setViews({
                ".js-left": new PortalEditView(),
				".js-right": new PortalMenuEditView()
            })
        },
		render: function() {
			this.$el.html(this.template());

			this.getView(".js-left").on("portalChange", this.portalEditChange, this);
		},

		afterRender: function() {
		},

		portalEditChange: function(portal) {
			this.getView(".js-right").trigger("portalChange", portal);
		},

		resize: function(delta) {
			//左右布局,container_left > container_right 先利用框架提供的差值计算高的(即左侧的),然后利用高的(即左侧的)计算右侧的高度
			delta = this.$(".js-left").parent().parent().height() - this.$(".js-layout-left").parent().height();
			portal.utils.gridIncHeight(this.$("#portalList"), delta);
			portal.utils.gridIncHeight(this.$("#portalDirMenuTree"), this.$(".js-layout-left").height() - this.$(".js-layout-right").height());

		}
	});
	return PortalMrgView;
});