define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GLine = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GLine.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GLine.prototype.remove = function() {
    this.$el.html("");
  }
  GLine.prototype.createResult = function(config) {
    var result = {};
    console.log("GLINE",config);
    var hostPage =config.tabsConfig.hostPage;
    var lengedPage=config.tabsConfig.lengedPage;
    var selItems = hostPage.selItems
    var kpiDatas = config.kpiDatas.result;
    var lengedConfig =lengedPage||{};
    var lengedConfig = util.getLegned(lengedConfig);
    if (lengedConfig.open) {
      result.legend = fish.map(selItems,function(d){
           return {
             'name':d.name
           }
      });
      lengedConfig.data=result.legend;
    } else {
      lengedConfig = null;
    }
    result.lengedConfig=lengedConfig;

    result.xAxis = [
      {
        type: 'category',
        data:fish.pluck(kpiDatas,hostPage.xAxis),
      }
    ]
    result.series = fish.map(selItems, function(d) {
      var result = {
        name: d.name,
        type: 'line',
        data: fish.pluck(kpiDatas,d.value),
        mydata:d,
      }
      result.color = d.color
      return result
    })
    return result;
  }
  GLine.prototype.getMaxMin = function(config) {
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
  GLine.prototype.resize=function(){
      this.myChart.resize();
  }
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    this.myChart =myChart;


    seriersResult=result.series
    var propPageConfig = config.tabsConfig.propPage || {};
    propPageConfig = util.getPropPage(propPageConfig)
    if (propPageConfig.showlable == 'o') {
      var seriersResult = fish.map(seriersResult, function(d) {
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
    var axisLabel = util.getAxisLabel(config.tabsConfig);
    var grid_y =util.getGridY(result.lengedConfig);
    var gridConfig =null;
    if(axisLabel.h){
       gridConfig={
          y:grid_y,
          y2:axisLabel.h
       }
    }else{
      gridConfig={
         y:grid_y
      }
    }
    result.xAxis[0].axisLabel= {
      fontSize: 10,
      interval: axisLabel.i,
      margin: 10,
      rotate: axisLabel.r,
    }
    var MaxMin=this.getMaxMin(config.tabsConfig);
    seriersResult  = util.makeLine(seriersResult,config.tabsConfig);
    option = {
        grid:gridConfig,
        dataZoom: propPageConfig.dataZoom,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          },
        },
        xAxis: result.xAxis,
        legend: result.lengedConfig,
        yAxis: {
            type: 'value',
            name: MaxMin.name,
            min: MaxMin.min,
            max: MaxMin.max
        },
        series: seriersResult
    };
    console.log("GLINE seriersResult",option);
    myChart.setOption(option);
  }
  return GLine
});
