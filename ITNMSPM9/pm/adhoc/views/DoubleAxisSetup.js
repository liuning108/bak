/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/DoubleAxisSetup.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/slamanage'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-doubleaxis-setup-ok" : "fnOK",
                "click #ad-doubleaxis-setup-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.kpiList = inParam.kpiList;
                this.firstAxisKpiList = inParam.firstAxisKpiList;
                this.secondAxisKpiList = inParam.secondAxisKpiList;
                this.itemList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                //KPI_CODE KPI_NAME
                this.$("#ad-firstaxis-sel").empty();
                this.$("#ad-secondaxis-sel").empty();
                var selObj1 = this.$("#ad-firstaxis-sel");
                var selObj2 = this.$("#ad-secondaxis-sel");
                var listLength = this.kpiList.length;
                for(var i=0; i<listLength; i++){
                    var kpiObj = this.kpiList[i];
                    var value = kpiObj.colIndex;
                    var text = kpiObj.colName;
                    selObj1.append("<option value='"+value+"'>"+text+"</option>");
                    selObj2.append("<option value='"+value+"'>"+text+"</option>");
                }
                //
                this.$firstaxis = this.$('#ad-firstaxis-sel').multiselect({
                    createItem: function (e, item) {
                        console.log('new item created:', item);
                    }
                });
                this.$secondaxis = this.$('#ad-secondaxis-sel').multiselect({
                    createItem: function (e, item) {
                        console.log('new item created:', item);
                    }
                });
                this.$firstaxis.multiselect('value', this.firstAxisKpiList);
                this.$secondaxis.multiselect('value', this.secondAxisKpiList);
            },

            resize: function() {

            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                this.firstAxisKpiList = this.$firstaxis.multiselect('value');
                this.secondAxisKpiList = this.$secondaxis.multiselect('value');
                this.trigger("okEvent", {
                    firstAxisKpiList: this.firstAxisKpiList,
                    secondAxisKpiList: this.secondAxisKpiList
                });
            }
        });
    }
);