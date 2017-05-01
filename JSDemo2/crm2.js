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
            paper.setSize('100%', '100%');
         var lable_title=paper.image('images/title.png',40,10,234,41); 
           trafficPackagesTop10Pie(paper,409,780); //当月TOp10套餐指标
           NumTopFor4G(paper,840,206);
           NumTopForNet(paper,1700,226);
           NumTopForManyTop(paper,670,370);
           Map(paper);
           Bar2(paper);
           chartsLineBarTop1(paper);
           chartsLineBarTop2(paper);
           chartsLineBarTop3(paper);
           showTime(paper,1250,206-100);
           marqueeTop(paper);
           drawFrames(paper);
}// end of onload

function marqueeTop(paper){
        var fontStyle1={'fill':'#fff5c9','font-size':27,'font-family': '微软雅黑','font-weight':'bold'};
        paper.text(460,30,'今日销量TOP10网点：').attr(fontStyle1);
         var fontsize=27;
        var x =600;
        var y=15;
        var w=800;
        var h=fontsize+3;
    
       // paper.rect(x,y,w,h).attr({ "stroke-width":'1','stroke':"#01d7ff"})
    var  message=["1、市政企苏信虚似营业厅 今日发展 1122 户","2、 市虚似营业厅 今日发展 999 户",
                           
                            ];
                            
                            
               function run(){
                    for (var i=0;i<message.length;i++){
                        var str=message[i];
                        var vx=(600+str.length*fontsize/2.5)*(i+2);
                        var mask=[x,y,w,h]
                            var fontStyle2={'fill':'#fff5c9','font-size':fontsize,'font-family': '微软雅黑','font-weight':'bold','clip-rect':mask.join(' ')} 
                        var p=   paper.text(vx,15+fontsize/2,str).attr(fontStyle2);
                            if (i==message.length-1){
                                
                            p.animate({x:0},1000*10*(i+1),function(){
                                    run();
                            });
                            }else{
                                p.animate({x:0},1000*10*(i+1));
                            }
                        
                        }
                       
        }
        run();
        
        
}

function chartsLineBarTop1(paper){
         var lable_title=paper.image('images/titleTop11.png',1430,525,219,39); 
     var top1= paper.chartsLineBar();
     function readValue(){
           top1.inputData(createLineBar());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
}


function chartsLineBarTop2(paper){
     var lable_title=paper.image('images/titleTop13.png',1420,780,279,39); 
     var top2= paper.chartsLineBar({x:1280,y:860});
     function readValue(){
           top2.inputData(createLineBar());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
}


function chartsLineBarTop3(paper){
var lable_title=paper.image('images/titleTop12.png',824,786,219,39); 
     var top3= paper.chartsLineBar({x:664,y:860});
     function readValue(){
           top3.inputData(createLineBar());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
}


function Bar2(paper){
    var lable_title=paper.image('images/titleBar.png',774,526,279,39); 
      var bar =paper.chartsBar2({});
        function readValue(){
           bar.inputData(createDataBar());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
     
}

function NumTopForManyTop(paper,x,y){
    var title_style={'fill':'#ffb648','font-size':30,'font-family': '微软雅黑','font-weight':'bold'};
      var title_style2={'fill':'#ffb648','font-size':24,'font-family': '微软雅黑','font-weight':'bold'}; 
   var  text_note=paper.text(x,y,'累计');
           text_note.attr(title_style)
    var  text_note2=paper.text(x,y+60,'今日');
           text_note2.attr(title_style)
     var  text_note3=paper.text(x,y+60+46,'昨日');
           text_note3.attr(title_style)
     
     //集团4G系统
      var  text_note4=paper.text(x+110,y+5,'集团4G\n系统');
           text_note4.attr(title_style2)
          var num4={
              'today':createNumTopForManyTopItem(paper,x+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110,y+65+45)
          } 
          
    
          
      //省内CRM系统
      var  text_note5=paper.text(x+110+110,y+5,'省内CRM\n系统');
            text_note5.attr(title_style2)
              var num5={
              'today':createNumTopForManyTopItem(paper,x+110+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110,y+65+45)
          } 
      //天翼新装
       var  text_note6=paper.text(x+110+110+110,y+5,'天翼\n新装');
              text_note6.attr(title_style2)
              var num6={
              'today':createNumTopForManyTopItem(paper,x+110+110+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110,y+65+45)
          } 
      //宽带新装
       var  text_note7=paper.text(x+110+110+110+90,y+5,'宽带\n新装');
            text_note7.attr(title_style2)
              var num7={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90,y+65+45)
          } 
       //ITV新装
      var  text_note8=paper.text(x+110+110+110+90+110,y+5,'ITV\n新装');
            text_note8.attr(title_style2)
               var num8={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110,y+65+45)
          } 
      //实体新装
       var  text_note9=paper.text(x+110+110+110+90+110+90,y+5,'实体\n新装');
              text_note9.attr(title_style2)
                 var num9={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100,y+65+45)
          } 
      //电子新装
       var  text_note10=paper.text(x+110+110+110+90+110+90+110,y+5,'电子\n新装');
              text_note10.attr(title_style2)
             var num10={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100,y+65+45)
          } 
              
        //政企新装
       var  text_note11=paper.text(x+110+110+110+90+110+90+110+100,y+5,'政企\n新装');
              text_note11.attr(title_style2)
                var num11={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100,y+65+45)
          } 
         //行销
       var  text_note12=paper.text(x+110+110+110+90+110+90+110+100+110,y+5,'行销');
              text_note12.attr(title_style2)
                 var num12={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100,y+65+45)
          } 
         
        //快销台
       var  text_note13=paper.text(x+110+110+110+90+110+90+110+100+110+100,y+5,'快销台');
              text_note13.attr(title_style2)
             var num13={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100+110,y+65+45)
          } 
              
        //购物车总量
       var  text_note14=paper.text(x+110+110+110+90+110+90+110+100+110+100+110,y+5,'购物车\n总量');
              text_note14.attr(title_style2)
                 var num14={
              'today':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100+110+110,y+65),
              'yesterday':createNumTopForManyTopItem(paper,x+110+110+110+90+110+100+100+100+100+110+110,y+65+45)
          } 
              
              
   function run(){
        //集团4G系统
        num4.today.setValue(fRandomBy(1000,10000));
         num4.yesterday.setValue(fRandomBy(1000,10000));
        //省内CRM系统
         num5.today.setValue(fRandomBy(1000,10000));
         num5.yesterday.setValue(fRandomBy(1000,10000));
         //天翼新装
         num6.today.setValue(fRandomBy(1000,10000));
         num6.yesterday.setValue(fRandomBy(1000,10000));
         //宽带新装
         num7.today.setValue(fRandomBy(1000,10000));
         num7.yesterday.setValue(fRandomBy(1000,10000));
         //ITV新装
          num8.today.setValue(fRandomBy(1000,10000));
         num8.yesterday.setValue(fRandomBy(1000,10000));
         //实体新装
              num9.today.setValue(fRandomBy(1000,10000));
         num9.yesterday.setValue(fRandomBy(1000,10000));
         // //电子新装
         num10.today.setValue(fRandomBy(1000,10000));
         num10.yesterday.setValue(fRandomBy(1000,10000));
         //政企新装
          num11.today.setValue(fRandomBy(1000,10000));
         num11.yesterday.setValue(fRandomBy(1000,10000));
         //行销  
         num12.today.setValue(fRandomBy(1000,10000));
         num12.yesterday.setValue(fRandomBy(1000,10000));
         //快销台
          num13.today.setValue(fRandomBy(1000,10000));
         num13.yesterday.setValue(fRandomBy(1000,10000));
                 //购物车总量
         num14.today.setValue(fRandomBy(1000,10000));
         num14.yesterday.setValue(fRandomBy(1000,10000));
        setTimeout(run,1000);
     }
     run();
         
}

