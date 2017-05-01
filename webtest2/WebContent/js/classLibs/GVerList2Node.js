var GVerList2Node = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 10;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				var regainNumsKPI = new RegainNumsKPI(paper,{
			         'x':this.options.gx,
			     'y':10,
			      nums_width:100,
			      nums:19,
			      waring:80,
			      error:100,
			   });
				regainNumsKPI.add({
                    'name':'南京',
                     'value':60
                  });

				regainNumsKPI.add({
				                    'name':'无锡',
				                     'value':19
				                  });
				
				
				regainNumsKPI.add({
				                    'name':'徐州',
				                     'value':75
				                  });
				
				regainNumsKPI.add({
				                    'name':'常州',
				                     'value':53
				                  });
				
				regainNumsKPI.add({
				                    'name':'苏州',
				                     'value':35
				                  });
				regainNumsKPI.add({
				                    'name':'南通',
				                     'value':35
				                  });
				
				regainNumsKPI.add({
				                    'name':'连云港',
				                     'value':55
				                  });
				
				regainNumsKPI.add({
				                    'name':'淮安',
				                     'value':56
				                  });
				
				 regainNumsKPI.add({
				                    'name':'盐城',
				                     'value':63
				                  });
				
				  regainNumsKPI.add({
				                    'name':'扬州',
				                     'value':80
				                  });
				
				  regainNumsKPI.add({
				                    'name':'镇江',
				                     'value':52
				                  });
				
				  regainNumsKPI.add({
				                    'name':'泰州',
				                     'value':63
				                  });
				
				  regainNumsKPI.add({
				                    'name':'宿迁',
				                     'value':30
				                  });
				regainNumsKPI.show();
				
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});