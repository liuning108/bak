

Raphael.fn.animateLinebar = function(config) {
	 if (!config)config ={};
     
     var x = config.x||0;
     var y = config.y||0;
     var w = config.w||100;
     var h = config.h||100;
     var item_nums=config.item_nums||5;
     var point_r =config.point_r||3
     var linew=config.line_w||2
     var point_color=config.point_color||'#fffff';
     var line_color=config.line_color||'#fffff';
     var paper=this;
     var max = 0;
     var min = 999999999999;
     var current_value =0;
     var item_w = Math.round(w/item_nums);
     var high_line=max+(max*0.1);
     var debug=config.debug||false;
     var labelSpace=config.labelSpace||0;
     var showvalue = config.showvalue||0;
     var labelFont =config.labelFont||{'fill':'#ffffff','font-size':10,'font-family': '微软雅黑','font-weight':'bold'}
     var valueFont = config.valueFont||labelFont;
     if (debug){
       paper.rect(x,y,w,h).attr({'stroke':'red','stroke-width':2});
     }
     var index =0;
     var datas=[];
     var labels=[];
     var points=[]; //点坐标数据
     var points_obj=[];
     var points_label=[];
     var points_value=[];

     function pushValue(value,time_now){
       if (max<value){
          max= value;
          high_line=max+(max*0.1);
          updteall();
       }//end of get max value;

       if (min>value){
          min = value;
       }// end of get min value;

       if (index>=item_nums){

          datas.shift();
          points.shift();
          labels.shift();
           updteall();
          index--;
          
       }

       datas[index]=value;
       labels[index]=time_now;
       var cx = x+(index*item_w+item_w/2);
       var cy  =(y+h)-Math.round(h*(value/high_line));
       var point={};
       point.x=cx;
       point.y=cy;
       points[index]=point;
       current_value=value;
        if(!points_obj[index] && index<item_nums-1){
         points_obj[index]=paper.circle(point.x, point.y, point_r).attr({'fill':point_color, 'stroke-width':0});
         if (index%labelSpace==0 ){
           if (showvalue){
             points_value[index]=paper.text(point.x,point.y+10,showvalue+value).attr(valueFont);
             points_label[index]=paper.text(point.x,y+h+12+12,time_now).attr(labelFont);
           }else{
             points_label[index]=paper.text(point.x,y+h+12,time_now).attr(labelFont);
           }
         
         }
       }
       drawLine();
      
       index++;

     }
       function updteall(){
          for (var i=0;i<points_obj.length;i++){
                var per =datas[i]/high_line;
                var cx = x+(i*item_w+item_w/2);
                var cy  =(y+h)-Math.round(h*per);
                var time_now= labels[i];
                try{
                points[i].x=cx;
                points[i].y=cy;
                points_obj[i].attr({'cx':cx,'cy':cy});

                if (i%labelSpace==0){
                points_label[i].attr({'text':time_now});
                if (showvalue){
                    points_value[i].attr({'x':cx,'y':cy+10})
                    points_value[i].attr({'text':showvalue+datas[i]})
                  }
                 
                }
                   }catch(e){}
              }      
      }

      var point_paths=[];
      var curve;
     function drawLine(){
          if (points.length>1){    
               try {
              point_paths=['M', points[0].x, points[0].y];
              point_paths.push('L');
               if (points.length>2){
                    point_paths[3]='R' ;
               }
            
              for (var i=1;i<points.length;i++){
                 point_paths.push(points[i].x);
                 point_paths.push(points[i].y);
              }
              if (!curve){
               curve=paper.path(point_paths).attr({'stroke':line_color,'stroke-width':linew});
              }else{
                curve.attr({'path':point_paths});
              }
          }catch(e){}
         }//end of if;
     }//画线


     return {
          'pushValue':pushValue,
          'getMax': function(){return max},
          'getMin': function(){return min},
          'getValue':function(){return current_value }
     }
   
};