define([
  "oss_core/itnms/graphs/components/views/CreateGraphsView.js",
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js", "text!oss_core/itnms/graphs/components/views/CreateListView.html"
], function(CreateGraphsView,RootView, util, tpl) {
  var evetMap = [
    {'el': '.graphscallback','type': 'click','handel': 'callback'},
    {'el':'.createGraphs','type':'click','handel':'createGraphs'}
  ]
  var GraphsListView = RootView.extend({
    initProp: function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    loadPage: function() {
      this.$el.html(this.tpl());
    },
    afterRender: function() {
     this.groupAndHost();
     this.initGraphasGrid();
    },
    initGraphasGrid:function() {
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
        gridComplete: function() {

        },
        colModel: [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
          }, {
            name: 'type',
            label: 'Type',
            align: 'center'
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
              return cellval;
            }
          }
        ]
      };
      this.$gird = this.$el.find('.graphsListGrid').grid(opt);
      this.$gird.grid("setLabel",
                      "name",
                      "Name",
                      {"text-align":'left'},
                      {});
    },
    groupAndHost:function() {
      this.group = this.$el.find('.comboboxGraphsGroup').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         dataSource: [
             {name: 'Demo group', value: '1'},
         ],
      });
      this.group.combobox('value',"1");
      this.host = this.$el.find('.comboboxGraphsHost').combobox({
         dataTextField: 'name',
         dataValueField: 'value',
         dataSource: [
             {name: 'Zabbix Server', value: '1'},
         ],
      });
      this.host.combobox('value',"1");
    },
    createGraphs:function() {
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
    callback: function() {
      util.doNotNull(this.option.callback);
    }
  })
  return GraphsListView;
});
