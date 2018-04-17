define([
  "oss_core/kdo/itnms/host/actions/HostAction",
  "text!oss_core/kdo/itnms/host/components/views/TemplatePageView.html",
  "oss_core/kdo/itnms/host/components/views/TemplateViewDialog.js"
], function(action, tpl, Dialog) {
  var TemplatePageView = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
    this.tpl = fish.compile(tpl);
  };
  TemplatePageView.prototype.render = function() {
    this.remove();
    this.$el.html(this.tpl());
    this.afterRender();

  };
  TemplatePageView.prototype.remove = function() {
    this.$el.html("")
  }
  TemplatePageView.prototype.afterRender = function() {
    alert('TemplatePageView');
    this.renderGird()
    this.renderAddTemplate();
  }
  TemplatePageView.prototype.renderGird = function() {
    var mydata = [
      {
        name: 'Templates A',
        id: '1'
      }, {
        name: 'Templates B',
        id: '1'
      }
    ];
    var opt = {
      data: mydata,
      height: 300,
      colModel: [
        {
          name: 'name',
          label: '名称'
        }, {
          name: 'id',
          label: '',
          width: 50,
          'title': false,
          formatter: function(cellval, opts, rwdat, _act) {
            return cellval
          }
        }
      ]
    };
    $grid = this.$el.find('.HostTemplateGrid').grid(opt);
  }

  TemplatePageView.prototype.renderAddTemplate = function() {
    var self = this;
    var $el = self.option.positionEL;
    this.$el.find('.addTemplate').off('click').on('click', function() {
      action.getCategoryTree().then(function(data) {
        data.splice(0, 0, {
          name: 'ALL',
          id: "R",
        });
        var options = {
          height: $el.height(),
          width: ($el.width() / 2),
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
        var dialog = new Dialog();
        dialog.popup(options, {"catatlog":data}, function(param) {});
      }) // end of CategoryTree

    }); // end of click
  }

  return TemplatePageView;
});
