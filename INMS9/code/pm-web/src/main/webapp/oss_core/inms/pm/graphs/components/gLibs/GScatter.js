define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GScatter = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GScatter.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GScatter.prototype.remove = function() {
    this.$el.html("");
  }
  GScatter.prototype.getNotTimeResult = function(config) {
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
      result.datas = fish.map(config.data, function(d) {
        return {
          'name': d.xName,
          'value': d[d.type]
        }
      })
    }

    console.log("find result", result);
    return result;
  }
  GScatter.prototype.createResult = function(config) {
    var self =this;
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    var aggItems = fish.filter(selItems, function(d) {
      return d.type != 'all'
    })
    var datas = fish.map(config.data, function(d) {
      d.xName = util.timetrans(Number(d.xName));
      fish.each(aggItems, function(dd) {
        d[dd.value + "_" + dd.type] = config.aggr[dd.value][dd.type];
      })
      return d;
    })
    console.log("createResultcreateResult",datas);
    result.legendDatas  = fish.pluck(datas,"xName");
    console.log("result.legendDatas",result.legendDatas);
    console.log('Top selItems',selItems)
    result.series =fish.map(datas,function(d){
          var f=selItems[0];
          var s=selItems[1];

          var f_id = self.getItemId(f);
            console.log(f_id,d)
          var f_value=d[f_id];
          var s_value=f_value
          if(s){
            var s_id = self.getItemId(f);
            s_value=d[s_id];
          }

          return {
            symbolSize: 10,
            type: 'scatter',
            name: d.xName,
            data:[[f_value,s_value]],
          }
    });
  console.log('Top series',result.series )
    return result;
  }
  GScatter.prototype.getItemId=function(f){
    var id = f.value;
    if(f.type!='all'){
      id = id+"_"+f.type
    }
    return id;
  }
  GScatter.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var option = {
      tooltip : {
                    trigger: 'axis',
                    showDelay : 0,
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
      xAxis: {},
      yAxis: {},
      legend: {
        data: result.legendDatas
      },
      series: result.series
    };

    myChart.setOption(option);
  }
  return GScatter;
});
