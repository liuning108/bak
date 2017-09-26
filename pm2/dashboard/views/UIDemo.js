define([

  "text!oss_core/pm/dashboard/templates/UIDemo.html",
  "oss_core/pm/dashboard/js/sliderPlug/SliderPlug",
  "oss_core/pm/dashboard/js/echarts",
  "css!oss_core/pm/dashboard/css/dashboard.css",

], function(tpl, SliderPlug,echarts) {

  return portal.BaseView.extend({
    template: fish.compile(tpl),
    initialize: function() {
      var self = this;
    },
    render: function() {
      this.$el.html(this.template());
      return this;

    },



    afterRender: function(data) {
      $('.TreeWIN').on('click',function() {
           portal.require(["oss_core/pm/report/health/assets/treeWinPlug/TreePlug"],function(treePlug){
             treePlug.popup({
                'width':800,
                'height':500
             })
           })
      })
      var datas = [
        "30m",
        "1H",
        "6H",
        "12H",
        "14D",
        "3D",
        "7D",
        "14D",
        "1M",
        "2M",
        "3M"
      ]
      var slider = new SliderPlug({
        'el': $('#sliderWin'),
        'datas': datas
      }).render();

      slider.setValue("1H");
      $('#currentValue').click(function() {
        alert(slider.getValue())
      })

      // 基于准备好的dom，初始化echarts实例
      $('.tip').draggable({containment: ".demoUI"});
      $('.closeButton2').on('click',function(){
        $('.tip').hide()
      })
      var myChart = echarts.init(document.getElementById('main'));
      var dataBySeries = [
        [5, 20, 36, 10, 10, 20]
      ]
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'line',
          data: dataBySeries[0]
        }],
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: false,
              title: 'DataView',
              lang: ['DataView', 'Close', 'Refresh']
            },
            saveAsImage: {
              show: true,
              title: 'SaveAsImage'
            },
            brush: {
              type: ['rect']
            }
          }
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1
          }
        },

      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.on('brushSelected', renderBrushed);
      function renderBrushed(params) {
        console.log(params)
        var brushComponent = params.batch[0];

        var sum = 0; // 统计选中项的数据值的和

        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          // 对于每个 series：
          var dataIndices = brushComponent.selected[sIdx].dataIndex;

          for (var i = 0; i < dataIndices.length; i++) {
            var dataIndex = dataIndices[i];
            sum += dataBySeries[sIdx][dataIndex];
          }
        }
        $('.TipMessage').text(sum);
        if(sum>0){
        $('.tip').show();
        }
        console.log(sum); // 用某种方式输出统计值。

      }
      return this;
    },


  });
});
