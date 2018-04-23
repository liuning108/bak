define(["oss_core/itnms/host/actions/HostAction",
        "oss_core/itnms/host/components/kdoDSelect/KdoDSelect.js",
      "text!oss_core/itnms/host/components/views/TemplateViewDialog.html"],
   function(action,KdoDSelect,tpl){
  var TemplateViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  TemplateViewDialog.prototype.content=function(){
    this.$el=$(this.tpl())
    return this.$el;
  }

  TemplateViewDialog.prototype.popup=function(options,props,callback){
    options.content=this.content(),
    this.$popup=fish.popup(options);
    this.props=props;
    this.callback=callback;
    this.afterPopup();
  }
  TemplateViewDialog.prototype.renderCatalogTree=function() {
    var self =this;
    var treeData = fish.map(this.props.catatlog,function(d){
        var isParent = (d.pid==='R')?true:false;
          return {
            'id':d.id,
            'pId':d.pid,
            'name':d.name,
            'open':true,
            'disabled':isParent
          }
      })
    var options = {
       placeholder: "select catalog",
       dataValueField:"id",
       data: {
           simpleData: {
               enable: true
           }
       },
       fNodes :treeData
   };
   this.$el.find('.teplate_catalogtree').combotree(options);
   this.$el.find('.teplate_catalogtree').combotree('value', 'R');
   if(this.props.bisId){
     this.$el.find('.teplate_catalogtree').combotree('value', this.props.bisId);
   }
   var curValue=this.$el.find('.teplate_catalogtree').combotree('value');
   this.changeCatalogtree(curValue);
   this.$el.find('.teplate_catalogtree').on('combotree:change',function(e) {
         var curValue=$(this).combotree('value');
         self.changeCatalogtree(curValue)
   });
  }
  TemplateViewDialog.prototype.changeCatalogtree=function(curValue) {
    var self  =this;
    if(curValue.id=="R")curValue.id=null;

    action.getGroupidsBySubNo(curValue.id).then(function(data) {
        console.log(data);
        self.renderGroup(data);
    })
  }

  TemplateViewDialog.prototype.renderGroup=function(data){
      this.filterGroup.combobox({
        dataSource:data.result
      })
      if(data.result.length>0){
        this.filterGroup.combobox("value",data.result[0].groupid);
      }

  }

  TemplateViewDialog.prototype.init=function() {
    var self =this;

    this.filterGroup = this.$el.find('.filterGroup').combobox({
          placeholder: 'Select a State',
          editable: false,
          dataTextField: 'name',
          dataValueField: 'groupid',
          dataSource: []
      });
      this.filterGroup.on('combobox:change',function() {
           var curValue =self.filterGroup.combobox('getSelectedItem');
           if(curValue){
              action.getTemplateByGroupId(curValue.groupid).then(function(data) {
                     if(self.templDSelect){
                       var LData=fish.map(data.result,function(d) {
                          return {
                             'name':d.name,
                             'value':d.templateid
                          }
                       })
                       var newLData = fish.filter(LData ,function(d){
                          return !fish.findWhere(self.props.filterData,d);
                       })
                       var RData =self.templDSelect.val();
                       self.templDSelect =new KdoDSelect({
                          el: self.$el.find('.TemplatesDSelect'),
                          L :newLData,
                          R: RData
                        })
                       self.templDSelect.render();
                     }

              })
           }

      })

      self.templDSelect =new KdoDSelect({
         el: self.$el.find('.TemplatesDSelect'),
         L :[],
         R: []
       })
      self.templDSelect.render();
  }

  TemplateViewDialog.prototype.afterPopup=function(){
    var self =this;
    this.init();
    this.renderCatalogTree();
     this.$el.find('.reset').off('click').on('click',function(){
        self.$el.find('.filterInput').val('');
        self.callback([])
        self.$popup.hide();
     });

     this.$el.find('.OK').off('click').on('click',function(){
        self.callback(self.templDSelect.val())
        self.$popup.hide();
     });

  }

  return TemplateViewDialog;
})
