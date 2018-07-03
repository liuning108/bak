portal.define([
'text!oss_core/pm/badqualitycell/index/templates/cellpanel.html',
"oss_core/pm/badqualitycell/index/views/echarts.min",
],function(tpl,echarts){
    var CellPanel = function(props){
       this.$el=$(props.el);
       this.tpl = fish.compile(tpl);
       this.props = props;
    }
    CellPanel.prototype.render=function(){
       this.remove();
       var style =(this.props.blueStyle?"blueStyle":"");
       //var style=this.props.blueStyle?"blueStyle","";
       this.$el.html(this.tpl({d:this.props.db,"style":style}));
       this.afterRender();
    }
    CellPanel.prototype.afterRender=function(){
      var self =this;
       var Linedatas =self.props.db.data
       var LinedataAxis=[];
       var areaStyle="#eaf5fb";
       var lineColor="#cde6f7"
       if(this.props.blueStyle){
         lineColor='#2a79b9'
         areaStyle='#3496cc'
       };

       for(var i =0;i<Linedatas.length;i++){
         LinedataAxis.push(i);
       }
       var max =fish.max(Linedatas);
       var maxNum=max+(max*0.3)
      this.chart = echarts.init(this.$el.find('.topKpiCanvas')[0]);
      this.chart.setOption({
                    grid: {
                        x: '0',
                        y: '0',
                        x2: '0',
                        y2: '0'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data:['']
                    },
                    toolbox: {
                        show: false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            show: false,
                            type : 'category',
                            boundaryGap : false,
                            data : LinedataAxis
                        }
                    ],
                    yAxis : [
                        {
                            show: false,
                            type : 'value',
                            max:maxNum

                        }
                    ],
                    tooltip: {
  					            formatter: function (param) {
                          return false;
                        }
                      },

                    series : [
                        {
                            name:'预购',
                            type:'line',
                            smooth:false,
                            symbol:'none',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        color: lineColor,
                                        type: 'solid',
                                        width: 4
                                    },
                                    areaStyle: {
                                        type: 'default',
                                        color: areaStyle
                                    }
                                }
                            },
                            data:Linedatas
                        }
                    ]
                }
            );

    }
    CellPanel.prototype.remove=function(){
      this.$el.html("");
    }
    return CellPanel;
})
