define([
	'text!i18n/modules/onlinetranslate/templates/TranslateDetailTemplate.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate'
], function(translateDetailTemplate, i18nTranslate) {
	var TranslateDetailView = portal.BaseView.extend({
		template: fish.compile(translateDetailTemplate),
		render: function() {
			this.$el.html(this.template(i18nTranslate));
		}
	});
	return TranslateDetailView;
});
