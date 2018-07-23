portal.define([
	'text!oss_core/pm/monitor/task/templates/DateInput.html',
],function(dateInputTpl){
	return portal.BaseView.extend({
		template: fish.compile(dateInputTpl),
		events: {
			"click .js-ok": 'ok',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.pmUtil = options.pmUtil;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$form = this.$(".js-date-input-form");
			this.timeFormat = this.pmUtil.parameter("timeFormat").val();
			this.$form.find("[name='TASK_EXEC_DATE']").datetimepicker({
				//viewType: 'time',
				format	: this.timeFormat,
			});
		},
		
		ok: function(){
			if(!this.$form.isValid()) {
				return false;
			}		
			var retData = this.$form.form("value");

			this.popup.close(retData);
		}
	});
});