/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/PieLikeAxisGroup.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(mainTpl, echarts, adhocUtil) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {
            'click #chart-box': "containerClick",
            'click .ad-close': "groupClose"
        },

        initialize: function (opt) {
            this.group_id = adhocUtil.guid();
            this.group_index = 1;
            this.chart_no = "";
            this.chart_type = "grid";
            this.chartTitle = "";
            this.chartSubTitle = "";
            this.chart_height = null;
            this.titleAlign = "center";
            this.gridTop = '';
            this.isPager = false;
            this.isLabel = true;
            this.isLegend = true;
            this.isZoom = false;
            this.yMax = '';
            this.yMin = '';
            this.xAxis = '';
            this.yAxis = '';
            this.yAxisTitle = '';
            this.yAxis2Title = '';
            this.primaryAxis = '';
            this.secondaryAxis = '';
            this.secondaryMax = '';
            this.secondaryMin = '';
            this.sortCol = '';
            this.sortType = '';
            this.selectableColList = '';
            this.displayColList = '';
            this.drillColList = '';
            this.condiFmtItemList = [];
            this.marklineList = [];
            //
            this.hideColList = [];
            this.showColList = [];
            this.colModel = opt.colModel;
            this.group = opt.group;
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({nodeName: this.group_id})));
            return this;
        },

        afterRender: function () {
            var dimSelObj = this.$("#ad-axisgroupcfg-dim-sel");
            var kpiSelObj = this.$("#ad-axisgroupcfg-kpi-sel");
            for(var i=0; i<this.colModel.length; i++){
                var obj = this.colModel[i];
                if(obj.colType == 0){
                    var value = "DIM_"+i;
                    var text = obj.label;
                    dimSelObj.append("<option value='" + value + "'>" + text + "</option>");
                }else if(obj.colType == 1){
                    var value = "KPI_"+i;
                    var text = obj.label;
                    kpiSelObj.append("<option value='" + value + "'>" + text + "</option>");
                }
            }
            //
            this.$('#ad-axisgroupcfg-name-input').val(this.group.GROUP_TITLE);
            this.$('#ad-axisgroupcfg-dim-sel').val(this.group.DIM_NO);
            this.$('#ad-axisgroupcfg-kpi-sel').val(this.group.KPI_NO);
        },

        updateGroupIndex: function (groupIndex) {
            this.group_index = groupIndex;
            this.$('#ad-axisgroupcfg-groupindex').html(groupIndex + ".");
        },

        groupClose: function () {
            var dataObj = {
                group_id: this.group_id
            };
            this.trigger("groupClose", dataObj);
        },

        resize: function () {

        }
    })
});
