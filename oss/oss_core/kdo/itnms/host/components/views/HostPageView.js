define([
  "oss_core/kdo/itnms/host/actions/HostAction",
  "text!oss_core/kdo/itnms/host/components/views/HostPage.html",
  "oss_core/kdo/itnms/host/components/kdoDSelect/KdoDSelect.js",
  "oss_core/kdo/itnms/host/components/views/InterfaceView.js",
], function(action,tpl,KdoDSelect,InterfaceView) {
  var HostPageView = function(options) {
    this.options = options;
    this.tpl = fish.compile(tpl);
    this.$el = $(this.options.el);
    this.state={
      data:['.Step1',".Step2"],
      curIndex:0
    }

  }
  HostPageView.prototype.render = function() {
    this.remove();
    this.$el.html(this.tpl());
    this.afterRender();
  }
  HostPageView.prototype.remove = function() {
    this.$el.html("");
  }
  HostPageView.prototype.afterRender=function(){
    var self =this;
    this.$el.find('.stepNext').off('click').on('click',function(){
      self.stepNext($(this))
    })
    this.$el.find('.stepUp').off('click').on('click',function(){
      self.stepUp($(this))
    })
    this.$el.find('.hostPageCancel').off('click').on('click',function(){
      self.options.parent.cancel();
    })
    this.renderHostBaseInfo();
    this.renderGroup()

    this.renderInderface();
  }
  HostPageView.prototype.renderHostBaseInfo=function(){
    this.$el.find('.hostHost').val(this.options.hostObj.host);
    this.$el.find('.hostName').val(this.options.hostObj.name);
    var value= this.options.hostObj.status;
    this.$el.find("input[name='offon'][value='"+value+"']").attr("checked",true);
    this.$el.find('.HostDesc').val(this.options.hostObj.description);
    this.hostProxy = this.$el.find('.hostProxy').combobox({
        placeholder: 'none proxy',
        dataTextField: 'host',
        dataValueField: 'proxyid',
        dataSource: this.options.pageHostData.proxyData.result
    });
    var proxyId =this.options.hostObj.proxy_hostid;
    this.hostProxy.combobox('value', proxyId);
  }
  HostPageView.prototype.renderInderface=function() {
    this.interfaceView=new InterfaceView({
      'el':this.$el.find('.Step2Page'),
      'data':this.options.hostObj.interfaces
    })
    this.interfaceView.render()

  }
  HostPageView.prototype.mapGroup=function(d) {
    return {
      name:d.name,
      value:d.groupid
    }
  }
  HostPageView.prototype.renderGroup=function() {
    var self =this;
    var LR = fish.map(this.options.pageHostData.allGroup.result,this.mapGroup);
    var GR = fish.map(this.options.hostObj.groups,this.mapGroup);
    this.group =new KdoDSelect({
       el: this.$el.find('.Step1PageGroup'),
       L :LR,
       R: GR
     })
     this.group.render();
    var treeData = fish.map(this.options.pageHostData.treeData,function(d){
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
        dataValueField:"id",
        placeholder: "please select category",
        data: {
            simpleData: {
                enable: true
            }
        },
        fNodes :treeData
    };
    this.catalogtree=this.$el.find('.catalogtree').combotree(options);
    this.catalogtree.combotree('value',self.options.parent.option.bisId)

    this.$el.find('.newHostGroupDiv').hide();
    this.$el.find('.isNewGroupChk').off('click').on('click',function() {
           if(  $(this).is(':checked') ){
             self.$el.find('.newHostGroupDiv').show();
           }else{
             self.$el.find('.newHostGroupDiv').hide();
           }
    })

  }
  HostPageView.prototype.stepNext=function(_this){
    var self =this;
    var $ws =this.$el.find('.kdoWizardSteps')
   //把当前的状态设置为complete,当前显示的页面为hide
   var curState =this.state.data[this.state.curIndex];
   $ws.find(curState).removeClass('active').addClass('complete');
   var curView =$ws.find(curState).data('view');
   if(this.state.curIndex<this.state.data.length-1){
     this.$el.find(curView).hide();
   }
   //把下个状态设置为active
   this.state.curIndex=this.state.curIndex+1;
   if(this.state.curIndex>0){
      this.$el.find('.stepUp').removeClass('hide')
                              .addClass('show');
   }
   if( this.state.curIndex>=this.state.data.length-1){
       _this.html('完成');
   }
   var nextState= this.state.data[this.state.curIndex]
   $ws.find(nextState).addClass('active')
  var curView =$ws.find(nextState).data('view');
  this.$el.find(curView).show();
   if(!nextState){
      self.done();
     this.state.curIndex=this.state.curIndex-1;
   }

  }

  HostPageView.prototype.done=function(){
       this.options.parent.done();
  },


    HostPageView.prototype.verify=function(){
         var isGroup=this.$el.find('.isNewGroupChk').is(':checked')
         if(isGroup){
           var catalog=this.catalogtree.combotree('value');
           if(catalog==null){
             fish.toast('warn', "please a catalog for new group");
           }else {
             return true;
           }
         }else{
           return true;
         }

    }

  HostPageView.prototype.getInfo =function(){
    var info = {};
    var catalog=this.catalogtree.combotree('value');
    if(catalog==null){
      info.sId='none';
      info.cId='none';
    }else{
      info.sId= catalog.id;
      info.cId= catalog.pId;
    }
    info.newg_name=this.$el.find('.newg_name').val();
    info.hostid=this.options.hostObj.hostid;
    info.host=this.$el.find('.hostHost').val();
    info.name=this.$el.find('.hostName').val();
    info.proxy_hostid=this.hostProxy.combobox('value');
    info.status=this.$el.find("input[name='offon']:checked").val();
    info.description=this.$el.find('.HostDesc').val();
    info.groups=fish.map(this.group.val(),function(d){
        return {'groupid':d.value}
    });
    info.interfaces=this.interfaceView.getInfo();
    return info;
  }

  HostPageView.prototype.stepUp=function(_this){
    var $ws =this.$el.find('.kdoWizardSteps')
   //把当前的状态设置为active,complete,当前显示的页面为hide
   var curState =this.state.data[this.state.curIndex];
   $ws.find(curState).removeClass('complete')
                     .removeClass('active')
   var curView =$ws.find(curState).data('view');
   this.$el.find(curView).hide();
   //把下个状态设置为active
   this.state.curIndex=this.state.curIndex-1;
   if(this.state.curIndex<=0){
      this.$el.find('.stepUp').removeClass('show')
                              .addClass('hide');
   }
   if( this.state.curIndex<this.state.data.length-1){
       this.$el.find('.stepNext').html('下一步')
   }
   var upState= this.state.data[this.state.curIndex]
   $ws.find(upState).addClass('active')
   var upStatePage =$ws.find(upState).data('view');
    this.$el.find(upStatePage).show();
  }
  return HostPageView;
});
