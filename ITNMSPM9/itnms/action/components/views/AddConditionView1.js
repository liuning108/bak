define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addConditionView1.html",
    'i18n!oss_core/itnms/action/i18n/action',
    "oss_core/itnms/action/components/views/AddGroupView.js",
    "oss_core/itnms/action/components/views/AddHostView.js",
    "oss_core/itnms/action/components/views/AddTemView.js",
    "oss_core/itnms/action/components/views/AddProxysView.js"
], function(action,tpl,i18nData,AddGroupView,AddHostView,AddTemView,AddProxysView) {
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
        this.$el.find('.addProx').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addProxysView = new AddProxysView();
            addProxysView.popup(options,self.SearchItem,function(param) {
                //console.log(param)
                self.appendProxy(param)
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

    AddConditionView.prototype.appendProxy = function(param) {
        var self = this;
        var arr = []
        fish.map(self.groupArr, function(d) {
            arr.push(d.id);
        })
        fish.map(param, function(d) {
            var index = $.inArray(d.proxy_hostid,arr)
            if(index < 0){
                self.groupArrV.push(d.proxy_hostid);
                self.groupArr.push({
                    'id': d.proxy_hostid,
                    'value': d.name
                });
             }
        })
        self.$selectProxy.multiselect('option',{dataTextField:'value',dataValueField:'id',dataSource:self.groupArr});
        self.$selectProxy.multiselect('value', self.groupArrV);
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
        action.itemTypes('ACTION_CONDITION_OPERATOR_7,ACTION_CONDITION_OPERATOR_8,ACTION_CONDITION_OPERATOR_9,ACTION_CONDITION_OPERATOR_10,ACTION_CONDITION_OPERATOR_11,ACTION_CONDITION_OPERATOR_12,ACTION_CONDITION_OPERATOR_18,ACTION_CONDITION_OPERATOR_19,ACTION_CONDITION_OPERATOR_20,ACTION_DISCOVERY_SERVICE_TYPE,ACTION_DISCOVERY_OBJECT_TYPE,ACTION_DISCOVERY_STATUS').then(function(datas){
            self.$con7 = self.$el.find('#conD7').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_7
            });
            self.$con7.combobox('value',datas.ACTION_CONDITION_OPERATOR_7[0].paraValue)
            self.$con8 = self.$el.find('#conD8').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_8
            });
            self.$con8.combobox('value',datas.ACTION_CONDITION_OPERATOR_8[0].paraValue)
            self.$con9 = self.$el.find('#conD9').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_9
            });
            self.$con9.combobox('value',datas.ACTION_CONDITION_OPERATOR_9[0].paraValue)
            self.$con10 = self.$el.find('#conD10').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_10
            });
            self.$con10.combobox('value',datas.ACTION_CONDITION_OPERATOR_10[0].paraValue)
            self.$con11 = self.$el.find('#conD11').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_11
            });
            self.$con11.combobox('value',datas.ACTION_CONDITION_OPERATOR_11[0].paraValue)
            self.$con12 = self.$el.find('#conD12').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_12
            });
            self.$con12.combobox('value',datas.ACTION_CONDITION_OPERATOR_12[0].paraValue)
            self.$con18 = self.$el.find('#conD18').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_18
            });
            self.$con18.combobox('value',datas.ACTION_CONDITION_OPERATOR_18[0].paraValue)
            self.$con19 = self.$el.find('#conD19').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_19
            });
            self.$con19.combobox('value',datas.ACTION_CONDITION_OPERATOR_19[0].paraValue)
            self.$con20 = self.$el.find('#conD20').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_CONDITION_OPERATOR_20
            });
            self.$con20.combobox('value',datas.ACTION_CONDITION_OPERATOR_20[0].paraValue)
            self.$eventType1 = self.$el.find('.eventType1').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_DISCOVERY_OBJECT_TYPE
            });
            self.$eventType1.combobox('value',datas.ACTION_DISCOVERY_OBJECT_TYPE[0].paraValue)
            self.$eventType2 = self.$el.find('.eventType2').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_DISCOVERY_STATUS
            });
            self.$eventType2.combobox('value',datas.ACTION_DISCOVERY_STATUS[0].paraValue)
            self.$eventType3 = self.$el.find('.eventType3').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_DISCOVERY_SERVICE_TYPE
            });
            self.$eventType3.combobox('value',datas.ACTION_DISCOVERY_SERVICE_TYPE[0].paraValue)
        })
    }
    return AddConditionView;
})