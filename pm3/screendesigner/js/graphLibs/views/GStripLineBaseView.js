define([
  "oss_core/pm/screendesigner/views/ServerTimeView",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/GStripLineBaseConfig.html",
  "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
  "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(STView, i18nData, DBConfigTreeView, tpl, JSONEditor) {

  return portal.CommonView.extend({
    className: "ui-dialog dialog",
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(gText) {
      this.gText = gText;
    },
    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    gtext_title: function(target) {
      this.gText.setTitle(target.val());
    },
    jsonEditor: function($parent) {
      var self = this;
      var $editor_content = $parent.find("#json-editor");
      $editor_content.css({'height': "600px"});
      self.editor = new JSONEditor($editor_content[0], {'mode': 'code'});
      var json = {
        xAxis: {
          data: this.gText.getXAxisNames()
        },
        series: {
          data: this.gText.getXAxisDatas()
        }
      }
      self.editor.set(json);
      $editor_content.find(".jsoneditor-menu").remove();
      $parent.find(".btn-sure").off('click').on('click', function() {
        var json = self.editor.get();
        if (json.xAxis.data && json.series.data) {
          //set datas

          self.gText.setXAxisNames(json.xAxis.data);
          self.gText.setXAxisDatas(json.series.data)
          self.gText.redraw();
        }
      });

    },

    afterRender: function() {

      var self = this;
      $("#tabs").tabs(); //Tab页
      var $parent = $("#tabs");
      var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree', 'g': self.gText}).render().afterRender()

      //  self.jsonEditor($parent);

      var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
      title_colorpicker.colorpicker("set", this.gText.attrs.titleColor);
      title_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.titleColor = "" + color;
        self.gText.redraw();
      });

      var axis_colorpicker = $parent.find(".axis_colorpicker").colorpicker();
      axis_colorpicker.colorpicker("set", this.gText.attrs.axisColor);
      axis_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.axisColor = "" + color;
        self.gText.redraw();
      });

      var line_colorpicker = $parent.find(".line_colorpicker").colorpicker();
      line_colorpicker.colorpicker("set", this.gText.attrs.lineColor);
      line_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.lineColor = "" + color;
        self.gText.redraw();
      });

      var dot_colorpicker = $parent.find(".dot_colorpicker").colorpicker();
      dot_colorpicker.colorpicker("set", this.gText.attrs.dotColor);
      dot_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.dotColor = "" + color;
        self.gText.redraw();
      });

      var area_colorpicker = $parent.find(".area_colorpicker").colorpicker();
      area_colorpicker.colorpicker("set", this.gText.attrs.areaColor);
      area_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.areaColor = "" + color;
        self.gText.redraw();
      });
      $('.gStripColorsInput').val(self.gText.attrs.linecolors.join(','));
      $('.gStripColorsInput').off('change').on('change', function() {
        var value = $(this).val();
        if (value.length < 2) {
          value = "#11bde8,#18ebed";
        }

        var colors = value.split(',');
        self.gText.attrs.linecolors = colors;
        self.gText.redraw();

      })
      $('.unitInput').val(self.gText.attrs.unit);
      $('.unitInput').off("change").on("change", function() {
        self.gText.attrs.unit = $('.unitInput').val();
        self.gText.redraw();
      })

      $('.unitInputx').val(self.gText.attrs.unitx);
      $('.unitInputx').off("change").on("change", function() {
        self.gText.attrs.unitx = $('.unitInputx').val();
        self.gText.redraw();
      })

      $('.roateInput').val(self.gText.attrs.rotate);
      $('.roateInput').off("change").on("change", function() {
        self.gText.attrs.rotate = $('.roateInput').val();
        self.gText.redraw();
      })

      $parent.find('.labelSelect').off('change').val(self.gText.attrs.labelStyle).on('change', function() {
        var val = $(this).val()
        self.gText.attrs.labelStyle = val;
        self.gText.redraw()
      });

      $parent.find('.label2Select').off('change').val(self.gText.attrs.labelStyle2).on('change', function() {
        var val = $(this).val()
        self.gText.attrs.labelStyle2 = val;
        self.gText.redraw()
      });

      var $offOnLine = $parent.find('.AuxiliaryOffonCheckbox')
      $offOnLine.prop('checked', self.gText.attrs.offOnline);
      if (self.gText.attrs.offOnline) {
        $parent.find('.AuxiliaryOffonPlane').show();
      } else {
        $parent.find('.AuxiliaryOffonPlane').hide();
      }

      $parent.find('.AuxiliaryValue').val(self.gText.attrs.warningValue).off('change').on('change', function() {
        var v = $(this).val();
        if (v.length <= 0) {
          v = 10;
          $(this).val(v)
        }
        var value = Number(v);
        if (isNaN(value)) {
          value = 10;
          $(this).val(value);
        }
        self.gText.attrs.warningValue = value;
        self.gText.redraw()
      })
      $offOnLine.off('change').on('change', function() {
        var flag = $(this).is(":checked")
        self.gText.attrs.offOnline = flag;
        if (self.gText.attrs.offOnline) {
          $parent.find('.AuxiliaryOffonPlane').show();
        } else {
          $parent.find('.AuxiliaryOffonPlane').hide();
        }
        self.gText.redraw()
      })

      var AuxiliaryOffon_colorpicker = $parent.find(".AuxiliaryColor").colorpicker();
      AuxiliaryOffon_colorpicker.colorpicker("set", this.gText.attrs.offlineColor);
      AuxiliaryOffon_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.offlineColor = "" + color;
        self.gText.redraw();
      })

      var stView = new STView({"el": $("#bg_stView"), 'g': this.gText, 'isNeedSwitch': true}).render();
      return this;
    }

  })
});
