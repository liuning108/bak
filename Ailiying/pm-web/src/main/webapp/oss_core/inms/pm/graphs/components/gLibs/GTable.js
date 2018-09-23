define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GTable = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GTable.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GTable.prototype.remove = function() {
    this.$el.html("");
  }
  GTable.prototype.createResult = function(config) {
    console.log('GTable',config);
    var hostPage  = config.tabsConfig.hostPage;
    var result = {};
    result.datas=config.kpiDatas.result;
    var colModel=[];
    colModel.push({
      'name':hostPage.xAxis,
      'label':hostPage.xAxisName,
    })
    fish.each(hostPage.selItems,function(d){
        colModel.push({
           "name":d.value,
           'label':d.name
        })
    });
    result.colModel=colModel;


    return result;
  }
  GTable.prototype.resize=function(w,h){
    this.$gird.jqGrid('setGridWidth',w-50);
    this.$gird.jqGrid('setGridHeight',h-20);
  }
  GTable.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    this.$el.append("<div class='gtable_gird'></div>");

    var colModel = result.colModel;
    var $gird = this.$el.find('.gtable_gird').grid({
      data: result.datas,
     "colModel": result.colModel,
      rowNum: 20,
      rowList: [
        10, 20, 30
      ],
      pager: true
    });
    this.$gird=$gird;
      $gird.find('thead').css({
        "background-color": "#2351C5",
        "color": "#fff"
      })
    // fish.each(colModel, function(d) {
    //   $gird.grid("setLabel", d.name, d.label, {
    //     "background-color": "#2351C5",
    //     "color": "#fff"
    //   });
    // })

  }
  return GTable
});
