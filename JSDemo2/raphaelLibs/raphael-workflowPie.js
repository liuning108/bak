Raphael.fn.workflowPie = function(config){
  	 if (!config)config ={};
     var x = config.x||0;
     var y = config.y||0;
     var r = config.r||170;
     var list_x= config.listx||109
      var list_y=config.listy||590;
     var modes = config.modes ||[];
     var width=config.width||30;
     var paper=this;
       var radians = Math.PI / 180;
paper.customAttributes.arcpie = function (centerX, centerY, startAngle, endAngle, innerR, outerR,value) {
        largeArc = +(endAngle - startAngle > 180);
        outerX1 = centerX + outerR * Math.cos((startAngle-90) * radians),
        outerY1 = centerY + outerR * Math.sin((startAngle-90) * radians),
        outerX2 = centerX + outerR * Math.cos((endAngle-90) * radians),
        outerY2 = centerY + outerR * Math.sin((endAngle-90) * radians),
        innerX1 = centerX + innerR * Math.cos((endAngle-90) * radians),
        innerY1 = centerY + innerR * Math.sin((endAngle-90) * radians),
        innerX2 = centerX + innerR * Math.cos((startAngle-90) * radians),
        innerY2 = centerY + innerR * Math.sin((startAngle-90) * radians);
    // build the path array
    var path = [
        ["M", outerX1, outerY1], //move to the start point
        ["A", outerR, outerR, 0, largeArc, 1, outerX2, outerY2], //draw the outer edge of the arc
        ["L", innerX1, innerY1], //draw a line inwards to the start of the inner edge of the arc
        ["A", innerR, innerR, 0, largeArc, 0, innerX2, innerY2], //draw the inner arc
        ["z"] //close the path
    ];      
      var color=this.mycolor;
      var center_endAngle=endAngle-(endAngle-startAngle)/2;
      var c_outerX1 = centerX + outerR * Math.cos((center_endAngle-90) * radians);
      var c_outerY1 = centerY + outerR * Math.sin((center_endAngle-90) * radians);
      var c_outerX2 = centerX + (outerR+90) * Math.cos((center_endAngle-90) * radians);
      var c_outerY2 = centerY + (outerR+90) * Math.sin((center_endAngle-90) * radians);
      var l_outerX2 = centerX + (outerR+83) * Math.cos((center_endAngle-90) * radians);
      var l_outerY2 = centerY + (outerR+83) * Math.sin((center_endAngle-90) * radians);
      var t_outerX2 = centerX + (outerR+135) * Math.cos((center_endAngle-90) * radians);
      var t_outerY2 = centerY + (outerR+135) * Math.sin((center_endAngle-90) * radians);
      var v_outerX2 = centerX + (outerR+135) * Math.cos((center_endAngle-90) * radians);
      var v_outerY2 = centerY + (outerR+135) * Math.sin((center_endAngle-90) * radians);      
      var pathParams = {stroke: color, "stroke-width": 4, opacity:0.7};
     if (!this.circle){
      this.circle= paper.circle(c_outerX2, c_outerY2, 7).attr({'fill':'none','stroke':color,'stroke-width':4,'opacity':0.7});
      this.linePath= paper.path([["M", c_outerX1, c_outerY1], ["L",l_outerX2,l_outerY2]]).attr(pathParams);
      this.nameLabel=paper.text(t_outerX2,t_outerY2,this.name).attr({'fill':color,'font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
      var fontw=this.name.length*22;
      this.nameValue=paper.text(v_outerX2+fontw,v_outerY2,this.value).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
     }else{
      this.circle.attr({'cx':c_outerX2,'cy':c_outerY2,'fill':'none','stroke':color,'stroke-width':4});
      this.linePath.attr({path:[["M", c_outerX1, c_outerY1], ["L",l_outerX2,l_outerY2]]}).attr(pathParams);
     this.nameLabel.attr({'x':t_outerX2,'y':t_outerY2})
       
       if (this.nameValue){
           this.nameValue.remove();
           //console.log(this.name.length);
           var fontw_n=this.name.length;
           if (fontw_n>3.4)fontw_n=3.4;
             var fontw=fontw_n*23;
           this.nameValue=paper.text(v_outerX2+fontw,v_outerY2,Math.floor(value)).attr({'fill':'#ffffff','font-size':22,'font-family': '微软雅黑','font-weight':'bold'});
        }
     }
   
    return {path: path};
};

     
   
      var r3=r
      var arc_width=r+width;
      var items=[];

      paper.circle(x, y, arc_width+85).attr({'fill':'none','stroke':'#9cb722','stroke-width':1.5,'opacity':0.35});
      paper.circle(x, y, arc_width+50).attr({'fill':'none','stroke':'#9cb722','stroke-width':1.5,'opacity':0.50});
      paper.circle(x, y, arc_width+25).attr({'fill':'none','stroke':'#9cb722','stroke-width':1.5,'opacity':0.85});
      
      
    var glows=paper.set();      
      //start of initiation  data    
   for (var i=0;i<modes.length;i++){
       modes[i].value=0;
           if(i==0){
               modes[i].sa=0;
               modes[i].ea=360*0.01;
           }else{
               modes[i].sa=modes[i-1].ea;
               modes[i].ea=modes[i-1].ea+(360*0.01);
           }
           modes[i].path = paper.path();
           modes[i].path.mycolor=modes[i].color;
           modes[i].path.name=modes[i].name;
           modes[i].path.value=modes[i].value;
           modes[i].path.attr({
                "stroke": modes[i].color,
                "stroke-width":1,
                'fill': modes[i].color,
                arcpie: [x,y,modes[i].sa, modes[i].ea, r3,arc_width,0]
            });
          
  } 
    //end of initiation  data
    var obj_instance={};
   
    obj_instance.inputData=function(datas){
             glows.remove()
           computingPercent(datas);
           drawPie();
    }
    
    
   //start of private fun 
  
   
   function drawPie(){
  
       for (var i =0;i<modes.length;i++){
             if(i==0){
               modes[i].sa=0;
               modes[i].ea=360*modes[i].percent;
           }else{
               modes[i].sa=modes[i-1].ea;
               modes[i].ea=modes[i-1].ea+(360*modes[i].percent);
           }
           var width=(100*modes[i].percent)*modes.length/2;
           if (width>100){
               width=100;
           }
           modes[i].path.value=modes[i].value;
           modes[i].path.animate({
                    arcpie: [x,y, modes[i].sa,modes[i].ea, r3,arc_width,modes[i].value]
                }, 1500,function(){
                    //glows.push(this.glow({'width':5,color:this.mycolor}));
                });
                
            
       }
   }//end of drawPie;
   
   function  computingPercent(datas){
       for (var i=0;i<modes.length;i++){
           for (var j = 0;j<datas.length;j++){
               if (modes[i].name==datas[j].name){
                   modes[i].value=datas[j].value;              
                   continue;
               }
           }//end of for;
       }
       
        for (var i=0;i<items.length;i++){
           for (var j = 0;j<datas.length;j++){
       
               if (items[i].name==datas[j].name){
                   items[i].value=datas[j].value;     
                       
                   continue;
               }
           }//end of for;
       }
        var sum =0;
       for (var i = 0;i<modes.length;i++ ){
           sum=sum+modes[i].value;
       }
       for (var i=0;i<modes.length;i++){
           var percent=(modes[i].value/sum);
           modes[i].percent=percent.toFixed(2);
       }
   }//end of   computingPercent
   
  
   
   
   //end of private fun 
    return  obj_instance;
}