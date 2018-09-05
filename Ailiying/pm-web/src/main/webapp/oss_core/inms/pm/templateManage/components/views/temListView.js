define([
    "oss_core/inms/pm/templateManage/actions/template",
    'i18n!oss_core/inms/pm/templateManage/i18n/template',
    "oss_core/inms/pm/templateManage/components/views/FilterViewDialog.js",
    "oss_core/inms/pm/templateManage/components/views/CreatTemplateView.js",
    "text!oss_core/inms/pm/templateManage/components/views/TemListView.html",
    "text!oss_core/inms/pm/templateManage/components/views/ItemOp.html",
    "oss_core/inms/pm/items/components/views/ItemListView.js",
    "oss_core/inms/pm/graphs/components/views/GraphsListView.js",
    "oss_core/inms/pm/trigger/components/views/triggerListView.js",
    "css!oss_core/inms/pm/graphs/css/kdo.css",
    "css!oss_core/inms/pm/graphs/css/graphs.css",
    "css!oss_core/inms/pm/templateManage/css/mainCss.css"
], function(action,i18nData,FilterViewDialog,CreatTemplateView,tpl,itemOp,ItemListView,GraphsListView,triggerListView) {
    var temListView = function(option,callback) {
        this.option = option;
        this.tpl = fish.compile(tpl);
        this.option.zIndex = 100;
        this.callback = callback;
        this.docH = $(document).height();
        this.tableH = (this.docH - 48 - 35 - 30 - 40 - 40) * 0.92;
        this.groupFilterList = [];
        this.SearchItem = {};
        console.log(this.SearchItem,1111)
        this.temList = {}
        this.itemOp = fish.compile(itemOp);
    }
    temListView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl(i18nData));
        this.afterRender();
    }
    temListView.prototype.remove = function() {
        if (this.$gird) {
            this.$gird.remove();
        }
        $(this.option.el).html("");
    }
    temListView.prototype.afterRender = function() {
        var self = this;
        action.getParamvalueInfo('TEMPLATE_CATAGORY').then(function(datas){
            self.catagory = datas.TEMPLATE_CATAGORY;
            //console.log(self.catagory)
            self.loadCatagory();
        })
    }

    temListView.prototype.loadCatagory = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.temcallback').off('click').on('click', function() {
            self.remove()
            self.option.callback()
        })
        self.createListTable();
        self.btnClick();
        self.rSearchBtn();
        self.createTemEvent();
    }

    temListView.prototype.createTemEvent = function() {
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
                console.log(self.SearchItem)
                self.loadData();
                //console.log(self.SearchItem);
            });
        });
        $el.find('.createTem').off('click').on('click', function() {
            self.creatTemplateView({})
        });
    }

    temListView.prototype.creatTemplateView = function(data,type) {
        var self = this;
        var $el = $(this.option.el);
        var options = {
            height: $el.height(),
            width: ($el.width() / 2.3),
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
        var creatTemplateView = new CreatTemplateView();
        if(type === 'copy'){
            creatTemplateView.popup(options,data,type,$el,function(param) {
                if(param){
                    self.newRender()
                }
                console.log(param)
            });
        }else{
            creatTemplateView.popup(options,data,'',$el,function(param) {
                if(param){
                    self.newRender()
                }
                console.log(param)
            });
        }
    }

    temListView.prototype.btnClick = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('#itemEditBtn').find('.btn-default').bind("click", function(e){
            var itemid = "",btnid = e.currentTarget.id;
            var selrow = $el.find('.ItemListGrid').grid("getCheckRows");
            fish.map(selrow,function(row){
                itemid += row.template_id + ",";
            });
            itemid = itemid.substring(0, itemid.length-1);
            var clickEvt = (btnid === 'Tem_on' && self.btnSwitch(itemid,false)) || (btnid === 'Tem_off' && self.btnSwitch(itemid,true)) || (btnid === 'Tem_del' && self.btnDel(itemid));
        });
    }
    temListView.prototype.btnDel = function(itemid) {
        var self = this,$el = $(this.option.el);
        var itemidArr = itemid.split(",");
        /*fish.confirm('Delete selected Templates?').result.then(function() {
            action.itemRemove(itemidArr).then(function(data){
                if(data.error){
                    fish.toast('warn',data.error.data);
                }else{
                    fish.toast('success','Templates deleted');
                }
                self.loadData();
            })
        });*/
    }
    temListView.prototype.btnSwitch = function(itemid,state) {
        var self = this,$el = $(this.option.el);
        self.option.flag = false;
        var itemidArr = itemid.split(",");
        var itemObj = [];
        var tips = state ? 'Disable selected Templates?' : 'Enable selected Templates?';
        var tipsure = state ? 'Templates Disable' : 'Templates Enable';
        fish.map(itemidArr,function(row){
            itemObj.push(row);
        });
        if(itemObj.length > 0){
            fish.confirm(tips).result.then(function() {
                if(state){
                    action.updateStatusInfoStop(itemObj).then(function(data){
                        if(data.ReturnCode === '0'){
                            fish.toast('success',tipsure);
                        }else{
                            fish.toast('warn',data.error.data);
                        }
                        self.loadData();
                    })
                }else{
                    action.updateStatusInfoStart(itemObj).then(function(data){
                        if(data.ReturnCode === '0'){
                            fish.toast('success',tipsure);
                        }else{
                            fish.toast('warn',data.error.data);
                        }
                        self.loadData();
                    })
                }
            })
        }
    }

    temListView.prototype.rSearchBtn = function() {
        var self = this;
        var $el = $(this.option.el);
        $el.find('.filterArea').find('.rSearch').bind('click',function(){
            self.SearchItem.templateName= $el.find('.filterName').val() ? $el.find('.filterName').val() : '';
            self.loadData();
        })
    }

    temListView.prototype.openLink = function(type,id,cid) {
        var self = this;
        var $el = $(this.option.el);
        if(type === 'openItems'){
            var itemView = new ItemListView({
                'el': $el,
                'templateId':id,
                'catagory':cid,
                callback:function(){
                    self.render();
                }
            })
            itemView.render();
        }else if(type === 'openGraph'){
            var graphsListView = new GraphsListView({
                el: $el,
                'id':id,
                tableH: self.tableH,
                callback:function() {
                    self.render();
                }
            })
            graphsListView.render();
        }else if(type === 'openTrigger'){
            var TriggerView = new triggerListView({
                el: $el,
                'templateids':id,
                callback:function() {
                    self.render();
                }
            })
            TriggerView.render();
        }
    }

    temListView.prototype.createListTable = function() {
        var self = this;
        var $el = $(this.option.el);
        var $area = $el.find('.filterArea');
        var mydata = [];
        var opt = {
            data: mydata,
            height: self.tableH - 54,
            gridComplete: function() {
                $el.find('.ItemListGrid').find('.ItemOp').parent().css('overflow', "visible");
                $el.find('.ItemListGrid').find('.triggerBtn').parent().css('overflow', "visible");
                $el.find(".ItemListGrid").find('[type="checkbox"]').bind("change", function(e){
                    self.gridBtnItemchange();
                });
                var cgItemid = [];
                $el.find(".ItemOp").find(".TemDel").bind("click", function(e){
                    var sid = $(this).data("itemid");
                    self.removeItem(sid);
                });
                $el.find('.ItemListGrid').find('.ui-switch-handle-off').parent().bind('click',function(){
                })
                $el.find('.ItemListGrid').find('.TemEdit').off('click').on('click',function(){
                    self.itemUpdate($(this).data('itemid'));
                })
                $el.find('.ItemListGrid').find('.TemCopy').off('click').on('click',function(){
                    self.itemUpdate($(this).data('itemid'),'copy');
                })
                $el.find('.ItemListGrid').find('.openLink').off('click').on('click',function(e){
                    var btnid = e.currentTarget.id,tid=$(this).data('tid'),cid=$(this).data('cid');
                    self.openLink(btnid,tid,cid)
                });
            },
            colModel: [
                {
                    name: 'template_id',
                    label: '',
                    align: 'center',
                    key:true,
                    search: false,
                    hidden: true
                }, {
                    name: 'template_name',
                    label: '名称',
                    align: 'center'
                }, {
                    name: 'catagory',
                    label: '模板类别',
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        var cateInfo = self.catagory.filter(function (e) {
                            return e.paraValue == cellval;
                        })
                        return cateInfo[0].paraName;
                    }
                }, {
                    name: 'items',
                    label: '监控项',
                    width: 80,
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        return '<span id="openItems" class="openLink" data-tid="'+rwdat.template_id+'" data-cid="'+rwdat.catagory+'">'+cellval+'</span>';
                    }
                }, {
                    name: 'graph',
                    label: '图形',
                    align: 'center',
                    formatter(cellval, opts, rwdat, _act){
                        return '<span id="openGraph" class="openLink" data-tid="'+rwdat.template_id+'" data-cid="'+rwdat.catagory+'">'+cellval+'</span>';
                    }
                }, {
                    name: 'trigger',
                    label: '触发器',
                    sortable: false,
                    align: 'center',
                    formatter: function(cellval, opts, rwdat, _act) {
                        return '<span id="openTrigger" class="openLink" data-tid="'+rwdat.template_id+'" data-cid="'+rwdat.catagory+'">'+cellval+'</span>';
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

    temListView.prototype.itemUpdate=function(id,type) {
        var self =this;
        var sid=""+id
        var upObj = self.temList.filter(function (e) {
            return e.templateId == id;
        })
        if(type === 'copy'){
            self.creatTemplateView(upObj,type)
        }else{
            self.creatTemplateView(upObj)
        }
    }

    temListView.prototype.removeItem=function(id) {
        var self=this;
        var nid = "" + id;
        fish.confirm('Delete selected Templates?').result.then(function() {
            action.pmtemplatedel([nid]).then(function(data){
                if(data.ReturnCode === '0'){
                    fish.toast('success','Templates deleted');
                }else{
                    fish.toast('warn','error');
                }
                self.loadData();
            })
        });

    }

    //click checkbox to show editbutton
    temListView.prototype.gridBtnItemchange = function(){
        var self = this;
            $el = $(this.option.el),
            selrow = $el.find(".ItemListGrid").grid("getCheckRows");
        if(selrow.length>0){
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',false);
        }else{
            $el.find("#itemEditBtn").find(".btn-default").prop('disabled',true);
        }
    }

    temListView.prototype.loadTableData = function() {
        var self = this;
        self.loadData();
    }

    temListView.prototype.loadData = function() {
        var self = this;
        action.pmtemplate(self.SearchItem).then(function(data) {
            self.temList = data;
            var result = fish.map(data, function(d) {
                return {
                    template_id:d.templateId,
                    template_name: d.templateName,
                    catagory: d.catagory,
                    items: Number(d.items),
                    graph: Number(d.graphys),
                    trigger: Number(d.triggers),
                    moreop: d.templateId
                }
            })
            //console.log(self.temList)
            self.$gird.grid("reloadData", result);
        })

    }

    temListView.prototype.newRender=function() {
        var self = this;
        self.render();
    }
    return temListView;

})