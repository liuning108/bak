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
        toDayShopping(paper);
        toDayNewLoad(paper);
        toDayCNet(paper);
        toDayRunning(paper);
        drawLine(paper);
        drawPathAnima(paper);
       
}// end of onload


function drawPathAnima(paper){
     var str="m 0,0 0.60523,11.1967 8.17056,-5.44705 z"

     var str2="m  0,0 -0.60523,-11.1967 -8.17056,5.44705 z"
      var obj2_r=paper.path(str2).attr('transform',['t',1850,300+30]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj2_r,1850,300+30,30,2000,1,0.5).start();

       var obj13_r=paper.path(str2).attr('transform',['t',1850,300+30]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj13_r,1850,300+30,30,2000,0,0.5).start();


      var obj2_r=paper.path(str2).attr('transform',['t',1150,300+70]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj2_r,1150,300+30,30,2000,1,0.5).start();

       var obj13_r=paper.path(str2).attr('transform',['t',1150,300+70]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj13_r,1150,300+30,30,2000,0,0.5).start();


       var obj2_r=paper.path(str).attr('transform',['t',750,300+70]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj2_r,750,300+30,30,2000,1,0.5).start();

       var obj13_r=paper.path(str).attr('transform',['t',750,300+70]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj13_r,750,300+30,30,2000,0,0.5).start();

}



function drawLine(paper){
   var x=50;
   var y=136;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);

    var x=50;
   var y=136+440;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);

   x=50+635 ;
   y=136;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);

   x=50+635;
   y=136+900;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);

   x=50+635+625 ;
   y=136;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);

    x=50+635+625 ;
   y=136+900;
   createLine(paper,x+150,y-10,400,"#1aebe8",0.5);
   createLine(paper,x,y,550,"#1aebe8",1);
   var x=640;
   var y=140;
   paper.rect(x,y,0.5,270).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300,0.5,90).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300+110,0.5,300).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300+110+326,0.5,160).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   var x=640+640;
   var y=140;
   paper.rect(x,y,0.5,270).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300,0.5,90).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300+110,0.5,300).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});
   paper.rect(x,y+300+110+326,0.5,160).attr({'fill':'none','stroke':"#1aebe8",'stroke-width':1});

     
}


