/**
 *
 */
define([
		'text!oss_core/pm/adhoc/templates/PivotDialog.html',
		"oss_core/pm/adhoc/views/AdhocUtil",
		'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
	],
	function(RuleMgrView, adhocUtil, i18nData) {
	return portal.CommonView.extend({
            	 
		className : "ui-dialog dialog",

		resource: fish.extend({}, i18nData),
		//加载模板
		template: fish.compile(RuleMgrView),

		events : {

		},

		initialize: function(inParam) {
			this.selectedDimIndiList = inParam.selectedDimIndiList;
			this.simuDp = inParam.simuDp;
 			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.resource));
			this.$el.appendTo('body');
			return this;
		},

		contentReady: function () {
			var self = this;
			var pivotRows = [];
			var pivotCols = ["Kpi"];
			var dimIndiList = [];
			var indiArr = [];
			var colIndex = 0;
			for(var i=0; i<this.selectedDimIndiList.length; i++){
				var item = this.selectedDimIndiList[i];
				if(item.COL_TYPE=='00' || item.COL_TYPE=='02'){// 维度
					pivotRows[pivotRows.length] = item.COL_NAME;
					dimIndiList[dimIndiList.length] = {
						colIndex: "DIM_"+colIndex,
						colName: item.COL_NAME
					};
					colIndex++;
				}
			}
			for(var i=0; i<this.selectedDimIndiList.length; i++){
				var item = this.selectedDimIndiList[i];
				if(item.COL_TYPE=='01'){// 指标
					var kpiIndex = "KPI_"+colIndex;
					indiArr[indiArr.length] = item.COL_NAME;
					dimIndiList[dimIndiList.length] = {
						colIndex: "KPI_"+colIndex,
						colName: item.COL_NAME
					};
					colIndex++;
				}
			}
			var tmpPivotDp = [];
			fish.forEach(this.simuDp, this.wrap(function(dataItem){
				var newItem = new Object();
				fish.forEach(dimIndiList, function(dimIndiObj){
					newItem[dimIndiObj.colName] = dataItem[dimIndiObj.colIndex];
				});
				tmpPivotDp[tmpPivotDp.length] = newItem;
			}));
			//
			var pivotDp = [];
			fish.forEach(tmpPivotDp, this.wrap(function(dataItem){
				fish.forEach(indiArr, this.wrap(function(kpiField){
					var newItem = adhocUtil.deepCopy(dataItem);
					var newItemValue = String(newItem[kpiField]);
					if(newItemValue.indexOf(",")!=-1){
						newItem["Value"] = newItemValue.replace(/,/g,"");
					}else{
						newItem["Value"] = newItemValue;
					}
					newItem["Kpi"] = kpiField;
					pivotDp[pivotDp.length] = newItem;
				}));
			}));
			var dateFormat =       $.pivotUtilities.derivers.dateFormat;
			var sortAs =           $.pivotUtilities.sortAs;
			var tpl =              $.pivotUtilities.aggregatorTemplates;
			var fmt =              $.pivotUtilities.numberFormat({suffix: " "});
			this.$('.ad-pivotdialog-container').pivotUI(
				pivotDp,
				{
					hiddenAttributes: indiArr,
					rows: pivotRows,
					cols: pivotCols,
					aggregators: {
						"Sum":
							function() { return tpl.sum(fmt)(["Value"])},
						"Maximum":
							function() { return tpl.max(fmt)(["Value"])},
						"Minimum":
							function() { return tpl.min(fmt)(["Value"])},
						"Average":
							function() { return tpl.average(fmt)(["Value"])},
						"Count":
							function() { return tpl.count(fmt)(["Value"])}
					},
					indiArr: indiArr,
					vals: ["Value"]
				}
			);
		},

		resize: function() {
			return this;
		}
	});
});