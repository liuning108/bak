define([
  "text!oss_core/kdo/itnms/host/components/views/InterfaceView.html",
  "text!oss_core/kdo/itnms/host/components/views/interfaceItem.html"
],function(tpl,itemTpl){
  var InterfaceView = function(options) {
    this.options=options;
    this.$el=$(this.options.el)
    this.tpl=fish.compile(tpl)
    this.itemTpl= fish.compile(itemTpl)
  }
  InterfaceView.prototype.render=function() {
     this.remove();
     this.$el.html(this.tpl());
     this.afterRender();

  }
  InterfaceView.prototype.remove=function() {
    this.$el.html("");
  }
  InterfaceView.prototype.afterRender=function() {
    var self =this;
    this.$el.find('.menuUL').find('li').off('click').on('click',function() {
      self.menuLiEvent($(this));
    })

     this.$el.find('.agentPageAdd').off('click').on('click',function(){
        self.agentPageAdd();
     })
     this.$el.find('.snmpPageAdd').off('click').on('click',function(){
        self.snmpPageAdd();
     })

     this.$el.find('.jmxPageAdd').off('click').on('click',function(){
        self.jmxPageAdd();
     })
     this.$el.find('.ipmiPageAdd').off('click').on('click',function(){
        self.ipmiPageAdd();
     })


  }
  InterfaceView.prototype.agentPageAdd=function() {
    var el=this.$el.find('.agentPage').find('.interfacesTable').find('tbody')
    this.addItem(el);
  }

  InterfaceView.prototype.snmpPageAdd=function() {
    var el=this.$el.find('.snmpPage').find('.interfacesTable').find('tbody')
    this.addItem(el);
  }

  InterfaceView.prototype.jmxPageAdd=function() {
    var el=this.$el.find('.jmxPage').find('.interfacesTable').find('tbody')
    this.addItem(el);
  }

  InterfaceView.prototype.ipmiPageAdd=function() {
    var el=this.$el.find('.ipmiPage').find('.interfacesTable').find('tbody')
    this.addItem(el);
  }

  InterfaceView.prototype.addItem=function(el){
    this.$el.find('.hostPageContext').slimscroll({
         'height':"content",
          width: "90%"
    });
    var $item=$(this.itemTpl())
    this.addItemEvent($item);
    el.append($item);
  }

  InterfaceView.prototype.addItemEvent=function($item){
   $item.find('.hostRemove').off('click').on('click',function(){
     $(this).parent().parent().remove();
   })

   $item.find('.hostDefault').off('click').on('click',function(){
     $(this).parent().parent().parent().find('.hostDefault.active').removeClass('active')
     $(this).addClass('active')
   })

   $item.find('.ipOrDns').off('click').on('click',function(){
     $(this).parent().find('.active').removeClass('active')
     $(this).addClass('active')
   })

  }


  InterfaceView.prototype.menuLiEvent=function(target) {
    this.$el.find('.menuUL').find('li.active').removeClass("active")
    target.addClass('active');
    this.$el.find('.menuPage').find('.menuPageContet').hide();
    this.$el.find(target.data('view')).show();


  }


  return InterfaceView;

})
