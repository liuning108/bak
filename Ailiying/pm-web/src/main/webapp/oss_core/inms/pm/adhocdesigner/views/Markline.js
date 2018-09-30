/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/Markline.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(mainTpl, i18nData) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
        },

        initialize: function (opt) {
            this.item_id = this.guid();
            this.kpiList = opt.kpiList;
            this.marklineObj = opt.marklineObj;
            this.marklineType = '';// this.$("#ad-markline-type-").val();
            this.staticValue = '0';// this.$("#ad-markline-staticvalue-").val();
            this.kpiIndex = '';// this.$("#ad-markline-kpisel-").val();
            this.kpiType = '';// this.$("#ad-markline-kpitype-").val();
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend(this.resource,{item_id: this.item_id})));
            return this;
        },

        afterRender: function () {
            var self = this;
            this.$('#ad-markline-plus').on("click", function(){
                self.addMarkline();
            });
            this.$('#ad-markline-minus').on("click", function(){
                self.delMarkline();
            });
            this.$('#ad-markline-type-'+this.item_id).on("change", function(){
                self.marklineTypeChange();
            });
            //
            this.$("#ad-markline-kpisel-"+this.item_id).empty();
            var selObj = this.$("#ad-markline-kpisel-"+this.item_id);
            var listLength = this.kpiList.length;
            for(var i=0; i<listLength; i++){
                var kpi = this.kpiList[i];
                var value = kpi.KPI_INDEX;
                var text = kpi.KPI_NAME;
                selObj.append("<option value='"+value+"'>"+text+"</option>");
            }
            if(this.marklineObj && this.marklineObj.MARKLINE_TYPE){
                this.$("#ad-markline-type-"+this.item_id).val(this.marklineObj.MARKLINE_TYPE);
                this.$("#ad-markline-staticvalue-"+this.item_id).val(this.marklineObj.STATIC_VALUE);
                this.$("#ad-markline-kpisel-"+this.item_id).val(this.marklineObj.KPI_INDEX);
                this.$("#ad-markline-kpitype-"+this.item_id).val(this.marklineObj.KPI_TYPE);
                this.marklineTypeChange();
            }
        },

        getItemData: function () {
            var kpiIndex = this.$("#ad-markline-kpisel-"+this.item_id).val();
            var kpiFmt = this.$("#ad-markline-kpicfg-"+this.item_id).val();
            var kpiValue = this.$("#ad-fmtval-"+this.item_id).val();
            return {
                KPI_INDEX: kpiIndex,
                KPI_FMT: kpiFmt,
                KPI_VALUE: kpiValue
            }
        },

        addMarkline: function () {
            this.trigger("addMarkline");
        },

        delMarkline: function () {
            var dataObj = {
                item_id: this.item_id
            };
            this.trigger("delMarkline", dataObj);
        },

        marklineTypeChange: function() {
            var typeId = $('#ad-markline-type-'+this.item_id).val();
            // 0固定值 1计算值
            if(typeId=='0'){
                $('#ad-markline-sv-container-'+this.item_id).show();
                $('[name="ad-markline-kpicfg-'+this.item_id+'"]').hide();
            }else{
                $('#ad-markline-sv-container-'+this.item_id).hide();
                $('[name="ad-markline-kpicfg-'+this.item_id+'"]').show();
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
