define([
	'text!stafforg/modules/featuremgr/templates/FeatureMgrTemplate.html',
	'i18n!stafforg/modules/featuremgr/i18n/featuremgr',
	'webroot',
	"css!stafforg/modules/featuremgr/css/featuremgr"
], function(template, i18nLogMgr, webroot) {
	return portal.BaseView.extend({
		template: fish.compile(template),

		render: function() {
			this.$el.html(this.template(i18nLogMgr));
		},

		afterRender: function() {
			this.logTab = this.$(".js-feature-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					return this.tabActivate(event, ui);
				}.bind(this)
			});
		},

		tabActivate: function(event, ui) {
			var id = ui.newPanel.attr('id');
			switch (id) {
			case "tabs-staff-feature":
				this.requireView({
					url: webroot+"stafforg/modules/featuremgr/views/SingleTableAttrMgr",
					selector: "#tabs-staff-feature",
					viewOption: {
						type: "staff"
					}
				});
				break;
			case "tabs-org-feature":
				this.requireView({
					url: webroot+"stafforg/modules/featuremgr/views/SingleTableAttrMgr",
					selector: "#tabs-org-feature",
					viewOption: {
						type: "org"
					}
				});
				break;
			}
		},

		resize: function(delta) {
			portal.utils.incHeight(this.$(".js-feature-tab > .ui-tabs-panel"), delta);
		}
	});
});