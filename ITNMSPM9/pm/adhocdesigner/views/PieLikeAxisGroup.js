/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/PieLikeAxisGroup.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(mainTpl, i18nData, echarts, adhocUtil) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #chart-box': "containerClick",
            'click .ad-close': "groupClose",
            'change .pieChartTypeRadio' : "pieChartTypeRadioChange"
        },

        initialize: function (opt) {
            this.group_id = adhocUtil.guid();
            this.group_index = 1;
            this.chart_no = "";
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
            this.chart_type = opt.chart_type;
            this.pieChartType = "0";//0-饼状 1-环状
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend(this.resource,{nodeName: this.group_id})));
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
            if(this.group.hasOwnProperty("PIECHART_TYPE")){
                this.$('.pieChartTypeRadio').val(this.group.PIECHART_TYPE);
            }
            this.$('#ad-axisgroupcfg-kpi-sel').val(this.group.KPI_NO);
            /*if(this.chart_type == "pie"){
                this.$('#ad-piechart-type-div').show();
            }else{
                this.$('#ad-piechart-type-div').hide();
            }*/
            this.$('#ad-piechart-type-div').hide();
        },

        updateGroupIndex: function (groupIndex) {
            this.group_index = groupIndex;
            this.$('#ad-axisgroupcfg-groupindex').html(groupIndex + ".");
        },

        pieChartTypeRadioChange: function (e) {
            this.pieChartType = e.currentTarget.value;
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
