portal.define([
  'oss_core/pm/netmonitor/views/NetPanelViewDialog.js',
  'text!oss_core/pm/netmonitor/templates/NetPanel.html',
],function(NetPanelViewDialog,tpl){
    var NetPanel = function(props){
       this.$el = $(props.el);
       this.tpl = fish.compile(tpl);
       this.props = props;
    }
    NetPanel.prototype.render=function(){
       this.remove();
       this.$el.html(this.tpl({data:this.props.data}));
       this.afterRender();
    }

    NetPanel.prototype.afterRender=function(){
       var self =this;
       this.$el.find('.netInfo').popover({
          content: "<div class='netTip'>"+this.props.data.tip+"</div>",
          html:true,
          placement: 'bottom-right',
          template:'<div class="popover" role="tooltip"><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
       })
       this.$el.find('.netpopup').off('click').on('click',function(){
         var flag = $(this).data('flag');
        self.popupEvent(flag);
       })

    }
    NetPanel.prototype.popupEvent=function(flag){

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
      netPanelViewDialog.popup(options, {data:self.props.data.table,"cd":this.props.cd,"flag":flag}, function() {
      });

    }

    NetPanel.prototype.remove=function(){
         this.$el.html("");
    }

    return NetPanel;
});
