
define([
         "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/configDBSource.html",
         "oss_core/pm/screendesigner/js/codemirror/codemirror",
         "oss_core/pm/screendesigner/js/codemirror/sql",
         "css!oss_core/pm/screendesigner/js/codemirror/codemirror.css"
        ],
        function(tpl,CodeMirror) {
  return portal.BaseView.extend({
    className: "ui-dialog dialog SDdialog configDBSourceDialog",
    template: fish.compile(tpl),
    initialize: function(config) {
        this.config=config
    },
    events:{
      'click .configDBSourceClose':'close',
      'click .nextbutton':'next',
      'click .Prevbutton':'prev'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    next:function(e) {
      $(e.target).hide();
      this.$el.find('.configPanel').hide();
      this.$el.find('.Prevbutton').show();
      this.$el.find('.dbResultPanel').show();
      this.$el.find('.doneButton').show();

    },
    prev:function(e) {
      $(e.target).hide();
      this.$el.find('.dbResultPanel').hide();
      this.$el.find('.nextbutton').show();
      this.$el.find('.configPanel').show();
      this.$el.find('.doneButton').hide();



    },
    createResultGrid:function() {

    var  mydata = [
        {grid_area:"Change",grid_3g:"123",grid_4g:"233"} ,
        {grid_area:"Zhange",grid_3g:"143",grid_4g:"234"},
        {grid_area:"Yhange",grid_3g:"163",grid_4g:"212"},
        {grid_area:"Jin",grid_3g:"123",grid_4g:"235"},
        {grid_area:"Yang.4",grid_3g:"133",grid_4g:"302"},
        {grid_area:"KHY",grid_3g:"124",grid_4g:"242"},
        {grid_area:"Nanjian",grid_3g:"125",grid_4g:"210"},
        {grid_area:"kero",grid_3g:"126",grid_4g:"233"},
        {grid_area:"Jky",grid_3g:"127",grid_4g:"240"},
        {grid_area:"Ling",grid_3g:"127",grid_4g:"233"},
        {grid_area:"KK",grid_3g:"129",grid_4g:"219"},
        {grid_area:"JKL",grid_3g:"130",grid_4g:"230"},
        ];

        var opt = {
         data: mydata,
         height:240,
         width:1000,
         rownumbers:true,
         colModel: [{
             name: 'grid_area',
             label: 'area',
             sortable:false

         }, {
             name: 'grid_3g',
             label: '3g',
             sortable:false

         }, {
             name: 'grid_4g',
             label: '4g',
             sortable:false
         }]
       };

      $grid = this.$el.find("#resultGrid").grid(opt);


    },




    afterRender: function() {
        var $sql=this.$el.find('.sql')
        CodeMirror.fromTextArea($sql[0], {
                                lineNumbers: true,
                                matchBrackets: true,
                                indentUnit: 4,
                                mode: "text/x-sql"
                             });

      this.createResultGrid();

    },
    close: function() {
      this.trigger('close')
    }

  });
});
