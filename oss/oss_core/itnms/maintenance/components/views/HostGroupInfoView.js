define([
  "oss_core/itnms/maintenance/actions/MainAction",
  "text!oss_core/itnms/maintenance/components/views/HostGroupInfoView.html",
  "oss_core/itnms/host/components/kdoDSelect/KdoDSelect.js",
],function(action,tpl,KdoDSelect){
   var HostGroupInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);
   }
   HostGroupInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl())
     this.afterRender();
   }
   HostGroupInfoView.prototype.remove=function(){
    this.$el.html("");
   }
   HostGroupInfoView.prototype.afterRender=function(){
     this.afterEvent();
   }
   HostGroupInfoView.prototype.renderCatalogTree=function() {
     var self =this;
     var treeData = fish.map(this.option.catatlog,function(d){
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
    if(this.option.bisId){
      this.$el.find('.teplate_catalogtree').combotree('value', this.props.bisId);
    }
    var curValue=this.$el.find('.teplate_catalogtree').combotree('value');
    this.changeCatalogtree(curValue);
    this.$el.find('.teplate_catalogtree').on('combotree:change',function(e) {
          var curValue=$(this).combotree('value');
          self.changeCatalogtree(curValue)
    });
   }
   HostGroupInfoView.prototype.changeCatalogtree=function(curValue) {
     var self  =this;
     if(curValue.id=="R")curValue.id=null;
     action.getGroupidsBySubNo(curValue.id).then(function(data) {
         self.renderGroup(data);
     })
   }
   HostGroupInfoView.prototype.renderGroup=function(data){
       this.filterGroup.combobox({
         dataSource:data.result
       })
       if(data.result.length>0){
         this.filterGroup.combobox("value",data.result[0].groupid);
       }
   }
   HostGroupInfoView.prototype.init=function() {
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
               action.getAllHostsByGroupids({ids:[curValue.groupid],search:{}}).then(function(data) {
                      if(self.templDSelect){
                        var LData=fish.map(data.result,function(d) {
                           return {
                              'name':d.name,
                              'value':d.hostid
                           }
                        })
                        var newLData = LData;
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

       // hostGroupData.groups=mainObj.groups;
       // hostGroupData.hosts=mainObj.hosts;

       console.log("hostGGGGGG");
       console.log(this.option.data.groups);
       self.templDSelect =new KdoDSelect({
          el: self.$el.find('.TemplatesDSelect'),
          L :[],
          R: this.option.data.groups
        })
       self.templDSelect.render();


       action.getAllGroup().then(function(data){
         var allGroupsData =fish.map(data.result,function(d) {
                                      return {
                                        'name':d.name,
                                        'value':d.groupid,
                                      }
                                   });
           self.allGroupDSelect = new KdoDSelect({
             el: self.$el.find('.AllGroupDSelect'),
             L :allGroupsData,
             R: self.option.data.hosts
           })
           self.allGroupDSelect.render();
       })

   }
   HostGroupInfoView.prototype.afterEvent=function(){
     var self =this;
     this.init();
     this.renderCatalogTree();
   }
   HostGroupInfoView.prototype.getInfo=function(){
     var  self =this;
     var info ={};
     info.g = fish.map(self.templDSelect.val(),function(d){
          return d.value
     });
     info.h = fish.map(self.allGroupDSelect.val(),function(d){
          return d.value
     });
     return info;
   }
   return HostGroupInfoView;
});
