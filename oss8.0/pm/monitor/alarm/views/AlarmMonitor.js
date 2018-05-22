portal.define([
    'text!oss_core/pm/monitor/alarm/templates/AlarmMonitor.html',
    "i18n!oss_core/pm/monitor/alarm/i18n/Alarm",
    "oss_core/pm/monitor/alarm/actions/AlarmMgrAction.js",
    "oss_core/pm/monitor/alarm/js/AlertCharts.js",
     "css!oss_core/pm/monitor/alarm/css/alram.css",
     "oss_core/pm/screendesigner/js/raphael-min"
], function(tpl,i18nData,action, alertCharts) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),

        render: function() {
            this.$el.html(this.template(i18nData));
            return this;
        },
        loadData: function(data) {
            var self = this;
            console.log(data);
            var chartsData = fish.map(data.chartsData, function(data) {
                console.log(data);
                return {
                    "name": data.ALARM_NAME,
                    'value': Number(data.WARN_TIMES),
                    "color": data.COLOR,
                    'label': Number(data.WARN_TIMES),
                    'level': data.ALARM_LEVEL
                }
            })

            var sum = fish.reduce(chartsData, function(memo, num){ return memo + num.value; }, 0);
            alertCharts.bigCircleChart({dom: this.$el.find('#alram_bigCircle'), title: "Alarms", datas: chartsData})
            var level1 = chartsData[0];
            level1.per=level1.value/sum;
            console.log("kdsfkhdskjhdkja");
            console.log(level1);
            level1.dom = this.$el.find('#alram_critical');
            level1.json = self.json;
            var criticalObj = alertCharts.circleChart(level1)
            this.$el.find('#alram_critical').off('click').on('click', function() {
                criticalObj.toggleFilter();
                console.log(self.json.level);
                self.queryData(self.json);
            })

            var level2 = chartsData[1];
            level2.per=level2.value/sum;
            level2.dom = this.$el.find('#alram_Trouble');
            level2.json = self.json;
            var TroubleObj = alertCharts.circleChart(level2);
            this.$el.find('#alram_Trouble').off('click').on('click', function() {
                TroubleObj.toggleFilter();
                console.log(self.json.level);
                self.queryData(self.json);
            })

            var level3 = chartsData[2];
            level3.per=level3.value/sum;
            level3.dom = this.$el.find('#alram_Attention');
            level3.json = self.json;
            var AttentionObj = alertCharts.circleChart(level3);
            this.$el.find('#alram_Attention').off('click').on('click', function() {
                AttentionObj.toggleFilter();
                console.log(self.json.level);
                self.queryData(self.json);
            })

            var level4 = chartsData[3];
            level4.per=level4.value/sum;
            level4.dom = this.$el.find('#alram_ServiceDown');
            level4.json = self.json;
            var ServiceDownObj = alertCharts.circleChart(level4)
            this.$el.find('#alram_ServiceDown').off('click').on('click', function() {
                ServiceDownObj.toggleFilter();
                console.log(self.json.level);
                self.queryData(self.json);
            })
        },
        queryData: function(json) {
            var self = this;
            action.queryAlramList(json, function(data) {
                self.loadData(data.result);

                self.initData([
                    {
                        name: 'WARN_DESC',
                        label: i18nData.WarnMessage,
                        sortable:false,
                        width: 200
                    }, {
                        name: 'WARN_CODE',
                        label: i18nData.WarnCode,
                        sortable:false,
                        width: 100
                    }, {
                        name: 'ALARMOBJ_TYPE_NAME',
                        label: i18nData.WarnObject,
                        sortable:false,
                        width: 100
                    }, {
                        name: 'ALARMOBJ_INST_NAME',
                        label: i18nData.WarnObjectName,
                        sortable:false,
                        width: 80
                    }, {
                        name: 'WARN_KPIVALUE',
                        label: i18nData.KPIinfo,
                        sortable:false,
                        width: 290
                    }, {
                        name: 'ALARM_NAME',
                        label: i18nData.WarnLevel,
                        sortable:false,
                        width: 80,
                        formatter: function(cellval, opts, rwdat, _act) {
                            console.log("ALARM_NAME FORMAtter");
                            console.log(cellval);
                            console.log(rwdat);
                            return "<div class='alramNameCircle' style='background:" + rwdat.COLOR + "'></div>" + cellval;
                        }
                    }, {
                        name: 'WARN_TIME',
                        sortable:false,
                        label: i18nData.Time,
                        width: 100
                    }
                ], []);

            })
        },
        afterRender: function() {
            var self = this;
            self.alramClicked = false;
            self.json = {
                time: 24,
                level: "",
                page: 1,
                rowNums:20
            }
            console.log("json:" + self.json);
            self.tt = "Last 24 Hour";

            self.queryData(self.json);
            this.initSortTime();

        },
        initSortTime: function() {
            var self = this;
            var $alermTimePop = this.$el.find('#alrmSortTime').popover({
                html: true,
                placement: 'bottom-left',
                template: '<div class="popover alermSortByTime" role="tooltip"><div class="arrow" style="left:0px"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
                trigger: 'click',
                content: $('#alermSortByTime').html(),
                beforeHide: function() {
                    if (self.alramClicked === true) {
                        console.log("not hide...")
                        return false;
                    }
                    return true;
                }
            }).on("popover:show", function() {
                var array = ("" + self.json.time).split(',');
                if (array[0] == 'custom') {
                    var parent = $(".alermSortByTime ul")
                    self.showCusTime(parent, $alermTimePop, array[1], array[2]);

                } else {
                    $(".alermSortByTime [data-value=" + self.json.time + "]").addClass('alramActive');
                }

                $(".alermSortByTime .alramRemove").off("click").on("click", function(e) {
                    console.log("closeBtn...")
                    e.stopPropagation();
                    self.alramClicked = false;
                    $alermTimePop.popover("hide");
                })
                $(".alermSortByTime").off("click").on("click", function(e) {
                    self.alramClicked = true;
                })
                self.setTimeBtn($alermTimePop);
            });

        },
        setTimeBtn: function(pop) {
            var self = this;
            $(".alermSortByTime li").off('click').on('click', function() {
                var value = $(this).data('value')

                if (value != 'custom') {
                    $('.alramActive').removeClass('alramActive');
                    $(this).addClass('alramActive');
                    self.json.time = value;
                    console.log(self.json);
                    self.tt = $(this).text();
                    self.queryData(self.json)
                    self.alramClicked = false;
                    pop.popover("hide");
                } else {
                    var parent = $(this).parent();
                    self.showCusTime(parent, pop, "", "");
                }

            })
        },
        showCusTime: function(parent, pop, v1, v2) {
            var self = this;
            parent.hide();
            parent.parent().find('.setAlramTimeCustom').show();
            var st = parent.parent().find("#alram_start_datetimepicker").datetimepicker({});
            var et = parent.parent().find("#alram_end_datetimepicker").datetimepicker({});
            st.datetimepicker("value", v1);
            et.datetimepicker("value", v2);
            parent.parent().find(".CancelBtn").off('click').on('click', function() {
                parent.show();
                parent.parent().find('.setAlramTimeCustom').hide();
            })

            parent.parent().find(".OkBtn").off('click').on('click', function() {
                    var stv = st.datetimepicker("value");
                    var etv = et.datetimepicker("value");
                    if(stv.length<=0 || etv.length<=0){
                        return;
                    }
                     var sd = st.datetimepicker("getDate");
                     var ed = et.datetimepicker("getDate");
                     if(sd>ed){
                         $('.TimeCustomBodyMessage').text('End time is not less than start time')
                         return;
                     }
                    var value = "custom," + stv + "," + etv;
                    console.log(value);
                    self.json.time = value;
                    self.tt =stv+" to "+etv;
                    self.queryData(self.json)
                    self.alramClicked = false;
                    pop.popover("hide");
            })

        },
        initData: function(model, data) {
            var self =this;
            //模拟服务器端数据
            var mydataServer = data;

            var getPerData = function(page, rowNum, sortname, sortorder) { //请求服务器获取数据的方法

                rowNum = rowNum || $("#grid01_alram").grid("getGridParam", "rowNum");
                //首先根据sortname,sortorder对整个数据就行排序,正常情况下把查询条件带入到服务器查询就行
                var sortdata = [];
                if (sortname) {
                    var query = $.jgrid.from(mydataServer);
                    if (sortorder.toUpperCase() === "DESC") {
                        query.orderBy(sortname, "d");
                    } else {
                        query.orderBy(sortname, "a");
                    }
                    sortdata = query.select();
                    // sortdata = [];
                } else {
                    sortdata = mydataServer;
                }
                var perData = [];
                for (var i = 0; i < rowNum; i++) {
                    var index = i + (page - 1) * rowNum;
                    if (index < sortdata.length) {
                        perData.push(sortdata[i + (page - 1) * rowNum]);
                    } else {
                        break;
                    }
                }
                return {
                    "rows": perData, "page": page,
                    // "total": Math.ceil(mydataServer.length/rowNum),  传了total就不需要传records了,除非treeGrid不知道records的场景需要自己控制total
                    "userdata": {
                        "extra": "这个extra数据"
                    },
                    "records": sortdata.length,
                    "id": "id"
                };
            };

            var getPerData2 = function(page, rowNum, sortname, sortorder) {
                    self.json.rowNums = rowNum;
                    self.json.page = page;

                        action.queryAlramList(self.json,function(data){
                            var result =data.result;
                            var pageResult = {
                                "rows": result.alramListPerData, "page": page,
                                "userdata": {
                                    "extra": "这个extra数据"
                                },
                                "records": result.alramListCount,
                                "id": "id"
                            }
                             $("#grid01_alram").grid("reloadData", pageResult);
                             self.$el.find('#alramQueryCount').text(result.alramListCount)
                             self.$el.find('#alramQueryTime').text(self.tt);
                        })

                // _.delay(function() {
                //     var result = getPerData(page, rowNum, sortname, sortorder);
                //         $("#grid01_alram").grid("reloadData", result);
                // }, 100);
                return false;
            };

            //普通表格
            $("#grid01_alram").grid({
                datatype: "json",
                height: 220,
                colModel: model,
                rowNum: self.json.rowNums,
                rowList: [
                    self.json.rowNums, 50, 100, 500
                ],
                pager: true,
                pageData: getPerData2 //同步场景直接用getPerData,返回json格式数据;异步场景用getPerData2,先返回false中断内部逻辑,再通过 jQuery("#grid01_alram").grid("reloadData",getPerData(1))来加载数据;
            });
          //  $("#grid01_alram").grid("setGridHeight", 600); //设置高度
              $("#grid01_alram").jqGrid("setGridHeight", self.uiContainerHeight-100);
            getPerData2(self.json.page,self.json.rowNums); //默认加载第一页数据

        },
        resize: function () {
            this.uiContainerHeight = this.$el.parents(".tabs_nav").outerHeight();
            var height = this.uiContainerHeight - 100;
            $("#grid01_alram").jqGrid("setGridHeight", height);
          //  this.$el.find('.AlarmCharts').slimscroll({height: height+'px', width: '298px', axis: 'y'});


        }
    })

})
