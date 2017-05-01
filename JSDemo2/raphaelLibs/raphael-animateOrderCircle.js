

Raphael.fn.animateOrderCircle = function(config) {
	 if (!config)config ={};
     var x = config.x||0;
     var y = config.y||0;
     var r = config.r|| r;
     var paper=this;
     var width=3;	
     var sectorsCount = 40;
     var speed =config.speed||1000;
    function createSectors(x,y,r,size1,size2,sectorsCount,mathpi,startAngle,vpathParams){
	     var beta=mathpi / sectorsCount;
	     var  sectors = [];
	     var  pathParams = vpathParams;
	     var  opacity = [];    
	     for (var i = 0; i < sectorsCount; i++){
	          var alpha = (beta) * i+startAngle ;
	          var cos = Math.cos(alpha);
	          var sin = Math.sin(alpha);
	          var rr1=r+size1;
	          var rr2=r+size2;
	          opacity[i] = 1 / sectorsCount * i; 
	          sectors[i] = paper.path([["M", x + rr1 * cos, y + rr1 * sin], ["L", x + rr2 * cos, y + rr2 * sin]]).attr(pathParams);

	     }
		 function tick(){
	     	opacity.unshift(opacity.pop());
	     	for (var i = 0; i < sectorsCount; i++) {
	          sectors[i].attr("opacity", opacity[i]);
	        }
	        setTimeout(tick, speed / sectorsCount);
	     }
	       tick();

     }	

     var bg_circle_style={'fill':'#1b2d37','stroke-width':0,'opacity':0.4};
     paper.circle(x,y,r).attr(bg_circle_style)


     var sectors1_style={stroke: '#e4f3ba', "stroke-width": 3, "stroke-linecap": "round",'opacity':0.5};
     createSectors(x,y,r,3,-3,sectorsCount,Math.PI*2,-Math.PI,sectors1_style);
     
     var sector2_style={'stroke': '#09b7be', "stroke-width":2, "stroke-linecap": "round",'opacity':0.5};
     createSectors(x,y+2,r-r/4,5,-4,20,Math.PI,0,sector2_style);
    

     var circle_style={'stroke': '#579bc4',"stroke-width": 1};
     paper.circle(x,y,r/2.4).attr(circle_style);
     
     var center_circle_style={'stroke': '#ff4737',"stroke-width": 1};
     paper.circle(x,y,3).attr(center_circle_style);

     paper.drawLine({'x1':x+3,'y1':y,'x2':x+r/5,'y2':y,'removeflag':true,'color':'#ff4737'});
     paper.drawLine({'x1':x-3,'y1':y,'x2':x-r/5,'y2':y,'removeflag':true,'color':'#ff4737'});

     var rect_style={'fill': '#fffeff',"stroke-width": 0,'opacity':0.7};
     paper.rect(x-12,y-33,r/13,r/12).attr(rect_style)
     paper.rect(x,y-33,r/13,r/12).attr(rect_style)
     paper.rect(x+12,y-33,r/13,r/12).attr(rect_style)

};