define([
	'text!oss_core/inms/pm/meta/dim/templates/DimBatchAdd.html'
],function(dimBatchAddTpl){
	return fish.View.extend({
		template: fish.compile(dimBatchAddTpl),
		events: {
			"click .js-ok": 'ok'
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.dimAction = options.dimAction;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			$("#batch-script-text").css({'min-height':250});
			$("#batch-script-text").css({'min-width': 550});
		},
		domComplete: function() {
			//alert();
		},
		ok: function(){
			alert($("#batch-script-text").val());
		},
		resize:function(delta){

		}
	});
});
