define([
	'text!datapriv/modules/dataprivmgr/templates/PrivValueEditor.html',
	'i18n!datapriv/modules/dataprivmgr/i18n/dataprivmgr'
], function(privValueTpl, i18nDataPrivMgr) {
	return portal.BaseView.extend({
		template: fish.compile(privValueTpl),
		i18nData: fish.extend({},this.i18nData,i18nDataPrivMgr),
		events: {
			"click .js-ok": "ok"
		},

		initialize: function() {
			this.dataType = this.options.dataType;
			// return this.render();
		},

		render: function() {
			this.setElement(this.template(fish.extend({
				dataType: this.dataType,
				PRIV_VALUE_EDITOR: this.i18nData.DATA_PRIV_VALUE_EDITOR
				// `PRIV_VALUE_EDITOR' in i18nDataPrivMgr should override this key
			}, this.i18nData)));
			if (this.templateId) {
				this.$("form").eq(0).prepend(this.templateId(this.i18nData));
			}
			// return this;
		},

		afterRender: function() {
			this.$("form").form();
			this.$("form").eq(0).form('value', this.options);
			this.$("form").eq(0).form('disable');
			switch (this.dataType) {
			case 'L':
				this.$(".grid").grid({
//					height: 223,
					data: this.options.valueList,
					colModel: [{
						name: 'id',
						label: this.i18nData.DATAPRIVMGR_ID,
						key: true
					}, {
						name: 'name',
						label: this.i18nData.DATAPRIVMGR_NAME
					}],
					multiselect: true
				});
				if (fish.isString(this.options.privValue)) {
					$(".grid").grid("setCheckRows", this.options.privValue.split(','));
				}
				this.$('.modal-footer').find(":input[name='ownedType']").combobox();
				this.$('.modal-footer').find(":input[name='ownedType']").combobox('value', 'I');
				break;
			case 'T':
				this.$("form").eq(0).find(":input[name='privValue']")
					.prop("disabled", false);
				break;
			default:
				break;
			}
		},

		ok: function() {
			var $form = null;
			switch (this.dataType) {
			case 'L':
				$form = this.$("form").eq(1);
				var selrows = this.$(".grid").grid("getCheckRows"),
					value = $form.form('value');
				switch (value.ownedType) {
				case 'I':
					value.ownedTypeStr = this.i18nData.COMMON_INCLUDE;
					break;
				case 'N':
					value.ownedTypeStr = this.i18nData.COMMON_EXCLUDE;
					break;
				default:
					value.ownedTypeStr = '';
					break;
				}
				if (selrows.length > 0) {
					if ($form.isValid()) {
						this.popup.close(fish.extend({
							privValue: fish.pluck(selrows, 'id').join()
						}, value));
					}
				} else {
					fish.warn(this.i18nData.DATA_PRIV_VALUE_CHOOSE);
					return;
				}
				break;
			case 'T':
				$form = this.$("form").eq(0);
				if ($form.isValid()) {
					this.popup.close({
						privValue: $form.form('value').privValue
					});
				}
				break;
			default:
				break;
			}
			
		}
	});
});