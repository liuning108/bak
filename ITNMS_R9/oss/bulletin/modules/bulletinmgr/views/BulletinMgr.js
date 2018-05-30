define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinMgr.html",
	'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
	'bulletin/modules/bulletinmgr/actions/BulletinAction'
], function(bulletinTpl, i18nBulletin, bulletinAction) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinTpl),

		initialize: function() {
		
		},

		render: function() {
			this.$el.html(this.template(i18nBulletin));
		},

		afterRender: function() {
			var that = this;
			that.$(".js-bulletin").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
					case "tabs-bulletin-release":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/BulletinRelease.js",
							selector: "#tabs-bulletin-release"							
						});
						break;
					case "tabs-bulletin-create":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/BulletinCreate.js",
							selector: "#tabs-bulletin-create"							
						});
						break;
					case "tabs-bulletin-refuse":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/BulletinRefuse.js",
							selector: "#tabs-bulletin-refuse"							
						});
						break;
					case "tabs-bulletin-disapprove":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/BulletinDisapprove.js",
							selector: "#tabs-bulletin-disapprove"							
						});
						break;
					case "tabs-bulletin-approval":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/BulletinApproval.js",
							selector: "#tabs-bulletin-approval"							
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
