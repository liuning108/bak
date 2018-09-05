define([
    "oss_core/inms/pm/items/actions/ItemAction",
    "text!oss_core/inms/pm/items/components/views/addMetric.html",
    'i18n!oss_core/inms/pm/items/i18n/items'
], function(action,tpl,i18nData) {
    var addMetric = function() {
        this.tpl = fish.compile(tpl);
    }

    addMetric.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    addMetric.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    addMetric.prototype.afterPopup = function() {
        var self = this;
        self.readerGird()
    }

    addMetric.prototype.readerGird = function() {
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
                name: 'key',
                label: '键值',
                key:true,
                search: false,
                align: 'center'
            },{
                name: 'name',
                label: '名称',
                align: 'center'
            }]
        };
        this.$ItemListGrid = this.$el.find('.ItemListGrid').grid(optDep);
        self.loadDepdata()
    }

    addMetric.prototype.loadDepdata = function() {
        var self = this;
        action.getMetricKeyInfo().then(function(data) {
            console.log(data,1111)
            var result = fish.map(data, function(d) {
                return {
                    "key":d.category,
                    "name": d.metricKeys
                }
            })
            self.$ItemListGrid.grid("reloadData", result);
        })
    }

    return addMetric;
})