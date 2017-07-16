
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
      'click .configDBSourceClose':'close'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },




    afterRender: function() {
        var $sql=this.$el.find('.sql')
        CodeMirror.fromTextArea($sql[0], {
                                lineNumbers: true,
                                matchBrackets: true,
                                indentUnit: 4,
                                mode: "text/x-sql"
                             });

    },
    close: function() {
      this.trigger('close')
    }

  });
});
