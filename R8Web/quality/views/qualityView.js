portal.define([
  "oss_core/pm/quality/action/action",
  "oss_core/pm/quality/views/echarts.min",
  'text!oss_core/pm/quality/templates/qualityView.html', "oss_core/pm/quality/views/TopPanel",
  "oss_core/pm/quality/views/ListPanel",
  "oss_core/pm/quality/action/DB",
   'css!oss_core/pm/quality/css/quality.css'
], function(action,echarts,tpl, TopPanel,ListPanel,DB) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    initialize: function(options) {},
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    initListPanel:function(listData){
      var d  = listData||[]
      var  listPanel = new ListPanel({
        el: this.$el.find('.listPanelContext'),
        data:d
      })
      listPanel.render();
    },
    initCDNTrendData:function(d,timeArry){
       console.log("initCDNTrendData",d)
        var keys = fish.keys(d);
        var listData = fish.map(keys,function(key,i){
          var item = {};
          item.name = key;
          var datas = d[key];
          var dd = datas[datas.length-1]||{SERVICE_SUCESS_RATE:2};
          item.value = dd.SERVICE_SUCESS_RATE;
          return item;
        });
       this.initListPanel(listData);

       // {
       //     name:'调度服务器',
       //     type:'line',
       //     stack: '总量',
       //     areaStyle: {},
       //     color:"#55bedc",
       //     data:[120, 132, 101, 134, 90, 230, 210]
       // },
       var  listColors=["#55bedc","#e1555a","#50b067","#f3ae5b"]
        var echarDatas= fish.map(keys,function(key,i){
          var  indexC = i%listColors.length;
            var item = {};
            item.name = key;
            item.type ='line';
            item.stack='总量';
            item.areaStyle={};
            item.color=listColors[indexC];
            var datas = d[key];
            console.log('echarDatas',datas)
            datas =fish.map(datas,function(d){
              return Number(d.SERVICE_SUCESS_RATE)
            })
            item.data=datas;
            return item;
        });
        console.log('echarDatas',echarDatas)
       this.listChart(keys,echarDatas,timeArry);
    },
    initCDNDetailData:function(cdnDatas){
      var mydata =cdnDatas||[];
      var opt = {
        data: mydata,
        height: '245',
        shrinkToFit:false,
	      autoScroll: true,
        colModel:  [
          {
            name: 'TTIME',
            label: "日期",
            width: 200,
            sortable: false
          }, {
            name: 'FUNCTION_NAME',
            label: "功能",
             width: 200,
            sortable: false
          }, {
            name: 'IP_ADDRESS',
            label: 'IP',
            width: 200,
            sortable: false
          },
          {
            name: 'SERVICE_TYPE',
            label: '服务器类型',
             width: 200,
            sortable: false
          },
          {
            name: 'DESCRIPTION',
            label: '描述',
             width: 200,
            sortable: false
          },
          {
            name: 'SERVICE_SUCESS_RATE',
            label: '服务成功率',
             width: 100,
            sortable: false
          },
          {
            name: 'GAIN_RATIO',
            label: '增益比',
             width: 100,
            sortable: false
          },
          {
            name: 'CPU_UTILIZATION',
            label: 'CPU利用率',
            width: 200,
            sortable: false
          }
        ]
      };
      var $grid=this.$el.find("#gridIdCND").grid(opt);
      var width =this.$el.find("#gridIdCND").parent().width();
      $grid.grid("setGridWidth", width, false);
    },
    initIDCData:function(idcDatas){
      var mydata =idcDatas||[];
      var opt = {
        data: mydata,
        height: '245',
        shrinkToFit:false,
	      autoScroll: true,
        colModel: [
          {
            name: 'ROOT_NODE',
            label: "名称",
            width: 200,
            sortable: false
          }, {
            name: 'ROOT_IP',
            label: "测试地扯",
             width: 200,
            sortable: false
          }, {
            name: 'GROUP_NAME',
            label: '分组名称',
            width: 200,
            sortable: false
          },
          {
            name: 'TARGET_IP',
            label: '目的节点',
             width: 200,
            sortable: false
          },
          {
            name: 'TARGET_NAME',
            label: '目的地扯',
             width: 200,
            sortable: false
          },
          {
            name: 'PACKET_LOSS',
            label: '丢包(%)',
             width: 100,
            sortable: false
          },
          {
            name: 'DELAY',
            label: '时延(ms)',
             width: 100,
            sortable: false
          },
          {
            name: 'TINGLE',
            label: '抖动(ms)',
            width: 100,
            sortable: false
          }
        ]
      };
      var $grid=this.$el.find("#gridIdIDC").grid(opt);
      var width =this.$el.find("#gridIdIDC").parent().width();
       $grid.grid("setGridWidth", width, false);
    },
    map:function(datas){
      var self =this;
      //地图开始
      var kpiName = "得分";
      var mapUrl = "neimenggu.json";
      self.isMapAreaName = false;
      $.getJSON("oss_core/pm/quality/views/"+mapUrl, function(data) {
        echarts.registerMap(mapUrl, data);
        self.mapDataList =datas;
        var option = {
          animation: false,
          title : {
            text: '',
            subtext: '',
            x:'center'
          },
          tooltip : {
            trigger: 'item'
          },
          legend: {
            show: false,
            orient: 'vertical',
            x:'left',
            y:'center',
            data:[kpiName]
          },
          toolbox: {
            show : false
          },
          geo: {
            map: mapUrl,
            label: {
              emphasis: {
                show: false
              }
            }
          },
          dataRange: {
            x:'5px',
            y:'5px',
            show: true,
            splitList: [
              {start: 80, color: 'green'},
              {start: 60, end: 80, color: 'yellow'},
              {end: 60, color: 'red'}
            ]
          },
          series : [
            {
              name: kpiName,
              type: 'map',
              mapType: mapUrl,
              showLegendSymbol: false,
              itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
              },
              data: self.mapDataList
            }
          ]
        };
        self.chart = echarts.init(self.$(".cellPanel4")[0]);
        self.chart.setOption(option, true);
      });
      //地图结束
    },
    listChart:function(legendData,echarDatas,timeArry){
      console.log('listChart',legendData)
      	var myChart = echarts.init(this.$el.find('.listPanelChart')[0]);
        var option = {
            tooltip : {
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
                top:'20%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : timeArry
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : echarDatas
        };
        myChart.setOption(option);

    },
    initHostDataList:function(data){
      console.log("initHostDataList",data);
      var d1 = fish.map(data.hotWebsiteDataList ,function(d,i){
              d.index=(i+1);
              d.val  = d.PBSRVWEB0001 + "%";
              d.val2  = d.PBSRVWEB0002 + "s"
              d.name = d.SITE_NAME;
              return d;
      })
      var p1= new TopPanel({
        el: this.$el.find('.p1'),
        title:DB.p1.title,
        colNames: DB.p1.colNames,
        data: d1,
        type:'HOTWEBSITE',
        btnsName:["成功率","平均时延"],
        tops:['PBSRVWEB0001',"PBSRVWEB0002","SITE_NAME"],
      })
      p1.render()
      var d2 = fish.map(data.hotVideoDataList ,function(d,i){
              d.index=(i+1);
              d.val  = d.PBSRVVDO0001 + "%";
              d.val2  = d.PBSRVVDO0002 + "s"
              d.name = d.VIDEO_NAME;
              return d;
      })
      var p2 = new TopPanel({
        el: this.$el.find('.p2'),
        title:DB.p2.title,
        colNames: DB.p2.colNames,
        data: d2,
        type:'HOTVIDEO',
        btnsName:["成功率","平均时延"],
        tops:['PBSRVVDO0001',"PBSRVVDO0002","VIDEO_NAME"],
      })
      p2.render()
     var d3 = fish.map(data.hotGameDataList ,function(d,i){
              d.index=(i+1);
              d.val  = d.PBSRVGAME001 + "%";
              d.val2  = d.PBSRVGAME002 + "s"
              d.name = d.GAME_NAME;
              return d;
      })
      var p3 = new TopPanel({
        el: this.$el.find('.p3'),
        title:DB.p3.title,
        colNames: DB.p3.colNames,
        type:'HOTGAME',
        btnsName:["成功率","平均时延"],
        tops:['PBSRVGAME001',"PBSRVGAME002","GAME_NAME"],
        data: d3

      })
      p3.render()
      var d4 = fish.map(data.hotFtpSiteDataList ,function(d,i){
              d.index=(i+1);
              d.val  = d.PBSRVFTP0001 + "%";
              d.val2  = d.PBSRVFTP0002 + "KB/s"
              d.name = d.FTPSITE_NAME;
              return d;
      })
      var p4 = new TopPanel({
        el: this.$el.find('.p4'),
        title:DB.p4.title,
        colNames: DB.p4.colNames,
        type:'HOTFTPSITE',
        btnsName:["成功率","下载速率"],
        tops:['PBSRVFTP0001',"PBSRVFTP0002","FTPSITE_NAME"],
        data: d4
      })
      p4.render()
    },
    initWholeNetworkData:function(datas){
       console.log("initWholeNetworkData",datas);
       var self =this;
      fish.each(datas,function(d,i){
            if(!d)return;
            className =".cellall-"+i;
            var el= self.$el.find(className);
            el.find('.title').text(d.name);
            el.find('.value').text(Number(d.value)+" "+d.unit);
        })
    },
    afterRender: function() {
      var self =this;
      this.map();
      action.qryHostDataList(function(data){
        self.initHostDataList(data)
      })
      action.getWholeNetworkData(function(data){
         console.log('getWholeNetworkData',data,DB);
         var item = data.dataList[0];
         var keys = fish.keys(item);
         console.log(keys);
         var datas = fish.map(keys,function(key){
               var elmentData  = {
                  'key':key
               };
               var d = DB.pp[key];
               if(d){
                 elmentData.name =d.name;
                 elmentData.unit = d.unit;
                 elmentData.value =item[key];
               }else{
                 return null;
               }
               return elmentData;
         });
         console.log('getWholeNetworkData Result ',datas);
         self.initWholeNetworkData(datas);
      })
      action.getCityScoreData(function(data){
          console.log('getCityScoreData',data);
          var datas = fish.map(data.dataList,function(d){
             d.name = d.CITY_NAME;
             d.value =d.SCORE;
            return d
          })
          self.map(datas);

      })

      action.getIDCData(function(data){
           console.log('getIDCData',data);
           self.initIDCData(data.dataList);
      });
      action.getCDNTrendData(function(data){
         console.log('getCDNTrendData',data);
         var datas  = fish.map(data.dataList,function(d){
           d.TTIME=fish.dateutil.format(new Date(d.STTIME), 'mm-dd');
           return d
         })
          datas =fish.sortBy(datas,'STTIME')

          var groupBy = fish.groupBy(datas,'FUNCTION_NAME')
          var groupBy2 = fish.groupBy(datas,'TTIME');
          var timeArry  = fish.keys(groupBy2);
          console.log("initCDNTrendData",timeArry)
          self.initCDNTrendData(groupBy,timeArry);
      })
      action.getCDNDetailData(function(data){
        console.log('getCDNDetailData',data);
        var datas  = fish.map(data.dataList,function(d){
          d.TTIME=fish.dateutil.format(new Date(d.STTIME), 'yyyy-mm-dd hh:ii:ss');
          return d
        })
        self.initCDNDetailData(data.dataList);
      })



      //
      // action.qryHostDataList(function(data){
      //    console.log('qryHostDataList',data);
      // })

      // action.getHotTrendDataList("HOTVIDEO",function(data){
      //   console.log('HOTWEBSITE',data);
      // })
      // action.getHotTrendDataList("HOTGAME",function(data){
      //   console.log('HOTGAME',data);
      // })
      // action.getHotTrendDataList("HOTFTPSITE",function(data){
      //   console.log('HOTFTPSITE',data);
      // })
      // action.getWholeNetworkData(function(data){
      //   console.log('getWholeNetworkData',data);
      // })
      var self = this;
      console.log("afterRender",DB);
    },

  })
})
