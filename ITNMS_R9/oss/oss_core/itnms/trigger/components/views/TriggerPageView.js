define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/triggerPageView.html",
    "oss_core/itnms/trigger/components/views/AddTriggerView.js",
    "oss_core/itnms/trigger/components/views/AddHongView.js",
    "oss_core/itnms/trigger/components/views/AddExpressionView.js"
], function(action,tpl,AddTriggerView,AddHongView,AddExpressionView) {
    var TriggerPageView = function(options) {
        this.options = options;
        this.tpl = fish.compile(tpl);
        this.dataList = this.options.dataList;
        this.itemObj = this.options.itemObj;
        //console.log(this.itemObj)
        this.upObj = this.options.upObj;
        this.pKeys = 0;
        this.$el = $(this.options.el);
        this.selectItems = {};
        this.state = {
            data: ['.Step1', ".Step2",'.Step3'],
            curIndex: 0
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
        this.$status = self.$el.find('.manual_close').switchbutton('option','size','xs');
        this.$state = self.$el.find('.status').switchbutton('option','size','xs');
    }

    TriggerPageView.prototype.sCombobox = function() {
        var self = this;
        this.$priority = self.$el.find('.priority').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.TRIGGER_SEVERITY_LEVEL
        });
        this.$priority.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            $(this).prev().prop('class','combobox-readonly  form-control '+'lv' + pVal);
        });
        this.$priority.combobox('value',self.dataList.TRIGGER_SEVERITY_LEVEL[0].paraValue)
        this.$correlation_mode = self.$el.find('.correlation_mode').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.TRIGGER_CORRELATION_MODE
        });
        this.$correlation_mode.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            if(pVal === '1'){
                self.$el.find('.correlationstate').show()
            }else{
                self.$el.find('.correlationstate').hide()
            }
        });
        this.$correlation_mode.combobox('value',self.dataList.TRIGGER_CORRELATION_MODE[0].paraValue)
        this.$type = self.$el.find('.type').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.TRIGGER_EVENT_GENERAL_TYPE
        });
        this.$type.combobox('value',self.dataList.TRIGGER_EVENT_GENERAL_TYPE[0].paraValue)
        this.$recovery_mode = self.$el.find('.recovery_mode').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: self.dataList.TRIGGER_RECOVERY_MODE
        });
        this.$recovery_mode.on('combobox:change', function(state) {
            var pVal = $(this).combobox('value');
            if(pVal === '1'){
                self.$el.find(".recovery_expression").prop('disabled',false);
                self.$el.find(".recovery_state").show();
            }else{
                self.$el.find(".recovery_expression").prop('disabled',true);
                self.$el.find(".recovery_state").hide();
            }
        });
        this.$recovery_mode.combobox('value',self.dataList.TRIGGER_RECOVERY_MODE[0].paraValue)
    }

    TriggerPageView.prototype.renderGird = function() {
        var self = this;
        var opt = {
            data: [],
            height: 230,
            gridComplete: function() {
                self.$el.find('#isNeed').change(function() {
                　　if($(this).is(':checked')){
                        self.$el.find(".addTag").prop('disabled',false);
                    }else{
                        self.$el.find(".addTag").prop('disabled',true);
                    }
                });
                self.$el.find('.addTag').off('click').bind('click',function(){
                    var newData = {
                        "id":$.jgrid.randId(),
                        "tag": '',
                        "value":'',
                        "edit":$.jgrid.randId()
                    }
                　　self.$tagGrid.grid("addRowData", newData);
                });
                self.$el.find('.TagListGrid').off('click').on('click', '.prossDel', function(e) {
                    var selrow = self.$tagGrid.grid("getSelection");
                    self.$tagGrid.grid("delRowData", selrow);
                })
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'tag',
                label: '标签',
                width: 250,
                editable:true
            }, {
                name: 'value',
                label: '标签值',
                width: 350,
                editable:true,
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
            cellEdit: true
        };
        this.$tagGrid = this.$el.find('.TagListGrid').grid(opt);
        this.loadTagdata();
        var optDep = {
            data: [],
            height: 230,
            gridComplete: function() {
                var $el = $(self.options.el);
                self.$el.find('.DepListGrid').on('click', '.prossDel', function(e) {
                    var selrow = self.$DepGrid.grid("getSelection");
                    self.$DepGrid.grid("delRowData", selrow);
                })
                self.$el.find('.delTriggers').off('click').bind('click',function(){
                    var selrow = self.$DepGrid.grid("getCheckRows");
                    fish.map(selrow, function(d) {
                        self.$DepGrid.grid("delRowData", d);
                    })
                })
                self.$el.find('.addTrigger').off('click').on('click', function() {
                    var options = {
                        height: 400,
                        width: ($el.width() / 2),
                        modal: true,
                        draggable: false,
                        autoResizable: true
                    };
                    var addTriggeView = new AddTriggerView();
                    addTriggeView.popup(options,self.SearchItem,function(param) {
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
                name: 'wizard',
                label: '监控点|模板',
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
    }

    TriggerPageView.prototype.addRowData = function(data) {
        var self = this;
        var result = fish.map(data, function(d) {
            return {
                "triggerid":d.triggerid,
                "wizard": d.wizard[0].host,
                "name":d.name,
                "edit":d.triggerid
            }
        })
        self.$DepGrid.grid("addRowData", result);
    }

    TriggerPageView.prototype.loadTagdata = function() {
        var self = this;
        var data = []
        if(self.upObj && self.upObj.tags.length > 0){
            data = self.upObj.tags
        }
        var result = fish.map(data, function(d) {
            return {
                "id":$.jgrid.randId(),
                "tag": d.tag,
                "value":d.value,
                "edit":$.jgrid.randId()
            }
        })
        self.$tagGrid.grid("reloadData", result);
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
                        "wizard": d.hosts[0].host,
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
                    "wizard": d.wizard,
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
        var description = this.$el.find('.filterName').val();
        var expression = this.$el.find('.expression').val();
        if(!description || !expression){
            fish.toast('warn','name or expression is required');
            return;
        }
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
        var tags = self.getTagData();
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
        if(tags.length >0) info.tags = tags;
        if(dependencies.length >0) info.dependencies = dependencies;
        return info;
    }

    TriggerPageView.prototype.getTagData = function(_this) {
        var self = this;
        var data = self.$tagGrid.grid("getRowData")
        var obj = [];
        fish.map(data,function(d){
            var value = d.value ? d.value : "";
            obj.push({
                "tag":d.tag ? d.tag : "",
                "value":d.value ? d.value : ""
            })
        });
        return obj;
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