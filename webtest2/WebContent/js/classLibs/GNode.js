/*!
 *   GNode.js
 *   所有图表的父类，所有子图表继承它
 *   2017-3-5  刘宁 
 *     
 */
var GNode = Class.extend({
	//初始图表大小,并在画布上创建相应的操作Div
	init : function(v_options){	
		/*
		 * 所有图表必有的属性值  
		 *   位置(x,y)
		 *   大小(宽w,高h)
		 */
		
		this.options={
				x:0,
				y:0,
				w:400,
				h:200,
				datasource:{}
		};
		this.elements={};
		this.options.id=until.uuid(); //创建该对像的ID
		this.setOption(v_options);//将默认的图表属性进行修改
		g_dashboard.items[this.options.id]=this;
		console.log(g_dashboard.items);
		g_dashboard.canvasTabsAddItem(this.options.id,this.options.type+"_"+this.options.id);
	    //在画布上创建相对应的图表操作DIV
	    until.modiferAblity(this,g_dashboard);
	 	this.initElement(); //在相应的DIV上，建立画布
 	},//end of init
 	
 	//在相应的DIV上，建立画布
	initElement : function() {
	
	  var dom =this.elements.dom;
	  $(dom).empty();
	  var w =this.options.w;
	  var h =this.options.h;
	  var paper = Raphael(dom, w, h);
	  this.elements.paper=paper; //创建相对应的画笔
	  this.update(); //子类计算相关的属性值 
	  this.draw();   //子类 
	  
	},//end of initElement
 	
	//将默认的图表属性进行修改
 	 setOption : function(v_options) {
 		$.extend(this.options,v_options);
 		if (this.options.w<=0){
 			this.options.w=10;
 		}
 		if (this.options.h<=0){
 			this.options.h=10;
 		}
 	},
 	//删除
 	remove:function(){
 		    g_dashboard.items[this.options.id]=null;
			delete g_dashboard.items[this.options.id];
			this.elements.$dom.remove();
			var removeId='#'+this.options.id;
			g_dashboard.canvasTabsRemoveItem(removeId);
			console.log(g_dashboard.items);
 	}
	
});