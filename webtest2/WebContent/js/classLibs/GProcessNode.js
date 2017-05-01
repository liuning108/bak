var GProcessNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 2;
				this.options.gy = this.options.h/1.1;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				function fRandomBy(under, over){ 
				     return parseInt(Math.random()*(over-under+1) + under); 
				} 
				function createDataTop10(){
					  var names=['CRM下单','服务单','资源变更单','流程启动','派单','归档']
					  
					   var  datas=[];
					    for (var i=0;i<names.length;i++){
					        datas.push({
					              name:names[i],
					              value:fRandomBy(30,425)
					        })
					    }
					    return datas;
					}
				
				
				var workflowProcess=paper.chartsProcess({
			           'x':40,
			           'y':this.options.gy,
			           'keys':['CRM下单','服务单','资源变更单','流程启动','派单','归档']
			         })
			         
			         workflowProcess.inputData(createDataTop10());
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		
		});