function createNumTopForManyTopItem(paper,x,y,size){
    var vsize=size||26;
    return  paper.chartsNumbser({'x':x,'y':y,'value':0,'format':false,
   	                               attrs: {'fill':'#ffffff','font-size':vsize,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
}


function  NumTopForNet(paper,x,y){
    
  var lable_title=paper.image('images/titleNum2.png',x-40,y-129,219,66); 
   var text_note=paper.text(x-580,y+95,'统计口径：在中国电信订购4G套餐的移动用户数（不含上网卡） 注： 实时更新数据');
         text_note.attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
   var numtop=  paper.chartsNum2({'x':x,'y':y,'size':60,'maxnum':3,limit:999,color:"#14f9e6"});

         function readValue(){
             sum=fRandomBy(100,200);
          numtop. setNums(sum);
           setTimeout(function(){
             readValue();
    	    },100); 
        }
        readValue();
}


function  NumTopFor4G(paper,x,y){
    
   var lable_title=paper.image('images/titleNums1.png',x-190,y-129,363,57);        
   var numtop=  paper.chartsNumTop({'x':x,'y':y,'size':60,'maxnum':6,limit:999999,color:"#f77047"});
     var sum=1000;
         function readValue(){
             sum+=fRandomBy(100,200);
          numtop. setNums(sum);
           setTimeout(function(){
             readValue();
    	    },100); 
        }
        readValue();
}


//当月TOp10套餐指标
function trafficPackagesTop10Pie(paper,x,y){
     var lable_title=paper.image('images/titleTop10.png',x-250,y-245,320,35);        
             var pie =paper.chartsPie({
                   'x':x,
                   'y':y,
                   'r':170,
                   'listx':x-300,
                   'listy':y-190,
                   modes:[
                                {name:'乐享4G-99',color:'#ff7f50'},
                                {name:'乐享4G-59',color:'#ff8212'},
                                {name:'流量升级包-30',color:'#c5ff55'},
                                {name:'乐享4G-129',color:'#30cd2f'},
                                {name:'乐享4G-199',color:'#5599f2'},
                                {name:'乐享4G-399',color:'#fe62ae'},
                                {name:'飞Young4G-99',color:'#c050c8'},
                                {name:'乐享4G-79',color:'#c1635a'},
                                {name:'乐享4G-299',color:'#feac23'},
                                {name:'乐享4G-169',color:'#3bdbc0'},
                             ]
             });            
         function readValue(){
           pie.inputData(createDataTop10());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
}//end of trafficPackagesTop10Pie



function drawFrames(paper){
    var style={stroke: '#ffffff','stroke-width': 1};
       var style2={stroke: '#ffffff','stroke-width': 1};
         var style3={stroke: '#ffffff','stroke-width': 6};
    var rect = paper.rect(15, 509, 596, 516)
    rect.attr(style)
    var rect = paper.rect(620, 60, 1026, 280)
    rect.attr(style)
    var rect = paper.rect(620+1026+10, 60, 230, 280)
    rect.attr(style)
    
    var rect = paper.rect(617,345, 1270, 160)
    rect.attr(style)
    
       var rect = paper.rect(617,345+66, 1270, 1)
    rect.attr(style)
    
           var rect = paper.rect(617,345+66+46, 1270, 1)
    rect.attr(style)
    
        var rect = paper.rect(617+100+10,345, 1, 160)
        rect.attr(style3)
        var rect = paper.rect(617+100+100+10,345, 1, 160)
        rect.attr(style2)
        var rect = paper.rect(617+100+100+130,345, 1, 160)
        rect.attr(style3)
         var rect = paper.rect(617+100+100+130+100,345, 1, 160)
        rect.attr(style2)
         var rect = paper.rect(617+100+100+130+100+100,345, 1, 160)
        rect.attr(style2)
        var rect = paper.rect(617+100+100+130+100+100+100,345, 1, 160)
        rect.attr(style3)
        var rect = paper.rect(617+100+100+130+100+100+100+100,345, 1, 160)
        rect.attr(style2)
        var rect = paper.rect(617+100+100+130+100+100+100+100+100,345, 1, 160)
        rect.attr(style2)
          var rect = paper.rect(617+100+100+130+100+100+100+100+100+100,345, 1, 160)
        rect.attr(style3)
        var rect = paper.rect(617+100+100+130+100+100+100+100+100+100+100,345, 1, 160)
        rect.attr(style2)
           var rect = paper.rect(617+100+100+130+100+100+100+100+100+100+100+120,345, 1, 160)
        rect.attr(style3)
        
        var rect = paper.rect(15,60,595, 445)
        rect.attr(style)
        
        var rect = paper.rect(15+595+5,60+445+5,1274, 514)
        rect.attr(style)
        var fontStyle1={'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'};
        paper.text(230,1050,'中国电信江苏公司企业信息化部').attr(fontStyle1);
        paper.text(230+880,1050,'数据来源:CRM系统').attr(fontStyle1);
        paper.text(230+880+520,1050,'注:').attr(fontStyle1);
}



function createDataTop10(){
  var names=['乐享4G-99','乐享4G-59','流量升级包-30','乐享4G-129','乐享4G-199','乐享4G-399','飞Young4G-99','乐享4G-79','乐享4G-299','乐享4G-169']
  
   var  datas=[];
    for (var i=0;i<names.length;i++){
        datas.push({
              name:names[i],
              value:fRandomBy(1000,100000)
        })
    }
    return datas;
}


function showTime(paper,x,y){
     var date1 = paper.text(x+140,y,getWeek()).attr({'fill':'#f4fedc','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});
     var date2 = paper.text(x+140+160,y,getHH()).attr({'fill':'#f4fedc','font-size':21,'font-family': '微软雅黑','font-weight':'bold'});
     function run(){
        date1.attr({'text':getWeek()});
        date2.attr({'text':getHH()});
        setTimeout(run,1000);
     }
     run();
}


function Map(paper){ 
       var lable_title=paper.image('images/titleMap.png',180,75,225,44); 
      var map =paper.chartsMap({min:1000,max:10000});
         function readValue(){
           map.inputData(createDataMap());
           setTimeout(function(){
             readValue();
    	    },6000); 
        }
        readValue();
}

function createDataMap(){
 
   var names=['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通' ,'连云港' ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁'];
   var  datas=[];
    for (var i=0;i<names.length;i++){
        datas.push({
              name:names[i],
              value:fRandomBy(1000,10000)
        })
    }
    return datas;
}


function createDataBar(){
 
   var names=['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通' ,'连云港' ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁'];
   var  datas=[];
    for (var i=0;i<names.length;i++){
        datas.push({
              name:names[i],
              value:fRandomBy(100,999)
        })
    }
    return datas;
}


function createLineBar(){
   var names=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
   var  datas=[];
    for (var i=0;i<names.length;i++){
        if (i<3){
        datas.push({
              name:names[i],
              value:fRandomBy(1000,4000)
        })
        }else{
                 datas.push({
              name:names[i],
              value:0
        })
        }
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
  return now.Format("hh:mm:s")+hh;
}
function getSS(){
    var now=new Date();
      return now.Format("s.S");
}

  
  
  
