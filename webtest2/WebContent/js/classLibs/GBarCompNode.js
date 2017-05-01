var GBarCompNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 2;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				var shopConfig ={
				           'x':30,
				            'y':10,
				           'item_high':310,
				          'item_width':45,
				       }
				 var shopcarkpi  = new shopcarClass(paper,shopConfig);
			      shopcarkpi.add({value:95*10000});
			      shopcarkpi.add({value:65*10000});
			      shopcarkpi.add({value:115*10000});
			      shopcarkpi.add({value:55*10000});
			      shopcarkpi.add({value:22*10000});
			  var avgmaxdata={'maxvalue':115*10000,'avgval':70*10000}
			      shopcarkpi.show(avgmaxdata);
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});