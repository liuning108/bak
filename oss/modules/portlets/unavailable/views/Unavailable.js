define([
	"text!modules/portlets/unavailable/templates/Unavailable.html",
	"i18n!modules/portlets/unavailable/i18n/Unavailable",
    "css!modules/portlets/unavailable/css/unavailable"
], function(tpl, i18n) {
	return portal.BaseView.extend({
		render: function() {
			this.setElement(fish.compile(tpl)(i18n));
		}
	});
});