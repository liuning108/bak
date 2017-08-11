/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/CondiFmt.html',
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
                            fish.toast('info', 'Please enter a condition value');
                            return;
                        }
                        var kpiValue = kpiValue1+"~"+kpiValue2;
                    }else {
                        var kpiValue = adhocUtil.trim(this.$("#ad-fmtval-" + item_id).val());
                        if(kpiValue==''){
                            fish.toast('info', '请输入条件值');
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
                this.$('#ad-condifmt-emptydiv').hide();
                portal.require(["oss_core/pm/adhocdesigner/views/CondiFmtItem"], this.wrap(function (condiFmtItem) {
                    var view = new condiFmtItem({
                        kpiList: this.kpiList,
                        fmtObj: fmtObj
                    });
                    this.itemList[this.itemList.length] = view;
                    view.render();
                    this.$('#ad-condifmt-container').append(view.$el.find(".comprivroot > div").context.childNodes[0]);
                    var itemLength = this.itemList.length;
                    if(itemLength>4){
                        this.$('#ad-dimfilter-condi').css('height', 200 + (itemLength-4)*45);
                    }
                    view.afterRender();
                    this.listenTo(view, 'addCondifmt', this.wrap(function (data) {
                        this.addCondiFmt();
                    }));
                    this.listenTo(view, 'delCondifmt', this.wrap(function (data) {
                        this.delCondifmt(data.item_id);
                    }));
                }));
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