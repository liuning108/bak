/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesigner.html",
        "oss_core/pm/screendesigner/js/Zcharts",
        "oss_core/pm/screendesigner/views/ScreenDesignerConfig",
        "css!oss_core/pm/screendesigner/css/screendesigner.css",
        "css!oss_core/pm/screendesigner/css/dcmegamenu.css",
        "css!oss_core/pm/screendesigner/css/icomoon.css",
        "oss_core/pm/screendesigner/js/raphael-min",
        "oss_core/pm/screendesigner/js/raphael.free_transform",
        "oss_core/pm/screendesigner/js/jquery.dcmegamenu.1.3.3",
        "oss_core/pm/screendesigner/js/jquery.hoverIntent.minified"
    ],
    function(tpl, Zcharts, SDconfigView) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function() {},
            events: {
                'click .rect': 'addRect',
                'click .text': 'addText',
                'click .bar': 'addBar',
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
                this.RenderView();
                return this;
            },
            RenderView: function() {
                var sdConfigView = new SDconfigView(this.canvas);
                sdConfigView.render();
                $(".configPanel").html(sdConfigView.$el);
                sdConfigView.afterRender();
            },
            // TODO: 单击子节点,关闭子节点页板(done)
            closeMenu: function() {
                var $menu = $('#mega-menu-1')
                var subNav = $menu.find('.sub');
                $menu.removeClass('mega-hover');
                $(subNav).hide();
            },
            RenderHTML: function() {
                var self = this;

                var height = $('body').height() - 150;
                var w = $('.mainContent').width();
                $('.mainContent').slimscroll({
                    'width': w,
                    'height': height,
                    'alwaysVisible': false,
                    'opacity ': .1,
                    'size': 1,
                    'color': '#e3e3e3'
                });
                $('#multipleItems').slick({
                    infinite: true,
                    speed: 500,
                    slidesToShow: 10,
                    slidesToScroll: 3,
                    adaptiveHeight: true,
                });



                // TODO: 初始化图列菜单(done)
                $('#mega-menu-1').dcMegaMenu({
                    rowItems: '3',
                    speed: 0,
                    effect: 'slide',
                    fullWidth: false,

                });





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
                json.dom = $('#canvasPage')[0];
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
            addText: function() {
                var self = this;
                this.canvas.addNode({
                    'attrs': {
                        'x': 0,
                        'y': 0,
                        'w': '100',
                        'h': '100',
                        'type': 'text'
                    }
                });
                self.closeMenu();
            },
            addBar: function() {
                var self = this;
                this.canvas.addNode({
                    'attrs': {
                        'x': 0,
                        'y': 0,
                        'w': '100',
                        'h': '100',
                        'type': 'bar'
                    }
                });
                self.closeMenu();
            },
            saveButton: function() {
                var self = this;
                var json = self.canvas.json();
                fish.store.set('json', json);
                fish.toast('info', '保存成功');
                console.log(json)
            },
            perviewButton: function() {
                $('body').empty();
                var json = fish.store.get('json')
                json.dom = $('body')[0],
                    json.perview = true;
                Zcharts.init(json);
            }



        });
    });
