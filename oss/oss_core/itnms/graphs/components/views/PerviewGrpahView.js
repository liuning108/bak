define([
  "oss_core/itnms/graphs/utils/echarts.js", "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js", "text!oss_core/itnms/graphs/components/views/PerviewGrpahView.html"
], function(echarts, RootView, util, tpl) {
  var evetMap = [
    {
      'el': '.callback',
      'type': 'click',
      'handel': 'callback'
    }
  ]
  var PerviewGrpahView = function(option) {
    RootView.call(this, option)
  }
  PerviewGrpahView.prototype = Object.create(RootView.prototype);
  PerviewGrpahView.prototype.constructor = PerviewGrpahView;
  PerviewGrpahView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  PerviewGrpahView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  PerviewGrpahView.prototype.afterRender = function() {
    var myChart = echarts.init(this.$el.find('.graphsShow')[0]);
    var tom = new Date();
    tom.setTime(tom.getTime() + 24 * 60 * 60 * 1000);
    var active_since = (new Date().getTime() / 1000);
    var active_till = (tom.getTime() / 1000);
    var spaceTime = (active_till - active_since) / 15
    option = {
      title: {
        text: '双数值轴折线',
        subtext: '纯属虚构'
      },
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
        // formatter : function (params) {
        //     return params.seriesName + ' : [ '
        //           + params.value[0] + ', '
        //           + params.value[1] + ' ]';
        // }
      },
      legend: {
        data: ['数据1', '数据2']
      },
      toolbox: {
        show: true,
        feature: {

          dataZoom: {
            show: true
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          min: active_since,
          max: active_till,
          splitNumber: 15,
          grid:{
             y2:140
          },
          axisLabel: {
            fontSize:10,
            interval:0,
            lineHeight:300,
            margin:10,
            rotate: -30,
            formatter: function(params) {
              return util.timetrans(Number(params));
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {

          }
        }
      ],
      series: [
        {
          name: '数据1',
          type: 'line',
          data: [
            [
              active_since, 2
            ],
            [
              active_till, 8
            ]
          ],

        }, {
          name: '数据2',
          type: 'line',
          data: [
            [
              active_since, 2
            ],

            [
              active_till, 10
            ]
          ]
        }
      ]
    };

    myChart.setOption(option);

  },
  PerviewGrpahView.prototype.callback = function() {
    util.doNotNull(this.option.callback);
  }

  return PerviewGrpahView;
});
