var global_config  ={
    'cy':40,
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
        paper.setSize('100%', '100%');

        var w=100;
        var h=100;
        
       drawElements(paper);//静态的点线标题
        //业务相关的
      shopingCar(paper);//购物车,宽带值,移动值
      informationOfAreas(paper);// 各地区指示
       orderAnimaTip(paper) //订单动画指标
       orderLineTip(paper); //订单趋势图
       animateMatrixs(paper);//渠道矩阵
 
        
       

}// end of onload

//静态的点线标题
function drawElements(paper){
  var x=40;
  var y=30;
  paper.drawLine({'x1':x-5,'y1':y,'x2':x+300,'y2':y,'w':1});
  paper.drawLine({'x1':x+300,'y1':y,'x2':x+550,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550,'y1':y,'x2':x+550+310,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22,'y1':y,'x2':x+550+310+22+280,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22+280,'y1':y,'x2':x+550+310+22+280+320,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550+310+22+280+320,'y1':y,'x2':x+550+310+22+280+320+355,'y2':y,'w':1});
  y=y+10;
  paper.drawLine({'x1':x-5,'y1':y,'x2':x+300,'y2':y,'w':1,});
  paper.drawLine({'x1':x+300,'y1':y,'x2':x+550,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550,'y1':y,'x2':x+550+310,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22,'y1':y,'x2':x+550+310+22+280,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22+280,'y1':y,'x2':x+550+310+22+280+320,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550+310+22+280+320,'y1':y,'x2':x+550+310+22+280+320+355,'y2':y,'w':1});
  y=y+970
  paper.drawLine({'x1':x-5,'y1':y,'x2':x+300,'y2':y,'w':1});
  paper.drawLine({'x1':x+300,'y1':y,'x2':x+550,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550,'y1':y,'x2':x+550+310,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22,'y1':y,'x2':x+550+310+22+280,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22+280,'y1':y,'x2':x+550+310+22+280+320,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550+310+22+280+320,'y1':y,'x2':x+550+310+22+280+320+355,'y2':y,'w':1});
  y=y+10;
  paper.drawLine({'x1':x-5,'y1':y,'x2':x+300,'y2':y,'w':1,});
  paper.drawLine({'x1':x+300,'y1':y,'x2':x+550,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550,'y1':y,'x2':x+550+310,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22,'y1':y,'x2':x+550+310+22+280,'y2':y,'w':1});
  paper.drawLine({'x1':x+550+310+22+280,'y1':y,'x2':x+550+310+22+280+320,'y2':y,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+550+310+22+280+320,'y1':y,'x2':x+550+310+22+280+320+355,'y2':y,'w':1});
   
  x=35;
  y=67;
  paper.text(x+40,y,'江苏省').attr({'fill':'#62a1b2','font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47,y,'电信').attr({'fill':'#edf4d2','font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+110,y,'大屏监控').attr({'fill':'#b7f3e9','font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47+120,y,'系统').attr({'fill':'#edf4d2','font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  paper.rect(x+40+47+120+22,y-10,4,8).attr({'fill':'#ff5c3d','stroke-width':0});
  paper.text(x+40+47+120+100+105,y+2,'Jiangsu').attr({'fill':'#52737c','font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47+120+100+105+63,y+3,'ODS').attr({'fill':'#62a6af','font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47+120+100+105+63+37,y+3,'69738').attr({'fill':'#dae4c1','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47+120+100+105,y+3+32,'ACTIVITY').attr({'fill':'#c0fff2','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+40+47+120+100+105+63+10,y+3+32,'SUMMARY').attr({'fill':'#3c7c86','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+35,y+3+32,'HUD').attr({'fill':'#e1efb6','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+35+55,y+3+32,'STATUS').attr({'fill':'#6ebcc9','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+35+55+90,y+3+32,'MONITOR FEED').attr({'fill':'#4a636a','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+35+55+90+390+3,y-2,'TIME').attr({'fill':'#5997a2','font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(x+35+55+90+390,y+10,'NO:').attr({'fill':'#eaf6d3','font-size':5,'font-family': '微软雅黑','font-weight':'bold'})
  showTime(paper,x+35+55+90+395,y);

  paper.drawLine({'x1':x+35+55+90+380,'y1':y+18,'x2':x+35+55+90+395+275,'y2':y+18,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+35+55+90+380,'y1':y+18+35,'x2':x+35+55+90+395+275,'y2':y+18+35,'w':1,'opacity':0.6});
  paper.drawLine({'x1':x+2,'y1':y+18,'x2':x+100,'y2':y+18,'w':1});
  paper.drawLine({'x1':x+2,'y1':y+18,'x2':x+2,'y2':y,'w':1});
  paper.drawLine({'x1':x+100,'y1':y+18,'x2':x+100+140,'y2':y+18,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+100+140,'y1':y+18,'x2':x+100+140+135,'y2':y+18,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+100+140,'y1':y+18,'x2':x+100+140,'y2':y,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+100+140+135,'y1':y+18,'x2':x+100+140+135+165,'y2':y+18,'w':1});
  paper.drawLine({'x1':x+100+140+135,'y1':y+18,'x2':x+100+140+135,'y2':y,'w':1});
  paper.drawLine({'x1':x+100+140+135+165/2-8,'y1':y+18,'x2':x+100+140+135+165/2-8,'y2':y+12,'w':1,'removeflag':true});
  paper.drawLine({'x1':x+100+140+135+165,'y1':y+18,'x2':x+100+140+135+165,'y2':y,'w':1});
  paper.drawLine({'x1':x+2,'y1':y+18+36,'x2':x+100,'y2':y+18+36,'w':1});
  paper.drawLine({'x1':x+2,'y1':y+18+36,'x2':x+2,'y2':y+18+20,'w':1});
  paper.drawLine({'x1':x+100,'y1':y+18+36,'x2':x+100+140,'y2':y+18+36,'w':1,'opacity':0.5});
  paper.drawLine({'x1':x+100+140,'y1':y+18+36,'x2':x+100+140+135,'y2':y+18+36,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+100+140,'y1':y+18+36,'x2':x+100+140,'y2':y+18+20,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+100+140+135,'y1':y+18+36,'x2':x+100+140+135+165,'y2':y+18+36,'w':1});
  paper.drawLine({'x1':x+100+140+135,'y1':y+18+36,'x2':x+100+140+135,'y2':y+18+20,'w':1,'opacity':0.4});
  paper.drawLine({'x1':x+100+140+135+165,'y1':y+18+36,'x2':x+100+140+135+165,'y2':y+18+20,'w':1});
  paper.drawLine({'x1':x+100+140+135+165+100+251,'y1':y+18+5,'x2':x+100+140+135+165+100+251+950,'y2':y+18+5,'w':1,'opacity':0.5,'removeflag':true});

  

}

function animateMatrixs(paper){
     var  x=581+16;
     var  y=438+global_config.cy;
     //draw heard Line
      var title_topLine=paper.drawLine({'x1':x-5,'y1':y-278,'x2':x+300,'y2':y-278,'w':1});
      var title_label1= paper.text(x+30,y-290,'CHANNEL').attr({'fill':'#77c6d3','font-size':12,'font-family': '微软雅黑','font-weight':'bold'});
      var title_label2= paper.text(x+30+60,y-290,'MATRIX').attr({'fill':'#e5f3b6','font-size':12,'font-family': '微软雅黑','font-weight':'bold'});
      var title_buttonLine=paper.drawLine({'x1':x-5,'y1':y-180,'x2':x+300,'y2':y-180,'w':1});
      var title = paper.text(x+150,y-240,'渠道矩阵').attr({'fill':'#e6f3bb','font-size':36,'font-family': '微软雅黑','font-weight':'bold'});
      var rect1=paper.rect(x+7,y-256,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect2=paper.rect(x+7,y-256+10,5,5).attr({'fill':'#c95433','stroke-width':0});
      var rect3=paper.rect(x+7,y-256+10+15,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect4=paper.rect(x+7+19,y-256+10+15,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect5=paper.rect(x+7+19+21,y-256+10+15,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect6=paper.rect(x+7+19+21-10,y-256+10+15+10,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect7=paper.rect(x+7+19+21-10-10,y-256+10+15+10,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect8=paper.rect(x+7+11,y-256,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect9=paper.rect(x+7+11+40,y-256,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect10=paper.rect(x+7+11+40+10,y-256,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect11=paper.rect(x+7+11+40+10+160,y-256,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect12=paper.rect(x+7+11+40+10+160+20,y-256+10,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect13=paper.rect(x+7+11+40+10+160+20,y-256+39  ,5,5).attr({'fill':'#c95433','stroke-width':0});
      var rect14=paper.rect(x+7+40+110+20,y-256+39  ,5,5).attr({'fill':'#58b9ca','stroke-width':0});
      var rect15=paper.rect(x+7+40+10+90+20,y-256+39  ,5,5).attr({'fill':'#c95433','stroke-width':0});
      var rect16=paper.rect(x+7+40+80+20,y-256+39  ,5,5).attr({'fill':'#c95433  ','stroke-width':0});

     //end of heard

     //运营中
     var operation = paper.text(x+70,y-130,'运营中:').attr({'fill':'#80e5ff','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});
     var operation_value=paper.chartsNumbser({'x':x+150,'y':y-130,'value':100,  attrs: {'fill':'#fdffcf','font-size':31,'font-family': '微软雅黑','font-weight':'bold'}});
     //停运的
     var stop = paper.text(x+70+140,y-130,'停:').attr({'fill':'#80e5ff','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});
     var stop_value=paper.chartsNumbser({'x':x+150+100,'y':y-130,'value':0,  attrs: {'fill':'#fdffcf','font-size':31,'font-family': '微软雅黑','font-weight':'bold'}});
  

     //draw rect line
     //setp1
     var line1=paper.drawLine({'x1':x+20,'y1':y-106,'x2':x+275,'y2':y-106,'w':1});
     var line2=paper.drawLine({'x1':x+20,'y1':y-106+10,'x2':x+275,'y2':y-106+10,'w':1});
     var line3=paper.drawLine({'x1':x+20,'y1':y-106,'x2':x+20,'y2':y-106+10,'w':1});
     var line4=paper.drawLine({'x1':x+275,'y1':y-106,'x2':x+275,'y2':y-106+10,'w':1});
     //setp2
     var line5=paper.drawLine({'x1':x+20+5,'y1':y-106+10-5,'x2':x+275/3,'y2':y-106+10-5,'w':2,'removeflag':true,'color':'#527980'});
     var line6=paper.drawLine({'x1':x+275/3,'y1':y-106+10-5,'x2':x+275/3+30,'y2':y-106+10-5,'color':'#83d8df','w':2,'removeflag':true});
     var line7=paper.drawLine({'x1':x+275/3+30,'y1':y-106+10-5,'x2':x+275/3+30+50,'y2':y-106+10-5,'color':'#4daab9','w':2,'removeflag':true});
     var line8=paper.drawLine({'x1':x+275/3+30+50,'y1':y-106+10-5,'x2':x+275/3+30+50+20,'y2':y-106+10-5,'color':'#edc7c4','w':2,'removeflag':true});
     var line9=paper.drawLine({'x1':x+275/3+30+50+20,'y1':y-106+10-5,'x2':x+275/3+30+50+20+80,'y2':y-106+10-5,'color':'#e6592e','w':2,'removeflag':true});
     //step3
     var line10=paper.drawLine({'x1':x+20,'y1':y-106,'x2':x+20,'y2':y-106-20,'w':1});
     var line11=paper.drawLine({'x1':x+185,'y1':y-106,'x2':x+185,'y2':y-106-20,'w':1});
     //end of draw rect line


    //CRM
    var crmMatrix=paper.animateMatrix({'x':x,'y':y});
    var crmLine = paper.drawLine({'x1':x,'y1':y-27,'x2':x+25+150+130,'y2':y-27,'w':1})
    var crm_title=paper.text(x+28,y-38,'CRM').attr({'fill':'#80e5ff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
    var crm_value=paper.chartsNumbser({'x':x+25+150+70,'y':y-38,'value':12345,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var crm_max_value=paper.chartsNumbser({'x':x+25+150+70+50,'y':y-38,'value':100,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var crm_space=paper.text(x+25+150+70+25,y-38,'/').attr({'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
    //集团
    x=581+16;
    y=438+156+global_config.cy;
    var groupMatrix=paper.animateMatrix({'x':x,'y':y});
    var groupLine =paper.drawLine({'x1':x,'y1':y-25,'x2':x+25+150+130,'y2':y-25,'w':1})
    var group_title=paper.text(x+28,y-38,'集团').attr({'fill':'#80e5ff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
    var group_value=paper.chartsNumbser({'x':x+25+150+70,'y':y-38,'value':0,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var group_max_value=paper.chartsNumbser({'x':x+25+150+70+50,'y':y-38,'value':100,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var group_space=paper.text(x+25+150+70+25,y-38,'/').attr({'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'})
    //电渠
    x=581+16;
    y=438+156+156+11+global_config.cy;
    var netMatrix=paper.animateMatrix({'x':x,'y':y});
    var netLine = paper.drawLine({'x1':x,'y1':y-27,'x2':x+25+150+130,'y2':y-27,'w':1})
    var net_title=paper.text(x+28,y-38,'集团').attr({'fill':'#80e5ff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
    var net_value=paper.chartsNumbser({'x':x+25+150+70,'y':y-38,'value':0,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var net_max_value=paper.chartsNumbser({'x':x+25+150+70+50,'y':y-38,'value':100,  attrs: {'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
    var net_space=paper.text(x+25+150+70+25,y-38,'/').attr({'fill':'#e6f3bb','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
    
    



     function readValue(){
  

     //crm
     var crmValue =fRandomBy(40,100)
     var crmPer=(crmValue/100)*100;
     console.log(crmPer);
     crmMatrix.setPer(crmPer);
     crm_value.setValue(crmValue);
     crm_max_value.setValue(100);

     //group
     var groupValue =fRandomBy(100,300)
     var groupPer=(groupValue/300)*100;
     groupMatrix.setPer(groupPer);
     group_value.setValue(groupValue);
     group_max_value.setValue(300);

     //group
     var netValue =fRandomBy(90,200)
     var netPer=(groupValue/200)*100;
     netMatrix.setPer(netPer);
     net_value.setValue(netValue);
     net_max_value.setValue(200);
     //运营中
     var operationValue=crmValue+groupValue+netValue;
     operation_value.setValue(operationValue);
     //停止
     var stop=600-operationValue;
     stop_value.setValue(stop);

      setTimeout(function(){
          readValue();
      },5000);
   }

   readValue();
}

//订单趋势图
function orderLineTip(paper){
  var x=41;
  var y=715+global_config.cy;
  //orderline Aniaml
  labelFont={'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
  var orderLineTip= paper.animateLinebar({'x':x,'y':y,'w':530,'h':90,'item_nums':24,'point_r':2.5,'line_w':2,'point_color':"#e8ff9d",'line_color':'#1ededf','labelSpace':3,'labelFont':labelFont});
  //max
  var max_value =paper.chartsNumbser({'x':x+80,'y':y-13,'value':0,  attrs: {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
  var max_label =paper.text(x+25,y-13,"MAX:").attr({'fill':'#9de6f9','font-size':14,'font-family': '微软雅黑','font-weight':'bold'})
  //min
  var min_value =paper.chartsNumbser({'x':x+80+150,'y':y-13,'value':0,  attrs: {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
  var min_label =paper.text(x+25+150,y-13,"MIN:").attr({'fill':'#9de6f9','font-size':14,'font-family': '微软雅黑','font-weight':'bold'})
  
  //draw line
  var line1 = paper.drawLine({'x1':x,'y1':y-35,'x2':x+25+150+353,'y2':y-35,'w':1})
  var line2 = paper.drawLine({'x1':x,'y1':y-32,'x2':x+25+150+353,'y2':y-32,'w':1,'opacity':0.5})

  var line3 = paper.drawLine({'x1':x,'y1':y-35+149,'x2':x+25+150+353,'y2':y-35+149,'w':1})
  var line4 = paper.drawLine({'x1':x,'y1':y-32+149,'x2':x+25+150+353,'y2':y-32+149,'w':1,'opacity':0.5})

  function readValue(){
     var orderValue =fRandomBy(1000000,2000000)
     var time_now=getMMSS(); // mm:ss 时间
      
      orderLineTip.pushValue(orderValue,time_now);
      
      max_value.setValue(orderLineTip.getMax());
      min_value.setValue(orderLineTip.getMin())
      setTimeout(function(){
          readValue();
      },1000);
   }

   readValue();


}
 

//订单动画指标
function orderAnimaTip(paper){
  var x=138;
  var y=204+global_config.cy;
  paper.text(x,y,'订单趋势图').attr({'fill':'#b7f5ea','font-size':30 ,'font-family': '微软雅黑','font-weight':'bold'});
  paper.drawLine({'x1':x-100,'y1':y-43,'x2':x-20,'y2':y-43,'w':1})
  paper.text(x-65,y-53,'source').attr({'fill':'#b7f5ea','font-size':12 ,'font-family': '微软雅黑','font-weight':'bold'});
  
  paper.drawLine({'x1':x-100+150,'y1':y-43,'x2':x-20+150,'y2':y-43,'w':1})
  paper.text(x-65+150+5,y-53,'status').attr({'fill':'#b7f5ea','font-size':14 ,'font-family': '微软雅黑','font-weight':'bold'});
  paper.drawLine({'x1':x-20+150,'y1':y-43,'x2':x-20+150+140,'y2':y-43,'w':1,'opacity':0.5})
  paper.drawLine({'x1':x-20+150+140,'y1':y-43,'x2':x-20+150+140+165,'y2':y-43,'w':1})
  paper.text(x-20+150+140+20,y-53,'DRN').attr({'fill':'#458f9c','font-size':12 ,'font-family': '微软雅黑','font-weight':'bold'});
  paper.text(x-20+150+140+20+50,y-53,'NUMBER').attr({'fill':'#a8e2d6','font-size':12 ,'font-family': '微软雅黑','font-weight':'bold'});
  paper.text(x-20+150+140+20+50+50,y-53,'HUD').attr({'fill':'#ffffff','font-size':12 ,'font-family': '微软雅黑','font-weight':'bold'});


  //draw radar
   x=281;
   y=356+global_config.cy;
  var radar=paper.animateRadar({'x':x,'y':y,'r':40});
  var bigCircle=paper.animateOrderCircle({'x':x+1,'y':y+102,'r':53,'speed':2000});
  //crm 
  var car_bar =paper.chartsBarcode({'x':x-40,'y':y+170,'w':124,'h':23,'item_nums':18,'item_space':0.8,'color':'#00feff','removefont':true});
  //集团
  var group_bar =paper.chartsBarcode({'x':x-40,'y':y+170+23+2,'w':124,'h':23,'item_nums':18,'item_space':0.8,'color':'#00feff','removefont':true});
  //电渠
  var net_bar =paper.chartsBarcode({'x':x-40,'y':y+170+23+2+25,'w':124,'h':23,'item_nums':18,'item_space':0.8,'color':'#00feff','removefont':true});
  //渠道量动画  
  var channel_databar=paper.animateDatabar({'x':x+120,'y':y+170+23+2+5,'w':45,'h':13,'item_nums':18,'item_space':0.8,'color':'#00feff'});
  var channel_value =paper.chartsNumbser({'x':x+125,'y':y+170+23+2+29,'value':0,  attrs: {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
  var channel_max_value =paper.chartsNumbser({'x':x+125+40,'y':y+170+23+2+29,'value':0,  attrs: {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'}});
  var channel_label =paper.text(x+145,y+170+18,'渠道量').attr( {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
  var channel_label2 =paper.text(x+145,y+170+23+2+29,"/").attr( {'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'});
  var channel_line = paper.drawLine({'x1':x+118,'y1':y+170+23+6,'x2':x+170,'y2':y+170+23+6,'color':'#057394','w':2,'removeflag':true})
  var channel_line2 = paper.drawLine({'x1':x+100,'y1':y+170+23+20,'x2':x+118,'y2':y+170+23+6,'color':'#057394','w':1,'removeflag':true})
  var channel_line3 = paper.drawLine({'x1':x+100,'y1':y+170,'x2':x+100,'y2':y+170+23+6+46,'color':'#057394','w':1,'removeflag':true})
  var channel_line4 = paper.drawLine({'x1':x+95,'y1':y+170,'x2':x+100,'y2':y+170,'color':'#057394','w':1,'removeflag':true})
  var channel_line5 = paper.drawLine({'x1':x+95,'y1':y+170+23+6+46,'x2':x+100,'y2':y+170+23+6+46,'color':'#057394','w':1,'removeflag':true})
  var channel_line6 = paper.drawLine({'x1':x-40,'y1':y+170+23+6+46+4,'x2':x+100,'y2':y+170+23+6+46+4,'color':'#057394','w':1,'removeflag':true})


  //订单量
  var orderAnim= orderTipAim(paper,x+145,y+46,2000000);
  var order_nums=paper.chartsNumbser({'x':x+165,'y':y+120,'value':0,  attrs: {'fill':'#ffffff','font-size':21,'font-family': '微软雅黑','font-weight':'bold'}});
  var order_label=paper.text(x+165,y+120-30,'订单量').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
  var order_nums_title=paper.chartsNumbser({'x':x+78,'y':y-89,'value':0,  attrs: {'fill':'#f1ffc3','font-size':30,'font-family': '微软雅黑','font-weight':'bold'}});
  var order_label_title=paper.text(x-50,y-89,'订单量:').attr({'fill':'#f1ffc3','font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  var order_databar=paper.animateDatabar({'x':x+75,'y':y+46,'w':35,'h':13,'item_nums':18,'item_space':0.8,'color':'#00feff'});
  var order_databar_line = paper.drawLine({'x1':x+60,'y1':y+46+6,'x2':x+123,'y2':y+46+6,'color':'#057394','w':'2','removeflag':true})
  var order_databar_label=paper.text(x+90,y+40 ,'data').attr({'fill':'#f1ffc3','font-size':12,'font-family': '微软雅黑','font-weight':'bold'});

  var vcolor="#057394"


  var vw=1.3;
  //drawLine;
  var channel_line7 = paper.drawLine({'x1':x-94,'y1':y+168+36+36,'x2':x-94,'y2':y+120,'color':vcolor,'w':vw,'removeflag':true})
  var channel_line8 = paper.drawLine({'x1':x-94,'y1':y+120,'x2':x-82,'y2':y+115,'color':vcolor,'w':vw,'removeflag':true})
  var channel_line9 = paper.drawLine({'x1':x-82,'y1':y+115,'x2':x-70,'y2':y+115,'color':vcolor,'w':vw,'removeflag':true})
  var channel_line10 = paper.drawLine({'x1':x+22,'y1':y+102,'x2':x+100,'y2':y+102,'color':vcolor,'w':vw,'removeflag':true})
  var channel_line11 = paper.drawLine({'x1':x+22,'y1':y+102+5,'x2':x+90,'y2':y+102+5,'color':vcolor,'w':vw,'removeflag':true})

  //draw curve
  var cure_style={'stroke':vcolor,'stroke-width':vw};
  var draw_cure_path1=paper.path(['M',x-70,y+115,'Q',x-69,y+70,x-30,y+40]).attr(cure_style);
  var draw_cure_path2=paper.path(['M',x-30,y+40,'Q',x-75,y-20,x-2,y-52]).attr(cure_style);
  var draw_cure_path3=paper.path(['M',x-2+8,y-52,'Q',x+75,y-20,x+32,y+40]).attr(cure_style);
  var draw_cure_path4=paper.path(['M',x+32,y+40,'Q',x+50+5,y+50,x+70,y+100]).attr(cure_style);
  var draw_cure_path5=paper.path(['M',x+100,y+102,'Q',x+100+20,y+90+5,x+100+20+5,y+80]).attr(cure_style);
  var draw_cure_path6=paper.path(['M',x+100+20+5,y+80,'Q',x+100+20,y+32,x+100+20+5+20,y+32]).attr(cure_style);
  var draw_cure_path7=paper.path(['M',x+90,y+102+5,'Q',x+90+20+5,y+102+5+10,x+90+20,y+102+5+33]).attr(cure_style);
  var draw_cure_path8=paper.path(['M',,x+90+20,y+102+5+33,'Q',x+90+16,y+102+5+33+15+10,x+90+20+20,y+102+5+33+33]).attr(cure_style);
  
  paper.circle(x+100+20+5+20+3,y+32,3).attr(cure_style);
  paper.circle(x+90+20+20,y+102+5+33+33,3).attr(cure_style);
  //draw Icon
  drawChannelIcon(paper,x-94,y+168,3);
  drawChannelIcon(paper,x-94,y+168+36,3);
  drawChannelIcon(paper,x-94,y+168+36+36,3);
  //drawText
  var fontstyle={'fill':'#e4f2b7','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
  paper.text(x-94+30,y+168,'CRM').attr(fontstyle);
  paper.text(x-94+30,y+168+36,'集团').attr(fontstyle);
  paper.text(x-94+30,y+168+36+36,'电渠').attr(fontstyle);
  //drawIcon 2
  drawChannelIcon(paper,x+54,y+65,2);
  drawChannelIcon(paper,x+54+9,y+65+15,2);
  drawChannelIcon(paper,x+54+9+5,y+65+15+13,2);

  //drawIconLine
  drawIconLine(paper,x-116,y+68,1000);
   drawIconLine(paper,x-116-10,y+68+10,1500);
    drawIconLine(paper,x-116-10-10,y+68+20,2000);
     drawIconLine(paper,x-116-10-10-10,y+68+30,800);
  //draw rect
   paper.rect(x-120,y+258,262,8).attr({'fill':'#135f5f','stroke-width':0});

  function readValue(){
      var crmvalue=fRandomBy(100,300);
      var groupvalue=fRandomBy(100,300);
      var netvalue=fRandomBy(100,300);
      var sum=crmvalue+groupvalue+netvalue;
      car_bar.setValue(900,crmvalue);
      group_bar.setValue(900,groupvalue);
      net_bar.setValue(900,netvalue);
      channel_databar.pushValue(sum); //渠道量动画 
      channel_value.setValue(sum);
      channel_max_value.setValue(900);
      var orderValue =fRandomBy(1000000,2000000)
      orderAnim.setValue(orderValue);
       order_nums.setValue(orderValue);
       order_nums_title.setValue(orderValue)
       order_databar.pushValue(orderValue);
      setTimeout(function(){
          readValue();
      },2500);
   }

   readValue();

}
//总订单量动画 //'#182022'
function orderTipAim(paper,x,y,maxvalue){ 
  
  var half_circle_path="m 0,0 4.64286,8.57143 18.21428,0.35714 c 8.26093,1.84266 21.42858,4.28571 21.42858,4.28571 10.9127,3.33447 26.10765,17.82093 24.64286,19.28572 l 4.28571,13.57143 c 2.08803,10.42665 1.81135,21.27178 1.04282,27.88969 -1.60658,6.3361 -2.22526,10.44582 -5.69877,14.915 -3.04978,6.9566 -7.13914,11.83405 -12.09331,14.98185 l -10.78092,7.8504 -13.8984,4.36306 -41.07143,-0.71429 10e-6,11.78571 c 14.67686,0.4106 27.56836,1.79044 48.21429,-0.35714 6.99224,-0.69167 13.84738,-1.65754 18.9681,-6.09226 l 7.69213,-6.54616 7.08933,-5.72243 7.16847,-9.30056 c 4.61298,-6.62443 6.83678,-13.24886 8.62525,-19.87329 2.38537,-10.91046 1.00761,-24.0788 -1.32899,-37.82244 -4.12817,-8.88653 -9.23345,-15.81883 -14.28573,-22.85714 -8.233,-7.16641 -18.37347,-12.5199 -26.42857,-15.71429 l -24.64286,-3.57142 c -7.22434,0.75185 -13.63687,0.88692 -21.78571,0.71428 z"
  var half_circle_bg_style={'fill':'#182022','stroke-width':0,'opacity':0.7};
  var half_circle_style={'fill':'#eeffbe','stroke-width':0};
  var half_circle_bg=paper.path(half_circle_path).attr(half_circle_bg_style);
  var half_circle=paper.path(half_circle_path).attr(half_circle_style);
  half_circle_bg.translate(x,y);
  half_circle.translate(x,y);
  var hcglow=half_circle.glow({'color':'#eeffbe'});
 
  var h=130;
  var clipRectArray=[-20,125,110,300];
  var glowArray=[x-20,y+140,130,400]
  console.log(clipRectArray.join(" "));
  half_circle.attr({'clip-rect':clipRectArray})
  hcglow.attr({'clip-rect':glowArray})
  paper.customAttributes.cliprectanim=function(cy){
      clipRectArray[1]=cy;
      half_circle.attr({'clip-rect':clipRectArray})
  }; 
  paper.customAttributes.cliprectanim2=function(cy){
      glowArray[1]=cy;
      hcglow.attr({'clip-rect':glowArray})
  }; 
   half_circle.attr({'cliprectanim':140});
   hcglow.attr({'cliprectanim2':y+140});

  function setValue(value){
    var base=h*(0.1);
    var base2=140*(0.15);
    var cy=125-base-(h*(value/maxvalue));
    var glow_cy=(y+140)-base2-(140*(value/maxvalue));
     half_circle.animate({'cliprectanim':cy},2000);
     hcglow.animate({'cliprectanim2':glow_cy},1400);
  }
  return {
    'setValue':setValue
  }
  


}



//画图标
function drawIconLine(paper,x,y,vtime){
    
    var  array=[x,y,55,3];
    var clipRect=array.join(' ');
    var style= {'fill':'#34768c','stroke-width':0,'clip-rect':clipRect};
    var rect=paper.rect(x,y,55,3).attr(style);
    var rect2=paper.rect(x-3,y-2,6,6).attr({'fill':'#7ecada','stroke-width':0});
    var time =vtime||1000;
    var vw=35;
    function tick(v){
       var  tick_array=[x+v,y,55,3];
       rect2.animate({'x':x+v},time);
       rect.animate({'clip-rect':tick_array.join(' ')},time,function(){
        if (v==vw){
          tick(0);
        }else{
          tick(vw)
        }
       });
    }//end of tick
    tick(vw);
}

function drawChannelIcon(paper,x,y,r){
  paper.circle(x,y,r).attr({'fill':'#fffeff','stroke-width':0});
  paper.circle(x,y,r+3).attr({'stroke':'#ffba00','stroke-width':1});
   
}


function drawCarLine(paper){
         var x = 920;
         var y = 160+global_config.cy;
         paper.drawLine({'x1':x,'y1':y,'x2':x+310,'y2':y,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y,'x2':x,'y2':y+105,'w':1,'removeflag':true})
         paper.drawLine({'x1':x,'y1':y+105+10,'x2':x,'y2':y+105+100+15,'w':1,'removeflag':true})
         paper.drawLine({'x1':x,'y1':y+105+100+15+10,'x2':x,'y2':y+105+100+15+109,'w':1,'removeflag':true});      
         paper.drawLine({'x1':x,'y1':y+105+100+15+109,'x2':x+310,'y2':y+105+100+15+109,'w':1,'removeflag':true})        
         paper.drawLine({'x1':x+310,'y1':y+105+100+15+109,'x2':x+310,'y2':y+105+100+15,'w':1,'removeflag':true})        
         paper.drawLine({'x1':x+310+12,'y1':y+105+100+15+109,'x2':x+310+12+312,'y2':y+105+100+15+109,'w':1,'removeflag':true})        
         paper.drawLine({'x1':x+310+12,'y1':y+105+100+15+109,'x2':x+310+12,'y2':y+105+100+15,'w':1,'removeflag':true})        
         paper.drawLine({'x1':x+310+12+312,'y1':y+105+100+15+109,'x2':x+310+12+312,'y2':y+105+100+15,'w':1,'removeflag':true}) 
         paper.drawLine({'x1':x+310+12+312+12,'y1':y+105+100+15+109,'x2':x+310+12+312+12,'y2':y+105+100+15,'w':1,'removeflag':true}) 
         paper.drawLine({'x1':x+310+12+312+12,'y1':y+105+100+15+109,'x2':x+310+12+312+12+310,'y2':y+105+100+15+109,'w':1,'removeflag':true}) 
         paper.drawLine({'x1':x+310+12+312+12+310,'y1':y+105+100+15+109,'x2':x+310+12+312+12+310,'y2':y+105+100+15,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312+12+310,'y1':y+105+100+15+109,'x2':x+310+12+312+12+310,'y2':y+105+100+15,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312+12+310,'y1':y+105+100+10,'x2':x+310+12+312+12+310,'y2':y+105+10,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312+12+310,'y1':y+105,'x2':x+310+12+312+12+310,'y2':y,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312+12+310,'y1':y,'x2':x+310+12+312+12,'y2':y,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312+12,'y1':y,'x2':x+310+12+312+12,'y2':y+10,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312,'y1':y,'x2':x+310+12+312,'y2':y+10,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12+312,'y1':y,'x2':x+310+12,'y2':y,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310+12,'y1':y,'x2':x+310+12,'y2':y+10,'w':1,'removeflag':true})
         paper.drawLine({'x1':x+310,'y1':y,'x2':x+310,'y2':y+10,'w':1,'removeflag':true})
         x=920;
         y=y+105+100+15+109+15;
         paper.drawLine({'x1':x,'y1':y,'x2':x+310,'y2':y,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y,'x2':x,'y2':y+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+10,'x2':x,'y2':y+106+106,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10,'x2':x,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106,'x2':x+310,'y2':y+106+10,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106,'x2':x+310,'y2':y,'w':1,'removeflag':true});

         x=920+322;
         paper.drawLine({'x1':x,'y1':y,'x2':x+310,'y2':y,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y,'x2':x,'y2':y+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+10,'x2':x,'y2':y+106+106,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10,'x2':x,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106,'x2':x+310,'y2':y+106+10,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106,'x2':x+310,'y2':y,'w':1,'removeflag':true});

         x=920+322+322;
         paper.drawLine({'x1':x,'y1':y,'x2':x+310,'y2':y,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y,'x2':x,'y2':y+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+10,'x2':x,'y2':y+106+106,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10,'x2':x,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10+106,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106+10+106,'x2':x+310,'y2':y+106+106+10,'w':1,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106+106,'x2':x+310,'y2':y+106+10,'w':1.5,'removeflag':true});
         paper.drawLine({'x1':x+310,'y1':y+106,'x2':x+310,'y2':y,'w':1,'removeflag':true});

         


              
}   
//购物车
function shopingCar(paper){
      drawCarLine(paper);
      drawCarIcon(paper) // 画购物车Icon
      var shoping_nums=drawShopingCarValue(paper); //购物车值
      var broadband_nums = drawBroadBandValue(paper);//宽带值
      var mobile   = drawMobileValue(paper);//移动值; 
    function readValue(){
    	var value1=fRandomBy(1000,5000);
    	var value2=fRandomBy(1000,5000);
    	broadband_nums.setValue(6000,value1);
    	mobile.setValue(6000,value2);
    	shoping_nums.setValue(value1+value2);
    	setTimeout(function(){
          readValue();
    	},3000);
    }
   readValue();
}


function drawMobileValue(paper){
	 var x = 982+230;
     var y = 245+15+60+global_config.cy;
	 var lable_title= paper.text(x,y," 移动:");
         lable_title.attr(global_config.title_font);
     return paper.chartsBarcode({'x':x+70,'y':y-25,'w':230,'h':54,'item_nums':18,'item_space':0.8,'color':'#e89e21','fontAttr':global_config.title_font2});
}


function drawBroadBandValue(paper){
	 var x = 982+230;
     var y = 245+15+global_config.cy;
	 var lable_title= paper.text(x,y," 宽带:");
         lable_title.attr(global_config.title_font);
     return paper.chartsBarcode({'x':x+70,'y':y-25,'w':230,'h':54,'item_nums':18,'item_space':0.8});
}

function drawShopingCarValue(paper){
	 var x = 982;
     var y = 245+global_config.cy;
	 var lable_title= paper.text(x+180,y-45,"购物车 :");
         lable_title.attr(global_config.title_font);
     var shoping_nums =paper.chartsNumbser({'x':x+300,'y':y-45,'value':4325,
   	                               attrs: {'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
     return shoping_nums;
}

//画购物车Icon
function drawCarIcon(paper){
  var x = 982;
  var y = 245+global_config.cy;
  var path ="m "+x+","+y+" 5.55584,-5.3033 64.14547,0.13476 6.56331,0.0138 3.03309,0.006 6.05983,0.0127 11.86924,0.0249 28.53721,0.06 8.5863,8.33376 -17.93021,50.50762 -98.23733,10.10153 z";
  var path2="m "+(x-15)+","+(y-25)+" 6.06091,0 26.76905,109.60155 98.99494,-0.25254 -1.26269,0"
  var carbasket=paper.path(path);
  var carbody=paper.path(path2);
  var carwheel_1 = paper.circle(x+24,y+100,7);
  var carwheel_2 = paper.circle(x+24+85,y+100,7);
  var carline  =paper.rect(x,y+15,130,1);
  var carhand = paper.rect(x-35,y-30,20,10,4)
  carbasket.attr({"fill":'none','stroke':'#fcffd0','stroke-width':"5"})
  carbody.attr({"fill":'none','stroke':'#fcffd0','stroke-width':"5"})
  carwheel_1.attr({"fill":'#fcffd0','stroke':'#fcffd0','stroke-width':"0"});
  carwheel_2.attr({"fill":'#fcffd0','stroke':'#fcffd0','stroke-width':"0"});
  carline.attr({"fill":'none','stroke':'#fcffd0','stroke-width':"2",'opacity':0.8});
  carhand.attr({"fill":'#e6592e','stroke':'#e6592e','stroke-width':"0"})
}

//各地区指标
function informationOfAreas(paper){
	var x =982;
	var y= 399+global_config.cy;

	var areas=[];
 
 var nj_area = paper.chartsArea({'x':x,'y':y,'are_name':'南京','path':'m 0,0 -4.25,4 5.25,3.75 -1.75,3.25 1.5,4 5.5,-0.5 0,8 2.75,2.5 -0.5,3.75 -2,1.5 -2.75,2 2,1.5 -0.25,3 1.25,0.5 -2.75,5.75 -6.25,1 -7.25,0.75 0.5,7.5 -9,5.5 -0.5,7.25 -1.5,5.5 3,6 2.75,-0.25 2.5,2.5 -0.25,2.5 3.5,1.25 -2.25,5.75 4.5,2.75 1,3.5 4,-2 3.75,-0.25 2.25,2.75 1.5,0.5 0.5,3 -3.75,2 1.5,3.5 6.25,1.75 1.25,-4.75 2.75,-0.75 0.5,2.5 1.75,3.25 4,0 2.75,13 -2.75,12 -7.25,3.25 -0.5,-2.75 -6,9.75 4.5,2.5 4,5 10.75,-1.5 16,0.75 3.25,-6 4.5,-3.25 1.25,-5.25 -5.75,-7 -0.75,-2 2.75,-5.75 1.25,-1.75 0,-3.75 3,-3.25 1.75,-3 -3,-1.5 -3,-7.5 -11,-11.5 -5.5,3.25 1.75,-3.25 -2.25,-3.25 10,-3 3,-6.25 -7.5,-3 6.75,-4 -2.75,-9.75 0,-2.5 -3,-1.5 -2.75,-1.5 1,-1.25 3.5,-3.5 8,-2 4.5,-0.5 2,-3.75 -14.5,-2.25 -2.5,-6.75 -0.75,-5.75 -1.75,-3 0,-2.25 1,-4.5 3.25,-1 -0.5,-4 -5.75,-2.25 -1.25,1.25 -3.5,-5.5 -3.25,0 -0.25,-0.25 2.5,-3.75 -5.75,2.75 -2.75,-1.25 -0.25,-3 -1.75,3 -2.5,-1 0.25,-2.25 -2,2.5 -2.5,-2.75 -2,0.75 -3,0.75 -3,1 z'});
 areas[areas.length]=nj_area;
 
 var xz_area = paper.chartsArea({'x':x+332,'y':y,'are_name':'徐州','cxcy':[170,20],'path':'m 0,0 1.25,-4.375 4.625,1.125 1.125,-1.625 3.375,-0.125 4.5,0.25 1.125,-1.5 5.25,3.625 5.125,-4.75 3.75,3.375 1,-0.375 0.5,-1.125 0.75,-2 4.5,0.5 2.25,4.125 -2.375,1.875 -0.25,3.125 -2.125,0.875 1,4.750001 -5.125,0.75 -1,14.25 -4.875,0.625 0.125,6 -2.375,0.375 0.125,1.25 -10,-2.75 -8.875,-0.25 -2.75,-4.5 -6.125,-0.125 0.25,2.75 -3.375,-0.375 -2.875,-2.875 -2.75,3.25 -4,-0.125 1.125,6.375 3.875,-0.125 0.75,8.625 -3.625,0 5.125,4.75 0.625,2.625 2,0.5 1,-2.875 4.5,11.5 1.125,1.875 -1,2.75 -1.125,-0.375 0.25,5.25 0.625,1.75 -6.375,-1 -4.625,1.125 -6.25,-0.125 -2.375,2.75 -3.125,-0.375 -1.625,1.5 -3.5,-1.875 -6.5,1.875 -2.375,-1 2,-16.75 -4.125,0.25 -2.125,-2.875 0,-2.125 -1.375,-0.75 -0.75,-7.625 -4.5,-3 0.125,2.25 -2,2 0.25,2.5 -2.75,-0.5 0.125,-2.125 -1,-2.125 -0.625,-4.5 -3.375,-0.125 -2.25,2.5 -3.375,2.5 -3.375,-1 -2.125,-6.125 -4,1.25 -7.25,0.625 -6.375,-1.75 -3.625,-4.875 -4.75,-2.5 -2.75,-5.25 1,-4.125 -4.625,-5.375 0,-8.625001 -1.375,-1.375 -0.625,-2.875 -5.5,-0.75 -1.875,1.25 -3.75,0.25 -3.75,-5.5 -2.375,-4.375 -12.625,-1.5 -3,-0.125 2.625,-2.5 -3.375,-4.5 -2.375,0.625 -4.5,-6 0,-2.5 -3.125,-1.25 -0.5,-3 -3.625,2.25 -1.875,-1 1.75,-6.25 -1.75,-3.25 0.375,-2.25 3.125,0 -0.5,-7.25 1.25,-1.375 -0.5,-3.75 3.625,-5.125 4.875,0.625 9.75,-3.5 7.875,-0.5 4.125,2 1.875,-2.875 10,4.375 3.875,1.125 1.875,10.625 5.625,1.375 0.25,5.25 1.375,-0.75 2.125,6.375 -2.25,2.125 0.875,3.625 2.625,-0.875 2.25,0 2.875,15 2.375,2.75 2.25,4.375 2.25,-1.375 0.5,-2.875 1.375,-1.25 0.125,-7.75 2.625,-0.875 6.25,-1.125 2.375,2.125 -0.5,2.625 c 0,0 4.625,3.125 5,4.5 0.375,1.375 2.125,3.875 2.125,3.875 l 5.5,-0.75 2,1.625 2.125,-2.125 5,-2.375 1.875,-5.75 8.25,3.75 1.625,-0.25 -0.25,-14.5 8.5,-0.5 1,-2 1.375,-0.25 5.5,-0.25 1.625,3.5 1.5,-1.375 6,0.5 -0.25,2.125 1.375,2.125 -2.875,5.25 8.375,2.625 -0.625,3.875 -3,2.5 3.25,4.5 -0.75,7 z'});
 areas[areas.length]=xz_area;
 
 var sq_area = paper.chartsArea({'x':x+332+320,'y':y-8,'are_name':'宿迁','cxcy':[130,-45],'path':'m 0,0 6.01041,2.474873 4.06586,2.651651 3.71231,-4.242641 4.06587,-3.005204 5.12652,0.883884 0.88388,-1.767767 2.2981,2.298097 2.2981,-2.298097 1.41421,-2.474874 2.47487,0 1.41422,-2.12132 1.23743,0.707107 -0.17677,8.308504 1.94454,0.353554 -1.06066,8.838837 1.76777,0 0.53033,5.83363 2.65165,0 c 0,0 1.59099,4.24264 1.59099,4.77297 0,0.53033 -0.88388,3.0052 -0.88388,3.0052 l 2.82842,1.41422 -1.06066,8.48528 -9.72272,9.01561 1.23744,3.0052 -3.88909,5.48008 -3.18198,-2.82843 -6.89429,3.53554 -4.24264,3.18198 -3.18198,4.77297 0.35355,4.59619 0.70711,8.30851 -1.23744,1.06066 0,3.71231 -2.82842,1.23743 0.53033,4.41942 2.47487,2.47488 -2.2981,16.44023 -2.82842,3.88909 3.0052,4.41941 -22.45064,11.13694 -6.01041,5.83363 -15.55635,1.23743 -2.82842,0.53033 -3.18198,-3.35875 -1.59099,0.88388 -0.88389,4.41942 -9.01561,4.24264 -4.24264,-4.94975 -0.17678,-4.94975 -2.65165,-1.06066 -1.41421,-1.06066 0.53033,-3.18198 3.18198,-6.01041 -1.23744,-3.53553 2.65165,-0.17678 2.2981,-3.71231 -1.06066,-4.59619 3.0052,-7.6014 3.35876,0.88388 1.06066,-14.84924 4.77297,-4.77297 -0.17677,-6.36396 3.0052,-1.23744 -1.41421,-2.12132 -1.94455,-4.59619 1.06066,-3.0052 1.41422,0.7071 -5.12653,-15.9099 -1.06066,2.47487 -1.76776,0 -0.17678,-3.0052 -4.77297,-2.65165 -0.17678,-2.47487 3.18198,-0.70711 -1.59099,-7.95495 -4.06586,0.35355 -0.53033,-5.83363 5.48007,-0.88388 0.70711,-1.94455 3.18198,3.88909 4.24264,-1.41421 -0.17677,-1.76777 5.12652,-0.17678 1.41421,4.94975 19.97577,1.76777 3.18198,-1.06066 0.35355,-6.01041 4.77298,0 -0.53034,-11.66726 0.35356,-3.35876 4.59619,-1.06066 0.88389,-4.065864 z'});
 areas[areas.length]=sq_area;

 var haPath ="m 0,0 5.3033,7.42462 4.94975,-0.35355 1.23743,1.23743 6.36397,-0.88388 2.82842,6.54074 8.30851,-6.18719 3.71231,4.06587 1.06066,0 1.23744,0 0,3.88909 1.94454,2.47487 1.76777,-1.06066 0.35355,4.06586 -1.23744,2.47488 -6.89429,6.89429 -3.35876,8.13173 0.35356,3.88908 -3.18198,2.12132 1.41421,4.94975 -2.65165,1.94454 3.71231,14.84925 9.36917,6.71751 -0.53033,3.35876 -4.06587,1.59099 -1.23744,-1.23744 -4.77297,-0.17677 -2.65165,2.82842 -18.73833,3.35876 2.12132,5.83363 -9.54594,1.76777 0.70711,2.47487 -1.94454,1.41422 1.59099,5.3033 5.83363,-0.53033 0,6.71751 6.89429,0.35355 3.18198,8.48529 1.94454,2.47487 -3.18198,3.88909 -0.88388,19.09188 -16.44023,1.41421 -5.48008,-7.07107 -0.17678,-3.18198 -2.82843,0.53033 0.35356,-3.0052 -0.53033,-2.65165 -9.8995,2.47487 -1.06066,-2.12132 -3.35875,0 0.17677,5.3033 -2.82843,-0.35355 -0.17677,6.18719 -4.41942,0.35355 -1.94454,7.07107 1.41421,4.24264 0.35355,2.82842 -2.65165,1.41422 -5.65685,-1.59099 -3.0052,0 0,1.06066 -4.24264,0.53033 -2.12133,-0.88389 -6.36396,1.23744 -2.29809,-1.41421 -1.41422,1.76776 -5.3033,-0.35355 -0.35355,-4.06586 -2.12132,-0.88389 -1.76777,-1.59099 -1.94454,-1.06066 0.88388,-3.35875 -3.71231,-4.24264 -1.41421,-8.48529 5.83363,-4.06586 -4.5962,-2.12132 -2.65165,-10.25305 0.35356,-10.25305 2.65165,-3.71231 13.96536,1.76777 7.77817,-8.30851 21.92031,-9.54594 -2.82843,-4.77297 5.48008,-19.97576 -3.71231,-6.01041 2.82843,-2.2981 -1.06066,-4.06586 2.65165,-2.47488 -1.76777,-8.13172 0.88388,-4.24264 5.48008,-7.42463 4.06587,-0.35355 4.77297,-3.18198 2.29809,2.47487 4.77297,-5.65685 -1.41421,-2.47487 9.72272,-11.66727 z"
 var ha_area = paper.chartsArea({'x':x+332+320,'y':y-130,'are_name':'淮安','cxcy':[140,-55],'path':haPath});
 areas[areas.length]=ha_area;
 
 var yzPath = "m 0,0 3.35875,5.65686 -9.01561,0.88388 -0.7071,2.12132 -1.06066,2.65165 0,2.65165 6.54073,1.94455 -0.35355,4.06586 7.07107,3.88909 5.12652,9.36916 -3.0052,4.5962 -1.06066,18.9151 -10.42983,0.53033 1.94455,14.31891 -1.76777,3.00521 2.47487,4.94975 -0.53033,5.48007 -2.12132,-3.35875 -1.76776,2.47487 -1.41422,0.70711 1.06066,4.41941 -5.12652,6.18719 -1.76777,2.65165 -0.88388,-2.65165 -3.35876,2.2981 -0.88388,6.0104 2.12132,2.2981 -1.59099,4.77297 1.76776,9.54594 13.08148,2.65165 5.3033,-1.41421 10.25305,0.88388 5.3033,-4.06586 6.36396,0.88388 3.71231,-4.06586 0.17678,4.94975 5.3033,-1.06066 6.89429,-3.53554 2.12132,-3.18198 6.18719,1.41421 3.18198,-1.94454 -1.41422,-3.53553 2.12132,-2.2981 -1.23743,-2.2981 1.94454,-1.94454 -1.23744,-4.41942 -3.88909,-1.76776 0.70711,-6.71752 1.94455,-0.53033 -1.59099,-2.82843 -0.70711,-7.42462 4.77297,0.53033 4.06586,0.17678 -3.18198,-5.12652 -2.47487,0 2.47487,-3.18199 -3.35875,-5.12652 1.23743,-3.0052 -2.65165,-0.70711 -0.35355,-2.65165 -2.47488,-0.35355 -0.17677,-10.96016 -5.83363,0.70711 -2.47488,-4.5962 1.23744,-3.88908 -0.70711,-3.88909 -0.88388,-3.35876 0,-4.06586 -3.35876,-1.06066 -1.06066,-5.48008 6.18719,-7.42462 -1.59099,-2.65165 2.65165,-4.77297 -5.65686,-0.70711 -1.59099,-5.65685 -1.76776,0.7071 -1.06066,-5.83363 -1.59099,0 -3.88909,-3.53553 z"
 var yz_area = paper.chartsArea({'x':x,'y':y+130,'are_name':'扬州','cxcy':[100,-40],'path':yzPath});
 areas[areas.length]=yz_area;
 
 var zjPath ="m 0,0 -4.59619,3.53553 -4.77297,-1.59099 -7.24785,4.5962 -11.13693,-1.23744 -2.12132,4.06586 -9.89949,1.23744 -7.77818,7.77817 6.18719,0.53033 2.12132,3.00521 -1.41422,6.54074 2.2981,4.41941 -5.83363,0.88389 -0.70711,3.71231 5.3033,0.35355 1.06066,4.41942 -1.76776,3.53553 -1.23744,-0.35355 -8.83884,2.82843 1.76777,4.59619 -0.35355,3.18198 6.71751,-2.47487 7.6014,9.72272 2.47487,0.88388 -0.35355,4.77297 3.0052,2.82843 6.36396,-3.18198 2.65166,-5.65686 0.88388,-2.65165 -3.00521,-1.06066 0.88389,-7.77817 2.82843,-5.3033 6.54073,3.53553 1.94455,0.35355 -1.41422,-4.41941 2.65165,-2.12132 3.88909,4.06586 4.24264,-1.76777 4.5962,6.89429 1.94454,0 3.0052,3.71231 2.12132,-0.35355 2.2981,3.53553 1.76777,-0.53033 0.17677,-5.65685 0.88389,-1.41421 2.82842,-0.17678 2.65166,-4.94975 -4.5962,-0.53033 -1.06066,-3.71231 2.82843,-3.53553 -1.59099,-3.00521 2.82842,-11.3137 6.71752,0.53033 2.82843,4.59619 5.48007,0 -7.07106,-16.79379 -2.2981,-11.3137 -7.42462,-5.12653 -4.06587,0.35355 -9.01561,5.30331 -0.7071,4.94974 -1.23744,-4.41941 -3.71231,0.17677 z"
 var zj_area = paper.chartsArea({'x':x,'y':y+130+110,'are_name':'镇江','cxcy':[140,-10],'scale':[0.7,0.7],'path':zjPath});
 areas[areas.length]=zj_area;

 var czPath ="m 0,0 1.875,6.625 -2,5.75 -1,3.75 4.75,0.75 6.5,-3.25 5.5,-0.5 -0.75,3.75 3.5,8.5 -5.25,1 0,6.5 -2.75,1.5 -1,4.75 -4.25,4.75 2.75,3 2.25,7.625 0,0 0,0 0,0 0,0 m -8,-52.625 -4.25,-3.75 -4,1 -5,-6.5 -4.5,0 -3.75,7 0.25,5.25 2.25,2 -1.75,3.25 -2,2 2.5,2.5 3,-0.25 -1.5,4.5 -2.75,0.75 -2.5,6 -0.75,2 -7.5,-6.75 -6.5,-8 -5.5,2.25 -4,-4.5 -2.75,2 2.75,5.25 -5.5,-2 -3.25,-2.75 -2.5,7 -0.25,5.25 1.5,2.5 0.25,5.75 -5.25,5.75 -3,-0.25 -1,3.75 -3.5,6 1.25,2.5 -4.5,2.75 -0.25,5.25 2.5,0.25 0,4.75 4.5,4.5 -3.25,4.75 3.75,4.75 5.5,1 1.5,-1.5 2.25,0.75 1,-4.5 2.25,2.25 -0.5,5.75 0.5,3.25 3.75,0 -2.5,2 3.75,0.25 2.5,3 1.5,-1.75 5,1.25 0.75,-3.75 0.75,-3.5 -3.25,-2.75 2,-4.25 -3,-2.5 3.25,-13 2.75,-1 0.5,-3.25 -2,0.25 0.75,-4.5 3.5,-5 2.5,-2 0.5,-3.75 3,0.5 2.75,5.5 5.25,-0.5 4,2 3.75,-1.5 6,0.25 4.75,5 1.5,-0.25 2.5,3 -2.5,12.25 2.75,2.5 4.25,-0.25 0,-1.75 -4.75,-0.5 0.25,-5 0.5,-4.25 5.25,-1.75 0,-3.75"
 var cz_area = paper.chartsArea({'x':x,'y':y+130+110+110,'are_name':'常州','cxcy':[155,-20],'scale':[0.6,0.6],'path':czPath});
 areas[areas.length]=cz_area;
 
 var wxPath ="m 0,0 1.5,-7.25 -2.75,-1 1,-6.25 -2.75,-2 3.75,-12.5 2.75,-1 1,-3 -2.25,-0.5 0,-3 2.5,-4.5 3.75,-3.5 0,-3.5 2.75,-0.5 2.75,3.75 1,2.75 3.25,-1.25 4.75,1.75 3.75,1.75 2.25,-1.75 5.5,-0.25 4,4.5 3,0.75 1.25,4.5 -2.75,10.75 5,2.5 2,-0.5 0.75,-2.25 -4.25,-0.25 -1,-4 0.75,-3.5 4.75,-3.75 1,-4.5 0.75,-0.75 -2.5,-1.5 -0.25,-2.5 -2.75,-0.5 -1.25,-1.75 2,-5 3.25,-1.25 0.25,-5.5 2.5,-1 0,-6.25 4.25,-1.25 -2.75,-6 2.25,-4.75 -1.75,-0.75 -3.5,0 -2.75,1.5 -2.75,1.25 -1,2 -2.75,-1.5 -2.75,0.25 0.75,-2.5 1.5,-2 -1.25,-2.75 2,-3.25 -1.25,-3.5 3.75,-0.75 6,3.25 9.25,1 11,-6.75 0.75,3.75 1.25,3.75 -1,1.25 3,1 6,2.75 1.75,4 1.75,0.5 0,5.5 4.25,-0.25 1.5,3.75 -1.75,2.5 2.5,4 -2.25,1.5 -1,3.25 2.25,3 -3,1.75 -2,2.25 c 0,0 0.75,0.75 2,0.75 1.25,0 3.75,-0.5 3.75,-0.5 l -0.25,5.75 -1.75,1.25 -3,3.25 -1.5,3 -5.75,1 -5.5,1.5 -10,5.25 -3.75,2.75 -9.75,10.5 -9.25,1 -6.25,9 c 0,0 -3.75,0.25 -5.25,-0.25 -1.5,-0.5 -5.5,-0.5 -5.5,-0.5 l -0.25,2 -2.5,-2.25 -3,0 -2.5,1.5 -3,0 -2,2.75 -1.5,1.5 -2.75,0.25 -1.75,-1.25 -1.25,-1 z"
 var wx_area = paper.chartsArea({'x':x+330,'y':y+130+110+110,'are_name':'无锡','cxcy':[90,60],'scale':[0.6,0.6],'path':wxPath});
 areas[areas.length]=wx_area;

 var szPath ="m 0,0 -6.18719,6.18718 2.82843,6.36396 -1.59099,1.41422 11.49048,6.89429 1.94455,4.41942 -0.53033,3.18198 4.59619,-0.17678 1.23744,4.94975 -1.23744,1.41421 1.59099,2.82843 -3.35875,4.24264 3.0052,1.94454 -0.70711,3.18198 -4.24264,0.70711 1.06066,3.0052 4.41942,-1.06066 -0.70711,6.89429 -3.53553,1.591 0.17678,2.82842 -4.77298,2.82843 -12.72792,3.53553 -10.78338,6.89429 -8.66205,9.36917 -9.54595,1.59099 -6.71751,8.66206 7.42462,16.61701 10.78338,8.48528 19.62221,-1.41422 -1.23743,6.54074 4.77297,-1.23743 -0.17678,-3.71231 2.12132,2.29809 4.59619,16.61701 8.48529,-9.89949 4.06586,0 3.0052,-2.47488 1.76777,1.41422 1.94454,-4.06587 -2.65165,-6.36396 2.65165,-1.94454 2.47488,3.18198 3.35875,-5.65686 3.88909,0.88389 5.48008,0.35355 0.53033,-12.72792 -3.71231,0.17678 1.94454,-3.53554 11.31371,0.17678 4.94975,-0.70711 -1.41421,-12.9047 1.41421,-0.88388 0.70711,-2.47487 5.65685,2.12132 -2.47487,-3.35876 0,-3.88909 -1.76777,-1.41421 4.06586,-3.71231 -0.35355,-4.94975 8.13173,-6.18718 2.12132,2.29809 9.89949,-7.07107 -25.98617,-26.5165 -16.08668,-4.06586 -9.01561,-19.79899 z"
 var sz_area = paper.chartsArea({'x':x+330,'y':y+130+110,'are_name':'苏州','cxcy':[110,-47],'scale':[0.45,0.45],'path':szPath});
 areas[areas.length]=sz_area;

 var ntPath ="m 0,0 0,-9.01561 5.3033,-0.17678 3.35876,-3.0052 6.71751,1.59099 3.18198,6.71752 5.48008,-0.88389 0.70711,-1.06066 4.41942,0 3.0052,-1.59099 0.70711,5.83363 2.65165,-1.23743 0.7071,3.88908 1.23744,0.53033 2.47487,-3.53553 2.47488,1.94454 2.12132,0.17678 0,-1.23744 4.24264,0 -0.17678,1.94455 4.24264,-2.2981 5.12653,-2.82843 7.07106,-2.82843 7.24785,8.48529 29.52171,12.02081 5.12652,33.4108 21.92031,7.95495 15.2028,26.69328 1.23743,8.13173 -1.76776,6.18718 -3.71231,5.3033 -3.53554,1.06066 -13.08147,-4.59619 -32.35014,-20.15254 -16.08668,10.6066 -14.14213,-3.88909 -13.61181,-21.03643 -19.62221,-0.7071 0.70711,-3.71231 -3.35876,-2.65165 0,-2.65166 -13.61181,-3.88908 -1.06066,-4.94975 2.65165,-6.18718 -2.12132,-2.12132 1.59099,-7.42463 -1.76776,-2.29809 1.41421,-1.94455 -1.23744,-1.41421 -3.35876,1.06066 -4.06586,-14.67247 0.88388,-0.53033 -1.23743,-10.78337 z"
 var nt_area = paper.chartsArea({'x':x+330,'y':y+130,'are_name':'南通','cxcy':[50,-25],'scale':[0.45,0.45],'path':ntPath});
 areas[areas.length]=nt_area;

 var ycPath="m 0,0 1.95562,15.2828 -20.85998,21.53485 -10.42998,3.47337 9.12624,32.64961 10.42999,13.19878 -17.60062,32.64961 -6.51873,11.11477 7.17061,26.39756 11.73374,9.03074 0,15.97748 16.29685,11.80943 -1.95561,15.97747 13.03748,4.86271 16.94874,-2.77869 14.34124,-0.69467 23.46747,2.08401 6.51875,30.5656 -18.25249,23.61887 8.47437,6.25206 -13.03749,14.58812 5.21499,10.4201 11.08187,-4.86271 9.77812,-9.72542 7.82249,-1.38935 14.34123,3.47336 2.6075,5.55739 18.90436,8.33607 27.37873,-6.94673 -7.17062,-24.31354 11.08186,-11.80944 -12.38561,-24.31354 -9.77812,-3.47337 -9.12624,-22.22952 3.25937,-12.50411 -7.17061,-6.25205 -6.51875,2.08401 -14.99311,-54.87914 -1.30375,-13.19878 -3.91125,-4.86271 -7.82249,-20.84018 -23.46747,-64.60455 -23.46748,-15.28279 -37.80872,-18.0615 z";
 var yc_area = paper.chartsArea({'x':x+330+320,'y':y+130,'are_name':'盐城','cxcy':[50,-130],'scale':[0.2,0.2],'path':ycPath});
 areas[areas.length]=yc_area;

 var tzPath ="m 0,0 -5.83363,8.30851 0.53033,6.36396 3.53554,0 0,4.94975 0.88388,0.53033 -0.35355,2.12132 1.76776,1.94454 -2.29809,4.5962 2.29809,4.24264 -0.17677,3.18198 3.88908,-1.06066 0.35356,-1.41422 3.0052,1.23744 -0.53033,5.48008 -0.17678,4.94975 2.82843,0 0.53033,2.65165 2.47488,0.17677 -0.88389,4.06587 -0.88388,-0.17678 3.53553,6.71751 2.47488,7.07107 -6.01041,-2.65165 -2.82843,1.76777 0.88388,2.82843 0,1.94454 1.94455,3.18198 -1.94455,3.35876 0.17678,6.71751 3.71231,0.35355 -0.17677,4.24265 -1.59099,0.7071 1.76776,4.06587 -1.41421,1.41421 0.35355,4.24264 -2.47487,1.94454 4.24264,2.12132 2.47487,15.90991 9.01561,17.85444 11.31371,4.06587 9.01561,0.35355 15.55635,-10.6066 10.25305,1.41421 -0.88388,-4.24264 c -5.12931,-7.26026 -10.16295,-7.37593 -15.2028,-7.95495 l 0.17678,-10.96015 -1.94454,-4.06587 1.59099,-6.01041 -0.70711,-5.48007 -4.06587,1.06066 -3.35875,-6.36396 -0.70711,-7.6014 1.41421,-2.2981 -1.41421,-8.83883 -3.18198,0 -2.47487,-3.35876 -6.89429,0.17678 1.23743,-6.8943 4.5962,-3.88908 0.35355,-3.18198 2.2981,-0.70711 1.76776,-4.06586 -4.94974,1.94454 -0.88389,-3.18198 2.12132,-2.82843 1.41422,-4.06586 -1.94455,-2.2981 0.70711,-5.65685 2.82843,1.94454 4.59619,-0.35355 2.82843,-3.88909 -0.53033,-18.56155 -6.18719,-0.70711 -10.42982,-4.59619 -20.15254,4.41941 0,-1.06066 -9.36917,2.65165 -0.17678,-3.88908 -3.0052,-1.23744 1.06066,-3.53554 z"
 var tz_area = paper.chartsArea({'x':x+330+320,'y':y+130+110,'are_name':'泰州','cxcy':[90,-50],'scale':[0.4,0.4],'path':tzPath});
 areas[areas.length]=tz_area;
      

 var lygPath ="m 0,0 0.75,-16.000001 -3,-4.5 -1,-4 -4,-1.9999995 -0.5,1.4999995 -4.5,0 -4.25,1.5 -1.5,5.5 -15.5,0.75 -0.5,-0.75 -6,2.75 0,10.000001 -4.25,6 0,4.25 -3,0.25 0.75,6.25 -3.25,0 -0.25,2.25 -1.75,0 1.25,3.25 3.5,0.75 0.75,0 -2.75,3.75 -4.5,1.5 -0.75,1 -2,-2.25 -3.75,0.25 -1.25,-2.5 -2.75,1.25 -3,-1.25 -1,3.5 -1.75,2 -3,-1 0.25,6.25 -2.5,-0.5 -1.75,4.75 1.75,8.75 -2.5,3.5 0,4.75 4.5,3 5,-4.5 4,3.25 1.25,0.25 0.75,-3.75 3,-0.25 4.25,4 -1.75,3 -1,0.5 -0.25,2.5 6.25,1.25 3.75,4.25 3,-2.25 2.25,-4.75 9.75,-1 2.25,2.25 3,-5.75 2,0.25 1.5,-2 1.25,0.25 -0.5,8.25 2.25,2.25 -0.5,6.75 1.25,0.25 0,6.5 3.25,0 1.25,6.75 2,2.5 1.25,4.25 4.5,5.25 4.75,-0.5 4.25,2.25 3.75,-1.5 4.75,5.25 6.5,-5 4,2.5 -1,-5.5 3.25,-3 -4.75,-2.75 -1.5,-5 -1.75,-0.75 2.25,-3.5 16.5,-11.25 3.25,-7.25 2.75,-2.5 0,-8.5 4.5,-8 -4,-2.25 -17.5,-10.5 0.25,-9.5 -3.25,-4.75 z"
 var lyg_area = paper.chartsArea({'x':x+330+320,'y':y+130+110+110,'are_name':'连云港','cxcy':[130,-20],'scale':[0.4,0.4],'path':lygPath});
 areas[areas.length]=lyg_area;
 

 function readValue(){
 	/**
 	 return {903 1080
      	 'name':are_name,
      	 'shopingcart_num':shopingcart_num,
      	 'm3G_value':m3G_value,
      	 'm4G_value':m4G_value,
      	  'net_value':net_value,
      	 'map':map_object
      }
     **/ 
    	var index=fRandomBy(0,areas.length-5);
    	var area =areas[index]
    	
    	//console.log(area.name);
    	area.shopingcart_num.setValue(fRandomBy(1000,5000)); //购物车
    	area.m3G_value.setValue(2000,fRandomBy(500,1500));//3G
    	area.m4G_value.setValue(2000,fRandomBy(500,1500));//4G
    	area.net_value.setValue(100,fRandomBy(10,100));
    	var colors = ['#88e6f9','#88e6f9','#88e6f9','#ffd426','#ffd426','#ff3c3c','#ff3c3c'];
    	var c_index=fRandomBy(0,colors.length-1); 
    	area.map.setColor(colors[c_index]);//根据条件变换色彩
    	setTimeout(function(){
          readValue();
    	},800);
    }
   readValue();




}


/**
   * 生成随便数
   */
function fRandomBy(under, over){ 
  	 return parseInt(Math.random()*(over-under+1) + under); 
  } 


function showTime(paper,x,y){
     var date1 = paper.text(x+140,y,getWeek()).attr({'fill':'#f4fedc','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
     var date2 = paper.text(x+140,y+35,getHH()).attr({'fill':'#f4fedc','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
     var date3 = paper.text(x+140+100,y+35, getSS()).attr({'fill':'#50bfd1','font-size':12,'font-family': '微软雅黑','font-weight':'bold'});
     function run(){
        date1.attr({'text':getWeek()});
        date2.attr({'text':getHH()});
        date3.attr({'text':getSS()});
        setTimeout(run,1);
     }
     run();
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
          hh="AM";
  }else {
          hh="PM";
  }
  return now.Format("hh:mm")+hh;
}
function getSS(){
    var now=new Date();
      return now.Format("s.S");
}
