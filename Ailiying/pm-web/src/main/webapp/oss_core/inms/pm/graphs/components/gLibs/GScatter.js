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
    var self = this;
    var result = {}
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });
    if (config.xAxisFlag == 'P') {
      var datas = config.data;
      result.legendDatas = fish.pluck(datas, "xName");
      result.series = fish.map(datas, function(d) {
        console.log("999999999", selItems, datas)
        var f = selItems[0];
        var s = selItems[1];
        var f_id = self.getItemId(f);
        console.log(f_id, d)
        var f_value = d[f_id];
        var s_value = f_value
        if (s) {

          var s_id = self.getItemId(s);

          s_value = d[s_id];

        }
        return {
          symbolSize: 10,
          type: 'scatter',
          name: d.xName,
          data: [
            [f_value, s_value]
          ]
        }
      });

    } else {
      var datas = config.data;
      result.legendDatas = fish.pluck(datas, "xName");
      result.series = fish.map(datas, function(d) {

        var value = d[d.type];
        return {
          symbolSize: 10,
          type: 'scatter',
          name: d.xName,
          data: [
            [value, value]
          ]
        }
      });
    }

    console.log("find result", result);
    return result;
  }
  GScatter.prototype.getMaxMin = function(config) {
    console.log("getMaxMin", config);
    var MaxMin = {
      name: '',
      min: function(value) {
        if (value.min == 0) {
          return 0;
        }
        var min = parseInt(value.min - (value.min * 0.1));
        if (min > 0 || min == 0) {
          return min;
        } else {
          return value.min;
        }
      },
      max: null
    }
    var axisPage = config.aixsPage || {};
    var y1 = axisPage.y1 || 'c';
    var y1Name = axisPage.y1Name || '';
    var y1Min = axisPage.y1Min || 'a';
    var y1Max = axisPage.y1Max || 'a';
    if (y1 == 'o') {
      MaxMin.name = y1Name;
      var min = Number(y1Min);
      var max = Number(y1Max);
      if (!fish.isNaN(min)) {
        MaxMin.min = min;
      }
      if (!fish.isNaN(max)) {
        MaxMin.max = max;
      }
    }
    return MaxMin;
  }
  GScatter.prototype.createResult = function(config) {
    var self = this;
    var result = {};
    var selItems = config.tabsConfig.hostPage.selItems
    var xAxis = config.tabsConfig.hostPage.xAxis;

    var datas  = config.kpiDatas.result;
    console.log("createResultcreateResult", datas);
    result.legendDatas = fish.pluck(datas, xAxis);
    result.legendDatas = fish.map(result.legendDatas,function(d){
       return ""+d;
    })
    console.log("result.legendDatas", result.legendDatas);
    console.log('Top selItems', selItems)

    var xName =selItems[0].value;
    var yName =selItems[0].value;
    if(selItems.length>1){
       var yName =selItems[1].value;
    }
    var datas =fish.groupBy(datas,xAxis);
    result.series = fish.map(result.legendDatas,function(d){
        var t =datas[d];
        xValue = fish.pluck(t,xName)[0]||0;
        yValue = fish.pluck(t,yName)[0]||0;
       return {
           'name':d,
            symbolSize: 10,
            data:[xValue,yValue],
            type: 'scatter',
       }
    })



    console.log('Top series', result.series)
    return result;
  }
  GScatter.prototype.getItemId = function(f) {
    var id = f.value;
    return id;
  }
  GScatter.prototype.resize=function(){
      this.myChart.resize();
  }
  GScatter.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    this.myChart=myChart;
    var MaxMin = this.getMaxMin(config.tabsConfig);
    var lengedConfig = config.tabsConfig.lengedPage || {};
    var legnedConfig = util.getLegned(lengedConfig);
    if (legnedConfig.open) {
      legnedConfig.data = result.legendDatas
    } else {
      legnedConfig = null;
    }
    var propPageConfig = config.tabsConfig.propPage || {};
    propPageConfig = util.getPropPage(propPageConfig)

    seriersResult = result.series
    if (propPageConfig.showlable == 'o') {
      var seriersResult = fish.map(result.series, function(d) {
        d.itemStyle = {
          normal: {
            label: {
              show: true
            }
          }
        };
        return d;
      });
    }
    var option = {
      grid:{
        y: 10
      },
      dataZoom: propPageConfig.dataZoom,
      tooltip: {
        trigger: 'axis',
        showDelay: 0,
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        }
      },
      xAxis: {},
      yAxis: {
        name: MaxMin.name,
        min: MaxMin.min,
        max: MaxMin.max
      },
      legend: legnedConfig,
      series: seriersResult
    };

    myChart.setOption(option);
  }
  return GScatter;
});
