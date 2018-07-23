/**
 *
 */
define([
		'text!oss_core/pm/adhocdesigner/templates/DimSetUp.html',
		'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
	],
	function(RuleMgrView, i18nData) {
	return portal.CommonView.extend({
            	 
		className : "ui-dialog dialog",

		resource: fish.extend({}, i18nData),
		//加载模板
		template: fish.compile(RuleMgrView),

		events : {
			"click #btn-slm-slimgr-ok" : "fnOK",
			"click #btn-slm-slimgr-cancel" : "fnCancel"
		},

		initialize: function(inParam) {
			this.tagAlias = inParam.tagAlias;
			this.tagDesc = inParam.tagDesc;
			this.calculateFormat = inParam.calculateFormat;
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.resource));
			this.$el.appendTo('body');
			return this;
		},

		afterRender: function () {
			that = this;
			this.$("#adhoc-dimsetup-alias").val(this.tagAlias);
			this.$("#adhoc-dimsetup-desc").text(this.tagDesc);
			this.$("#ad-dimsetup-format").text(this.calculateFormat);
		},

		fnCancel: function() {
			this.trigger('cancelEvent');
		},

		fnOK: function() {
			this.tagAlias = this.$("#adhoc-dimsetup-alias").val();
			this.tagDesc = this.$("#adhoc-dimsetup-desc").val();
			this.calculateFormat = this.$('#ad-dimsetup-format').val();
			this.trigger("okEvent", {
				tagAlias: this.tagAlias,
				tagDesc: this.tagDesc,
				calculateFormat: this.calculateFormat
			});
		},

		resize: function() {
			return this;
		}
	});
});