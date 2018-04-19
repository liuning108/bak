/**
https://www.zabbix.com/documentation/3.4/zh/manual/api/reference/hostinterface/object
  1 - agent;
  2 - SNMP;
  3 - IPMI;
  4 - JMX.
**/

define([
  "text!oss_core/kdo/itnms/host/components/views/InterfaceView.html",
  "text!oss_core/kdo/itnms/host/components/views/interfaceItem.html"
],function(tpl,itemTpl){
  var InterfaceView = function(options) {
    this.options=options;
    this.$el=$(this.options.el)
    this.tpl=fish.compile(tpl)
    this.itemTpl= fish.compile(itemTpl)
    this.emptyObj = {
       bulk:'1',
       dns:'',
       hostid:'',
       interfaceid:'none',
       ip:'',
       main:'0',
       port:'10050',
       useip:'1',
    }
  }
  InterfaceView.prototype.render=function() {
     this.remove();
     this.$el.html(this.tpl());
     this.afterRender();
     this.initData();
  }
  /**
  1 - agent;
  2 - SNMP;
  3 - IPMI;
  4 - JMX.
  **/
  InterfaceView.prototype.initData= function(){
    var self =this;
    var datasByType= fish.groupBy(this.options.data, 'type');
    fish.each(datasByType["1"],function(d){
      self.agentPageAdd(d);
    })
    fish.each(datasByType["2"],function(d){
      self.snmpPageAdd(d);
    })
    fish.each(datasByType["3"],function(d){
      self.jmxPageAdd(d);
    })
    fish.each(datasByType["4"],function(d){
      self.ipmiPageAdd(d);
    })
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
       self.emptyObj.type="1"
        self.agentPageAdd(self.emptyObj);
     })
     this.$el.find('.snmpPageAdd').off('click').on('click',function(){
       self.emptyObj.type="2"
       self.snmpPageAdd(self.emptyObj);
     })
     this.$el.find('.ipmiPageAdd').off('click').on('click',function(){
        self.emptyObj.type="3"
        self.ipmiPageAdd(self.emptyObj);
     })
     this.$el.find('.jmxPageAdd').off('click').on('click',function(){
        self.emptyObj.type="4"
        self.jmxPageAdd(self.emptyObj);
     })



  }
  InterfaceView.prototype.agentPageAdd=function(d) {
    var el=this.$el.find('.agentPage').find('.interfacesTable').find('tbody')
    this.addItem(el,d);
  }

  InterfaceView.prototype.snmpPageAdd=function(d) {
    var el=this.$el.find('.snmpPage').find('.interfacesTable').find('tbody')
    this.addItem(el,d);
  }

  InterfaceView.prototype.jmxPageAdd=function(d) {
    var el=this.$el.find('.jmxPage').find('.interfacesTable').find('tbody')
    this.addItem(el,d);
  }

  InterfaceView.prototype.ipmiPageAdd=function(d) {
    var el=this.$el.find('.ipmiPage').find('.interfacesTable').find('tbody')
    this.addItem(el,d);
  }

  InterfaceView.prototype.addItem=function(el,d){
    this.$el.find('.hostPageContext').slimscroll({
         'height':"content",
          width: "90%"
    });
    var $item=$(this.itemTpl())
    el.append($item);
    if(el.find('.kdoHostItemTr').length==1){
      d.main=1;
    }else{
      d.main=0;
    }
    this.initItemData($item,d)
    this.addItemEvent($item);

  }

  InterfaceView.prototype.getInfo =function(){
    var $items=this.$el.find('.interfacesTable').find('tbody').find('.kdoHostItemTr');
    var items = fish.map($items,function(d){
       var $d =$(d)
       var main=$d.find('.hostDefault').hasClass('active')?'1':'0'
       var useIp=$d.find('.ipOrDnsIP').hasClass('active')?'1':'0'
       var bulk =$d.find('.snmpCheckbox.cbox').is(':checked')?"1":"0"
       var intefaceId=($d.data('id')=='none')?null:$d.data('id')
       var obj ={
         'type': $d.find('.inputTypeHide').val(),
         'main': main,
         'useip':useIp,
         "ip": $d.find('.interfaceIP').val(),
         "dns": $d.find('.interfaceDNS').val(),
         "port": $d.find('.interfacePort').val(),
         "interfaceid":intefaceId
       }
       if(obj.type=='2'){
           obj.bulk=bulk
       }
       return obj
    })
    return items;
  }

  InterfaceView.prototype.initItemData=function($item,d) {
    var self =this;
      $item.find('.snmpCheckbox').hide();
      $item.data('id',d.interfaceid);
      $item.find('.interfaceIP').val(d.ip)
      $item.find('.interfaceDNS').val(d.dns)
      $item.find('.interfacePort').val(d.port)
      $item.find('.inputTypeHide').val(d.type);
      //if type is snmp then snpmCheckbox is show
      if(d.type=='2'){
        $item.find('.snmpCheckbox').show();
        if (d.bulk=='1'){
          $item.find('.snmpCheckbox.cbox').attr('checked',true);
        }
      }
      $item.find('.ipOrDns.active').removeClass('active')
      if(d.useip=='1'){
       $item.find('.ipOrDnsIP').addClass('active')
      }else{
       $item.find('.ipOrDnsDNS').addClass('active')
      }
      if(d.main=='1'){
        self.hostDefaultAction($item.find('.hostDefault'));
      }

  }

  InterfaceView.prototype.addItemEvent=function($item){
   var self =this;
   $item.find('.hostRemove').off('click').on('click',function(){
     $(this).parent().parent().remove();
   })

   $item.find('.hostDefault').off('click').on('click',function(){
        self.hostDefaultAction(this)
   })

   $item.find('.ipOrDns').off('click').on('click',function(){
     $(this).parent().find('.active').removeClass('active')
     $(this).addClass('active')
   })

  }

  InterfaceView.prototype.hostDefaultAction=function(_this){
    $(_this).parent().parent().parent().find('.hostDefault.active').removeClass('active')
    $(_this).addClass('active')

  }


  InterfaceView.prototype.menuLiEvent=function(target) {
    this.$el.find('.menuUL').find('li.active').removeClass("active")
    target.addClass('active');
    this.$el.find('.menuPage').find('.menuPageContet').hide();
    this.$el.find(target.data('view')).show();
  }


  return InterfaceView;

})
