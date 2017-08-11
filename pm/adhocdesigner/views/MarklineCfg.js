/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/MarklineCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/slamanage',
        "oss_core/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(RuleMgrView, i18nData, adhocUtil) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-markline-ok" : "fnOK",
                "click #ad-markline-cancel" : "fnCancel",
                "click #ad-markline-empty-plus" : "addMarkline"
            },

            initialize: function(inParam) {
                this.kpiList = inParam.kpiList;
                this.marklineList = inParam.marklineList;
                this.itemList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                for(var i=0; i<this.marklineList.length; i++){
                    this.addMarkline(this.marklineList[i]);
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var itemList = [];
                for(var i=0; i<this.itemList.length; i++){
                    var item_id = this.itemList[i].item_id;
                    var marklineType = this.$("#ad-markline-type-"+item_id).val();
                    var staticValue = adhocUtil.trim(this.$("#ad-markline-staticvalue-"+item_id).val());
                    var kpiIndex= this.$("#ad-markline-kpisel-"+item_id).val();
                    var kpiType = this.$("#ad-markline-kpitype-"+item_id).val();
                    if(marklineType=="0" && staticValue==""){
                        fish.toast('info', 'Please enter a fixed value');
                        return;
                    }else if(marklineType=="1" && kpiIndex==""){
                        fish.toast('info', 'Please select the calculation kpi');
                        return;
                    }
                    itemList[itemList.length] = {
                        MARKLINE_TYPE: marklineType,
                        STATIC_VALUE: staticValue,
                        KPI_INDEX: kpiIndex,
                        KPI_TYPE: kpiType
                    };
                }
                this.trigger("okEvent", {marklineList: itemList});
            },

            addMarkline: function(marklineObj) {
                this.$('#ad-markline-emptydiv').hide();
                portal.require(["oss_core/pm/adhocdesigner/views/Markline"], this.wrap(function (markline) {
                    var view = new markline({
                        kpiList: this.kpiList,
                        marklineObj: marklineObj
                    });
                    this.itemList[this.itemList.length] = view;
                    view.render();
                    this.$('#ad-markline-cfgdiv').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                    var itemLength = this.itemList.length;
                    if(itemLength>4){
                        this.$('#ad-markline-container').css('height', 200 + (itemLength-4)*45);
                    }
                    view.afterRender();
                    this.listenTo(view, 'addMarkline', this.wrap(function (data) {
                        this.addMarkline();
                    }));
                    this.listenTo(view, 'delMarkline', this.wrap(function (data) {
                        this.delMarkline(data.item_id);
                    }));
                }));
            },

            delMarkline: function (item_id) {
                for (var i = 0,l = this.itemList.length; i < l; i++) {
                    var fmtItem = this.itemList[i];
                    if (fmtItem.item_id == item_id) {
                        this.itemList.splice(i, 1);
                        this.$("div[name="+item_id+"]").remove();
                    }
                }
                if(this.itemList.length==0){
                    this.$('#ad-markline-emptydiv').show();
                }
            },

            resize: function() {
                return this;
            }
        });
    }
);