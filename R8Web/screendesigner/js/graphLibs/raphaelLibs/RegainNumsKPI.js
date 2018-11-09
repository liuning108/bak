function  RegainNumsKPI(paper,config){
	this.paper=paper;
	this.elements = [];
	this.config=config;
	console.log("RegainNumsKPI");
	console.log(config);
	this.set=paper.set();
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
        	    	  rect.animate({'fill':this.config.barColor})
        	         }else if (elem_config.value>=this.config.waring){
        	    	  rect.animate({'fill':this.config.barColor})
        	         }else{
        	         	rect.animate({'fill':this.config.barColor})
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
        var self=this;
		var paper = this.paper;
        var elementConfig=this.elements[index];
        var elementy=this.config.y+(index*23.5);
        var eleText =paper.text(this.config.x,elementy,elementConfig.name);
        self.set.push(eleText);
        eleText.attr({'fill':this.config.chartColor,'font-size':25,'font-family': '微软雅黑','font-weight':'bold'});
        eleText.attr('font-size',18);
        var x =this.config.x+this.config.ww;
		var y = elementy-8;
        var supmax =this.max()+20;
        var  per= Math.floor(elementConfig.value/supmax*100);
        var  shownums= Math.round(this.config.nums*per*0.01);
        var width = Math.floor((this.config.nums_width)/this.config.nums);
        elementConfig.arrayRects = [];
		var lastRect = null;
        for (var i = 0;i<this.config.nums;i+=this.config.step){
        	var rect = paper.rect(x+((i+1)*14.4),y,width,20,2);
			self.set.push(rect);
        	    rect.attr({'fill':this.config.barColor,'stroke-width':0})
        	    // if(elementConfig.value>=this.config.error){
        	    // 	rect.attr({'fill':this.config.barColor})
        	    // }else if (elementConfig.value>=this.config.waring){
        	    // 	rect.attr({'fill':this.config.barColor})
        	    // }
        	    if (i>shownums){
                  rect.attr({'fill-opacity':0.4});
        	    }
        	    elementConfig.arrayRects.push(rect);
				lastRect =rect;

	        }
        var lastRectBox =lastRect.getBBox(true);
	    var valuex =lastRectBox.x+lastRectBox.width+40;
        var eleValue =paper.text(valuex,y+10,elementConfig.value);
		self.set.push(eleValue);
           eleValue.attr({'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'});
           eleValue.attr({'fill':this.config.valueColor});
          eleValue.attr('font-size',18);
          elementConfig.eleValue=eleValue;
}

RegainNumsKPI.prototype.allitem=function(){
	return this.set;
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
