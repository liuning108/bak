Raphael.fn.chartsBar2= function(config){
  	 if (!config)config ={};
     
     var obj_instance={};
     var x = config.x||644;
     var y = config.y||596;
     
     var paper =this;
     var item_w =30;
     var item_h =120;
     var keys=['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通' ,'连云港' ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁'];
     var span_w=15;
     var fontStyle={'fill':'#ffffff','font-size':16,'font-family': '微软雅黑','font-weight':'bold'};
     var items=[];
     for (var i=0;i<keys.length;i++){
             var node ={};
             node.x=x+(i*(item_w+span_w)); 
             node.value=0;
             node.bg=paper.rect(node.x,y,item_w,item_h).attr({"stroke-width":'0','fill':"#181826" });
             node.valuebg=paper.rect(node.x,(item_h+y)-item_h*0.01,item_w,item_h*0.01).attr({"stroke-width":'0','fill':"#01d7ff" });
             node.label=paper.text(node.x+item_w/2,y+item_h+27,keys[i]).attr(fontStyle);
             node.name=keys[i];
             node.num=paper.chartsNumbser({'x':node.x+item_w/2,'y':(item_h+y)-item_h*0.01-10,'value':123,'format':false,
   	                                       attrs: {'fill':'#ffffff','font-size':16,'font-family': '微软雅黑','font-weight':'bold'}
                                      }); 
            items.push(node);            
                                      
     }
     
     function orderby() {
               var title_y=y;
                    for (var i=0;i<items.length;i++){
                            for(var j=0;j<items.length;j++){         
                                    if (items[i].value>items[j].value){
                                        var temp2=items[i];
                                        items[i]=items[j];
                                        items[j]=temp2;                  
                                    }
                            }//end of inner_for 
                    }//end of outer_for 
                              var max=items[0].value+items[0].value*0.1;
                              var allhy=(item_h+y)
                        for (var i=0;i<items.length;i++){
                            var item =  items[i]
                            var itemx=x+(i*(item_w+span_w));
                            var per =items[i].value/max;
                            item.num.setValue(items[i].value)
                            item.label.animate({'x':itemx+item_w/2},1000);
                            item.num.numobj.animate({'x':itemx+item_w/2},1000)  
                            item.num.numobj.animate({'y':allhy-item_h*per-10},1000);
                            item.valuebg.animate({'x':itemx },1000);
                            item.valuebg.animate({'y':allhy-item_h*per,'height':item_h*per },1000);
                            
                            item.bg.animate({'x':itemx},1000)
                        }
   }//end of orderby
   
   
     obj_instance.inputData=function(datas){
         //console.log(datas);
         for (var i=0;i<items.length;i++){
                               for (var j = 0;j<datas.length;j++){
                                 if (items[i].name==datas[j].name){
                                     items[i].value=datas[j].value;
                                     //items[i].num.setValue(items[i].value)
                                   continue;
                                  }
                            }//end of inner for;
                        }//end of outer for;
                        
                        orderby();
     }
     
     
    return  obj_instance;
}