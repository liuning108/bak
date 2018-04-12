define([
  "oss_core/kdo/itnms/host/actions/HostAction",
  "oss_core/kdo/itnms/host/components/views/HostPageView.js",
  "text!oss_core/kdo/itnms/host/components/views/createHostView.html",
  "oss_core/kdo/itnms/host/components/kdoTabs/KdoTabs.js",
],function(action,HostPageView,tpl,KdoTabs){

   var CreateHostView = function(option){
      this.option = option;
      if(!this.option.hostObj){
        this.option.hostObj = this.getEmptyHostObject()
      }

      this.tpl = fish.compile(tpl);
   }
   CreateHostView.prototype.render=function(){
      this.remove();
       var $el = $(this.option.el);
       $el.html(this.tpl())
       this.afterRender()
   }
   CreateHostView.prototype.remove=function(){
      $(this.option.el).html("");
   }
   CreateHostView.prototype.afterRender = function() {
      var self =this;
      var $el = $(this.option.el);
      var kdoTabs = new KdoTabs(
        {
          "el":$el.find('.kdo-right-page-cotent'),
          "data":[
            {name:'监控点',view:function($el){self.HostPage($el)}},
            {name:'模板',view:function($el){}},
            {name:'宏',view:function($el){}},
            {name:'资产信息',view:function($el){}},
            {name:'IPMI',view:function($el){}},
          ],
          "isMore":false,
          more:{
             name : '更多...'
          }
        }
      );
      kdoTabs.render();
   }

  CreateHostView.prototype.HostPage =function($el){
      var self =this;
      var pageHostData={}
     action.getCategoryTree().then(function(treeData){
       pageHostData.treeData= treeData;
       return action.getAllProxy()
     }).then(function(proxyData){
        pageHostData.proxyData= proxyData;
       return action.getAllGroup()
     }).then(function(allGroup){
       pageHostData.allGroup= allGroup;
       self.renderHostPage(pageHostData,$el)
     })
  }
  CreateHostView.prototype.renderHostPage=function(pageHostData,$el){
    var self = this;
    console.log(pageHostData);
    this.hostPageView =new HostPageView({
       el: $el,
      'hostObj':this.option.hostObj,
      'pageHostData':pageHostData,
      'parent':self
    })
    this.hostPageView.render();
  }

  CreateHostView.prototype.done=function(){
    var self =this;
    var baseInfo = this.hostPageView.getInfo();
    alert('baseInfo')
    console.log(baseInfo);
    action.saveOrUpHost(baseInfo).then(function(data){
      if(data.error){
        fish.toast('error', data.error.message+"/n"+data.error.data);
      }else{
         fish.toast('info', 'succeed');
         console.log("dfdsfdsfsd");
         console.log(self.option.parent);

         self.option.parent.render();
      }
    })
  }

  CreateHostView.prototype.cancel=function(){
    var self =this;
    self.option.parent.render();
  }
  CreateHostView.prototype.getEmptyHostObject=function(){
    return {
      "ipmi_privilege": "2",
      "maintenance_status": "0",
      "jmx_available": "0",
      "errors_from": "1523354159",
      "tls_psk_identity": "",
      "available": "2",
      "snmp_errors_from": "0",
      "flags": "0",
      "hostid": "10275",
      "description": "description",
      "tls_issuer": "",
      "error": "Get value from agent failed: cannot connect to [[127.0.0.1]:10050]: [111] Connection refused",
      "jmx_errors_from": "0",
      "proxy_hostid": "0",
      "maintenanceid": "0",
      "maintenance_from": "0",
      "ipmi_authtype": "-1",
      "ipmi_username": "",
      "snmp_disable_until": "0",
      "host": "12",
      "tls_psk": "",
      "jmx_error": "",
      "jmx_disable_until": "0",
      "interfaces": [
        {
          "port": "10050",
          "ip": "127.0.0.1",
          "useip": "1",
          "dns": "www.sina.com",
          "hostid": "10275",
          "main": "1",
          "interfaceid": "24",
          "type": "1",
          "bulk": "1"
        },
        {
          "port": "10050",
          "ip": "127.0.0.1",
          "useip": "1",
          "dns": "www.sina.com",
          "hostid": "10275",
          "main": "1",
          "interfaceid": "24",
          "type": "2",
          "bulk": "1"
        }
      ],
      "disable_until": "1523431345",
      "ipmi_errors_from": "0",
      "snmp_error": "",
      "maintenance_type": "0",
      "tls_accept": "1",
      "groups": [
        {
          "internal": "0",
          "groupid": "16",
          "name": "demo group",
          "flags": "0"
        }
      ],
      "snmp_available": "0",
      "templateid": "0",
      "ipmi_available": "0",
      "lastaccess": "0",
      "ipmi_password": "",
      "ipmi_error": "",
      "name": "12",
      "tls_connect": "1",
      "ipmi_disable_until": "0",
      "tls_subject": "",
      "status": "0"
    }

  }
   return CreateHostView;

})
