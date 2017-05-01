var GDoubleListNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 2;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				 var  loadNumber = new  todayLoadNumberClass(paper,{
			            'x':30,
			            'y':10,
			            'element_width':180,
			            'element_high':24,
			            'element_distance':26

			        });
				 loadNumber.add({
			           'name':'南京',
			           'value_3g':42,
			           'value_4g':62
			        })

			        loadNumber.add({
			           'name':'无锡',
			           'value_3g':39,
			           'value_4g':49
			        })


			        loadNumber.add({
			           'name':'徐州',
			           'value_3g':22,
			           'value_4g':33
			        })

			        loadNumber.add({
			           'name':'常州',
			           'value_3g':47,
			           'value_4g':99
			        })


			        loadNumber.add({
			           'name':'苏州',
			           'value_3g':46,
			           'value_4g':55
			        })

			         loadNumber.add({
			           'name':'南通',
			           'value_3g':33,
			           'value_4g':38
			        })

			        loadNumber.add({
			           'name':'连云港',
			           'value_3g':20,
			           'value_4g':44
			        })

			         loadNumber.add({
			           'name':'淮安',
			           'value_3g':55,
			           'value_4g':56
			        })



			          loadNumber.add({
			           'name':'盐城',
			           'value_3g':55,
			           'value_4g':36
			        })

			           loadNumber.add({
			           'name':'扬州',
			           'value_3g':22,
			           'value_4g':43
			          })

			          loadNumber.add({
			           'name':'镇江',
			           'value_3g':33,
			           'value_4g':45
			          })
			          loadNumber.add({
			           'name':'泰州',
			           'value_3g':25,
			           'value_4g':33
			          })
			            loadNumber.add({
			           'name':'宿迁',
			           'value_3g':30,
			           'value_4g':40
			        })
			        loadNumber.show();
		         loadNumber.animate();
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});