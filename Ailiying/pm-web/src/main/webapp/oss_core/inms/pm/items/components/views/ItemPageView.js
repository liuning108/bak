define([
    "oss_core/inms/pm/items/actions/ItemAction",
    "text!oss_core/inms/pm/items/components/views/itemPageView.html",
    "oss_core/inms/pm/items/components/views/PreprocessView.js",
    "oss_core/inms/pm/items/components/views/addHostView.js",
    "oss_core/inms/pm/items/components/views/addMetric.js"
], function(action,tpl,PreprocessView,addHostView,addMetric) {
    var ItemPageView = function(options) {
        this.options = options;
        this.tpl = fish.compile(tpl);
        this.dataList = this.options.dataList;
        this.itemObj = this.options.itemObj;
        this.upObj = this.options.upObj;
        console.log(this.upObj,111)
        console.log(this.itemObj,2222)
        this.pKeys = 0;
        this.$el = $(this.options.el);
        this.state = {
            data: ['.Step1', ".Step2",'.Step3'],
            curIndex: 0
        }
    }

    ItemPageView.prototype.render = function() {
        var self = this;
        this.remove();
        self.loadData(self.dataList);
        self.afterRender();
    }

    ItemPageView.prototype.loadData = function(data){
        var self = this;
        self.$el.html(self.tpl(self.dataList));
    }

    ItemPageView.prototype.remove = function() {
        this.$el.html("");
    }

    ItemPageView.prototype.afterRender = function() {
        var self = this;
        self.prevNextBtn()
        self.renderCom()
        self.changeCheckbox()
        self.hostOrMetric()
        self.$el.find('.addFilterPreprocess').off('click').on('click',function(){
            var options = {
                height: 380,
                width: (self.$el.width() / 2.5),
                modal: true,
                draggable: false,
                autoResizable: false,
                position: {
                    'of': self.$el,
                    'my': "top",
                    'at': "right" + " " + "top",
                    collision: "fit"
                }
            };
            delete self.dataList.selrow
            delete self.dataList.selrowRow
            var preprocessView = new PreprocessView();
            preprocessView.popup(options,self.dataList,function(param) {
                self.dataToGrid(param);
                console.log(param);
            });
            //self.addPreprocess();
        })

        self.renderItemBaseInfo();
        self.renderGird();
    }

    ItemPageView.prototype.changeCheckbox = function() {
        var self = this
        this.$el.find(".isNeedPro input").on("change",function(){
            var this_ = $(this)
            if(this_.prop('checked')){
                self.$el.find(".addFilterPreprocess").prop('disabled',false)
            }else{
                self.$el.find(".addFilterPreprocess").prop('disabled',true)
            }
        });
        this.$el.find(".addhostMetric input").on("change",function(){
            var this_ = $(this)
            if(this_.prop('checked')){
                self.$el.find(".hostOrMetric").removeClass('addmetric').addClass('addHost').html('插入监控项')
            }else{
                self.$el.find(".hostOrMetric").removeClass('addHost').addClass('addmetric').html('插入metric键')
            }
        });
        this.$el.find(".ismaop input").on("change",function(){
            var this_ = $(this)
            if(this_.prop('checked')){
                console.log(1)
                self.$pm_checkpoint.combobox('disable');
            }else{
                console.log(2)
                self.$pm_checkpoint.combobox('enable');
            }
        });
    }

    ItemPageView.prototype.hostOrMetric = function() {
        var self = this;
        this.$el.find('.hostOrMetric').off('click').on('click', function() {
            var options = {
                height: 400,
                width: 700,
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var AddHostView = new addHostView();
            var AddMetric = new addMetric();
            if($(this).hasClass('addHost')){
                AddHostView.popup(options,self.dataList,function(param) {
                    self.$el.find('.expression').val('${'+param.name+'}')
                    console.log(param)
                });
            }else{
                AddMetric.popup(options,self.dataList,function(param) {
                    self.$el.find('.expression').val('&{'+param.key+'}')
                    console.log(param)
                });
            }
        })
    }

    ItemPageView.prototype.renderGird = function() {
        var self = this;
        if(self.upObj && self.upObj.preprocList.length > 0){
            var templ_data = fish.map(self.upObj.preprocList, function(d) {
                var params = d.paras ? d.paras.split("\n").join("|") : null;
                var filtername = self.dataList.ITEM_PROCESSING_TYPE.filter(function (e) {
                    return e.paraValue == d.type;
                })
                console.log(filtername)
                return {
                    "name": filtername[0].paraName.split('|')[0],
                    "params": params,
                    "edit":d.type
                }
            })
        }else{
            var templ_data = []
        }
        var opt = {
            data: templ_data,
            height: 230,
            gridComplete: function() {
                self.$el.find('.addP').off('click').on("click", ".prossEdit",function(e){
                    var options={},preprocessView;
                    var selrow = self.$prossGrid.grid("getGridParam", "selrow")
                    var selrowRow = self.$prossGrid.grid("getSelection");
                    self.dataList.selrow.id = selrow;
                    self.dataList.selrowRow = selrowRow;
                    //console.log(self.getProkeyVal());
                    options = {
                        height: 380,
                        width: (self.$el.width() / 2.5),
                        modal: true,
                        draggable: false,
                        autoResizable: false,
                        position: {
                            'of': self.$el,
                            'my': "top",
                            'at': "right" + " " + "top",
                            collision: "fit"
                        }
                    };
                    preprocessView = new PreprocessView();
                    preprocessView.popup(options,self.dataList,function(param) {
                        self.dataToGrid(param);
                        //console.log(param);
                    });
                }).on('click', '.prossDel', function(e) {
                    var selrow = self.$prossGrid.grid("getSelection");
                    self.$prossGrid.grid("delRowData", selrow);
                })
            },
            colModel: [{
                name: 'id',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'name',
                label: '预处理方法名称',
                width: 300
            }, {
                name: 'params',
                label: '参数',
                width: 320
            }, {
                name: 'edit',
                label: '',
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i class="glyphicon glyphicon-pencil prossEdit mgr4" data-id="'+cellval+'"></i><i class="glyphicon glyphicon-trash prossDel mgr4" data-id="'+cellval+'"></i>'
                }
            }]
        };
        this.$prossGrid = this.$el.find('.addP').grid(opt);
        this.$prossGrid.grid('sortableRows');
    }

    ItemPageView.prototype.renderCom = function(d) {
        var self = this;
        this.$value_type = this.$el.find('.value_type').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: this.dataList.ITEM_VALUE_TYPE
        });
        this.$value_type.combobox('value',this.dataList.ITEM_VALUE_TYPE[0].paraValue)
        this.$value_map_rule = this.$el.find('.value_map_rule').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: this.dataList.ITEM_VALUE_MAP
        });
        this.$value_map_rule.combobox('value',this.dataList.ITEM_VALUE_MAP[0].paraValue)
        this.$direction = this.$el.find('.direction').combobox({
            editable: false,
            dataTextField: 'paraName',
            dataValueField: 'paraValue',
            dataSource: this.dataList.ITEM_DIRECTION
        });
        this.$direction.combobox('value',this.dataList.ITEM_DIRECTION[0].paraValue)
        action.getGroupedComboxOption('ITEMTYPE').then(function(data){
            var result = []
            fish.map(data, function(d,index) {
                result.push({
                    id:d.catalogId,
                    pId:0,
                    name:d.catalogName,
                    open:(d.itemTypeList.length > 0) ? true : false,
                    disabled:true
                })
                if(d.itemTypeList.length > 0){
                    fish.map(d.itemTypeList, function(m,key) {
                        result.push({
                            id:m.itemTypeId,
                            pId: d.catalogId,
                            name:m.temTypeName
                        })
                    })
                }
            })
            var options = {
                placeholder: "请选择类型",
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                fNodes : result
            }
            self.$item_type_id = self.$el.find(".item_type_id").combotree(options);
        })
        action.pmtemplateCPInfo({"templateId":""}).then(function(data){
            console.log(data,1111)
            self.$pm_checkpoint = self.$el.find('.pm_checkpoint').combobox({
                editable: false,
                dataTextField: 'cpName',
                dataValueField: 'cpId',
                dataSource: data
            });
            self.$pm_checkpoint.combobox('value',(self.upObj && self.upObj.cpId) ? self.upObj.cpId : data[0].cpId)
        })
    }

    ItemPageView.prototype.dataToGrid = function(d) {
        var self = this;
        if(d && d.paraValue>0){
            var newData = {
                "name": d.name,
                "params": d.value,
                "edit":d.paraValue
            }
            if(d.selrow.id){
                self.$el.find('.addP').grid("setRowData", d.selrow.id, newData);
            }else{
                self.$el.find('.addP').grid("addRowData", newData)
            }
        }
    }

    ItemPageView.prototype.getProkeyVal = function(){
        var self = this;
        var data = self.$prossGrid.grid("getRowData")
        var obj = [];
        fish.map(data,function(d){
            var params = d.params ? d.params.split("|").join("\n") : null;
            obj.push({
                "type":d.edit,
                "paras":params
            })
        });
        return obj;
    }

    ItemPageView.prototype.prevNextBtn = function() {
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

    ItemPageView.prototype.stepNext = function(_this) {
        var self = this;
        var $ws = this.$el.find('.kdoWizardSteps') //把当前的状态设置为complete,当前显示的页面为hide
        var curState = this.state.data[this.state.curIndex];
        $ws.find(curState).removeClass('active').addClass('complete');
        var curView = $ws.find(curState).data('view');
        var keystate_ = self.$el.find('.filterkey input').val();
        var namestate_ = self.$el.find('.filterName').val();
        /*if(!namestate_ || !keystate_){
            fish.toast('warn','name or key is required');
            return;
        }*/
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

    ItemPageView.prototype.done = function() {
        this.options.parent.done();
    }

    ItemPageView.prototype.renderItemBaseInfo = function() {
        var self = this;
        if(self.upObj && self.upObj !== 'undefined'){
            self.$el.find('.item_name').val(self.upObj.itemName ? self.upObj.itemName : '');
            self.$el.find('.unit').val(self.upObj.unit ? self.upObj.unit : '');
            self.$el.find('.expression').val(self.upObj.expression ? self.upObj.expression : '');
            self.$value_type.combobox('value',self.upObj.valueType)
            self.$el.find('.comments').val(self.upObj.comments ? self.upObj.comments : '');
            self.$el.find('.metric_interval').val(self.upObj.metricInterval ? self.upObj.metricInterval : '');
            self.$value_map_rule.combobox('value',self.upObj.valueMapRule)
            self.$direction.combobox('value',self.upObj.direction)
            if(self.upObj.meAsCp === 1){
                self.$el.find(".ismaop input").prop('checked')
            }
            //self.$el.find('.comments').val(self.upObj.name);
        }
    }

    ItemPageView.prototype.getInfo = function(){
        var self = this;
        var itemName = self.$el.find('.item_name').val();
        var unit = self.$el.find('.unit').val();
        var expression = self.$el.find('.expression').val();
        var comments = self.$el.find('.comments').val();
        var metricInterval = self.$el.find('.metric_interval').val();
        var getPkeyVal = self.getProkeyVal();
        var itemTypeId = self.$item_type_id.combotree('value') ? self.$item_type_id.combotree('value').id : ''
        var info = {
            "valueType" : self.$value_type.combobox('value'),
            "valueMapRule" : self.$value_map_rule.combobox('value'),
            "direction" : self.$direction.combobox('value')
        }
        if(self.$el.find('.ismaop input').prop('checked')){
            info.cpId = self.$pm_checkpoint.combobox('value')
            info.meAsCp = 1;
        }else{
            info.meAsCp = 0;
        }
        if(self.upObj && self.upObj.itemId) info.itemId = self.upObj.itemId;
        if(itemName) info.itemName = itemName;
        if(unit) info.unit = unit;
        if(expression) info.expression = expression;
        if(comments) info.comments = comments
        if(metricInterval) info.metricInterval = metricInterval;
        if(itemTypeId) info.itemTypeId = itemTypeId;
        if(self.itemObj.templateId){
            info.templateId = self.itemObj.templateId;
        }

        if(getPkeyVal.length >0) info.preprocList = getPkeyVal;
        return info;
    }

    ItemPageView.prototype.isNumber = function(value){
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(value) == null || value == "") {
            return false
        } else {
            return true
        }
    }

    ItemPageView.prototype.stepUp = function(_this) {
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
    return ItemPageView;
});