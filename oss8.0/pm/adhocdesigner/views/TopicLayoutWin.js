/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/TopicLayoutWin.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-topiclayout-default" : "layoutTypeSelect",
                "click #ad-topiclayout-simple" : "layoutTypeSelect",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.catalogList = inParam.catalogList;
                this.classNo = inParam.classNo;
                this.chartList = inParam.chartList;
                this.layout_type = 0;
                this.topicObj = inParam.topicObj;
                this.chartOrderList = inParam.chartOrderList;
                var chart_no = 0;
                fish.forEach(this.chartList, function(chart){
                    chart.chart_no = chart_no++;
                });
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.initCatalogSelect();
                this.reloadChartOrderGrid(false);
                this.defaultLayoutSelect();
                if(this.topicObj){
                    this.$('#ad-topiclayout-catalog-select').val(this.topicObj.CLASS_NO);
                    this.$('#ad-topiclayout-numperrow').val(this.topicObj.PRELINE_ECHARTS);
                    if(this.topicObj.LAYOUT_TYPE=="1"){
                        this.simpleLayoutSelect();
                    }
                }else{
                    //新增时带入当前点击的目录
                    for(var i=2; i<this.catalogList.length; i++) {
                        var value = this.catalogList[i].id;
                        if(this.classNo == value){
                            this.$('#ad-topiclayout-catalog-select').val(this.classNo);
                            break;
                        }
                    }
                }
            },

            initCatalogSelect: function () {
                this.$('#ad-topiclayout-catalog-select').empty();
                for(var i=2; i<this.catalogList.length; i++) {
                    var value = this.catalogList[i].id;
                    var text = this.catalogList[i].name;
                    this.$('#ad-topiclayout-catalog-select').append("<option value='"+value+"'>"+text+"</option>");
                }
            },

            reloadChartOrderGrid: function (sortable) {
                var gridData = [];
                fish.forEach(this.chartList, function(chart){
                    var chartNo = chart.chart_no;
                    var chartName = chart.chartTitle;
                    if(!chartName){
                        chartName = "Untitled";
                    }
                    gridData[gridData.length] = {
                        id: chartNo,
                        name: chartName
                    };
                });
                this.$("#ad-topiclayout-chartorder").jqGrid({
                    data: gridData,
                    height: 150,
                    sortable:true,
                    colModel:[
                        {name:'name', width:100}
                    ]
                });
                if(sortable) {
                    this.$("#ad-topiclayout-chartorder").jqGrid('sortableRows');
                }
                this.$('#ad-topiclayout-chartorder').jqGrid("setGridWidth", 298);
                this.$('#ad-topiclayout-chartorder_name').hide();
                if(this.chartOrderList.length>0 && this.layout_type=="1"){
                    gridData = [];
                    fish.forEach(this.chartOrderList, this.wrap(function(chartOrderObj){
                        var chart_no = chartOrderObj.ECHART_NO;
                        fish.forEach(this.chartList, function(chart){
                            if(chart.chart_no == chart_no){
                                var chartName = chart.chartTitle;
                                if(!chartName){
                                    chartName = "Untitled";
                                }
                                gridData[gridData.length] = {
                                    id: chart_no,
                                    name: chartName
                                };
                            }
                        });
                    }));
                    fish.forEach(this.chartList, this.wrap(function(chart){
                        var isExist = false;
                        fish.forEach(gridData, this.wrap(function(gridItem){
                            if(gridItem.id == chart.chart_no){
                                isExist = true;
                            }
                        }));
                        if(!isExist){
                            var chartName = chart.chartTitle;
                            if(!chartName){
                                chartName = "Untitled";
                            }
                            gridData[gridData.length] = {
                                id: chart.chart_no,
                                name: chartName
                            };
                        }
                    }));
                    this.$("#ad-topiclayout-chartorder").jqGrid('reloadData', gridData);
                }
            },

            defaultLayoutSelect: function () {
                this.layout_type = 0;
                this.$('#ad-topiclayout-numperrow').val(1);
                this.$('#ad-topiclayout-numperrow').attr('disabled', 'disabled');
                this.reloadChartOrderGrid(false);
                this.$('.topiclayout-pd').removeClass('active ');
                this.$('#ad-topiclayout-default').addClass('active ');
                this.$('.ico-sheet-active').removeClass("ng-hide");
                this.$('#ad-topiclayout-simple-selected-icon').addClass('ng-hide ');
            },

            simpleLayoutSelect: function () {
                this.layout_type = 1;
                this.$('#ad-topiclayout-numperrow').removeAttr('disabled');
                this.reloadChartOrderGrid(true);
                this.$('.topiclayout-pd').removeClass('active ');
                this.$('#ad-topiclayout-simple').addClass('active ');
                this.$('.ico-sheet-active').removeClass("ng-hide");
                this.$('#ad-topiclayout-default-selected-icon').addClass('ng-hide ');
            },

            layoutTypeSelect: function (e) {
                var id = e.currentTarget.id;
                if(id=="ad-topiclayout-default"){
                    this.defaultLayoutSelect();
                }else{
                    this.simpleLayoutSelect();
                }
            },

            fnOK: function() {
                var classNo = this.$('#ad-topiclayout-catalog-select').val();
                if(!classNo){
                    fish.toast('info', this.resource.CREATE_CATALOG_ATFIRST);
                    return;
                }
                var numperrow = this.$('#ad-topiclayout-numperrow').val();
                var chartOrderData = this.$('#ad-topiclayout-chartorder').jqGrid("getRowData");
                var chartOrder = "";
                fish.forEach(chartOrderData, function(chart){
                    chartOrder += chart.id + ","
                });
                chartOrder = chartOrder.substring(0, chartOrder.length-1);
                //
                this.trigger("okEvent", {
                    classNo: classNo,
                    numperrow: numperrow,
                    layout_type: this.layout_type,
                    chartOrder: chartOrder,
                    chartOrderData: chartOrderData
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