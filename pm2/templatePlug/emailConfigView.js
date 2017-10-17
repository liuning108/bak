define([],function(){
    return portal.CommonView.extend({
      className: "ui-dialog dialog",
      template: fish.compile("<div>Hello Wolrd</div>"),
      initialize:function(){

      },
      render:function(){
        this.$el.html(this.template());
        return this;
      },
      afterRender:function() {

      },
    })


})
