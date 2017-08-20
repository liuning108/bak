define([], function() {

  var dbs = [];
  dbs.push({
    serverName: '新装量预览服务',
    serverLabel:'NETWORK_OVERVIEW_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'Shang',
          'Zhang',
          'Yiya',
          'Loudi',
          'Chenz',
          'Yongz',
          'Huaih',
          'XiaXi'
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
    serverLabel:'NETWORK_OVERVIEW_B_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'Shang',
          'Zhang',
          'Yiya',
          'Loudi',
          'Chenz',
          'Yongz',
          'Huaih',
          'XiaXi'
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
    serverLabel:'NETWORK_OVERVIEW_C_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'Shang',
          'Zhang',
          'Yiya',
          'Loudi',
          'Chenz',
          'Yongz',
          'Huaih',
          'XiaXi'
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
    serverLabel:'NETWORK_OVERVIEW_D_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'month',
        data: [
          'Jun.',
          'Feb.',
          'Mar.',
          'Apr.',
          'May',
          'Jun.',
          'Jul.'
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
    serverLabel:'NETWORK_OVERVIEW_E_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'Shang',
          'Zhang',
          'Yiya',
          'Loudi',
          'Chenz',
          'Yongz',
          'Huaih',
          'XiaXi'
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
    serverLabel:'NETWORK_OVERVIEW_F_SERVICE',
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
    serverLabel:'NETWORK_OVERVIEW_G_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'Shang',
          'Zhang',
          'Yiya',
          'Loudi',


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
      , {
        id: 'field_4',
        name: 'base station'
      }
      , {
        id: 'field_5',
        name: '2G'
      }
    ]
  })

  dbs.push({
    serverName: '码号销售年度指标',
    serverLabel:'NETWORK_OVERVIEW_H_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'months',
        data: [
          'Jun.',
          'Feb.',
          'Mar.',
          'Apr.',
          'May',
          'Jun.',
          'Jul.',
          'Aug.',
          'Sept.',
          'Oct.'
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
      },
      {
        id: 'field_4',
        name: 'Voice '
      }, {
        id: 'field_5',
        name: 'data'
      }
    ]
  })

  dbs.push({
    serverName: '流程预览服务',
    serverLabel:'NETWORK_OVERVIEW_I_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'nodes',
        data: [
          "CRM",
          "OSS",
          "Resource",
          "Running",
          "Doing",
          "SAVE"
        ]
      }
    ],
    yAxis: [
      {
        id: 'field_2',
        name: 'wait'
      }, {
        id: 'field_3',
        name: 'doing'
      }
    ]
  })



  dbs.push({
    serverName: '当月新装用户数预览服务',
    serverLabel:'NETWORK_OVERVIEW_J_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'package',
        data: [
          "package-30",
          "package4G-99",
          "package2G-99",
          "package-399",
          "package-59",
          "package-129",
          "package-199",
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
    serverLabel:'NETWORK_OVERVIEW_K_SERVICE',
    xAxis: [],
    yAxis: [
      {
        id: 'field_2',
        name: 'People',
        data: [
          77,

        ]
      }, {
        id: 'field_3',
        name: 'installed machine',
        data: [
          992,

        ]
      }, {
        id: 'field_4',
        name: 'auto activate nums',
        data: [
          523,
        ]
      },
      {
        id: 'field_5',
        name: 'CSSR',
        data: [
          98.7,
        ]
      },
      {
        id: 'field_6',
        name: 'port to port',
        data: [
          99.7,
        ]
      },
      {
        id: 'field_7',
        name: 'baseStation ',
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
        name: 'VLR People',
        data: [
          130,
        ]
      },
      {
        id: 'field_10',
        name: 'WLAN People',
        data: [
          230,
        ]
      },
      {
        id: 'field_11',
        name: 'phone number',
        data: [
          123123230,
        ]
      },
      {
        id: 'field_12',
        name: 'baseStation ',
        data: [
          34572,
        ]
      }


    ]
  })


  dbs.push({
    serverName: '网络规模预览服务',
    serverLabel:'NETWORK_OVERVIEW_H_SERVICE',
    xAxis: [],
    yAxis: [
      {
        id: 'field_2',
        name: 'Voice ',
        data: [
          255,
          777

        ]
      }, {
        id: 'field_3',
        name: 'data',
        data: [
          344,
          800
        ]
      }]
  })


  dbs.push({
    serverName: '地区码号销售指标',
    serverLabel:'NETWORK_OVERVIEW_J_SERVICE',
    xAxis: [
      {
        id: 'field_1',
        name: 'Citys',
        data: [
          'Chang',
          'Zhu',
          'Xiang',
          'Heng',
          'Shao',
          'Yue',
          'CHA',
          'Zhang',
          'Yiya',
          'Loudi',
          'Chenz',
          'Yongz',
          'Huaih',
          'XiaXi'
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
      },
      {
        id: 'field_4',
        name: 'Voice '
      }, {
        id: 'field_5',
        name: 'data'
      },
       {
        id: 'field_6',
        name: 'baseStation '
      }
    ]
  })





  return fish.indexBy(dbs, 'serverName')

});
