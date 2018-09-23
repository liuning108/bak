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

    var option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}"
      },
      series: [
        {
          name: '',
          type: 'gauge',
          detail: {
            formatter: '{value}'
          },
          data: result.data
        }
      ]
    };
    myChart.setOption(option);
  }
  return GGauge
});
