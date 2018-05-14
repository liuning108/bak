define([
  "oss_core/pm/screendesigner/views/ServerTimeView",
  "oss_core/pm/screendesigner/js/graphLibs/mapBase/ExportMap",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
  "text!oss_core/pm/screendesigner/js/graphLibs/mapBase/GMapConfig.html",
  "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
  "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker",
  "css!oss_core/pm/screendesigner/js/webupload/css/webuploader.css",
  "css!oss_core/pm/screendesigner/js/graphLibs/mapBase/style.css"
], function(STView, ExportMap, i18nData, DBConfigTreeView, tpl, JSONEditor) {

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

        series: {
          data: [self.gText.getValue()]
        }
      }
      self.editor.set(json);
      $editor_content.find(".jsoneditor-menu").remove();
      $parent.find(".btn-sure").off('click').on('click', function() {
        var json = self.editor.get();
        if (json.series.data) {
          //set datas
          self.gText.setValue(json.series.data[0]);
          self.gText.redraw();
        }
      });

    },

    afterRender: function() {

      var self = this;
      $("#tabs").tabs(); //Tab页
      var $parent = $("#tabs");
      var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree', 'g': self.gText}).render().afterRender()
      //    self.jsonEditor($parent);
      $parent.find('.gtext_title').on('change', function() {
        var value = $(this).val();
        self.gText.attrs.MaxValue = Number(value);
        self.gText.redraw();
      })
      $parent.find('.gtext_title').val(this.gText.attrs.MaxValue);

      $parent.find('.MinValue').on('change', function() {
        var value = $(this).val();
        self.gText.attrs.MinValue = Number(value);
        self.gText.redraw();
      })
      $parent.find('.MinValue').val(this.gText.attrs.MinValue);

      $parent.find('.showTitle').prop('checked', this.gText.attrs.showTitle === true).off('click').on('click', function() {
        self.gText.attrs.showTitle = $(this).is(':checked');
        self.gText.redraw();
      })

      $parent.find('.showValue').prop('checked', this.gText.attrs.showValue === true).off('click').on('click', function() {
        self.gText.attrs.showValue = $(this).is(':checked');
        self.gText.redraw();
      })



    $parent.find('.isGlow').prop('checked', this.gText.attrs.showGradient === true).off('click').on('click', function() {
      self.gText.attrs.isGlow = $(this).is(':checked');
      self.gText.redraw();
    })

      $parent.find('.showGradient').prop('checked', this.gText.attrs.showGradient === true).off('click').on('click', function() {
        self.gText.attrs.showGradient = $(this).is(':checked');
        self.gText.redraw();
      })

      $parent.find('.showGradientValue')
             .val(this.gText.attrs.showGradientValue)
             .off('change')
             .on('change',function(){
                var value = $(this).val();
                if(value.length<=0) value=5;
                value = Number(value);
                if(isNaN(value))value=5;
                $(this).val(value);
                self.gText.attrs.showGradientValue=value;
                self.gText.redraw();
             })



      $parent.find('.colorReversal').prop('checked', this.gText.attrs.colorReversal === true).off('click').on('click', function() {
        self.gText.attrs.colorReversal = $(this).is(':checked');
        self.gText.redraw();
      })

      var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
      title_colorpicker.colorpicker("set", this.gText.attrs.fcolor);
      title_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.fcolor = "" + color;
        self.gText.redraw();
      })
      var num_colorpicker = $parent.find(".gtext_num_colorpicker").colorpicker();
      num_colorpicker.colorpicker("set", this.gText.attrs.scolor);
      num_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.scolor = "" + color;
        self.gText.redraw();
      })


      var num_colorpicker = $parent.find(".mapLineColor").colorpicker();
      num_colorpicker.colorpicker("set", this.gText.attrs.mapLineColor);
      num_colorpicker.on("move.colorpicker", function(e, color) {
        self.gText.attrs.mapLineColor = "" + color;
        self.gText.redraw();
      })

      var stView = new STView({"el": $("#bg_stView"), 'g': this.gText, 'isNeedSwitch': true}).render();

      $parent.find('.chosiceMapType').off('click').on('click', function() {
        var eportMap = ExportMap.create();
        eportMap.show({'parent': self, 'okEvent': 'renderMap','id':self.gText.attrs.mapId});
      })


      $parent.find('.TipPosition')
             .val(this.gText.attrs.position)
            .off('change').on('change',function(){
              var value = $(this).val();
              self.gText.attrs.position=value;
              self.gText.redraw();
          })
      $parent.find('.TipOrientation')
                 .val(this.gText.attrs.angle)
                .off('change').on('change',function(){
                  var value = $(this).val();
                  self.gText.attrs.angle=Number(value);
                  self.gText.redraw();
              })
     $parent.find('.mapOffSetX')
            .val(this.gText.attrs.offsetX)
            .off('change')
            .on('change',function(){
              var value = $(this).val();
              if(value.length<=0) value=0;
              value = Number(value);
              if(isNaN(value))value=0;
              $(this).val(value);
              self.gText.attrs.offsetX=value;
              self.gText.redraw();
            })

            $parent.find('.mapOffSetH')
                   .val(this.gText.attrs.offsetH)
                   .off('change')
                   .on('change',function(){
                     var value = $(this).val();
                     if(value.length<=0) value=0;
                     value = Number(value);
                     if(isNaN(value))value=0;
                     $(this).val(value);
                     self.gText.attrs.offsetH=value;
                     self.gText.redraw();
                   })

      return this;
    }, //end of afterRender

    renderMap: function(id) {
      var self = this;
      self.gText.attrs.mapId = id;
      self.gText.redraw();
    }
  })
});
