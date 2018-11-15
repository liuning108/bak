/**
 *
 */
define([
        'text!oss_core/inms/pm/alarmtemplate/templates/alarm/AlarmGenerateItem.html',
        'oss_core/inms/pm/alarmtemplate/views/TemplateUtil',
        'oss_core/inms/pm/util/views/Util'
    ],
    function(mainTpl, tplUtil, pmUtil) {
    return portal.BaseView.extend({

        alarmGenerateItemTpl: fish.compile(mainTpl),
        events: {

        },

        initialize: function (opt) {
            if(opt.rule_dt_id){
                this.rule_dt_id = opt.rule_dt_id;
            }else{
                this.rule_dt_id = tplUtil.guid();
            }
            this.alarm_level_id = opt.alarm_level_id;
            this.kpi_list = opt.kpi_list;
            this.rule_type = opt.rule_type;
            this.OPER_TYPE_LIST = pmUtil.paravalue("ALARM_RULE_OPER_TYPE");
            this.THRESHOLD_TYPE_LIST = pmUtil.paravalue("ALARM_RULE_THRESHOLD_TYPE");
            this.THRESHOLD_VALUE1_LIST = pmUtil.paravalue("ALARM_RULE_THRESHOLD_VALUE1");
            this.THRESHOLD_VALUE2_LIST = pmUtil.paravalue("ALARM_RULE_THRESHOLD_VALUE2");
            this.THRESHOLD_VALUE5_LIST = pmUtil.paravalue("ALARM_RULE_THRESHOLD_VALUE5");
        },

        render: function () {
            this.$el.html(this.alarmGenerateItemTpl(fish.extend({rule_dt_id: this.rule_dt_id})));
            return this;
        },

        afterRender: function () {
            var self = this;
            this.$kpi_code_combobox = this.$el.find("[name=KPI_CODE_" + this.rule_dt_id + "]").combobox({
                dataValueField: "KPI_CODE",
                dataTextField: "KPI_NAME",
                dataSource: this.kpi_list
            });
            if(this.kpi_list && this.kpi_list.length>0){
                this.$kpi_code_combobox.combobox('value', this.kpi_list[0].KPI_CODE);
            }
            //
            this.$threshold_type_combobox = this.$el.find("[name=THRESHOLD_TYPE_" + this.rule_dt_id + "]").combobox({
                dataValueField: "PARA_VALUE",
                dataTextField: "PARA_NAME",
                dataSource: this.THRESHOLD_TYPE_LIST
            });
            this.$threshold_type_combobox.combobox('value', '00');
            this.$threshold_type_combobox.on('combobox:change', function(e){
                this.changeThresholdType(e.currentTarget.value);
            }.bind(this));
            //
            this.$threshold_value1_combobox = this.$el.find("[name=THRESHOLD_VALUE_01_" + this.rule_dt_id + "]").combobox({
                dataValueField: "PARA_VALUE",
                dataTextField: "PARA_NAME",
                dataSource: this.THRESHOLD_VALUE1_LIST
            });
            this.$threshold_value1_combobox.combobox('value', this.THRESHOLD_VALUE1_LIST[0].PARA_VALUE);
            this.$threshold_value2_combobox = this.$el.find("[name=THRESHOLD_VALUE2_01_" + this.rule_dt_id + "]").combobox({
                dataValueField: "PARA_VALUE",
                dataTextField: "PARA_NAME",
                dataSource: this.THRESHOLD_VALUE2_LIST
            });
            this.$threshold_value2_combobox.combobox('value', this.THRESHOLD_VALUE2_LIST[0].PARA_VALUE);
            //
            this.$threshold_value5_combobox = this.$el.find("[name=THRESHOLD_VALUE5_01_" + this.rule_dt_id + "]").combobox({
                dataValueField: "PARA_VALUE",
                dataTextField: "PARA_NAME",
                dataSource: this.THRESHOLD_VALUE5_LIST
            });
            this.$threshold_value5_combobox.combobox('value', this.THRESHOLD_VALUE5_LIST[0].PARA_VALUE);
            //
            this.$oper_type_combobox = this.$el.find("[name=OPER_TYPE_" + this.rule_dt_id + "]").combobox({
                dataValueField: "PARA_VALUE",
                dataTextField: "PARA_NAME",
                dataSource: this.OPER_TYPE_LIST
            });
            this.$oper_type_combobox.combobox('value', '00');
            this.$oper_type_combobox.on('combobox:change', function(e){
                this.changeOperType(e.currentTarget.value);
            }.bind(this));
            //
            this.$('#tplmgr-alarmgenerateitem-add').on("click", function(){
                self.addAlarmGenerateItem();
            });
            this.$('#tplmgr-alarmgenerateitem-remove').on("click", function(){
                self.delAlarmGenerateItem();
            });
        },

        changeOperType: function(oper_type) {
            if(oper_type=="04"){// 当条件为振幅(基线)时 阈值类型自动切换为动态
                $("[name=THRESHOLD_TYPE_" + this.rule_dt_id + "]").combobox('value', '01');
                $("[name=THRESHOLD_TYPE_" + this.rule_dt_id + "]").combobox('disable');
            }else{
                $("[name=THRESHOLD_TYPE_" + this.rule_dt_id + "]").combobox('enable');
            }
        },

        changeThresholdType: function(threshold_type) {
            if(threshold_type=="00"){// 静态
                $("[name=THRESHOLD_VALUE_DIV_01_" + this.rule_dt_id + "]").hide();
                $("[name=THRESHOLD_VALUE5_DIV_01_" + this.rule_dt_id + "]").hide();
                $("[name=THRESHOLD_VALUE_DIV_00_" + this.rule_dt_id + "]").show();
            }else if(threshold_type=="01") {// 动态
                $("[name=THRESHOLD_VALUE_DIV_01_" + this.rule_dt_id + "]").show();
                $("[name=THRESHOLD_VALUE5_DIV_01_" + this.rule_dt_id + "]").show();
                $("[name=THRESHOLD_VALUE_DIV_00_" + this.rule_dt_id + "]").hide();
            }
        },

        updateKpiList: function(kpiList) {
            this.kpi_list = kpiList;
            var kpi_code = $("[name=KPI_CODE_" + this.rule_dt_id + "]").val();
            this.$kpi_code_combobox.combobox('destroy');
            this.$kpi_code_combobox = $("[name=KPI_CODE_" + this.rule_dt_id + "]").combobox({
                dataValueField: "KPI_CODE",
                dataTextField: "KPI_NAME",
                dataSource: kpiList
            });
            this.$kpi_code_combobox.combobox('value', kpi_code);
        },

        getItemDetail: function() {
            var retObj = {
                RULE_TYPE: this.rule_type,
                RULE_DT_ID: this.rule_dt_id,
                ALARM_LEVEL: this.alarm_level_id,
                KPI_CODE: $("[name=KPI_CODE_" + this.rule_dt_id + "]").val(),
                KPI_MATH: $("[name=KPI_CODE_" + this.rule_dt_id + "]").val(),
                OPER_TYPE: $("[name=OPER_TYPE_" + this.rule_dt_id + "]").val()
            };
            var threshold_type = $("[name=THRESHOLD_TYPE_" + this.rule_dt_id + "]").val();
            retObj["THRESHOLD_TYPE"] = threshold_type;
            if(threshold_type == "00"){
                retObj["THRESHOLD_VALUE3"] = $("[name=THRESHOLD_VALUE3_00_" + this.rule_dt_id + "]").val();
                retObj["THRESHOLD_VALUE4"] = $("[name=THRESHOLD_VALUE4_00_" + this.rule_dt_id + "]").val();
            }else{
                retObj["THRESHOLD_VALUE"] = $("[name=THRESHOLD_VALUE_01_" + this.rule_dt_id + "]").val();
                retObj["THRESHOLD_VALUE2"] = $("[name=THRESHOLD_VALUE2_01_" + this.rule_dt_id + "]").val();
                retObj["THRESHOLD_VALUE3"] = $("[name=THRESHOLD_VALUE3_01_" + this.rule_dt_id + "]").val();
                retObj["THRESHOLD_VALUE4"] = $("[name=THRESHOLD_VALUE4_01_" + this.rule_dt_id + "]").val();
                retObj["THRESHOLD_VALUE5"] = $("[name=THRESHOLD_VALUE5_01_" + this.rule_dt_id + "]").val();
            }
            return retObj;
        },

        addAlarmGenerateItem: function () {
            var dataObj = {
                rule_type: this.rule_type,
                alarm_level_id: this.alarm_level_id
            };
            this.trigger("addAlarmGenerateItem", dataObj);
        },

        delAlarmGenerateItem: function () {
            var dataObj = {
                rule_dt_id: this.rule_dt_id
            };
            this.trigger("delAlarmGenerateItem", dataObj);
        },

        resize: function () {

        }

    })
});
