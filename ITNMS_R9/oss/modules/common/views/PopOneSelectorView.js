/**
 * [弹出来只有一个选择条件的选择框模板]
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */
define([
	"text!modules/common/templates/PopOneSelectorView.html",
	"i18n!i18n/common"
], function(template, i18nCommon) {
	return portal.BaseView.extend({
		template: fish.compile(template),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},

		initialize: function(options) {
			this.options = options;
			if (this.options.resource) {
				this.resource = fish.extend({}, i18nCommon, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nCommon);
			}
			if (this.options.dataSource) {
				this.dataSource = this.options.dataSource;
			} else {
				this.dataSource = [];
			}
			this.mustSelOne = this.options.mustSelOne; //必须选择一项的图标
			this.selectedValue = this.options.selectedValue;
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			this.jsCombox = this.$(".js-combox").combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: this.dataSource
			});
			if (this.selectedValue) { //选中默认选中的项
				this.jsCombox.combobox('value', this.selectedValue);
			}
			if (this.mustSelOne) {
				this.$(".js-combox-div").addClass("required");
				this.$(".js-combox").attr("data-rule", this.resource.SEL_LABEL + ":required");
				this.jsForm = this.$(".js-form").form();
			}
		},

		okClick: function() {
			if (this.mustSelOne) {
				if (this.jsForm.isValid()) {
					this.popup.close(this.jsCombox.combobox('value'));
				}
			} else {
				this.popup.close(this.jsCombox.combobox('value'));
			}
		}
	});
});