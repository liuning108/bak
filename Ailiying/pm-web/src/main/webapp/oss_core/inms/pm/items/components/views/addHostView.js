define([
    "oss_core/inms/pm/items/actions/ItemAction",
    "text!oss_core/inms/pm/items/components/views/addHostView.html",
    'i18n!oss_core/inms/pm/items/i18n/items'
], function(action,tpl,i18nData) {
    var AddHostView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddHostView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddHostView.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddHostView.prototype.afterPopup = function() {
        var self = this;
        self.readerGird()
    }

    AddHostView.prototype.readerGird = function() {
        var self = this;
        var optDep = {
            data: [],
            height: 250,
            gridComplete: function() {
            },
            onSelectRow: function (e, rowid, state, checked) {
                var selrow = self.$ItemListGrid.grid("getSelection");
                self.callback(selrow)
                self.$popup.hide();
            },
            colModel: [{
                name: 'name',
                label: '名称',
                key:true,
                search: false,
                align: 'center'
            },{
                name: 'keys',
                label: '键值',
                align: 'center'
            }, {
                name: 'type',
                label: '值类型',
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    var cateInfo = self.props.ITEM_VALUE_TYPE.filter(function (e) {
                        return e.paraValue == cellval;
                    })
                    return cateInfo[0].paraName ? cateInfo[0].paraName : ''
                }
            }, {
                name: 'status',
                label: '状态',
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return (cellval === 1 && 'disabled') || 'enable'
                }
            }]
        };
        this.$ItemListGrid = this.$el.find('.ItemListGrid').grid(optDep);
        self.loadDepdata()
    }

    AddHostView.prototype.loadDepdata = function() {
        var self = this;
        action.getItemsInfo({}).then(function(data) {
            var result = fish.map(data, function(d) {
                return {
                    "name":d.itemName,
                    "keys": d.metricKey,
                    "type": d.valueType,
                    "status": Number(d.status)
                }
            })
            self.$ItemListGrid.grid("reloadData", result);
        })
    }

    return AddHostView;
})