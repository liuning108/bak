/**
 *
 */
var dragNode = null;
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/TopicMain.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        "oss_core/inms/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/inms/pm/adhocdesigner/views/DimTag",
        'oss_core/inms/pm/adhocdesigner/views/IndiTag',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil",
        'oss_core/inms/pm/util/views/Util',
        "oss_core/inms/pm/adhocdesigner/views/ChartContainer",
        'css!oss_core/inms/pm/util/css/ad-component.css',
        'css!oss_core/inms/pm/util/css/ad-block.css',
        'css!oss_core/inms/pm/adhocdesigner/assets/bi-common.css',
        'css!oss_core/inms/pm/adhocdesigner/assets/adhoc.css'
    ],
    function(mainTpl, i18nData, action, echarts, dimTag, indiTag, adhocUtil, pmUtil, chartContainer) {
    return fish.View.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #ad-graph-btn': "showGraphMode",
            'click #ad-backtolist-btn': "backToListView",
            'keyup #ad-dim-indi-search': "dimIndiSearch",
            'change #ad-chart-height': "chartHeightFocusOut",
            'keypress #ad-chart-height': "heightValuePress",
            'change #ad-chart-top': "chartCfgChange",
            'change #ad-yaxis-max': "chartCfgChange",
            'change #ad-yaxis-min': "chartCfgChange",
            'change #ad-yaxis2-max': "chartCfgChange",
            'change #ad-yaxis2-min': "chartCfgChange",
            'change #ad-yaxis-title': "chartCfgChange",
            'change #ad-yaxis2-title': "chartCfgChange",
            'change #ad-xaxis-select': "chartCfgChange",
            'change #ad-yaxis-select': "chartCfgChange",
            'keyup #ad-chart-title-input': "titleInput",
            'keyup #ad-chart-subtitle-input': "subtitleInput",
            'mouseup #ad-dimtag-container': "addDimIndi",
            'mouseup #ad-inditag-container': "addDimIndi",
            'mouseup #ad-filter-container': "addFilter",
            'click #ad-addindi-batch': "showAddIndiBatch",
            'click #ad-editmodel-btn': "showEditModel",
            'click .chartBox': "blankClick",
            'click .chart-left-side': "blankClick",
            'click #ad-drillcfg-btn': "drillCfgBtnClick",
            'click #ad-chart-plus': "addChartBtnClick",
            'click #ad-vdim-plus': "addVdimBtnClick",
            'click #ad-filter-plugin-plus': "filterPluginBtnClick",
            'click [name="ad-charttype-btn"]': "switchChartType",
            'click [name="ad-legend-direction-btn"]': "switchLegendDirection",
            'click [name="ad-maplegend-direction-btn"]': "switchMapLegendDirection",
            'click [name="ad-labelsymbol"]': "switchLabelSymbol",
            'click #ad-filterinchart-btn': "showFilterInChart",
            'click #ad-doubleaxis-setup': "showDoubleAxisSetup",
            'click #ad-colcfg-btn': "showColCfg",
            'click #ad-axiscfg-btn': "showAxisCfg",
            'click #ad-mapfieldchoose-btn': "showMapFieldCfg",
            'click #ad-maptype-btn': "showMapTypeCfg",
            'click #ad-kpicardcfg-btn': "showKpiCardCfg",
            'click #ad-marklinecfg-btn': "showMarklineCfg",
            'click #ad-condifmt-btn': "showCondiFmt",
            'change #ad-grid-pager-btn': "chartCfgChange",
            'change #ad-grid-mergecell-btn': "chartCfgChange",
            'change #ad-compareanalysis-btn': "chartCfgChange",
            'change #ad-extendedanalysis-btn': "chartCfgChange",
            'change #ad-chartlabel-btn': "chartCfgChange",
            'change #ad-maplabel-btn': "chartCfgChange",
            'change #ad-areaname-btn': "chartCfgChange",
            'change #ad-maplegend-btn': "mapLegendBtnClick",
            'change #ad-maplegend-direction-sel': "chartCfgChange",
            'change #ad-legend-btn': "legendBtnClick",
            'change .pieChartTypeRadio' : "chartCfgChange",
            'change #ad-zoomaxis-btn': "chartCfgChange",
            'change #ad-pivottable-itemcount-btn': "pivotTableCfgChange",
            'change #ad-pivottablecfg-sortfield': "pivotTableCfgChange",
            'change #ad-pivottablecfg-sorttype': "pivotTableCfgChange",
            'change #ad-pivottablecfg-topn': "pivotTableCfgChange",
            'click [name="ad-titlealign"]': "switchTitleAlign",
            'change #ad-model-select': "modelSelectChange",
            'click #ad-topic-save': "gotoTopicSave",
            'click #ad-topic-preview-btn': "topicPreview",
            'click .vdimEditBtn': "vdimEditBtnClick",
            'click .vdimDelBtn': "vdimDelBtnClick",
            'click #ad-axiscolor-list-container': "showAxisColorCfg",
            'click #ad-mapcolor-container': "showMapColorCfg"
        },

        initialize: function (opt) {
            this.bpId = opt.bpId;
            this.uiContainerHeight = opt.uiContainerHeight;
            this.topicNo = opt.topicNo;
            this.topicName = opt.topicName;
            this.classNo = opt.classNo;
            this.modelCode = '';
            this.granuStr = '';
            this.chartList = [];
            this.selectedDimIndiList = [];
            this.filterList = [];
            this.vdimList = [];
            this.globalVdimList = [];
            this.highlightChart = null;
            this.treeDisplayData = null;
            this.detailParam = opt.detailParam;
            this.catalogList = opt.catalogList;
            this.globalVdimData = opt.globalVdimData;
            this.chartOrderList = [];
            this.forDashBoard = opt.forDashBoard?opt.forDashBoard:false;
            this.kpiTreeIsOpen = pmUtil.parameter("adhocDesignerKpiTreeIsOpen").PARA_VALUE=="0"?false:true;
            this.cachedMapTypeList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({SLA_TYPE: this.SLA_TYPE},this.resource)));
            return this;
        },

        afterRender: function () {
            var self = this;
            this.cachedDim = new adhocUtil.HashMap();
            this.cachedIndi = new adhocUtil.HashMap();
            this.cachedDimCode = new adhocUtil.HashMap();
            this.modelList = [];
            var dimList = [];
            var kpiList = [];
            action.cacheModelData({}, function (data) {
                fish.forEach(data.DIMS, function(dim){
                    self.cachedDimCode.put(dim.FIELD_CODE, dim.DIM_CODE);
                    self.cachedDim.put(dim.FIELD_CODE, dim.FIELD_NAME);
                    dimList[dimList.length] = {
                        DIM_CODE: dim.FIELD_CODE,
                        META_DIM_CODE: dim.DIM_CODE,
                        DIM_NAME: dim.FIELD_NAME
                    }
                });
                fish.forEach(data.KPIS, function(kpi){
                    self.cachedIndi.put(kpi.FIELD_CODE, kpi.FIELD_NAME);
                    kpiList[kpiList.length] = {
                        EMS_TYPE_REL_ID: kpi.EMS_TYPE_REL_ID,
                        KPI_CODE: kpi.FIELD_CODE,
                        KPI_NAME: kpi.FIELD_NAME
                    }
                });
                for(var i=0;i<data.modelField.length;i++){
                    var modelFieldObj = data.modelField[i];
                    var modelObj;
                    var MODEL_CODE = modelFieldObj.MODEL_BUSI_CODE;
                    var MODEL_PHY_CODE = modelFieldObj.MODEL_PHY_CODE;
                    var MODEL_NAME = modelFieldObj.MODEL_BUSI_NAME;
                    var FIELD_CODE = modelFieldObj.FIELD_CODE;
                    var DIM_CODE = self.cachedDimCode.get(FIELD_CODE);
                    var FIELD_NAME = modelFieldObj.FIELD_NAME;
                    var FIELD_TYPE = modelFieldObj.FIELD_TYPE;
                    var DATA_TYPE = modelFieldObj.DATA_TYPE;// 2-时间类型
                    var TIMESPAN_OBJ = adhocUtil.parseGranuModeJson(modelFieldObj.GRANU_MODE);
                    var MODEL_TIMESPAN = TIMESPAN_OBJ.granuStr;
                    var MODEL_TIMESPAN_NAME = TIMESPAN_OBJ.granuNameStr;
                    var isExist = false;
                    for(var j=0;j<self.modelList.length && !isExist;j++){
                        modelObj = self.modelList[j];
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
                        self.modelList[self.modelList.length] = modelObj;
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
                        modelObj.INDICATORS[modelObj.INDICATORS.length] = {
                            KPI_CODE: FIELD_CODE,
                            KPI_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }
                }
                fish.forEach(self.modelList, function(model) {
                    var modelCode = model.MODEL_CODE;
                    fish.forEach(model.DIMS, function (dim) {
                        self.cachedDim.put(modelCode + "-" + dim.DIM_CODE, dim.DIM_NAME);
                    });
                    fish.forEach(model.INDICATORS, function (indi) {
                        self.cachedIndi.put(modelCode + "-" + indi.KPI_CODE, indi.KPI_NAME);
                    });
                });
                self.metaDimList = dimList;
                self.metaKpiList = kpiList;
                self.treeNodeDrag = "0";
                self.$('#ad-topicname-input').val(self.topicName);
                // 先缓存地图类型数据再加载维度指标
                action.cacheMapType(function (data) {
                    if(data && data.length>0){
                        self.cachedMapTypeList = [];
                        fish.forEach(data, function(mapType){
                            self.cachedMapTypeList[self.cachedMapTypeList.length] = mapType;
                        });
                    }
                    self.initLeftTree();
                });
            });
        },

        initLeftTree: function () {
            var self = this;
            action.qryEms({}, function (data) {
                /**
                 * EMS_CODE: "ERICSS_OSS_CN"
                 EMS_NAME: "Ericsson-OSS(CN)"
                 EMS_TYPE: "Core Network"
                 EMS_TYPE_CODE: "C1"
                 EMS_TYPE_REL_ID: "3"
                 */
                self.emsList = data.emsList;
                self.emsTypeList = [];
                // 构造emsTypeList
                for (var i=0; i<self.emsList.length; i++) {
                    var emsObj = self.emsList[i];
                    var isExist = false;
                    for (var j=0; j<self.emsTypeList.length && !isExist; j++) {
                        var emsTypeObj = self.emsTypeList[j];
                        if (emsObj.EMS_TYPE_CODE == emsTypeObj.id) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        var emsTypeChildren = [];
                        // 构造emsTypeList下的Children
                        for (var k=0; k<self.emsList.length; k++) {
                            var emsTmpObj = self.emsList[k];
                            if(emsTmpObj.EMS_TYPE_CODE == emsObj.EMS_TYPE_CODE){
                                emsTypeChildren[emsTypeChildren.length] = {
                                    id: emsTmpObj.EMS_CODE,
                                    name: emsTmpObj.EMS_NAME,
                                    CLASS_TYPE: "01",
                                    open: self.kpiTreeIsOpen,
                                    nodeType: 0,
                                    children: []
                                }
                            }
                        }
                        self.emsTypeList[self.emsTypeList.length] = {
                            id: emsObj.EMS_TYPE_CODE,
                            name: emsObj.EMS_TYPE,
                            CLASS_TYPE: "01",
                            open: self.kpiTreeIsOpen,
                            nodeType: 0,
                            children: emsTypeChildren
                        }
                    }
                }
                self.treeData = [
                    {
                        id: -1, name: self.resource.DIM, CLASS_TYPE: "00", open: true, nodeType: 0,
                        children: []
                    },
                    {
                        id: -2, name: self.resource.KPI, CLASS_TYPE: "00",  open: true,nodeType: 0,
                        children: self.emsTypeList
                    }
                ];
                self.cacheMetaData();
            });
        },

        cacheMetaData: function() {
            var self = this;
            this.dimList = [];
            this.kpiList = [];
            // 依次加载维度指标
            action.cacheDimData({

            }, function (data) {
                // tagType:0-维度 1-指标
                // DIM_CODE META_DIM_CODE DIM_NAME
                fish.forEach(self.metaDimList, function(dim) {
                    var isExistInModel = false;
                    for(var modelIndex=0; modelIndex<self.modelList.length && !isExistInModel; modelIndex++){
                        var dims = self.modelList[modelIndex].DIMS;
                        for(var dimIndex=0; dimIndex<dims.length && !isExistInModel; dimIndex++){
                            if(dims[dimIndex].DIM_CODE==dim.DIM_CODE){
                                isExistInModel = true;
                            }
                        }
                    }
                    if(isExistInModel) {
                        self.dimList[self.dimList.length] = {
                            id: dim.DIM_CODE,
                            name: dim.DIM_NAME,
                            CLASS_TYPE: "00",
                            nodeType: 1,
                            tagType: 0
                        }
                        self.treeData[0].children[self.treeData[0].children.length] = {
                            id: dim.DIM_CODE,
                            name: dim.DIM_NAME,
                            CLASS_TYPE: "00",
                            nodeType: 1,
                            tagType: 0,
                            iconSkin: 'ico_dim'
                        }
                    }
                });
                // 全局虚拟维度添加至树上
                fish.forEach(self.globalVdimData.vdimList, function(globalVdim) {
                    var isExistInModel = false;
                    for(var modelIndex=0; modelIndex<self.modelList.length && !isExistInModel; modelIndex++){
                        var dims = self.modelList[modelIndex].DIMS;
                        for(var dimIndex=0; dimIndex<dims.length && !isExistInModel; dimIndex++){
                            if(dims[dimIndex].DIM_CODE==globalVdim.FIELD_CODE){
                                isExistInModel = true;
                            }
                        }
                    }
                    if(isExistInModel) {
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
                        self.globalVdimList[self.globalVdimList.length] = globalVdim;
                        self.treeData[0].children[self.treeData[0].children.length] = {
                            id: globalVdim.VDIM_CODE,
                            name: globalVdim.VDIM_NAME,
                            CLASS_TYPE: "00",
                            VDIM_FIELD: globalVdim.VDIM_FIELD,
                            VDIM_TYPE: globalVdim.VDIM_TYPE,
                            nodeType: 1,
                            tagType: 0,
                            //isVdim: 0,
                            groupList: globalVdim.groupList,
                            iconSkin: 'ico_dim'
                            //font:{'color':'orange'}
                        }
                    }
                });
                //
                action.cacheKpiData({

                }, function (data) {
                    // EMS_TYPE_REL_ID KPI_CODE KPI_NAME
                    fish.forEach(self.metaKpiList, function(kpi) {
                        var isExistInModel = false;
                        for(var modelIndex=0; modelIndex<self.modelList.length && !isExistInModel; modelIndex++){
                            var indicators = self.modelList[modelIndex].INDICATORS;
                            for(var indiIndex=0; indiIndex<indicators.length && !isExistInModel; indiIndex++){
                                if(indicators[indiIndex].KPI_CODE==kpi.KPI_CODE){
                                    isExistInModel = true;
                                }
                            }
                        }
                        if(isExistInModel) {
                            self.kpiList[self.kpiList.length] = {
                                id: kpi.KPI_CODE,
                                name: kpi.KPI_NAME,
                                CLASS_TYPE: "02",
                                nodeType: 1,
                                tagType: 1,
                                EMS_TYPE_REL_ID: kpi.EMS_TYPE_REL_ID
                            }
                            var EMS_TYPE_REL_ID = kpi.EMS_TYPE_REL_ID;
                            var belongEmsTypeList = [];
                            for (var i = 0; i < self.emsList.length; i++) {
                                var emsObj = self.emsList[i];
                                if (emsObj.EMS_TYPE_REL_ID == EMS_TYPE_REL_ID) {
                                    var EMS_CODE = emsObj.EMS_CODE;
                                    var EMS_TYPE_CODE = emsObj.EMS_TYPE_CODE;
                                    for (var j = 0; j < self.emsTypeList.length; j++) {
                                        if (self.emsTypeList[j].id == EMS_TYPE_CODE) {
                                            var emsTmpList = self.emsTypeList[j].children;
                                            for (var k = 0; k < emsTmpList.length; k++) {
                                                if (emsTmpList[k].id == EMS_CODE) {
                                                    emsTmpList[k].children[emsTmpList[k].children.length] = {
                                                        id: kpi.KPI_CODE,
                                                        name: kpi.KPI_NAME,
                                                        CLASS_TYPE: "02",
                                                        nodeType: 1,
                                                        tagType: 1,
                                                        iconSkin: 'ico_ind'
                                                    };
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    var setting = {
                        view: {
                            addHoverDom: self.addHoverDom,
                            removeHoverDom: self.removeHoverDom,
                            fontCss: self.getFont,
                            nameIsHTML: true
                        },
                        edit: {
                            enable: true,
                            showRemoveBtn: false,
                            showRenameBtn: false,
                            drag: {
                                autoExpandTrigger: true,
                                isCopy: true,
                                isMove: true,
                                prev: false,
                                inner: false,
                                next: false
                            }
                        },
                        callback: {
                            beforeDrag: self.beforeDrag,
                            beforeDrop:  self.beforeDrop,
                            beforeDragOpen:  self.beforeDragOpen,
                            onDrag:  self.onDrag,
                            onDrop:  self.onDrop,
                            onExpand:  self.onExpand
                        },
                        fNodes: self.treeData
                    };
                    self.treeDisplayData = self.deepCopyTreeData();
                    self.$el.find("#ad-dim-indi-tree").tree(setting);
                    self.$dimIndiTree = self.$el.find("#ad-dim-indi-tree");
                    self.nodeClassName = "dark";
                    self.curDragNodes = null;
                    self.autoExpandNode = null;
                    self.$('[class="button ico_docu"]').attr('class', 'button ico_close');
                    self.insertGlobalVdimInList();
                    if(self.topicNo && self.topicNo!=""){
                        self.loadTopicDetail();
                    }
                });
            });
        },

        getFont: function(node) {
            return node.font ? node.font : {};
        },

        addHoverDom: function(treeNode) {
            if (treeNode.parentNode && treeNode.parentNode.id!=1) return;
            var aObj = $("#" + treeNode.tId);
            if (treeNode.isVdim == "0") {
                if ($("#diyBtn_"+treeNode.id).length>0) return;
                var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' >&nbsp;</span>"
                    +"<a href='#' class='vdimEditBtn' style='padding-top:10px' id='diyBtn_" +treeNode.id+ "' title='"+treeNode.name+"' onfocus='this.blur();'>"
                    +"<i class='fa fa-pencil ad-icon'></i></a>"
                    +"<a href='#' class='vdimDelBtn' style='padding-top:10px' id='diyBtn2_" +treeNode.id+ "' title='"+treeNode.name+"' onfocus='this.blur();'>"
                    +"<i class='fa fa-trash ad-icon'></i></a>";;
                aObj.append(editStr);
            }
        },

        removeHoverDom: function(treeNode) {
            if (treeNode.isVdim == "0") {
                $("#diyBtn_"+treeNode.id).unbind().remove();
                $("#diyBtn2_"+treeNode.id).unbind().remove();
                $("#diyBtn_space_" +treeNode.id).unbind().remove();
            }
        },

        // 刷新可选择的维度指标
        refreshDimIndiTree: function() {
            var self = this;
            this.selectableModelList = [];
            var selectedDimCount = 0;
            var selectedIndiCount = 0;
            var filterCount = 0;// 排除FILTER_TYPE=3的插件过滤器再进行匹配
            fish.forEach(this.filterList, function(filter){
                if(filter.FILTER_TYPE!="3") {
                    filterCount++;
                }
            });
            var matchLength = this.selectedDimIndiList.length + filterCount;
            for(var i=0; i<this.modelList.length; i++){
                var model = this.modelList[i];
                var dims = model.DIMS;
                var matchCount = 0;
                for(var j=0; j<dims.length; j++){
                    var dimObj = dims[j];
                    for(var l=0;l<this.selectedDimIndiList.length;l++){
                        var selectedItem = this.selectedDimIndiList[l].dragNode;
                        if(dimObj.DIM_CODE == selectedItem.id || selectedItem.VDIM_FIELD == dimObj.DIM_CODE ){
                            matchCount++;
                            selectedDimCount++;
                        }
                    }
                    for(var l=0;l<this.filterList.length;l++){
                        if(this.filterList[l].FILTER_TYPE!="3") {
                            var selectedItem = this.filterList[l].dragNode;
                            if (dimObj.DIM_CODE == selectedItem.id || selectedItem.VDIM_FIELD == dimObj.DIM_CODE) {
                                matchCount++;
                                selectedDimCount++;
                            }
                        }
                    }
                }
                var indis = model.INDICATORS;
                for(var j=0; j<indis.length; j++){
                    var indiObj = indis[j];
                    for(var l=0;l<this.selectedDimIndiList.length;l++){
                        var selectedItem = this.selectedDimIndiList[l].dragNode;
                        if(indiObj.KPI_CODE == selectedItem.id){
                            matchCount++;
                            selectedIndiCount++;
                        }
                    }
                    for(var l=0;l<this.filterList.length;l++){
                        if(this.filterList[l].FILTER_TYPE!="3") {
                            var selectedItem = this.filterList[l].dragNode;
                            if (indiObj.KPI_CODE == selectedItem.id) {
                                matchCount++;
                                selectedIndiCount++;
                            }
                        }
                    }
                }
                if(matchCount==matchLength){
                    this.selectableModelList[this.selectableModelList.length] = model;
                }
            }
            // 刷新可选的模型列表
            this.refreshModelList();
            if(selectedDimCount>0 ||selectedIndiCount>0){
                this.updateGranu();
            }
            this.refreshDimIndiNameByModel();
            //
            var selectableDims = [];
            var selectableKpis = [];
            for(var i=0; i<this.selectableModelList.length; i++) {
                var selectableModel = this.selectableModelList[i];
                for (var j = 0; j < this.modelList.length; j++) {
                    var model = this.modelList[j];
                    if (selectableModel.MODEL_CODE == model.MODEL_CODE) {
                        //维度捞取
                        var dims = model.DIMS;
                        for (var k = 0; k < dims.length; k++) {
                            var dim = dims[k];
                            var isExist = false;
                            for (var l = 0; l < selectableDims.length && !isExist; l++) {
                                var selectableDim = selectableDims[l];
                                if (selectableDim.id == dim.DIM_CODE) {
                                    isExist = true;
                                }
                            }
                            if (!isExist) {
                                selectableDims[selectableDims.length] = {
                                    id: dim.DIM_CODE,
                                    name: this.cachedDim.get(dim.DIM_CODE),
                                    CLASS_TYPE: "00",
                                    nodeType: 1,
                                    tagType: 0,
                                    iconSkin: 'ico_dim'
                                }
                            }
                        }
                        // 判断虚拟列的情况
                        for (var k = 0; k < dims.length; k++) {
                            var dim = dims[k];
                            // 全局虚拟维度
                            for (var l = 0; l < this.globalVdimList.length; l++) {
                                var vdimObj = this.globalVdimList[l];
                                if (vdimObj.VDIM_FIELD == dim.DIM_CODE) {
                                    var isExist = false;
                                    var itemIndex = 0;
                                    for(var itemIndex=0;itemIndex<selectableDims.length;itemIndex++) {
                                        var dimItem = selectableDims[itemIndex];
                                        if (dimItem.id == vdimObj.VDIM_CODE) {
                                            //isExist = true;
                                            selectableDims.splice(itemIndex--, 1);
                                        }
                                    };
                                    if(!isExist){
                                        selectableDims[selectableDims.length] = {
                                            id: vdimObj.VDIM_CODE,
                                            name: vdimObj.VDIM_NAME,
                                            CLASS_TYPE: "00",
                                            VDIM_FIELD: vdimObj.VDIM_FIELD,
                                            VDIM_TYPE: vdimObj.VDIM_TYPE,
                                            nodeType: 1,
                                            tagType: 0,
                                            //isVdim: 0,
                                            groupList: vdimObj.groupList,
                                            iconSkin: 'ico_dim'
                                            //font:{'color':'orange'}
                                        }
                                    }
                                }
                            }
                            // 虚拟维度
                            for (var l = 0; l < this.vdimList.length; l++) {
                                var vdimObj = this.vdimList[l];
                                if (vdimObj.VDIM_FIELD == dim.DIM_CODE && vdimObj.VDIM_CODE.substring(0,4)=='vdim') {
                                    var isExist = false;
                                    var itemIndex = 0;
                                    for(var itemIndex=0;itemIndex<selectableDims.length;itemIndex++) {
                                        var dimItem = selectableDims[itemIndex];
                                        if (dimItem.id == vdimObj.VDIM_CODE) {
                                            //isExist = true;
                                            selectableDims.splice(itemIndex--, 1);
                                        }
                                    };
                                    if(!isExist){
                                        selectableDims[selectableDims.length] = {
                                            id: vdimObj.VDIM_CODE,
                                            name: vdimObj.VDIM_NAME,
                                            CLASS_TYPE: "00",
                                            VDIM_FIELD: vdimObj.VDIM_FIELD,
                                            VDIM_TYPE: vdimObj.VDIM_TYPE,
                                            nodeType: 1,
                                            tagType: 0,
                                            isVdim: 0,
                                            groupList: vdimObj.groupList,
                                            iconSkin: 'ico_dim',
                                            font:{'color':'orange'}
                                        }
                                    }
                                }
                            }
                        }
                        //指标捞取
                        var indis = model.INDICATORS;
                        for (var k = 0; k < indis.length; k++) {
                            selectableKpis[selectableKpis.length] = {
                                DATA_TYPE: indis[k].DATA_TYPE,
                                KPI_CODE: indis[k].KPI_CODE,
                                KPI_NAME: this.cachedIndi.get(indis[k].KPI_CODE)
                            };
                        }
                    }
                }
            }
            this.treeDisplayData = this.deepCopyTreeData();
            for(var index1=0; index1<this.treeDisplayData[1].children.length; index1++){
                var emsTypeObj = this.treeDisplayData[1].children[index1];
                for(var index2=0; index2<emsTypeObj.children.length; index2++){
                    var emsObj = emsTypeObj.children[index2];
                    for(var index3=0; index3<emsObj.children.length; index3++){
                        var kpiObj = emsObj.children[index3];
                        var isExist = false;
                        for(var k=0; k<selectableKpis.length && !isExist; k++) {
                            var kpi = selectableKpis[k];
                            if (kpiObj.id == kpi.KPI_CODE) {
                                isExist = true;
                            }
                        }
                        if(!isExist){
                            emsObj.children.splice(index3,1);
                            index3--;
                        }
                        // 获取上次操作的指标 本次刷新指标树时将其展开
                        if(this.dragKpi && this.dragKpi==kpiObj.id){
                            emsObj.open = true;
                            emsTypeObj.open = true;
                            this.treeDisplayData[1].open = true;
                        }
                    }
                }
            }
            //
            this.treeDisplayData[0].children = selectableDims;//.sort(adhocUtil.compare);
            // 判断维度是否展开 若被收起则刷新时不再展开
            if(this.$('#ad-dim-indi-tree ul li span').attr('class').indexOf("triangle-right")!=-1){
                this.treeDisplayData[0].open = false;
            }
            this.$dimIndiTree.tree('reloadData', this.treeDisplayData);
            if(this.$('#ad-dim-indi-search').val()!=''){
                this.dimIndiSearch();
            }
            // 由于指标增加减少可能换行在此刷新top值
            this.refreshTop();
            this.updateSelectableChart();
            this.$('[class="button ico_docu"]').attr('class', 'button ico_close');
            // 刷新图表
            if(this.selectedDimIndiList.length==0){
                this.$("#chart-img").nextAll().remove();
                this.chartList = [];
                this.$('#chart-img').removeClass(' fade  ');
            }else if(this.chartList.length>0) {
                fish.forEach(this.chartList, function (view) {
                    var chart_type = view.chart_type;
                    view.selectedDimIndiList = self.selectedDimIndiList;
                    //view.afterRender();
                    view.refreshColModel();
                    view.updateSimuDp(true);
                    view.chart_type = chart_type;
                    //this.refreshChart(view);
                });
            }
        },

        refreshTop: function() {
            var topValue = 134 + this.$('#ad-inditag-container').height() - 42 + 10;
            this.$('#ad-filter-div').css('top', topValue);
            this.$('#ad-chartbox-div').css('top', topValue);
        },

        // 更新可选图表的状态
        updateSelectableChart: function() {
            var dimCount = 0;
            var kpiCount = 0;
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var obj = this.selectedDimIndiList[i];
                if(obj.dragNode.tagType == 0){
                    dimCount++;
                }
                if(obj.dragNode.tagType == 1){
                    kpiCount++;
                }
            }
            // 维度大于1时
            if(dimCount>0 || kpiCount>0){
                this.$('#ad-chart-plus').removeAttr('disabled');

            }else{
                this.$('#ad-chart-plus').attr('disabled', 'disabled');
            }
        },

        deepCopyTreeData: function () {
            var treeDataTmp = [];
            treeDataTmp[0] = $.extend(true, {}, this.treeData[0]);
            treeDataTmp[1] = $.extend(true, {}, this.treeData[1]);
            treeDataTmp[0].children = [];
            fish.forEach(this.treeData[0].children, function (obj) {
                treeDataTmp[0].children[treeDataTmp[0].children.length] = $.extend(true, {}, obj);
            });
            treeDataTmp[1].children = [];
            fish.forEach(this.treeData[1].children, function (obj) {
                treeDataTmp[1].children[treeDataTmp[1].children.length] = $.extend(true, {}, obj);
            });
            for(var i=0;i<treeDataTmp[1].children.length;i++){
                treeDataTmp[1].children[i].children = [];
                fish.forEach(this.treeData[1].children[i].children, function (obj) {
                    treeDataTmp[1].children[i].children[treeDataTmp[1].children[i].children.length] = $.extend(true, {}, obj);
                });
                for(var j=0;j<treeDataTmp[1].children[i].children.length;j++){
                    treeDataTmp[1].children[i].children[j].children = [];
                    fish.forEach(this.treeData[1].children[i].children[j].children, function (obj) {
                        treeDataTmp[1].children[i].children[j].children[treeDataTmp[1].children[i].children[j].children.length] = $.extend(true, {}, obj);
                    });
                }
            }
            return treeDataTmp;
        },

        // 维度指标变动刷新模型
        refreshModelList: function () {
            var modelCodeObj = undefined;
            this.$("#ad-model-select").empty();
            var selObj = this.$("#ad-model-select");
            var listLength = this.selectableModelList.length;
            for(var i=0; i<listLength && this.selectedDimIndiList.length>0; i++){
                var selectableModel = this.selectableModelList[i];
                var value = selectableModel.MODEL_CODE;
                var text = selectableModel.MODEL_NAME;
                if(this.modelCode && this.modelCode==value){
                    selObj.append("<option selected value='"+value+"'>"+text+"</option>");
                    modelCodeObj = selectableModel;
                }else{
                    selObj.append("<option value='"+value+"'>"+text+"</option>");
                }
            }
            if(listLength==0 || this.selectedDimIndiList.length==0){
                this.refreshGranuList(null);
            }else if(modelCodeObj){
                this.refreshGranuList(modelCodeObj);
            }else{
                this.refreshGranuList(this.selectableModelList[0]);
            }
        },

        refreshGranuList: function (modelObject) {
            this.$("#ad-granu-container").empty();
            this.updateGranu();
            this.modelCode = '';
            var checkedArray = this.granuStr.split(",");
            if(modelObject!=null){
                this.modelCode = modelObject.MODEL_CODE;
                var granuList = modelObject.MODEL_TIMESPAN.split(',');
                var granuNameList = modelObject.MODEL_TIMESPAN_NAME.split(',');
                for(var i=0; i<granuList.length; i++){
                    var granu = granuList[i];
                    var granuName = granuNameList[i];
                    var isCheckedStr = "";
                    for(var j=0; j<checkedArray.length && isCheckedStr==""; j++){
                        if(checkedArray[j] == granu){
                            isCheckedStr = "checked";
                        }
                    }
                    if(this.granuStr==''){
                        isCheckedStr = "checked";
                    }
                    var htmlText = '<div class="checkbox"><label>'
                        + '<input type="checkbox" '+isCheckedStr+' name="ad-granularity" title="'+granuName+'" value="'+granu+'"> '+granuName
                        + '</label></div>';
                    this.$("#ad-granu-container").append(htmlText);
                }
            }
        },

        beforeDrag: function (treeId, treeNodes) {
            /*this.nodeClassName = (this.nodeClassName === "dark" ? "":"dark");
            for (var i=0,l=treeNodes.length; i<l; i++) {
                if (treeNodes[i].drag === false) {
                    this.curDragNodes = null;
                    return false;
                } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
                    this.curDragNodes = null;
                    return false;
                }
            }
            this.curDragNodes = treeNodes;*/
            if(treeNodes.nodeType == 0){
                return false;
            }else{
                dragNode = treeNodes;
            }
            return true;
        },
        beforeDragOpen: function (treeId, treeNode) {
            this.autoExpandNode = treeNode;
            return true;
        },
        beforeDrop: function (treeId, treeNodes, targetNode, moveType, isCopy) {
            this.nodeClassName = (this.nodeClassName === "dark" ? "":"dark");
            return true;
        },
        onDrag: function (event, treeId, treeNodes) {
            this.nodeClassName = (this.nodeClassName === "dark" ? "":"dark");
            if( dragNode.tagType == 0) { // 维度
                $(".chart-args").addClass("draging");
            }else{
                $(".chart-args").addClass("draging");
            }
            $(".chart-left-side").addClass("draging");
        },
        onDrop: function (event, treeId, treeNodes, targetNode, moveType, isCopy) {
            if( dragNode.tagType == 0) { // 维度
                $(".chart-args").removeClass("draging");
            }else{
                $(".chart-args").removeClass("draging");
            }
            $(".chart-left-side").removeClass("draging");
            dragNode = null;
        },
        onExpand: function (event, treeId, treeNode) {
            if (treeNode === this.autoExpandNode) {
                this.nodeClassName = (this.nodeClassName === "dark" ? "":"dark");
            }
        },
        showLog: function (str) {
            console.log(str);
        },

        backToListView: function () {
            this.trigger('backToListView');
            this.trigger('AdhocCancelEvent');
        },

        dimIndiSearch: function () {
            var reloadData = [];
            var searchCont = adhocUtil.trim(this.$('#ad-dim-indi-search').val());
            if(searchCont == ''){
                this.$dimIndiTree.tree('reloadData', this.treeDisplayData);
            }else {
                // 维度搜索
                for (var i = 0, l = this.treeDisplayData[0].children.length; i < l; i++) {
                    var item = this.treeDisplayData[0].children[i];
                    if (item.name.toLowerCase().indexOf(searchCont.toLowerCase()) != -1) {
                        reloadData[reloadData.length] = item;
                    }
                }
                // 指标搜索
                for(var index1=0; index1<this.treeDisplayData[1].children.length; index1++){
                    var emsTypeObj = this.treeDisplayData[1].children[index1];
                    for(var index2=0; index2<emsTypeObj.children.length; index2++){
                        var emsObj = emsTypeObj.children[index2];
                        for(var index3=0; index3<emsObj.children.length; index3++){
                            var kpiObj = emsObj.children[index3];
                            if (kpiObj.name.toLowerCase().indexOf(searchCont.toLowerCase()) != -1) {
                                reloadData[reloadData.length] = kpiObj;
                            }
                        }
                    }
                }
                this.$dimIndiTree.tree('reloadData', reloadData);
            }
        },

        heightValuePress: function(e){
            if (event.keyCode == "13") {
                e.stopPropagation();
                e.preventDefault();
            }
        },

        chartHeightFocusOut: function () {
            var chartHeight = this.$('#ad-chart-height').val();
            if(chartHeight == '') {
                this.$('#ad-chart-height').val(this.highlightChart.chart_height);
            }else{
                this.highlightChart.chart_height = this.$('#ad-chart-height').val();
                this.highlightChart.updateChartHeight();
            }
        },

        // 表格Top触发
        gridTopChange: function () {
            if(this.highlightChart){
                this.highlightChart.updateGridTop();
            }
        },

        // 添加筛选器面板
        addFilterToView: function(dragNode, data) {
            var self = this;
            this.dragNode = dragNode;
            require(["oss_core/inms/pm/adhocdesigner/views/FilterPanel"], function (filterPanel) {
                var view = new filterPanel({dragNode:dragNode,data:data});
                self.filterList[self.filterList.length] = view;
                self.refreshDimIndiTree();
                view.render();
                self.$('#ad-filter-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                view.afterRender();
                self.listenTo(view, 'removeFilterPanel', function (data) {
                    self.removeFilterPanel(data.panel_id);
                });
                self.listenTo(view, 'showIndiFilterSetup', function (data) {
                    self.showIndiFilterSetup(data.DIM_CODE);
                });
                self.listenTo(view, 'showDimFilterSetup', function (data) {
                    self.showDimFilterSetup(data.DIM_CODE);
                });
            });
        },

        addFilterPluginToView: function(data) {
            // FILTER_NAME,PLUGIN_NO, PLUGIN_PARAM
            var self = this;
            data.DIM_NAME = data.FILTER_NAME;
            data.FILTER_TYPE = '3';
            require(["oss_core/inms/pm/adhocdesigner/views/FilterPanel"], function (filterPanel) {
                var view = new filterPanel({dragNode:null,data:data});
                self.filterList[self.filterList.length] = view;
                view.render();
                self.$('#ad-filter-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                view.afterRender();
                self.listenTo(view, 'removeFilterPanel', function (data) {
                    self.removeFilterPanel(data.panel_id);
                });
                self.listenTo(view, 'showFilterPluginSetup', function (data) {
                    self.showFilterPluginSetup(data.panel_id);
                });
            });
        },

        // 选中维度
        addDimIndi: function () {
            if( dragNode ) {
                this.dragNode = dragNode;
                if( dragNode.tagType == 0){ // 维度
                    this.createDimTag(this.dragNode);
                }else{ // 指标
                    this.createIndiTag(this.dragNode);
                    this.dragKpi = this.dragNode.id;
                }
                this.refreshDimIndiTree();
            }
        },

        removeFilterPanel: function (panel_id) {
            for (var i = 0,l = this.filterList.length; i < l; i++) {
                var filterPanel = this.filterList[i];
                if (filterPanel && filterPanel.panel_id == panel_id) {
                    this.filterList.splice(i, 1);
                    this.$("div[name="+panel_id+"]").remove();
                }else{

                }
            }
            this.refreshDimIndiTree();
        },

        RemoveTag: function (tag_id) {
            var self = this;
            for (var i = 0,l = self.selectedDimIndiList.length; i < l; i++) {
                var dimTag = self.selectedDimIndiList[i];
                if (dimTag && dimTag.tag_id == tag_id) {// 匹配删除的tag
                    var tagType = dimTag.dragNode.tagType;
                    this.selectedDimIndiList.splice(i, 1);
                    fish.forEach(this.chartList, function (view) {// 对所有图表进行更新操作
                        var chart_type = view.chart_type;
                        if(tagType==0) {// 维度删除
                            if (view.axisCfgSeries != "") {
                                var dimIndex = parseInt(view.axisCfgSeries.substring(4));
                                if (dimIndex > i) {
                                    view.axisCfgSeries = "DIM_" + (dimIndex - 1);
                                } else if (dimIndex == i) {
                                    view.axisCfgSeries = "";
                                }
                            }
                            if (view.sortCol && view.sortCol.substring(0, 3) == "DIM") {
                                var dimIndex = parseInt(view.sortCol.substring(4));
                                if (dimIndex > i) {
                                    view.sortCol = "DIM_" + (dimIndex - 1);
                                } else if (dimIndex == i) {
                                    view.sortCol = "";
                                }
                            }
                            if (view.sortCol && view.sortCol.substring(0, 3) == "KPI") {
                                var kpiIndex = parseInt(view.sortCol.substring(4));
                                view.sortCol = "KPI_" + (kpiIndex - 1);
                            }
                            if (view.axisCfgXaxis != "") {
                                var dimIndex = parseInt(view.axisCfgXaxis.substring(4));
                                if (dimIndex > i) {
                                    view.axisCfgXaxis = "DIM_" + (dimIndex - 1);
                                } else if (dimIndex == i) {
                                    view.axisCfgXaxis = "";
                                }
                            }
                            for (var j = 0; j < view.selectableColList.length; j++) {
                                if (view.selectableColList[j].substring(0, 3) == "DIM") {
                                    var dimIndex = parseInt(view.selectableColList[j].substring(4));
                                    if (dimIndex > i) {
                                        view.selectableColList[j] = "DIM_" + (dimIndex - 1);
                                    } else if (dimIndex == i) {
                                        view.selectableColList.splice(j--, 1);
                                    }
                                }
                            }
                            for (var j = 0; j < view.selectableColList.length; j++) {
                                if (view.selectableColList[j].substring(0, 3) == "KPI") {
                                    var kpiIndex = parseInt(view.selectableColList[j].substring(4));
                                    if (kpiIndex > i) {
                                        view.selectableColList[j] = "KPI_" + (kpiIndex - 1);
                                    } else if (kpiIndex == i) {
                                        view.selectableColList.splice(j--, 1);
                                    }
                                }
                            }
                            for (var j = 0; j < view.drillColList.length; j++) {
                                if (view.drillColList[j].substring(0, 3) == "KPI") {
                                    var dimIndex = parseInt(view.drillColList[j].substring(4));
                                    if (dimIndex > i) {
                                        view.drillColList[j] = "KPI_" + (dimIndex - 1);
                                    } else if (dimIndex == i) {
                                        view.drillColList.splice(j--, 1);
                                    }
                                }
                            }
                            for (var j = 0; j < view.displayColList.length; j++) {
                                if (view.displayColList[j].substring(0, 3) == "DIM") {
                                    var dimIndex = parseInt(view.displayColList[j].substring(4));
                                    if (dimIndex > i) {
                                        view.displayColList[j] = "DIM_" + (dimIndex - 1);
                                    } else if (dimIndex == i) {
                                        view.displayColList.splice(j--, 1);
                                    }
                                }
                            }
                        }else if(tagType==1){
                            if (view.sortCol && view.sortCol.substring(0, 3) == "KPI") {
                                var kpiIndex = parseInt(view.sortCol.substring(4));
                                if (kpiIndex > i) {
                                    view.sortCol = "KPI_" + (kpiIndex - 1);
                                } else if (kpiIndex == i) {
                                    view.sortCol = "";
                                }
                            }
                            for (var j = 0; j < view.selectableColList.length; j++) {
                                if (view.selectableColList[j].substring(0, 3) == "KPI") {
                                    var kpiIndex = parseInt(view.selectableColList[j].substring(4));
                                    if (kpiIndex > i) {
                                        view.selectableColList[j] = "KPI_" + (kpiIndex - 1);
                                    } else if (kpiIndex == i) {
                                        view.selectableColList.splice(j--, 1);
                                    }
                                }
                            }
                            for (var j = 0; j < view.drillColList.length; j++) {
                                if (view.drillColList[j].substring(0, 3) == "KPI") {
                                    var kpiIndex = parseInt(view.drillColList[j].substring(4));
                                    if (kpiIndex > i) {
                                        view.drillColList[j] = "KPI_" + (kpiIndex - 1);
                                    } else if (kpiIndex == i) {
                                        view.drillColList.splice(j--, 1);
                                    }
                                }
                            }
                            for (var j = 0; j < view.displayColList.length; j++) {
                                if (view.displayColList[j].substring(0, 3) == "KPI") {
                                    var kpiIndex = parseInt(view.displayColList[j].substring(4));
                                    if (kpiIndex > i) {
                                        view.displayColList[j] = "KPI_" + (kpiIndex - 1);
                                    } else if (kpiIndex == i) {
                                        view.displayColList.splice(j--, 1);
                                    }
                                }
                            }
                            //
                            for (var j = 0; j < view.axisCfgYaxisList.length; j++) {
                                if (view.axisCfgYaxisList[j].substring(0, 3) == "KPI") {
                                    var kpiIndex = parseInt(view.axisCfgYaxisList[j].substring(4));
                                    if (kpiIndex > i) {
                                        view.axisCfgYaxisList[j] = "KPI_" + (kpiIndex - 1);
                                    } else if (kpiIndex == i) {
                                        view.axisCfgYaxisList.splice(j--, 1);
                                    }
                                }
                            }
                            view.axisColorCfgYaxisList.splice(view.axisColorCfgYaxisList.length-1, 1);
                            if(view.chart_type=="map" || view.chart_type=="scattermap"){
                                self.refreshMapColorPanel(view);
                            }else {
                                self.refreshAxisColorPanel(view);
                            }
                        }
                        view.refreshColModel();
                        view.updateSimuDp(true);
                        self.refreshChart(view);
                    });
                    this.$("div[name="+tag_id+"]").remove();
                }else{

                }
            }
            this.refreshDimIndiTree();
        },

        restoreTag: function (tag_id) {
            this.$('[name="'+tag_id+'"]').attr('style',"position: relative");
            this.$('[name="'+tag_id+'"]').css('left',' ');
            this.$('[name="'+tag_id+'"]').css('top',' ');
        },

        addFilter: function() {
            if( dragNode ) {
                if( dragNode.tagType == 0){ // 维度
                    this.showDimFilter(dragNode);
                }else{ // 指标
                    this.showIndiFilter(dragNode);
                }
            }
        },

        showDimFilter: function(dragNode) {
            var self = this;
            for(var i=0; i<this.filterList.length; i++) {
                var filterObj = this.filterList[i];
                if (dragNode.id == filterObj.DIM_CODE) {
                    fish.toast('info', this.resource.FILTER_CONDITION_FOR_DIM_ADDED);
                    return;
                }
            }
            var allItemList = [];
            if(dragNode.VDIM_TYPE){// 虚拟维度
                for (var i = 0; i < this.vdimList.length; i++) {
                    if (this.vdimList[i].VDIM_CODE == dragNode.id) {
                        for (var j = 0; j < this.vdimList[i].groupList.length; j++) {
                            allItemList[allItemList.length] = this.vdimList[i].groupList[j];
                        }
                        allItemList[allItemList.length] = {
                            id: -1,
                            name: this.vdimList[i].NOGROUP_NAME
                        }
                    }
                }
                if(allItemList.length==0){
                    var noGroupName = "";
                    fish.forEach(this.globalVdimData.vdimGroupList, function(vdimGroup){
                        if(vdimGroup.VDIM_CODE == dragNode.id){
                            if(vdimGroup.GROUP_NO!="0") {
                                allItemList[allItemList.length] = {
                                    id: vdimGroup.GROUP_NO,
                                    name: vdimGroup.GROUP_NAME,
                                    expression: "",
                                    items: []
                                }
                            }else {
                                noGroupName = vdimGroup.GROUP_NAME;
                            }
                        }

                    });
                    allItemList[allItemList.length] = {
                        id: -1,
                        name: noGroupName
                    }
                }
            }else{
                allItemList = [];
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/DimFilter'
            ], function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: dragNode.id,
                    DIM_NAME: dragNode.name,
                    META_DIM_CODE: self.cachedDimCode.get(dragNode.id),
                    FILTER_TYPE: "0",
                    VIEW_TYPE: 0,
                    filterOperList: [],
                    selectedList: [],
                    allItemList: allItemList
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 496
                };
                self.dimFilterView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okDimFilterEvent', function (data) {
                    self.dimFilterView.close();
                    self.addFilterToView(dragNode, data);
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.dimFilterView.close();
                });
            });
        },

        showIndiFilter: function(dragNode) {
            var self = this;
            for(var i=0; i<this.filterList.length; i++) {
                var filterObj = this.filterList[i];
                if (dragNode.id == filterObj.DIM_CODE) {
                    fish.toast('info', this.resource.FILTER_CONDITION_FOR_KPI_ADDED);
                    return;
                }
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/IndiFilter'
            ], function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: dragNode.id,
                    DIM_NAME: dragNode.name,
                    filterOperList: []
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 286
                };
                self.indiFilterView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okIndiFilterEvent', function (data) {
                    self.indiFilterView.close();
                    self.addFilterToView(dragNode, data);
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.indiFilterView.close();
                });
            });
        },

        showFilterPluginSetup: function (panel_id) {
            var self = this;
            var filterObj;
            for(var i=0; i<this.filterList.length; i++) {
                var tmpObj = this.filterList[i];
                if (panel_id == tmpObj.panel_id) {
                    filterObj = tmpObj;
                    break;
                }
            }
            var param = new Object();
            if(filterObj){
                param = filterObj.opt.data;
                param.modelCode = this.modelCode;
            }
            param.panel_id = panel_id;
            require([
                'oss_core/inms/pm/adhocdesigner/views/FilterPluginCfg'
            ], function (Dialog) {
                var dialog = new Dialog(param);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 600
                };
                self.filterPluginCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'filterPluginOkEvent', function (data) {
                    self.filterPluginCfgView.close();
                    var filterPanel = null;
                    for (var i = 0; i < self.filterList.length; i++) {
                        if (self.filterList[i].panel_id == data.panel_id) {
                            filterPanel = self.filterList[i];
                            break;
                        }
                    }
                    if (filterPanel) {
                        filterPanel.DIM_NAME = data.FILTER_NAME;
                        filterPanel.opt.data = data;
                        filterPanel.updateFilterPanel();
                        self.$('#'+data.panel_id+'-title').text(data.FILTER_NAME);
                    }
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.filterPluginCfgView.close();
                });
            });
        },

        showDimFilterSetup: function (DIM_CODE) {
            var self = this;
            var filterObj;
            for(var i=0; i<this.filterList.length; i++) {
                var tmpObj = this.filterList[i];
                if (DIM_CODE == tmpObj.DIM_CODE) {
                    filterObj = tmpObj;
                    break;
                }
            }
            var allItemList = [];
            for(var i=0;i<this.vdimList.length;i++){
                if(this.vdimList[i].VDIM_CODE==filterObj.DIM_CODE){
                    for(var j=0;j<this.vdimList[i].groupList.length;j++){
                        allItemList[allItemList.length] = this.vdimList[i].groupList[j];
                    }
                    allItemList[allItemList.length] = {
                        id: -1,
                        name: this.vdimList[i].NOGROUP_NAME
                    }
                }
            }
            if(allItemList.length==0){
                var noGroupName = "";
                var isGlobalVdim = false;
                fish.forEach(this.globalVdimData.vdimGroupList, function(vdimGroup){
                    if(vdimGroup.VDIM_CODE == DIM_CODE){
                        isGlobalVdim = true;
                        if(vdimGroup.GROUP_NO!="0") {
                            allItemList[allItemList.length] = {
                                id: vdimGroup.GROUP_NO,
                                name: vdimGroup.GROUP_NAME,
                                expression: "",
                                items: []
                            }
                        }else {
                            noGroupName = vdimGroup.GROUP_NAME;
                        }
                    }

                });
                if(isGlobalVdim) {
                    allItemList[allItemList.length] = {
                        id: -1,
                        name: noGroupName
                    }
                }
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/DimFilter'
            ], function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: filterObj.DIM_CODE,
                    META_DIM_CODE: self.cachedDimCode.get(filterObj.DIM_CODE),
                    DIM_NAME: filterObj.DIM_NAME,
                    FILTER_TYPE: filterObj.FILTER_TYPE,
                    VIEW_TYPE: filterObj.VIEW_TYPE,
                    selectedList: filterObj.selectedList,
                    filterOperList: filterObj.filterOperList,
                    allItemList: allItemList
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 496
                };
                self.dimFilterSetupView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okDimFilterEvent', function (data) {
                    self.dimFilterSetupView.close();
                    var filterPanel = null;
                    for (var i = 0; i < self.filterList.length; i++) {
                        if (self.filterList[i].DIM_CODE == data.DIM_CODE) {
                            filterPanel = self.filterList[i];
                            break;
                        }
                    }
                    if (filterPanel) {
                        filterPanel.FILTER_TYPE = data.FILTER_TYPE;
                        filterPanel.SUBFILTER_TYPE = data.SUBFILTER_TYPE;
                        filterPanel.DIM_CODE = data.DIM_CODE
                        filterPanel.DIM_NAME = data.DIM_NAME;
                        filterPanel.selectedList = data.selectedList;
                        filterPanel.filterOperList = data.filterOperList;
                        filterPanel.VIEW_TYPE = data.VIEW_TYPE;
                        filterPanel.updateFilterPanel();
                    }
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.dimFilterSetupView.close();
                });
            });
        },

        showIndiFilterSetup: function (DIM_CODE) {
            var self = this;
            var filterObj;
            for(var i=0; i<this.filterList.length; i++) {
                var tmpObj = this.filterList[i];
                if (DIM_CODE == tmpObj.DIM_CODE) {
                    filterObj = tmpObj;
                    break;
                }
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/IndiFilter'
            ], function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: filterObj.DIM_CODE,
                    DIM_NAME: filterObj.DIM_NAME,
                    filterOperList: filterObj.filterOperList
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 286
                };
                self.indiFilterSetupView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okIndiFilterEvent', function (data) {
                    self.indiFilterSetupView.close();
                    var filterPanel = null;
                    for (var i = 0; i < self.filterList.length; i++) {
                        if (self.filterList[i].DIM_CODE == data.DIM_CODE) {
                            filterPanel = self.filterList[i];
                            break;
                        }
                    }
                    if (filterPanel) {
                        filterPanel.FILTER_TYPE = data.FILTER_TYPE;
                        filterPanel.DIM_CODE = data.DIM_CODE
                        filterPanel.DIM_NAME = data.DIM_NAME;
                        filterPanel.selectedList = data.selectedList;
                        filterPanel.filterOperList = data.filterOperList;
                        filterPanel.updateFilterPanel();
                    }
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.indiFilterSetupView.close();
                });
            });
        },

        // 创建维度tag
        createDimTag: function (param) {
            var self = this;
            var view = new dimTag({dragNode: param});
            var dimEndIndex = this.selectedDimIndiList.length;
            for(var i=0;i<this.selectedDimIndiList.length;i++){
                if(this.selectedDimIndiList[i].dragNode.tagType==1){
                    dimEndIndex = i;
                    break;
                }
            }
            // 拼接函数(索引位置, 要删除元素的数量, 元素)
            this.selectedDimIndiList.splice(dimEndIndex, 0, view);
            view.render();
            this.$('#ad-dimtag-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
            view.afterRender();
            this.listenTo(view, 'removeDimTag', function (data) {
                self.RemoveTag(data.tag_id);
            });
            this.listenTo(view, 'restoreDimTag', function (data) {
                self.restoreTag(data.tag_id);
            });
            this.listenTo(view, 'refreshDimKpiTagName', function (data) {
                //console.log(refreshDimKpiTagName)
            });
        },

        // 创建指标tag
        createIndiTag: function(param) {
            var self = this;
            var view = new indiTag({dragNode: param});
            this.selectedDimIndiList[this.selectedDimIndiList.length] = view;
            view.render();
            this.$('#ad-inditag-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
            view.afterRender();
            this.listenTo(view, 'removeIndiTag', function (data) {
                self.RemoveTag(data.tag_id);
            });
            this.listenTo(view, 'restoreIndiTag', function (data) {
                self.restoreTag(data.tag_id);
            });
            this.listenTo(view, 'refreshDimKpiTagName', function (data) {
                //console.log(refreshDimKpiTagName)
            });
        },

        // 批量添加指标
        showAddIndiBatch: function() {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/AddIndiBatch'
            ], function (Dialog) {
                var sData = {
                    emsTypeList: self.treeDisplayData==null?self.treeData[1].children:self.treeDisplayData[1].children
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 600,
                    height: 350
                };
                self.addIndiBatchView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    var selectedKpiList = data.selectedKpiList;
                    for(var i=0; i<selectedKpiList.length; i++) {
                        var selectKpiId = selectedKpiList[i];
                        var selectKpiObject = null;
                        for(var j=0; j<self.kpiList.length; j++) {
                            var kpiObject = self.kpiList[j];
                            if(kpiObject.id == selectKpiId){
                                selectKpiObject = kpiObject;
                                break;
                            }
                        }
                        if(selectKpiObject) {
                            self.createIndiTag(selectKpiObject);
                        }
                    }
                    self.addIndiBatchView.close();
                    self.refreshDimIndiTree();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.addIndiBatchView.close();
                });
            });
        },

        // 显示图内筛选器
        showFilterInChart: function() {
            var self = this;
            var dimList = [];
            for (var i = 0; i < this.selectedDimIndiList.length; i++) {
                var obj = this.selectedDimIndiList[i];
                if (obj.dragNode.tagType == 0) {
                    var isExist = false;
                    for(var j = 0; j < dimList.length && !isExist; j++){
                        if(dimList[j].DIM_CODE == obj.dragNode.id){
                            isExist = true;
                        }
                    }
                    if(!isExist) {
                        dimList[dimList.length] = {
                            DIM_CODE: obj.dragNode.id,
                            DIM_NAME: obj.tagName
                        }
                    }
                }
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/FilterInChart'
            ], function (Dialog) {
                var sData = {
                    dimList: dimList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 600,
                    height: 396
                };
                self.filterInChartView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okFilterInChartEvent', function (data) {
                    self.filterInChartView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function (data) {
                    self.filterInChartView.close();
                });
            });
        },

        // 显示双轴图的轴设置界面
        showDoubleAxisSetup: function() {
            var self = this;
            var kpiList = [];
            for(var i=0; i<this.highlightChart.colModel.length; i++){
                var col = this.highlightChart.colModel[i];
                if(col.colType == 1){
                    kpiList[kpiList.length] = {
                        colIndex: col.name,
                        colName : col.label
                    };
                }
            }
            require([
                'oss_core/inms/pm/adhocdesigner/views/DoubleAxisSetup'
            ], function (Dialog) {
                var sData = {
                    kpiList: kpiList,
                    firstAxisKpiList: self.highlightChart.firstAxisKpiList,
                    secondAxisKpiList: self.highlightChart.secondAxisKpiList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 300
                };
                self.doubleAxisSetupView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    if(self.highlightChart) {
                        self.highlightChart.firstAxisKpiList = data.firstAxisKpiList;
                        self.highlightChart.secondAxisKpiList = data.secondAxisKpiList;
                        self.highlightChart.primaryAxis = data.firstAxisKpiList.toString();
                        self.highlightChart.secondaryAxis = data.secondAxisKpiList.toString();
                        self.refreshChart(self.highlightChart);
                    }
                    self.doubleAxisSetupView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function (data) {
                    self.doubleAxisSetupView.close();
                });
            });
        },

        // 显示列设置
        showColCfg: function() {
            var self = this;
            if(this.highlightChart) {
                require([
                    'oss_core/inms/pm/adhocdesigner/views/ColCfg'
                ], function (Dialog) {
                    var sData = {
                        colList: self.highlightChart.colModel,
                        gridTop: self.highlightChart.gridTop,
                        sortCol: self.highlightChart.sortCol,
                        sortType: self.highlightChart.sortType,
                        selectableColList: self.highlightChart.selectableColList,
                        selectedDimIndiList: self.selectedDimIndiList,
                        showColList: self.highlightChart.showColList,
                        drillColList: self.highlightChart.drillColList
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 600,
                        height: 350
                    };
                    self.colCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        // gridTop sortCol sortType displayColList selectableColList drillColList
                        var displayColList = data.displayColList;
                        var drillColList = data.drillColList;
                        self.highlightChart.updateGridColState(displayColList, drillColList);
                        //
                        self.highlightChart.gridTop = data.gridTop;
                        if(self.highlightChart.sortCol!=data.sortCol || self.highlightChart.sortType!=data.sortType){
                            self.highlightChart.sortCol = data.sortCol;
                            self.highlightChart.sortType = data.sortType;
                            self.highlightChart.updateSimuDp(true);
                        }
                        self.highlightChart.displayColList = displayColList.toString();
                        self.highlightChart.selectableColList = data.selectableColList.toString();
                        self.highlightChart.drillColList = data.drillColList.toString();
                        //
                        self.gridTopChange();
                        self.highlightChart.updateChartHeight();
                        self.colCfgView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function () {
                        self.colCfgView.close();
                    });
                });
            }
        },

        // 显示坐标轴设置(此设置为直角系坐标设置)
        showAxisCfg: function() {
            var self = this;
            if(this.highlightChart) {
                var chart_type = this.highlightChart.chart_type;
                if (chart_type == "pie" || chart_type == "radar") {
                    this.showPieLikeAxisCfg(chart_type);
                } else {
                    require([
                        'oss_core/inms/pm/adhocdesigner/views/AxisCfg'
                    ], function (Dialog) {
                        var sData = {
                            chart_type: chart_type,
                            axisCfgXaxis: self.highlightChart.axisCfgXaxis,
                            xAxisLabelRotate: self.highlightChart.xAxisLabelRotate,
                            xAxisLabelInterval: self.highlightChart.xAxisLabelInterval,
                            xAxisLabelHeight: self.highlightChart.xAxisLabelHeight,
                            isXAxisLabelRotate: self.highlightChart.isXAxisLabelRotate,
                            isXAxisLabelInterval: self.highlightChart.isXAxisLabelInterval,
                            isXAxisLabelHeight: self.highlightChart.isXAxisLabelHeight,
                            axisCfgYaxisList: self.highlightChart.axisCfgYaxisList,
                            axisCfgYaxisTypeList: self.highlightChart.axisCfgYaxisTypeList,
                            axisCfgSeries: self.highlightChart.axisCfgSeries,
                            gridTop: self.highlightChart.gridTop,
                            sortCol: self.highlightChart.sortCol,
                            sortType: self.highlightChart.sortType,
                            colModel: self.highlightChart.colModel
                        };
                        var dialog = new Dialog(sData);
                        var content = dialog.render().$el;
                        var option = {
                            content: content,
                            width: 750,
                            height: 525
                        };
                        if (chart_type == "scatter") {
                            option.height = 300;
                        }
                        self.axisCfgView = fish.popup(option);
                        dialog.contentReady();
                        self.listenTo(dialog, 'okEvent', function (data) {
                            var chart = self.highlightChart;
                            if (chart.sortCol != data.sortCol || chart.sortType != data.sortType
                                || chart.gridTop != data.gridTop) {
                                chart.gridTop = data.gridTop;
                                chart.sortCol = data.sortCol;
                                chart.sortType = data.sortType;
                                chart.updateSimuDp(true);
                            }
                            chart.gridTop = data.gridTop;
                            chart.axisCfgXaxis = data.axisCfgXaxis;
                            chart.axisCfgYaxisList = data.axisCfgYaxisList;
                            var colorListLength = chart.axisColorCfgYaxisList.length;
                            if(chart.axisCfgYaxisList.length > colorListLength){
                                for(i=0;i<chart.axisCfgYaxisList.length;i++){
                                    if(i>=colorListLength){
                                        chart.axisColorCfgYaxisList[chart.axisColorCfgYaxisList.length] =
                                            adhocUtil.getColorSeries(i);
                                    }
                                }
                            }else{
                                chart.axisColorCfgYaxisList = chart.axisColorCfgYaxisList.slice(0,chart.axisCfgYaxisList.length);
                            }
                            chart.axisCfgYaxisTypeList = data.axisCfgYaxisTypeList;
                            chart.axisCfgSeries = data.axisCfgSeries;
                            // 主次轴配置是否显示
                            chart.mainAxisCfgShow = data.mainAxisCfgShow;
                            chart.secondAxisCfgShow = data.secondAxisCfgShow;
                            // x轴间隔与旋转
                            chart.xAxisLabelRotate = data.xAxisLabelRotate;
                            chart.xAxisLabelInterval = data.xAxisLabelInterval;
                            chart.xAxisLabelHeight = data.xAxisLabelHeight;
                            chart.isXAxisLabelRotate = data.isXAxisLabelRotate;
                            chart.isXAxisLabelInterval = data.isXAxisLabelInterval;
                            chart.isXAxisLabelHeight = data.isXAxisLabelHeight;
                            self.updateChartCfg(chart.chart_type);
                            //
                            self.refreshChart(chart);
                            self.axisCfgView.close();
                        });
                        self.listenTo(dialog, 'cancelEvent', function () {
                            self.axisCfgView.close();
                        });
                    });
                }
            }
        },

        showMapFieldCfg: function () {
            var self = this;
            if(this.highlightChart) {
                require([
                    'oss_core/inms/pm/adhocdesigner/views/MapFieldCfg'
                ], function (Dialog) {
                    var sData = {
                        axisCfgXaxis: self.highlightChart.axisCfgXaxis,
                        axisCfgYaxisList: self.highlightChart.axisCfgYaxisList,
                        colModel: self.highlightChart.colModel
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 400,
                        height: 220
                    };
                    self.mapFieldCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        self.highlightChart.axisCfgXaxis = data.axisCfgXaxis;
                        self.highlightChart.axisCfgYaxisList = data.axisCfgYaxisList;
                        self.refreshChart(self.highlightChart);
                        self.mapFieldCfgView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function () {
                        self.mapFieldCfgView.close();
                    });
                });
            }
        },

        showAxisColorCfg: function() {
            var self = this;
            if(this.highlightChart) {
                require([
                    'oss_core/inms/pm/adhocdesigner/views/AxisColorCfg'
                ], function (Dialog) {
                    var sData = {
                        axisCfgYaxisList: self.highlightChart.axisCfgYaxisList,
                        axisColorCfgYaxisList: self.highlightChart.axisColorCfgYaxisList,
                        colModel: self.highlightChart.colModel
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 480,
                        height: 350
                    };
                    self.axisColorCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        self.highlightChart.axisColorCfgYaxisList = data.axisColorCfgYaxisList;
                        self.updateChartCfg(self.highlightChart.chart_type);
                        self.refreshChart(self.highlightChart);
                        self.axisColorCfgView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function () {
                        self.axisColorCfgView.close();
                    });
                });
            }
        },

        showMapColorCfg: function() {
            var self = this;
            if(this.highlightChart) {
                require([
                    'oss_core/inms/pm/adhocdesigner/views/MapColorCfg'
                ], function (Dialog) {
                    var sData = {
                        mapColorCfg: self.highlightChart.mapColorCfg
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 480,
                        height: 220
                    };
                    self.mapColorCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        self.highlightChart.mapColorCfg = data.mapColorCfg;
                        self.refreshChart(self.highlightChart);
                        self.mapColorCfgView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function () {
                        self.mapColorCfgView.close();
                    });
                });
            }
        },

        showMapTypeCfg: function () {
            var self = this;
            if(this.highlightChart) {
                require([
                    'oss_core/inms/pm/adhocdesigner/views/MapTypeCfg'
                ], function (Dialog) {
                    var sData = {
                        mapTypeList: self.cachedMapTypeList,
                        AREAMAP_NO: self.highlightChart.AREAMAP_NO
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 280,
                        height: 360
                    };
                    self.mapTypeCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        self.highlightChart.AREAMAP_NO = data.AREAMAP_NO;
                        self.highlightChart.AREAMAP_URL = data.AREAMAP_URL;
                        self.refreshChart(self.highlightChart);
                        self.mapTypeCfgView.close();
                        // 避免出现多余label重新出现的情况需要延迟刷新一遍
                        _.delay(function () {
                            self.refreshChart(self.highlightChart);
                        }.bind(self), 100);
                    });
                    self.listenTo(dialog, 'cancelEvent', function () {
                        self.mapTypeCfgView.close();
                    });
                });
            }
        },

        // 显示指标设置(此设置为指标卡的指标设置)
        showKpiCardCfg: function() {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/PieLikeAxisCfg'
            ], function (Dialog) {
                var sData = {
                    chart_type: "kpicard",
                    axisCfgXaxis: self.highlightChart.axisCfgXaxis,
                    axisCfgYaxisList: self.highlightChart.axisCfgYaxisList,
                    axisCfgYaxisTypeList: self.highlightChart.axisCfgYaxisTypeList,
                    axisCfgSeries: self.highlightChart.axisCfgSeries,
                    gridTop: self.highlightChart.gridTop,
                    sortCol: self.highlightChart.sortCol,
                    sortType: self.highlightChart.sortType,
                    colModel: self.highlightChart.colModel,
                    groupList: self.highlightChart.groupList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 550,
                    height: 555
                };
                self.kpiCardCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
                    var groupList = data.groupList;
                    self.highlightChart.groupList = groupList;
                    self.refreshChart(self.highlightChart);
                    /*
                    if (this.highlightChart.sortCol != data.sortCol || this.highlightChart.sortType != data.sortType
                        || this.highlightChart.gridTop != data.gridTop) {
                        this.highlightChart.gridTop = data.gridTop;
                        this.highlightChart.sortCol = data.sortCol;
                        this.highlightChart.sortType = data.sortType;
                        this.highlightChart.updateSimuDp(true);
                    }
                    this.highlightChart.gridTop = data.gridTop;
                    this.highlightChart.axisCfgXaxis = data.axisCfgXaxis;
                    this.highlightChart.axisCfgYaxisList = data.axisCfgYaxisList;
                    this.highlightChart.axisCfgYaxisTypeList = data.axisCfgYaxisTypeList;
                    this.highlightChart.axisCfgSeries = data.axisCfgSeries;
                    // 主次轴配置是否显示
                    this.updateChartCfg(this.highlightChart.chart_type);
                    //
                    this.refreshChart(this.highlightChart);
                    */
                    self.kpiCardCfgView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.kpiCardCfgView.close();
                });
            });
        },

        showPieLikeAxisCfg: function(chart_type) {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/PieLikeAxisCfg'
            ], function (Dialog) {
                var sData = {
                    chart_type: chart_type,
                    axisCfgXaxis: self.highlightChart.axisCfgXaxis,
                    axisCfgYaxisList: self.highlightChart.axisCfgYaxisList,
                    axisCfgYaxisTypeList: self.highlightChart.axisCfgYaxisTypeList,
                    axisCfgSeries: self.highlightChart.axisCfgSeries,
                    gridTop: self.highlightChart.gridTop,
                    sortCol: self.highlightChart.sortCol,
                    sortType: self.highlightChart.sortType,
                    colModel: self.highlightChart.colModel,
                    groupList: self.highlightChart.groupList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 550,
                    height: 555
                };
                self.axisCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
                    var groupList = data.groupList;
                    self.highlightChart.groupList = groupList;
                    self.refreshChart(self.highlightChart);
                    /*
                     if (this.highlightChart.sortCol != data.sortCol || this.highlightChart.sortType != data.sortType
                     || this.highlightChart.gridTop != data.gridTop) {
                     this.highlightChart.gridTop = data.gridTop;
                     this.highlightChart.sortCol = data.sortCol;
                     this.highlightChart.sortType = data.sortType;
                     this.highlightChart.updateSimuDp(true);
                     }
                     this.highlightChart.gridTop = data.gridTop;
                     this.highlightChart.axisCfgXaxis = data.axisCfgXaxis;
                     this.highlightChart.axisCfgYaxisList = data.axisCfgYaxisList;
                     this.highlightChart.axisCfgYaxisTypeList = data.axisCfgYaxisTypeList;
                     this.highlightChart.axisCfgSeries = data.axisCfgSeries;
                     // 主次轴配置是否显示
                     this.updateChartCfg(this.highlightChart.chart_type);
                     //
                     this.refreshChart(this.highlightChart);
                     */
                    self.axisCfgView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.axisCfgView.close();
                });
            });
        },

        showMarklineCfg: function() {
            var self = this;
            if(this.highlightChart) {
                var kpiList = [];
                for (var i = 0; i < this.highlightChart.colModel.length; i++) {
                    var obj = this.highlightChart.colModel[i];
                    if (obj.colType == 1) {
                        kpiList[kpiList.length] = {
                            KPI_CODE: obj.colId,
                            KPI_NAME: obj.label,
                            KPI_INDEX: obj.index
                        }
                    }
                }
                for(var i=0; i<this.highlightChart.marklineList.length; i++){
                    var markline = this.highlightChart.marklineList[i];
                    if(typeof(markline) == 'string'){
                        this.highlightChart.marklineList[i] = JSON.parse(markline);
                    }
                }
                require([
                    'oss_core/inms/pm/adhocdesigner/views/MarklineCfg'
                ], function (Dialog) {
                    var sData = {
                        kpiList: kpiList,
                        marklineList: self.highlightChart.marklineList
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 600,
                        height: 305
                    };
                    self.marklineCfgView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        if (self.highlightChart) {
                            self.highlightChart.updateMarkline(data.marklineList);
                            self.highlightChart.marklineList = [];
                            for(var i=0; i<data.marklineList.length; i++){
                                self.highlightChart.marklineList[self.highlightChart.marklineList.length] = JSON.stringify(data.marklineList[i]);
                            }
                        }
                        self.marklineCfgView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function (data) {
                        self.marklineCfgView.close();
                    });
                });
            }
        },

        showCondiFmt: function() {
            var self = this;
            if(this.highlightChart) {
                var kpiList = [];
                for (var i = 0; i < this.highlightChart.colModel.length; i++) {
                    var obj = this.highlightChart.colModel[i];
                    if (obj.colType == 1) {
                        kpiList[kpiList.length] = {
                            KPI_CODE: obj.colId,
                            KPI_NAME: obj.label,
                            KPI_INDEX: obj.index
                        }
                    }
                }
                for(var i=0; i<this.highlightChart.condiFmtItemList.length; i++){
                    var condiFmt = this.highlightChart.condiFmtItemList[i];
                    if(typeof(condiFmt) == 'string'){
                        this.highlightChart.condiFmtItemList[i] = JSON.parse(this.highlightChart.condiFmtItemList[i]);
                    }
                }
                require([
                    'oss_core/inms/pm/adhocdesigner/views/CondiFmt'
                ], function (Dialog) {
                    var sData = {
                        kpiList: kpiList,
                        condiFmtItemList: self.highlightChart.condiFmtItemList
                    };
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 720,
                        height: 300
                    };
                    self.condiFmtView = fish.popup(option);
                    dialog.contentReady();
                    self.listenTo(dialog, 'okEvent', function (data) {
                        if (self.highlightChart) {
                            self.highlightChart.updateGridByCondiFmt(data.condiFmtItemList);
                            self.highlightChart.condiFmtItemList = [];
                            for(var i=0; i<data.condiFmtItemList.length; i++){
                                self.highlightChart.condiFmtItemList[self.highlightChart.condiFmtItemList.length] = JSON.stringify(data.condiFmtItemList[i]);
                            }
                        }
                        this.condiFmtView.close();
                    });
                    self.listenTo(dialog, 'cancelEvent', function (data) {
                        self.condiFmtView.close();
                    });
                });
            }
        },

        showEditModel: function() {
            // 显示粒度选择面板
            this.$('#ad-editmodel-container').toggleClass('bottom fade in ');
        },

        blankClick: function() {
            // 隐藏粒度选择面板
            this.$('#ad-editmodel-container').removeClass('bottom fade in ');
            this.updateGranu();
        },

        drillCfgBtnClick:function () {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/DrillCfg'
            ], function (Dialog) {
                var sData = {
                    selectedSloNo: "",
                    slos: ""
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 390
                };
                self.drillCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    self.drillCfgView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.drillCfgView.close();
                });
            });
        },

        // 新增图表
        addChartBtnClick: function () {
            var self = this;
            // 判断当前是否可用状态
            if(this.$('#ad-chart-plus').attr('disabled')){
                return;
            }
            var view = new chartContainer({
                selectedDimIndiList: this.selectedDimIndiList,
                vdimList: this.vdimList,
                mapTypeList: this.cachedMapTypeList,
                forDashBoard: this.forDashBoard
            });
            this.chartList[this.chartList.length] = view;
            view.render();
            view.updateSimuDp(true);
            this.$('#ad-chartlist-container').append(view.$el);
            view.afterRender();
            if(this.chartList.length==1){
                this.highlightChart = view;
                this.highlightChart.$('#chart-box').addClass('chartbor ');
                var chart_height = 350;
                this.$('#ad-chart-height').val(chart_height);
                view.chart_height = chart_height;
                this.chartContainerClick(view.chart_id);
            }
            this.listenTo(view, 'chartContainerClick', function (data) {
                self.chartContainerClick(data.chart_id);
            });
            this.listenTo(view, 'chartContainerClose', function (data) {
                self.chartContainerClose(data.chart_id);
            });
            if(!this.$('#chart-img').hasClass(' fade  ')){
                this.$('#chart-img').addClass(' fade  ');
            }
        },

        vdimEditBtnClick: function (e) {
            // diyBtn_xxx
            var VDIM_CODE = e.currentTarget.id.substring(7);
            for(var i=0;i<this.vdimList.length;i++){
                if(this.vdimList[i].VDIM_CODE == VDIM_CODE){
                    this.editVdimBtnClick(this.vdimList[i]);
                }
            }
        },

        vdimDelBtnClick: function (e) {
            // diyBtn2_xxx
            var VDIM_CODE = e.currentTarget.id.substring(8);
            for(var i=0;i<this.vdimList.length;i++){
                if(this.vdimList[i].VDIM_CODE == VDIM_CODE){
                    this.vdimList.splice(i,1);
                }
            }
            for(var i=0;i<this.treeDisplayData[0].children.length;i++){
                if(this.treeDisplayData[0].children[i].id == VDIM_CODE){
                    this.treeDisplayData[0].children.splice(i,1);
                    this.$dimIndiTree.tree('reloadData', this.treeDisplayData);
                    break;
                }
            }
            for(var i=0;i<this.selectedDimIndiList.length;i++){
                var selectedObj = this.selectedDimIndiList[i];
                if(VDIM_CODE==selectedObj.dragNode.id){
                    this.RemoveTag(selectedObj.tag_id);
                    this.selectedDimIndiList.splice(i,1);
                }
            }
        },

        // 点击进入虚拟维度配置窗口
        addVdimBtnClick: function () {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/VDimCfg'
            ], function (VDimCfgDialog) {
                var sData = {
                    dimList: self.treeDisplayData[0].children,
                    cachedDimCode: self.cachedDimCode,
                    "VDIM_CODE" : ""
                };
                var dialog = new VDimCfgDialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 515
                };
                self.vdimAddView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    self.treeDisplayData[0].children[self.treeDisplayData[0].children.length] = {
                        id: data.VDIM_CODE,
                        name: data.VDIM_NAME,
                        CLASS_TYPE: "00",
                        VDIM_FIELD: data.VDIM_FIELD,
                        VDIM_TYPE: data.VDIM_TYPE,
                        nodeType: 1,
                        tagType: 0,
                        isVdim: 0,
                        groupList: data.groupList,
                        iconSkin: 'ico_dim',
                        font:{'color':'orange'}
                    };
                    self.vdimList[self.vdimList.length] = data;
                    self.$dimIndiTree.tree('reloadData', self.treeDisplayData);
                    self.vdimAddView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.vdimAddView.close();
                });
            });
        },

        filterPluginBtnClick: function  () {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/FilterPluginCfg'
            ], function (Dialog) {
                var sData = {
                    dimList: self.treeDisplayData[0].children,
                    modelCode: self.modelCode
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 600
                };
                self.filterPluginCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'filterPluginOkEvent', function (data) {
                    self.filterPluginCfgView.close();
                    self.addFilterPluginToView(data);
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.filterPluginCfgView.close();
                });
            });
        },

        editVdimBtnClick: function (vdimObj) {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/VDimCfg'
            ], function (Dialog) {
                var sData = {
                    dimList: self.treeDisplayData[0].children,
                    cachedDimCode: self.cachedDimCode,
                    "VDIM_CODE" : vdimObj.VDIM_CODE,
                    "VDIM_NAME" : vdimObj.VDIM_NAME,
                    "VDIM_FIELD" : vdimObj.VDIM_FIELD,
                    "VDIM_TYPE" : vdimObj.VDIM_TYPE,
                    "NOGROUP_NAME" : vdimObj.NOGROUP_NAME,
                    "groupList" : vdimObj.groupList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 700,
                    height: 515
                };
                self.vdimEditView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    var treeNode = null;
                    for(var i=0;i<self.treeDisplayData[0].children.length;i++){
                        treeNode = self.treeDisplayData[0].children[i];
                        if(treeNode.id == data.VDIM_CODE){
                            treeNode = {
                                id: data.VDIM_CODE,
                                name: data.VDIM_NAME,
                                CLASS_TYPE: "00",
                                VDIM_FIELD: data.VDIM_FIELD,
                                VDIM_TYPE: data.VDIM_TYPE,
                                nodeType: 1,
                                tagType: 0,
                                isVdim: 0,
                                groupList: data.groupList,
                                iconSkin: 'ico_dim',
                                font:{'color':'orange'}
                            };
                            self.treeDisplayData[0].children[i] = treeNode;
                            break;
                        }
                    }
                    self.$dimIndiTree.tree('reloadData', self.treeDisplayData);
                    for(var i=0;i<self.vdimList.length;i++) {
                        if(self.vdimList[i].VDIM_CODE == data.VDIM_CODE) {
                            self.vdimList[i] = data;
                        }
                    }
                    // 修改虚拟列后进行先移除后添加的更新操作
                    var hasRemoveVDimTag = false;
                    for(var i=0;i<self.selectedDimIndiList.length;i++){
                        var selectedObj = self.selectedDimIndiList[i];
                        if(treeNode.id==selectedObj.dragNode.id){
                            self.RemoveTag(selectedObj.tag_id);
                            hasRemoveVDimTag = true;
                        }
                    }
                    if(hasRemoveVDimTag){
                        self.createDimTag(treeNode);
                        self.refreshDimIndiTree();
                    }
                    // 存在筛选器时需要刷新筛选器的label
                    for(var i=0;i<self.filterList.length;i++){
                        var filterObj = self.filterList[i];
                        if(filterObj.DIM_CODE == data.VDIM_CODE){
                            filterObj.DIM_NAME = data.VDIM_NAME;
                            self.$('#'+filterObj.panel_id+'-title').html(data.VDIM_NAME);
                            break;
                        }
                    }
                    self.vdimEditView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.vdimEditView.close();
                });
            });
        },

        // 图表点击事件
        chartContainerClick: function (chart_id) {
            console.log("chartContainerClick");
            for (var i = 0,l = this.chartList.length; i < l; i++) {
                var chartContainer = this.chartList[i];
                if (chartContainer.chart_id == chart_id) {
                    this.highlightChart = chartContainer;
                } else {
                    chartContainer.$('#chart-box').removeClass('chartbor ');
                }
            }
            if(this.highlightChart) {
                this.highlightChart.$('#chart-box').addClass('chartbor ');
                var className = this.mappingChartClass(this.highlightChart.chart_type);
                this.switchChartTypeBtnStatus(className);
                this.updateRightCfg(this.highlightChart);
                // 刷新颜色面板
                if(this.highlightChart.chart_type=="map" || this.highlightChart.chart_type=="scattermap"){
                    this.refreshMapColorPanel(this.highlightChart);
                }else {
                    this.refreshAxisColorPanel(this.highlightChart);
                }
            }
        },

        // 根据高亮的图表刷新配置的值
        updateRightCfg: function(chart) {
            var chartAttrCodeList = ['chart_height','titleAlign','gridTop','isPager','displayColList','condiFmtItemList',
                'isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom',
                'yMax','yMin','xAxis','yAxis',
                'primaryAxis','secondaryAxis',
                'secondaryMax','secondaryMin'
            ];
            this.updateChartCfg(chart.chart_type);
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
            if(chart.isPager){
                this.$('#ad-grid-pager-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-grid-pager-btn').removeAttr("checked");
            }
            // isMergeCell
            if(chart.isMergeCell == "false"){
                chart.isMergeCell = false;
            }
            if(chart.isMergeCell == "true"){
                chart.isMergeCell = true;
            }
            if(chart.isMergeCell){
                this.$('#ad-grid-mergecell-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-grid-mergecell-btn').removeAttr("checked");
            }
            // isCompareAnalysis
            if(chart.isCompareAnalysis == "false"){
                chart.isCompareAnalysis = false;
            }
            if(chart.isCompareAnalysis == "true"){
                chart.isCompareAnalysis = true;
            }
            if(chart.isCompareAnalysis){
                this.$('#ad-compareanalysis-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-compareanalysis-btn').removeAttr("checked");
            }
            //isExtendedAnalysis
            if(chart.isExtendedAnalysis == "false"){
                chart.isExtendedAnalysis = false;
            }
            if(chart.isExtendedAnalysis == "true"){
                chart.isExtendedAnalysis = true;
            }
            if(chart.isExtendedAnalysis){
                this.$('#ad-extendedanalysis-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-extendedanalysis-btn').removeAttr("checked");
            }
            // displayColList
            if(typeof(chart.displayColList) == 'string'){
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
                this.$('#ad-chartlabel-btn')[0]["checked"] = true;
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
                this.$('#ad-legend-btn')[0]["checked"] = true;
                this.$('#ad-legend-direction-sel').show();
                var className = this.mappingLegendDirectionClass(this.highlightChart.legendDirection);
                this.switchLegendDirectionBtnStatus(className);
            }else{
                this.$('#ad-legend-btn').removeAttr("checked");
                this.$('#ad-legend-direction-sel').hide();
            }
            //pieChartType
            if(!chart.pieChartType) {
                chart.pieChartType = "0";
            }
            this.$("input[name='ad-piechart-type']").removeAttr('checked');
            this.$("input[name='ad-piechart-type'][value='"+chart.pieChartType+"']")[0]['checked'] = true;
            // isZoom
            if(chart.isZoom == "false"){
                chart.isZoom = false;
            }
            if(chart.isZoom == "true"){
                chart.isZoom = true;
            }
            if(chart.isZoom){;
                this.$('#ad-zoomaxis-btn')[0]["checked"] = true;
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
            if(chart.isMapLabel){;
                this.$('#ad-maplabel-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-maplabel-btn').removeAttr("checked");
            }
            // isMapAreaName
            if(chart.isMapAreaName == "false"){
                chart.isMapAreaName = false;
            }
            if(chart.isMapAreaName == "true"){
                chart.isMapAreaName = true;
            }
            if(chart.isMapAreaName){;
                this.$('#ad-areaname-btn')[0]["checked"] = true;
            }else{
                this.$('#ad-areaname-btn').removeAttr("checked");
            }
            // isMapLegend
            if(chart.isMapLegend == "false"){
                chart.isMapLegend = false;
            }
            if(chart.isMapLegend == "true"){
                chart.isMapLegend = true;
            }
            if(chart.isMapLegend){;
                this.$('#ad-maplegend-btn')[0]["checked"] = true;
                this.$('#ad-maplegend-direction-sel').show();
                this.$('#ad-maplegend-direction-sel').val(chart.mapLegendDirection);
            }else {
                this.$('#ad-maplegend-btn').removeAttr("checked");
                this.$('#ad-maplegend-direction-sel').hide();
                this.$('#ad-maplegend-direction-sel').val(chart.mapLegendDirection);
            }
            this.$('#ad-yaxis-max').val(chart.yMax);
            this.$('#ad-yaxis-min').val(chart.yMin);
            this.$('#ad-yaxis2-max').val(chart.secondaryMax);
            this.$('#ad-yaxis2-min').val(chart.secondaryMin);
            this.$('#ad-yaxis-title').val(chart.yAxisTitle);
            this.$('#ad-yaxis2-title').val(chart.yAxis2Title);
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
            // pivot组件设置显示条目数属性
            if(chart.chart_type=="pivottable" && chart.sortCol!=""){
                this.$('#ad-pivottable-itemcount-btn')[0]["checked"] = true;
                this.$('#ad-pivottablecfg-sortfield').val(chart.sortCol);
                this.$('#ad-pivottablecfg-sorttype').val(chart.sortType);
                this.$('#ad-pivottablecfg-topn').val(chart.gridTop);
            }
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
            if (chart.chart_type == "scattermap"){
                this.setLabelSymbolSelected(chart);
            }
        },

        clearRightCfg: function() {
            this.$('#ad-chart-title-input').val('');
            this.$('#ad-chart-subtitle-input').val('');
            this.$('#ad-chart-height').val('');
            this.$('#ad-grid-pager-btn').removeAttr("checked");
            this.$('#ad-chartlabel-btn').attr("checked", true);
            this.$('#ad-zoomaxis-btn').removeAttr("checked");
            this.$('#ad-legend-btn').attr("checked", true);
            this.$('#ad-chart-top').val('');
            this.$('#ad-yaxis-max').val('');
            this.$('#ad-yaxis-min').val('');
            this.$('#ad-axiscolor-container').hide();
            this.$('#ad-mapcolor-container').hide();
            this.updateGridCfg();
        },

        switchChartTypeBtnStatus: function (activeClass) {
            this.$('[name="ad-charttype-btn"]').removeClass("active");
            this.$('[name="ad-charttype-btn"][class="'+activeClass+'"]').addClass("active");
        },

        switchLegendDirectionBtnStatus: function (activeClass) {
            this.$('[name="ad-legend-direction-btn"]').removeClass("active");
            this.$('[name="ad-legend-direction-btn"][class="'+activeClass+'"]').addClass("active");
        },

        chartContainerClose: function (chart_id) {
            console.log("chartContainerClose");
            for (var i = 0,l = this.chartList.length; i < l; i++) {
                var chartContainer = this.chartList[i];
                if (chartContainer.chart_id == chart_id) {
                    this.chartList.splice(i, 1);
                    this.$("div[name="+chart_id+"]").remove();
                    if(this.highlightChart.chart_id == chart_id && this.chartList.length>0){// 还存在高亮的图表
                        this.highlightChart = this.chartList[0];
                        this.highlightChart.$('#chart-box').addClass('chartbor ');
                        this.switchChartTypeBtnStatus(this.mappingChartClass(this.highlightChart.chart_type));
                        this.updateChartCfg(this.highlightChart.chart_type);
                        this.updateRightCfg(this.highlightChart);
                    }else if(this.highlightChart.chart_id == chart_id && this.chartList.length==0){// 已清空所有图表
                        this.highlightChart = null;
                        this.$('#chart-img').removeClass(' fade  ');
                        this.switchChartTypeBtnStatus('a1');
                        this.clearRightCfg();
                    }
                    break;
                }
            }
        },

        initTrendChart: function(divId, topic) {
            this.lineChart1 = echarts.init(this.$("#ad-chart-container")[0]);
            this.lineChart1.setOption(this.getColChartOption());
        },

        getColChartOption: function() {
            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data: ['指标一','指标二'],
                    x: "center",
                    y: "bottom"
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['1月','2月','3月','4月','5月','6月']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'指标一',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7]
                    },
                    {
                        name:'指标二',
                        type:'bar',
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7]
                    }
                ]
            };
            return option;
        },

        titleInput: function (e) {
            var titleText = e.currentTarget.value;
            if(this.highlightChart){
                this.highlightChart.chartTitle = titleText;
                this.highlightChart.updateTitle();
            }
        },

        subtitleInput: function (e) {
            var subtitleText = e.currentTarget.value;
            if(this.highlightChart){
                this.highlightChart.chartSubTitle = subtitleText;
                this.highlightChart.updateTitle();
            }
        },

        // 切换图表类型
        switchChartType: function (e) {
            var chartType = this.mappingChartType(e.currentTarget.className);
            if(this.highlightChart && (chartType && this.highlightChart.chart_type!=chartType)){
                this.highlightChart.chart_type = chartType;
                this.highlightChart.pivotUIOptions = "";
                this.highlightChart.groupList = [];
                this.updateChartCfg(chartType);
                this.refreshChart(this.highlightChart);
                var className = this.mappingChartClass(this.highlightChart.chart_type);
                this.switchChartTypeBtnStatus(className);
                this.updateRightCfg(this.highlightChart);
            }
        },

        // 饼图切换饼图样式
        switchLegendDirection: function (e) {
            var className = e.currentTarget.className;
            var legendDirection;
            switch(className) {
                case "a22" :
                    legendDirection = "vertical-left-center";
                    break;
                case "a23" :
                    legendDirection = "vertical-right-center";
                    break;
                case "a24" :
                    legendDirection = "horizontal-center-top";
                    break;
                case "a25" :
                    legendDirection = "horizontal-center-bottom";
                    break;
            }
            if(this.highlightChart && (legendDirection && this.highlightChart.legendDirection!=legendDirection)){
                this.highlightChart.legendDirection = legendDirection;
                this.refreshChart(this.highlightChart);
                this.$('[name="ad-legend-direction-btn"]').removeClass("active");
                this.$('[name="ad-legend-direction-btn"][class="'+className+'"]').addClass("active");
            }
        },

        switchMapLegendDirection: function (e) {
            var className = e.currentTarget.className;
            var mapLegendDirection;
            switch(className) {
                case "a22" :
                    mapLegendDirection = "vertical-left-center";
                    break;
                case "a23" :
                    mapLegendDirection = "vertical-right-center";
                    break;
                case "a24" :
                    mapLegendDirection = "horizontal-center-top";
                    break;
                case "a25" :
                    mapLegendDirection = "horizontal-center-bottom";
                    break;
            }
            if(this.highlightChart && (mapLegendDirection && this.highlightChart.mapLegendDirection!=mapLegendDirection)){
                this.highlightChart.mapLegendDirection = mapLegendDirection;
                this.refreshChart(this.highlightChart);
                this.$('[name="ad-maplegend-direction-btn"]').removeClass("active");
                this.$('[name="ad-maplegend-direction-btn"][class="'+className+'"]').addClass("active");
            }
        },

        // 散点地图切换标签符号
        switchLabelSymbol: function (e) {
            var className = e.currentTarget.className;
            var labelSymbol;
            switch(e.currentTarget.className) {
                case "a18" :
                    labelSymbol = "rectangle";
                    break;
                case "a19" :
                    labelSymbol = "circle";
                    break;
                case "a21" :
                    labelSymbol = "triangle";
                    break;
                case "a20" :
                    labelSymbol = "diamond";
                    break;
            }
            if(this.highlightChart && (labelSymbol && this.highlightChart.labelSymbol!=labelSymbol)){
                this.highlightChart.labelSymbol = labelSymbol;
                this.refreshChart(this.highlightChart);
                this.$('[name="ad-labelsymbol"]').removeClass("active");
                this.$('[name="ad-labelsymbol"][class="'+className+'"]').addClass("active");
            }
        },

        setLabelSymbolSelected: function (chart) {
            var labelSymbol = chart.labelSymbol;
            var className;
            switch(labelSymbol) {
                case "rectangle" :
                    className = "a18";
                    break;
                case "circle" :
                    className = "a19";
                    break;
                case "triangle" :
                    className = "a21";
                    break;
                case "diamond" :
                    className = "a20";
                    break;
            }
            this.$('[name="ad-labelsymbol"]').removeClass("active");
            this.$('[name="ad-labelsymbol"][class="'+className+'"]').addClass("active");
        },

        mappingChartType: function (className) {
            var chartType;
            switch(className){
                case "a1" : chartType = "grid";break;
                case "a2" : chartType = "pie";break;
                case "a3" : chartType = "line";break;
                case "a12" : chartType = "column";break;
                case "a5" : chartType = "area";break;
                case "a6" : chartType = "bar";break;
                case "a7" : chartType = "radar";break;
                case "a8" : chartType = "tree";break;
                case "a9" : chartType = "duijibar";break;
                case "a10" : chartType = "scatter";break;
                case "a11" : chartType = "doubleaxis";break;
                case "a4" : chartType = "duijicolumn";break;
                case "a13" : chartType = "duijiarea";break;
                case "a14" : chartType = "pivottable";break;
                case "a15" : chartType = "kpicard";break;
                case "a16" : chartType = "map";break;
                case "a17" : chartType = "scattermap";break;
            }
            return chartType;
        },

        mappingLegendDirectionClass: function (legendDirection) {
            var className;
            switch (legendDirection) {
                case "vertical-left-center" : className = "a2";break;
                case "vertical-right-center" : className = "a23";break;
                case "horizontal-center-top" : className = "a24";break;
                case "horizontal-center-bottom" : className = "a25";break;
            }
            return className;
        },

        mappingChartClass: function (chartType) {
            var className;
            switch (chartType) {
                case "grid" : className = "a1";break;
                case "pie" : className = "a2";break;
                case "line" : className = "a3";break;
                case "column" : className = "a12";break;
                case "area" : className = "a5";break;
                case "bar" : className = "a6";break;
                case "radar" : className = "a7";break;
                case "tree" : className = "a8";break;
                case "duijibar" : className = "a9";break;
                case "scatter" : className = "a10";break;
                case "doubleaxis" : className = "a11";break;
                case "duijicolumn" : className = "a4";break;
                case "duijiarea" : className = "a13";break;
                case "pivottable" : className = "a14";break;
                case "kpicard" : className = "a15";break;
                case "map" : className = "a16";break;
                case "scattermap" : className = "a17";break;
            }
            return className;
        },

        refreshChart: function (chart) {
            var param = this.getChartCfgParam(chart);
            chart.$("#ad-chart-container").show();
            chart.$("#ad-chart-container-map").hide();
            switch(chart.chart_type){
                case "grid" :
                    chart.updateGridCfg(param);// 刷新表格本身
                    chart.isCompareAnalysis = false;
                    chart.isExtendedAnalysis = false;
                    break;
                case "pie" :
                    chart.updatePieCfg(param);
                    chart.isCompareAnalysis = false;
                    break;
                case "line" :
                    chart.updateLineCfg(param);
                    break;
                case "column" :
                    chart.updateColumnCfg(param);
                    break;
                case "area" : ;
                    chart.updateAreaCfg(param);
                    break;
                case "bar" : ;
                    chart.updateBarCfg(param);
                    break;
                case "radar" : ;
                    chart.updateRadarCfg(param);
                    chart.isCompareAnalysis = false;
                    chart.isExtendedAnalysis = false;
                    break;
                case "tree" : ;
                    chart.updateTreeCfg(param);// 刷新树图
                    break;
                case "duijibar" : ;
                    chart.updateDuijiBarCfg(param);
                    break;
                case "scatter" :
                    chart.updateScatterCfg(param);
                    chart.isCompareAnalysis = false;
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
                    chart.isExtendedAnalysis = false;
                    break;
                case "kpicard" :
                    chart.updateKpiCardCfg(param);
                    chart.isExtendedAnalysis = false;
                    break;
                case "map" :
                    chart.updateMapCfg(param);
                    break;
                case "scattermap" :
                    chart.updateScatterMapCfg(param);
                    break;
            }
            chart.updateGridTop();
            // 更新列头设置
            chart.updateGridColState(chart.displayColList, chart.drillColList);
            // 更新条件格式
            chart.updateGridByCondiFmt(chart.condiFmtItemList);
            for(var i=0;i<chart.condiFmtItemList.length;i++){
                chart.condiFmtItemList[i] = JSON.stringify(chart.condiFmtItemList[i]);
            }
            // 更新辅助线配置
            chart.updateMarkline(chart.marklineList);
            for(var i=0;i<chart.marklineList.length;i++){
                chart.marklineList[i] = JSON.stringify(chart.marklineList[i]);
            }
            // 刷新颜色面板
            if(chart.chart_type=="map" || chart.chart_type=="scattermap"){
                this.refreshMapColorPanel(chart);
            }else{
                this.refreshAxisColorPanel(chart);
            }
        },

        refreshAxisColorPanel: function(chart) {
            var self = this;
            this.$('#ad-axiscolor-list').empty();
            for(var i=0;i<chart.axisColorCfgYaxisList.length;i++){
                var colorValue = chart.axisColorCfgYaxisList[i];
                var fieldValue;
                fish.forEach(chart.colModel, function(col){
                    if(col.index == chart.axisCfgYaxisList[i]){
                        fieldValue = col.label;
                    }
                });
                var htmlText = '<li class="series-color-item nowrap">'
                    + '<i class="color-thumb-sm" style="background: '+colorValue+'"></i>'
                    + '<span title="'+fieldValue+'">'+fieldValue+'</span></li>';
                self.$('#ad-axiscolor-list').append(htmlText);
            };
        },

        refreshMapColorPanel: function(chart) {
            var mapColorList = chart.mapColorCfg.split(",");
            var kpi_index = chart.axisCfgYaxisList[0];
            var kpi_name;
            fish.forEach(chart.colModel, function(col){
                if(col.index == kpi_index){
                    kpi_name = col.label;
                }
            });
            this.$('#ad-map-color-title').attr('title', kpi_name);
            this.$('#ad-map-color-title').text(kpi_name);
            this.$('#ad-mapcolor-lineargradient_1').attr("stop-color", mapColorList[1]);
            this.$('#ad-mapcolor-lineargradient_2').attr("stop-color", mapColorList[1]);
            this.$('#ad-mapcolor-lineargradient_3').attr("stop-color", mapColorList[0]);
        },

        updateChartCfg: function (chartType) {
            this.$("#ad-axis-label").show();
            this.$("#ad-axis2-label").show();
            this.$("#ad-axistitle-container").show();
            this.$("#ad-xaxis-label").hide();
            this.$("#ad-yaxis-label").hide();
            this.$("#ad-marklinecfg-container").show();
            this.$("#ad-marklinecfg-axis2-container").hide();
            this.$("#ad-compareanalysis").show();// 饼图、雷达图、散点图无对比分析功能
            this.$("#ad-extendedanalysis").show();// 雷达图 表格 透视表 指标卡无扩展分析功能
            this.$('#ad-pivottablecfg-element').hide();
            this.$('#ad-axiscolor-container').hide();
            this.$('#ad-mapcolor-container').hide();
            this.$('#ad-kpicardcfg-element').hide();
            this.$('#ad-mapcfg-element').hide();
            this.$('#ad-mapcfg-labelsymbol').hide();
            this.$('#ad-piechart-type-div').hide();
            switch(chartType){
                case "grid" :
                    this.updateGridCfg(); // 刷新表格配置项
                    break;
                case "pie" :
                    this.updatePieCfg(); ;
                    break;
                case "line" :
                    this.updateLineCfg();
                    break;
                case "column" :
                    this.updateColumnCfg();
                    break;
                case "area" : ;
                    this.updateAreaCfg();
                    break;
                case "bar" : ;
                    this.updateBarCfg();
                    break;
                case "radar" : ;
                    this.updateRadarCfg();
                    break;
                case "tree" : ;
                    this.updateTreeCfg();
                    break;
                case "duijibar" : ;
                    this.updateBarCfg();
                    break;
                case "scatter" :
                    this.updateScatterCfg();
                    break;
                case "doubleaxis" :
                    this.updateLineCfg();// updateDoubleAxisCfg
                    break;
                case "duijicolumn" :
                    this.updateColumnCfg();
                    break;
                case "duijiarea" :
                    this.updateAreaCfg();
                    break;
                case "pivottable" :
                    this.updatePivotCfg();
                    break;
                case "kpicard" :
                    this.updateKpiCardCfg();
                    break;
                case "map" :
                    this.updateMapCfg();
                    break;
                case "scattermap" :
                    this.updateScatterMapCfg();
                    break;
            }
        },

        updateGridCfg: function () {
            this.$('#ad-chartcfg-element').hide();
            this.$('#ad-gridcfg-element').show();
            this.$("#ad-marklinecfg-container").hide();
            this.$("#ad-compareanalysis").hide();
            this.$("#ad-extendedanalysis").hide();
        },

        updatePieCfg: function () {
            this.$('#ad-chartcfg-element').show();
            this.$('#ad-piechart-type-div').show();
            this.$('#ad-axis-container2').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$('#ad-zoomaxis-container').hide();
            this.$('#ad-xaxis-container').hide();
            this.$('#ad-yaxis-container').hide();
            this.$('#ad-axismax-container').hide();
            this.$('#ad-axismin-container').hide();
            this.$("#ad-marklinecfg-container").hide();
            this.$('#ad-axis-label').hide();
            this.$('#ad-axistitle-container').hide();
            this.$("#ad-compareanalysis").hide();
        },

        updateKpiCardCfg: function () {
            this.$('#ad-chartcfg-element').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$("#ad-compareanalysis").hide();
            this.$("#ad-extendedanalysis").hide();
            this.$('#ad-kpicardcfg-element').show();
        },

        updateMapCfg: function () {
            this.$('#ad-chartcfg-element').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$("#ad-compareanalysis").hide();
            this.$("#ad-extendedanalysis").hide();
            this.$('#ad-kpicardcfg-element').hide();
            this.$('#ad-mapcfg-element').show();
            this.$('#ad-mapcolor-container').show();
        },

        updateScatterMapCfg: function () {
            this.$('#ad-chartcfg-element').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$("#ad-compareanalysis").hide();
            this.$("#ad-extendedanalysis").hide();
            this.$('#ad-kpicardcfg-element').hide();
            this.$('#ad-mapcfg-element').show();
            this.$('#ad-mapcfg-labelsymbol').show();
            this.$('#ad-mapcolor-container').show();
        },

        updateColumnCfg: function () {
            this.$('#ad-axiscolor-container').show();
            if(this.highlightChart && this.highlightChart.secondAxisCfgShow){
                this.updateDoubleAxisCfg();
            }else{
                this.$('#ad-chartcfg-element').show();
                this.$('#ad-axis-container2').hide();
                this.$('#ad-gridcfg-element').hide();
                this.$('#ad-zoomaxis-container').show();
                this.$('#ad-xaxis-container').hide();
                this.$('#ad-yaxis-container').hide();
                this.$('#ad-axismax-container').show();
                this.$('#ad-axismin-container').show();
            }
        },

        updateLineCfg: function () {
            this.$('#ad-axiscolor-container').show();
            if(this.highlightChart && this.highlightChart.secondAxisCfgShow){
                this.updateDoubleAxisCfg();
            }else{
                this.$('#ad-chartcfg-element').show();
                this.$('#ad-axis-container2').hide();
                this.$('#ad-gridcfg-element').hide();
                this.$('#ad-zoomaxis-container').show();
                this.$('#ad-xaxis-container').hide();
                this.$('#ad-yaxis-container').hide();
                this.$('#ad-axismax-container').show();
                this.$('#ad-axismin-container').show();
            }
        },

        updateDoubleAxisCfg: function () {
            this.$('#ad-chartcfg-element').show();
            this.$('#ad-gridcfg-element').hide();
            this.$('#ad-zoomaxis-container').show();
            this.$('#ad-xaxis-container').hide();
            this.$('#ad-yaxis-container').hide();
            this.$('#ad-axismax-container').show();
            this.$('#ad-axismin-container').show();
            this.$('#ad-axis-container2').show();
            //this.$('#ad-marklinecfg-axis2-container').hide();
        },

        updateAreaCfg: function () {
            this.$('#ad-axiscolor-container').show();
            if(this.highlightChart && this.highlightChart.secondAxisCfgShow){
                this.updateDoubleAxisCfg();
            }else{
                this.$('#ad-chartcfg-element').show();
                this.$('#ad-axis-container2').hide();
                this.$('#ad-gridcfg-element').hide();
                this.$('#ad-zoomaxis-container').show();
                this.$('#ad-xaxis-container').hide();
                this.$('#ad-yaxis-container').hide();
                this.$('#ad-axismax-container').show();
                this.$('#ad-axismin-container').show();
            }
        },

        updatePivotCfg: function () {
            var self = this;
            this.$('#ad-chartcfg-element').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$('#ad-compareanalysis').hide();
            this.$("#ad-extendedanalysis").hide();
            this.$('#ad-pivottablecfg-element').show();
            self.$('#ad-pivottablecfg-sortfield').empty();
            for(var i=0;i<this.selectedDimIndiList.length;i++){
                var dimIndiObj = this.selectedDimIndiList[i];
                var id;
                var name = dimIndiObj.tagAlias==""?dimIndiObj.tagName:dimIndiObj.tagAlias;
                if(dimIndiObj.dragNode.tagType=="0"){
                    id = "DIM_"+i;
                }else {
                    id = "KPI_" + i;
                }
                var htmlText = "<option value='"+id+"'>"+name+"</option>";
                self.$('#ad-pivottablecfg-sortfield').append(htmlText);
            };
        },

        // 条形图不同之处：隐藏缩略轴
        updateBarCfg: function () {
            this.$('#ad-axiscolor-container').show();
            if(this.highlightChart && this.highlightChart.secondAxisCfgShow){
                this.updateDoubleAxisCfg();
                this.$('#ad-zoomaxis-container').hide();
            }else {
                this.$('#ad-chartcfg-element').show();
                this.$('#ad-axis-container2').hide();
                this.$('#ad-gridcfg-element').hide();
                this.$('#ad-zoomaxis-container').hide();
                this.$('#ad-xaxis-container').hide();
                this.$('#ad-yaxis-container').hide();
                this.$('#ad-axismax-container').show();
                this.$('#ad-axismin-container').show();
            }
        },

        updateRadarCfg: function () {
            this.$('#ad-chartcfg-element').show();
            this.$('#ad-axis-container2').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$('#ad-zoomaxis-container').hide();
            this.$('#ad-xaxis-container').hide();
            this.$('#ad-yaxis-container').hide();
            this.$('#ad-axismax-container').hide();
            this.$('#ad-axismin-container').hide();
            this.$("#ad-marklinecfg-container").hide();
            this.$("#ad-compareanalysis").hide();
            this.$("#ad-extendedanalysis").hide();
        },

        updateTreeCfg: function () {
            this.$('#ad-chartcfg-element').show();
            this.$('#ad-axis-container2').hide();
            this.$('#ad-gridcfg-element').hide();
            this.$("#ad-marklinecfg-container").hide();
            this.$("#ad-extendedanalysis").hide();
        },

        updateScatterCfg: function () {
            this.updateDoubleAxisCfg();
            this.$("#ad-axis-label").hide();
            this.$("#ad-axis2-label").hide();
            this.$("#ad-xaxis-label").show();
            this.$("#ad-yaxis-label").show();
            this.$("#ad-marklinecfg-container").hide();
            this.$("#ad-marklinecfg-axis2-container").hide();
            this.$("#ad-compareanalysis").hide();
        },

        chartCfgChange: function () {
            if(this.highlightChart){
                this.refreshChart(this.highlightChart);
            }
        },

        pivotTableCfgChange: function () {
            if(this.$('#ad-pivottable-itemcount-btn').is(':checked')){
                this.highlightChart.gridTop = this.$('#ad-pivottablecfg-topn').val();
                this.highlightChart.sortCol = this.$('#ad-pivottablecfg-sortfield').val();
                this.highlightChart.sortType = this.$('#ad-pivottablecfg-sorttype').val();
                this.highlightChart.updateSimuDp(true);
            }else{
                this.highlightChart.gridTop = "";
                this.highlightChart.sortCol = "";
                this.highlightChart.sortType = "";
                this.highlightChart.updateSimuDp(true);
            }
            this.refreshChart(this.highlightChart);
        },

        getChartCfgParam: function (chart) {
            chart.isPager = this.$('#ad-grid-pager-btn').is(':checked');
            chart.isMergeCell = this.$('#ad-grid-mergecell-btn').is(':checked');
            chart.isLabel = this.$('#ad-chartlabel-btn').is(':checked');
            chart.isLegend = this.$('#ad-legend-btn').is(':checked');
            chart.pieChartType = this.$("input[name='ad-piechart-type']:checked").val();
            chart.isZoom = this.$('#ad-zoomaxis-btn').is(':checked');
            chart.yMax = this.$('#ad-yaxis-max').val();
            chart.yMin = this.$('#ad-yaxis-min').val();
            chart.xAxis = this.$('#ad-xaxis-select').val();
            chart.yAxis = this.$('#ad-yaxis-select').val();
            chart.secondaryMax = this.$('#ad-yaxis2-max').val();
            chart.secondaryMin = this.$('#ad-yaxis2-min').val();
            chart.yAxisTitle = this.$('#ad-yaxis-title').val();
            chart.yAxis2Title = this.$('#ad-yaxis2-title').val();
            chart.isCompareAnalysis = this.$('#ad-compareanalysis-btn').is(':checked');
            chart.isExtendedAnalysis = this.$('#ad-extendedanalysis-btn').is(':checked');
            chart.isMapLabel = this.$('#ad-maplabel-btn').is(':checked');
            chart.isMapAreaName = this.$('#ad-areaname-btn').is(':checked');
            chart.isMapLegend = this.$('#ad-maplegend-btn').is(':checked');
            return {
                chart_label: this.$('#ad-chartlabel-btn').is(':checked'),
                legend: this.$('#ad-legend-btn').is(':checked'),
                pager: this.$('#ad-grid-pager-btn').is(':checked'),
                mergeCell: this.$('#ad-grid-mergecell-btn').is(':checked'),
                chart_top: chart.gridTop,
                dataZoom: this.$('#ad-zoomaxis-btn').is(':checked'),
                yaxis_max: this.$('#ad-yaxis-max').val(),
                yaxis_min: this.$('#ad-yaxis-min').val(),
                yaxis_title: this.$('#ad-yaxis-title').val(),
                yaxis2_title: this.$('#ad-yaxis2-title').val(),
                yaxis2_max: this.$('#ad-yaxis2-max').val(),
                yaxis2_min: this.$('#ad-yaxis2-min').val(),
                xaxis_field: this.$('#ad-xaxis-select').val(),
                yaxis_field: this.$('#ad-yaxis-select').val()
            }
        },

        modelSelectChange: function () {
            var model_code = this.$('#ad-model-select').val();
            for(var i=0; i<this.modelList.length; i++){
                if(this.modelList[i].MODEL_CODE==model_code){
                    this.refreshGranuList(this.modelList[i]);
                    break;
                }
            }
            this.refreshDimIndiNameByModel();
        },

        refreshDimIndiNameByModel: function () {
            var self = this;
            var model_code = this.$('#ad-model-select').val();
            fish.forEach(this.selectedDimIndiList, function(dimIndiView){
                var tagNode = dimIndiView.dragNode;
                if(tagNode.tagType=="1"){
                    var id = dimIndiView.dragNode.id;
                    var nameInModel = self.cachedIndi.get(model_code+"-"+id);
                    if(nameInModel!=dimIndiView.formatObj.tagName){
                        dimIndiView.formatObj.tagName = nameInModel;
                        dimIndiView.tagName = nameInModel;
                        tagNode.name = nameInModel;
                        if(dimIndiView.formatObj.tagAlias==""){
                            dimIndiView.refreshTag(dimIndiView.tag_id);
                        }
                    }
                }else if(tagNode.tagType=="0"){
                    var id = dimIndiView.dragNode.id;
                    var nameInModel = self.cachedDim.get(model_code+"-"+id);
                    if(nameInModel && nameInModel!=dimIndiView.tagName){
                        dimIndiView.tagName = nameInModel;
                        tagNode.name = nameInModel;
                        if(dimIndiView.tagAlias==""){
                            dimIndiView.refreshTag(dimIndiView.tag_id);
                        }
                    }
                }
            });
        },

        // 切换标题及副标题对齐方式
        switchTitleAlign: function (e) {
            if(this.highlightChart) {
                var btnId = e.currentTarget.id;
                var alignType = btnId.substring(14);
                var titleClass = "";
                var subTitleClass = "";
                switch (alignType) {
                    case "left":
                        titleClass = "text-left";
                        subTitleClass = "text-left text-muted";
                        break;
                    case "center":
                        titleClass = "text-center";
                        subTitleClass = "text-center text-muted";
                        break;
                    case "right":
                        titleClass = "text-right";
                        subTitleClass = "text-right text-muted";
                        break;
                }
                //this.$('#ad-chart-title').attr("class", titleClass);
                //this.$('#ad-chart-subtitle').attr("class", subTitleClass);
                //
                this.$('#ad-titlealign-left').removeClass('active');
                this.$('#ad-titlealign-center').removeClass('active');
                this.$('#ad-titlealign-right').removeClass('active');
                this.$('#' + btnId).addClass('active');
                this.highlightChart.titleAlign = alignType;
                this.highlightChart.updateTitle();
            }
        },

        // 保存主题
        gotoTopicSave: function () {
            var isValid = this.validateTopic();
            var dimIndiList = [];
            var dimIndiAttrList = [];
            var dimAttrCodeList = ['tagAlias','calculateFormat','tagDesc','sortType'];
            var indiAttrCodeList = ['tagAlias','tagDesc','agType','sortType','displayType','precision','isThousandDisplay','showUnit','calculateFormat'];
            for(var i=0; i<this.selectedDimIndiList.length; i++){
                var nodeObj = this.selectedDimIndiList[i].dragNode;
                var tagObj = this.selectedDimIndiList[i];
                var colType = "0" + nodeObj.tagType;
                // 虚拟维度
                for(var j=0;j<this.vdimList.length;j++){
                    if(nodeObj.id==this.vdimList[j].VDIM_CODE){
                        colType = "02";
                        break;
                    }
                }
                // 全局虚拟维度
                for(var j=0;j<this.globalVdimList.length;j++){
                    if(nodeObj.id==this.globalVdimList[j].VDIM_CODE){
                        colType = "02";
                        break;
                    }
                }
                dimIndiList[dimIndiList.length] = {
                    "COL_TYPE": colType,
                    "COL_NO": nodeObj.id,
                    "COL_SEQ": i,
                    "GL_DIMKPI": 1
                };
                //
                if(colType=="00" || colType=="02") {
                    for (var j = 0; j < dimAttrCodeList.length; j++) {
                        dimIndiAttrList[dimIndiAttrList.length] = {
                            "COL_NO": nodeObj.id,
                            "COL_SEQ": i,
                            "COL_TYPE": colType,
                            "ATTR_CODE": dimAttrCodeList[j],
                            "ATTR_VALUE": tagObj[dimAttrCodeList[j]],
                            "ATTR_SEQ": 0
                        };
                    }
                }
                if(colType=="01") {
                    for (var j = 0; j < indiAttrCodeList.length; j++) {
                        dimIndiAttrList[dimIndiAttrList.length] = {
                            "COL_NO": nodeObj.id,
                            "COL_SEQ": i,
                            "COL_TYPE": colType,
                            "ATTR_CODE": indiAttrCodeList[j],
                            "ATTR_VALUE": tagObj.formatObj[indiAttrCodeList[j]],
                            "ATTR_SEQ": 0
                        };
                    }
                }
            };
            // 过滤器条件(不包括过滤器插件)
            var topicFilterList = [];
            var topicFilterOperList = [];
            for(var i=0; i<this.filterList.length; i++){
                var filterObj = this.filterList[i];
                if(filterObj.FILTER_TYPE=="3"){
                    continue;
                }
                var FIELD_NO = filterObj.DIM_CODE;
                var FIELD_TYPE = filterObj.dragNode.tagType;
                if(filterObj.dragNode.VDIM_FIELD){
                    FIELD_TYPE = 2;
                }
                topicFilterList[topicFilterList.length] = {
                    "FILTER_TYPE": 0,
                    "FILTER_OBJ_NO": '',
                    "FIELD_NO": FIELD_NO,
                    "FIELD_TYPE": FIELD_TYPE,
                    "FIELD_FILTER_TYPE": filterObj.FILTER_TYPE,
                    "VIEW_TYPE": filterObj.VIEW_TYPE
                };
                for(var j=0; j<filterObj.filterOperList.length; j++) {
                    var operObj = filterObj.filterOperList[j];
                    var operValue = operObj.value;
                    if(filterObj.dragNode.VDIM_FIELD){
                        for(var k=0;k<this.vdimList.length;k++){
                            if(filterObj.DIM_CODE==this.vdimList[k].VDIM_CODE){
                                var operValueList = operValue?operValue.split(","):[];
                                for(var l=0;l<operValueList.length;l++) {
                                    if(operValueList[l]=="-1"){
                                        operValueList[l] = this.vdimList[k].NOGROUP_NAME;
                                    }else {
                                        for (var m = 0; m < this.vdimList[k].groupList.length; m++) {
                                            var group = this.vdimList[k].groupList[m];
                                            if (operValueList[l] == group.id) {
                                                operValueList[l] = group.name;
                                                break;
                                            }
                                        }
                                    }
                                }
                                //
                                operValue = operValueList.join(",");
                            }
                        }
                    }
                    topicFilterOperList[topicFilterOperList.length] = {
                        "FIELD_NO": FIELD_NO,
                        "OPER_NO": 0,
                        "OPER_TYPE": operObj.type,
                        "PARAM_VALUE": operValue,
                        "OPER_ORDER": 0,
                        "FILTER_VALUE": ''
                    }
                }
            }
            // 过滤器插件
            var topicFilterPluginList = [];
            for(var i=0; i<this.filterList.length; i++) {
                var filterObj = this.filterList[i];
                if (filterObj.FILTER_TYPE == "3") {
                    topicFilterPluginList[topicFilterPluginList.length] = {
                        "FILTER_TYPE": filterObj.FILTER_TYPE,
                        "FIELD_NO": filterObj.opt.data.PLUGIN_NO,
                        "FIELD_TYPE": "3",
                        "FILTER_NAME": filterObj.opt.data.FILTER_NAME,
                        "PLUGIN_PARAM": JSON.stringify(filterObj.opt.data.PLUGIN_PARAM)
                    };
                }
            }
            // 图表信息
            var topicChartList = [];
            var topicChartAttrList = [];
            var chartAttrCodeList = ['chart_height','titleAlign','gridTop',
                'sortCol','sortType','selectableColList','drillColList','displayColList',
                'xAxisLabelRotate','xAxisLabelInterval','isXAxisLabelRotate','isXAxisLabelInterval','xAxisLabelHeight','isXAxisLabelHeight',
                'axisCfgXaxis','axisCfgYaxisList','axisColorCfgYaxisList','axisCfgYaxisTypeList','axisCfgSeries',
                'isPager','isMergeCell','isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom','isCompareAnalysis','isExtendedAnalysis',
                'AREAMAP_NO','isMapLabel','isMapAreaName','isMapLegend','mapColorCfg',"labelSymbol",
                'yMax','yMin','xAxis','yAxis',
                'yAxisTitle','yAxis2Title','groupList',
                'primaryAxis','secondaryAxis', 'secondaryMax','secondaryMin','condiFmtItemList','marklineList'
            ];
            for(var i=0; i<this.chartList.length; i++) {
                var chartObj = this.chartList[i];
                topicChartList[topicChartList.length] = {
                    "ECHART_NO": i,
                    "ECHART_NAME": chartObj.chartTitle,
                    "TOPIC_SUB_NAME": chartObj.chartSubTitle,
                    "ECHART_TYPE": chartObj.chart_type,
                    "ECHART_SEQ": i
                };
                // 图表属性
                var j = 0;
                for (; j < chartAttrCodeList.length; j++) {
                    var attrValue = chartObj[chartAttrCodeList[j]];
                    if (chartAttrCodeList[j] == "axisCfgYaxisList" || chartAttrCodeList[j] == "axisCfgYaxisTypeList"
                        || chartAttrCodeList[j] == "displayColList" || chartAttrCodeList[j] == "axisColorCfgYaxisList") {
                        attrValue = attrValue.toString();
                    }
                    if(chartAttrCodeList[j] == "displayColList" && chartObj.chart_type!="grid"){
                        continue;
                    }
                    topicChartAttrList[topicChartAttrList.length] = {
                        "ECHART_NO": i,
                        "ATTR_NO": j,
                        "ATTR_CODE": chartAttrCodeList[j],
                        "ATTR_VALUE": attrValue,
                        "ATTR_SEQ": j
                    }
                }
                // 特别处理条件格式属性
                var listLength = topicChartAttrList.length;
                var condiFmtItemList = topicChartAttrList[listLength - 2].ATTR_VALUE;
                var marklineList = topicChartAttrList[listLength - 1].ATTR_VALUE;
                if (condiFmtItemList.length > 0) {
                    var condiFmtList = condiFmtItemList.concat();
                    for (var k = 0; k < condiFmtList.length; k++) {
                        var listIndex = listLength - 2 + k;
                        var condiFmtStr = condiFmtList[k];
                        if(typeof(condiFmtList[k])=="object"){
                            condiFmtStr = JSON.stringify(condiFmtStr);
                        }
                        topicChartAttrList[listIndex] = {
                            "ECHART_NO": i,
                            "ATTR_NO": listIndex,
                            "ATTR_CODE": 'condiFmtItemList',
                            "ATTR_VALUE": condiFmtStr,
                            "ATTR_SEQ": listIndex
                        }
                    }
                }
                // 辅助线属性
                listLength = topicChartAttrList.length;
                if (marklineList.length > 0) {
                    marklineList = marklineList.concat();
                    for (var k = 0; k < marklineList.length; k++) {
                        var listIndex = listLength - 1 + k;
                        topicChartAttrList[listIndex] = {
                            "ECHART_NO": i,
                            "ATTR_NO": listIndex,
                            "ATTR_CODE": 'marklineList',
                            "ATTR_VALUE": marklineList[k],
                            "ATTR_SEQ": listIndex
                        }
                    }
                }
                // pivottable配置状态属性
                var pivotUIOptions = chartObj.$('#ad-pivottable-container').data("pivotUIOptions");
                pivotUIOptions = JSON.stringify(pivotUIOptions);
                if (chartObj.chart_type == "pivottable" && pivotUIOptions) {
                    topicChartAttrList[topicChartAttrList.length] = {
                        "ECHART_NO": i,
                        "ATTR_NO": j,
                        "ATTR_CODE": "pivotUIOptions",
                        "ATTR_VALUE": pivotUIOptions,
                        "ATTR_SEQ": j
                    }
                } else {
                    topicChartAttrList[topicChartAttrList.length] = {
                        "ECHART_NO": i,
                        "ATTR_NO": j,
                        "ATTR_CODE": "pivotUIOptions",
                        "ATTR_VALUE": "",
                        "ATTR_SEQ": j
                    }
                }
            }
            // 虚拟维度属性
            // COL_TYPE
            // COL_SEQ
            // COL_NO
            // ATTR_CODE
            // ATTR_SEQ
            // SEQ
            // PARAM_VALUE
            // PARAM_SEQ
            var vdimAttrList = [];
            var vdimGroupAttrList = [];
            var vdimAttrCodeList = [
                'VDIM_NAME', 'VDIM_FIELD','VDIM_TYPE','NOGROUP_NAME'
            ];
            for(var i=0; i<this.vdimList.length; i++){
                var vdimObj = this.vdimList[i];
                var isUsedInTopic = false;
                fish.forEach(dimIndiList, function(dimIndiObj){
                    if (dimIndiObj.COL_NO == vdimObj.VDIM_CODE){
                        isUsedInTopic = true;
                    }
                });
                fish.forEach(topicFilterList, function(topicFilterObj){
                    if (topicFilterObj.FIELD_NO == vdimObj.VDIM_CODE){
                        isUsedInTopic = true;
                    }
                });
                if(!isUsedInTopic){
                    //this.vdimList.splice(i--,1);
                    continue;
                }
                var COL_TYPE = "02";
                var COL_SEQ = "0";
                var COL_NO = vdimObj.VDIM_CODE;
                /*if(COL_NO.substring(0,4)!='vdim'){
                    continue;
                }*/
                var isSelectedDim = false;
                for (var j = 0; j < this.selectedDimIndiList.length && !isSelectedDim; j++) {
                    if (COL_NO == this.selectedDimIndiList[j].dragNode.id) {
                        isSelectedDim = true;
                    }
                }
                if(!isSelectedDim){
                    COL_SEQ = dimIndiList.length;
                    dimIndiList[dimIndiList.length] = {
                        "COL_TYPE": "02",
                        "COL_NO": COL_NO,
                        "COL_SEQ": COL_SEQ,
                        "GL_DIMKPI": 0
                    };
                    /*
                    dimIndiAttrList[dimIndiAttrList.length] = {
                        "COL_NO": FIELD_NO,
                        "COL_SEQ": dimIndiList.length-1,
                        "COL_TYPE": "02",
                        "ATTR_CODE": "VDIM_NAME",
                        "ATTR_VALUE": filterObj.dragNode.name,
                        "ATTR_SEQ": 0
                    };
                    */
                }else{
                    for(var j=0;j<dimIndiList.length;j++){
                        if(COL_NO==dimIndiList[j].COL_NO){
                            COL_SEQ = j;
                            break;
                        }
                    }
                }
                //
                var ATTR_SEQ = 0;
                for (; ATTR_SEQ < vdimAttrCodeList.length; ATTR_SEQ++) {
                    var attrValue = vdimObj[vdimAttrCodeList[ATTR_SEQ]];
                    vdimAttrList[vdimAttrList.length] = {
                        "COL_TYPE": COL_TYPE,
                        "COL_SEQ": COL_SEQ,
                        "COL_NO": COL_NO,
                        "ATTR_CODE": vdimAttrCodeList[ATTR_SEQ],
                        "ATTR_SEQ": ATTR_SEQ,
                        "ATTR_VALUE": attrValue
                    }
                }
                // 特殊处理groupList
                var groupList = vdimObj.groupList;
                for(var j=0;j<groupList.length;j++){
                    var group = groupList[j];
                    var groupId = group.id;
                    var groupName = group.name;
                    var groupItems = group.items;
                    var groupExp = group.expression;
                    vdimGroupAttrList[vdimGroupAttrList.length] = {
                        "COL_TYPE": COL_TYPE,
                        "COL_SEQ": COL_SEQ,
                        "COL_NO": COL_NO,
                        "ATTR_CODE": "GROUP_ID",
                        "ATTR_SEQ": ATTR_SEQ++,
                        "PARAM_VALUE": groupId,
                        "PARAM_SEQ": -1
                    }
                    vdimGroupAttrList[vdimGroupAttrList.length] = {
                        "COL_TYPE": COL_TYPE,
                        "COL_SEQ": COL_SEQ,
                        "COL_NO": COL_NO,
                        "ATTR_CODE": "GROUP_NAME",
                        "ATTR_SEQ": ATTR_SEQ++,
                        "PARAM_VALUE": groupName,
                        "PARAM_SEQ": -1
                    }
                    if(vdimObj.VDIM_TYPE=="0") {
                        for (var k = 0; k < groupItems.length; k++) {
                            var itemId = groupItems[k].id;
                            vdimGroupAttrList[vdimGroupAttrList.length] = {
                                "COL_TYPE": COL_TYPE,
                                "COL_SEQ": COL_SEQ,
                                "COL_NO": COL_NO,
                                "ATTR_CODE": groupId,
                                "ATTR_SEQ": ATTR_SEQ++,
                                "PARAM_VALUE": itemId,
                                "PARAM_SEQ": j
                            }
                        }
                    }else if(vdimObj.VDIM_TYPE=="1") {
                        vdimGroupAttrList[vdimGroupAttrList.length] = {
                            "COL_TYPE": COL_TYPE,
                            "COL_SEQ": COL_SEQ,
                            "COL_NO": COL_NO,
                            "ATTR_CODE": groupId,
                            "ATTR_SEQ": ATTR_SEQ++,
                            "PARAM_VALUE": groupExp,
                            "PARAM_SEQ": j
                        }
                    }
                }
            }
            // 保存主题之前弹出布局窗口
            if(isValid) {
                var model_phy_code;
                var model_code = this.modelCode;
                fish.forEach(this.modelList, function(modelObj){
                    if(model_code == modelObj.MODEL_CODE){
                        model_phy_code = modelObj.MODEL_PHY_CODE;
                    }
                });
                this.topicParams = {
                    "classNo": this.classNo,
                    "topicNo": this.topicNo,
                    "topicName": this.topicName,
                    "dimIndiList": dimIndiList,// 维度指标概况
                    "dimIndiAttrList": dimIndiAttrList,// 维度指标属性
                    "topicFilterList": topicFilterList,// 筛选器
                    "topicFilterOperList": topicFilterOperList,// 筛选器筛选方式
                    "topicFilterPluginList": topicFilterPluginList,// 过滤器插件
                    "topicChartList": topicChartList,// 图表
                    "topicChartAttrList": topicChartAttrList,// 图表属性
                    "vdimAttrList": vdimAttrList,// 虚拟列
                    "vdimGroupAttrList": vdimGroupAttrList,// 虚拟列
                    "operUser": portal.appGlobal.get("userId"),
                    "modelCode": this.modelCode,
                    "modelPhyCode": model_phy_code,
                    "dateGran": this.selectedGranuList.toString()
                };
                this.showLayoutCfgWin();
            }
        },

        // 主题布局窗口
        showLayoutCfgWin: function (topicParams) {
            var self = this;
            require(["oss_core/inms/pm/adhocdesigner/views/TopicLayoutWin"], function(Dialog) {
                var sData = {
                    "classNo": self.classNo,
                    "catalogList": self.catalogList,
                    "chartList": self.chartList,
                    "topicObj": self.topicObj,
                    "chartOrderList": self.chartOrderList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 350,
                    height: 490
                };
                self.colCfgView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (data) {
                    if(self.topicObj){
                        self.topicObj.CLASS_NO = data.classNo;
                        self.topicObj.PRELINE_ECHARTS = data.numperrow;
                        self.topicObj.LAYOUT_TYPE = data.layout_type;
                    }
                    //刷新图表顺序缓存
                    var tmpChartOrderList = [];
                    fish.forEach(data.chartOrderData, function(newChartOrderObj){
                        var chart_no = newChartOrderObj.id;
                        fish.forEach(self.chartOrderList, function(oldChartOrderObj){
                            if(chart_no == oldChartOrderObj.ECHART_NO){
                                tmpChartOrderList[tmpChartOrderList.length] = oldChartOrderObj;
                            }
                        });
                    });
                    self.chartOrderList = tmpChartOrderList;
                    //
                    self.topicParams.classNo = data.classNo;
                    self.topicParams.numperrow = data.numperrow;
                    self.topicParams.layout_type = data.layout_type;
                    self.topicParams.chartOrder = data.chartOrder;
                    //
                    action.saveTopic(self.topicParams, function (ret) {
                        self.topicNo = ret;
                        if(!self.forDashBoard){
                            fish.success('Save successfully');
                        }
                        self.colCfgView.close();
                        self.trigger("refreshTopicTree");
                        self.trigger("AdhocSaveEvent",{
                            adhocNo: self.topicNo
                        });
                    });
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.colCfgView.close();
                });
            });
        },

        // 预览主题
        topicPreview: function () {
            var self = this;
            fish.forEach(this.chartList, function(chart){
                var pivotUIOptions = chart.$('#ad-pivottable-container').data("pivotUIOptions");
                if(pivotUIOptions) {
                    chart.pivotUIOptions = JSON.stringify({
                        rows: pivotUIOptions.rows,
                        cols: pivotUIOptions.cols
                    });
                }
            });
            var dimAndIndiList = [];
            fish.forEach(this.selectedDimIndiList, function(obj){
                obj.GL_DIMKPI = 1;
                dimAndIndiList[dimAndIndiList.length] = obj;
            })
            fish.forEach(this.filterList,function(filterObj){
                if(filterObj.dragNode && filterObj.dragNode.VDIM_FIELD!="") {
                    var exist = false;
                    fish.forEach(dimAndIndiList, function (obj) {
                        if (obj.dragNode.id == filterObj.dragNode.id) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        filterObj.GL_DIMKPI = 0;
                        dimAndIndiList[dimAndIndiList.length] = filterObj;
                    }
                }
            });
            // 过滤器插件
            var topicFilterPluginList = [];
            for(var i=0; i<this.filterList.length; i++) {
                var filterObj = this.filterList[i];
                if (filterObj.FILTER_TYPE == "3") {
                    topicFilterPluginList[topicFilterPluginList.length] = {
                        "PLUGIN_NO": filterObj.opt.data.PLUGIN_NO,
                        "PLUGIN_PARAM": filterObj.opt.data.PLUGIN_PARAM
                    };
                }
            }
            require(["oss_core/inms/pm/adhoc/views/AdhocMain"], function(adhocMain) {
                var view = new adhocMain({
                    topicNo: self.topicNo,
                    previewType: 1,
                    modelCode: self.modelCode,
                    selectedDimIndiList: dimAndIndiList,
                    topicFilterPluginList: topicFilterPluginList,
                    vdimList: self.vdimList,
                    selectedDateGranu: self.selectedGranuList.toString(),
                    topicFilterList: self.filterList,
                    chartList: self.chartList,
                    LAYOUT_TYPE: self.topicObj?self.topicObj.LAYOUT_TYPE: 0,
                    PRELINE_ECHARTS: self.topicObj?self.topicObj.PRELINE_ECHARTS: 1,
                    CHARTORDERLIST: self.chartOrderList,
                    containerHeight: self.uiContainerHeight - 90
                });
                view.render();
                self.$("#ad-topic-container").hide();
                self.$("#ad-topic-preview").show();
                self.$("#ad-topic-preview").html(view.$el);
                view.showBackDesigner();
                self.listenTo(view, 'backToDesigner', function () {
                    self.$("#ad-topic-container").show();
                    self.$('#ad-topic-preview').hide();
                    self.$("#ad-topic-preview").empty();
                });
            });
        },

        // 更新粒度选择
        updateGranu: function() {
            this.$('#ad-granutag-container').empty();
            this.selectedGranuList = [];
            for(var i=0; i<this.$(":checked").length; i++){
                var checkboxObj = this.$(":checked")[i];
                if(checkboxObj.name == "ad-granularity" && checkboxObj.checked){
                    var htmlText = '<div class="btn-group ad-tags">'
                        +'<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown" type="button">'
                        + checkboxObj.title+ '</button></div>';
                    this.$('#ad-granutag-container').append(htmlText);
                    this.selectedGranuList[this.selectedGranuList.length] = checkboxObj.value;
                }
            }
        },

        insertGlobalVdimInList: function() {
            var self = this;
            fish.forEach(this.globalVdimData.vdimList,function(globalVdim) {
                self.vdimList[self.vdimList.length] = {
                    "VDIM_CODE": globalVdim.VDIM_CODE,
                    "VDIM_NAME": "",
                    "VDIM_FIELD": "",
                    "VDIM_TYPE": "",
                    "NOGROUP_NAME": "",
                    "groupList": [],
                    "expression": ""
                }
            });
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
                }
            });
        },

        loadTopicDetail: function () {
            var self = this;
            this.chartList = [];
            this.selectedDimIndiList = [];
            action.loadTopicDetail({topicNo: self.topicNo}, function (ret) {
                self.topicObj = ret.topicList[0];
                self.modelCode = self.topicObj.MODEL_CODE;
                self.granuStr = self.topicObj.DATE_GRAN;
                //
                fish.forEach(ret.dimAndIndiList, function(dimObj){
                    if(dimObj.COL_TYPE=='00' || dimObj.COL_TYPE=='02') {
                        if (dimObj.GL_DIMKPI == "1") {
                            self.createDimTag({
                                CLASS_TYPE: "00",
                                id: dimObj.COL_NO,
                                name: self.cachedDim.get(dimObj.COL_NO),
                                nodeType: 1,
                                tagType: 0
                            });
                        } else {

                        }
                        if (dimObj.COL_TYPE=='02' && dimObj.COL_NO.substring(0,4)=="vdim") {
                            self.vdimList[self.vdimList.length] = {
                                "VDIM_CODE": dimObj.COL_NO,
                                "VDIM_NAME": "",
                                "VDIM_FIELD": "",
                                "VDIM_TYPE": "",
                                "NOGROUP_NAME": "",
                                "groupList": [],
                                "expression": ""
                            }
                        }
                    }
                });
                fish.forEach(ret.dimAndIndiList, function(indiObj){
                    if(indiObj.COL_TYPE=='01') {
                        self.createIndiTag({
                            CLASS_TYPE: "02",
                            id: indiObj.COL_NO,
                            name: self.cachedIndi.get(indiObj.COL_NO),
                            nodeType: 1,
                            tagType: 1
                        });
                    }
                });
                self.chartOrderList = ret.chartOrderList;
                // 先加载已选全局虚拟维度属性 而后再填充主题中配置了的维度属性
                /*
                 "VDIM_CODE": dimObj.COL_NO,
                 "VDIM_NAME": "",
                 "VDIM_FIELD": "",
                 "VDIM_TYPE": "",
                 "NOGROUP_NAME": "",
                 "groupList": []

                fish.forEach(self.vdimList, function(vdim){
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
                                    var nodeObj = self.selectedDimIndiList[j].dragNode;
                                    var tagObj = self.selectedDimIndiList[j];
                                    if (nodeObj.tagType == 0 && nodeObj.id == colNo && j == colSeq) {
                                        nodeObj["VDIM_NAME"] = globalVdimObj.VDIM_NAME;
                                        nodeObj["VDIM_FIELD"] = globalVdimObj.VDIM_FIELD;
                                        nodeObj["VDIM_TYPE"] = globalVdimObj.VDIM_TYPE;
                                        nodeObj["NOGROUP_NAME"] = globalVdimObj.NOGROUP_NAME;
                                        //
                                        nodeObj.name = globalVdimObj.VDIM_NAME;
                                        tagObj.tagName = globalVdimObj.VDIM_NAME;
                                        tagObj.refreshTag(tagObj.tag_id);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
                 */
                // 维度指标属性
                var dimIndiAttrList = ret.dimIndiAttrList;
                for(var i=0; i<dimIndiAttrList.length; i++){
                    var attrObj = dimIndiAttrList[i];
                    if(attrObj.COL_TYPE=='00' || attrObj.COL_TYPE=='02'){// 维度及虚拟维度属性
                        var colNo = attrObj.COL_NO;
                        var colSeq = attrObj.COL_SEQ;
                        for(var j=0; j<self.selectedDimIndiList.length; j++){
                            var nodeObj = self.selectedDimIndiList[j].dragNode;
                            var tagObj = self.selectedDimIndiList[j];
                            if(nodeObj.tagType==0 && nodeObj.id==colNo && j==colSeq) {
                                //
                                if(attrObj.ATTR_CODE == "VDIM_NAME" || attrObj.ATTR_CODE == "VDIM_FIELD" ||
                                    attrObj.ATTR_CODE == "VDIM_TYPE" ||
                                    attrObj.ATTR_CODE == "NOGROUP_NAME" )
                                {
                                    nodeObj[attrObj.ATTR_CODE] = attrObj.ATTR_VALUE;
                                    if(attrObj.ATTR_CODE=="VDIM_NAME"){
                                        nodeObj.name = attrObj.ATTR_VALUE;
                                        tagObj.tagName = attrObj.ATTR_VALUE;
                                        tagObj.refreshTag(tagObj.tag_id);
                                    }
                                }else {
                                    tagObj[attrObj.ATTR_CODE] = attrObj.ATTR_VALUE;
                                    tagObj.refreshTag(tagObj.tag_id);
                                }
                                break;
                            }
                        }
                        //
                        if(attrObj.ATTR_CODE == "VDIM_NAME" || attrObj.ATTR_CODE == "VDIM_FIELD" ||
                            attrObj.ATTR_CODE == "VDIM_TYPE" ||
                            attrObj.ATTR_CODE == "NOGROUP_NAME" ) {
                            for (var vdimIndex = 0; vdimIndex < self.vdimList.length; vdimIndex++) {
                                var vdimObj = self.vdimList[vdimIndex];
                                if (vdimObj.VDIM_CODE == colNo) {
                                    vdimObj[attrObj.ATTR_CODE] = attrObj.ATTR_VALUE;
                                }
                            }
                        }
                    }else if(attrObj.COL_TYPE=='01'){// 指标属性
                        var colNo = attrObj.COL_NO;
                        var colSeq = attrObj.COL_SEQ;
                        for(var j=0; j<self.selectedDimIndiList.length; j++){
                            var nodeObj = self.selectedDimIndiList[j].dragNode;
                            var tagObj = self.selectedDimIndiList[j];
                            if(nodeObj.tagType==1 && nodeObj.id==colNo && j==colSeq) {
                                tagObj.formatObj[attrObj.ATTR_CODE] = attrObj.ATTR_VALUE;
                                tagObj.refreshTag(tagObj.tag_id);
                                break;
                            }
                        }
                    }
                }
                self.refreshDimIndiTree();
                self.$('#ad-model-select').val(self.modelCode);
                // 虚拟维度items或表达式属性
                for(var i=0; i<ret.vdimGroupAttrList.length; i++) {
                    var vdimAttrObj = ret.vdimGroupAttrList[i];
                    for(var j=0;j<self.vdimList.length;j++){
                        var vdimObj = self.vdimList[j];
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
                                if(vdimObj.VDIM_TYPE=="0") {
                                    vdimObj.groupList[vdimObj.groupList.length - 1].items[vdimObj.groupList[vdimObj.groupList.length - 1].items.length] = {
                                        id: vdimAttrObj.PARAM_VALUE
                                    }
                                }else if(vdimObj.VDIM_TYPE=="1") {
                                    vdimObj.groupList[vdimObj.groupList.length - 1].expression = vdimAttrObj.PARAM_VALUE;
                                }
                            }
                        }
                    }
                }
                // 筛选器
                var topicFilterList = [];
                if(ret.topicEmptyFilterList.length>0){
                    ret.topicFilterList = ret.topicFilterList.concat(ret.topicEmptyFilterList);
                }
                for(var i=0; i<ret.topicFilterList.length; i++) {
                    var retObj = ret.topicFilterList[i];
                    var isExist = false;
                    var filterObj;
                    for (var j = 0; j < topicFilterList.length && !isExist; j++) {
                        filterObj = topicFilterList[j];
                        if (filterObj.id == retObj.FIELD_NO) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        if(retObj.FIELD_TYPE == '3') {// 过滤器插件
                            self.addFilterPluginToView({
                                panel_id: '',
                                FILTER_NAME: retObj.FILTER_OBJ_NO,
                                PLUGIN_NO: retObj.FIELD_NO,
                                PLUGIN_NAME: '',
                                PLUGIN_PARAM: JSON.parse(retObj.PARAM_VALUE)
                            });
                        }else {
                            var name = "";
                            if (retObj.FIELD_TYPE == '0') {// 维度
                                name = self.cachedDim.get(self.modelCode+"-"+retObj.FIELD_NO);
                            } else if (retObj.FIELD_TYPE == '2') {// 虚拟维度
                                fish.forEach(self.vdimList, self.wrap(function (vdimObj) {
                                    if (retObj.FIELD_NO == vdimObj.VDIM_CODE) {
                                        name = vdimObj.VDIM_NAME;
                                    }
                                }));
                            } else {
                                name = self.cachedIndi.get(retObj.FIELD_NO);
                            }
                            topicFilterList[topicFilterList.length] = {
                                id: retObj.FIELD_NO,
                                name: name,
                                FIELD_TYPE: retObj.FIELD_TYPE,
                                FILTER_TYPE: retObj.FIELD_FILTER_TYPE,
                                VIEW_TYPE: retObj.VIEW_TYPE,
                                filterOperList: [{name: '', type: retObj.OPER_TYPE, value: retObj.PARAM_VALUE}],
                                selectedList: []
                            }
                        }
                    } else {
                        filterObj.filterOperList[filterObj.filterOperList.length] = {
                            name: '', type: retObj.OPER_TYPE, value: retObj.PARAM_VALUE
                        }
                    }
                }
                for(var i=0; i<topicFilterList.length; i++) {
                    var filterObj = topicFilterList[i];
                    if(filterObj.FIELD_TYPE=='0' || filterObj.FIELD_TYPE=='2'){
                        var SUBFILTER_TYPE = "";
                        var selectedList = [];
                        if(filterObj.FILTER_TYPE=='0') {//精确筛选
                            SUBFILTER_TYPE = filterObj.filterOperList[0].type;
                            var selectedArray = filterObj.filterOperList[0].value.split(",");
                            if(filterObj.FIELD_TYPE=='0'){// 维度
                                for(var j=0; j<selectedArray.length; j++){
                                    selectedList[selectedList.length] = {
                                        id: selectedArray[j],
                                        name: filterObj.name+selectedArray[j]
                                    }
                                }
                            }else{// 虚拟维度
                                for(var j=0; j<selectedArray.length; j++){
                                    var id = "";
                                    fish.forEach(self.vdimList, self.wrap(function(vdimObj){
                                        if(filterObj.id == vdimObj.VDIM_CODE){
                                            fish.forEach(vdimObj.groupList, self.wrap(function(groupObj) {
                                                if(groupObj.name == selectedArray[j]){
                                                    id = groupObj.id;
                                                }
                                            }));
                                        }
                                    }));
                                    if(id==""){
                                        id = "-1";// 未分组的id
                                    }
                                    selectedList[selectedList.length] = {
                                        id: id,
                                        name: selectedArray[j]
                                    }
                                }
                            }
                        }else if(filterObj.FILTER_TYPE=='1') {//条件筛选
                            selectedList = filterObj.filterOperList;
                            fish.forEach(selectedList, function(obj){
                                obj.name = adhocUtil.mappingFilterFormatterName(obj.type);
                                obj.itemId = adhocUtil.guid();
                            });
                        }
                        var VDIM_FIELD = "";
                        fish.forEach(self.vdimList, function(vdimItem){
                           if(vdimItem.VDIM_CODE == filterObj.id){
                               VDIM_FIELD = vdimItem.VDIM_FIELD;
                           }
                        });
                        self.addFilterToView({
                            CLASS_TYPE: "00",
                            VDIM_FIELD: VDIM_FIELD,
                            id: filterObj.id,
                            name: filterObj.name,
                            nodeType: 1,
                            tagType: 0
                        }, {
                            DIM_CODE: filterObj.id,
                            META_DIM_CODE: self.cachedDimCode.get(filterObj.id),
                            DIM_NAME: filterObj.name,
                            FILTER_TYPE: filterObj.FILTER_TYPE,
                            VIEW_TYPE: filterObj.VIEW_TYPE,
                            SUBFILTER_TYPE: SUBFILTER_TYPE,
                            filterOperList: filterObj.filterOperList,
                            selectedList: selectedList
                        });
                    }else{
                        var selectedList = filterObj.filterOperList;
                        fish.forEach(selectedList, function(obj){
                            obj.name = adhocUtil.mappingFilterFormatterName(obj.type);
                            obj.itemId = adhocUtil.guid();
                        });
                        self.addFilterToView({
                            CLASS_TYPE: "02",
                            id: filterObj.id,
                            name: filterObj.name,
                            nodeType: 1,
                            tagType: 1
                        }, {
                            DIM_CODE: filterObj.id,
                            DIM_NAME: filterObj.name,
                            FILTER_TYPE: filterObj.FILTER_TYPE,
                            VIEW_TYPE: filterObj.VIEW_TYPE,
                            SUBFILTER_TYPE: '',
                            filterOperList: filterObj.filterOperList,
                            selectedList: selectedList
                        });
                    }
                }
                // 图表
                var chartAttrCodeList = ['chart_height','titleAlign','gridTop',
                    'sortCol','sortType','selectableColList','drillColList','displayColList',
                    'xAxisLabelRotate','xAxisLabelInterval','isXAxisLabelRotate','isXAxisLabelInterval','isXAxisLabelInterval','xAxisLabelHeight','isXAxisLabelHeight',
                    'axisCfgXaxis','axisCfgYaxisList','axisColorCfgYaxisList','axisCfgYaxisTypeList','axisCfgSeries',
                    'isPager','isMergeCell','isLabel','isLegend','pieChartType','legendDirection','mapLegendDirection','isZoom','isCompareAnalysis','isExtendedAnalysis',
                    'AREAMAP_NO','isMapLabel','isMapAreaName','isMapLegend','mapColorCfg','labelSymbol',
                    'yAxisTitle','yAxis2Title',
                    'yMax','yMin','xAxis','yAxis','primaryAxis','secondaryAxis', 'secondaryMax','secondaryMin',
                    'displayColList','condiFmtItemList','marklineList'
                ];
                for(var i=0; i<ret.topicChartList.length; i++) {
                    var chartCfgObj = ret.topicChartList[i];
                    self.addChartBtnClick(chartCfgObj.ECHART_TYPE);
                    var chartObj = self.chartList[self.chartList.length - 1];
                    chartObj.chart_type = chartCfgObj.ECHART_TYPE;
                    chartObj.chartTitle = chartCfgObj.ECHART_NAME;
                    chartObj.chartSubTitle = chartCfgObj.TOPIC_SUB_NAME;
                    chartObj.chart_no = chartCfgObj.ECHART_NO;
                }
                // 图表属性
                for(var i=0; i<ret.topicChartAttrList.length; i++) {
                    var chartAttrObj = ret.topicChartAttrList[i];
                    var attrValue = chartAttrObj.ATTR_VALUE;
                    var ECHART_NO = chartAttrObj.ECHART_NO;
                    for(var j=0; j<self.chartList.length; j++){
                        var chart = self.chartList[j];
                        if(chart.chart_no == ECHART_NO){
                            if(chartAttrObj.ATTR_CODE != 'condiFmtItemList' && chartAttrObj.ATTR_CODE != 'marklineList'){
                                chart[chartAttrObj.ATTR_CODE] = attrValue;
                            }else{
                                chart[chartAttrObj.ATTR_CODE][chart[chartAttrObj.ATTR_CODE].length] = JSON.parse(attrValue);
                            }
                            if(chartAttrObj.ATTR_CODE == 'axisCfgYaxisList' || chartAttrObj.ATTR_CODE == 'drillColList'
                                || chartAttrObj.ATTR_CODE == 'displayColList' || chartAttrObj.ATTR_CODE == 'selectableColList'
                                || chartAttrObj.ATTR_CODE == 'axisColorCfgYaxisList' ){
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
                    var chart = self.chartList[ECHART_NO];
                    chart.groupList[chart.groupList.length] = group;
                }
                //
                for(var i=self.chartList.length-1; i>=0; i--) {
                    var chart = self.chartList[i];
                    chart.updateSimuDp(true);
                    self.updateChartCfg(chart.chart_type);
                    if(i==0) {
                        self.switchChartTypeBtnStatus(self.mappingChartClass(chart.chart_type));
                    }
                    self.updateRightCfg(chart);
                    self.refreshChart(chart);
                }
            });
        },

        legendBtnClick: function () {
            var isLegend = this.$('#ad-legend-btn').is(':checked');
            if(isLegend){
                this.$('#ad-legend-direction-sel').show();
            }else{
                this.$('#ad-legend-direction-sel').hide();
            }
            this.chartCfgChange();
        },

        mapLegendBtnClick: function () {
            var isLegend = this.$('#ad-maplegend-btn').is(':checked');
            if(isLegend){
                this.$('#ad-maplegend-direction-sel').show();
            }else{
                this.$('#ad-maplegend-direction-sel').hide();
            }
            this.chartCfgChange();
        },

        validateTopic: function () {
            var validFlag = true;
            this.topicName = adhocUtil.trim(this.$('#ad-topicname-input').val());
            if(this.selectedDimIndiList.length==0){
                validFlag = false;
                fish.toast('info', this.resource.SELECT_DIM_KPI);
            }else if(this.chartList.length==0){
                validFlag = false;
                fish.toast('info', this.resource.ADD_ONE_CHART_ATLEAST);
            }else if(this.topicName==''){
                validFlag = false;
                fish.toast('info', this.resource.ENTER_TOPIC_NAME);
            }else if(this.modelCode==''){
                validFlag = false;
                fish.toast('info', this.resource.NO_MATCH_MODEL);
            }else if(this.selectedGranuList.length==0){
                validFlag = false;
                fish.toast('info', this.resource.SELECT_TOPIC_GRANULARITY);
            }
            return validFlag;
        },

        resize: function () {
            var height = this.uiContainerHeight - 57;
            this.$el.find("#ad-dim-indi-tree").css({'height': + (height-173) + 'px'});
            $('[menuurl="oss_core/inms/pm/adhocdesigner/views/AdhocDesignerMain"]').css("overflow-y", "hidden")
        }
    })

});
