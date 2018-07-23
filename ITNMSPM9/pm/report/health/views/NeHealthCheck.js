/**
 *
 */
define([
        'text!oss_core/pm/report/health/templates/NeHealthCheck.html',
        "oss_core/pm/report/health/assets/js/echarts-all-3",
        'frm/fish-desktop/third-party/knob/fish.knob',
        'oss_core/pm/report/health/views/TimeChooseWin',
        'oss_core/pm/util/views/Util',
        'oss_core/pm/report/health/views/NhcUtil',
        'oss_core/pm/report/health/actions/NeHealthCheckAction',
        'css!frm/fish-desktop/third-party/knob/knob.css',
        'css!oss_core/pm/util/css/ad-component.css',
        'css!oss_core/pm/util/css/ad-block.css',
        'css!oss_core/pm/report/health/assets/nehealthcheck.css'
    ],
    function(mainTpl, echarts, knob, timeChooseWin, pmUtil, nhcUtil, action) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon),
        events: {
            'click .ui-tabs-anchor': "containerRightClick",
            'click .nhc-tree-btn': 'showTreePlugWin',
            'click .ui-tabs-anchor': 'tabClick',
            'click .nhc-list-item': 'listItemClick',
            'click .nhc-choosetime-btn': 'showChooseTimeWin',
            'click .container_right': 'containerRightClick',
            'click .nhc-data-filter': 'showDataFilter',
            'click .nhc-data-order': 'showDataOrder',
            'click .nhc-data-export': 'exportData'
        },

        initialize: function (opt) {
            this.levelColor_1 = '#C70808';
            this.levelColor_2 = '#F5A123';
            this.levelColor_3 = '#3e9de1';
            this.granularity = "_H";
            this.granularityValue = "24";
            this.selectedNetypeId = "";
            this.selectedNeId = "";
            this.selectedTemplateId = "";
            this.lastColorLevel = "";
            this.maxTime = "";
            this.cachedNetype = new nhcUtil.HashMap();
            this.cachedNetypeCode = new nhcUtil.HashMap();
            this.cachedNetypeCellCol = new nhcUtil.HashMap();
            this.cachedNetypeObject = new nhcUtil.HashMap();
            this.cachedColModel = new nhcUtil.HashMap();
            this.cachedGridCountByGridDiv = new nhcUtil.HashMap();
            this.cachedFilterData = new nhcUtil.HashMap();
            this.cachedOrderData = new nhcUtil.HashMap();
            this.healthList = [];
            this.healthTrendList = [];
            this.kpiItemList = [];
            this.kpiItemWith0WeightList = [];
            this.nqiList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate());
            return this;
        },

        afterRender: function () {
            this.resetStatus();
            var self =this;
            $(".ui-tabs-anchor").on('click', function(e){
                if(e.target.id!="nhc-choosetime-btn") {
                    self.containerRightClick();
                }else{
                    return;
                }
            });
            this.loadTemplate();
            this.$("#nhc-kpidetail-grid-tabs").tabs({
                canClose:false,
                paging: true,
                autoResizable:true
            });
        },

        showTreePlugWin: function () {
            portal.require(["oss_core/pm/report/health/assets/treeWinPlug/TreePlug"],function(treePlug){
                treePlug.popup({
                    'width':900,
                    'height':600
                })
            })
        },

        initGaugeChart: function (dp) {
            var gaugeChart = echarts.init(this.$("#nhc-gauge-container")[0]);
            var option = {
                toolbox: {
                    show : false
                },
                series : [
                    {
                        name:'业务指标',
                        type:'gauge',
                        splitNumber: 10,       // 分割段数，默认为5
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.8, this.levelColor_1],[0.9, this.levelColor_2],[1, this.levelColor_3]],
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                            show: false,
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            show: true,        // 默认显示，属性show控制显示与否
                            length :30,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer : {
                            width : 5
                        },
                        title : {
                            show : true,
                            offsetCenter: [0, '-40%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        detail : {
                            formatter:'{value}',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto',
                                fontWeight: 'bolder'
                            }
                        },
                        data:dp
                    }
                ]
            };
            gaugeChart.setOption(option);
        },

        initTrendChart: function (legend, series, dpx) {
            var ymin = 100;
            fish.forEach(series, function(seryItem){
                fish.forEach(seryItem.data, function(dataValue){
                    if(dataValue<ymin){
                        ymin = dataValue;
                    }
                });
            });
            var self = this;
            var lineChart = echarts.init(this.$("#nhc-trend-container")[0]);
            option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data: legend,
                    x: "left",
                    y: "bottom"
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : dpx
                    }
                ],
                yAxis : [
                    {
                        max : 100,
                        min : ymin,
                        type : 'value'
                    }
                ],
                series : series
            };
            lineChart.setOption(option);
            lineChart.on('click', function (params) {
                var drillTime = params.name;
                var seriesIndex = params.seriesIndex;
                if(seriesIndex>0) {
                    var item_no = self.kpiItemWith0WeightList[seriesIndex - 1].ITEM_NO;
                    self.trendDrill(item_no, drillTime);
                }
            });
            //lineChart.on('legendselectchanged', function (params) {});
        },

        initKpiGridTab: function () {
            var self = this;
            this.$('#nhc-kpidetail-grid-tabs-ul').empty();
            this.$('.ui-tabs-panel').remove();
            // 概览
            var uiId = nhcUtil.guid();
            var gridDivId = 'nhc-kpidetail-grid-container-overview';
            var gridId = 'nhc-kpidetail-grid-overview';
            liClass = "ui-state-default ui-tabs-selected ui-tabs-active";
            gridDisplay = "block";
            var tabHtmlText = '<li class="'+liClass+'" role="tab" tabindex="-1" aria-controls="nhc-kpidetail-grid-b" aria-labelledby="ui-id-'+uiId+'" aria-selected="false" aria-expanded="false">'
                +'<a href="#'+gridDivId+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-'+uiId+'">OverView</a></li>';
            self.$('#nhc-kpidetail-grid-tabs-ul').append(tabHtmlText);
            var gridDivHtmlText = '<div class="ui-tabs-panel" id="'+gridDivId+'" aria-labelledby="ui-id-'+uiId+'" role="tabpanel" aria-expanded="false" aria-hidden="true" '
                +'style="display: '+gridDisplay+';"><div id="'+gridId+'"></div></div>';
            self.$('#nhc-kpidetail-grid-tabs').append(gridDivHtmlText);
            self.initKpiDetailGrid([],gridId, [], true);
            //
            fish.forEach(this.kpiItemWith0WeightList, function(item){
                var uiId = nhcUtil.guid();
                var gridDivId = 'nhc-kpidetail-grid-container-'+item.ITEM_NO;
                var gridId = 'nhc-kpidetail-grid-'+item.ITEM_NO;
                liClass = "ui-state-default";
                gridDisplay = "none";
                var tabHtmlText = '<li class="'+liClass+'" role="tab" tabindex="-1" aria-controls="nhc-kpidetail-grid-b" aria-labelledby="ui-id-'+uiId+'" aria-selected="false" aria-expanded="false">'
                    +'<a href="#'+gridDivId+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-'+uiId+'">'+item.ITEM_NAME+'</a></li>';
                self.$('#nhc-kpidetail-grid-tabs-ul').append(tabHtmlText);
                var gridDivHtmlText = '<div class="ui-tabs-panel" id="'+gridDivId+'" aria-labelledby="ui-id-'+uiId+'" role="tabpanel" aria-expanded="false" aria-hidden="true" '
                    +'style="display: '+gridDisplay+';">';
                // 二次过滤排序及导出
                gridDivHtmlText += '<div class="wrapper">'
                    +'<div class="btn-group">'
                    +'<button id="nhc-data-filter-'+item.ITEM_NO+'" class="btn btn-default dropdown-toggle nhc-data-filter" type="button">'
                    +'<i class="fa fa-filter"></i> Data Filter'
                    +'</button>'
                    +'</div>'
                    +'<div class="btn-group m-l-sm">'
                    +'<button id="nhc-data-order-'+item.ITEM_NO+'" class="btn btn-default dropdown-toggle nhc-data-order" type="button">'
                    +'<i class="fa fa-sort-amount-desc"></i> Order By'
                    +'</button>'
                    +'</div>'
                    +'<div class="pull-right">'
                    +'<a href="#" id="nhc-data-export-'+item.ITEM_NO+'" class="btn ad-link nhc-data-export">'
                    +'<i class="fa fa-download" title="Export"></i>'
                    +'</a>'
                    +'</div>'
                    +'</div>';

                gridDivHtmlText += '<div id="'+gridId+'"></div></div>';
                self.$('#nhc-kpidetail-grid-tabs').append(gridDivHtmlText);
                if(self.cachedNetypeCellCol.get(self.selectedNetypeId)){
                    var colModel = [
                        {
                            name: 'sttime',
                            label: "Sttime",
                            align: "center",
                            sortable: false
                        },{
                            name: 'city_name',
                            label: "City",
                            align: "center"
                        },{
                            name: 'cell_name',
                            label: "Cell",
                            align: "center",
                            sortable: false,
                            hidden: false
                        },
                        {
                            name: 'kpi_name',
                            label: "Kpi Name",
                            align: "center",
                            sortable: false
                        },
                        {
                            name: 'kpi_value',
                            label: "Kpi Value",
                            align: "center",
                            sortable: false
                        }
                    ];
                }else{
                    var colModel =  [
                        {
                            name: 'sttime',
                            label: "Sttime",
                            align: "center",
                            sortable: false
                        },{
                            name: 'city_name',
                            label: "City",
                            align: "center",
                            sortable: false
                        },{
                            name: 'cell_name',
                            label: "Cell",
                            align: "center",
                            sortable: false,
                            hidden: true
                        },
                        {
                            name: 'kpi_name',
                            label: "Kpi Name",
                            align: "center",
                            sortable: false
                        },
                        {
                            name: 'kpi_value',
                            label: "Kpi Value",
                            align: "center",
                            sortable: false
                        }
                    ];
                }
                self.initKpiDetailGrid(colModel,gridId, [], false);
            });
        },

        tabClick: function (e) {
            this.$('[role="tab"]').attr('class', 'ui-state-default');
            e.currentTarget.parentElement.className = "ui-state-default ui-tabs-selected ui-tabs-active";
            var fullHref = e.currentTarget.href;
            var gridDivid = fullHref.substring(fullHref.indexOf("#")+1);
            this.$('.ui-tabs-panel').hide();
            this.$('#'+gridDivid).show();
        },

        initKpiDetailGrid: function (colModel, divId, dp, isMerge) {
            var self = this;
            if(!colModel || colModel.length==0){
                colModel =  [
                    {
                        name: 'score_health',
                        label: "Health Score",
                        align: "center",
                        sortable: false,
                        formatter: function(cellval, opts, rwdat, _act) {
                            var compareText = "";
                            if(rwdat.score_health_compare_type=="1"){
                                compareText = '<i style="color:#3e9de1" class="fa fa-arrow-up"></i>';
                            }else{
                                compareText = '<i style="color:#d2100e" class="fa fa-arrow-down"></i>';
                            }
                            var returnText = rwdat.score_health_name+"：<text style='color:"+self.wrapColorByValue(cellval)+"'>"+cellval+"</text> "
                                + "</br>Link relative ratio " + compareText + " " + ((rwdat.score_health_compare+"")==""?"":rwdat.score_health_compare.toFixed(2));
                            return returnText;
                        }
                    },{
                        name: 'sub_score_health',
                        label: "Check Item Score",
                        align: "center",
                        sortable: false,
                        formatter: function(cellval, opts, rwdat, _act) {
                            var compareText = "";
                            if(rwdat.sub_score_health_compare_type=="1"){
                                compareText = '<i style="color:#3e9de1" class="fa fa-arrow-up"></i>';
                            }else{
                                compareText = '<i style="color:#d2100e" class="fa fa-arrow-down"></i>';
                            }
                            var returnText = rwdat.sub_score_health_name+"：<text style='color:"+self.wrapColorByValue(cellval)+"'>"+cellval+"</text> "
                                + "</br>Link relative ratio " + compareText + " " + ((rwdat.sub_score_health_compare+"")==""?"":rwdat.sub_score_health_compare.toFixed(2));
                            return returnText;
                        }
                    },{
                        name: 'kqi_name',
                        label: "KQI Name",
                        align: "center",
                        sortable: false
                    },{
                        name: 'kqi_score',
                        label: "KQI Score",
                        align: "center",
                        sortable: false
                    },{
                        name: 'kpi_name',
                        label: "KPI Name",
                        align: "center",
                        sortable: false
                    },{
                        name: 'kpi_value',
                        label: "KPI Value",
                        align: "center",
                        sortable: false
                    }
                ];
            }
            this.createGrid(colModel,dp,dp.length,divId, isMerge);
        },

        createGrid: function(colModel, dp, gridCount, divId, isMerge) {
            var self = this;
            if(isMerge) {
                var opt = {
                    shrinkToFit:(colModel.length < 10),
                    data: dp,
                    height: 300,
                    colModel: colModel
                };
            }else {
                var dpObj = {
                    "rows": dp,
                    "page": 1,
                    "records": gridCount
                }
                var opt = {
                    datatype: "json",
                    shrinkToFit:(colModel.length < 10),
                    data: dpObj,
                    height: 300,
                    colModel: colModel,
                    pagebar: true,
                    pager: true,
                    rowNum: 20,
                    rowList: [10, 20, 50, 100],
                    pageData: function(page, rowNum){
                        _.delay(function () {
                            self.loadGridData(divId, page, rowNum);
                        }, 100);
                        return false;
                    }.bind(this)
                };
            }
            var grid = this.$("#"+divId).grid(opt);
            if(isMerge) {
                grid.grid("mergeColCellByData", [0, 1]);
            }
            this.$("#"+divId).jqGrid("setGridWidth", this.$('#nhc-kpidetail-grid-tabs').width()-20);
            //蓝底白字
            this.$("[role='columnheader']").css("background-color", "#039cfd");
            this.$(".ui-jqgrid-sortable").css("text-align", "center");
            this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
        },

        trendDrill: function (item_no, drillTime) {
            var self = this;
            portal.require([
                "oss_core/pm/report/health/views/TrendDrillWin"
            ], this.wrap(function (Dialog) {
                var sData = {
                    TEMPLATE_ID: self.selectedTemplateId,
                    NETTYPE_ID: self.selectedNetypeId,
                    GRANU: self.granularity,
                    BTIME: drillTime,
                    ETIME: drillTime,
                    NE_ID: self.selectedNeId,
                    item_no: item_no,
                    nqiList: self.nqiList,
                    hasCellCol: self.cachedNetypeCellCol.get(self.selectedNetypeId)?true:false
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 400
                };
                this.trendDrillView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.trendDrillView.close();
                }));
            }));
        },

        resetStatus: function () {
            this.$('#nhc-right-heading').empty();
            this.$('.nhc-choosetime-btn').attr('disabled','disabled');
            this.initGaugeChart([{value: 0, name: ''}]);
            this.initTrendChart([], [], []);
            this.initKpiGridTab();
            this.$('#nhc-kpi1-image').attr("xlink:href", "oss_core/pm/report/health/assets/img/levelColor_gray.png");
            this.$('#nhc-kpi2-image').attr("xlink:href", "oss_core/pm/report/health/assets/img/levelColor_gray.png");
            this.$('#nhc-kpi3-image').attr("xlink:href", "oss_core/pm/report/health/assets/img/levelColor_gray.png");
            this.$('#nhc-kpi1-2-rect').attr("fill", "url(#lg_gray_gray)");
            this.$('#nhc-kpi2-3-rect').attr("fill", "url(#lg_gray_gray)");
            this.$('#nhc-kpi1-score').html("");
            this.$('#nhc-kpi2-score').html("");
            this.$('#nhc-kpi3-score').html("");
            this.$('#nhc-kpi1-score-text').attr("fill", "#3598db");
            this.$('#nhc-kpi2-score-text').attr("fill", "#3598db");
            this.$('#nhc-kpi3-score-text').attr("fill", "#3598db");
            this.$('#nhc-kpi1-name').html("");
            this.$('#nhc-kpi2-name').html("");
            this.$('#nhc-kpi3-name').html("");
        },

        loadTemplate: function () {
            var self = this;
            var sql = "SELECT TEMPLATE_ID,TEMPLATE_NAME FROM PM_NEHEALTHCHECK_INFO ORDER BY DISP_ORDER";
            pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                if(data && data.resultList){
                    var ds = [];
                    fish.forEach(data.resultList,function(item){
                        ds[ds.length] = {
                            name: item.TEMPLATE_NAME,
                            value: item.TEMPLATE_ID
                        }
                    });
                    self.$templateCombobox = self.$('#nhc-template-combobox').combobox({
                        dataTextField: 'name',
                        dataValueField: 'value',
                        dataSource: ds
                    });
                    self.$templateCombobox.combobox('setEditable', false);
                    if(ds.length>0){
                        self.$templateCombobox.combobox('value', ds[0].value);
                        self.templateChange();
                    }
                    self.$templateCombobox.on('combobox:change', function () {
                        self.templateChange();
                    });
                }
            }.bind(this),true);
        },

        templateChange: function () {
            var template_id = this.$templateCombobox.combobox('value');
            this.loadNetype(template_id);
        },

        loadNetype: function (template_id) {
            var self = this;
            var sql = "SELECT NETTYPE_NAME,NETTYPE_ID,NETTYPE_CODE DIM_CODE,CELL_COL,DIM_EXT_COND,IS_SELECTED FROM PM_NEHEALTHCHECK_NETYPE "
                    + "WHERE TEMPLATE_ID ='" + template_id + "'";
            pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                if(data && data.resultList) {
                    var ds = [];
                    var defaultSelected = [];
                    fish.forEach(data.resultList, function (item) {
                        self.cachedNetypeObject.put(item.NETTYPE_ID, item);
                        self.cachedNetype.put(item.NETTYPE_ID, item.NETTYPE_NAME);
                        self.cachedNetypeCode.put(item.NETTYPE_ID, item.DIM_CODE);
                        self.cachedNetypeCellCol.put(item.NETTYPE_ID, item.CELL_COL);
                        ds[ds.length] = {
                            name: item.NETTYPE_NAME,
                            id: item.NETTYPE_ID,
                            pId: 0,
                            code: item.DIM_CODE
                        }
                        if(item.IS_SELECTED=="1"){
                            defaultSelected[defaultSelected.length] = item.NETTYPE_NAME;
                        }
                    });
                    var options = {
                        check: {
                            enable: true,
                            chkboxType: {"Y":"", "N":""}
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        fNodes: ds
                    };
                    self.$('#nhc-netype-select').combotree('destroy');
                    self.$('#nhc-netype-select').combotree(options);
                    if(ds.length>0){
                        self.$('#nhc-netype-select').combotree('value', ds[0].name);
                    }
                    self.$('#nhc-netype-select').off();
                    self.$('#nhc-netype-select').on('combotree:change', function(e, data) {
                        var nodes = data.selectNodes,
                            i, l = nodes.length, res = [];
                        for(i = 0; i < l; i++) {
                            res[i] = nodes[i].id;
                        }
                        self.loadLeftListData();
                    });
                    self.loadLeftListData();
                }
            });
        },

        loadLeftListData: function(refreshNow) {
            this.resetStatus();
            var self = this;
            var templateId = this.$templateCombobox.combobox('value');
            var netypeId = "";
            var netypeList = this.$('#nhc-netype-select').combotree('value');
            if(netypeList.length==0){
                this.$("#nhc-nelist-container").empty();
            }
            for(var i=0;netypeList && i<netypeList.length;i++){
                var netypeItem = netypeList[i];
                if(i!=netypeList.length-1){
                    netypeId += netypeItem.id + ",";
                }else{
                    netypeId += netypeItem.id;
                }
            }
            if((!templateId || templateId=="") && !refreshNow){
                this.selectedTemplateId = ""
                return;
            }
            if(netypeId=="" && !refreshNow){
                this.selectedNetypeId = "";
                return;
            }
            if(this.selectedTemplateId==templateId && this.selectedNetypeId==netypeId && !refreshNow){

            }else{
                this.selectedTemplateId=templateId;
                this.selectedNetypeId=netypeId;
                var netypeList = netypeId.split(",");
                self.kpiItemList = [];
                self.kpiItemWith0WeightList = [];
                var sql = "SELECT ITEM_NAME,ITEM_NO,WEIGHT FROM PM_NEHEALTHCHECK_LIST WHERE TEMPLATE_ID='"+self.selectedTemplateId
                    + "' AND NETTYPE_ID='"+netypeList[0]+"' AND ITEM_STATE='1' ORDER BY DISP_ORDER";
                pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                    if (data && data.resultList) {
                        for (var i = 0; i < data.resultList.length; i++) {
                            var item = data.resultList[i];
                            if (item.WEIGHT != 0) {
                                var ITEM_NO = item.ITEM_NO;
                                var ITEM_NAME = item.ITEM_NAME;
                                self.$('#nhc-kpi' + (i + 1) + '-name').html(ITEM_NAME);
                                self.kpiItemList[self.kpiItemList.length] = item;
                            }
                            self.kpiItemWith0WeightList[self.kpiItemWith0WeightList.length] = item;
                        }
                        self.initKpiGridTab();
                    }
                });
                this.$("#nhc-nelist-container").empty();
                this.loadHealthScore();
            }
        },

        loadHealthScore: function() {
            var self = this;
            self.healthList = [];
            var netypeList = this.selectedNetypeId.split(",");
            var hasClickFirstNe = false;
            fish.forEach(netypeList, function(netypeid) {
                /////////////////////
                var dim_code = self.cachedNetypeCode.get(netypeid);
                action.metaDimQuery({
                    DIM_CODE: dim_code
                }, function (ret) {
                    var dimScript = "";
                    if (ret.scriptList && ret.scriptList.length > 0) {
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                        var dim_ext_cond = "";
                        if(self.cachedNetypeObject.get(netypeid)){
                            dim_ext_cond = self.cachedNetypeObject.get(netypeid).DIM_EXT_COND;
                        }
                        if(dim_ext_cond){
                            dimScript = "select * from (" + dimScript + ") " + dim_ext_cond;
                        }
                    }
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, function (ret) {
                        var neList = [];
                        if (ret.resultList && ret.resultList.length > 0) {
                            fish.forEach(ret.resultList, function (item) {
                                neList[neList.length] = {
                                    ne_id: item.ID,
                                    ne_name: item.NAME,
                                    ne_score: 999
                                }
                            });
                        }
                        action.healthScoreQuery({
                            TEMPLATE_ID: self.selectedTemplateId,
                            NETTYPE_ID: netypeid,
                            GRANU: self.granularity
                        }, function(ret){
                            if(ret.healthList && ret.healthList.length>0) {
                                fish.forEach(ret.healthList, function (item) {
                                    fish.forEach(neList, function (ne) {
                                        if (ne.ne_id == item.NE_ID) {
                                            ne.ne_score = item.SCORE_HEALTH;
                                        }
                                    });
                                    self.healthList[self.healthList.length] = item;
                                });
                            }
                            neList.sort(function(a,b){
                                return a.ne_score-b.ne_score;
                            });
                            if(neList.length>0){
                                var containerHeight = 22 + neList.length * 31;
                                var netypename = self.cachedNetype.get(netypeid);
                                var htmlText = '<div style="height:' + containerHeight + 'px" class="m-t-sm" name="nhc-nelist-' + netypeid + '">'
                                    + '<h5>' + netypename + '：</h5>'
                                    + '<div class="list-group m-b-none" >';
                                fish.forEach(neList, function (ne){
                                    var score = ne.ne_score;
                                    var scoreClass = "";
                                    if(score == 999){
                                        scoreClass = "nhc-bg-normal";
                                        score = "";
                                    }else if(score<80){
                                        scoreClass = "nhc-bg-danger";
                                    }else if(score<90){
                                        scoreClass = "nhc-bg-warning";
                                    }else{
                                        scoreClass = "nhc-bg-success";
                                    }
                                    htmlText += '<a name="'+netypeid+'" title="'+ne.ne_name+'" id="nhc-ne-'+ne.ne_id+'" class="nhc-list-item list-group-item">'
                                    + ne.ne_name
                                    + '<span class="badge '+scoreClass+'" id="nhc-nescore-'+ne.ne_id+'">'+score+'</span></a>';
                                });
                                htmlText += '</div></div>';
                                self.$("#nhc-nelist-container").append(htmlText);
                                if(!hasClickFirstNe){
                                    self.listItemClickFunc('nhc-ne-'+neList[0].ne_id);
                                    hasClickFirstNe = true;
                                }
                            }
                        });
                        ////////////////////////
                    });
                });
            });
        },

        // 点击网元
        listItemClick: function (e) {
            this.listItemClickFunc(e.currentTarget.id);
        },

        listItemClickFunc: function (divId) {
            this.resetStatus();
            var self = this;
            this.$('.nhc-list-item').removeClass('active');
            var divObject = this.$('#'+divId)[0];
            divObject.className += " active";
            var ne_id = divObject.id.substring(7);
            this.selectedNeId = ne_id;
            this.selectedNeName = divObject.title;
            var ne_name = divObject.title;
            self.selectedNetypeId = divObject.name;
            var hasScore = false;
            self.kpiItemList = [];
            self.kpiItemWith0WeightList = [];
            var sql = "SELECT ITEM_NAME,ITEM_NO,WEIGHT FROM PM_NEHEALTHCHECK_LIST WHERE TEMPLATE_ID='"+self.selectedTemplateId
                + "' AND NETTYPE_ID='"+self.selectedNetypeId+"' AND ITEM_STATE='1' ORDER BY DISP_ORDER";
            pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                if (data && data.resultList) {
                    for(var i=0;i<data.resultList.length;i++){
                        var item = data.resultList[i];
                        if(item.WEIGHT!=0) {
                            var ITEM_NO = item.ITEM_NO;
                            var ITEM_NAME = item.ITEM_NAME;
                            self.$('#nhc-kpi' + (i + 1) + '-name').html(ITEM_NAME);
                            self.kpiItemList[self.kpiItemList.length] = item;
                        }
                        self.kpiItemWith0WeightList[self.kpiItemWith0WeightList.length] = item;
                    }
                    self.initKpiGridTab();
                }
                fish.forEach(self.healthList, function(item){
                    if(item.NE_ID == ne_id){
                        var healthScore = item.SCORE_HEALTH;
                        hasScore = true;
                        self.sttime = item.STTIME;
                        self.$('#nhc-right-heading').html('<span class="panel-title">'+ne_name+'Health Score</span>'
                        + 'Final Assessment Time：'+self.sttime+'</div>');
                        self.initGaugeChart([{value: healthScore, name: ''}]);
                        self.$('.nhc-choosetime-btn').removeAttr('disabled');
                        for(var i=0;i<self.kpiItemList.length;i++){
                            var kpiItem = self.kpiItemList[i];
                            var ITEM_NO = kpiItem.ITEM_NO;
                            var kpiScore = item['SCORE_'+ITEM_NO];
                            self.renderKpiScore(kpiItem,kpiScore,i+1);
                        }
                    }
                });
                if(!hasScore) {
                    for(var i=0;i<self.kpiItemList.length;i++){
                        var kpiItem = self.kpiItemList[i];
                        var ITEM_NO = kpiItem.ITEM_NO;
                        var kpiScore = "";
                        self.renderKpiScore(kpiItem,kpiScore,i+1);
                    }
                }else{
                    self.btime = self.getBtimeFromEtime(self.granularityValue);
                    self.loadNeTrend();
                }
            });
        },

        loadNeTrend: function () {
            var self = this;
            action.healthScoreQuery({
                    TEMPLATE_ID: self.selectedTemplateId,
                    NETTYPE_ID: self.selectedNetypeId,
                    GRANU: self.granularity,
                    BTIME: self.btime,
                    ETIME: self.sttime,
                    NE_ID: self.selectedNeId
                }, function(ret) {
                var legend = [];
                var series = [];
                var dpx = [];
                var kpiCodes = [];
                self.healthTrendList = [];
                if (ret.healthList && ret.healthList.length > 0) {
                    self.healthTrendList = ret.healthList;
                    legend[legend.length] = "Final score";
                    series[series.length] = {
                        name:'Final score',
                        type:'line',
                        data:[]
                    }
                    kpiCodes[kpiCodes.length] = "SCORE_HEALTH";
                    fish.forEach(self.kpiItemList, function(kpiItem){
                        legend[legend.length] = kpiItem.ITEM_NAME;
                        kpiCodes[kpiCodes.length] = "SCORE_"+kpiItem.ITEM_NO;
                        series[series.length] = {
                            name:kpiItem.ITEM_NAME,
                            type:'line',
                            data:[]
                        }
                    });
                    fish.forEach(ret.healthList, function (item) {
                        dpx[dpx.length] = item.STTIME;
                        for(var i=0;i<series.length;i++){
                            var seryItem = series[i];
                            seryItem.data[seryItem.data.length] = item[kpiCodes[i]];
                        }
                    });
                }
                self.initTrendChart(legend, series, dpx);
                ////////////////////////////////////////
                sql = "SELECT NQI_NAME,NQI_NO,NQI.KPI_CODE,KPI.KPI_NAME,ITEM_NO FROM PM_NEHEALTHCHECK_NQI NQI,PM_KPI KPI "
                + "WHERE NQI.KPI_CODE = KPI.KPI_CODE AND TEMPLATE_ID='"+self.selectedTemplateId+"' AND NETTYPE_ID='"+self.selectedNetypeId+"' AND SEQ=0 AND NQI_STATE=1";
                self.nqiList = [];
                pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                    if (data && data.resultList) {
                        self.nqiList = data.resultList;
                    }
                    self.loadKpiGrid();
                });
            });
        },

        loadKpiGrid: function () {
            var self = this;
            this.loadOverviewGridDetail();
            fish.forEach(self.kpiItemWith0WeightList, function(checkItem){
                self.loadKpiDetailGrid(checkItem.ITEM_NO);
            });
        },

        loadKpiDetailGrid: function (itemNo) {
            var self = this;
            var queryParam = {
                TEMPLATE_ID: self.selectedTemplateId,
                NETTYPE_ID: self.selectedNetypeId,
                GRANU: self.granularity,
                BTIME: self.btime,
                ETIME: self.sttime,
                NE_ID: self.selectedNeId
            };
            // 二次过滤
            var filterData = self.cachedFilterData.get(itemNo);
            if(filterData!=null){
                queryParam["condition_option"] = filterData.condition_option;
                var filter_condition = [];
                fish.forEach(filterData.condition, function(conditionItem){
                    var dateType = "";
                    var field = conditionItem.field;
                    if(field=="STTIME"){
                        dateType = 2;
                    }else if(field=="CITY_NAME" || field=="CELL_NAME"){
                        dateType = 3
                    }else{
                        dateType = 1
                    }
                    filter_condition[filter_condition.length] = {
                        field: field,
                        operators: conditionItem.operators,
                        value: conditionItem.value,
                        dataType: dateType
                    }
                });
                queryParam["filter_condition"] = filter_condition;
            }
            // 二次排序
            var orderData = self.cachedOrderData.get(itemNo);
            if(orderData!=null){
                var order_condition = [];
                fish.forEach(orderData.condition, function(conditionItem){
                    var field = conditionItem.field;
                    var desc_asc = conditionItem.desc_asc;
                    order_condition[order_condition.length] = {
                        field: field,
                        desc_asc: desc_asc
                    }
                });
                queryParam["order_condition"] = order_condition;
            }
            action.healthKpiQuery(queryParam, function(ret){
                if(ret && ret.kpiList){
                    var gridCount = ret.kpiList[0].COUNT;
                    self.cachedGridCountByGridDiv.put('nhc-kpidetail-grid-'+itemNo, gridCount);
                }
                queryParam["page"] = "1";
                queryParam["rowNum"] = "20";
                action.healthKpiQuery(queryParam, function(ret) {
                    if(ret && ret.kpiList){
                        var cellKpiList = ret.kpiList;
                    }
                    self.loadCheckItemGridDetail(cellKpiList, gridCount, itemNo);
                });
            });
        },

        loadGridData: function (divId, page, rowNum) { //请求服务器获取数据的方法
            var self = this;
            var dp = [];
            var item_no = divId.substring(19);
            rowNum = rowNum || this.$("#"+divId).grid("getGridParam", "rowNum");
            var queryParam = {
                TEMPLATE_ID: self.selectedTemplateId,
                NETTYPE_ID: self.selectedNetypeId,
                GRANU: self.granularity,
                BTIME: self.btime,
                ETIME: self.sttime,
                NE_ID: self.selectedNeId,
                page: page,
                rowNum: rowNum
            };
            //
            var filterData = self.cachedFilterData.get(item_no);
            if(filterData!=null){
                queryParam["condition_option"] = filterData.condition_option;
                var filter_condition = [];
                fish.forEach(filterData.condition, function(conditionItem){
                    var dateType = "";
                    var field = conditionItem.field;
                    if(field=="STTIME"){
                        dateType = "date";
                    }
                    filter_condition[filter_condition.length] = {
                        field: field,
                        operators: conditionItem.operators,
                        value: conditionItem.value,
                        dataType: dateType
                    }
                });
                queryParam["filter_condition"] = filter_condition;
            }
            var orderData = self.cachedOrderData.get(item_no);
            if(orderData!=null){
                var order_condition = [];
                fish.forEach(orderData.condition, function(conditionItem){
                    var field = conditionItem.field;
                    var desc_asc = conditionItem.desc_asc;
                    order_condition[order_condition.length] = {
                        field: field,
                        desc_asc: desc_asc
                    }
                });
                queryParam["order_condition"] = order_condition;
            }
            action.healthKpiQuery(queryParam, function(ret) {
                if(ret && ret.kpiList){
                    var cellKpiList = ret.kpiList;
                }
                var kpiList = [];
                fish.forEach(self.nqiList, function(item){
                    if(item.ITEM_NO == item_no){
                        kpiList[kpiList.length] = item;
                    }
                });
                //
                fish.forEach(cellKpiList, function(kpiItem){
                    if(!kpiItem.hasOwnProperty("CITY_NAME")){
                        kpiItem["CITY_NAME"] = "";
                    }
                    var dpItem = {
                        STTIME: kpiItem.STTIME,
                        CITY_NAME: kpiItem.CITY_NAME,
                        CELL_NAME: (kpiItem.hasOwnProperty("CELL_NAME")?kpiItem.CELL_NAME:"")
                    }
                    fish.forEach(kpiList, function(kpi){
                        dpItem[kpi.KPI_CODE] = kpiItem[kpi.KPI_CODE];
                    });
                    dp[dp.length] = dpItem;
                });
                this.$("#"+divId).grid("reloadData", {
                    "rows": dp,
                    "page": page,
                    "records": self.cachedGridCountByGridDiv.get(divId)
                });
            });
        },

        wrapColorByValue: function (kpiScore) {
            if(kpiScore<80){
                fillColor = this.levelColor_1;
            }else if(kpiScore<90){
                fillColor = this.levelColor_2;
            }else{
                fillColor = this.levelColor_3;
            }
            return fillColor;
        },

        loadOverviewGridDetail: function () {
            var self = this;
            var dp = [];
            var compareTime = this.getBtimeFromEtime(1);
            fish.forEach(self.healthList, function(item){
                if(item.NE_ID == self.selectedNeId){
                    // 获取Link relative ratio项
                    var compareItem;
                    fish.forEach(self.healthTrendList, function(compareTmpItem){
                        if(compareTmpItem.NE_ID == self.selectedNeId && compareTmpItem.STTIME==compareTime) {
                            compareItem = compareTmpItem;
                        }
                    });
                    var healthScore = item.SCORE_HEALTH;
                    var healthScore_compare = "";
                    var healthScore_compare_type = "1";
                    if(compareItem){
                        healthScore_compare = healthScore-compareItem.SCORE_HEALTH;
                        if(parseFloat(healthScore)<parseFloat(compareItem.SCORE_HEALTH)){
                            healthScore_compare_type = "0";
                            healthScore_compare = 0-healthScore_compare;
                        }
                    }
                    fish.forEach(self.kpiItemList, function(subQoeItem){
                        var itemNo = subQoeItem.ITEM_NO;
                        var itemName = subQoeItem.ITEM_NAME;
                        var subQoeScore = item["SCORE_"+itemNo];
                        var subQoeScore_compare = "";
                        var subQoeScore_compare_type = "1";
                        if(compareItem){
                            subQoeScore_compare = subQoeScore-compareItem["SCORE_"+itemNo];
                            if(parseFloat(subQoeScore)<parseFloat(compareItem["SCORE_"+itemNo])){
                                subQoeScore_compare_type = "0";
                                subQoeScore_compare = 0-subQoeScore_compare;
                            }
                        }
                        fish.forEach(self.nqiList, function(nqiItem){
                            var nqi_name = nqiItem.NQI_NAME;
                            var nqi_no = nqiItem.NQI_NO;
                            var kpi_code = nqiItem.KPI_CODE;
                            var kpi_name = nqiItem.KPI_NAME;
                            var item_no = nqiItem.ITEM_NO;
                            if(itemNo == item_no){
                                kqi_score = item["SCORE_"+nqi_no];
                                kpi_value = item[kpi_code];
                                dp[dp.length] = {
                                    score_health_name: "Final score",
                                    score_health: healthScore,
                                    score_health_compare:healthScore_compare,
                                    score_health_compare_type:healthScore_compare_type,
                                    sub_score_health_name: itemName,
                                    sub_score_health: subQoeScore,
                                    sub_score_health_compare: subQoeScore_compare,
                                    sub_score_health_compare_type: subQoeScore_compare_type,
                                    kqi_name: nqi_name,
                                    kqi_score: kqi_score,
                                    kpi_name: kpi_name,
                                    kpi_value: kpi_value
                                }
                            }
                        });
                    });
                }
            });
            this.initKpiDetailGrid([], "nhc-kpidetail-grid-overview", dp, true);
        },

        loadCheckItemGridDetail: function (cellKpiList, gridCount, itemNo) {
            var self = this;
            var dp = [];
            var hasCellCol = this.cachedNetypeCellCol.get(self.selectedNetypeId)?true:false;
            var colModel =  [
                {
                    name: 'STTIME',
                    label: "Sttime",
                    align: "center",
                    sortable: false
                },{
                    name: 'CITY_NAME',
                    label: "City",
                    align: "center",
                    sortable: false
                },{
                    name: 'CELL_NAME',
                    label: "Cell",
                    align: "center",
                    sortable: false,
                    hidden: !hasCellCol
                }
            ];
            var kpiList = [];
            fish.forEach(this.nqiList, function(item){
                if(item.ITEM_NO == itemNo){
                    kpiList[kpiList.length] = item;
                    colModel[colModel.length] = {
                        name: item.KPI_CODE,
                        label: item.KPI_NAME,
                        align: "center",
                        sortable: false
                    }
                }
            });
            //
            fish.forEach(cellKpiList, function(kpiItem){
                if(!kpiItem.hasOwnProperty("CITY_NAME")){
                    kpiItem["CITY_NAME"] = "";
                }
                var dpItem = {
                    STTIME: kpiItem.STTIME,
                    CITY_NAME: kpiItem.CITY_NAME,
                    CELL_NAME: (kpiItem.hasOwnProperty("CELL_NAME")?kpiItem.CELL_NAME:"")
                }
                fish.forEach(kpiList, function(kpi){
                    dpItem[kpi.KPI_CODE] = kpiItem[kpi.KPI_CODE];
                });
                dp[dp.length] = dpItem;
            })
            this.cachedColModel.put(itemNo, colModel);
            this.createGrid(colModel, dp, gridCount, "nhc-kpidetail-grid-"+itemNo, false);
        },

        getBtimeFromEtime: function (granularityValue) {
            var etime = this.sttime;
            var granularity = this.granularity;
            var edate = new Date(Date.parse(etime.replace(/-/g,"/")));
            if(granularity=="_H"){
                edate.setHours(edate.getHours() - granularityValue);
                var btime = nhcUtil.formatCSTDate(edate, 'yyyy-MM-dd hh:mm:ss');
            }else if(granularity=="_D"){
                edate.setDate(edate.getDate() - granularityValue);
                var btime = nhcUtil.formatCSTDate(edate, 'yyyy-MM-dd');
                btime = btime.substring(0,10);
            }
            return btime;
        },

        renderKpiScore: function(kpiItem, kpiScore, kpiIndex) {
            var ITEM_NAME = kpiItem.ITEM_NAME;
            this.$('#nhc-kpi'+kpiIndex+'-name').html(ITEM_NAME);
            this.$('#nhc-kpi'+kpiIndex+'-score').html(kpiScore);
            var imageUrl = "";
            var fillColor = "";
            var colorLevel ;
            if(kpiScore==""){
                imageUrl = "oss_core/pm/report/health/assets/img/levelColor_gray.png";
                fillColor = "#3598db";
                colorLevel = "gray";
            }else if(kpiScore<80){
                imageUrl = "oss_core/pm/report/health/assets/img/levelColor_1.png";
                fillColor = this.levelColor_1;
                colorLevel = 1;
            }else if(kpiScore<90){
                imageUrl = "oss_core/pm/report/health/assets/img/levelColor_2.png";
                fillColor = this.levelColor_2;
                colorLevel = 2;
            }else{
                imageUrl = "oss_core/pm/report/health/assets/img/levelColor_3.png";
                fillColor = this.levelColor_3;
                colorLevel = 3;
            }
            this.$('#nhc-kpi'+kpiIndex+'-image').attr("xlink:href", imageUrl);
            this.$('#nhc-kpi'+kpiIndex+'-score-text').attr("fill", fillColor);
            if(this.lastColorLevel == ""){

            }else if(kpiIndex==2){
                this.$('#nhc-kpi1-2-rect').attr("fill", "url(#lg_"+this.lastColorLevel+"_"+colorLevel+")");
            }else if(kpiIndex==3){
                this.$('#nhc-kpi2-3-rect').attr("fill", "url(#lg_"+this.lastColorLevel+"_"+colorLevel+")");
            }
            this.lastColorLevel = colorLevel;
        },

        showChooseTimeWin: function () {
            var self = this;
            var leftPosition = this.$el.parents(".tabs_nav").outerWidth()-456;
            var topPosition = this.$el.parents(".tabs_nav").outerHeight()-456-68;
            var sData = {
                leftPosition: leftPosition,
                topPosition: topPosition,
                granularity: self.granularity,
                granularityValue: self.granularityValue
            };
            var dialog = new timeChooseWin(sData);
            var content = dialog.render().$el;
            var option = {
                content: content,
                width: 450,
                height: 210,
                modal: false
            };
            this.timeChooseView = fish.popup(option);
            dialog.contentReady();
            this.listenTo(dialog, 'okEvent', function (data) {
                self.granularity = data.granularity;
                self.granularityValue = data.granularityValue;
                self.timeChooseView.close();
                /*self.btime = self.getBtimeFromEtime(self.granularityValue);
                self.loadNeTrend();
                self.loadKpiGrid();*/
                self.loadLeftListData(true);
            });
            this.listenTo(dialog, 'cancelEvent',function () {
                self.timeChooseView.close();
            });
        },

        // 二次过滤
        showDataFilter: function(e){
            var self = this;
            var btnId = e.currentTarget.id;
            var itemNo = btnId.substring(16);
            var colModel = this.cachedColModel.get(itemNo);
            var options = {
                i18nData : this.i18nData,
                pmUtil	 : pmUtil,
                colModel : colModel,
                FilterData: self.cachedFilterData.get(itemNo)
            };
            fish.popupView({
                url: "oss_core/pm/report/health/views/DataFilter",
                viewOption: options,
                callback: function(popup, view) {

                }.bind(this),
                close: function(retData) {
                    self.cachedFilterData.put(itemNo, retData);
                    if(!retData.hasOwnProperty("condition")){
                        self.cachedFilterData.put(itemNo, null);
                    }
                    self.loadKpiDetailGrid(itemNo);
                }.bind(this)
            });
        },

        // 二次排序
        showDataOrder: function(e){
            var self = this;
            var btnId = e.currentTarget.id;
            var itemNo = btnId.substring(15);
            var colModel = this.cachedColModel.get(itemNo);
            var options = {
                i18nData : this.i18nData,
                pmUtil	 : pmUtil,
                colModel : colModel,
                orderData: self.cachedOrderData.get(itemNo)
            };
            fish.popupView({
                url: "oss_core/pm/report/health/views/DataOrder",
                viewOption: options,
                callback: function(popup, view) {

                }.bind(this),
                close: function(retData) {
                    self.cachedOrderData.put(itemNo, retData);
                    if(!retData.hasOwnProperty("condition")){
                        self.cachedOrderData.put(itemNo, null);
                    }
                    self.loadKpiDetailGrid(itemNo);
                }.bind(this)
            });
        },

        exportData: function (e) {
            var self = this;
            var itemNo = e.currentTarget.id.substring(16);
            var queryParam = {
                TEMPLATE_ID: self.selectedTemplateId,
                NETTYPE_ID: self.selectedNetypeId,
                GRANU: self.granularity,
                BTIME: self.btime,
                ETIME: self.sttime,
                NE_ID: self.selectedNeId
            };
            // 二次过滤
            var filterData = self.cachedFilterData.get(itemNo);
            if(filterData!=null){
                queryParam["condition_option"] = filterData.condition_option;
                var filter_condition = [];
                fish.forEach(filterData.condition, function(conditionItem){
                    var dateType = "";
                    var field = conditionItem.field;
                    if(field=="STTIME"){
                        dateType = "date";
                    }
                    filter_condition[filter_condition.length] = {
                        field: field,
                        operators: conditionItem.operators,
                        value: conditionItem.value,
                        dataType: dateType
                    }
                });
                queryParam["filter_condition"] = filter_condition;
            }
            // 二次排序
            var orderData = self.cachedOrderData.get(itemNo);
            if(orderData!=null){
                var order_condition = [];
                fish.forEach(orderData.condition, function(conditionItem){
                    var field = conditionItem.field;
                    var desc_asc = conditionItem.desc_asc;
                    order_condition[order_condition.length] = {
                        field: field,
                        desc_asc: desc_asc
                    }
                });
                queryParam["order_condition"] = order_condition;
            }
            queryParam["isExport"] = 1;
            queryParam["colModel"] = this.cachedColModel.get(itemNo);
            action.healthKpiQuery(queryParam, this.wrap(function (data) {
                var filePath = data.fileName;
                var url = portal.appGlobal.attributes.webroot + '/download?filePath=' + filePath;
                var down = $('<a href="undefine.htm" ></a>');
                down.attr("href",url);
                down.appendTo('body');
                down[0].click();
                down.remove();
            }));
        },

        containerRightClick: function () {
            if(this.timeChooseView){
                this.timeChooseView.close();
            }
        },

        resize: function () {
            this.uiContainerHeight = this.$el.parents(".tabs_nav").outerHeight();
            this.leftListHeight = this.uiContainerHeight - 173;
            this.$el.find("#nhc-nelist-container").css({'height': + this.leftListHeight + 'px'});
            this.$el.find(".container_right").css({'height': + (this.leftListHeight+90) + 'px'});
        }

    })
});