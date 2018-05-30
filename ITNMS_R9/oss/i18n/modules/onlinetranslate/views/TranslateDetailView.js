define([
	'text!i18n/modules/onlinetranslate/templates/TranslateDetailTemplate.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
	'i18n/modules/onlinetranslate/views/TranslateTemplate'
], function(translateDetailTemplate, i18nTranslate, TranslateTemplate) {
	var TranslateDetailView = portal.BaseView.extend({
		template: fish.compile(translateDetailTemplate),
		render: function() {
			this.$el.html(this.template(i18nTranslate));
			// return this;
		}
	});
	return TranslateDetailView;
});
