
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
var global_config={
     'workflow_names':['CRM下单' ,'服务单' ,'资源变更单' ,'流程启动' ,'派单' ,'归档']
 };

  var opacityAnim = Raphael.animation({ "50%": { opacity:0.3},
                                          "100%": { opacity:0.5 }
                                       }, 1000);

    var opacityAnim4 = Raphael.animation({ "50%": { opacity:0.1},
                                          "100%": { opacity:0.9 }
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
         justAnima(paper);
       drawBackGround(paper);
       drawBackAnima(paper,0,0,0.1);
       drawBackAnima(paper,230,300,0.1);
       drawBackCricle(paper);
       drawBackText(paper);
       drawPathAnima(paper);
       drawLine(paper);
       showTitle(paper);
       showTop(paper);
      

}// end of onload


function justAnima(paper){
  var x=80;
  var y=1020;
  var list1=createList(paper,x,y,130,90,'#24e1e7').show();
  var list2=createList(paper,x+130+30,y,130,90,'#1cb9be').show();
   var list3=createList(paper,x+130+60+130,y,350,90,'#b0fcf2').show();
   var list4=createList(paper,x+130+100+130+350,y,350,90,'#1cbabb').show();
   var list5=createList(paper,x+130+150+130+350+350,y,350,90,'#23e4e3').show();
   var list6=createList(paper,x+130+180+130+350+350+350,y,130,90,'#f9e6a2').show();
   var list7=createList(paper,x+130+230+130+350+350+350+100,y,130,90,'#b2fbf2').show();
    var colors=["#44aac1","#ff4f37","#b6f9f0","#224c58"]
   blockAnim(paper,45+100,161,colors);
  blockAnim(paper,1705-100,161,colors);
  animLineAndCirle(paper,470,160,"#6afcfc","#1db1bf",1.5,4)
  animLineAndCirle(paper,470,160+25,"#1db1bf","#6afcfc",1.2,2.5)
   animLineAndCirle(paper,470,160+25+25,"#6afcfc","#1db1bf",1.4,3.5)

    animLineAndCirle(paper,470+530,160,"#1db1bf","#6afcfc",1.2,2.5)
    animLineAndCirle(paper,470+530,160+25,"#6afcfc","#1db1bf",1.5,4)
   animLineAndCirle(paper,470+530,160+25+25,"#1db1bf","#6afcfc",1.3,3.2)
  function run2(){

     list1.push(fRandomBy(20,100));
     list2.push(fRandomBy(20,100));
     list3.push(fRandomBy(20,100));
     list4.push(fRandomBy(20,100));
     list5.push(fRandomBy(20,100));
     list6.push(fRandomBy(20,100));
     list7.push(fRandomBy(20,100));
  
     setTimeout(run2,1000/60);
  }
  run2();
}

  function animLineAndCirle(paper,x,y,color1,color2,a1,a2){
     paper.rect(x,y,455,1).attr({'fill':"none",'stroke-width':1,"stroke":"#53d7d9"})
    var c1=paper.circle(x+455/a1,y,10).attr({"fill":color1,'stroke-width':0});
    var c2=paper.circle(x+455/a2,y,5).attr({"fill":color2,'stroke-width':0});
    
    var c1a = Raphael.animation({ "50%": { 'cx':x+100},
                                          "100%": { 'cx':x+455/a1 }
                                       }, 4000);
  var c2a = Raphael.animation({ "50%": { 'cx':x+400},
                                          "100%": { 'cx':x+455/a2 }
                                       }, 4000);
    c1.animate(c1a.repeat(Infinity));
    c2.animate(c2a.repeat(Infinity));
     
  }

 function blockAnim(paper,x,y,colors){
  var items=[];
  for (var i=0;i<7;i++){
    var cy=y+(i*7);
    var obj1=paper.rect(x,cy,60,5).attr({"fill":colors[fRandomBy(0,colors.length-1)],'stroke-width':0})
    var obj2=paper.rect(x+62,cy,24,5).attr({"fill":colors[fRandomBy(0,colors.length-1)],'stroke-width':0})
    var obj3=paper.rect(x+62+26,cy,55,5).attr({"fill":colors[fRandomBy(0,colors.length-1)],'stroke-width':0})
    var obj4=paper.rect(x+62+26+57,cy,24,5).attr({"fill":colors[fRandomBy(0,colors.length-1)],'stroke-width':0})
    items.push(obj1);
    items.push(obj2);
    items.push(obj3);
    items.push(obj4);
  }
   function run(){
    for (var i=0;i<items.length/2;i++){
       var item1=items[fRandomBy(0,items.length-1)];
      item1.animate({"fill":colors[fRandomBy(0,colors.length-1)]},i*500);
        var opacityAnim4 = Raphael.animation({ "50%": { opacity:0.1},
                                          "100%": { opacity:0.9 }
                                       }, i*1000);
      item1.animate(opacityAnim4);
    }
    setTimeout(run,300);
   }
   run();

 }

function createList(paper,x,y,w,h,color){
    var CreateListTop= function(x,y,w,h,color){
      this.x=x;
      this.y=y;
      this.w=w;
      this.h=h;
      this.arry=[];
      this.arryObj=paper.set();
      this.limit=0;
      this.fixed_w=50;
      this.bar_w=6.6
      this.color=color;
    }
    CreateListTop.prototype.show=function(){
      paper.rect(this.x,this.y,this.w,1).attr({"stroke":"#004a4d",'stroke-width':0.5,'fill':'none'})
      var limit_w=this.w-this.fixed_w;
      this.limit=parseInt(limit_w/this.bar_w  );
      for (var i=0;i<this.limit;i++){
        this.arry.push(fRandomBy(20,100));
      }
      return this;
    }

    CreateListTop.prototype.push=function(data){
     
         if(this.arry.length>this.limit-1){
           this.arry.shift();
         }
          this.arry.push(data);
          var max=this.max()+this.max()*0.12;
        
          for (var i=0;i<this.arry.length;i++){
              var data=this.arry[i];
              var per=data/max;
              var cx=this.x+this.fixed_w+(i*this.bar_w)+0.5;
              var cy=(this.y-2)-(this.h*per);
              var obj= this.arryObj[i];
        
               if (!obj){
                 obj=paper.rect(cx,cy,this.bar_w,this.h*per).attr({"stroke":"black",'stroke-width':0.5,'fill':this.color});
                this.arryObj.push(obj)
               }else{
                obj.attr({'y':cy,'height':this.h*per})
               }
             

          }
    }
    CreateListTop.prototype.max=function(){
      var max=this.arry[0];
      for (var i=0;i<this.arry.length;i++){
          if(this.arry[i]>max){
            max=this.arry[i];
          }
      }//end of for
      return max;
    }


    return new CreateListTop(x,y,w,h,color);

}

function showTop(paper){
  var pos_confgs=[55,40,65,54,35,35]
  var arry=[];
  for (var i=0;i<global_config.workflow_names.length;i++){
    var name=global_config.workflow_names[i];
    var pos=pos_confgs[i];
    var node=createNode(paper,520+(i*180),280,name,pos).show();
    arry.push(node);
  }
   function run(){
     var node =arry[fRandomBy(0,arry.length-1)];
     node.setValue(fRandomBy(20,200));
    setTimeout(run,500)
   }
   run();
    
  
}
function createNode(paper,x,y,name,pos){
  var Node =function(x,y,name,pos)
  {
     this.x=x;
     this.y=y;
     this.name=name;
     this.pos=pos;
  }
  Node.prototype.show=function(){
      var self =this;

      paper.text(self.x,self.y,self.name).attr({'fill':"#fffecf",'font-size':24,'font-family': '微软雅黑','font-weight':'bold'})
      paper.rect(self.x+self.pos,self.y,1, fRandomBy(40,100)).attr({'fill':'none','stroke-width':1,'stroke':'#65ffff'})
      self.numobj=paper.chartsNumbser({'x':self.x,'y':self.y+30,'value':fRandomBy(20,100),
                                   attrs: {'fill':"#ffffff",'font-size':24,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
      return self; 
  }
  Node.prototype.setValue=function(val){
    var self=this;
    var color="#ffffff";
    self.numobj.setValue(val);
    if(val>=70){
      var color="yellow";
    }
    if(val>=150){
     var color="red";
    }
    self.numobj.numobj.attr({"fill":color});

  }
  return new Node(x,y,name,pos);
}


function showAnimPath(paper,x,y,rn){
  var pathstr="m 0,0 -9.28572,0.71429 -3.92857,4.64285 5,4.64286 8.92857,0 z";
  var config=[{'x':x,'y':y,'speed':0.1,'range':25,'flag':1,'color':'#9ffffe'},
              {'x':x,'y':y+50,'speed':0.1,'range':30,'flag':0,'color':'#16babc'},
              {'x':x,'y':y+50+50,'speed':0.1,'range':30,'flag':1,'color':'#fc4c3f'},
              {'x':x,'y':y+50+50+50,'speed':0.1,'range':30,'flag':0,'color':'#7ce9ec'},]
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<config.length;i++){
       line_array[i]=paper.path(pathstr).attr('fill',config[i].color).attr({"transform":['t',config[i].x,config[i].y,'r',rn]});
       line_array[i].y=config[i].y;
       line_array[i].animate(opacityAnim2.repeat(Infinity).delay(i*500));

     }
     for (var i=0;i<line_array.length;i++){
            lineAnim_arry[i]= animSinUpToDonwPath(line_array[i],x,line_array[i].y,config[i].range,config[i].speed,config[i].flag,rn);
            lineAnim_arry[i].start();
     } 
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
   paper.text(x+100,y+20,'OSS流程监控').attr({'fill':"#56caca",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'});

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


function drawBackText(paper){
   paper.text(135,350+50,'输入1').attr({'fill':"#ffffff",'font-size':8});
    paper.text(135,350+350,'输入2').attr({'fill':"#ffffff",'font-size':8});

     paper.text(955,500+60,'输入').attr({'fill':"#ffffff",'font-size':8});


    paper.text(1785,500+60,'输出').attr({'fill':"#ffffff",'font-size':8});
  
}
function drawPathAnima(paper){
     var str="m 0,0 0.60523,11.1967 8.17056,-5.44705 z"

     var str2="m  0,0 -0.60523,-11.1967 -8.17056,5.44705 z"
     var obj=paper.path(str).attr('transform',['t',100,355-30]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj,100,355-30,100,2000,1,0.5).start();

       var obj1=paper.path(str).attr('transform',['t',100,455]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj1,100,455,100,2000,0,0.5).start();


    var obj_r=paper.path(str2).attr('transform',['t',1820,355]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj_r,1820,355,100,2000,1,0.5).start();

       var obj1_r=paper.path(str2).attr('transform',['t',1820,455+30]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj1_r,1820,455+30,100,2000,0,0.5).start();


     var obj2=paper.path(str).attr('transform',['t',100,700-50]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj2,100,700-40,100,2000,1,0.5).start();

       var obj3=paper.path(str).attr('transform',['t',100,800-50]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj3,100,800-40,100,2000,0,0.5).start();


      var obj2_r=paper.path(str2).attr('transform',['t',1820,700-50+30]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj2_r,1820,700-50+30,100,2000,1,0.5).start();

       var obj13_r=paper.path(str2).attr('transform',['t',1820,800-50+30]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj13_r,1820,800-50+30,100,2000,0,0.5).start();


     var obj4=paper.path(str).attr('transform',['t',990,465]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj4,990,465,30,2000,1,0.5).start();

       var obj15=paper.path(str).attr('transform',['t',990,525]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj15,990,525,30,2000,0,0.5).start();


     var obj4=paper.path(str).attr('transform',['t',990,465+150]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj4,990,465+150,30,1500,1,0.5).start();

       var obj15=paper.path(str).attr('transform',['t',990,525+150]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj15,990,525+150,30,2000,0,0.5).start();



     var obj4_r=paper.path(str2).attr('transform',['t',950,475]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj4_r,950,475,30,1500,1,0.5).start();

       var obj15_r=paper.path(str2).attr('transform',['t',950,535]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj15_r,950,535,30,2000,0,0.5).start();

          var obj4_r=paper.path(str2).attr('transform',['t',950,475+150]).attr({'fill':'#fe5035','stroke-width':0});
     animSinUpToDonwPath(obj4_r,950,475+150,30,1500,1,0.5).start();

       var obj15_r=paper.path(str2).attr('transform',['t',950,535+150]).attr({'fill':'#64f1e9','stroke-width':0});
     animSinUpToDonwPath(obj15_r,950,535+150,30,2000,0,0.5).start();
}

function drawBackCricle(paper){
   var obj1= paper.circle(135,355-30,50).attr({'fill':'none','stroke-width':1  ,'stroke':"#27d4da"})
   animSinUpToDonw(obj1,355-30,40,1500,1,0.2).start();

   var obj2= paper.circle(135,455,50).attr({'fill':'none','stroke-width':1  ,'stroke':"#27d4da"})
   animSinUpToDonw(obj2,455,40,1500,0,0.2).start();

      var obj3= paper.circle(145,455,80).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj3,455,10,3000,1,0.2).start();

   var obj4= paper.circle(145,725,80).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj4,725,15,3000,1,0.2).start();

   var obj5= paper.circle(135,725,42).attr({'fill':'none','stroke-width':1  ,'stroke':"#27d4da"})
   animSinUpToDonw(obj5,725,40,1500,0,0.2).start();


   var obj6= paper.circle(145,760,60).attr({'fill':'none','stroke-width':1  ,'stroke':"#27d4da"})
   animSinUpToDonw(obj6,760,30,3000,1,0.2).start();


   var obj7= paper.circle(965,635,90).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj7,635,100,6000,0,0.4).start();

   var obj8= paper.circle(915,525,50).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj8,525,30,3000,1,0.4).start();


   var obj9= paper.circle(995,650,50).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj9,650,30,3000,0,0.4).start();

   var obj10= paper.circle(1760,765,88).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj10,765,30,3000,0,0.4).start();

    var obj11= paper.circle(1790,475,46).attr({'fill':'none','stroke-width':1  ,'stroke':"#1bffff"})
   animSinUpToDonw(obj11,475,30,3000,0,0.4).start();

}

