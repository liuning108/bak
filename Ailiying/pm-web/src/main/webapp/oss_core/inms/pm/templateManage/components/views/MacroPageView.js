define([
    "oss_core/inms/pm/templateManage/actions/template",
    "text!oss_core/inms/pm/templateManage/components/views/MacroPageView.html"
], function(action,tpl) {
    var MacroPageView = function(options) {
        this.options = options;
        this.$el = $(this.options.el);
        this.tpl = fish.compile(tpl);
        this.upObj = this.options.upObj;
        this.type = this.options.type;
        this.$pel = $(this.options.parent);
        this.TemplateDto = this.options.TemplateDto;
    }

    MacroPageView.prototype.render = function() {
        this.$el.html(this.tpl());
        this.afterRender()
    }

    MacroPageView.prototype.afterRender = function() {
        var self = this
        self.renderGird()
    }

    MacroPageView.prototype.addItem=function() {
        var item={
            'macro': this.$el.find('.newMacro').val(),
            'value': this.$el.find('.newMValue').val(),
            'hostmacroid':'none'
        }
        this.$grid.grid("addRowData",item)

    }

    MacroPageView.prototype.renderGird = function() {
        var self = this;
        var opt = {
            data: [],
            height: 350,
            colModel: [{
                name: 'macro_code',
                label: '宏',
                align: 'left',
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return "<input class='macro_code' value='" + cellval + "'></input>"
                }
            }, {
                name: 'macro_vaue',
                label: '值',
                align: 'left',
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return "<input class='macro_vaue' value='" + cellval + "'></input>"
                }
            }, {
                name: 'comments',
                label: '备注',
                align: 'left',
                sortable: false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return "<input class='comments' value='" + cellval + "'></input>"
                }
            }, {
                name: 'macroid',
                label: '',
                width: 50,
                'title': false,
                formatter: function(cellval, opts, rwdat, _act) {
                    return '<i data-id="' + cellval + '"class="glyphicon glyphicon-trash removeMacro" title="remove"></i>'
                }
            }]
        };
        self.$grid = this.$el.find('.MacroGrid').grid(opt);
        self.loadData()
        self.$grid.on('click', '.removeMacro', function() {
            var selrow = self.$grid.grid("getSelection");
            self.$grid.grid("delRowData", selrow);//删除记录
        })
        self.$el.find('.addMacro').off('click').on('click',function(){
            var item={
               'macro_code': '',
               'macro_vaue': '',
               'comments': '',
               'macroid':$.jgrid.randId(),
            }
            self.$grid.grid("addRowData",item)
        })
    }

    MacroPageView.prototype.getInfo = function() {
        var self = this;
        var data = self.$grid.grid("getDataIDs"); //获取所有的rowid记录
        self.TemplateDto.templateMacro = fish.map(data, function(rowid) {
            var selrowDom = $(self.$grid.grid("getGridRowById", rowid));
            return {
                'macroCode': selrowDom.find('.macro_code').val(),
                'macroValue': selrowDom.find('.macro_vaue').val(),
                'comments': selrowDom.find('.comments').val()
            }

        })
        return self.TemplateDto
    }

    MacroPageView.prototype.loadData = function() {
        var self = this;
        if(self.upObj && self.upObj.length > 0){
            var mData = {
                "templateId":self.upObj[0].templateId
            }
        }else{
            var mData = {"templateId":'-1'}
        }
        action.pmtemplateMacroInfo(mData).then(function(data) {
            var result = fish.map(data, function(d) {
                return {
                    macro_code:d.macroCode,
                    macro_vaue: d.macroValue,
                    comments: d.comments,
                    macroid: $.jgrid.randId()
                }
            })
            self.$grid.grid("reloadData", result);
        })

    }

    return MacroPageView;
})