define([
  "oss_core/itnms/host/actions/HostAction",
  "oss_core/itnms/host/components/views/HostPageView.js",
  "text!oss_core/itnms/host/components/views/createHostView.html",
  "oss_core/itnms/host/components/kdoTabs/KdoTabs.js",
  "oss_core/itnms/host/components/views/TemplatePageView.js",
  "oss_core/itnms/host/components/views/MacroPageView.js",
  "oss_core/itnms/host/components/views/InventoryPageView.js"
], function(action, HostPageView, tpl, KdoTabs, TemplatePageView, MacroPageView, InventoryPageView) {

  var CreateHostView = function(option) {
      this.option = option;
      if (!this.option.hostObj) {
        this.option.hostObj = this.getEmptyHostObject()
      }
      this.$el = $(this.option.el);
      this.tpl = fish.compile(tpl);
    }
    CreateHostView.prototype.render = function() {
      this.remove();
      var $el = $(this.option.el);
      $el.html(this.tpl())
      this.afterRender()
    }
    CreateHostView.prototype.remove = function() {
      $(this.option.el).html("");
    }
    CreateHostView.prototype.afterRender = function() {
      var self = this;
      var $el = $(this.option.el);
      var kdoTabs = new KdoTabs({
        "el": $el.find('.kdo-right-page-cotent'),
        "data": [
          {
            name: '监控点',
            'id': 'hostPage',
            view: function($el) {
              self.HostPage($el)
            }
          }, {
            name: '模板',
            'id': 'templPage',
            view: function($el) {
              self.TemplatePage($el)
            }
          }, {
            name: '宏',
            'id': 'macroPage',
            view: function($el) {
              self.MacroPage($el)
            }
          }, {
            name: '资产信息',
            'id': 'propertyPage',
            view: function($el) {
              self.InventoryPage($el)
            }
          }
        ],
        startPage: 'hostPage',
        // isMore:true,
        // moreTitle:'..更多',
        // moreData:[
        //   {name:'应用1','id':'app1' ,view:function($el){}},
        //   {name:'应用2','id':'app2',view:function($el){}},
        // ]
      });
      kdoTabs.render();
    }
    CreateHostView.prototype.MacroPage = function($el) {
      if (this.macroPageView)
        return;
      var self = this;
      this.macroPageView = new MacroPageView({
        el: $el,
        'macros': this.option.hostObj.macros,
        'cancel': function() {
          self.cancel();
        },
        'ok': function() {
          self.done();
        }
      })
      this.macroPageView.render();

    },
    CreateHostView.prototype.InventoryPage = function($el) {
      if (this.inventoryPageView)
        return;
      var self = this;
      this.inventoryPageView = new InventoryPageView({
        el: $el,
        'cancel':function(){
          self.cancel();
        },
        'ok':function(){
          self.done();
        },
        "info":self.option.hostObj.inventory,
      });

      this.inventoryPageView.render();

    }
    CreateHostView.prototype.HostPage = function($el) {
      if (this.hostPageView)
        return;
      var self = this;
      var pageHostData = {}
      action.getCategoryTree().then(function(treeData) {
        pageHostData.treeData = treeData;
        return action.getAllProxy()
      }).then(function(proxyData) {
        pageHostData.proxyData = proxyData;
        return action.getAllGroup()
      }).then(function(allGroup) {
        pageHostData.allGroup = allGroup;
        self.renderHostPage(pageHostData, $el)
      })
    }
    CreateHostView.prototype.TemplatePage = function($el) {
      if (this.templatePageView)
        return;
      var self = this;
      this.templatePageView = new TemplatePageView({
        el: $el,
        positionEL: self.$el,
        bisId:self.option.bisId,
        'templates': this.option.hostObj.parentTemplates,
        'cancel': function() {
          self.cancel();
        },
        'ok': function() {
          self.done();
        }
      })
      this.templatePageView.render();
    }
    CreateHostView.prototype.renderHostPage = function(pageHostData, $el) {
      var self = this;
      console.log(pageHostData);
      this.hostPageView = new HostPageView({el: $el, 'hostObj': this.option.hostObj, 'pageHostData': pageHostData, 'parent': self})
      this.hostPageView.render();
    }
    CreateHostView.prototype.done = function() {
      var self = this;
      if (!this.hostPageView.verify())
        return;
      var baseInfo = this.hostPageView.getInfo();
      if (this.templatePageView) {
        var templatesInfo = this.templatePageView.getInfo();
        baseInfo.templates = templatesInfo.templates;
        baseInfo.templates_clear = templatesInfo.templates_clear;
      } else {
        baseInfo.templates = null;
        baseInfo.templates_clear = null;
      }
      if (this.macroPageView) {
        baseInfo.macros = this.macroPageView.getInfo();
      }
      if(this.inventoryPageView){
        var inventoryInfo = this.inventoryPageView.getInfo();
        baseInfo.inventory_mode=inventoryInfo.inventory_mode;
        baseInfo.inventory=inventoryInfo.inventory;
      }
      action.saveOrUpHost(baseInfo).then(function(data) {
        if (data.error) {
          fish.toast('warn', data.error.message + " : " + data.error.data);
        } else {
          fish.toast('info', 'succeed');
          self.option.parent.newRender();
        }
      })
    }
    CreateHostView.prototype.cancel = function() {
      var self = this;
      self.option.parent.render();
    }
    CreateHostView.prototype.getEmptyHostObject = function() {
      return {
        "ipmi_privilege": "2",
        "maintenance_status": "0",
        "jmx_available": "0",
        "errors_from": "",
        "tls_psk_identity": "",
        "available": "2",
        "snmp_errors_from": "0",
        "flags": "0",
        "hostid": "none",
        "description": "",
        "tls_issuer": "",
        "error": "",
        "jmx_errors_from": "0",
        "proxy_hostid": "0",
        "maintenanceid": "0",
        "maintenance_from": "0",
        "ipmi_authtype": "-1",
        "ipmi_username": "",
        "snmp_disable_until": "0",
        "host": "",
        "tls_psk": "",
        "jmx_error": "",
        "jmx_disable_until": "0",
        "macros": [],
        "interfaces": [
          {
            "port": "10050",
            "ip": "127.0.0.1",
            "useip": "1",
            "dns": "",
            "main": "1",
            "type": "1"
          }
        ],
        "parentTemplates": [],
        "disable_until": "1523431345",
        "ipmi_errors_from": "0",
        "snmp_error": "",
        "maintenance_type": "0",
        "tls_accept": "1",
        "groups": [],
        "snmp_available": "0",
        "templateid": "0",
        "ipmi_available": "0",
        "lastaccess": "0",
        "ipmi_password": "",
        "ipmi_error": "",
        "name": "",
        "tls_connect": "",
        "ipmi_disable_until": "0",
        "tls_subject": "",
        "status": "0",
        inventory:{
                    alias:"",
                    asset_tag:"",
                    chassis:"",
                    contact:"",
                    contract_number:"",
                    date_hw_decomm:"",
                    date_hw_expiry:"",
                    date_hw_install:"",
                    date_hw_purchase:"",
                    deployment_status:"",
                    hardware:"",
                    hardware_full:"",
                    host_netmask:"",
                    host_networks:"",
                    host_router:"",
                    hw_arch:"",
                    installer_name:"",
                    inventory_mode:"-1",
                    location:"",
                    location_lat:"",
                    location_lon:"",
                    macaddress_a:"",
                    macaddress_b:"",
                    model:"",
                    name:"",
                    notes:"",
                    oob_ip:"",
                    oob_netmask:"",
                    oob_router:"",
                    os:"",
                    os_full:"",
                    os_short:"",
                    poc_1_cell:"",
                    poc_1_email:"",
                    poc_1_name:"",
                    poc_1_notes:"",
                    poc_1_phone_a:"",
                    poc_1_phone_b:"",
                    poc_1_screen:"",
                    poc_2_cell:"",
                    poc_2_email:"",
                    poc_2_name:"",
                    poc_2_notes:"",
                    poc_2_phone_a:"",
                    poc_2_phone_b:"",
                    poc_2_screen:"",
                    serialno_a:"",
                    serialno_b:"",
                    site_address_a:"",
                    site_address_b:"",
                    site_address_c:"",
                    site_city:"",
                    site_country:"",
                    site_notes:"",
                    site_rack:"",
                    site_state:"",
                    site_zip:"",
                    software:"",
                    software_app_a:"",
                    software_app_b:"",
                    software_app_c:"",
                    software_app_d:"",
                    software_app_e:"",
                    software_full:"",
                    tag:"",
                    type:"",
                    type_full:"",
                    url_a:"",
                    url_b:"",
                    url_c:"",
                    vendor:"",
                  }
      }

    }
    return CreateHostView;

  })
