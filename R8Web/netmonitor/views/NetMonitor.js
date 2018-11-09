portal.define([
	"oss_core/pm/netmonitor/views/echarts.min",
"oss_core/pm/netmonitor/views/dataTool",
	"oss_core/pm/netmonitor/actions/DB",
	"oss_core/pm/netmonitor/actions/DB2",
	"oss_core/pm/netmonitor/views/NetPanelView",
	"oss_core/pm/netmonitor/views/TiprogressView",
	'text!oss_core/pm/netmonitor/templates/NetMonitor.html',
	'css!oss_core/pm/netmonitor/css/netM.css'

],function(echarts,dataTool,DB,DB2,NetPanelView,TiprogressView,tpl){
	return portal.BaseView.extend({
		template: fish.compile(tpl),
		i18nData: fish.extend({}),
		events: {
		},
		initialize: function(options) {

		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		afterRender: function(){

			var self =this;
			this.initDate();
			var p1 =new NetPanelView({
				 'el':this.$el.find('.p1'),
				 'data':DB.p1,
				 'cd':this.cdate,
			});
			p1.render();

			var p2 =new NetPanelView({
				 'el':this.$el.find('.p2'),
				 'data':DB.p2,
				 'cd':this.cdate,
			});
			p2.render();

			var p3 =new NetPanelView({
				 'el':this.$el.find('.p3'),
				 'data':DB.p3,
				 'cd':this.cdate,
			});
			p3.render();

			var p4 =new NetPanelView({
				 'el':this.$el.find('.p4'),
				 'data':DB.p4,
				 'cd':this.cdate,
			});
			p4.render();


			var t1 =new TiprogressView({
				 'el':this.$el.find('.t1'),
				 'data':DB2.t1,
				 'cd':this.cdate,
			});
			t1.render();

			var t2 =new TiprogressView({
				 'el':this.$el.find('.t2'),
				 'data':DB2.t2,
				 'cd':this.cdate,
			});
			t2.render();

			var t3 =new TiprogressView({
				 'el':this.$el.find('.t3'),
				 'data':DB2.t3,
				 'cd':this.cdate,
			});
			t3.render();

			var t4 =new TiprogressView({
				 'el':this.$el.find('.t4'),
				 'data':DB2.t4,
				 'cd':this.cdate,
			});
			t4.render();

			var t5 =new TiprogressView({
				 'el':this.$el.find('.t5'),
				 'data':DB2.t5,
				 'cd':this.cdate,
			});
			t5.render();

			var t6 =new TiprogressView({
				 'el':this.$el.find('.t6'),
				 'data':DB2.t6,
				 'cd':this.cdate,
			});
			t6.render();
      this.initEchartG();

		},
		initDate:function(){
			this.cdate=this.$el.find('.netChooseDate').datetimepicker({
	        buttonIcon: '',
					viewType: "date",
	        changeDate: function (e, value) {
	            var $this = $(this);
	            $this.find('.timeShow').text($this.val());
	        }
	    });
			var date = new Date();
			this.cdate.datetimepicker("value", date);
		},
		initEchartG:function(){
			var myChart = echarts.init(this.$el.find('.echatG')[0]);
			$.get("oss_core/pm/netmonitor/actions/gexf.xml",function(xml) {
				var graph = echarts.dataTool.gexf.parse(xml);
				console.log(graph);
	    var categories = [
	         {name: '告警'},
	         {name: '正常'},
	         {name: '违例'}
	    ];
	    var i=0;
			var r=1000;
	    graph.nodes.forEach(function (node) {
	        node.itemStyle = null;
	        node.value = node.symbolSize;
	        node.symbolSize = (node.value/100)*r
	        node.label = {
	            normal: {
	                show:  false,//node.symbolSize > 30
	            }
	        };
					node.category = node.attributes.modularity_class;
	    });
	    option = {
	        title: {
	            text: '',
	            subtext: '',
	            top: 'bottom',
	            left: 'right'
	        },
	        tooltip: {},
	        color:['#bc322e','#3fb27e','#ca8723'],
	        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            }),
             x : "center",
             y : "bottom"
        }],
	        animationDuration: 1500,
	        animationEasingUpdate: 'quinticInOut',
	        series : [
	            {
	                name: '',
	                type: 'graph',
	                layout: 'none',
									width:440,
	                data: graph.nodes,
	                links: graph.links,
	                categories: categories,
	                roam: false,
	                focusNodeAdjacency: true,
	                itemStyle: {
	                    normal: {
	                        borderColor: '#fff',
	                        borderWidth: 1,
	                        shadowBlur: 10,
	                        shadowColor: 'rgba(0, 0, 0, 0.3)'
	                    }
	                },
	                label: {
	                    position: 'left',
	                    formatter: '{b}'
	                },
									tooltip: {
					            formatter: function (param) {
											   if(param.dataType=="node"){
					                return param.name + " : " + param.value + "%" ;
												}else{
													console.log(param);
													var s=""
													try {
													 s =graph.nodes[param.data.source].name +"<--->"+graph.nodes[param.data.target].name
													 + " : " + 
													 +' '+graph.nodes[param.data.source].value + '%';
													 return s;
												 }catch(e){
													 return "";
												 }
												}
					            }
					        },
	                lineStyle: {
	                    color: 'source',
	                    curveness: 0.3
	                },
	                emphasis: {
	                    lineStyle: {
	                        width: 10
	                    }
	                }
	            }
	        ]
	    };

	    myChart.setOption(option);
			},'xml')

		}


	});
});
