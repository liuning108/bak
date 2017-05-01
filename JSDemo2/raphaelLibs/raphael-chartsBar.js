

Raphael.fn.chartsBar = function(config){
	  if (!config)config={};
	  var x = config.x||0;
    var y = config.y||0;
    var item_width=config.w||25;
    var item_high=config.h||5
    var post_array_y=config.array_y||[0,55,105,160,160+54,160+54+54];
    var post_array_x=[9,9,9,9,9,3]

    var stylebar={'fill':'#35e1fd','opacity':0.4,'stroke_width':0}
    var stylebar2={'fill':'#35e1fd','opacity':0.2,'stroke_width':0}
    var stylebar3={'fill':'red','opacity':1,'stroke_width':0}
    
      var groups=this.set();
    	var items=this.set();
    for (var j=0;j<post_array_y.length;j++){
         var group=this.set();
   	 for (var i =0 ;i<post_array_x[j];i++){
          var item=this.set();
	   	    var step_high=(i*item_high+1)+post_array_y[j];
		      var rect1=this.rect(x, y-step_high, item_width,item_high).attr(stylebar); //mid bar
		      var rect2=this.rect(x-item_width-5, y-2-step_high, item_width+3,item_high).attr(stylebar2);//left bar
	        var rect3=this.rect(x+item_width+3, y-2-step_high, item_width+3,item_high).attr(stylebar2);//right bar
	        item.push(rect1,rect2,rect3);
	        items.push(item);
          group.push(item);
		  }//end of samll for 
		    groups.push(group);
    }//end of big for
      groups[groups.length-1].attr({'fill':'#ff7147'});
     groups[groups.length-2].attr({'fill':'#ffffe3'});
    function setValue(value,max){
     var per = value/max;
     var num = Math.round(items.length*per.toFixed(2));
     var time_space =200;
     function animBar(num){
		     for (var i=0;i<items.length;i++){
		     	   if (i<num){
		     	    items[i][0].animate({'opacity':1},time_space);
		     	    items[i][1].animate({'opacity':0.6},time_space);
		     	    items[i][2].animate({'opacity':0.6},time_space)
		     	  }else{
		     	  	 items[i][0].animate({'opacity':0.4},time_space);
		     	     items[i][1].animate({'opacity':0.2},time_space);
		     	     items[i][2].animate({'opacity':0.2},time_space)
		     	  }
		     } //end of for 
     }//end of animBar
     	animBar(num);
     }//end of  setValue
     return {
     	      'setValue':setValue
     }
     

}  