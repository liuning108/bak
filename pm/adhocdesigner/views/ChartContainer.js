/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/ChartContainer.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3"
    ],
    function(mainTpl, echarts) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {
            'click #chart-box': "containerClick",
            'click .ad-close': "containerClose"
        },

        initialize: function (opt) {
            this.chart_id = this.guid();
            this.chart_no = "";
            this.chart_type = "grid";
            this.chartTitle = "";
            this.chartSubTitle = "";
            this.chart_height = null;
            this.titleAlign = "center";
            this.gridTop = '';
            this.isPager = false;
            this.isMergeCell = false;
            this.isLabel = true;
            this.isLegend = true;
            this.isZoom = false;
            this.isCompareAnalysis = false;
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
            this.drillColList = ''
            this.condiFmtItemList = [];
            this.marklineList = [];
            //
            this.hideColList = [];
            this.showColList = [];
            this.selectedDimIndiList = opt.selectedDimIndiList;
            this.vdimList = opt.vdimList;
            var colIndex = 0;
            for(var i=0; i<opt.selectedDimIndiList.length; i++){
                var item = opt.selectedDimIndiList[i].dragNode;
                if(item.tagType==0){// 维度
                    this.selectableColList += "DIM_"+colIndex + ",";
                    colIndex++;
                }else{
                    this.selectableColList += "KPI_"+colIndex + ",";
                    this.drillColList += "KPI_"+colIndex + ",";
                    colIndex++;
                }
            }
            this.selectableColList = this.selectableColList.substring(0, this.selectableColList.length-1).split(",");
            this.drillColList = this.drillColList.substring(0, this.drillColList.length-1).split(",");
            this.firstAxisKpiList = [];
            this.secondAxisKpiList = [];
            // 坐标轴配置的参数
            this.axisCfgSeries = ""; // 系列
            this.axisCfgXaxis = ""; // X轴
            this.axisCfgYaxisList = []; // y轴
            this.axisCfgYaxisTypeList = []; // y轴类型 主次轴
            this.mainAxisCfgShow = true;
            this.secondAxisCfgShow = false;
            this.colModel = [];
            this.groupList = []; // 饼系图表的组
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({nodeName: this.chart_id})));
            return this;
        },

        afterRender: function () {
            this.updateGridCfg(false);
        },

        // 饼图
        getPieTypeLegendData: function (dimCol) {
            var legendData = [];
            fish.forEach(this.simuDp, function (data) {
                legendData[legendData.length] = data[dimCol];
            });
            return legendData;
        },

        // 折线图
        getLineTypeLegendData: function () {
            var legendData = [];
            if(this.axisCfgYaxisList.length==0) {
                fish.forEach(this.colModel, function (col) {
                    if (col.colType == 1) {
                        legendData[legendData.length] = col.label;
                    }
                });
            }else{
                fish.forEach(this.axisCfgYaxisList, this.wrap(function (kpi) {
                    fish.forEach(this.colModel, this.wrap(function (col) {
                        if (col.name == kpi) {
                            legendData[legendData.length] = col.label;
                        }
                    }));
                }));
            }
            //this.axisCfgSeries = "DIM_1";
            if(this.axisCfgSeries!=""){// 在坐标轴配置中配置了系列
                legendData = [];
                for(var i=0; i<this.simuDp.length; i++){
                    var item = this.simuDp[i][this.axisCfgSeries];
                    var isExist = false;
                    for(var j=0; j<legendData.length && !isExist; j++) {
                        if(legendData[j] == item) {
                            isExist = true;
                        }
                    }
                    if(!isExist){
                        legendData[legendData.length] = item;
                    }
                }
            }
            return legendData;
        },

        getRadarTypeLegendData: function (kpi) {
            var legendData = [];
            fish.forEach(this.colModel, this.wrap(function (col) {
                if (col.name == kpi) {
                    legendData[legendData.length] = col.label;
                }
            }));
            return legendData;
        },

        getDoubleAxisTypeLegendData: function () {
            var legendData = [];
            fish.forEach(this.firstAxisKpiList, this.wrap(function (kpi) {
                fish.forEach(this.colModel, function (col) {
                    if (col.colType == 1 && col.name == kpi) {
                        legendData[legendData.length] = col.label;
                    }
                });
            }));
            fish.forEach(this.secondAxisKpiList, this.wrap(function (kpi) {
                fish.forEach(this.colModel, function (col) {
                    if (col.colType == 1 && col.name == kpi) {
                        legendData[legendData.length] = col.label;
                    }
                });
            }));
            return legendData;
        },

        getPieTypeSeriesData: function (param) {
            var seriesData = [];
            //
            var chart_top = param.chart_top==''?this.simuDp.length:param.chart_top;
            for(var i=0; i<this.simuDp.length && i<chart_top; i++) {
                var dpItem = this.simuDp[i];
                seriesData[seriesData.length] = {
                    value: dpItem[param.KPI_NO],
                    name: dpItem[param.DIM_NO]
                }
            };
            return seriesData;
        },

        getLineTypeSeriesData: function (param) {
            var seriesData = [];
            if(this.axisCfgYaxisList.length==0) {
                //this.axisCfgYaxisList = [];
                fish.forEach(this.colModel, this.wrap(function (col) {
                    if (col.colType == 1) {
                        this.axisCfgYaxisList[this.axisCfgYaxisList.length] = col.name;
                        this.axisCfgYaxisTypeList[this.axisCfgYaxisTypeList.length] = 0;
                        seriesData[seriesData.length] = [];
                    } else if (this.axisCfgXaxis == "") {
                        this.axisCfgXaxis = col.name;
                    }
                }));
            }else{
                fish.forEach(this.axisCfgYaxisList, this.wrap(function (col) {
                    seriesData[seriesData.length] = [];
                }));
            }
            //
            var chart_top = param.chart_top==''?this.simuDp.length:param.chart_top;
            for(var i=0; i<this.simuDp.length && i<chart_top; i++) {
                var dpItem = this.simuDp[i];
                for(var j=0; j<seriesData.length; j++){
                    var datalist = seriesData[j];
                    datalist[datalist.length] = {
                        value: dpItem[this.axisCfgYaxisList[j]],
                        name: dpItem[this.axisCfgXaxis]
                    }
                };
            };
            // 判断是否配置系列
            if(this.axisCfgSeries!=""){
                seriesData = [];
                var axisCfgSeriesItems = [];
                for(var i=0; i<this.simuDp.length; i++){
                    var item = this.simuDp[i][this.axisCfgSeries];
                    var isExist = false;
                    for(var j=0; j<axisCfgSeriesItems.length && !isExist; j++) {
                        if(axisCfgSeriesItems[j] == item) {
                            isExist = true;
                        }
                    }
                    if(!isExist){
                        axisCfgSeriesItems[axisCfgSeriesItems.length] = item;
                    }
                }
                //
                for(var i=0; i<axisCfgSeriesItems.length; i++){
                    var itemValue = axisCfgSeriesItems[i];
                    var dataList = [];
                    var chart_top = param.chart_top==''?this.simuDp.length:param.chart_top;
                    for(var j=0; j<this.simuDp.length && j<chart_top; j++) {
                        var dpItem = this.simuDp[j];
                        if(dpItem[this.axisCfgSeries]==itemValue){
                            dataList[dataList.length] = {
                                value: dpItem[this.axisCfgYaxisList[0]],
                                name: dpItem[this.axisCfgXaxis]
                            }
                        };
                    };
                    //
                    dataList = this.fillSeriesData(dataList);
                    seriesData[seriesData.length] = dataList;
                }
            }
            return seriesData;
        },

        fillSeriesData: function (dataList) {
            var newDataList = [];
            for(var i=0;i<this.xAxisData.length;i++){
                var xData = this.xAxisData[i];
                var isExist = false;
                for(var j=0;j<dataList.length && !isExist;j++){
                    var data = dataList[j];
                    if(data.name == xData){
                        isExist = true;
                        newDataList[newDataList.length] = data;
                    }
                }
                if(!isExist){
                    newDataList[newDataList.length] = "";
                }
            }
            return newDataList;
        },

        getDoubleAxisTypeSeriesData: function (param, kpiList) {
            var seriesData = [];
            fish.forEach(kpiList, this.wrap(function (kpi) {
                seriesData[seriesData.length] = [];
            }));
            var chart_top = param.chart_top==''?this.simuDp.length:param.chart_top;
            for(var i=0; i<this.simuDp.length && i<chart_top; i++) {
                for(var j=0; j<seriesData.length; j++){
                    var datalist = seriesData[j];
                    datalist[datalist.length] = this.simuDp[i][kpiList[j]];
                };
            };
            return seriesData;
        },

        getScatterTypeSeriesData: function (param) {
            var seriesData = [];
            if(this.axisCfgYaxisList.length==0) {
                fish.forEach(this.colModel, this.wrap(function (col) {
                    if (col.colType == 1 && this.axisCfgYaxisList.length<2) {
                        this.axisCfgYaxisList[this.axisCfgYaxisList.length] = col.name;
                        this.axisCfgYaxisTypeList[this.axisCfgYaxisTypeList.length] = 0;
                        seriesData[seriesData.length] = [];
                    }
                }));
            }else{
                fish.forEach(this.axisCfgYaxisList, this.wrap(function (col) {
                    seriesData[seriesData.length] = [];
                }));
            }
            while(seriesData.length<2){
                seriesData[seriesData.length] = [];
            }
            this.xaxis_field = this.axisCfgYaxisList[0];
            this.yaxis_field = this.axisCfgYaxisList[1];
            var chart_top = param.chart_top==''?this.simuDp.length:param.chart_top;
            for(var i=0; i<this.simuDp.length && i<chart_top; i++) {
                var datalist_1 = seriesData[0];
                datalist_1[datalist_1.length] = {
                    value: this.simuDp[i][this.xaxis_field],
                    name: this.simuDp[i][this.axisCfgXaxis]
                }
                var datalist_2 = seriesData[1];
                datalist_2[datalist_2.length] = {
                    value: this.simuDp[i][this.yaxis_field],
                    name: this.simuDp[i][this.axisCfgXaxis]
                }
            };
            return seriesData;
        },

        getMaxValue: function (valueList) {
            var maxValue = null;
            for(var i=0; i<valueList.length; i++){
                var subList = valueList[i];
                for(var j=0;j<subList.length; j++){
                    var data = subList[j];
                    if(maxValue==null){
                        maxValue = data.value;
                    }else if(maxValue<data.value){
                        maxValue = data.value;
                    }
                }
            }
            return maxValue;
        },

        getLineTypeXaxisData: function () {
            var xaxisData = [];
            fish.forEach(this.colModel, this.wrap(function (col) {
                if(this.axisCfgXaxis=="" && col.colType==0){
                    this.axisCfgXaxis = col.name;
                }
            }));
            fish.forEach(this.simuDp, this.wrap(function (data) {
                xaxisData[xaxisData.length] = data[this.axisCfgXaxis];
            }));
            return xaxisData;
        },

        getRadarTypeXaxisData: function (dimCol) {
            var xaxisData = [];
            fish.forEach(this.simuDp, this.wrap(function (data) {
                xaxisData[xaxisData.length] = data[dimCol];
            }));
            return xaxisData;
        },

        getPieTypeXaxisData: function (dimCol, groupIndex) {
            fish.forEach(this.groupSimuDp[groupIndex], this.wrap(function (data) {
                var dataItem = data[dimCol];
                var isExist = false;
                for(var i=0;i<xaxisData.length && !isExist;i++){
                    if(xaxisData[i] == dataItem){
                        isExist = true;
                    }
                }
                if(!isExist) {
                    xaxisData[xaxisData.length] = dataItem;
                }
            }));
            return xaxisData;
        },

        getPieChartOption:  function (param) {
            // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
            var legendData = this.getPieTypeLegendData(param.DIM_NO);
            var seriesData = this.getPieTypeSeriesData(param);
            //
            var option = {
                title : {
                    text: param.GROUP_TITLE,
                    subtext: '',
                    x:'center'
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'vertical',
                    x : 'left',
                    data: legendData
                },
                calculable : true,
                series : [
                    {
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: seriesData,
                        itemStyle: {
                            normal: {
                                label : {
                                    show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                                }
                            }
                        }
                    }
                ]
            };
            return option;
        },

        getRadarChartOption: function (param) {
            var legendData = this.getRadarTypeLegendData(param.KPI_NO);
            var xAxisData = this.getRadarTypeXaxisData(param.DIM_NO);
            var seriesData = this.getPieTypeSeriesData(param);
            var maxValue = this.getMaxValue(seriesData);
            var seriesDataOpt = [];
            var indicatorOpt = [];
            for(var i=0; i<xAxisData.length; i++){
                indicatorOpt[indicatorOpt.length] = {
                    text: xAxisData[i],
                    max: maxValue
                }
            }
            for(var i=0; i<legendData.length; i++){
                var valueArray = [];
                for(var j=0; j<seriesData[i].length; j++){
                    valueArray[valueArray.length] = seriesData[i][j].value;
                }
                seriesDataOpt[seriesDataOpt.length] = {
                    name: legendData[i],
                    value: valueArray
                }
            }
            var seriesOpt = [
                {
                    type: 'radar',
                    data : seriesDataOpt,
                    itemStyle: {
                        normal: {
                            label: {
                                show: (param && param.hasOwnProperty("chart_label") ? param.chart_label : false)
                            }
                        }
                    }
                }
            ];
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'vertical',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                polar : [
                    {
                        indicator : indicatorOpt
                    }
                ],
                calculable : true,
                series : seriesOpt
            };
            return this.option;
        },

        // 折线图
        getLineChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'line',
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getColChartOption: function(param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'bar',
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getAreaChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'line',
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            areaStyle: {type: 'default'}
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getBarChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var xAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    xAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(xAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'bar',
                    data:subseriesData,
                    xAxisIndex: xAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                position: 'right',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                yAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData
                    }
                ],
                xAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getTreeChartOption: function () {
            this.option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}: {c}"
                },
                calculable : false,
                series : [
                    {
                        name: '矩形树图',
                        type:'treemap',
                        data:[
                            {
                                name: 'Item1',
                                value: 6
                            },
                            {
                                name: 'Item2',
                                value: 4
                            },
                            {
                                name: 'Item3',
                                value: 4
                            },
                            {
                                name: 'Item4',
                                value: 2
                            }
                        ]
                    }
                ]
            };
            return this.option;
        },

        getDuijiBarChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var xAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    xAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(xAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'bar',
                    stack: '总量'+xAxisIndex,
                    data:subseriesData,
                    xAxisIndex: xAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                position: 'insideRight',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                yAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData
                    }
                ],
                xAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        // 散点图 两个指标 特定呈现
        getScatterChartOption: function (param) {
            var legendData = this.getLineTypeXaxisData();
            var seriesData = this.getScatterTypeSeriesData(param);
            var seriesOpt = [];
            /*[
                {
                    name:'Item1',
                    type:'scatter',
                    data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                        [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                    ]
                },
                {
                    name:'Item2',
                    type:'scatter',
                    data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                        [180.3, 83.2], [180.3, 83.2]
                    ]
                }
            ]*/
            var kpiList_1 = seriesData[0];
            var kpiList_2 = seriesData[1];
            for(var i=0; i<legendData.length; i++){
                var name = legendData[i];
                var subDataList = [];
                for(var j=0; j<kpiList_1.length; j++){
                    var data1 = kpiList_1[j];
                    var data2 = kpiList_2[j];
                    if(data1.name == name){
                        var item = [];
                        item[item.length] = data1.value;
                        item[item.length] = data2.value;
                        subDataList[subDataList.length] = item;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: name,
                    type:'scatter',
                    data:subDataList,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true),
                                position:'top'
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            this.option = {
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    showDelay : 0,
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                xAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        scale:true
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        scale:true
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getDoubleAxisChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                var seriesType = "bar";
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                        seriesType = "line";
                    }
                }

                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type: seriesType,
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getDuijiColumnChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'bar',
                    stack: '总量'+yAxisIndex,
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            }
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        getDuijiAreaChartOption: function (param) {
            var legendData = this.getLineTypeLegendData();
            this.xAxisData = this.getLineTypeXaxisData();
            var seriesData = this.getLineTypeSeriesData(param);
            var seriesOpt = [];
            var firstYAxisShow = false;
            var secondYAxisShow = false;
            for(var i=0; i<seriesData.length; i++){
                var subseriesData = seriesData[i];
                var yAxisIndex = 0;
                if(i<this.axisCfgYaxisTypeList.length){
                    yAxisIndex = this.axisCfgYaxisTypeList[i];
                    if(yAxisIndex==0){
                        firstYAxisShow = true;
                    }else{
                        secondYAxisShow = true;
                    }
                }
                seriesOpt[seriesOpt.length] = {
                    name: legendData[i],
                    type:'line',
                    stack: '总量'+yAxisIndex,
                    data:subseriesData,
                    yAxisIndex: yAxisIndex,
                    itemStyle: {
                        normal: {
                            label : {
                                position: 'insideRight',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            areaStyle: {type: 'default'}
                        }
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            }
            //
            this.option = {
                tooltip : {
                    trigger: 'axis'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : param.yaxis_title,
                        max : (param && param.hasOwnProperty("yaxis_max") && param.yaxis_max!=''?Number(param.yaxis_max):null),
                        min : (param && param.hasOwnProperty("yaxis_min") && param.yaxis_min!=''?Number(param.yaxis_min):null),
                        show : firstYAxisShow
                    },
                    {
                        type : 'value',
                        name : param.yaxis2_title,
                        max : (param && param.hasOwnProperty("yaxis2_max") && param.yaxis2_max!=''?Number(param.yaxis2_max):null),
                        min : (param && param.hasOwnProperty("yaxis2_min") && param.yaxis2_min!=''?Number(param.yaxis2_min):null),
                        show : secondYAxisShow
                    }
                ],
                series : seriesOpt
            };
            return this.option;
        },

        containerClick: function () {
            var dataObj = {
                chart_id: this.chart_id
            };
            this.$('#chart-box').toggleClass('chartbor ');
            this.trigger("chartContainerClick", dataObj);
        },

        containerClose: function () {
            var dataObj = {
                chart_id: this.chart_id
            };
            this.trigger("chartContainerClose", dataObj);
        },

        updateGridColState: function (displayColList, drillColList) {
            this.hideColList = [];
            this.showColList = [];
            if(displayColList==''){
                displayColList = [];
            }else if(typeof(displayColList) == 'string'){
                displayColList = displayColList.split(",");
            }
            for (var i = 0; i < this.colModel.length; i++) {
                var colObj = this.colModel[i];
                if(displayColList.length==0){
                    this.showColList[this.showColList.length] = colObj.name;
                }else {
                    var isDisplay = false;
                    for (var j = 0; j < displayColList.length && !isDisplay; j++) {
                        var displayColIndex = displayColList[j];
                        if (colObj.index == displayColIndex) {
                            this.showColList[this.showColList.length] = colObj.name;
                            isDisplay = true;
                        }
                    }
                    if (!isDisplay) {
                        this.hideColList[this.hideColList.length] = colObj.name;
                    }
                }
                //
                var isDrill = false;
                for(var j=0;j<drillColList.length && !isDrill;j++){
                    if(colObj.index == drillColList[j]){
                        isDrill = true;
                    }
                }
                if(isDrill){
                    this.colModel[i] = {
                        name: colObj.name,
                        label: colObj.label,
                        index: colObj.index,
                        width: "30%",
                        sortable: false,
                        colId: colObj.colId,
                        colType: 1,
                        formatter: function (cellvalue, options, rowObject) {
                            return "<a onclick=\"this.cellLinkClick\" style='text-decoration:underline;color:blue'>" + cellvalue + "</a>";
                        }
                    }
                }else if(!isDrill && colObj.hasOwnProperty("formatter")){
                    delete colObj.formatter;
                }
            }
            this.gridOpt.colModel = this.colModel;
            this.$grid = this.$el.find("#ad-grid-container-"+this.chart_id).grid(this.gridOpt);
            // 更改表头样式蓝底白字
            this.$("[role='columnheader']").css("background-color", "#039cfd");
            this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
            this.refreshGridCol();
        },

        refreshGridCol: function () {
            this.$("#ad-grid-container-"+this.chart_id).jqGrid("hideCol", this.hideColList);
            this.$("#ad-grid-container-"+this.chart_id).jqGrid("showCol", this.showColList);
        },

        updateGridCfg: function (param) {
            this.$('#ad-chart-container').hide();
            this.$('#ad-grid-container-'+this.chart_id).show();
            this.chart_type = "grid";
            var dimCount = 0;
            var oldDimCount = 0;
            if(this.colModel.length!=0){
                for(var i=0; i<this.colModel.length; i++){
                    var colType = this.colModel[i].colType;
                    if(colType==0){
                        oldDimCount++;
                    }
                }
            }else{
                for(var i=0; i<this.selectedDimIndiList.length; i++){
                    var item = this.selectedDimIndiList[i].dragNode;
                    if(item.tagType==0){// 维度
                        oldDimCount++;
                    }
                }
            }
            var colIndex = 0;
            this.colModel = [];
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var item = this.selectedDimIndiList[i].dragNode;
                if(item.tagType==0){// 维度
                    this.colModel[this.colModel.length] = {
                        name: "DIM_"+colIndex,
                        label: item.name,
                        index: "DIM_"+colIndex,
                        width: "30%",
                        sortable: false,
                        colId: item.id,
                        colType: 0
                    }
                    colIndex++;
                    dimCount++;
                }
            }
            this.refreshKpiIndex(oldDimCount, dimCount);
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var item = this.selectedDimIndiList[i].dragNode;
                if(item.tagType==1){// 指标
                    var kpiIndex = "KPI_"+colIndex;
                    var isDrill = false;
                    for(var j=0;j<this.drillColList.length && !isDrill;j++){
                        if(this.drillColList[j]==kpiIndex){
                            isDrill = true;
                        }
                    }
                    if(isDrill) {
                        this.colModel[this.colModel.length] = {
                            name: "KPI_" + colIndex,
                            label: item.name,
                            index: "KPI_" + colIndex,
                            width: "30%",
                            sortable: false,
                            colId: item.id,
                            colType: 1,
                            formatter: function (cellvalue, options, rowObject) {
                                return "<a onclick=\"this.cellLinkClick\" style='text-decoration:underline;color:blue'>" + cellvalue + "</a>";
                            }
                        }
                    }else{
                        this.colModel[this.colModel.length] = {
                            name: "KPI_" + colIndex,
                            label: item.name,
                            index: "KPI_" + colIndex,
                            width: "30%",
                            sortable: false,
                            colId: item.id,
                            colType: 1
                        }
                    }
                    colIndex++;
                }
            }
            //
            var opt;
            var isPager = (param && param.hasOwnProperty("pager")?param.pager:false);
            if(isPager){
                opt = {
                    colModel: this.colModel,
                    rowNum: 50,
                    rowList: [50, 100, 500],
                    pager: true
                }
            }else{
                opt = {
                    colModel: this.colModel,
                    pager: false
                };
            }
            // 初始化table
            this.$("#ad-chart-container").empty();
            this.chart_height = this.chart_height == null ? 400 : this.chart_height;
            this.$grid = this.$el.find("#ad-grid-container-"+this.chart_id).grid(opt);
            this.gridOpt = opt;
            var heightVariable = 38;
            if(this.chartTitle && this.chartTitle!=''){
                heightVariable += 18;
            }
            if(this.chartSubTitle && this.chartSubTitle!=''){
                heightVariable += 14;
            }
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridWidth", this.$('#chart-box').width()-20);
            this.updateGridColState([], this.drillColList);
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("reloadData",this.simuDp);
            //this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridHeight", 700);
            console.log(this.chart_height-heightVariable);
            // 更改表头样式蓝底白字
            this.$("[role='columnheader']").css("background-color", "#039cfd");
            this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
            _.delay(function () {
                this.$grid.jqGrid("reloadData", this.simuDp);
                this.updateChartHeight();
            }.bind(this), 100);
        },

        cellLinkClick: function(e){
            e.stopPropagation();
        },

        refreshKpiIndex: function (oldDimCount, dimCount) {
            if(this.sortCol && this.sortCol.substring(0,4)=="KPI_"){
                var kpiIndex = parseInt(this.sortCol.substring(4));
                kpiIndex += dimCount-oldDimCount;
                this.sortCol = "KPI_"+kpiIndex;
            }
            for(var i=0;i<this.axisCfgYaxisList.length;i++){
                var kpiIndex = parseInt(this.axisCfgYaxisList[i].substring(4));
                kpiIndex += dimCount-oldDimCount;
                this.axisCfgYaxisList[i] = "KPI_"+kpiIndex;
            }
            /*for(var i=0;i<this.selectableColList.length;i++){
                if(this.selectableColList[i].substring(0,3)=="KPI"){
                    var kpiIndex = parseInt(this.selectableColList[i].substring(4));
                    kpiIndex += dimCount-oldDimCount;
                    this.selectableColList[i] = "KPI_"+kpiIndex;
                }
            }*/
            /*for(var i=0;i<this.drillColList.length;i++){
                if(this.drillColList[i].substring(0,3)=="KPI"){
                    var kpiIndex = parseInt(this.drillColList[i].substring(4));
                    kpiIndex += dimCount-oldDimCount;
                    this.drillColList[i] = "KPI_"+kpiIndex;
                }
            }*/
            for(var i=0;i<this.displayColList.length;i++){
                if(this.displayColList[i].substring(0,3)=="KPI"){
                    var kpiIndex = parseInt(this.displayColList[i].substring(4));
                    kpiIndex += dimCount-oldDimCount;
                    this.displayColList[i] = "KPI_"+kpiIndex;
                }
            }
        },

        updateSimuDp: function (flag) {
            // 填充模拟数据 flag是否强制刷新
            if(this.simuDp && this.simuDp.length>0 && !flag){

            }else{
                this.simuDp = this.getSimuDp();
            }
        },

        getSimuDp: function() {
            var simuDp = [];
            var dpLength = 10;
            /*var cityList = [
                {id: "Bulawayo", name: "Bulawayo"},
                {id: "Masvingo", name: "Masvingo"},
                {id: "Midlands", name: "Midlands"},
                {id: "Gokwe", name: "Gokwe"},
                {id: "Harare", name: "Harare"},
                {id: "KweKwe", name: "KweKwe"}
            ];
            var areaList = [
                {id: "South", name: "South"},
                {id: "Harare", name: "Harare"},
                {id: "Byo_Mat", name: "Byo_Mat"}
            ];*/
            if(this.gridTop>10){
                dpLength = this.gridTop;
            }
            for(var i=1; i<=dpLength; i++){
                var dataObj = {};
                fish.forEach(this.colModel, this.wrap(function(colObj) {
                    if(colObj.colType == 0){
                        if(colObj.colId.length>4 && colObj.colId.substring(0,4)=="vdim"){// 虚拟维度
                            for(var j=0;j<this.vdimList.length;j++){
                                if(colObj.colId==this.vdimList[j].VDIM_CODE){
                                    dataObj[colObj.name] = this.vdimList[j].groupList[i%this.vdimList[j].groupList.length].name;
                                    break;
                                }
                            }
                        }else{
                            dataObj[colObj.name] = colObj.label + i;
                        }
                    }else{
                        dataObj[colObj.name] = this.definedRound(Math.random()*100,2);
                    }
                }));
                simuDp[simuDp.length] = dataObj;
            }
            if(this.gridTop!=''){
                var topSimuDp = [];
                for(var i=0; i<this.gridTop; i++){
                    topSimuDp[topSimuDp.length] = simuDp[i];
                }
                if(this.sortCol!="" && this.sortType!=""){
                    topSimuDp.sort(this.wrap(function(a,b){
                        var result = 0;
                        switch(this.sortType){
                            case "asc" : result = a[this.sortCol]-b[this.sortCol];break;
                            case "desc" : result = b[this.sortCol]-a[this.sortCol];break;
                        }
                        return result
                    }));
                }
                return topSimuDp;
            }else{
                if(this.sortCol!="" && this.sortType!=""){
                    simuDp.sort(this.wrap(function(a,b){
                        var result = 0;
                        switch(this.sortType){
                            case "asc" : result = a[this.sortCol]-b[this.sortCol];break;
                            case "desc" : result = b[this.sortCol]-a[this.sortCol];break;
                        }
                        return result
                    }));
                }
                return simuDp;
            }
        },

        updateMarkline: function (marklineList) {
            for(var i=0;i<marklineList.length;i++) {
                if(typeof(marklineList[i]) == 'string'){
                    marklineList[i] = JSON.parse(marklineList[i]);
                }
            }
            if(!this.option || this.chart_type=="pie" || this.chart_type=="radar"){
                return;
            }
            var series = this.option.series;
            for(var i=0;i<series.length;i++) {
                series[i].markLine.data = [];
            }
            for(var i=0;i<marklineList.length;i++) {
                var kpi_index = marklineList[i].KPI_INDEX;
                var kpi_type = marklineList[i].KPI_TYPE;
                var markline_type = marklineList[i].MARKLINE_TYPE;
                var static_value = Number(marklineList[i].STATIC_VALUE);
                //
                for (var j=0;j<this.axisCfgYaxisList.length;j++) {
                    var yAxis = this.axisCfgYaxisList[j];
                    if(kpi_index==yAxis){
                        // 0固定值 1计算值
                        if(markline_type=="0" && this.chart_type.indexOf("bar")==-1){
                            series[j].markLine.data[series[j].markLine.data.length] = {
                                name: '',
                                yAxis: static_value
                            }
                            series[j].markLine.data[series[j].markLine.data.length] = {
                                name: '',
                                yAxis: static_value
                            }
                        }else if(markline_type=="0" && this.chart_type.indexOf("bar")!=-1){
                            series[j].markLine.data[series[j].markLine.data.length] = {
                                name: '',
                                xAxis: static_value
                            }
                            series[j].markLine.data[series[j].markLine.data.length] = {
                                name: '',
                                xAxis: static_value
                            }
                        }else{
                            series[j].markLine.data[series[j].markLine.data.length] = {
                                type : kpi_type, name: kpi_type
                            }
                        }
                    }
                }
            }
            this.chart = echarts.init(this.$("#ad-chart-container")[0]);
            this.chart.setOption(this.option);
        },

        // 根据条件格式刷新单元格背景
        updateGridByCondiFmt: function (condiFmtItemList) {
            for(var i=0;i<condiFmtItemList.length;i++) {
                if(typeof(condiFmtItemList[i]) == 'string'){
                    condiFmtItemList[i] = JSON.parse(condiFmtItemList[i]);
                }
            }
            fish.forEach(condiFmtItemList, this.wrap(function(item){
                var kpiIndex = item.KPI_INDEX;
                var kpiFmt = item.KPI_FMT;
                var kpiValue = item.KPI_VALUE;
                var kpiColor = item.KPI_COLOR;
                for(var i=0; i<this.colModel.length; i++){
                    var colObj = this.colModel[i];
                    if(colObj.index == kpiIndex){
                        var cellFlag = 'ad-grid-container-'+this.chart_id+'_'+colObj.name;
                        var cellList = this.$('[aria-describedby='+cellFlag+']');
                        fish.forEach(cellList, this.wrap(function(cell){
                            var flag = false;
                            var cellValue = cell.innerText;
                            switch(kpiFmt){
                                case "BT":
                                    var kpiValueArray = kpiValue.split("~");
                                    flag = (cellValue>=kpiValueArray[0] && cellValue<=kpiValueArray[1]);break;
                                case "EQ": flag = (cellValue==kpiValue);break;
                                case "NEQ": flag = (cellValue!=kpiValue);break;
                                case "GT": flag = (cellValue>kpiValue);break;
                                case "LW": flag = (cellValue<kpiValue);break;
                                case "GEQ": flag = (cellValue>=kpiValue);break;
                                case "LEQ": flag = (cellValue<=kpiValue);break;
                            }
                            if(flag) {
                                cell.bgColor = kpiColor;
                            }
                        }));
                    }
                }
            }));
        },

        definedRound: function(v,e) {
            var t=1;
            for(;e>0;t*=10,e--);
            for(;e<0;t/=10,e++);
            return Math.round(v*t)/t;
        },

        updateColumnCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "column";
            this.chart = echarts.init(this.$("#ad-chart-container")[0]);
            this.chart.setOption(this.getColChartOption(param));
        },

        updatePieCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "pie";
            this.$("#ad-chart-container")[0].innerHTML = '';
            if(this.groupList.length==0) {
                var dimCol;
                var kpiCol;
                fish.forEach(this.colModel, function (col) {
                    if(col.colType==0){
                        dimCol = col.name;
                    }else{
                        kpiCol = col.name;
                    }
                });

                this.groupList[this.groupList.length] = {
                    GROUP_NO: 1,
                    GROUP_TITLE: '',
                    DIM_NO: dimCol,
                    KPI_NO: kpiCol
                }
            }
            var mdValue = 12 / this.groupList.length;
            for (var i = 0; i < this.groupList.length; i++) {
                // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
                var group = this.groupList[i];
                this.$("#ad-chart-container").append('<div style="height: ' + this.$('#ad-chart-container').height() + 'px" class="col-md-' + mdValue + '"></div>');
                var chart = echarts.init(this.$("#ad-chart-container")[0].children[i]);
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                chart.setOption(this.getPieChartOption(param));
            }
        },

        updateRadarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "radar";
            this.$("#ad-chart-container")[0].innerHTML = '';
            if(this.groupList.length==0) {
                var dimCol;
                var kpiCol;
                fish.forEach(this.colModel, function (col) {
                    if(col.colType==0){
                        dimCol = col.name;
                    }else{
                        kpiCol = col.name;
                    }
                });

                this.groupList[this.groupList.length] = {
                    GROUP_NO: 1,
                    GROUP_TITLE: '',
                    DIM_NO: dimCol,
                    KPI_NO: kpiCol
                }
            }
            var mdValue = 12 / this.groupList.length;
            for (var i = 0; i < this.groupList.length; i++) {
                // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
                var group = this.groupList[i];
                this.$("#ad-chart-container").append('<div style="height: ' + this.$('#ad-chart-container').height() + 'px" class="col-md-' + mdValue + '"></div>');
                var radarChart = echarts.init(this.$("#ad-chart-container")[0].children[i]);
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                radarChart.setOption(this.getRadarChartOption(param));
            }
        },

        updateLineCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "line";
            this.lineChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.lineChart.setOption(this.getLineChartOption(param));
        },

        updateAreaCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "area";
            this.areaChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.areaChart.setOption(this.getAreaChartOption(param));
        },

        updateBarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "bar";
            this.barChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.barChart.setOption(this.getBarChartOption(param));
        },

        updateTreeCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "tree";
            this.treeChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.treeChart.setOption(this.getTreeChartOption(param));
        },

        updateDuijiBarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "duijibar";
            this.duijiBarChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.duijiBarChart.setOption(this.getDuijiBarChartOption(param));
        },

        updateScatterCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "scatter";
            this.scatterChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.scatterChart.setOption(this.getScatterChartOption(param));
        },

        updateDoubleAxisCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "doubleaxis";
            this.doubleAxisChart = echarts.init(this.$("#ad-chart-container")[0]);
            /*if(this.firstAxisKpiList.length==0 && this.secondAxisKpiList.length==0){
                fish.forEach(this.colModel, this.wrap(function (colObj) {
                    if(colObj.colType == 1){
                        this.firstAxisKpiList[this.firstAxisKpiList.length] = colObj.name;
                    }
                }));
                if(this.firstAxisKpiList.length>1){
                    this.secondAxisKpiList[this.secondAxisKpiList.length] = this.firstAxisKpiList[this.firstAxisKpiList.length-1];
                    this.firstAxisKpiList.splice(this.firstAxisKpiList.length-1, 1);
                }
            }*/
            this.doubleAxisChart.setOption(this.getDoubleAxisChartOption(param));
        },

        updateDuijiColumnCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "duijicolumn";
            this.duijiColumnChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.duijiColumnChart.setOption(this.getDuijiColumnChartOption(param));
        },

        updateDuijiAreaCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-chart-container').show();
            this.chart_type = "duijiarea";
            this.duijiAreaChart = echarts.init(this.$("#ad-chart-container")[0]);
            this.duijiAreaChart.setOption(this.getDuijiAreaChartOption(param));
        },

        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        updateChartHeight: function () {
            this.$('#chart-box').height(this.chart_height);
            var heightVariable = 38;
            if(this.chartTitle && this.chartTitle!=''){
                heightVariable += 18;
            }
            if(this.chartSubTitle && this.chartSubTitle!=''){
                heightVariable += 14;
            }
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridHeight", this.chart_height-heightVariable);
            console.log("updateChartHeight---"+(this.chart_height-heightVariable));
            this.$("#ad-chart-container").height(this.chart_height-heightVariable);
            if(this.chart){
                this.chart.resize();
            }
        },

        updateTitle: function () {
            this.$('#ad-chart-title-'+this.chart_id).text(this.chartTitle);
            this.$('#ad-chart-subtitle-'+this.chart_id).text(this.chartSubTitle);
            this.$('#ad-chart-title-'+this.chart_id).attr("class", "text-"+this.titleAlign);
            this.$('#ad-chart-subtitle-'+this.chart_id).attr("class", "text-"+this.titleAlign + " text-muted");
        },

        updateGridTop: function () {
            if(this.gridTop==''){
                this.$('#ad-grid-container-'+this.chart_id).jqGrid("reloadData", this.simuDp);
            }else{
                var topSimuDp = [];
                for(var i=0; i<this.gridTop && i<this.simuDp.length; i++){
                    topSimuDp[topSimuDp.length] = this.simuDp[i];
                }
                this.$('#ad-grid-container-'+this.chart_id).jqGrid("reloadData", topSimuDp);
            }
        },

        resize: function () {

        }
    })
});
