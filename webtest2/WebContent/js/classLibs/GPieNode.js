var GPieNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 2;
				this.options.gy = this.options.h / 2;
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
				var pie=paper.workflowPie({
	                   'x':this.options.gx,
	                   'y':this.options.gy ,
	                   'r':70,
	                   'listx':this.options.gx-300,
	                   'listy':this.options.gy-190,
	                   modes:[
	                                {name:'CRM下单',color:'#f89d2c'},
	                                {name:'服务单',color:'#f299bd'},
	                                {name:'资源变更单',color:'#e8410e'},
	                                {name:'流程启动',color:'#30cd2f'},
	                                {name:'派单',color:'#dbdb01'},
	                                {name:'归档',color:'#8e228f'},
	                                
	                             ]
	             });
				 pie.inputData(createDataTop10());
				
				
			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
		
		});