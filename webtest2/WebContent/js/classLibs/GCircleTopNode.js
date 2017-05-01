var GCircleTopNode=GNode.extend({
	//计算属性值 
	update : function() {
		this.options.gx=this.options.w/2;
		this.options.gy=this.options.h/2;
		this.options.gr=this.options.h/2.2;
	},
	//画画
	draw : function() {
		  var paper=this.elements.paper;
         // this.gtxt=paper.text(this.options.gx,this.options.gy,"我要在这里画个圆").attr({'fill':"red",'font-size':this.options.gsize,'font-family': '微软雅黑','font-weight':'bold'})
        console.log(this.options.gx+":"+this.options.gy+":"+this.options.gr)
		 var top= this.createCirecleTop(paper,this.options.gx,this.options.gy,this.options.gr);
          top.show();
        
	},
    resize:function(){
      this.initElement();
    },
  
  //配置页面功能 
	pageConfig:function($pageHtml){
	},
	
	createCirecleTop:function(paper,x,y,r,limits){
		 	  var CircleTop=function(x,y,r,limits){
	    	    this.x=x;
	    	    this.y=y;
	    	    this.r=r;
	    	    this.path_left="m 0,0 25.02258,15.63911 4.06616,-2.18948 17.20302,-13.13685 3.75339,-11.26016 -19.70528,-19.39249 -10.00903,1.25112 -56.61357,48.48124 1.87669,136.99859 52.86019,50.35793 12.19851,0.62557 19.39249,-19.3925 -3.12782,-9.38346 -1.87669,-0.31278 -17.20302,-16.26468 -26.58649,13.76242 -29.71431,-24.39701 -1.56391,-124.17452 z";
	    	    this.path_block="m 0,0 24.08423,11.57294 0,21.89475 -6.56843,6.25564 0.62556,30.33988 -3.75338,5.94286 -36.28273,-1.8767 -2.18948,-51.60905 z";
	    	    this.path_block2="m 0,0 37.22108,-1.56391 2.50226,6.25565 -0.62557,29.08874 6.25565,8.44512 0.62556,20.33084 -23.45866,11.57294 -24.70979,-22.20753 z";
	    	    this.path_block3="m 0,0 24.397005,-11.26015 24.08423,22.52031 -2.18947,52.54741 -36.59552,0.93834 -3.440602,-4.69173 1.563911,-31.90378 -7.506772,-7.19399 z";
	    	    this.path_block4="m 0,0 -4.378954,6.25564 1.563911,29.71431 -7.819554,7.81955 0.625564,21.26919 24.397013,11.26016 24.08422,-22.8331 -2.18947,-51.92184 z";
	    	    this.sectorsCount=40;
	    	    this.limits=limits;
	    	  }
	    	  CircleTop.prototype.show=function(){
	    	    var self=this;
	    	    paper.circle(self.x,self.y,self.r).attr({'fill':'none','stroke-width':1,'stroke':'#5ad7d9'});
	    	    paper.circle(self.x,self.y,self.r-29).attr({'fill':'none','stroke-width':1,'stroke':'#5ad7d9'});
	    	    var sectors1_style={stroke: '#08afaf', "stroke-width": 8, "stroke-linecap": "round",'opacity':0.5};
	    	    self.sectors=until.createSectors(paper,self.x,self.y,self.r-13,5,-5,self.sectorsCount,Math.PI*2,-Math.PI,sectors1_style);
	    	    var rsize=self.r-29-29;
	    	    var textLeng="正常".length;
	    	    var textENLeng="NORMAL".length;
	    	    
	    	    self.text=paper.text(x,y+30,"正常").attr({'fill':"#5bf6f6",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
	    	    self.textEN=paper.text(x,y,"NORMAL").attr({'fill':"#5bf6f6",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})
	    	    return self;
	    	  }

	    	  CircleTop.prototype.setValue=function (value){
	    	     var self=this;
	    	     self.text.remove();
	    	      self.textEN.remove();
	    	    if (value>=self.limits[0]){
	    	       self.sectors.animate({'stroke':'#f64836'},1000); 
	    	          self.text=paper.text(x,y+30,"紧急").attr({'fill':"#f64836",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
	    	      self.textEN=paper.text(x,y,"URGENCY").attr({'fill':"#f64836",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

	    	       return;
	    	    }else if (value>=self.limits[1]){
	    	      self.sectors.animate({'stroke':'#f7fe36'},1000);
	    	      self.text=paper.text(x,y+30,"警告").attr({'fill':"#f7fe36",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
	    	      self.textEN=paper.text(x,y,"WARNING").attr({'fill':"#f7fe36",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

	    	        return;
	    	    }else{
	    	      self.sectors.animate({'stroke':'#08afaf'},1000);

	    	      self.text=paper.text(x,y+30,"正常").attr({'fill':"#5bf6f6",'font-size':22,'font-family': '微软雅黑','font-weight':'bold'})
	    	      self.textEN=paper.text(x,y,"NORMAL").attr({'fill':"#5bf6f6",'font-size':30,'font-family': '微软雅黑','font-weight':'bold'})

	    	        return;
	    	    }

	    	  }

	    	  return new CircleTop(x,y,r,limits);
	}
    
    
   
    
    
    
    
});