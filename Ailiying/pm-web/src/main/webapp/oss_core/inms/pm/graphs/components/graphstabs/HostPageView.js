define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/HostPageView.html", "oss_core/inms/pm/graphs/components/graphstabs/HostPageItem.js"
], function(RootView, util, tpl, Item) {
  var evetMap = [
    {
      'el': '.addItem',
      'type': 'click',
      'handel': 'add'
    }
  ]
  var HostPageView = function(option) {
    RootView.call(this, option)
  };
  HostPageView.prototype = Object.create(RootView.prototype);
  HostPageView.prototype.constructor = HostPageView;
  HostPageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
    this.items = {};
  },
  HostPageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  HostPageView.prototype.afterRender = function() {
    this.initPage();
  },
  HostPageView.prototype.initPage = function() {
    var self = this;
    var dims = this.option.state.dims;
    console.log("HostPageView DIM ", dims);
    //  this.add()
    var xAxisDataSource = dims;
    this.xAxis = util.combobox(this.$el.find('.xAxis'), xAxisDataSource);
    this.xAxis.combobox('value', xAxisDataSource[0].value)
    this.xAxis.combobox('option', 'equalWidth', true);

    var order1Source = [
      {
        name: "NONE",
        value: "01"
      }, {
        name: "按维度排序",
        value: "02"
      }, {
        name: "按指标排序",
        value: "03"
      }
    ]
    var order3Source = [
      {
        name: "ASC",
        value: 'asc'
      }, {
        name: "Desc",
        value: 'desc'
      }
    ]

    this.order1 = util.combobox(this.$el.find('.order1'), order1Source);
    this.order2 = util.combobox(this.$el.find('.order2'), []);
    this.order2.on('combobox:change', function() {
      var value = self.order2.combobox('value');
      if (value) {
        self.order2Value = value
      }

    })
    this.order3 = util.combobox(this.$el.find('.order3'), order3Source);
    this.order1.on('combobox:change', function() {
      var val = self.order1.combobox('value');
      if (val == "01") {
        self.$el.find('.order2Div').hide();
        self.$el.find('.order3Div').hide();
      }
      if (val == '02') {
        self.$el.find('.order2Div').hide();
        self.$el.find('.order3Div').show();
      }
      if (val == "03") {
        self.$el.find('.order2Div').show();
        self.$el.find('.order3Div').show();
        self.order2Top();
      }
    });
    this.order1.combobox('value', order1Source[0].value);
    this.order3.combobox('value', order3Source[0].value);

    this.loadDatas();

  }
  HostPageView.prototype.order2Top = function() {
    var self = this;
    var order2Source = fish.map(this.items, function(d) {
      var json = d.getJson();
      return {'name': json.name, 'value': json.value}
    })
    var uniques = fish.map(fish.groupBy(order2Source, function(doc) {
      return doc.value;
    }), function(grouped) {
      return grouped[0];
    });
    this.order2.combobox({'dataSource': uniques});
    var defaultValue = self.order2Value;
    if (order2Source[0]) {
      defaultValue = order2Source[0].value;
    }
    this.order2.combobox('value', self.order2Value || defaultValue);
  }
  HostPageView.prototype.loadDatas = function() {
    var self = this;
    var config = this.option.state.config || {}
    if (config.hostPage) {
      var hostPageConfig = config.hostPage;
      if (hostPageConfig.selItems.length > 0) {
        fish.each(hostPageConfig.selItems, function(d) {
          self.addItem(d);
        })
      }
      if (hostPageConfig.xAxis) {
        self.xAxis.combobox('value', hostPageConfig.xAxis);
      }
      if (hostPageConfig.topNum) {
        this.$el.find('.topNum').val(hostPageConfig.topNum)
      }

      if (hostPageConfig.order1) {
        this.order1.combobox('value', hostPageConfig.order1);
      }
      if (hostPageConfig.order3) {
        this.order3.combobox('value', hostPageConfig.order3);
      }
      if (hostPageConfig.order2) {
        this.order2.combobox('value', hostPageConfig.order2);
      }

    }
  }
  HostPageView.prototype.getJson = function() {
    var json = {};
    json.selItems = [];
    fish.each(this.items, function(d) {
      json.selItems.push(d.getJson())
    })
    var xAxisData= this.xAxis.combobox("getSelectedItem")
    json.xAxis = this.xAxis.combobox('value');
    json.xAxisName=xAxisData.name;
    json.topNum = this.$el.find('.topNum').val();
    json.order1 = this.order1.combobox('value');
    json.order2 = this.order2Value;
    json.order3 = this.order3.combobox('value');

    return json;
  }
  HostPageView.prototype.addItem = function(d) {
    var self = this;
    var items = this.option.state.items;
    var id = fish.getUUID();
    var item = new Item({el: this.$el.find('.itemBody'), "items": items, "d": d, 'id': id, 'parent': self});
    item.render();
    this.items[id] = item;
    console.log("ITEMS ITEMS:", this.items)

  }
  HostPageView.prototype.add = function() {
    this.addItem();
    this.order2Top();
  }
  HostPageView.prototype.delItem = function(id) {
    delete this.items[id]
    console.log("ITEMS ITEMS:", this.items)
    this.order2Top();
  }

  HostPageView.prototype.itemChange = function(id) {
    this.order2Top();
  }

  return HostPageView;
});
