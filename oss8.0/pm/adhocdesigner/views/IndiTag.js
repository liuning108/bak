/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/IndiTag.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, i18nData, Draggabilly) {
        return portal.BaseView.extend({
            reportMainTemplate: fish.compile(mainTpl),
            resource: fish.extend({}, i18nData),
            events: {
                'click #ad-indi-setup-btn': "showIndiSetup"
            },

            initialize: function (opt) {
                this.tag_id = this.guid();
                this.dragNode = opt.dragNode;
                this.formatObj = {};
                this.formatObj.tagName = this.dragNode.name;
                this.tagName = this.dragNode.name;
                this.formatObj.tagAlias = "";
                this.formatObj.tagDesc = "";
                this.formatObj.displayType = 0;
                this.formatObj.precision = 2;
                this.formatObj.isThousandDisplay = true;
                this.formatObj.showUnit = false;
                this.formatObj.calculateFormat = "";
                this.tagAlias = "";
                this.tagDesc = "";
                this.formatObj.agType = "";// 聚合方式
                this.formatObj.sortType = "";// 排序类型
                this.$draggable;
                this.source_x;
                this.source_y;
            },

            render: function () {
                this.$el.html(this.reportMainTemplate(fish.extend(this.resource,{tagName: this.formatObj.tagName,nodeName: this.tag_id})));
                return this;
            },

            afterRender: function () {
                var self = this;
                var that = this;
                this.$("#ad-indi-setup-btn").off();
                this.$("#ad-indi-setup-btn").on("click", function(){
                    self.showIndiSetup();
                });
                this.$("#ad-kpiag-sum-"+this.tag_id).off();
                this.$("#ad-kpiag-sum-"+this.tag_id).on("click", function(){
                    self.agSum();
                });
                //
                this.$("#ad-kpiag-count-"+this.tag_id).off();
                this.$("#ad-kpiag-count-"+this.tag_id).on("click", function(){
                    self.agCount();
                });
                //
                this.$("#ad-kpiag-avg-"+this.tag_id).off();
                this.$("#ad-kpiag-avg-"+this.tag_id).on("click", function(){
                    self.agAvg();
                });
                //
                this.$("#ad-kpiag-max-"+this.tag_id).off();
                this.$("#ad-kpiag-max-"+this.tag_id).on("click", function(){
                    self.agMax();
                });
                //
                this.$("#ad-kpiag-min-"+this.tag_id).off();
                this.$("#ad-kpiag-min-"+this.tag_id).on("click", function(){
                    self.agMin();
                });
                //
                this.$("#ad-kpisort-asc-"+this.tag_id).off();
                this.$("#ad-kpisort-asc-"+this.tag_id).on("click", function(){
                    self.sortAsc();
                });
                //
                this.$("#ad-kpisort-desc-"+this.tag_id).off();
                this.$("#ad-kpisort-desc-"+this.tag_id).on("click", function(){
                    self.sortDesc();
                });
                //
                if(this.$(".ad-tags")[0]) {
                    this.$draggable = new Draggabilly(this.$('[name="'+this.tag_id+'"]')[0]);
                    this.$draggable.on('dragStart', this.onDragStart.bind(that));
                    this.$draggable.on('dragEnd', this.onDragEnd.bind(that));
                    this.$draggable.on('dragMove', this.onDragMove.bind(that));
                }
            },

            // 聚合方式Sum
            agSum: function () {
                this.clearLiActive();
                if(this.formatObj.agType!="Sum") {
                    this.formatObj.agType = "Sum";
                    $("#ad-kpiag-sum-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.agType = "";
                }
                this.changeAgType();
            },

            agCount: function () {
                this.clearLiActive();
                if(this.formatObj.agType!="Count") {
                    this.formatObj.agType = "Count";
                    $("#ad-kpiag-count-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.agType = "";
                }
                this.changeAgType();
            },

            agAvg: function () {
                this.clearLiActive();
                if(this.formatObj.agType!="Avg") {
                    this.formatObj.agType = "Avg";
                    $("#ad-kpiag-avg-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.agType = "";
                }
                this.changeAgType();
            },

            agMax: function () {
                this.clearLiActive();
                if(this.formatObj.agType!="Max") {
                    this.formatObj.agType = "Max";
                    $("#ad-kpiag-max-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.agType = "";
                }
                this.changeAgType();
            },

            agMin: function () {
                this.clearLiActive();
                if(this.formatObj.agType!="Min") {
                    this.formatObj.agType = "Min";
                    $("#ad-kpiag-min-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.agType = "";
                }
                this.changeAgType();
            },

            sortAsc: function () {
                this.clearSortLiActive();
                if(this.formatObj.sortType!="asc") {
                    this.formatObj.sortType = "asc";
                    $("#ad-kpisort-asc-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.sortType = "";
                }
                this.changeSortType();
            },

            sortDesc: function () {
                this.clearSortLiActive();
                if(this.formatObj.sortType!="desc") {
                    this.formatObj.sortType = "desc";
                    $("#ad-kpisort-desc-li-" + this.tag_id).addClass("active");
                }else{
                    this.formatObj.sortType = "";
                }
                this.changeSortType();
            },

            changeAgType: function () {
                if(this.formatObj.agType!=""){
                    $('#ad-kpiag-tag-'+this.tag_id).text("("+this.formatObj.agType+")");
                    $("#ad-kpiag-"+this.formatObj.agType+"-li-" + this.tag_id).addClass("active");
                }else{
                    $('#ad-kpiag-tag-'+this.tag_id).text("");
                }
            },

            changeSortType: function () {
                var sortType = this.formatObj.sortType;
                if(sortType!=""){
                    if(sortType=="asc"){
                        $('#ad-kpisort-tag-'+this.tag_id).text("(Asc)");
                    }else{
                        $('#ad-kpisort-tag-'+this.tag_id).text("(Desc)");
                    }
                    $("#ad-kpisort-"+this.formatObj.sortType+"-li-" + this.tag_id).addClass("active");
                }else{
                    $('#ad-kpisort-tag-'+this.tag_id).text("");
                }
            },

            clearLiActive: function () {
                $("#ad-kpiag-Sum-li-"+this.tag_id).removeClass("active");
                $("#ad-kpiag-Count-li-"+this.tag_id).removeClass("active");
                $("#ad-kpiag-Avg-li-"+this.tag_id).removeClass("active");
                $("#ad-kpiag-Max-li-"+this.tag_id).removeClass("active");
                $("#ad-kpiag-Min-li-"+this.tag_id).removeClass("active");
            },

            clearSortLiActive: function () {
                $("#ad-kpisort-asc-li-"+this.tag_id).removeClass("active");
                $("#ad-kpisort-desc-li-"+this.tag_id).removeClass("active");
            },

            onDragStart: function ( event, pointer ) {

            },
            onDragEnd: function ( t, t ) {
                if(this.source_y<-35 || this.source_y>30){
                    this.removeTag(this.tag_id);
                }else{
                    this.restoreTag(this.tag_id);
                }
            },
            onDragMove: function ( t, e, n ) {
                this.source_x = n.x;
                this.source_y = n.y;
                console.log("indi onDragMove :"+this.source_y);
            },

            showIndiSetup: function () {
                portal.require([
                    'oss_core/pm/adhocdesigner/views/IndiSetup'
                ], this.wrap(function (Dialog) {
                    var sData = this.formatObj;
                    var dialog = new Dialog({
                        "calculateFormat": sData.calculateFormat,
                        "displayType": sData.displayType,
                        "isThousandDisplay": sData.isThousandDisplay,
                        "precision": sData.precision,
                        "showUnit": sData.showUnit,
                        "agType": sData.agType,
                        "sortType": sData.sortType,
                        "tagDesc": sData.tagDesc,
                        "calculateFormat": sData.calculateFormat,
                        "tagAlias": sData.tagAlias
                    });
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 550,
                        height: 425
                    };
                    this.indiSetUpView = fish.popup(option);
                    dialog.afterRender();
                    this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                        this.tagAlias = data.tagAlias;
                        this.tagDesc = data.tagDesc;
                        this.formatObj = data;
                        this.refreshTag(this.tag_id);
                        this.indiSetUpView.close();
                    }));
                    this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                        this.indiSetUpView.close();
                    }));
                }));
            },

            refreshTag: function (tag_id) {
                if(this.formatObj.tagAlias!=''){
                    $("[name='"+tag_id+"'] > button > span").eq(0).text(this.formatObj.tagAlias);
                    this.dragNode.name = this.formatObj.tagAlias;
                }else{
                    $("[name='"+tag_id+"'] > button > span").eq(0).text(this.tagName);
                    this.dragNode.name = this.tagName;
                }
                if(this.formatObj.agType!=''){
                    this.changeAgType();
                }
                if(this.formatObj.sortType!=''){
                    this.changeSortType();
                }
                this.trigger("refreshDimKpiTagName");
            },

            removeTag: function (tag_id) {
                var dataObj = {
                    tag_id: tag_id
                };
                this.trigger('removeIndiTag', dataObj);
            },

            restoreTag: function (tag_id) {
                var dataObj = {
                    tag_id: tag_id
                };
                this.trigger('restoreIndiTag', dataObj);
            },

            guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            },

            resize: function () {

            }
        })
    }
);
