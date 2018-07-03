//[250, 800, 250, 800, 250, 500,250,250,250,800,250,250]
portal.define([],function(){
    var DB={
      all:{
        'title':'全网质差小区数',
        'value':"1,430",
        'per':'2.3%',
        'perTitle':'PREVIOUS 30 DAYS',
        'dir':"down",
         data:[250, 800, 250, 800, 250, 500,250,250,250,800,250,250]
      },
     pieChart:{
        'title':"地市质差小区占比",
         datas:[{name:"Firefox",value:10},
                {name:"Chrome",value:10},
                {name:"IE",value:10}],
        colors:['#e54d43', '#39ca74','#3a99d8']
     },
     lineChart:{
        'title':"质差趋势2",
         xAxisDatas:['周一','周二','周三','周四','周五','周六','周7'],
         datas:[{
                 name:"Firefox",
                 color:"#e54d43",
                 datas:[120, 132, 101, 134, 90, 230, 210],
                 },
                {
                 name:"Chrome",
                 color:"#39ca74",
                 datas:[220, 182, 191, 234, 290, 330, 310],
                 },
                {name:"IE",
                 color:"#3a99d8",
                 datas:[150, 232, 201, 154, 190, 330, 410],
                 }],
     },
     topTitle:"全网 TOP N 小区质量排名",
     topList:[
         {"title":"江南文枢院高层二期",'value':90,'label':"90分"},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分"},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分"},
         {"title":"红山祥和万嘉业务覆盖区（铁通光迁移）",'value':75,'label':"75分"},
         {"title":"乌拉特中旗中联国际小区",'value':85,'label':"85分"},
         {"title":"军辉小区",'value':80,'label':"80分"},
         {"title":"江南文枢院高层二期",'value':90,'label':"90分"},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分"},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分"},
         {"title":"红山祥和万嘉业务覆盖区（铁通光迁移）",'value':75,'label':"75分"},
         {"title":"乌拉特中旗中联国际小区",'value':85,'label':"85分"},
         {"title":"军辉小区",'value':80,'label':"80分"},
         {"title":"江南文枢院高层二期",'value':90,'label':"90分"},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分"},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分"},
         {"title":"红山祥和万嘉业务覆盖区（铁通光迁移）",'value':75,'label':"75分"},
         {"title":"乌拉特中旗中联国际小区",'value':85,'label':"85分"},
         {"title":"军辉小区",'value':80,'label':"80分"},
         {"title":"江南文枢院高层二期",'value':90,'label':"90分"},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分"},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分"},
         {"title":"红山祥和万嘉业务覆盖区（铁通光迁移）",'value':75,'label':"75分"},
         {"title":"乌拉特中旗中联国际小区",'value':85,'label':"85分"},
         {"title":"军辉小区",'value':80,'label':"80分"},

     ]
    };
    return DB;
});
