/**
 *
 */
define([
        'text!oss_core/pm/report/health/templates/TrendDrillWin.html',
        'oss_core/pm/report/health/actions/NeHealthCheckAction'
    ],
    function(ShareTopicCfgView, action) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}),
            //加载模板
            template: fish.compile(ShareTopicCfgView),

            events : {

            },

            initialize: function(inParam) {
                this.inParam = inParam;
                this.gridCount = 0;
                this.cellKpiList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                var item_no = self.inParam.item_no;
                this.cellKpiList = [];
                action.healthKpiQuery({
                    TEMPLATE_ID: self.inParam.TEMPLATE_ID,
                    NETTYPE_ID: self.inParam.NETTYPE_ID,
                    GRANU: self.inParam.GRANU,
                    BTIME: self.inParam.BTIME,
                    ETIME: self.inParam.ETIME,
                    NE_ID: self.inParam.NE_ID
                }, function(ret) {
                    if(ret && ret.kpiList){
                        self.gridCount = ret.kpiList[0].COUNT;
                    }
                });
                action.healthKpiQuery({
                    TEMPLATE_ID: self.inParam.TEMPLATE_ID,
                    NETTYPE_ID: self.inParam.NETTYPE_ID,
                    GRANU: self.inParam.GRANU,
                    BTIME: self.inParam.BTIME,
                    ETIME: self.inParam.ETIME,
                    NE_ID: self.inParam.NE_ID,
                    page: "1",
                    rowNum: "20"
                }, function(ret) {
                    if(ret && ret.kpiList){
                        self.cellKpiList = ret.kpiList;
                    }
                    var dp = [];
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
                            hidden: !self.inParam.hasCellCol
                        }
                    ];
                    var kpiList = [];
                    fish.forEach(self.inParam.nqiList, function(item){
                        if(item.ITEM_NO == item_no){
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
                    fish.forEach(self.cellKpiList, function(kpiItem){
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
                    self.createGrid(colModel, dp, "nhc-kpidetail-grid", false);
                });
            },

            createGrid: function(colModel, dp, divId, isMerge) {
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
                        "records": this.gridCount
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
                //蓝底白字
                this.$("[role='columnheader']").css("background-color", "#039cfd");
                this.$(".ui-jqgrid-sortable").css("text-align", "center");
                this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
            },

            loadGridData: function (divId, page, rowNum) { //请求服务器获取数据的方法
                var self = this;
                var dp = [];
                var item_no = self.inParam.item_no;
                rowNum = rowNum || this.$("#"+divId).grid("getGridParam", "rowNum");
                action.healthKpiQuery({
                    TEMPLATE_ID: self.inParam.TEMPLATE_ID,
                    NETTYPE_ID: self.inParam.NETTYPE_ID,
                    GRANU: self.inParam.GRANU,
                    BTIME: self.inParam.BTIME,
                    ETIME: self.inParam.ETIME,
                    NE_ID: self.inParam.NE_ID,
                    page: page,
                    rowNum: rowNum
                }, function(ret) {
                    if(ret && ret.kpiList){
                        self.cellKpiList = ret.kpiList;
                    }
                    var kpiList = [];
                    fish.forEach(self.inParam.nqiList, function(item){
                        if(item.ITEM_NO == item_no){
                            kpiList[kpiList.length] = item;
                        }
                    });
                    //
                    fish.forEach(self.cellKpiList, function(kpiItem){
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
                        "records": self.gridCount
                    });
                });
            },

            resize: function() {
                return this;
            }
        });
    }
);