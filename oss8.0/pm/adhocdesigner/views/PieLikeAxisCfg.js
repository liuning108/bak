/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/PieLikeAxisCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        'oss_core/pm/adhocdesigner/views/PieLikeAxisGroup'
    ],
    function(RuleMgrView, i18nData, axisCfgGroup) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.chart_type = inParam.chart_type;
                this.colModel = inParam.colModel;
                this.gridTop = inParam.gridTop;
                this.sortCol = inParam.sortCol;
                this.sortType = inParam.sortType;
                this.axisCfgXaxis = inParam.axisCfgXaxis;
                this.axisCfgYaxisList = inParam.axisCfgYaxisList;
                this.axisCfgYaxisTypeList = inParam.axisCfgYaxisTypeList;
                this.axisCfgSeries = inParam.axisCfgSeries;
                // 指标集合
                this.yAxisKpiList = [];
                // 指标主次轴类型集合
                this.yAxisTypeList = [];
                // 组集合
                this.groupList = inParam.groupList;
                this.groupCompList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.$('#ad-axisgroup-plus').on("click", this.wrap(function(){
                    this.addAxisGroup({
                        GROUP_TITLE: '',
                        DIM_NO: '',
                        KPI_NO: ''
                    });
                }));
                //
                for(var i=0;i<this.groupList.length;i++){
                    this.addAxisGroup(this.groupList[i]);
                }
            },

            addAxisGroup: function(group) {
                var axisGroup = new axisCfgGroup({
                    colModel: this.colModel,
                    group: group
                });
                this.groupCompList[this.groupCompList.length] = axisGroup;
                axisGroup.render();
                this.$('#ad-pielikeaxis-container').append(axisGroup.$el);
                //axisGroup.afterRender();
                this.listenTo(axisGroup, 'groupClose', this.wrap(function (data) {
                    this.groupClose(data.group_id);
                }));
                this.updateGroupIndex();
                if(this.chart_type=="kpicard"){
                    axisGroup.$('.axiscfg-dimselect').hide();
                }
            },

            groupClose: function (group_id) {
                console.log("groupClose");
                for (var i = 0,l = this.groupCompList.length; i < l; i++) {
                    var axisGroup = this.groupCompList[i];
                    if (axisGroup.group_id == group_id) {
                        this.groupCompList.splice(i, 1);
                        this.$("div[name="+group_id+"]").remove();
                        break;
                    }
                }
                this.updateGroupIndex();
            },

            updateGroupIndex: function() {
                for(var i=0;i<this.groupCompList.length;i++){
                    var axisGroup = this.groupCompList[i];
                    axisGroup.updateGroupIndex(i+1);
                }
            },

            fnOK: function() {
                var tmpGroupList = [];
                for(var i=0; i<this.groupCompList.length; i++){
                    var axisGroup = this.groupCompList[i];
                    tmpGroupList[tmpGroupList.length] = {
                        "GROUP_NO": axisGroup.group_index,
                        "GROUP_TITLE": axisGroup.$('#ad-axisgroupcfg-name-input').val(),
                        "DIM_NO": axisGroup.$('#ad-axisgroupcfg-dim-sel').val(),
                        "KPI_NO": axisGroup.$('#ad-axisgroupcfg-kpi-sel').val()
                    };
                }
                this.trigger('okEvent', {
                    groupList: tmpGroupList
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