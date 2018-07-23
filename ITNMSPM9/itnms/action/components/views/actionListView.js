define([
    "oss_core/itnms/action/components/views/FilterViewDialog.js",
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/actionListView.html",
    "text!oss_core/itnms/action/components/views/actionOp.html",
    "oss_core/itnms/action/components/views/CreateActionView.js",
    'i18n!oss_core/itnms/action/i18n/action',
    "css!oss_core/itnms/host/css/kdo.css",
    "css!oss_core/itnms/items/css/items.css"
], function(FilterViewDialog,action,tpl,actionOp,CreateActionView,i18nData) {
    var ActionListView = function(option,callback) {
        this.option = option;
        this.tpl = fish.compile(tpl);
        this.option.zIndex = 100;
        this.callback = callback;
        this.docH = $(document).height();
        this.tableH = (this.docH - 48 - 35 - 30 - 40 - 40) * 0.92;
        this.groupFilterList = [];
        this.SearchItem = {
            "output": "extend",
            "selectOperations": "extend",
            "selectRecoveryOperations": "extend",
            "selectFilter": "extend",
            "searchWildcardsEnabled":true,
            "filter":{},
            "search":{}
        };
        if(this.option.triggerids){
            this.SearchItem.triggerids = this.option.triggerids;
        }
        if(this.option.groupids){
            this.SearchItem.groupids = this.option.groupids;
        }
        if(this.option.hostids){
            this.SearchItem.hostids = this.option.hostids;
        }
        this.actionOp = fish.compile(actionOp);
    }
    ActionListView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl(i18nData));
        this.afterRender();
    }
    ActionListView.prototype.remove = function() {
        if (this.$gird) {
            this.$gird.remove();
        }
        $(this.option.el).html("");
    }
    ActionListView.prototype.afterRender = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.itemClose').off('click').on('click', function() {
            self.remove()
            self.option.callback()
        })
        self.createListTable();
        self.btnClick();
        self.rSearchBtn();
        self.createFilterEvent();
        self.createActionEvent();
    }
    ActionListView.prototype.createActionViewRender = function(d){
        var self =this;
        var $el = $(this.option.el);
        var createActionView = new CreateActionView({
            "el": $el,
            "parent":self,
            "itemObj":self.SearchItem,
            "upObj":d,
            "cType":self.SearchItem.filter.eventsource
        })
        createActionView.render();
    }
    ActionListView.prototype.createActionEvent = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.createAction').off('click').on('click', function() {
            self.remove();
            self.createActionViewRender();
        })
    }
    ActionListView.prototype.createFilterEvent = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterItemList').off('click').on('click', function() {
            var options = {
                height: $el.height(),
                width: ($el.width() / 2.5),
                modal: true,
                draggable: false,
                autoResizable: false,
                position: {
                    'of': $el,
                    'my': "top",
                    'at': "right" + " " + "top",
                    collision: "fit"
                }
            };
            var filterViewDialog = new FilterViewDialog();
            filterViewDialog.popup(options,self.SearchItem,function(param) {
                console.log(param)
                self.SearchItem = param;
                self.loadData();
            });
        });
    }
    ActionListView.prototype.btnClick = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('#itemEditBtn').find('.btn-default').bind("click", function(e){
            var triggersid = "",btnid = e.currentTarget.id;
            var selrow = $el.find('.ItemListGrid').grid("getCheckRows");
            fish.map(selrow,function(row){
                triggersid += row.actionid + ",";
            });
            triggersid = triggersid.substring(0, triggersid.length-1);
            var clickEvt = (btnid === 'items_on' && self.btnSwitch(triggersid,false)) || (btnid === 'items_off' && self.btnSwitch(triggersid,true)) || (btnid === 'items_del' && self.btnDel(triggersid));
        });
    }
    ActionListView.prototype.btnDel = function(actionsid) {
        var self = this,$el = $(this.option.el);
        var actionArr = actionsid.split(",");
        fish.confirm('Delete selected actions?').result.then(function() {
            action.deleteActions(actionArr).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','items actions');
                }
                self.loadData();
            })
        });
    }
    ActionListView.prototype.btnSwitch = function(triggerid,state) {
        var self = this,$el = $(this.option.el);
        self.option.flag = false;
        var triggeridsArr = triggerid.split(",");
        var triggeridObj = [];
        var status = state ? 1 : 0;
        var tips = state ? 'Disable selected actions?' : 'Enable selected actions?';
        var tipsure = state ? 'actions Disable' : 'actions Enable';
        fish.map(triggeridsArr,function(row){
            // $el.find('.ItemListGrid').find('#switch' + row).switchbutton('option','state',state);
            triggeridObj.push({"actionid":""+row,"status": status});
        });
        if(triggeridObj.length > 0){
            fish.confirm(tips).result.then(function() {
                action.updateActions(triggeridObj).then(function(data){
                    if(data.error){
                        fish.toast('warn',data.error.data);
                    }else{
                        fish.toast('success',tipsure);
                    }
                    self.loadData();
                })
            })
        }
    }
    ActionListView.prototype.rSearchBtn = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterArea').find('.rSearch').bind('click',function(){
            self.loadData();
        })
    }
    ActionListView.prototype.qryHostGroup = function() {
        var self = this;
        var $el = $(this.option.el);
        action.itemTypes('EVENT_SOURCE').then(function(datas){
            self.$comboboxEvent = $el.find('.disabledInput').combobox({
                    editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.EVENT_SOURCE
            });
            self.$comboboxEvent.on('combobox:change', function() {
                var d = self.$comboboxEvent.combobox('getSelectedItem');
                console.log(self.SearchItem)
                if(d.groupid !== 'All'){
                    self.SearchItem.filter.eventsource = Number(d.paraValue);
                    self.loadData();
                }else{
                    self.$comboboxhost.combobox('disable')
                    self.$comboboxhost.combobox({dataSource:''})
                }
            });
            self.$comboboxEvent.combobox('value',datas.EVENT_SOURCE[0].paraValue)
        })
    }
    ActionListView.prototype.createListTable = function() {
        var self = this;
        var $el = $(this.option.el);
        var $area = $el.find('.filterArea');
        self.qryHostGroup();//主机组的选择
        //var $comboboxhost = $el.find('.comboboxhost').combobox('disable');
        var mydata = [];
        var opt = {
            data: mydata,
            height: self.tableH - 54,
            gridComplete: function() {
                $el.find('.ItemListGrid').find('.ItemOp').parent().css('overflow', "visible");
                $el.find('.ItemListGrid').find('.triggerBtn').parent().css('overflow', "visible");
                var $switch = $el.find('.ItemListGrid').find('.switch-btn').switchbutton('option','size','xs');
                $el.find(".ItemListGrid").find('[type="checkbox"]').bind("change", function(e){
                    self.gridBtnItemchange();
                });
                var cgItemid = [];
                $el.find(".ActionOp").find(".actionDel").bind("click", function(e){
                    var sid = $(this).data("actionid");
                    self.removeItem(sid);
                });
                self.dlogShow();
                $el.find('.ItemListGrid').find('.dlogClose').bind('click',function(){
                    $(this).parent().prev().data("flag","0");
                    $(this).parent().hide();
                    self.option.zIndex = 100;
                })
                $el.find('.ItemListGrid').find('.actionEdit').off('click').on('click',function(){
                    self.actionUpdate($(this).data('actionid'));
                })
                $switch.on("switchbutton:change", function(e,state){
                    var status = state ? 0 : 1;
                    var tips = state ? 'Enable selected actions?' : 'Disable selected actions?';
                    var tipsure = state ? 'actions Enable' : 'actions Disable';
                    action.updateActions([{
                        "actionid":"" + e.currentTarget.defaultValue,
                        "status": status
                    }]).then(function(data){
                        if(data.error){
                            fish.toast('warn',data.error.data);
                        }else{
                            fish.toast('success',tipsure);
                            self.loadData();
                        }
                    })
                });
            },
            colModel: [
                {
                    name: 'actionid',
                    label: '',
                    align: 'center',
                    key:true,
                    search: false,
                    hidden: true
                },{
                    name: 'name',
                    label: '名称',
                    align: 'center'
                }, {
                    name: 'opconditions',
                    label: '条件',
                    width: 120,
                    title: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                    }
                }, {
                    name: 'operations',
                    label: '操作',
                    width: 40,
                    align: 'center',
                    title: false,
                    formatter(cellval, opts, rwdat, _act){
                    }
                }, {
                    name: 'status',
                    label: '使用状态',
                    sortable: false,
                    width: 80,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return (cellval === 1 && '<input type="checkbox" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.actionid+'" value="'+rwdat.actionid+'">') || '<input type="checkbox" checked="" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.actionid+'" value="'+rwdat.actionid+'">';
                    }
                }, {
                    name: 'moreop',
                    label: '',
                    'title': false,
                    width: 50,
                    sortable: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return self.actionOp({'id':cellval});
                    }
                }

            ],
            pager: true,
            multiselect:true
        };
        this.$gird = $el.find('.ItemListGrid').grid(opt);
        self.loadTableData();
    }

    ActionListView.prototype.itemType=function(id) {
        var itemTypes;
        action.itemTypes('ITEM_TYPE').then(function(datas){
            return ''+datas.ITEM_TYPE[id].paraName+'';
        })
    }

    ActionListView.prototype.actionUpdate=function(id) {
        var self =this;
        var sid=""+id
        action.triggerGet({"triggerids":sid}).then(function(data) {
            if(data.result.length>0){
               var upObj = data.result[0];
               self.createTriggerViewRender(upObj)
            }
        })

    }

    ActionListView.prototype.removeItem=function(id) {
        var self=this;
        var nid = "" + id;
        fish.confirm('Delete selected actions?').result.then(function() {
            console.log([nid])
            action.deleteActions([nid]).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','actions deleted');
                }
                self.loadData();
            })
        });

    }

    ActionListView.prototype.gridBtnItemchange = function(){
        var self = this;
            $el = $(this.option.el),
            selrow = $el.find(".ItemListGrid").grid("getCheckRows");
        if(selrow.length>0){
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',false);
        }else{
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',true);
        }
    }

    ActionListView.prototype.dlogShow = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.ItemListGrid').find('.triggerSum').bind('click',function(){
            var tops = "";
            var tTop = $(this).offset().top;
            var pHeight = $(this).next('.popDlog').height();
            self.option.zIndex = self.option.zIndex + 1;
            var conut = $(this).data('count');
            $(this).data("flag","1");
            if(conut > 0 ){
                if(tTop > 300){
                    $(this).next('.popDlog').addClass('dPopTop');
                    tops = -Number(pHeight - 15);
                }
                $(this).next('.popDlog').css({
                    "z-index":self.option.zIndex,
                    "top":tops
                }).show();
            }
        })
        $el.find('.ItemListGrid').find('.triggerSum span').mouseenter(function(){
            var self_ = $(this).parent();
            var tops = "";
            var tTop = self_.offset().top;
            var pHeight = self_.next('.popDlog').height();
            var conut = self_.data('count');
            self.option.zIndex = self.option.zIndex + 1;
            if(conut > 0){
                if(tTop >= 330){
                    self_.next('.popDlog').css('top',-pHeight-15);
                    //self_.next('.popDlog').addClass('dPopTop');
                }
                self_.next('.popDlog').show();
            }
        }).mouseleave(function(event) {
            var self_ = $(this).parent();
            self.option.zIndex = 100;
            dataflag = self_.data('flag');
            if(dataflag != "1"){
               self_.next('.popDlog').removeClass('dPopTop').hide();
            }
        });
        $el.find('.ItemListGrid').find('.expressPop').mouseenter(function(){
            var self_ = $(this);
            var tops = "";
            var tTop = self_.offset().top;
            var pHeight = self_.next('.popDlog').height();
            if(tTop >= 330){
                self_.next('.popDlog').css('top',-pHeight-24);
            }
            self_.next('.popDlog').show();
        }).mouseleave(function(event) {
            var self_ = $(this);
            self_.next('.popDlog').removeClass('dPopTop').hide();
        });
    }

    ActionListView.prototype.loadTableData = function() {
        var self = this;
        self.loadData();
    }

    ActionListView.prototype.loadData = function() {
        var self = this;
        action.getActions(self.SearchItem).then(function(data) {
            //console.log(data.result);
            var result = fish.map(data.result, function(d) {
                return {
                    actionid:d.actionid,
                    name: d.name,
                    opconditions: d.operations.opconditions,
                    operations: d.operations,
                    status:Number(d.status),
                    moreop: d.actionid
                }
            })
            self.$gird.grid("reloadData", result);
        })

    }

    ActionListView.prototype.newRender=function() {
        var self = this;
        self.render();
    }
    return ActionListView;

})