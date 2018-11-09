portal.define([
  'text!oss_core/pm/quality/templates/TopPanel.html',
  "oss_core/pm/quality/action/action",
  "oss_core/pm/quality/views/TrandChartViewDialog",
], function(tpl,action,TrandChartViewDialog) {
  var TopPanel = function(props) {
    this.template = fish.compile(tpl);
    this.props = props;
    this.$el = this.props.el;
  }
  TopPanel.prototype.render = function() {
    var opt ={
      title:this.props.title
    }
    this.$el.html(this.template(opt));
    this.afterRender();
  }
  TopPanel.prototype.afterRender = function() {

    this.initGrid();
    this.initTrandChart();
  }
  TopPanel.prototype.initTrandChart = function(){
      var self =this ;
      var type = this.props.type;
      this.$el.find('.trandChart')
          .off('click')
          .on('click',function(){
              var type = self.props.type;
              action.getHotTrendDataList(type,function(data){

                 console.log(type,data);
                 self.popupTrandChart(data)
              })
          })
  }

  TopPanel.prototype.popupTrandChart=function(data){
    var self =this;
    var options = {
      height: 500,
      width: 1020,
      modal: true,
      draggable: false,
      autoResizable: false,
      // position: {
      //   'of': $el,
      //   'my': "top",
      //   'at': "right" + " " + "top",
      //   collision: "fit"
      // }
    };
    var trandChartViewDialog = new TrandChartViewDialog();
    trandChartViewDialog.popup(options, {
      title : self.props.title,
      datas : data.dataList,
      btnsName:self.props.btnsName,
      top1: self.props.tops[0],
      top2: self.props.tops[1],
      top3: self.props.tops[2],
    }, function() {

    });
  }
  TopPanel.prototype.initGrid = function() {
    var colNames =this.props.colNames;
    var mydata =this.props.data||[];
    var opt = {
      data: mydata,
      height: 'auto',
      colModel: [
        {
          name: 'index',
          'label': '',
          width: 10,
          formatter: function(cellval, opts, rwdat, _act) {
            var className = 'c' + cellval
            return "<span class='block " + className + " '>" + cellval + "</span>"
          }
        }, {
          name: 'name',
          label: colNames[0],
          width: 30,
          sortable: false
        }, {
          name: 'val',
          label: colNames[1],
          width: 35,
          sortable: false
        }, {
          name: 'val2',
          label: colNames[2],
          width: 25,
          sortable: false
        }
      ]
    };
    this.$el.find("#gridId").grid(opt);
  }
  return TopPanel
});
