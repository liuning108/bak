define(["text!oss_core/kdo/itnms/host/components/views/InventoryPageView.html"],
     function(tpl){
   var InventoryPageView = function(option){
       this.option =option;
       this.tpl = fish.compile(tpl);
       this.$el =$(this.option.el);
   }
   InventoryPageView.prototype.render=function() {
      this.remove();
      this.$el.html(this.tpl());
      this.afterRender();

   }
   InventoryPageView.prototype.remove=function(){
      this.$el.html("");
   }
   InventoryPageView.prototype.afterRender=function() {
     this.$el.find('.InventoryBody').slimscroll({
          'height':"350px",
           width: "100%"
     });
   }

   return InventoryPageView;
})
