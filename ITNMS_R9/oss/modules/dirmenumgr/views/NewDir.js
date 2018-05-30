/**
 * Title: NewDir.js
 * Description: New Directory Dialog View
 * Author: wu.yangjin
 * Created Date: 15-5-11 9:26 AM
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!modules/dirmenumgr/templates/NewDir.html',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr'
], function(newDirTpl, i18nDirMenuMgr) {
	return portal.BaseView.extend({
		template: fish.compile(newDirTpl),
		detailForm: null,
		events: {
			"click .js-ok": "ok"
		},

		render: function() {
			this.setElement(this.template(i18nDirMenuMgr));
		},

		afterRender: function() {
			this.$(".js-pdir-name").val(this.options.dirName);
			this.$(".js-pdir-name").attr("disabled", true);
			this.detailForm = this.$(".js-dir-detail").form();
		},

		ok: function() {
			if (this.detailForm.isValid()) { //校验控件
				this.popup.close(this.detailForm.form('value'))
			}
		}
	});
});
