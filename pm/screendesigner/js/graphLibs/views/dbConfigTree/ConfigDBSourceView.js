define([
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/indiLi.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dimeLi.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/configDBSource.html",
  "oss_core/pm/screendesigner/js/codemirror/codemirror",
  "oss_core/pm/screendesigner/js/codemirror/sql",
  "css!oss_core/pm/screendesigner/js/codemirror/codemirror.css"
], function(indiLiTpl, dimeLiTpl, tpl, CodeMirror) {
  return portal.BaseView.extend({
    className: "ui-dialog dialog configDBSourceDialog",
    template: fish.compile(tpl),
    indiTpl: fish.compile(indiLiTpl),
    dimeTpl: fish.compile(dimeLiTpl),
    initialize: function(config) {
      this.config = config
    },
    events: {
      'click .configDBSourceClose': 'close',
      'click .nextbutton': 'next',
      'click .Prevbutton': 'prev',
      'click .radioSQL': 'radioSQL',
      'click .radioAPI': 'radioAPI',
      'click .toDime': 'toDime',
      'click .toIndi': 'toIndi',
      'click .doneButton': 'doneButton',
      'click .modifiedDB':'modifiedDB'

    },
    modifiedDB:function(e) {
       var $parent=this.$el.find(e.target).parent()
       var $span =$parent.find("span");
       var text =$span.text();
                 $span.hide();
       var $input=$parent.find("input")
       $input.show();
       $input.val(text);
       $input.off('keypress')
             .on('keypress',function(e){
                 if(e.keyCode=="13"){
                     $span.text($input.val());
                     $input.hide();
                     $span.show();
                 }

               })


    },
    doneButton: function() {
      fish.success('create success');
      this.trigger('close')
    },
    toIndi: function() {
      var $indis = $("input[name='dime']:checkbox:checked")
      var models = fish.map($indis, function(chk) {
        $(chk).parent().remove();
        return {label: $(chk).val()}
      })
      this.switchAxisUL(models, '.indisUL', this.indiTpl)
    },
    toDime: function() {
      var $indis = $("input[name='indi']:checkbox:checked")
      var models = fish.map($indis, function(chk) {
        $(chk).parent().remove();
        return {label: $(chk).val()}
      })
      this.switchAxisUL(models, '.dimeUL', this.dimeTpl)
    },

    switchAxisUL: function(models, selector, tplFun) {
      var $ul = this.$el.find(selector)
      fish.each(models, function(model) {
        $ul.append(tplFun(model));
      })
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },
    radioSQL: function() {
      this.$el.find('.sqlItem').show();
      this.$el.find('.apiItem').hide();

    },
    radioAPI: function() {
      this.$el.find('.apiItem').show();
      this.$el.find('.sqlItem').hide();

    },
    next: function(e) {
      if ($(e.target).text() == 'Next') {
        $(e.target).text('Save')
        this.$el.find("#configDBTabs").tabs("showTab", 1, true);
      } else {
        this.close()
      }

      this.$el.find('.Prevbutton').show();
      //   this.$el.find('.Prevbutton').addClass("PrevbuttonClass")
      //   this.$el.find('.dbResultPanel').show();
      //   this.$el.find('.doneButton').show();

    },
    prev: function(e) {
      $(e.target).hide();
      this.$el.find("#configDBTabs").tabs("showTab", 0, true);
      //   this.$el.find('.dbResultPanel').hide();
      this.$el.find('.nextbutton').text("Next");
      //   this.$el.find('.configPanel').show();
      //   this.$el.find('.doneButton').hide();

    },
    createResultGrid: function() {

      var mydata = [
        {
          grid_area: "Change",
          grid_3g: "123",
          grid_4g: "233"
        }, {
          grid_area: "Zhange",
          grid_3g: "143",
          grid_4g: "234"
        }, {
          grid_area: "Yhange",
          grid_3g: "163",
          grid_4g: "212"
        }, {
          grid_area: "Jin",
          grid_3g: "123",
          grid_4g: "235"
        }, {
          grid_area: "Yang.4",
          grid_3g: "133",
          grid_4g: "302"
        }, {
          grid_area: "KHY",
          grid_3g: "124",
          grid_4g: "242"
        }, {
          grid_area: "Nanjian",
          grid_3g: "125",
          grid_4g: "210"
        }, {
          grid_area: "kero",
          grid_3g: "126",
          grid_4g: "233"
        }, {
          grid_area: "Jky",
          grid_3g: "127",
          grid_4g: "240"
        }, {
          grid_area: "Ling",
          grid_3g: "127",
          grid_4g: "233"
        }, {
          grid_area: "KK",
          grid_3g: "129",
          grid_4g: "219"
        }, {
          grid_area: "JKL",
          grid_3g: "130",
          grid_4g: "230"
        }
      ];

      var colModels = [
        {
          name: 'grid_area',
          label: 'area',
          sortable: false

        }, {
          name: 'grid_3g',
          label: '3g',
          sortable: false

        }, {
          name: 'grid_4g',
          label: '4g',
          sortable: false
        }
      ];

      var opt = {
        data: mydata,
        height: 240,
        width: 1000,
        rownumbers: true,
        colModel: colModels
      };

      $grid = this.$el.find("#resultGrid").grid(opt);
      this.colModelsToIndi(colModels);
    },

    colModelsToIndi: function(colModels) {
      var self = this;
      var $ul = this.$el.find('.indisUL')
      $ul.empty();
      fish.each(colModels, function(model) {
        $ul.append(self.indiTpl(model));
      })

    },

    afterRender: function() {
      this.$el.find('#configDBTabs').tabs();

      var $combobox1 = this.$el.find('#sqlcombo').combobox({
        placeholder: 'Select a DB Source',
        dataTextField: 'name',
        dataValueField: 'value',
        dataSource: [
          {
            name: 'Oracle',
            value: 'oracle'
          }, {
            name: 'Mysql',
            value: 'sql'
          }
        ],
        template: '<li><a href="#">test</a></li>'
      });

      var $combobox2 = this.$el.find('#apicombo').combobox({
        placeholder: 'Select a API Source',
        dataTextField: 'name',
        dataValueField: 'value',
        dataSource: [
          {
            name: 'PM Voice Data API Server',
            value: 'API1'
          }, {
            name: 'PM Traffice Data API Server ',
            value: 'API2'
          }
        ],
        template: '<li><a href="#">test</a></li>'
      });

      var $sql = this.$el.find('.sql2')
      var editor = CodeMirror.fromTextArea($sql[0], {
        mode: 'text/x-plsql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autofocus: true
      });
      editor.setSize('height', '180px');
      editor.setValue("select area,3g,4g from dual;");
      setTimeout(function() {
        editor.refresh();
      }, 20);
      this.sortableMappingFields()
      // this.createResultGrid();

    },
    sortableMappingFields: function() {
      this.$el.find(".list-group").sortable({connectWith: ".list-group"});
      this.$el.find("#sortable4, #sortable5, #sortable6").disableSelection();
    },
    close: function() {
      this.trigger('close')
    }

  });
});
