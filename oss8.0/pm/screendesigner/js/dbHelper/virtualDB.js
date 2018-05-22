define([], function() {
    var dbs = [];
    dbs.push({
        serverName: 'NetworkOverviewDemoQryService',
        serverLabel: 'NetworkOverviewDemoQryService',
        xAxis: [
                {
                    id: 'field_hotWeb_1',
                    name: '热门网站',
                    data: [
                      "淘宝",
                      "百度",
                      "新浪",
                      "腾讯",
                      "优酷",
                      "哔哩哔哩",
                      "京东",
                      "搜狗",
                      "豆瓣",
                      "土豆"
                    ]
                },
              {
                  id: 'field_TopVideo_1',
                  name: '视频网',
                  data: [
                    "优酷",
                    "土豆",
                    "搜狐视频",
                    "爱奇艺",
                    "酷6网",
                    "央视网",
                    "哔哩哔哩",
                    "56网",
                    "豆瓣电影",
                    "腾讯视频"
                  ]
              },
              {
                  id: 'field_TopGame_1',
                  name: '游戏',
                  data: [
                    "王者荣耀",
                    "地下城与勇士",
                    "英雄联盟",
                    "剑网3",
                    "魔兽世界",
                    "梦幻西游",
                    "新天龙八部",
                    "炉石传说",
                    "剑灵",
                    "魔域"
                  ]
              },
            {
                id: 'field_Mongolia_1',
                name: 'Mongolia City',
                data: [
                    '阿拉善盟',
                    '巴彦淖尔',
                    '乌海市',
                    '鄂尔多斯',
                    '包头市',
                    '呼和浩特',
                    '乌兰察布',
                    '锡林郭勒盟',
                    '赤峰市',
                    '通辽市',
                    '兴安盟',
                    '呼伦贝尔市',
                ]
            },
            {
                id: 'field_1',
                name: 'City',
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
                    'ZHK',
                    'Shuo'
                ]
            }, {
                id: 'field_11',
                name: 'Date',
                data: [
                    '08h',
                    '09h',
                    '10h',
                    '11h',
                    '12h',
                    '13h',
                    '14h',
                    '15h',
                    '16h',
                    '17h',
                    '16h',
                    '17h',

                ]
            },
            {
              id:'filed_map',
              'name':'area',
              data:[
                "ZW-BU",
                "ZW-HA",
                "ZW-MA",
                "ZW-MC",
                "ZW-ME",
                "ZW-MI",
                "ZW-MN",
                "ZW-MS",
                "ZW-MV",
                "ZW-MW"
              ]
            },
            {
              id:'filed_china_map',
              'name':'Chian Area',
              data:[
                "CN-11",
                "CN-50",
                "CN-43",
                "CN-44",
                "CN-62",
                "CN-45",
                "CN-52",
                "CN-46",
                "CN-32",
                "CN-41"
              ]
            },
            {
              id:'filed_Mongolia_map',
              'name':'Mongolia Map',
              data:[
                "Hulunbuir",
                "Hinggan",
                "Tongliao",
                "Chifeng",
                "XilinGol",
                "Ulanqab",
                "Honhot",
                "Baotou",
                "Ordos",
                "Alxa",
              ]
            }
        ],
        yAxis: [
          {
              id: 'field_hotweb_timelong',
              name: '首屏时延',
              data: [
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460)
              ]
          },
          {
              id: 'field_hotweb_timelong2',
              name: '首屏时延达标率',
              data: [
                  fish.random(90,100),
                  fish.random(90,100),
                    fish.random(90,100),
                      fish.random(90,100),
                    fish.random(90,100),
                  fish.random(90,100),
                    fish.random(90,100),
                    fish.random(90,100),
                    fish.random(90,100),
                      fish.random(90,100),
              ]
          },
          {
              id: 'field_hotweb_timelong3',
              name: '网页打开成功率',
              data: [
                  fish.random(90,100),
                  fish.random(90,100),
                    fish.random(90,100),
                      fish.random(90,100),
                    fish.random(90,100),
                  fish.random(90,100),
                    fish.random(90,100),
                    fish.random(90,100),
                    fish.random(90,100),
                      fish.random(90,100),
              ]
          },
          {
              id: 'field_video_timelong',
              name: '缓冲时长占比',
              data: [
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460),
                  fish.random(20,460)
              ]
          },
          {
              id: 'field_video_stopconter',
              name: '平均播放卡顿次数',
              data: [
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
              ]
          },
          {
              id: 'field_video_firststopconter',
              name: '首帧显示时长',
              data: [
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
                  fish.random(10,20),
              ]
          },
              {
                  id: 'field_game_ping',
                  name: '游戏Ping平均时延',
                  data: [
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460),
                      fish.random(20,460)
                  ]
              },
              {
                  id: 'field_game_lose',
                  name: '游戏丢包率(%)',
                  data: [
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80),
                      fish.random(20,80)
                  ]
              },
            {
                id: 'field_2',
                name: 'Data traffic',
                data: [
                    80.23,
                    50,
                    40,
                    30,
                    70,
                    90,
                    85,
                    25,
                    95,
                    95,
                    fish.random(20,85),
                    fish.random(20,85),
                ]
            }, {
                id: 'field_3',
                name: '3G Data traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_4',
                name: '4G Data traffic ',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_5',
                name: 'Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_6',
                name: '3G Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_7',
                name: '4G Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_8',
                name: 'Voice traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_9',
                name: '2G Voice traffic',
                data: [
                    fish.random(20,90),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]

            }, {
                id: 'field_10',
                name: '3G Voice traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_12',
                name: ' Total Base station',
                data: [
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                ]
            }
        ]
    })
    return fish.indexBy(dbs, 'serverName')
});
