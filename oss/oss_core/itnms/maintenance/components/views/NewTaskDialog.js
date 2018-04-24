define([
  "text!oss_core/itnms/maintenance/components/views/NewTaskDialog.html",
], function(tpl) {
  var NewTaskDialog = function() {
    this.tpl = fish.compile(tpl);
    this.state = {
      data: [
        '.Step1', ".Step2", ".Step3"
      ],
      curIndex: 0
    }
  };
  NewTaskDialog.prototype.content = function() {
    this.$el = $(this.tpl())
    return this.$el;
  }
  NewTaskDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.popOption=options;
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  NewTaskDialog.prototype.afterPopup = function() {
     var self =this;
     self.initPage();
  }
  NewTaskDialog.prototype.initPage=function() {
    var self =this;
    this.periodsType = this.$el.find('.periodsType').combobox({
        dataTextField: 'name',
        dataValueField: 'value',
        editable: false,
        dataSource: [
            {name: 'One time only', value: "0"},
            {name: 'Daily', value:"2"},
            {name: 'Weekly', value:"3"},
            {name: 'Monthly', value:"4"},
        ],
    });
    this.periodsType.combobox("value","0");
    this.periodsType.on('combobox:change', function () {
                        var value =self.periodsType.combobox("value");
                         self.showTypePage(value);
                      });
    this.showTypePage("0");
  }
  NewTaskDialog.prototype.showTypePage=function(value){
    var self =this;
    self.$el.find('.mainTypPage').hide();
    self.$el.find('.type'+value).show();
  }


  return NewTaskDialog;
})