function drawBackAnima(paper,cx,cy,opacityvalue){

        var obj1 = paper.rect(cx+457,cy+300,1,70).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj1,cy+300,100,2000,1,opacityvalue).start();

         var obj2 = paper.rect(cx+477,cy+300,1,110).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj2,cy+300,100,4000,1,opacityvalue).start();

         var obj3= paper.rect(cx+477+40,cy+400,1,80).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj3,cy+400,100,2000,0,opacityvalue).start();


        var obj4 = paper.rect(cx+477+40+82,cy+300+50,1,70).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj4,cy+300+50,100,2000,1,opacityvalue).start();

        var obj5 = paper.rect(cx+477+40+82+20,cy+300+50,1,110).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj5,cy+300+50,100,4000,1,opacityvalue).start();

         var obj6 = paper.rect(cx+477+40+82+20+20,cy+300+50+100,1,80).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj6,cy+300+50+100,100,2000,0,opacityvalue).start();


        var obj7 = paper.rect(cx+477+40+82+20+20+125,cy+300+50+100,1,80).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj7,cy+300+50+100,100,2000,0,opacityvalue).start();

        var obj8 = paper.rect(cx+477+40+82+20+20+125+50,cy+300+50+100,1,110).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj8,cy+300+50+100,100,4000,0,opacityvalue).start();

         var obj9 = paper.rect(cx+477+40+82+20+20+125+70,cy+300+50+100,1,60).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj9,cy+300+50+100,100,2000,0,opacityvalue).start();

         var obj10 = paper.rect(cx+477+40+82+20+20+125+70+30,cy+300+50,1,30).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj10,cy+300+50,100,3000,1,opacityvalue).start();

        var obj11 = paper.rect(cx+477+40+82+20+20+125+70+30+200,cy+300+50+50,1,140).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj11,cy+300+50+50,70,2000,0,opacityvalue).start();

        var obj12 = paper.rect(cx+477+40+82+20+20+125+70+30+200+20,cy+300+50,1,100).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj12,cy+300+50,70,4000,1,opacityvalue).start();


        var obj13 = paper.rect(cx+477+40+82+20+20+125+70+30+200+20+30,cy+300+50+50,1,140).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj13,cy+300+50+50,30,2000,1,opacityvalue).start();


        var obj14 = paper.rect(cx+477+40+82+20+20+125+70+30+200+20+30+160,cy+300+50,1,140).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj14,cy+300+50,80,2000,1,opacityvalue).start();

        var obj15= paper.rect(cx+477+40+82+20+20+125+70+30+200+20+30+160+20,cy+300+50,1,70).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj15,cy+300+50,80,4000,1,opacityvalue).start();

        var obj15 = paper.rect(cx+477+40+82+20+20+125+70+30+200+20+30+160+20+30,cy+300+50,1,140).attr({'fill':'none','stroke-width':1,'stroke':"#0c4745"})
        animSinUpToDonw(obj15,cy+300+50,80,3000,1,opacityvalue).start();



}
function drawBackGround(paper){
   drawbg(paper,100,260,'#353535',0.9)
   drawbg(paper,100,585,'#353535',0.9)
   drawbg2(paper,969,260,'#353535',0.9);
     drawbg2(paper,969,585,'#353535',0.9);


}
function drawbg2(paper,x,y,color,opacityvalue){
 paper.rect(x,y,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50+100,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50+260,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110+172,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110+172+10,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110+172+10+115,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110+172+10+115+120,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+40+85+110+172+10+115+120+90,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});

 paper.circle(x+40,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120+90,y,3).attr({'fill':color,'opacity':opacityvalue});

 paper.circle(x+40,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120+90,y+50,3).attr({'fill':color,'opacity':opacityvalue});

 paper.circle(x+40,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120+90,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});

  paper.circle(x+40,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+40+85+110+172+10+115+120+90,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 
}
function drawbg(paper,x,y,color,opacityvalue){
 paper.rect(x,y,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50+100,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x,y+50+260,853,0.5).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120+110,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120+110+11,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120+110+11+175,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120+110+11+175+110,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.rect(x+110+90+120+110+11+175+110+80,y,0.5,310).attr({'fill':'none','stroke-width':1,'stroke':color,'opacity':opacityvalue});
 paper.circle(x+110,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110+80,y,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110+80,y+50,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110+80,y+50+100,3).attr({'fill':color,'opacity':opacityvalue});
paper.circle(x+110,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});
 paper.circle(x+110+90+120+110+11+175+110+80,y+50+260,3).attr({'fill':color,'opacity':opacityvalue});


 
}
function drawLine(paper){
   var x=172;
        var y=325;

        var strPath="m 0,0 171.58184,0.60523 c 46.42428,-2.35904 145.44359,107.31121 224.84179,165.22695 7.78596,5.0017 21.26554,14.372 38.1293,16.34113 l 39.94497,0.3026 c 12.37968,0.26682 37.5163,-11.14334 47.4852,-21.3353 21.30379,-22.89578 37.86847,-29.55865 59.31585,-33.61499 l 140.73676,-0.42796";
        createArcLine(paper,x,y,strPath,3000,'#61aabd','line1').start();
        var strPath1="m 0,0 174.17975,1.71184 c 39.21728,-0.48048 182.3397,121.28748 223.15706,146.47154 8.53535,5.26626 21.06749,11.43328 32.33509,13.15756 16.26248,0.30127 30.81313,1.33895 50.49929,-0.42796 11.01959,-0.27872 30.68493,-10.24996 50.04751,-26.04754 16.96037,-13.83766 32.96121,-20.6192 50.95106,-22.31195 l 139.94294,0"
        createArcLine(paper,x,y+30,strPath1,2000,'#22e0e0','line2').start(); 
        var strPath2="m 0,0 177.17547,0.42796 c 32.43543,1.5033 215.59857,125.22115 215.59857,125.22115 12.28915,7.13371 25.42655,12.65496 33.04622,13.86587 l 54.35093,1.28388 c 14.5777,-2.74083 32.73731,-8.53974 50.84902,-23.2974 12.91318,-10.52183 31.97492,-17.76809 50.57751,-17.78677 l 141.22682,-0.42796";
        createArcLine(paper,x,y+30+30,strPath2,4000,'#2f788b','line3').start(); 
        var strPath3="m 0,0 c 0,0 172.73339,-0.32376 175.03567,-0.42797 7.84432,2.44189 21.6976,1.40698 30.09891,5.80362 72.8336,38.11581 183.90443,98.81755 194.59269,104.58202 10.12345,5.45985 14.42974,5.3494 20.52951,7.73134 21.96862,2.41445 41.79743,3.41885 63.76605,1.28388 18.77317,-1.86821 35.77871,-8.06065 48.1211,-16.52855 16.1138,-14.28944 33.06057,-17.75026 50.30971,-17.28029 l 142.5107,0";
        createArcLine(paper,x,y+30+30+30,strPath3,3000,'#22dedd','line4').start(); 
        var strPath4="m 0,0 193.67261,1.81567 c 40.13107,11.51271 83.92804,35.12646 124.13291,54.82026 43.05111,21.08799 77.32228,37.15197 100.40628,40.20037 22.3934,3.67994 44.78679,2.88717 67.18019,1.81568 16.7378,-1.67229 30.45498,-6.51512 43.25966,-13.70905 12.76143,-8.17394 26.69874,-13.40819 42.68256,-13.52616 l 151.30673,0.60523";
        createArcLine(paper,x,y+30+30+30+30,strPath4,2000,'#2a6c7a','line5').start(); 
        var strPath5="m 0,0 185.80467,0.60523 c 9.41293,-1.05216 21.7634,3.68148 31.66536,7.18447 16.243,5.74625 172.77474,57.33854 172.77474,57.33854 7.9401,3.2544 23.22221,8.72246 31.5984,8.70944 28.30507,2.07857 54.61558,1.30667 79.71268,0.17727 5.33794,1.5406 32.85883,-12.786 42.61744,-14.90654 4.6725,-2.56349 26.7987,-6.36073 42.89683,-5.24322 l 136.78127,1.21046";
        createArcLine(paper,x,y+30+30+30+30+30,strPath5,4000,'#b5faf7','line6').start();
        var strPath6="m 0,0 191.85693,0.60522 c 75.42228,18.21551 150.70463,36.71086 224.53919,58.10179 l 81.10041,0 c 13.32441,-3.52123 26.57426,-7.19156 40.19862,-10.11287 8.60501,-1.84507 17.35941,-3.39136 26.37634,-4.41258 l 159.7799,-1.21045";
        createArcLine(paper,x,y+30+30+30+30+30+30,strPath6,4000,'#327f93','line7').start();
        //2
        var x1=x;
        var y1=y+30+30+30+30+30+30+145;
        var strPath7="m 0,0 197.30398,0.60522 225.14441,-57.49655 80.49518,0.60522 58.10178,13.92022 160.38514,-0.60522"
        createArcLine(paper,x1,y1,strPath7,3000,'#27616d','line8').start();
        var strPath8="m 0,0 193.06738,-0.60523 227.56533,-73.83768 74.44291,0.60523 c 13.54923,2.51777 33.221,8.40602 43.87037,13.71737 23.9106,9.1221 34.12501,4.4127 49.9398,6.25511 l 133.75515,-0.60523"
        createArcLine(paper,x1,y1+25,strPath8,2000,'#a4e5e1','line9').start();
        var strPath9="m 0,0 184.02283,-0.42796 c 3.2129,-0.42444 10.25191,-1.54411 18.10101,-4.79169 0,0 208.09743,-93.5506 219.41682,-94.49504 l 73.18117,0.85592 c 15.19863,1.13235 31.61569,10.69174 39.7794,15.6962 8.89584,5.64553 22.3816,11.87587 32.97381,12.1212 l 154.06562,-0.85592";
        createArcLine(paper,x1,y1+25+31,strPath9,4000,'#307e92','line10').start();
        var strPath10="m 0,0 182.77853,0 c 7.9496,-0.364 17.17449,-1.868 23.05343,-5.31119 63.42675,-37.14789 202.1019,-108.05069 204.21979,-109.36093 1.6879,-1.04423 8.21515,-2.83717 10.42965,-3.04451 l 68.54195,-0.45392 c 2.61113,-0.16047 9.10589,0.80557 10.51744,2.08013 12.40989,4.49588 25.77181,11.40979 32.30428,15.7697 13.42214,9.81964 22.58554,12.09799 37.67346,14.98372 l 150.09627,0"
        createArcLine(paper,x1,y1+25+31+29,strPath10,3000,'#23d3d3','line11').start();
        var strPath11="m 0,0 181.45507,0.42796 c 4.66071,0.0478 14.24459,-2.04336 19.42567,-5.26603 75.75708,-45.84187 198.042,-121.77027 208.54643,-127.74913 6.33665,-3.56541 13.32007,-4.04759 19.17483,-5.21594 l 44.29387,-0.42796 c 21.9294,-0.93832 41.21864,5.8299 59.60704,21.07805 16.586,14.48541 30.541,15.92164 50.80665,19.1502 l 139.94294,-0.42796"
        createArcLine(paper,x1,y1+25+31+29+28,strPath11,2000,'#286d7c','line12').start();
        var strPath12="m 0,0 173.75178,0 c 16.18799,-0.80341 23.34795,-2.44414 37.41839,-12.38544 64.3009,-43.8001 127.39134,-93.34985 191.69223,-137.14994 7.9624,-5.42378 14.41173,-8.42665 25.09765,-10.52168 l 43.22397,-1.28388 c 22.99498,1.41792 39.28144,4.66558 58.15537,25.4012 15.7484,13.52964 29.82835,20.46557 53.54221,23.38625 l 140.37091,0"
        createArcLine(paper,x1,y1+25+31+29+28+28,strPath12,4000,'#25e1e2','line13').start();
        var strPath13="m 0,0 175.5158,-0.30261 c 18.59135,-3.7344 24.84655,-7.46881 31.68269,-11.20321 l 29.24805,-23.21088 161.5809,-132.3984 c 9.51554,-7.83697 19.54697,-11.54681 29.86799,-12.9399 l 47.81293,-1.51307 c 22.42782,3.75423 38.91271,11.6357 52.7819,25.76425 14.05322,15.15984 30.28417,28.38346 61.30337,29.3114 l 132.54467,-0.30261";
        createArcLine(paper,x1,y1+25+31+29+28+28+29,strPath13,3000,'#74cfe2','line14').start();
        //3
        var x2=x+850;
        var y2=y+128; 
        var strPath14="m 0,0 143.4388,1.21046 c 14.4434,2.41587 38.3989,9.34105 50.1741,26.14093 17.0462,16.49586 34.7779,28.95783 54.5302,27.72426 l 30.8665,1.81568 c 14.5536,-2.50352 29.2973,-4.05648 42.2964,-14.33273 l 192.8304,-154.71702 c 10.5984,-7.55265 27.0848,-11.98299 39.6463,-13.12355 l 168.253,-0.60522"
        createArcLine(paper,x2,y2,strPath14,2000,'#6fcbda','line15').start();
        var strPath15="m 0,0 139.2021,0 c 24.7223,3.22659 45.0473,13.57743 53.5186,23.03677 17.2078,19.2147 38.173,24.22923 56.6327,27.19706 l 45.6427,-2.17651 c 3.5305,1.0539 30.3363,-11.72749 33.3217,-15.42102 2.5649,-2.4525 177.5793,-130.33414 179.8272,-129.78286 12.0801,-8.39413 21.7064,-12.17609 37.8367,-14.96097 l 176.6592,0.14055";
        createArcLine(paper,x2,y2+25,strPath15,3000,'#24e0e2','line16').start();
        var strPath16="m 0,0 139.515,0 c 19.4786,3.70454 39.1201,5.10866 57.503,21.41428 12.5128,12.46532 35.1241,19.32575 53.7666,20.31183 l 44.2939,-0.64194 c 9.7751,-1.61703 12.9725,-2.39118 22.3913,-8.05512 l 183.3469,-114.21675 c 11.5452,-9.38198 37.3132,-17.70066 43.9765,-17.24311 l 178.0313,0"
        createArcLine(paper,x2,y2+25+17,strPath16,4000,'#327f8f','line17').start();
        var strPath17="m 0,0 145.5064,0.42796 c 0,0 30.4972,3.81598 45.9715,16.37121 15.75,12.77896 45.1894,17.00967 46.4679,17.00967 l 55.6348,0 c 10.3406,-1.73153 20.174,-4.26002 28.5288,-9.11215 l 195.3068,-104.25152 c 10.2118,-4.68535 18.0919,-5.21006 31.2286,-5.60923 l 172.8959,0.42796"
        createArcLine(paper,x2,y2+25+17+13,strPath17,3000,'#24d6d6','line18').start();
        var strPath18="m 0,0 150.7015,0 c 12.5565,0.71515 31.698,6.94343 43.7583,13.76469 13.5188,7.88124 28.6845,12.87687 38.0879,13.23818 l 62.9543,0.081 c 10.5884,-0.50202 17.2472,-3.19201 24.6042,-6.41596 l 189.7894,-84.18132 c 10.4874,-5.34869 19.8227,-6.65738 26.4867,-7.44948 l 185.6534,-0.45392";
        createArcLine(paper,x2,y2+25+17+13+13,strPath18,2000,'#307988','line19').start();
        var strPath19="m 0,0 164.6217,1.21046 59.9175,18.76203 80.5749,0.5318 c 4.8741,-0.96849 151.4124,-49.60413 227.1185,-74.40619 l 193.4345,0.64194";
        createArcLine(paper,x2,y2+25+17+13+13+13,strPath19,4000,'#98ded4','line20').start();
        var strPath20="m 0,0 164.6217,-0.60523 57.4966,14.52545 80.4952,0 226.3548,-57.49656 191.2517,-1.21046";
        createArcLine(paper,x2,y2+25+17+13+13+13+13,strPath20,3000,'#296e7e','line21').start();
       //4
        var x3=x2;
        var y3=y2+25+17+13+13+13+13+60;
        var strPath21="m 0,0 159.7799,0 62.9436,-13.31499 81.7056,-0.60523 226.9601,57.49656 193.0674,0";
        createArcLine(paper,x3,y3,strPath21,3000,'#2f8093','line22').start();
        var strPath22="m 0,0 163.6947,0.42796 c 6.0857,-0.30688 9.8231,-2.02465 15.1047,-4.2257 4.2168,-1.75731 29.3019,-9.56606 32.2466,-11.07067 5.4063,-2.76232 9.3698,-3.80207 14.5958,-3.74785 l 74.3582,-0.21398 c 5.857,-0.0679 11.3408,1.9272 13.8199,2.71752 6.1158,1.94969 194.3824,63.80507 197.8318,65.19183 11.7191,4.71146 17.0509,5.37628 23.2983,5.69978 l 187.4465,0";
        createArcLine(paper,x3,y3+13,strPath22,2000,'#abede9','line23').start();
        var strPath23="m 0,0 147.6462,0 c 19.2424,-1.8124 32.9397,-6.81606 48.1295,-14.82084 15.0409,-9.12076 27.9966,-14.33384 49.8733,-12.99657 l 52.6392,1.0699 c 13.5493,1.6553 21.0798,4.59967 32.5981,10.52032 l 152.0933,67.25543 c 18.9945,8.07745 44.7072,20.66328 58.3899,20.01313 l 180.1711,-0.85592";
        createArcLine(paper,x3,y3+13+14,strPath23,4000,'#2f7c8e','line24').start();
        var strPath24="m 0,0 154.6507,-0.42796 c 16.9902,-3.59137 34.3344,-10.67099 47.155,-20.84593 15.199,-9.35171 31.2796,-14.73638 48.7583,-13.82927 l 51.2303,1.28388 c 13.5289,2.94791 25.992,9.08883 38.3799,16.60019 l 154.9584,83.00388 c 17.4989,9.28946 29.2389,16.95985 44.6438,18.14145 l 183.8611,1.21046";
        createArcLine(paper,x3,y3+13+14+14,strPath24,3000,'#21d1cf','line25').start();
        var strPath25="m 0,0 141.2268,1.28388 c 21.678,-4.22336 40.6958,-10.91698 54.4059,-22.53915 20.4644,-15.93428 37.513,-19.48633 53.4401,-18.97298 l 42.1541,-0.21398 c 15.6144,1.46411 25.0465,5.55178 39.7365,15.77577 l 170.915,107.31211 c 14.3589,10.55952 25.4254,14.84132 43.3427,16.64109 l 177.1755,-0.42796"
        createArcLine(paper,x3,y3+13+14+14+14,strPath25,2000,'#2c6f7f','line26').start();
        var strPath26="m 0,0 140.7989,0.42796 c 19.9534,-1.89636 36.8799,-8.93933 52.0197,-25.27633 16.975,-12.10312 34.2354,-23.63545 57.5381,-23.08315 l 37.2325,-0.42796 c 10.9252,0.81661 20.2848,4.034 28.755,10.23146 l 195.8987,139.64111 c 11.6089,8.35647 25.8789,10.72565 40.6815,11.89633 l 168.6163,0";
        createArcLine(paper,x3,y3+13+14+14+14+14,strPath26,4000,'#21bcb6','line27').start();
        var strPath27="m 0,0 141.0178,0.60523 c 19.879,-3.3687 39.2194,-12.13014 54.3507,-28.69517 12.211,-12.5299 27.3691,-23.2588 53.985,-26.98571 l 41.7606,1.51307 c 11.2817,2.16338 21.7887,7.03787 31.4565,14.84983 l 182.2378,148.19203 c 14.9125,10.33173 29.2199,16.34291 44.7376,17.92099 l 170.674,0.30262";
        createArcLine(paper,x3,y3+13+14+14+14+14+14,strPath27,3000,'#71cedf','line28').start(); 
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

function createLine(paper,x,y,length,color,opacityvalue)
{
  paper.rect(x+5/2,y+5/2,length,0.5).attr({'fill':"none",'stroke':color,'stroke-width':1,'opacity':opacityvalue});
  paper.rect(x,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});
  paper.rect(x+length,y,5,5).attr({'fill':color,'stroke-width':0,'opacity':opacityvalue});

}
/**
   * 生成随便数
   */
function fRandomBy(under, over){ 
     return parseInt(Math.random()*(over-under+1) + under); 
} 