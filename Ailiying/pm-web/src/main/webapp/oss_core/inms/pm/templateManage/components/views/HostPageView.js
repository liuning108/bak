define([
    "oss_core/inms/pm/templateManage/actions/template",
    "text!oss_core/inms/pm/templateManage/components/views/HostPageView.html",
    "oss_core/inms/pm/templateManage/components/views/AddHostView.js"
], function(action,tpl,AddHostView) {
    var HostPageView = function(options) {
        this.options = options;
        this.$el = $(this.options.el);
        this.tpl = fish.compile(tpl);
        this.upObj = this.options.upObj;
        this.pEl = this.options.pEl;
        this.type = this.options.type;
        this.$pel = $(this.options.parent);
        this.CPSchemeinfo = []
        this.TemplateDto = this.options.TemplateDto;
        //console.log(this.upObj)
    }

    HostPageView.prototype.render = function() {
        this.$el.html(this.tpl());
        this.afterRender()
    }

    HostPageView.prototype.afterRender = function() {
        var self = this
        self.renderGird()
        this.$el.find('.addHost').off('click').on('click', function() {
            self.addHost({})
        });
    }

    HostPageView.prototype.addHost = function(data) {
        var self = this
        var $el = self.$el;
        console.log(this.pEl.width(),222)
        var options = {
            height: this.pEl.height(),
            width: (this.pEl.width() / 2.3),
            modal: true,
            draggable: false,
            autoResizable: false,
            position: {
                'of': this.pEl,
                'my': "top",
                'at': "right" + " " + "top",
                collision: "fit"
            }
        };
        var addHostView = new AddHostView();
        addHostView.popup(options,{'CPSchemeinfo':data,'catagory':self.$pel.find('.catagory').val()},function(param) {
            console.log(param)
            if(param && param.CPSchemeinfo.rid != ''){
                self.editRow(param);
            }else{
                self.addRow(param)
            }
        });
    }

    HostPageView.prototype.editRow = function(data) {
        var self = this;
        if(data){
            var item={
                'cpName': data.CPSchemeinfo.cpName ? data.CPSchemeinfo.cpName : '',
                'cpId': data.CPSchemeinfo.cpTypeId ? data.CPSchemeinfo.cpTypeId : '',
                'cpTypeId': data.CPSchemeinfo.cpId,
                'checkPointSelectConds': data.CPSchemeinfo.checkPointSelectConds,
                'hostmacroid':$.jgrid.randId()
            }
            self.$grid.grid("setRowData",data.CPSchemeinfo.rid,item)
        }
    }

    HostPageView.prototype.addRow = function(data) {
        var self = this;
        if(data){
            var item={
                'cpName': data.CPSchemeinfo.cpName ? data.CPSchemeinfo.cpName : '',
                'cpId': '',
                'cpTypeId': data.CPSchemeinfo.cpId,
                'checkPointSelectConds': data.CPSchemeinfo.checkPointSelectConds,
                'hostmacroid':$.jgrid.randId()
            }
            self.$grid.grid("addRowData",item)
        }
    }

    HostPageView.prototype.renderGird = function() {
        var self = this;
        var opt = {
            data: [],
            height: 350,
            colModel: [{
                name: 'cpName',
                label: '监测点',
                align: 'left',
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return cellval
                }
            },{
                name: 'cpId',
                label: '',
                align: 'left',
                sortable: false,
                hidden: true,
            },{
                name: 'cpTypeId',
                label: '',
                align: 'left',
                sortable: false,
                hidden: true,
            }, {
                name: 'checkPointSelectConds',
                label: '宏',
                align: 'left',
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    var arr = []
                    var rStr = fish.map(cellval, function(d) {
                        return d.macro ? '#{'+d.macro+'}' : ''
                    })
                    rStr = rStr.join(',')
                    rStr = (rStr.substring(rStr.length-1) == ',') ? rStr.substring(0,rStr.length-1) : rStr;
                    return '<span class="cList">'+rStr+'</span>'
                }
            }, {
                name: 'hostmacroid',
                label: '',
                width: 50,
                'title': false,
                formatter: function(cellval, opts, rwdat, _act) {
                    console.log(rwdat)
                    return '<i class="glyphicon glyphicon-pencil editHost" data-id="' + cellval + '"></i><i data-id="' + cellval + '"class="glyphicon glyphicon-trash removeHost" title="remove" data-cid="'+rwdat.cpId+'"></i>'
                }
            }]
        };
        self.$grid = this.$el.find('.MacroGrid').grid(opt);
        self.loadData()
        self.$grid.on('click', '.removeHost', function() {
            var this_ = $(this);
            var cid = this_.data('cid')
            action.pmIsDeleteCheckPoint({'checkpoint':cid}).then(function(data) {
                if(data.resultCode === '0'){
                    var selrow = self.$grid.grid("getSelection");
                    self.$grid.grid("delRowData", selrow);
                }else{
                    fish.toast('warn',data.resultDesc)
                }
            })
        })
        self.$grid.on('click', '.editHost', function() {
            var selrow = self.$grid.grid("getSelection");
            console.log(selrow,1111111)
            self.addHost(selrow)
        })
    }

    HostPageView.prototype.loadData = function() {
        var self = this;
        //console.log(self.upObj)
        if(self.upObj && self.upObj.length > 0){
            action.pmtemplateCPInfo({'templateId':self.upObj[0].templateId}).then(function(data) {
                console.log(data,1111)
                var result = fish.map(data, function(d) {
                    return {
                        cpName:d.cpName,
                        cpId: d.cpId,
                        cpTypeId:d.cpTypeId,
                        checkPointSelectConds: d.checkPointSelectConds,
                        hostmacroid: $.jgrid.randId()
                    }
                })
                //console.log(self.temList)
                self.$grid.grid("reloadData", result);
            })
        }
    }

    HostPageView.prototype.getInfo = function() {
        var self = this;
        var data = self.$grid.grid("getRowData");
        //console.log(data,222)
        self.TemplateDto.templateCP = data
        return self.TemplateDto
    }

    return HostPageView;
})