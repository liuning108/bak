define([

    "text!oss_core/pm/dashboard/templates/UIDemo.html",
    "oss_core/pm/dashboard/js/sliderPlug/SliderPlug",


], function(tpl,SliderPlug) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        initialize: function() {
            var self = this;
        },
        render: function() {
            this.$el.html(this.template());
            return this;

        },



        afterRender: function(data) {
            var datas = [
                "30m",
                "1H",
                "6H",
                "12H",
                "14D",
                "3D",
                "7D",
                "14D",
                "1M",
                "2M",
                "3M"
            ]
            var slider = new SliderPlug({'el':$('#sliderWin'),'datas':datas}).render();

            slider.setValue("1H");
            $('#currentValue').click(function() {
              alert(slider.getValue())
            })
            return this;
        },


    });
});
