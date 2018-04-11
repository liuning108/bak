define([
	"modules/portlets/onlinemonitor/actions/OnlineMonitorAction",
	"text!modules/portlets/onlinemonitor/templates/OnlineMonitor.html",
	'frm/fish-desktop/third-party/echarts3/echarts.simple.min'
], function(OnlineAction, tpl, echarts) {
	return portal.BaseView.extend({

		render: function() {
			this.setElement(tpl);
		},
        afterRender: function() {
        	this.header.find("input").datetimepicker({
	        	changeDate: function (e, value) {
	                console.log("changeDate:" + value.date);
	            }
	        });
        	setTimeout( $.proxy(this.initChart,this),100);
        },

        initialize : function(){

		},

		titleLine : "<div class='input-group col-sm-4 pull-right'><input name='date'></div>",

		initChart:function(){
		    this.chart = echarts.init(this.$el[0]);
		    this.chartUserNumber = [10,3,5,8,10,15];
		    this.chartTime = ['10:10:00','10:20:00','10:30:00','10:40:00','10:50:00','11:00:00'];
	
		    var option = {
		    	grid : {
		    		x: 20,
		    		x2: 25,
		    		y: 10,
		    		y2: 20
		    	},
		    	color: ['#96e1f3'],
		    	tooltip: {
		    		trigger: 'axis',
		    		position: function(pt) {
		    			return [pt[0], '10%'];
		    		}
		    	},
		    	title: {
		    		textAlign: 'left',
		    		left: 10,
		    		top: 8
		    	},
		    	legend: {
		    		data: ['Online User'],
		    		top: 9
		    	},
		    	xAxis: {
		    		boundaryGap: false,
		    		data: this.chartTime
		    	},
		    	yAxis: {
		    	},
		    	series: [
		    	{
		    		name: 'Online User',
		    		type: 'line',
		    		smooth: true,
		    		itemStyle: {normal: {areaStyle: {type: 'default'}}},
		    		data: this.chartUserNumber
		    	}
		    	]
		    };
		    // 绘制图表
		    this.chart.setOption(option);
		},

		scaleFunc: function (operate) {
			console.log('maximize echarts');
			setTimeout( this.chart.resize,100);
		},

		menuLeave: function () {
			console.log('leave the menu');
		},

		menuEnter: function () {
			console.log('enter the menu');
		}
	});
});
