Raphael.fn.chartsLineBar= function(config){
  	 if (!config)config ={};
     
     var obj_instance={};
     var x = config.x||1280
     var y = config.y||596;
     var obj_instance={};
     var paper =this;
     var item_w =30;
     var item_h =120;
     var span_w=15;
     var keys=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
     var fontStyle={'fill':'#ffffff','font-size':16,'font-family': '微软雅黑','font-weight':'bold'};
     var circleStyle={'fill':'#171724','stroke-width':0};
     var lineStyle={'fill':'#171724','stroke-width':0};
     var r=6;
     var items=[];
    var curve=null;
     for (var i=0;i<keys.length;i++){
             var node ={};
             node.name=keys[i];  
             var spanw=i*(item_w+span_w);
             var spanw2=(i-1)*(item_w+span_w);
             node.x=x+spanw;    
             node.value=0;
             var linex=x+spanw2;
             node.valuebg=paper.rect(node.x,(item_h+y-r)-item_h*0.01,item_w,item_h*0.01).attr({"stroke-width":'0','fill':"#01d7ff" });
 
             node.label=paper.text(node.x+item_w/2,y+item_h+27,node.name).attr(fontStyle);
             node.c=paper.circle(node.x+item_w/2,y+item_h, r).attr(circleStyle);
             node.line=paper.rect(linex+item_w/2,y+item_h-r/2,item_w+span_w,6,6).attr(lineStyle).toBack();
             node.num=paper.chartsNumbser({'x':node.x+item_w/2,'y':(item_h+y-6)-item_h*0.01-10,'value':0,'format':false,
   	                                       attrs: {'fill':'#ffffff','font-size':16,'font-family': '微软雅黑','font-weight':'bold'}
                                      }); 
              items.push(node);
     }
     obj_instance.inputData=function(datas){
         //console.log(datas);
         for (var i=0;i<items.length;i++){
                               for (var j = 0;j<datas.length;j++){
                                 if (items[i].name==datas[j].name){
                                     items[i].value=datas[j].value;
                                     items[i].num.setValue(items[i].value)
                                   continue;
                                  }
                            }//end of inner for;
                        }//end of outer for;
          //find max;       
          var max=items[0].value;
          for (var i=0;i<items.length;i++){  
              if (max<items[i].value){
                  max=items[i].value;
              }
          }   //end of for  
         
         //TimeLineAnima
         for (var i=0;i<items.length;i++){
             var item= items[i];
             var allhy=(item_h+y-r);
             var per =item.value/(max+(max*0.1));
                     
            if (item.value>0){
               item.y=allhy-item_h*per;
              item.valuebg.animate({'y': item.y,'height':item_h*per },1000);
              item.line.animate({'fill':'#01d7ff'},i*500);
              item.c.animate({'fill':'#01d7ff'},i*500);
              item.num.numobj.animate({'y':allhy-item_h*per-10},1000);
             }
         }
         //endTimeLineAnima
          
              var  points=[];
           for (var i=0;i<items.length;i++){
               var item=items[i];
               if (item.value>0){
               points.push({
                   'x':item.x,
                   'y':item.y
                 })
               }
           }
           var point_paths=[];
   
         
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
               curve=paper.path(point_paths).attr({"stroke-width":0});
                curve.animate({'stroke':'#ffcc00','stroke-width':4},1000,function(){
                       curve.g=curve.glow({'color':'#ffcc00'});
                }).toFront();
             
            
              }else{
                curve.attr({'path':point_paths});
                curve.toFront();
                 curve.g.remove();
                 curve.g=curve.glow({'color':'#ffcc00'});
                
              }
          }catch(e){}
         }//end of if;
          
          
             
     }//end of obj_instance;
     
     
    return  obj_instance;
}