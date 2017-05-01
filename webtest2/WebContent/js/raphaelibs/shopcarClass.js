   var shopcarFont={'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'};

 function shopcarClass(paper,config){
 	  this.paper  =paper;
 	  this.config =config;
 	  this.elements = [];
 }

 shopcarClass.prototype.add=function(element){
      this.elements[this.elements.length]=element;

 }

 shopcarClass.prototype.animate =function(){
 	var self =this;
 	var last =this.elements[this.elements.length-1];
 	var prelast =this.elements[this.elements.length-2];
 	 if (!prelast){
   		prelast={}
   		prelast.value=0;
   	 }
 	 run=function(data){
      
            last.value=parseInt(data);

             var y =self.config.y
            var limite_max=self.getMax();
          
             limite_max=limite_max+50000;
		    var rate = last.value/limite_max;
		    var rate_text = Math.round( last.value/10000,2)+"w";
		     var high = self.config.item_high*rate;
		     var highy= self.config.item_high-high;
		     last.y=y+highy;
		  	 last.rect.animate({'y':y+highy,'height':high,'fill-opacity':0.8},400);
		  	 last.headrect.animate({'y':last.y,'height':high/13},400);
              last.lable_title.attr({'text':rate_text});
              last.lable_title.animate({'y':last.y-10},400)

            var x,y,x2,y2,x3,y3;
  	        var  line;
  	        var absnum =Math.abs(last.value-prelast.value);
  	        var rate_absnum =absnum/limite_max;
  	        var rate_absnum_text =Math.round(absnum/10000,2)+"w";
            if (last.value>prelast.value)
		  	 {
		  	 	x = last.x;
		  	    y = last.y;
		  	    	x2=prelast.x;
		  	 	y2=prelast.y;
		  	 	x3=x-self.config.item_width/2;
		  	 	y3=y-30;

		  	 	line=['M',
		  	 	               x+self.config.item_width/2,y-10,
		                       x+self.config.item_width/2,y-30,
		                       x3,y3,
		                       x2+self.config.item_width/2,y2-10
		  	 	             ];
		  	 		
		  	 }else{
		  	 	x=prelast.x;
		  	 	y=prelast.y;
		  	    x2 = last.x;
		  	    y2 = last.y;
		  	    x3= x+self.config.item_width+self.config.item_width/2
		  	 	y3=y-30;

		  	    line=['M',
		  	 	               x+self.config.item_width/2,y-10,
		                       x+self.config.item_width/2,y-30,
		                       x+self.config.item_width+self.config.item_width/2,y3,
		                       x2+self.config.item_width/2,y2-10
		  	 	             ];


		  	 }
            self.line.attr({'path':line});
            self.abstext.attr({'text':rate_absnum_text});
            self.abstext.attr({'y':y3-10});
    }
 	return run;
 }

 shopcarClass.prototype.show= function(data){
	this.config.maxvalue=data.maxvalue||1000;
	this.config.avgval=parseInt(data.avgval);
	 
	var max =parseInt(data.maxvalue);
	 var limite_max=max+50000;
     var rate =max/limite_max;
     var high = this.config.item_high*rate;
     var highy= this.config.item_high-high;
     var rect =this.paper.rect(this.config.x-30,this.config.y+highy,this.config.item_width*5.9,2);
  	 rect.attr({'fill':'#06f5f8','stroke-width':0,'fill-opacity':0.8});
     rect.attr({'fill':'red','stroke-width':0,'fill-opacity':0.8});
     var rate_text = Math.round(data.maxvalue/10000,2)+"w";

     var lable_title = this.paper.text(this.config.x-10,this.config.y+highy-6,rate_text);
     lable_title.attr(shopcarFont);
     lable_title.attr({'font-size':5})
  	  
  	var rate =this.config.avgval/limite_max;
    var high = this.config.item_high*rate;
    var highy= this.config.item_high-high;
    var rect =this.paper.rect(this.config.x-30,this.config.y+highy,this.config.item_width*5.9,2);
 	  rect.attr({'fill':'#46fa68','stroke-width':0,'fill-opacity':0.8});
 	  
 	 var rate_text = Math.round(this.config.avgval/10000,2)+"w";
     var lable_title = this.paper.text(this.config.x-10,this.config.y+highy-7,rate_text);
     lable_title.attr(shopcarFont);
     lable_title.attr({'font-size':5})
  	  
 	for (var i = 0 ; i <this.elements.length;i++){
        this.draw(i,max);
 	}
 	 
 
     var x = this.config.x+(this.elements.length*this.config.item_width)+1;
  	 var y =this.config.y

  	 var last = this.elements[this.elements.length-1];
  	 var prelast = this.elements[this.elements.length-2];
  	 if (!prelast){
  		prelast={}
  		prelast.value=0;
  	 }
     	prelast.value =prelast.value;
  	
  	 var absnum =Math.abs(last.value-prelast.value);
  	 var rate_absnum =absnum/(max+10);
  	 var rate_absnum_text = Math.round(absnum/10000,2)+"w";
  	 var x,y,x2,y2,x3,y3;
  	 var  line;
  	 if (last.value>prelast.value)
  	 {
  	 	x = last.x;
  	    y = last.y;
  	    	x2=prelast.x;
  	 	y2=prelast.y;
  	 	x3= x-this.config.item_width/2;
  	 	y3=y-30;

  	 	line=this.paper.path(['M',
  	 	               x+this.config.item_width/2,y-10,
                       x+this.config.item_width/2,y-30,
                       x3,y3,
                       x2+this.config.item_width/2,y2-10
  	 	             ]);
  	 	x3+=this.config.item_width/2
  	 	y3=y-40;
  	 		
  	 }else{
  	 	x=prelast.x;
  	 	y=prelast.y;
  	    x2 = last.x;
  	    y2 = last.y;
  	    x3= x+this.config.item_width+this.config.item_width/2
  	 	y3=y-30;
  	    line=this.paper.path(['M',
  	 	               x+this.config.item_width/2,y-10,
                       x+this.config.item_width/2,y-30,
                       x3,y3,
                       x2+this.config.item_width/2,y2-10
  	 	             ]);
  	    x3-=this.config.item_width/2
  	    y3=y-40;
        
  	 }
 
      var abstext= this.paper.text(x3,y3,rate_absnum_text);
      abstext.attr(shopcarFont);
      this.abstext=abstext;



       var todaytext= this.paper.text(last.x+this.config.item_width/2,last.y+70,'今天');
       todaytext.attr(shopcarFont);
        line.attr({'stroke-width':1,'stroke':'yellow'});
        this.line=line;
    
 }


  shopcarClass.prototype.draw=function(index,max){

  	 var element=this.elements[index]
  	 var paper =this.paper;
  	 var x = this.config.x+(index*this.config.item_width)+1;
  	 var y =this.config.y
     var limite_max=max+50000;
     var rate = element.value/limite_max;
     var high = this.config.item_high*rate;
     var highy= this.config.item_high-high;
  	 var rect =paper.rect(x,y+highy,this.config.item_width,high);
  	 if (index%2==0){
  	    rect.attr({'fill':'#202d2e','stroke-width':0,'fill-opacity':0.8});
      }else{
        rect.attr({'fill':'#1a2425','stroke-width':0,'fill-opacity':0.8});
      }
      element.x=x;
      element.y=y+highy;
      element.rect=rect;


  	 var rect =paper.rect(x,y+highy,this.config.item_width,high/13);
  	   element.headrect=rect;
  	 rect.attr({'fill':'#fbff00','stroke-width':0,'fill-opacity':1});
  	 var rate2 = element.value/max;
  //	 var rate_text =Math.round(rate2*100)+"%";
	 var rate_text = Math.round(element.value/10000,2)+"w";
     var lable_title = paper.text(x+this.config.item_width/2,y+highy-10,rate_text);
     lable_title.attr(shopcarFont);

     element.lable_title=lable_title;

  }


 shopcarClass.prototype.getMax= function(){
    var max =this.config.maxvalue||0;
 	
 	return parseInt(max);
 }