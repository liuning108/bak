


Raphael.fn.animateCircleV3 = function(config) {
	var opacityAnimV3= Raphael.animation({ "50%": { opacity:0.5},
                                          "100%": { opacity:1 }
                                       }, 2000);
	
	 if (!config)config ={};
	 var paper =this;
       var instance_obj ={};
       var path_str="m 0,0 -5.3033,4.59619 3.182,13.25825 4.0658,3.53554 -0.7071,15.37957 14.6725,6.01041 8.6621,0.7071 0,-12.9047 -3.0052,-3.88908 -0.1768,-13.96536 3.0052,-1.76777 0.7071,-6.54074 -2.4749,-3.53553 z"
       //var angl_path_str="m 0,0 7.875,-0.375 0.375,10.5 -3.25,2.25 0.5,8.875 -2.75,2 -2.5,-0.125 -0.5,-0.875 0,-6.625 1.75,-0.625 -0.125,-7.5 -2,-1.5 0,-5.75 z m -1.1829,-0.19518 -7.875,-0.375 -0.375,10.5 3.25,2.25 -0.5,8.875 2.75,2 2.5,-0.125 0.5,-0.875 0,-6.625 -1.75,-0.625 0.125,-7.5 2,-1.5 0,-5.75 z";
var angl_path_str="m 0,0 0,5.6821 1.894,-0.12627 0,-5.55583 z m 1.7905,-23.2913 7.875,-0.375 0.375,10.5 -3.25,2.25 0.5,8.875 -2.75,2 -2.5,-0.125 -0.5,-0.875 0,-6.625 1.75,-0.625 -0.125,-7.5 -2,-1.5 0,-5.75 z m -1.1829,-0.19518 -7.875,-0.375 -0.375,10.5 3.25,2.25 -0.5,8.875 2.75,2 2.5,-0.125 0.5,-0.875 0,-6.625 -1.75,-0.625 0.125,-7.5 2,-1.5 0,-5.75 z"
       var sectorsCount=16	;
              var cx=1260;
              var cy=300;
              var angl_cx=1270;
              var angl_cy=330;
              var r=100;
              var r1=53;
              var item=[];
              var angl_items=[];
              var opacity=[];
              var vcolor="#01deeb";
        var  beta = 2 * Math.PI  / sectorsCount;
        var start={};
        var ang_start={};
       for (var i = 0; i < sectorsCount; i++) {
           var alpha = beta * i - Math.PI/2,
                        cos = Math.cos(alpha),
                        sin = Math.sin(alpha);
              if (i%2==0){vcolor="#7ce9ec"}else{vcolor="#01deeb"};
              item[i]=paper.path(path_str).attr('fill',vcolor)
              item[i].x=cx+r*cos;
              item[i].y=cy+r*sin;
              item[i].r=i*360/sectorsCount;
              item[i].transform(['t',item[i].x,item[i].y,'r',item[i].r])
               item[i].animate(opacityAnimV3.repeat(Infinity).delay(i*50));
              angl_items[i]=paper.path(angl_path_str).attr('fill',"0-#7ce9ec-#00dbe9")
                                                     .attr('stroke-width',1)

              angl_items[i].x=angl_cx+r1*cos;
              angl_items[i].y=angl_cy+r1*sin;
              angl_items[i].r=i*360/sectorsCount;
              angl_items[i].transform(['t',angl_items[i].x,angl_items[i].y,'r',angl_items[i].r])
            

       }; //end of init;

        paper.circle(1270, 320, 129).attr({
											fill: 'none',
											stroke: '#ffffff',
											'stroke-width': 1,
											'opacity':0.6
											})

       paper.circle(1270, 320, 70).attr({
											fill: 'none',
											stroke: '#ffffff',
											'stroke-width': 1,
											'opacity':0.7
											})

          paper.circle(1270, 320, 25).attr({
											fill: 'none',
											stroke: '#5debec',
											'stroke-width': 2,
											'opacity':1,
											'stroke-dasharray':'.'
											})

           paper.circle(1270, 320, 30).attr({
											fill: 'none',
											stroke: '#276363',
											'stroke-width': 4,
											'opacity':1,
											'stroke-dasharray':'.'
											})
      function swapItem(i){
      	   if (i==0){
      	   	    start.x=item[i].x;
                start.y=item[i].y;
              	start.r=item[i].r;
      	   }
      	   if (i>sectorsCount){return};
      	   if (i==sectorsCount-1){
      	   	item[i].x=start.x
      	   	item[i].y=start.y;
      	   	item[i].r=start.r;
      
      	     return;
      	   }
            item[i].x=item[i+1].x;
      	   	item[i].y=item[i+1].y;
      	   	item[i].r=item[i+1].r;
       	}


       	 function swapAnglItem(i){
      	   if (i==sectorsCount-1){
      	   	    ang_start.x=angl_items[i].x;
                ang_start.y=angl_items[i].y;
              	ang_start.r=angl_items[i].r;


      	   }
      	   if (i>sectorsCount){return};
      	   if (i==0){
      	   	angl_items[i].x=ang_start.x
      	   	angl_items[i].y=ang_start.y;
      	   	angl_items[i].r=ang_start.r;
      
      	     return;
      	   }else{
            angl_items[i].x=angl_items[i-1].x;
      	   	angl_items[i].y=angl_items[i-1].y;
      	   	angl_items[i].r=angl_items[i-1].r;
      	   	}
           // item[i].animate({"transform":['t',item[i+1].x,item[i+1].y,'r',item[i+1].r]},40)
       	}

       	function animateCircle(i){
       		if (item[i].r==0){
                       	 if (i==0){
                            item[i].attr({"transform":['t',item[sectorsCount-1].x,item[sectorsCount-1].y,'r',0]})
                       	   }else{
                       	     item[i].attr({"transform":['t',item[i-1].x,item[i-1].y,'r',0]})
                          }
                       	item[i].animate({"transform":['t',item[i].x,item[i].y,'r',0]},time_speed);

                       }else{
                  	      item[i].animate({"transform":['t',item[i].x,item[i].y,'r',item[i].r]}, time_speed);
       	               }


       	}


       		function animateAngl(i){
                 
       		          if (i==sectorsCount-1){
       		          	 angl_items[i].attr({"transform":['t',angl_items[0].x,angl_items[0].y,'r',angl_items[i].r]});
       			          angl_items[i].animate({"transform":['t',angl_items[i].x,angl_items[i].y,'r',angl_items[i].r],"opacity":0},time_speed);
                         
       			       }else{
                      	  angl_items[i].attr({"transform":['t',angl_items[i+1].x,angl_items[i+1].y,'r',angl_items[i].r]});
                  	      angl_items[i].animate({"transform":['t',angl_items[i].x,angl_items[i].y,'r',angl_items[i].r],"opacity":0}, time_speed);
       	               }
       	           
          	}
           
        var tick;
        var time_speed=500;
        (function ticker() {
                    opacity.unshift(opacity.pop());
                  for (var i=0;i<sectorsCount;i++){
                     swapItem(i);

                  }
                  for (var i=sectorsCount-1;i>=0;i--){
                  	swapAnglItem(i);
                  }
                  for (var i=0;i<sectorsCount;i++ ){
                       animateCircle(i);
                        animateAngl(i);	
                  }
                  
    
                    tick = setTimeout(ticker, time_speed);
                   

        })();
   
   
      return instance_obj;
       	

      
};