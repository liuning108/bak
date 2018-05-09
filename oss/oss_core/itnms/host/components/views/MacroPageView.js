define([
      'i18n!oss_core/itnms/host/i18n/host',
      "oss_core/itnms/host/actions/HostAction",
      "text!oss_core/itnms/host/components/views/MacroPageView.html"],function(
        i18nData,action,tpl
      ) {
  var MacroPageView = function(option){
    this.option=option;
    this.$el= $(this.option.el);
    this.tpl=fish.compile(tpl)

  }
  MacroPageView.prototype.render=function() {
    this.remove();
    this.$el.html(this.tpl(i18nData));
    this.afterRender();

  }
  MacroPageView.prototype.afterRender=function() {
     var self =this;
     this.renderGird();

     this.$el.find('.macorHostAdd').off('click').on('click',function(){
       self.addItem();
     })
  }
  MacroPageView.prototype.remove=function() {
    this.$el.html("");
  }

  MacroPageView.prototype.addItem=function() {
     var item={
       'macro': this.$el.find('.newMacro').val(),
       'value': this.$el.find('.newMValue').val(),
       'hostmacroid':'none'
     }
     this.$grid.grid("addRowData",item)
     this.$el.find('.newMacro').val("")
     this.$el.find('.newMValue').val("")

  }

  MacroPageView.prototype.getInfo=function(){
      var self =this;
      var data = self.$grid.grid("getDataIDs");//获取所有的rowid记录
      return fish.map(data,function(rowid){
         var selrowDom = $(self.$grid.grid("getGridRowById", rowid));
         var id =selrowDom.find('.removeMacro').data('id');
         var hostmacroid=(id=='none')?null:id
         return {
           'macro':selrowDom.find('.macro').val(),
           'value':selrowDom.find('.macro_value').val(),
           'hostmacroid':hostmacroid,
         }

      })
  }

  MacroPageView.prototype.renderGird = function() {
    var self =this;
    var opt = {
      data: this.option.macros,
      height: 350,
      colModel: [
        {
          name: 'macro',
          label: 'Macro',
          align: 'left',
          formatter: function(cellval, opts, rwdat, _act) {
            return "<input  class='macro' value='"+cellval+"' placeholder='{$Macro}'></input>"
          }
        },
        {
          name: 'value',
          label: 'Value',
          align: 'left',
          formatter: function(cellval, opts, rwdat, _act) {
              return "<input class='macro_value' value='"+cellval+"'  placeholder='Value'></input>"
          }
        }, {
          name: 'hostmacroid',
          label: '',
          width: 50,
          'title': false,
          formatter: function(cellval, opts, rwdat, _act) {
            return '<i data-id="'+cellval+'"class="glyphicon glyphicon-trash removeMacro" title="remove"></i>'
          }
        }
      ]
    };

    self.$grid = this.$el.find('.HostMarcoGrid').grid(opt);
    this.$el.find('.HostMarcoOK').off('click').on('click',function(){
       self.option.ok();
    })

    this.$el.find('.HostMarcoCancel').off('click').on('click',function(){
       self.option.cancel();
    })


     self.$grid.on('click', '.removeMacro', function() {
        var selrow = self.$grid.grid("getSelection");
        self.$grid.grid("delRowData", selrow);//删除记录
     })

  }
  return MacroPageView
})
