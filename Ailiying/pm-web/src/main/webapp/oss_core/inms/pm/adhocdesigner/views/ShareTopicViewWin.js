/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/ShareTopicViewWin.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(ShareTopicView, action, i18nData) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(ShareTopicView),

            events : {
                "click #ad-sharetopicview-default" : "saveTypeSelect",
                "click #ad-sharetopicview-simple" : "saveTypeSelect",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.userId = portal.appGlobal.get("userId");
                this.catalogList = inParam.catalogList;
                this.topicList = inParam.topicList;
                this.saveType = 0;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.initCatalogSelect();
                this.loadTopicGrid();
            },

            initCatalogSelect: function () {
                this.$('#ad-sharetopicview-catalog-select').empty();
                for(var i=2; i<this.catalogList.length; i++) {
                    var value = this.catalogList[i].id;
                    var text = this.catalogList[i].name;
                    this.$('#ad-sharetopicview-catalog-select').append("<option value='"+value+"'>"+text+"</option>");
                }
            },

            loadTopicGrid: function () {
                var self = this;
                action.loadSharedTopicList(function(data){
                    var gridData = [];
                    fish.forEach(data, function(topic){
                        gridData[gridData.length] = {
                            id: topic.TOPIC_NO,
                            name: topic.TOPIC_NAME
                        };
                    });
                    self.$("#ad-sharetopicview-grid").jqGrid({
                        data: gridData,
                        height: 190,
                        colModel:[
                            {name:'id', width:0, key:true},
                            {name:'name', width:100, search: true, label:""}
                        ],
                        multiselect:true
                    });
                    self.$('#ad-sharetopicview-grid').jqGrid("setGridWidth", 298);
                    self.$('#ad-sharetopicview-grid_name').hide();// 隐藏名称列头
                    self.$('#ad-sharetopicview-grid_cb').hide();// 隐藏全选框列头
                    self.$("#ad-sharetopicview-grid").jqGrid("hideCol", 'id');
                    self.$('[data-toggle="searchbar"]').searchbar({target: self.$("#ad-sharetopicview-grid")});
                });
            },

            saveAsLinkSelect: function () {
                this.saveType = 0;
                this.$('.sharetopicview-pd').removeClass('active ');
                this.$('#ad-sharetopicview-default').addClass('active ');
                this.$('.ico-sheet-active').removeClass("ng-hide");
                this.$('#ad-sharetopicview-simple-selected-icon').addClass('ng-hide ');
            },

            saveAsSelect: function () {
                this.saveType = 1;
                this.$('.sharetopicview-pd').removeClass('active ');
                this.$('#ad-sharetopicview-simple').addClass('active ');
                this.$('.ico-sheet-active').removeClass("ng-hide");
                this.$('#ad-sharetopicview-default-selected-icon').addClass('ng-hide ');
            },

            saveTypeSelect: function (e) {
                var id = e.currentTarget.id;
                if(id=="ad-sharetopicview-default"){
                    this.saveAsLinkSelect();
                }else{
                    this.saveAsSelect();
                }
            },

            fnOK: function() {
                var self = this;
                var classNo = this.$('#ad-sharetopicview-catalog-select').val();
                var selectedTopics = this.$('#ad-sharetopicview-grid').jqGrid("getCheckRows");
                if(this.saveType=="0"){
                    for(var i=0;i<selectedTopics.length;i++){
                        var selectedTopic = selectedTopics[i];
                        for(var j=0;j<this.topicList.length;j++){
                            var topic = this.topicList[j];
                            if(topic.TOPIC_NO==selectedTopic.id && topic.SAVE_TYPE=="0"){
                                fish.toast('info', topic.TOPIC_NAME + ' ' + this.resource.HAS_BEEN_SAVEDAS_LINK);
                                return;
                            }
                        }

                    };
                }
                this.trigger("okEvent", {
                    classNo: classNo,
                    saveType: this.saveType,
                    selectedTopics: selectedTopics
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
