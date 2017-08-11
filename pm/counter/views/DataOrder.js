portal.define([
	'text!oss_core/pm/counter/templates/DataOrder.html',
	'text!oss_core/pm/counter/templates/OrderGroup.html',
],function(dataorderTpl,groupPageTpl){
	return portal.BaseView.extend({
		template: fish.compile(dataorderTpl),
		groupPage: fish.compile(groupPageTpl),
		events: {
			"click .js-ok": 'ok',
			"click .js-data-order-plus":'orderPlus',
			"click .js-data-order-minus":'orderMinus',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.measureAction = options.measureAction;
			this.pmUtil = options.pmUtil;
			this.colModel = options.colModel;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$(".js-data-order-panel").slimscroll({height:150});
			this.$form = this.$(".js-data-order-form");
			this.initorderGroup();
			
		},
		initorderGroup: function(){
			this.$form.find("[name='DESC_ASC']:last").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("DESC_ASC")
			});
			this.$form.find("[name='MODEL_FIELD']:last").combobox({
				dataTextField: 'label',
		        dataValueField: 'name',
		        dataSource:  this.colModel,
			});
			
			this.$form.find("[name='DESC_ASC']:last").combobox('value', 'desc');
			this.$form.find("[name='MODEL_FIELD']:last").combobox('value', this.colModel[0]['name']);
		},
		orderPlus: function(){
			if (this.$form.isValid()) {
				this.$(".js-data-order-panel").append(this.groupPage(this.i18nData));
				this.initorderGroup();
			}
		},
		orderMinus: function(event){
			$(event.target).parents('div[group]').remove();
		},
		ok: function(){
			if(!this.$form.isValid()) {
				return false;
			}		
			var retData = {condition:[], order:''};
			
			fish.forEach(this.$("div[group]"),function(group){
				var field = $(group).find("[name='MODEL_FIELD']").combobox('value');
				var desc = $(group).find("[name='DESC_ASC']").combobox('value');

				retData['condition'].push({'field':field,'desc_asc':desc});
				
				
				var order = (field +" " +desc );
				
				if(retData['order']){
					retData['order'] += " , "+order;
				}else{
					retData['order'] = order;
				}
			}.bind(this));
			//alert(JSON.stringify(retData));
			this.popup.close(retData);
		}
	});
});