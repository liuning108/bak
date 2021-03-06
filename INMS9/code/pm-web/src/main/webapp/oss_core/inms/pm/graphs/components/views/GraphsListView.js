define([
  "oss_core/inms/pm/graphs/actions/GraphsAction.js",
  "oss_core/inms/pm/graphs/components/views/PerviewGrpahView.js",
  "oss_core/inms/pm/graphs/components/views/CreateGraphsView.js",
  "oss_core/inms/pm/graphs/components/views/RootView.js",
  "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/views/CreateListView.html",
  "text!oss_core/inms/pm/graphs/components/views/graphsOp.html"
], function(action, PerviewGrpahView, CreateGraphsView, RootView, util, tpl, graphsOp) {
  var evetMap = [
    {
      'el': '.graphscallback',
      'type': 'click',
      'handel': 'callback'
    }, {
      'el': '.createGraphs',
      'type': 'click',
      'handel': 'createGraphs'
    }, {
      'el': '.delGraphs',
      'type': 'click',
      'handel': 'delGraphsEvent'
    }
  ]
  var GraphsListView = function(option) {
    RootView.call(this, option)
  }
  GraphsListView.prototype = Object.create(RootView.prototype);
  GraphsListView.prototype.constructor = GraphsListView;
  GraphsListView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.graphsOp = fish.compile(graphsOp);
    this.evetMap = evetMap;
  },
  GraphsListView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  GraphsListView.prototype.afterRender = function() {
    var self = this;
    this.loadData(function(d) {
      self.groupAndHost(d);
      self.initGraphasGrid();
    })
  }
  GraphsListView.prototype.loadData = function(callback) {
    var d = {
      'allGroup': {}
    };
    var id = this.option.id;
    action.getTemplateById(id).then(function(data) {
      d.templateObj = data.result[0];
      return action.getAllGroup()
    }).then(function(data) {
      console.log("getAllGroup",data.result);
      d.allGroup.result = data.result;
      console.log("enter GraphsListView init Data :", d);
      callback(d);
    })
  }
  GraphsListView.prototype.initGraphasGrid = function() {
    var self = this;
    var mydata = [
      // {
      //   catagory: '设备建康',
      //   name: "Graphs-A",
      //   "type": "Line",
      //   "desc": "",
      //   "gid": 1
      // }, {
      //   catagory: '设备建康',
      //   name: "Graphs-B",
      //   "type": "Line",
      //   "desc": "",
      //   "gid": 2
      // }, {
      //   catagory: '设备建康',
      //   name: "Graphs-C",
      //   "type": "Line",
      //   "desc": "",
      //   "gid": 3
      // }
    ];
    var opt = {
      data: mydata,
      height: this.option.tableH,
      pager: true,
      multiselect: true,
      colModel: [
        {
          name: 'catagory',
          label: '归类',
          align: 'left'
        }, {
          name: 'name',
          label: '名称',
          align: 'left'
        }, {
          name: 'type',
          label: '类型',
          align: 'center',
          formatter: function(cellval, opts, rwdat, _act) {
             return "<div class='kdo-on-off-icon'><img width='18' height='18' src='static/oss_core/inms/pm/graphs/images/"+cellval+".png'></img></div>"
          }
        }, {
          name: 'desc',
          label: '描述',
          align: 'center'
        },{
          name: 'gid',
          label: '',
          align: "center",
          'title': false,
          formatter: function(cellval, opts, rwdat, _act) {
            return self.graphsOp({id: cellval});
          }
        }
      ]
    };
    this.$gird = this.$el.find('.graphsListGrid').grid(opt);
    this.$gird.on('click', '.deleteGraph', function() {
      var selrow = self.$gird.grid("getSelection");
      self.delGraphsAction([selrow]);
    })
    this.$gird.on('click', '.updateGraph', function() {
      var selrow = self.$gird.grid("getSelection");
      self.updateGraphs(selrow);
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
      var selrow = self.$gird.grid("getSelection");
      self.perviewGraph(selrow.gid);
    })

    this.$gird.grid("setLabel", "catagory", "归类", {
      "text-align": 'left'
    }, {});
    this.$gird.grid("setLabel", "name", "名称", {
      "text-align": 'left'
    }, {});
  },
  GraphsListView.prototype.delGraphsEvent = function() {
    var self = this;
    var selrows = self.$gird.grid("getCheckRows");
    this.delGraphsAction(selrows);
  },
  GraphsListView.prototype.delGraphsAction = function(selrows) {
    var self = this;
    fish.confirm("Delete selected graphs?").result.then(function() {
      ids =fish.map(selrows,function(d){
        return d.gid
      })
      console.log("ids",ids);
      action.delGraphs({"ids":ids}).then(function(){
        var g = self.tmpCombox.combobox('getSelectedItem');
        self.changetmpComboxCombobox(g);
      })
      // fish.each(selrows, function(d) {
      //   self.$gird.grid("delRowData", d);
      // });
    });
  },
  GraphsListView.prototype.groupAndHost = function(d) {
    var self = this;
    self.templateObj = d.templateObj;
    var groups = d.allGroup.result;
    this.group = this.$el.find('.comboboxGraphsGroup').combobox({dataTextField: 'NAME', dataValueField: 'VALUE', dataSource: groups});

    this.group.on('combobox:change', function() {
      var g = self.group.combobox('getSelectedItem');
      self.changeGropupCombobox(g);
    });
    this.group.combobox('value', "" + self.templateObj.CATAGORY);
    this.tmpCombox = this.$el.find('.comboboxGraphsHost').combobox({dataTextField: 'name', dataValueField: 'value', dataSource: []});
    this.tmpCombox.on('combobox:change', function() {
      var g = self.tmpCombox.combobox('getSelectedItem');
      self.changetmpComboxCombobox(g);
    });
  },
  GraphsListView.prototype.changetmpComboxCombobox = function(g) {
    if(g){
      var param={
        tId:g.value
      }
      this.loadGridDatas(param);
    }

  }
  GraphsListView.prototype.loadGridDatas=function(param){
      var self =this;
      action.getGraphsByUserID(param).then(function(data){
         var datas=fish.map(data.result,function(d){
              return {
                catagory: d.GCLASS,
                name: d.NAME,
                "type": d.GTYPE,
                "desc": d.DESCR,
                "gid": d.GID
              }
         })
        self.$gird.grid("reloadData",datas)
      })
  }
  GraphsListView.prototype.changeGropupCombobox = function(g) {
    var self = this;
    action.getTemplatesByCatagroyId(g.VALUE).then(function(data) {
      var tmpDataSource = fish.map(data.result, function(d) {
        return {name: d.NAME, value: d.ID}
      });
      self.tmpCombox.combobox({"dataSource": tmpDataSource})
      var tmp = fish.find(tmpDataSource, function(d) {
        return "" + d.value == "" + self.templateObj.ID
      })
      if (tmp) {
        self.tmpCombox.combobox({
          "value": "" + tmp.value
        })
      } else {
        if (tmpDataSource.length > 0) {
          var first = tmpDataSource[0];
          self.tmpCombox.combobox({
            "value": "" + first.value
          })
        }
      }
    })
  }
  GraphsListView.prototype.updateGraphs = function(selrow){
    var self =this;
     var gid =selrow.gid;
     action.getGraphsById(gid).then(function(data){
      if(data.result){
        self.enterCreateGraphs(data.result)
      }
     });
  }
  GraphsListView.prototype.createGraphs = function() {
      var self =this;
      var g = self.tmpCombox.combobox('getSelectedItem');
      action.getItemsByTemplateId(g.value).then(function(data){
       var flag = data.result.length>0;
       if(flag){
         self.enterCreateGraphs({
            templateId:g.value,
            gid:"NONE",
            title:"",
            position:"L",
            desc:"",
            gtype:1,
            gclass:"",
         })
       }else{
         fish.toast('warn', g.name+'没有配监控项');
       }
      })
  },
  GraphsListView.prototype.enterCreateGraphs =function(data) {
    var self = this;
    this.createGraphsView = new CreateGraphsView({
      'el': this.$el,
      'data':data,
      'cancel': function(tid) {
        self.option.id =tid;
        self.render();
      },
      'ok': function(tid) {
        fish.toast('success', '保存成功')
        self.option.id =tid;
        self.render();

      }
    })
    this.createGraphsView.render();
  },
  GraphsListView.prototype.callback = function() {
    util.doNotNull(this.option.callback);
  },
  GraphsListView.prototype.perviewGraph = function(gid) {
    var self = this;
    action.getGraphsById(gid).then(function(data){
     if(data.result){
       self.perviewGrpahView = new PerviewGrpahView({
         el: self.$el,
         "config":data.result,
         callback: function() {
           self.render();
         }
       });
       self.perviewGrpahView.render();
     }
    });

  }
  return GraphsListView;
});
