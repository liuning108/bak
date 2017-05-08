/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesigner.html",
        "oss_core/pm/screendesigner/js/Zcharts",
        "css!oss_core/pm/screendesigner/css/screendesigner.css",
        "oss_core/pm/screendesigner/js/raphael-min",
        "oss_core/pm/screendesigner/js/raphael.free_transform",


    ],
    function(tpl, Zcharts) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function() {},
            events: {
                'click .rect': 'addRect',
                'click #saveButton': 'saveButton',
                'click #perviewButton': 'perviewButton'
            },

            render: function() {
                this.$el.html(this.template());

                return this;
            },

            resize: function(h) {

            },

            afterRender: function(data) {

                this.RenderHTML();
                this.RenderCanvas();

                return this;
            },
            RenderHTML: function() {
                var self = this;

                var height = $('body').height() - 200;
                // $('#canvasPage').css('min-height',height);
                // $('#canvasPage').css('min-width',$('#canvasPage').width());
                //$('#canvasPage').css('height',height);

                $('#multipleItems').slick({
                    infinite: true,
                    speed: 500,
                    slidesToShow: 10,
                    slidesToScroll: 3,
                    adaptiveHeight: true,
                });
                $('.well').height(52);

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
                        self.canvas.setBK({ 'background': 'url(oss_core/pm/screendesigner/images/bk1.jpg)  repeat' })
                    } else {
                        self.canvas.setBK({ 'background': '#fff' })

                    }
                })

            },
            RenderCanvas: function() {
                var json = fish.store.get('json')
                if (!json) {
                    json = {
                        'w': 1920,
                        'h': 1080,
                        'nodes': []
                    }
                }
                json.dom = $('#canvasPage')[0],
                    this.canvas = Zcharts.init(json);
            },
            addRect: function() {
                var self = this;
                this.canvas.addNode({
                    'attrs': {
                        'x': 0,
                        'y': 0,
                        'w': '100',
                        'h': '100',
                        'type': 'rect'
                    }
                });


            },
            saveButton: function() {
                var self = this;
                var json = self.canvas.json();
                fish.store.set('json', json);
                fish.toast('info', '保存成功');
            },
            perviewButton: function() {
                $('body').empty();
                var json = fish.store.get('json')
                json.dom = $('body')[0],
                    Zcharts.init(json);
            }



        });
    });
