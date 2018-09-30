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
    console.log("GPIE",config);
    var result = {
      legend:[],
      datas:[]
    };
    var hostPage =config.tabsConfig.hostPage;
    var selItems = hostPage.selItems;
    var kpiDatas  =config.kpiDatas.result;
    if(selItems.length==1){
      var firstItem = selItems[0];
       result.legend=fish.pluck(kpiDatas,hostPage.xAxis);
      var groupByDatas = fish.groupBy(kpiDatas,hostPage.xAxis);
       console.log("groupByDatas", groupByDatas);
       result.datas = fish.map(result.legend, function(d) {
         var itemDatas = groupByDatas[d];
         return {
           "name":d,
           "value": fish.pluck(itemDatas,firstItem.value)[0]||0
         }
       })
       return result;
    }
    if(selItems.length>1){
      result.color = fish.map(selItems,function(d){
         return d.color;
      })
      result.legend = fish.map(selItems,function(d){
         return d.name;
      })
      result.datas =  fish.map(selItems,function(d){
          var datas =fish.pluck(kpiDatas,d.value)
          var sum = fish.reduce(datas, function(memo, num){ return memo + num; }, 0);
         return {
            "name":d.name,
            "value":sum
         }
      })

    }
    return result;




  }
  GLine.prototype.resize=function(){
      this.myChart.resize();
  }
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    this.myChart =myChart;
    var lengedConfig =config.tabsConfig.lengedPage||{};
    var legnedConfig  = util.getLegned(lengedConfig);
    if(legnedConfig.open){
      legnedConfig.data=result.legend
    }else{
      legnedConfig=null;
    }
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: legnedConfig,
      series: [
        {
          color:result.color,
          type: 'pie',
          label: {
                    normal: {
                        show: false,
                    },

                },
          radius: [
            '50%', '70%'
          ],
          center: [
            '50%', '50%'
          ],
          selectedMode: 'single',
          data: result.datas,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
  return GLine
});
