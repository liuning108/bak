Raphael.fn.processRate=function(config){
    
    var sectorsCount = 101;
    var color = config.colour || "#fffffd";
    var  x = config.x||0;
    var  y = config.y||0; 
    var  r1 = config.r1||145;
    var  r2 = config.r2||140;
    var  width=config.width||3;
    var  pathParams = {stroke: color, "stroke-width": width, "stroke-linecap": "round"};
    var  pathParams2 = {stroke: color, "stroke-width": width+1, "stroke-linecap": "round"};
    var  font ={'fill':'#ffffff','font-size':r2/5.6,'font-family': '微软雅黑','font-weight':'bold'};
    var  font2 ={'fill':'#f9fde9','font-size':r2/3,'font-family': '微软雅黑','font-weight':'bold'};
     var  font3 ={'fill':'#f9fde9','font-size':r2/5,'font-family': '微软雅黑','font-weight':'bold'};
    var  beta =  (Math.PI+(Math.PI/4)) / sectorsCount;
    var  sectors = [];
    var  opacity = [];
    var  cx = r2 + width+x;
    var  cy = r2 + width+y;
    var  per=0;  // 0.0-1
    for (var i = 0; i < sectorsCount; i++){
    	var alpha = (beta+0.003) * i - Math.PI-(Math.PI/6) ;
    	var cos = Math.cos(alpha);
        var sin = Math.sin(alpha);
        var params=pathParams;
        if ((i%10)==0){
          var rr1=r1+5;
          var rr2=r2-5;
          sectors[i] = this.path([["M", cx+ rr1 * cos, cy + rr1 * sin], ["L", cx + rr2 * cos, cy + rr2 * sin]]).attr(pathParams2);
          
          this.text(cx+ (rr2-r2/5.6) * cos,cy + (rr2-r2/5.6) * sin,i).attr(font);
        }else{
           sectors[i] = this.path([["M", cx + r1 * cos, cy + r1 * sin], ["L", cx + r2 * cos, cy + r2 * sin]]).attr(pathParams);
        }
       
    }


    var indicator=this.rect(cx,cy,4,r2-30).attr({"fill":'#be341a',"stroke-width":0});
   var circleItem= this.circle(cx,cy,r2/8).attr({"fill":'#2e323b','stroke': '#ffffff',"stroke-width":3});
    var perItem=this.chartsNumbser({'x':cx,'y':cy+r2-r2/3,'value':(per*100),'attrs':font2});
    var textitem =this.text(cx+r2/3,cy+r2-r2/3,'%').attr(font3);
  
    var setDeg=function(per){
      var baseDeg=60;
      var maxDeg=300
      var length=maxDeg-baseDeg;
      var curdeg=baseDeg+(length*per);
         indicator.animate({transform : ["r", curdeg, cx, cy ] },1000);
         perItem.setValue(per*100);
    }
    setDeg(per);
	return {
		 'setDeg':setDeg
	}

}