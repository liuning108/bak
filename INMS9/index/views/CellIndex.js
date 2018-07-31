/**
oss_core/pm/badqualitycell/index/views/CellIndex.js
**/
portal.define([
  "oss_core/pm/badqualitycell/index/actions/Action",
  "oss_core/pm/badqualitycell/index/views/echarts.min",
  "oss_core/pm/badqualitycell/index/views/dataTool",
  'text!oss_core/pm/badqualitycell/index/templates/cellindex.html',
  "oss_core/pm/badqualitycell/index/views/CellPanel",
  "oss_core/pm/badqualitycell/index/actions/DB",
  "oss_core/pm/badqualitycell/index/actions/DB1",
  'text!oss_core/pm/badqualitycell/index/templates/cellTopNItem.html',
  'css!oss_core/pm/badqualitycell/index/css/badqualitycell.css'
], function(action, echarts, dataTool, tpl, CellPanel, DB, DB2, cellTopNItemTpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    cellTopTpl: fish.compile(cellTopNItemTpl),
    i18nData: fish.extend({}),
    events: {},
    initialize: function(options) {},
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    indexCSS: function() {
      this.$el.parent().css({'background': '#f3f3f3'})
      this.$el.parent().parent().find('.panel-heading').remove();

    },
    changeDate: function(time) {
      var self = this;
      this.loadData(time, function(datas) {
        self.initPanels(datas);
        //	self.allPanels(datas);
        self.pieChart(datas);
      	self.lineChart(datas);
        self.topList(datas);
      });
    },
    afterRender: function() {
      var self = this;
      this.indexCSS();
      this.initDate();
    },
    loadData: function(time, fun) {
      var datas = {
        "time": time
      };
      action.getCellAreaInfo(time).then(function(data) {
        datas['initPanels'] = data.result;
        return action.getCellAllInfo(time)
      }).then(function(data2) {
        datas['allPanels'] = data2.result;
        console.log("getCellAllInfo", data2.result);
        return action.getTopCellInfo(time)
      }).then(function(data3) {
        datas['topList'] = data3.result
        fun(datas);
      })

    },
    topList: function(datas) {
      var result = datas['topList']
      var time = datas['time'];
      console.log("topList", result);
      var topListResult = fish.map(result, function(d, i) {
        return {
          'value': Number(d.VALUE),
          'i': i + 1,
          'cellID': d.ID,
          'title': d.NAME.trim(),
          'label': Number(d.VALUE).toFixed(2).replace(/[.]?0+$/, "")
        }
      })

      var self = this;
      this.$el.find('.topListTitle').text(DB2.topTitle);
      var context = this.$el.find('.TOPN')
      context.html("")
      this.$el.find('.pagination-List').pagination('destroy')
      this.$el.find('.pagination-List').pagination({
        records: topListResult.length,
        pgTotal: false,
        pgInput: false,
        rowList: [],
        rowNum: 28,
        onPageClick: function(e, eventData) {
          self.pageClick(eventData.page, topListResult, context, time);
        },
        create: function() {
          self.pageClick(1, topListResult, context, time);
        }
      });

      // context.slimscroll({
      // 	height: '390px',   取其父元素高度作为滚动高度；默认为250px
      // });
      //
      // fish.each(topListResult,function(d){
      // 	 var per = d.value/100;
      // 	 d.size =50+ 100*per;
      // 	 var green="#5cb85c";
      // 	 var blue="#64d1f1";
      // 	 var red ="#d75452";
      // 	 var color =green;
      // 	 if(d.value>=60 && d.value<=80){
      // 		 color=blue;
      // 	 }
      // 	 if(d.value<60){
      // 		 color=red;
      // 	 }
      // 	 d.color=color;
      // 	context.append(self.cellTopTpl(d));
      //
      // })

    },
    pageClick: function(page, topListResult, context, time) {
      context.html("");
      var self = this;
      var rowNum = 28;
      var start = (page - 1) * rowNum;
      var end = page * rowNum;
      var perData = $.extend(true, [], topListResult.slice(start, end))
      console.log("pageClick");
      console.log(page, perData);
      fish.each(perData, function(d) {
        var per = d.value / 100;
        d.size = 50 + 100 * per;
        var green = "#5cb85c";
        var blue = "#F5A123";
        var red = "#d75452";
        var color = green;
        if (d.value >= 60 && d.value <= 80) {
          color = blue;
        }
        if (d.value < 60) {
          color = red;
        }
        d.color = color;
        context.append(self.cellTopTpl(d));

      })
      var allItems = {};
      self.$el.find('.NumTopN').on('click', function() {
        var cellId = $(this).data('id');
        var title = $(this).data('title');
        var prop = allItems[cellId] || {
          $tpl: null
        };

        if (prop.$tpl === null) {
          prop.id = fish.getUUID();
          prop.$tpl = $("<div class='container-fluid'>").data({menuId: false, menuUrl: '', privCode: '', menuName: '', menuType: ''}).attr({menuId: false, menuUrl: null});
        }
        $("#divContent").tabs("option", "panelTemplate", prop.$tpl).tabs("add", {
          active: true,
          id: prop.id,
          label: title + "质差详情"
        });
        allItems[cellId] = prop;
        require(["oss_core/pm/badqualitycell/detail/views/BadQualityCellDetail"], function(Dialog) {
          var sData = {
            el: prop.$tpl,
            "VILLAGEKEY": cellId,
            "STTIME": time + '-01 00:00:00'
          };
          var dialog = new Dialog(sData);
          var content = dialog.render();
        });
      })
    },
    lineChart: function(datas) {
      var result = datas['allPanels']
			var value =0;
			if(result.length>0){
			   value =result[result.length-1].VALUE;
			 }
      this.$el.find('.lineTitle').text("全网质差小区数:"+value);
      this.chart = echarts.init(this.$el.find('.linechart')[0]);
      var legendNames = fish.map(result, function(d) {
        return d.TIME
      });
      var valeusData = fish.map(result, function(d) {
        return Number(d.VALUE)
      });
      console.log(legendNames);
      var minNum = fish.min(valeusData);
      if (minNum > 0) {
        minNum = parseInt(minNum - (minNum * 0.05));
      }

      var series = fish.map([
        {
          'datas': result
        }
      ], function(d) {
        return {
          name: "质差数",
          type: 'line',
          data: valeusData,
					symbolSize: 10,
          itemStyle: {
            normal: {
              color: "#5d9ae0",
              lineStyle: {
                color: "#5d9ae0"
              },
							areaStyle: {
									type: 'default',
									color: '#eaf4ff'
							}
            }
          }
        }
      });
      var option = {
        grid: {
          left: '1%',
          right: '4%',
          top: '2%',
          bottom: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          top: 2,
          data: legendNames
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: legendNames,
          axisLabel: {
            interval: 0,
            rotate: 0,
            margin: 10,
            textStyle: {
              color: "#222"
            }
          }
        },
        yAxis: {
          type: 'value',
          min: minNum
        },
        colors: [
          '#e54d43', '#39ca74', '#3a99d8'
        ],
        "series": series
      };
      console.log(series);
      this.chart.setOption(option)
    },
    pieChart: function(datas) {
      var self = this;
      var metaData = datas['initPanels'];
      var time = datas['time'];

      var result = fish.map(metaData, function(d, i) {
        return self.toPanelData(d, time, i)
      })

      console.log("pieChart", result);
      this.$el.find('.pieTitle').text(DB2.pieChart.title);
      this.chart = echarts.init(this.$el.find('.piechart')[0]);
      var legendNames = fish.map(result, function(d) {
        return {name: d.title, icon: 'circle'}
      });
      var valuesData = fish.map(result, function(d) {
        return {
          name: d.title,
          value: Number(d.value)
        }
      });
      var option = {
        grid: {
          left: '20%',
          right: '4%',
          top: '2%',
          bottom: '25%'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 20,
          top: 20,
          bottom: 20,
          data: legendNames
        },
        color: DB2.pieChart.colors,
        series: [
          {
            name: '',
            type: 'pie',
            radius: [
              '50%', '70%'
            ],
            center: [
              '30%', '45%'
            ],
						avoidLabelOverlap: false,
            data: valuesData,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
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
      this.chart.setOption(option)

    },
    format_number: function(n) {
      var b = parseInt(n).toString();
      var len = b.length;
      if (len <= 3) {
        return b;
      }
      var r = len % 3;
      return r > 0
        ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",")
        : b.slice(r, len).match(/\d{3}/g).join(",");

    },
    toPanelData: function(d, time, i) {
      var colors = [
        {
          areaStyle: "#f2faea",
          lineColor: "#83cf42"
        }, {
          areaStyle: "#edfcf8",
          lineColor: "#5fe1c2"
        }, {
          areaStyle: "#f3e7fc",
          lineColor: "#8e3af6"
        }, {
          areaStyle: "#f8e7fa",
          lineColor: "#b934da"
        }, {
          areaStyle: "#fef0ea",
          lineColor: "#f16c3b"
        }, {
          areaStyle: "#fef6eb",
          lineColor: "#f1a443"
        },
        //
        {
          areaStyle: "#ecf1e6",
          lineColor: "#44731d"
        }, {
          areaStyle: "#e6f9ea",
          lineColor: "#2fc345"
        }, {
          areaStyle: "#ebeffd",
          lineColor: "#426cf7"
        }, {
          areaStyle: "#ebf8ff",
          lineColor: "#4bbbf9"
        }, {
          areaStyle: "#fae6f2",
          lineColor: "#d12282"
        }, {
          areaStyle: "#fef1f9",
          lineColor: "#f880c7"
        }
      ]
      var color = colors[i];

      var values = fish.map(fish.pluck(d.DATAS, 'VALUE'), function(v) {
        return Number(v);
      });
      if (values.length <= 0) {
        values = [0, 0];
      }

      if (values.length == 1) {
        values = [
          0, values[0]
        ];
      }

      var curValue = fish.find(d.DATAS, function(d, i) {
        d.POS = i;
        return d.TIME == time;
      })
      var curPos = null;
      var showValue = '0'
      if (curValue) {
        showValue = Number(curValue.VALUE)
      } else {
        curValue = {
          "VALUE": 0,
          POS: d.DATAS.length
        };
      }
      var per = "0%";
      var dir = "";

      var up = d.DATAS[curValue.POS - 1]
      if (!up) {
        if (curValue.VALUE == 0) {
          per = "0%";
          dir = "";
        } else {
          per = "100%";
          dir = "up";
        }

      } else {
        var dirValue = (curValue.VALUE - up.VALUE)
        console.log("dirValue", dirValue);
        if (dirValue > 0) {
          dir = "up"
        } else if (dirValue < 0) {
          dir = "down"
        }
        per = (dirValue / up.VALUE) * 100
        console.log(per);
        per = per.toFixed(2).replace(/[.]?0+$/, "") + "%";
      }

      //（本月-上月）/上月

      return {
        'title': d.NAME,
        'value': this.format_number(showValue),
        'per': per,
        'perTitle': '前 30 天',
        'dir': dir,
        'areaID': d.CITYKEY,
        data: values,
        STTIME: time + "-01 00:00:00",
        'c': color
      }
    },
    initPanels: function(datas) {
      var self = this;
      var metaData = datas['initPanels'];
      var time = datas['time'];

      var result = fish.map(metaData, function(d, i) {
        return self.toPanelData(d, time, i)
      })
      console.log(result, time)
      var $parent = this.$el.find('.initPanelsContext');
      $parent.html("");
      fish.forEach(result, function(d) {
        var $tpl = $('<div class="col-md-6"></div>');
        var item = new CellPanel({el: $tpl, db: d})
        $tpl.appendTo($parent)
        item.render();
      })
    },
    allPanels: function(datas) {
      var self = this;
      var time = datas['time'];
      var metaDatas = datas['allPanels'];
      var d = {
        "NAME": '全网质差小区数',
        DATAS: metaDatas,
        CITYKEY: "ALL"
      }
      var result = self.toPanelData(d, time)
      console.log("allPanels", datas);
      this.all = new CellPanel({el: this.$el.find('.all'), db: result, 'blueStyle': true})
      this.all.render();
    },
    initDate: function() {
      var self = this;
      this.cdate = this.$el.find('.netChooseDate').datetimepicker({
        buttonIcon: '',
        viewType: "month",
        changeDate: function(e, value) {
          var $this = $(this);
          $this.find('.timeShow').text($this.val());
          self.changeDate($this.val());
        }
      });
      var date = new Date();
      this.cdate.datetimepicker("value", date);
    }
  });
});
