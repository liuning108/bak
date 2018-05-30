define([
	'text!modules/componentmgr/templates/ComprivPopWin.html',
	'i18n!modules/componentmgr/i18n/componentmgr'
], function(ComprivPWTpl, i18nPortal) {
	return portal.BaseView.extend({

		template: fish.compile(ComprivPWTpl),

		events: {
			"click .js-ok": "ok"
		},

		render: function() {
			this.setElement(this.template(i18nPortal));
		},

		afterRender: function() {
			this.$("form select").combobox();
			this.$("[name='privName']").clearinput();
			this.$("form").form('value', this.model);
			this.$("[name='objId']").attr('disabled', 'disabled');
			this.$("[name='objId']").prop('disabled', true);			
			this.$("[name='menuUrl']").attr('disabled', 'disabled');
			this.$("[name='menuUrl']").prop('disabled', true);
			if (this.model.oldName) {
				this.$("[name='privName']").val(this.model.oldName);
			} else if (this.model.name) {
				this.$("[name='privName']").val(this.model.name);
			}
		},

		ok: function() {
			if (this.$("form").isValid()) {
				debugger;
				this.popup.close(this.$("form").form('value'));
			}
		}
	});
});