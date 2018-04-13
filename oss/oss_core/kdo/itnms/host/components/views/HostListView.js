define([
  "oss_core/kdo/itnms/host/components/views/FilterViewDialog.js",
  "oss_core/kdo/itnms/host/actions/HostAction",
  "text!oss_core/kdo/itnms/host/components/views/hostLisView.html",
  "text!oss_core/kdo/itnms/host/components/views/filterHostView.html",
  "oss_core/kdo/itnms/host/components/views/CreateHostView.js",
  "text!oss_core/kdo/itnms/host/components/views/hostOp.html"
], function(FilterViewDialog, action, tpl, filterTpl, CreateHostView, hostOp) {
  var HostListView = function(option) {
      this.option = option;
      if (this.option.groups.length > 1) {
        this.option.groups.splice(0, 0, {
          name: 'ALL',
          groupid: "myALL"
        });
      }
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
      var $el = $(this.option.el);
      $el.html(this.tpl());

      this.afterRender()
    }
    HostListView.prototype.remove = function() {
      if (this.$gird){
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

    }
    HostListView.prototype.createFilterEvent = function() {
      var $el = $(this.option.el);
      var self = this;
      $el.find('.filterHostList').off('click').on('click', function() {
        var options = {
          height: $el.height(),
          width: 350,
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
      $el.find('.kdoPageBtn').off('click').on('click',function() {
        	var selrow =$el.find(".hostListGrid").grid("getCheckRows");
          var evt =   $(this).data('bis')
          var ids =fish.map(selrow,function(d){return {"hostid":d.id} })
          if(ids.length>0){
            self[evt](ids,selrow)
          }
      })

    }

    HostListView.prototype.changestatus=function(hosts,selrow,status,message){
      var self =this;
      action.changeHostStatus({
        'hosts':hosts,
        'status':status+""
      }).then(function(){
        var newSelrow=fish.each(selrow,function(d){
              d.state=status;
              self.$gird.grid("setRowData",d);
         });
         self.$gird.grid("setAllCheckRows",false);
         fish.toast('success',message);

      })
    }
    HostListView.prototype.enableHosts=function(hosts,selrow){
      var self =this;
      fish.confirm('Enable selected hosts?').result.then(function(){
        self.changestatus(hosts,selrow,0,'Hosts enabled');
      })
    }

    HostListView.prototype.disHosts=function(hosts,selrow){
        var self =this;
      fish.confirm('Disable selected hosts?').result.then(function() {
        self.changestatus(hosts,selrow,1,'Hosts disabled');
      })
    }

    HostListView.prototype.delHosts=function(hosts,selrow){
      var self=this;
      var ids = fish.map(hosts,function(d){return ""+d.id});
      fish.confirm('Delete selected hosts?').result.then(function() {
           action.deleteHost({'ids':ids}).then(function(){
             fish.toast('success','Hosts deleted');
             self.loadData();
           })
       });
    }
    HostListView.prototype.createHostViewRender=function(d) {
      var self =this;
      var $el = $(this.option.el);
      var createHostView = new CreateHostView({
          el: $el,
         "parent":self,
         "hostObj":d
       })
      createHostView.render();
    }
    HostListView.prototype.createListTable = function() {
      var self = this;
      var $el = $(this.option.el);
      var tableH = this.option.tableH;
      var $area=$el.find('.filterArea');
      var $comboboxGrupids = $el.find('.comboboxGrupids').combobox({editable: false, dataTextField: 'name', dataValueField: 'groupid', dataSource: self.option.groups});
      var groupid = "gid_none";
      $area.hide();
      if (self.option.groups.length > 0) {
        groupid = self.option.groups[0].groupid;
        $area.show();
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
				multiselect:true,
        gridComplete: function() {

          $el.find('.hostListGrid').find('.hostOp').parent().css('overflow', "visible");
          if($el.find('.hostListGrid').find('.hostOp').find(".dropdown").length<=0) return;
          $el.find('.hostListGrid').find('.hostOp').find('.hostRemove').off('click').on('click',function(){
            self.removeHost($(this).data('id'));
          })
          $el.find('.hostListGrid').find('.hostOp').find('.hostUpdate').off('click').on('click',function(){
            self.hostUpdate($(this).data('id'));
          })

           $(".dropdown").on("dropdown:open",function () {
              var $ul = $(this).children(".dropdown-menu");
              var $button = $(this).children(".dropdown-toggle");
              var ulOffset = $ul.offset();
              var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
              var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
              if (spaceDown <50 && (spaceUp >= 0 || spaceUp > spaceDown))
                $(this).addClass("dropup");
          })
          $(".dropdown").on("dropdown:close", function() {
              $(this).removeClass("dropup");
          });

          $el.find(".hostListGrid").find('[type="checkbox"]').bind("change", function(e){
							var selrow =$el.find(".hostListGrid").grid("getCheckRows");
              if(selrow.length>0){
                $el.find('.hostListBtn').show();
              }else{
                $el.find('.hostListBtn').hide();
              }
					});
        },
        colModel: [
          {
            name: 'name',
            label: '名称',
            align: 'center'
          }, {
            name: 'interfaces',
            label: '接口',
            align: 'center'
          }, {
            name: 'state',
            label: '状态',
            align: 'center',
            formatter: function(cellval, opts, rwdat, _act) {
              if (cellval === 0) {
                return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/kdo/itnms/host/images/right.png'></img><span>启用</span></div>"
              } else {
                return "<div class='kdo-on-off-icon'><img width='16' height='16' src='static/oss_core/kdo/itnms/host/images/error.png'></img><span>禁用</span></div>"
              }
            }
          }, {
            name: 'available',
            label: '可用性',
            align: 'center',
            formatter: function(cellval, opts, rwdat, _act) {
              var starts = fish.map(cellval, function(d) {
                if (d.value === 1) {
                  return "<img width='16' height='16' src='static/oss_core/kdo/itnms/host/images/start2.png' title='" + d.message + "' style='cursor : pointer'></img>"
                } else {
                  return "<img width='16' height='16' src='static/oss_core/kdo/itnms/host/images/start1.png' title='" + d.message + "' style='cursor : pointer'></img>"
                }
              }) //end of map
              return starts.join('');
            }
          }, {
            name: 'des',
            label: '描述'
          }, {
            name: 'id',
            label: '',
            align: "center",
            'title': false,
            formatter: function(cellval, opts, rwdat, _act) {
              return self.hostOp({'id':cellval});
            }
          }

        ]
      };

      this.$gird = $el.find('.hostListGrid').grid(opt);
      self.loadTableData(groupid);

    }

    HostListView.prototype.loadTableData = function(groupid) {
      if (groupid == 'gis_none')
        return;
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

      } else {
        groudids.push(groupid);
      }
      this.option._groudids = groudids;
      self.loadData();
    }

    HostListView.prototype.loadData = function() {
      var self =this;
      action.getAllHostsByGroupids({'ids': this.option._groudids, "search": self.option._filterParam}).then(function(data) {
        console.log("getAllHostsByGroupids");
        console.log(data.result);
        var result = fish.map(data.result, function(d) {
          var interfaceObj = fish.first(d.interfaces);
          return {
            name: d.name,
            state: Number(d.status),
            interfaces: interfaceObj.ip + ':' + interfaceObj.port,
            id: d.hostid,
            available: [
              {
                value: Number(d.available),
                message: 'ZBX :' + d.error
              }, {
                value: Number(d.ipmi_available),
                message: 'IPMI :' + d.ipmi_error
              }, {
                value: Number(d.jmx_available),
                message: 'JMX :' + d.jmx_error
              }, {
                value: Number(d.snmp_available),
                message: 'SNMP :' + d.snmp_error
              }
            ],
            des: d.description
          }
        })
        self.$gird.grid("reloadData", result);
      })

    }

    HostListView.prototype.removeHost=function(id) {
      var self=this;
      var sid=""+id
      fish.confirm('Delete selected hosts?').result.then(function() {
           action.deleteHost({'ids':[sid]}).then(function(){
             fish.toast('success','Host deleted');
             self.loadData();
           })
       });

    }

    HostListView.prototype.hostUpdate=function(id) {
        var self =this;
        var sid=""+id
       action.getHostByid(sid).then(function(data) {
         if(data.result.length>0){
           var hostObj = data.result[0];
           self.createHostViewRender(hostObj)
         }
       })

    }


    return HostListView;

  })
