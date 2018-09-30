/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/CondiFmt.html',
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
                "click #ad-condifmt-ok" : "fnOK",
                "click #ad-condifmt-cancel" : "fnCancel",
                "click #ad-condifmt-plus" : "addCondiFmt"
            },

            initialize: function(inParam) {
                this.kpiList = inParam.kpiList;
                this.condiFmtItemList = inParam.condiFmtItemList;
                this.itemList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                for(var i=0; i<this.condiFmtItemList.length; i++){
                    this.addCondiFmt(this.condiFmtItemList[i]);
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var itemList = [];
                for(var i=0; i<this.itemList.length; i++){
                    var item_id = this.itemList[i].item_id;
                    var kpiIndex= this.$("#ad-kpisel-"+item_id).val();
                    var kpiFmt = this.$("#ad-fmtsel-"+item_id).val();
                    if(kpiFmt=='BT'){
                        var kpiValue1 = adhocUtil.trim(this.$("#ad-fmtval-bt-"+item_id+"-1").val());
                        var kpiValue2 = adhocUtil.trim(this.$("#ad-fmtval-bt-"+item_id+"-2").val());
                        if(kpiValue1=='' || kpiValue2==''){
                            fish.toast('info', this.resource.ENTER_CONDITION_VALUE);
                            return;
                        }
                        var kpiValue = kpiValue1+"~"+kpiValue2;
                    }else {
                        var kpiValue = adhocUtil.trim(this.$("#ad-fmtval-" + item_id).val());
                        if(kpiValue==''){
                            fish.toast('info', this.resource.ENTER_CONDITION_VALUE);
                            return;
                        }
                    }
                    var kpiColor = this.$("#ad-color-"+item_id).val();
                    itemList[itemList.length] = {
                        KPI_INDEX: kpiIndex,
                        KPI_FMT: kpiFmt,
                        KPI_VALUE: kpiValue,
                        KPI_COLOR: kpiColor
                    };
                }
                this.trigger("okEvent", {condiFmtItemList: itemList});
            },

            addCondiFmt: function(fmtObj) {
                var self = this;
                this.$('#ad-condifmt-emptydiv').hide();
                require(["oss_core/inms/pm/adhocdesigner/views/CondiFmtItem"], function (condiFmtItem) {
                    var view = new condiFmtItem({
                        kpiList: self.kpiList,
                        fmtObj: fmtObj
                    });
                    self.itemList[self.itemList.length] = view;
                    view.render();
                    self.$('#ad-condifmt-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                    var itemLength = self.itemList.length;
                    if(itemLength>4){
                        self.$('#ad-dimfilter-condi').css('height', 200 + (itemLength-4)*45);
                    }
                    view.afterRender();
                    self.listenTo(view, 'addCondifmt', function (data) {
                        self.addCondiFmt();
                    });
                    self.listenTo(view, 'delCondifmt', function (data) {
                        self.delCondifmt(data.item_id);
                    });
                });
            },

            delCondifmt: function (item_id) {
                console.log("delCondifmt");
                for (var i = 0,l = this.itemList.length; i < l; i++) {
                    var fmtItem = this.itemList[i];
                    if (fmtItem.item_id == item_id) {
                        this.itemList.splice(i, 1);
                        this.$("div[name="+item_id+"]").remove();
                    }
                }
                if(this.itemList.length==0){
                    this.$('#ad-condifmt-emptydiv').show();
                }
            },

            resize: function() {
                return this;
            }
        });
    }
);
