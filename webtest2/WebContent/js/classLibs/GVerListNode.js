var GVerListNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 3;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				var listbar =paper.chartsListBar({
                    'x':this.options.gx ,'y':20,
                    'keys':['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港']
                   });
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});