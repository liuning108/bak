/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/MarklineCfg.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(RuleMgrView, i18nData, adhocUtil) {
        return fish.View.extend({

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
                        fish.toast('info', this.resource.ENTER_FIXED_VALUE);
                        return;
                    }else if(marklineType=="1" && kpiIndex==""){
                        fish.toast('info', this.resource.SELECT_CALCULATION_KPI);
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
                var self = this;
                this.$('#ad-markline-emptydiv').hide();
                require(["oss_core/inms/pm/adhocdesigner/views/Markline"], function (markline) {
                    var view = new markline({
                        kpiList: self.kpiList,
                        marklineObj: marklineObj
                    });
                    self.itemList[self.itemList.length] = view;
                    view.render();
                    self.$('#ad-markline-cfgdiv').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                    var itemLength = self.itemList.length;
                    if(itemLength>4){
                        self.$('#ad-markline-container').css('height', 200 + (itemLength-4)*45);
                    }
                    view.afterRender();
                    self.listenTo(view, 'addMarkline', function (data) {
                        self.addMarkline();
                    });
                    self.listenTo(view, 'delMarkline', function (data) {
                        self.delMarkline(data.item_id);
                    });
                });
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
