/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerConfig.html",
    ],
    function(tpl) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(canvas) {
                this.canvas = canvas;
            },
            events: {},
            render: function() {
                this.$el.html(this.template());
                return this;
            },
            afterRender: function(data) {
                this.RenderHTML();
                return this;
            },
            RenderHTML: function() {
                var self = this;
                $('#canvas_w').val(1920);
                $('#canvas_h').val(1080);
                $('#canvas_w').on('change', function() {
                    var w = $(this).val();
                    var h = $('#canvas_h').val();
                    self.canvas.setViewBox(w, h)
                })

                $('#canvas_h').on('change', function() {
                    var h = $(this).val();
                    var w = $('#canvas_w').val();
                    self.canvas.setViewBox(w, h)
                })

                $('#checkbox_bks').on('click', function() {
                    var chekced = $(this).is(':checked');
                    if (chekced) {
                        self.canvas.setBK({
                            'background': 'url(oss_core/pm/screendesigner/images/bk1.jpg)  repeat'
                        })
                    } else {
                        self.canvas.setBK({
                            'background': '#fff'
                        })

                    }
                });

                $("#tabs").tabs();

            } //end of RenderHTML



        });
    });
