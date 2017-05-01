var Top2= function(){
	
}
Top2.prototype.init=function (id) {
	 var dom=id.find('.canvas');
	   // 基于准备好的dom，初始化echarts实例
	 this.myChart = echarts.init(dom.get(0));
   
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '标题'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    this.myChart.setOption(option);	
} // init of end
Top2.prototype.resize=function(){
	this.myChart.resize()
}
