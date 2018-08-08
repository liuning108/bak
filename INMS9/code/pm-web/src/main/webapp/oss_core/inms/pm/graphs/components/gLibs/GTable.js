define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GTable = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GTable.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GTable.prototype.remove = function() {
    this.$el.html("");
  }
  GTable.prototype.getNotTimeResult = function(config) {
    var result = {}
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });
    if (config.xAxisFlag == 'P') {
      var colModel = fish.map(selItems, function(d) {
        var name = d.type;
        var lable = d.name + "(" + d.type + ")"
        return {'name': name, 'label': lable, sortable: false}
      })
      var header = [
        {
          'name': 'xName',
          'label': '临测点',
          sortable: false
        }
      ]
      result.colModel = header.concat(colModel);
      result.datas = config.data;
    } else {
      var colModel = [
        {
          'name': "name",
          'label': "Name",
          sortable: false
        }, {
          'name': "value",
          'label': "value",
          sortable: false
        }
      ]

      result.colModel = colModel;
      result.datas = fish.map(config.data,function(d){
         return {
            'name':d.xName,
            'value':d[d.type]
         }
      })
    }

    console.log("find result", result);
    return result;
  }
  GTable.prototype.createResult = function(config) {
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    var aggItems = fish.filter(selItems, function(d) {
      return d.type != 'all'
    })
    var datas = fish.map(config.data, function(d) {

      d.xName =  util.timetrans(Number(d.xName));
      fish.each(aggItems, function(dd) {
        d[dd.value + "_" + dd.type] = config.aggr[dd.value][dd.type];
      })
      return d;
    })

    var colModel = fish.map(selItems, function(d) {
      var name = d.value;
      var lable = d.name;
      if (d.type != 'all') {
        name = name + "_" + d.type;
        lable = lable + "(" + d.type + ")"
      }
      return {'name': name, 'label': lable, sortable: false}
    })
    console.log("Datas", datas);
    console.log("colModel", colModel);
    var header = [
      {
        'name': 'xName',
        'label': '日期',
        sortable: false
      }
    ]
    result.colModel = header.concat(colModel);
    result.datas = datas;
    return result;
  }
  GTable.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    this.$el.append("<div class='gtable_gird'></div>");
    // Set data
    var mydata = [
      {
        id: "0.1",
        invdate: "2010-05-24",
        name: "test",
        note: "note",
        tax: "10.00",
        total: "2111.00"
      }
    ];
    var colModel = result.colModel;
    var $gird = this.$el.find('.gtable_gird').grid({
      data: result.datas,
      height: 'auto',
      "colModel": result.colModel,
      rowNum: 20,
      rowList: [
        10, 20, 30
      ],
      pager: true
    });

    fish.each(colModel, function(d) {
      $gird.grid("setLabel", d.name, d.label, {
        "background-color": "#2351C5",
        "color": "#fff"
      });
    })

  }
  return GTable
});
