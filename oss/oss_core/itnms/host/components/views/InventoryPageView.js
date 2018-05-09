define([
  'i18n!oss_core/itnms/host/i18n/host',
  "text!oss_core/itnms/host/components/views/InventoryPageView.html"],
     function(i18nData,tpl){
   var InventoryPageView = function(option){
       this.option =option;
       this.tpl = fish.compile(tpl);
       this.$el =$(this.option.el);
   }
   InventoryPageView.prototype.render=function() {
      this.remove();
      this.$el.html(this.tpl(i18nData));
      this.afterRender();

   }
   InventoryPageView.prototype.remove=function(){
      this.$el.html("");
   }
   InventoryPageView.prototype.afterRender=function() {
     var self =this;
     this.$el.find('.InventoryBody').slimscroll({
          'height':"250px",
           width: "100%"
     });

     this.$el.find('.HostMarcoOK').off('click').on('click',function(){
       self.option.ok();
     })
     this.$el.find('.HostMarcoCancel').off('click').on('click',function(){
       self.option.cancel();
     })
     this.$el.find('input[type="radio"][name="inventory_mode"]')
             .off('click')
             .on('click',function(){
                var value=  $(this).val()+"";
                self.setMode(value)
             })
       var value =this.option.info.inventory_mode;
      var inventory_mode=(value)?value:"-1";
      this.$el.find('input[type="radio"][name="inventory_mode"][value="'+inventory_mode+'"]').attr("checked",'checked');
     self.setInfo();
     self.setMode(inventory_mode);
   }
   InventoryPageView.prototype.setMode=function(value){
       var self =this;
      if("-1"==value){
       self.$el.find('.InventoryObj').attr('disabled','true');
       self.$el.find('.InventoryObj').addClass('disabled')
      }else{
       self.$el.find('.InventoryObj').removeAttr('disabled');
       self.$el.find('.InventoryObj').removeClass('disabled')
      }
    }
   InventoryPageView.prototype.setInfo=function(){
     var self =this;
     fish.each(this.$el.find('.InventoryObj'),function(d){
       var $d =$(d);
       var name =$d.data('name');
       $d.val(self.option.info[name]);
     })
   }
   InventoryPageView.prototype.getInfo=function(){
      var inventoryInfo = fish.reduce(this.$el.find('.InventoryObj'),function(obj,d){
            var $d =$(d);
            obj[$d.data('name')]=$d.val();
           return obj
      },{})

       var modeV=this.$el.find('input[type="radio"][name="inventory_mode"]:checked')              .val()+"";
       if ("-1"==modeV){
         inventoryInfo = null;
       }
      return {
        "inventory_mode":modeV,
        "inventory":inventoryInfo
      }
   }

   return InventoryPageView;
})
