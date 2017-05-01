Raphael.fn.chartsListSides = function(config){
  var paper =this;
  var x =config.x||0;
  var y= config.y||0;
  var space_width=320;
  var nums_width=50;
  var font_style={'fill':'#d7ffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
  var font_style2={'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
  
  var datas =config.datas||['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通' ,'连云港' ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁']
  
    var groupLeft=[];
    var groupRight=[]
    var num =Math.floor(datas.length/2);
    //groupLeft
    for (var i =0 ;i<num;i++){
    	  groupLeft.push(datas[i]);
    }

    //groupRight
    for (var i =num ;i<datas.length;i++){
    	  groupRight.push(datas[i]);
    }
     var items=[];
     function drawGroup(group,x,y,flag){
         for (var i =0;i<group.length;i++){
         	    var name=group[i];
         	    var cy=y+(i*20);
         	    var style_f=font_style2;
         	    if ( (i+1)%2==0){
         	      style_f=font_style
         	    }
         	    var item={};
         	    item.name=name;
         	    item.text=paper.text(x,cy,name).attr(style_f);
         	    item.nums=paper.chartsNumbser({'x':x+(flag*nums_width),'y':cy,'value':0,'attrs': style_f});
         	    items.push(item);
   
         }
     }
     drawGroup(groupLeft,x,y,1);
     drawGroup(groupRight,x+space_width,y,-1);

     function findItemByName(name){
          for (var i=0;i<items.length;i++){
          	  if (name==items[i].name){
          	  	return items[i];
          	  }
          }
          return false;
     }

     function setDatas(datas){
     	  for (var i =0 ;i<datas.length;i++){
     	  	  var data=datas[i];
     	  	  var item =findItemByName(data.name);
     	  	  if (item){
     	  	  	item.nums.setValue(data.value)
     	  	  }
     	  }//end of for 
     }
     return {
     	  'setDatas':setDatas
     }
}


