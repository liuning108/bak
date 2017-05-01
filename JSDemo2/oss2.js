var global_config={
   'cx':500,
    default_font:{'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font':{'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font2':{'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font3':{'fill':'#8eeefc','font-size':37,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font4':{'fill':'#feffd3','font-size':37,'font-family': '微软雅黑','font-weight':'bold'},  
   'title_font5':{'fill':'#d0fefe','font-size':37,'font-family': '微软雅黑','font-weight':'bold'}, 
   'area_names':['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港'],
   'workflow_names':['CRM下单' ,'服务单' ,'资源变更单' ,'流程启动' ,'派单' ,'归档']
};


//启动函数
window.onload=function(){
	  var paper = Raphael(0, 0, 1920, 1080); 
	     paper.setViewBox(0,0,1920,1080,true);
         paper.setSize('100%', '100%');
        titleBarTime(paper);//时间标题
     workflowPie(paper) //工作流圆形指标
        onlineWorker(paper)//在线人员
        onlineShoppingCar(paper)//在线购物车
        onlineBusinessHall(paper)//在线营业厅
        ShoppingCarTip(paper);//购物车
        TodayCNet(paper);//C网今日新装量
        TodayCNetNoWork(paper);//C网超3分钟未峻工量
        TodayStopMachine(paper);//停复机

}// end of onload
function workflowProcess(paper){
  var x=1190;
  var y=585
   ///
       paper.text(x+235,y+30,'正常').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+235-45,y+20,20,20).attr({'fill':'#02b7ec','stroke-width':0});

       paper.text(x+235+75,y+30,'紧急').attr({'fill':'#fcc314','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+235-45+75,y+20,20,20).attr({'fill':'#fcc314','stroke-width':0});

       paper.text(x+235+75+75,y+30,'危险').attr({'fill':'#ff0000','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+235-45+75+75,y+20,20,20).attr({'fill':'#ff0000','stroke-width':0});

      ///
  return paper.chartsProcess({
           'x':x,
           'y':y,
           'keys':global_config.workflow_names
         })
}

function TodayStopMachine(paper){
  var x=48+540;
  var y=245+377+20;
  var lable_gb=paper.image('images/bgline.png',x,y,532,377);
  var title = paper.text(x+532/2,y,'停复机在途复机量').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
   var regainNumsKPI = new RegainNumsKPI(paper,{
         'x':x+100,
     'y':y+50,
      nums_width:100,
      nums:19,
      waring:80,
      error:100,
   });
    regainNumsKPI.add({
                         'name':'南京',
                          'value':60
                       });

    regainNumsKPI.add({
                         'name':'无锡',
                          'value':19
                       });


    regainNumsKPI.add({
                         'name':'徐州',
                          'value':75
                       });

    regainNumsKPI.add({
                         'name':'常州',
                          'value':53
                       });

    regainNumsKPI.add({
                         'name':'苏州',
                          'value':35
                       });
    regainNumsKPI.add({
                         'name':'南通',
                          'value':35
                       });

    regainNumsKPI.add({
                         'name':'连云港',
                          'value':55
                       });

     regainNumsKPI.add({
                         'name':'淮安',
                          'value':56
                       });

      regainNumsKPI.add({
                         'name':'盐城',
                          'value':63
                       });

       regainNumsKPI.add({
                         'name':'扬州',
                          'value':80
                       });

       regainNumsKPI.add({
                         'name':'镇江',
                          'value':52
                       });

       regainNumsKPI.add({
                         'name':'泰州',
                          'value':63
                       });

       regainNumsKPI.add({
                         'name':'宿迁',
                          'value':30
                       });
    regainNumsKPI.show();
     function run (){
          regainNumsKPI.animate();
          setTimeout(run,5000);
      }
      run();
}

function TodayCNetNoWork(paper){
  var x=48
  var y=245+377+20;
  var lable_gb=paper.image('images/bgline.png',x,y,532,377);
  var title = paper.text(x+532/2,y,'C网超3分钟未峻工量').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
  todayCNetNoWorkTop(paper,x+22,y+140);
}

function todayCNetNoWorkTop(paper,x,y){

     ///
       paper.text(x+184,y+195,'正常').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+140,y+185,20,20).attr({'fill':'#ffffff',opacity:'0.4'});

       paper.text(x+184+65,y+195,'紧急').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+140+65,y+185,20,20).attr({'fill':'#ffcc00',opacity:'0.4'});


       paper.text(x+184+65+65,y+195,'危险').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
      paper.rect(x+140+65+65,y+185,20,20).attr({'fill':'#ff3600',opacity:'0.4'});
     ///
     var top1= paper.areaLineBar({
                                    'keys':global_config.area_names,
                                     'x':x,
                                     'y':y,
                                     'waring':[40,70,90]
                                 });
      var nums =paper.chartsNumbser({'x':x+235,'y':y-92,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':36,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   function readValue(){
           nums.setValue(fRandomBy(10000,5000000));
           setTimeout(function(){
             readValue();
          },6000); 
        }
        readValue();
     function readValue(){
      var datas=createLineBar();
      var sum =0;
       for (var i=0;i<datas.length;i++){
         sum+=datas[i].value;
       }
       nums.setValue(sum);
           top1.inputData(datas);
           setTimeout(function(){
             readValue();
          },6000); 
        }
        readValue();
}

 function TodayCNet(paper){
  var x=48+540;
  var y=245;
  var lable_gb=paper.image('images/bgline.png',x,y,532,377);
  var title = paper.text(x+532/2,y,'C网今日新装量').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
  var  loadNumber = new  todayLoadNumberClass(paper,{
            'x':x+82,
            'y':y+30,
            'element_width':180,
            'element_high':24,
            'element_distance':26

        });
        loadNumber.add({
           'name':'南京',
           'value_3g':42,
           'value_4g':62
        })

        loadNumber.add({
           'name':'无锡',
           'value_3g':39,
           'value_4g':49
        })


        loadNumber.add({
           'name':'徐州',
           'value_3g':22,
           'value_4g':33
        })

        loadNumber.add({
           'name':'常州',
           'value_3g':47,
           'value_4g':99
        })


        loadNumber.add({
           'name':'苏州',
           'value_3g':46,
           'value_4g':55
        })

         loadNumber.add({
           'name':'南通',
           'value_3g':33,
           'value_4g':38
        })

        loadNumber.add({
           'name':'连云港',
           'value_3g':20,
           'value_4g':44
        })

         loadNumber.add({
           'name':'淮安',
           'value_3g':55,
           'value_4g':56
        })



          loadNumber.add({
           'name':'盐城',
           'value_3g':55,
           'value_4g':36
        })

           loadNumber.add({
           'name':'扬州',
           'value_3g':22,
           'value_4g':43
          })

          loadNumber.add({
           'name':'镇江',
           'value_3g':33,
           'value_4g':45
          })
          loadNumber.add({
           'name':'泰州',
           'value_3g':25,
           'value_4g':33
          })
            loadNumber.add({
           'name':'宿迁',
           'value_3g':30,
           'value_4g':40
        })


    
      var title3G = paper.text(x+82+55+10+145+27,y+45,'3G').attr({'fill':'#4bcaff','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
        var title4G = paper.text(x+82+55+10+145+100+27,y+45,'4G').attr({'fill':'#ffdb11','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});

    
         var sum3gkpi =new sumkpi(paper,{
                'currentvalue':340,
                'rate':0.05,
                'nums':19,
                'item_high':5,
                'x':x+82+55+10+145,
                'y':y+72,
                'item_width':50,
                'space_high':15,
                'fill':'#00b7ee'

         });
         sum3gkpi.show();



          var sum4gkpi =new sumkpi(paper,{
                'currentvalue':340,
                'rate':0.04,
                'nums':19,
                'item_high':5,
                'x':x+82+55+10+145+100,
                'y':y+72,
                'item_width':50,
                'space_high':15,
                'fill':'#e89f21'

         });
       sum4gkpi.show();
       loadNumber.show();
         loadNumber.animate();
 }

function ShoppingCarTip(paper){
  var x=38;
  var y=245;

  var lable_gb=paper.image('images/bgline.png',x,y,532,377);
  var title = paper.text(x+532/2,y,'购物车').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
  var shopConfig ={
           'x':x+48,
            'y':y+35,
           'item_high':310,
          'item_width':45,
       }
  var shopcarkpi  = new shopcarClass(paper,shopConfig);
      shopcarkpi.add({value:95*10000});
      shopcarkpi.add({value:65*10000});
      shopcarkpi.add({value:115*10000});
      shopcarkpi.add({value:55*10000});
      shopcarkpi.add({value:22*10000});
  var avgmaxdata={'maxvalue':115*10000,'avgval':70*10000}
      shopcarkpi.show(avgmaxdata);
     var shopcarkpi_run=shopcarkpi.animate();

      var listbar =paper.chartsListBar({
                                        'x':x+340,'y':y+40,
                                        'keys':global_config.area_names
                                       });
   function readValue(){
      var datas=createListBar();
     //listbar.inputData(datas)
     var sum=0;
     for (var i=0;i<datas.length;i++){
         sum+=datas[i].value;
     }
     //shopcarkpi_run(sum);
     setTimeout(function(){
             readValue();
          },6000); 
    }
    readValue();

}

function titleBarTime(paper){
  var x=0;
  var y=0;
  var lable_title=paper.image('images/oss2title.png',x,y,250,235); 
  var date1 = paper.text(x+70,y+140,getWeek()).attr({'fill':'#f4fedc','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
  var date2 = paper.text(x+170,y+140,getHH()).attr({'fill':'#f4fedc','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
     function run(){
        date1.attr({'text':getWeek()});
        date2.attr({'text':getHH()});
        setTimeout(run,1000);
     }
     run();


}

function onlineBusinessHall(paper){
  var x=850;
  var y=122;
  var label=paper.text(x,y-20,'在线营业厅').attr({'fill':'#ddff00','font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  var nums =paper.chartsNumbser({'x':x,'y':y+20,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':30,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   function readValue(){
           nums.setValue(fRandomBy(10,30));
           setTimeout(function(){
             readValue();
          },6000); 
        }
        readValue();
}

function onlineShoppingCar(paper){
  var x=600;
  var y=122;
  var label=paper.text(x,y-20,'购物车').attr({'fill':'#ddff00','font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  var nums =paper.chartsNumbser({'x':x,'y':y+20,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':30,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   function readValue(){
           nums.setValue(fRandomBy(10000,5000000));
           setTimeout(function(){
             readValue();
          },6000); 
        }
        readValue();
}


function onlineWorker(paper){
  var x=372;
  var y=122;
  var label=paper.text(x,y-20,'在线人员').attr({'fill':'#ddff00','font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  var nums =paper.chartsNumbser({'x':x,'y':y+20,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':30,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   function readValue(){
           nums.setValue(fRandomBy(1000,5000));
           setTimeout(function(){
             readValue();
          },6000); 
        }
        readValue();
}



function workflowPie(paper){
  var x=1480;
  var y=252;
    var pie=paper.workflowPie({
                   'x':x,
                   'y':y,
                   'r':70,
                   'listx':x-300,
                   'listy':y-190,
                   modes:[
                                {name:'CRM下单',color:'#f89d2c'},
                                {name:'服务单',color:'#f299bd'},
                                {name:'资源变更单',color:'#e8410e'},
                                {name:'流程启动',color:'#30cd2f'},
                                {name:'派单',color:'#dbdb01'},
                                {name:'归档',color:'#8e228f'},
                                
                             ]
             });

    this.nameValue=paper.text(x,y-20,'流程总数').attr({'fill':'#ffffff','font-size':23,'font-family': '微软雅黑','font-weight':'bold'});
    var nums =paper.chartsNumbser({'x':x,'y':y+10,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':24,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

    var worflow_process= workflowProcess(paper);//工作流流程情况
    var workflow_listLine=workflowListLine(paper);



       function readValue(){
        var datas = createDataTop10();
        worflow_process.inputData(datas);
        workflow_listLine.inputData(datas,getHH2());
        var sum=0;
           for (var i=0;i<datas.length;i++){
               sum+=datas[i].value;
           }
           nums.setValue(sum);
           pie.inputData(datas);
           setTimeout(function(){
             readValue();
          },3000); 
        }
        readValue();


}

function workflowListLine(paper){
  
  var x=1185;
  var y=1045
    return paper.chartListLineBar({
           'x':x,
           'y':y,
           'keys':global_config.workflow_names
    });
}


function createDataTop10(){
  var names=['CRM下单','服务单','资源变更单','流程启动','派单','归档']
  
   var  datas=[];
    for (var i=0;i<names.length;i++){
        datas.push({
              name:names[i],
              value:fRandomBy(30,425)
        })
    }
    return datas;
}

/**
   * 生成随便数
   */
  function fRandomBy(under, over){ 
       return parseInt(Math.random()*(over-under+1) + under); 
  } 


Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

function getMMSS(){
    var now=new Date();
    var mmss=now.Format('m:s'); 
    return mmss;
}
function getWeek(){
  var now=new Date();
  var day=now.getDay();
  var week;
  var arr_week=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
  week=arr_week[day]+" "+now.Format("yyyy-M-d");

  return week;
}

function getHH(){
  var now=new Date();
  var hh=parseInt( now.Format("hh"));
  if (hh<=11)
  {
          hh="";
  }else {
          hh="";
  }
  return now.Format("hh:mm")+hh;
}

function getHH2(){
  var now=new Date();
  var hh=parseInt( now.Format("hh"));
  if (hh<=11)
  {
          hh="";
  }else {
          hh="";
  }
  return now.Format("mm:ss")+hh;
}
function getSS(){
    var now=new Date();
      return now.Format("s.S");
}

function getWeek(){
  var now=new Date();
  var day=now.getDay();
  var week;
  var arr_week=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
  week=now.Format("yyyy-M-d");

  return week;
}

  function createLineBar(){
     var names=global_config.area_names;
     var  datas=[];
      for (var i=0;i<names.length;i++){
          
          datas.push({
                name:names[i],
                value:fRandomBy(10,100)
          })
          }
      
      return datas;
  }

function createListBar(){
   var names=global_config.area_names;
   var  datas=[];
    for (var i=0;i<names.length;i++){
        
        datas.push({
              name:names[i],
              value:fRandomBy(1000,15000)
        })
        }
    
    return datas;
}

  
  
  
