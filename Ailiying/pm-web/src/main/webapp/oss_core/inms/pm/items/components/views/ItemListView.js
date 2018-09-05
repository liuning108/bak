define([
    "oss_core/inms/pm/items/actions/ItemAction",
    'i18n!oss_core/inms/pm/items/i18n/items',
    "oss_core/inms/pm/items/components/views/FilterViewDialog.js",
    "text!oss_core/inms/pm/items/components/views/ItemListView.html",
    "text!oss_core/inms/pm/items/components/views/ItemOp.html",
    "oss_core/inms/pm/items/components/views/CreateItemView.js",
    "css!oss_core/inms/pm/graphs/css/kdo.css",
    "css!oss_core/inms/pm/templateManage/css/mainCss.css"
], function(action,i18nData,FilterViewDialog,tpl,itemOp,CreateItemView) {
    var ItemListView = function(option,callback) {
        this.option = option;
        this.tpl = fish.compile(tpl);
        this.option.zIndex = 100;
        this.callback = callback;
        this.docH = $(document).height();
        this.tableH = (this.docH - 48 - 35 - 30 - 40 - 40) * 0.92;
        this.groupFilterList = [];
        this.option.catagory = this.option.catagory;
        console.log(this.option.catagory)
        //this.option.templateId = "T00002";
        this.SearchItem = {
            "templateId": this.option.templateId
        };
        this.itemOp = fish.compile(itemOp);
    }
    ItemListView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl(i18nData));
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
        action.getParamvalueInfo('ITEM_VALUE_TYPE').then(function(datas){
            self.valueTypes = datas.ITEM_VALUE_TYPE;
            //console.log(self.catagory)
            self.valueType();
        })
    }
    ItemListView.prototype.valueType = function() {
        var self = this
        var $el = $(this.option.el);
        $el.find('.temcallback').off('click').on('click', function() {
            self.remove()
            self.option.callback()
        })
        self.createListTable();
        self.btnClick();
        this.rSearchBtn();
        self.createFilterEvent();
        self.createItemEvent();
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
                console.log(param)
                self.SearchItem = param;
                self.loadData();
                //console.log(self.SearchItem);
            });
        });
    },
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
            action.delItemsInfo(itemidArr).then(function(data){
                if(data.ReturnCode === '0'){
                    fish.toast('success','items deleted');
                }else{
                    fish.toast('warn',data.error.data);
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
            //$el.find('.ItemListGrid').find('#switch' + row).switchbutton('option','state',state);
            itemObj.push({"item_id":""+row,"status": status});
        });
        if(itemidArr.length > 0){
            fish.confirm(tips).result.then(function() {
                console.log(1)
                action.updateItemsStatus({"itemIds":""+itemid,"status": status}).then(function(data){
                    if(data.ReturnCode === '0'){
                        fish.toast('success',tipsure);
                        self.loadData();
                    }else{
                        fish.toast('warn','修改失败');
                    }
                })
            })
        }
    }

    // 简单查询按钮处理
    ItemListView.prototype.rSearchBtn = function() {
        var self = this;
        var $el = $(this.option.el);
        //查询模型类型，并改变模型类型时加载对应的模型
        action.getParamvalueInfo("TEMPLATE_CATAGORY").then(function(data){
            var templateTypeList = data.TEMPLATE_CATAGORY;
            this.$templateTypeComb = $el.find('.filterArea').find('.templateType').combobox({
                dataTextField: 'paraName', dataValueField: 'paraValue', dataSource: templateTypeList
            });
            this.$templateTypeComb.on('combobox:change', function() {
                var d = this.$templateTypeComb.combobox('getSelectedItem');
                console.log(d)
                this.queryTemplate(d.paraValue);
            }.bind(this)).combobox('value', this.option.catagory);
        }.bind(this));
    }
    // 简单查询-模板事件处理
    ItemListView.prototype.queryTemplate = function(catagory) {
        var $el = $(this.option.el);
         //根据catagory 查询模板列表
         action.queryTempalte(catagory).then(function(data){
            var templateList = data;
            this.$tempaleComb = $el.find('.filterArea').find('.tempalte').combobox({
                dataTextField: 'templateName', dataValueField: 'templateId', dataSource: templateList
            }).off('combobox:change').on('combobox:change', function() {
                this.SearchItem.templateId = this.$tempaleComb.combobox('value');
                this.loadData();
            }.bind(this));
            var initTempId = this.SearchItem.templateids
            filterList = templateList.filter(function (e) {
                return e.templateId == initTempId;
            });
            //this.$tempaleComb.combobox('value',filterList.length > 0 ? initTempId : templateList[0].templateId);
         }.bind(this));
    }

    ItemListView.prototype.createListTable = function() {
        var self = this;
        var $el = $(this.option.el);
        var $area = $el.find('.filterArea');
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
                    action.updateItemsStatus({
                        "itemIds":"" + e.currentTarget.defaultValue,
                        "status": status
                    }).then(function(){
                        fish.toast('success',tipsure);
                        self.loadData();
                    })
                });
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
                    name: 'template_name',
                    label: '模板',
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return cellval;
                    }
                }, {
                    name: 'item_name',
                    label: '名称',
                    align: 'center'
                }, {
                    name: 'metric_key',
                    label: 'metric 键',
                    align: 'center'
                }, {
                    name: 'expression',
                    label: '计算表达式',
                    align: 'center'
                }, {
                    name: 'value_type',
                    label: '值类型',
                    width: 80,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        var cateInfo = self.valueTypes.filter(function (e) {
                            return e.paraValue == cellval;
                        })
                        return cateInfo[0].paraName ? cateInfo[0].paraName : ''
                    }
                }, {
                    name: 'items',
                    label: '监测点',
                    width: 100,
                    align: 'center'
                }, {
                    name: 'trends',
                    label: '采集周期',
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
        console.log(sid)
        action.getItemsTotalInfo([sid]).then(function(data) {
            self.createItemViewRender(data[0])
        })
    }

    ItemListView.prototype.removeItem=function(id) {
        var self=this;
        var nid = "" + id;
        fish.confirm('Delete selected items?').result.then(function() {
            action.delItemsInfo([nid]).then(function(data){
                if(data.ReturnCode === '0'){
                    fish.toast('success','items deleted');
                }else{
                    fish.toast('warn','删除失败');
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

    ItemListView.prototype.loadTableData = function() {
        var self = this;
        self.loadData();
    }

    ItemListView.prototype.loadData = function() {
        var self = this;
        action.getItemsInfo(self.SearchItem).then(function(data) {
            console.log(self.SearchItem,111)
            var result = fish.map(data, function(d) {
                return {
                    itemid:d.itemId,
                    template_name: d.templateName,
                    item_name: d.itemName,
                    metric_key: d.metricKey,
                    expression: d.expression,
                    value_type: d.valueType,
                    items: d.meAsCp,
                    trends: d.metricInterval,
                    status:Number(d.status),
                    moreop: d.itemId
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