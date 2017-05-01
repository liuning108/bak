var global_config={
     'workflow_names':['CRM下单' ,'服务单' ,'资源变更单' ,'流程启动' ,'派单' ,'归档'],
     'area_names':['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港'],

 };

  var opacityAnim = Raphael.animation({ "50%": { opacity:0.3},
                                          "100%": { opacity:0.5 }
                                       }, 1000);
  var opacityAnim2 = Raphael.animation({ "50%": { opacity:0.5},
                                          "100%": { opacity:1 }
                                       }, 400);
   var opacityAnim3 = Raphael.animation({ "50%": { opacity:0.5},
                                          "100%": { opacity:1 }
                                       }, 2000);



//启动函数
window.onload=function(){
	  var paper = Raphael(0, 0, 1920, 1080); 
	      paper.setViewBox(0,0,1920,1080,true);
        paper.setSize("100%","100%");
        showTitle(paper);
        showCircle(paper,645,560,106);
        showCircle2(paper,645+635,560,106);
        showRectTop(paper,570,317,"选扯");
        showRectTop(paper,570+635,317,  "选号")
        showRectTop(paper,570+630,317+460,"接口")
        showRectTop(paper,570,317+460,"卡校验");
        showCirclePerTop1(paper,160,385,85);
        showCirclePerTop2(paper,160,385+360,85);
        showCirclePerTop3(paper,160+1600,385,85);
        showCirclePerTop4(paper,160+1600,385+360,85);
        showAnima(paper);
        drawLine(paper);


}// end of onload

function drawLine(paper){
   var x=50;
   var y=136;
   createLine(paper,x+150+300,y-10,415,"#1aebe8",0.5);
   createLine(paper,x+300,y,565,"#1aebe8",1);

    createLine(paper,x+150+300+630,y-10,415,"#1aebe8",0.5);
   createLine(paper,x+300+630,y,565,"#1aebe8",1);

   createLine(paper,x+110,y-10,415-300,"#1aebe8",0.5);
   createLine(paper,x,y,565-340,"#1aebe8",1);
      createLine(paper,x+110+1600,y-10,415-300,"#1aebe8",0.5);
   createLine(paper,x+1600,y,565-340,"#1aebe8",1);

   paper.rect(x+280,y,1,300).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280,y+330,1,100).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280,y+460,1,380).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})


   paper.rect(x+280+1263  ,y,1,300).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280+1263,y+330,1,100).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280+1263,y+460,1,380).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})


 paper.rect(x+280+1263/2 ,y,1,400).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280+1263/2,y+400+50,1,300).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})
   paper.rect(x+280+1263/2,y+400+50+320,1,80).attr({"fill":'none','stroke':"#3ffffc",'stroke-width':0.5})

}

