var GSingleListNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 2;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				var kpi =new sumkpi(paper,{
	                'currentvalue':340,
	                'rate':0.05,
	                'nums':19,
	                'item_high':5,
	                'x':20,
	                'y':0,
	                'item_width':50,
	                'space_high':15,
	                'fill':'#00b7ee'

	             });
				kpi.show();
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});