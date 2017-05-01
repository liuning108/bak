var GCirclePerTopNode=GNode.extend({
	//计算属性值 
	update : function() {
		this.options.gx=this.options.w/2;
		this.options.gy=this.options.h/2;
		this.options.gr=this.options.w/2;
	},
	//画画
	draw : function() {	
		  var paper=this.elements.paper;
		  var x= this.options.gx;
		  var y=this.options.gy;
		  var r=this.options.gr;
		  var set=paper.set();
    	  var c1=this.createCirclePerTop(paper,x,y,r,[0.14,0.07,0.14,0.11,0.2,0.2],4,"#5debec",360,6000)
    	  var c2=this.createCirclePerTop(paper,x,y,r-9,[0.5,0.4],4,"#5debec",-360,6000);
    	  var c3=this.createCirclePerTop(paper,x,y,r-9-10,[0.1,0.15,0.15,0.3,0.15],4,"#5debec",360,5000);
    	  var c4=this.createCirclePerTop(paper,x,y,r-9-9-11,[0.1,0.15,0.15,0.2,0.15],4,"#5debec",-360,6000);
    	  set.push(c1);
    	  set.push(c2);
    	  set.push(c3);
    	  set.push(c4); 
    	  this.chartsVal=paper.chartsNumbser({'x':x,'y':y,'value':0,
              attrs: {'fill':"#ffffff",'font-size':32,'font-family': '微软雅黑','font-weight':'bold'}
             });
    	  this.getData();
    	  
	},
    resize:function(){
        this.initElement();
    },
  
 // 配置页面功能
	pageConfig : function($pageHtml) {
		//datasource
		var self =this;
		var $datasourceUrl=$pageHtml.find("#datasource_url");
		var $datasource_method=$pageHtml.find("#datasource_method");
		var $testingContext=$pageHtml.find("#testingContext");
		var $datasource_time=$pageHtml.find("#datasource_time");
		var $datasource_value=$pageHtml.find("#datasource_value");
		var $testingContext= $pageHtml.find("#testingContext");
		$datasourceUrl.val(self.options.datasource.url)
		$datasource_method.val(self.options.datasource.method)
		$datasource_time.val(self.options.datasource.time||6);
		$datasource_value.val(self.options.datasource.value);
		$pageHtml.find("#testingContext").hide();
		$pageHtml.find("#testing").on("click",function(){
			var url=$datasourceUrl.val();
			var method=$datasource_method.val();
			$.ajax({
				  type: "POST",
				  url: "rest/httpclient/ajax",
				  data: JSON.stringify({"url":url,"method":method}),
				  success: function(data){
					  $testingContext.show();
					  $testingContext.text(JSON.stringify(data));
				  },
				  error:function(XMLHttpRequest, textStatus, errorThrown){
					alert("error"+XMLHttpRequest.status);  
				  },
				  contentType: "application/json",
				});
			
		})
		$pageHtml.find("#oksure").on('click',function(){
			self.options.datasource.url=$datasourceUrl.val();
			self.options.datasource.method=$datasource_method.val();
			self.options.datasource.time=parseInt($datasource_time.val());
			if(isNaN(self.options.datasource.time)){
				self.options.datasource.time=6;
			}
			self.options.datasource.value=$datasource_value.val();
			alert("配置成功")
			self.getData();
		})
		
		
		//end of datasource 
				
	},
	 getData:function(){
		   var self=this;
		   if (!this.options.datasource)return ;
		   if(this.options.datasource.url){
			   var url=this.options.datasource.url;
			   var method=this.options.datasource.method;
			   
			   until.ajax(url,method,function(data){
				   if(self.options.datasource.value){
					   var value=parseInt(data[self.options.datasource.value]);
					   self.chartsVal.setValue(value);
				   }
			   },function(XMLHttpRequest, textStatus, errorThrown){
				   alert("出错");
			   })
		   }
		   if(this.options.datasource.time){
		    setTimeout(function(){self.getData()},this.options.datasource.time*1000)
		   }
	   },
	//创建 动态圆
	createCirclePerTop:function(paper,x,y,r,ang,w,color,deg,speed){
		  var circlePath= until.getCircleToPath(x,y,r)
		  var p=paper.path(circlePath).attr({'fill':'none','stroke-width':1,'stroke':"none"})
		          var totalLength = p.getTotalLength();
		         var set= paper.set();
		          var start=0;
		          var end=0;
		         for (var i=0;i<ang.length;i++){
		             end=start+totalLength*ang[i];
		            var subPath=p.getSubpath(start,end);
		            var p2=paper.path(subPath).attr({'fill':'none','stroke-width':w,'stroke':color,"opacity":1})
		            start=end+10;
		            set.push(p2)
		         }
		          var anim = Raphael.animation({ "transform": ['t',0,0,'r',deg,x,y]}, speed);
		        set.animate(anim.repeat(Infinity));
		         return set;
		}
	
});