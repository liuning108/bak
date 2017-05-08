define(["text!oss_core/pm/screendesigner/js/graphLibs/views/GTextConfig.html",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker",
    "css!oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker.css"
], function(tpl) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function() {},
        events: {
            'change .gtext_title': "gtext_title"
        },
        initialize: function(gText) {
            this.gText = gText;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },

        gtext_title: function(e, b, c) {
            var target = $(e.target);
            this.gText.setTitle(target.val());
        },


        afterRender: function() {
            var self = this;
            this.$el.find('.gtext_title').val(this.gText.getTitle());
            var title_colorpicker = this.$el.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.getTitleColor());
            title_colorpicker.on("move.colorpicker", function(e, color) {
            	
                    self.gText.setTitleColor(color)
                })
                //"set", this.gText.getTitleColor());
            return this;
        }


    })
});
