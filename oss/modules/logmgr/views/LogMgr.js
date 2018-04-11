define([
	'text!modules/logmgr/templates/LogMgrTemplate.html',
	'i18n!modules/logmgr/i18n/logmgr',
	'webroot'
], function(template, i18nLogMgr,webroot) {
	return portal.BaseView.extend({
		template: fish.compile(template),

		render: function() {
			this.$el.html(this.template(i18nLogMgr));
		},

		afterRender: function() {
			this.$(".js-log-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					return this.tabActivate(event, ui);
				}.bind(this)
			});
		},

		tabActivate: function(event, ui) {
			var id = ui.newPanel.attr('id');
			switch (id) {
				case "tabs-login-log":
					this.requireView({
                		url: webroot+"modules/logmgr/views/LoginLogView",
                		selector: "#tabs-login-log"
                	});
					break;
				case "tabs-system-log":
					this.requireView({
						url: webroot+"modules/logmgr/views/SystemLogView",
						selector: "#tabs-system-log"
					});
					break;
				case "tabs-audit-log":
					this.requireView({
						url: webroot+"modules/logmgr/views/AuditLogView",
						selector: "#tabs-audit-log"
					});
					break;
				default:
					break;
			}
		},
		resize:function(delta){
			//固定tabpanel的高度,子视图的高度计算在子视图内部处理
			portal.utils.incHeight(this.$(".js-log-tab > .ui-tabs-panel"), delta);
		}
	});
});