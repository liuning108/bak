/**
 *
 */
define([
        'text!oss_core/pm/adhoc/templates/ChartContainer.html',
        "oss_core/pm/adhoc/assets/js/echarts",
        "oss_core/pm/adhoc/views/AdhocUtil",
        'oss_core/pm/adhoc/actions/AdhocAction',
        "oss_core/pm/util/views/Util",
        "oss_core/pm/adhoc/views/DrillEntranceWin",
        "oss_core/pm/adhoc/views/ViewExtensionDialog",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        "oss_core/pm/adhoc/assets/js/pivot",
        "oss_core/pm/adhoc/assets/js/echarts-wordcloud.min",
        'css!oss_core/pm/adhoc/assets/js/pivot.css'
    ],
    function(mainTpl, echarts, adhocUtil, action, pmUtil, drillEntranceWin, viewExtensionDialog, i18nData) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #ad-hide-gridfilter': "hideGridFilter",
            'click #ad-show-gridfilter': "showGridFilter",
            'click #ad-dimfilter-plus': "addFilterCondition",
            'click #ad-dimfilter-confirm': "dimFilterConfirm",
            'click #ad-sortbox-plus': "addSortRule",
            'click #ad-sortbox-confirm': "sortRuleConfirm",
            'click #ad-displayfield-confirm': "displayFieldConfirm",
            'click #ad-dimfilter-condiselect': "showCondiSelectWin",
            'change #ad-compareanalysis-kpisel': "compareAnalysisChange",
            'change #ad-compareanalysis-chk': "compareAnalysisChange",
            'click .ad-grid-export': "gridExport",
            'click #chart-box': 'blankClick'
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
            this.xAxisLabelRotate = 0;
            this.xAxisLabelInterval = 'auto';
            this.xAxisLabelHeight = 70;
            this.isXAxisLabelRotate = false;
            this.isXAxisLabelInterval = false;
            this.isXAxisLabelHeight = false;
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
            this.dimListInModel = opt.dimListInModel;
            this.firstAxisKpiList = [];
            this.secondAxisKpiList = [];
            this.axisCfgSeries = ""; // 系列
            this.axisCfgXaxis = ""; // x轴
            this.axisCfgXaxis_bak = ""; // x轴
            this.axisCfgXaxisDataType = ""; //x轴数据类型
            this.axisCfgYaxisList = []; // y轴
            this.axisColorCfgYaxisList = []; // y轴颜色配置
            this.axisCfgYaxisTypeList = []; // y轴类型 主次轴
            this.extendDimList = []; // 扩展分析的字段集合
            this.extendDimFilterList = []; // 扩展分析的当前维度过滤条件集合
            //
            this.dataFilterType = 0;// 0-筛选 1-显示字段 2-排序
            this.simuDp = [];
            this.groupSimuDp = [];
            this.filterCondiList = [];
            this.filterCondiType = "AND";
            this.sortList = [];// 排序规则集合 xxx asc/xxx desc
            this.groupList = []; // 饼系图表的组
            //
            this.selectedFilterValueList = [];// 二次过滤当前选择的过滤值集合
            this.filterFieldType = "0";// 二次过滤条件的类型 0-维度 1-指标
            this.META_DIM_CODE;// 当前二次过滤字段对应的维度code
            this.cachedKpiUnit;
            //
            this.compareAnalysisBtime = "";
            this.compareAnalysisEtime = "";
            this.compareAnalysisKpi = "";
            this.dateGranu = "";
            this.dateGranuType = "";
            this.pivotUIOptions = "";
            this.forDashBoard = opt.forDashBoard;
            this.uiContainerHeight = opt.uiContainerHeight;
            this.groupChartList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({nodeName: this.chart_id},this.resource)));
            return this;
        },

        afterRender: function () {
            that = this;
            this.updateGridCfg(false);
            this.$('#ad-showdisplayfield-btn-'+this.chart_id).off();
            this.$('#ad-showdisplayfield-btn-'+this.chart_id).on("click", this.wrap(function(){
                this.showdisplayfieldCfg();
            }));
            this.$('#ad-datafilter-btn-'+this.chart_id).off();
            this.$('#ad-datafilter-btn-'+this.chart_id).on("click", this.wrap(function(){
                this.showDataFilterCfg();
            }));
            this.$('#ad-sort-btn-'+this.chart_id).off();
            this.$('#ad-sort-btn-'+this.chart_id).on("click", this.wrap(function(){
                this.showSortCfg();
            }));
            this.$('#ad-pivottable-btn-'+this.chart_id).off();
            this.$('#ad-pivottable-btn-'+this.chart_id).on("click", this.wrap(function(){
                this.showPivotTable();
            }));
            this.$('#ad-datafilter-filterconditype-'+this.chart_id).off();
            this.$('#ad-datafilter-filterconditype-'+this.chart_id).on("change", this.wrap(function(){
                this.filterCondiType = this.$('#ad-datafilter-filterconditype-'+this.chart_id).val();
            }));
            this.$('#ad-dimfilter-fieldsel-'+this.chart_id).off();
            this.$('#ad-dimfilter-fieldsel-'+this.chart_id).on("change", this.wrap(function(){
                var fieldId = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).val();
                for(var i=0;i<this.selectedDimIndiList.length; i++){
                    var dimIndiObj = this.selectedDimIndiList[i];
                    if(dimIndiObj.COL_INDEX == fieldId){
                        this.colType = dimIndiObj.COL_TYPE;
                        if(this.colType == "00" || this.colType == "02"){
                            this.META_DIM_CODE = dimIndiObj.META_DIM_CODE;
                            this.showDimFilterSelect();
                            this.filterFieldType = "0";
                        }else if(this.colType == "01"){
                            this.showKpiFilterSelect();
                            this.filterFieldType = "1";
                        }
                    }
                }
            }));
            this.fieldSelChange();
            this.showDataFilterCfg();
        },

        setUpCompareAnalysisInput: function () {
            var self = this;
            this.$('#ad-compareanalysis-kpisel').empty();
            fish.forEach(this.axisCfgYaxisList, function(kpiIndex){
                fish.forEach(self.selectedDimIndiList, function(dimIndiObj){
                    if(kpiIndex == dimIndiObj.COL_INDEX) {
                        var kpiNo = dimIndiObj.COL_NO;
                        var kpiName = dimIndiObj.COL_NAME;
                        self.$('#ad-compareanalysis-kpisel').append('<option value="' + kpiIndex + '">' + kpiName + '</option>');
                    }
                });
            });
            this.$('#ad-compareanalysis-timesel').datetimepicker("value", "");
            this.$('#ad-compareanalysis-timesel').datetimepicker({
                changeDate: function (e, value) {
                    self.compareAnalysisBtime = self.$('#ad-compareanalysis-timesel').val();
                    self.compareAnalysisChange();
                }
            });
        },

        compareAnalysisChange: function () {
            //this.compareAnalysisBtime = this.$('#ad-compareanalysis-timesel').val();
            //this.compareAnalysisKpi = this.$('#ad-compareanalysis-kpisel').val();
            if(this.$('#ad-compareanalysis-chk').is(':checked')){
                console.log("compareAnalysisChange");
                this.trigger("compareAnalysisChange",{
                    chart: this
                });
            }else{
                this.trigger("cancelCompareAnalysisChange",{
                    chart: this
                });
            }
        },

        fieldSelChange: function () {
            var fieldId = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).val();
            for(var i=0;i<this.selectedDimIndiList.length; i++){
                var dimIndiObj = this.selectedDimIndiList[i];
                if(dimIndiObj.COL_INDEX == fieldId){
                    this.colType = dimIndiObj.COL_TYPE;
                    if(this.colType == "00" || this.colType == "02"){
                        this.META_DIM_CODE = dimIndiObj.META_DIM_CODE;
                        this.showDimFilterSelect();
                        this.filterFieldType = "0";
                    }else if(this.colType == "01"){
                        this.showKpiFilterSelect();
                        this.filterFieldType = "1";
                    }
                }
            }
        },

        showDimFilterSelect: function () {
            this.selectedFilterValueList = [];
            this.$('#ad-kpifilter-condivalue').val("");
            this.$('#ad-kpifilter-condivalue').hide();
            this.$('#ad-kpifilter-fmtsel').hide();
            // 维度code不为空则弹出窗选
            if(this.META_DIM_CODE){
                this.$('#ad-dimfilter-condivalue').attr({"disabled":"disabled"});
                this.$('#ad-dimfilter-condivalue').val("");
                this.$('#ad-dimfilter-condivalue').show();
                this.$('#ad-dimfilter-condiselect').show();
                this.$('#ad-dimfilter-fmtsel').show();
            }else{// 维度code为空则手工输入
                this.$('#ad-dimfilter-condivalue').removeAttr("disabled");
                this.$('#ad-dimfilter-condivalue').val("");
                this.$('#ad-dimfilter-condivalue').show();
                this.$('#ad-dimfilter-condiselect').hide();
                this.$('#ad-dimfilter-fmtsel').show();
            }
        },

        showKpiFilterSelect: function () {
            this.selectedFilterValueList = [];
            this.$('#ad-dimfilter-condivalue').val("");
            this.$('#ad-dimfilter-condivalue').hide();
            this.$('#ad-dimfilter-condiselect').hide();
            this.$('#ad-dimfilter-fmtsel').hide();
            //
            this.$('#ad-kpifilter-condivalue').val("");
            this.$('#ad-kpifilter-condivalue').show();
            this.$('#ad-kpifilter-fmtsel').show();
        },

        refreshCss: function () {
            if(this.chart_type=="grid"){
                this.$('#ad-chart-titlecontainer-'+this.chart_id).css({margin:"10px 0 0 0"});
            }else if((!this.chartTitle || this.chartTitle=="") && (!this.chartSubTitle || this.chartSubTitle=="")){
                if(this.isCompareAnalysis){
                    this.$('#ad-chart-titlecontainer-' + this.chart_id).css({margin: "10px 0 20px 0"});
                }else {
                    this.$('#ad-chart-titlecontainer-' + this.chart_id).css({margin: "10px 0 -20px 0"});
                }
            }else{
                if(this.isCompareAnalysis){
                    this.$('#ad-chart-titlecontainer-'+this.chart_id).css({margin:"10px 0 10px 0"});
                }else{
                    this.$('#ad-chart-titlecontainer-'+this.chart_id).css({margin:"10px 0 -40px 0"});
                }
            }
        },

        hideGridFilter: function () {
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
        },

        showGridFilter: function () {
            this.$('#ad-gridcfg-container-'+this.chart_id).show();
        },

        // 二次过滤 维度过滤值选择弹出窗
        showCondiSelectWin: function () {
            var fieldId = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).val();
            var fieldName = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).find("option:selected").text();
            portal.require([
                'oss_core/pm/adhoc/views/DimFilterSelect'
            ], this.wrap(function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: fieldId,
                    META_DIM_CODE: this.META_DIM_CODE,
                    DIM_NAME: fieldName,
                    selectedList: this.selectedFilterValueList,
                    allItemList: []
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 430
                };
                this.dimSelectView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okDimSelectEvent', this.wrap(function (data) {
                    this.dimSelectView.close();
                    var selectedValueStr = data.selectedValueStr;
                    var selectedNameStr = data.selectedNameStr;
                    this.selectedFilterValueList = data.selectedFilterValueList;
                    this.$('#ad-dimfilter-condivalue').val(selectedNameStr);
                }));
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.dimSelectView.close();
                }));
            }));
        },

        showdisplayfieldCfg: function () {
            this.$('#ad-datafilter-li-'+this.chart_id).removeClass("active");
            this.$('#ad-showdisplayfield-li-'+this.chart_id).addClass("active");
            this.$('#ad-pivottable-li-'+this.chart_id).removeClass("active");
            this.$('#ad-sort-li-'+this.chart_id).removeClass("active");
            if(this.$('#ad-grid-filter-container').is(":hidden") || this.dataFilterType!=1) {
                this.$('#ad-grid-filter-container').show();
                this.dataFilterType=1;
                this.$('#ad-displayfield-box-'+this.chart_id).show();
                this.$('#ad-datafilter-box-'+this.chart_id).hide();
                this.$('#ad-sort-box-'+this.chart_id).hide();
                this.$('#ad-pivot-box-'+this.chart_id).hide();
            }else{
                this.$('#ad-grid-filter-container').hide();
            }
        },

        showDataFilterCfg: function () {
            this.$('#ad-datafilter-li-'+this.chart_id).addClass("active");
            this.$('#ad-showdisplayfield-li-'+this.chart_id).removeClass("active");
            this.$('#ad-pivottable-li-'+this.chart_id).removeClass("active");
            this.$('#ad-sort-li-'+this.chart_id).removeClass("active");
            if(this.$('#ad-grid-filter-container').is(":hidden") || this.dataFilterType!=0) {
                this.$('#ad-grid-filter-container').show();
                this.dataFilterType=0;
                this.$('#ad-datafilter-box-'+this.chart_id).show();
                this.$('#ad-displayfield-box-'+this.chart_id).hide();
                this.$('#ad-sort-box-'+this.chart_id).hide();
                this.$('#ad-pivot-box-'+this.chart_id).hide();
            }else{
                this.$('#ad-grid-filter-container').hide();
            }
        },

        showSortCfg: function () {
            this.$('#ad-sort-li-'+this.chart_id).addClass("active");
            this.$('#ad-showdisplayfield-li-'+this.chart_id).removeClass("active");
            this.$('#ad-pivottable-li-'+this.chart_id).removeClass("active");
            this.$('#ad-datafilter-li-'+this.chart_id).removeClass("active");
            if(this.$('#ad-grid-filter-container').is(":hidden") || this.dataFilterType!=2) {
                this.$('#ad-grid-filter-container').show();
                this.dataFilterType=2;
                this.$('#ad-sort-box-'+this.chart_id).show();
                this.$('#ad-displayfield-box-'+this.chart_id).hide();
                this.$('#ad-datafilter-box-'+this.chart_id).hide();
                this.$('#ad-pivot-box-'+this.chart_id).hide();
            }else{
                this.$('#ad-grid-filter-container').hide();
            }
        },

        showPivotTable: function () {
            //this.$('#ad-pivottable-li-'+this.chart_id).addClass("active");
            this.$('#ad-showdisplayfield-li-'+this.chart_id).removeClass("active");
            this.$('#ad-datafilter-li-'+this.chart_id).removeClass("active");
            this.$('#ad-sort-li-'+this.chart_id).removeClass("active");
            if(this.$('#ad-grid-filter-container').is(":hidden") || this.dataFilterType!=3) {
                this.$('#ad-grid-filter-container').hide();
                this.dataFilterType=3;
                //this.$('#ad-pivot-box-'+this.chart_id).show();
                this.$('#ad-datafilter-box-'+this.chart_id).hide();
                this.$('#ad-displayfield-box-'+this.chart_id).hide();
                this.$('#ad-sort-box-'+this.chart_id).hide();
                this.showPivotDialog();
            }else{
                this.$('#ad-grid-filter-container').hide();
            }
        },

        showPivotDialog: function () {
            var dimAndIndiList = [];
            fish.forEach(this.selectedDimIndiList, function(obj){
                if(!(obj.GL_DIMKPI && obj.GL_DIMKPI=="0")){
                    dimAndIndiList[dimAndIndiList.length] = obj;
                }
            });
            portal.require([
                'oss_core/pm/adhoc/views/PivotDialog'
            ], this.wrap(function (Dialog) {
                var dialog = new Dialog({
                    selectedDimIndiList: dimAndIndiList,
                    simuDp: this.simuDp
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 800,
                    height: 450,
                    resizable: true
                };
                this.pivotDialog = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.pivotDialog.close();
                }));
            }));
        },

        // 条件筛选页面点击新增筛选项
        addFilterCondition: function() {
            if (this.filterFieldType == "0") {
                this.addDimFilterCondition();
            } else {
                this.addKpiFilterCondition();
            }
        },

        addDimFilterCondition: function() {
            var filterCondiValue = "";
            var fieldid = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).val();
            var fieldColNo;
            fish.forEach(this.selectedDimIndiList, function(dimIndiObj){
                if(dimIndiObj.COL_INDEX == fieldid){
                    fieldColNo = dimIndiObj.COL_NO;
                }
            });
            if(this.META_DIM_CODE){
                if(this.selectedFilterValueList.length==0){
                    fish.toast('info', this.resource.ENTER_FILTER_VALUE);
                    return;
                }
                for(var i=0; i<this.selectedFilterValueList.length; i++){
                    if(i!=this.selectedFilterValueList.length-1){
                        filterCondiValue += ("'" + this.selectedFilterValueList[i].id + "',");
                    }else{
                        filterCondiValue += ("'" + this.selectedFilterValueList[i].id + "'");
                    }
                }
            }else{
                var filterCondiValue = adhocUtil.trim(this.$('#ad-dimfilter-condivalue').val());
                if(filterCondiValue==""){
                    fish.toast('info', this.resource.ENTER_FILTER_VALUE);
                    return;
                }
                var tmpValueArray = filterCondiValue.split(",");
                filterCondiValue = "";
                if(this.colType=="02"){//虚拟维度暂时手动输入
                    for(var i=0;i<tmpValueArray.length;i++){
                        filterCondiValue += "'" + tmpValueArray[i] + "',";
                    }
                }else{
                    for(var i=0;i<tmpValueArray.length;i++){
                        if(fieldColNo=="STTIME"){
                            var tmpValue = tmpValueArray[i];
                            // 处理时间格式 截掉后面的小数点
                            if(tmpValue.indexOf(".")!=-1){
                                tmpValue = tmpValue.substring(0, tmpValue.indexOf("."));
                            }
                            filterCondiValue += "to_date('" + tmpValue + "','yyyy-mm-dd hh24:mi:ss'),";
                        }else{
                            filterCondiValue += "'" + tmpValueArray[i] + "',";
                        }
                    }
                }
                filterCondiValue = filterCondiValue.substring(0,filterCondiValue.length-1);
            }
            var fmtId = this.$('#ad-dimfilter-fmtsel').val();
            var filterCondiName = this.$('#ad-dimfilter-condivalue').val();
            var isExist = false;
            for(var i=0;i<this.filterCondiList.length;i++){
                var filterCondiObj = this.filterCondiList[i];
                if(filterCondiObj.fieldId == fieldid && filterCondiObj.type == fmtId
                    && filterCondiObj.value == filterCondiValue){
                    fish.toast('info', this.resource.SAME_FILTER_CONDITION_EXISTS);
                    return;
                }
            };
            var divId = this.addFilterHtml(fmtId, filterCondiName);
            this.filterCondiList[this.filterCondiList.length] = {
                itemId: divId,
                fieldId: fieldid,
                type: fmtId,
                value: filterCondiValue
            }
            this.$('#ad-dimfilter-condivalue').val("");
            this.selectedFilterValueList = [];
        },

        addKpiFilterCondition: function() {
            var filterCondiValue = adhocUtil.trim(this.$('#ad-kpifilter-condivalue').val());
            if(filterCondiValue==""){
                fish.toast('info', this.resource.ENTER_FILTER_VALUE);
                return;
            }
            var fieldid = this.$('#ad-dimfilter-fieldsel-'+this.chart_id).val();
            var fmtId = this.$('#ad-kpifilter-fmtsel').val();
            var isExist = false;
            for(var i=0;i<this.filterCondiList.length;i++){
                var filterCondiObj = this.filterCondiList[i];
                if(filterCondiObj.fieldId == fieldid && filterCondiObj.type == fmtId
                    && filterCondiObj.value == filterCondiValue){
                    fish.toast('info', this.resource.SAME_FILTER_CONDITION_EXISTS);
                    return;
                }
            };
            var divId = this.addFilterHtml(fmtId, filterCondiValue);
            this.filterCondiList[this.filterCondiList.length] = {
                itemId: divId,
                fieldId: fieldid,
                type: fmtId,
                value: filterCondiValue
            }
            this.$('#ad-kpifilter-condivalue').val("");
        },

        addFilterHtml: function(fmtId, filterCondiName) {
            var divId = adhocUtil.guid();
            var fieldName = this.$('#ad-dimfilter-fieldsel-' + this.chart_id).find("option:selected").text();
            var fmtName = adhocUtil.mappingFilterFormatterName(fmtId);
            var htmlText = '<div name="' + divId + '" class="form-group"><label class="col-md-2 col-md-offset-2" style="text-align: left;padding-left:25px">' + fieldName
                + '</label><div class="col-md-3 text-left" style="text-align: left;padding-left:35px">' + fmtName + '</div>'
                + '<div class="col-md-3 text-left ellipsis-label" style="text-align: left;padding-left:30px" title="' + filterCondiName + '">'
                + filterCondiName + '</div><div class="col-md-1" style="padding-left:15px"><button name="' + divId + '" type="button" class="btn btn-ico" ><i class="fa fa-minus"></i></button></div></div>';
            this.$('#ad-filter-container').append(htmlText);
            this.$('.fa-minus').on("click", this.wrap(function (e) {
                var itemId = e.currentTarget.parentElement.name;
                this.$("div[name=" + itemId + "]").remove();
                for (var i = 0; i < this.filterCondiList.length; i++) {
                    var condiItem = this.filterCondiList[i];
                    if (condiItem.itemId == itemId) {
                        this.filterCondiList.splice(i, 1);
                        break;
                    }
                }
            }));
            return divId;
        },

        addSortRule: function() {
            var sortField = this.$('#ad-sortbox-fieldselect').val();
            var sortType = this.$('#ad-sortbox-typeselect').val();
            var isExist = false;
            for(var i=0;i<this.sortList.length;i++){
                var sortObj = this.sortList[i];
                if(sortObj.sortField == sortField){
                    fish.toast('info', this.resource.SORT_FIELD_EXISTS);
                    return;
                }
            };
            var divId = adhocUtil.guid();
            var sortFieldName = this.$('#ad-sortbox-fieldselect').find("option:selected").text();
            var sortTypeName = this.$('#ad-sortbox-typeselect').find("option:selected").text();
            var htmlText = '<div name="'+divId+'" class="form-group"><label class="col-md-3 col-md-offset-2 control-label" style="text-align: left;padding-left:25px">' + sortFieldName
                + '</label><div class="col-md-3 text-left" style="text-align: left;padding-left:25px">' + sortTypeName + '</div>'
                + '<div class="col-md-1"><button name="'+divId+'" type="button" class="btn btn-ico" ><i class="fa fa-minus"></i></button></div></div>';
            this.$('#ad-sort-container').append(htmlText);
            this.$('.fa-minus').on("click", this.wrap(function(e){
                var itemId = e.currentTarget.parentElement.name;
                this.$("div[name="+ itemId +"]").remove();
                for(var i=0; i<this.sortList.length; i++){
                    var sortObj = this.sortList[i];
                    if(sortObj.itemId == itemId){
                        this.sortList.splice(i,1);
                        break;
                    }
                }
            }));
            this.sortList[this.sortList.length] = {
                itemId: divId,
                sortField: sortField,
                sortType: sortType
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
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.option);
        },

        // 饼图
        getPieTypeLegendData: function (dimCol, groupIndex) {
            var legendData = [];
            fish.forEach(this.groupSimuDp[groupIndex], function (data) {
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

        getKpiCardSeriesData: function (param, groupIndex) {
            var seriesData = [];
            //
            var chart_top = 1;
            for(var i=0; i<this.groupSimuDp[groupIndex].length && i<chart_top; i++) {
                var dpItem = this.groupSimuDp[groupIndex][i];
                seriesData[seriesData.length] = {
                    value: dpItem[param.KPI_NO],
                    name: dpItem[param.KPI_NO],
                    itemStyle: {
                        normal: {
                            color: 'black'
                        }
                    }
                }
            };
            return seriesData;
        },

        getPieTypeSeriesData: function (param, groupIndex) {
            var seriesData = [];
            //
            var chart_top = param.chart_top==''?this.groupSimuDp[groupIndex].length:param.chart_top;
            for(var i=0; i<this.groupSimuDp[groupIndex].length && i<chart_top; i++) {
                var dpItem = this.groupSimuDp[groupIndex][i];
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
                var index = 0;
                fish.forEach(this.colModel, this.wrap(function (col) {
                    if (col.colType == 1) {
                        this.axisCfgYaxisList[this.axisCfgYaxisList.length] = col.name;
                        this.axisColorCfgYaxisList[this.axisColorCfgYaxisList.length] = adhocUtil.getColorSeries(index);
                        this.axisCfgYaxisTypeList[this.axisCfgYaxisTypeList.length] = 0;
                        seriesData[seriesData.length] = [];
                        index++;
                    } else if (this.axisCfgXaxis == "") {
                        this.axisCfgXaxis = col.name;
                    }
                }));
            }else{
                fish.forEach(this.axisCfgYaxisList, this.wrap(function (col) {
                    seriesData[seriesData.length] = [];
                }));
                if(this.axisColorCfgYaxisList.length==0){
                    for(var i=0;i<this.axisCfgYaxisList.length;i++){
                        this.axisColorCfgYaxisList[this.axisColorCfgYaxisList.length] = adhocUtil.getColorSeries(i);
                    }
                }
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
                var data = valueList[i];
                if(maxValue==null){
                    maxValue = parseFloat(data.value);
                }else if(maxValue<data.value){
                    maxValue = parseFloat(data.value);
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
                var dataItem = data[this.axisCfgXaxis];
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

        /*
        grid: [{
            left: 80,
            right: 50
        }]*/
        getPieChartOption:  function (param, groupIndex) {
            var legendData = this.getPieTypeLegendData(param.DIM_NO, groupIndex);
            var seriesData = this.getPieTypeSeriesData(param, groupIndex);
            //
            this.option = {
                title : {
                    text: param.GROUP_TITLE,
                    subtext: '',
                    x:'center',
                    textStyle: {
                        fontWeight: 'normal'
                    }
                },
                toolbox: {
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                                label : {color: '#555',
                                    show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                                }
                            }
                        }
                    }
                ]
            };
            return this.option;
        },

        getKpiCardOption:  function (param, groupIndex) {
            var seriesData = this.getKpiCardSeriesData(param, groupIndex);
            var option = {
                title : {
                    text: param.GROUP_TITLE,
                    subtext: '',
                    x:'center',
                    y:'15px',
                    textStyle: {
                        color: '#555'
                    }
                },
                tooltip: {
                    show: false
                },
                series: [{
                    type: 'wordCloud',
                    left: 'center',
                    top: 'center',
                    width: '70%',
                    height: '50%',
                    right: null,
                    bottom: null,
                    sizeRange: [1, 50],
                    rotationRange: [0, 0],
                    textStyle: {
                        normal: {
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                            // Color can be a callback function or a color string
                            color: function () {
                                // Random color
                                return 'rgb(99,99,99)';
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: seriesData
                }]
            };
            return option;
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

        getRadarTypeXaxisData: function (dimCol, groupIndex) {
            var xaxisData = [];
            fish.forEach(this.groupSimuDp[groupIndex], this.wrap(function (data) {
                xaxisData[xaxisData.length] = data[dimCol];
            }));
            return xaxisData;
        },

        getRadarChartOption: function (param, groupIndex) {
            var legendData = this.getRadarTypeLegendData(param.KPI_NO);
            var xAxisData = this.getRadarTypeXaxisData(param.DIM_NO, groupIndex);
            if(xAxisData.length == 0){
                for(var i=0;i<6;i++) {
                    xAxisData[xAxisData.length] = "";
                }
            }
            var seriesData = this.getPieTypeSeriesData(param, groupIndex);
            var maxValue = this.getMaxValue(seriesData);
            var seriesDataOpt = [];
            var indicatorOpt = [];
            for(var i=0; i<xAxisData.length; i++){
                indicatorOpt[indicatorOpt.length] = {
                    text: xAxisData[i],
                    max: maxValue
                }
            }

            var valueArray = [];
            for(var i=0; i<seriesData.length; i++){
                valueArray[valueArray.length] = seriesData[i].value;
            }
            seriesDataOpt[seriesDataOpt.length] = {
                name: legendData[0],
                value: valueArray
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
                    },
                    markLine : {
                        symbol: [null,null],
                        data : [

                        ]
                    }
                }
            ];
            this.option = {
                title : {
                    text: param.GROUP_TITLE,
                    subtext: '',
                    x:'center',
                    textStyle: {
                        fontWeight: 'normal'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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

        // 折线图配置
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
                            label : {color: '#555',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                background: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    triggerOn: 'mousemove'
                },
                dataZoom: {
                    height: 16,
                    show: (param && param.hasOwnProperty("dataZoom")?param.dataZoom:true),
                    realtime : true
                },
                toolbox: {
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
                        /*brush: {
                            type: ['rect']
                        }*/
                    }
                },
                /*brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                        colorAlpha: 0.1
                    }
                },*/
                legend: {
                    show: (param && param.hasOwnProperty("legend")?param.legend:true),
                    orient : 'horizontal',
                    x : 'center',
                    y : 'bottom',
                    data: legendData
                },
                calculable : true,
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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
                            label : {color: '#555',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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
                            label : {color: '#555',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            areaStyle: {type: 'default'},
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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
                            label : {color: '#555',
                                position: 'right',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                            label : {color: '#555',
                                position: 'insideRight',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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

        // 两个指标 特定呈现
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
                            label : {color: '#555',
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                            label : {color: '#555',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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
                            label : {color: '#555',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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
                            label : {color: '#555',
                                position: 'insideRight',
                                show: (param && param.hasOwnProperty("chart_label")?param.chart_label:true)
                            },
                            areaStyle: {type: 'default'},
                            color: this.axisColorCfgYaxisList[i],
                            lineStyle:{
                                color: this.axisColorCfgYaxisList[i]
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
                    show : !this.forDashBoard,
                    feature : {
                        dataView : {show: true, readOnly: false, title: 'DataView', lang:['DataView', 'Close', 'Refresh']},
                        saveAsImage : {show: true, title: 'SaveAsImage'}
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
                grid : {
                    y2: this.xAxisLabelHeight
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.xAxisData,
                        axisLabel : {
                            rotate : this.xAxisLabelRotate,
                            interval : this.xAxisLabelInterval=='auto'?'auto':parseInt(this.xAxisLabelInterval)
                        }
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

        updateGridColState: function (displayColList) {
            this.hideColList = [];
            this.showColList = [];
            if(displayColList==''){
                displayColList = [];
            }
            var flag = true;// 是否刷新表格过滤中的option
            if(this.$('#ad-displayfield-container-'+this.chart_id).children().length>0){
                flag = false;
            }
            for (var i = 0; i < this.colModel.length; i++) {
                var colObj = this.colModel[i];
                //
                var displayFieldHtmlText = "";
                if (displayColList.length == 0) {
                    this.showColList[this.showColList.length] = colObj.name;
                    displayFieldHtmlText = '<div><label class="control-label checkbox-inline">'
                    + '<input type="checkbox" name="ad-displayfield-item" value="' + colObj.index + '" checked="true">' + colObj.label + '</label></div>';
                } else {
                    var isDisplay = false;
                    for (var j = 0; j < displayColList.length && !isDisplay; j++) {
                        var displayColIndex = displayColList[j];
                        if (colObj.index == displayColIndex) {
                            this.showColList[this.showColList.length] = colObj.name;
                            isDisplay = true;
                            displayFieldHtmlText = '<div><label class="control-label checkbox-inline">'
                            + '<input type="checkbox" name="ad-displayfield-item" value="' + colObj.index + '" checked="true">' + colObj.label + '</label></div>';
                        }
                    }
                    if (!isDisplay) {
                        this.hideColList[this.hideColList.length] = colObj.name;
                        displayFieldHtmlText = '<div><label class="control-label checkbox-inline">'
                        + '<input type="checkbox" name="ad-displayfield-item" value="' + colObj.index + '">' + colObj.label + '</label></div>';
                    }
                }
                if (flag) {
                    // 过滤下拉框填充
                    this.$('#ad-dimfilter-fieldsel-' + this.chart_id).append('<option value="' + colObj.index + '">' + colObj.label + '</option>');
                    // 设置显示字段填充
                    this.$('#ad-displayfield-container-' + this.chart_id).append(displayFieldHtmlText);
                    // 排序填充
                    this.$('#ad-sortbox-fieldselect').append('<option value="' + colObj.index + '">' + colObj.label + '</option>');
                }
            }
            this.refreshGridCol();
        },

        refreshGridCol: function () {
            if(this.chart_type == "grid") {
                this.$("#ad-grid-container-" + this.chart_id).jqGrid("hideCol", this.hideColList);
                this.$("#ad-grid-container-" + this.chart_id).jqGrid("showCol", this.showColList);
            }
        },

        updateGridCfg: function (param) {
            this.$('#ad-chart-container-'+this.chart_id).hide();
            this.$('#ad-grid-container-'+this.chart_id).show();
            if(!this.forDashBoard){
                this.$('#ad-gridcfg-container-'+this.chart_id).show();
            }
            this.chart_type = "grid";
            this.colModel = [];
            this.mergeCols = [];
            var colIndex = 0;
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var item = this.selectedDimIndiList[i];
                //
                if(item.GL_DIMKPI!="1"){
                    continue;
                }
                if(item.COL_TYPE=='00' || item.COL_TYPE=='02'){// 维度
                    this.colModel[this.colModel.length] = {
                        name: "DIM_"+colIndex,
                        label: item.COL_NAME,
                        index: "DIM_"+colIndex,
                        width: "30%",
                        sortable: false,
                        colId: item.COL_NO,
                        colType: 0,
                        META_DIM_CODE: item.META_DIM_CODE
                    }
                    this.mergeCols[this.mergeCols.length] = colIndex++;
                }
            }
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var item = this.selectedDimIndiList[i];
                if(item.COL_TYPE=='01'){// 指标
                    var kpiIndex = "KPI_"+colIndex;
                    var colName = item.COL_NAME;
                    var showUnit = item.showUnit;
                    // 需要显示指标时 通过元数据接口获取指标并更新对应列头
                    if((showUnit=="true" || (showUnit!="false" && showUnit)) && this.cachedKpiUnit){
                        var kpiUnit = this.cachedKpiUnit.get(item.COL_NO);
                        var kpiUnitName = "";
                        fish.forEach(pmUtil.paravalue("UNIT"), function(para) {
                            if(para[pmUtil.parakey.val] == kpiUnit){
                                kpiUnitName = para[pmUtil.parakey.name];
                            }
                        }.bind(this));
                        this.cachedKpiUnit.put(kpiUnit, kpiUnitName);
                        item.kpiUnit = kpiUnit;
                        item.kpiUnitName = kpiUnitName;
                        colName = colName+"("+kpiUnitName+")";
                    }
                    var isDrill = false;
                    for(var j=0;j<this.drillColList.length && !isDrill;j++){
                        if(this.drillColList[j]==kpiIndex){
                            isDrill = true;
                        }
                    }
                    if(isDrill) {
                        if(item.displayType=="1"){
                            this.colModel[this.colModel.length] = {
                                name: "KPI_" + colIndex,
                                label: colName,
                                index: "KPI_" + colIndex,
                                width: "30%",
                                sortable: false,
                                colId: item.COL_NO,
                                colType: 1,
                                formatter: function (cellvalue, options, rowObject) {
                                    return "<a name='ad-grid-drill-cell' class='btn btn-link' lang=" + options.rowId + "-" + options.colModel.index + " type='button' style='text-decoration:underline;color:blue'>" + cellvalue + "%</a>";
                                }
                            }
                        }else {
                            this.colModel[this.colModel.length] = {
                                name: "KPI_" + colIndex,
                                label: colName,
                                index: "KPI_" + colIndex,
                                width: "30%",
                                sortable: false,
                                colId: item.COL_NO,
                                colType: 1,
                                formatter: function (cellvalue, options, rowObject) {
                                    return "<a name='ad-grid-drill-cell' class='btn btn-link' lang=" + options.rowId + "-" + options.colModel.index + " type='button' style='text-decoration:underline;color:blue'>" + cellvalue + "</a>";
                                }
                            }
                        }
                    }else{
                        if(item.displayType=="1"){
                            this.colModel[this.colModel.length] = {
                                name: "KPI_" + colIndex,
                                label: colName,
                                index: "KPI_" + colIndex,
                                width: "30%",
                                sortable: false,
                                colId: item.COL_NO,
                                colType: 1,
                                formatter: function (cellvalue, options, rowObject) {
                                    return cellvalue + "%";
                                }
                            }
                        }else{
                            this.colModel[this.colModel.length] = {
                                name: "KPI_" + colIndex,
                                label: colName,
                                index: "KPI_" + colIndex,
                                width: "30%",
                                sortable: false,
                                colId: item.COL_NO,
                                colType: 1
                            }
                        }
                    }
                    colIndex++;
                }
            }
            var opt;
            var isPager = (param && param.hasOwnProperty("pager")?param.pager:false);
            //
            if(!this.isMergeCell){
                this.mergeCols = [];
            }
            if(isPager){
                opt = {
                    colModel: this.colModel,
                    rowNum: 50,
                    rowList: [50, 100, 500],
                    pager: true,
                    gridComplete: this.wrap(function (e) {//数据加载完成触发的事件
                        this.$('[name="ad-grid-drill-cell"]').off();
                        this.$('[name="ad-grid-drill-cell"]').on("click", this.wrap(function(e){
                            this.cellLinkClick(e);
                        }));
                        this.$('#ad-grid-container-'+this.chart_id).jqGrid("mergeColCellByData", this.mergeCols); //指定 第4，6，7列相同数据进行合并
                    })
                }
            }else{
                opt = {
                    colModel: this.colModel,
                    pager: false,
                    gridComplete: this.wrap(function (e) {//数据加载完成触发的事件
                        this.$('[name="ad-grid-drill-cell"]').off();
                        this.$('[name="ad-grid-drill-cell"]').on("click", this.wrap(function(e){
                            this.cellLinkClick(e);
                        }));
                        this.$('#ad-grid-container-'+this.chart_id).jqGrid("mergeColCellByData", this.mergeCols); //指定 第4，6，7列相同数据进行合并
                    })
                };
            }
            // 初始化table
            this.$("#ad-chart-container-"+this.chart_id).empty();
            this.chart_height = this.chart_height == null ? 400 : this.chart_height;
            this.$grid = this.$el.find("#ad-grid-container-"+this.chart_id).grid(opt);
            var heightVariable = 78;
            if(this.chartTitle && this.chartTitle!=''){
                heightVariable += 18;
            }
            if(this.chartSubTitle && this.chartSubTitle!=''){
                heightVariable += 14;
            }
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridHeight", this.chart_height-heightVariable);
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridWidth", this.$('#chart-box').width()-20);
            this.$('#ad-grid-drill-content-'+this.chart_id).height(this.chart_height);
            //
            if(this.hideColList.length>0){
                this.refreshGridCol();
            }else if(this.displayColList.length==0){
                this.updateGridColState(this.showColList.slice(0));
            }else{
                this.updateGridColState(this.displayColList.slice(0));
            }
            //this.updateGridColState(this.showColList.slice(0));
            this.$('#ad-grid-container-'+this.chart_id).jqGrid("reloadData",this.simuDp);
            // 更改表头样式蓝底白字
            this.$("[role='columnheader']").css("background-color", "#039cfd");
            this.$(".ui-jqgrid-sortable").css("color", "#ffffff");
        },

        // 透视图配置
        updatePivotTableCfg: function (param) {
            var self = this;
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.chart_type = "pivottable";
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
                    newItem["Value"] = newItem[kpiField];
                    newItem["Kpi"] = kpiField;
                    pivotDp[pivotDp.length] = newItem;
                }));
            }));
            var dateFormat =       $.pivotUtilities.derivers.dateFormat;
            var sortAs =           $.pivotUtilities.sortAs;
            var tpl =              $.pivotUtilities.aggregatorTemplates;
            var fmt =              $.pivotUtilities.numberFormat({suffix: " "});
            if(self.pivotUIOptions!=""){
                var pivotUIOptionsObj = JSON.parse(self.pivotUIOptions);
                this.$('#ad-chart-container-'+this.chart_id).pivot(
                    pivotDp,
                    {
                        rows: pivotUIOptionsObj.rows,
                        cols: pivotUIOptionsObj.cols,
                        aggregator: tpl.sum(fmt)(["Value"])
                    }
                );
                self.pivotUIOptions = "";
            }else{
                this.$('#ad-chart-container-'+this.chart_id).pivot(
                    pivotDp,
                    {
                        rows: pivotRows,
                        cols: pivotCols,
                        aggregators: tpl.sum(fmt)(["Value"])
                    }
                );
            }
        },

        // 配置了显示指标单位时 需要异步调用元数据服务后刷新列头
        updateColNameByUnit: function () {
            var self = this;
            fish.forEach(this.selectedDimIndiList, function(dimIndiObj){
                if(dimIndiObj.hasOwnProperty("kpiUnitName")){
                    fish.forEach(this.colModel, function(col){
                        if(col.index == dimIndiObj.COL_INDEX){
                            col.name = dimIndiObj.COL_NAME+"("+dimIndiObj.kpiUnitName+")";
                        }
                    });
                }
            });
        },

        // 钻取
        cellLinkClick: function(e){
            var tmpStr = e.currentTarget.lang;
            var rowId = tmpStr.substring(0,tmpStr.indexOf("-"));
            var kpiIndex = tmpStr.substring(tmpStr.indexOf("-")+1);
            var rowData = this.$grid.jqGrid("getRowData", rowId);
            var kpiCode;
            var drillObj = new Object();
            drillObj["dimValue"] = new Object();
            fish.forEach(this.colModel, this.wrap(function(colObj) {
                if(colObj.index == kpiIndex){
                    kpiCode = colObj.colId;
                }
                if(colObj.colType==0){
                    var idCol = colObj.index + "_ID";
                    var dimValue = "";
                    if(rowData.hasOwnProperty(idCol)){
                        dimValue = rowData[idCol];
                    }else{
                        dimValue = rowData[colObj.index];
                    }
                    drillObj.dimValue[colObj.colId] = dimValue;
                }
            }));
            drillObj.kpiCode = kpiCode;
            drillObj.dimValue.BTIME = this.btime;
            drillObj.dimValue.ETIME = this.etime;
            this.$('#ad-grid-drill-'+this.chart_id).show();
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            //
            this.$('#ad-grid-drill-content-'+this.chart_id).empty();
            portal.require([
                'oss_core/pm/counter/views/CounterQry'
            ], this.wrap(function (counterQry) {
                var view = new counterQry(drillObj);
                this.$('#ad-grid-drill-content-'+this.chart_id).html(view.render().$el);
                view.doComplete();
                this.listenTo(view, 'exitCountQry', this.wrap(function (data) {
                    this.exitCellDrill();
                }));
                /*var view = new counterQry({kpiCode:"",bTime:"",eTime:""});
                view.render();
                console.log(this.chart_id);
                var $v=$(view.$el[0]);
                this.$('#ad-grid-drill-content-'+this.chart_id).append($v.find(".ad-drill-table"));
                view.afterRender();*/
            }));
        },

        exitCellDrill: function(e) {
            this.$('#ad-grid-drill-'+this.chart_id).hide();
            this.$('#ad-grid-container-'+this.chart_id).show();
            this.$('#ad-gridcfg-container-'+this.chart_id).show();
        },

        updateSimuDp: function (dataList) {
            this.simuDp = dataList?dataList:[];
            // 格式化数据
            fish.forEach(this.simuDp, this.wrap(function(data){
                fish.forEach(this.selectedDimIndiList, this.wrap(function(kpiCfgObj){
                    if(kpiCfgObj.COL_TYPE=="01"){
                        if(kpiCfgObj.hasOwnProperty("precision")){
                            data[kpiCfgObj.COL_INDEX] = this.definedRound(Number(data[kpiCfgObj.COL_INDEX]),kpiCfgObj.precision);
                        }
                        if(kpiCfgObj.isThousandDisplay=="true" && this.chart_type=="grid"){
                            data[kpiCfgObj.COL_INDEX] = adhocUtil.toThousands(data[kpiCfgObj.COL_INDEX]);
                        }
                    }
                }));
            }));
            if(this.simuDp.length<10000 && this.simuDp.length>0){
                this.$('#ad-pivottable-btn-'+this.chart_id).show();
            }else{
                this.$('#ad-pivottable-btn-'+this.chart_id).hide();
            }
        },

        updateGroupSimuDp: function (dataList, groupIndex) {
            dataList = dataList?dataList:[];
            fish.forEach(dataList, this.wrap(function(data){
                fish.forEach(this.selectedDimIndiList, this.wrap(function(kpiCfgObj){
                    if(kpiCfgObj.COL_TYPE=="01"){
                        if(kpiCfgObj.hasOwnProperty("precision")){
                            data[kpiCfgObj.COL_INDEX] = this.definedRound(Number(data[kpiCfgObj.COL_INDEX]),kpiCfgObj.precision);
                        }
                        if(kpiCfgObj.isThousandDisplay=="true" && this.chart_type=="grid"){
                            data[kpiCfgObj.COL_INDEX] = adhocUtil.toThousands(data[kpiCfgObj.COL_INDEX]);
                        }
                    }
                }));
            }));
            this.groupSimuDp[groupIndex] = dataList;
        },

        updateCompareAnalysis: function (dataList, isAnalysisCompare) {
            var oldOption = this.option;
            var compareKpi = this.$('#ad-compareanalysis-kpisel').val();
            var compareKpiName = this.$('#ad-compareanalysis-kpisel').find("option:selected").text();
            var index;
            for(index=0; index<oldOption.legend.data.length; index++) {
                if (compareKpiName == oldOption.legend.data[index]) {
                    break;
                }
            }
            compareKpiName += "(*)";
            //
            var legendData = oldOption.legend.data.slice(0,this.axisCfgYaxisList.length);
            if(isAnalysisCompare){
                legendData[legendData.length] = compareKpiName;
            }
            oldOption.legend = {
                data: legendData,
                orient: oldOption.legend.orient,
                show: oldOption.legend.show,
                x: oldOption.legend.x,
                y: oldOption.legend.y
            }
            //
            var xAxisData = oldOption.xAxis[0].data;
            var oldSery = oldOption.series[index];
            var newSeryData = [];
            if(this.axisCfgXaxisDataType!="2") {
                for (var i = 0; i < oldSery.data.length; i++) {
                    var oldXvalue = oldSery.data[i].name;
                    var isXmathch = false;
                    for (var j = 0; j < dataList.length && !isXmathch; j++) {
                        var newXvalue = dataList[j][this.axisCfgXaxis];
                        var newYvalue = dataList[j][compareKpi];
                        if (oldXvalue == newXvalue) {
                            newSeryData[newSeryData.length] = {
                                name: newXvalue,
                                value: newYvalue
                            }
                            isXmathch = true;
                        }
                    }
                    if (!isXmathch) {
                        newSeryData[newSeryData.length] = {
                            name: oldXvalue,
                            value: 0
                        }
                    }
                }
            }else{// x轴为时间字段时无需匹配
                for(var i=0; i<oldSery.data.length && i<dataList.length; i++){
                    newSeryData[newSeryData.length] = {
                        name: xAxisData[i],
                        value: dataList[i][compareKpi]
                    }
                }
            }
            var sery = {
                data: newSeryData,
                itemStyle: oldSery.itemStyle,
                markLine: oldSery.markLine,
                name: compareKpiName,
                type: oldSery.type,
                yAxisIndex: oldSery.yAxisIndex
            }
            //
            oldOption.series = oldOption.series.slice(0,this.axisCfgYaxisList.length);
            if(isAnalysisCompare){
                oldOption.series[oldOption.series.length] = sery;
            }
            this.chart.setOption(oldOption, true);
        },

        getSimuDp: function() {
            var simuDp = [];
            for(var i=1; i<6; i++){
                var dataObj = {};
                fish.forEach(this.colModel, this.wrap(function(colObj) {
                    if(colObj.colType == 0){
                        dataObj[colObj.name] = colObj.label +" "+ i;
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
                return topSimuDp;
            }else{
                return simuDp;
            }
        },

        // 根据条件格式刷新单元格背景
        updateGridByCondiFmt: function (condiFmtItemList) {
            fish.forEach(condiFmtItemList, this.wrap(function(item){
                if(typeof(item) == 'string'){
                    item = JSON.parse(item);
                }
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
                            cellValue = parseFloat(cellValue.replace(/,/g, ""));
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
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "column";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getColChartOption(param));
            this.chart.off();
            this.chart.on('click', this.wrap(function (params) {
                if(this.viewExtensionWin){
                    this.viewExtensionWin.close();
                }
                this.showDrillEntranceDialog(params);
                params.event.event.stopPropagation();
            }));
        },

        showDrillEntranceDialog: function (params) {
            var self = this;
            if(self.drillEntranceWin){
                self.drillEntranceWin.close();
            }
            var leftPosition = params.event.event.clientX+20;
            var topPosition = params.event.event.clientY-10;
            var sData = {
                leftPosition: leftPosition,
                topPosition: topPosition,
                params: params
            };
            var dialog = new drillEntranceWin(sData);
            var content = dialog.render().$el;
            var option = {
                content: content,
                width: 145,
                height: 30,
                modal: false
            };
            this.drillEntranceWin = fish.popup(option);
            dialog.contentReady();
            this.listenTo(dialog, 'viewExtension', function (data) {
                self.showViewExtensionDialog(data);
                self.drillEntranceWin.close();
            });
            this.listenTo(dialog, 'cancelEvent',function () {
                self.drillEntranceWin.close();
            });
            /*_.delay(function () {
                if(this.drillEntranceWin){
                    this.drillEntranceWin.close();
                }
            }.bind(this), 2500);*/
        },

        showViewExtensionDialog: function (params) {
            var self = this;
            var currentDim;
            this.selectedDimIndiList = this.selectedDimIndiList;
            fish.forEach(this.selectedDimIndiList, function(dimObj){
               if(dimObj.COL_INDEX == self.axisCfgXaxis){
                   currentDim = dimObj;
                   currentDim.DIM_CODE = currentDim.COL_NO;
                   fish.forEach(self.dimListInModel, function(dimInModel){
                       if(dimInModel.DIM_CODE == currentDim.DIM_CODE){
                           currentDim.DATA_TYPE = dimInModel.DATA_TYPE;
                       }
                   })
               }
            });
            if(!currentDim){
                currentDim = this.extendDimList[this.extendDimList.length-1];
            }
            var dimListExcludeXAxis = [];
            fish.forEach(this.dimListInModel, function(dimObj){
                var isExist = false;
                if(dimObj.DIM_CODE==currentDim.DIM_CODE || dimObj.DIM_CODE==self.axisCfgXaxis_bak){
                    isExist = true;
                }
                fish.forEach(self.extendDimList, function(extendDimObj){
                    if(dimObj.DIM_CODE==extendDimObj.DIM_CODE) {
                        isExist = true;
                    }
                });
                if(!isExist){
                    dimListExcludeXAxis[dimListExcludeXAxis.length] = dimObj;
                }
            })
            if(self.viewExtensionWin){
                self.viewExtensionWin.close();
            }
            var leftPosition = params.leftPosition;
            var topPosition = params.topPosition;
            //
            if(currentDim.META_DIM_CODE){
                var currentDimValue = params.params.name;
                fish.forEach(this.simuDp, function(data){
                    if(data[currentDim.DIM_CODE+"_NAME"] == currentDimValue){
                        currentDimValue = data[currentDim.DIM_CODE+"_ID"];
                        params.params.name = currentDimValue;
                    }
                });
            }
            var sData = {
                leftPosition: leftPosition,
                topPosition: topPosition,
                params: params,
                xAxisDim: currentDim,
                dimList: dimListExcludeXAxis
            };
            var dialog = new viewExtensionDialog(sData);
            var content = dialog.render().$el;
            var option = {
                content: content,
                width: 200,
                height: 40 + 20 + (dimListExcludeXAxis.length>5?5:dimListExcludeXAxis.length)*28,
                modal: false
            };
            this.viewExtensionWin = fish.popup(option);
            dialog.contentReady();
            this.listenTo(dialog, 'extendDimSelect', function (data) {
                self.trigger("extendDimSelect",{
                    chart_id: self.chart_id,
                    extendDim: data.extendDim,
                    extendFilterCondition: data.filterCondition
                });
                self.viewExtensionWin.close();
            });
            this.listenTo(dialog, 'cancelEvent',function () {
                self.viewExtensionWin.close();
            });
            /*_.delay(function () {
             if(this.viewExtensionWin){
             this.viewExtensionWin.close();
             }
             }.bind(this), 2500);*/
        },

        switchDimExtend: function (e){
            var self = this;
            var dimCode = e.currentTarget.name.substring(14);
            var extendDimList_new = [];
            var extendDimFilterList_new = [];
            for(var i=0;i<this.extendDimList.length;i++){
                var extendDim = this.extendDimList[i];
                if(extendDim.DIM_CODE!=dimCode){
                    extendDimList_new[extendDimList_new.length] = extendDim;
                    extendDimFilterList_new[extendDimFilterList_new.length] = this.extendDimFilterList[i];
                }else{
                    extendDimList_new[extendDimList_new.length] = extendDim;
                    extendDimFilterList_new[extendDimFilterList_new.length] = this.extendDimFilterList[i];
                    break;
                }
            }
            this.axisCfgXaxis = dimCode;
            this.extendDimList = extendDimList_new;
            this.extendDimFilterList = extendDimFilterList_new;
            //
            this.$("#ad-chart-extendstep-"+this.chart_id).empty();
            var appendHtml = "<a name='ad-extendstep-all' class='btn btn-link' type='button' style='color:blue'>" + self.resource.ALL + "</a>";
            this.$("#ad-chart-extendstep-"+this.chart_id).append(appendHtml);
            this.$('[name=ad-extendstep-all]').off();
            this.$('[name=ad-extendstep-all]').on("click", function(){
                self.restoreDimExtend();
            });
            fish.forEach(this.extendDimList, function(dimObj){
                var appendHtml = "<a name='ad-extendstep-"+dimObj.DIM_CODE+"' class='btn btn-link' type='button' style='color:blue'>" + dimObj.DIM_NAME + "</a>";
                self.$("#ad-chart-extendstep-"+self.chart_id).append(" > " + appendHtml);
                self.$('[name=ad-extendstep-'+dimObj.DIM_CODE+']').off();
                self.$('[name=ad-extendstep-'+dimObj.DIM_CODE+']').on("click", function(e){
                    self.switchDimExtend(e);
                });
            });
            this.trigger("queryDataForChart", this);
        },

        restoreDimExtend: function (){
            var self = this;
            this.$("#ad-chart-extendstep-"+this.chart_id).empty();
            this.extendDimList = []; // 扩展分析的字段集合
            this.extendDimFilterList = []; // 扩展分析的当前维度过滤条件集合
            fish.forEach(this.selectedDimIndiList, function(dimObj){
                if(dimObj.COL_NO == self.axisCfgXaxis_bak){
                    self.axisCfgXaxis = dimObj.COL_INDEX;
                }
            });
            this.axisCfgXaxis_bak = "";
            this.trigger("queryDataForChart", this);
        },

        updatePieCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "pie";
            this.$("#ad-chart-container-"+this.chart_id).innerHTML = '';
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
                this.$("#ad-chart-container-"+this.chart_id).append('<div style="height: ' + this.$('#ad-chart-container-'+this.chart_id).height() + 'px" class="col-md-' + mdValue + '"></div>');
                var pieChart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0].children[i]);
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                pieChart.setOption(this.getPieChartOption(param));
            }
        },

        updateKpiCardCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "kpicard";
            this.$("#ad-chart-container-"+this.chart_id).innerHTML = '';
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
                this.$("#ad-chart-container-"+this.chart_id).append('<div style="height: ' + this.$('#ad-chart-container-'+this.chart_id).height() + 'px" class="col-md-' + mdValue + '"></div>');
                var chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0].children[i]);
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                chart.setOption(this.getKpiCardOption(param));
            }
        },

        updateRadarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "radar";
            this.$("#ad-chart-container-"+this.chart_id).innerHTML = '';
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
                this.$("#ad-chart-container-"+this.chart_id).append('<div style="height: ' + this.$('#ad-chart-container-'+this.chart_id).height() + 'px" class="col-md-' + mdValue + '"></div>');
                var radarChart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0].children[i]);
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                radarChart.setOption(this.getRadarChartOption(param));
            }
        },

        updateLineCfg: function (param) {
            var self = this;
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "line";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getLineChartOption(param));
            /*this.chart.on('brushSelected', function(params){
                self.renderBrushed(params);
            });*/
            this.chart.off();
            this.chart.on('click', this.wrap(function (params) {
                this.showDrillEntranceDialog(params);
            }));
        },

        renderBrushed: function(params) {
            var sum = 0;
            var min = Infinity;
            var max = -Infinity;
            var countBySeries = [];
            var brushComponent = params.brushComponents[0];

            var rawIndices = brushComponent.series[0].rawIndices;
            for (var i = 0; i < rawIndices.length; i++) {
                var val = data.values[rawIndices[i]][1];
                sum += val;
                min = Math.min(val, min);
                max = Math.max(val, max);
            }

            var htmlText = '<h3>STATISTICS:</h3>'+
                 'SUM of open: ' + (sum / rawIndices.length).toFixed(4) + '<br>'+
                 'MIN of open: ' + min.toFixed(4) + '<br>'+
                 'MAX of open: ' + max.toFixed(4) + '<br>';
        },

        updateAreaCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "area";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getAreaChartOption(param));
        },

        updateBarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "bar";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getBarChartOption(param));
        },

        updateTreeCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "tree";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getTreeChartOption(param));
        },

        updateDuijiBarCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "duijibar";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getDuijiBarChartOption(param));
        },

        updateScatterCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "scatter";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getScatterChartOption(param));
        },

        updateDoubleAxisCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "doubleaxis";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            if(this.firstAxisKpiList.length==0 && this.secondAxisKpiList.length==0){
                fish.forEach(this.colModel, this.wrap(function (colObj) {
                    if(colObj.colType == 1){
                        this.firstAxisKpiList[this.firstAxisKpiList.length] = colObj.name;
                    }
                }));
                if(this.firstAxisKpiList.length>1){
                    this.secondAxisKpiList[this.secondAxisKpiList.length] = this.firstAxisKpiList[this.firstAxisKpiList.length-1];
                    this.firstAxisKpiList.splice(this.firstAxisKpiList.length-1, 1);
                }
            }
            this.chart.setOption(this.getDoubleAxisChartOption(param));
        },

        updateDuijiColumnCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "duijicolumn";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getDuijiColumnChartOption(param));
        },

        updateDuijiAreaCfg: function (param) {
            this.$('#ad-grid-container-'+this.chart_id).hide();
            this.$('#ad-gridcfg-container-'+this.chart_id).hide();
            this.$('#ad-chart-container-'+this.chart_id).show();
            this.chart_type = "duijiarea";
            this.chart = echarts.init(this.$("#ad-chart-container-"+this.chart_id)[0]);
            this.chart.setOption(this.getDuijiAreaChartOption(param));
        },

        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        updateChartHeight: function () {
            if(this.uiContainerHeight){
                this.chart_height = this.uiContainerHeight-5;
            };
            this.$('#chart-box').height();
            var heightVariable = 65;
            var chartHeightVariable = 55;
            if(this.chartTitle && this.chartTitle!=''){
                heightVariable += 18;
            }
            if(this.chartSubTitle && this.chartSubTitle!=''){
                heightVariable += 14;
            }
            if(this.isCompareAnalysis && this.isCompareAnalysis!="false"){
                chartHeightVariable -= 55;
            }
            if(this.chart_type=="pivottable"){
                chartHeightVariable -= 20;
            }
            if(this.forDashBoard){
                this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridHeight", this.chart_height-heightVariable);
            }else{
                this.$('#ad-grid-container-'+this.chart_id).jqGrid("setGridHeight", this.chart_height-heightVariable);
            }
            this.$("#ad-chart-container-"+this.chart_id).height(this.chart_height-heightVariable+chartHeightVariable);
            if(this.chart_type=="pivottable"){
                if((this.chartSubTitle && this.chartSubTitle!='') || (this.chartTitle && this.chartTitle!='')) {
                    this.$('#ad-chart-container-'+this.chart_id).css("margin-top", 32);
                }
            }
            if(this.chart){
                this.chart.resize();
            }
            if(this.groupChartList.length>0){
                this.$("#ad-chart-container-"+this.chart_id+" div").height(this.chart_height-heightVariable+chartHeightVariable);
                this.$("#ad-wordcloud-container-"+this.chart_id+" div").height(this.chart_height-heightVariable+chartHeightVariable);
                fish.forEach(this.groupChartList, function(chart){
                    chart.resize();
                });
            }
        },

        updateTitle: function () {
            this.$('#ad-chart-title-'+this.chart_id).text(this.chartTitle);
            this.$('#ad-chart-subtitle-'+this.chart_id).text(this.chartSubTitle);
            this.$('#ad-chart-titlecontainer-'+this.chart_id).attr("class", "text-"+this.titleAlign);
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

        dimFilterConfirm: function () {
            if (this.filterFieldType == "0") {
                if (this.META_DIM_CODE) {
                    if (this.selectedFilterValueList.length != 0) {
                        this.addFilterCondition();
                    }
                } else {
                    var filterCondiValue = adhocUtil.trim(this.$('#ad-dimfilter-condivalue').val());
                    if (filterCondiValue != "") {
                        this.addFilterCondition();
                    }
                }
            }else {
                var filterCondiValue = adhocUtil.trim(this.$('#ad-kpifilter-condivalue').val());
                if(filterCondiValue!=""){
                    this.addFilterCondition();
                }
            }
            this.loadChartData();
        },

        sortRuleConfirm: function () {
            if(this.sortList.length==0){
                this.addSortRule();
            }
            this.loadChartData();
        },

        displayFieldConfirm: function () {
            var displayFieldCheckboxs = $('[name="ad-displayfield-item"]');
            fish.forEach(displayFieldCheckboxs, this.wrap(function(chkBox){
                if(chkBox.checked == false){// 取消显示 取消时需要判断是否存在过滤项和排序项为此字段
                    var colIndex = chkBox.value;
                    for(var i=0; i<this.showColList.length; i++){
                        if(this.showColList[i] == chkBox.value){
                            this.showColList.splice(i,1);
                            this.hideColList[this.hideColList.length] = chkBox.value;
                            break;
                        }
                    }
                }else{
                    for(var i=0; i<this.hideColList.length; i++){
                        if(this.hideColList[i] == chkBox.value){
                            this.hideColList.splice(i,1);
                            this.showColList[this.showColList.length] = chkBox.value;
                            break;
                        }
                    }
                }
            }));
            this.refreshGridCol();
            this.loadChartData();
        },

        loadChartData: function () {
            this.trigger("queryDataForChart", this);
        },

        gridExport: function () {
            action.gridExport({
                colModel: this.colModel,
                dataList: this.simuDp
            }, this.wrap(function (data) {
                var filePath = data.fileName;
                var url = portal.appGlobal.attributes.webroot + '/download?filePath=' + filePath;
                var down = $('<a href="undefine.htm" ></a>');
                down.attr("href",url);
                down.appendTo('body');
                down[0].click();
                down.remove();
            }));
        },

        blankClick: function () {
            this.trigger("chartBlankClick");
        },

        resize: function () {
            if(this.chart){
                chart.resize();
            }
        },

        dashBoardResize: function (resizeWidth, resizeHeight) {
            this.uiContainerHeight = resizeHeight;
            this.updateChartHeight();
        }

    })
});
