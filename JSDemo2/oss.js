var global_config={
    default_font:{'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font':{'fill':'#fffee2','font-size':25,'font-family': '微软雅黑','font-weight':'bold'},
   'title_font2':{'fill':'#fffee2','font-size':37,'font-family': '微软雅黑','font-weight':'bold'},
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
        onlinePeople(paper);//在线人数
        workflowaProccedNum(paper);//流程总处理量
        onlineshopping(paper);//在线营业厅
      	workflowBar(paper);//在线流程指标
        processRate(paper);//处理速率
        animCircle(paper) //动画圆
        drawbaseElem(paper);//画基本的图形

 }


//处理速率
function processRate(paper){
  var x=200;111
  var y=179;
  var lable_title= paper.text(x+15,y,"总线处理速率");
      lable_title.attr(global_config.title_font2);
  var bigRate=paper.processRate({x:70,y:230});
  var smallRate=paper.processRate({x:140,y:300,r1:80,r2:70,width:2});
 
  function setBigDeg(value){
      bigRate.setDeg(value/100);
      setTimeout(function(){
          setBigDeg(fRandomBy(1,100));
      },2000);
    }
   setBigDeg(fRandomBy(1,100));

   function setSmallDeg(value){
    console.log(value/100)
      smallRate.setDeg(value/100);
      setTimeout(function(){
          setSmallDeg(fRandomBy(1,100));
      },1500);
    }

    setSmallDeg(fRandomBy(1,100))
}





 
//在线人数
function onlinePeople(paper){
	var x=600;
	var y=65;
   var lable_title= paper.text(x+15,y,"在线人数 :");
       lable_title.attr(global_config.title_font);
   var nums =paper.chartsNumbser({'x':x+110,'y':y,'value':4325,
   	                               attrs: {'fill':'#95f3ff','font-size':26,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    function readValue(value){
    	nums.setValue(value);
    	setTimeout(function(){
          readValue(fRandomBy(4000,5000));
    	},3000);
    }
   readValue(fRandomBy(4000,5000));
}
//流程总处理量
function workflowaProccedNum(paper){
	var x=1125;
	var y=65;
   var lable_title= paper.text(x+15,y,"流程总处理量 :");
       lable_title.attr(global_config.title_font);
   var nums =paper.chartsNumbser({'x':x+135,'y':y,'value':4325,
   	                               attrs: {'fill':'#95f3ff','font-size':26,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    function readValue(value){
    	nums.setValue(value);
    	setTimeout(function(){
          readValue(fRandomBy(4000,6000));
    	},3000);
    }
   readValue(fRandomBy(4000,6000));
}
//在线营业厅
function onlineshopping(paper){
  var x=1625;
	var y=65;
   var lable_title= paper.text(x+15,y,"在线营业厅 :");
       lable_title.attr(global_config.title_font);
   var nums =paper.chartsNumbser({'x':x+135,'y':y,'value':4325,
   	                               attrs: {'fill':'#95f3ff','font-size':26,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
    function readValue(value){
    	nums.setValue(value);
    	setTimeout(function(){
          readValue(fRandomBy(4000,6000));
    	},3000);
    }
   readValue(fRandomBy(4000,6000));
}


//在线流程指标
 function workflowBar(paper){
 	  workflowCRMBar(paper,625,460);
 	  workflowServiceBar(paper,625+510,460)
 	  workflowResBar(paper,625+510+510,460)
 	  workflowProcessBar(paper,625+25,460+460);
 	  workflowOrderBar(paper,625+510,460+460)
 	  workflowSaveBar(paper,625+510+520,460+460)
 }
/**
 * CRM下单
 */
 function workflowCRMBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"CRM下单");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}


//服务单
function workflowServiceBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"服务单");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}

//资源变更单
function workflowResBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"资源变更单");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}

//流程启动
function workflowProcessBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"流程启动");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}


//派单
function workflowOrderBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"派单");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}


