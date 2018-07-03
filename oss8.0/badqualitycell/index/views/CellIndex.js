/**
oss_core/pm/badqualitycell/index/views/CellIndex.js
**/
﻿portal.define([
	"oss_core/pm/badqualitycell/index/views/echarts.min",
	"oss_core/pm/badqualitycell/index/views/dataTool",
	'text!oss_core/pm/badqualitycell/index/templates/cellindex.html',
	"oss_core/pm/badqualitycell/index/views/CellPanel",
	"oss_core/pm/badqualitycell/index/actions/DB",
	"oss_core/pm/badqualitycell/index/actions/DB1",
	'text!oss_core/pm/badqualitycell/index/templates/cellTopNItem.html',
	'css!oss_core/pm/badqualitycell/index/css/badqualitycell.css'
],function(echarts,dataTool,tpl,CellPanel,DB,DB2,cellTopNItemTpl){
	return portal.BaseView.extend({
		template: fish.compile(tpl),
		cellTopTpl:fish.compile(cellTopNItemTpl),
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
			this.initDate();
      this.initPanels();
			this.pieChart();
			this.lineChart();
			this.topList();
		},
		topList:function() {
			var self =this;
		  this.$el.find('.topListTitle').text( DB2.topTitle );
			var context =this.$el.find('.TOPN')

			context.slimscroll({
				height: '390px',  	//取其父元素高度作为滚动高度；默认为250px		
	  	});

			fish.each(DB2.topList,function(d){
				 var per = d.value/100;
				 d.size =50+ 100*per;
				 var green="#5cb85c";
				 var blue="#64d1f1";
				 var red ="#d75452";
				 var color =green;
				 if(d.value>=60 && d.value<=80){
					 color=blue;
				 }
				 if(d.value<60){
					 color=red;
				 }
				 d.color=color;
				context.append(self.cellTopTpl(d));
			})

		},
		lineChart:function(){
			this.$el.find('.lineTitle').text( DB2.lineChart.title );
			this.chart = echarts.init(this.$el.find('.linechart')[0]);
			var legendNames=fish.map(DB2.pieChart.datas,function(d){
				return d.name
			});

			var series=fish.map(DB2.lineChart.datas,function(d){
				return {
						name:d.name,
						type:'line',
						data:d.datas,
						itemStyle : {
									normal : {
										color:d.color,
										lineStyle:{
											color:d.color
										}
									}
								}
				}
			});
			var option = {
						grid: {
								 left: '1%',
				         right: '4%',
								 top:'2%',
				         bottom: '25%',
				         containLabel: true
						},
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			         type: 'scroll',
					orient: 'vertical',
					right: 0,
					top: 2,
			        data:legendNames,
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: DB2.lineChart.xAxisDatas
			    },
			    yAxis: {
			        type: 'value'
			    },
			    colors:['#e54d43', '#39ca74','#3a99d8'],
			    "series": series
			};
			console.log(series);
			this.chart.setOption(option)
		},
		pieChart:function(){
			this.$el.find('.pieTitle').text( DB2.pieChart.title );
        this.chart = echarts.init(this.$el.find('.piechart')[0]);
				var legendNames=fish.map(DB2.pieChart.datas,function(d){
          return d.name
				});
				var option = {
					    tooltip : {
					        trigger: 'item',
					        formatter: "{b} : {c} ({d}%)"
					    },
					    legend: {
					        type: 'scroll',
					        orient: 'vertical',
					        right: -10,
					        top: 2,
					        // bottom: 20,
					        data: legendNames,

					    },
						 color:DB2.pieChart.colors,
			    	 series : [
			        {
			            name: '',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '45%'],
			            data: DB2.pieChart.datas,
									labelLine:{
											normal:{
												show: false
											}
									},
									label:{
										normal:{
											show: false
										}
									},
			            itemStyle: {
									    emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
			  this.chart.setOption(option)

		},
		initPanels:function() {
			console.log(DB);

			this.p1 = new CellPanel({
				   el:this.$el.find('.p1'),
					 db:DB.p1,
			})
			this.p1.render();

			this.p2 = new CellPanel({
					 el:this.$el.find('.p2'),
					 db:DB.p2,
			})
			this.p2.render();

			this.p3 = new CellPanel({
					 el:this.$el.find('.p3'),
					 db:DB.p3,
			})
			this.p3.render();

			this.p4 = new CellPanel({
					 el:this.$el.find('.p4'),
					 db:DB.p4,
			})
			this.p4.render();

			this.p5 = new CellPanel({
					 el:this.$el.find('.p5'),
					 db:DB.p5,
			})
			this.p5.render();

			this.p6 = new CellPanel({
					 el:this.$el.find('.p6'),
					 db:DB.p6,
			})
			this.p6.render();

			this.p7= new CellPanel({
					 el:this.$el.find('.p7'),
					 db:DB.p7,
			})
			this.p7.render();

			this.p8= new CellPanel({
					 el:this.$el.find('.p8'),
					 db:DB.p8,
			})
			this.p8.render();

			this.p9= new CellPanel({
					 el:this.$el.find('.p9'),
					 db:DB.p9,
			})
			this.p9.render();

			this.p10= new CellPanel({
					 el:this.$el.find('.p10'),
					 db:DB.p10,
			})
			this.p10.render();

			this.p11= new CellPanel({
					 el:this.$el.find('.p11'),
					 db:DB.p11,
			})
			this.p11.render();

			this.pzf= new CellPanel({
					 el:this.$el.find('.pzf'),
					 db:DB.pzf,
			})
			this.pzf.render();


			this.all= new CellPanel({
					 el:this.$el.find('.all'),
					 db:DB2.all,
					'blueStyle':true,
			})
			this.all.render();

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


	});
});
