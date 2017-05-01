var GLanListNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 3;
				this.options.gy = this.options.h / 2;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				function fRandomBy(under, over){ 
				     return parseInt(Math.random()*(over-under+1) + under); 
				} 
				function createLineBar(){
					   var names=['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港'];
					   var  datas=[];
					    for (var i=0;i<names.length;i++){
					        
					        datas.push({
					              name:names[i],
					              value:fRandomBy(10,100)
					        })
					        }
					    
					    return datas;
					}
				var top1= paper.areaLineBar({
                    'keys':['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港'],
                     'x':10,
                     'y':10,
                     'waring':[40,70,90]
                 });
				 function readValue(){
				      var datas=createLineBar();
				           top1.inputData(datas);
				           setTimeout(function(){
				             readValue();
				          },6000); 
				        }
				        readValue();
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		   

		
		});