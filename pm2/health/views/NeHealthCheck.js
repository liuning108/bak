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

        events: {
            'click .nhc-list-item': 'listItemClick',
            'click .nhc-choosetime-btn': 'showChooseTimeWin',
            'click .container_right': 'containerRightClick'
        },

        initialize: function (opt) {
            this.levelColor_1 = '#d2100e';
            this.levelColor_2 = '#ff4e00';
            this.levelColor_3 = '#3e9de1';
            this.granularity = "_H";
            this.granularityValue = "24";
            this.selectedNetypeId = "";
            this.selectedTemplateId = "";
            this.lastColorLevel = "";
            this.maxTime = "";
            this.cachedNetype = new nhcUtil.HashMap();
            this.cachedNetypeCode = new nhcUtil.HashMap();
            this.healthList = [];
            this.kpiItemList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate());
            return this;
        },

        afterRender: function () {
            this.resetStatus();
            //
            this.loadTemplate();
            this.$("#nhc-kpidetail-grid-tabs").tabs({
                canClose:false,
                paging: true,
                autoResizable:true
            });
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

        initTrendChart: function (dpx,dp0,dp1,dp2,dp3) {
            var lineChart = echarts.init(this.$("#nhc-trend-container")[0]);
            option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['总分','接入性','保持性','可用性'],
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
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'总分',
                        type:'line',
                        data:dp0
                    },
                    {
                        name:'接入性',
                        type:'line',
                        data:dp1
                    },
                    {
                        name:'保持性',
                        type:'line',
                        data:dp2
                    },
                    {
                        name:'可用性',
                        type:'line',
                        data:dp3
                    }
                ]
            };
            lineChart.setOption(option);
        },

        resetStatus: function () {
            this.$('#nhc-right-heading').empty();
            this.$('.nhc-choosetime-btn').attr('disabled','disabled');
            this.initGaugeChart([{value: 0, name: ''}]);
            this.initTrendChart([],[],[],[],[]);
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
            var sql = "SELECT NETTYPE_NAME,NETTYPE_ID,NETTYPE_CODE DIM_CODE FROM PM_NEHEALTHCHECK_NETYPE "
                    + "WHERE TEMPLATE_ID ='" + template_id + "'";
            pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                if(data && data.resultList) {
                    var ds = [];
                    fish.forEach(data.resultList, function (item) {
                        self.cachedNetype.put(item.NETTYPE_ID, item.NETTYPE_NAME);
                        self.cachedNetypeCode.put(item.NETTYPE_ID, item.DIM_CODE);
                        ds[ds.length] = {
                            name: item.NETTYPE_NAME,
                            id: item.NETTYPE_ID,
                            pId: 0,
                            code: item.DIM_CODE
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
                        self.$('#nhc-netype-select').combotree('value', [ds[0].name]);
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

        loadLeftListData: function() {
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
            if(!templateId || templateId==""){
                this.selectedTemplateId = ""
                return;
            }
            if(netypeId==""){
                this.selectedNetypeId = "";
                return;
            }
            if(this.selectedTemplateId==templateId && this.selectedNetypeId==netypeId){

            }else{
                this.selectedTemplateId=templateId;
                this.selectedNetypeId=netypeId;
                //
                this.$("#nhc-nelist-container").empty();
                var sql = "SELECT ITEM_NAME,ITEM_NO FROM PM_NEHEALTHCHECK_LIST WHERE TEMPLATE_ID='"+self.selectedTemplateId
                    + "' AND NETTYPE_ID='"+netypeList[0].id+"' AND ITEM_STATE='1' AND WEIGHT!=0 ORDER BY DISP_ORDER";
                pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
                    if (data && data.resultList) {
                        for(var i=0;i<data.resultList.length;i++){
                            var item = data.resultList[i];
                            var ITEM_NO = item.ITEM_NO;
                            var ITEM_NAME = item.ITEM_NAME;
                            self.$('#nhc-kpi'+(i+1)+'-name').html(ITEM_NAME);
                        }
                        self.kpiItemList = data.resultList;
                    }
                });
                this.loadHealthScore();
            }
        },

        loadHealthScore: function() {
            var self = this;
            var netypeList = this.selectedNetypeId.split(",");
            fish.forEach(netypeList, function(netypeid) {
                ////////////////////////
                var dim_code = self.cachedNetypeCode.get(netypeid);
                action.metaDimQuery({
                    DIM_CODE: dim_code
                }, function (ret) {
                    var dimScript = "";
                    if (ret.scriptList && ret.scriptList.length > 0) {
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
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
                            NETTYPE_ID: netypeid
                        }, function(ret){
                            if(ret.healthList.length>0) {
                                self.healthList = ret.healthList;
                                fish.forEach(ret.healthList, function (item) {
                                    fish.forEach(neList, function (ne) {
                                        if (ne.ne_id == item.NE_ID) {
                                            ne.ne_score = item.SCORE_HEALTH;
                                        }
                                    });
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
                                    htmlText += '<a name="'+ne.ne_name+'" id="nhc-ne-'+ne.ne_id+'" class="nhc-list-item list-group-item">'
                                    + ne.ne_name
                                    + '<span class="badge '+scoreClass+'" id="nhc-nescore-'+ne.ne_id+'">'+score+'</span></a>';
                                });
                                htmlText += '</div></div>';
                                self.$("#nhc-nelist-container").append(htmlText);
                            }
                        });
                        ////////////////////////
                    });
                });
            });
        },

        // 点击网元
        listItemClick: function (e) {
            this.resetStatus();
            var self = this;
            this.$('.nhc-list-item').removeClass('active');
            e.currentTarget.className += " active";
            var ne_id = e.currentTarget.id.substring(7);
            var ne_name = e.currentTarget.name;
            fish.forEach(this.healthList, function(item){
                if(item.NE_ID == ne_id){
                    var healthScore = item.SCORE_HEALTH;
                    var sttime = item.STTIME;
                    self.$('#nhc-right-heading').html('<span class="panel-title">'+ne_name+'健康度得分</span>'
                        + 'Final Assessment Time：'+sttime+'</div>');
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
        },

        renderKpiScore: function(kpiItem, kpiScore, kpiIndex) {
            var ITEM_NAME = kpiItem.ITEM_NAME;
            this.$('#nhc-kpi'+kpiIndex+'-name').html(ITEM_NAME);
            this.$('#nhc-kpi'+kpiIndex+'-score').html(kpiScore);
            var imageUrl;
            var fillColor;
            var colorLevel;
            if(kpiScore<80){
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
            });
            this.listenTo(dialog, 'cancelEvent',function () {
                self.timeChooseView.close();
            });
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