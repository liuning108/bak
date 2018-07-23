define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/actionPageView.html",
    "oss_core/itnms/action/components/views/AddConditionView.js",
    "oss_core/itnms/action/components/views/AddHongView.js",
    "oss_core/itnms/action/components/views/AddExpressionView.js",
    "oss_core/itnms/action/components/views/SendMessageView.js",
    "oss_core/itnms/action/components/views/RemoteCommondView.js",
    "oss_core/itnms/action/components/views/NotifyView.js",
    "oss_core/itnms/action/components/views/SendMessageView1.js",
    "oss_core/itnms/action/components/views/RemoteCommondView1.js",
    "oss_core/itnms/action/components/views/AddGroupsView.js",
    "oss_core/itnms/action/components/views/AddTemplatesView.js",
    "oss_core/itnms/action/components/views/AddOpinventoryView.js",
    "oss_core/itnms/action/components/views/RemoveGroupsView.js",
    "oss_core/itnms/action/components/views/RemoveTemplatesView.js",
    "oss_core/itnms/action/components/views/AddConditionView1.js",
    "oss_core/itnms/action/components/views/AddConditionView2.js",
    "oss_core/itnms/action/components/views/AddConditionView3.js"
], function(action,tpl,AddConditionView,AddHongView,AddExpressionView,SendMessageView,RemoteCommondView,NotifyView,SendMessageView1,RemoteCommondView1,AddGroupsView,AddTemplatesView,AddOpinventoryView,RemoveGroupsView,RemoveTemplatesView,AddConditionView1,AddConditionView2,AddConditionView3) {
    var TriggerPageView = function(options) {
        this.options = options;
        this.tpl = fish.compile(tpl);
        this.dataList = this.options.dataList;
        this.itemObj = this.options.itemObj;
        this.upObj = this.options.upObj;
        this.pKeys = 0;
        this.$el = $(this.options.el);
        this.selectItems = {};
        this.cType = this.options.cType
        this.dataList.cType = this.cType
        switch(this.cType){
            case 0:
            this.state = {
                data: ['.Step1', ".Step2",'.Step3','.Step4'],
                curIndex: 0
            }
            break;
            case 1:
            this.state = {
                data: ['.Step1', ".Step2"],
                curIndex: 0
            }
            break;
            case 2:
            this.state = {
                data: ['.Step1', ".Step2"],
                curIndex: 0
            }
            break;
            case 3:
            this.state = {
                data: ['.Step1', ".Step2",'.Step3'],
                curIndex: 0
            }
            break;
        }
    }

    TriggerPageView.prototype.render = function() {
        var self = this;
        this.remove();
        self.loadData(self.dataList);
        self.afterRender();
    }

    TriggerPageView.prototype.loadData = function(data){
        var self = this;
        self.$el.html(self.tpl(self.dataList));
    }

    TriggerPageView.prototype.remove = function() {
        this.$el.html("");
    }

    TriggerPageView.prototype.afterRender = function() {
        var self = this;
        self.prevNextBtn()
        self.sCombobox()
        self.switchBtn()
        self.renderGird();
        self.$el.find('.addHong').off('click').bind('click',function(){
            var tag = $(this).data('tag');
            var options = {
                height: 400,
                width: (self.$el.width() / 2),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addHongView = new AddHongView();
            addHongView.popup(options,self.SearchItem,function(param) {
                console.log(param)
                self.addTextArea(param.macro,tag)
            });
        });
        self.$el.find('.addExpression').off('click').bind('click',function(){
            var tag = $(this).data('tag');
            var options = {
                height: self.$el.height(),
                width: (self.$el.width() / 2.3),
                modal: true,
                draggable: false,
                autoResizable: true,
                position: {
                    'of': self.$el,
                    'my': "top",
                    'at': "right" + " " + "top",
                    collision: "fit"
                }
            };
            var addExpressionView = new AddExpressionView();
            addExpressionView.popup(options,self.selectItems,function(param) {
                console.log(param)
                if(param){
                    self.addTextArea(param,tag)
                }
            });
        });
        self.renderTriggerInfo();
    }

    TriggerPageView.prototype.addTextArea = function(param,tag) {
        var self = this;
        if(tag === 'express'){
            var eVal = this.$el.find('.expression').val() + param;
            this.$el.find('.expression').val(eVal);
        }else{
            var eVal = this.$el.find('.recovery_expression').val() + param;
            this.$el.find('.recovery_expression').val(eVal);
        }
    }

    TriggerPageView.prototype.switchBtn = function() {
        var self = this;
        this.$state = self.$el.find('.status').switchbutton('option','size','xs');
    }

    TriggerPageView.prototype.sCombobox = function() {
        var self = this;
        this.$eventType = self.$el.find('.eventType').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_CONDITION_EVALTYPE
        });
        this.$eventType.combobox('value',self.dataList.ACTION_CONDITION_EVALTYPE[0].paraValue)
        this.$eventType.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
        });
        this.$addOpe_0 = self.$el.find('.addOpe_0').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_0
        });
        this.$addOpe_0.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal);
        });
        this.$addOpe_r = self.$el.find('.addOpe_r').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_0_r
        });
        this.$addOpe_r.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal,true);
        });
        this.$addOpe_0_ack = self.$el.find('.addOpe_0_ack').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_0_ack
        });
        this.$addOpe_0_ack.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal,true);
        });
        this.$ACTION_OPERATION_TYPE_1 = self.$el.find('.ACTION_OPERATION_TYPE_1').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_1
        });
        this.$ACTION_OPERATION_TYPE_1.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal,true);
        });

        this.$ACTION_OPERATION_TYPE_2 = self.$el.find('.ACTION_OPERATION_TYPE_2').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_2
        });
        this.$ACTION_OPERATION_TYPE_2.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal,true);
        });

        this.$ACTION_OPERATION_TYPE_3 = self.$el.find('.ACTION_OPERATION_TYPE_3').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_3
        });
        this.$ACTION_OPERATION_TYPE_3.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal);
        });

        this.$ACTION_OPERATION_TYPE_3_r = self.$el.find('.ACTION_OPERATION_TYPE_3_r').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.ACTION_OPERATION_TYPE_3_r
        });
        this.$ACTION_OPERATION_TYPE_3_r.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            self.addOpeChange(pVal,true);
        });
    }

    TriggerPageView.prototype.addOpeChange = function(pVal,type) {
        var self = this;
        if(pVal){
            if(pVal === '0'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                if(type){
                    var sendMessageView = new SendMessageView1();
                }else{
                    var sendMessageView = new SendMessageView();
                }
                sendMessageView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '1'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                if(type){
                    var remoteCommondView = new RemoteCommondView1();
                }else{
                    var remoteCommondView = new RemoteCommondView();
                }
                remoteCommondView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '4'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var addGroupsView = new AddGroupsView();
                addGroupsView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '5'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var removeGroupsView = new RemoveGroupsView();
                removeGroupsView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '6'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var addTemplatesView = new AddTemplatesView();
                addTemplatesView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '7'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var removeTemplatesView = new RemoveTemplatesView();
                removeTemplatesView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '10'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var addOpinventoryView = new AddOpinventoryView();
                addOpinventoryView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }else if(pVal === '11'){
                var options = {
                    height: self.$el.height(),
                    width: 890,
                    modal: true,
                    draggable: false,
                    autoResizable: true,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                var notifyView = new NotifyView();
                notifyView.popup(options,self.selectItems,function(param) {
                    console.log(1)
                });
            }
        }
    }

    TriggerPageView.prototype.renderGird = function() {
        var self = this;
        var optDep = {
            data: [],
            height: 230,
            gridComplete: function() {
                var $el = $(self.options.el);
                self.$el.find('.DepListGrid').on('click', '.prossDel', function(e) {
                    var selrow = self.$DepGrid.grid("getSelection");
                    self.$DepGrid.grid("delRowData", selrow);
                })
                self.$el.find('.delCondition').off('click').bind('click',function(){
                    var selrow = self.$DepGrid.grid("getCheckRows");
                    fish.map(selrow, function(d) {
                        self.$DepGrid.grid("delRowData", d);
                    })
                })
                self.$el.find('.addCondition').off('click').on('click', function() {
                    var options = {
                        height: 520,
                        width: 770,
                        modal: true,
                        draggable: false,
                        autoResizable: true,
                        position: {
                            'of': $el,
                            'my': "top",
                            'at': "right" + " " + "top",
                            collision: "fit"
                        }
                    };
                    console.log(self.cType)
                    if(self.cType === 0){
                        var addConditionView = new AddConditionView();
                    }else if(self.cType === 1){
                        var addConditionView = new AddConditionView1();
                    }else if(self.cType === 2){
                        var addConditionView = new AddConditionView2();
                    }else if(self.cType === 3){
                        var addConditionView = new AddConditionView3();
                    }
                    addConditionView.popup(options,self.SearchItem,function(param) {
                        console.log(param)
                        self.addRowData(param)
                    });
                });
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'tag',
                label: '标识',
                width: 250
            }, {
                name: 'name',
                label: '名称',
                width: 350
            }, {
                name: 'edit',
                label: '',
                width: 50,
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i class="glyphicon glyphicon-trash prossDel mgr4" data-id="'+cellval+'"></i>'
                }
            }],
            multiselect:true
        };
        this.$DepGrid = this.$el.find('.DepListGrid').grid(optDep);
        this.loadDepdata();

        var optOpe = {
            data: [],
            height: 230,
            gridComplete: function() {
                var $el = $(self.options.el);
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'step',
                label: '步骤',
                key:true,
                search: false
            },{
                name: 'expression',
                label: '详情',
                width: 550
            }, {
                name: 'trends',
                label: '间隔时长'
            }, {
                name: 'edit',
                label: '',
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i class="glyphicon glyphicon-pencil prossEdt mgr4" data-id="'+cellval+'"></i><i class="glyphicon glyphicon-trash prossDel mgr4" data-id="'+cellval+'"></i>'
                }
            }]
        };
        this.$OpeGrid = this.$el.find('.OpeListGrid').grid(optOpe);
        this.loadOpedata();

        var OpeGridType1 = {
            data: [],
            height: 230,
            gridComplete: function() {
                var $el = $(self.options.el);
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'expression',
                label: '详情',
                width: 550
            }, {
                name: 'edit',
                label: '',
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i class="glyphicon glyphicon-pencil prossEdt mgr4" data-id="'+cellval+'"></i><i class="glyphicon glyphicon-trash prossDel mgr4" data-id="'+cellval+'"></i>'
                }
            }]
        };
        this.$OpeGridType1 = this.$el.find('.OpeGridType1').grid(OpeGridType1);
        this.loadOpeGridType1data();

        var OpeGridType2 = {
            data: [],
            height: 230,
            gridComplete: function() {
                var $el = $(self.options.el);
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'expression',
                label: '详情',
                width: 550
            }, {
                name: 'edit',
                label: '',
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i class="glyphicon glyphicon-pencil prossEdt mgr4" data-id="'+cellval+'"></i><i class="glyphicon glyphicon-trash prossDel mgr4" data-id="'+cellval+'"></i>'
                }
            }]
        };
        this.$OpeGridType2 = this.$el.find('.OpeGridType2').grid(OpeGridType2);
        this.loadOpeGridType2data();
    }

    TriggerPageView.prototype.addRowData = function(data) {
        var self = this;
        var result = fish.map(data, function(d) {
            return {
                "triggerid":d.triggerid,
                "tag": d.wizard[0].host,
                "name":d.name,
                "edit":d.triggerid
            }
        })
        self.$DepGrid.grid("addRowData", result);
    }

    TriggerPageView.prototype.loadOpedata = function() {
        var self = this;
        var data = []
        var result = fish.map(data, function(d) {
            return {
                "id":d.id,
                "step": d.step,
                "expression":d.expression,
                "trends":d.trends,
                "edit":d.triggerid
            }
        })
        self.$OpeGrid.grid("reloadData", result);
    }

    TriggerPageView.prototype.loadOpeGridType2data = function() {
        var self = this;
        var data = []
        var result = fish.map(data, function(d) {
            return {
                "id":d.id,
                "expression":d.expression,
                "edit":d.triggerid
            }
        })
        self.$OpeGridType2.grid("reloadData", result);
    }

    TriggerPageView.prototype.loadOpeGridType1data = function() {
        var self = this;
        var data = []
        var result = fish.map(data, function(d) {
            return {
                "id":d.id,
                "expression":d.expression,
                "edit":d.triggerid
            }
        })
        self.$OpeGridType1.grid("reloadData", result);
    }

    TriggerPageView.prototype.loadDepdata = function() {
        var self = this;
        var data = []
        var tData = [];
        var wData = [];
        if(self.upObj && self.upObj.dependencies.length > 0){
            var resultT = fish.map(self.upObj.dependencies, function(d) {
                return d.triggerid
            })
            action.triggerGet({"triggerids":resultT}).then(function(data) {
                var result = fish.map(data.result, function(d) {
                    return {
                        "triggerid":d.triggerid,
                        "tag": d.hosts[0].host,
                        "name":d.description,
                        "edit":d.triggerid
                    }
                })
                self.$DepGrid.grid("reloadData", result);
            })
        }else{
            var result = fish.map(data, function(d) {
                return {
                    "triggerid":d.triggerid,
                    "tag": d.wizard,
                    "name":d.name,
                    "edit":d.triggerid
                }
            })
            self.$DepGrid.grid("reloadData", result);
        }
    }

    TriggerPageView.prototype.prevNextBtn = function() {
        var self = this;
        this.$el.find('.stepNext').off('click').on('click', function() {
            self.stepNext($(this))
        })
        this.$el.find('.stepUp').off('click').on('click', function() {
            self.stepUp($(this))
        })
        this.$el.find('.hostPageCancel').off('click').on('click', function() {
            self.options.parent.cancel();
        });
    }

    TriggerPageView.prototype.stepNext = function(_this) {
        var self = this;
        var $ws = this.$el.find('.kdoWizardSteps') //把当前的状态设置为complete,当前显示的页面为hide
        var curState = this.state.data[this.state.curIndex];
        $ws.find(curState).removeClass('active').addClass('complete');
        var curView = $ws.find(curState).data('view');
        if (this.state.curIndex < this.state.data.length - 1) {
            this.$el.find(curView).hide();
        }
        //把下个状态设置为active
        this.state.curIndex = this.state.curIndex + 1;
        if (this.state.curIndex > 0) {
            this.$el.find('.stepUp').removeClass('hide')
                .addClass('show');
        }
        if (this.state.curIndex >= this.state.data.length - 1) {
            _this.html('完成');
        }
        var nextState = this.state.data[this.state.curIndex]
        $ws.find(nextState).addClass('active')
        var curView = $ws.find(nextState).data('view');
        this.$el.find(curView).show();
        if (!nextState) {
            self.done();
            this.state.curIndex = this.state.curIndex - 1;
        }

    }

    TriggerPageView.prototype.done = function() {
        this.options.parent.done();
    }

    TriggerPageView.prototype.renderTriggerInfo = function() {
        var self = this;
        if(self.upObj && self.upObj !== 'undefined'){
            this.$el.find('.filterName').val(self.upObj.description);
            this.$el.find('.url').val(self.upObj.url);
            this.$el.find('.comments').val(self.upObj.comments);
            this.$el.find('.expression').val(self.upObj.expression);
            this.$el.find('.recovery_expression').val(self.upObj.recovery_expression);
            this.$el.find('.correlation_tag').val(self.upObj.correlation_tag);
            this.$status.switchbutton('option','state',(Number(self.upObj.manual_close) === 0) ? false : true);
            this.$state.switchbutton('option','state',(Number(self.upObj.status) === 1) ? false : true);
            this.$priority.combobox('value',self.upObj.priority)
            this.$correlation_mode.combobox('value',self.upObj.correlation_mode)
            this.$recovery_mode.combobox('value',self.upObj.recovery_mode)
            this.$type.combobox('value',self.upObj.type)
        }
    }

    TriggerPageView.prototype.getInfo = function(){
        var self = this;
        var info = {}
        var description = this.$el.find('.filterName').val();
        var url = this.$el.find('.url').val();
        var comments = this.$el.find('.comments').val();
        var expression = this.$el.find('.expression').val();
        var recovery_expression = this.$el.find('.recovery_expression').val();
        var correlation_tag = this.$el.find('.correlation_tag').val();
        var dependencies = self.getDepData();
        if(description) info.description = description
        if(comments) info.comments = comments
        info.manual_close = Number(self.$el.find('.manual_close').switchbutton('option','state') ? 1 : 0)
        info.status = Number(self.$el.find('.status').switchbutton('option','state') ? 0 : 1)
        info.priority = self.$priority.combobox('value')
        info.correlation_mode = self.$correlation_mode.combobox('value')
        info.recovery_mode = self.$recovery_mode.combobox('value')
        info.type = self.$type.combobox('value')
        if(self.itemObj.hostids){
            info.hostids = self.itemObj.hostids;
        }
        if(self.itemObj.templateids){
            info.templateids = self.itemObj.templateids;
        }
        if(self.itemObj.groupids){
            info.groupids = self.itemObj.groupids;
        }
        if(self.upObj && self.upObj.triggerid) info.triggerid = self.upObj.triggerid;
        if(expression) info.expression = expression
        if(recovery_expression) info.recovery_expression = recovery_expression
        if(correlation_tag) info.correlation_tag = correlation_tag
        if(dependencies.length >0) info.dependencies = dependencies;
        return info;
    }

    TriggerPageView.prototype.getDepData = function(_this) {
        var self = this;
        var data = self.$DepGrid.grid("getRowData")
        var obj = [];
        fish.map(data,function(d){
            obj.push({
                "triggerid":d.triggerid
            })
        });
        return obj;
    }

    TriggerPageView.prototype.stepUp = function(_this) {
        var $ws = this.$el.find('.kdoWizardSteps')
            //把当前的状态设置为active,complete,当前显示的页面为hide
        var curState = this.state.data[this.state.curIndex];
        $ws.find(curState).removeClass('complete')
            .removeClass('active')
        var curView = $ws.find(curState).data('view');
        this.$el.find(curView).hide();
        //把下个状态设置为active
        this.state.curIndex = this.state.curIndex - 1;
        if (this.state.curIndex <= 0) {
            this.$el.find('.stepUp').removeClass('show')
                .addClass('hide');
        }
        if (this.state.curIndex < this.state.data.length - 1) {
            this.$el.find('.stepNext').html('下一步')
        }
        var upState = this.state.data[this.state.curIndex]
        $ws.find(upState).addClass('active')
        var upStatePage = $ws.find(upState).data('view');
        this.$el.find(upStatePage).show();
    }
    return TriggerPageView;
});