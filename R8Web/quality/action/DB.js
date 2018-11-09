portal.define([], function() {
  var DB = {};
  DB.p1 = {
    title: '热点网站',
    colNames: [
      '热点网站', '显示成功率', '平均时延'
    ],
    data: [
      {
        'name': '新浪网',
        'val': '90%',
        'val2': '3s',
        id: '1',
        index: '1'
      }, {
        'name': '搜狐网',
        'val': '90%',
        'val2': '3s',
        id: '2',
        index: '2'
      }, {
        'name': '网易',
        'val': '90%',
        'val2': '3s',
        id: '3',
        index: '3'
      }, {
        'name': '凤凰网',
        'val': '90%',
        'val2': '3s',
        id: '4',
        index: '4'
      }, {
        'name': '今日头条',
        'val': '90%',
        'val2': '3s',
        id: '5',
        index: '5'
      }
    ]
  }
  DB.p2 = {
    title: '热点视频',
    colNames: [
      '热点视频', '播放成功率', '平均时延'
    ],
    data: [
      {
        'name': '优酷视频',
        'val': '90%',
        'val2': '3s',
        id: '1',
        index: '1'
      }, {
        'name': '搜狐视频',
        'val': '95%',
        'val2': '3s',
        id: '2',
        index: '2'
      }, {
        'name': '腾讯视频',
        'val': '95%',
        'val2': '3s',
        id: '3',
        index: '3'
      }, {
        'name': '凤凰网',
        'val': '90%',
        'val2': '3s',
        id: '4',
        index: '4'
      }, {
        'name': '今日头条',
        'val': '90%',
        'val2': '3s',
        id: '5',
        index: '5'
      }
    ]
  }
  DB.p3 = {
    title: '热点游戏',
    colNames: [
      '热点游戏', '登录成功率', '平均时延'
    ],
    data: [
      {
        'name': '王者荣耀',
        'val': '90%',
        'val2': '3s',
        id: '1',
        index: '1'
      }, {
        'name': '搜狐视频',
        'val': '95%',
        'val2': '3s',
        id: '2',
        index: '2'
      }, {
        'name': '腾讯视频',
        'val': '95%',
        'val2': '3s',
        id: '3',
        index: '3'
      }, {
        'name': '凤凰网',
        'val': '90%',
        'val2': '3s',
        id: '4',
        index: '4'
      }, {
        'name': '今日头条',
        'val': '90%',
        'val2': '3s',
        id: '5',
        index: '5'
      }
    ]
  }
  DB.p4 = {
    title: 'HTTP下载',
    colNames: [
      '热点下载', '下载成功率', '下载速率'
    ],
    data: [
      {
        'name': '小米应用商店',
        'val': '90%',
        'val2': '3s',
        id: '1',
        index: '1'
      }, {
        'name': '太平洋电脑网',
        'val': '95%',
        'val2': '3s',
        id: '2',
        index: '2'
      }, {
        'name': '虾米音乐',
        'val': '95%',
        'val2': '3s',
        id: '3',
        index: '3'
      }, {
        'name': '豆瓣音乐',
        'val': '90%',
        'val2': '3s',
        id: '4',
        index: '4'
      }, {
        'name': 'ViVO',
        'val': '90%',
        'val2': '3s',
        id: '5',
        index: '5'
      }
    ]
  }
  DB.pp={
    "PBSRVWEB0001":{
       name:"页面显示成功率",
       unit:"%"
    },
    "PBSRVWEB0002":{
      name:"页面显示时延",
      unit:"s",
    },
    "PBSRVWEB0003":{
      name:'页面响应成功率',
      unit:'%',
    },
    "PBSRVWEB0004":{
      name:'页面响应时延',
      unit:'s',
    },
    "PBSRVVDO0001":{
      name:"视频初始播放成功率",
      unit:'%'
    },
    "PBSRVVDO0002":{
      name:"视频初始缓冲时延",
      unit:'s'
    },
    "PBSRVVDO0003":{
      "name": "视频播放卡顿率",
       unit:'%'
    },
    "PBSRVVDO0004":{
      name:"视频卡顿占比",
      unit:'%'
    },
    "PBSRVFTP0001":{
      name:"下载成功率",
      unit:'%'
    },
    "PBSRVFTP0002":{
      name:'下载速率',
      unit:'kbit/s',
    },
    "PBSRVGAME001":{
      name:"游戏登陆成功率",
      unit:'%'
    },
    "PBSRVGAME002":{
      name:'游戏登陆时延',
      unit:'%'
    },
    "PBSRVTRAF001":{
      name:"流量本网率",
      unit:'%'
    },
    "PBSRVTRAF002":{
      name:'流量本省率',
      unit:'%'
    },
    "PBSRVTRAF003":{
      name:"Cache增益比",
      unit:'%'
    }
  }
  return DB
})
