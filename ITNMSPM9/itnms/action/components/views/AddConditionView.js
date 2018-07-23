define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addConditionView.html",
    'i18n!oss_core/itnms/action/i18n/action',
    "oss_core/itnms/action/components/views/AddTriggerView.js",
    "oss_core/itnms/action/components/views/AddGroupView.js",
    "oss_core/itnms/action/components/views/AddHostView.js",
    "oss_core/itnms/action/components/views/AddTemView.js"
], function(action,tpl,i18nData,AddTriggerView,AddGroupView,AddHostView,AddTemView) {
    var AddConditionView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddConditionView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddConditionView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        this.groupArr = []
        this.groupArrV = []
        this.hostArr = []
        this.hostArrV = []
        this.temArr = []
        this.temArrV = []
        this.triggerArr = []
        this.triggerArrV = []
        self.afterPopup();
    }

    AddConditionView.prototype.afterPopup = function() {
        var self = this;
        this.renderCombox()
        this.renderSelect()
        this.$el.find('.reset').off('click').on('click', function() {
            self.$popup.hide();
        });
        this.$el.find('.isSure').off('click').on('click', function() {
            //self.$popup.hide();
            self.getVal()
        });
        this.$el.find('.addTrigger').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addTriggeView = new AddTriggerView();
            addTriggeView.popup(options,self.SearchItem,function(param) {
                self.appendTrigger(param)
            });
        });
        this.$el.find('.addGroup').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addGroupView = new AddGroupView();
            addGroupView.popup(options,self.SearchItem,function(param) {
                //console.log(param)
                self.appendGroup(param)
            });
        });
        this.$el.find('.addHoust').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addHostView = new AddHostView();
            addHostView.popup(options,self.SearchItem,function(param) {
                self.appendHost(param)
                console.log(param)
            });
        });
        this.$el.find('.addTem').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addTemView = new AddTemView();
            addTemView.popup(options,self.SearchItem,function(param) {
                self.appendTem(param)
                console.log(param)
            });
        });
    }

    AddConditionView.prototype.getVal = function(param) {
        var self = this;
        var isCheck = self.$el.find(".actionList input[name='checkCon']:checked");
        var checkval = isCheck.val();
        var cIpt1 = isCheck.parent().parent().parent().find('.comSpan .cIpt1').combobox('getSelectedItem');
        var cIpt2 = isCheck.parent().parent().parent().find('.comSpan .cIpt2').val();
        var mulselect = []
        $.each(isCheck.parent().parent().parent().find('.itemFrom .mulselect').multiselect('selectedItems'), function(index, val) {
            mulselect.push(val)
        });
        console.log(checkval,cIpt1,mulselect)
    }

    AddConditionView.prototype.appendTrigger = function(param) {
        var self = this;
        var arr = []
        fish.map(self.triggerArr, function(d) {
            arr.push(d.id);
        })
        fish.map(param, function(d) {
            var index = $.inArray(d.triggerid,arr)
            if(index < 0){
                self.triggerArrV.push(d.triggerid);
                self.triggerArr.push({
                    'id': d.triggerid,
                    'value': d.name
                });
             }
        })
        console.log(self.triggerArr,arr,self.triggerArrV)
        self.$selectTrigger.multiselect('option',{dataTextField:'value',dataValueField:'id',dataSource:self.triggerArr});
        self.$selectTrigger.multiselect('value',self.triggerArrV);
    }

    AddConditionView.prototype.appendGroup = function(param) {
        var self = this;
        var arr = []
        fish.map(self.groupArr, function(d) {
            arr.push(d.id);
        })
        fish.map(param, function(d) {
            var index = $.inArray(d.groupid,arr)
            if(index < 0){
                self.groupArrV.push(d.groupid);
                self.groupArr.push({
                    'id': d.groupid,
                    'value': d.name
                });
             }
        })
        self.$selectGroup.multiselect('option',{dataTextField:'value',dataValueField:'id',dataSource:self.groupArr});
        self.$selectGroup.multiselect('value', self.groupArrV);
    }

     AddConditionView.prototype.appendHost = function(param) {
        var self = this;
        var arr = []
        fish.map(self.hostArr, function(d) {
            arr.push(d.id);
        })
        fish.map(param, function(d) {
            var index = $.inArray(d.hostid,arr)
            if(index < 0){
                self.hostArrV.push(d.hostid);
                self.hostArr.push({
                    'id': d.hostid,
                    'value': d.name
                });
             }
        })
        self.$selectHost.multiselect('option',{dataTextField:'value',dataValueField:'id',dataSource:self.hostArr});
        self.$selectHost.multiselect('value', self.hostArrV);
    }

    AddConditionView.prototype.appendTem = function(param) {
        var self = this;
        var arr = []
        fish.map(self.temArr, function(d) {
            arr.push(d.id);
        })
        fish.map(param, function(d) {
            var index = $.inArray(d.templateid,arr)
            if(index < 0){
                self.temArrV.push(d.templateid);
                self.temArr.push({
                    'id': d.templateid,
                    'value': d.name
                });
             }
        })
        self.$selectTem.multiselect('option',{dataTextField:'value',dataValueField:'id',dataSource:self.temArr});
        self.$selectTem.multiselect('value', self.temArrV);
    }

    AddConditionView.prototype.creatCode = function() {
        var carry = 1;
        var carry2 = 0;
        var r = "";
        for(var i=id.length-1;i>=0;i--){
            carry2=(id.charCodeAt(i)+carry)%91==0?1:0;
            r=String.fromCharCode((id.charCodeAt(i)+carry)%91+carry2*65)+r;
            carry=carry2;
        }
        r = (carry==1?"A":"")+r;
        return r;
    }

    AddConditionView.prototype.renderSelect = function() {
        var self = this;
        var groupid = [];
        self.$selectGroup = self.$el.find('.cGroup').multiselect()
        self.$selectHost = self.$el.find('.cHoust').multiselect()
        self.$selectTrigger = self.$el.find('.cTrigger').multiselect({
            createItem: function(e, item) {
                console.log('new item created:', item);
            }
        })
        self.$selectTem = self.$el.find('.cTem').multiselect()
    }

    AddConditionView.prototype.renderCombox = function() {
        var self = this;
        action.itemTypes('ACTION_CONDITION_OPERATOR_0,ACTION_CONDITION_OPERATOR_1,ACTION_CONDITION_OPERATOR_2,ACTION_CONDITION_OPERATOR_3,ACTION_CONDITION_OPERATOR_4,ACTION_CONDITION_OPERATOR_6,ACTION_CONDITION_OPERATOR_13,ACTION_CONDITION_OPERATOR_16,ACTION_CONDITION_OPERATOR_25,ACTION_CONDITION_OPERATOR_26,TRIGGER_SEVERITY_LEVEL').then(function(datas){
            self.$con0 = self.$el.find('#conD0').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_0
            });
            self.$con0.combobox('value',datas.ACTION_CONDITION_OPERATOR_0[0].paraValue)
            self.$con1 = self.$el.find('#conD1').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_1
            });
            self.$con1.combobox('value',datas.ACTION_CONDITION_OPERATOR_1[0].paraValue)
            self.$con2 = self.$el.find('#conD2').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_2
            });
            self.$con2.combobox('value',datas.ACTION_CONDITION_OPERATOR_2[0].paraValue)
            self.$con3 = self.$el.find('#conD3').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_3
            });
            self.$con3.combobox('value',datas.ACTION_CONDITION_OPERATOR_3[0].paraValue)
            self.$con4 = self.$el.find('#conD4').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_4
            });
            self.$con4.combobox('value',datas.ACTION_CONDITION_OPERATOR_4[0].paraValue)
            self.$con6 = self.$el.find('#conD6').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_6
            });
            self.$con6.combobox('value',datas.ACTION_CONDITION_OPERATOR_6[0].paraValue)
            self.$con13 = self.$el.find('#conD13').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_13
            });
            self.$con13.combobox('value',datas.ACTION_CONDITION_OPERATOR_13[0].paraValue)
            self.$con16 = self.$el.find('#conD16').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_16
            });
            self.$con16.combobox('value',datas.ACTION_CONDITION_OPERATOR_16[0].paraValue)
            self.$con25 = self.$el.find('#conD25').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_25
            });
            self.$con25.combobox('value',datas.ACTION_CONDITION_OPERATOR_25[0].paraValue)
            self.$con26 = self.$el.find('#conD26').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_26
            });
            self.$con26.combobox('value',datas.ACTION_CONDITION_OPERATOR_26[0].paraValue)
            self.$cIpt3 = self.$el.find('.cIpt3').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TRIGGER_SEVERITY_LEVEL
            });
            self.$cIpt3.combobox('value',datas.TRIGGER_SEVERITY_LEVEL[0].paraValue)
        })
    }

    return AddConditionView;
})