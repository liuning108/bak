/**
 * 指标筛选弹出窗
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/IndiFilter.html',
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
                "change #ad-indifilter-fmtsel" : "fmtselChange",
                "click #ad-btn-ok" : "fnOK",
                "click #ad-btn-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.inParam = inParam;
                this.KPI_CODE = inParam.DIM_CODE;
                this.KPI_NAME = inParam.DIM_NAME;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(fish.extend(this.resource,{KPI_NAME: this.KPI_NAME})));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                if(this.inParam.filterOperList.length>0){
                    var fmtId = this.inParam.filterOperList[0].type;
                    var condiValue = this.inParam.filterOperList[0].value;
                    this.$('#ad-indifilter-fmtsel').val(fmtId);
                    if(fmtId=='BT'){
                        var valueArray = condiValue.split("~");
                        this.$('#ad-indifilter-condivalue-bt-1').val(valueArray[0]);
                        this.$('#ad-indifilter-condivalue-bt-2').val(valueArray[1]);
                    }else{
                        this.$('#ad-indifilter-condivalue').val(condiValue);
                    }
                    this.fmtselChange();
                }
            },

            fmtselChange: function() {
                var fmtId = this.$('#ad-indifilter-fmtsel').val();
                if(fmtId=='BT'){
                    this.$('#ad-if-condivalue-container1').show();
                    this.$('#ad-if-condivalue-container2').hide();
                }else{
                    this.$('#ad-if-condivalue-container1').hide();
                    this.$('#ad-if-condivalue-container2').show();
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var condiValue = adhocUtil.trim(this.$('#ad-indifilter-condivalue').val());
                var condivalue_bt_1 = adhocUtil.trim(this.$('#ad-indifilter-condivalue-bt-1').val());
                var condivalue_bt_2 = adhocUtil.trim(this.$('#ad-indifilter-condivalue-bt-2').val());
                var fmtId = this.$('#ad-indifilter-fmtsel').val();
                if(fmtId=='BT' && (condivalue_bt_1=='' || condivalue_bt_2=='')){
                    fish.toast('info', this.resource.FILTER_VALUE_NOT_EMPTY);
                }else if(fmtId!='BT' && condiValue==''){
                    fish.toast('info', this.resource.FILTER_VALUE_NOT_EMPTY);
                }else {
                    var fmtName = adhocUtil.mappingFilterFormatterName(fmtId);
                    if(fmtId=='BT'){
                        var filterList = [
                            {type: fmtId, name: fmtName, value: condivalue_bt_1+"~"+condivalue_bt_2}
                        ];
                    }else{
                        var filterList = [
                            {type: fmtId, name: fmtName, value: condiValue}
                        ];
                    }
                    filterType = 1;
                    this.trigger("okIndiFilterEvent", {
                        FILTER_TYPE: filterType,
                        DIM_CODE: this.KPI_CODE,
                        DIM_NAME: this.KPI_NAME,
                        selectedList: filterList,
                        filterOperList: filterList
                    });
                }
            },

            resize: function() {
                return this;
            }
        });
    }
);
