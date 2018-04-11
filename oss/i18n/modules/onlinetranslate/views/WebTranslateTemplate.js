define([
	'text!i18n/modules/onlinetranslate/templates/TranslateTemplate.html',
	'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate'
], function(translateTemplate, i18nTranslate) {
	var TranslateTemplate = portal.BaseView.extend({
		template: fish.compile(translateTemplate),
		render: function() {
			this.$el.html(this.template(i18nTranslate));
		}
	});
	return TranslateTemplate;
});
