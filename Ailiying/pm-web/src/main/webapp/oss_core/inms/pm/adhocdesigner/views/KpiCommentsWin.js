/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/KpiCommentsWin.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, action, i18nData) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-kpicomm-close" : "fnCancel"
            },

            initialize: function(inParam) {
                this.kpiList = inParam.kpiList;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                var kpiCodes = "";
                for(var i=0; i<this.kpiList.length; i++){
                    var kpiObject = this.kpiList[i];
                    var kpi_code = kpiObject.KPI_CODE;
                    var kpi_name = kpiObject.KPI_NAME;
                    //
                    if(i!=this.kpiList.length-1){
                        kpiCodes += kpi_code + ",";
                        var htmlText = '<h4 class="text-primary">'+kpi_name+'</h4>'
                            + '<p style="word-break:break-all; width:390px;" id="ad-kpicomments-'+kpi_code+'"></p><hr>';
                    }else{
                        kpiCodes += kpi_code;
                        var htmlText = '<h4 class="text-primary">'+kpi_name+'</h4>'
                            + '<p style="word-break:break-all; width:390px;" id="ad-kpicomments-'+kpi_code+'"></p>';
                    }
                    this.$('#ad-kpicomments-container').append(htmlText);
                }
                action.queryKpiComments({
                    kpiCodes: kpiCodes
                },function(ret){
                    fish.forEach(self.kpiList, function(kpi){
                        fish.forEach(ret.kpiList, function(allkpi){
                            if(allkpi.KPI_CODE == kpi.KPI_CODE){
                                self.$('#ad-kpicomments-'+kpi.KPI_CODE).html(fish.escape(allkpi.COMMENTS).replace(/\n/g,'<br/>'));
                            }
                        });
                    });
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
