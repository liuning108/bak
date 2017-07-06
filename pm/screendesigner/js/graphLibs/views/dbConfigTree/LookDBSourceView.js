/**
 * 指标筛选弹出窗
 */
define(["text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LookDBSource.html"], function(tpl) {
  return portal.BaseView.extend({
    className: "ui-dialog dialog SDdialog",
    template: fish.compile(tpl),
    initialize: function() {},
    events:{
      'click .lookDBSourceClose':'close'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    afterRender: function() {
      var  mydata = [
        {id:"0.1",invdate:"2010-05-24",name:"测试很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字",note:"note",tax:"10.00",total:"2111.00"} ,
        {id:"0.1.1",invdate:"2010-05-25",name:"test2",note:"note2",tax:"20.00",total:"320.00",extra:"tyl"},
        {id:"0.3",invdate:"2007-09-01",name:"test3",note:"note3",tax:"30.00",total:"430.00"},
        {id:"P594_1.0",invdate:"2007-10-04",name:"test",note:"note",tax:"10.00",total:"210.00"},
        {id:"P594_1.4",invdate:"2007-10-05",name:"test2",note:"note2",tax:"20.00",total:"320.00"},
        {id:"6",invdate:"2007-09-06",name:"test3",note:"note3",tax:"30.00",total:"430.00"},
        {id:"7",invdate:"2007-10-04",name:"test",note:"note",tax:"10.00",total:"210.00"},
        {id:"8",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"21.00",total:"320.00"},
        {id:"9",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"11",invdate:"2007-10-01",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"12",invdate:"2007-10-02",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"13",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"14",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"15",invdate:"2007-10-05",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"16",invdate:"2007-09-06",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"17",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"18",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"19",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"21",invdate:"2007-10-01",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"22",invdate:"2007-10-02",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"23",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"24",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"25",invdate:"2007-10-05",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"26",invdate:"2007-09-06",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
        {id:"27",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
        {id:"28",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
        {id:"29",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"}
    ];
          var opt = {
           data: mydata,
           height:540,
           width:1020,
           colModel: [{
               name: 'id',
               label: 'Inv No',
               sortable: false,
               key:true
           }, {
               name: 'invdate',
               label: 'Date',
               sortable: false,
               formatter: "date",
               headertitle : '时间' //列头的提示
           }, {
               name: 'name',
               label: 'Client',
               sortable: false,
               title: false //内容没有提示
           }, {
               name: 'amount',
               label: 'Amount',
               sortable: false,
               formatter: "number"
           }, {
               name: 'tax',
               label: 'Tax',
               sortable: false
           }, {
               name: 'total',
               label: 'Total',
               sortable: false
           }, {
               name: 'note',
               label: 'Notes',
               sortable: false
           }]
       };
       $grid = this.$el.find("#lookDbSourceGird").grid(opt);


      return this;
    },
    close: function() {
      this.trigger('close')
    }

  });
});
