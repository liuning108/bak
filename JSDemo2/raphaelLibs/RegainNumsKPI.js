function  RegainNumsKPI(paper,config){
	this.paper=paper;
	this.elements = [];
	this.config=config;
}

RegainNumsKPI.prototype.add= function(element){
	this.elements[this.elements.length]=element;
}

RegainNumsKPI.prototype.show=function(){
	for (var index= 0 ;index<this.elements.length;index++){
        this.darwElem(index);
  	}
}

RegainNumsKPI.prototype.animate=function(){
     for (var index= 0 ;index<this.elements.length;index++){
     	     var  elem_config =this.elements[index]
     	     elem_config.value=Math.floor(Math.random() * (20 +100));
     }
     for (var index= 0 ;index<this.elements.length;index++){
     	    var  elem_config =this.elements[index]
			    var supmax =this.max()+20;
			  	var  per= Math.floor(elem_config.value/supmax*100);
			    var  shownums= Math.round(this.config.nums*per*0.01);
			    elem_config.eleValue.attr({'text': elem_config.value})
			    for (var i = 0;i<this.config.nums;i++){
			        var rect =elem_config.arrayRects[i];

			        if(elem_config.value>=this.config.error){
        	    	  rect.animate({'fill':'#fb4848'})
        	         }else if (elem_config.value>=this.config.waring){
        	    	  rect.animate({'fill':'#f0f465'})
        	         }else{
        	         	rect.animate({'fill':'#83e6fc'})
        	         }
			        if (i>shownums){
                 rect.animate({'fill-opacity':0.2},400);
        	    }else{
        	         	rect.animate({'fill-opacity':1},400);
        	    }

			    }
         }
}

RegainNumsKPI.prototype.darwElem=function(index){
		var paper = this.paper;
        var elementConfig=this.elements[index];
        var elementy=this.config.y+(index*23.5);
        var eleText =paper.text(this.config.x,elementy,elementConfig.name);
        eleText.attr(global_config.default_font);
        eleText.attr('font-size',18);
        var x =this.config.x+15;
        var y = elementy-8;
        var supmax =this.max()+20;
        var  per= Math.floor(elementConfig.value/supmax*100);
        var  shownums= Math.round(this.config.nums*per*0.01);
        var width = Math.floor((this.config.nums_width)/this.config.nums);
        elementConfig.arrayRects = [];
        for (var i = 0;i<this.config.nums;i++){
        	var rect = paper.rect(x+((i+1)*14.4),y,width,20,2);
        	    rect.attr({'fill':'#83e6fc','stroke-width':0})
        	    if(elementConfig.value>=this.config.error){
        	    	rect.attr({'fill':'#fb4848'})
        	    }else if (elementConfig.value>=this.config.waring){
        	    	rect.attr({'fill':'#f0f465'})
        	    }
        	    if (i>shownums){
                  rect.attr({'fill-opacity':0.4});
        	    }
        	    elementConfig.arrayRects.push(rect);

	        }

	    var valuex =(this.config.x+20)+(this.config.nums)*14.4+20;
        var eleValue =paper.text(valuex,y+10,elementConfig.value);
           eleValue.attr(global_config.default_font);
           eleValue.attr({'fill':'#FFFFFF'});
          eleValue.attr('font-size',18);
          elementConfig.eleValue=eleValue;
}

RegainNumsKPI.prototype.max=function(){
	var max=0;
	for (var index= 0 ;index<this.elements.length;index++){
	    var value = this.elements[index].value;
	    if (value>max){
	    	max = value;
	    }

  	}
  	return max;
}