function toDayCNet(paper){
  var x=75;
  var y=280;
  var w=540;
  var h=245;
    paper.text(x+50,187,'C网超3分钟').attr({'fill':"#52c1c1",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(x+140+50,187,'未峻工量').attr({'fill':"#db4029",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(x+140+140+50,187,'VALUE').attr({'fill':"#1ed3ce",'font-size':10,'font-family': '微软雅黑'});
   
  var listTop=createListTop(paper,global_config.area_names,x,y,w,h,[70,150]).show();
  var numobj=paper.chartsNumbser({'x':x+140+140+50+90,'y':187,'value':0,
                                  attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  function run(){
     var sum=listTop.setValue(createCNet())
     numobj.setValue(sum);
     setTimeout(run,1000*10);
  }
  run();
}


function toDayRunning(paper){
  var x=75;
  var y=280+470;
  var w=540;
  var h=245;
    paper.text(x+35,187+465,'在途').attr({'fill':"#52c1c1",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(x+75+35,187+465,'复机量').attr({'fill':"#db4029",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(x+140+75+50,187+465,'VALUE').attr({'fill':"#1ed3ce",'font-size':10,'font-family': '微软雅黑'});
   
  var listTop=createListTop(paper,global_config.area_names,x,y,w,h,[70,150]).show();
  var numobj=paper.chartsNumbser({'x':x+140+75+50+120,'y':187+465,'value':0,
                                   attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  function run(){
     var sum=listTop.setValue(createCNet())
     numobj.setValue(sum);
     setTimeout(run,1000*12);
  }
  run();
}
function createListTop(paper,keys,x,y,w,h,limit){
   var ListTop=function(keys,x,y,w,h,limit){
     this.keys=keys;
     this.x=x;
     this.y=y;
     this.w=w;
     this.h=h;
     this.item={};
     this.allarray=[];
     this.numItem={};
     this.numAllarray=[]
     this.limit=limit;
   } 

   ListTop.prototype.show=function(){
     var item_w=this.w/this.keys.length;

     for (var i = 0;i<this.keys.length;i++){
         var key=this.keys[i];
           var cx=this.x+(i*item_w);
          var ccx=cx-item_w/2;
         if (key.length>=3){
            cx=cx+10;
            ccx=cx-item_w/2-10;  
         }

               var cy=this.y+this.h-12;
           console.log(key);
          this.createItem(ccx,cy-40,item_w,key);
          var numobj=paper.chartsNumbser({'x':ccx+item_w/2,'y':this.y-12,'value':0,
                                   attrs: {'fill':"#ffffff",'font-size':21,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
          this.numItem[key]=numobj;
           this.numAllarray.push(numobj)
         paper.text(cx,cy,key).attr({'fill':"#ffffff",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})

     }
     return this;
   }

    ListTop.prototype.createItem=function(x,y,item_w,key){
      this.item[key]=[];
      var item_h= this.h/8;
      for(var i=0;i<8;i++){ 
          var cx=x;
          var cy=y-(i*item_h);
          var rect= paper.rect(cx,cy,item_w-2,item_h-2).attr({"fill":"#0a1616",'stroke-width':0})
         

          this.item[key].push(rect);
          this.allarray.push(rect);
      } 
      return this.item[key]

   }

   var timer = function(a, n,fun) {       
    fun(a[n],a,n,fun); 
   }

   ListTop.prototype.setValue=function(datas){
    var self=this;
     for (var h=0;h<this.allarray.length;h++){
                 this.allarray[h].attr({'fill':"#0a1616"});
              }

                for (var h=0;h<this.numAllarray.length;h++){
                 this.numAllarray[h].numobj.attr({'opacity':"0"});
              }
        var sum=0;
        var max=-999;
        for (var i=0;i<datas.length;i++){
             var value =datas[i].value;
             sum=sum+value;
             if (value>max){
               max=value;
             }
        }
    
        timer(datas,0,function(data,a,n,fun){
            var per=data.value/(max+(max*0.1));
              if (per<0.01){per=0.1};
              var show_num=parseInt(per*8);
              if (show_num==0){show_num=1};
              var key =data.name;
              var vv=data.value;
              var array=self.item[key];
              var opacity=1;
              if ((n+1)%2==0){
                opacity=0.8;
              }
              var tt=200;
              var color='#3cf3f0';
              if (vv>=self.limit[0]){
                 color='#d4ff3d';
              }
               if(vv>=self.limit[1]){
                 color='#ff4d39';
              }

              for (var j=0;j<show_num;j++){
                var rect =array[j];        
                rect.animate({'fill':color,'opacity':opacity},tt);
              };
              self.numItem[key].setValue(data.value);
                var cy=self.y+self.h-40-(self.h*per);
                self.numItem[key].numobj.attr('opacity',1);
              self.numItem[key].numobj.animate({"y":cy},tt+100,function(){
                      if (n==a.length){
                        return
                      }else{
                        n++;
                        fun(a[n],a,n,fun); 
                      }
              })
        });
        return sum;
   }


   return new ListTop(keys,x,y,w,h,limit)
}

function toDayNewLoad(paper){
  var path3g="m 0,0 -2.033084,2.18948 0.312782,17.82858 9.227074,9.07068 61.305304,-0.31278 1.87669,-2.81504 -0.46917,-23.92783 -2.34587,-2.18948 z"
  var path4g="m 0,0 -2.43287,1.87994 0.11058,25.76635 2.54346,1.5482 59.60542,-0.11059 8.846818,-8.62564 0.331756,-18.57832 -1.548194,-1.99053 z"
  var item3g=createNewLoadItem(paper,1042,477,path3g,"#9ff5ff",-40).show();
  var item4g=createNewLoadItem(paper,812,477,path4g,"#3cf3f0",110).show();
  paper.text(1042+30,447+90,'3G').attr({'fill':"#9ff5ff",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(1042-200,447+90,'4G').attr({'fill':"#3cf3f0",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
  paper.text(915,170,'C网今日').attr({'fill':"#52c1c1",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  paper.text(915+100,170,'新装量').attr({'fill':"#db4029",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
  var aresLoad=toDayNewLoadAreas(paper);
 
  function run(){
    var datas=createLoadDatas();
  aresLoad.setDatas(datas);
  var sumg3=0;
  var sumg4=0;
  for (var i=0;i<datas.length;i++){
     var data=datas[i];
        sumg3=sumg3+data.g3;
        sumg4=sumg4+data.g4;
  }
  var g3=sumg3;
  var g4=sumg4;
     item3g.setValue(g3+g4,g3);
     item4g.setValue(g3+g4,g4)
     setTimeout(run,6000);

  }
  run();
}

function toDayNewLoadAreas(paper){
  var instance={};
  var x=715;
  var y=600;
  var row=0;
  var col=0;
  var items=[];
  for (var i=0;i<global_config.area_names.length;i++){
    var name=global_config.area_names[i];
    var cx=x+(row*180);
    var cy=y+(col*90);
    row++;
    if((i+1)%3==0){
      row=0;
      col++;
    }
   var area=createTodayLoadArea(paper,cx,cy,name).show();
   items.push(area);  
  } //end of for 
  instance.setDatas=function(datas){
    for (var i=0;i<datas.length;i++){
       var data = datas[i];
       var obj=findObjByName(items,data.name);
       obj.setValue(data.g4,data.g3);
    }
  };

  return instance;
 
 
}

function createTodayLoadArea(paper,x,y,name){
   var TodayLoadArea=function(){
    this.x=x;
    this.y=y;
    this.name=name;
    this.long=70;
   }
   TodayLoadArea.prototype.show=function(){
    var self =this;
    paper.text(self.x,self.y,self.name).attr( {'fill':"#60e6e7",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
    paper.rect(self.x+42,self.y,0.5,45).attr({'fill':'none','stroke':'#006e6e','stroke-width':1})
    self.g4=paper.rect(self.x+42,self.y+6,self.long*0.1,4.5).attr({'fill':"#3cf3f0",'stroke-width':0});
    self.g3=paper.rect(self.x+42,self.y+6+15,self.long*0.1,4.5).attr({'fill':"#9ff5ff",'stroke-width':0});
   

    self.g4value=paper.chartsNumbser({'x':self.x+42+this.long/2,'y':self.y-10,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    paper.text(self.x+42+this.long+22,self.y+10,'4G').attr( {'fill':"#60e6e7",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
    
   self.g3value=paper.chartsNumbser({'x':self.x+42+this.long/2,'y':self.y+18+6+15,'value':0,
                                       attrs: {'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    paper.text(self.x+42+this.long+22,self.y+10+20,'3G').attr( {'fill':"#9ff5ff",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})

     self.sumvalue=paper.chartsNumbser({'x':self.x,'y':self.y+28,'value':0,
                                   attrs: {'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    return self;
   }

   TodayLoadArea.prototype.setValue=function(g4,g3){
      var self=this;
      self.g3.attr({'width':self.long*0.1});
      self.g4.attr({'width':self.long*0.1});
      var max=g4;
      if (g3>max){max=g3};
      var per4g=g4/max;
      var per3g=g3/max;
      self.g3.animate({'width':self.long*per3g},1000);
      self.g4.animate({'width':self.long*per4g},1000);
      this.g4value.setValue(g4);
      this.g3value.setValue(g3);
      this.sumvalue.setValue(g4+g3);
   }

   return new TodayLoadArea(x,y,name);
}

function createNewLoadItem(paper,x,y,path,color,dir){
    var NewLoad=function(x,y,path,color,dir){
      this.path=path
      this.x=x;
      this.y=y;
      this.num=8;
      this.items=[];
      this.gap=34
      this.color=color;
      this.dir=dir;
    }
    NewLoad.prototype.show=function(){
       for (var i = 0;i<this.num;i++){

           var item={};
           item.x=this.x;
           item.y=this.y-(i*this.gap);
           item.obj=paper.path(this.path)
                         .attr('transform',['t',item.x,item.y])
                         .attr({'fill':'none','stroke-width':1,'stroke':'#1b3d3c'})
         
          this.items.push(item);
       }

         this.valueObj=paper.chartsNumbser({'x':this.x+this.dir,'y':this.y,'value':9999,
                                   attrs: {'fill':this.color,'font-size':24,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
       return this;
    }
    NewLoad.prototype.setValue=function(max,value){
          var per=value/max;
          if (per<=0){per=0.1};
          this.show_num=parseInt( per*this.num);
          for(var i=0;i<this.num;i++){
              this.items[i].obj.attr({'fill':'none','stroke-width':1,'stroke':'#1b3d3c'})
          }
          this.valueObj.numobj.attr({'y':this.y});
          for (var i=0;i<=this.show_num;i++){
            var time=i*1000;
            this.items[i].obj.animate({"fill":this.color,'stroke-width':0},time)
          }
          var cy=this.y-(this.show_num*this.gap);
          var time=(this.show_num-1)*200;
           this.valueObj.numobj.animate({'y':cy},time);
           this.valueObj.setValue(value)

    }
    return new NewLoad(x,y,path,color,dir);

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
   paper.text(x+100,y+20,'OSS监控系统').attr({'fill':"#56caca",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});

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

function toDayShopping (paper){
  showBackGroundShopping(paper);
  showBackGroundAreaShopping(paper);
  showTextShoping(paper)
  showShoppingAnima(paper);
  
  //指标
  showTodayTop(paper);
 
}


function showBackGroundAreaShopping(paper){
  var x=1384;
  var y=545+50;
   paper.rect(x,y,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30+100,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30+100,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30+100,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30+150,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30+150,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30+150,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
  
   x=x+440;
   paper.rect(x,y,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30+100,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30+100,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30+100,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+30+150,0.5,8).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+15+18+10+30+150,0.5,18).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   paper.rect(x,y+15+18+10+15+18+10+30+150,0.5,9).attr({'fill':'none','stroke-width':1,'stroke':"#68efeb",'opacity':0.9});
   

}


function showTodayTop(paper){
   var num=paper.chartsNumbser({'x':1710,'y':175,'value':0,
                                   attrs: {'fill':"#ffffff",'font-size':34,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var x =1420;
   var y =546+50;
   var row=0;
   var col=0;
   var shopping_areas=[];
   for (var i=0;i<global_config.area_names.length;i++){
       var item=createAreaItemShopping(paper,x+(140*row),y+(65*col),global_config.area_names[i]).show();
       shopping_areas.push(item);
      row++;
      if((i+1)%3==0){
         row=0;
         col++;
      }

   }
    

  function run(){
    var datas=createDataShopping();
    var sum=0
    for (var i=0;i<datas.length;i++){
      var data=datas[i];
      var obj=findObjByName(shopping_areas,data.name);
      obj.setValue(data.value);
      sum+=data.value;
    }
    num.setValue(sum);
    setTimeout(run,4000);
  }
  run();
}




function createAreaItemShopping(paper,x,y,name){
      var AreaItemShopping=function(x,y,name){
         this.x=x;
         this.y=y;
         this.name=name;
         this.value=0;
      }
      AreaItemShopping.prototype.show=function(){
       paper.rect(this.x+50,this.y,93-50,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#157b80"});
       paper.rect(this.x,this.y+44,93,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#157b80"});
       paper.text(this.x+15,this.y,this.name).attr({'fill':"#59e5e7",'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
       this.num=paper.chartsNumbser({'x':this.x+93/2,'y':this.y+25,'value':this.value,
                                   attrs: {'fill':"#95fffe",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
       return this;
      }

       AreaItemShopping.prototype.setValue=function(value){
         this.num.setValue(value);
       }


    return new AreaItemShopping(x,y,name);
}

function showTextShoping(paper){
    paper.text(1340,177,'今日').attr({'fill':"#52c1c1",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(1340+76,177,'购物车').attr({'fill':"#db4029",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(1340+76+140,177,'VALUE').attr({'fill':"#1ed3ce",'font-size':10,'font-family': '微软雅黑'});
    paper.text(1340+17,177+323+30,'AREA').attr({'fill':"#52c1c1",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});
    paper.text(1340+17+75,177+323+30,'地区').attr({'fill':"#ff4d39 ",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});

}

function showBackGroundShopping(paper){
  
   var x=1361-50;
  var y=324-101;
   paper.rect(x,y,563,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x,y+109,563,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x,y+109+75,563,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x,y+109+75+49,563,0.5).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   
   paper.rect(x+76,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70+77,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70+77+10,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70+77+10+113,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70+77+10+113+75,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   paper.rect(x+76+60+70+77+10+113+75+55,y,0.5,235).attr({'fill':'none','stroke-width':1,'stroke':"#353535",'opacity':0.9});
   
  paper.circle(x+76,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75+55,y,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});

  paper.circle(x+76,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75+55,y+109,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});

  paper.circle(x+76,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75+55,y+109+75,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});

paper.circle(x+76,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});
  paper.circle(x+76+60+70+77+10+113+75+55,y+109+75+49,2).attr({'fill':'#353535','stroke-width':0,'stroke':"#353535",'opacity':0.9});

}
function showShoppingAnima(paper){
  var x=1361;
  var y=324;

  var strPath="m 0,0 123.23618,0 148.88431,-36.9083 56.30079,-1.25113 34.40604,10.6346 106.34594,-1.25113";
  createArcLine(paper,x,y,strPath,3000,'#80e1d8','line1').start();
  strPath="m 0,0 124.4873,-0.62556 147.00762,-48.79402 53.79854,0.62556 38.78499,12.51129 108.22263,0";
  createArcLine(paper,x,y+19,strPath,2000,'#2bcac6','line2').start();
  strPath="m 0,0 121.35949,0.31278 c 5.38196,-0.41824 8.94667,-1.87693 13.06259,-3.68392 l 129.24213,-56.74054 c 0,0 5.37093,-2.81657 9.79251,-4.10028 l 45.26832,-0.84673 c 5.37116,-0.0471 18.96112,4.65333 21.01462,6.28376 0,0 17.74008,9.31967 26.7207,11.41796 l 105.74911,0.62556";
  createArcLine(paper,x,y+19+19,strPath,4000,'#adf0e9','line3').start();
  strPath="m 0,0 123.80808,0.49601 c 9.24386,-2.57355 26.92308,-13.06737 26.92308,-13.06737 13.82178,-5.84489 107.54183,-57.07103 107.54183,-57.07103 8.33307,-5.04103 19.1648,-7.6148 19.1648,-7.6148 l 40.97446,-0.31279 c 0,0 13.32474,2.18196 26.38709,10.67918 7.07912,4.60506 18.56982,10.37061 26.49407,10.827 l 12.17753,0.70136 88.51736,-0.31278";
   createArcLine(paper,x,y+19+19+19,strPath,3000,'#2bcac6','line4').start();
   strPath="m 0,0 119.43201,-0.44234 c 5.52499,-0.44127 18.09443,-6.60305 27.93398,-13.02016 37.20618,-24.26494 107.01872,-67.07996 112.92701,-70.59875 6.40515,-3.81471 11.86848,-6.842 19.48755,-7.72447 l 35.60843,-0.22117 c 13.42098,0.37026 23.52441,7.35552 30.97379,13.78706 9.52218,8.22112 22.18414,13.29818 34.05031,12.75339 l 91.1222,0";
   createArcLine(paper,x,y+19+19+19+19,strPath,2000,'#2d6576','line5').start();
   strPath="m 0,0 114.56626,-0.44234 c 11.94966,-1.44128 25.94716,-11.12432 25.94716,-11.12432 8.97802,-7.02239 115.76805,-84.37954 115.76805,-84.37954 7.83908,-5.21678 14.729,-8.56165 23.74247,-9.59003 l 32.711,-0.18322 c 11.75949,1.65424 23.00381,7.1464 29.63783,14.15428 10.05384,10.62042 23.43896,15.08669 37.59797,17.69426 l 90.23752,0";
   createArcLine(paper,x,y+19+19+19+19+18,strPath,4000,'#60a9ba','line6').start();
   strPath="m 0,0 111.35045,-0.62557 c 11.99995,-0.0535 21.5498,-6.81539 29.28881,-13.14729 16.21477,-13.26658 110.36148,-88.42796 117.16159,-94.35357 6.6158,-5.76501 14.38652,-9.86095 22.76476,-10.7308 10.76514,-1.14774 22.56752,-2.69107 32.52935,-0.62556 18.23226,5.14549 28.64698,14.66158 29.75773,15.93677 11.93063,13.69679 21.86201,17.21878 37.49043,20.97152 l 88.20458,-0.62556";
   createArcLine(paper,x,y+19+19+19+19+18+19,strPath,3000,'#83eee8','line7').start();
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
    this.arc =paper.path(this.path).attr("transform",['t',self.x,self.y]).attr({"stroke-width":2,'stroke':"#414246"})
        var totalLength = this.arc.getTotalLength();
        var subPath = this.arc.getSubpath(totalLength-(totalLength/10),totalLength );
      this.obj = paper.path(subPath).attr("transform",['t',self.x,self.y]).attr({'stroke-width': 3,'stroke':'#62ff0d','stroke-opacity':0.7});
       
        paper.customAttributes[this.id] = function(x) {
               var subPath = self.arc.getSubpath(x,x+300);
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

function animSinUpToDonw(obj,centerY,range,speed,angle,opacity){
   var FanimSinUpToDonw =function(obj,centerY,range,speed,angle,opacity){
      this.tick=null;
      this.angle=angle;
      this.range=range;
      this.speed=speed;
      this.centerY=centerY
      this.obj=obj;
      this.opacity=opacity;

   }
   FanimSinUpToDonw.prototype.stop=function(){
      if (this.tick){
        window.clearTimeout(this.tick);
      }
   }
   FanimSinUpToDonw.prototype.start=function(){
    var self=this;
       self.run=function(){
        var opacityAnim4;
        
          if (self.angle==1){
              opacityAnim4 = Raphael.animation({
                                                    "50%":{'cy':centerY+range,'opacity':self.opacity,'y':centerY+range},
                                                    "100%":{'cy':centerY,'opacity':1,'y':centerY},
                                                    
                                                   },this.speed);

            }else{

                 opacityAnim4 = Raphael.animation({
                                                    "50%":{'cy':centerY-range,'opacity':self.opacity,'y':centerY-range},
                                                    "100%":{'cy':centerY,'opacity':1,'y':centerY},
                                                    
                                                   },this.speed);
            }
              self.obj.animate(opacityAnim4.repeat(Infinity))
            }

    
       self.run();

   }
   return new FanimSinUpToDonw(obj,centerY,range,speed,angle,opacity);
}

function animSinUpToDonwPath(obj,centerX,centerY,range,speed,angle,opacity){
   var FanimSinUpToDonwPath =function(obj,centerX,centerY,range,speed,angle,opacity){
      this.tick=null;
      this.angle=angle;
      this.range=range;
      this.speed=speed;
      this.centerY=centerY;
      this.centerX=centerX;
      this.obj=obj;
      this.opacity=opacity;

   }
   FanimSinUpToDonwPath.prototype.stop=function(){
      if (this.tick){
        window.clearTimeout(this.tick);
      }
   }
   FanimSinUpToDonwPath.prototype.start=function(){
    var self=this;
       self.run=function(){
        var opacityAnim4;
        
          if (self.angle==1){
              opacityAnim4 = Raphael.animation({
                                                    "50%":{'transform':['t',self.centerX,self.centerY+self.range],'opacity':self.opacity},
                                                    "100%":{'transform':['t',self.centerX,self.centerY],'opacity':1},
                                                    
                                                   },this.speed);

            }else{

                 opacityAnim4 = Raphael.animation({
                                                   "50%":{'transform':['t',self.centerX,self.centerY-self.range],'opacity':self.opacity},
                                                    "100%":{'transform':['t',self.centerX,self.centerY],'opacity':1},
                                                    
                                                   },this.speed);
            }
              self.obj.animate(opacityAnim4.repeat(Infinity))
            }

    
       self.run();

   }
   return new FanimSinUpToDonwPath(obj,centerX,centerY,range,speed,angle,opacity);
}


function animSinUpToDonwPath2(obj,x,centerY,range,speed,angle,rn){
   var FanimSinUpToDonwPath =function(obj,x,centerY,range,speed,angle,rn){
      this.tick=null;
      this.angle=angle;
      this.range=range;
      this.speed=speed;
      this.centerY=centerY
      this.obj=obj;
      this.x=x;
      this.rn=rn;

   }
   FanimSinUpToDonwPath.prototype.stop=function(){
      if (this.tick){
        window.clearTimeout(this.tick);
      }
   }
   FanimSinUpToDonwPath.prototype.start=function(){
    var self=this;
       function run(){
         var newCy=self.centerY+ Math.sin(self.angle) * self.range;
         self.angle+=self.speed;
         self.obj.attr('transform',['t',x,newCy,'r',self.rn]);
         self.tick = setTimeout(run, 1000/60);
       }
       run();
   }
   return new FanimSinUpToDonwPath(obj,x,centerY,range,speed,angle,rn);
}

function createLine(paper,x,y,length,color,opacityvalue)
{
  paper.rect(x+5/2,y+5/2,length,0.5).attr({'fill':"none",'stroke':color,'stroke-width':1,'opacity':opacityvalue});
  paper.rect(x,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});
  paper.rect(x+length,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});

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
