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
            events: {
                'change .switchGrid': 'switchGrid'
            },
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
                $("#tabs").tabs(); //Tab页
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

                //TODO: 动态生成网格(done)
                self.sliderTooltip('#slider1', 0.3, 0, 1, 0.01, function(value) {
                    $('#slider1_input').val(value);
                    self.canvas.setGridOpacity(value);
                });


                self.sliderTooltip('#slider2', 36, 10, 100, 1, function(value) {
                    $('#slider2_input').val(value);
                    self.canvas.setGridXNums(value);
                });
                self.sliderTooltip('#slider3', 36, 10, 100, 1, function(value) {
                    $('#slider3_input').val(value);
                    self.canvas.setGridYNums(value);
                });




                //TODO: 风格选择样式改变(done);
                $fange = $('input[type=radio][name="fenge"]');
                var ick = $fange.icheck();
                $fange.eq(0).icheck('check');
                $fange.on('lnChanged', function() {
                    var i = $(this).val()
                    self.setStyle(i);
                });
                $fange.on('change', function() {
                    var i = $(this).val()
                    self.setStyle(i);
                });

                $("#fileinput").off("change");
                $("#postframe").off("load");
                $("#fileinput").on("change",function(){
                    			$('#uploadForm').submit();
                    	})


                        $('#postframe').on('load',function(){
                            var text=$(this).contents().text();
                            var img="<img src='upload/"+text+"''  width=200 height=200></img>"
                            $('body').append(img);
                        });
                // $('.fileinput-button').fileupload({
                //     url: "http://127.0.0.1:8080/oss/upload",
                //     dataType: 'json',
                //     autoUpload: true,
                //     previewCanvas: false,
                //     acceptFileTypes: /(\.|\/)(gif|jpg|jpeg|png)$/i,
                //     maxFileSize: 999000,
                //     disableImageResize: /Android(?!.*Chrome)|Opera/
                //         .test(window.navigator.userAgent),
                //     previewMaxWidth: 190,
                //     previewMaxHeight: 120,
                //     previewCrop: true
                // }).on('fileupload:add', function(e, data) {
                //     data.context = $('.filelist-ul');
                //     $.each(data.files, function(index, file) {
                //         var node = $('<li class="filelist-item"/>');
                //         node.append(closeButton.clone(true));
                //         node.append('<div class="info">' + file.name + '</div>');
                //         node.prependTo(data.context);
                //     });
                // }).on('fileupload:processalways', function(e, data) {
                //     var index = data.index,
                //         file = data.files[index],
                //         node = $(data.context.children()[index]);
                //     if (file.preview) {
                //         node.prepend($("<img/>").attr("src", file.preview.toDataURL()));
                //     }
                //     if (file.error) {
                //         node.append($('<span class="error/> ').text(file.error));
                //     }
                // }).on('fileupload:done', function(e, data) {
                //     $.each(data.result, function(index, file) {
                //         if (file.url) {
                //             var link = $('<a>')
                //                 .attr('target', '_blank')
                //                 .prop('href', file.url);
                //             $(data.context.children()[index])
                //                 .wrap(link);
                //         } else if (file.error) {
                //             var error = $('<span class="error"/>').text(file.error);
                //             $(data.context.children()[index]).append(error);
                //         }
                //     });
                // }).on('fileupload:fail', function(e, data) {
                //     $.each(data.files, function(index) {
                //         var error = $('<span class="error"/>').text('File upload failed.');
                //         $(data.context.children()[index]).append(error);
                //     });
                // });

            }, //end of RenderHTML
            //TODO: 风格选择(done);
            setStyle: function(i) {
                var self = this;
                if (i == 0) {
                    self.canvas.setStyle(1, {
                        'background': '#fff'
                    })
                } else {
                    self.canvas.setStyle(0, {
                        'background': 'url(oss_core/pm/screendesigner/images/bk1.jpg)  repeat'
                    })

                }
            },
            // TODO: 自定义Slider(done)
            sliderTooltip: function(id, init_value, min, max, step, fun) {

                var tooltip = $('<div class="sliderTooltip" />').css({
                    position: 'absolute',
                    top: -25,
                    left: -18
                }).hide();
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
