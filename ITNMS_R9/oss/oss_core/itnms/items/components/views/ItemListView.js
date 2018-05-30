define([
    "oss_core/itnms/items/components/views/FilterViewDialog.js",
    "oss_core/itnms/items/actions/ItemAction",
    "text!oss_core/itnms/items/components/views/ItemListView.html",
    "text!oss_core/itnms/items/components/views/filterItemView.html",
    "text!oss_core/itnms/items/components/views/ItemOp.html",
    "oss_core/itnms/items/components/views/CreateItemView.js",
    "css!oss_core/itnms/host/css/kdo.css",
    "css!oss_core/itnms/items/css/items.css"
], function(FilterViewDialog,action,tpl,filterTpl,itemOp,CreateItemView) {
    var ItemListView = function(option,callback) {
        this.option = option;
        this.tpl = fish.compile(tpl);
        this.option.zIndex = 100;
        this.callback = callback;
        this.docH = $(document).height();
        this.tableH = (this.docH - 48 - 35 - 30 - 40 - 40) * 0.92;
        this.groupFilterList = [];
        this.SearchItem = {
            "output":"extend",
            "selectHosts":["host","hostid","status"],
            "selectTriggers":["description","expression","status","priority"],
            "search":{},
            "filter":{}
        };
        if(this.option.templateids){
            this.SearchItem.templateids = this.option.templateids;
        }
        if(this.option.groupid){
            this.SearchItem.groupids = this.option.groupids;
        }
        if(this.option.hostids){
            this.SearchItem.hostids = this.option.hostids;
        }
        this.filterTpl = fish.compile(filterTpl);
        this.itemOp = fish.compile(itemOp);
    }
    ItemListView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl());
        this.afterRender();
    }
    ItemListView.prototype.remove = function() {
        if (this.$gird) {
            this.$gird.remove();
        }
        $(this.option.el).html("");
    }
    ItemListView.prototype.afterRender = function() {
        var self = this;
        action.itemTypes('ITEM_TYPE').then(function(datas){
            self.itemTypes = datas.ITEM_TYPE;
            self.loadItemTypes();
        })
    }
    ItemListView.prototype.loadItemTypes=function(){
        var self = this;
        var $el = $(this.option.el);
        $el.find('.itemClose').off('click').on('click', function() {
            self.remove()
            self.option.callback()
        })
        self.createListTable();
        self.btnClick();
        self.popToggle();
        self.rSearchBtn();//search click
        self.createFilterEvent();
        self.createItemEvent();//creat items

    }
    ItemListView.prototype.createItemViewRender = function(d){
        var self =this;
        var $el = $(this.option.el);
        var createItemView = new CreateItemView({
            el: $el,
            "parent":self,
            "itemObj":self.SearchItem,
            "upObj":d
        })
        createItemView.render();
    }
    ItemListView.prototype.createItemEvent = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.createItem').off('click').on('click', function() {
            self.remove();
            self.createItemViewRender();
        })
    }
    ItemListView.prototype.createFilterEvent = function() {
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
                //console.log(self.SearchItem);
            });
        });
    },
    ItemListView.prototype.popToggle = function() {
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
    ItemListView.prototype.btnClick = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('#itemEditBtn').find('.btn-default').bind("click", function(e){
            var itemid = "",btnid = e.currentTarget.id;
            var selrow = $el.find('.ItemListGrid').grid("getCheckRows");
            fish.map(selrow,function(row){
                itemid += row.itemid + ",";
            });
            itemid = itemid.substring(0, itemid.length-1);
            var clickEvt = (btnid === 'items_on' && self.btnSwitch(itemid,false)) || (btnid === 'items_off' && self.btnSwitch(itemid,true)) || (btnid === 'items_del' && self.btnDel(itemid));
        });
    }
    ItemListView.prototype.btnDel = function(itemid) {
        var self = this,$el = $(this.option.el);
        var itemidArr = itemid.split(",");
        fish.confirm('Delete selected items?').result.then(function() {
            action.itemRemove(itemidArr).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','items deleted');
                }
                self.loadData();
            })
        });
    }
    ItemListView.prototype.btnSwitch = function(itemid,state) {
        var self = this,$el = $(this.option.el);
        self.option.flag = false;
        var itemidArr = itemid.split(",");
        var itemObj = [];
        var status = state ? 1 : 0;
        var tips = state ? 'Disable selected items?' : 'Enable selected items?';
        var tipsure = state ? 'items Disable' : 'items Enable';
        fish.map(itemidArr,function(row){
            // $el.find('.ItemListGrid').find('#switch' + row).switchbutton('option','state',state);
            itemObj.push({"itemid":""+row,"status": status});
        });
        if(itemObj.length > 0){
            fish.confirm(tips).result.then(function() {
                action.itemPut(itemObj).then(function(){
                    fish.toast('success',tipsure);
                    self.loadData();
                })
            })
        }
    }
    ItemListView.prototype.rSearchBtn = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterArea').find('.rSearch').bind('click',function(){
            $el.find('.filterArea').find('.inputbottom').next().slideUp(100,"linear");
            self.loadData();
        })
    }
    ItemListView.prototype.qryHostGroup = function() {
        var self = this;
        var $el = $(this.option.el);
        action.getHostGroup().then(function(datas){
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
            //console.log(groupData);
            self.$comboboxhost = $el.find('.comboboxhost').combobox('disable');
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
                //console.log(d);
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
    ItemListView.prototype.comboboxGroupsChange = function (groupid) {
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
    ItemListView.prototype.createListTable = function() {
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
                $el.find(".ItemOp").find(".itemsDel").bind("click", function(e){
                    var sid = $(this).data("itemid");
                    self.removeItem(sid);
                });
                $el.find('.ItemListGrid').find('.ui-switch-handle-off').parent().bind('click',function(){
                })
                self.dlogShow();
                $el.find('.ItemListGrid').find('.dlogClose').bind('click',function(){
                    $(this).parent().prev().data("flag","0");
                    $(this).parent().hide();
                })
                $el.find('.ItemListGrid').find('.itemsEdit').off('click').on('click',function(){
                    self.itemUpdate($(this).data('itemid'));
                })
                $switch.on("switchbutton:change", function(e,state){
                    var status = state ? 0 : 1;
                    var tips = state ? 'Enable selected items?' : 'Disable selected items?';
                    var tipsure = state ? 'items Enable' : 'items Disable';
                    action.itemPut([{
                        "itemid":"" + e.currentTarget.defaultValue,
                        "status": status
                    }]).then(function(){
                        fish.toast('success',tipsure);
                        self.loadData();
                    })
                });
                self.dropDown();
            },
            colModel: [
                {
                    name: 'itemid',
                    label: '',
                    align: 'center',
                    key:true,
                    search: false,
                    hidden: true
                },{
                    name: 'wizard',
                    label: '监控点|模板',
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        if(cellval[0].status == 0){
                            return cellval[0].host;
                        }else{
                            return '<i class="glyphicon glyphicon-copyright-mark spot"></i>&nbsp;'+cellval[0].host;
                        }
                    }
                }, {
                    name: 'name',
                    label: '名称',
                    align: 'center'
                }, {
                    name: 'keys',
                    label: '键值',
                    align: 'center'
                }, {
                    name: 'types',
                    label: '类型',
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        return ''+self.itemTypes[cellval].paraName+'';
                    }
                }, {
                    name: 'triggers',
                    label: '触发器',
                    width: 80,
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        //console.log(cellval.triggers);
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
                            var status = (row.status === 1 && 'Disable') || 'Enabled';
                            return '<tr class="tKey" data-key="">'+
                                '<td class="'+tdClass+'">'+tdInfo+'</td>'+
                                '<td>'+row.description+'</td>'+
                                '<td class="i'+status+'">'+status+'</td>'+
                            '</tr>';
                        });
                        return '<div class="triggerBtn">'+
                            '<div class="triggerSum" data-count="' + cellval.trigger_count + '" data-flag="">' + cellval.trigger_count + '</div>'+
                            '<div class="popDlog">'+

                                "<div class='dlogClose'>×</div>"+

                                '<table class="table table-striped">'+
                                    '<thead>'+
                                        '<tr><th>Severity</th><th>Name</th><th>Status</th></tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                    trHtml.join("")+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
                        '</div>';
                    }
                }, {
                    name: 'interval',
                    label: '更新间隔',
                    width: 100,
                    align: 'center'
                }, {
                    name: 'history',
                    label: '历史数据存储时长',
                    align: 'center'
                }, {
                    name: 'trends',
                    label: '趋势数据存储时长',
                    align: 'center'
                }, {
                    name: 'status',
                    label: '使用状态',
                    sortable: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return (cellval === 1 && '<input type="checkbox" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.itemid+'" value="'+rwdat.itemid+'">') || '<input type="checkbox" checked="" class="switch-btn" data-on-color="success" data-off-color="danger" id="switch'+rwdat.itemid+'" value="'+rwdat.itemid+'">';
                    }
                }, {
                    name: 'moreop',
                    label: '',
                    'title': false,
                    sortable: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return self.itemOp({'id':cellval});
                    }
                }

            ],
            pager: true,
            multiselect:true
        };
        this.$gird = $el.find('.ItemListGrid').grid(opt);
        self.loadTableData();
    }

    ItemListView.prototype.itemType=function(id) {
        var itemTypes;
        action.itemTypes('ITEM_TYPE').then(function(datas){
            return ''+datas.ITEM_TYPE[id].paraName+'';
        })
    }

    ItemListView.prototype.itemUpdate=function(id) {
        var self =this;
        var sid=""+id
        action.itemGet({
            "itemids":sid,
            "output":"extend",
            "selectHosts":["host","hostid","status"],
            "selectTriggers":["description","expression","status","priority"],
            "selectPreprocessing":["type","params"],
            "search":{},
            "filter":{}
        }).then(function(data) {
            if(data.result.length>0){
               var upObj = data.result[0];
               self.createItemViewRender(upObj)
            }
        })

    }

    ItemListView.prototype.removeItem=function(id) {
        var self=this;
        var nid = "" + id;
        fish.confirm('Delete selected items?').result.then(function() {
            action.itemRemove([nid]).then(function(data){
                if(data.error){
                    console.log(data.error);
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','items deleted');
                }
                self.loadData();
            })
        });

    }

    //click checkbox to show editbutton
    ItemListView.prototype.gridBtnItemchange = function(){
        var self = this;
            $el = $(this.option.el),
            selrow = $el.find(".ItemListGrid").grid("getCheckRows");
        if(selrow.length>0){
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',false);
        }else{
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',true);
        }
    }

    ItemListView.prototype.dlogShow = function() {
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
                    tops = -Number(pHeight - 35);
                }
                $(this).next('.popDlog').css({
                    "z-index":self.option.zIndex
                }).show();
            }
        })
        $el.find('.ItemListGrid').find('.triggerSum').mouseenter(function(){
            var self_ = $(this);
            var tops = "";
            var tTop = $(this).offset().top;
            var pHeight = $(this).next('.popDlog').height();
            var conut = $(this).data('count');
            self.option.zIndex = self.option.zIndex + 1;
            if(conut > 0){
                //console.log(tTop);
                if(tTop >= 300){
                    self_.next('.popDlog').addClass('dPopTop');
                }
                self_.next('.popDlog').show();
            }
        }).mouseleave(function(event) {
            var self_ = $(this);
            self.option.zIndex = 100;
            dataflag = self_.data('flag');
            if(dataflag != "1"){
               $(this).next('.popDlog').removeClass('dPopTop').hide();
            }
        });
    }

    ItemListView.prototype.dropDown = function() {
        var self = this;
        var $el = $(this.option.el);
        if ($el.find('.ItemListGrid').find('.ItemOp').find(".dropdown").length <= 0) return;
        $(".dropdown").on("dropdown:open", function() {
            var $ul = $(this).children(".dropdown-menu");
            var $button = $(this).children(".dropdown-toggle");
            var ulOffset = $ul.offset();
            var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
            var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
            if (spaceDown < 145 && (spaceUp >= 0 || spaceUp > spaceDown)){
                $(this).addClass("dropup");
            }
        })
        $(".dropdown").on("dropdown:close", function() {
            $(this).removeClass("dropup");
        });
    }

    ItemListView.prototype.loadTableData = function() {
        var self = this;
        self.loadData();
    }

    ItemListView.prototype.loadData = function() {
        var self = this;
        action.itemGet(self.SearchItem).then(function(data) {
            //console.log(data.result);
            var result = fish.map(data.result, function(d) {
                return {
                    itemid:d.itemid,
                    wizard: d.hosts,
                    name: d.name,
                    keys: d.key_,
                    types: d.type,
                    triggers: {
                        trigger_count:d.trigger_count,
                        triggers : d.triggers
                    },
                    interval: d.delay,
                    history: d.history,
                    trends: d.trends,
                    status:Number(d.status),
                    moreop: d.itemid
                }
            })
            self.$gird.grid("reloadData", result);
        })

    }

    ItemListView.prototype.newRender=function() {
        var self = this;
        self.render();
    }
    return ItemListView;

})