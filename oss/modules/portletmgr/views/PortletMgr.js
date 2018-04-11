define([
	"text!modules/portletmgr/templates/PortletTemplate.html",
	"modules/portletmgr/views/PortletManagement",
	"modules/portletmgr/views/PortletCustomization",
	"i18n!modules/portletmgr/i18n/portletmgr",
	'webroot',
	"css!modules/portletmgr/css/portletmgr"	
], function(PortletTpl, WidgetManagement, WidgetCustomization, i18nWidget, webroot) {
	return portal.BaseView.extend({
		tagName: "div",
		template: fish.compile(PortletTpl),
		// className: "clearfix",
		// template: fish.compile(PortletTpl),
        initialize: function() {
            this.setViews({
                '.js-layout-left':new WidgetManagement()
            	// '.js-layout-right':new WidgetCustomization()
            })
        },
		render: function() {
			 this.$el.html(this.template(i18nWidget));
			 // this.setElement(PortletTpl);
		},

		afterRender: function() {		
			this.$(".js-portlet-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
					case "tabs-portal":
						this.requireView({
							url: webroot+"modules/portletmgr/views/PortletCustomization",
							selector: "#tabs-portal"							
						});
						break;
					case "tabs-menu":
						this.requireView({
							url: webroot+"modules/portletmgr/views/PortletMenuCustom",
							selector: "#tabs-menu"							
						});
						break;					
					default:
						break;
					}
				}.bind(this)
			});
		},
		resize: function(delta) {
			portal.utils.gridIncHeight(this.$(".js-widget-grid"), delta);
			
		}
	})
});
