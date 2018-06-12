
define([
        "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
        "text!oss_core/pm/screendesigner/templates/ServerTimeView.html",
    ],
    function(i18nData,tpl){
        return portal.BaseView.extend({
            resource : fish.extend({}, i18nData),
            template: fish.compile(tpl),
            initialize: function(options) {
              this.options=options;
            },
            events: {

            },

            render: function() {
                this.$el.html(this.template(this.resource));
                return this;
            },






            afterRender: function() {
              var self =this;
              if(this.options.isNeedSwitch==false){
                  this.NoNeedSwith();
              }else{
                  this.HasNeedSwith();
              }

              var timeInput = this.$el.find(".timeInput");
                  timeInput.val(this.options.g.attrs.timeVal||1);
              var timeSelect=this.$el.find('.timeSelect');
                  timeSelect.val(this.options.g.attrs.timeType||1);

                timeInput.on("change",function(){
                    self.changeModel(timeInput,timeSelect);
                })
                timeSelect.on("change",function(){
                    self.changeModel(timeInput,timeSelect);
                })


                return this;
            },

            changeModel:function(timeInput,timeSelect) {

                var time =timeInput.val();
                var timeType=timeSelect.val();
                this.options.g.attrs.timeVal=time;
                this.options.g.attrs.timeType=timeType;

            },

            NoNeedSwith:function() {
              this.$el.find(".stViewOffon").hide();
            },
            HasNeedSwith:function() {
              var self =this;
              this.$el.find(".stViewOffon").show();
              var flag =this.options.g.attrs.timeOff;
              var cbox= this.$el.find(".stViewOffonCheckbox");
              cbox.prop('checked',(flag==1)?false:true);
              this.isChecked();
              cbox.on("change",function() {
                self.isChecked();
              })
            },
            isChecked:function() {
            var cbox= this.$el.find(".stViewOffonCheckbox");
            var config=this.$el.find(".stViewConfig");
            var flag=  cbox.is(":checked")
                if(flag){
                  this.options.g.attrs.timeOff=2;
                  config.show();

                }else {
                  this.options.g.attrs.timeOff=1;
                  config.hide();
                }
            },

        });
    });
