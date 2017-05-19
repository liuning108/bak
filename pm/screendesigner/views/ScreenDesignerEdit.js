/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerEdit.html",
        "oss_core/pm/screendesigner/js/Zcharts",
        "oss_core/pm/screendesigner/views/ScreenDesignerConfig",
        "oss_core/pm/screendesigner/actions/BScreenMgrAction",
    ],
    function(tpl, Zcharts, SDconfigView, BScreenMgrAction) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(options) {
                this.parentView = options.parentView;
            },
            events: {
                'click .rect': 'addRect',
                'click .text': 'addText',
                'click .bar': 'addBar',
                'click #saveButton': 'saveButton',
                'click #perviewButton': 'perviewButton',
                'click .canvaset': 'RenderView',
                'click #showListButton': 'showListButton',
                'click #uplodImage': 'upload'
            },
            showListButton: function() {
                this.parentView.showDesigner();
            },
            upload: function() {
                define.amd = false;
                portal.require([
                    "oss_core/pm/screendesigner/js/webupload/js/webuploader.min.js",
                    "css!oss_core/pm/screendesigner/js/webupload/css/webuploader.css"
                ], function() {
                    alert($('#uplodImage849023809489028938409').length);
                    var swfPath=portal.appGlobal.get('webroot')+"/oss_core/pm/screendesigner/js/webuploader/Uploader.swf";
console.log(swfPath);
                    var shiftUploader = WebUploader.create({
                        auto: true,
                        swf:swfPath,
                        server: portal.appGlobal.get('webroot') + "/upload?modelName=shift/import/&genName=true",
                        pick: "#uplodImage849023809489028938409",
                        //fileNumLimit: 1,
                        accept: {
                            title: 'Images',
                            extensions: 'gif,jpg,jpeg,bmp,png',
                            mimeTypes: 'image/*'
                        },
                        resize: false
                    });

                    shiftUploader.on( 'fileQueued', function( file ) {
                        alert(file);
                    })




                })
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            },

            resize: function(h) {

            },

            afterRender: function() {
                var self = this;
                this.RenderHTML();
                this.RenderCanvas(function() {
                    self.RenderView();
                });
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
            RenderCanvas: function(fun) {
                var self = this;
                BScreenMgrAction.queryBScreenById('PMS_20170518114958_10001347', function(data) {
                    var json = data.topicJson;
                    console.log(data.topicJson);
                    if (!json) {
                        json = {
                            attrs: {
                                'w': 1920,
                                'h': 1080,
                            },
                            'nodes': []
                        }
                    }
                    json.dom = $('#canvasPage')[0];

                    self.canvas = Zcharts.init(json);
                    fun();
                })

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
                alert(json.nodes.length)
                json.id = 'PMS_20170518114958_10001347';
                BScreenMgrAction.saveOrUpdate(json, function(result) {
                    console.log("-----")
                    console.log(JSON.stringify(result.data));
                    console.log("-----")
                })
                fish.store.set('json', json);
                fish.toast('info', '保存成功');
                console.log(json)
            },
            perviewButton: function() {
                var self =this;
                var json = self.canvas.json();
                alert(json.x)
                 json.perview = true;
                fish.store.set('json', json);
                window.open("http://127.0.0.1:8080/oss/oss_core/pm/screendesigner/perview.html")
                // $('body').empty();
                // var json = fish.store.get('json')
                // json.dom = $('body')[0],
                //     json.perview = true;
                // Zcharts.init(json);
            }



        });
    });
