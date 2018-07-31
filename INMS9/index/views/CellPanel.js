portal.define([
'text!oss_core/pm/badqualitycell/index/templates/cellpanel.html',
"oss_core/pm/badqualitycell/index/views/echarts.min",
],function(tpl,echarts){
    var CellPanel = function(props){
       this.$el=$(props.el);
       this.tpl = fish.compile(tpl);
       this.props = props;
       this.id=fish.getUUID();
       this.$tpl=null;
    }
    CellPanel.prototype.render=function(){
       this.remove();
       var style =(this.props.blueStyle?"blueStyle":"");
       //var style=this.props.blueStyle?"blueStyle","";
       this.$el.html(this.tpl({d:this.props.db,"style":style}));
       this.afterRender();
    }
    CellPanel.prototype.initEvents=function() {

       var self =this;
       this.$el.on('click',function(){
        if(self.props.blueStyle)return;
         var id="cellPanelDeaily"
         if(self.$tpl ===null){
            self.$tpl = $("<div class='container-fluid'>").data({menuId: false, menuUrl: '', privCode: '', menuName: '', menuType: ''}).attr({menuId: false, menuUrl: null});
         }
         $("#divContent").tabs("option", "panelTemplate", self.$tpl).tabs("add", {
             active: true,
             id: self.id,
             label:self.props.db.title+"质差详情"
         });
          //alert(self.$tpl.height());v
          require([
             "oss_core/pm/badqualitycell/detail/views/BadQualityCellDetail"
           ], function (Dialog) {
               var sData = {
                  el:self.$tpl,
                  //cellID:null,
                  STTIME:self.props.db.STTIME,
                  CITYKEY:self.props.db.areaID
               };
               var dialog = new Dialog(sData);
               var content = dialog.render();
           });
       })
    },
    CellPanel.prototype.afterRender=function(){
      this.initEvents();
      var self =this;
console.log(" CellPanel afterRender",self.props);
       var Linedatas =self.props.db.data
       var LinedataAxis=[];
       var areaStyle="#eaf5fb";
       var lineColor="#eaf5fb";
        if(self.props.db.c){
           areaStyle=self.props.db.c.areaStyle
           lineColor=self.props.db.c.lineColor
        }
         if(this.props.blueStyle){
           lineColor='#2a79b9'
           areaStyle='#3496cc'
         };

       for(var i =0;i<Linedatas.length;i++){
         LinedataAxis.push(i);
       }
       var max =fish.max(Linedatas);
       var maxNum=max*2;
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
                                        width: 2
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
