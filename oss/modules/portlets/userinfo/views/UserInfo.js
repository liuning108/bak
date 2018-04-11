define([
	"modules/portlets/userinfo/actions/UserAction",
	"text!modules/portlets/userinfo/templates/UserInfo.html",
	"i18n!modules/portlets/userinfo/i18n/UserInfo"
], function(UserAction, tpl, i18n) {
	return portal.BaseView.extend({
		resource: fish.extend({}, i18n),

		template: fish.compile(tpl),

		events: {
		},

		initialize: function(options) {
			var that = this;
			fish.on("favIconClick:"+this.options.menuId, function(param){
				that.$(".js-login-name").css("color",param.fontColor);
			})
		},

		render: function() {
			var that = this;
			this.setElement(this.template(this.resource));
			UserAction.qryCurrentUser(function(user) {
				that.$(".js-login-name").text(user.userName);
			});
			UserAction.qryUserLastLoginTime(function(logDate) {
				that.$(".js-login-date").text(fish.dateutil.displayDate(logDate,fish.config.get('dateParseFormat.datetime'),fish.config.get('dateDisplayFormat.datetime')));
			});
		},

		cleanup:function(){
			fish.off("favIconClick:"+this.options.menuId);
		},

		refresh: function (params) {
			console.log('refresh user info portlet');
		}
	});
});