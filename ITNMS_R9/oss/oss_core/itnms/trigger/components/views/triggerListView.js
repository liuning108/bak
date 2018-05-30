define([
    "oss_core/itnms/trigger/components/views/FilterViewDialog.js",
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/triggerListView.html",
    "text!oss_core/itnms/trigger/components/views/triggerOp.html",
    "oss_core/itnms/trigger/components/views/CreateTriggerView.js",
    'i18n!oss_core/itnms/trigger/i18n/trigger',
    "css!oss_core/itnms/host/css/kdo.css",
    "css!oss_core/itnms/items/css/items.css"
], function(FilterViewDialog,action,tpl,triggerOp,CreateTriggerView,i18nData) {
    var TiggerListView = function(option,callback) {
        this.option = option;
        this.tpl = fish.compile(tpl);
        this.option.zIndex = 100;
        this.callback = callback;
        this.docH = $(document).height();
        this.tableH = (this.docH - 48 - 35 - 30 - 40 - 40) * 0.92;
        this.groupFilterList = [];
        this.SearchItem = {};
        if(this.option.templateids){
            this.SearchItem.templateids = this.option.templateids;
        }
        if(this.option.groupids){
            this.SearchItem.groupids = this.option.groupids;
        }
        if(this.option.hostids){
            this.SearchItem.hostids = this.option.hostids;
        }
        this.triggerOp = fish.compile(triggerOp);
    }
    TiggerListView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl(i18nData));
        this.afterRender();
    }
    TiggerListView.prototype.remove = function() {
        if (this.$gird) {
            this.$gird.remove();
        }
        $(this.option.el).html("");
    }
    TiggerListView.prototype.afterRender = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.itemClose').off('click').on('click', function() {
            self.remove()
            self.option.callback()
        })
        self.createListTable();
        self.btnClick();
        self.popToggle();
        self.rSearchBtn();
        self.createFilterEvent();
        self.createTriggerEvent();
    }
    TiggerListView.prototype.createTriggerViewRender = function(d){
        var self =this;
        var $el = $(this.option.el);
        var createTriggerView = new CreateTriggerView({
            el: $el,
            "parent":self,
            "itemObj":self.SearchItem,
            "upObj":d
        })
        createTriggerView.render();
    }
    TiggerListView.prototype.createTriggerEvent = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.createTrigger').off('click').on('click', function() {
            self.remove();
            self.createTriggerViewRender();
        })
    }
    TiggerListView.prototype.createFilterEvent = function() {
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
                self.SearchItem = param;
                self.loadData();
            });
        });
    },
    TiggerListView.prototype.popToggle = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterArea').find('.inputbottom').bind("click", function(e){
            var isToggle = $(this).next().is(':hidden');
            if(isToggle){
                $(this).next().slideDown(100,"linear");
            }else{
                $(this).next().slideUp(100,"linear");
            }
        });
    }
    TiggerListView.prototype.btnClick = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('#itemEditBtn').find('.btn-default').bind("click", function(e){
            var triggersid = "",btnid = e.currentTarget.id;
            var selrow = $el.find('.ItemListGrid').grid("getCheckRows");
            fish.map(selrow,function(row){
                triggersid += row.triggerid + ",";
            });
            triggersid = triggersid.substring(0, triggersid.length-1);
            var clickEvt = (btnid === 'items_on' && self.btnSwitch(triggersid,false)) || (btnid === 'items_off' && self.btnSwitch(triggersid,true)) || (btnid === 'items_del' && self.btnDel(triggersid));
        });
    }
    TiggerListView.prototype.btnDel = function(triggersid) {
        var self = this,$el = $(this.option.el);
        var triggersidArr = triggersid.split(",");
        fish.confirm('Delete selected triggers?').result.then(function() {
            action.triggerRemove(triggersidArr).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','items triggers');
                }
                self.loadData();
            })
        });
    }
    TiggerListView.prototype.btnSwitch = function(triggerid,state) {
        var self = this,$el = $(this.option.el);
        self.option.flag = false;
        var triggeridsArr = triggerid.split(",");
        var triggeridObj = [];
        var status = state ? 1 : 0;
        var tips = state ? 'Disable selected triggers?' : 'Enable selected triggers?';
        var tipsure = state ? 'triggers Disable' : 'triggers Enable';
        fish.map(triggeridsArr,function(row){
            // $el.find('.ItemListGrid').find('#switch' + row).switchbutton('option','state',state);
            triggeridObj.push({"triggerid":""+row,"status": status});
        });
        if(triggeridObj.length > 0){
            fish.confirm(tips).result.then(function() {
                action.triggerPut(triggeridObj).then(function(data){
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
    TiggerListView.prototype.rSearchBtn = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterArea').find('.rSearch').bind('click',function(){
            $el.find('.filterArea').find('.inputbottom').next().slideUp(100,"linear");
            self.loadData();
        })
    }
    TiggerListView.prototype.qryHostGroup = function() {
        var self = this;
        var $el = $(this.option.el);
        action.getHostGroupParams({"with_items":true}).then(function(datas){
            var groupData = fish.map(datas.result, function(d) {
                self.groupFilterList = datas.result;
                return {
                    'groupid': d.groupid,
                    'name': d.name
                }
            })
            groupData.unshift({
                'groupid': 'All',
                'name': 'All'
            })
            self.$comboboxGroups = $el.find('.comboboxGroups').combobox({editable: false, dataTextField: 'name', dataValueField: 'groupid', dataSource: groupData});
            self.$comboboxhost = $el.find('.comboboxhost').combobox('setEditable', false);
            self.$comboboxGroups.combobox('value','All');
            self.$comboboxGroups.on('combobox:change', function() {
                var d = self.$comboboxGroups.combobox('getSelectedItem');
                $el.find('.filterArea').find('.disabledInput').attr("value",d.name);
                self.comboboxGroupsChange();
                if(d.groupid !== 'All'){
                    delete self.SearchItem.hostids;
                    delete self.SearchItem.templateids;
                    self.SearchItem.groupids = d.groupid;
                }else{
                    self.$comboboxhost.combobox('disable')
                    self.$comboboxhost.combobox({dataSource:''})
                    delete self.SearchItem.hostids;
                    delete self.SearchItem.templateids;
                    delete self.SearchItem.groupids;
                }
            });
            self.$comboboxhost.on('combobox:change', function() {
                var d = self.$comboboxhost.combobox('getSelectedItem');
                delete self.SearchItem.hostids;
                delete self.SearchItem.templateids;
                if(d.status === '3'){
                    self.SearchItem.templateids = d.templateid;
                }else{
                    self.SearchItem.hostids = d.hostid;
                }
                $el.find('.filterArea').find('.disabledInput').attr("value",d.name);
            });
        })
    }
    TiggerListView.prototype.comboboxGroupsChange = function (groupid) {
        var self = this;
        var $el = $(this.option.el);
        var hostTemList = [];
        var groupid = this.$comboboxGroups.combobox('value');
        var filterGroupId = self.groupFilterList.filter(function (e) {
            return e.groupid == groupid;
        })
        if(filterGroupId.length){
            if(filterGroupId[0].hosts.length>0){
                fish.map(filterGroupId[0].hosts,function(d, elem) {
                    hostTemList.push({"name":d.host,"hostid":d.hostid,"status":d.status})
                })
            }
            if(filterGroupId[0].templates.length>0){
                fish.map(filterGroupId[0].templates,function(d, elem) {
                    hostTemList.push({"name":d.name,"templateid":d.templateid,"status":d.status})
                })
            }
            if(hostTemList && hostTemList.length>0){
                self.$comboboxhost.combobox({dataSource: hostTemList});
                self.$comboboxhost.combobox('enable');
            }else{
                self.$comboboxhost.combobox({dataSource:''})
                self.$comboboxhost.combobox('disable')
            }
        }
        //return hostTemList;
    }
    TiggerListView.prototype.createListTable = function() {
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
                $el.find(".TriggerOp").find(".triggerDel").bind("click", function(e){
                    var sid = $(this).data("triggerid");
                    self.removeItem(sid);
                });
                self.dlogShow();
                $el.find('.ItemListGrid').find('.dlogClose').bind('click',function(){
                    $(this).parent().prev().data("flag","0");
                    $(this).parent().hide();
                    self.option.zIndex = 100;
                })
                $el.find('.ItemListGrid').find('.triggerEdit').off('click').on('click',function(){
                    self.triggerUpdate($(this).data('triggerid'));
                })
                $switch.on("switchbutton:change", function(e,state){
                    var status = state ? 0 : 1;
                    var tips = state ? 'Enable selected trigger?' : 'Disable selected trigger?';
                    var tipsure = state ? 'trigger Enable' : 'trigger Disable';
                    action.triggerPut([{
                        "triggerid":"" + e.currentTarget.defaultValue,
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
                    name: 'triggerid',
                    label: '',
                    align: 'center',
                    key:true,
                    search: false,
                    hidden: true
                },{
                    name: 'wizard',
                    label: '监控点|模板',
                    width: 80,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return '<i class="glyphicon glyphicon-copyright-mark spot"></i>&nbsp;'+cellval[0].host;
                    }
                }, {
                    name: 'name',
                    label: '名称',
                    align: 'center'
                }, {
                    name: 'priority',
                    label: '告警级别',
                    width: 60,
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        switch(cellval){
                            case '1':
                                tdClass = 'lv1';
                                tdInfo = 'Information';
                            break;
                            case '2':
                                tdClass = 'lv2';
                                tdInfo = 'warning';
                            break;
                            case '3':
                                tdClass = 'lv3';
                                tdInfo = 'Average';
                            break;
                            case '4':
                                tdClass = 'lv4';
                                tdInfo = 'high';
                            break;
                            case '5':
                                tdClass = 'lv5';
                                tdInfo = 'disaster';
                            break;
                            default:
                                tdClass = 'lv0';
                                tdInfo = 'Not classified';
                            break;
                        }
                        return '<div class="'+tdClass+'">'+tdInfo+'</div>';
                    }
                }, {
                    name: 'expression',
                    label: '表达式',
                    width: 120,
                    title: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return '<div class="triggerBtn"><span class="expressPop">'+cellval+'</span><div class="popDlog popexs">'+cellval+'</div></div>';
                    }
                }, {
                    name: 'dependencies',
                    label: '依赖',
                    width: 40,
                    align: 'center',
                    title: false,
                    formatter(cellval, opts, rwdat, _act){
                        var trHtml = fish.map(cellval.triggers,function(row,keys){
                            var tdClass = '',tdINfo = '';
                            switch(row.priority){
                                case '1':
                                    tdClass = 'lv1';
                                    tdInfo = 'Information';
                                break;
                                case '2':
                                    tdClass = 'lv2';
                                    tdInfo = 'warning';
                                break;
                                case '3':
                                    tdClass = 'lv3';
                                    tdInfo = 'Average';
                                break;
                                case '4':
                                    tdClass = 'lv4';
                                    tdInfo = 'high';
                                break;
                                case '5':
                                    tdClass = 'lv5';
                                    tdInfo = 'disaster';
                                break;
                                default:
                                    tdClass = 'lv0';
                                    tdInfo = 'Not classified';
                                break;
                            }
                            var status = (row.state === 1 && 'unknown') || 'normal';
                            return '<tr class="tKey" data-key="">'+
                                '<td class="'+tdClass+'">'+tdInfo+'</td>'+
                                '<td style="max-width:160px">'+row.description+'</td>'+
                                '<td class="i'+status+'">'+status+'</td>'+
                            '</tr>';
                        });
                        return '<div class="triggerBtn">'+
                            '<div class="triggerSum" data-count="' + cellval.trigger_count + '" data-flag=""><span>' + cellval.trigger_count + '</span></div>'+
                            '<div class="popDlog">'+
                                "<div class='dlogClose'>×</div>"+
                                '<table class="table table-striped">'+
                                    '<thead>'+
                                        '<tr><th>告警级别</th><th>名称</th><th>状态</th></tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                    trHtml.join("")+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
                        '</div>';
                    }
                }, {
                    name: 'status',
                    label: '使用状态',
                    sortable: false,
                    width: 80,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return (cellval === 1 && '<input type="checkbox" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.triggerid+'" value="'+rwdat.triggerid+'">') || '<input type="checkbox" checked="" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.triggerid+'" value="'+rwdat.triggerid+'">';
                    }
                }, {
                    name: 'moreop',
                    label: '',
                    'title': false,
                    width: 50,
                    sortable: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return self.triggerOp({'id':cellval});
                    }
                }

            ],
            pager: true,
            multiselect:true
        };
        this.$gird = $el.find('.ItemListGrid').grid(opt);
        self.loadTableData();
    }

    TiggerListView.prototype.itemType=function(id) {
        var itemTypes;
        action.itemTypes('ITEM_TYPE').then(function(datas){
            return ''+datas.ITEM_TYPE[id].paraName+'';
        })
    }

    TiggerListView.prototype.triggerUpdate=function(id) {
        var self =this;
        var sid=""+id
        action.triggerGet({"triggerids":sid}).then(function(data) {
            if(data.result.length>0){
               var upObj = data.result[0];
               self.createTriggerViewRender(upObj)
            }
        })

    }

    TiggerListView.prototype.removeItem=function(id) {
        var self=this;
        var nid = "" + id;
        fish.confirm('Delete selected trigger?').result.then(function() {
            action.triggerRemove([nid]).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','trigger deleted');
                }
                self.loadData();
            })
        });

    }

    TiggerListView.prototype.gridBtnItemchange = function(){
        var self = this;
            $el = $(this.option.el),
            selrow = $el.find(".ItemListGrid").grid("getCheckRows");
        if(selrow.length>0){
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',false);
        }else{
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',true);
        }
    }

    TiggerListView.prototype.dlogShow = function() {
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

    TiggerListView.prototype.loadTableData = function() {
        var self = this;
        self.loadData();
    }

    TiggerListView.prototype.loadData = function() {
        var self = this;
        action.triggerGet(self.SearchItem).then(function(data) {
            //console.log(data.result);
            var result = fish.map(data.result, function(d) {
                return {
                    triggerid:d.triggerid,
                    wizard: d.hosts,
                    name: d.description,
                    priority: d.priority,
                    expression: d.expression,
                    dependencies: {
                        trigger_count:d.dependencies.length,
                        triggers : d.dependencies
                    },
                    status:Number(d.status),
                    moreop: d.triggerid
                }
            })
            self.$gird.grid("reloadData", result);
        })

    }

    TiggerListView.prototype.newRender=function() {
        var self = this;
        self.render();
    }
    return TiggerListView;

})