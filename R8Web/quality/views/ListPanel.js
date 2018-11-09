portal.define(['text!oss_core/pm/quality/templates/ListPanel.html'], function(tpl) {
  var ListPanel = function(props) {
    this.template = fish.compile(tpl);
    this.props = props;
    this.$el = this.props.el;
    this.colors=["#55bedc","#e1555a","#50b067","#f3ae5b"]
  }
  ListPanel.prototype.render = function() {
    var opt = {};
    var self =this;
    opt.datas  = fish.map(this.props.data,function(d,i){
         var index = i%self.colors.length;
         d.color =self.colors[index];
         return d;
    });
    this.$el.html(this.template(opt));
    this.afterRender();
  }
  ListPanel.prototype.afterRender = function() {

  }
  return ListPanel
});
