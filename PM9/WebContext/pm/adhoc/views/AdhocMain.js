/**
 *
 */
define([
        'text!oss_core/pm/adhoc/templates/AdhocMain.html',
        'oss_core/pm/adhoc/actions/AdhocAction',
        "oss_core/pm/adhoc/assets/js/echarts-all-3",
        "oss_core/pm/adhoc/views/AdhocUtil",
        "oss_core/pm/util/views/Util",
        "oss_core/pm/adhoc/views/ChartContainer",
        "oss_core/pm/adhoc/views/FilterItem",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        'css!oss_core/pm/util/css/ad-component.css',
        'css!oss_core/pm/util/css/ad-block.css',
        'css!oss_core/pm/adhoc/assets/bi-common.css',
        'css!oss_core/pm/adhoc/assets/adhoc.css'
    ],
    function(mainTpl, action, echarts, adhocUtil, util, chartContainer, filterItem, i18nData) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #ad-query-btn': "queryData",
            'click #ad-backtodesigner-btn': "backToDesigner",
            'click #ad-highlevelfilter-btn': "highLevelFilterBtnClick"
        },

        initialize: function (opt) {
            var self = this;
            this.opt = opt;
            this.topicNo = opt.topicNo;
            // 0-数据库预览 1-前台预览 2-Dashboard
            this.previewType = opt.previewType?opt.previewType:0;
            this.btime = opt.btime?opt.btime:'';
            this.etime = opt.etime?opt.etime:'';
            this.initDateGranu = opt.dateGranu?opt.dateGranu:'';
            this.initDateGranuType = opt.loadDataParam?opt.loadDataParam.dateGranuType:'';
            this.initLoadDataParam = opt.loadDataParam?opt.loadDataParam:null;
            this.chartList = [];
            this.selectedDimIndiList = [];
            this.dimAndIndiSortList = [];
            this.vdimList = [];
            this.topicFilterList = [];
            this.highlevelFilterDisplay = false;
            this.forDashBoard = opt.forDashBoard?opt.forDashBoard:false;
            this.uiContainerHeight = opt.uiContainerHeight;
            this.cachedMapTypeList = [];
            // 缓存全局虚拟维度
            this.globalVdimData = new Object();
            this.globalVdimList = [];
            action.getGlobalVdimList({

            }, this.wrap(function (data) {
                this.globalVdimData = data;
                // 全局虚拟维度添加至树上
                fish.forEach(this.globalVdimData.vdimList, this.wrap(function(globalVdim) {
                    var isExistInModel = false;
                    var globalVdim = {
                        "VDIM_CODE": globalVdim.VDIM_CODE,
                        "VDIM_NAME": globalVdim.VDIM_NAME,
                        "VDIM_FIELD": globalVdim.FIELD_CODE,
                        "VDIM_TYPE": globalVdim.GROUP_TYPE,
                        "NOGROUP_NAME": "",
                        "groupList": []
                    };
                    fish.forEach(self.globalVdimData.vdimGroupList, function(vdimGroup){
                        if(vdimGroup.VDIM_CODE == globalVdim.VDIM_CODE) {
                            var group_no = vdimGroup.GROUP_NO;
                            var group_name = vdimGroup.GROUP_NAME;
                            if (group_no == "0") {
                                globalVdim.NOGROUP_NAME = group_name;
                            } else {
                                var items = [];
                                fish.forEach(self.globalVdimData.vdimGroupDetailList, function(vdimGroupItem){
                                    if(vdimGroupItem.VDIM_CODE == globalVdim.VDIM_CODE &&
                                        vdimGroupItem.GROUP_NO == group_no) {
                                        items[items.length] = {
                                            id: vdimGroupItem.GROUP_ATTR
                                        }
                                    }
                                });
                                globalVdim.groupList[globalVdim.groupList.length] = {
                                    expression: "",
                                    items: items,
                                    id: group_no,
                                    name: group_name
                                }
                            }
                        }
                    });
                    this.globalVdimList[this.globalVdimList.length] = globalVdim;
                }));
            }));
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({SLA_TYPE: ""}, this.resource)));
            return this;
        },

        afterRender: function () {
            var self = this;
            if(this.previewType==2){
                this.adaptForDashBoard();
            }
            // 缓存元数据
            this.cachedDim = new adhocUtil.HashMap();
            this.cachedIndi = new adhocUtil.HashMap();
            this.cachedDimCode = new adhocUtil.HashMap();
            this.cachedDimDataType = new adhocUtil.HashMap();
            this.cachedKpiUnit = new adhocUtil.HashMap();
            this.cachedIndiForm = new adhocUtil.HashMap();
            // PARA_NAME PARA_VALUE PARA_ID
            this.granu_h = util.paravalue('GRANU_H')[0];
            this.granu_h.NAME = this.resource.HOUR;
            this.granu_h.ID = "_H";
            //
            this.granu_d = util.paravalue('GRANU_D')[0];
            this.granu_d.NAME = this.resource.DAY;
            this.granu_d.ID = "_D";
            //
            this.granu_w = util.paravalue('GRANU_W')[0];
            this.granu_w.NAME = this.resource.WEEK;
            this.granu_w.ID = "_W";
            //
            this.granu_m = util.paravalue('GRANU_M')[0];
            this.granu_m.NAME = this.resource.MONTH;
            this.granu_m.ID = "_M";
            //
            this.dimList = [];
            this.kpiList = [];
            this.modelList = [];
            this.cacheMetaData = action.cacheModelData({}, this.wrap(function (data) {
                fish.forEach(data.DIMS, this.wrap(function(dim){
                    this.cachedDimCode.put(dim.FIELD_CODE, dim.DIM_CODE);
                    this.cachedDim.put(dim.FIELD_CODE, dim.FIELD_NAME);
                    this.cachedDimDataType.put(dim.FIELD_CODE, dim.DATA_TYPE);
                    this.dimList[this.dimList.length] = {
                        DIM_CODE: dim.FIELD_CODE,
                        META_DIM_CODE: dim.DIM_CODE,
                        DIM_NAME: dim.FIELD_NAME
                    }
                }));
                fish.forEach(data.KPIS, this.wrap(function(kpi){
                    this.cachedIndi.put(kpi.FIELD_CODE, kpi.FIELD_NAME);
                    this.kpiList[this.kpiList.length] = {
                        EMS_TYPE_REL_ID: kpi.EMS_TYPE_REL_ID,
                        KPI_CODE: kpi.FIELD_CODE,
                        KPI_NAME: kpi.FIELD_NAME
                    };
                }));
                var kpiCodeListStr = "";
                for(var i=0;i<data.modelField.length;i++){
                    var modelFieldObj = data.modelField[i];
                    var modelObj;
                    var MODEL_CODE = modelFieldObj.MODEL_BUSI_CODE;
                    var MODEL_PHY_CODE = modelFieldObj.MODEL_PHY_CODE;
                    var MODEL_NAME = modelFieldObj.MODEL_BUSI_NAME;
                    var FIELD_CODE = modelFieldObj.FIELD_CODE;
                    var DIM_CODE = this.cachedDimCode.get(FIELD_CODE);
                    var FIELD_NAME = modelFieldObj.FIELD_NAME;
                    var FIELD_TYPE = modelFieldObj.FIELD_TYPE;
                    var DATA_TYPE = modelFieldObj.DATA_TYPE;// 2-时间类型
                    var TIMESPAN_OBJ = adhocUtil.parseGranuModeJson(modelFieldObj.GRANU_MODE);
                    var MODEL_TIMESPAN = TIMESPAN_OBJ.granuStr;
                    var MODEL_TIMESPAN_NAME = TIMESPAN_OBJ.granuNameStr;
                    var isExist = false;
                    for(var j=0;j<this.modelList.length && !isExist;j++){
                        modelObj = this.modelList[j];
                        if(modelObj.MODEL_CODE == MODEL_CODE){
                            isExist = true;
                        }
                    }
                    if(!isExist){
                        modelObj = {
                            MODEL_CODE: MODEL_CODE,
                            MODEL_PHY_CODE: MODEL_PHY_CODE,
                            MODEL_NAME: MODEL_NAME,
                            MODEL_TIMESPAN: MODEL_TIMESPAN,
                            MODEL_TIMESPAN_NAME: MODEL_TIMESPAN_NAME,
                            DIMS: [],
                            INDICATORS: []
                        };
                        this.modelList[this.modelList.length] = modelObj;
                    }
                    //
                    if(FIELD_TYPE=="0"){
                        modelObj.DIMS[modelObj.DIMS.length] = {
                            DIM_CODE: FIELD_CODE,
                            META_DIM_CODE: DIM_CODE,
                            DIM_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }else if(FIELD_TYPE=="1"){
                        kpiCodeListStr += FIELD_CODE + ","
                        modelObj.INDICATORS[modelObj.INDICATORS.length] = {
                            KPI_CODE: FIELD_CODE,
                            KPI_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE,
                            KPI_FORM: ""
                        }
                    }
                };
                fish.forEach(this.modelList, this.wrap(function(model) {
                    var modelCode = model.MODEL_CODE;
                    fish.forEach(model.DIMS, this.wrap(function (dim) {
                        this.cachedDim.put(modelCode + "-" + dim.DIM_CODE, dim.DIM_NAME);
                    }));
                    fish.forEach(model.INDICATORS, this.wrap(function (indi) {
                        this.cachedIndi.put(modelCode + "-" + indi.KPI_CODE, indi.KPI_NAME);
                    }));
                }));
                kpiCodeListStr = kpiCodeListStr.substr(0,kpiCodeListStr.length-1);
                action.metaKpiQuery({KPI_CODE_S: kpiCodeListStr}, this.wrap(function (kpidata) {
                    fish.forEach(kpidata.kpiFormular, this.wrap(function(kpiFormObj){
                        var kpiForm = "";
                        if(kpiFormObj.KPI_TYPE=="1"){
                            kpiForm = kpiFormObj.KPI_AGG + "(" + kpiFormObj.KPI_CODE + ")";
                        }else{
                            kpiForm = kpiFormObj.KPI_FORM;
                        }
                        this.cachedIndiForm.put(kpiFormObj.KPI_CODE, kpiForm);
                    }));
                    action.cacheMapType({}, function (mapTypeData) {
                        if(mapTypeData && mapTypeData.mapTypeList && mapTypeData.mapTypeList.length>0){
                            self.cachedMapTypeList = [];
                            fish.forEach(mapTypeData.mapTypeList, function(mapType){
                                self.cachedMapTypeList[self.cachedMapTypeList.length] = mapType;
                            });
                        }
                        if(self.previewType==0 || self.previewType==2){
                            self.loadTopicDetailByTopicNo();
                        }else if(self.previewType==1){
                            self.loadTopicDetailByParams();
                        }
                    });
                }));
            }));
            action.metaKpiDetailQuery({}, this.wrap(function (data) {
                fish.forEach(data.kpiList, this.wrap(function(kpi){
                    this.cachedKpiUnit.put(kpi.KPI_CODE, kpi.UNIT);
                }));
            }));
        },

        showBackDesigner: function () {
            this.$('#ad-backtodesigner-btn').show();
        },

        refreshDateGranuSelect: function () {
            this.$("#ad-dategranu-select").empty();
            for(var i=0; i<this.dateGranList.length; i++) {
                var dateGranuObj = this.dateGranList[i];
                if(i!=0) {
                    this.$("#ad-dategranu-select").append('<a href="#" id="ad-dategranu'+dateGranuObj.ID+'" name="ad-dategranu-btn" class="btn btn-default ">' + dateGranuObj.NAME + '</a>');
                }else{
                    this.$("#ad-dategranu-select").append('<a href="#" id="ad-dategranu'+dateGranuObj.ID+'" name="ad-dategranu-btn" class="btn btn-default  active">' + dateGranuObj.NAME + '</a>');
                }
                this.$('#ad-dategranu'+dateGranuObj.ID).off();
                this.$('#ad-dategranu'+dateGranuObj.ID).on("click", this.wrap(function(e){
                    this.dateGranuClick(e);
                }));
            }
        },

        dateGranuClick: function (e) {
            var elementId = e.currentTarget.id;
            this.dateGranChange(elementId);
        },

        // 粒度改变事件
        dateGranChange: function (elementId) {
            var self = this;
            this.$("[name='ad-dategranu-btn']").removeClass("active");
            this.$("#"+elementId).addClass("active");
            this.selectedDateGranu = elementId.substring(12);
            var dateGranuObj;
            for(var i=0; i<this.dateGranList.length; i++){
                if(this.dateGranList[i].ID == this.selectedDateGranu){
                    dateGranuObj = this.dateGranList[i];
                    break;
                }
            }
            //
            var dateTypeValueList = dateGranuObj.PARA_VALUE.split(",");
            var dateTypeNameList = dateGranuObj.PARA_NAME.split(",");
            this.$("#ad-datetype-select").empty();
            var i = 0;
            for(; i<dateTypeValueList.length; i++) {
                var value = dateTypeValueList[i];
                var name = dateTypeNameList[i];
                if(i!=0) {
                    this.$("#ad-datetype-select").append('<a data-original-title="'+name+'" data-toggle="tooltip" id="ad-datetype-'+value+'" name="ad-datetype-btn" class="btn btn-default tooltip-test a'+(i+1)+'"></a>');
                }else{
                    this.$("#ad-datetype-select").append('<a data-original-title="'+name+'" data-toggle="tooltip" id="ad-datetype-'+value+'" name="ad-datetype-btn" class="active btn btn-default tooltip-test a'+(i+1)+'"></a>');
                }
                this.$('#ad-datetype-'+value).off();
                this.$('#ad-datetype-'+value).on("click", this.wrap(function(e){
                    this.dateTypeChange(e.currentTarget.id);
                }));
            }

            this.$("#ad-datetype-select").append('<a data-original-title="'+self.resource.CUSTOM+'" data-toggle="tooltip" id="ad-datetype-custom" name="ad-datetype-btn" class="btn btn-default tooltip-test a'+(i+1)+'"></a>');
            this.$('#ad-datetype-custom').off();
            this.$('#ad-datetype-custom').on("click", this.wrap(function(e){
                this.showDateCustom();
            }));
            this.$("[data-toggle='tooltip']").tooltip();
            this.reloadData();
        },

        reloadData: function () {
            for(var i=this.chartList.length-1; i>=0; i--) {
                var chart = this.chartList[i];
                if (chart.groupList.length > 0) {
                    for (var j = 0; j < chart.groupList.length; j++) {
                        this.loadGroupData(chart, j);
                    }
                }else{
                    this.loadData(chart);
                }
            }
        },

        dateTypeChange: function (elementId) {
            this.$("[name='ad-datetype-btn']").removeClass("active");
            if(elementId!='ad-datetype-custom') {
                this.$("#" + elementId).addClass("active");
                this.selectedDateType = elementId.substring(12);
                this.reloadData();
            }else{
                this.$("#ad-datetype-custom").addClass("active");
                this.selectedDateType = "custom";
            }
        },

        showDateCustom: function () {
            this.dateTypeChange("ad-datetype-custom");
            portal.require([
                'oss_core/pm/adhoc/views/CustomDateDialog'
            ], this.wrap(function (Dialog) {
                var dialog = new Dialog({
                    btime: this.btime,
                    etime: this.etime
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 550,
                    height: 250
                };
                this.customDateDialog = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                    this.btime = data.btime;
                    this.etime = data.etime;
                    this.customDateDialog.close();
                    this.reloadData();
                }));
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.customDateDialog.close();
                }));
            }));
        },

        loadTopicDetailByTopicNo: function () {
            var self = this;
            action.loadTopicDetail({topicNo: this.topicNo}, this.wrap(function (ret) {
                var topic = ret.topicList[0];
                this.layout_type = topic.LAYOUT_TYPE;
                this.chartOrderList = ret.chartOrderList;
                this.numperrow = parseInt(topic.PRELINE_ECHARTS);
                // 模型和粒度
                this.modelCode = topic.MODEL_CODE;
                // 业务模型转物理模型
                for(var i=0;i<this.modelList.length;i++){
                    if(this.modelList[i].MODEL_CODE == this.modelCode){
                        this.modelPhyCode = this.modelList[i].MODEL_PHY_CODE;
                        break;
                    }
                }
                var dateGranArray_tmp1 = topic.DATE_GRAN.split(",");
                // 强制_H,_D,_W,_M排序
                var dateGranArray_tmp2 = new Array("","","","");
                fish.forEach(dateGranArray_tmp1, function(tmpItem){
                    if(tmpItem=="_H"){
                        dateGranArray_tmp2[0] = "_H";
                    }else if(tmpItem=="_D"){
                        dateGranArray_tmp2[1] = "_D";
                    }else if(tmpItem=="_W"){
                        dateGranArray_tmp2[2] = "_W";
                    }else if(tmpItem=="_M"){
                        dateGranArray_tmp2[3] = "_M";
                    }
                });
                dateGranArray = [];
                fish.forEach(dateGranArray_tmp2, function(granItem){
                    if(granItem!=""){
                        dateGranArray[dateGranArray.length] = granItem;
                    }
                });
                this.dateGranList = [];
                for(var i=0; i<dateGranArray.length; i++){
                    var dateGran = dateGranArray[i];// _H,_D,_W,_M
                    switch(dateGran){
                        case "_H": this.dateGranList[this.dateGranList.length] = this.granu_h;break;
                        case "_D": this.dateGranList[this.dateGranList.length] = this.granu_d;break;
                        case "_W": this.dateGranList[this.dateGranList.length] = this.granu_w;break;
                        case "_M": this.dateGranList[this.dateGranList.length] = this.granu_m;break;
                    }
                }
                this.selectedDateGranu = this.dateGranList[0].ID;
                if(this.initDateGranu!=''){
                    this.selectedDateGranu = this.initDateGranu;
                }
                this.refreshDateGranuSelect();
                this.dateGranChange('ad-dategranu'+this.selectedDateGranu);
                // 维度和指标
                var dims = [],indicators = [];
                this.adllDimAndIndiList = ret.dimAndIndiList;
                for(var i=0; i<this.adllDimAndIndiList.length; i++){
                    var obj = this.adllDimAndIndiList[i];
                    if(obj.COL_TYPE=='00' || obj.COL_TYPE=='02'){
                        dims[dims.length] = obj.COL_NO;
                        this.selectedDimIndiList[this.selectedDimIndiList.length] = {
                            COL_NO: obj.COL_NO,
                            COL_TYPE: obj.COL_TYPE,
                            COL_NAME: this.cachedDim.get(this.modelCode+"-"+obj.COL_NO),
                            COL_INDEX: "DIM_"+i,
                            GL_DIMKPI: obj.GL_DIMKPI,
                            META_DIM_CODE: this.cachedDimCode.get(obj.COL_NO)
                        }
                        // 虚拟维度
                        if(obj.COL_TYPE=='02'){
                            this.vdimList[this.vdimList.length] = {
                                "VDIM_CODE" : obj.COL_NO,
                                "VDIM_NAME" : "",
                                "VDIM_FIELD" : "",
                                "VDIM_TYPE" : "",
                                "NOGROUP_NAME" : "",
                                "groupList" : [],
                                "expression" : ""
                            }
                        }
                    }else if(obj.COL_TYPE=='01'){
                        indicators[indicators.length] = obj.COL_NO;
                        this.selectedDimIndiList[this.selectedDimIndiList.length] = {
                            COL_NO: obj.COL_NO,
                            COL_TYPE: obj.COL_TYPE,
                            COL_NAME: this.cachedIndi.get(this.modelCode+"-"+obj.COL_NO),
                            KPI_FORM: this.cachedIndiForm.get(obj.COL_NO)?this.cachedIndiForm.get(obj.COL_NO):'',
                            COL_INDEX: "KPI_"+i
                        }
                    }
                }
                // 先加载已选全局虚拟维度属性 而后再填充主题中配置了的维度属性
                /*
                 "VDIM_CODE": dimObj.COL_NO,
                 "VDIM_NAME": "",
                 "VDIM_FIELD": "",
                 "VDIM_TYPE": "",
                 "NOGROUP_NAME": "",
                 "groupList": []
                 */
                fish.forEach(this.vdimList, function(vdim){
                    var colNo = vdim.VDIM_CODE;
                    if(colNo.substring(0,4)!="vdim") {
                        var globalVdimObj = null;
                        fish.forEach(self.globalVdimList, function(globalVdimTmp){
                            if(globalVdimTmp.VDIM_CODE == colNo){
                                globalVdimObj = globalVdimTmp;
                                vdim["VDIM_NAME"] = globalVdimObj.VDIM_NAME;
                                vdim["VDIM_FIELD"] = globalVdimObj.VDIM_FIELD;
                                vdim["VDIM_TYPE"] = globalVdimObj.VDIM_TYPE;
                                vdim["NOGROUP_NAME"] = globalVdimObj.NOGROUP_NAME;
                                vdim["groupList"] = globalVdimObj.groupList;
                            }
                        });
                        for(var i=0;i<ret.dimAndIndiList.length;i++){
                            if(colNo==ret.dimAndIndiList[i].COL_NO){
                                colSeq = i;
                                for (var j = 0; j < self.selectedDimIndiList.length; j++) {
                                    var dimIndiObj = self.selectedDimIndiList[j];
                                    if (dimIndiObj.COL_TYPE == '02' && dimIndiObj.COL_NO == colNo && j == colSeq) {
                                        dimIndiObj.COL_NAME = vdim.VDIM_NAME;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
                this.dimAndIndiSortList = [];
                // 维度指标属性
                var dimIndiAttrList = ret.dimIndiAttrList;
                for(var i=0; i<dimIndiAttrList.length; i++) {
                    var attrObj = dimIndiAttrList[i];
                    var attrCode = attrObj.ATTR_CODE;
                    var attrValue = attrObj.ATTR_VALUE;
                    if (attrObj.COL_TYPE == '00' || attrObj.COL_TYPE=='02') {// 维度属性
                        var colNo = attrObj.COL_NO;
                        var colSeq = attrObj.COL_SEQ;
                        for (var j = 0; j < this.selectedDimIndiList.length; j++) {
                            var dimIndiObj = this.selectedDimIndiList[j];
                            if (dimIndiObj.COL_TYPE == attrObj.COL_TYPE && dimIndiObj.COL_NO == colNo && j == colSeq) {
                                if (attrCode == "VDIM_NAME" || attrCode == "VDIM_FIELD" ||
                                    attrCode == "VDIM_TYPE" ||
                                    attrCode == "NOGROUP_NAME") {
                                    for (var vdimIndex = 0; vdimIndex < this.vdimList.length; vdimIndex++) {
                                        var vdimObj = this.vdimList[vdimIndex];
                                        if (vdimObj.VDIM_CODE == colNo) {
                                            vdimObj[attrCode] = attrValue;
                                            if (attrCode == "VDIM_NAME") {
                                                dimIndiObj.COL_NAME = attrValue;
                                            }
                                            break;
                                        }
                                    }
                                } else if (attrCode == "calculateFormat") {// 公式
                                    //将占位符$替换成COL_NO
                                    attrValue = attrValue.replace(/\$/g, dimIndiObj.COL_NO);
                                    dimIndiObj["CALCULATE_FORMAT"] = attrValue;// 此处不能直接替换COL_NO 会造成后续的属性匹配不上 在循环后额外处理维度的公式
                                } else if (attrCode == "tagAlias") {// 别名
                                    dimIndiObj.COL_NAME = attrValue;
                                } else if(attrCode=="sortType"){
                                    self.dimAndIndiSortList[self.dimAndIndiSortList.length] = {
                                        COL_INDEX: "DIM_"+colSeq,
                                        SORT_TYPE: attrValue
                                    }
                                }
                                break;
                            }
                        }
                    }else if(attrObj.COL_TYPE=='01'){// 指标属性
                        var colNo = attrObj.COL_NO;
                        var colSeq = attrObj.COL_SEQ;
                        for (var j = 0; j < this.selectedDimIndiList.length; j++) {
                            var dimIndiObj = this.selectedDimIndiList[j];
                            if (dimIndiObj.COL_TYPE == attrObj.COL_TYPE && dimIndiObj.COL_NO == colNo && j == colSeq) {
                                if (attrCode == "calculateFormat") {// 公式
                                    //将占位符$替换成COL_NO
                                    attrValue = attrValue.replace(/\$/g, dimIndiObj.KPI_FORM);
                                    dimIndiObj.KPI_FORM = attrValue;
                                } else if (attrCode == "tagAlias") {// 别名
                                    dimIndiObj.COL_NAME = attrValue;
                                } else if(attrCode=="sortType"){
                                    self.dimAndIndiSortList[self.dimAndIndiSortList.length] = {
                                        COL_INDEX: "KPI_"+colSeq,
                                        SORT_TYPE: attrValue
                                    }
                                }else{
                                    dimIndiObj[attrCode] = attrValue;
                                }
                            }
                        }
                    }
                }
                // 处理维度的公式 替换COL_NO
                fish.forEach(this.selectedDimIndiList, function(dimObj){
                    if ((dimObj.COL_TYPE == '00' || dimObj.COL_TYPE=='02') &&
                            dimObj.hasOwnProperty("CALCULATE_FORMAT")) {
                        dimObj.COL_NO = dimObj.CALCULATE_FORMAT;
                    }
                });
                // 虚拟维度属性
                for(var i=0; i<ret.vdimGroupAttrList.length; i++) {
                    var vdimAttrObj = ret.vdimGroupAttrList[i];
                    for(var j=0;j<this.vdimList.length;j++){
                        var vdimObj = this.vdimList[j];
                        if(vdimObj.VDIM_CODE == vdimAttrObj.COL_NO && vdimObj.VDIM_CODE.substring(0,4)=='vdim'){
                            if(vdimAttrObj.ATTR_CODE=="GROUP_ID"){
                                vdimObj.groupList[vdimObj.groupList.length] = {
                                    id: vdimAttrObj.PARAM_VALUE,
                                    name: '',
                                    items: [],
                                    expression: ''
                                }
                            } else if(vdimAttrObj.ATTR_CODE=="GROUP_NAME"){
                                vdimObj.groupList[vdimObj.groupList.length-1].name = vdimAttrObj.PARAM_VALUE;
                            } else {
                                vdimObj.groupList[vdimObj.groupList.length-1].items[vdimObj.groupList[vdimObj.groupList.length-1].items.length] = {
                                    id: vdimAttrObj.PARAM_VALUE
                                }
                            }
                        }
                    }
                }
                // 筛选器
                this.topicFilterList = [];
                this.topicFilterPluginList = [];
                this.normalFilterList = [];
                this.highlevelFilterList = [];
                if(ret.topicEmptyFilterList.length>0){
                    ret.topicFilterList = ret.topicFilterList.concat(ret.topicEmptyFilterList);
                }
                for(var i=0; i<ret.topicFilterList.length; i++) {
                    var retObj = ret.topicFilterList[i];
                    var viewType = retObj.VIEW_TYPE;
                    var fieldNo = retObj.FIELD_NO
                    var fieldType = retObj.FIELD_TYPE;
                    switch(viewType){//1-普通条件 2-高级条件 -1为插件
                        case "1": this.normalFilterList[this.normalFilterList.length] = retObj;
                                break;
                        case "2": this.highlevelFilterList[this.highlevelFilterList.length] = retObj;
                                break;
                    }
                    if(fieldType=="2"){
                        for(var j=0;j<this.adllDimAndIndiList.length;j++){
                            if(fieldNo==this.adllDimAndIndiList[j].COL_NO){
                                fieldNo = "DIM_"+j;
                                break;
                            }
                        }
                    }
                    var paramValueStr = retObj.PARAM_VALUE;
                    if(fieldType=="0" || fieldType=="2"){
                        fieldNo = fieldNo+"||''";
                        if(paramValueStr) {
                            var paramValueArray = paramValueStr.split(",");
                            paramValueStr = "";
                            for (var j = 0; j < paramValueArray.length; j++) {
                                if (j != paramValueArray.length - 1) {
                                    paramValueStr += "'" + paramValueArray[j] + "',";
                                } else {
                                    paramValueStr += "'" + paramValueArray[j] + "'";
                                }
                            }
                        }
                    }else if(fieldType=="1"){
                        fieldNo = this.cachedIndiForm.get(fieldNo)?this.cachedIndiForm.get(fieldNo):'';
                    }
                    if(fieldType=="3"){
                        this.topicFilterPluginList[this.topicFilterPluginList.length] = {
                            PLUGIN_NO: retObj.FIELD_NO,
                            PLUGIN_PARAM: JSON.parse(retObj.PARAM_VALUE)
                        };
                    }else {
                        var operType = retObj.OPER_TYPE;
                        var filterStr = this.getFilterStr(fieldNo, operType, paramValueStr);
                        this.topicFilterList[this.topicFilterList.length] = {
                            fieldNo: retObj.FIELD_NO,
                            vdimFieldNo: fieldNo,
                            filterStr: filterStr,
                            defaultFilterStr: filterStr,
                            fieldType: fieldType
                        };
                    }
                }
                /* 填充筛选器
                this.setFilter(this.normalFilterList, "ad-normalfilter-container");
                if(this.highlevelFilterList.length>0) {
                    this.setFilter(this.highlevelFilterList, "ad-highlevelfilter-container");
                    this.$('#ad-highlevelfilter-btn').show();
                }*/
                if(this.normalFilterList.length>1){
                    var tmpList = [];
                    tmpList[tmpList.length] = this.normalFilterList[0];
                    this.setFilter(tmpList, "ad-normalfilter-container");
                    //
                    tmpList = [];
                    for(var filterListIndex=1;filterListIndex<this.normalFilterList.length;filterListIndex++){
                        tmpList[tmpList.length] = this.normalFilterList[filterListIndex];
                    }
                    this.setFilter(tmpList, "ad-highlevelfilter-container");
                    this.$('#ad-highlevelfilter-container').show();
                    this.$('#ad-chart-container-section').css('top', 80);
                }else if(this.normalFilterList.length==1){
                    this.setFilter(this.normalFilterList, "ad-normalfilter-container");
                }
                // 图表属性
                var chartAttrCodeList = ['chart_height','titleAlign','gridTop','isPager','isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom',
                    'isCompareAnalysis','isExtendedAnalysis','isMergeCell',
                    'AREAMAP_NO','isMapLabel','isMapAreaName','isMapLegend','mapColorCfg','labelSymbol',
                    'yMax','yMin','xAxis','yAxis','primaryAxis','secondaryAxis', 'secondaryMax',
                    'secondaryMin', 'sortCol','sortType','selectableColList','drillColList','displayColList',
                    'xAxisLabelRotate','xAxisLabelInterval','isXAxisLabelRotate','isXAxisLabelInterval','xAxisLabelHeight','isXAxisLabelHeight',
                    'axisCfgXaxis','axisCfgYaxisList','axisColorCfgYaxisList','axisCfgYaxisTypeList','axisCfgSeries','yAxisTitle','yAxis2Title',
                    'displayColList','condiFmtItemList','marklineList'
                ];
                var tmpChartList = [];
                fish.forEach(this.chartOrderList, this.wrap(function(chartOrderObj){
                    var chart_no = chartOrderObj.ECHART_NO;
                    fish.forEach(ret.topicChartList, this.wrap(function(chartObj){
                        if(chart_no == chartObj.ECHART_NO){
                            tmpChartList[tmpChartList.length] = chartObj;
                        }
                    }));
                }));
                //
                fish.forEach(ret.topicChartList, this.wrap(function(chartObj){
                    var isExistInOrderList = false;
                    fish.forEach(tmpChartList, this.wrap(function(tmpChartObj){
                        if(tmpChartObj.ECHART_NO == chartObj.ECHART_NO){
                            isExistInOrderList = true;
                        }
                    }));
                    if(!isExistInOrderList){
                        tmpChartList[tmpChartList.length] = chartObj;
                    }
                }));
                //
                for(var i=0; i<tmpChartList.length; i++) {
                    var chartCfgObj = tmpChartList[i];
                    this.addChart(i);
                    var chartObj = this.chartList[this.chartList.length - 1];
                    chartObj.chart_type = chartCfgObj.ECHART_TYPE;
                    chartObj.chartTitle = chartCfgObj.ECHART_NAME;
                    chartObj.chartSubTitle = chartCfgObj.TOPIC_SUB_NAME;
                    chartObj.chart_no = chartCfgObj.ECHART_NO;
                    chartObj.cachedKpiUnit = this.cachedKpiUnit;
                }
                // 图表属性
                for(var i=0; i<ret.topicChartAttrList.length; i++) {
                    var chartAttrObj = ret.topicChartAttrList[i];
                    var attrValue = chartAttrObj.ATTR_VALUE;
                    var ECHART_NO = chartAttrObj.ECHART_NO;
                    for(var j=0; j<this.chartList.length; j++){
                        var chart = this.chartList[j];
                        if(chart.chart_no == ECHART_NO){
                            if(chartAttrObj.ATTR_CODE != 'condiFmtItemList' && chartAttrObj.ATTR_CODE != 'marklineList'){
                                chart[chartAttrObj.ATTR_CODE] = attrValue;
                            }else{
                                chart[chartAttrObj.ATTR_CODE][chart[chartAttrObj.ATTR_CODE].length] = JSON.parse(attrValue);
                            }
                            if(chartAttrObj.ATTR_CODE == 'axisCfgYaxisList' || chartAttrObj.ATTR_CODE == 'axisColorCfgYaxisList'){
                                chart[chartAttrObj.ATTR_CODE] = attrValue.split(",");
                            }
                            if(chartAttrObj.ATTR_CODE == 'axisCfgYaxisList' || chartAttrObj.ATTR_CODE == 'drillColList'
                                || chartAttrObj.ATTR_CODE == 'displayColList' || chartAttrObj.ATTR_CODE == 'selectableColList'
                                || chartAttrObj.ATTR_CODE == 'axisColorCfgYaxisList'){
                                chart[chartAttrObj.ATTR_CODE] = (attrValue?attrValue.split(","):"");
                                // 因为drillColList为空时也会特殊保存到表中所以此处需要判断是否为null再split
                            }
                            if(chartAttrObj.ATTR_CODE == 'axisCfgYaxisTypeList'){
                                chart.axisCfgYaxisTypeList = attrValue.split(",");
                                for(var k=0;k<chart.axisCfgYaxisTypeList.length;k++){
                                    if(chart.axisCfgYaxisTypeList[k]==0){
                                        chart.mainAxisCfgShow = true;
                                    }else{
                                        chart.secondAxisCfgShow = true;
                                    }
                                }
                            }
                        }
                    }
                }
                // 饼系图表的组属性
                // [{GROUP_TITLE=1, DIM_NO=DIM_0, KPI_NO=KPI_1, GROUP_NO=1, ECHART_NO=0},
                // {GROUP_TITLE=2, DIM_NO=DIM_0, KPI_NO=KPI_1, GROUP_NO=2, ECHART_NO=0}]
                for(var i=0; i<ret.groupList.length; i++) {
                    var group = ret.groupList[i];
                    var ECHART_NO = group.ECHART_NO;
                    var GROUP_NO = group.GROUP_NO;
                    fish.forEach(this.chartList, function(chart){
                        if(chart.chart_no == ECHART_NO){
                            chart.groupList[chart.groupList.length] = group;
                        }
                    });
                }
                for(var i=this.chartList.length-1; i>=0; i--) {
                    var chart = this.chartList[i];
                    this.updateRightCfg(chart);
                    chart.refreshCss();
                    //this.refreshChart(chart);
                    if(chart.groupList.length>0 && chart.groupList[0].ECHART_NO==chart.chart_no){
                        // 切分饼图group容器
                        chart.$("#ad-chart-container-"+chart.chart_id).innerHTML = '';
                        var mdValue = 12 / chart.groupList.length;
                        for (var groupIndex = 0; groupIndex < chart.groupList.length; groupIndex++) {
                            chart.$("#ad-chart-container-"+chart.chart_id).append('<div style="height: ' + chart.$('#ad-chart-container-'+chart.chart_id).height() + 'px" class="col-md-' + mdValue + '">'
                            +'<div id="ad-chart-'+chart.chart_id+'-groupextendstep-'+groupIndex+'" class="text-left"></div>'
                            +'<div style="height: ' + (chart.$('#ad-chart-container-'+chart.chart_id).height()-25) + 'px" name="group_'+groupIndex+'" id="ad-chart-'+chart.chart_id+'-groupcontainer-'+groupIndex+'"></div>'
                            +'</div>');
                        }
                        for(var j=0;j<chart.groupList.length;j++){
                            this.loadGroupData(chart, j);
                        }
                    }else {
                        this.loadData(chart);
                    }
                }
            }));
        },

        loadTopicDetailByParams: function () {
            var self = this;
            // 模型和粒度
            this.modelCode = this.opt.modelCode;
            this.layout_type = this.opt.LAYOUT_TYPE;
            this.chartOrderList = this.opt.CHARTORDERLIST;
            this.numperrow = parseInt(this.opt.PRELINE_ECHARTS);
            // 业务模型转物理模型
            for(var i=0;i<this.modelList.length;i++){
                if(this.modelList[i].MODEL_CODE == this.modelCode){
                    this.modelPhyCode = this.modelList[i].MODEL_PHY_CODE;
                    break;
                }
            }
            var dateGranArray_tmp1 = this.opt.selectedDateGranu.split(",");
            // 强制_H,_D,_W,_M排序
            var dateGranArray_tmp2 = new Array("","","","");
            fish.forEach(dateGranArray_tmp1, function(tmpItem){
                if(tmpItem=="_H"){
                    dateGranArray_tmp2[0] = "_H";
                }else if(tmpItem=="_D"){
                    dateGranArray_tmp2[1] = "_D";
                }else if(tmpItem=="_W"){
                    dateGranArray_tmp2[2] = "_W";
                }else if(tmpItem=="_M"){
                    dateGranArray_tmp2[3] = "_M";
                }
            });
            dateGranArray = [];
            fish.forEach(dateGranArray_tmp2, function(granItem){
                if(granItem!=""){
                    dateGranArray[dateGranArray.length] = granItem;
                }
            });
            this.dateGranList = [];
            for(var i=0; i<dateGranArray.length; i++){
                var dateGran = dateGranArray[i];// _H,_D,_W,_M
                switch(dateGran){
                    case "_H": this.dateGranList[this.dateGranList.length] = this.granu_h;break;
                    case "_D": this.dateGranList[this.dateGranList.length] = this.granu_d;break;
                    case "_W": this.dateGranList[this.dateGranList.length] = this.granu_w;break;
                    case "_M": this.dateGranList[this.dateGranList.length] = this.granu_m;break;
                }
            }
            this.selectedDateGranu = this.dateGranList[0].ID;
            this.dateGranChange('ad-dategranu'+this.selectedDateGranu);
            this.refreshDateGranuSelect();
            // 维度和指标
            var dims = [],indicators = [];
            this.adllDimAndIndiList = [];
            fish.forEach(this.opt.selectedDimIndiList, function(obj){
                var colType = "0"+obj.dragNode.tagType;
                if(obj.dragNode.VDIM_FIELD){
                    colType = "02";
                }
                self.adllDimAndIndiList[self.adllDimAndIndiList.length] = {
                    COL_NO: obj.dragNode.id,
                    COL_NAME: obj.dragNode.name,
                    COL_TYPE: colType,
                    GL_DIMKPI: obj.GL_DIMKPI,
                    TOPIC_NO: ""
                }
            });
            var dimAttrCodeList = ['tagAlias','tagDesc','sortType','calculateFormat'];
            var indiAttrCodeList = ['tagAlias','tagDesc','agType','sortType','displayType','precision','isThousandDisplay','showUnit','calculateFormat'];
            this.dimAndIndiSortList = [];
            for(var i=0; i<this.adllDimAndIndiList.length; i++){
                var obj = this.adllDimAndIndiList[i];
                if(obj.COL_TYPE=='00' || obj.COL_TYPE=='02'){
                    dims[dims.length] = obj.COL_NO;
                    var dimNameInModel = this.cachedDim.get(this.modelCode+"-"+obj.COL_NO);
                    this.selectedDimIndiList[this.selectedDimIndiList.length] = {
                        COL_NO: obj.COL_NO,
                        COL_TYPE: obj.COL_TYPE,
                        COL_NAME: dimNameInModel?dimNameInModel:obj.COL_NAME,
                        COL_INDEX: "DIM_"+i,
                        GL_DIMKPI: obj.GL_DIMKPI,
                        META_DIM_CODE: this.cachedDimCode.get(obj.COL_NO)
                    }
                    // 维度属性
                    var self = this;
                    fish.forEach(dimAttrCodeList, function(attr_code){
                        var s_obj = self.opt.selectedDimIndiList[i];
                        var o_obj = self.selectedDimIndiList[self.selectedDimIndiList.length - 1];
                        if(s_obj.hasOwnProperty(attr_code)) {
                            if(attr_code=="calculateFormat" && s_obj.calculateFormat){
                                var colNo = o_obj.COL_NO;
                                o_obj.COL_NO = s_obj[attr_code].replace(/\$/g, colNo);
                            }
                            if(attr_code=="tagAlias" && s_obj[attr_code]!=""){
                                o_obj.COL_NAME = s_obj[attr_code];
                            }
                            if(attr_code=="sortType" && s_obj[attr_code]!=""){
                                self.dimAndIndiSortList[self.dimAndIndiSortList.length] = {
                                    COL_INDEX: o_obj.COL_INDEX,
                                    SORT_TYPE: s_obj[attr_code]
                                }
                            }
                            o_obj[attr_code] =
                                s_obj[attr_code];
                        }
                    });
                    // 虚拟维度
                    if(obj.COL_TYPE=='02'){
                        this.vdimList[this.vdimList.length] = {
                            "VDIM_CODE" : obj.COL_NO,
                            "VDIM_NAME" : "",
                            "VDIM_FIELD" : "",
                            "VDIM_TYPE" : "",
                            "NOGROUP_NAME" : "",
                            "groupList" : []
                        }
                    }
                }else if(obj.COL_TYPE=='01'){
                    indicators[indicators.length] = obj.COL_NO;
                    this.selectedDimIndiList[this.selectedDimIndiList.length] = {
                        COL_NO: obj.COL_NO,
                        COL_TYPE: obj.COL_TYPE,
                        COL_NAME: this.cachedIndi.get(this.modelCode+"-"+obj.COL_NO),
                        KPI_FORM: this.cachedIndiForm.get(obj.COL_NO)?this.cachedIndiForm.get(obj.COL_NO):'',
                        COL_INDEX: "KPI_"+i
                    }
                    // 指标属性
                    var self = this;
                    fish.forEach(indiAttrCodeList, function(attr_code){
                        var s_obj = self.opt.selectedDimIndiList[i].formatObj;
                        var o_obj = self.selectedDimIndiList[self.selectedDimIndiList.length - 1];
                        if(s_obj.hasOwnProperty(attr_code)) {
                            if(attr_code=="calculateFormat" && s_obj.calculateFormat){
                                var colNo = o_obj.COL_NO;
                                //o_obj.KPI_FORM = s_obj[attr_code].replace(/\$/g, colNo);
                                var o_kpi_form = o_obj.KPI_FORM;
                                o_obj.KPI_FORM = s_obj[attr_code].replace(/\$/g, "("+o_kpi_form+")");
                            }
                            if(attr_code=="tagAlias" && s_obj[attr_code]!=""){
                                o_obj.COL_NAME = s_obj[attr_code];
                            }
                            if(attr_code=="sortType" && s_obj[attr_code]!=""){
                                self.dimAndIndiSortList[self.dimAndIndiSortList.length] = {
                                    COL_INDEX: o_obj.COL_INDEX,
                                    SORT_TYPE: s_obj[attr_code]
                                }
                            }
                            o_obj[attr_code] =
                                s_obj[attr_code];
                        }
                    });
                }
            }
            this.vdimList = this.opt.vdimList;
            // 筛选器
            this.topicFilterPluginList = this.opt.topicFilterPluginList;
            this.topicFilterList = [];
            this.normalFilterList = [];
            this.highlevelFilterList = [];
            for(var i=0; i<this.opt.topicFilterList.length; i++) {
                var retObj = this.opt.topicFilterList[i];
                // 插件过滤器保存在topicFilterPluginList容器中
                if(retObj.FILTER_TYPE=="3"){
                    continue;
                }
                var viewType = retObj.VIEW_TYPE;
                var fieldNo = retObj.DIM_CODE
                var fieldType = retObj.dragNode.tagType;
                if(retObj.dragNode.VDIM_FIELD){
                    fieldType = "2";
                }
                if(viewType=="1"){
                    this.normalFilterList[this.normalFilterList.length] = retObj;
                }else if(viewType=="2"){
                    this.highlevelFilterList[this.highlevelFilterList.length] = retObj;
                }
                if(fieldType=="2"){
                    for(var j=0;j<this.selectedDimIndiList.length;j++){
                        if(fieldNo==this.selectedDimIndiList[j].COL_NO){
                            fieldNo = "DIM_"+j;
                            break;
                        }
                    }
                }
                var paramValueStr = "";
                if(fieldType=="0"){
                    paramValueStr = retObj.filterOperList[0]?retObj.filterOperList[0].value:"";
                    fieldNo = fieldNo+"||''";
                    if(paramValueStr) {
                        var paramValueArray = paramValueStr.split(",");
                        paramValueStr = "";
                        for (var j = 0; j < paramValueArray.length; j++) {
                            if (j != paramValueArray.length - 1) {
                                paramValueStr += "'" + paramValueArray[j] + "',";
                            } else {
                                paramValueStr += "'" + paramValueArray[j] + "'";
                            }
                        }
                    }
                }else if(fieldType=="2"){
                    fieldNo = fieldNo+"||''";
                    for (var j = 0; j < retObj.selectedList.length; j++) {
                        if (j != retObj.selectedList.length - 1) {
                            paramValueStr += "'" + retObj.selectedList[j].name + "',";
                        } else {
                            paramValueStr += "'" + retObj.selectedList[j].name + "'";
                        }
                    }
                }else{
                    paramValueStr = retObj.filterOperList[0]?retObj.filterOperList[0].value:"";
                    fieldNo = this.cachedIndiForm.get(fieldNo)?this.cachedIndiForm.get(fieldNo):'';
                }
                if(retObj.filterOperList.length>0){
                    var operType = retObj.filterOperList[0].type;
                    var filterStr = this.getFilterStr(fieldNo, operType, paramValueStr);
                    this.topicFilterList[this.topicFilterList.length] = {
                        fieldNo: retObj.DIM_CODE,
                        vdimFieldNo: fieldNo,
                        filterStr: filterStr,
                        defaultFilterStr: filterStr,
                        fieldType: fieldType
                    };
                }else {
                    this.topicFilterList[this.topicFilterList.length] = {
                        fieldNo: retObj.DIM_CODE,
                        vdimFieldNo: fieldNo,
                        filterStr: undefined,
                        defaultFilterStr: undefined,
                        fieldType: fieldType
                    };
                }
            }
            /* 填充筛选器
             this.setFilter(this.normalFilterList, "ad-normalfilter-container");
             if(this.highlevelFilterList.length>0) {
             this.setFilter(this.highlevelFilterList, "ad-highlevelfilter-container");
             this.$('#ad-highlevelfilter-btn').show();
             }*/
            if(this.normalFilterList.length>1){
                var tmpList = [];
                tmpList[tmpList.length] = this.normalFilterList[0];
                this.setFilter(tmpList, "ad-normalfilter-container");
                //
                tmpList = [];
                for(var filterListIndex=1;filterListIndex<this.normalFilterList.length;filterListIndex++){
                    tmpList[tmpList.length] = this.normalFilterList[filterListIndex];
                }
                this.setFilter(tmpList, "ad-highlevelfilter-container");
                this.$('#ad-highlevelfilter-container').show();
                this.$('#ad-chart-container-section').css('top', 80);
            }else if(this.normalFilterList.length==1){
                this.setFilter(this.normalFilterList, "ad-normalfilter-container");
            }
            // 图表属性
            var chartAttrCodeList = ['chart_height','titleAlign','gridTop','isPager','isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom',
                'isCompareAnalysis','isExtendedAnalysis','isMergeCell',
                'AREAMAP_NO','isMapLabel','isMapAreaName','isMapLegend','mapColorCfg','labelSymbol',
                'yMax','yMin','xAxis','yAxis','primaryAxis','secondaryAxis', 'secondaryMax',
                'secondaryMin', 'sortCol','sortType','selectableColList','drillColList','displayColList',
                'xAxisLabelRotate','xAxisLabelInterval','isXAxisLabelRotate','isXAxisLabelInterval','xAxisLabelHeight','isXAxisLabelHeight',
                'axisCfgXaxis','axisCfgYaxisList','axisColorCfgYaxisList','axisCfgYaxisTypeList','axisCfgSeries','yAxisTitle','yAxis2Title',
                'displayColList','condiFmtItemList','marklineList'
            ];
            fish.forEach(this.opt.chartList, function(chartItem){
                if(chartItem.chart_no===""){
                    chartItem.chart_no = adhocUtil.guid();
                }
            });
            var tmpChartList = [];
            fish.forEach(this.chartOrderList, this.wrap(function(chartOrderObj){
                var chart_no = chartOrderObj.ECHART_NO;
                fish.forEach(this.opt.chartList, this.wrap(function(chartObj){
                    if(chart_no == chartObj.chart_no){
                        tmpChartList[tmpChartList.length] = chartObj;
                    }
                }));
            }));
            //
            fish.forEach(this.opt.chartList, this.wrap(function(chartObj){
                var isExistInOrderList = false;
                fish.forEach(tmpChartList, this.wrap(function(tmpChartObj){
                    if(tmpChartObj.chart_no == chartObj.chart_no && (chartObj.chart_no+"")!=""){
                        isExistInOrderList = true;
                    }
                }));
                if(!isExistInOrderList){
                    tmpChartList[tmpChartList.length] = chartObj;
                }
            }));
            //
            for(var i=0; i<tmpChartList.length; i++) {
                var chartCfgObj = tmpChartList[i];
                this.addChart(i);
                var chart = this.chartList[this.chartList.length - 1];
                chart.chart_type = chartCfgObj.chart_type;
                chart.chartTitle = chartCfgObj.chartTitle;
                chart.chartSubTitle = chartCfgObj.chartSubTitle;
                chart.chart_no = chartCfgObj.chart_no;
                chart.cachedKpiUnit = this.cachedKpiUnit;
                chart.pivotUIOptions = chartCfgObj.pivotUIOptions;
                fish.forEach(chartAttrCodeList, function(attr_code){
                    var attrValue = chartCfgObj[attr_code];
                    chart[attr_code] = attrValue;
                    if(attr_code == 'axisCfgYaxisList' || attr_code == 'axisColorCfgYaxisList'){
                        chart[attr_code] = attrValue;//.split(",");
                    }
                    if(attr_code == 'axisCfgYaxisList' || attr_code == 'drillColList'
                        || attr_code == 'displayColList' || attr_code == 'selectableColList'
                        || attr_code == 'axisColorCfgYaxisList'){
                        if(typeof(attrValue) == 'string' && attrValue!=""){
                            chart[attr_code] = attrValue.split(",");
                        }
                        if(typeof(attrValue) != 'string' && attrValue){
                            chart[attr_code] = attrValue;
                        }
                        // 因为drillColList为空时也会特殊保存到表中所以此处需要判断是否为null再split
                    }
                    if(attr_code == 'axisCfgYaxisTypeList'){
                        chart.axisCfgYaxisTypeList = attrValue;//.split(",");
                        for(var k=0;k<chart.axisCfgYaxisTypeList.length;k++){
                            if(chart.axisCfgYaxisTypeList[k]==0){
                                chart.mainAxisCfgShow = true;
                            }else{
                                chart.secondAxisCfgShow = true;
                            }
                        }
                    }
                });
                chart.groupList = chartCfgObj.groupList;
            }
            for(var i=this.chartList.length-1; i>=0; i--) {
                var chart = this.chartList[i];
                this.updateRightCfg(chart);
                chart.refreshCss();
                //this.refreshChart(chart);
                if(chart.groupList.length>0){
                    // 切分饼图group容器
                    chart.$("#ad-chart-container-"+chart.chart_id).innerHTML = '';
                    var mdValue = 12 / chart.groupList.length;
                    for (var groupIndex = 0; groupIndex < chart.groupList.length; groupIndex++) {
                        chart.$("#ad-chart-container-"+chart.chart_id).append('<div style="height: ' + chart.$('#ad-chart-container-'+chart.chart_id).height() + 'px" class="col-md-' + mdValue + '">'
                        +'<div id="ad-chart-'+chart.chart_id+'-groupextendstep-'+groupIndex+'" class="text-left"></div>'
                        +'<div style="height: ' + (chart.$('#ad-chart-container-'+chart.chart_id).height()-25) + 'px" name="group_'+groupIndex+'" id="ad-chart-'+chart.chart_id+'-groupcontainer-'+groupIndex+'"></div>'
                        +'</div>');
                    }
                    for(var j=0;j<chart.groupList.length;j++){
                        this.loadGroupData(chart, j);
                    }
                }else {
                    this.loadData(chart);
                }
            }
        },

        setFilter: function (filterList, containerId) {
            var self = this;
            fish.forEach(filterList, this.wrap(function(filterObj){
                var colType;
                var colNo;
                var filterLabel;
                var itemList = [];
                var fieldNo = filterObj.hasOwnProperty("FIELD_NO")?filterObj.FIELD_NO:filterObj.DIM_CODE;
                for(var i=0; i<this.selectedDimIndiList.length; i++) {
                    var dimIndiObj = this.selectedDimIndiList[i];
                    if(dimIndiObj.COL_INDEX == fieldNo || dimIndiObj.COL_NO == fieldNo){
                        colType = dimIndiObj.COL_TYPE;
                        colNo = dimIndiObj.COL_NO;
                        break;
                    }
                }
                if(colType=="02"){
                    for(var i=0;i<this.vdimList.length;i++){
                        var vdimObj = this.vdimList[i];
                        if(vdimObj.VDIM_CODE == colNo){
                            filterLabel = vdimObj.VDIM_NAME;
                            break;
                        }
                    }
                    if(filterObj.PARAM_VALUE){
                        var paramValueList = filterObj.PARAM_VALUE.split(",");
                        fish.forEach(paramValueList, this.wrap(function(paramObj){
                            itemList[itemList.length] = {
                                id: paramObj,
                                name: paramObj
                            }
                        }));
                    }else{
                        itemList = [];
                        fish.forEach(filterObj.selectedList, function(vdimItem){
                            itemList[itemList.length] = {
                                id: vdimItem.name,
                                name: vdimItem.name
                            }
                        });
                    }
                    var field_filter_type = filterObj.FIELD_FILTER_TYPE?filterObj.FIELD_FILTER_TYPE:filterObj.FILTER_TYPE;
                    if(field_filter_type=="2"){
                        //全部虚拟维度作为过滤器并且是all condition类型
                        fish.forEach(self.vdimList, function(globalVdim){
                            if(globalVdim.VDIM_CODE==fieldNo) {
                                fish.forEach(globalVdim.groupList, function(globalVdimGroup){
                                    itemList[itemList.length] = {
                                        id: globalVdimGroup.name,
                                        name: globalVdimGroup.name
                                    }
                                });
                                itemList[itemList.length] = {
                                    id: globalVdim.NOGROUP_NAME,
                                    name: globalVdim.NOGROUP_NAME
                                }
                            }
                        });
                    }
                    var view = new filterItem({
                        filterLabel: filterLabel,
                        itemList: itemList,
                        fieldNo: fieldNo,
                        meta_dim_code: meta_dim_code
                    });
                    //this.filterItemList[this.filterItemList.length] = view;
                    view.render();
                    this.$('#'+containerId).append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                    if(containerId=="ad-normalfilter-container"){
                        this.$('#'+containerId).width(filterList.length*230 + (filterList.length-1)*20);
                    }else{
                        this.$('#'+containerId).width(filterList.length*270);
                    }
                    view.afterRender();
                    this.listenTo(view, 'changeFilter', this.wrap(function (data) {
                        for(var i=0;i<this.topicFilterList.length;i++){
                            var topicFilterObj = this.topicFilterList[i];
                            if(data.fieldNo == topicFilterObj.fieldNo){
                                if(data.filterValue==''){
                                    topicFilterObj.filterStr = topicFilterObj.defaultFilterStr;
                                }else{
                                    if(topicFilterObj.fieldType=="2"){
                                        data.fieldNo = topicFilterObj.vdimFieldNo;
                                    }
                                    var tmpFilterArray = data.filterValue.split(",");
                                    tmpFilterArray = fish.map(tmpFilterArray, function(num){ return "'"+num+"'"; });
                                    var tmpFilterStr = tmpFilterArray.join(",");
                                    if(topicFilterObj.defaultFilterStr && topicFilterObj.defaultFilterStr!=""){
                                        topicFilterObj.filterStr = topicFilterObj.defaultFilterStr + " AND " + data.fieldNo + "||'' in (" + tmpFilterStr + ")";
                                    }else {
                                        topicFilterObj.filterStr = data.fieldNo + "||'' in (" + tmpFilterStr + ")";
                                    }
                                }
                            }
                        }
                    }));
                    this.listenTo(view, 'delCondifmt', this.wrap(function (data) {
                        //this.delCondifmt(data.item_id);
                    }));
                }else {
                    filterLabel = this.cachedDim.get(this.modelCode+"-"+fieldNo);
                    var meta_dim_code = this.cachedDimCode.get(fieldNo);
                    if(meta_dim_code) {
                        action.metaDimQuery({
                            DIM_CODE: meta_dim_code
                        }, this.wrap(function (ret) {
                            var dimScript = "";
                            if (ret.scriptList && ret.scriptList.length > 0) {
                                dimScript = ret.scriptList[0].DIM_SCRIPT;
                            }
                            action.scriptResultQuery({
                                SCRIPT: dimScript
                            }, this.wrap(function (ret) {
                                var cachedDimData = new adhocUtil.HashMap();
                                fish.forEach(ret.resultList, this.wrap(function (item) {
                                    cachedDimData.put(item.ID, item.NAME);
                                }));
                                // 通过数据库数据生成时取PARAM_VALUE；前台直接预览时取selectedList
                                if (filterObj.hasOwnProperty("PARAM_VALUE")) {
                                    var paramValueList = filterObj.PARAM_VALUE.split(",");
                                    fish.forEach(paramValueList, this.wrap(function (paramId) {
                                        itemList[itemList.length] = {
                                            id: paramId,
                                            name: cachedDimData.get(paramId)
                                        }
                                    }));
                                } else {
                                    itemList = filterObj.selectedList;
                                }
                                var view = new filterItem({
                                    filterLabel: filterLabel,
                                    itemList: itemList,
                                    fieldNo: fieldNo,
                                    meta_dim_code: meta_dim_code
                                });
                                //this.filterItemList[this.filterItemList.length] = view;
                                view.render();
                                this.$('#' + containerId).append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                                if (containerId == "ad-normalfilter-container") {
                                    this.$('#' + containerId).width(filterList.length * 230 + (filterList.length - 1) * 20);
                                } else {
                                    this.$('#' + containerId).width(filterList.length * 270);
                                }
                                view.afterRender();
                                this.listenTo(view, 'changeFilter', this.wrap(function (data) {
                                    for (var i = 0; i < this.topicFilterList.length; i++) {
                                        var topicFilterObj = this.topicFilterList[i];
                                        if (data.fieldNo == topicFilterObj.fieldNo) {
                                            if (data.filterValue == '') {
                                                topicFilterObj.filterStr = topicFilterObj.defaultFilterStr;
                                            } else {
                                                var tmpFilterArray = data.filterValue.split(",");
                                                tmpFilterArray = fish.map(tmpFilterArray, function (num) {
                                                    return "'" + num + "'";
                                                });
                                                var tmpFilterStr = tmpFilterArray.join(",");
                                                if (topicFilterObj.defaultFilterStr && topicFilterObj.defaultFilterStr != "") {
                                                    topicFilterObj.filterStr = topicFilterObj.defaultFilterStr + " AND " + data.fieldNo + "||'' in (" + tmpFilterStr + ")";
                                                } else {
                                                    topicFilterObj.filterStr = data.fieldNo + "||'' in (" + tmpFilterStr + ")";
                                                }
                                            }
                                        }
                                    }
                                }));
                                this.listenTo(view, 'delCondifmt', this.wrap(function (data) {
                                    //this.delCondifmt(data.item_id);
                                }));
                            }));
                        }));
                    }else{//维度code为空的维度 强制为文本框
                        var view = new filterItem({
                            filterLabel: filterLabel,
                            itemList: [],
                            fieldNo: fieldNo,
                            meta_dim_code: meta_dim_code
                        });
                        view.render();
                        this.$('#' + containerId).append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                        if (containerId == "ad-normalfilter-container") {
                            this.$('#' + containerId).width(filterList.length * 230 + (filterList.length - 1) * 20);
                        } else {
                            this.$('#' + containerId).width(filterList.length * 270);
                        }
                        view.afterRender();
                        this.listenTo(view, 'inputFilter', this.wrap(function (data) {
                            for (var i = 0; i < this.topicFilterList.length; i++) {
                                var topicFilterObj = this.topicFilterList[i];
                                if (data.fieldNo == topicFilterObj.fieldNo) {
                                    if (data.filterValue == '') {
                                        topicFilterObj.filterStr = topicFilterObj.defaultFilterStr;
                                    } else {
                                        var tmpFilterStr = data.filterValue.split(",");
                                        if (topicFilterObj.defaultFilterStr && topicFilterObj.defaultFilterStr != "") {
                                            topicFilterObj.filterStr = topicFilterObj.defaultFilterStr + " AND " + data.fieldNo + " like '%" + tmpFilterStr + "%'";
                                        } else {
                                            topicFilterObj.filterStr = data.fieldNo + " like '%" + tmpFilterStr + "%'";
                                        }
                                    }
                                }
                            }
                        }));
                    }
                }
            }))
        },

        loadData: function (chart) {
            var dateGranuBtnList = this.$("[name='ad-dategranu-btn']");
            for(var i=0;i<dateGranuBtnList.length;i++){
                if(dateGranuBtnList[i].className.indexOf("active")!=-1){
                    dateGranu = dateGranuBtnList[i].id;
                    break;
                }
            }
            if(!dateGranu){
                return;
            }
            dateGranu = dateGranu.substring(12);
            var dateGranuTypeList = this.$("[name='ad-datetype-btn']");
            var dateGranuType;
            for(var i=0; i<dateGranuTypeList.length; i++){
                if(dateGranuTypeList[i].className.indexOf('active')!=-1){
                    dateGranuType = dateGranuTypeList[i].id;
                    break;
                }
            }
            if(dateGranuType=='ad-datetype-custom'){// 自定义时间
                dateGranuType = 'custom';
            }else {
                dateGranuType = dateGranuType.substring(12);
            }
            // 查询中涉及的维度指标，过滤出未涉及的虚拟维度
            var dimIndiList = [];
            for(var i=0;i<this.selectedDimIndiList.length;i++){
                var dimIndiObj = this.selectedDimIndiList[i];
                if(chart.chart_type=="grid" && chart.displayColList.length>0 && chart.displayColList[0]!="") {
                    var isDisplay = false;
                    fish.forEach(chart.displayColList, function (displayCol) {
                        if (displayCol == dimIndiObj.COL_INDEX) {
                            isDisplay = true;
                        }
                    });
                    if(!isDisplay && dimIndiObj.GL_DIMKPI=="1"){
                        continue;
                    }
                }
                if(dimIndiObj.GL_DIMKPI=="0"){
                    var isVdimFilter = false;
                    for(var j=0;j<this.topicFilterList.length && !isVdimFilter;j++){
                        if(dimIndiObj.COL_NO==this.topicFilterList[j].fieldNo){
                            isVdimFilter = true;
                        }
                    }
                    if(isVdimFilter){
                        dimIndiList[dimIndiList.length] = dimIndiObj;
                    }
                }else{
                    dimIndiList[dimIndiList.length] = dimIndiObj;
                }
            }
            // 收集二次过滤条件
            var chartFilterStr = "";
            var chartFilterTypeStr = chart.filterCondiType;// AND OR
            var chartFilterList = [];
            for(var i=0;i<chart.filterCondiList.length;i++) {
                var filterObj = chart.filterCondiList[i];
                var fieldId = filterObj.fieldId;
                var isHide = false;
                for(var j=0;j<chart.hideColList.length && !isHide;j++){
                    if(fieldId == chart.hideColList[j]){
                        isHide = true;
                    }
                }
                if(!isHide){
                    chartFilterList[chartFilterList.length] = filterObj;
                }
            }
            for(var i=0;i<chartFilterList.length;i++){
                var chartFilter = chartFilterList[i];
                /*var fieldNo;
                var fieldType;
                for(var j=0;j<this.selectedDimIndiList.length;j++){
                    var dimIndiObj = this.selectedDimIndiList[j];
                    if(chartFilter.fieldId == dimIndiObj.COL_INDEX){
                        fieldType = dimIndiObj.COL_TYPE;
                        fieldNo = (fieldType=="01"?dimIndiObj.KPI_FORM:dimIndiObj.COL_NO);
                    }
                }*/
                var subFilterStr = this.getFilterStr(chartFilter.fieldId, chartFilter.type, chartFilter.value);
                if(i!=chartFilterList.length-1){
                    chartFilterStr += subFilterStr + " " + chartFilterTypeStr + " ";
                }else{
                    chartFilterStr += subFilterStr;
                }
            }
            if(this.initLoadDataParam!=null && this.initLoadDataParam.ACTION_TYPE){
                this.loadDataParam = this.initLoadDataParam;
            }else {
                this.loadDataParam = {
                    ACTION_TYPE: "loadData",
                    topic_no: this.topicNo,
                    chart_type: chart.chart_type,
                    modelCode: this.modelPhyCode,
                    modelBusiCode: this.modelCode,
                    dateGranu: dateGranu,
                    dateGranuType: this.initDateGranuType==''?dateGranuType:this.initDateGranuType,
                    etime: this.etime,
                    btime: this.btime,
                    selectedDimIndiList: dimIndiList,
                    dimAndIndiSortList: this.dimAndIndiSortList,
                    allDimIndiList: this.selectedDimIndiList,
                    hideColList: chart.hideColList,
                    vdimList: this.vdimList,
                    sortList: chart.sortList,
                    axisCfgSeries: chart.axisCfgSeries,
                    axisCfgXaxis: chart.axisCfgXaxis,
                    topicFilterList: this.topicFilterList,
                    topicFilterPluginList :this.topicFilterPluginList,
                    chartFilterStr: chartFilterStr,
                    topn: chart.gridTop,
                    sortCol: chart.sortCol,
                    sortType: chart.sortType,
                    extendDimList: chart.extendDimList,
                    extendDimFilterList: chart.extendDimFilterList,
                    rowNumOfPager: chart.rowNumOfPager,
                    startOfPager: chart.startOfPager
                };
            }
            chart.loadDataParam = this.loadDataParam;
            action.loadData(this.loadDataParam, this.wrap(function (data) {
                chart.btime = data.btime;
                chart.etime = data.etime;
                chart.dateGranu = dateGranu;
                chart.dateGranuType = dateGranuType;
                chart.updateSimuDp(data.dataList);
                chart.recordCount = data.recordCount;
                this.refreshChart(chart);
                //
                var compareAnalysisBtime = adhocUtil.getCompareAnalysisBtime(chart.btime, chart.dateGranu, chart.dateGranuType);
                chart.$("#ad-compareanalysis-timesel").datetimepicker("value", compareAnalysisBtime);
                console.log("loadDataException:"+data.exceptionFlag);
            }));
        },

        loadCompareAnalysis: function (chart) {
            var btime = chart.btime;
            var etime = chart.etime;
            var dateGranu = chart.dateGranu;
            var dateGranuType = chart.dateGranuType;
            if(chart.isCompareAnalysis){
                var compareAnalysisBtime = adhocUtil.getCompareAnalysisBtime(btime, dateGranu, dateGranuType);
                if(chart.compareAnalysisBtime!=""){
                    compareAnalysisBtime = chart.compareAnalysisBtime;
                }
                if(dateGranuType == "custom"){
                    var compareAnalysisEtime = adhocUtil.getCompareAnalysisBtime(etime, dateGranu, dateGranuType);
                }else{
                    var compareAnalysisEtime = adhocUtil.getCompareAnalysisEtime(compareAnalysisBtime, dateGranu, dateGranuType);
                }
                if(chart.$('#ad-compareanalysis-chk').is(':checked')) {
                    this.loadDataParam.btime = compareAnalysisBtime;
                    this.loadDataParam.etime = compareAnalysisEtime;
                    chart.compareAnalysisBtime = "";
                    console.log("loadCompareAnalysis btime:"+compareAnalysisBtime+"   etime:"+compareAnalysisEtime);
                    this.loadDataParam.dateGranuType = "custom";
                    action.loadData(this.loadDataParam, this.wrap(function (data) {
                        chart.updateCompareAnalysis(data.dataList, true);
                    }));
                }
            }
        },

        cancelCompareAnalysis: function (chart) {
            chart.updateCompareAnalysis([], false);
        },

        loadGroupData: function (chart, groupIndex) {
            var dateGranuBtnList = this.$("[name='ad-dategranu-btn']");
            for(var i=0;i<dateGranuBtnList.length;i++){
                if(dateGranuBtnList[i].className.indexOf("active")!=-1){
                    dateGranu = dateGranuBtnList[i].id;
                    break;
                }
            }
            if(!dateGranu){
                return;
            }
            dateGranu = dateGranu.substring(12);
            var dateGranuTypeList = this.$("[name='ad-datetype-btn']");
            var dateGranuType;
            for(var i=0; i<dateGranuTypeList.length; i++){
                if(dateGranuTypeList[i].className.indexOf('active')!=-1){
                    dateGranuType = dateGranuTypeList[i].id;
                    break;
                }
            }
            if(dateGranuType=='ad-datetype-custom'){// 自定义时间
                dateGranuType = 'custom';
            }else {
                dateGranuType = dateGranuType.substring(12);
            }
            // 查询中涉及的维度指标，过滤出未涉及的虚拟维度
            var dimIndiList = [];
            for(var i=0;i<this.selectedDimIndiList.length;i++){
                var dimIndiObj = this.selectedDimIndiList[i];
                if(dimIndiObj.GL_DIMKPI=="0" && chart.chart_type!="kpicard"){
                    var isVdimFilter = false;
                    for(var j=0;j<this.topicFilterList.length && !isVdimFilter;j++){
                        if(dimIndiObj.COL_NO==this.topicFilterList[j].fieldNo){
                            isVdimFilter = true;
                        }
                    }
                    if(isVdimFilter){
                        dimIndiList[dimIndiList.length] = dimIndiObj;
                    }
                }else if(dimIndiObj.COL_TYPE=="01" || (dimIndiObj.COL_TYPE!="01" && chart.chart_type!="kpicard")){
                    dimIndiList[dimIndiList.length] = dimIndiObj;
                }
            }
            // 收集二次过滤条件
            var chartFilterStr = "";
            var chartFilterTypeStr = chart.filterCondiType;// AND OR
            var chartFilterList = [];
            for(var i=0;i<chart.filterCondiList.length;i++) {
                var filterObj = chart.filterCondiList[i];
                var fieldId = filterObj.fieldId;
                var isHide = false;
                for(var j=0;j<chart.hideColList.length && !isHide;j++){
                    if(fieldId == chart.hideColList[j]){
                        isHide = true;
                    }
                }
                if(!isHide){
                    chartFilterList[chartFilterList.length] = filterObj;
                }
            }
            for(var i=0;i<chartFilterList.length;i++){
                var chartFilter = chartFilterList[i];
                /*var fieldNo;
                 var fieldType;
                 for(var j=0;j<this.selectedDimIndiList.length;j++){
                 var dimIndiObj = this.selectedDimIndiList[j];
                 if(chartFilter.fieldId == dimIndiObj.COL_INDEX){
                 fieldType = dimIndiObj.COL_TYPE;
                 fieldNo = (fieldType=="01"?dimIndiObj.KPI_FORM:dimIndiObj.COL_NO);
                 }
                 }*/
                var subFilterStr = this.getFilterStr(chartFilter.fieldId, chartFilter.type, chartFilter.value);
                if(i!=chartFilterList.length-1){
                    chartFilterStr += subFilterStr + " " + chartFilterTypeStr + " ";
                }else{
                    chartFilterStr += subFilterStr;
                }
            }
            chart.loadDataParam = {
                ACTION_TYPE: "loadData",
                topic_no: this.topicNo,
                chart_type: chart.chart_type,
                modelCode: this.modelPhyCode,
                modelBusiCode: this.modelCode,
                dateGranu: dateGranu,
                dateGranuType: this.initDateGranuType==''?dateGranuType:this.initDateGranuType,
                etime: this.etime,
                btime: this.btime,
                selectedDimIndiList: dimIndiList,
                dimAndIndiSortList: this.dimAndIndiSortList,
                allDimIndiList: this.selectedDimIndiList,
                hideColList: chart.hideColList,
                vdimList: this.vdimList,
                sortList: chart.sortList,
                axisCfgSeries: chart.axisCfgSeries,
                axisCfgXaxis: chart.groupList[groupIndex].DIM_NO,
                topicFilterList: this.topicFilterList,
                topicFilterPluginList :this.topicFilterPluginList,
                chartFilterStr: chartFilterStr,
                topn: chart.gridTop,
                sortCol: chart.sortCol,
                sortType: chart.sortType,
                extendDimList: chart.groupExtendDimList[groupIndex],
                extendDimFilterList: chart.groupExtendDimFilterList[groupIndex],
                rowNumOfPager: chart.rowNumOfPager,
                startOfPager: chart.startOfPager
            };
            action.loadData(chart.loadDataParam, this.wrap(function (data) {
                this.refreshChartGroup(chart, data.dataList, groupIndex);
            }));
        },

        // 针对饼系图表的刷新
        refreshChartGroup: function (chart, dataList, groupIndex) {
            var param = this.getChartCfgParam(chart);
            var group = chart.groupList[groupIndex];
            if(chart.chart_type=="pie") {
                chart.$('#ad-grid-container-'+chart.chart_id).hide();
                chart.$('#ad-gridcfg-container-'+chart.chart_id).hide();
                chart.$('#ad-chart-container-'+chart.chart_id).show();
                var pieChart = echarts.init(chart.$("#ad-chart-"+chart.chart_id+"-groupcontainer-"+groupIndex)[0]);
                chart.$("#ad-chart-"+chart.chart_id+"-groupcontainer-"+groupIndex)[0].name = "group_"+groupIndex;
                chart.groupChartList[groupIndex] = pieChart;
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                chart.updateGroupSimuDp(dataList, groupIndex);
                pieChart.setOption(chart.getPieChartOption(param,groupIndex),true);
                chart.bindExtendAnalysis(pieChart);
            }else if(chart.chart_type=="radar") {
                chart.$('#ad-grid-container-'+chart.chart_id).hide();
                chart.$('#ad-gridcfg-container-'+chart.chart_id).hide();
                chart.$('#ad-chart-container-'+chart.chart_id).show();
                var radarChart = echarts.init(chart.$("#ad-chart-"+chart.chart_id+"-groupcontainer-"+groupIndex)[0]);
                chart.$("#ad-chart-"+chart.chart_id+"-groupcontainer-"+groupIndex)[0].name = "group_"+groupIndex;
                chart.groupChartList[groupIndex] = radarChart;
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                chart.updateGroupSimuDp(dataList, groupIndex);
                radarChart.setOption(chart.getRadarChartOption(param,groupIndex));
                //chart.bindExtendAnalysis(radarChart);
            }else if(chart.chart_type=="kpicard") {
                chart.$('#ad-grid-container-'+chart.chart_id).hide();
                chart.$('#ad-gridcfg-container-'+chart.chart_id).hide();
                chart.$('#ad-chart-container-'+chart.chart_id).show();
                var kpicard = echarts.init(chart.$("#ad-chart-container-"+chart.chart_id)[0].children[groupIndex]);
                chart.groupChartList[groupIndex] = kpicard;
                param.GROUP_TITLE = group.GROUP_TITLE;
                param.DIM_NO = group.DIM_NO;
                param.KPI_NO = group.KPI_NO;
                chart.updateGroupSimuDp(dataList, groupIndex);
                kpicard.setOption(chart.getKpiCardOption(param,groupIndex));
            }
        },

        refreshChart: function (chart) {
            var filterDisplay = false;
            var param = this.getChartCfgParam(chart);
            switch (chart.chart_type) {
                case "grid" :
                    chart.updateGridCfg(param);
                    filterDisplay = true;
                    break;
                case "pie" :
                    chart.updatePieCfg(param);
                    break;
                case "line" :
                    chart.updateLineCfg(param);
                    break;
                case "column" :
                    chart.updateColumnCfg(param);
                    break;
                case "area" :
                    ;
                    chart.updateAreaCfg(param);
                    break;
                case "bar" :
                    ;
                    chart.updateBarCfg(param);
                    break;
                case "radar" :
                    ;
                    chart.updateRadarCfg(param);
                    break;
                case "tree" :
                    ;
                    chart.updateTreeCfg(param);
                    break;
                case "duijibar" :
                    ;
                    chart.updateDuijiBarCfg(param);
                    break;
                case "scatter" :
                    chart.updateScatterCfg(param);
                    break;
                case "doubleaxis" :
                    chart.updateDoubleAxisCfg(param);
                    break;
                case "duijicolumn" :
                    chart.updateDuijiColumnCfg(param);
                    break;
                case "duijiarea" :
                    chart.updateDuijiAreaCfg(param);
                    break;
                case "pivottable" :
                    chart.updatePivotTableCfg(param);
                    break;
                case "kpicard" :
                    chart.updateKpiCardCfg(param);
                    break;
                case "map" :
                    chart.updateMapCfg(param);
                    break;
                case "scattermap" :
                    chart.updateScatterMapCfg(param);
                    break;
            }
            chart.updateGridTop();
            if(chart.hideColList.length>0){

            }else if(chart.displayColList.length==0){
                chart.updateGridColState(chart.showColList.concat([]));
            }else{
                chart.updateGridColState(chart.displayColList.concat([]));
            }
            //chart.updateGridColState(chart.displayColList.concat(chart.showColList));
            chart.updateGridByCondiFmt(chart.condiFmtItemList);
            if (filterDisplay) {
               chart.$('#ad-show-gridfilter').show();
            }else{
                chart.$('#ad-show-gridfilter').hide();
            }
            // 更新辅助线配置
            chart.updateMarkline(chart.marklineList);
            for(var i=0;i<chart.marklineList.length;i++){
                chart.marklineList[i] = JSON.stringify(chart.marklineList[i]);
            }
        },

        updateRightCfg: function(chart) {
            var self = this;
            var chartAttrCodeList = ['chart_height','titleAlign','gridTop','isPager','displayColList','condiFmtItemList',
                'isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom',
                'yMax','yMin','xAxis','yAxis',
                'primaryAxis','secondaryAxis',
                'secondaryMax','secondaryMin'
            ];
            // chart_height
            this.$('#ad-chart-height').val(chart.chart_height);
            chart.updateChartHeight();
            // titleAlign
            this.$('#ad-chart-title-input').val(chart.chartTitle);
            this.$('#ad-chart-subtitle-input').val(chart.chartSubTitle);
            this.$('#ad-titlealign-left').removeClass('active');
            this.$('#ad-titlealign-center').removeClass('active');
            this.$('#ad-titlealign-right').removeClass('active');
            this.$('#ad-titlealign-'+chart.titleAlign).addClass('active');
            chart.updateTitle();
            // gridTop
            if(chart.chart_type == "grid"){
                this.$('#ad-grid-top').val(chart.gridTop);
            }else{
                this.$('#ad-chart-top').val(chart.gridTop);
            }
            // isPager
            if(chart.isPager == "false"){
                chart.isPager = false;
            }
            if(chart.isPager == "true"){
                chart.isPager = true;
            }
            if(chart.isPager && chart.chart_type == "grid"){
                this.$('#ad-grid-pager-btn').attr("checked", true);
                chart.startOfPager = 1;
                chart.rowNumOfPager = chart.$('#ad-grid-pager-'+chart.chart_id).pagination("option","rowNum");
            }else{
                this.$('#ad-grid-pager-btn').removeAttr("checked");
                chart.startOfPager = 0;
                chart.rowNumOfPager = 0;
            }
            //
            if(chart.isMergeCell == "false"){
                chart.isMergeCell = false;
            }
            if(chart.isMergeCell == "true"){
                chart.isMergeCell = true;
            }
            //
            if(chart.isCompareAnalysis == "false"){
                chart.isCompareAnalysis = false;
            }
            if(chart.isCompareAnalysis == "true"){
                chart.isCompareAnalysis = true;
            }
            if(chart.isCompareAnalysis){
                chart.$('#ad-chart-compareanalysis-container').show();
                chart.setUpCompareAnalysisInput();
            }else{
                chart.$('#ad-chart-compareanalysis-container').hide();
            }
            //
            if(chart.isExtendedAnalysis == "false"){
                chart.isExtendedAnalysis = false;
            }
            if(chart.isExtendedAnalysis == "true"){
                chart.isExtendedAnalysis = true;
            }
            // displayColList
            if(typeof(chart.displayColList) == 'string' && chart.displayColList!=""){
                chart.displayColList = chart.displayColList.split(",");
            };
            // condiFmtItemList
            // isLabel
            if(chart.isLabel == "false"){
                chart.isLabel = false;
            }
            if(chart.isLabel == "true"){
                chart.isLabel = true;
            }
            if(chart.isLabel){
                this.$('#ad-chartlabel-btn').attr("checked", true);
            }else{
                this.$('#ad-chartlabel-btn').removeAttr("checked");
            }
            // isLegend
            if(chart.isLegend == "false"){
                chart.isLegend = false;
            }
            if(chart.isLegend == "true"){
                chart.isLegend = true;
            }
            if(chart.isLegend){
                this.$('#ad-legend-btn').attr("checked", true);
            }else{
                this.$('#ad-legend-btn').removeAttr("checked");
            }
            //pieChartType
            if(!chart.pieChartType) {
                chart.pieChartType = "0";
            }
            // isZoom
            if(chart.isZoom == "false"){
                chart.isZoom = false;
            }
            if(chart.isZoom == "true"){
                chart.isZoom = true;
            }
            if(chart.isZoom){
                this.$('#ad-zoomaxis-btn').attr("checked", true);
            }else{
                this.$('#ad-zoomaxis-btn').removeAttr("checked");
            }
            // isMapLabel
            if(chart.isMapLabel == "false"){
                chart.isMapLabel = false;
            }
            if(chart.isMapLabel == "true"){
                chart.isMapLabel = true;
            }
            // isMapAreaName
            if(chart.isMapAreaName == "false"){
                chart.isMapAreaName = false;
            }
            if(chart.isMapAreaName == "true"){
                chart.isMapAreaName = true;
            }
            // isMapLegend
            if(chart.isMapLegend == "false"){
                chart.isMapLegend = false;
            }
            if(chart.isMapLegend == "true"){
                chart.isMapLegend = true;
            }
            this.$('#ad-yaxis-max').val(chart.yMax);
            this.$('#ad-yaxis-min').val(chart.yMin);
            this.$('#ad-yaxis2-max').val(chart.secondaryMax);
            this.$('#ad-yaxis2-min').val(chart.secondaryMin);
            //this.$('#ad-yaxis-title').val(chart.yAxisTitle);
            //this.$('#ad-yaxis2-title').val(chart.yAxis2Title);
            if(chart.xAxis!='') {
                this.$('#ad-xaxis-select').val(chart.xAxis);
            }
            if(chart.yAxis!=''){
                this.$('#ad-yaxis-select').val(chart.yAxis);
            }
            // 'primaryAxis','secondaryAxis'
            if(chart.primaryAxis!='') {
                chart.firstAxisKpiList = chart.primaryAxis.split(",");
            }
            if(chart.secondaryAxis!=''){
                chart.secondAxisKpiList = chart.secondaryAxis.split(",");
            }
            //
            fish.forEach(this.selectedDimIndiList, function(dimIndiObj){
                if(dimIndiObj.COL_INDEX == chart.axisCfgXaxis){
                    chart.axisCfgXaxisDataType = self.cachedDimDataType.get(dimIndiObj.COL_NO);
                }
            });
            // x轴间隔和旋转
            if(chart.isXAxisLabelInterval == "false"){
                chart.isXAxisLabelInterval = false;
            }else if(chart.isXAxisLabelInterval == "true"){
                chart.isXAxisLabelInterval = true;
            }
            if(chart.isXAxisLabelRotate == "false"){
                chart.isXAxisLabelRotate = false;
            }else if(chart.isXAxisLabelRotate == "true"){
                chart.isXAxisLabelRotate = true;
            }
            if(chart.isXAxisLabelHeight == "false"){
                chart.isXAxisLabelHeight = false;
            }else if(chart.isXAxisLabelHeight == "true"){
                chart.isXAxisLabelHeight = true;
            }
        },

        getChartCfgParam: function (chart) {
            return {
                chart_label: chart.isLabel,
                legend: chart.isLegend,
                pieChartType: chart.pieChartType,
                legendDirection: chart.legendDirection,
                mapLegendDirection: chart.mapLegendDirection,
                pager: chart.isPager,
                chart_top: chart.gridTop,
                dataZoom: chart.isZoom,
                yaxis_max: chart.yMax,
                yaxis_min: chart.yMin,
                yaxis2_max: chart.secondaryMax,
                yaxis2_min: chart.secondaryMin,
                xaxis_field: chart.xAxis,
                yaxis_field: chart.yAxis,
                yaxis_title: chart.yAxisTitle,
                yaxis2_title: chart.yAxis2Title
            }
        },

        addChart: function (chartIndex) {
            var self = this;
            var dimListInModel = [];
            fish.forEach(this.modelList, function(model){
                if(self.modelCode == model.MODEL_CODE){
                    dimListInModel = model.DIMS;
                }
            });
            var view = new chartContainer({
                selectedDimIndiList: this.selectedDimIndiList,
                mapTypeList: this.cachedMapTypeList,
                forDashBoard: this.forDashBoard,
                uiContainerHeight: this.uiContainerHeight,
                dimListInModel: dimListInModel
            });
            this.chartList[this.chartList.length] = view;
            view.render();
            if(this.layout_type=="0" || this.numperrow==1){
                this.$('#ad-chart-container').append(view.$el);
            }else{
                if(chartIndex==0){
                    this.$('#ad-chart-container-section').empty();
                }
                if(chartIndex%this.numperrow==0) {
                    this.subContainerId = "ad-chart-subcontainer-" + adhocUtil.guid();
                    var htmlText = '<div class="col-md-12">';
                    var colx = 12/this.numperrow;
                    for (var i = 0; i < this.numperrow; i++) {
                        htmlText += '<div class="col-md-'+colx+' ad-box-pd-noshadow" id="' + this.subContainerId + '_' + (chartIndex+i) + '"></div>';
                    };
                    htmlText += '</div>';
                    this.$('#ad-chart-container-section').append(htmlText);
                }
                this.$('#'+this.subContainerId+ '_' + chartIndex).append(view.$el);
            }
            view.afterRender();
            this.listenTo(view, 'queryDataForChart', this.wrap(function (data) {
                this.loadData(data);
            }));
            this.listenTo(view, 'queryDataForChartGroup', function (data) {
                self.loadGroupData(data.chart, data.groupIndex);
            });
            this.listenTo(view, 'compareAnalysisChange', this.wrap(function (data) {
                this.loadCompareAnalysis(data.chart);
            }));
            this.listenTo(view, 'cancelCompareAnalysisChange', this.wrap(function (data) {
                this.cancelCompareAnalysis(data.chart);
            }));
            this.listenTo(view, 'groupExtendDimSelect', this.wrap(function (data) {
                fish.forEach(this.chartList, function(chart){
                    if(chart.chart_id==data.chart_id){
                        var groupIndex = data.groupIndex;
                        if(chart.groupExtendDimList.length==0) {
                            fish.forEach(chart.groupList, function(){
                                chart.groupDimNoList_bak[chart.groupDimNoList_bak.length] = "";
                                chart.groupExtendDimList[chart.groupExtendDimList.length] = [];
                                chart.groupExtendDimFilterList[chart.groupExtendDimFilterList.length] = [];
                            })
                        }
                        if(chart.groupExtendDimList[groupIndex].length==0){
                            var appendHtml = "<a name='ad-extendstep-all-"+groupIndex+"' class='btn btn-link' type='button' style='color:blue'>" + self.resource.ALL + "</a>";
                            chart.$("#ad-chart-"+chart.chart_id+"-groupextendstep-"+groupIndex).append(appendHtml);
                            chart.$('[name=ad-extendstep-all-'+groupIndex+']').off();
                            chart.$('[name=ad-extendstep-all-'+groupIndex+']').on("click", function(e){
                                chart.restoreDimExtend(e);
                            });
                        }
                        chart.groupExtendDimList[groupIndex][chart.groupExtendDimList[groupIndex].length] = data.extendDim;
                        if(chart.groupDimNoList_bak[groupIndex]==""){
                            // 备份最原始的axisCfgXaxis
                            fish.forEach(chart.selectedDimIndiList, function(dimObj){
                                if(dimObj.COL_INDEX == chart.groupList[groupIndex].DIM_NO){
                                    chart.groupDimNoList_bak[groupIndex] = dimObj.COL_NO;
                                }
                            });
                        }
                        //
                        chart.groupList[groupIndex].DIM_NO = data.extendDim.DIM_CODE;
                        var appendHtml = "<a name='ad-extendstep-"+chart.groupList[groupIndex].DIM_NO+"-"+groupIndex+"' class='btn btn-link' type='button' style='color:blue'>" + data.extendDim.DIM_NAME + "</a>";
                        chart.$("#ad-chart-"+chart.chart_id+"-groupextendstep-"+groupIndex).append(" > " + appendHtml);
                        chart.$('[name=ad-extendstep-'+chart.groupList[groupIndex].DIM_NO+'-'+groupIndex+']').off();
                        chart.$('[name=ad-extendstep-'+chart.groupList[groupIndex].DIM_NO+'-'+groupIndex+']').on("click", function(e){
                            chart.switchDimExtend(e);
                        });
                        chart.groupExtendDimFilterList[groupIndex][chart.groupExtendDimFilterList[groupIndex].length] = data.extendFilterCondition;
                        self.loadGroupData(chart, data.groupIndex);
                    }
                });
            }));
            this.listenTo(view, 'extendDimSelect', this.wrap(function (data) {
                fish.forEach(this.chartList, function(chart){
                    if(chart.chart_id==data.chart_id){
                        if(chart.extendDimList.length==0){
                            var appendHtml = "<a name='ad-extendstep-all' class='btn btn-link' type='button' style='color:blue'>" + self.resource.ALL + "</a>";
                            chart.$("#ad-chart-extendstep-"+chart.chart_id).append(appendHtml);
                            chart.$('[name=ad-extendstep-all]').off();
                            chart.$('[name=ad-extendstep-all]').on("click", function(e){
                                chart.restoreDimExtend(e);
                            });
                        }
                        chart.extendDimList[chart.extendDimList.length] = data.extendDim;
                        if(chart.axisCfgXaxis_bak==""){
                            // 备份最原始的axisCfgXaxis
                            fish.forEach(chart.selectedDimIndiList, function(dimObj){
                                if(dimObj.COL_INDEX == chart.axisCfgXaxis){
                                    chart.axisCfgXaxis_bak = dimObj.COL_NO;
                                }
                            });
                        }
                        chart.axisCfgXaxis = data.extendDim.DIM_CODE;
                        //
                        var appendHtml = "<a name='ad-extendstep-"+chart.axisCfgXaxis+"' class='btn btn-link' type='button' style='color:blue'>" + data.extendDim.DIM_NAME + "</a>";
                        chart.$("#ad-chart-extendstep-"+chart.chart_id).append(" > " + appendHtml);
                        chart.$('[name=ad-extendstep-'+chart.axisCfgXaxis+']').off();
                        chart.$('[name=ad-extendstep-'+chart.axisCfgXaxis+']').on("click", function(e){
                            chart.switchDimExtend(e);
                        });
                        chart.extendDimFilterList[chart.extendDimFilterList.length] = data.extendFilterCondition;
                        self.loadData(chart);
                        chart.updateChartHeight(true);
                        chart.refreshCss(true);
                    }
                });
            }));
            this.listenTo(view, 'chartBlankClick', this.wrap(function (data) {
                fish.forEach(this.chartList, function(chart){
                    if(chart.drillEntranceWin){
                        chart.drillEntranceWin.close();
                    }
                    if(chart.viewExtensionWin){
                        chart.viewExtensionWin.close();
                    }
                });
            }));
        },

        queryData: function () {
            this.reloadData();
        },

        backToDesigner: function () {
            this.trigger("backToDesigner");
        },

        highLevelFilterBtnClick: function () {
            if(!this.highlevelFilterDisplay){
                this.showHighlevelFilter();
            }else{
                this.hideHighlevelFilter();
            }
        },

        showHighlevelFilter: function () {
            this.$('#ad-highlevelfilter-container').show();
            this.$('#ad-chart-container-section').css('top', 80);
            this.highlevelFilterDisplay = true;
            this.$('#ad-highlevelfilter-upbtn').show();
            this.$('#ad-highlevelfilter-downbtn').hide();
        },

        hideHighlevelFilter: function () {
            this.$('#ad-highlevelfilter-container').hide();
            this.$('#ad-chart-container-section').css('top', 50);
            this.highlevelFilterDisplay = false;
            this.$('#ad-highlevelfilter-upbtn').hide();
            this.$('#ad-highlevelfilter-downbtn').show();
        },

        getFilterStr: function (fieldNo, operType, paramValueStr) {
            var self = this;
            var filterStr = "";
            switch(operType){
                case 'BT' : valueArray = paramValueStr.split('~');filterStr = fieldNo + " between " + valueArray[0] + " and " + valueArray[1];break;
                case 'EQ' : filterStr = fieldNo + "=" + paramValueStr;break;
                case 'NEQ' : filterStr = fieldNo + "<>" + paramValueStr;break;
                case 'CONT' : filterStr = fieldNo + " like %" + paramValueStr + "%";break;
                case 'NCONT' : filterStr = fieldNo + " not like %" + paramValueStr + "%";break;
                case 'GT' : filterStr = fieldNo + ">" + paramValueStr;break;
                case 'LW' : filterStr = fieldNo + "<" + paramValueStr;break;
                case 'GE' : filterStr = fieldNo + ">=" + paramValueStr;break;
                case 'LE' : filterStr = fieldNo + "<=" + paramValueStr;break;
                case 'INCLUDE' : filterStr = fieldNo + " in (" + paramValueStr + ")";break;
                case 'EXCLUDE' : filterStr = fieldNo + " not in (" + paramValueStr + ")";break;
            }
            return filterStr;
        },

        adaptForDashBoard: function () {
            this.$('#ad-adhocHeader').hide();
            this.$('#ad-chart-container-section').css("top", "0px");
            this.$('#ad-chart-container-section').css("overflow-y", "hidden");
            this.$('#ad-chart-container').height(this.uiContainerHeight);
            this.$('.vbox').height(this.uiContainerHeight-2);
            this.$('#ad-chart-container-section').css("background", "transparent");
        },

        resize: function () {
            fish.forEach(this.chartList, function(chart){
                chart.updateChartHeight();
            });
        },

        dashBoardResize: function (resizeWidth, resizeHeight) {
            this.uiContainerHeight = resizeHeight;
            this.adaptForDashBoard();
            fish.forEach(this.chartList, function(chart){
                chart.uiContainerHeight = resizeHeight;
                chart.updateChartHeight();
            });
            this.$("#chart-box").css("overflow-y", "hidden");
        }

    })
});