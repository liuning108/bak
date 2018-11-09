portal.define([
  'oss_core/pm/netmonitor/views/NetPanelViewDialog.js',
  'text!oss_core/pm/netmonitor/templates/Tiprogress.html',
],function(NetPanelViewDialog,tpl){
    var TiprogressView = function(props){
       this.$el = $(props.el);
       this.tpl = fish.compile(tpl);
       this.props = props;
    }
    TiprogressView.prototype.render=function(){
       this.remove();
       this.$el.html(this.tpl({data:this.props.data}));
       this.afterRender();
    }
    TiprogressView.prototype.afterRender=function(){
       var self =this;
       this.$el.find('.netpopup').off('click').on('click',function(){
        self.popupEvent();
       })

    }
    TiprogressView.prototype.popupEvent=function(){
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
      var netPanelViewDialog = new NetPanelViewDialog();
      netPanelViewDialog.popup(options, {data:self.props.data.table,"cd":this.props.cd}, function() {
      });

    }
    TiprogressView.prototype.remove=function(){
         this.$el.html("");
    }
    return TiprogressView;
});
