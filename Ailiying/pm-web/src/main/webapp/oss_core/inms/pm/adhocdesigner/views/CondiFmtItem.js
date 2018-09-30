/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/CondiFmtItem.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        'frm/fish-desktop/third-party/colorpicker/fish.colorpicker',
        'css!frm/fish-desktop/third-party/colorpicker/colorpicker.css'
    ],
    function(mainTpl, i18nData) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            "click #ad-condifmtitem-plus" : "addCondifmtItem",
            "click #ad-condifmtitem-minus" : "delCondifmtItem"
        },

        initialize: function (opt) {
            this.item_id = this.guid();
            this.kpiList = opt.kpiList;
            this.fmtObj = opt.fmtObj;
            this.kpiCode = '';// this.$("#ad-condi-kpiselect").val();
            this.kpiFmt = '';// this.$("#ad-condi-fmtselect").val();
            this.kpiValue = '';// this.$("#ad-condi-fmtvalue").val();
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({item_id: this.item_id},this.resource)));
            return this;
        },

        afterRender: function () {
            //
            var self = this;
            this.$('#ad-condifmtitem-plus').on("click", function(){
                self.addCondifmtItem();
            });
            this.$('#ad-condifmtitem-minus').on("click", function(){
                self.delCondifmtItem();
            });
            this.$('#ad-fmtsel-'+this.item_id).on("change", function(){
                self.fmtselChange();
            });
            //
            this.$("#ad-kpisel-"+this.item_id).empty();
            var selObj = this.$("#ad-kpisel-"+this.item_id);
            var listLength = this.kpiList.length;
            for(var i=0; i<listLength; i++){
                var kpi = this.kpiList[i];
                var value = kpi.KPI_INDEX;
                var text = kpi.KPI_NAME;
                selObj.append("<option value='"+value+"'>"+text+"</option>");
            }
            this.$("[name=ad-condifmt-color]").colorpicker();
            // {"KPI_CODE":"PA2EOSB00007","KPI_FMT":"EQ","KPI_VALUE":"11","KPI_COLOR":"#b06868"}
            if(this.fmtObj){
                this.$("#ad-kpisel-"+this.item_id).val(this.fmtObj.KPI_INDEX);
                this.$("#ad-fmtsel-"+this.item_id).val(this.fmtObj.KPI_FMT);
                var kpiValue = this.fmtObj.KPI_VALUE;
                if(this.fmtObj.KPI_FMT=='BT'){
                    var kpiValueArray = kpiValue.split("~");
                    this.$("#ad-fmtval-bt-"+this.item_id+"-1").val(kpiValueArray[0]);
                    this.$("#ad-fmtval-bt-"+this.item_id+"-2").val(kpiValueArray[1]);
                }else {
                    this.$("#ad-fmtval-" + this.item_id).val(kpiValue);
                }
                this.$("#ad-color-"+this.item_id).colorpicker("set", this.fmtObj.KPI_COLOR);
                this.fmtselChange();
            }
        },

        getItemData: function () {
            var kpiIndex = this.$("#ad-kpisel-"+this.item_id).val();
            var kpiFmt = this.$("#ad-fmtsel-"+this.item_id).val();
            var kpiValue = this.$("#ad-fmtval-"+this.item_id).val();
            var kpiColor = this.$("#ad-color-"+this.item_id).val();
            return {
                KPI_INDEX: kpiIndex,
                KPI_FMT: kpiFmt,
                KPI_VALUE: kpiValue,
                KPI_COLOR: kpiColor
            }
        },

        addCondifmtItem: function () {
            this.trigger("addCondifmt");
        },

        delCondifmtItem: function () {
            var dataObj = {
                item_id: this.item_id
            };
            this.trigger("delCondifmt", dataObj);
        },

        fmtselChange: function() {
            var fmtId = $('#ad-fmtsel-'+this.item_id).val();
            if(fmtId=='BT'){
                $('#ad-fmtval-container1-'+this.item_id).show();
                $('#ad-fmtval-container2-'+this.item_id).hide();
            }else{
                $('#ad-fmtval-container1-'+this.item_id).hide();
                $('#ad-fmtval-container2-'+this.item_id).show();
            }
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
});
