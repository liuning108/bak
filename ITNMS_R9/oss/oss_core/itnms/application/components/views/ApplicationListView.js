define([
 "oss_core/itnms/application/components/views/CreateApplicationViewDialog.js",
 "oss_core/itnms/application/actions/ApplicationAction.js",
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js", "text!oss_core/itnms/application/components/views/CreateListView.html",
  "text!oss_core/itnms/application/components/views/graphsOp.html",
], function(CreateApplicationViewDialog,action,RootView, util, tpl,graphsOp) {
  var evetMap = [
    {'el': '.graphscallback','type': 'click','handel': 'callback'},
    {'el':'.createApplication','type':'click','handel':'createApplicationEvent'},
    {'el':'.delApplication','type':'click','handel':'delApplicationEvent'}
  ]
  var ApplicationListView = function(option){
      RootView.call(this,option)
  }
     ApplicationListView.prototype = Object.create(RootView.prototype);
     ApplicationListView.prototype.constructor = ApplicationListView;
     ApplicationListView.prototype.createApplicationEvent=function() {
        var self =this;
        var g=self.host.combobox('getSelectedItem');
        g.gid="NONE";
        g.appName="";
        self.createApplication(g);

     }
    ApplicationListView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.graphsOp=fish.compile(graphsOp);
      this.evetMap = evetMap;
    },
    ApplicationListView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    ApplicationListView.prototype.afterRender= function() {
      var self =this;
     this.loadData(function(d){
       self.groupAndHost(d);
       self.initGraphasGrid();
     })
    }
    ApplicationListView.prototype.loadData=function(callback){
      var d ={};
      var fun=null;
     if(!fish.isUndefined(this.option.hostid)){
       fun=action.getHostByid(this.option.hostid);
     }
     if(!fish.isUndefined(this.option.templateid)){
       fun=action.getTemplate({"id":this.option.templateid+""});
     }
     alert(fun)
     //start if
     if(fun!=null){
       fun.then(function(data){
          d.myself={};
          console.log(data.result[0]);
          d.myself.id=data.result[0].hostid||data.result[0].templateid;
          d.myself.groupid=data.result[0].groups[0].groupid;
         return action.getAllGroup()
       }).then(function(data) {
         d.allGroup= data;
         callback(d);
       });
     }else{
       action.getAllGroup().then(function(data) {
         d.allGroup= data;
         callback(d);
       })
     } //end of if

    }
    ApplicationListView.prototype.initGraphasGrid=function() {
      var self =this;
      var mydata = [];
      var opt = {
        data: mydata,
        height: this.option.tableH,
        pager: true,
        multiselect: true,
        colModel: [
          {
            name: 'hostName',
            label: 'Host/Template',
            align: 'left',
          },
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            formatter:function(cellval, opts, rwdat, _act){
              if (rwdat.tid==null){
                return cellval
              }else{
                return "<i class='appToTemplate glyphicon glyphicon-th-list'></i>"+cellval
              }
            }
          }, {
            name: 'items',
            label: 'Items',
            align: 'left',
            formatter:function(cellval, opts, rwdat, _act){
              return "<span class='appToItems'>"+"Items"+"</span>("+cellval+")"
            }
          },{
            name: 'gid',
            label: '',
            align: "center",
            'title': false,
            formatter: function(cellval, opts, rwdat, _act) {
              return self.graphsOp({id:cellval});
            }
          }
        ]
      };
      this.$gird = this.$el.find('.graphsListGrid').grid(opt);


      this.$gird.on('click', '.appToTemplate', function() {
        var selrow = self.$gird.grid("getSelection");
        self.appToTemplate(selrow);
      })

      this.$gird.on('click', '.appToItems', function() {
        var selrow = self.$gird.grid("getSelection");
        self.appToItems(selrow);
      })
      this.$gird.on('click', '.deleteGraph', function() {
        var selrow = self.$gird.grid("getSelection");
        self.delAction([selrow]);
      })
      this.$gird.on('click','.updateGraph',function(){
          var selrow = self.$gird.grid("getSelection");
          console.log("updateApplication,updateApplication,updateApplication");
          var g= {
             'name':selrow.hostName,
             'value':selrow.hostId,
             'gid':selrow.gid,
             'appName':selrow.name
          }
          self.createApplication(g);
      })
      this.$gird.on('change', '[type="checkbox"]', function() {
        var selrow = self.$gird.grid("getCheckRows");
        if (selrow.length > 0) {
          self.$el.find('.graphsListBtn').show();
        } else {
          self.$el.find('.graphsListBtn').hide();
        }
      })

      this.$gird.on('click', '.previewGraph', function() {
        self.perviewGraph();
      })

      // this.$gird.grid("setLabel",
      //                 "name",
      //                 "Name",
      //                 {"text-align":'left'},
      //                 {});
    },
    ApplicationListView.prototype.delApplicationEvent=function(){
      var self =this;
      var selrows = self.$gird.grid("getCheckRows");
      this.delAction(selrows);
    },
    ApplicationListView.prototype.delAction=function(selrows) {
      var self =this;
      fish.confirm("Delete selected graphs?")
          .result
          .then(function(){
               console.log("delApplciton===2");
               var delIDs=fish.map(selrows,function(row){
                    return row.gid+"";
               })
              action.delApplciton({
                'ids':delIDs
              }).then(function(data){
                if(data.error){
                  fish.toast('warn', 'delete error');
                } else {
                  fish.toast('success', 'success')
                  fish.each(selrows, function(d) {
                     self.$gird.grid("delRowData", d);
                  });
                }
              })

          });
    },
    ApplicationListView.prototype.groupAndHost=function(d) {
      var self =this;
       var groups=fish.map(d.allGroup.result,function(d) {
         return {
           'name':d.name,
           "value":d.groupid,
         }
       })
       if (groups.length>0){
         groups.splice(0,0,{
           name: 'all',
           value: "myALL"
         });
      }
      this.group = this.$el.find('.comboboxGraphsGroup').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         editable: false,
         dataSource: groups
      });

      this.dd=d;
      this.group.on('combobox:change', function () {
         var g=self.group.combobox('getSelectedItem');
         self.changeGropupCombobox(g.value,self.dd.myself)
       });
      if(d.myself){
        console.log("myself");
        console.log(d.myself);
        this.group.combobox('value',d.myself.groupid);
      }
      this.host = this.$el.find('.comboboxGraphsHost').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         editable: false,
         dataSource: [],
      });

        this.host.on('combobox:change', function () {
          var g=self.host.combobox('getSelectedItem');
          if(g){
            self.changeHostCombobox(g.value);
          }
        })



    },
    ApplicationListView.prototype.changeGropupCombobox=function(groudId,myself){
      if(groudId=='myALL'){
        groudId=null;
      }
      var self =this;
      var d ={};
      action.getTemplateByGroupId(groudId).then(function(data){
          d.templates=fish.map(data.result,function(d){
               return {
                 'name':d.name,
                 'value':d.templateid
               }
          })//end of map
          var hostDD=[groudId+""];
          if(groudId==null){
            hostDD=null
          }
          return action.getAllHostsByGroupids(hostDD)
      }).then(function(data){
           d.hosts=fish.map(data.result,function(d){
                return {
                  'name':d.name,
                  'value':d.hostid
                }
           })//end of map
           var allArray =fish.flatten([d.hosts,d.templates])
           if(allArray.length>1){
             allArray.splice(0, 0, {
               name: 'all',
               value: "myALL"
             });
           }
           self.hostg=allArray;
           self.host.combobox({"dataSource":allArray});
           if(myself){
            var choseData=fish.find(allArray,function(d){return d.value==myself.id})

            if(!choseData)choseData=d.hosts[0];
            if(choseData){
              self.host.combobox('value',choseData.value);
             }
           }else{
            var choseData=d.hosts[0];
            if(choseData){
              self.host.combobox('value',choseData.value);
            }
           }

        })//end of getAllHostsByGroupids
    }
    ApplicationListView.prototype.appToTemplate=function(selrow){
      var self =this;
        var tid = selrow.tid;
        action.getSubApplicationInfo({
          "id":tid
        }).then(function(data){
          console.log("getSubApplicationInfogetSubApplicationInfo");
          var info=data.result[0];
          var groupid =info.groups[0].groupid;
          var templateId =info.templateid;
          self.changeCombobox(groupid,templateId);
        })
    }
    ApplicationListView.prototype.changeCombobox=function(gid,id) {
        this.dd.myself.id=id;
        this.group.combobox('value',gid);
    }
    ApplicationListView.prototype.appToItems=function(selrow){
      console.log(selrow);
      alert(selrow);
    }
    ApplicationListView.prototype.createApplication=function(g) {
      var self =this;
      var $el =this.$el;
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
      var createApplicationViewDialog = new CreateApplicationViewDialog();
      createApplicationViewDialog.popup(options, {'data':g}, function() {
            var g=self.host.combobox('getSelectedItem');
            self.loadGridData(g.value);
      });
    },
    ApplicationListView.prototype.callback= function() {
      util.doNotNull(this.option.callback);
    },
    ApplicationListView.prototype.changeHostCombobox=function(id) {
      var self =this;
      if(id=='myALL'){
        this.$el.find('.createApplication').hide();
      }else{
        this.$el.find('.createApplication').show();
      }
      self.loadGridData(id);
    }
    ApplicationListView.prototype.loadGridData=function(id){
      var self =this;
      var ids =id+"";
      if(id=='myALL'){
         var g=self.group.combobox('getSelectedItem');
         if(g.value=='myALL'){
            ids =null;
         }else{
           ids =fish.map(self.hostg,function(d){
                return d.value
            });
         }
      }
       var self =this;
        action.getApplication({
          "hostids":ids,
        }).then(function(data){
          console.log(data);
           var gridData=fish.map(data.result,function(d){
              var itemCount = 0;
              if(d.items){
                itemCount = d.items.length;
              }
              var tid =null;
              if(d.templateids.length>0){
                tid = d.templateids[0];
              }
              return {
                'hostId':d.host.hostid,
                'hostName':d.host.name,
                'name':d.name,
                "gid":d.applicationid,
                "items":itemCount,
                "tid":tid
              }
           });
           self.$gird.grid("reloadData", gridData);
        });
    }
    ApplicationListView.prototype.perviewGraph=function(){
      var self =this;
      this.perviewGrpahView = new PerviewGrpahView({
        el:self.$el,
        callback:function(){
          self.render();
        }
      });
      this.perviewGrpahView.render();
    }
  return ApplicationListView;
});
