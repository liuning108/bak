/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerConfig.html",
        "oss_core/pm/screendesigner/js/icheck/fish.icheck",
        "css!oss_core/pm/screendesigner/js/icheck/icheck.css"
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
                self.sliderTooltip('#slider1');

                //TODO icheck;
                $fruit = $('input[name="fruit"]');
                $fruit.icheck();

                $grade = $('input[name="grade"]');
                $grade.icheck();

            }, //end of RenderHTML
            // TODO: 自定义Slider(done)
            sliderTooltip: function(id) {

                var tooltip = $('<div class="sliderTooltip" />').css({
                    position: 'absolute',
                    top: -25,
                    left: -18
                }).hide();
                tooltip.text(10);

                var $slider = $(id).slider({
                    value: 50,
                    min: 10,
                    max: 100,
                    step: 1,
                    slide: function(e, ui) {
                        tooltip.text(ui.value);
                    }
                })

                $slider.find(".ui-slider-handle").append(tooltip).hover(function() {
                    var len = tooltip.text().length
                    if (len <= 0) {
                        tooltip.hide();
                    } else {
                        tooltip.show()
                    }
                }, function() {
                    tooltip.hide()
                }); //显示提示信息

                // setTimeout(function() {
                //     $slider.slider({
                //         value: 100
                //     });
                // }, 2000);


            }


        });
    });
