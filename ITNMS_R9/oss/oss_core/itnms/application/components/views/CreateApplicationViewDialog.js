define([
  "oss_core/itnms/application/actions/ApplicationAction.js",
    'i18n!oss_core/itnms/host/i18n/host',
    "text!oss_core/itnms/application/components/views/CreateApplicationViewDialog.html",
],
   function(action,i18nData,tpl){
  var CreateApplicationViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  CreateApplicationViewDialog.prototype.content=function(){
    this.$el=$(this.tpl(i18nData))
    return this.$el;
  }
  CreateApplicationViewDialog.prototype.popup=function(options,props,callback){
    options.content=this.content(),
    this.$popup=fish.popup(options);
    this.props=props;
    this.callback=callback;
    this.afterPopup();
  }
  CreateApplicationViewDialog.prototype.afterPopup=function(){
     var self =this;
    this.$el.find('.hostTempName').val(this.props.data.name);
    this.$el.find('.appName').val(this.props.data.appName)
    this.$el.find('.reset').off('click').on('click',function(){
                self.$popup.hide();
     });
     this.$el.find('.OK').off('click').on('click',function(){
       var id = self.props.data.value;
       var name=self.$el.find('.appName').val();
       var fun =null;
       if (self.props.data.gid=="NONE"){
         fun=action.addApplciton({
             'id':id,
             'name':name
          })
       }else{
         fun=action.updataApplciton({
             'id':self.props.data.gid,
             'name':name
          })
       }

       fun.then(function(data){
         if(data.error){
             fish.toast('warn', data.error.data);
         }else{
            fish.toast('success', 'success')
            self.callback();
            self.$popup.hide();
         }
       });

     });
  }
  return CreateApplicationViewDialog;
})
