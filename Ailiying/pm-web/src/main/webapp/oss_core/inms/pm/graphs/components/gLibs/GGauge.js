define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GGauge = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GGauge.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GGauge.prototype.remove = function() {
    this.$el.html("");
  }


  GGauge.prototype.createResult = function(config) {
    var result = {};
    var selItems = config.tabsConfig.hostPage.selItems
    var kpiDatas =config.kpiDatas.result;
    var lengedPage=config.tabsConfig.lengedPage;
    var lengedConfig = lengedPage||{};
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



    if(selItems.length>0){
      var first = selItems[0]
      var val =fish.pluck(kpiDatas,first.value)[0];
      if(val>0 && val<=1){
        val =val*100;
      }
      result.data=[{
        name: first.name,
        value:val
      }]
    }else{
      result.data=[{
        name:"",
        value:0,
      }]
    }
    return result;
  }
  GGauge.prototype.resize=function(){
    this.myChart.resize();
  }
  GGauge.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    this.myChart=myChart;
    console.log("result.lengedConfig222",result.lengedConfig)
    var offsetPos = util.ganugePos(result.lengedConfig);
    var option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}"
      },
      series: [
        {
          name: '',
          type: 'gauge',
          detail: {
            formatter: '{value}',
            fontWeight: 'bolder',
            offsetCenter: [0, '50%'],
            fontSize: 18,
          },
          data: result.data,
          title : {
               offsetCenter: offsetPos,
               textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                   fontWeight: 'bolder',
                   fontSize: 14,
               }
           },


        }
      ]
    };
    myChart.setOption(option);
  }
  return GGauge
});
