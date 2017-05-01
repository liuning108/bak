Raphael.fn.chartsArea=function(config){
	 if (!config) config = {};
	 var x =config.x||0;//982;
     var y =config.y||0//399;

	 var paper =this;
	 var are_name=config.are_name||"";
	 var are_font={'fill':'#45cde7','font-size':18,'font-family': '微软雅黑','font-weight':'bold'};
     var are_title= paper.text(x,y,are_name);
         are_title.attr(are_font);
     
     //购物车
     var shopcar_title =paper.text(x,y+35,'购物车');
         shopcar_title.attr({'fill':'#e4f3ba','font-size':15,'font-family': '微软雅黑','font-weight':'bold'});
     var shopingcart_num =paper.chartsNumbser({'x':x,'y':y+55,'value':11234,  attrs: {'fill':'#e4f3ba','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}});
    
     //网络延迟率
     var net_font ={'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
     var net_value=paper.chartsBarcode({'x':x+65,'y':y+46,'w':40,'h':24,'item_nums':18,'item_space':0.8,'color':'#16ffd8','fontAttr':net_font});
         net_value.setValue(100,80);
     var net_title = paper.text(x+140,y+60,'网络延迟率');
         net_title.attr(net_font);

     //3G
      var m3G_font ={'fill':'#ffffff','font-size':12,'font-family': '微软雅黑','font-weight':'bold'};
      var m3G_font2 ={'fill':'#03b8ef','font-size':12,'font-family': '微软雅黑','font-weight':'bold'};
      var m3G_value=paper.chartsBarcode({'x':x+200,'y':y-4,'w':40,'h':24,'item_nums':18,'item_space':0.8,'color':'#03b8ef','fontAttr':m3G_font});
          m3G_value.setValue(2000,1345);   
      var m3G_title = paper.text(x+215,y-13,'3G');
          m3G_title.attr(m3G_font2);
     
     //4G
      var m4G_font ={'fill':'#ffffff','font-size':12,'font-family': '微软雅黑','font-weight':'bold'};
      var m4G_font2 ={'fill':'#ffa305','font-size':12,'font-family': '微软雅黑','font-weight':'bold'};
      var m4G_value=paper.chartsBarcode({'x':x+200,'y':y-4+50,'w':40,'h':24,'item_nums':18,'item_space':0.8,'color':'#ffa305','fontAttr':m4G_font});
          m4G_value.setValue(2000,1345);   
      var m4G_title = paper.text(x+215,y-13+50,'4G');
          m4G_title.attr(m4G_font2);
    
     // map
      var mapitem={fill: '#88e6f9', 'stroke-width': 0.5,'stroke':'#727eb4','opacity':0.9}
      var cxcy =config.cxcy||[100,-55]
      var scale=config.scale||[0.4,0.4];
      var map_path=config.path||"";
      var map=paper.path(map_path);
          map.attr(mapitem);
          map.translate(x+cxcy[0],y+cxcy[1]);
          map.scale(scale[0],scale[1]);
     
     var map_object={} 
         map_object.setColor=function(color){
         	 map.animate({'fill':color},1000);
         }

     // draw line     
      paper.drawLine({'x1':x-50,'y1':y-15,'x2':x-50,'y2':y-4,opacity:0.5});
      paper.drawLine({'x1':x-50,'y1':y-15,'x2':x+50,'y2':y-15,opacity:0.9});
      paper.drawLine({'x1':x+50,'y1':y-15,'x2':x+50,'y2':y-4,opacity:0.5});
      paper.drawLine({'x1':x-50,'y1':y+4,'x2':x-50,'y2':y+14,opacity:0.5});
      paper.drawLine({'x1':x-50,'y1':y+14,'x2':x+50,'y2':y+14,opacity:0.9});      
      paper.drawLine({'x1':x+50,'y1':y+14,'x2':x+50,'y2':y+4,opacity:0.5}); 

      paper.drawLine({'x1':x+50,'y1':y+23,'x2':x+50,'y2':y+50,opacity:0.5}); 
      paper.drawLine({'x1':x+50,'y1':y+58,'x2':x+50,'y2':y+70,opacity:0.9}); 
      paper.drawLine({'x1':x-50,'y1':y+70,'x2':x+50,'y2':y+70,opacity:0.5}); 
      paper.drawLine({'x1':x-50,'y1':y+58,'x2':x-50,'y2':y+70,opacity:0.9}); 
      paper.drawLine({'x1':x-50,'y1':y+50,'x2':x-50,'y2':y+23,opacity:0.5}); 
      paper.drawLine({'x1':x-50,'y1':y+23,'x2':x+50,'y2':y+23,opacity:0.5});

      paper.drawLine({'x1':x+60,'y1':y-15,'x2':x+60,'y2':y+72,opacity:0.5});
      paper.drawLine({'x1':x+60,'y1':y-15,'x2':x+185,'y2':y-15,opacity:0.5}); 
      paper.drawLine({'x1':x+185,'y1':y-15,'x2':x+185,'y2':y+50,opacity:0.5}); 
      paper.drawLine({'x1':x+185,'y1':y-15,'x2':x+185,'y2':y+50,opacity:0.5}); 
      paper.drawLine({'x1':x+185,'y1':y+60,'x2':x+185,'y2':y+70,opacity:0.5});
      paper.drawLine({'x1':x+185,'y1':y+60,'x2':x+185,'y2':y+72,opacity:0.5});
      paper.drawLine({'x1':x+60,'y1':y+72,'x2':x+185,'y2':y+72,opacity:0.5});
      paper.drawLine({'x1':x+60,'y1':y+72,'x2':x+60,'y2':y-15,opacity:0.5});


      return {
      	 'name':are_name,
      	 'shopingcart_num':shopingcart_num,
      	 'm3G_value':m3G_value,
      	 'm4G_value':m4G_value,
      	 'net_value':net_value,
      	 'map':map_object
      }
} //end of function-