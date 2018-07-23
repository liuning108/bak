define([
    "oss_core/itnms/items/actions/ItemAction",
    "text!oss_core/itnms/items/components/views/itemPageView.html",
    "oss_core/itnms/items/components/views/Step2Page.js",
    "oss_core/itnms/items/components/views/PreprocessView.js"
], function(action,tpl,Step2Page,PreprocessView) {
    var ItemPageView = function(options) {
        this.options = options;
        this.tpl = fish.compile(tpl);
        this.dataList = this.options.dataList;
        this.itemObj = this.options.itemObj;
        this.upObj = this.options.upObj;
        console.log(this.upObj)
        console.log(this.dataList)
        this.pKeys = 0;
        this.$el = $(this.options.el);
        this.state = {
            data: ['.Step1', ".Step2",'.Step3','.Step4'],
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
        self.keyBox()
        self.switchBtn()
        self.$el.find('.filterType').on('change',function(e){
            var keyVal = self.$el.find('.filterType option:selected').val()
            self.renderStep2Page()
            //self.keyBox(keyVal)
        });
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
        self.renderStep2Page()
        self.renderGird();
    }

    ItemPageView.prototype.renderGird = function() {
        var self = this;
        if(self.upObj && self.upObj.preprocessing.length > 0){
            console.log(1)
            var templ_data = fish.map(self.upObj.preprocessing, function(d) {
                var params = d.params ? d.params.split("\n").join("|") : null;
                var filtername = self.dataList.ITEM_PROCESSING_TYPE.filter(function (e) {
                    return e.paraValue == d.type;
                })
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
                width: 240
            }, {
                name: 'params',
                label: '参数',
                width: 200
            }, {
                name: 'edit',
                label: '',
                width: 50,
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
                "params":params
            })
        });
        return obj;
    }

    ItemPageView.prototype.switchBtn = function() {
        var self = this;
        self.$switch = self.$el.find('.filterStatus').switchbutton('option','size','xs');
    }

    ItemPageView.prototype.keyBox = function(keyVal) {
        var self = this;
        self.$el.find('.key_span').off('click').on('click', function() {
            var keyVal = self.$el.find('.filterType option:selected').val()
            action.itemTypes('ITEM_KEY_'+keyVal).then(function(datas){
                var datas = eval('datas.ITEM_KEY_'+keyVal)
                if(datas && datas.length>0){
                    var $content = $('<div class="popItemList"><div class="modal-header"><h4 class="modal-title">Standard items</h4></div>'+
                        '<div class="modal-body">'+
                            '<ul class="findUl">'+
                                '<li>'+
                                    '<span class="wname"><b>Key</b></span>'+
                                    '<span class="wkey"><b>Name</b></span>'+
                                '</li>'+
                            '</table>'+
                        '</div>'+
                    '</div>');
                    $content.find('.popItemList ul').append($('<li class="liHover"><span class="wname">11</span><span class="wkey"></span></li>'));
                    fish.each(datas,function(d, elem) {
                        var htmlstr = $('<li class="liHover"><span class="wname">11</span><span class="wkey"></span></li>');
                        htmlstr.find('.wname').text(d.paraValue);
                        htmlstr.find('.wkey').text(d.paraName);
                        $content.find('.findUl').append(htmlstr);
                    })
                    var options = {
                        height: 400,
                        width: (self.$el.width() / 1.5),
                        modal: true,
                        content:$content,
                        draggable: true,
                        autoResizable: true
                    };
                    var popup = fish.popup($.extend({}, options));
                    $('.liHover').off('click').on('click', function() {
                        var wname = $(this).children('.wname').text();
                        self.$el.find('.filterkey input').val(wname)
                        popup.close()
                    })
                }
            })
        })
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

    ItemPageView.prototype.renderStep2Page = function() {
        var self = this;
        var options = {
            'el': self.$el.find('.Step2Page'),
            'dataList': self.dataList,
            'itemObj' : self.itemObj,
            "upObj" : self.upObj,
            'showTpl' : self.$el.find('.filterType option:selected').val()
        }
        this.step2Page = new Step2Page(options)
        this.step2Page.render()

    }

    ItemPageView.prototype.stepNext = function(_this) {
        var self = this;
        var $ws = this.$el.find('.kdoWizardSteps') //把当前的状态设置为complete,当前显示的页面为hide
        var curState = this.state.data[this.state.curIndex];
        $ws.find(curState).removeClass('active').addClass('complete');
        var curView = $ws.find(curState).data('view');
        var keystate_ = self.$el.find('.filterkey input').val();
        var namestate_ = self.$el.find('.filterName').val();
        if(!namestate_ || !keystate_){
            fish.toast('warn','name or key is required');
            return;
        }
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
            self.$el.find('.filterName').val(self.upObj.name);
            self.$el.find('.filterkey input').val(self.upObj.key_);
            self.$el.find('.description').val(self.upObj.description);
            self.$switch.switchbutton('option','state',(Number(self.upObj.status) === 1) ? false : true);
            self.$el.find('.unit').val(self.upObj.units);
            this.$el.find(".filterType option[value="+this.upObj.type+"]").prop("selected","selected");
            self.$el.find('.filterHistory').val((self.upObj.history.substr(self.upObj.history.length-1,1) === 'd') ? self.upObj.history.substr(0,self.upObj.history.length-1) : self.upObj.history);
            self.$el.find('.filterTrend').val((self.upObj.trends.substr(self.upObj.trends.length-1,1) === 'd') ? self.upObj.trends.substr(0,self.upObj.trends.length-1) : self.upObj.trends);
            this.$el.find(".valuemapid option[value="+this.upObj.valuemapid+"]").prop("selected","selected");
            this.$el.find(".value_type option[value="+this.upObj.value_type+"]").prop("selected","selected");
            this.$el.find(".inventory_link option[value="+this.upObj.inventory_link+"]").prop("selected","selected");
        }
    }

    ItemPageView.prototype.getInfo = function(){
        var self = this;
        var name = self.$el.find('.filterName').val();
        var description = self.$el.find('.description').val();
        var units = self.$el.find('.unit').val();
        var history = self.$el.find('.filterHistory').val();
        var trends = self.$el.find('.filterTrend').val();
        var getdelay = this.step2Page.getInfo();
        var getPkeyVal = self.getProkeyVal();
        var info = {
            "type" : Number(self.$el.find('.filterType option:selected').val()),
            "status" : Number(self.$el.find('.filterStatus').switchbutton('option','state') ? 0 : 1),
            "key_" : self.$el.find('.filterkey input').val(),
            "value_type" : Number(self.$el.find('.value_type option:selected').val()),
            "inventory_link" : Number(self.$el.find('.inventory_link option:selected').val()),
            "valuemapid" : self.$el.find('.valuemapid option:selected').val()
        }
        if(self.upObj && self.upObj.itemid) info.itemid = self.upObj.itemid;
        if(name) info.name = name;
        if(units) info.units = units;
        if(description) info.description = description
        if(history) info.history = self.isNumber(history) ? history + 'd' : history;
        if(trends) info.trends = self.isNumber(trends) ? trends + 'd' : trends;
        if(getdelay && getdelay.delay != 'undefined') info.delay = getdelay.delay;
        if(self.itemObj.hostids){
            info.hostid = self.itemObj.hostids;
            info.interfaceid = self.$el.find('.filterHostInterface option:selected').val()
        }
        if(self.itemObj.templateids){
            info.hostid = self.itemObj.templateids;
        }
        if(getdelay.snmp_oid) info.snmp_oid = getdelay.snmp_oid;
        if(getdelay.snmp_community) info.snmp_community = getdelay.snmp_community;
        if(getdelay.port) info.port = getdelay.port;
        if(getdelay.trapper_hosts) info.trapper_hosts = getdelay.trapper_hosts;
        if(getdelay.username) info.username = getdelay.username;
        if(getdelay.password) info.password = getdelay.password;
        if(getdelay.snmpv3_contextname) info.snmpv3_contextname = getdelay.snmpv3_contextname;
        if(getdelay.snmpv3_securityname) info.snmpv3_securityname = getdelay.snmpv3_securityname;
        if(getdelay.snmpv3_securitylevel) info.snmpv3_securitylevel = Number(getdelay.snmpv3_securitylevel);
        if(getdelay.params) info.params = getdelay.params;
        if(getdelay.ipmi_sensor) info.ipmi_sensor = getdelay.ipmi_sensor;
        if(getdelay.authtype) info.authtype = Number(getdelay.authtype);
        if(getdelay.jmx_endpoint) info.jmx_endpoint = getdelay.jmx_endpoint;
        if(getdelay.master_itemid) info.master_itemid = Number(getdelay.master_itemid);
        if(getPkeyVal.length >0) info.preprocessing = getPkeyVal;
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