Raphael.fn.animateRadar = function(config) {
     if (!config) config ={};
     var paper =this; 
     var x =config.x||281;
     var y =config.y||356;
     var outside_r =config.r||40;


     var outSideCircleStyle={'stroke':'#027fad','stroke-width':1};
     var bg_circle_1CircleStyle={'fill':'#1a2d34','stroke-width':0,'opacity':0.7};
     var bg_circle_2CircleStyle={'fill':'#1a2d34','stroke-width':0,'opacity':0.4};

     var outside_cicle=paper.circle(x,y,outside_r).attr(outSideCircleStyle);
     var bg_circle_1 = paper.circle(x,y,outside_r-outside_r/3).attr(bg_circle_1CircleStyle);
     var bg_circle_2 = paper.circle(x,y,outside_r-outside_r/7).attr(bg_circle_2CircleStyle);
     
     var center_point_sytel={'fill':'#f7bc3e','stroke-width':'0'};
     var center_point_r=4	;
     var center_point= paper.rect(x-(center_point_r/2),y-(center_point_r/2),center_point_r,center_point_r).attr(center_point_sytel);
     

     var center_circle_style={'stroke':'#f7bc3e','stroke-width':'1'};
     var center_point_r=outside_r/3;
     var center_circle= paper.circle(x,y,center_point_r).attr(center_circle_style);
     

     ///cx, cy, r, startAngle, endAngle, params
     var sectorStyle={'fill':'#3be8cc','stroke-width':'0','opacity':0.2};
     var sector_r =outside_r;
     var startAngle=0;
     var endAngle=30;
     var sector =paper.sector(x,y,sector_r,startAngle,endAngle,sectorStyle);
     
     var  counter =0;
     var  random_point =function(xy){return paper.fRandomBy(xy-outside_r/2,xy+outside_r/2)};
     var  random_point_r=3;
     var r1 = paper.rect(random_point(x)-(random_point_r/2),random_point(y)-(random_point_r/2),random_point_r,random_point_r).attr(center_point_sytel);
     var r2 = paper.rect(random_point(x)-(random_point_r/2),random_point(y)-(random_point_r/2),random_point_r,random_point_r).attr(center_point_sytel);
     var r3 = paper.rect(random_point(x)-(random_point_r/2),random_point(y)-(random_point_r/2),random_point_r,random_point_r).attr(center_point_sytel);
     
     function anim(curdeg){
      if (counter>2){
      	r1.attr({'x':random_point(x),'y':random_point(y)});
      	r2.attr({'x':random_point(x),'y':random_point(y)});
      	r3.attr({'x':random_point(x),'y':random_point(y)});
      	counter=0;
     }
      sector.animate({transform : ["r", curdeg, x, y ] },1000,function(){
      	sector.attr({transform:["r",0,x,y]}); //init sector;
      	 anim(360);
      }); //end of animate();
      counter++;
     }
     anim(360);
    
    //draw line 
     var line1 =paper.drawLine({'x1':x+center_point_r,'y1':y-5,'x2':x+center_point_r+outside_r/2,'y2':y-outside_r/2,'removeflag':true,'color':'#ffffff'});
     var line1 =paper.drawLine({'x1':x-center_point_r,'y1':y-5,'x2':x-center_point_r-outside_r/2,'y2':y-outside_r/2,'removeflag':true,'color':'#ffffff'});


};