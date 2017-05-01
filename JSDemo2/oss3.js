var global_config={
     'workflow_names':['CRM下单' ,'服务单' ,'资源变更单' ,'流程启动' ,'派单' ,'归档']
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
	      paper.setViewBox(0,0,1920,1080,true)
 paper.setSize('100%', '100%');;
        animateFun(paper);
        animateTop(paper);

         var x=45;
         var y=50;
         paper.rect(x,y,8,8).attr({"fill":"#a1ffff",'stroke-width':1})
         paper.rect(x+1824,y,8,8).attr({"fill":"#a1ffff",'stroke-width':1})
         paper.rect(x,y+4,1824,1.5).attr({"fill":"#a1ffff",'stroke-width':0})
         
         paper.rect(x,y-10,8,8).attr({"fill":"#588c8c",'stroke-width':1})
         paper.rect(x+1824,y-10,8,8).attr({"fill":"#588c8c",'stroke-width':1})
         paper.rect(x,y+4-10,1824,1.5).attr({"fill":"#588c8c",'stroke-width':0})


         paper.rect(x,y+972,8,8).attr({"fill":"#a1ffff",'stroke-width':1})
         paper.rect(x+1824,y+972,8,8).attr({"fill":"#a1ffff",'stroke-width':1})
         paper.rect(x,y+972+4,1824,1.5).attr({"fill":"#a1ffff",'stroke-width':0})

      paper.rect(x,y+972+10,8,8).attr({"fill":"#588c8c",'stroke-width':1})
         paper.rect(x+1824,y+972+10,8,8).attr({"fill":"#588c8c",'stroke-width':1})
         paper.rect(x,y+972+4+10,1824,1.5).attr({"fill":"#588c8c  ",'stroke-width':0})
         
      titleBarTime(paper)
         
            
}// end of onload


function titleBarTime(paper){
  var x=820;
  var y=28;
  var date1 = paper.text(x+60,y+140,getWeek()).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
  var date2 = paper.text(x+180,y+140,getHH()).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
     function run(){
        date1.attr({'text':getWeek()});
        date2.attr({'text':getHH()});
        setTimeout(run,1000);
     }
     run();


}

function animateTop(paper){
     // var indicator=paper.rect(100,100,40,5,4).attr("fill","red");
      // var roateAnim = Raphael.animation({transform : ["r", 0, 100, 100 ] },1000);
      //    indicator.attr({transform : ["r", 360, 100, 100 ] });
      //       indicator.animate(roateAnim.repeat(Infinity));
      var x=430;

    var node1=createProcessNode(paper,400,664,25,0,{"x":255,"y":644,'text':"CRM下单"});
        node1.work=createWorkNode(paper,x,865);
        datsRect(paper,x+70,865+25);
    node1.start();

    var node2=createProcessNode(paper,400,664+60,25,1,{"x":255,"y":644+60,'text':"服务单"});
         node2.work=createWorkNode(paper,x+207,865);
           datsRect(paper,x+207+70,865+25);
    node2.start();

    var node3=createProcessNode(paper,400,664+60+60,25,0,{"x":255,"y":644+60+60,'text':"资源变更单"});
        node3.work=createWorkNode(paper,x+207+207,865);
          datsRect(paper,x+207+207+70,865+25);

    node3.start();


    var node4=createProcessNode(paper,400+1120,664,25,1,{"x":255+1120+200,"y":644,'text':"流程启动"});
        node4.work=createWorkNode(paper,x+207+207+207,865);
          datsRect(paper,x+207+207+207+70,865+25);
    node4.start();

    var node5=createProcessNode(paper,400+1120,664+60,25,0,{"x":255+1120+200,"y":644+60,'text':"派单"});
    node5.work=createWorkNode(paper,x+207+207+207+207,865);
    datsRect(paper,x+207+207+207+207+70,865+25);
    node5.start();

    var node6=createProcessNode(paper,400+1120,664+60+60,25,1,{"x":255+1120+200,"y":644+60+60,'text':"派单"});
    node6.work=createWorkNode(paper,x+207+207+207+207+207,865);
     datsRect(paper,x+207+207+207+207+70,865+25);
    node6.start();
        var workflow_listLine=workflowListLine(paper);
     function run (){
          var datas=createDataTop10();
        node1.setValue(datas[0].value,{min:50,max:80})
        node2.setValue(datas[1].value,{min:50,max:80})
        node3.setValue(datas[2].value,{min:50,max:80})
        node4.setValue(datas[3].value,{min:50,max:80})
        node5.setValue(datas[4].value,{min:50,max:80})
        node6.setValue(datas[5].value,{min:50,max:80})
        workflow_listLine.inputData(datas,getHH2());
        
        setTimeout(run,5000);
     }
     run();
     var arrys=[node1,node2,node3,node4,node5,node6];
   function animRun(){
        var index =fRandomBy(0,arrys.length-1);
        var node =arrys[index];
        if(node.work){
         node.work.anim();
        }

        setTimeout(animRun,1000/60);

   }
   animRun();
}

function workflowListLine(paper){

  var x=735;
  var y=800
    paper.text(x+230,y-150-50,"处理总量趋势图").attr({'fill':"#ffecba",'font-size':24,'font-family': '微软雅黑','font-weight':'bold'})
    return paper.chartListLineBar({
           'x':x,
           'y':y,
           'item_space':75,
           'keys':global_config.workflow_names
    });
}
function datsRect(paper,x,y) {
     paper.rect(x,y,68,17).attr({"fill":"none","stroke-width":2,"stroke":"#9fffff"})
     paper.text(x+68/2,y+8,"DATAS").attr({ "font-family": "arial", 'fill': "#a1ffff", "font-size":4 })
}


