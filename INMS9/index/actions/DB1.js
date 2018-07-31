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
         datas:[{name:"呼和浩特",value:10},
                {name:"包头",value:10},
                {name:"乌海",value:10},
                 {name:"赤峰",value:10},
                 {name:"通辽",value:10},
                 {name:"鄂尔多斯",value:10},
                 {name:"巴彦淖尔",value:10},
                  {name:"乌兰察布",value:10},
                  {name:"兴安盟",value:10},
                  {name:"锡林郭勒盟",value:10},
                  {name:"阿拉善盟",value:10},
                  {name:"呼伦贝尔",value:10},
                 ],
        colors:['#c03636', '#304553','#63a0a7',"#d28268","#93c6ae","#759e84","#c9852f","#bca29b","#6e7074","#55656f","#c4ccd3","#da5a1b"]
     },
     lineChart:{
        'title':"质差趋势",
         xAxisDatas:['1月','2月','3月','4月','5月','6月','7月'],
         datas:[{
                 name:"Firefox",
                 color:"#e54d43",
                 datas:[120, 132, 101, 134, 90, 230, 210],
                 },
               ],
     },
     topTitle:"全网 TOP N 小区质量排名",
     topList:[
         {"title":"江南文枢院高层二期",'value':90,'label':"90分",cellID:1},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分",cellID:2},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分" ,cellID:3},
         {"title":"红山祥和万嘉业务覆盖区（铁通光迁移）",'value':75,'label':"75分",cellID:4},
         {"title":"乌拉特中旗中联国际小区",'value':85,'label':"85分",cellID:5},
         {"title":"军辉小区",'value':80,'label':"80分",cellID:6},
         {"title":"江南文枢院高层二期",'value':90,'label':"90分",cellID:1},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分",cellID:2},
         {"title":"江南文枢院高层二期",'value':90,'label':"90分",cellID:1},
         {"title":"后旗安鑫苑小区",'value':95,'label':"95分",cellID:2},
         {"title":"东胜西园新村小区（城区铁通光改有线宽带)",'value':55,'label':"55分" ,cellID:3},

     ]
    };
    return DB;
});
