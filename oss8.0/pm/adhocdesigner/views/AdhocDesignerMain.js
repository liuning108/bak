/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/Dashboard.html',
        'oss_core/pm/adhocdesigner/actions/AdhocAction',
        'oss_core/pm/dashboard/actions/DashBoardAction',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/views/AdhocUtil",
        'oss_core/pm/adhoc/views/AdhocMain',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        'css!oss_core/pm/util/css/ad-component.css',
        'css!oss_core/pm/util/css/ad-block.css',
        'css!oss_core/pm/adhocdesigner/assets/bi-common.css',
        'css!oss_core/pm/adhocdesigner/assets/adhoc.css'
    ],
    function(mainTpl, action, dbAction, echarts, adhocUtil, adhocMain, i18nData) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #ad-graph-btn': "showGraphMode",
            'click #ad-list-btn': "showListMode",
            'click #ad-search-btn': "showSearchMode",
            'keypress #ad-search-input': "searchKeyPress",
            'click #ad-exit-search-btn': "exitSearchMode",
            'click #ad-addtopic-btn': "addTopic",
            'click #ad-addcatalog-btn': "addCatalog",
            'click .ad-favtopic-btn': "favTopicClick",
            'click .ad-nofavtopic-btn': "nofavTopicClick",
            'click .ad-edittopic-btn': "gotoEditTopic",
            'click .ad-previewtopic-btn': "previewTopic",
            'click .ad-deltopic-btn': "delTopic",
            'click .ad-refreshtopic-btn': "refreshTopic",
            'click .ad-movetopic-btn': "moveTopic",
            'click .ad-more-btn': "showMoreBtn",
            'click .ad-kpicomments-btn': "showKpiComments",
            'click #ad-sendmail-btn': "showSendMailCfg",
            'click #ad-sendmailnow-btn': "showSendMailNowCfg",
            'click .ad-sharetopic-btn': "showShareTopicCfgWin",
            'click #ad-topic-showsharetopic-btn': "showShareTopicViewWin",
            'click .ad-download-btn': "showDownloadWin",
            'click #ad-downloadlist-btn': "showDownloadListWin",
            'click .ad-maxium-btn': "maxiumDisplay",
            'click .ad-maxium-restore-btn': "restoreDisplay"
        },

        initialize: function (opt) {
            this.bpId = opt.bpId;
            this.userId = portal.appGlobal.get("userId");
            // CLASS_TYPE 00:收藏夹 01:Recent browse
            this.catalogList = [];
            this.topicList = [];
            this.userList = [];
            this.currTreeNode = null;
            this.currPopoverTopic = null;
            this.currPopoverTopicNo = "";
            this.currPopoverTopicName = "";
            this.currTopicSaveType = "";
            this.hasLoadFinish = false;
            this.topicTreeExist = false;
            // 缓存系统用户
            this.cachedOperUser = new adhocUtil.HashMap();
            this.cacheOperUser = action.cacheOperUser({
            }, this.wrap(function (data) {
                this.userList = data.userList;
                fish.forEach(data.userList, this.wrap(function (paramItem) {
                    this.cachedOperUser.put(paramItem.USER_ID, paramItem.USER_NAME);
                }));
            }));
            // 缓存全局虚拟维度
            this.globalVdimData = new Object();
            action.getGlobalVdimList({

            }, this.wrap(function (data) {
                this.globalVdimData = data;
            }));
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({SLA_TYPE: this.SLA_TYPE},this.resource)));
            return this;
        },

        afterRender: function () {
            var self = this;
            dbAction.isEmailSendOn(function(data){
                var result = data.result;
                if(result){
                    self.$('#ad-sendmail-btngroup').show();
                }else{
                    self.$('#ad-sendmail-btngroup').hide();
                }
            })
            // 缓存元数据
            this.cachedDim = new adhocUtil.HashMap();
            this.cachedIndi = new adhocUtil.HashMap();
            this.cachedDimCode = new adhocUtil.HashMap();
            this.modelList = [];
            this.dimList = [];
            this.kpiList = [];
            this.cacheMetaData = action.cacheModelData({}, this.wrap(function (data) {
                fish.forEach(data.DIMS, this.wrap(function(dim){
                    this.cachedDimCode.put(dim.FIELD_CODE, dim.DIM_CODE);
                    this.cachedDim.put(dim.FIELD_CODE, dim.FIELD_NAME);
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
                    }
                }));
                for(var i=0;i<data.modelField.length;i++){
                    var modelFieldObj = data.modelField[i];
                    var modelObj;
                    var MODEL_CODE = modelFieldObj.MODEL_BUSI_CODE;
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
                            MODEL_NAME: MODEL_NAME,
                            MODEL_TIMESPAN: MODEL_TIMESPAN,
                            MODEL_TIMESPAN_NAME: MODEL_TIMESPAN_NAME,
                            DIMS: [],
                            INDICATORS: []
                        };
                        this.modelList[this.modelList.length] = modelObj;
                    }
                    fish.forEach(this.modelList, this.wrap(function(model) {
                        var modelCode = model.MODEL_CODE;
                        fish.forEach(model.DIMS, this.wrap(function (dim) {
                            this.cachedDim.put(modelCode + "-" + dim.DIM_CODE, dim.DIM_NAME);
                        }));
                        fish.forEach(model.INDICATORS, this.wrap(function (indi) {
                            this.cachedIndi.put(modelCode + "-" + indi.KPI_CODE, indi.KPI_NAME);
                        }));
                    }));
                    //
                    if(FIELD_TYPE=="0"){
                        modelObj.DIMS[modelObj.DIMS.length] = {
                            DIM_CODE: FIELD_CODE,
                            META_DIM_CODE: DIM_CODE,
                            DIM_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }else if(FIELD_TYPE=="1"){
                        if(FIELD_NAME == "3G Data Traffic"){
                            console.log();
                        }
                        modelObj.INDICATORS[modelObj.INDICATORS.length] = {
                            KPI_CODE: FIELD_CODE,
                            KPI_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }
                }
                this.hasLoadFinish = true;
                this.initTopicTree();
            }));
            this.nowDisplayMode = "0"; //0-列表 1-图文
            this.initTopicTabs();
            this.homepageTabId = "tabs-a";
            this.$('.ad-maxium-restore-btn').hide();
        },

        initTopicTabs: function() {
            var self = this;
            this.$("#ad-topic-tabs").tabs({
                canClose:true,
                paging: {"selectOnAdd":true},
                remove: function(e, ui) {
                    self.$('#ad-topic-btngroup').hide();
                    self.currPopoverTopicNo = "";
                },
                activate: function(e, ui) {
                    if(ui.newPanel.attr("id")==self.homepageTabId){
                        self.$('#ad-topic-btngroup').hide();
                    }else if(self.homepageTabId){
                        self.$('#ad-topic-btngroup').show();
                    }
                }
            });
        },

        initTopicTree: function () {
            this.treeSetting = {
                expandAll: true,
                view: {
                    addHoverDom: this.addHoverDom.bind(this),
                    removeHoverDom: this.removeHoverDom.bind(this),
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    removeTitle: '', // removeTitle
                    renameTitle: '', // renameTitle
                    editNameSelectAll: true,
                    showRenameBtn: this.showRenameBtn.bind(this), // 是否显示编辑
                    showRemoveBtn: this.showRemoveBtn.bind(this), // 是否显示删除图标
                    drag: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeRemove: this.beforeRemove.bind(this), // 删除前操作
                    onClick: this.treeOnClick.bind(this), //树的点击事件
                    onRemove: this.onRemove.bind(this), // 删除
                    onRename: this.onRename.bind(this) // rename
                }
            };
            action.qryCatalogAndTopic({ "OPER_USER": this.userId},this.wrap(function(ret){
                fish.forEach(ret.vdimAttrList, this.wrap(function(vdimAttr){
                    this.cachedDim.put(vdimAttr.COL_NO, vdimAttr.ATTR_VALUE);
                }));
                this.dimAndIndiList = ret.dimAndIndiList;
                fish.forEach(this.dimAndIndiList, this.wrap(function(dimIndiObj){
                    // TOPIC_NO COL_TYPE COL_NO
                    if(dimIndiObj.COL_TYPE == '00' || dimIndiObj.COL_TYPE == '02') {// 维度
                        dimIndiObj.NAME = this.cachedDim.get(dimIndiObj.COL_NO);
                    }else{// 指标
                        dimIndiObj.NAME = this.cachedIndi.get(dimIndiObj.COL_NO);
                    }
                }));
                var topicClassList = ret.topicClassList;
                var topicList = ret.topicList;
                this.favAndViewedList = ret.favAndViewedList;// 收藏和Recent browse的主题
                this.subCatalogList = [
                    {
                        id: -2, name: this.resource.MY_FAVORITE, CLASS_TYPE: "00", open: true, iconSkin: "pIcon02", nodeType: 0,
                        children: []
                    },
                    {
                        id: -3, name: this.resource.RECENT_BROWSE, CLASS_TYPE: "01",  open: false,nodeType: 0,
                        children: []
                    }
                ];
                // 丰富topic信息
                for(var i=0; i<topicList.length; i++) {
                    var topic = topicList[i];
                    topic.DIMS = [];
                    topic.INDIS = [];
                    for(var j=0; j<this.dimAndIndiList.length; j++){
                        var dimIndiObj = this.dimAndIndiList[j];
                        if(dimIndiObj.TOPIC_NO == topic.TOPIC_NO && (dimIndiObj.COL_TYPE=='00' || dimIndiObj.COL_TYPE=='02')){
                            topic.DIMS[topic.DIMS.length] = {
                                DIM_CODE: dimIndiObj.COL_NO,
                                DIM_NAME: this.cachedDim.get(topic.MODEL_CODE+"-"+dimIndiObj.COL_NO),
                                GL_DIMKPI: dimIndiObj.GL_DIMKPI
                            }
                            console.log("dimIndiObj:"+dimIndiObj.COL_NO+"-"+dimIndiObj.NAME);
                        }else if(dimIndiObj.TOPIC_NO == topic.TOPIC_NO && dimIndiObj.COL_TYPE=='01'){
                            topic.INDIS[topic.INDIS.length] = {
                                KPI_CODE: dimIndiObj.COL_NO,
                                KPI_NAME: this.cachedIndi.get(topic.MODEL_CODE+"-"+dimIndiObj.COL_NO)
                            }
                            console.log("dimIndiObj:"+dimIndiObj.COL_NO+"-"+dimIndiObj.NAME);
                        }
                    }
                    //topic.OPER_DATE = topic.OPER_DATE.substring(0,19);
                    topic.OPER_USER_NAME = this.cachedOperUser.get(topic.OPER_USER);
                    // 匹配收藏和Recent browse主题
                    for (var j = 0; j < this.favAndViewedList.length; j++) {
                        var favAndViewedTopic = this.favAndViewedList[j];
                        if (topic.TOPIC_NO == favAndViewedTopic.TOPIC_NO) {
                            // 收藏
                            if (favAndViewedTopic.CLASS_TYPE == '00') {
                                topic.IS_FAV = 1;
                            }
                            if (favAndViewedTopic.CLASS_TYPE == '01') {
                                topic.CLASS_TYPE = favAndViewedTopic.CLASS_TYPE;
                            }
                            favAndViewedTopic.TOPIC_NAME = topic.TOPIC_NAME;
                        }
                    }
                }
                // 根据查询的顺序组织收藏夹和Recent browse
                for (var i = 0; i < this.favAndViewedList.length; i++) {
                    var favAndViewedTopic = this.favAndViewedList[i];
                    if (favAndViewedTopic.CLASS_TYPE == '00' && favAndViewedTopic.hasOwnProperty("TOPIC_NAME")) {
                        this.subCatalogList[0].children[this.subCatalogList[0].children.length] = {
                            id: favAndViewedTopic.TOPIC_NO, name: favAndViewedTopic.TOPIC_NAME, CLASS_TYPE: "00", nodeType: 1, iconSkin: 'ico_ind'
                        }
                    }
                    if (favAndViewedTopic.CLASS_TYPE == '01' && this.subCatalogList[1].children.length<10 && favAndViewedTopic.hasOwnProperty("TOPIC_NAME")) {
                        this.subCatalogList[1].children[this.subCatalogList[1].children.length] = {
                            id: favAndViewedTopic.TOPIC_NO, name: favAndViewedTopic.TOPIC_NAME, CLASS_TYPE: "01", nodeType: 1, iconSkin: 'ico_ind'
                        };
                    }
                }
                //初始化全局主题集合
                this.topicList = topicList;
                //组织目录结构
                fish.forEach(topicClassList, this.wrap(function(catalog){
                    var subCatalogObj = {
                        id: catalog.CLASS_NO, name: catalog.CLASS_NAME, CLASS_TYPE: "02", open: false,nodeType: 0, children:[]
                    }
                    this.subCatalogList[this.subCatalogList.length] = subCatalogObj;
                    fish.forEach(this.topicList, this.wrap(function(topic){
                        if(topic.CLASS_NO == catalog.CLASS_NO){
                            subCatalogObj.children[subCatalogObj.children.length] = {
                                id: topic.TOPIC_NO, name: topic.TOPIC_NAME, CLASS_TYPE: "00", nodeType: 1, iconSkin: 'ico_ind'
                            }
                        }
                    }));
                }));
                this.catalogList = [
                    {
                        id: -1, name: this.resource.TOPIC_CATALOG, CLASS_TYPE: "", open: true, nodeType: -1,
                        children: this.subCatalogList
                    }
                ];
                if(!this.topicTreeExist){
                    this.treeSetting.fNodes = this.catalogList;
                    this.$el.find("#topicTree").tree(this.treeSetting);
                    this.$tree = this.$el.find("#topicTree");
                    this.topicTreeExist = true;
                }else{
                    this.$tree.tree("reloadData", this.catalogList);
                }
                this.initTopicGrid();
            }));
        },

        showRemoveBtn: function (treeNode) {
            var catalogType=null;
            if (treeNode.id == -2 || treeNode.id == -3 || treeNode.nodeType == 1 || treeNode.nodeType == -1) {
                return false;
            }
            return true;
        },

        showRenameBtn: function (treeNode) {
            var catalogType = null;
            if ( treeNode.CLASS_TYPE == '02' ) {
                return true;
            }
            return false;
        },

        addHoverDom: function (treeNode) {
            var catalogType=null;
            if ( this.$("#" + treeNode.tId + "_add").length > 0 || this.$("#" + treeNode.tId + "_cfg").length > 0){
                return;
            }
            if(treeNode.nodeType==-1) {// 根节点添加add按钮 添加主题目录
                var sObj = this.$el.find("#" + treeNode.tId + "_span");
                var addStr = "<span class='button add' id='" + treeNode.tId + "_add' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                // 绑定事件message: that.res.SA_NAME_C
                var btn = this.$el.find("#" + treeNode.tId + "_add");
                if (btn) {
                    btn.bind("click", this.wrap(function() {
                        var zTree = this.$tree;
                        var zTree = this.$tree;
                        var zhNode = zTree.tree("getNodeByTId", treeNode.tId);
                        var newNode = {
                            id: -999,
                            pId: treeNode.id,
                            name: "",
                            CLASS_TYPE: '02'
                        };
                        zTree.tree("addNodes", zhNode, newNode);
                        newNode = zTree.tree("getNodeByParam", "id", -999, zhNode);
                        zTree.tree("editName", newNode);
                        return false;
                    }));
                }
            }
            /*else if(treeNode.nodeType==1){
                var sObj = this.$el.find("#" + treeNode.tId + "_a span").first();
                var addStr = "<span class='button' style='position:absolute;left:188px;z-index:999' id='" + treeNode.tId + "_cfg' onfocus='this.blur();'>"
                           + "<i class='fa fa-cog fa-fw'/>"
                           + "</span>";
                sObj.before(addStr);
                // 绑定事件message: that.res.SA_NAME_C
                var btn = this.$el.find("#" + treeNode.tId + "_cfg");
                if (btn) {
                    var topicNo = treeNode.id;
                    this.currPopoverTopicNo = topicNo;
                    this.currPopoverTopicName = treeNode.name;
                    var isFav = false;
                    fish.forEach(this.topicList, this.wrap(function(topic){
                        if(topic.TOPIC_NO == topicNo && topic.IS_FAV == 1){
                            isFav = true;
                        }
                    }));
                    if(isFav){
                        this.$('.ad-favtopic-btn').hide();
                        this.$('.ad-nofavtopic-btn').show();
                    }else{
                        this.$('.ad-favtopic-btn').show();
                        this.$('.ad-nofavtopic-btn').hide();
                    }
                    var self = this;
                    this.$("#" + treeNode.tId + "_cfg").popover({ placement: 'top', trigger:'hover', content: this.$('#ad-popover-content').html(),html:true}).on("popover:show",function(){
                        $('.ad-favtopic-btn').on("click", function () {
                            self.favTopicClick();
                        });
                        $('.ad-nofavtopic-btn').on("click", function () {
                            self.nofavTopicClick();
                        });
                        $('.ad-edittopic-btn').on("click", function () {
                            self.gotoEditTopic();
                        });
                        $('.ad-previewtopic-btn').on("click", function () {
                            self.previewTopic();
                        });
                        $('.ad-deltopic-btn').on("click", function () {
                            self.delTopic();
                        });
                    });
                }
            }*/
        },

        removeHoverDom: function (treeNode) {
            this.$el.find("#"+treeNode.tId + "_add").unbind().remove();
            this.$el.find("#"+treeNode.tId + "_cfg").unbind().remove();
        },

        beforeEditName: function (treeNode) {

        },

        beforeRemove: function (event, treeNode) {
            that = this;
            var zTree = that.$el.find("#topicTree");
            zTree.tree("selectNode", treeNode);
            var catalogId = treeNode.id;
            // 验证是否包含主题
            var isExist = false;
            for(var i=0; i<that.topicList.length && !isExist; i++) {
                var topic = that.topicList[i];
                if(topic.CLASS_NO == catalogId){
                    isExist = true;
                }
            }
            if(isExist){
                fish.toast('info', this.resource.DELETE_TOPIC_TIP);
            }else {
                fish.confirm(this.resource.CONFIRM_DELETE_TOPIC_TIP).result.then(this.wrap(function () {
                    this.deleteCatalogFunc(treeNode);
                }));
            }
            return false;
        },

        beforeRename: function (treeNode) {

        },

        treeOnClick: function (event, treeNode) {
            this.treeOnClickFunc(treeNode);
            this.currTreeNode = treeNode;
        },

        //树点击事件
        treeOnClickFunc: function(treeNode) {
            this.CLASS_TYPE = treeNode.CLASS_TYPE;
            this.CLASS_NO = treeNode.id;
            this.nodeType = treeNode.nodeType;
            /* 当选中普通目录时 新建按钮可用
            if(this.CLASS_TYPE!='00' && this.CLASS_TYPE!='01' && this.nodeType!=-1){
                this.$('#ad-addtopic-btn').removeAttr("disabled");
            }else{
                this.$('#ad-addtopic-btn').attr('disabled', true);
            }*/
            if(this.nodeType == 1){
                this.previewTopic(treeNode.id, treeNode.name);
            }else{
                this.$("#ad-topic-tabs").tabs("remove",this.currPopoverTopicNo);
                this.$('#ad-topic-btngroup').hide();
            }
        },

        loadTopic: function (nodeId, CLASS_TYPE, nodeType) {
            var resultData = [];
            fish.forEach(this.topicList, this.wrap(function(item) {
                if(nodeId && nodeId == item.CLASS_NO){
                    resultData[resultData.length] = item;
                }
                if(nodeType==0) {// 0-文件夹 1-主题节点
                    if ("00" == CLASS_TYPE && item.IS_FAV == 1) {
                        resultData[resultData.length] = item;
                    }
                    if ("01" == CLASS_TYPE && item.CLASS_TYPE == CLASS_TYPE) {
                        resultData[resultData.length] = item;
                    }
                }else{
                    if (nodeId && nodeId == item.TOPIC_NO) {// && item.IS_FAV == 1
                        resultData[resultData.length] = item;
                    }
                }
            }));
            this.$el.find("#topicListTable").grid("reloadData", resultData);
            return resultData;
        },

        refreshGraphModeByCatalog: function(topicVisibleList) {
            //CLASS_TYPE,TOPIC_NO,TOPIC_NAME
            this.$('#ad-graph-div').empty();
            fish.forEach(topicVisibleList, this.wrap(function(topic) {
                var divId = 'ad-chart-'+topic.TOPIC_NO;
                var isFav = topic.IS_FAV;
                var htmlText = '<div class="col-md-6">'
                             + '<button name="eye-btn" id="ad-charteyebtn-'+topic.TOPIC_NO+'" type="button" style="position: absolute; top: 10px;right: 50px;z-index:10" class="btn ad-btn-link btn-ico"><i class="fa fa-eye"></i></button>'
                             + '<button name="nofav-btn" id="ad-chartnofavbtn-'+topic.TOPIC_NO+'" type="button" style="position: absolute; top: 10px;right: 30px;z-index:10;display:'+(isFav==0?'block':'none')+'" class="btn ad-btn-link btn-ico"><i class="fa fa-star-o"></i></button>'
                             + '<button name="fav-btn" id="ad-chartfavbtn-'+topic.TOPIC_NO+'" type="button" style="position: absolute; top: 10px;right: 30px;z-index:10;display:'+(isFav==0?'none':'block')+'" class="btn ad-btn-link btn-ico"><i class="fa fa-star text-warning"></i></button>'
                             + '<button name="eye-btn" id="ad-chartcogbtn-'+topic.TOPIC_NO+'" type="button" style="position: absolute; top: 10px;right: 10px;z-index:10" class="btn ad-btn-link btn-ico"><i class="fa fa-cog topic-edit"></i></button>'
                             + '<div id="'+divId+'" class="ad-chart">'
                             + topic.TOPIC_NAME+'</div></div>';
                this.$('#ad-graph-div').append(htmlText);
                this.initTrendChart(divId, topic);
            }));
        },

        initTrendChart: function(divId, topic) {
            this.lineChart1 = echarts.init(this.$("[id='"+divId+"']")[0]);
            if(Math.random()*100>35) {
                this.lineChart1.setOption(adhocUtil.getColChartOption(topic));
            }else{
                this.lineChart1.setOption(adhocUtil.getLineChartOption(topic));
            }
        },

        // 初始主题列表表格
        initTopicGrid: function(data) {
            var heightVal = $(window).height() - 157;
            // 表格自适应 模式
            var opt = {
                colModel:[
                    {name:'TOPIC_NO',index:'TOPIC_NO', key: true, hidden: true},
                    {name:'TOPIC_NAME',label:'Topic Name',index:'TOPIC_NAME',width:"35%",sortable:true,
                        formatter: function(cellval, rowObj){
                            return "<a class=\"linkfunction bi-sa-link-name\" rowId=\""+ rowObj.rowId +"\">"+ cellval +"</a>";
                        }
                    },
                    {name:'OPER_USER_NAME',label:'Operator',index:'OPER_USER',width:"15%",sortable:true},
                    {name:'OPER_DATE',label:'Operating time',index:'OPER_DATE',width:"25%",sortorder:"asc"},
                    {
                        name: 'action',
                        label:'Operation',
                        formatter: 'actions',
                        width:"25%",
                        sortable: false,
                        formatoptions: {
                            editbutton: false, //默认开启编辑功能
                            delbutton: false,  //默认开启删除功能
                            inlineButtonAdd:[{ //可以给actions类型添加多个icon图标,事件自行控制
                                id: "btnSubjectDetail", //每个图标的id规则为id+"_"+rowid
                                className: "inline-lock",//每个图标的class
                                icon: "fa fa-eye",//图标的样子
                                title: ''//鼠标移上去显示的内容
                            }, {
                                id: "btnCollectSubject",
                                className: "inline-lock",
                                icon: "fa fa-star-o fav-subject",
                                title: ''
                            }, {
                                id: "btnSubjectDel",
                                className: "inline-lock",
                                icon: "fa fa-trash topic-del",
                                title: ''
                            }, {
                                id: "btnSubjectSet",
                                className: "inline-lock",
                                icon: "fa fa-cog topic-edit subject-set",
                                title: ''
                            }]
                        }
                    }
                ],
                hidegrid: false,
                pager: true,
                rowNum: 20,
                gridview: false,
                onPaging: function(){
                    this.$el.find(".subject-set").popover("hide");
                },
                afterInsertRow: this.wrap(function(e, rowid, data) {
                    if (data) {
                        this.dealSaSubjectGridRowBtn(data);
                    }
                }),
                gridComplete: function(){
                    //this.initSetSubjectDialogFunc();
                }
            };
            // 初始化table
            this.$grid = this.$el.find("#topicListTable").grid(opt);
            this.$grid.on('grid:onselectrow', _.bind(this.onSelectRow, this));
            this.resize();
        },

        onSelectRow: function(e, rowid, state) {
            this.currRowData = this.$grid.jqGrid("getSelection", rowid);
        },

        dealSaSubjectGridRowBtn: function(rowData){
            var isFav = rowData.IS_FAV;
            var subjectId = rowData.TOPIC_NO;
            var $btnColSubjectObj = this.$("#btnCollectSubject_" + subjectId);
            if(isFav) {//收藏
                console.log("dealSaSubjectGridRowBtn: fav");
                $btnColSubjectObj.find('.fav-subject').removeClass('fa-star-o');
                $btnColSubjectObj.find('.fav-subject').addClass('fa-star text-warning');
            } else {//取消收藏
                console.log("dealSaSubjectGridRowBtn: no fav");
                $btnColSubjectObj.find('.fav-subject').removeClass('fa-star text-warning');
                $btnColSubjectObj.find('.fav-subject').addClass('fa-star-o');
            }
        },

        onRemove: function (treeNode) {},

        onRename: function(event, treeNode, isCancel){
            that = this;
            // 表示新增
            if (treeNode.id === -999) {
                // 调用服务新增
                that.addCatalogFunc(treeNode, true);
            } else {
                // 编辑目录名称
                that.modCatalogFunc(treeNode);
            }
        },

        addCatalogFunc: function(newNode, needTip){
            var that = this;
            // var zTree = $.fn.zTree.getZTreeObj("selfAnalysisTree");
            var zTree = that.$el.find("#topicTree");
            var treeInstance = $("#topicTree").tree("instance");
            var catalogName = newNode.name;
            var retThen = null;
            // 验证非空
            if (!catalogName) {
                fish.toast('info', this.resource.CATALOGNAME_NOT_EMPTY);
                treeInstance.removeNode(newNode);
                return false;
            }
            // 验证是否已存在
            var isExist = false;
            if(catalogName == 'My favorite' || catalogName == 'Recent browse'){
                fish.toast('info', this.resource.CATALOGNAME_EXIST);
                treeInstance.removeNode(newNode);
                isExist = true;
            }
            fish.forEach(this.catalogList[0].children, this.wrap(function(catalog) {
                if(catalog.name == catalogName) {
                    fish.toast('info', this.resource.CATALOGNAME_EXIST);
                    treeInstance.removeNode(newNode);
                    isExist = true;
                }
            }));
            //
            if(!isExist) {
                retThen = action.addCatalog({
                    "CLASS_NAME": catalogName,
                    "OPER_USER": this.userId
                }, function (ret) {
                    if (needTip) {
                        var catalogId = ret.CLASS_NO;
                        if (catalogId) {
                            newNode.id = catalogId;
                            newNode.CLASS_TYPE = '02';
                            zTree.tree("updateNode", newNode);
                            //that.treeOnClickFunc(newNode);
                            that.catalogList[0].children[that.catalogList[0].children.length] = {
                                id: catalogId, name: catalogName, CLASS_TYPE: "02", open: false, nodeType: 0, iconSkin: 'ico_ind'
                            };
                            fish.toast('success', that.resource.SUCCESS);
                        }
                    }
                });
            }
        },

        // 编辑目录名称
        modCatalogFunc: function(treeNode){
            var that = this;
            // var zTree = $.fn.zTree.getZTreeObj("selfAnalysisTree");
            var zTree = that.$el.find("#topicTree");
            var treeInstance = $("#topicTree").tree("instance");
            var catalogName = treeNode.name;
            var catalogId= treeNode.id;
            var lastName = "";
            fish.forEach(this.catalogList[0].children, this.wrap(function(catalog) {
                if(catalog.id == catalogId) {
                    lastName = catalog.name;
                }
            }));
            var retThen = null;
            // 验证非空
            if (!catalogName) {
                fish.toast('info', this.resource.CATALOGNAME_NOT_EMPTY);
                treeNode.name = lastName;
                zTree.tree("editName", treeNode);
                return false;
            }
            // 验证是否已存在
            var isExist = false;
            if(catalogName == 'My favorite' || catalogName == 'Recent browse'){
                fish.toast('info', this.resource.CATALOGNAME_EXIST);
                treeNode.name = lastName;
                zTree.tree("editName", treeNode);
                isExist = true;
            }
            fish.forEach(this.catalogList[0].children, this.wrap(function(catalog) {
                if(catalog.name == catalogName && catalogId!= catalog.id) {
                    fish.toast('info', this.resource.CATALOGNAME_EXIST);
                    treeNode.name = lastName;
                    zTree.tree("editName", treeNode);
                    isExist = true;
                }
            }));
            //
            if(!isExist && lastName!=catalogName) {
                retThen = action.modCatalog({
                    "CLASS_NO": catalogId,
                    "CLASS_NAME": catalogName,
                    "OPER_USER": this.userId
                }, function (ret) {
                    var catalogId = ret.CLASS_NO;
                    if (catalogId) {
                        treeNode.id = catalogId;
                        treeNode.name = catalogName;
                        treeNode.CLASS_TYPE = '02';
                        zTree.tree("updateNode", treeNode);
                        //that.treeOnClickFunc(newNode);
                        fish.forEach(that.catalogList[0].children, that.wrap(function(catalog) {
                            if(catalog.id == catalogId) {
                                catalog.name = catalogName;
                            }
                        }));
                        fish.toast('success', that.resource.SUCCESS);
                    }
                });
            }
        },

        // 删除目录
        deleteCatalogFunc: function(treeNode){
            that = this;
            var catalogId = treeNode.id;
            var zTree = this.$el.find("#topicTree");
            action.delCatalog({
                "CLASS_NO": catalogId,
                "OPER_USER": this.userId
            }, function (ret) {
                zTree.tree("removeNode", treeNode);
                for(var i= 0; i<that.catalogList[0].children.length;i++){
                    var catalog = that.catalogList[0].children[i];
                    if(catalog.id == treeNode.id){
                        that.catalogList[0].children.splice(i,1);
                        break;
                    }
                }
                fish.toast('success', that.resource.SUCCESS);
            });
        },

        showGraphMode: function () {
            this.nowDisplayMode = "1";
            this.$('#ad-search-container').hide();
            this.$('#ad-graph-container').show();
            this.$('#ad-list-container').hide();
            var topicVisibleList = this.loadTopic(this.CLASS_NO, this.CLASS_TYPE, this.nodeType);
            this.refreshGraphModeByCatalog(topicVisibleList);
            this.$('#ad-graph-btn').addClass("active");
            this.$('#ad-list-btn').removeClass("active");
        },

        showListMode: function () {
            this.nowDisplayMode = "0";
            this.$('#ad-search-container').hide();
            this.$('#ad-graph-container').hide();
            this.$('#ad-list-container').show();
            this.$('#ad-list-btn').addClass("active");
            this.$('#ad-graph-btn').removeClass("active");
        },

        showHomePage: function () {
            this.nowDisplayMode = "0";
            this.$('#ad-search-container').hide();
            this.$('#ad-graph-container').hide();
            this.$('#ad-homepage').show();
        },

        searchKeyPress: function (e) {
            if (event.keyCode == "13") {
                this.showSearchMode();
            }
        },

        showSearchMode: function () {
            var searchCont = adhocUtil.trim(this.$('#ad-search-input').val());
            if(searchCont == ''){
                fish.toast('info', this.resource.ENTER_SEARCH_CONTENT);
            }else {
                var matchedTopicList = [];
                fish.forEach(this.topicList, function (topic){
                    if(topic.TOPIC_NAME.toLowerCase().indexOf(searchCont.toLowerCase())!=-1){
                        var isExist = false;
                        for(var i=0; i<matchedTopicList.length && !isExist; i++){
                            if(matchedTopicList[i]==topic.TOPIC_NO){
                                isExist = true;
                            }
                        }
                        if(!isExist) {
                            matchedTopicList[matchedTopicList.length] = topic.TOPIC_NO;
                        }
                    }
                    fish.forEach(topic.DIMS, function (dimObj){
                        if(dimObj.DIM_NAME && dimObj.DIM_NAME.toLowerCase().indexOf(searchCont.toLowerCase())!=-1){
                            var isExist = false;
                            for(var i=0; i<matchedTopicList.length && !isExist; i++){
                                if(matchedTopicList[i]==topic.TOPIC_NO){
                                    isExist = true;
                                }
                            }
                            if(!isExist) {
                                matchedTopicList[matchedTopicList.length] = topic.TOPIC_NO;
                            }
                        }

                    });
                    fish.forEach(topic.INDIS, function (indibj){
                        if(indibj.KPI_NAME && indibj.KPI_NAME.toLowerCase().indexOf(searchCont.toLowerCase())!=-1){
                            var isExist = false;
                            for(var i=0; i<matchedTopicList.length && !isExist; i++){
                                if(matchedTopicList[i]==topic.TOPIC_NO){
                                    isExist = true;
                                }
                            }
                            if(!isExist) {
                                matchedTopicList[matchedTopicList.length] = topic.TOPIC_NO;
                            }
                        }

                    });
                });
                fish.forEach(this.dimAndIndiList, function (dimIndiObj){
                    if(dimIndiObj.NAME && dimIndiObj.NAME.toLowerCase().indexOf(searchCont.toLowerCase())!=-1){
                        var isExist = false;
                        for(var i=0; i<matchedTopicList.length && !isExist; i++){
                            if(matchedTopicList[i]==dimIndiObj.TOPIC_NO){
                                isExist = true;
                            }
                        }
                        if(!isExist) {
                            matchedTopicList[matchedTopicList.length] = dimIndiObj.TOPIC_NO;
                        }
                    }
                });
                //
                this.$('#ad-searchcont-container').empty();
                this.$('#ad-search-result-count').html(matchedTopicList.length);
                for(var i=0; i<this.topicList.length; i++) {
                    var topic = this.topicList[i];
                    var isExist = false;
                    for(var j=0; j<matchedTopicList.length && !isExist; j++){
                        if(matchedTopicList[j]==topic.TOPIC_NO){
                            isExist = true;
                        }
                    }
                    if(isExist) {
                        var topicName = topic.TOPIC_NAME;
                        var titleStr = topicName;
                        var topicNo = topic.TOPIC_NO;
                        var index = titleStr.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = titleStr.substring(0, index);
                            suffix = titleStr.substring(index + searchCont.length);
                            titleStr = preffix + "<span>" + titleStr.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        //
                        var dimStr = "";
                        var indiStr = "";
                        for(var j=0;j<topic.DIMS.length; j++){
                            dimStr += topic.DIMS[j].DIM_NAME + "、";
                        }
                        index = dimStr.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = dimStr.substring(0, index);
                            suffix = dimStr.substring(index + searchCont.length);
                            dimStr = preffix + "<span>" + dimStr.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        for(var j=0;j<topic.INDIS.length; j++){
                            indiStr += topic.INDIS[j].KPI_NAME + "、";
                        }
                        index = indiStr.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = indiStr.substring(0, index);
                            suffix = indiStr.substring(index + searchCont.length);
                            indiStr = preffix + "<span>" + indiStr.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        //
                        var htmlText = '<div><a href="#ad-search-result-link" name="' + topicNo + '" title="' + topicName + '" class="h4"> ' + titleStr + '</a>'
                            + '<p>'+this.resource.DIM+'：' + dimStr + ' '+this.resource.KPI+'：' + indiStr + '</p></div>';
                        this.$('#ad-searchcont-container').append(htmlText);
                    }
                }
                this.$('[href="#ad-search-result-link"]').on("click", this.wrap(function(e){
                    this.previewTopic(e.currentTarget.name, e.currentTarget.title);
                }));
                //
                this.$('#ad-graph-container').hide();
                this.$('#ad-list-container').hide();
                this.$('#ad-homepage').hide();
                this.$('#ad-search-container').show();
            }
        },

        exitSearchMode: function () {
            this.showHomePage();
            this.$('#ad-search-input').val('');
        },

        // 点击新建主题按钮
        addTopic: function () {
            this.$('#ad-topic-list-view').hide();
            this.$('#ad-topic-edit-view').show();
            portal.require(["oss_core/pm/adhocdesigner/views/TopicMain"], this.wrap(function(topicview) {
                var view = new topicview({
                    uiContainerHeight: this.uiContainerHeight,
                    topicName: "",
                    topicNo: "",
                    classNo: this.CLASS_NO,
                    catalogList: this.catalogList[0].children,
                    detailParam: null,
                    globalVdimData:this.globalVdimData
                });
                view.render();
                this.$("#ad-topic-edit-view").html(view.$el);
                //view.afterRender();
                this.listenTo(view, 'backToListView', this.wrap(function () {
                    this.$('#ad-topic-list-view').show();
                    this.$('#ad-topic-edit-view').hide();
                    this.$("#ad-topic-edit-view").empty();
                }));
                this.listenTo(view, 'refreshTopicTree', this.wrap(function () {
                    this.initTopicTree();
                }));
            }));
        },

        // 前往编辑主题
        gotoEditTopic: function (e) {
            var topicNo = this.currPopoverTopicNo;
            var topicName = "";
            for(var i=0; i<this.topicList.length; i++){
                var topic = this.topicList[i];
                if(topic.TOPIC_NO == topicNo){
                    topic.IS_FAV = 1;
                    topicName = topic.TOPIC_NAME;
                    break;
                }
            }
            this.editTopic(topicNo, topicName);
        },

        // 预览主题
        previewTopic: function (topicNo, topicName) {
            this.$("#ad-topic-tabs").tabs("remove",this.currPopoverTopicNo);
            // 主题对应按钮操作
            this.$('#ad-topic-btngroup').show();
            this.$('#ad-topic-tabs').show();
            this.currPopoverTopicNo = topicNo;
            this.currPopoverTopicName = topicName;
            var isFav = false;
            var saveType;// 0-链接式 1-另存为式
            fish.forEach(this.topicList, this.wrap(function(topic){
                if(topic.TOPIC_NO == this.currPopoverTopicNo) {
                    if (topic.IS_FAV == 1) {
                        isFav = true;
                    }
                    saveType = topic.SAVE_TYPE;
                }
            }));
            this.updateTopicBtnState(isFav, saveType);
            var id = this.currPopoverTopicNo;
            this.$("#ad-topic-tabs").tabs("add",{id:id,active:true});
            this.$("[href=#"+id+"]").html(this.currPopoverTopicName);
            var topicNo = this.currPopoverTopicNo;
            this.currPopoverTopic = new adhocMain({
                topicNo: topicNo,
                previewType: 0
            });
            this.currPopoverTopic.render();
            // this.$("#ad-topic-list-view").hide();
            // this.$("#ad-topic-list-preview").show();
            this.$("#"+this.currPopoverTopicNo).html(this.currPopoverTopic.$el);
            this.$("#"+this.currPopoverTopicNo).height(this.leftTreeHeight-20);
            // view.showBackDesigner();
            this.listenTo(this.currPopoverTopic, 'backToDesigner', this.wrap(function () {
                this.$("#ad-topic-list-view").show();
                this.$('#ad-topic-list-preview').hide();
                this.$("#ad-topic-list-preview").empty();
            }));
        },

        updateTopicBtnState: function(isFav, saveType) {
            this.currTopicSaveType = saveType;
            if(saveType=="0"){
                this.$('.ad-topic-btngroup').hide();
                this.$('.ad-movetopic-btn').show();
                this.$('.ad-favtopic-btn').show();
                this.$('.ad-nofavtopic-btn').show();
                this.$('.ad-deltopic-btn').show();
                this.$('.ad-refreshtopic-btn').show();
            }else{
                this.$('.ad-topic-btngroup').show();
                this.$('.ad-maxium-restore-btn').hide();
            }
            if(isFav){
                this.$('.ad-favtopic-btn').hide();
                this.$('.ad-nofavtopic-btn').show();
            }else{
                this.$('.ad-favtopic-btn').show();
                this.$('.ad-nofavtopic-btn').hide();
            }
        },

        // 弹出移动主题窗口
        moveTopic: function () {
            var self = this;
            portal.require(["oss_core/pm/adhocdesigner/views/TopicMoveWin"], this.wrap(function(Dialog) {
                var sData = {
                    "topicNo": this.currPopoverTopicNo,
                    "classNo": this.CLASS_NO,
                    "catalogList": this.catalogList[0].children,
                    "topicList": this.topicList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 350,
                    height: 400
                };
                this.moveTopicView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okEvent', function (data) {
                    var classNo = data.classNo;
                    var selectedTopics =  data.selectedTopics;
                    fish.forEach(data.selectedTopics, function(movedTopic){
                        if(movedTopic.id == this.currPopoverTopicNo){
                            this.CLASS_NO = classNo;
                        }
                    });
                    data.operUser = self.userId;
                    action.moveTopic(data, function (ret) {
                        self.moveTopicView.close();
                        fish.success('Save successfully');
                        self.initTopicTree();
                    });
                });
                this.listenTo(dialog, 'cancelEvent', function () {
                    self.moveTopicView.close();
                });
            }));
        },

        showMoreBtn: function () {
            var self = this;
            var leftPosition = this.$el.parents(".tabs_nav").outerWidth()-456;
            var topPosition = this.$el.parents(".tabs_nav").outerHeight()-456-68;
            var sData = {
                leftPosition: leftPosition,
                topPosition: topPosition
            };
            portal.require(["oss_core/pm/adhocdesigner/views/MoreBtnWin"], this.wrap(function(Dialog) {
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 450,
                    height: 210,
                    modal: false
                };
                this.moreBtnView = fish.popup(option);
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
            }));
        },

        showKpiComments: function () {
            var self = this;
            var currTopic;
            fish.forEach(this.topicList, function(topic){
                if(topic.TOPIC_NO == self.currPopoverTopicNo){
                    currTopic = topic;
                }
            });
            portal.require(["oss_core/pm/adhocdesigner/views/KpiCommentsWin"], this.wrap(function(Dialog) {
                var sData = {
                    "kpiList": currTopic.INDIS
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 450,
                    height: 400
                };
                this.kpiCommentsView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'cancelEvent', function () {
                    self.kpiCommentsView.close();
                });
            }));
        },

        showSendMailCfg: function () {
            var self = this;
            portal.require(["oss_core/pm/dashboard/js/emailPlug/emailPlug"],function(emailPlug){
                emailPlug.emailConfig({
                    topicType:'00',
                    topicNo:self.currPopoverTopicNo,
                    topicName:self.currPopoverTopicName
                })
            })
        },

        showSendMailNowCfg: function () {
            var self = this;
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            var loadDataParam = new Object();
            loadDataParam.ACTION_TYPE = "loadData";
            loadDataParam.topic_no = self.currPopoverTopicNo;
            loadDataParam.chart_type = "grid";
            loadDataParam.modelCode = self.currPopoverTopic.loadDataParam.modelCode;
            loadDataParam.modelBusiCode = self.currPopoverTopic.loadDataParam.modelBusiCode;
            loadDataParam.dateGranu = self.currPopoverTopic.loadDataParam.dateGranu;
            loadDataParam.dateGranuType = self.currPopoverTopic.loadDataParam.dateGranuType;
            loadDataParam.etime = self.currPopoverTopic.loadDataParam.etime;
            loadDataParam.btime = self.currPopoverTopic.loadDataParam.btime;
            loadDataParam.selectedDimIndiList = self.currPopoverTopic.loadDataParam.selectedDimIndiList;
            loadDataParam.dimAndIndiSortList = self.currPopoverTopic.loadDataParam.dimAndIndiSortList;
            loadDataParam.allDimIndiList = self.currPopoverTopic.loadDataParam.allDimIndiList;
            loadDataParam.hideColList = [];
            loadDataParam.vdimList = self.currPopoverTopic.loadDataParam.vdimList;
            loadDataParam.sortList = [];
            loadDataParam.axisCfgSeries = "";
            loadDataParam.axisCfgXaxis = "";
            loadDataParam.topicFilterList = self.currPopoverTopic.loadDataParam.topicFilterList;
            loadDataParam.topicFilterPluginList = self.currPopoverTopic.loadDataParam.topicFilterPluginList;
            loadDataParam.chartFilterStr = "";
            loadDataParam.topn = "";
            loadDataParam.sortCol = "";
            loadDataParam.sortType = "";
            portal.require(["oss_core/pm/dashboard/js/downloadPlug/downloadPlug"],function(downloadPlug){
                downloadPlug.sendOnceEmail({
                    topicNo: self.currPopoverTopicNo,
                    topicName: self.currPopoverTopicName,
                    param:loadDataParam
                })
            });
        },

        // 共享主题配置窗口
        showShareTopicCfgWin: function () {
            var self = this;
            var share_type = "";
            var share_obj = "";
            fish.forEach(this.topicList, function(topic){
                if(self.currPopoverTopicNo == topic.TOPIC_NO){
                    share_type = topic.SHARE_TYPE;
                    share_obj = topic.SHARE_OBJ;
                }
            });
            portal.require(["oss_core/pm/adhocdesigner/views/ShareTopicCfgWin"], this.wrap(function(Dialog) {
                var sData = {
                    share_type: share_type,
                    share_obj: share_obj,
                    "topicNo": this.currPopoverTopicNo,
                    "userList": this.userList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 500,
                    height: 220
                };
                this.shareTopicCfgView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                    //topicNo: this.topicNo,
                    //shareType: this.SHARE_TYPE,
                    //selectedUsers: selectedUsers
                    fish.forEach(self.topicList, function(topic){
                        if(topic.TOPIC_NO == data.topicNo) {
                            topic.SHARE_TYPE = data.shareType;
                            topic.SHARE_OBJ = data.selectedUsers;
                        }
                    });
                    data.OPER_USER = this.userId;
                    action.shareTopic(data, function (ret) {
                        self.shareTopicCfgView.close();
                        fish.success('Save successfully');
                    });
                }));
                this.listenTo(dialog, 'cancelEvent', function () {
                    self.shareTopicCfgView.close();
                });
            }));
        },

        // 查看其他用户共享的主题的窗口
        showShareTopicViewWin: function () {
            var self = this;
            portal.require(["oss_core/pm/adhocdesigner/views/ShareTopicViewWin"], this.wrap(function(Dialog) {
                var sData = {
                    "catalogList": this.catalogList[0].children,
                    "topicList": this.topicList
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 350,
                    height: 490
                };
                this.shareTopicView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                    //classNo: classNo,
                    //saveType: this.saveType,
                    //selectedTopics: selectedTopics
                    data.OPER_USER = this.userId;
                    action.saveSharedTopic(data, function (ret) {
                        self.shareTopicView.close();
                        fish.success('Save successfully');
                        self.initTopicTree();
                    });
                }));
                this.listenTo(dialog, 'cancelEvent', function () {
                    self.shareTopicView.close();
                });
            }));
        },

        refreshTopic: function () {
            var view = new adhocMain({
                topicNo: this.currPopoverTopicNo,
                previewType: 0
            });
            view.render();
            this.$("#"+this.currPopoverTopicNo).html(view.$el);
            this.currPopoverTopic = view;
        },

        // 编辑主题
        editTopic: function (topicNo, topicName) {
            if(!this.hasLoadFinish){
                return;
            }
            this.$('#ad-topic-list-view').hide();
            this.$('#ad-topic-edit-view').show();
            var dims = [],indis = [];
            var model_code,date_gran;
            fish.forEach(this.topicList, this.wrap(function(topic){
                if(topic.TOPIC_NO == topicNo){
                    dims = topic.DIMS;
                    indis = topic.INDIS;
                    model_code = topic.MODEL_CODE;
                    date_gran = topic.DATE_GRAN;
                    this.CLASS_NO = topic.CLASS_NO;
                }
            }));
            portal.require(["oss_core/pm/adhocdesigner/views/TopicMain"], this.wrap(function(topicview) {
                var view = new topicview({
                    uiContainerHeight: this.uiContainerHeight,
                    topicName: topicName,
                    topicNo: topicNo,
                    classNo: this.CLASS_NO,
                    catalogList: this.catalogList[0].children,
                    globalVdimData:this.globalVdimData,
                    detailParam: {
                        dims: dims,
                        indis: indis,
                        modelCode: model_code,
                        granuStr: date_gran
                    }
                });
                view.render();
                this.$("#ad-topic-edit-view").html(view.$el);
                this.listenTo(view, 'backToListView', this.wrap(function () {
                    this.$('#ad-topic-list-view').show();
                    this.$('#ad-topic-edit-view').hide();
                    this.$("#ad-topic-edit-view").empty();
                }));
                this.listenTo(view, 'refreshTopicTree', this.wrap(function () {
                    this.initTopicTree();
                }));
            }));
            //
            this.addRecentViewdTopic(topicNo);
        },

        delTopic: function () {
            var self = this;
            var topicNo = this.currPopoverTopicNo;
            fish.confirm(this.resource.DELETE_TOPIC).result.then(this.wrap(function() {
                action.delTopic({
                    "OPER_USER": this.userId,
                    "SAVE_TYPE": this.currTopicSaveType,
                    "TOPIC_NO": topicNo
                }, this.wrap(function (ret) {
                    // 从主题集合中删除
                    for(var i=0;i<this.topicList.length;i++) {
                        if(topicNo == this.topicList[i].TOPIC_NO){
                            this.topicList.splice(i,1);
                            break;
                        }
                    }
                    // 从收藏夹中删除
                    fish.forEach(this.catalogList[0].children, function(catalog) {
                        var topicList = catalog.children;
                        for (var i = 0; i < topicList.length; i++) {
                            if (topicNo == topicList[i].id) {
                                topicList.splice(i, 1);
                                break;
                            }
                        }
                    });
                    this.$tree.tree("reloadData", this.catalogList);
                    this.loadTopic(this.CLASS_NO, this.CLASS_TYPE, this.nodeType);
                    this.$("#ad-topic-tabs").tabs("remove",topicNo);
                    fish.success('Success');
                    // 调用邮件发送api删除相应信息
                    action.sendMailDelete({
                        method: "delSendTopic",
                        topicType: "00",
                        topicNo: topicNo
                    },function(ret){});
                }));
            }));
        },

        addRecentViewdTopic: function (topicNo) {
            action.favTopic({
                "TOPIC_NO": topicNo,
                "CLASS_TYPE": '01',
                "OPER_USER": this.userId,
                "FAV": 1
            }, this.wrap(function (ret) {

            }));
        },

        addCatalog: function () {},

        favTopicClick: function() {
            var topicNo = this.currPopoverTopicNo;
            action.favTopic({
                "TOPIC_NO": topicNo,
                "CLASS_TYPE": '00',
                "OPER_USER": this.userId,
                "FAV": 1
            }, this.wrap(function (ret) {
                //刷新主题
                var topicName = "";
                for(var i=0; i<this.topicList.length; i++){
                    var topic = this.topicList[i];
                    if(topic.TOPIC_NO == topicNo){
                        topic.IS_FAV = 1;
                        topicName = topic.TOPIC_NAME;
                        break;
                    }
                }
                //刷新树
                this.subCatalogList[0].children.unshift(
                    {id: topicNo, name:topicName, CLASS_TYPE: "00", nodeType: 1, iconSkin: 'ico_ind'}
                );
                this.$tree.tree("reloadData", this.catalogList);
                fish.toast('success', this.resource.SUCCESS);
                this.$('[title="'+topicName+'"]').addClass('curSelectedNode');
                this.$('.ad-favtopic-btn').hide();
                this.$('.ad-nofavtopic-btn').show();
            }));
        },

        nofavTopicClick: function () {
            var topicNo = this.currPopoverTopicNo;
            if(topicNo==""){
                return;
            }
            action.favTopic({
                "TOPIC_NO": topicNo,
                "CLASS_TYPE": '00',
                "OPER_USER": this.userId,
                "FAV": 0
            }, this.wrap(function (ret) {
                //刷新主题
                var topicName = "";
                for(var i=0; i<this.topicList.length; i++){
                    var topic = this.topicList[i];
                    if(topic.TOPIC_NO == topicNo){
                        topic.IS_FAV = 0;
                        topicName = topic.TOPIC_NAME;
                        break;
                    }
                }
                //刷新树
                for(var i=0; i<this.subCatalogList[0].children.length; i++) {
                    var treenode = this.subCatalogList[0].children[i];
                    if (treenode.id == topicNo) {
                        this.subCatalogList[0].children.splice(i,1);
                        break;
                    }
                }
                this.$tree.tree("reloadData", this.catalogList);
                fish.toast('success', this.resource.SUCCESS);
                if(topicName!="") {
                    this.$('[title="' + topicName + '"]').addClass('curSelectedNode');
                }
                this.$('.ad-favtopic-btn').show();
                this.$('.ad-nofavtopic-btn').hide();
            }));
        },

        showDownloadListWin: function() {
            var self = this;
            portal.require(["oss_core/pm/dashboard/js/downloadPlug/downloadPlug"],function(downloadPlug){
                downloadPlug.downloadList()
            })
        },

        showDownloadWin: function() {
            var self = this;
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            var loadDataParam = new Object();
            loadDataParam.ACTION_TYPE = "loadData";
            loadDataParam.topic_no = self.currPopoverTopicNo;
            loadDataParam.chart_type = "grid";
            loadDataParam.modelCode = self.currPopoverTopic.loadDataParam.modelCode;
            loadDataParam.modelBusiCode = self.currPopoverTopic.loadDataParam.modelBusiCode;
            loadDataParam.dateGranu = self.currPopoverTopic.loadDataParam.dateGranu;
            loadDataParam.dateGranuType = self.currPopoverTopic.loadDataParam.dateGranuType;
            loadDataParam.etime = self.currPopoverTopic.loadDataParam.etime;
            loadDataParam.btime = self.currPopoverTopic.loadDataParam.btime;
            loadDataParam.selectedDimIndiList = self.currPopoverTopic.loadDataParam.selectedDimIndiList;
            loadDataParam.dimAndIndiSortList = self.currPopoverTopic.loadDataParam.dimAndIndiSortList;
            loadDataParam.allDimIndiList = self.currPopoverTopic.loadDataParam.allDimIndiList;
            loadDataParam.hideColList = [];
            loadDataParam.vdimList = self.currPopoverTopic.loadDataParam.vdimList;
            loadDataParam.sortList = [];
            loadDataParam.axisCfgSeries = "";
            loadDataParam.axisCfgXaxis = "";
            loadDataParam.topicFilterList = self.currPopoverTopic.loadDataParam.topicFilterList;
            loadDataParam.topicFilterPluginList = self.currPopoverTopic.loadDataParam.topicFilterPluginList;
            loadDataParam.chartFilterStr = "";
            loadDataParam.topn = "";
            loadDataParam.sortCol = "";
            loadDataParam.sortType = ""
            //portal.callService(serviceName, loadDataParam);
            portal.require(["oss_core/pm/dashboard/js/downloadPlug/downloadPlug"],function(downloadPlug){
                downloadPlug.downloadConfig({
                    topicNo: self.currPopoverTopicNo,
                    topicName: self.currPopoverTopicName,
                    param:loadDataParam
                })
            });
        },

        maxiumDisplay: function () {
            this.$('.js-ad-left').hide();
            this.$('#ad-topic-tabs .ui-tabs-nav').hide();
            this.$('.ad-maxium-btn').hide();
            this.$('.ad-maxium-restore-btn').show();
            this.resizeTopic();
        },

        restoreDisplay: function () {
            this.$('.js-ad-left').show();
            this.$('#ad-topic-tabs .ui-tabs-nav').show();
            this.$('.ad-maxium-btn').show();
            this.$('.ad-maxium-restore-btn').hide();
            this.resizeTopic()
        },

        resizeTopic: function() {
            var self = this;
            fish.forEach(this.currPopoverTopic.chartList, function(chart){
                if(chart.chart_type == "grid") {
                    chart.$('#ad-grid-container-'+chart.chart_id).jqGrid("setGridWidth", chart.$('#chart-box').width()-20);
                }else if(chart.chart_type == "pivottable") {
                    chart.$('.pvtTable').width(chart.$('#ad-chart-container-'+chart.chart_id).width());
                }else if(chart.chart_type == "kpicard") {
                    chart.updateChartHeight();
                    chart.$('[name="'+chart.chart_id+'"]').css("overflow-y", "hidden");
                }else {
                    chart.updateChartHeight();
                    chart.$('[name="'+chart.chart_id+'"]').css("overflow-y", "hidden");
                }
            });
        },

        resize: function () {
            this.uiContainerHeight = this.$el.parents(".tabs_nav").outerHeight();
            this.leftTreeHeight = this.uiContainerHeight - 78;//95
            this.$el.find("#topicTree").css({'height': +this.leftTreeHeight + 'px'});
            var height = this.uiContainerHeight - 130;
            if(this.$grid){
                this.$grid.jqGrid("setGridHeight", height);
            }
        }

    })
});
