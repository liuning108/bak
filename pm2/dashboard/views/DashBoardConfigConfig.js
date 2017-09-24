/**
 * 指标筛选弹出窗
 */
define([
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
    "text!oss_core/pm/dashboard/templates/DashBoardConfig.html",
    "oss_core/pm/dashboard/js/icheck/fish.icheck",
    "css!oss_core/pm/dashboard/js/icheck/icheck.css"
], function(i18nData,tpl) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
        resource : fish.extend({}, i18nData),
        initialize: function(canvas) {
            this.canvas = canvas;
        },
        events: {
            'change .switchGrid': 'switchGrid',
            'change #dash_canvas_name': 'canvas_name'
        },
        render: function() {
            this.$el.html(this.template(this.resource));
            return this;
        },
        afterRender: function(data) {
            this.RenderHTML();
            return this;
        },
        //TODO 设置仪表盘名称
        canvas_name: function(e) {
            var self = this;
            var $target = $(e.target);
            self.canvas.name=($target.val());
        },
        RenderHTML: function() {
            var self = this;
            $("#tabs").tabs(); //Tab页
            $('#dash_canvas_name').val(self.canvas.name);
            //
            //
            // //TODO: 风格选择样式改变(done);
            // $fange = $('input[type=radio][name="fenge"]');
            // var ick = $fange.icheck();
            // $fange.eq(self.canvas.style).icheck('check');
            // $fange.on('lnChanged', function() {
            //     var i = $(this).val()
            //     self.setStyle(i);
            // });
            // $fange.on('change', function() {
            //     var i = $(this).val()
            //     self.setStyle(i);
            // });
            //TODO: 选择背景图
            var $bgItem = $("#" + self.canvas.bgitem);
            if ($bgItem.length > 0) {
                $bgItem.data("select", 1);
                $bgItem.find(".glyphicon").show();
            }

            $('.bgItemDashBoard').off('click')
            $('.bgItemDashBoard').on('click', function() {
                var flag = $(this).data('select');
                var id = $(this).attr('id');
                if (flag == 1) {
                    $(this).data('select', 0);
                    $(this).find('.glyphicon').hide();
                    var bk = {
                        'background': '#fff'
                    };
                    self.canvas.setBK(bk);
                    self.bkimage = false;
                    self.canvas.bgitem = 0;
                } else {

                    var image_src = $(this).data('src');
                    var bk = {
                        'background': 'url(' + image_src + ') 50% 50% / auto 100% repeat'
                    }
                    self.bkimage = bk;
                    self.canvas.setBK(bk);
                    $(this).find('.glyphicon').show();
                    self.canvas.bgitem = id;
                    $(this).data('select', 1);
                }
            })

        }, //end of RenderHTML
        //TODO: 风格选择(done);
        setStyle: function(i) {
            //'url(oss_core/pm/screendesigner/images/bk1.jpg)  50% 50% / auto 100% repeat'
            var self = this;
            var bk_arrts = self.bkimage;
            if (i == 0) {
                self.canvas.setStyle(i, bk_arrts || {
                    'background-color': '#fdfdfd'
                })
            } else {
                self.canvas.setStyle(i, bk_arrts || {
                    'background-color': '#000'
                })

            }
        },
        // TODO: 自定义Slider(done)
        sliderTooltip: function(id, init_value, min, max, step, fun) {

            var tooltip = $('<div class="sliderTooltip" />').css({position: 'absolute', top: -25, left: -18}).hide();
            tooltip.text(init_value);
            fun(init_value);
            var $slider = $(id).slider({
                value: init_value,
                'min': min,
                'max': max,
                'step': step,
                slide: function(e, ui) {
                    tooltip.text(ui.value);
                    fun(ui.value);
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

        }, // end of sliderTooltip
        // TODO: 网格切换(done)
        switchGrid: function(e) {
            var self = this;
            var $target = $(e.target);
            var flag = $target.is(':checked');
            if (flag) {
                self.canvas.createGrid();
            } else {
                self.canvas.removeGrid()
            }
        }, //end of switchGrid

    });
});
