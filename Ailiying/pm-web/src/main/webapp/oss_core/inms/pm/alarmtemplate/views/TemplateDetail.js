/**
 *
 */
define([
	'text!oss_core/inms/pm/alarmtemplate/templates/TemplateDetail.html',
    'text!oss_core/inms/pm/alarmtemplate/templates/alarm/AlarmLevelTab.html',
    'oss_core/inms/pm/alarmtemplate/views/AlarmGenerateItem',
    'oss_core/inms/pm/alarmtemplate/actions/TemplateMgrAction',
    'oss_core/inms/pm/alarmtemplate/views/TemplateUtil',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql',
	'css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css'
    ],
    function(detailTpl, alarmLevelTabTpl, alarmGenerateItem, action, tplUtil, codemirror){
	return portal.BaseView.extend({

        className : "ui-dialog dialog",
        alarmLevelTab: fish.compile(alarmLevelTabTpl),
		template: fish.compile(detailTpl),

		events: {
          //"click .js-nav-tabs": 'clickNavTabs',
			"click .js-ok" : "ok",
			"click .js-adapter-previous-btn" : "previousTab",
			"click .js-adapter-next-btn": "nextTab",
            "click .js-alarm-action-switch": "alarmActionSwitch",
            "click .js-alarm-rule-switch": "alarmRuleStateSwitch",
            "click .js-alarm-rule-set": "alarmRuleSet",
            "click .js-alarm-timewindow": "alarmWindowSwitch",
            "click #time_window_clear": "alarmClearWindowSwitch",
            "click .slick-img-small": "iconClick",
            "click #tplmgr-search-btn": "searchBtnClick",
            "click #tplmgr-kpi-addall": "addAllKpi",
            "click #tplmgr-kpi-removeall" : "removeAllKpi",
            "click #tplmgr-allicon-btn": "showAllIcon",
            "click #tplmgr-allicon-hide-btn" : "hideAllIcon",
            "click .tplmgr-notify-obj-btn": "showNotifyObjBox",
            "click .tplmgr-notify-obj-param-btn": "addPluginParam",
            "click .js-tplmgr-alarmrule-add": "addAlarmRule",
            "keyup #tplmgr-selectablekpi-search": "selectableKpiSearch",
            "keyup [name=RULE_NAME]": "ruleNameInput"
		},

		initialize: function(options) {
            this.pluginType = '00';
            this.bpId = options.bpId;
            this.i18nData = options.i18nData;
            this.pmUtil = options.pmUtil;
            this.EMS_CODE = options.EMS_CODE;
            this.EMS_TYPE_CODE = options.EMS_TYPE_CODE;
            this.EMS_TYPE_REL_ID = options.EMS_TYPE_REL_ID;
            this.EMS_VER_CODE = options.EMS_VER_CODE;
            this.TEMPLATE_ID = options.TEMPLATE_ID;
            this.UP_TEMPLATE_ID = options.UP_TEMPLATE_ID;
            this.PMAlarmTitle = this.pmUtil.parameter("PMAlarmTitle");
            this.PMAlarmBody = this.pmUtil.parameter("PMAlarmBody");
            this.paramModel = [{
                name: "PARAM_CODE",
                label: this.i18nData.PARAM_CODE,
                width: "40",
                editable: true,
                editrules: "required;",
                editrules: "required;length[1~64]"
            }, {
                name: 'PARAM_VALUE',
                label: this.i18nData.PARAM_VALUE,
                width: "40",
                editable: true,
                editrules: "required;length[1~64]"
            }, {
                sortable: false,
                label: "",
                width: "10",
                formatter: 'actions',
                formatoptions: {
                    editbutton: false,
                    delbutton: true
                }
            }];
            this.alarmRuleModel = [{
                name: "RULE_ID",
                label: "",
                hidden: true
            }, {
                name: 'STATE',
                label: "状态",
                width: "20",
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i style="' + (cellval=='0'?'display:none;':'') + 'color:#1ed582;" class="fa fa-check"></i>';
                }
            }, {
                name: 'RULE_NAME',
                label: "告警规则名称",
                width: "41",
                editrules: "required;",
                sortable: false
            }, {
                sortable: false,
                label: "",
                width: "17",
                name: 'action',
                formatter: 'actions',
                formatoptions: {
                    editbutton: false,
                    delbutton: true
                }
            }];
            //
            this.tplObj = new Object();// 模板对象
            this.DATE_DIM_TYPE = "2";
            this.selectedKpiList = [];
            this.alarmItemList = [];
            this.ruleList = [];
        },

		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},

        contentReady: function(){
            var self = this;
            // 设置标题
            if(this.TEMPLATE_ID!=""){
                if(this.UP_TEMPLATE_ID){
                    $(".js-tplmgr-detail-title").html(this.i18nData.SUBTEMPLATE_EDIT);
                }else{
                    $(".js-tplmgr-detail-title").html(this.i18nData.TEMPLATE_EDIT);
                }
                action.qryTemplateDetail({TEMPLATE_ID: this.TEMPLATE_ID}, function(ret){
                    self.loadTpl(ret);
                });
            }else{
                if(this.UP_TEMPLATE_ID){
                    $(".js-tplmgr-detail-title").html(this.i18nData.SUBTEMPLATE_NEW);
                }else{
                    $(".js-tplmgr-detail-title").html(this.i18nData.TEMPLATE_NEW);
                }
                this.loadTpl();
            };
            //
            this.initAlarmTitleBodyTip();
        },

        initAlarmTitleBodyTip: function() {
            var self = this;
            this.alarmTitleFieldList = this.pmUtil.paravalue("PM_ALARM_TITLE_FIELD");
            this.alarmBodyFieldList = this.pmUtil.paravalue("PM_ALARM_BODY_FIELD");
            this.tipCheckRows = [];
            this.$("#js-tplmgr-alarmtitle-tipgrid").grid({
                data: this.alarmTitleFieldList,
                height: 242,
                colModel:[
                    {name:self.pmUtil.parakey.name, label:'名称'},
                    {name:self.pmUtil.parakey.val, label:'编码',key:true}
                ],
                multiselectWidth: 30,
                multiselect: true
            });
            this.$('#jqgh_js-tplmgr-alarmtitle-tipgrid_cb').hide();
            this.$("#js-tplmgr-alarmbody-tipgrid").grid({
                data: this.alarmBodyFieldList,
                height: 242,
                colModel:[
                    {name:self.pmUtil.parakey.name, label:'名称'},
                    {name:self.pmUtil.parakey.val, label:'编码',key:true}
                ],
                multiselectWidth: 30,
                multiselect: true
            });
            this.$('#jqgh_js-tplmgr-alarmbody-tipgrid_cb').hide();
            //
            this.$('#js-tplmgr-alarmtitle-tip').popover({
                placement: 'right',
                content: this.$('#js-tplmgr-alarmtitle-tipcontent').html(),
                beforeHide: function () {
                    self.setAlarmTitle();
                    return true;
                }
            }).on("popover:show",function(){
                $(".jqgrid-cbox .cbox",".popover").on("change",function(e){
                    var cboxid = e.currentTarget.id;
                    var isExist = false;
                    for(var i=0;i<self.tipCheckRows.length;i++){
                        var dataId = self.tipCheckRows[i];
                        if(dataId == cboxid){
                            isExist = true;
                            self.tipCheckRows.splice(i,1);
                        }
                    };
                    if(!isExist){
                        self.tipCheckRows[self.tipCheckRows.length] = cboxid;
                    }
                });
            });
            this.$('#js-tplmgr-alarmbody-tip').popover({
                placement: 'right',
                content: this.$('#js-tplmgr-alarmbody-tipcontent').html(),
                beforeHide: function () {
                    self.setAlarmBody();
                    return true;
                }
            }).on("popover:show",function(){
                $(".jqgrid-cbox .cbox",".popover").on("change",function(e){
                    var cboxid = e.currentTarget.id;
                    var isExist = false;
                    for(var i=0;i<self.tipCheckRows.length;i++){
                        var dataId = self.tipCheckRows[i];
                        if(dataId == cboxid){
                            isExist = true;
                            self.tipCheckRows.splice(i,1);
                        }
                    };
                    if(!isExist){
                        self.tipCheckRows[self.tipCheckRows.length] = cboxid;
                    }
                });
            });
        },

        setAlarmTitle: function() {
            var self = this;
            var alarmTitle = '';
            //jqg_js-tplmgr-alarmtitlebody-tipgrid_
            fish.forEach(self.tipCheckRows, function(rowData){
                alarmTitle += '{' + rowData.substring(rowData.indexOf('tipgrid') + 8) + '}';
            });
            if(self.tipCheckRows.length>0) {
                self.$('[name=ALARM_TITLE]').val(alarmTitle);
            }
            self.tipCheckRows = [];
        },

        setAlarmBody: function() {
            var self = this;
            var alarmTitle = '';
            fish.forEach(self.tipCheckRows, function(rowData){
                alarmTitle += '{' + rowData.substring(rowData.indexOf('tipgrid') + 8) + '}';
            });
            if(self.tipCheckRows.length>0){
                self.$('[name=ALARM_BODY]').val(alarmTitle);
            }
            self.tipCheckRows = [];
        },

        loadTpl: function(tplData) {
            this.loadTplInfoTab(tplData);
            this.loadRelativeKpiTab(tplData);
            this.loadAlarmRuleTab(tplData);
            this.tabSwitch(0);
        },

        // 告警规则页签
        loadAlarmRuleTab: function(tplData) {
            var self = this;
            this.loadAlarmRuleGrid();
            //
            this.$alarmRuleForm = this.$(".js-tplmgr-alarm-form");
            var alarmDateList = this.pmUtil.paravalue("ALARM_DATE");
            this.$alarm_date_combox = this.$el.find("[name='TRIGGER_DATE']").combobox({
                dataTextField: this.pmUtil.parakey.name,
                dataValueField: this.pmUtil.parakey.val,
                dataSource: alarmDateList
            });
            if(alarmDateList.length > 0){
                var value = alarmDateList[0][this.pmUtil.parakey.val];
                self.$alarm_date_combox.combobox('value', value);
            }
            var delayTypeList = this.pmUtil.paravalue("DELAY_TYPE");
            this.$delay_type_combox = this.$el.find("[name='TRIGGER_TIME']").combobox({
                dataTextField: this.pmUtil.parakey.name,
                dataValueField: this.pmUtil.parakey.val,
                dataSource: delayTypeList
            });
            if(delayTypeList.length > 0){
                var value = delayTypeList[0][this.pmUtil.parakey.val];
                self.$delay_type_combox.combobox('value', value);
            }
            var notifyTypeList = this.pmUtil.paravalue("NOTIFY_TYPE");
            this.$notify_type_combox = this.$el.find("[name='PLUGIN_TYPE']").combobox({
                dataTextField: this.pmUtil.parakey.name,
                dataValueField: this.pmUtil.parakey.val,
                dataSource:  notifyTypeList
            });
            this.$el.find("input[name='PLUGIN_TYPE']").on('combobox:change', function(){
                this.changeNotifyType();
            }.bind(this));
            if(notifyTypeList.length > 0){
                var value = notifyTypeList[0][this.pmUtil.parakey.val];
                self.$notify_type_combox.combobox('value', value);
            }
            //
            this.loadParamGrid();
            this.$('#alarm_rule_tabs').tabs({});
            this.loadAlarmLevelTabs();
            if(tplData && tplData.template_alarm) {
                this.ruleList = [];
                fish.forEach(tplData.template_alarm, function (rule) {
                    self.ruleList[self.ruleList.length] = rule;
                    rule["ALARM_RULE_LIST"] = [];
                    fish.forEach(tplData.alarm_rule_list, function(alarmRule){
                        if(rule.RULE_ID == alarmRule.RULE_ID){
                            rule["ALARM_RULE_LIST"][rule["ALARM_RULE_LIST"].length] = alarmRule;
                            alarmRule["DETAIL_LIST"] = [];
                            fish.forEach(tplData.warn_detial_list, function(detailObj){
                                if(detailObj.RULE_ID == alarmRule.RULE_ID && detailObj.ALARM_LEVEL == alarmRule.ALARM_LEVEL &&
                                    detailObj.RULE_TYPE == alarmRule.RULE_TYPE && alarmRule["DETAIL_LIST"]){
                                    alarmRule["DETAIL_LIST"][alarmRule["DETAIL_LIST"].length] = detailObj;
                                }
                            });
                        }
                    });
                });
                if(this.ruleList.length>0){
                    this.$alarm_rule_grid.jqGrid("reloadData", this.ruleList);
                    var data = this.$alarm_rule_grid.jqGrid("getRowData");
                    this.$alarm_rule_grid.jqGrid("setSelection", data[0]);
                    this.currRule = data[0];
                }
            }
        },

        loadParamGrid: function() {
            var self = this;
            this.$plugin_param_grid = this.$(".tplmgr-notify-obj-param-grid").jqGrid({
                colModel: this.paramModel,
                pagebar: false,
                sortable:true,
                cellEdit: true,
                autowidth:true,
                afterEditCell: function (e,rowid,name,value,iRow,iCol) {
                    return false;
                },
                beforeDeleteRow: function(e, rowid, rowdata) {
                    self.delPluginParam(rowdata, self.$plugin_param_grid);
                    return false;
                },
                onSelectRow: function(e, rowid, state) {
                    return false;
                }
            });
        },

        loadAlarmRuleGrid: function() {
            var self = this;
            this.$alarm_rule_grid = this.$(".js-tplmgr-alarmrule-grid").jqGrid({
                colModel: this.alarmRuleModel,
                pagebar: false,
                sortable:false,
                autowidth:true,
                afterEditCell: function (e,rowid,name,value,iRow,iCol) {
                    return false;
                },
                beforeDeleteRow: function (e, rowid, data, option) {
                    var selRule = self.$alarm_rule_grid.jqGrid("getSelection");
                    if(data.RULE_ID == selRule.RULE_ID){
                        return true;
                    }
                    if(self.currRule && self.currRule.hasOwnProperty("RULE_ID")){
                        if (!self.$alarmRuleForm.isValid()) {
                            return false;
                        }else{
                            self.getRuleDetail(selRule);
                            for(var i=0; i<self.ruleList.length; i++){
                                if(self.ruleList[i].RULE_ID == selRule.RULE_ID){
                                    self.ruleList[i] = selRule;
                                }
                            };
                        }
                    }
                    return true;
                },
                afterDeleteRow: function (e, rowid, data, option) {
                    self.delAlarmRule(data);
                },
                onSelectRow: function (e, rowid, state, checked) {//选中行事件
                    self.alarmRuleClick();
                },
                beforeSelectRow: function (e, rowid) {//选中行之前事件,返回false则不会选中记录
                    if (self.currRule && !self.$alarmRuleForm.isValid()) {
                        return false;
                    }else{
                        return true;
                    }
                }
            });
            this.$alarm_rule_grid.jqGrid("setGridHeight", 188);
            this.$alarm_rule_grid.jqGrid("setGridWidth", 183);
        },

        delAlarmRule: function(data) {
            var self = this;
            for(var i=0; i<this.ruleList.length;i++) {
                var rule = this.ruleList[i];
                if(rule.RULE_ID == data.RULE_ID){
                    this.ruleList.splice(i,1);
                }
            }
            this.currRule = undefined;
            if(this.ruleList.length>0){
                var dataList = this.$alarm_rule_grid.jqGrid("getRowData");
                this.$alarm_rule_grid.jqGrid("setSelection", dataList[0]);
            }else{
                self.setRuleDetail({});
            }
        },

        alarmRuleClick: function() {
            var self = this;
            this.$('.js-tplmgr-alarm-detail').show();
            this.$('[name=RULE_NAME]').focus();
            if(this.currRule && this.currRule.hasOwnProperty("RULE_ID")){
                this.getRuleDetail(this.currRule);
                for(var i=0; i<this.ruleList.length; i++){
                    if(this.ruleList[i].RULE_ID == this.currRule.RULE_ID){
                        this.ruleList[i] = this.currRule;
                    }
                };
            }
            var data = this.$alarm_rule_grid.jqGrid("getSelection");
            fish.forEach(this.ruleList, function(rule){
                if(rule.RULE_ID == data.RULE_ID){
                    self.setRuleDetail(rule);
                    self.currRule = rule;
                }
            });
        },

        setRuleDetail: function(rule) {
            var self = this;
            self.$('[name=RULE_NAME]').val(rule.RULE_NAME);
            self.$('[name=RULE_NAME]').focus();
            self.$('[name=ALARM_CODE]').val(rule.ALARM_CODE);
            self.$('[name=ALARM_TITLE]').val(rule.ALARM_TITLE?rule.ALARM_TITLE:self.PMAlarmTitle[self.pmUtil.parakey.val]);
            self.$('[name=ALARM_BODY]').val(rule.ALARM_BODY?rule.ALARM_BODY:self.PMAlarmBody[self.pmUtil.parakey.val]);
            // 规则状态
            if (!rule.STATE || rule.STATE == "1") {
                self.$('#RULE_STATE').prop("checked", "checked");
            } else {
                self.$('#RULE_STATE').removeAttr("checked");
            }
            // 告警动作配置
            if (rule.ENABLE_ACTION == "1") {
                self.$('#ENABLE_ACTION').prop("checked", "checked");
                self.$(".js-alarm-action-cfg-div").show();
            } else {
                self.$('#ENABLE_ACTION').removeAttr("checked");
                self.$(".js-alarm-action-cfg-div").hide();
            }
            self.$el.find("[name='TRIGGER_DATE']").combobox("value", rule.TRIGGER_DATE);
            self.$el.find("[name='TRIGGER_TIME']").combobox("value", rule.TRIGGER_TIME);
            self.$el.find("[name='PLUGIN_TYPE']").combobox("value", rule.PLUGIN_TYPE);
            self.$el.find("[name='PLUGIN_NO']").combobox("value", rule.PLUGIN_NO);
            //
            var paramList = ((rule.PLUGIN_PARAM=="" || !rule.PLUGIN_PARAM)?[]:rule.PLUGIN_PARAM.split("|"));
            if(paramList.length>0){
                self.showNotifyObjBox();
            }
            var paramGridDp = [];
            fish.forEach(paramList, function(param){
                var splitterIndex = param.indexOf(":");
                var param_code = param.substring(0,splitterIndex);
                var param_value = param.substring(splitterIndex+1);
                paramGridDp[paramGridDp.length] = {
                    PARAM_CODE: param_code,
                    PARAM_VALUE: param_value
                }
            });
            self.$(".tplmgr-notify-obj-param-grid").jqGrid("reloadData", paramGridDp);
            //
            this.alarmItemList = [];
            if(rule.ALARM_RULE_LIST){
                self.clearRuleCfgDiv(rule.ALARM_RULE_LIST);
                fish.forEach(rule.ALARM_RULE_LIST, function(alarmRule){
                    var alarm_level_id = alarmRule.ALARM_LEVEL;
                    var condi_type = alarmRule.CONDI_TYPE;
                    var rule_id = alarmRule.RULE_ID;
                    var rule_type = alarmRule.RULE_TYPE;
                    var time_window = alarmRule.TIME_WINDOW;
                    var time_window_value = alarmRule.TIME_WINDOW_VALUE;
                    //
                    if(rule_type=="0"){// generate
                        self.$el.find('#ALARM_RULE_SET_' + alarm_level_id).prop("checked",true);
                        self.alarmRuleSet(null,self.$('#ALARM_RULE_SET_' + alarm_level_id));
                        if (time_window == "1") {
                            self.$el.find("#TIME_WINDOW_GENERATE_"+alarm_level_id).prop("checked", "checked");
                            self.$el.find("[name='TIME_WINDOW_VALUE_GENERATE_DIV_"+alarm_level_id+"']").show();
                            self.$el.find("[name='TIME_WINDOW_VALUE_GENERATE_"+alarm_level_id+"']").val(time_window_value);
                        }
                        self.$el.find("[name='CONDI_TYPE_GENERATE_"+alarm_level_id+"']").removeAttr("checked");
                        self.$el.find("[name='CONDI_TYPE_GENERATE_"+alarm_level_id+"'][value='"+condi_type+"']").eq(0).prop('checked', 'checked');
                        if(alarmRule.DETAIL_LIST){
                            fish.forEach(alarmRule.DETAIL_LIST, function(detailItem){
                                if(detailItem.RULE_TYPE == "0" && detailItem.ALARM_LEVEL == alarm_level_id){
                                    self.addAlarmGenerateItem(alarm_level_id, 0, detailItem);
                                }
                            });
                        }
                    }else{// clear
                        if (time_window == "1") {
                            self.$el.find("#time_window_clear").prop("checked", "checked");
                            self.$el.find("[name='TIME_WINDOW_VALUE_CLEAR_DIV']").show();
                            self.$el.find("[name='TIME_WINDOW_VALUE_CLEAR']").val(time_window_value);
                        }
                        self.$el.find("[name='CONDI_TYPE_CLEAR']").removeAttr("checked");
                        self.$el.find("[name='CONDI_TYPE_CLEAR'][value='"+condi_type+"']").eq(0).prop('checked', 'checked');
                        if(alarmRule.DETAIL_LIST){
                            fish.forEach(alarmRule.DETAIL_LIST, function(detailItem){
                                if(detailItem.RULE_TYPE == "1" && detailItem.ALARM_LEVEL == "0"){
                                    self.addAlarmClearItem("0", 1, detailItem);
                                }
                            });
                        }
                    }
                });
            }else{
                self.clearRuleCfgDiv([]);
            }
        },

        clearRuleCfgDiv: function(alarmRuleList) {
            var self = this;
            fish.forEach(this.alarmLevelList, function(para, index){
                var val = JSON.parse(para[self.pmUtil.parakey.val]);
                var alarm_level_id = val['level'];
                self.$el.find('#ALARM_RULE_SET_' + alarm_level_id).removeAttr("checked");
                self.alarmRuleSet(null,self.$('#ALARM_RULE_SET_' + alarm_level_id));
                //
                self.$el.find("#TIME_WINDOW_GENERATE_"+alarm_level_id).removeAttr("checked");
                self.$el.find("[name='TIME_WINDOW_VALUE_GENERATE_DIV_"+alarm_level_id+"']").hide();
                self.$el.find("[name='TIME_WINDOW_VALUE_GENERATE_"+alarm_level_id+"']").val("");
                self.$el.find("[name='CONDI_TYPE_GENERATE_"+alarm_level_id+"']").removeAttr("checked");
                self.$el.find("[name='CONDI_TYPE_GENERATE_"+alarm_level_id+"'][value='AND']").eq(0).prop('checked', 'checked');
                self.$("#alarm_rule_generate_item_" + alarm_level_id).empty();
                //
                self.$el.find("#time_window_clear").removeAttr("checked");
                self.$el.find("[name='TIME_WINDOW_VALUE_CLEAR_DIV']").hide();
                self.$el.find("[name='TIME_WINDOW_VALUE_CLEAR']").val("");
                self.$el.find("[name='CONDI_TYPE_CLEAR']").removeAttr("checked");
                self.$el.find("[name='CONDI_TYPE_CLEAR'][value='AND']").eq(0).prop('checked', 'checked');
                self.$("#alarm_rule_clear_item").empty();
            });
        },

        addAlarmRule: function() {
            var self = this;
            var selRule = this.$alarm_rule_grid.jqGrid("getSelection");
            if(selRule.hasOwnProperty("RULE_ID")){
                if (!this.$alarmRuleForm.isValid()) {
                    return;
                }else{
                    this.getRuleDetail(selRule);
                    for(var i=0; i<this.ruleList.length; i++){
                        if(this.ruleList[i].RULE_ID == selRule.RULE_ID){
                            this.ruleList[i] = selRule;
                        }
                    };
                }
            }
            var ruleObj = {
                RULE_ID: tplUtil.guid(),
                STATE: 1,
                RULE_NAME: ""
            };
            this.ruleList[this.ruleList.length] = ruleObj;
            this.$alarm_rule_grid.jqGrid('addRow', {
                initdata: ruleObj
            });
            this.currRule = ruleObj;
        },

        getRuleDetail: function(selRule) {
            if (this.$alarmRuleForm.isValid()) {
                var self = this;
                var value = this.$alarmRuleForm.form("value");
                selRule["ALARM_TITLE"] = value.ALARM_TITLE;
                selRule["ALARM_BODY"] = value.ALARM_BODY;
                selRule["RULE_NAME"] = value.RULE_NAME;
                selRule["ALARM_CODE"] = value.ALARM_CODE;
                selRule["STATE"] = this.$(".js-alarm-rule-switch").prop("checked") ? "1" : "0";
                // 告警动作配置
                selRule["ENABLE_ACTION"] = this.$(".js-alarm-action-switch").prop("checked") ? "1" : "0";
                selRule["TRIGGER_DATE"] = value.TRIGGER_DATE;
                selRule["TRIGGER_TIME"] = value.TRIGGER_TIME;
                selRule["PLUGIN_TYPE"] = value.PLUGIN_TYPE;
                selRule["PLUGIN_NO"] = value.PLUGIN_NO;
                selRule["PLUGIN_PARAM"] = this.getPluginParam();
                //
                selRule["ALARM_RULE_LIST"] = this.getAlarmRuleList();
                selRule["UP_TEMPLATE_ID"] = this.UP_TEMPLATE_ID;
            }
        },

        ruleNameInput: function() {
            var rule_name = this.$('[name=RULE_NAME]').val();
            var selrow = this.$alarm_rule_grid.jqGrid("getSelection");
            //传入修改后的行数据
            selrow.RULE_NAME = rule_name;
            this.$alarm_rule_grid.jqGrid("setRowData", selrow);
        },

        addPluginParam: function(event) {
            var data = {};
            this.$(".tplmgr-notify-obj-param-grid").jqGrid("addRowData", data, 'last');
            this.$(".tplmgr-notify-obj-param-grid").jqGrid("setSelection",data);
        },

        delPluginParam: function(rowdata, $grid) {
            fish.confirm(this.i18nData.PARAM_DEL_CONFIRM,function(t) {
                $grid.jqGrid("delRowData", rowdata);
            }.bind(this));
        },

        changeNotifyType: function(val) {
            var notifyType = this.$el.find("[name='PLUGIN_TYPE']").combobox('value');
            if(notifyType=="2"){
                this.$(".tplmgr-notify-obj-btn").removeClass('hide');
                this.pmUtil.utilAction.qryPluginSpec({'PLUGIN_TYPE':'07'}, function(data) {
                    if (data && data.pluginList){
                        this.$el.find("[name='PLUGIN_NO']").combobox({
                            dataTextField: 'PLUGIN_NAME',
                            dataValueField: 'PLUGIN_SPEC_NO',
                            dataSource: data.pluginList
                        });
                        if(data.pluginList.length>0){
                            this.$el.find("[name='PLUGIN_NO']").combobox('value',data.pluginList[0]['PLUGIN_SPEC_NO']);
                        }
                    }
                }.bind(this),true);
            }else{
                this.$el.find("[name='PLUGIN_NO']").combobox('destroy');
                this.$(".tplmgr-notify-obj-btn").addClass('hide');
                this.$el.find("[name='PLUGIN_NO']").val(val);
            }
        },

        // 关联指标页签
        loadRelativeKpiTab: function (tplData) {
            var self = this;
            this.modelList = [];
            if(tplData && tplData.kpi_list){
                self.tplObj["KPI_LIST"] = tplData.kpi_list;
            }
            this.$relativeKpiForm = this.$(".js-tplmgr-relativekpi-form");
            action.loadBusiModelList({
                EMS_VER_CODE: this.EMS_VER_CODE,
                EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID
            }, function (data) {
                fish.forEach(data.modelField, function(modelFieldObj){
                    var modelObj;
                    var MODEL_CODE = modelFieldObj.MODEL_BUSI_CODE;
                    var MODEL_PHY_CODE = modelFieldObj.MODEL_PHY_CODE;
                    var MODEL_NAME = modelFieldObj.MODEL_PHY_NAME;
                    var FIELD_CODE = modelFieldObj.FIELD_CODE;
                    var FIELD_NAME = modelFieldObj.FIELD_NAME;
                    var FIELD_TYPE = modelFieldObj.FIELD_TYPE;
                    var DATA_TYPE = modelFieldObj.DATA_TYPE;// 2-时间类型
                    var isExist = false;
                    for(var j=0;j<self.modelList.length && !isExist;j++){
                        modelObj = self.modelList[j];
                        if(modelObj.MODEL_PHY_CODE == MODEL_PHY_CODE){
                            isExist = true;
                        }
                    }
                    if(!isExist){
                        modelObj = {
                            MODEL_CODE: MODEL_CODE,
                            MODEL_PHY_CODE: MODEL_PHY_CODE,
                            MODEL_NAME: MODEL_NAME,
                            DIMS: [],
                            INDICATORS: []
                        };
                        self.modelList[self.modelList.length] = modelObj;
                    }
                    //
                    if(FIELD_TYPE=="0"){
                        modelObj.DIMS[modelObj.DIMS.length] = {
                            DIM_CODE: FIELD_CODE,
                            DIM_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }else if(FIELD_TYPE=="1"){
                        modelObj.INDICATORS[modelObj.INDICATORS.length] = {
                            KPI_CODE: FIELD_CODE,
                            KPI_NAME: FIELD_NAME,
                            DATA_TYPE: DATA_TYPE
                        }
                    }
                });
                self.$model_phy_code_combox = self.$("[name='MODEL_PHY_CODE']").combobox({
                    dataTextField: "MODEL_NAME",
                    dataValueField: "MODEL_PHY_CODE",
                    dataSource:  self.modelList
                });
                self.$model_phy_code_combox.on('combobox:change', function (e) {
                    self.model_phy_code_change(e.currentTarget.value);
                });
                if(self.modelList.length > 0){
                    var value = self.modelList[0].MODEL_PHY_CODE;
                    self.$model_phy_code_combox.combobox('value', value);
                }
                if(tplData && tplData.template){
                    self.$model_phy_code_combox.combobox('value', tplData.template.MODEL_PHY_CODE);
                    self.$field_code_combox.combobox('value', tplData.template.FIELD_CODE);
                }
                if(tplData && tplData.kpi_list){
                    fish.forEach(tplData.kpi_list, function(kpiObj){
                        fish.forEach(self.allKpiList, function(allKpiObj) {
                            if (kpiObj.KPI_CODE == allKpiObj.KPI_CODE) {
                                kpiObj["KPI_NAME"] = allKpiObj.KPI_NAME;
                            }
                        });
                        self.selectKpiData(kpiObj.KPI_CODE);
                    });
                }
            });
        },

        // 模板概况页签表单
        loadTplInfoTab: function (tplData) {
            var self = this;
            this.$tplInfoForm = this.$(".js-tplmgr-detail-form");
            this.neIconList = [];
            // 设备类型图标
            self.$neIconSlick = self.$('#tplmgr_ne_icon').slick({
                dots: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1
            });
            self.selectableNeIconList = [];
            // 设备类型
            var template_catagory_list = self.pmUtil.paravalue("TEMPLATE_CATAGORY");
            var ne_type_list = [];
            fish.forEach(template_catagory_list, function(obj){
                if(!obj.PARA_F_NAME || obj.PARA_F_NAME == self.EMS_TYPE_CODE){
                    ne_type_list[ne_type_list.length] = obj;
                }
            });
            var dataValueField = self.pmUtil.parakey.val;
            var dataTextField = self.pmUtil.parakey.name;
            self.$ne_type_combox = self.$("[name='NE_TYPE']").combobox({
                dataTextField: dataTextField,
                dataValueField: dataValueField,
                dataSource:  ne_type_list
            });
            this.$ne_type_combox.on('combobox:change', function (e) {
                self.ne_type_change(e.currentTarget.value);
            });
            action.loadNeIconList({}, function (data) {
                if(data) {
                    //self.neIconList = data;
                    self.neIconList = [
                        {ICON_ID:1,ICON_TYPE:1,ICON_URL:"windows.png"},
                        {ICON_ID:2,ICON_TYPE:1,ICON_URL:"access_point.png"},
                        {ICON_ID:3,ICON_TYPE:1,ICON_URL:"bridge.png"},
                        {ICON_ID:4,ICON_TYPE:1,ICON_URL:"businessview.png"},
                        {ICON_ID:5,ICON_TYPE:1,ICON_URL:"cable_modem.png"},
                        {ICON_ID:6,ICON_TYPE:1,ICON_URL:"CitrixDT.png"},
                        {ICON_ID:7,ICON_TYPE:1,ICON_URL:"default.png"},
                        {ICON_ID:8,ICON_TYPE:1,ICON_URL:"esx.png"},
                        {ICON_ID:9,ICON_TYPE:1,ICON_URL:"F5DT.png"},
                        {ICON_ID:10,ICON_TYPE:1,ICON_URL:"firewall.png"},
                        {ICON_ID:11,ICON_TYPE:1,ICON_URL:"GenericUps.png"},
                        {ICON_ID:12,ICON_TYPE:1,ICON_URL:"hub.png"},
                        {ICON_ID:13,ICON_TYPE:1,ICON_URL:"linux.png"},
                        {ICON_ID:14,ICON_TYPE:1,ICON_URL:"Mac.png"},
                        {ICON_ID:15,ICON_TYPE:1,ICON_URL:"mainframe.png"},
                        {ICON_ID:16,ICON_TYPE:1,ICON_URL:"modem.png"},
                        {ICON_ID:17,ICON_TYPE:1,ICON_URL:"pc.png"},
                        {ICON_ID:18,ICON_TYPE:1,ICON_URL:"printer.png"},
                        {ICON_ID:19,ICON_TYPE:1,ICON_URL:"RiverbedDT.png"},
                        {ICON_ID:20,ICON_TYPE:1,ICON_URL:"router.png"},
                        {ICON_ID:21,ICON_TYPE:1,ICON_URL:"storage.png"},
                        {ICON_ID:22,ICON_TYPE:1,ICON_URL:"switch.png"},
                        {ICON_ID:23,ICON_TYPE:1,ICON_URL:"ucs.png"},
                        {ICON_ID:24,ICON_TYPE:1,ICON_URL:"ups_default.png"},
                        {ICON_ID:25,ICON_TYPE:1,ICON_URL:"accelerator.png"},
                        {ICON_ID:26,ICON_TYPE:1,ICON_URL:"workstation.png"}
                    ];
                }
                if(ne_type_list.length > 0){
                    var value = ne_type_list[0][dataValueField];
                    self.$ne_type_combox.combobox('value', value);
                }
                if(tplData && tplData.template){
                    self.$ne_type_combox.combobox('value', tplData.template.NE_TYPE);
                    self.$('[name=TEMPLATE_NAME]').val(tplData.template.TEMPLATE_NAME);
                    if(tplData.template.STATE != "1"){
                        self.$('[name=IS_STATE]').prop("checked",false);
                    }
                    self.$('[name=TEMPLATE_DESC]').val(tplData.template.TEMPLATE_DESC);
                    var ne_icon = tplData.template.NE_ICON;
                    for(var i=0;i<self.selectableNeIconList.length;i++){
                        if(ne_icon == self.selectableNeIconList[i].ICON_URL){
                            self.$neIconSlick.slick("slickGoTo", i, true);
                        }
                    }
                }
            });
        },

        model_phy_code_change: function(model_phy_code) {
            var self = this;
            var dimList = [];
            this.allKpiList = [];
            var selectableKpiList = [];
            var selectedKpiList = [];
            fish.forEach(this.modelList, function(modelObj){
                if(modelObj.MODEL_PHY_CODE == model_phy_code){
                    var excludeDimension = self.pmUtil.parameter("ExcludeDimension");
                    excludeDimension = excludeDimension?excludeDimension[self.pmUtil.parakey.val].split(","):[];
                    fish.forEach(modelObj.DIMS, function(dimObj){
                        if(dimObj.DATA_TYPE != self.DATE_DIM_TYPE){
                            var existInExclude = false;
                            fish.forEach(excludeDimension, function(excludeDim){
                                if(excludeDim == dimObj.DIM_CODE){
                                    existInExclude = true;
                                }
                            });
                            if(!existInExclude){
                                dimList[dimList.length] = dimObj;
                            }
                        }
                    });
                    // 监测对象下拉框
                    self.$field_code_combox = self.$("[name='FIELD_CODE']").combobox({
                        dataTextField: "DIM_NAME",
                        dataValueField: "DIM_CODE",
                        dataSource:  dimList
                    });
                    if(dimList.length > 0){
                        var value = dimList[0].DIM_CODE;
                        self.$field_code_combox.combobox('value', value);
                    }
                    // 指标左右互选
                    fish.forEach(modelObj.INDICATORS, function(kpiObj){
                        self.allKpiList[self.allKpiList.length] = kpiObj;
                        selectableKpiList[selectableKpiList.length] = kpiObj;
                    });
                    self.initKpiGrid(selectableKpiList, selectedKpiList);
                }
            });
        },

        initKpiGrid: function(selectableKpiList, selectedKpiList){
            var self = this;
            this.$("[name='tplmgr-kpi-selectable']").empty();
            this.$("[name='tplmgr-kpi-selected']").empty();
            for(var i=0; i<selectableKpiList.length; i++){
                var item = selectableKpiList[i];
                var kpi_code = item.KPI_CODE;
                var htmlText = '<li id="tplmgr-kpi-selectable-'+kpi_code+'">'
                    + '<span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                    + item.KPI_NAME
                    + '<a id="tplmgr-kpi-add-'+kpi_code+'" href="#">'
                    + '<i class="fa fa-plus"></i></a></li>';
                self.$('[name=tplmgr-kpi-selectable]').append(htmlText);
                self.$('#tplmgr-kpi-add-'+kpi_code).unbind();
                self.$('#tplmgr-kpi-add-'+kpi_code).bind("click", function(event){
                    self.selectKpiData(event.currentTarget.id.substring(15));
                });
            }
        },

        selectKpiData: function(kpi_code) {
            var self = this;
            this.$('#tplmgr-kpi-add-'+kpi_code).unbind();
            this.$('#tplmgr-kpi-selectable-'+kpi_code).remove();
            for(var i=0; i<this.allKpiList.length; i++){
                var kpiObj = this.allKpiList[i];
                this.selectedKpiList[this.selectedKpiList.length] = kpiObj;
                if(kpiObj.KPI_CODE == kpi_code){
                    var htmlText = '<li name="tplmgr-selected-kpi" id="tplmgr-kpi-selected-'
                        + kpi_code + '">'
                        + kpiObj.KPI_NAME
                        + ' <a id="tplmgr-kpi-remove-'
                        + kpi_code
                        + '" href="#"><i class="fa fa-trash"></i></a></li>';
                    this.$('[name=tplmgr-kpi-selected]').append(htmlText);
                    this.$('#tplmgr-kpi-remove-' + kpi_code).unbind();
                    this.$('#tplmgr-kpi-remove-' + kpi_code).bind("click", function(event){
                        self.cancelKpiData(this.id.substring(18));
                    });
                    break;
                }
            }
        },

        cancelKpiData: function(kpi_code) {
            var self = this;
            this.$('#tplmgr-kpi-remove-' + kpi_code).unbind();
            this.$('#tplmgr-kpi-selected-' + kpi_code).remove();
            var searchCont = this.$('#tplmgr-selectablekpi-search').val();
            for(var i=0; i<this.allKpiList.length; i++){
                var kpiObj = this.allKpiList[i];
                var kpi_name = kpiObj.KPI_NAME;
                if(kpiObj.KPI_CODE == kpi_code){
                    if (searchCont=='' || (searchCont!='' && kpi_name.toLowerCase().indexOf(searchCont.toLowerCase()) != -1)) {
                        var htmlText = '<li id="tplmgr-kpi-selectable-'+kpi_code+'">'
                            + '<span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                            + kpi_name
                            + '<a id="tplmgr-kpi-add-'+kpi_code+'" href="#">'
                            + '<i class="fa fa-plus"></i></a></li>';
                        self.$('[name=tplmgr-kpi-selectable]').append(htmlText);
                        self.$('#tplmgr-kpi-add-'+kpi_code).unbind();
                        self.$('#tplmgr-kpi-add-'+kpi_code).bind("click", function(event){
                            self.selectKpiData(event.currentTarget.id.substring(15));
                        });
                    }
                    break;
                }
            }
        },

        ne_type_change: function(ne_type){
            console.log("ne_type_change:" + ne_type);
            var self = this;
            this.loadIconListByType(ne_type);
        },

        loadIconListByType: function (ne_type) {
            var self = this;
            for(var i = this.selectableNeIconList.length-1; i >= 0; i--){
                this.$neIconSlick.slick('slickRemove', i);
            }
            self.$('#tplmgr_ne_icon_all').empty();
            this.selectableNeIconList = [];
            fish.forEach(self.neIconList, function(iconObj){
                //if(iconObj.ICON_TYPE == ne_type){
                var url = iconObj.ICON_URL;
                var slickImgText = '<div class="well">'
                    + '<img class="slick-img" src="static/oss_core/inms/pm/alarmtemplate/assets/images/' + url + '" ></div>';
                self.$neIconSlick.slick('slickAdd', slickImgText);
                //
                var smallImgText = '<div class="col-md-4">'
                    + '<img class="slick-img-small" name="' + url + '" src="static/oss_core/inms/pm/alarmtemplate/assets/images/' + url + '" ></div>';
                self.$('#tplmgr_ne_icon_all').append(smallImgText);
                self.selectableNeIconList[self.selectableNeIconList.length] = iconObj;
                //}
            });
        },

		siwtchMoBtn:function(){
			this.$(".js-mo-list-add").toggleClass("hide");
			this.$(".js-mo-list-ok").toggleClass("hide");
			this.$(".js-mo-list-cancel").toggleClass("hide");
			this.$(".js-mo-list-seled-div").toggleClass("hide");
			this.$(".js-mo-list-seling-div").toggleClass("hide");
		},

		clickNavTabs: function(event,target){
			var $target = target;
			if(event){
				$target = $(event.target)
			}
			var tabContent = $target.attr("tab-content");
			//var tabContent = $target.attr("tab-index");
			$target.parent().siblings().removeClass("active");
			$target.parent().addClass("active");
			$("#"+tabContent).siblings().removeClass("active");
			$("#"+tabContent).addClass("active");
			if(tabContent=='js-tplmgr-wizard-tab1'){
				this.$(".js-adapter-previous-btn").hide();
				this.$(".js-adapter-next-btn").html(this.i18nData.NEXT);
			}else if(tabContent=='js-tplmgr-wizard-tab2'){
				this.$(".js-adapter-previous-btn").show();
                this.$(".js-adapter-next-btn").html(this.i18nData.NEXT);
			}else if(tabContent=='js-tplmgr-wizard-tab3'){
                this.$(".js-adapter-previous-btn").show();
                this.$(".js-adapter-next-btn").html(this.i18nData.SAVE);
            }
			return false;
		},

		previousTab:function(){
			this.tabSwitch(null,'previous');
		},

		nextTab:function(){
			this.tabSwitch(null,'next');
		},

		tabSwitch:function(tabIdx,action){
			var tabNum = 3;
			if(action){
				fish.forEach($(".js-nav-tabs"), function(tab,index) {
	        		if($(tab).parent().hasClass("active")){
	        			tabIdx = index;
	        			return false;
	        		}
				}.bind(this));
				if(action=='next'){
					if(tabIdx == 2){
						this.tplOk();
					}else if(tabIdx == 0){
                        this.tplInfoTabOk();
					}else if(tabIdx == 1){
                        this.relativeKpiTabOk();
                    }
				}else if(action=='previous'){
					if((tabIdx-1) >= 0){
						this.clickNavTabs(null,$(".js-nav-tabs").eq(tabIdx-1));
					}
				}
			}else{
				this.clickNavTabs(null,$(".js-nav-tabs").eq(tabIdx));
			}
		},

        getPluginParam: function() {
            var paramStr = "";
            var paramList = this.$plugin_param_grid.jqGrid("getRowData");
            fish.forEach(paramList, function(paramObj){
                if(paramObj.PARAM_CODE!=""){
                    paramStr += paramObj.PARAM_CODE + ":" + paramObj.PARAM_VALUE + "|";
                }
            });
            if(paramStr!=""){
                paramStr = paramStr.substring(0, paramStr.length-1);
            }
            return paramStr;
        },

        tplOk: function() {
            var self = this;
            if(this.ruleList.length == 0){
                fish.toast('info', "请至少添加一条告警规则");
                return;
            }
            var selRule = this.$alarm_rule_grid.jqGrid("getSelection");
            if(selRule.hasOwnProperty("RULE_ID")){
                if (!this.$alarmRuleForm.isValid()) {
                    return;
                }else{
                    this.getRuleDetail(selRule);
                    for(var i=0; i<this.ruleList.length; i++){
                        if(this.ruleList[i].RULE_ID == selRule.RULE_ID){
                            this.ruleList[i] = selRule;
                        }
                    };
                }
            }
            self.tplObj["RULE_LIST"] = this.ruleList;
            if(this.TEMPLATE_ID!=""){
                this.tplObj["TEMPLATE_ID"] = this.TEMPLATE_ID;
                action.addTemplate(this.tplObj, function(template_id) {
                    fish.success("编辑模板成功");
                    this.trigger("okEvent", template_id);
                }.bind(this));
            }else{
                action.addTemplate(this.tplObj, function(template_id) {
                    fish.success("新建模板成功");
                    this.trigger("okEvent", template_id);
                }.bind(this));
            }
        },

        getAlarmRuleList: function() {
            var self = this;
            var alarmRuleList = [];
            fish.forEach(this.alarmLevelList, function(para, index) {
                var val = JSON.parse(para[self.pmUtil.parakey.val]);
                var alarm_level_id = val['level'];
                var alarm_switch = self.$('#ALARM_RULE_SET_' + alarm_level_id).is(":checked");
                if (alarm_switch) {
                    var condi_type_generate = "";
                    if (self.$('[name=CONDI_TYPE_GENERATE_' + alarm_level_id + '][value="AND"]').is(':checked')) {
                        condi_type_generate = "AND"
                    } else {
                        condi_type_generate = "OR"
                    }
                    alarmRuleList[alarmRuleList.length] = {
                        RULE_TYPE: "0",
                        ALARM_LEVEL: alarm_level_id,
                        CONDI_TYPE: condi_type_generate,
                        TIME_WINDOW: self.$('#TIME_WINDOW_GENERATE_' + alarm_level_id).is(":checked") ? "1" : "0",
                        TIME_WINDOW_VALUE: self.$('[name=TIME_WINDOW_VALUE_GENERATE_' + alarm_level_id + ']').val(),
                        DETAIL_LIST: self.getAlarmItemList(alarm_level_id, 0)
                    };
                }
            });
            var condi_type_clear = "";
            if(self.$('[name=CONDI_TYPE_CLEAR][value="AND"]').is(':checked')){
                condi_type_clear = "AND"
            }else {
                condi_type_clear = "OR"
            }
            alarmRuleList[alarmRuleList.length] = {
                RULE_TYPE: "1",
                ALARM_LEVEL: "0",
                CONDI_TYPE: condi_type_clear,
                TIME_WINDOW: self.$('#time_window_clear').is(":checked")?"1":"0",
                TIME_WINDOW_VALUE: self.$('[name=TIME_WINDOW_VALUE_CLEAR]').val(),
                DETAIL_LIST: self.getAlarmItemList("0", 1)
            };
            return alarmRuleList;
        },

        updateAlarmItemKpiList: function(kpiList){
            fish.forEach(this.alarmItemList, function(item) {
                item.updateKpiList(kpiList);
            });
        },

        getAlarmItemList: function(alarm_level_id, rule_type ){
            var self = this;
            var alarmItemList = [];
            fish.forEach(this.alarmItemList, function(item) {
                if(item.rule_type == rule_type && item.alarm_level_id == alarm_level_id) {
                    var alarmItemForm = item.$alarmItemForm;
                    alarmItemList[alarmItemList.length] = item.getItemDetail();
                }
            });
            return alarmItemList;
        },

        // 模板概况页签点击下一步操作
        tplInfoTabOk: function() {
            var self = this;
            if (!this.$tplInfoForm.isValid()) {
                return;
            }
            var value = this.$tplInfoForm.form("value");
            if(this.UP_TEMPLATE_ID){
                self.tplObj["UP_TEMPLATE_ID"] = this.UP_TEMPLATE_ID;
            }
            self.tplObj["NE_TYPE"] = this.$ne_type_combox.combobox('value');
            self.tplObj["TEMPLATE_NAME"] = value["TEMPLATE_NAME"];
            self.tplObj["STATE"] = (value["IS_STATE"]=="on")?"1":"0";
            self.tplObj["TEMPLATE_DESC"] = value["TEMPLATE_DESC"];
            self.tplObj["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
            self.tplObj["EMS_VER_CODE"] = this.EMS_VER_CODE;
            self.tplObj["EMS_CODE"] = this.EMS_CODE;
            //
            var ne_icon = "";
            if(this.selectableNeIconList.length>0){
                ne_icon = this.selectableNeIconList[self.$neIconSlick.slick("slickCurrentSlide")].ICON_URL;
            }
            self.tplObj["NE_ICON"] = ne_icon;
            this.clickNavTabs(null,$(".js-nav-tabs").eq(1));
        },

        // 关联指标页签点击下一步操作
        relativeKpiTabOk: function() {
            var self = this;
            if (!this.$relativeKpiForm.isValid()) {
                return;
            }
            var value = this.$relativeKpiForm.form("value");
            self.tplObj["MODEL_PHY_CODE"] = this.$model_phy_code_combox.combobox('value');
            fish.forEach(this.modelList, function(model){
                if(model.MODEL_PHY_CODE == self.tplObj["MODEL_PHY_CODE"]){
                    self.tplObj["MODEL_BUSI_CODE"] = model.MODEL_BUSI_CODE;
                }
            });
            self.tplObj["FIELD_CODE"] = this.$field_code_combox.combobox('value');
            //
            var kpiList = this.getSelectedKpiList();
            if(kpiList.length==0){
                fish.toast('info', "请至少选择一个指标");
                return;
            }
            self.tplObj["KPI_LIST"] = kpiList;
            self.updateAlarmItemKpiList(kpiList);
            this.clickNavTabs(null,$(".js-nav-tabs").eq(2));
        },

        alarmActionSwitch: function(){
            var isOpen = this.$(".js-alarm-action-switch").prop("checked") ;
            if(isOpen){
                this.$(".js-alarm-action-cfg-div").show();
            }else{
                this.$(".js-alarm-action-cfg-div").hide();
            }
        },

        alarmRuleStateSwitch: function(){
            var isOpen = this.$(".js-alarm-rule-switch").prop("checked") ;
            var selRule = this.$alarm_rule_grid.jqGrid("getSelection");
            if(isOpen){
                selRule.STATE = '1';
            }else{
                selRule.STATE = '0';
            }
            this.$alarm_rule_grid.jqGrid("reloadData");
            this.$alarm_rule_grid.jqGrid("setSelection", selRule);
        },

        // 告警级别页签
        loadAlarmLevelTabs:function(){
            var self = this;
            this.alarmLevelList = this.pmUtil.paravalue("ALARM_LEVEL");
            fish.forEach(this.alarmLevelList, function(para, index){
                var val = JSON.parse(para[this.pmUtil.parakey.val]);
                var alarm_level_id = val['level'];
                this.$(".js-alarm-level-ul").append("<li>"
                + "<a href='#demo-tabs-box-" + alarm_level_id + "' style='color:"+val['color']+"' class='js-alarm-level-tab-a'\"> "
                + "<span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "
                + para[this.pmUtil.parakey.name] + "</a></li>");
                this.$(".js-alarm-level-content").append(
                    this.alarmLevelTab(
                        fish.extend(
                            {},
                            this.i18nData,
                            {'alarm-level': alarm_level_id,'alarm-level-name': para[this.pmUtil.parakey.name]}
                        )
                    )
                );
                //
                this.$("#alarm_rule_generate_add_" + alarm_level_id).on('click', function(e){
                    var alarm_level_id = e.currentTarget.id.substring(24);
                    self.addAlarmGenerateItem(alarm_level_id, 0);
                });
            }.bind(this));
            this.$("#alarm_rule_clear_add").on('click', function(e){
                self.addAlarmClearItem(0, 1);
            });
            this.$tab = this.pmUtil.tab(this.$('.js-alarm-level-tab'),{});
        },

        addAlarmGenerateItem: function(alarm_level_id, rule_type, detailItem) {
            var self = this;
            var option = {
                alarm_level_id: alarm_level_id,
                rule_type: rule_type
            };
            if(detailItem) {
                option["rule_dt_id"] = detailItem.RULE_DT_ID;
            }
            option["kpi_list"] = this.tplObj.KPI_LIST;
            var view = new alarmGenerateItem(option);
            for(var i=0;i<self.alarmItemList.length;i++){
                if(self.alarmItemList[i].rule_dt_id == view.rule_dt_id){
                    self.alarmItemList.splice(i,1);
                }
            }
            self.alarmItemList[self.alarmItemList.length] = view;
            view.render();
            this.$("#alarm_rule_generate_item_" + alarm_level_id).append(view.$el.find(".comprivroot > div").context.childNodes[0]);
            view.afterRender();
            self.listenTo(view, 'addAlarmGenerateItem', function (data) {
                self.addAlarmGenerateItem(data.alarm_level_id, data.rule_type);
            });
            self.listenTo(view, 'delAlarmGenerateItem', function (data) {
                self.delAlarmGenerateItem(data.rule_dt_id);
            });
            if(detailItem){
                $("[name=KPI_CODE_" + view.rule_dt_id + "]").combobox('value', detailItem.KPI_CODE);
                $("[name=OPER_TYPE_" + view.rule_dt_id + "]").combobox('value', detailItem.OPER_TYPE);
                //
                var threshold_type = detailItem.THRESHOLD_TYPE;
                $("[name=THRESHOLD_TYPE_" + view.rule_dt_id + "]").combobox('value', threshold_type);
                if(threshold_type == "00"){
                    $("[name=THRESHOLD_VALUE3_00_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE3);
                    $("[name=THRESHOLD_VALUE4_00_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE4);
                }else {
                    $("[name=THRESHOLD_VALUE_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE);
                    $("[name=THRESHOLD_VALUE2_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE2);
                    $("[name=THRESHOLD_VALUE3_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE3);
                    $("[name=THRESHOLD_VALUE4_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE4);
                }
            }
        },

        addAlarmClearItem: function(alarm_level_id, rule_type, detailItem, kpi_list) {
            var self = this;
            var option = {
                alarm_level_id: alarm_level_id,
                rule_type: rule_type
            };
            if(detailItem) {
                option["rule_dt_id"] = detailItem.RULE_DT_ID;
            }
            option["kpi_list"] = this.tplObj.KPI_LIST;
            var view = new alarmGenerateItem(option);
            for(var i=0;i<self.alarmItemList.length;i++){
                if(self.alarmItemList[i].rule_dt_id == view.rule_dt_id){
                    self.alarmItemList.splice(i,1);
                }
            }
            self.alarmItemList[self.alarmItemList.length] = view;
            view.render();
            this.$("#alarm_rule_clear_item").append(view.$el.find(".comprivroot > div").context.childNodes[0]);
            view.afterRender();
            self.listenTo(view, 'addAlarmGenerateItem', function (data) {
                self.addAlarmClearItem(data.alarm_level_id, data.rule_type);
            });
            self.listenTo(view, 'delAlarmGenerateItem', function (data) {
                self.delAlarmGenerateItem(data.rule_dt_id);
            });
            if(detailItem){
                $("[name=KPI_CODE_" + view.rule_dt_id + "]").combobox('value', detailItem.KPI_CODE);
                $("[name=OPER_TYPE_" + view.rule_dt_id + "]").combobox('value', detailItem.OPER_TYPE);
                //
                var threshold_type = detailItem.THRESHOLD_TYPE;
                $("[name=THRESHOLD_TYPE_" + view.rule_dt_id + "]").combobox('value', threshold_type);
                if(threshold_type == "00"){
                    $("[name=THRESHOLD_VALUE3_00_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE3);
                    $("[name=THRESHOLD_VALUE4_00_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE4);
                }else {
                    $("[name=THRESHOLD_VALUE_01_" + view.rule_dt_id + "]").combobox('value', detailItem.THRESHOLD_VALUE);
                    $("[name=THRESHOLD_VALUE2_01_" + view.rule_dt_id + "]").combobox('value', detailItem.THRESHOLD_VALUE2);
                    $("[name=THRESHOLD_VALUE3_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE3);
                    $("[name=THRESHOLD_VALUE4_01_" + view.rule_dt_id + "]").val(detailItem.THRESHOLD_VALUE4);
                    $("[name=THRESHOLD_VALUE5_01_" + view.rule_dt_id + "]").combobox('value', detailItem.THRESHOLD_VALUE5);
                }
            }
        },

        delAlarmGenerateItem: function (rule_dt_id) {
            for (var i = 0;i < this.alarmItemList.length;i++) {
                var fmtItem = this.alarmItemList[i];
                if (fmtItem.rule_dt_id == rule_dt_id) {
                    this.alarmItemList.splice(i, 1);
                    this.$("div[name="+rule_dt_id+"]").remove();
                }
            }
        },

        alarmRuleSet: function(event,target){
            if(!event && !target) return false;
            if(!target) target = event.target;
            var tabs = $(target).parents("div[tabs]");
            if($(target).is(":checked")){
                $(tabs).find(".js-alarm-rule-div").removeClass('hide');
            }else{
                $(tabs).find(".js-alarm-rule-div").addClass('hide');
            }
            var index = this.$('.js-alarm-level-content div[tabs]').index(tabs);
            this.$tab.checked(index,$(target).is(":checked"));
        },

        alarmWindowSwitch: function(event,target){
            if(!event && !target) return false;
            if(!target) target = event.target;
            var tabs = $(target).parents("div[tabs]");
            var idPrefix = event.currentTarget.id.substring(0, 20);// TIME_WINDOW_GENERATE_
            if($(target).is(":checked")){
                if(idPrefix == "TIME_WINDOW_GENERATE"){
                    $(tabs).find(".js-alarm-generate-windowvalue").show();
                    $(tabs).find(".js-alarm-generate-windowvalue").focus();
                }else{
                    $(tabs).find(".js-alarm-clear-windowvalue").show();
                    $(tabs).find(".js-alarm-clear-windowvalue").focus();
                }
            }else{
                if(idPrefix == "TIME_WINDOW_GENERATE"){
                    $(tabs).find(".js-alarm-generate-windowvalue").hide();
                }else{
                    $(tabs).find(".js-alarm-clear-windowvalue").hide();
                }
            }
        },

        alarmClearWindowSwitch: function(event,target){
            if(!event && !target) return false;
            if(!target) target = event.target;
            if($(target).is(":checked")) {
                this.$el.find(".js-alarm-clear-windowvalue").show();
                this.$el.find(".js-alarm-clear-windowvalue").focus();
            }else {
                this.$el.find(".js-alarm-clear-windowvalue").hide();
            }
        },

        selectableKpiSearch: function () {
            this.$('[name=tplmgr-kpi-selectable]').empty();
            var reloadData = [];
            var searchCont = this.$('#tplmgr-selectablekpi-search').val();
            if(searchCont == ''){
                var selectableList = this.getSelectableKpiList();
                for (var i = 0; i < selectableList.length; i++) {
                    var item =  selectableList[i];
                    this.cancelKpiData(item.KPI_CODE);
                }
            }else {
                var matchCount = 0;
                var selectableList = this.getSelectableKpiList();
                for (var i = 0; i < selectableList.length; i++) {
                    var item =  selectableList[i];
                    if (item.KPI_NAME.toLowerCase().indexOf(searchCont.toLowerCase()) != -1) {
                        this.cancelKpiData(item.KPI_CODE);
                    }
                }
            }
        },

        selectedKpiSearch: function () {
            this.$('[name=tplmgr-kpi-selected]').empty();
            var reloadData = [];
            var searchCont = this.$('#tplmgr-selectedkpi-search').val();
            if(searchCont == ''){
                var selectedList = this.getSelectedKpiList();
                for (var i = 0; i < selectedList.length; i++) {
                    var item =  selectedList[i];
                    this.selectKpiData(item.KPI_CODE);
                }
            }else {
                var matchCount = 0;
                var selectedList = this.getSelectedKpiList();
                for (var i = 0; i < selectedList.length; i++) {
                    var item =  selectedList[i];
                    if (item.KPI_NAME.indexOf(searchCont) != -1) {
                        this.selectKpiData(item.KPI_CODE);
                    }
                }
            }
        },

        getSelectableKpiList: function () {
            var listLength = this.$('[name=tplmgr-selected-kpi]').length;
            var selectableList = [];
            for(var i=0; i<this.allKpiList.length; i++) {
                var item = this.allKpiList[i];
                var isSelected = false;
                for(var j=0; j<listLength; j++) {
                    var dataId = this.$('[name=tplmgr-selected-kpi]')[j].id.substring(20);
                    if (dataId == item.KPI_CODE) {
                        isSelected = true;
                        break;
                    }
                }
                if(!isSelected){
                    selectableList[selectableList.length] = item;
                }
            }
            return selectableList;
        },

        getSelectedKpiList: function() {
            var listLength = this.$('[name=tplmgr-selected-kpi]').length;
            var selectedList = [];
            for(var i=0; i<listLength; i++) {
                var kpi_code = this.$('[name=tplmgr-selected-kpi]')[i].id.substring(20);// tplmgr-kpi-selected-xxx
                for(var j=0; j<this.allKpiList.length; j++) {
                    if(kpi_code == this.allKpiList[j].KPI_CODE) {
                        selectedList[selectedList.length] = this.allKpiList[j];
                        break;
                    }
                }
            }
            return selectedList;
        },

        searchBtnClick: function() {
            //this.$('#tplmgr-selectablekpi-search').val('')
            this.$('#tplmgr-selectablekpi-search').toggle();
        },

        addAllKpi: function() {
            this.$('[name=tplmgr-kpi-selectable]').empty();
            this.$('[name=tplmgr-kpi-selected]').empty();
            for(var i=0; i<this.allKpiList.length; i++) {
                var item = this.allKpiList[i];
                this.selectKpiData(item.KPI_CODE);
            }
        },

        removeAllKpi: function() {
            this.$('[name=tplmgr-kpi-selectable]').empty();
            this.$('[name=tplmgr-kpi-selected]').empty();
            for(var i=0; i<this.allKpiList.length; i++) {
                var item = this.allKpiList[i];
                this.cancelKpiData(item.KPI_CODE);
            }
        },

        showNotifyObjBox: function() {
            this.$('.js-notify-obj-param-box').toggleClass('fadeInUp animated block');
            this.$(".tplmgr-notify-obj-param-grid:visible").jqGrid("setGridHeight", 120);
            this.$(".tplmgr-notify-obj-param-grid").jqGrid("setGridWidth", 510);
        },

        showAllIcon: function() {
            var self = this;
            this.$('#tplmgr_ne_icon').hide();
            this.$('#tplmgr_ne_icon_all').show();
            this.$('#tplmgr-allicon-hide-btn').show();
            this.$('#tplmgr-allicon-btn').hide();
        },

        hideAllIcon: function() {
            var self = this;
            this.$('#tplmgr_ne_icon').show();
            this.$('#tplmgr_ne_icon_all').hide();
            this.$('#tplmgr-allicon-hide-btn').hide();
            this.$('#tplmgr-allicon-btn').show();
        },

        iconClick: function(e) {
            var self = this;
            var ne_icon = e.currentTarget.name;
            this.$('#tplmgr_ne_icon').show();
            this.$('#tplmgr_ne_icon_all').hide();
            this.$('#tplmgr-allicon-btn').show();
            this.$('#tplmgr-allicon-hide-btn').hide();
            for(var i=0;i<self.selectableNeIconList.length;i++){
                if(ne_icon == self.selectableNeIconList[i].ICON_URL){
                    self.$neIconSlick.slick("slickGoTo", i, true);
                }
            }
        }

	});
});
