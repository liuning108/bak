/**
 *
 */
define([
		'text!oss_core/pm/adhoc/templates/ViewExtensionDialog.html',
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
			this.inParam = inParam;
			this.leftPosition = inParam.leftPosition;
			this.topPosition = inParam.topPosition;
			this.dimList = inParam.dimList;
			this.xAxisDim = inParam.xAxisDim;
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.resource));
			this.$el.appendTo('body');
			return this;
		},

		contentReady: function () {
			var self = this;
			this.$el.css("left", this.leftPosition+"px");
			this.$el.css("top", this.topPosition+"px");
			fish.forEach(this.dimList, function(dimObj){
				self.$(".modal-body").append("<div><a name='"+dimObj.DIM_CODE+"' class='ad-view-extension-drill btn btn-link' type='button' style='text-decoration:underline;color:blue'>"+dimObj.DIM_NAME+"</a></div>");
			})
			this.$('.ad-view-extension-drill').off();
			this.$('.ad-view-extension-drill').on("click", function(e){
				self.extendDimSelect(e.currentTarget.name);
			});
		},

		fnCancel: function() {
			this.trigger('cancelEvent');
		},

		extendDimSelect: function(dimCode) {
			var filterValue = this.inParam.params.params.name;
			if(this.xAxisDim.DATA_TYPE=="2"){
				// 时间类型过滤条件
				if(filterValue.indexOf(".")!=-1){
					filterValue = filterValue.substring(0, filterValue.indexOf("."));
				}
				var filterCondition = this.xAxisDim.DIM_CODE + " = to_date('" + filterValue + "','yyyy-mm-dd hh24:mi:ss')";
			}else{
				var filterCondition = this.xAxisDim.DIM_CODE + " || ''='" + filterValue + "'";
			}
			var extendDim;
			fish.forEach(this.dimList, function(dimObj){
				if(dimObj.DIM_CODE == dimCode){
					extendDim = dimObj;
				}
			})
			this.trigger("extendDimSelect", {
				extendDim: extendDim,
				filterCondition: filterCondition
			});
		},

		resize: function() {
			return this;
		}
	});
});