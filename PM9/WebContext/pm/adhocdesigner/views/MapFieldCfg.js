/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/MapFieldCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "change #ad-mapfieldcfg-dim-select" : "xAxisDimChange",
                "click #btn-mapfieldcfg-ok" : "fnOK",
                "click #btn-mapfieldcfg-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.chart_type = inParam.chart_type;
                this.colModel = inParam.colModel;
                this.axisCfgXaxis = inParam.axisCfgXaxis;
                this.axisCfgYaxisList = inParam.axisCfgYaxisList;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                var dimSelObj = this.$("#ad-mapfieldcfg-dim-select");
                var kpiSelObj = this.$("#ad-mapfieldcfg-kpi-select");
                for(var i=0; i<this.colModel.length; i++){
                    var obj = this.colModel[i];
                    if(obj.colType == 0){
                        var value = "DIM_"+i;
                        var text = obj.label
                        dimSelObj.append("<option value='" + value + "'>" + text + "</option>");
                    }else if(obj.colType == 1){
                        var value = "KPI_"+i;
                        var text = obj.label;
                        kpiSelObj.append("<option value='" + value + "'>" + text + "</option>");
                    }
                }
                this.$('#ad-mapfieldcfg-dim-select').val(this.axisCfgXaxis);
                this.$('#ad-mapfieldcfg-kpi-select').val(this.axisCfgYaxisList[0]);
            },

            fnOK: function() {
                var axisCfgXaxis = this.$('#ad-mapfieldcfg-dim-select').val();
                var axisCfgYaxisList = [];
                axisCfgYaxisList[0] = this.$('#ad-mapfieldcfg-kpi-select').val();
                this.trigger("okEvent", {
                    axisCfgXaxis: axisCfgXaxis,
                    axisCfgYaxisList: axisCfgYaxisList
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