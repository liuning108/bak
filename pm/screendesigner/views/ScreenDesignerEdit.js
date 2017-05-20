/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerEdit.html",
        "oss_core/pm/screendesigner/js/Zcharts",
        "oss_core/pm/screendesigner/views/ScreenDesignerConfig",
        "oss_core/pm/screendesigner/actions/BScreenMgrAction",
        "oss_core/pm/screendesigner/js/rgbcolor",
        "oss_core/pm/screendesigner/js/StackBlur",
        "oss_core/pm/screendesigner/js/canvg",

    ],
    function(tpl, Zcharts, SDconfigView, BScreenMgrAction) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(options) {
                this.parentView = options.parentView;
                this.params=options.params;
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
                var svg_canvs = this.canvas;
                var svg = svg_canvs.toSVG();
                var canvas=document.getElementById('sSVGPic');
                canvas.width=1920;
                canvas.height =1080;
               canvg(canvas, svg,{
                    'ignoreClear':false,
                    'ignoreDimensions':true,

                    'renderCallback':function(){
                        var dataURL = canvas.toDataURL("image/png");
                        $("#myImg").attr('src',dataURL);
                    }
                });

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
                var id=self.params.copyId||self.params.id;
                BScreenMgrAction.queryBScreenById(id, function(data) {
                    var json = data.topicJson;
                    console.log(data.topicJson);
                    if (!json) {
                        json = {
                            name:'',
                            attrs: {
                                'w': 1920,
                                'h': 1080,
                            },
                            'nodes': []
                        }
                    }
                    json.dom = $('#canvasPage')[0];

                    self.canvas = Zcharts.init(json);
                    self.canvas.setId(self.params.id);
                    self.canvas.setUserId(self.params.userId);
                    self.canvas.setName(json.name);
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
            checkSave:function(){
              var self =this;
              if(self.canvas.name.length<=0){
                  fish.toast('info', '请输入仪表盘名称');
                  return false;
              }
              return true;
            },
            saveButton: function() {
                if(!this.checkSave()){
                    return;
                }
                var self = this;
                var json = self.canvas.json();
                var svg_canvs = this.canvas;
                var svg = svg_canvs.toSVG();
                var canvas=document.getElementById('sSVGPic');
                canvas.width=this.canvas.w;
                canvas.height =this.canvas.h;
               canvg(canvas, svg,{
                    'ignoreClear':false,
                    'ignoreDimensions':true,
                    'renderCallback':function(){
                        var dataURL = canvas.toDataURL("image/png");
                        json.base64=dataURL;
                        BScreenMgrAction.saveOrUpdate(json, function(result) {
                            var topic=result.data[0];
                            if(topic){
                              fish.toast('info', '保存成功');
                              self.canvas.setId(topic.id);
                            }
                        })//end of saveOfUpdate

                    }
                });


            },
            perviewButton: function() {
                var self = this;
                var json = self.canvas.json();
                json.perview = true;
                var id=fish.getUUID();
                fish.store.set(id, json);
                window.open("http://127.0.0.1:8080/oss/oss_core/pm/screendesigner/perview.html?id="+id)

            }



        });
    });