//归档
function workflowSaveBar(paper,x,y){
 	 var bar=paper.chartsBar({'x':x,'y':y});
   var lable_title= paper.text(x+15,y-305,"归档");
       lable_title.attr(global_config.default_font) 
  var text1= paper.text(x+162,y+39,"待处理量");
      text1.attr({'fill':'#fe870f','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}); 
 var text2= paper.text(x-145,y+39,"处理量");
      text2.attr({'fill':'#8cebff','font-size':18,'font-family': '微软雅黑','font-weight':'bold','opacity':0.5}); 


   var nums1 =paper.chartsNumbser({'x':x+70,'y':y+40,'value':100,
   	                               attrs: {'fill':'#fe870f','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });

   var nums2 =paper.chartsNumbser({'x':x-50,'y':y+40,'value':100,
   	                               attrs: {'fill':'#f0ffc4','font-size':28,'font-family': '微软雅黑','font-weight':'bold'}
                                  });
   
   var arealist =paper.chartsListSides({
   	  'x':x-150,'y':y-240,'datas':global_config.area_names
   });

   function barValueAniam(value,max){
   	bar.setValue(value,max);
   	nums1.setValue(value);
   	nums2.setValue(fRandomBy(1,5000));
    var items=[]
   	for (var i=0;i<global_config.area_names.length;i++){
   		  var item={};
   		   item.name=global_config.area_names[i];
   		   item.value=fRandomBy(1000,4000);
   		   items.push(item);
   	}
   	arealist.setDatas(items)

   	 setTimeout(function(){barValueAniam(fRandomBy(1,4000),max)},3000);
   }
   barValueAniam(fRandomBy(1,4000),4000);
}
  
 function drawbaseElem(paper){
   var x=120;
   var y=76;
   paper.text(x,y,'O').attr(global_config.title_font3);
   paper.text(x+24,y,'S').attr(global_config.title_font4);
   paper.text(x+24+24,y,'S').attr(global_config.title_font3);
   paper.text(x+(24*5),y,'业务').attr(global_config.title_font5);
   paper.text(x+(24*8),y,'监控').attr(global_config.title_font3);
   //-----------------------------------------//
   paper.drawLine({x1:69,y1:32,x2:370,y2:32});
   paper.drawLine({x1:69,y1:43,x2:370,y2:43,opacity:0.5});
   paper.drawLine({x1:69,y1:120,x2:230,y2:120});
   paper.drawLine({x1:230,y1:120,x2:370,y2:120,opacity:0.5});
   //--------------------------------------//
   paper.drawLine({x1:400,y1:32,x2:1890,y2:32});
   paper.drawLine({x1:400,y1:42,x2:1890,y2:42,opacity:0.5});
   paper.drawLine({x1:440,y1:90,x2:1850,y2:90});
   //--------------------------------------//
    paper.drawLine({x1:490,y1:100,x2:490+170,y2:100});
    paper.drawLine({x1:490+170,y1:100,x2:490+170+170,y2:100,opacity:0.5});
   //--------------------------------------//
    paper.drawLine({x1:1000,y1:100,x2:1000+170,y2:100});
    paper.drawLine({x1:1000+170,y1:100,x2:1000+170+170,y2:100,opacity:0.5});
     //--------------------------------------//
    paper.drawLine({x1:1500,y1:100,x2:1500+170,y2:100});
    paper.drawLine({x1:1500+170,y1:100,x2:1500+170+170,y2:100,opacity:0.5});
     //--------------------------------------//
    paper.drawLine({x1:430,y1:130,x2:430,y2:280});
    paper.drawLine({x1:430+470,y1:130,x2:430+470,y2:280});
    paper.drawLine({x1:430+470+515,y1:130,x2:430+470+515,y2:280});
    paper.drawLine({x1:430+470+515+470,y1:130,x2:430+470+515+470,y2:280});
     //--------------------------------------//
    paper.drawLine({x1:430,y1:290,x2:430,y2:280+100,opacity:0.5});
    paper.drawLine({x1:430+470,y1:290,x2:430+470,y2:280+100,opacity:0.5});
    paper.drawLine({x1:430+470+515,y1:290,x2:430+470+515,y2:280+100,opacity:0.5});
    paper.drawLine({x1:430+470+515+470,y1:290,x2:430+470+515+470,y2:280+100,opacity:0.5});
    //---------------------------------////
    paper.drawLine({x1:430,y1:620,x2:430,y2:600+180});
    paper.drawLine({x1:430+470,y1:620,x2:430+470,y2:600+180});
    paper.drawLine({x1:430+470+515,y1:620,x2:430+470+515,y2:600+180});
    paper.drawLine({x1:430+470+515+470,y1:620,x2:430+470+515+470,y2:600+180});
   //-------------
    paper.drawLine({x1:490,y1:555,x2:490+170,y2:555});
    paper.drawLine({x1:490+170,y1:555,x2:490+170+170,y2:555,opacity:0.5});
    paper.drawLine({x1:1000,y1:555,x2:1000+170,y2:555});
    paper.drawLine({x1:1000+170,y1:555,x2:1000+170+170,y2:555,opacity:0.5});
    paper.drawLine({x1:1500,y1:555,x2:1500+170,y2:555});
    paper.drawLine({x1:1500+170,y1:555,x2:1500+170+170,y2:555,opacity:0.5});
  //-----------s

    baseLineBox(paper,520,475);
    baseLineBox(paper,520+515,475);
    baseLineBox(paper,520+515+520,475);
    baseLineBox(paper,545,940);
     baseLineBox(paper,545+490,940);
     baseLineBox(paper,545+490+520,940);
 } 

 function baseLineBox(paper,x,y){
  paper.drawLine({x1:x,y1:y,x2:x+220,y2:y});
  paper.drawLine({x1:x,y1:y,x2:x,y2:y+20});
  paper.drawLine({x1:x+220,y1:y,x2:x+220,y2:y+20});
  paper.drawLine({x1:x+220/2,y1:y,x2:x+220/2,y2:y+20});

  paper.drawLine({x1:x,y1:y+50,x2:x+220,y2:y+50});
  paper.drawLine({x1:x,y1:y+50-20,x2:x,y2:y+50});
  paper.drawLine({x1:x+220,y1:y+50-20,x2:x+220,y2:y+50});
  paper.drawLine({x1:x+220/2,y1:y+50-20,x2:x+220/2,y2:y+50});
 }

 function animCircle(paper){
  paper.animCircle({x:430,y:470,title:1,'leftmask':true});
  paper.animCircle({x:900,y:470,title:2});
  paper.animCircle({x:1420,y:470,title:3});
  paper.animCircle({x:430,y:928,title:4,'leftmask':true});
  paper.animCircle({x:910,y:928,title:5});
  paper.animCircle({x:1420,y:928,title:6});
  paper.animCircle({x:1890,y:470,'rightmask':true});
  paper.animCircle({x:1890,y:928,'rightmask':true});

  paper.animLine({x1:430+70+10,y1:470,x2:900-70-10,y2:470});
  paper.animLine({x1:900+70+10,y1:470,x2:1420-70-10,y2:470});
  paper.animLine({x1:1420+70+10,y1:470,x2:1890-70-10,y2:470});
  paper.animLine({x1:430+70+10,y1:928,x2:910-70-10,y2:928}); 
  paper.animLine({x1:910+70+10,y1:928,x2:1420-70-10,y2:928});
  paper.animLine({x1:1420+70+10,y1:928,x2:1890-70-10,y2:928}); 

 }

  /**
   * 生成随便数
   */
   function fRandomBy(under, over){ 
  	 return parseInt(Math.random()*(over-under+1) + under); 
  	
  } 






