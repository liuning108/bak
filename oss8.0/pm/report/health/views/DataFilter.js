portal.define([
	'text!oss_core/pm/report/health/templates/DataFilter.html',
	'text!oss_core/pm/report/health/templates/FilterGroup.html',
],function(dataFilterTpl,groupPageTpl){
	return portal.BaseView.extend({
		template: fish.compile(dataFilterTpl),
		groupPage: fish.compile(groupPageTpl),
		events: {
			"click .js-ok": 'ok',
			"click .js-reset": 'reset',
			"click .js-data-filter-plus":'filterPlus',
			"click .js-data-filter-minus":'filterMinus',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.measureAction = options.measureAction;
			this.pmUtil = options.pmUtil;
			this.colModel = options.colModel;
			this.FilterData = options.FilterData;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$(".js-data-filter-panel").slimscroll({height:150});
			this.$form = this.$(".js-data-filter-form");
			this.$form.find("[name='CONDITION_OPTION']").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("CONDITION_OPTION")
			});
			
			this.$form.find("[name='CONDITION_OPTION']").combobox('value', 'AND');
			this.initFilterGroup();
			
			if(this.FilterData){
				this.$form.find("[name='CONDITION_OPTION']").combobox('value',this.FilterData['condition_option']);
				fish.forEach(this.FilterData['condition'],function(filter,index){
					var groups = this.$('div[group]');
					var group = null ;
					
					if(groups.length > index){
						group = groups.eq(index);
						
					}else{
						this.filterPlus();
						group = this.$('div[group]:last');
						
					}
					
					$(group).find("[name='MODEL_FIELD']").combobox('value',filter['field']);
					$(group).find("[name='OPERATORS']").combobox('value',filter['operators']);
					$(group).find("[name='VALUE']").val(filter['value']);
					
				}.bind(this));
			}			
		},
		initFilterGroup: function(){
			this.$form.find("[name='OPERATORS']:last").combobox({
				dataTextField: this.pmUtil.parakey.name,
		        dataValueField: this.pmUtil.parakey.val,
		        dataSource:  this.pmUtil.paravalue("OPERATORS")
			});
			this.$form.find("[name='MODEL_FIELD']:last").combobox({
				dataTextField: 'label',
		        dataValueField: 'name',
		        dataSource:  this.colModel,
			});
			
			this.$form.find("[name='OPERATORS']:last").combobox('value', '=');
			if(this.colModel && this.colModel.length > 0){
				this.$form.find("[name='MODEL_FIELD']:last").combobox('value', this.colModel[0]['name']);
			}
		},
		filterPlus: function(){
			if (this.$form.isValid()) {
				this.$(".js-data-filter-panel").append(this.groupPage(this.i18nData));
				this.initFilterGroup();
			}
		},
		filterMinus: function(event){
			$(event.target).parents('div[group]').remove();
		},
		ok: function(){
			if(!this.$form.isValid()) {
				return false;
			}		
			var retData = {condition_option:'', condition:[], where:''};
			retData['condition_option'] = this.$form.find("[name='CONDITION_OPTION']").combobox('value');
			fish.forEach(this.$("div[group]"),function(group){
				var field = $(group).find("[name='MODEL_FIELD']").combobox('value');
				var oper = $(group).find("[name='OPERATORS']").combobox('value');
				var val = $.trim($(group).find("[name='VALUE']").val());
				var lastChar = val.charAt(val.length - 1);
				if(lastChar==','){
					val = val.substr(0,val.length-1);
				}
				retData['condition'].push({'field':field,'operators':oper,'value':val});
				
				var fieldObj = $.grep( this.colModel, function(col,i){
					return (field == col["name"]); 
				});
				var dataType = (fieldObj.length > 0 )?fieldObj[0]['data_type']:"" ;
				var contain = ($.inArray(oper, ['in','not in'])>=0) ;
				var valArr = val.split(",");
				/*
				if(dataType == '2'){
					val = "to_date('"+ val.replace(/,/g,"','yyyy-mm-dd hh24:mi:ss'),to_date('") +"','yyyy-mm-dd hh24:mi:ss')";
				}else 
				*/
				if(dataType != '1'){
					val = "'"+ val.replace(/,/g,"','") +"'";
				}

				if(contain){
					val = "(" + val +")";
				}
				var where = (field +" " +oper+" "+val );
				
				if(retData['where']){
					retData['where'] += " "+retData['condition_option']+" "+where;
				}else{
					retData['where'] = where;
				}
			}.bind(this));
			//alert(JSON.stringify(retData));
			this.popup.close(retData);
		},
		reset: function(){
			this.popup.close({});
		},
	});
});