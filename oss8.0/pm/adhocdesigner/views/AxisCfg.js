/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/AxisCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "change #ad-axiscfg-top-btn" : "topCheck",
                "change #ad-axiscfg-xaxis-select" : "xAxisDimChange",
                "change #ad-axiscfg-series-btn" : "seriesCheck",
                "click #ad-ds-asc" : "ascBtnClick",
                "click #ad-ds-desc" : "descBtnClick",
                "change .yAxisTypeRadio" : "yAxisTypeRadioChange",
                'click #ad-axiscfg-yaxis-addall' : "yAxisAddAll",
                'click #ad-axiscfg-yaxis-removeall' : "yAxisRemoveAll",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.chart_type = inParam.chart_type;
                this.colModel = inParam.colModel;
                this.gridTop = inParam.gridTop;
                this.sortCol = inParam.sortCol;
                this.sortType = inParam.sortType;
                this.axisCfgXaxis = inParam.axisCfgXaxis;
                this.xAxisLabelRotate = inParam.xAxisLabelRotate;
                this.xAxisLabelInterval = inParam.xAxisLabelInterval;
                this.xAxisLabelHeight = inParam.xAxisLabelHeight;
                this.isXAxisLabelRotate = inParam.isXAxisLabelRotate;
                this.isXAxisLabelInterval = inParam.isXAxisLabelInterval;
                this.isXAxisLabelHeight = inParam.isXAxisLabelHeight;
                this.axisCfgYaxisList = inParam.axisCfgYaxisList;
                this.axisCfgYaxisTypeList = inParam.axisCfgYaxisTypeList;
                this.axisCfgSeries = inParam.axisCfgSeries;
                // 指标集合
                this.yAxisKpiList = [];
                // 指标主次轴类型集合
                this.yAxisTypeList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                that = this;
                this.updateXyAxisLabelState(this.chart_type);
                var dimSelObj = this.$("#ad-axiscfg-dim-select");
                var xSelObj = this.$("#ad-axiscfg-xaxis-select");
                var ySelObj = this.$("#ad-axiscfg-oneyaxis-sel");
                for(var i=0; i<this.colModel.length; i++){
                    var obj = this.colModel[i];
                    if(obj.colType == 0){
                        var value = "DIM_"+i;
                        var text = obj.label;
                        if(this.chart_type=="scatter"){
                            // 散点图x轴也为指标 但是提供维度选择
                            dimSelObj.append("<option value='" + value + "'>" + text + "</option>");
                        }else {
                            xSelObj.append("<option value='" + value + "'>" + text + "</option>");
                        }
                    }else if(obj.colType == 1){
                        var value = "KPI_"+i;
                        var text = obj.label;
                        if(this.chart_type=="scatter"){
                            // 散点图x轴也为指标
                            xSelObj.append("<option value='" + value + "'>" + text + "</option>");
                            ySelObj.append("<option value='"+value+"'>"+text+"</option>");
                        }else{
                            var htmlText = '<li id="ad-axiscfg-yaxis-selectableitem-'+value+'">'
                                + '<span class="selectable">' + text + '</span><a id="ad-axiscfg-yaxis-add-'+value+'" href="#"><i class="fa fa-plus"></i></a></li>';
                            this.$('[name=ad-axiscfg-yaxis-selectable]').append(htmlText);
                            this.$('#ad-axiscfg-yaxis-add-'+value).unbind();
                            this.$('#ad-axiscfg-yaxis-add-'+value).bind("click", function(event){
                                that.selectKpiData(this.id.substring(21), 0);
                            });
                        }
                    }
                }
                // X轴
                if(this.chart_type=="scatter"){
                    this.$('#ad-axiscfg-dim-select').val(this.axisCfgXaxis);
                    this.$("#ad-axiscfg-xaxis-select").val(this.axisCfgYaxisList[0]);
                    this.$("#ad-axiscfg-oneyaxis-sel").val(this.axisCfgYaxisList[1]);
                }else{
                    this.$("#ad-axiscfg-xaxis-select").val(this.axisCfgXaxis);
                }
                this.xAxisDimChange();
                // Y轴
                for(var i=0;i<this.axisCfgYaxisList.length;i++){
                    var yAxisKpi = this.axisCfgYaxisList[i];
                    var axisType = 0;
                    if(i<this.axisCfgYaxisTypeList.length){
                        axisType = this.axisCfgYaxisTypeList[i];
                    }
                    this.selectKpiData(yAxisKpi, axisType);
                };
                // TOPN及排序
                if(this.gridTop!=''){
                    var topChkBtn = this.$('#ad-axiscfg-top-btn')[0];
                    topChkBtn.checked = true;
                    this.$('#ad-axiscfg-top-input').val(this.gridTop);
                    this.topCheck();
                }
                if(this.sortCol!=''){
                    this.$('#ad-axiscfg-topsort-select').val(this.sortCol);
                };
                if(this.sortType=="desc"){
                    this.ascBtnClick();
                }
                // 系列
                if(this.axisCfgSeries!=""){
                    var seriesChkBtn = this.$('#ad-axiscfg-series-btn')[0];
                    seriesChkBtn.checked = true;
                }
                this.$("#ad-axiscfg-series-select").val(this.axisCfgSeries);
                // X轴间隔和旋转
                if(this.isXAxisLabelInterval){
                    this.$('#ad-axiscfg-xinterval').attr("checked", "checked");
                    this.$('#ad-axiscfg-xinterval-input').val(this.xAxisLabelInterval);
                }else{
                    this.$('#ad-axiscfg-xinterval').removeAttr("checked");
                    this.$('#ad-axiscfg-xinterval-input').val('');
                }
                if(this.isXAxisLabelRotate){
                    this.$('#ad-axiscfg-xrotate').attr("checked", "checked");
                    this.$('#ad-axiscfg-xrotate-input').val(this.xAxisLabelRotate);
                }else{
                    this.$('#ad-axiscfg-xrotate').removeAttr("checked");
                    this.$('#ad-axiscfg-xrotate-input').val('');
                }
                if(this.isXAxisLabelHeight){
                    this.$('#ad-axiscfg-xheight').attr("checked", "checked");
                    this.$('#ad-axiscfg-xheight-input').val(this.xAxisLabelHeight);
                }else{
                    this.$('#ad-axiscfg-xheight').removeAttr("checked");
                    this.$('#ad-axiscfg-xheight-input').val('');
                }
            },

            selectKpiData: function(dataId, axisType) {
                that = this;
                this.$('#ad-axiscfg-yaxis-add-'+dataId).unbind();
                this.$('#ad-axiscfg-yaxis-selectableitem-'+dataId).remove();
                for(var i=0; i<this.colModel.length; i++){
                    var obj = this.colModel[i];
                    if(obj.colType == 1){
                        var value = "KPI_"+i;
                        var text = obj.label;
                        if(value == dataId){
                            this.yAxisKpiList[this.yAxisKpiList.length] = {
                                value: value,
                                name: text
                            };
                            this.yAxisTypeList[this.yAxisTypeList.length] = {
                                value: value,
                                type: axisType
                            };
                            var htmlText = '<li title="'+text+'" name="ad-axiscfg-yaxis-selecteditem" id="ad-axiscfg-yaxis-selecteditem-'+value+'">'
                                + '<span class="selectable">' + text + '</span>'
                                + '<label class="radio-inline ad-axiscfg-radio-inline-1">'
                                + '<input type="radio" class="yAxisTypeRadio" name="axisTypeRadio'+value+'" value="0" '
                                + (axisType==0?'checked':'') + '>'+this.resource.AXIS1+'</input></label>'
                                + '<label class="radio-inline ad-axiscfg-radio-inline-2">'
                                + '<input type="radio" class="yAxisTypeRadio" name="axisTypeRadio'+value+'" value="1" '
                                + (axisType==1?'checked':'') + '>'+this.resource.AXIS2+'</input></label>'
                                + '<a id="ad-axiscfg-yaxis-remove-'+value+'" href="#"><i class="fa fa-trash"></i></a></li>';
                            this.$('[name=ad-axiscfg-yaxis-selected]').append(htmlText);
                            this.$('#ad-axiscfg-yaxis-remove-'+value).unbind();
                            this.$('#ad-axiscfg-yaxis-remove-'+value).bind("click", function(event){
                                that.cancelData(this.id.substring(24));
                            });
                            break;
                        }
                    }
                }
                this.yAxisKpiListChange();
            },

            // 当为条形图时x轴显示y轴 y轴显示x轴
            // x轴间隔和旋转目前支持 线 柱 面积 双轴 堆积柱 堆积面积
            updateXyAxisLabelState: function (chart_type) {
                if(chart_type=="bar" || chart_type=="duijibar"){
                    this.$('#ad-axiscfg-xy-x').hide();
                    this.$('#ad-axiscfg-xy-y').show();
                    this.$('#ad-axiscfg-yx-y').hide();
                    this.$('#ad-axiscfg-yx-x').show();
                }else{
                    this.$('#ad-axiscfg-xy-x').show();
                    this.$('#ad-axiscfg-xy-y').hide();
                    this.$('#ad-axiscfg-yx-y').show();
                    this.$('#ad-axiscfg-yx-x').hide();
                }
                if(chart_type=="scatter"){
                    this.$('#ad-axiscfg-multiyaxis-sel').hide();
                    this.$('#ad-axiscfg-oneyaxis-sel').show();
                    this.$('#ad-axiscfg-series-container').hide();
                    this.$('#ad-axiscfg-dim-container').show();
                }
                switch(chart_type) {
                    case "line" :
                        break;
                    case "column" :
                        break;
                    case "area" :
                        break;
                    case "doubleaxis" :
                        break;
                    case "duijicolumn" :
                        break;
                    case "duijiarea" :
                        break;
                    default:
                        this.hideXIntervalAndRotate();
                }
            },

            hideXIntervalAndRotate: function () {
                this.$('#ad-axiscfg-interval-rotate').hide();
            },

            // X轴变化时 系列可选项也需要变化
            xAxisDimChange: function() {
                var nowXAxisDim = this.$("#ad-axiscfg-xaxis-select").val();
                var nowSeriesDim = this.$("#ad-axiscfg-series-select").val();
                this.$("#ad-axiscfg-series-select").empty();
                var seriesSelObj = this.$("#ad-axiscfg-series-select");
                for(var i=0; i<this.colModel.length; i++){
                    var obj = this.colModel[i];
                    var value = "DIM_" + i;
                    var name = obj.label;
                    if(obj.colType == 0 && value!=nowXAxisDim) {
                        seriesSelObj.append("<option value='" + value + "'>" + name + "</option>");
                    }
                }
                this.$("#ad-axiscfg-series-select").val(nowSeriesDim);
                this.yAxisKpiListChange();
            },

            yAxisKpiListChange: function() {
                // TOP的排序列只允许为Y轴中选中的指标
                var nowTopSortKpi = this.$("#ad-axiscfg-topsort-select").val();
                this.$("#ad-axiscfg-topsort-select").empty();
                var topSortSelObj = this.$("#ad-axiscfg-topsort-select");
                for(var i=0; i<this.yAxisKpiList.length; i++) {
                    var obj = this.yAxisKpiList[i];
                    var value = obj.value;
                    var name = obj.name;
                    topSortSelObj.append("<option value='" + value + "'>" + name + "</option>");
                }
                if(this.yAxisKpiList.length>0){
                    topSortSelObj.append("<option value=''></option>");
                }
                // 当TOPN没选时 把x轴也包含在排序中
                if(this.chart_type!="scatter") {
                    var topChkBtn = this.$('#ad-axiscfg-top-btn')[0];
                    if (!topChkBtn.checked) {
                        var xAxisValue = this.$("#ad-axiscfg-xaxis-select").val();
                        var xAxisName = "";
                        for (var i = 0; i < this.colModel.length; i++) {
                            var obj = this.colModel[i];
                            var value = "DIM_" + i;
                            var name = obj.label;
                            if (obj.colType == 0 && xAxisValue == value) {
                                xAxisName = name;
                            }
                        }
                        if (xAxisValue != "") {
                            topSortSelObj.append("<option value='" + xAxisValue + "'>" + xAxisName + "</option>");
                        }
                    }
                }
                this.$("#ad-axiscfg-topsort-select").val(nowTopSortKpi);
                //Y轴只选择了1个指标才能开启系列 Y轴未选择时，TOP和系列都不可选
                if(this.yAxisKpiList.length == 0){
                    this.$("#ad-axiscfg-series-btn").attr('disabled', 'disabled');
                    this.$("#ad-axiscfg-top-btn").attr('disabled', 'disabled');
                    this.$("#ad-axiscfg-series-btn").removeAttr('checked');
                    this.$("#ad-axiscfg-series-select").val("");
                    this.$("#ad-axiscfg-top-btn").removeAttr('checked');
                }else if(this.yAxisKpiList.length != 1) {
                    this.$("#ad-axiscfg-series-btn").attr('disabled', 'disabled');
                    this.$("#ad-axiscfg-series-btn").removeAttr('checked');
                    this.$("#ad-axiscfg-series-select").val("");
                    this.$("#ad-axiscfg-top-btn").removeAttr('disabled');
                }else {
                    this.$("#ad-axiscfg-series-btn").removeAttr('disabled');
                    this.$("#ad-axiscfg-top-btn").removeAttr('disabled');
                }
            },

            cancelData: function(dataId) {
                that = this;
                this.$('#ad-axiscfg-yaxis-remove-' + dataId).unbind();
                this.$('#ad-axiscfg-yaxis-selecteditem-' + dataId).remove();
                for (var i = 0; i < this.colModel.length; i++) {
                    var obj = this.colModel[i];
                    if (obj.colType == 1) {
                        var value = "KPI_" + i;
                        var text = obj.label;
                        if (value == dataId) {
                            for(var j = 0; j < this.yAxisKpiList.length; j++) {
                                if(value == this.yAxisKpiList[j].value){
                                    this.yAxisKpiList.splice(j, 1);
                                    this.yAxisTypeList.splice(j, 1);
                                    break;
                                }
                            }
                            var htmlText = '<li title="'+text+'" id="ad-axiscfg-yaxis-selectableitem-' + value + '"><span class="selectable">'
                                + text + '</span><a id="ad-axiscfg-yaxis-add-' + value + '" href="#"><i class="fa fa-plus"></i></a></li>';
                            this.$('[name=ad-axiscfg-yaxis-selectable]').append(htmlText);
                            this.$('#ad-axiscfg-yaxis-add-' + value).unbind();
                            this.$('#ad-axiscfg-yaxis-add-' + value).bind("click", function (event) {
                                that.selectKpiData(this.id.substring(21), 0);
                            });
                        }
                    }
                }
                this.yAxisKpiListChange();
            },

            topCheck: function() {
                var topChkBtn = this.$('#ad-axiscfg-top-btn')[0];
                if(topChkBtn.checked){
                    this.$('#ad-axiscfg-series-btn').removeAttr("checked");
                }else{
                    this.$('#ad-axiscfg-top-input').val("");
                }
                this.yAxisKpiListChange();
            },

            seriesCheck: function() {
                var seriesChkBtn = this.$('#ad-axiscfg-series-btn')[0];
                if(seriesChkBtn.checked){
                    this.$('#ad-axiscfg-top-btn').removeAttr("checked");
                }else{

                }
            },

            ascBtnClick: function() {
                this.$('#ad-ds-asc').hide();
                this.$('#ad-ds-desc').show();
            },

            descBtnClick: function() {
                this.$('#ad-ds-asc').show();
                this.$('#ad-ds-desc').hide();
            },

            yAxisTypeRadioChange: function(e) {
                var kpi = e.currentTarget.name.substring(13);
                var axisType = e.currentTarget.value;
                for(var i=0;i<this.yAxisTypeList.length;i++){
                    var value = this.yAxisTypeList[i].value;
                    if(value == kpi){
                        this.yAxisTypeList[i].type = axisType;
                        break;
                    }
                }
            },

            // 全部添加
            yAxisAddAll: function() {
                for(var i=0; i<this.colModel.length; i++) {
                    var obj = this.colModel[i];
                    if (obj.colType == 1) {
                        var value = "KPI_" + i;
                        var isExist = false;
                        for (var j = 0; j < this.yAxisKpiList.length && !isExist; j++) {
                            if (value == this.yAxisKpiList[j].value) {
                                isExist = true;
                            }
                        }
                        if (!isExist) {
                            this.selectKpiData(value, 0);
                        }
                    }
                }
            },

            // 清空
            yAxisRemoveAll: function() {
                for (var j = 0; j < this.yAxisKpiList.length; j++) {
                    this.cancelData(this.yAxisKpiList[j--].value);
                }
            },

            fnOK: function() {
                // X轴
                if (this.chart_type != "scatter"){
                    var axisCfgXaxis = this.$('#ad-axiscfg-xaxis-select').val();
                }else{
                    var axisCfgXaxis = this.$('#ad-axiscfg-dim-select').val();
                }
                // Y轴
                var axisCfgYaxisList = [];
                var axisCfgYaxisTypeList = [];
                var mainAxisCfgShow = false;
                var secondAxisCfgShow = false;
                if(this.chart_type!="scatter") {
                    fish.forEach(this.yAxisKpiList, function (kpiObj) {
                        axisCfgYaxisList[axisCfgYaxisList.length] = kpiObj.value;
                    });
                    fish.forEach(this.yAxisTypeList, function (axisTypeObj) {
                        axisCfgYaxisTypeList[axisCfgYaxisTypeList.length] = axisTypeObj.type;
                        if (axisTypeObj.type == 0) {
                            mainAxisCfgShow = true;
                        } else {
                            secondAxisCfgShow = true;
                        }
                    });
                }else{
                    axisCfgYaxisList[0] = this.$('#ad-axiscfg-xaxis-select').val();
                    axisCfgYaxisList[1] = this.$('#ad-axiscfg-oneyaxis-sel').val();
                }
                // TOPN及排序
                var gridTop = "";
                var sortCol = "";
                var sortType = "";
                var topChkBtn = this.$('#ad-axiscfg-top-btn')[0];
                if(topChkBtn.checked) {
                    gridTop = this.$('#ad-axiscfg-top-input').val();
                    if(gridTop == ""){
                        fish.toast('info', this.resource.ENTER_TOP_VALUE);
                        return;
                    }
                }
                sortCol = this.$('#ad-axiscfg-topsort-select').val();
                sortType = this.$('#ad-ds-asc').is(':hidden')?'desc':'asc';
                // 系列
                var axisCfgSeries = "";
                var seriesChkBtn = this.$('#ad-axiscfg-series-btn')[0];
                if(seriesChkBtn.checked) {
                    axisCfgSeries = this.$('#ad-axiscfg-series-select').val();
                }
                // x轴间隔旋转
                var xAxisLabelRotate = "";
                var xAxisLabelInterval = "";
                var xAxisLabelHeight = "";
                var isXAxisLabelRotate = "";
                var isXAxisLabelInterval = "";
                var isXAxisLabelHeight = "";
                var xIntervalChkBtn = this.$('#ad-axiscfg-xinterval')[0];
                var xRotateChkBtn = this.$('#ad-axiscfg-xrotate')[0];
                var xHeightChkBtn = this.$('#ad-axiscfg-xheight')[0];
                isXAxisLabelInterval = xIntervalChkBtn.checked;
                isXAxisLabelRotate = xRotateChkBtn.checked;
                isXAxisLabelHeight = xHeightChkBtn.checked;
                if(isXAxisLabelInterval) {
                    xAxisLabelInterval = this.$('#ad-axiscfg-xinterval-input').val();
                    if(xAxisLabelInterval == ""){
                        fish.toast('info', this.resource.ENTER_INTERVAL_VALUE);
                        return;
                    }
                }else{
                    xAxisLabelInterval = 'auto';
                }
                if(isXAxisLabelRotate) {
                    xAxisLabelRotate = this.$('#ad-axiscfg-xrotate-input').val();
                    if(xAxisLabelRotate == ""){
                        fish.toast('info', this.resource.ENTER_ROTATE_VALUE);
                        return;
                    }
                }else{
                    xAxisLabelRotate = 0;
                }
                if(isXAxisLabelHeight) {
                    xAxisLabelHeight = this.$('#ad-axiscfg-xheight-input').val();
                    if(xAxisLabelHeight == ""){
                        fish.toast('info', this.resource.ENTER_HEIGHT_VALUE);
                        return;
                    }
                }else{
                    xAxisLabelHeight = 70;
                }
                this.trigger("okEvent", {
                    axisCfgXaxis: axisCfgXaxis,
                    axisCfgYaxisList: axisCfgYaxisList,
                    axisCfgYaxisTypeList: axisCfgYaxisTypeList,
                    gridTop: gridTop,
                    sortCol: sortCol,
                    sortType: sortType,
                    axisCfgSeries: axisCfgSeries,
                    mainAxisCfgShow: mainAxisCfgShow,
                    secondAxisCfgShow: secondAxisCfgShow,
                    xAxisLabelRotate: xAxisLabelRotate,
                    xAxisLabelInterval: xAxisLabelInterval,
                    xAxisLabelHeight: xAxisLabelHeight,
                    isXAxisLabelRotate: isXAxisLabelRotate,
                    isXAxisLabelInterval: isXAxisLabelInterval,
                    isXAxisLabelHeight: isXAxisLabelHeight
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    }
);