function showAnima(paper){
  var x=870;
  var y=535;
var strPath="m 0,0 69.249824,-0.310538 c 10.439713,5.047261 17.707417,9.577471 22.561841,15.804351 8.753797,11.2287 14.556199,17.20986 23.087146,16.80207 l 67.386601,-0.31054 0,0 0,0 -1.55269,-0.31054";
  createArcLine(paper,x,y,strPath,1500,'#63e2e2','line1').start();

  strPath="m 0,0 c 1.863224,0 68.318212,-1.86322 68.318212,-1.86322 9.795831,-1.86968 17.388168,-12.9742 24.62542,-23.51317 5.410438,-7.87874 10.933522,-22.268885 20.402492,-22.135821 l 68.318216,0";
  createArcLine(paper,x,y+50,strPath,2000,'#63e2e2','line2').start();
  
  strPath="m 0,0 -68.628746,0.31054 c -7.54248,0.54675 -14.178579,6.62051 -19.785552,11.26695 -6.929105,5.74206 -16.219317,6.38998 -25.863434,8.60744 l -69.249824,-0.93162";
  createArcLine(paper,x+183,y+15,strPath,1500,'#63e2e2','line3').start();

  strPath="m 0,0 c -4.81203,-0.21873 -67.80587,0.65618 -67.80587,0.65618 -6.96056,4.37665 -17.71631,-11.23213 -21.27266,-16.93396 -2.82309,-4.52619 -17.52526,-14.56549 -23.78544,-16.31279 l -69.77444,-0.43746"
   createArcLine(paper,x+183,y+45,strPath,1500,'#63e2e2','line4').start();

   paper.text(x-20,y+5,'IN1').attr({'fill':"#ffffff",'font-size':10,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-20,y+40,'IN2').attr({'fill':"#7e7e7e",'font-size':10,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x+205,y+5,'IN3').attr({'fill':"#7e7e7e",'font-size':10,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x+205,y+40,'IN4').attr({'fill':"#ffffff",'font-size':10,'font-family': '微软雅黑','font-weight':'bold'})
  
  paper.rect(x-23,y-80,40,15).attr({"fill":"none",'stroke':'#fe4a39','stroke-width':1});
  paper.rect(x-23,y-80+20,40,15).attr({"fill":"none",'stroke':'#497a88','stroke-width':1});


  paper.rect(x-23+185  ,y-80,40,15).attr({"fill":"none",'stroke':'#fe4a39','stroke-width':1});
  paper.rect(x-23+185  ,y-80+20,40,15).attr({"fill":"none",'stroke':'#497a88','stroke-width':1});

  paper.rect(x-23+185  ,y-80+170,40,15).attr({"fill":"none",'stroke':'#fe4a39','stroke-width':1});
  paper.rect(x-23+185  ,y-80+20+170,40,15).attr({"fill":"none",'stroke':'#497a88','stroke-width':1});

  paper.rect(x-23  ,y-80+170,40,15).attr({"fill":"none",'stroke':'#fe4a39','stroke-width':1});
  paper.rect(x-23  ,y-80+20+170,40,15).attr({"fill":"none",'stroke':'#497a88','stroke-width':1});

}


function showCirclePerTop1(paper,x,y,r){
   paper.text(x-r-10,y-r-25,"TOP").attr({'fill':"#5debec",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+32,y-r-25,"1").attr({'fill':"#ff4a3a",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+95,y-r-25,"VALUE").attr({'fill':"#5debec",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  var val=paper.chartsNumbser({'x':x-r+180,'y':y-r-25,'value':100,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  var numobj=showCirclePerTop(paper,x,y,r)
  function run(){
   numobj(fRandomBy(1,100));
   val.setValue(fRandomBy(200,400))
   setTimeout(run,3000);
  }
  run();
}

function showCirclePerTop2(paper,x,y,r){
   paper.text(x-r-10,y-r-25,"TOP").attr({'fill':"#5debec",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+32,y-r-25,"2").attr({'fill':"#ff4a3a",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+95,y-r-25,"VALUE").attr({'fill':"#5debec",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  var val=paper.chartsNumbser({'x':x-r+180,'y':y-r-25,'value':100,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  var numobj=showCirclePerTop(paper,x,y,r)
  function run(){
   numobj(fRandomBy(1,100));
   val.setValue(fRandomBy(200,400))
   setTimeout(run,3000);
  }
  run();
}



function showCirclePerTop3(paper,x,y,r){
   paper.text(x-r-10,y-r-25,"TOP").attr({'fill':"#5debec",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+32,y-r-25,"3").attr({'fill':"#ff4a3a",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+95,y-r-25,"VALUE").attr({'fill':"#5debec",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  var val=paper.chartsNumbser({'x':x-r+180,'y':y-r-25,'value':100,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  var numobj=showCirclePerTop(paper,x,y,r)
  function run(){
   numobj(fRandomBy(1,100));
   val.setValue(fRandomBy(200,400));
   setTimeout(run,3000);
  }
  run();
}

function showCirclePerTop4(paper,x,y,r){
   paper.text(x-r-10,y-r-25,"TOP").attr({'fill':"#5debec",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+32,y-r-25,"4").attr({'fill':"#ff4a3a",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
   paper.text(x-r+95,y-r-25,"VALUE").attr({'fill':"#5debec",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
  var val=paper.chartsNumbser({'x':x-r+180,'y':y-r-25,'value':100,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  var numobj=showCirclePerTop(paper,x,y,r)
  function run(){
   numobj(fRandomBy(1,100));
   val.setValue(fRandomBy(200,400));
   setTimeout(run,3000);
  }
  run();
}
function showCirclePerTop(paper,x,y,r){
    var set=paper.set()
    var c1=createCirclePerTop(paper,x,y,r,[0.14,0.07,0.14,0.11,0.2,0.2],4,"#5debec",360,6000);
    var c2=createCirclePerTop(paper,x,y,r-9,[0.5,0.4],4,"#5debec",-360,6000);
    var c3=createCirclePerTop(paper,x,y,r-9-10,[0.1,0.15,0.15,0.3,0.15],4,"#5debec",360,5000);
    var c4=createCirclePerTop(paper,x,y,r-9-9-11,[0.1,0.15,0.15,0.2,0.15],4,"#5debec",-360,6000);
    set.push(c1);
    set.push(c2);
    set.push(c3);
    set.push(c4);
    var numobj=paper.chartsNumbser({'x':x,'y':y-5,'value':100,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   var pertext= paper.text(x,y+20,"PERCENT").attr({'fill':"#58f4f5",'font-size':12,'font-family': '微软雅黑','font-weight':'bold'});
    return function(value){
       numobj.setValue(value);
       if (value>=90){
        set.animate({'stroke':"#f64836"},1000);
        pertext.animate({'fill':"#f64836"},1000)
       }else if (value>=75){
         set.animate({'stroke':"#f7fe36"},1000);
              pertext.animate({'fill':"#f7fe36"},1000)
       }else{
         set.animate({'stroke':"#5debec"},1000);
           pertext.animate({'fill':"#5debec"},1000)
       }

    }
}

function createCirclePerTop(paper,x,y,r,ang,w,color,deg,speed){
  var circlePath= getCircleToPath(x,y,r)
  var p=paper.path(circlePath).attr({'fill':'none','stroke-width':1,'stroke':"none"})
          var totalLength = p.getTotalLength();
         var set= paper.set();
          var start=0;
          var end=0;
         for (var i=0;i<ang.length;i++){
             end=start+totalLength*ang[i];
            var subPath=p.getSubpath(start,end);
            var p2=paper.path(subPath).attr({'fill':'none','stroke-width':w,'stroke':color,"opacity":1})
            start=end+10;
            set.push(p2)
         }
          var anim = Raphael.animation({ "transform": ['t',0,0,'r',deg,x,y]}, speed);
        set.animate(anim.repeat(Infinity));
         return set;
}



function showRectTop(paper,x,y,name){
      var top=createRectTop(paper,x,y,name).show();
      function run(){
        top.setValue(fRandomBy(500,800),1000);
         setTimeout(run,3000)
      }
      run();
}
function createRectTop(paper,x,y,name){
    var RectTop=function(x,y,name){
      this.x=x;
      this.y=y;
      this.pathUp="m 0,0 -5.086919,5.52926 -20.347681,-0.66351 1.10586,-38.70482 23.665229,-29.19449 8.183305,-3.98107 134.471601,-0.22117 11.722031,4.64458 22.117039,28.08864 1.548193,38.70482 -20.790017,-0.22117 -4.423408,-5.30809 15.924269,-24.77109 -0.221171,-5.30809 -29.194492,-30.30034 -126.951808,0.44234 -28.530981,30.74269 z"; 
      this.pathUp2="m 0,0 -26.098107,25.65577 14.597246,25.87693 23.886403,-0.22117 5.086919,-7.29862 86.477625,0.22117 4.644578,6.85628 23.222892,0.22117 13.712564,-19.24182 -0.442341,-7.07745 -22.78055,-24.77109 z";
      this.name=name;
      this.path1="m 0,0 c 0,0 29.03524,0.621075 29.03524,0 0,-0.621075 0.310538,-10.558269 0.310538,-10.558269 l -2.639568,-2.484299 0.310538,-10.092463 -27.172016,0 z"
      this.path2="m 0,0 c 0,0 -29.03524,0.621075 -29.03524,0 0,-0.621075 -0.310538,-10.558269 -0.310538,-10.558269 l 2.639568,-2.484299 -0.310538,-10.092463 27.172016,0 z";
     }
    RectTop.prototype.show=function(){
      var self=this;
       paper.path(self.pathUp).attr("transform",['t',self.x,self.y]).attr({'fill':'#28e2df','stroke-width':0});
       paper.path(self.pathUp2).attr("transform",['t',self.x+15,self.y-55]).attr({'fill':'none','stroke-width':1,'stroke':"#28e2df"});
       paper.path(self.pathUp).attr("transform",['t',self.x-3,self.y+93,'r',180]).attr({'fill':'#28e2df','stroke-width':0});
       paper.path(self.pathUp2).attr("transform",['t',self.x+15,self.y+35,'r',180]).attr({'fill':'none','stroke-width':1,'stroke':"#28e2df"});
       paper.text(self.x+75,self.y-36,self.name).attr({'fill':"#d8ffa0",'font-size':36,'font-family': '微软雅黑','font-weight':'bold'})
       self.numobj=paper.chartsNumbser({'x':x+75,'y':y+63,'value':9999,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
        self.animMaxte();
        self.leftArray=self.bar(self.x-113,self.path1);
        self.rightArray=self.bar(self.x+261,self.path2);
      return self;
    }
    RectTop.prototype.setValue=function(value,max){
       var self=this;
       self.numobj.setValue(value);
       var per=value/max;
       var k=parseInt(7*per);
       if(k<=0)k=1;
       self.arrayInit(self.leftArray);
       self.arrayInit(self.rightArray);
       self.arrayAnima(self.leftArray,k);
       self.arrayAnima(self.rightArray,k);
    }

    RectTop.prototype.arrayInit=function(arry){
      for (var i=0;i<arry.length;i++){
         arry[i].attr({'fill':"#072929",'stroke-width':0,'opacity':0.7});
      }
    }

    RectTop.prototype.arrayAnima=function(arry,n){
      var self=this;
         var color='#26e2e3';

          if (n>=5){
            color='#ffcf28'
          }
          if (n>=6){
            color='#ff4d39'
          }
          for (var i=0;i<n;i++){
            arry[i].animate({'fill':color},i*200);
          }
          self.numobj.numobj.animate({'fill':color},800);
    }
    RectTop.prototype.bar=function(x,path){
      var self=this;
      var cx=x;
      var cy=self.y+100
      var array=[];
       for(var i=0;i<7;i++){
         var item= paper.path(path).attr('transform',['t',cx,cy-(i*25)]).attr({'fill':"#072929",'stroke-width':0,'opacity':0.7})
         array.push(item);
        }//end of for 
        return array;
    
     }
    RectTop.prototype.animMaxte=function(){
      var self=this;
      var cx=self.x+34;
      var cy=self.y-5;
      var count=1;
      self.items=[];
      for (var j=0;j<5;j++){
        for (var i=0;i<3;i++){
          var item;
          if (count%2==0){
              item=paper.rect(cx+(i*29),self.y-5+(j*9),23,7).attr({'fill':"#63e2e2",'stroke-width':0});
          }else{
             item=paper.rect(cx+(i*29),self.y-5+(j*9),23,7).attr({'fill':"#2acccc",'stroke-width':0});
          }
          self.items.push(item);
          count++;
        }
      } //end of for 
       var colors=["#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#63e2e2","#2acccc","#ff4d39","#ffcf28"]
       function run (){
        var index=fRandomBy(0,self.items.length-1);
        var color_index=fRandomBy(0,colors.length-1);
        var c=colors[color_index];
        var item=self.items[index];
        if (item){
         item.animate({"fill":c},300);
        }
        setTimeout(run,100);
       }
       run();
    }
    return new RectTop(x,y,name);
}

function showCircle(paper,x,y,r){
    var obj=createCircleTop(paper,x,y,r,[90,70]).show();
    function run(){
     obj.setValue(fRandomBy(10,110));
     setTimeout(run,4000)
    }
    run();
}

function showCircle2(paper,x,y,r){
    var obj=createCircleTop(paper,x,y,r,[90,70]).show();
    function run(){
     obj.setValue(fRandomBy(10,110));
     setTimeout(run,4000)
    }
    run();
}


function createCircleTop(paper,x,y,r,limits){
  var CircleTop=function(x,y,r,limits){
    this.x=x;
    this.y=y;
    this.r=r;
    this.path_left="m 0,0 25.02258,15.63911 4.06616,-2.18948 17.20302,-13.13685 3.75339,-11.26016 -19.70528,-19.39249 -10.00903,1.25112 -56.61357,48.48124 1.87669,136.99859 52.86019,50.35793 12.19851,0.62557 19.39249,-19.3925 -3.12782,-9.38346 -1.87669,-0.31278 -17.20302,-16.26468 -26.58649,13.76242 -29.71431,-24.39701 -1.56391,-124.17452 z";
    this.path_block="m 0,0 24.08423,11.57294 0,21.89475 -6.56843,6.25564 0.62556,30.33988 -3.75338,5.94286 -36.28273,-1.8767 -2.18948,-51.60905 z";
    this.path_block2="m 0,0 37.22108,-1.56391 2.50226,6.25565 -0.62557,29.08874 6.25565,8.44512 0.62556,20.33084 -23.45866,11.57294 -24.70979,-22.20753 z";
    this.path_block3="m 0,0 24.397005,-11.26015 24.08423,22.52031 -2.18947,52.54741 -36.59552,0.93834 -3.440602,-4.69173 1.563911,-31.90378 -7.506772,-7.19399 z";
    this.path_block4="m 0,0 -4.378954,6.25564 1.563911,29.71431 -7.819554,7.81955 0.625564,21.26919 24.397013,11.26016 24.08422,-22.8331 -2.18947,-51.92184 z";
    this.sectorsCount=40;
    this.limits=limits;
  }
  CircleTop.prototype.show=function(){
    var self=this;
    paper.circle(self.x,self.y,self.r).attr({'fill':'none','stroke-width':1,'stroke':'#5ad7d9'});
    paper.circle(self.x,self.y,self.r-29).attr({'fill':'none','stroke-width':1,'stroke':'#5ad7d9'});
    // paper.path(self.path_left).attr('transform',['t',self.x-136,self.y-85]).attr({'fill':'#08afaf','stroke-width':0});
    // paper.path(self.path_left).attr('transform',['t',self.x+126,self.y-85,'r',180]).attr({'fill':'#08afaf','stroke-width':0});
    // paper.path(self.path_block).attr('transform',['t',self.x-136,self.y-75]).attr({'fill':'#08afaf','stroke-width':1,'stroke':"#259b95",'fill-opacity':0.2});
    // paper.path(self.path_block2).attr('transform',['t',self.x-159,self.y-75+80]).attr({'fill':'#08afaf','stroke-width':1,'stroke':"#259b95",'fill-opacity':0.2});
    // paper.path(self.path_block3).attr('transform',['t',self.x+110,self.y-75+10]).attr({'fill':'#08afaf','stroke-width':1,'stroke':"#259b95",'fill-opacity':0.2});
    // paper.path(self.path_block4).attr('transform',['t',self.x+120,self.y-75+80]).attr({'fill':'#08afaf','stroke-width':1,'stroke':"#259b95",'fill-opacity':0.2});
     var sectors1_style={stroke: '#08afaf', "stroke-width": 8, "stroke-linecap": "round",'opacity':0.5};
    self.sectors=createSectors(paper,self.x,self.y,self.r-13,5,-5,self.sectorsCount,Math.PI*2,-Math.PI,sectors1_style);
    self.text=paper.text(x,y+30,"正常").attr({'fill':"#5bf6f6",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
    self.textEN=paper.text(x,y,"NORMAL").attr({'fill':"#5bf6f6",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

    return self;
  }

  CircleTop.prototype.setValue=function (value){
     var self=this;
     self.text.remove();
      self.textEN.remove();
    if (value>=self.limits[0]){
       self.sectors.animate({'stroke':'#f64836'},1000); 
          self.text=paper.text(x,y+30,"紧急").attr({'fill':"#f64836",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
      self.textEN=paper.text(x,y,"URGENCY").attr({'fill':"#f64836",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

       return;
    }else if (value>=self.limits[1]){
      self.sectors.animate({'stroke':'#f7fe36'},1000);
      self.text=paper.text(x,y+30,"警告").attr({'fill':"#f7fe36",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
      self.textEN=paper.text(x,y,"WARNING").attr({'fill':"#f7fe36",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

        return;
    }else{
      self.sectors.animate({'stroke':'#08afaf'},1000);

      self.text=paper.text(x,y+30,"正常").attr({'fill':"#5bf6f6",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
      self.textEN=paper.text(x,y,"NORMAL").attr({'fill':"#5bf6f6",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

        return;
    }

  }

  return new CircleTop(x,y,r,limits)


}



function showTitle(paper){
  var x=46;
  var y=45;
  createLine(paper,x,y,410,"#1aebe8",1);
  createLine(paper,x,y+40,410,"#1aebe8",1);

  
 createLine(paper,x+470,y,650,"#1aebe8",1);
 createLine(paper,x+470,y+40,650,"#1aebe8",1);

 createLine(paper,x+470+650+60,y,650,"#1aebe8",1);
 createLine(paper,x+470+650+60,y+40,650,"#1aebe8",1);

 var str="m 0,0 0,20.347676 25.213424,-0.442341 5.52926,5.30809 115.450944,-0.663511 0,-24.549914 z";
 paper.path(str).attr('transform',['t',x+475,y+10]).attr({'fill':'#1f4b58','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160,y+10]).attr({'fill':'#014342','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160+177,y+10]).attr({'fill':'#009090','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160+177+160,y+10]).attr({'fill':'#ff4d39','stroke-width':0,'opacity':0.8})

 paper.path(str).attr('transform',['t',x+475+705,y+10]).attr({'fill':'#1f4b58','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160+705,y+10]).attr({'fill':'#014342','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160+177+705,y+10]).attr({'fill':'#009090','stroke-width':0,'opacity':0.8})
 paper.path(str).attr('transform',['t',x+475+160+177+160+705,y+10]).attr({'fill':'#ff4d39','stroke-width':0,'opacity':0.8})
   paper.text(x+100,y+20,'基础设备监控').attr({'fill':"#56caca",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});

   titleBarTime(paper,x+200,y+20)
}



function titleBarTime(paper,x,y){
  
  var date1 = paper.text(x+60,y,getWeek()).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
  var date2 = paper.text(x+180,y,getHH()).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
     function run(){
        date1.attr({'text':getWeek()});
        date2.attr({'text':getHH()});
        setTimeout(run,1000);
     }
     run();


}
function createSectors(paper,x,y,r,size1,size2,sectorsCount,mathpi,startAngle,vpathParams){
       


       var speed=2000
       var beta=mathpi / sectorsCount;
       var  sectors = [];
       var set=paper.set();
       var  pathParams = vpathParams;
       var  opacity = [];    
       for (var i = 0; i < sectorsCount; i++){
            var alpha = (beta) * i+startAngle ;
            var cos = Math.cos(alpha);
            var sin = Math.sin(alpha);
            var rr1=r+size1;
            var rr2=r+size2;
            opacity[i] = 1 / sectorsCount * i; 
            sectors[i] = paper.path([["M", x + rr1 * cos, y + rr1 * sin], ["L", x + rr2 * cos, y + rr2 * sin]]).attr(pathParams);
            set.push(sectors[i]);
       }
     function tick(){
        opacity.unshift(opacity.pop());
        for (var i = 0; i < sectorsCount; i++) {
            sectors[i].attr("opacity", opacity[i]);
          }
          setTimeout(tick, speed / sectorsCount);
       }
         tick();
         return set;


     }


function createLine(paper,x,y,length,color,opacityvalue)
{
  paper.rect(x+5/2,y+5/2,length,0.5).attr({'fill':"none",'stroke':color,'stroke-width':1,'opacity':opacityvalue});
  paper.rect(x,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});
  paper.rect(x+length,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});

}

function getCircleToPath(x, y, r){
    var s = 'M ' + 
            x + ',' + (y-r)+
            ' A ' + r + ',' + r +
            ' 45 1,1 ' + 
            (x-0.1) + ',' + (y-r) + 
            ' z';
    //console.log(s);
    return s;
  }



function createDataShopping(){
   var datas=[];
   for (var i=0;i<global_config.area_names.length;i++){
         var name=global_config.area_names[i];
        datas.push({
            'name':name,
            'value':fRandomBy(1000,3000)  
        })

   }
   return datas;
}

function createCNet(){
   var datas=[];
   for (var i=0;i<global_config.area_names.length;i++){
         var name=global_config.area_names[i];
        datas.push({
            'name':name,
            'value':fRandomBy(1,100)  
        })

   }
   return datas;
}


function createLoadDatas(){
   var datas=[];
   for (var i=0;i<global_config.area_names.length;i++){
        var name=global_config.area_names[i];
        datas.push({
            'name':name,
            'g3':fRandomBy(100,300),
            'g4':fRandomBy(100,600)
        });
   }
   return datas;
}
/**
   * 生成随便数
   */
function fRandomBy(under, over){ 
     return parseInt(Math.random()*(over-under+1) + under); 
} 
function findObjByName(array,key){
    for (var i=0;i<array.length;i++){
         var item=array[i];
         if (item.name==key){
           return item;
         }
    }
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
 
  return now.Format("hh:mm:ss")
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

function createArcLine(paper,x,y,path,time,color,id){
  var AraLine =function(x,y,path,time,color){
     this.x=x;
     this.y=y;
     this.path=path,
     this.time=time;
     this.color=color;
     this.id=id;
  }

  AraLine.prototype.start=function(){
    var self=this;
    this.arc =paper.path(this.path).attr("transform",['t',self.x,self.y]).attr({"stroke-width":1,'stroke':"#1b8581"})
        var totalLength = this.arc.getTotalLength();
        var subPath = this.arc.getSubpath(totalLength-(totalLength/10),totalLength );
      this.obj = paper.path(subPath).attr("transform",['t',self.x,self.y]).attr({'stroke-width': 2,'stroke':'#63e2e2','stroke-opacity':0.7});
       
        paper.customAttributes[this.id] = function(x) {
               var subPath = self.arc.getSubpath(x,x+30);
               return {'path':subPath,
                        'stroke':self.color}
            };

            var init_obj={};
            init_obj[this.id]=[0];
            self.obj.attr(init_obj);
         
            function run(){
              var end_obj={};
                  end_obj[self.id]=[totalLength];
              var opacityAnim4 = Raphael.animation(end_obj,time);
              self.obj.animate(opacityAnim4.repeat(Infinity))
            }
            run();
  }

  return new AraLine(x,y,path,time,color,id);
  
}
