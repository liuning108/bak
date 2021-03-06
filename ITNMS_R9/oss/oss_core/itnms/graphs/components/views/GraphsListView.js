define([
 "oss_core/itnms/graphs/actions/GraphsAction.js",
 "oss_core/itnms/graphs/components/views/PerviewGrpahView.js",
  "oss_core/itnms/graphs/components/views/CreateGraphsView.js",
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js", "text!oss_core/itnms/graphs/components/views/CreateListView.html",
  "text!oss_core/itnms/graphs/components/views/graphsOp.html",
], function(action,PerviewGrpahView,CreateGraphsView,RootView, util, tpl,graphsOp) {
  var evetMap = [
    {'el': '.graphscallback','type': 'click','handel': 'callback'},
    {'el':'.createGraphs','type':'click','handel':'createGraphs'},
    {'el':'.delGraphs','type':'click','handel':'delGraphsEvent'}
  ]
  var GraphsListView = function(option){
      RootView.call(this,option)
  }
  GraphsListView.prototype = Object.create(RootView.prototype);
  GraphsListView.prototype.constructor = GraphsListView;
    GraphsListView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.graphsOp=fish.compile(graphsOp);
      this.evetMap = evetMap;
    },
    GraphsListView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    GraphsListView.prototype.afterRender= function() {
      var self =this;
     this.loadData(function(d){
       self.groupAndHost(d);
       self.initGraphasGrid();
     })
    }
    GraphsListView.prototype.loadData=function(callback){
      var d ={};
      var fun=null;
     if(!fish.isUndefined(this.option.hostid)){
       fun=action.getHostByid(this.option.hostid);
     }
     //start if
     if(fun!=null){
       fun.then(function(data){
          d.myself={};
          d.myself.id=data.result[0].hostid;
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
    GraphsListView.prototype.initGraphasGrid=function() {
      var self =this;
      var mydata = [
        {name:"Graphs-A","type":"Line","width":"400",'height':"400","gid":1},
        {name:"Graphs-B","type":"Line","width":"400",'height':"400","gid":2},
        {name:"Graphs-C","type":"Line","width":"400",'height':"400","gid":3},
      ];
      var opt = {
        data: mydata,
        height: this.option.tableH,
        pager: true,
        multiselect: true,
        colModel: [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
          }, {
            name: 'type',
            label: 'Type',
            align: 'center',
            formatter:function(cellval, opts, rwdat, _act){
              return "<div class='kdo-on-off-icon'><img width='18' height='18' src='static/oss_core/itnms/graphs/images/line-chart.png'></img></div>"
            }
          }, {
            name: 'width',
            label: 'Width',
            align: 'center',
          }, {
            name: 'height',
            label:'Height',
            align: 'center',
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
      this.$gird.on('click', '.deleteGraph', function() {
        var selrow = self.$gird.grid("getSelection");
        self.delGraphsAction([selrow]);
      })
      this.$gird.on('click','.updateGraph',function(){
          var selrow = self.$gird.grid("getSelection");
          self.createGraphs();
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

      this.$gird.grid("setLabel",
                      "name",
                      "Name",
                      {"text-align":'left'},
                      {});
    },
    GraphsListView.prototype.delGraphsEvent=function(){
      var self =this;
      var selrows = self.$gird.grid("getCheckRows");
      this.delGraphsAction(selrows);
    },
    GraphsListView.prototype.delGraphsAction=function(selrows) {
      var self =this;
      fish.confirm("Delete selected graphs?")
          .result
          .then(function(){
              fish.each(selrows, function(d) {
                 self.$gird.grid("delRowData", d);
              });
          });
    },
    GraphsListView.prototype.groupAndHost=function(d) {
      var self =this;
       var groups=fish.map(d.allGroup.result,function(d) {
         return {
           'name':d.name,
           "value":d.groupid,
         }
       })
       console.log(d);
      this.group = this.$el.find('.comboboxGraphsGroup').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         dataSource: groups
      });
      this.group.on('combobox:change', function () {
         var g=self.group.combobox('getSelectedItem');
         self.changeGropupCombobox(g.value,d.myself)
       });
      if(d.myself){
        console.log("myself");
        console.log(d.myself);
        this.group.combobox('value',d.myself.groupid);
      }
      this.host = this.$el.find('.comboboxGraphsHost').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         dataSource: [
             {name: 'Zabbix Server', value: '1'},
         ],
      });



    },
    GraphsListView.prototype.changeGropupCombobox=function(groudId,myself){
      var self =this;
      var d ={};
      action.getTemplateByGroupId(groudId).then(function(data){
          d.templates=fish.map(data.result,function(d){
               return {
                 'name':d.name,
                 'value':d.templateid
               }
          })//end of map
          return action.getAllHostsByGroupids([groudId+""])
      }).then(function(data){
           d.hosts=fish.map(data.result,function(d){
                return {
                  'name':d.name,
                  'value':d.hostid
                }
           })//end of map
           var allArray =fish.flatten([d.hosts,d.templates])
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
    GraphsListView.prototype.createGraphs=function() {
      var self =this;
      this.createGraphsView= new CreateGraphsView({
         'el':this.$el,
         'cancel':function() {
           self.render();
          },
         'ok':function() {
           self.render();
          },
      })
      this.createGraphsView.render();
    },
    GraphsListView.prototype.callback= function() {
      util.doNotNull(this.option.callback);
    },
    GraphsListView.prototype.perviewGraph=function(){
      var self =this;
      this.perviewGrpahView = new PerviewGrpahView({
        el:self.$el,
        callback:function(){
          self.render();
        }
      });
      this.perviewGrpahView.render();
    }
  return GraphsListView;
});
