define([
  'text!oss_core/pm/quality/templates/TrandChartViewDialog.html', "oss_core/pm/quality/views/echarts.min"
], function(tpl, echarts) {
  var TrandChartViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  TrandChartViewDialog.prototype.content = function(props) {
    var name1 = props.btnsName[0]
    var name2 = props.btnsName[1]

    this.$el = $(this.tpl({title: props.title,
                           'name1':name1,
                           'name2':name2}))
    return this.$el;
  }
  TrandChartViewDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(props),
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  TrandChartViewDialog.prototype.afterPopup = function() {
    console.log("TrandChartViewDialog", this.props.datas)
    var self =this;
    this.chart = echarts.init(this.$el.find('.listCharts')[0]);
    this.$el.find('.type1').off('click').on('click', function() {
      self.setCss('.type1');
      self.handleType(self.props.top1);
    })
    this.$el.find('.type2').off('click').on('click', function() {
        self.setCss('.type2');
      self.handleType(self.props.top2);
    })
      self.setCss('.type1');
    this.handleType(self.props.top1);
  }
  TrandChartViewDialog.prototype.setCss=function(type){
    this.$el.find('.qTypeActive').removeClass('qTypeActive');
    this.$el.find(type).addClass('qTypeActive');
  }
  TrandChartViewDialog.prototype.handleType= function(top,byName){
    var byName =this.props.top3;
    var sortByDatas = fish.sortBy(this.props.datas,"STTIME");
    var grouByDatas = fish.groupBy(sortByDatas,byName);
    var grouByTime = fish.groupBy(sortByDatas,"STTIME");
    var legendData =fish.keys(grouByDatas);
    var timesData =fish.keys(grouByTime);
    timesData =  fish.map(timesData,function(d){
      var TTIME=fish.dateutil.format(new Date(d), 'mm-dd');
        return TTIME;
    });
    console.log('timesData',timesData)
    var seriesDatas = fish.map(legendData,function(name){
         var item = {};
         item.name =name;
         item.type ='line';
         item.stack='总量';
         item.areaStyle={};
         var datas =  grouByDatas[name];
         datas =fish.map(datas,function(d){
           return Number(d[top])
         })
         item.data=datas;
         return item;
    })
    this.initChart(legendData,seriesDatas,timesData)
  }


  TrandChartViewDialog.prototype.initChart = function(legendData,seriesDatas,timesData) {
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data:legendData
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: timesData
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesDatas
    };
    this.chart.setOption(option);

  }

  return TrandChartViewDialog;
})
