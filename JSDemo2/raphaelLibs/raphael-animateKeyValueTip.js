

Raphael.fn.animateKeyValueTip = function(config) {
	 if (!config)config ={};
      var paper=this;
      var x = config.x||685;
      var y =config.y||116;
      var font_betwwen_dis=127;
      var hight=12;
      var w=96;
      var color = config.color|| '#7dcad6'
      var name = config.key||"南京" ;
      var key_style={'fill':'#bcfff5','font-size':17,'font-family': '微软雅黑','font-weight':'bold'};
      var value_style={'fill':'#ffffff','font-size':17,'font-family': '微软雅黑','font-weight':'bold'}  
      var per_rect = paper.rect(x+75,y-26/2,w*0.1,26).attr({'fill':'#81eeff','opacity':0.6});
      var key = paper.text(x,y,name).attr(key_style);
      var value_num =paper.chartsNumbser({'showLabel':1,'x':x+font_betwwen_dis,'y':y+3,'value':123456, 'attrs': value_style});
      var rect = paper.rect(x+60,y-3,5,5).attr({'fill':color,'stroke-width':0})

      var key_frame_line_1=  paper.drawLine({'x1':x-46,'y1':y-hight,'x2':x+50,'y2':y-hight,'w':1,'opacity':0.5,'removeflag':true});
      var key_frame_line_11=paper.drawLine({'x1':x-46,'y1':y-hight,'x2':x-46,'y2':y-hight+10,'w':1,'opacity':0.5,'removeflag':true});
      var key_frame_line_12=paper.drawLine({'x1':x+50,'y1':y-hight,'x2':x+50,'y2':y-hight+10,'w':1,'opacity':0.5,'removeflag':true});
      var key_frame_line_2=  paper.drawLine({'x1':x-46,'y1':y+hight,'x2':x+50,'y2':y+hight,'w':1,'opacity':0.5,'removeflag':true});
      var key_frame_line_21=  paper.drawLine({'x1':x-46,'y1':y+hight,'x2':x-46,'y2':y+hight-10,'w':1,'opacity':0.5,'removeflag':true});
      var key_frame_line_22=  paper.drawLine({'x1':x+50,'y1':y+hight,'x2':x+50,'y2':y+hight-10,'w':1,'opacity':0.5,'removeflag':true});
      
      var value_x=x+font_betwwen_dis-6;
      var value_frame_line_1=  paper.drawLine({'x1':value_x-46,'y1':y-hight,'x2':value_x+50,'y2':y-hight,'w':1,'removeflag':true});
      var value_frame_line_11=paper.drawLine({'x1':value_x-46,'y1':y-hight,'x2':value_x-46,'y2':y-hight+10,'w':1,'removeflag':true});
      var value_frame_line_12=paper.drawLine({'x1':value_x+50,'y1':y-hight,'x2':value_x+50,'y2':y-hight+10,'w':1,'removeflag':true});
      var value_frame_line_2=  paper.drawLine({'x1':value_x-46,'y1':y+hight,'x2':value_x+50,'y2':y+hight,'w':1,'removeflag':true});
      var value_frame_line_21=  paper.drawLine({'x1':value_x-46,'y1':y+hight,'x2':value_x-46,'y2':y+hight-10,'w':1,'removeflag':true});
      var value_frame_line_22=  paper.drawLine({'x1':value_x+50,'y1':y+hight,'x2':value_x+50,'y2':y+hight-10,'w':1,'removeflag':true});
       


      
      function setValue(max,value){
        var per=value/max;
        per_rect.animate({'width':w*per});
        value_num.setValue(value);
      }

      return {
        'setValue':setValue
      }

      
};