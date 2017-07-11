define([], function() {

  var dbs = [];
  dbs.push({
    serverName: '新装量预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'area',
        data: [
          '南京',
          '无锡',
          '徐州',
          '常州',
          '苏州',
          '南通',
          '淮安',
          '盐城',
          '扬州',
          '镇江',
          '泰州',
          '宿迁',
          '连云港'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: '3G'
      }, {
        id: 'field_3',
        name: '4G'
      }, {
        id: 'field_4',
        name: '2G'
      }
    ]
  })

  dbs.push({
    serverName: '停复机预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'area',
        data: [
          '南京',
          '无锡',
          '徐州',
          '常州',
          '苏州',
          '南通',
          '淮安',
          '盐城',
          '扬州',
          '镇江',
          '泰州',
          '宿迁',
          '连云港'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: 'running'
      }, {
        id: 'field_3',
        name: 'stoping'
      }
    ]
  })

  dbs.push({
    serverName: '峻工量预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'area',
        data: [
          '南京',
          '无锡',
          '徐州',
          '常州',
          '苏州',
          '南通',
          '淮安',
          '盐城',
          '扬州',
          '镇江',
          '泰州',
          '宿迁',
          '连云港'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: 'C_NET'
      }, {
        id: 'field_3',
        name: 'B_NET'
      }
    ]
  })

  dbs.push({
    serverName: '码号销售预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'month',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: '3G'
      }, {
        id: 'field_3',
        name: '4G'
      }
    ]
  })

  dbs.push({
    serverName: '指标完成率预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'month',
        data: [
          '长沙',
          '株洲',
          '湘潭',
          '衡阳',
          '邵阳',
          '岳阳',
          '常德',
          '张家界',
          '益阳',
          '娄底',
          '郴州',
          '永州',
          '怀化',
          '湘西'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: 'VLR'
      }, {
        id: 'field_3',
        name: 'WLAN'
      }
    ]
  })

  dbs.push({
    serverName: '投诉数预览服务',
    xAxis: [],
    yAxis: [
      {
        id: 'field_2',
        name: 'network',
        data: [
          77,
          29,
          70,
          34,
          84,
          40,
          13,
          39,
          58,
          79,
          61,
          50
        ]
      }, {
        id: 'field_3',
        name: '3G',
        data: [
          177,
          129,
          170,
          134,
          184,
          140,
          113,
          139,
          158,
          179,
          161,
          150
        ]
      }, {
        id: 'field_4',
        name: '4G',
        data: [
          177,
          129,
          170,
          134,
          184,
          140,
          113,
          139,
          158,
          179,
          161,
          150
        ]
      }
    ]
  })

  dbs.push({
    serverName: '地区码号销售',
    xAxis: [
      {
        id: 'field_1',
        name: 'area',
        data: [
          '长沙',
          '株洲',
          '湘潭',
          '衡阳',
          '邵阳',
          '岳阳',
          '常德',
          '怀化',
          '益阳',
          '娄底'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: '3G'
      }, {
        id: 'field_3',
        name: '4G'
      }
    ]
  })

  dbs.push({
    serverName: '码号销售年度指标',
    xAxis: [
      {
        id: 'field_1',
        name: 'years',
        data: [
          '2008',
          '2009',
          '2010',
          '2011',
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017'
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: '3G'
      }, {
        id: 'field_3',
        name: '4G'
      }
    ]
  })

  dbs.push({
    serverName: '流程预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'nodes',
        data: [
          "CRM下单",
          "服务单",
          "资源变更单",
          "流程启动",
          "派单",
          "归档"
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: '待处理'
      }, {
        id: 'field_3',
        name: '处理中'
      }
    ]
  })



  dbs.push({
    serverName: '当月新装用户数预览服务',
    xAxis: [
      {
        id: 'field_1',
        name: 'package',
        data: [
          "流量升级包-30",
          "乐享4G-99",
          "飞Young4G-99",
          "乐享4G-399",
          "乐享4G-59",
          "乐享4G-129",
          "乐享4G-199",
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: 'month'
      }, {
        id: 'field_3',
        name: 'day'
      }
    ]
  })


  dbs.push({
    serverName: '实时数据预览服务',
    xAxis: [],
    yAxis: [
      {
        id: 'field_2',
        name: '当日施工调度人数',
        data: [
          77,

        ]
      }, {
        id: 'field_3',
        name: '装机数',
        data: [
          992,

        ]
      }, {
        id: 'field_4',
        name: '自动激活单数',
        data: [
          523,
        ]
      },
      {
        id: 'field_5',
        name: '呼叫全程成功率',
        data: [
          98.7,
        ]
      },
      {
        id: 'field_6',
        name: '端到端接通率',
        data: [
          99.7,
        ]
      },
      {
        id: 'field_7',
        name: '基站数',
        data: [
          3.5,
        ]
      },
      {
        id: 'field_8',
        name: 'HLR',
        data: [
          300,
        ]
      },
      {
        id: 'field_9',
        name: 'VLR注册用户增幅数',
        data: [
          130,
        ]
      },
      {
        id: 'field_10',
        name: 'WLAN注册用户增幅数',
        data: [
          230,
        ]
      }


    ]
  })


  dbs.push({
    serverName: '网络规模预览服务',
    xAxis: [],
    yAxis: [
      {
        id: 'field_2',
        name: '话务量',
        data: [
          255,
          777

        ]
      }, {
        id: 'field_3',
        name: '流量',
        data: [
          344,
          800
        ]
      }]
  })





  return fish.indexBy(dbs, 'serverName')

});