function createWorkNode(paper,x,y){
  var WorkNode= function(x,y){
    this.x=x;
    this.y=y;
  
  }
  WorkNode.prototype.start=function(colors,text_config){
    this.colors=colors;
    this.textConfig=text_config;
    var pathstr="m 0,0 -32.14286,17.14286 0.71429,33.57143 30,17.14286 30,-16.42858 0.71428,-33.57142 z"
    this.centerFrame=paper.path(pathstr).attr("transform",['t',this.x,this.y]).attr({"fill":"none",'stroke':colors[0],'stroke-width':2});
   
    this.leftRect=paper.rect(this.x-55,this.y+30,20,6).attr({"fill":colors[0],'stroke-width':0})
    this.rightRect=paper.rect(this.x+35,this.y+30,20,6).attr({"fill":colors[0],'stroke-width':0})
    

    this.text=paper.text(this.x,this.y+100,this.textConfig.text)
                   .attr({'fill':this.colors[0],'font-size':24,'font-family': '微软雅黑','font-weight':'bold'})
    this.nums =paper.chartsNumbser({'x':this.x,'y':this.y+32,'value':0,
                                   attrs: {'fill':colors[0],'font-size':24,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
  }

  WorkNode.prototype.setValue=function(val,color){
    this.nums.setValue(val);
    this.nums.numobj.attr("fill",color);
    this.centerFrame.animate({"stroke":color},1000);
    this.leftRect.animate({"fill":color},1000);
    this.rightRect.animate({"fill":color},1000);
    this.text.attr("fill",color);

     
  }
  WorkNode.prototype.anim=function(){
       var opacityAnimWorkNode = Raphael.animation({ "50%": { opacity:0.5},
                                          "100%": { opacity:1 }
                                       }, 1000);
   this.centerFrame.animate(opacityAnimWorkNode);
   this.leftRect.animate(opacityAnimWorkNode);
   this.rightRect.animate(opacityAnimWorkNode);
   
  }
  return new WorkNode(x,y);

}


function createProcessNode(paper,x,y,r,dir,textConfig){
     var ProcessNode =function(x,y,r,dir,textConfig){
       this.x=x;
       this.y=y;
       this.r=r;
       this.colors=["#a9f8f2","#ff4e3a","#fdff63"];
       this.dir=dir;
       this.textConfig=textConfig;
     }
     ProcessNode.prototype.start=function(){
       this.out_c=paper.circle(this.x,this.y,this.r).attr({'fill':'none','stroke-width':2,'stroke':this.colors[0]})
       this.inner_c=paper.circle(this.x,this.y,this.r/5).attr({'fill':this.colors[0],'stroke-width':0})
       this.indicator=paper.rect(this.x,this.y-(this.r/7/2),this.r/1.2,this.r/7,2).attr({"fill":this.colors[0],'stroke-width':0});
        if (this.dir==0){
            var roateAnim = Raphael.animation({transform : ["r", 0, this.x, this.y ] },1000);
            this.indicator.attr({transform : ["r", 360, this.x, this.y ] });
            this.indicator.animate(roateAnim.repeat(Infinity));
        }else{
          var roateAnim = Raphael.animation({transform : ["r", 360, this.x, this.y ] },1000);
            this.indicator.attr({transform : ["r", 0, this.x, this.y ] });
            this.indicator.animate(roateAnim.repeat(Infinity));
        }

         var path1="m 0,0 -7.32361,7.82868 -0.50507,20.20305 6.06091,4.54569"
         var path2="m 0,0 4.79822,6.06092 0.50508,22.22336 -4.79823,3.78807"
          paper.path(path1).attr("transform",['t',this.textConfig.x,this.textConfig.y])               
                           .attr({'fill':"none",'stroke-width':2,"stroke":"#5ce5e7"})
          paper.path(path2).attr("transform",['t',this.textConfig.x+100,this.textConfig.y])               
                           .attr({'fill':"none",'stroke-width':2,"stroke":"#5ce5e7"})
         this.text=paper.text(this.textConfig.x+100/2,this.textConfig.y+10,this.textConfig.text)
                       .attr({'fill':this.colors[0],'font-size':18,'font-family': '微软雅黑','font-weight':'bold'})
         this.staus=paper.text(this.textConfig.x+100/2,this.textConfig.y+30,"正常")
                       .attr({'fill':this.colors[0],'font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
       if (this.work){
        this.work.start(this.colors,this.textConfig);
       }
     }

     ProcessNode.prototype.setValue=function(curVal,config){
      var color=this.colors[0];
       if (curVal>=config.max){
        this.text.attr("fill",this.colors[1]);
        this.staus.remove();
        this.staus=paper.text(this.textConfig.x+100/2,this.textConfig.y+30,"紧急")
                       .attr({'fill':this.colors[1],'font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
       this.out_c.animate({"stroke":this.colors[1]},100);
        this.inner_c.animate({"fill":this.colors[1]},100);
         this.indicator.animate({"fill":this.colors[1]},100);
         color=this.colors[1];
       }else if (curVal>=config.min){
        this.text.attr("fill",this.colors[2]);
        this.staus.remove();
        this.staus=paper.text(this.textConfig.x+100/2,this.textConfig.y+30,"警告")
                       .attr({'fill':this.colors[2],'font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
       this.out_c.animate({"stroke":this.colors[2]},100);
        this.out_c.animate({"stroke":this.colors[2]},100);
        this.inner_c.animate({"fill":this.colors[2]},100);
         this.indicator.animate({"fill":this.colors[2]},100);
         color=this.colors[2];
       }else{
        this.text.attr("fill",this.colors[0]);
        this.staus.remove();
        this.staus=paper.text(this.textConfig.x+100/2,this.textConfig.y+30,"正常")
                       .attr({'fill':this.colors[0],'font-size':16,'font-family': '微软雅黑','font-weight':'bold'})
        this.out_c.animate({"stroke":this.colors[0]},100);
         this.out_c.animate({"stroke":this.colors[0]},100);
        this.inner_c.animate({"fill":this.colors[0]},100);
         this.indicator.animate({"fill":this.colors[0]},100);
         color=this.colors[0];
       }
       if (this.work){
          this.work.setValue(curVal,color);
       }
     }

     return new ProcessNode(x,y,r,dir,textConfig)
}


function animateFun(paper){
       paper.animateCircleV3(); //总线圆动画
       showTitleAnim(paper);
       showTitleNoAnim(paper);
       showAnimLine(paper,1695,170);
       showAnimLine(paper,185,156);
       showAnimRect(paper,245,136);
       showAnimRect(paper,1674,136);
       showAnimPath(paper,1765,229,0);
       showAnimPath(paper,167,229,180);
     showAnimCircle(paper,270,149);
       showAnimCircle(paper,1650,149);
       showAnimAdd(paper,1800,170);
      showAnimAdd(paper,127,170);
       showAnimDotLine(paper);
      showAnimLight(paper)
       showAnimBlock(paper,159,643);
       showAnimBlock(paper,159+1560,643);
       showAnimAngl(paper,208,863,100)
       showAnimAngl(paper,208+60,863,300)
       showAnimAngl(paper,208+1433,863,100)
       showAnimAngl(paper,208+60+1433,863,300)
       showAnimTopFrame(paper,502,723)
       showAnimBlockMove(paper,485,640,"#9fffff","#1eb9bd",1);
       showAnimBlockMove(paper,485+65,640,"#9fffff","#1eb9bd",0);
       showAnimBlockMove(paper,485+65+785,640,"#9fffff","#1eb9bd",0);
       showAnimBlockMove(paper,485+65+785+60,640,"#9fffff","#1eb9bd",1);
     }

     function showAnimBlockMove(paper,x,y,c1,c2,angle){
      var rect= paper.rect(x,y,40,40).attr({'fill':c1,'stroke-width':0});
      var pathstr="m 0,0 9.46429,0 -4.10715,6.07143 z";
      var moveObj=paper.path(pathstr).attr('transform',['t',x+15,y-10]).attr({'fill':c2,'stroke-width':0})
      rect.animate(opacityAnim3.repeat(Infinity));
      
      function run(){
         var newCX=(x+15)+ Math.sin(angle) * 10;
         angle+=0.4;
         if (Math.sin(angle)>0.8){
         rect.animate({'fill':c2},100);
         moveObj.animate({'fill':c2},100)
         }
         if (Math.sin(angle)<-0.2){
           rect.animate({'fill':c1},100);
           moveObj.animate({'fill':c1},100)
         }
         moveObj.attr('transform',['t',newCX,y-10]);
          setTimeout(run, 1000/32);
       }
       run();

     }

     function showAnimTopFrame(paper,x,y){
       var pathstr1="m 0,0 0,74.49875 21.71828,20.70812 136.87567,0 7.82868,7.82869 -0.25254,0";
       paper.path(pathstr1).attr("transform",['t',x,y]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr2="m 0,0 0,74.49875 21.71828,20.70812 136.87567,0 7.82868,7.82869 -0.25254,0";
       paper.path(pathstr2).attr("transform",['t',x,y]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr3="m 0,0 0,7.14286 14.46429,11.78571 35.17857,0.35715 5.71428,5.35714 0.71429,0.35714";   
       paper.path(pathstr3).attr("transform",['t',x+65,y]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr4="m 0,0 0,18.94036 25.25382,24.4962 100.76271,-0.75762 4.29315,-4.04061";
       paper.path(pathstr4).attr("transform",['t',x+165,y+60]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr5="m 0,0 46.78571,0.35714 7.14286,7.85714 63.21428,0.35714 2.5,-2.85714 31.78572,0 3.21428,3.57143 64.285718,0 7.500001,-9.28571 42.14285672,0.35714";
       paper.path(pathstr5).attr("transform",['t',x+322,y+97]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr6="m 0,0 9.848987,8.08122 97.984792,0 24.74874,-25.50635 -0.25254,-22.98097";
       paper.path(pathstr6).attr("transform",['t',x+322+298,y+97]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr7="m 0,0 8.08122,-8.58629 143.94674,-0.50508 18.18275,-17.67767 -1.51523,-80.30713";
       paper.path(pathstr7).attr("transform",['t',x+322+298+125,y+105]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr8="m 0,0 4.54568,-9.59645 36.61803,0.25254 14.89975,-7.57614 1.01016,-13.63706";
       paper.path(pathstr8).attr("transform",['t',x+322+298+125+50,y+25]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       var pathstr9="m 0,0 37.67857,-0.0893 -0.0893,3.125 -3.21428,3.30358 -18.92857,0.0893 -2.85715,-3.03571 -12.58928,0.0893 z";
       paper.path(pathstr9).attr("transform",['t',x+322,y+98]).attr({'fill':"#a1ffff",'stroke':"none",'stroke-width':0})
       var pathstr10="m 0,0 -12.5892792,-0.0893 -2.85715,3.03571 -18.92857,-0.0893 -3.21428,-3.30358 -0.0893,-3.125 37.6785692,0.0893 z";
       paper.path(pathstr10).attr("transform",['t',x+589,y+102]).attr({'fill':"#a1ffff",'stroke':"none",'stroke-width':0})
       var pathstr11="m 0,0 16.60715,0.17857 2.41071,2.32143 28.92857,0.0893 1.42857,-2.23214 14.01786,0 0.0893,39.82142 -14.375,0.26786 -3.75,-4.46428 -25.98215,0.0893 -2.14285,4.19643 -16.875,0.17857 z";
       paper.path(pathstr11).attr("transform",['t',x+130,y+8]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       paper.path(pathstr11).attr("transform",['t',x+130+592,y+8]).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       
       paper.rect(x-15,y-24,37,20).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
        paper.text(x-15+18,y-24+5+3,"load").attr({ "font-family": "arial", 'fill': "#a1ffff", "font-size":4 })

       paper.rect(x-15+64,y-24,37,20).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       paper.text(x-15+64+18,y-24+5+3,"load").attr({ "font-family": "arial", 'fill': "#a1ffff", "font-size":4 })

       paper.rect(x+833,y-24,37,20).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       paper.text(x+833+18,y-24+5+3,"load").attr({ "font-family": "arial", 'fill': "#a1ffff", "font-size":4 })
       paper.rect(x+833+63,y-24,37,20).attr({'fill':"none",'stroke':"#a1ffff",'stroke-width':1})
       paper.text(x+833+63+18,y-24+5+3,"load").attr({ "font-family": "arial", 'fill': "#a1ffff", "font-size":4 })
     }

     function showAnimAngl(paper,x,y,t){
      var pathstr="m 0,0 -5.17703,0 -0.12627,4.54568"
      paper.path(pathstr).attr("transform",['t',x,y]).attr({'fill':"none",'stroke':"#4bece1",'stroke-width':3})
      paper.path(pathstr).attr("transform",['t',x,y+20,'r',270]).attr({'fill':"none",'stroke':"#4bece1",'stroke-width':3})
      paper.path(pathstr).attr("transform",['t',x+20,y,'r',90]).attr({'fill':"none",'stroke':"#4bece1",'stroke-width':3})
      paper.path(pathstr).attr("transform",['t',x+20,y+20,'r',180]).attr({'fill':"none",'stroke':"#4bece1",'stroke-width':3})
      var pathstr2="m 0,0 15.78364,0 -7.44988,7.57615 z";
      var angl=paper.path(pathstr2).attr("transform",['t',x,y+8]).attr({'fill':"#4bece1",'stroke':"#4bece1",'stroke-width':0})
        var opacityAnim3 = Raphael.animation({ "100%": { opacity:0},
                                          "50%": { opacity:1 }
                                       }, 400);
      angl.animate(opacityAnim3.repeat(Infinity).delay(t));

     }

  function showAnimBlock(paper,x,y){
    var cy =y+90;
    var configs=[ 
                    {'x':x,'y':y,'w':6,'h':4,'color':'#20bab8'},
                    {'x':x+30,'y':y,'w':6,'h':4,'color':'#0a3838'},
                    {'x':x,'y':y+10,'w':6,'h':4,'color':'#0a3838'},  
                    {'x':x,'y':y+22,'w':25,'h':5,'color':'#0a3838'}, 
                    {'x':x+29,'y':y+22,'w':7,'h':6,'color':'#65ffff'}, 
                    {'x':x,'y':y+39,'w':25,'h':5,'color':'#65ffff'},
                    {'x':x+30,'y':y+39,'w':5,'h':5,'color':'#21b9bc'},
                    {'x':x,'y':y+39+12,'w':25,'h':5,'color':'#25e1e3'},
                    {'x':x+30,'y':y+39+12+10,'w':7,'h':7,'color':'#a3fdfb'}, 
                    {'x':x,'y':y+39+12+10+10,'w':25,'h':5,'color':'#25e1e3'},   

                    {'x':x,'y':cy,'w':6,'h':4,'color':'#20bab8'},
                    {'x':x+30,'y':cy,'w':6,'h':4,'color':'#0a3838'},
                    {'x':x,'y':cy+10,'w':6,'h':4,'color':'#0a3838'},  
                    {'x':x,'y':cy+22,'w':25,'h':5,'color':'#0a3838'}, 
                    {'x':x+29,'y':cy+22,'w':7,'h':6,'color':'#65ffff'}, 
                    {'x':x,'y':cy+39,'w':25,'h':5,'color':'#65ffff'},
                    {'x':x+30,'y':cy+39,'w':5,'h':5,'color':'#21b9bc'},
                    {'x':x,'y':cy+39+12,'w':25,'h':5,'color':'#25e1e3'},
                    {'x':x+30,'y':cy+39+12+10,'w':7,'h':7,'color':'#a3fdfb'}, 
                    {'x':x,'y':cy+39+12+10+10,'w':25,'h':5,'color':'#25e1e3'},     
                ];
    var items=[];
    for (var i =0 ;i<configs.length;i++){
       var config=configs[i];
       var item=paper.rect(config.x,config.y,config.w,config.h).attr({"fill":config.color,'stroke-width':0});
       items.push(item);
     }

     function run(){
      var index =fRandomBy(0,items.length-1);
      var item=items[index];
      item.animate({
          "50%":{'opacity' :0},
          "100%":{'opacity' :1}
      },300)
      setTimeout(run ,1000/32);
     }
     run();
  }


  function showAnimLight(paper){
    var light1=createlightLeft(paper,400,230,"AC01.6");
    light1.start();
    var light2=createlightLeft(paper,400,230+65,"C02.35");
    light2.start();
    var light3=createlightLeft(paper,400,230+65+65,"D03.66");
    light3.start();
     var light4=createlightRight(paper,1460,230,"EC01.2");
    light4.start();
     var light5=createlightRight(paper,1460,230+65,"GD03.2");
    light5.start();
     var light6=createlightRight(paper,1460,230+65+65,"FZ04.2");
    light6.start();
  }

  function createlightRight(paper,x,y,text){
      var createlightRight=function(x,y,text){
        this.x=x;
        this.y=y;
        this.text=text;
        this.path1str="m 0,0 -0.0893,20.08929 10.80357,-0.35714 5.17857,-5.89286 33.30357,-0.26786 -0.35714,-13.21428 z";
        this.path2str="m 0,0 0,12.05357 21.07143,0.0893 5.53571,-5.17857 21.69643,0.26786 0.17857,-13.21429 -30.80357,-0.35714 -5.71428,6.33929 z"
       
       var time=fRandomBy(2000,3000);
        this.anim1 = Raphael.animation({ "40%": { opacity:0.1},
                                          "60%": { opacity:1 }
                                       }, time);
       this.anim2 = Raphael.animation({ "50%": { opacity:0.1},
                                          "60%": { opacity:1 }
                                       }, time-500);
      }
      createlightRight.prototype.start=function(){
         this.path1=paper.path(this.path1str);
         this.path1.attr('transform',['t',this.x,this.y]).attr({"fill":"#7ce9ec",'stroke-width':0})
         this.path2=paper.path(this.path2str);
         this.path2.attr('transform',['t',this.x,this.y+23]).attr({"fill":"#01deeb",'stroke-width':0})
       
         this.path1.animate( this.anim1.repeat(Infinity));
         this.path2.animate( this.anim2.repeat(Infinity).repeat(2000));

         this.rect1= paper.rect(this.x+50,this.y,10,5).attr({"fill":"#5fedee",'stroke-width':0});
         this.rect2= paper.rect(this.x+50,this.y+26,10,5).attr({"fill":"#ff4b31",'stroke-width':0});
         this.rect1.animate( this.anim2.repeat(Infinity).repeat(1000));
         this.rect2.animate( this.anim1.repeat(Infinity));
         paper.text(this.x+27,this.y-12,this.text).attr({'fill':"#ffffff",'font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
      }
      return new createlightRight(x,y,text);
  }

  function createlightLeft(paper,x,y,text){
      var createlightLeft=function(x,y,text){
        this.x=x;
        this.y=y;
        this.text=text;
        this.path1str="m 0,0 -0.12627,13.76333 33.08249,-0.50508 6.06092,6.18718 10.10153,0.25254 -0.12627,-19.82424 -0.12627,0 z";
        this.path2str="m 0,0 0.12626,13.8896 22.4759,-0.12627 4.54568,4.92449 21.46575,0 -0.25254,-12.37436 -12.62691,-0.12627 -5.42957,-6.06092 z"
        this.anim1 = Raphael.animation({ "50%": { opacity:0.3},
                                          "100%": { opacity:1 }
                                       }, 800+1000);
       this.anim2 = Raphael.animation({ "50%": { opacity:0.3},
                                          "100%": { opacity:1 }
                                       }, 500+500);
      }
      createlightLeft.prototype.start=function(){
         this.path1=paper.path(this.path1str);
         this.path1.attr('transform',['t',this.x,this.y]).attr({"fill":"#7ce9ec",'stroke-width':0})
         this.path2=paper.path(this.path2str);
         this.path2.attr('transform',['t',this.x,this.y+18]).attr({"fill":"#01deeb",'stroke-width':0})
       
         this.path1.animate( this.anim1.repeat(Infinity));
         this.path2.animate( this.anim2.repeat(Infinity));

         this.rect1= paper.rect(this.x-13,this.y,10,5).attr({"fill":"#5fedee",'stroke-width':0});
         this.rect2= paper.rect(this.x-13,this.y+26,10,5).attr({"fill":"#ff4b31",'stroke-width':0});
         this.rect1.animate( this.anim2.repeat(Infinity));
         this.rect2.animate( this.anim1.repeat(Infinity));
         paper.text(this.x+27,this.y-12,this.text).attr({'fill':"#ffffff",'font-size':12,'font-family': '微软雅黑','font-weight':'bold'})
      }
      return new createlightLeft(x,y,text);
  }



function showAnimDotLine(paper){
  var points=[
               {'x':517,'y':455,'r':0,'h':20},
               {'x':517+65,'y':455,'r':0,'h':20},
               {'x':517+65+36,'y':455,'r':0,'h':20},
               {'x':517+65+36,'y':455,'r':0,'h':20},
               {'x':517+65+36+70,'y':455,'r':0,'h':20},
               {'x':517+65+36+70+143,'y':455,'r':0,'h':20},
               {'x':517+65+36+70+143+45,'y':455,'r':0,'h':20},
               {'x':517+65+36+70+143+45+102,'y':455,'r':0,'h':20},
               {'x':517+65+36+70+143+45+102+40,'y':455,'r':0,'h':20},
               {'x':517,'y':455+76,'r':180,'h':15},
               {'x':517+100,'y':455+76,'r':180,'h':15},
               {'x':517+100+72,'y':455+76,'r':180,'h':15},
               {'x':517+100+72+101,'y':455+76,'r':180,'h':15},

             ];
     var items=[];        
  var pathstr="m 0,0 0.53572,19.82143 3.66071,-0.0893 -0.17857,-16.07142 20.89286,0 0.17857,16.07142 4.10714,0.17858 -0.17857,-19.91072 z"
  var blockPathStr="m 0,0 -11.96429,0 0.26786,-8.48215 3.83929,-2.94642 4.10714,0 3.21429,2.85714 0.625,1.07143 z";
  var colors=['#ff4f3d','#b3f9fb','#57b6bc'];
  for (var i=0;i<points.length;i++){
   paper.path(pathstr).attr({'transform':['t',points[i].x,points[i].y,'r',points[i].r]}).attr({'fill':"#27afaf",'stroke-width':0,'opacity':1})
   var item=paper.path(blockPathStr).attr({'transform':['t',points[i].x+20,points[i].y+points[i].h,'r',points[i].r]}).attr({'fill':colors[fRandomBy(0,colors.length-1)],'stroke-width':0,'opacity':1})
    items.push(item);
  }

    function run(){
      var index = fRandomBy(0,items.length-1);
      var item=items[index];
      var color=colors[fRandomBy(0,colors.length-1)];

      item.animate({
         "50%": {'opacity':0.2},
         '50%':{'opacity':1,'fill':color}
      },90);
      setTimeout(run,32/1000);     
    };
    run();

    var pathLine1="m 0,0 0,6.33928 12.32143,12.58929 42.94643,-0.35714 11.07143,-11.25 -0.0893,-8.125";
    paper.path(pathLine1).attr({'transform':['t',530,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine2="m 0,0 0.17857,8.57143 11.07143,10.53571 48.75,0.35714 11.78571,-12.14285 0.26786,-9.19643 0,0 0.0893,0";
    paper.path(pathLine2).attr({'transform':['t',530+100,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine3="m 0,0 -0.12627,8.9651 10.85914,11.23795 119.07173,0.3788 10.10153,-9.97525 0,-9.47018 0,0.12627";
    paper.path(pathLine3).attr({'transform':['t',530+100+75,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine4="m 0,0 0.37881,-6.43972 9.84898,-10.10152 78.03429,-0.12627 10.98541,10.98541 -0.25254,8.08122";
    paper.path(pathLine4).attr({'transform':['t',530,528]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine5="m 0,0 0,-4.9245 10.98541,-10.48033 79.1707,0.25254 9.72272,9.09137 0.25254,7.32361";
    paper.path(pathLine5).attr({'transform':['t',530+175,528]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine6="m 0,0 -1.07143,60.35714 15,13.92857 320,0.71429";
    paper.path(pathLine6).attr({'transform':['t',530+175+100+85,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine7="m 0,0 0,47.14286 16.785717,14.64285 217.142853,-0.71428";
    paper.path(pathLine7).attr({'transform':['t',530+175+100+85+100,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var pathLine8="m 0,0 -0.357143,33.57143 16.785715,15.71429 175.714287,-0.35715"
    paper.path(pathLine8).attr({'transform':['t',530+175+100+85+100+40,480]}).attr({'fill':'none','stroke-width':1,'opacity':1,'stroke':"#9ffffe"})
    var rectPath="m 0,0 4.46428,-4.82143 9.10715,0.17857 0,5.17857 -13.03572,0.17858 z"
    paper.path(rectPath).attr({'transform':['t',530+175+100+85+100+220,480+49]}).attr({'fill':'#9ffffe','stroke-width':0,'opacity':1,'stroke':"#9ffffe"})
    paper.path(rectPath).attr({'transform':['t',530+175+100+85+100+220,480+49+10]}).attr({'fill':'#9ffffe','stroke-width':0,'opacity':1,'stroke':"#9ffffe"})
    paper.path(rectPath).attr({'transform':['t',530+175+100+85+100+220,480+49+10+13]}).attr({'fill':'#9ffffe','stroke-width':0,'opacity':1,'stroke':"#9ffffe"})

}

function showAnimAdd(paper,x,y){
  var pathstr="m 0,0 0,9.28572 m -5.35714,-4.64286 10.35714,0 -0.35714,0";
    var items=[];
    var cy=0;
    for (var i=0;i<5;i++){
       cy=y+(i*10);
     items.push( paper.path(pathstr).attr({'transform':['t',x,cy]}).attr({'stroke':"#64eef0",'stroke-width':2,'opacity':0}));
    }
     y=cy+40;
    for (var i=0;i<10;i++){
       cy=y+(i*10);
     items.push( paper.path(pathstr).attr({'transform':['t',x,cy]}).attr({'stroke':"#64eef0",'stroke-width':2,'opacity':0}));
    }
     y=cy+40;
    for (var i=0;i<5;i++){
       cy=y+(i*20);
     items.push( paper.path(pathstr).attr({'transform':['t',x,cy]}).attr({'stroke':"#64eef0",'stroke-width':2,'opacity':0}));
    }
     function run(){
        var max= fRandomBy(0,3);
        for (var i=0;i<max;i++){
         var i= fRandomBy(0,items.length-1);
         items[i].animate({ "20%": { opacity:0},
                             "30%": { opacity:0.5 },
                                "40%": { opacity:1 },
                                 "50%": { opacity:0.7 },
                                  "60%": { opacity:1 },          
                                       }, 500,function(){
                                         this.animate({opacity:0},500);
                                       });
         }
      setTimeout(run,1000/60);
     }
     run()
}

function showAnimCircle(paper,x,y){
    var items=[];
    var cy=0;
    for (var i=0;i<5;i++){
       cy=y+(i*10);
     items.push( paper.circle(x,cy,2).attr({'fill':"#37f0f3",'stroke-width':0,'opacity':0}));
    }
     y=cy+40;
    for (var i=0;i<13;i++){
       cy=y+(i*10);
       items.push( paper.circle(x,cy,2).attr({'fill':"#37f0f3",'stroke-width':0,'opacity':0}));
    }
     y=cy+40;
    for (var i=0;i<5;i++){
       cy=y+(i*20);
       items.push( paper.circle(x,cy,2).attr({'fill':"#37f0f3",'stroke-width':0,'opacity':0}));
    }
     function run(){
         var i= fRandomBy(0,items.length-1);
         items[i].animate({ "50%": { opacity:0},
                                          "40%": { opacity:1 }
                                       }, 1000);
      setTimeout(run,1000/60);
     }
     run()
}

function showTitleAnim(paper){

       showTitleAnimLeft(paper);
       showTitleAnimRight(paper);
       showTitleAnimMiddel(paper);
       var x=770;
       var y=300;
       paper.text(x,y,"OSS流程总线").attr({'fill':"#baf1ff",'font-size':50,'font-family': '微软雅黑','font-weight':'bold'})
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

function showAnimRect(paper,x,y){
   var config=[{'w':4,'h':7,'bank_h':10,'speed':0.12,"range":10,'flag':1},
               {'w':4,'h':25,'bank_h':70,'speed':0.1,"range":25,'flag':0},
               {'w':4,'h':19,'bank_h':70+70,'speed':0.09,"range":10,'flag':0},
               {'w':4,'h':10,'bank_h':70+70+40,'speed':0.12,"range":10,'flag':0},
               {'w':4,'h':25,'bank_h':70+70+40+40,'speed':0.09,"range":25,'flag':0},
               {'w':4,'h':10,'bank_h':70+70+40+40+40,'speed':0.1,"range":25,'flag':0},
               {'w':4,'h':30,'bank_h':70+70+40+40+40+40,'speed':0.12,"range":10,'flag':0}

               ]
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<config.length;i++){
       var cy= y+config[i].bank_h;
       line_array[i]=paper.rect(x,cy,config[i].w,config[i].h).attr({'fill':"#83f7fb",'stroke-width':0});
       line_array[i].y=cy;
        line_array[i].animate(opacityAnim2.repeat(Infinity).delay(i*500));

     }
     for (var i=0;i<line_array.length;i++){
            lineAnim_arry[i]= animSinUpToDonw(line_array[i],line_array[i].y,config[i].range,config[i].speed,config[i].flag);
            lineAnim_arry[i].start();
     } 
}


function showAnimLine(paper,x,y){
   
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<16;i++){
       var cy= y+i*20
       line_array[i]=paper.rect(x,cy,40,2).attr({'fill':"#83f7fb",'stroke-width':0});
       line_array[i].y=cy;
        line_array[i].animate(opacityAnim2.repeat(Infinity).delay(i*500));

     }
     for (var i=0;i<line_array.length;i++){
            lineAnim_arry[i]= animSinUpToDonw(line_array[i],line_array[i].y,fRandomBy(10,40),0.09,fRandomBy(0,1));
            lineAnim_arry[i].start();
     } 
}

function showTitleAnimMiddel(paper){
    var x=590;
    var y=265;
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<15;i++){
       var cy= y+i*5
       line_array[i]=paper.rect(x,cy,390,1).attr({'fill':"#83f7fb",'stroke-width':0,'opacity':0.2});
     
       line_array[i].animate(opacityAnim.repeat(Infinity).delay(i*500));
       line_array[i].y=cy;
     }

     for (var i=0;i<line_array.length;i++){
              
            lineAnim_arry[i]= animSinUpToDonw(line_array[i],line_array[i].y,fRandomBy(5,10),0.07,fRandomBy(0,1));
            lineAnim_arry[i].start();
     } 
}
function showTitleAnimRight(paper){
    var x=1010;
    var y=270;
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<8;i++){
       var cy= y+i*10
       line_array[i]=paper.rect(x,cy,40,1).attr({'fill':"#83f7fb",'stroke-width':0});
       line_array[i].y=cy;
        line_array[i].animate(opacityAnim2.repeat(Infinity).delay(i*500));

     }
     for (var i=0;i<line_array.length;i++){
           lineAnim_arry[i]= animSinUpToDonw(line_array[i],line_array[i].y,fRandomBy(10,40),0.05,fRandomBy(0,1));
            lineAnim_arry[i].start();
     } 
}
function showTitleAnimLeft(paper){
    var x=520;
    var y=270;
   var lineAnim_arry=[];
   var line_array=[];
      for (var i=0;i<8;i++){
       var cy= y+i*10
       line_array[i]=paper.rect(x,cy,40,1).attr({'fill':"#83f7fb",'stroke-width':0});
       line_array[i].y=cy;
              line_array[i].animate(opacityAnim2.repeat(Infinity).delay(i*500));

     }
     for (var i=0;i<line_array.length;i++){
            lineAnim_arry[i]= animSinUpToDonw(line_array[i],line_array[i].y,fRandomBy(10,40),0.05,fRandomBy(0,1));
            lineAnim_arry[i].start();
     } 
  
}

function animSinUpToDonw(obj,centerY,range,speed,angle){
   var FanimSinUpToDonw =function(obj,centerY,range,speed,angle){
      this.tick=null;
      this.angle=angle;
      this.range=range;
      this.speed=speed;
      this.centerY=centerY
      this.obj=obj;
      console.log(this.centerY);

   }
   FanimSinUpToDonw.prototype.stop=function(){
      if (this.tick){
        window.clearTimeout(this.tick);
      }
   }
   FanimSinUpToDonw.prototype.start=function(){
    var self=this;
       function run(){
         var newCy=self.centerY+ Math.sin(self.angle) * self.range;
         self.angle+=self.speed;
         self.obj.attr('y',newCy);
         self.tick = setTimeout(run, 1000/60);
       }
       run();
   }
   return new FanimSinUpToDonw(obj,centerY,range,speed,angle);
}


function animSinUpToDonwPath(obj,x,centerY,range,speed,angle,rn){
   var FanimSinUpToDonwPath =function(obj,x,centerY,range,speed,angle,rn){
      this.tick=null;
      this.angle=angle;
      this.range=range;
      this.speed=speed;
      this.centerY=centerY
      this.obj=obj;
      this.x=x;
      this.rn=rn;
      console.log(this.centerY);

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
function showTitleNoAnim(paper){
    var titleUpPathStr="m 0,0 -8.08122,8.08122 1.01016,14.64721 68.18529,0 10.10153,-11.11168 91.4188,0 11.61676,10.10153 183.34269,0.50507 10.10152,-11.61675 90.91373,0 10.6066,10.6066 68.69041,-0.50508 0,-14.14213 -6.566,-6.06092 z";
    var titleFramePathStr="m 0,0 -13.63706,14.14214 0,166.17009 12.12183,11.11168 89.90358,0 6.06091,-7.57615 363.65492,1.01016 4.54569,4.54568 86.36807,0.50508 12.1218,-12.62691 -2.0203,-164.65486 -10.6066,-10.6066 -83.84267,-0.50508 -7.07107,7.07107 -365.17014,0 -6.56599,-7.07107 -87.3782,0.50508 z"
    var titleFrameStaffPathStr="m 0,0 -5.3033,4.54569 0.50508,3.283 44.19417,0.25253 -3.03046,-4.29314 -14.14213,0.50507 -3.78807,-4.29315 z";
    var titleFrameStaffPathStr2="m 0,0 5.3033,4.54569 -0.50508,3.283 -44.19417,0.25253 3.03046,-4.29314 14.14213,0.50507 3.78807,-4.29315 z";
    var titleBrodPathStr="m 0,0 -24.24366,20.20305 -1.51523,291.42901 25.25381,28.78934 -1.01015,-1.01015";
    var titleUpLinePathStr="m 0,0 85.35789,-1.51523 27.27412,-20.70813 164.65486,0 13.63706,10.6066 270.72084,1.51523 57.5787,-35.35534 53.5381,1.01016 0,2.0203 1.0102,0";
    var cicleLineLeft1PathStr="m 0,0 -24.74873,-1.01015 -32.829962,15.15229 3.535534,10.10152 -56.063466,31.31473 -1.010153,47.47717 -11.111678,11.61675 -2.525381,57.07362 7.576144,6.56599 -0.505077,15.15229 0,0 -0.505076,-1.51523";
    var cicleLineLeft2PathStr="m 0,0 -23.92857,-1.42857 -61.428574,28.21429 -0.357143,10 -37.142857,17.14285 -1.071429,56.07143 -7.5,7.14286 0,76.42857 8.571429,5.35714 -0.357143,16.07143"
    var cicleLineLeft3PathStr="m 0,0 -22.14286,0 -10.71429,3.92857 -3.21428,9.64286 -31.07143,14.28571 -13.928573,-0.71428 -53.928571,30 1.071428,40 -7.5,7.85714 0,61.42857 4.285715,3.57143 0.714285,61.42857 -0.357143,-1.07143";
    var cicleLineRight1PathStr="m 0,0 27.85714,0 6.42857,7.14285 -0.71428,10.71429 7.14285,5.71429 25.71429,-0.71429 10.71428,7.85714 -2.14285,37.85715 20.71428,18.57142 0,88.57143 -5,4.28572 1.42857,50 -2.85714,4.28571 -13.57143,-2.14286 -31.42857,24.28572 -0.71428,14.28571 -46.42858,32.14286 -47.14285,0 -7.85715,-7.14286 -35,0.71429 1.42858,-0.71429"
    var cicleLineRight2PathStr="m 0,0 37.5,-1.07143 5.35714,6.07143 1.07143,13.21429 7.5,6.78571 22.5,-1.07143 7.14286,6.78572 1.42857,26.07142 20,19.64286 -0.35714,137.5 -4.28572,5 -0.35714,23.57143 -44.64286,32.5 0,9.28572 -44.28571,35.71428 -29.28572,0.35714 -2.14285,-3.92857 -69.64286,1.07143 0.71429,-0.71428";
    var cicleLineright3PathStr="m 0,0 31.31473,0.50508 5.05076,6.06091 -0.50507,22.22336 11.11168,8.08122 26.76904,-0.50508 21.2132,22.72843 0,212.63711 -89.3985,70.71068 -48.9924,-0.50507 -8.58629,10.10152 -54.04316,0";
    var cicleRect1PathStr="m 0,0 -11.11168,-0.25254 -3.78807,3.283 14.39467,0.50508 z";
    var up=paper.path(titleUpPathStr).attr({'fill':"#26e2e3",'stroke-width':'0'});
    var down=paper.path(titleUpPathStr).attr({'fill':"#26e2e3",'stroke-width':'0'});
    var titleFrame=paper.path(titleFramePathStr).attr({'fill':"none",'stroke-width':1.5,'stroke':"#1aa0a3"});
    var titleFrame1=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame2=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame3=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame4=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame5=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame6=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame7=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame8=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame9=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame10=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame11=paper.path(titleFrameStaffPathStr2).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var titleFrame12=paper.path(titleFrameStaffPathStr).attr({'fill':"#1aa0a3",'stroke-width':'0'});
    var brod1= paper.path(titleBrodPathStr).attr({'fill':"none",'stroke-width':1.5,'stroke':"#64eef0"});
    var brod2= paper.path(titleBrodPathStr).attr({'fill':"none",'stroke-width':1.5,'stroke':"#64eef0"});
    var titleUpLine=paper.path(titleUpLinePathStr).attr({'fill':"none",'stroke-width':1.5,'stroke':"#97e4de"});
    var cicleLineLeft1=paper.path(cicleLineLeft1PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"});
    var cicleLineLeft2=paper.path(cicleLineLeft2PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"})
    var cicleLineLeft3=paper.path(cicleLineLeft3PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"})
    var cicleLineRight1=paper.path(cicleLineRight1PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"})
    var cicleLineRight2=paper.path(cicleLineRight2PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"})
    var cicleLineright3=paper.path(cicleLineright3PathStr).attr({'fill':"none",'stroke-width':1.2,'stroke':"#97e4de"})
    var cicleRect1=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect2=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect3=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect4=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect5=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect6=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})


    var cicleRect11=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect21=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect31=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect41=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect51=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})
    var cicleRect61=paper.path(cicleRect1PathStr).attr({'fill':"#97e4de",'stroke-width':0})

    var x=520;
    var y=230;
    up.attr({"transform":["t",x,y]});
    down.attr({"transform":["t",x,y+140,"r",180]});
    titleFrame.attr({"transform":["t",x-10,y-15]});
    titleFrame1.attr({"transform":["t",x-8,y-21]});
    titleFrame2.attr({"transform":["t",x+410,y-15]});
    titleFrame3.attr({"transform":["t",x+540,y+18,'r',90]});
    titleFrame4.attr({"transform":["t",x-49,y+130,'r',270]});
    titleFrame5.attr({"transform":["t",x+500,y+176,'r',180]});
    titleFrame6.attr({"transform":["t",x+121,y-15]});
    titleFrame7.attr({"transform":["t",x+532,y-20]});
    titleFrame8.attr({"transform":["t",x+572,y+135,'r',90]});
    titleFrame9.attr({"transform":["t",x-15,y+18,'r',270]});
    titleFrame10.attr({"transform":["t",x+30,y+179,'r',180]});
    titleFrame11.attr({"transform":["t",x+443,y+169,'r',180]});
    titleFrame12.attr({"transform":["t",x+89,y+169,'r',180]});
    brod1.attr({"transform":["t",x-165,y-80]})
    brod2.attr({"transform":["t",x+1070,y-80,'r',180]})  
    titleUpLine.attr({"transform":["t",x-5,y-40]});
    cicleLineLeft1.attr({"transform":["t",x+721,y-59]})
    cicleLineLeft2.attr({"transform":["t",x+720,y-67]})
    cicleLineLeft3.attr({"transform":["t",x+721,y-83]})
    cicleLineRight1.attr({"transform":["t",x+721+80,y-57]})
    cicleLineRight2.attr({"transform":["t",x+721+81,y-67]})
    cicleLineright3.attr({"transform":["t",x+721+92,y-85]})
    cicleRect1.attr({"transform":["t",x+721+98,y-87,'r',180]})
    cicleRect2.attr({"transform":["t",x+721+95,y-71,'r',180]})
    cicleRect3.attr({"transform":["t",x+721+95,y-61,'r',180]})
    cicleRect4.attr({"transform":["t",x+722,y+236,'r',180]})
    cicleRect5.attr({"transform":["t",x+722,y+236+10,'r',180]})
    cicleRect6.attr({"transform":["t",x+722,y+236+27,'r',180]})
    cicleRect11.attr({"transform":["t",x+722,y-87]})
    cicleRect21.attr({"transform":["t",x+722,y-87+15]})
    cicleRect31.attr({"transform":["t",x+722,y-87+15+10]})
    cicleRect41.attr({"transform":["t",x+590,y+139,'r',90]})
    cicleRect51.attr({"transform":["t",x+590+12,y+139,'r',90]})
    cicleRect61.attr({"transform":["t",x+590+12+10,y+139,'r',90]})

     var IN3=paper.text(x+585,y+139+26,"I3").attr({'fill':"#22d2d6",'font-size':1,'font-family': '微软雅黑','font-weight':'bold',"transform":['r',90]})
     var IN2=paper.text(x+585+14,y+139+26,"I2").attr({'fill':"#f9fb5c",'font-size':1,'font-family': '微软雅黑','font-weight':'bold',"transform":['r',90]})
     var IN1=paper.text(x+585+14+14,y+139+26,"I1").attr({'fill':"#22d2d6",'font-size':1,'font-family': '微软雅黑','font-weight':'bold',"transform":['r',90]})
     var t03=paper.text(x+585+100,y+139+26+70,"t-03").attr({'fill':"#ff8174",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})
     var t04=paper.text(x+585+100,y+139+26+70+14,"t-04").attr({'fill':"#7ce9ec",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})
     var t04=paper.text(x+585+100,y+139+26+70+14+14,"t-05").attr({'fill':"#22d2d6",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})

     var INp1=paper.text(x+585+100+80,y-90,"IN1").attr({'fill':"#7ce9ec",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})
     var INp2=paper.text(x+585+100+80,y-90+14,"IN2").attr({'fill':"#01deeb",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})
     var INp3=paper.text(x+585+100+80,y-90+14+14,"IN3").attr({'fill':"#7ce9ec",'font-size':1,'font-family': '微软雅黑','font-weight':'bold'})



}

  
  
/**
   * 生成随便数
   */
function fRandomBy(under, over){ 
     return parseInt(Math.random()*(over-under+1) + under); 
} 


function fRandomByF(under, over){ 
     return (Math.random()*(over-under+1) + under); 
}

function createDataTop10(){
  var names=['CRM下单','服务单','资源变更单','流程启动','派单','归档']
  
   var  datas=[];
    for (var i=0;i<names.length;i++){
        datas.push({
              name:names[i],
              value:fRandomBy(1,100)
        })
    }
    return datas;
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
