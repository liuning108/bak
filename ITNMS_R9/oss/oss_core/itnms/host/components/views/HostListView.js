define([
  "oss_core/itnms/host/components/kdoPickColor/PickColorViewDialog.js",
  "oss_core/itnms/discoverymgr/views/DiscoveryMgrView",
  'oss_core/itnms/templatemgr/views/TemplateMgrView',
  "oss_core/itnms/trigger/components/views/triggerListView.js",
  "oss_core/itnms/graphs/components/views/GraphsListView",
  "oss_core/itnms/items/components/views/ItemListView.js",
  'i18n!oss_core/itnms/host/i18n/host',
  "oss_core/itnms/host/components/views/FilterViewDialog.js",
  "oss_core/itnms/host/actions/HostAction",
  "text!oss_core/itnms/host/components/views/hostLisView.html",
  "text!oss_core/itnms/host/components/views/filterHostView.html",
  "oss_core/itnms/host/components/views/CreateHostView.js",
  "text!oss_core/itnms/host/components/views/hostOp.html"

], function(PickColorViewDialog,DiscoveryMgrView,TemplateMgrView,TriggerListView,GraphsListView,ItemListView, i18nData, FilterViewDialog, action, tpl, filterTpl, CreateHostView, hostOp) {
  var HostListView = function(option) {
      this.option = option;
      this.option._groudids = [];
      this.option._filterParam = {
        name: '',
        ip: '',
        dns: '',
        port: ''
      };
      this.tpl = fish.compile(tpl);
      this.filterTpl = fish.compile(filterTpl);
      this.hostOp = fish.compile(hostOp);
    }
    HostListView.prototype.render = function() {
      this.remove();
      if (this.option.groups.length > 1) {
        this.option.groups.splice(0, 0, {
          name: i18nData.ALL,
          groupid: "myALL"
        });
      }
      var $el = $(this.option.el);
      $el.html(this.tpl(i18nData));

      this.afterRender()
    }
    HostListView.prototype.remove = function() {
      if (this.$gird) {
        this.$gird.remove();
      }
      $(this.option.el).html("");
    }
    HostListView.prototype.afterRender = function() {

      var self = this;
      var $el = $(this.option.el);
      self.createHostEvent();
      self.createListTable();
      self.createFilterEvent();
      if (self.option.callback) {
        $el.find('.hostcallback').off('click').on('click', function() {
          self.option.callback();
        })
      } else {
        $el.find('.hostcallback').hide();
      }

    }
    HostListView.prototype.createFilterEvent = function() {
      var $el = $(this.option.el);
      var self = this;
      $el.find('.filterHostList').off('click').on('click', function() {
        var options = {
          height: $el.height(),
          width: ($el.width() / 2.5),
          modal: true,
          draggable: false,
          autoResizable: false,
          position: {
            'of': $el,
            'my': "top",
            'at': "right" + " " + "top",
            collision: "fit"
          }
        };

        var filterViewDialog = new FilterViewDialog();
        filterViewDialog.popup(options, self.option._filterParam, function(param) {
          self.option._filterParam = param;
          self.loadData();

        });

      });
    },
    HostListView.prototype.createHostEvent = function() {
      var self = this;
      var $el = $(this.option.el);
      $el.find('.createHost').off('click').on('click', function() {
        self.remove();
        self.option._filterParam = {
          name: '',
          ip: '',
          dns: '',
          port: ''
        };
        self.createHostViewRender();
      })
      $el.find('.kdoPageBtn').off('click').on('click', function() {
        var selrow = $el.find(".hostListGrid").grid("getCheckRows");
        var evt = $(this).data('bis')
        var ids = fish.map(selrow, function(d) {
          return {"hostid": d.id}
        })
        if (ids.length > 0) {
          self[evt](ids, selrow)
        }
      })
      $el.find('.hostImport').off('click').on('click',function() {
          self.hostImport();
      })

    }
    HostListView.prototype.hostImport=function(){
      // var $el = $(this.option.el);
      // var self = this;
      //  var options = {
      //    height: 300,
      //    width: 199,
      //    modal: true,
      //    draggable: false,
      //    autoResizable: false,
      //    position: {
      //      'of': $el,
      //    }
      //  };
      //
      //  var pickColorView = new PickColorViewDialog();
      //  pickColorView.popup(options, {"color":"#F35352"}, function(color) {
      //    alert(color);
      //  });
    }

    HostListView.prototype.changestatus = function(hosts, selrow, status, message) {
      var self = this;
      action.changeHostStatus({
        'hosts': hosts,
        'status': status + ""
      }).then(function() {
        var newSelrow = fish.each(selrow, function(d) {
          d.state = status;
          self.$gird.grid("setRowData", d);
        });
        self.$gird.grid("setAllCheckRows", false);
        fish.toast('success', message);

      })
    }
    HostListView.prototype.enableHosts = function(hosts, selrow) {
      var self = this;
      fish.confirm('Enable selected hosts?').result.then(function() {
        self.changestatus(hosts, selrow, 0, 'Hosts enabled');
      })
    }
    HostListView.prototype.disHosts = function(hosts, selrow) {
      var self = this;
      fish.confirm('Disable selected hosts?').result.then(function() {
        self.changestatus(hosts, selrow, 1, 'Hosts disabled');
      })
    }
    HostListView.prototype.delHosts = function(hosts, selrow) {
      var self = this;
      var ids = fish.map(hosts, function(d) {
        return "" + d.hostid
      });
      fish.confirm('Delete selected hosts?').result.then(function() {
        action.deleteHost({'ids': ids}).then(function() {
          fish.toast('success', 'Hosts deleted');
          self.loadData();
        })
      });
    }
    HostListView.prototype.createHostViewRender = function(d) {
      var self = this;
      var $el = $(this.option.el);
      var createHostView = new CreateHostView({el: $el, "parent": self, "hostObj": d, 'bisId': self.option.bisId})
      createHostView.render();
    }
    HostListView.prototype.createListTable = function() {
      var self = this;
      var $el = $(this.option.el);
      var tableH = this.option.tableH;
      var $kdoGrupids = $el.find('.kdoGrupids');
      var $comboboxGrupids = $el.find('.comboboxGrupids').combobox({editable: false, dataTextField: 'name', dataValueField: 'groupid', dataSource: self.option.groups});
      var groupid = "gid_none";
      $kdoGrupids.hide();
      if (self.option.groups.length > 0) {
        groupid = self.option.groups[0].groupid;
        $kdoGrupids.show();
      }
      $comboboxGrupids.combobox('value', groupid);
      $comboboxGrupids.on('combobox:change', function() {
        console.log("Ddd");
        var d = $comboboxGrupids.combobox('getSelectedItem')
        console.log(d);
        self.loadTableData(d.groupid);
      });
      var mydata = [];
      var opt = {
        data: mydata,
        height: tableH,
        pager: true,
        multiselect: true,
        gridComplete: function() {
          $el.find('.hostListGrid').find('.hostOp').parent().css('overflow', "visible");
          if ($el.find('.hostListGrid').find('.hostOp').find(".dropdown").length <= 0)
            return;
          $el.find('[data-toggle="error-tooltip"]').tooltip({template: '<div class="tooltip error-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'})
          $el.find('.hostListGrid').find('.hostOp').find('.hostRemove').off('click').on('click', function() {
            self.removeHost($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.toTrigger').off('click').on('click', function() {
            self.toTrigger($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.toTemplate').off('click').on('click', function() {
            self.toTemplate($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.toApplication').off('click').on('click', function() {
            self.toApplication($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.toDiscovery').off('click').on('click', function() {
            self.toDiscovery($(this).data('id'));
          })




          $el.find('.hostListGrid').find('.hostOp').find('.hostUpdate').off('click').on('click', function() {
            self.hostUpdate($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.hostItems').off('click').on('click', function() {
            self.hostItems($(this).data('id'));
          })

          $el.find('.hostListGrid').find('.hostOp').find('.hostGraphs').off('click').on('click', function() {
            self.hostGraphs($(this).data('id'));
          })

          $(".dropdown").on("dropdown:open", function() {
            var $ul = $(this).children(".dropdown-menu");
            var $button = $(this).children(".dropdown-toggle");
            var ulOffset = $ul.offset();
            var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
            var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
            if (spaceDown < 50 && (spaceUp >= 0 || spaceUp > spaceDown))
              $(this).addClass("dropup");
            }
          )
          $(".dropdown").on("dropdown:close", function() {
            $(this).removeClass("dropup");
          });

          $el.find(".hostListGrid").find('[type="checkbox"]').bind("change", function(e) {
            var selrow = $el.find(".hostListGrid").grid("getCheckRows");
            if (selrow.length > 0) {
              $el.find('.hostListBtn').show();
            } else {
              $el.find('.hostListBtn').hide();
            }
          });
        },
        colModel: [
          {
            name: 'name',
            label: i18nData.NAME,
            align: 'left'
          }, {
            name: 'interfaces',
            label: i18nData.INTERFACE,
            align: 'center'
          }, {
            name: 'state',
            label: i18nData.STATUS,
            align: 'center',
            formatter: function(cellval, opts, rwdat, _act) {
              if (cellval === 0) {
                return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/itnms/host/images/right.png'></img><span>"+i18nData.ON+"</span></div>"
              } else {
                return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/itnms/host/images/error.png'></img><span>"+i18nData.OFF+"</span></div>"
              }
            }
          }, {
            name: 'available',
            label: i18nData.AVAILABILITY,
            align: 'center',
            formatter: function(cellval, opts, rwdat, _act) {
              var starts = fish.map(cellval, function(d) {
                console.log("dnfkdsfkdskfsdjfksdklfjsdlk");
                console.log(d);
                if (d.value === 1) {
                  return "<span class='kdo-status' title='"+ d.message+"'>"+d.name+"</span>"
                } else if (d.value === 0) {
                  return "<span class='kdo-status' title='"+ d.message+"'>"+d.name+"</span>"
                } else if (d.value === 2) {
                  return "<span  data-toggle='error-tooltip'  data-placement='bottom' class='kdo-status kdo-status-red' title='"+ d.message+"'>"+d.name+"</span>"
                }
              }) //end of map
              return starts.join('');
            }
          }, {
            name: 'des',
            label: i18nData.DESCRIPTION
          }, {
            name: 'id',
            label: '',
            align: "center",
            'title': false,
            formatter: function(cellval, opts, rwdat, _act) {
              return self.hostOp({'id': cellval,"i18nData":i18nData});
            }
          }

        ]
      };
      this.$gird = $el.find('.hostListGrid').grid(opt);
      this.$gird.grid("setLabel",
                      "name",
                      i18nData.NAME,
                      {"text-align":'left'},
                      {});
      self.loadTableData(groupid);
    }
    HostListView.prototype.toDiscovery=function(id){
      var self =this;
      var $el = $(this.option.el);
       var option = {
					el: $el,
					hostid: id,
					callback: function(){
					 self.render();
					}
				};
				self.discoveryView = new DiscoveryMgrView(option);
				self.discoveryView.render();
    }
    HostListView.prototype.toTemplate=function (id) {
      var  self =this;
      var $el = $(this.option.el);
       var option = {
					el: $el,
					hostid: id,
					callback: function(){
					 self.render();
					}
				};
				self.templateView = new TemplateMgrView(option);
				self.templateView.render();
    }
    HostListView.prototype.toTrigger=function(id) {
      var  self =this;
      var $el = $(this.option.el);
       this.triggerListView= new TriggerListView({
          'el':$el,
          'hostids':id,
           callback:function(){
                 self.render();
           }
      })
       this.triggerListView.render();
    }
    HostListView.prototype.toApplication=function(hostId){
      var $el = $(this.option.el);
      var self =this;
      var tableH = this.option.tableH;
      require([
        "oss_core/itnms/application/components/views/ApplicationListView"],
      function(ApplicationListView){
        self.applicationListView = new ApplicationListView({
           el: $el,
          'hostid':hostId,
           tableH: tableH,
           callback:function() {
             self.render();
           }
        })
        self.applicationListView.render();
      });

    }
    HostListView.prototype.hostGraphs=function(hostId){
        var $el = $(this.option.el);
        var self =this;
        var tableH = this.option.tableH;
        this.graphsListView = new GraphsListView({
           el: $el,
          'hostid':hostId,
           tableH: tableH,
           callback:function() {
             self.render();
           }
        })
        this.graphsListView.render();
    }
    HostListView.prototype.hostItems = function(hostId) {
      var $el = $(this.option.el);
      var self = this;
      this.itemListView = new ItemListView({
        'el': $el,
        'hostids': hostId,
        callback: function() {
          self.render();
        }
      })
      this.itemListView.render();
    }
    HostListView.prototype.loadTableData = function(groupid) {
      var self = this;
      var groudids = [];
      if (groupid == 'myALL') {
        var fiters = fish.filter(this.option.groups, function(d) {
          if (d.groupid != 'myALL') {
            return true;
          }
        });
        groudids = fish.map(fiters, function(d) {
          return d.groupid
        });
      } else if (groupid == 'gid_none') {
        groudids = null;
        if (!this.option.templateids) {
          groudids = [];
        }
      } else {
        groudids.push(groupid);
      }
      console.log("=====groudids=====");
      console.log(groudids);
      this.option._groudids = groudids;
      self.loadData();
    }
    HostListView.prototype.loadData = function() {
      var self = this;
      var extendParam = {
        "templateids": self.option.templateids
      }
      action.getAllHostsByGroupids({'ids': this.option._groudids, "search": self.option._filterParam, "extendParam": extendParam}).then(function(data) {
        console.log("getAllHostsByGroupids");
        console.log(data.result);
        var result = fish.map(data.result, function(d) {
          var interfaceObj = fish.first(d.interfaces);
          if (!interfaceObj)
            interfaceObj = {
              "ip": "",
              port: ""
            }
          return {
            name: d.name,
            state: Number(d.status),
            interfaces: interfaceObj.ip + ':' + interfaceObj.port,
            id: d.hostid,
            available: [
              {
                value: Number(d.available),
                message: 'ITNMS :' + d.error,
                name:"ITNMS",
              }, {
                value: Number(d.ipmi_available),
                message: 'IPMI :' + d.ipmi_error,
                name:"IPMI",
              }, {
                value: Number(d.jmx_available),
                message: 'JMX :' + d.jmx_error,
                name:"JMX",
              }, {
                value: Number(d.snmp_available),
                message: 'SNMP :' + d.snmp_error,
                name:"SNMP",
              }
            ],
            des: d.description
          }
        })
        self.$gird.grid("reloadData", result);
      })

    }
    HostListView.prototype.removeHost = function(id) {
      var self = this;
      var sid = "" + id
      fish.confirm('Delete selected hosts?').result.then(function() {
        action.deleteHost({'ids': [sid]}).then(function() {
          fish.toast('success', 'Host deleted');
          self.loadData();
        })
      });

    }
    HostListView.prototype.hostUpdate = function(id) {
      var self = this;
      var sid = "" + id
      action.getHostByid(sid).then(function(data) {
        if (data.result.length > 0) {
          var hostObj = data.result[0];
          self.createHostViewRender(hostObj)
        }
      })

    }
    HostListView.prototype.newRender = function() {
      var self = this;
      var id = self.option.bisId
      action.getGroupidsBySubNo(id).then(function(datas) {
        console.log("getGroupidsBySubNofdsfdsf,msdbfbsdbfmds");
        console.log(datas);
        var groups = fish.map(datas.result, function(d) {
          return {'groupid': d.groupid, 'name': d.name}
        }) //end of maps
        self.option.groups = groups;
        self.render();
      });
    }
    return HostListView;

  })
