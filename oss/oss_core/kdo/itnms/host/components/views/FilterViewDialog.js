define(["text!oss_core/kdo/itnms/host/components/views/filterHostView.html"],
   function(tpl){
  var FilterViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  FilterViewDialog.prototype.content=function(){
    this.$el=$(this.tpl())
    return this.$el;
  }

  FilterViewDialog.prototype.popup=function(options,props,callback){
    options.content=this.content(),
    this.$popup=fish.popup(options);
    this.props=props;
    this.callback=callback;
    this.afterPopup();
  }
  FilterViewDialog.prototype.afterPopup=function(){
    var self =this;
     this.$el.find('.filterName').val(this.props.name);
     this.$el.find('.filterIP').val(this.props.ip);
     this.$el.find('.filterDNS').val(this.props.dns);
     this.$el.find('.filterPort').val(this.props.port);
     this.$el.find('.reset').off('click').on('click',function(){
        self.$el.find('.filterInput').val('');
        self.callback({
           "ip":'',
           "dns":'',
           "name":'',
           'port':''
        })
        self.$popup.hide();
     });

     this.$el.find('.OK').off('click').on('click',function(){
        self.callback({
           "ip":self.$el.find('.filterIP').val(),
           "dns":self.$el.find('.filterDNS').val(),
           "name":self.$el.find('.filterName').val(),
           'port':self.$el.find('.filterPort').val()
        })
        self.$popup.hide();
     });

  }

  return FilterViewDialog;
})
