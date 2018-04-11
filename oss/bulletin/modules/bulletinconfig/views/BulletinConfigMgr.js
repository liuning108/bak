define([
	"text!bulletin/modules/bulletinconfig/templates/BulletinConfigMgr.html",
	'i18n!bulletin/modules/bulletinconfig/i18n/bulletinconfig',
	'bulletin/modules/bulletinconfig/actions/BulletinConfigAction'
], function(bulletinConfigTpl, i18nBulletinConfig, bulletinConfigAction) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinConfigTpl),

		initialize: function() {
		
		},

		render: function() {
			this.$el.html(this.template(i18nBulletinConfig));
		},

		afterRender: function() {
			var that = this;
			that.$(".js-bulletion-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
					case "tabs-bulletin-tmpl":
						that.requireView({
							url: "bulletin/modules/bulletinconfig/views/BulletinTmpl.js",
							selector: "#tabs-bulletin-tmpl"							
						});
						break;
					case "tabs-bulletin-level":
						that.requireView({
							url: "bulletin/modules/bulletinconfig/views/BulletinLevel.js",
							selector: "#tabs-bulletin-level"							
						});
						break;
					case "tabs-bulletin-type":
						that.requireView({
							url: "bulletin/modules/bulletinconfig/views/BulletinType.js",
							selector: "#tabs-bulletin-type"							
						});
						break;
					default:
						break;
					}
				}
			});
		},
		
		// resize: function(delta){
		// 	this.$(".js-bulletion-tab").height(delta + 43);
		// }	
	})
});
