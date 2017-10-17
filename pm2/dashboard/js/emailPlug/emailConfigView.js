define(["text!oss_core/pm/dashboard/js/emailPlug/emailConfig.html",
        "css!oss_core/pm/dashboard/js/emailPlug/style.css",],function(tpl){
    return portal.CommonView.extend({
      className: "ui-dialog dialog",
      template: fish.compile(tpl),
      initialize:function(){

      },
      render:function(){
        this.$el.html(this.template());
        return this;
      },
      afterRender:function() {

            var self =this;

          var dd =new Date();
          dd.setTime(dd.getTime()-24*60*60*1000)
        $('#sendmail-effDate,#sendmail-expDate').datetimepicker({
          viewType: "date",
          startDate:dd
        });


        $('#btn-sendmail-ok').click(function(){
             value= fish.map($('.selCardUL li.selLi'),function(dom){
                   return $(dom).data('value')
             })
             if(value.length>0){
               alert(value)
              var flag = $('#detailfrom').isValid();
             }else{
              $('#detailfrom').resetValid();
             }


        })

        $('.selCardUL li').click(function(){
              var flag =$(this).hasClass("selLi")
              if(!flag){
                $(this).addClass('selLi');
              }else{
                $(this).removeClass('selLi');
              }
        })

        $('#btn-sendmail-cancel').click(function() {
            self.trigger('close')
          })




      },
    })


})
