Raphael.fn.animCircle=function(config){
	    var x = config.x||900;
	    var y = config.y||470;
	    var leftmask=config.leftmask||false;
	    var rightmask=config.rightmask||false;
	    var text=config.title||'';
	    var style={'stroke':"#53a4f4",'stroke-width':"20",'opacity':0.4};
	    var start_deg=0;
	    var end_deg=1;
	    var paper =this;
       if (leftmask){
       	//this.rect(x-140/2+70,y-140/2,150,150).attr({'fill':'#fffee2'})
         style['clip-rect']=[x-140/2+70,y-140,280,280]
         end_deg=0.5;
         
	   }
	   
	   if (rightmask){
	   	// this.rect(x-140,y-140,150,250).attr({'fill':'#fffee2'})
        style['clip-rect']=[x-140,y-140,150,250]
         start_deg=0.5;
         end_deg=1;
	   }
	   var big=this.circle(x,y,70).attr(style);
	   	
	    var text=this.text(x,y,text).attr({'fill':'#fffee2','font-size':45,'font-family': '微软雅黑','font-weight':'bold'});
		function anim(item,i){
			item.animateAlong({
						path: paper.pathCircle(x,y,70),
						rotate: true,
						duration: 2000+(i*100),
						easing: 'linear',
						along:start_deg
					},
					{
						along:end_deg,
						opacity: 1
					},
					function() {
						 anim(item,i);
					});
	         }//end of anim;
        var paper =this;
        var items=[];
        var colors=['#1bb699','#ffe168','#ff5f4f','#1f9585','#ffe168','#ff5f4f','#ff5f4f','#1f9585','#ff5f4f','#1f9585'];
		for (var i = 0;i<colors.length;i++){
	        items[i]=this.circle(x,y,4).attr({'fill':colors[i],'stroke-width':"0"})
	        setTimeout(anim(items[i],i),i+1000);        
        }
        var rect1 =this.rect(x-20/2,y-70-20/2,20,20).attr({"fill":'#317cb1','stroke':'#ffffff','stroke-width':"1",'opacity':0.8})
         if (!rightmask){
           var rect2 =this.rect(x+70-20/2,y-20/2,20,20).attr({"fill":'#ffe157','stroke':'#ffffff','stroke-width':"1",'opacity':0.8})
         }
       	var rect3 =this.rect(x-20/2,y+70-20/2,20,20).attr({"fill":'#72ffec','stroke':'#ffffff','stroke-width':"1",'opacity':0.8})
        if (!leftmask){
        var rect4 =this.rect(x-70-20/2,y-20/2,20,20).attr({"fill":'#ff3327','stroke':'#ffffff','stroke-width':"1",'opacity':0.8})
        }  
    }