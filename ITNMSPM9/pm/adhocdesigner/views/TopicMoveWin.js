/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/TopicMoveWin.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.catalogList = inParam.catalogList;
                this.topicList = inParam.topicList;
                this.classNo = inParam.classNo;
                this.topicNo = inParam.topicNo;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.initCatalogSelect();
                this.reloadTopicGrid();
            },

            initCatalogSelect: function () {
                var self = this;
                this.$('#ad-topicmove-catalog-select').empty();
                for(var i=2; i<this.catalogList.length; i++) {
                    var value = this.catalogList[i].id;
                    var text = this.catalogList[i].name;
                    this.$('#ad-topicmove-catalog-select').append("<option value='"+value+"'>"+text+"</option>");
                }
                fish.forEach(this.topicList, function(topic){
                    if(topic.TOPIC_NO == self.topicNo){
                        this.$('#ad-topicmove-catalog-select').val(topic.CLASS_NO);
                    }
                });
            },

            reloadTopicGrid: function () {
                var self = this;
                var gridData = [];
                fish.forEach(this.topicList, function(topic){
                    gridData[gridData.length] = {
                        id: topic.TOPIC_NO,
                        name: topic.TOPIC_NAME
                    };
                });
                this.$("#ad-topicmove-topicgrid").jqGrid({
                    data: gridData,
                    height: 200,
                    colModel:[
                        {name:'id', width:0, key:true},
                        {name:'name', width:100, search: true, label:""}
                    ],
                    multiselect:true,
                    gridComplete: function (e) {//数据加载完成触发的事件
                        self.$("#ad-topicmove-topicgrid").jqGrid("setCheckRows",[self.topicNo],true,false);
                    }
                });
                this.$('#ad-topicmove-topicgrid').jqGrid("setGridWidth", 298);
                this.$('#ad-topicmove-topicgrid_name').hide();// 隐藏名称列头
                this.$('#ad-topicmove-topicgrid_cb').hide();// 隐藏全选框列头
                self.$("#ad-topicmove-topicgrid").jqGrid("hideCol", 'id');
                self.$('[data-toggle="searchbar"]').searchbar({target: self.$("#ad-topicmove-topicgrid")});
            },

            fnOK: function() {
                var self = this;
                var classNo = this.$('#ad-topicmove-catalog-select').val();
                var selectedTopics = this.$('#ad-topicmove-topicgrid').jqGrid("getCheckRows");
                fish.forEach(selectedTopics, function(selectedTopic){
                    var id = selectedTopic.id;
                    fish.forEach(self.topicList, function(topic){
                        if(id==topic.TOPIC_NO){
                            selectedTopic.SAVE_TYPE = topic.SAVE_TYPE;
                        }
                    });
                })
                this.trigger("okEvent", {
                    classNo: classNo,
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