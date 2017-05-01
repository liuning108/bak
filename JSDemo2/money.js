var global_config={
   'cx':500,
    default_font:{'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font':{'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font2':{'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font3':{'fill':'#8eeefc','font-size':37,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font4':{'fill':'#feffd3','font-size':37,'font-family': '微软雅黑','font-weight':'bold'},  
   'title_font5':{'fill':'#d0fefe','font-size':37,'font-family': '微软雅黑','font-weight':'bold'}, 
   'area_names':['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通' ,'连云港' ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁']
};


//启动函数
window.onload=function(){
	  var paper = Raphael(0, 0, 1920, 1080); 
	      paper.setViewBox(0,0,1920,1080,true);
        moneyAnimation(paper)//计费
        areaTip(paper);//地区总账
        voiceBar(paper);//语音
        incrementBar(paper);//增值
        dataBar(paper);//数据
        netBar(paper);//短信
        periodicityBar(paper)//周期性
        linesAnim(paper); //各数据趋势图
        barsAnim(paper);//总账趋势图

        
}// end of onload

//总账趋势图
function barsAnim(paper){
    var x=20+global_config.cx;
    var y=820
    paper.drawLine({'x1':x-5,'y1':y-5-10,'x2':x+860,'y2':y-5-10,'w':1});
    paper.drawLine({'x1':x-5,'y1':y-10,'x2':x+860,'y2':y-10,'w':1});
     paper.drawLine({'x1':x-5,'y1':y-5-10+250,'x2':x+860,'y2':y-5-10+250,'w':1});
    paper.drawLine({'x1':x-5,'y1':y-10+250,'x2':x+860,'y2':y-10+250,'w':1});


    var title =paper.text(x+110+30+220,y-40,'总账').attr({'fill':'#c4ffff','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
    var title2 =paper.text(x+170+30+5+220,y-40,'趋势图').attr({'fill':'#daf6bc','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
    
    var  labelFont={'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
    var  valueFont={'fill':'#ffffa9','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};

    var lineTip= paper.animateLinebar({'debug':false,'x':x,'y':y,'w':850,'h':200,'item_nums':10,'point_r':2.5,'line_w':2,'point_color':"#e8ff9d",'line_color':'#1ededf','labelSpace':1,'labelFont':labelFont,'showvalue':'¥','valueFont':valueFont});
    
    function readValue(i){
     var value =paper.fRandomBy(50000,2000000);
        var time_now=getMD(i);
     lineTip.pushValue(value,time_now);
      setTimeout(function(){
          readValue(i+1);
      },3000);
   }

   readValue(0);
}

function linesAnim(paper){
  var x=250+global_config.cx;;
  var y=615;
   paper.drawLine({'x1':x-240,'y1':y-60,'x2':x+630,'y2':y-60,'w':1});
    paper.drawLine({'x1':x-240,'y1':y-5-60,'x2':x+630,'y2':y-5-60,'w':1});
  var title =paper.text(x+110+30,y-40,'各数值').attr({'fill':'#c4ffff','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
  var title2 =paper.text(x+170+30+12,y-40,'趋势图').attr({'fill':'#daf6bc','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});


 labelFont={'fill':'#ffffff','font-size':12,'font-family': '微软雅黑','font-weight':'bold'};
 
  //语音
  var voiceLineTip= paper.animateLinebar({'x':x,'y':y,'w':600,'h':129,'item_nums':24,'point_r':2.5,'line_w':2,'point_color':"#27ffeb",'line_color':'#27ffeb'});
  var label_voice = paper.text(x-215,y+10,'语音:').attr({'fill':'#27ffeb','font-size':19,'font-family': '微软雅黑','font-weight':'bold'});
  var nums_voice =paper.chartsNumbser({'showLabel':1,'x':x-115,'y':y+13,'value':4325,attrs: {'fill':'#27ffeb','font-size':19,'font-family': '微软雅黑','font-weight':'bold'}});
 

  //增值
  var incrementLineTip= paper.animateLinebar({'x':x,'y':y,'w':600,'h':129,'item_nums':24,'point_r':2.5,'line_w':2,'point_color':"#e3ff16",'line_color':'#e3ff16'});
  var label_increment = paper.text(x-215,y+10+40,'增值:').attr({'fill':'#e3ff16','font-size':19,'font-family': '微软雅黑','font-weight':'bold'});
  var nums_increment =paper.chartsNumbser({'showLabel':1,'x':x-115,'y':y+13+40,'value':4325,attrs: {'fill':'#e3ff16','font-size':19,'font-family': '微软雅黑','font-weight':'bold'}});

  //数据
  var dataLineTip= paper.animateLinebar({'x':x,'y':y,'w':600,'h':129,'item_nums':24,'point_r':2.5,'line_w':2,'point_color':"#cc5618",'line_color':'#cc5618'});
  var label_data = paper.text(x-215,y+10+40+32,'数据:').attr({'fill':'#cc5618','font-size':19,'font-family': '微软雅黑','font-weight':'bold'});
  var nums_data =paper.chartsNumbser({'showLabel':1,'x':x-115,'y':y+13+40+32,'value':4325,attrs: {'fill':'#cc5618','font-size':19,'font-family': '微软雅黑','font-weight':'bold'}});

  //短信
  var netLineTip= paper.animateLinebar({'x':x,'y':y,'w':600,'h':129,'item_nums':24,'point_r':2.5,'line_w':2,'point_color':"#acfff5",'line_color':'#acfff5','labelFont':labelFont,'labelSpace':3});
  var label_net = paper.text(x-215,y+10+40+32+32,'短信:').attr({'fill':'#acfff5','font-size':19,'font-family': '微软雅黑','font-weight':'bold'});
  var nums_net =paper.chartsNumbser({'showLabel':1,'x':x-115,'y':y+13+40+32+32,'value':4325,attrs: {'fill':'#acfff5','font-size':19,'font-family': '微软雅黑','font-weight':'bold'}});

  function readValue(){
     var voiceValue =paper.fRandomBy(5000,2000000);
     var incrementValue=paper.fRandomBy(5000,2000000);
     var datatValue=paper.fRandomBy(5000,1500000);
     var netValue=paper.fRandomBy(5000,1500000);

     var time_now=getMMSS();

      voiceLineTip.pushValue(voiceValue,time_now);
      nums_voice.setValue(voiceValue);

      incrementLineTip.pushValue(incrementValue,time_now);
      nums_increment.setValue(incrementValue);

      dataLineTip.pushValue(datatValue,time_now);
      nums_data.setValue(datatValue);

      netLineTip.pushValue(netValue,time_now);
      nums_net.setValue(netValue);

      setTimeout(function(){
          readValue();
      },1000);
   }

   readValue();
}



function periodicityBar(paper){

   var x =260+global_config.cx;;
  var y =498;
  var label= paper.text(x+15/2,y-175,'周期性').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var bar=paper.chartsBar({'x':x,'y':y,'w':15,'h':3,'array_y':[0,30,30+30,30+30+30,30+30+30+30,30+30+30+30+30]});
  var num = paper.chartsNumbser({'showLabel':1,'x':x+15/2,'y':y+20,'value':100100,  attrs: {'fill':'#fdffcf','font-size':22,'font-family': '微软雅黑','font-weight':'bold'}}); 
  function  readValue(){
     var value=paper.fRandomBy(100000,200000)
     num.setValue(value);
     bar.setValue(value,200000);
     setTimeout(readValue,3000);
  }
  readValue();

}
//短信
function netBar(paper){
  var x =150+global_config.cx;;
  var y =498;
  var label= paper.text(x+15/2,y-175,'短信').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var bar=paper.chartsBar({'x':x,'y':y,'w':15,'h':3,'array_y':[0,30,30+30,30+30+30,30+30+30+30,30+30+30+30+30]});
  var num = paper.chartsNumbser({'showLabel':1,'x':x+15/2,'y':y+20,'value':100100,  attrs: {'fill':'#fdffcf','font-size':22,'font-family': '微软雅黑','font-weight':'bold'}}); 
 
  function  readValue(){
     var value=paper.fRandomBy(100000,200000)
     num.setValue(value);
     bar.setValue(value,200000);
     setTimeout(readValue,3000);
  }
  readValue();
}

//数据
function dataBar(paper){
  var x =44+global_config.cx;;
  var y =498;
  var label= paper.text(x+15/2,y-175,'数据').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var bar=paper.chartsBar({'x':x,'y':y,'w':15,'h':3,'array_y':[0,30,30+30,30+30+30,30+30+30+30,30+30+30+30+30]});
  var num = paper.chartsNumbser({'showLabel':1,'x':x+15/2,'y':y+20,'value':100100,  attrs: {'fill':'#fdffcf','font-size':22,'font-family': '微软雅黑','font-weight':'bold'}}); 
  function  readValue(){
     var value=paper.fRandomBy(100000,200000)
     num.setValue(value);
     bar.setValue(value,200000);
     setTimeout(readValue,3000);
  }
  readValue();
}

//语音
function voiceBar(paper){
  var x =45+50+global_config.cx;;
  var y =248;
  var label= paper.text(x+15/2,y-175,'语音').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var bar=paper.chartsBar({'x':x,'y':y,'w':15,'h':3,'array_y':[0,30,30+30,30+30+30,30+30+30+30,30+30+30+30+30]});
  var num = paper.chartsNumbser({'showLabel':1,'x':x+15/2,'y':y+20,'value':100100,  attrs: {'fill':'#fdffcf','font-size':22,'font-family': '微软雅黑','font-weight':'bold'}}); 
  
  function  readValue(){
     var value=paper.fRandomBy(100000,200000)
     num.setValue(value);
     bar.setValue(value,200000);
     setTimeout(readValue,3000);
  }
  readValue();
}

function incrementBar(paper){
  var x =45+100+50+10+global_config.cx;;
  var y =248;
  var label= paper.text(x+15/2,y-175,'增值').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var bar=paper.chartsBar({'x':x,'y':y,'w':15,'h':3,'array_y':[0,30,30+30,30+30+30,30+30+30+30,30+30+30+30+30]});
  var num = paper.chartsNumbser({'showLabel':1,'x':x+15/2,'y':y+20,'value':100100,  attrs: {'fill':'#fdffcf','font-size':22,'font-family': '微软雅黑','font-weight':'bold'}}); 
  function  readValue(){
     var value=paper.fRandomBy(100000,200000)
     num.setValue(value);
     bar.setValue(value,200000);
     setTimeout(readValue,3000);
  }
  readValue();
}

function areaTip(paper){
   var x =685+global_config.cx;;
   var y =100;
   paper.drawLine({'x1':x-80,'y1':y+430,'x2':x+170,'y2':y+430,'w':1});
  paper.drawLine({'x1':x-80,'y1':y-10+430,'x2':x+170,'y2':y-10+430,'w':1});
   var lable_area = paper.text(x-3,y-46,'地区').attr({'fill':'#d0fefe','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});
   var lable_name = paper.text(x+120,y-46,'总账').attr({'fill':'#d7ffbc','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});

   var line1=  paper.drawLine({'x1':x-80,'y1':y-26,'x2':x+62,'y2':y-26,'w':2,'opacity':1,'removeflag':true});
   var line2=  paper.drawLine({'x1':x+62,'y1':y-26,'x2':x+192,'y2':y-26,'w':1,'opacity':1,'removeflag':true});

   var arrays_color=['#ec6941','#7dcad6','#cdde95','#ec6941','#7dcad6','#cdde95','#ec6941','#7dcad6','#cdde95','#ec6941','#7dcad6','#cdde95'];
   var items=[];
   for (var i =0;i<global_config.area_names.length;i++){
    var name=global_config.area_names[i];
    var keyvalue=paper.animateKeyValueTip({'x':x,'y':y+(i*33),'key':name,'color':arrays_color[i]});
    keyvalue.setValue(200000,paper.fRandomBy(100000,200000));
    items.push(keyvalue);
   }

    function getValue(){
       var value =paper.fRandomBy(100000,200000);
       var keyvalue=items[paper.fRandomBy(0,items.length-1)];
       keyvalue.setValue(200000,value);
    setTimeout(function(){getValue()},1000);
  }//end of tick;
     getValue();


}


function moneyAnimation (paper){
  var x  =395+55+global_config.cx;;
  var y  =260;

  paper.drawLine({'x1':x-440,'y1':y-230,'x2':x+430,'y2':y-230,'w':1});
  paper.drawLine({'x1':x-440,'y1':y-5-230,'x2':x+430,'y2':y-5-230,  'w':1});
  paper.rect(x+10+120+22,y-10,3,3).attr({'fill':'#ff5c3d','stroke-width':0});
  paper.rect(x+10+120+22,y-10-200,3,3).attr({'fill':'#e7e7cd','stroke-width':0});
  paper.rect(x-200,y-10-200,3,3).attr({'fill':'#7bc2c6','stroke-width':0});
  paper.rect(x-200,y,3,3).attr({'fill':'#7bc2c6','stroke-width':0});


  var moneyAnim=paper.animateMoneyCircle({'x':x,'y':y});
  var allmoney_nums=paper.chartsNumbser({'showLabel':1,'x':x+5,'y':y,'value':12345,  attrs: {'fill':'#b5f4eb','font-size':24,'font-family': '微软雅黑','font-weight':'bold'}});
 
  //draw label
    paper.text(x-20,y-185  ,'计').attr({'fill':'#b5f4eb','font-size':32,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(x+20,y-185  ,'费').attr({'fill':'#ecffae','font-size':32,'font-family': '微软雅黑','font-weight':'bold'});

    paper.text(x,y-30,'总账').attr({'fill':'#b5f4eb','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
 
  function getValue(){
    var allmoney =paper.fRandomBy(10000,200000);
    var targerMoney =300000;
    allmoney_nums.setValue(allmoney);
    moneyAnim.setBigValue(targerMoney,allmoney);
       setTimeout(function(){getValue()},2500);
  }//end of tick;
     getValue();

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

function getMD(i){
    var now=new Date();
    now=now.setDate(now.getDate()+i);
    now=new Date(now);
    var mmss=now.Format('M月d日'); 
    return mmss;
}
function getMMSS(){
    var now=new Date();
    var mmss=now.Format('m:s'); 
    return mmss;
}
