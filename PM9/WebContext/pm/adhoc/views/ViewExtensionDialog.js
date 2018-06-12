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
				self.$(".modal-body .dim-container").append("<div><a name='"+dimObj.DIM_CODE+"' class='ad-view-extension-drill btn btn-link' type='button' style='color:#555'>"+dimObj.DIM_NAME+"</a></div>");
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
			var self = this;
			var clickSeriesObj = this.inParam.params.params;
			if(clickSeriesObj.seriesType == "scatter"){// 散点图特殊处理
				var filterValue;
				if(this.xAxisDim.META_DIM_CODE){
					var filterName = clickSeriesObj.seriesName;
					fish.forEach(this.inParam.dataList, function(dataItem){
						if(dataItem[self.xAxisDim.DIM_CODE+"_NAME"] == filterName){
							filterValue = dataItem[self.xAxisDim.DIM_CODE+"_ID"];
						}
					})
					if(!filterValue){
						fish.forEach(this.inParam.dataList, function(dataItem){
							if(dataItem[self.xAxisDim.COL_INDEX+"_NAME"] == filterName){
								filterValue = dataItem[self.xAxisDim.COL_INDEX+"_ID"];
							}
						})
					}
				}else{
					filterValue = clickSeriesObj.seriesName;
				}
			}else{
				if(this.xAxisDim.META_DIM_CODE){
					var filterName = clickSeriesObj.name;
					fish.forEach(this.inParam.dataList, function(dataItem){
						if(dataItem[self.xAxisDim.COL_INDEX+"_NAME"] == filterName){
							filterValue = dataItem[self.xAxisDim.COL_INDEX+"_ID"];
						}
					})
					if(!filterValue){
						fish.forEach(this.inParam.dataList, function(dataItem){
							if(dataItem[self.xAxisDim.DIM_CODE+"_ID"] == filterName){
								filterValue = filterName;
							}
						})
					}
					if(!filterValue){
						fish.forEach(this.inParam.dataList, function(dataItem){
							if(dataItem[self.xAxisDim.DIM_CODE+"_NAME"] == filterName){
								filterValue = dataItem[self.xAxisDim.DIM_CODE+"_ID"];
							}
						})
					}
				}else{
					filterValue = clickSeriesObj.name;
				}
			}
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
			// groupIndex针对饼系图
			this.trigger("extendDimSelect", {
				extendDim: extendDim,
				filterCondition: filterCondition,
				groupIndex: this.inParam.params.params.groupIndex
			});
		},

		resize: function() {
			return this;
		}
	});
});