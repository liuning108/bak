/**
 * 指标筛选弹出窗
 */
define([
    "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "text!oss_core/pm/screendesigner/templates/ScreenDesignerEdit.html",
    "oss_core/pm/screendesigner/js/Zcharts",
    "oss_core/pm/screendesigner/views/ScreenDesignerConfig",
    "oss_core/pm/screendesigner/actions/BScreenMgrAction",
    "oss_core/pm/screendesigner/js/rgbcolor",
    "oss_core/pm/screendesigner/js/StackBlur",
    "oss_core/pm/screendesigner/js/canvg",
    "css!oss_core/pm/screendesigner/jsoneditor/jsoneditor.css"
], function(i18nData,tpl, Zcharts, SDconfigView, BScreenMgrAction) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
        resource : fish.extend({}, i18nData),
        initialize: function(options) {
            this.parentView = options.parentView;
            this.params = options.params;
        },
        events: {
            'click .rect': 'addRect',
            'click .text': 'addText',
            'click .bar': 'addBar',
            'click .stripBar': 'addStripBar',
            'click .PieRing': 'addPieRing',
            'click .Nodes': 'addNodes',
            'click .stripLine': 'addStripLine',
            'click .pileBar': 'addPileBar',
            'click .annular': 'addAnnular',
            'click .character': 'addCharacter',
            'click .circleNum': 'addCircleNum',
            'click .arcProcess': 'addArcProcess',
            'click .labelBar': 'addLabelBar',
            'click .progressBar': 'addProgressBar',
            'click .IconBar': 'addIconBar',
            'click .MoveBar': 'addMoveBar',
            'click .numsBar': 'addNumsBar',
            'click .circularRing': 'addCircularRing',
            'click .PieBase': 'addPieBase',
            'click .LineBase': 'addLineBase',
            'click .TableBase': 'addTableBase',
            'click .BarBase': 'addBarBase',
            'click .StripLineBase': 'addStripLineBase',
            'click #saveButton': 'saveButton',
            'click #perviewButton': 'perviewButton',
            'click .canvaset': 'RenderView',
            'click #canvasPage': 'RenderView',
            'click #showListButton': 'showListButton',
            'click #uplodImage': 'upload',
            'click .imageNode': 'addImageNode',
        },
        showListButton: function() {
            this.parentView.showDesigner();

        },

        addImageNode: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'imageNode'
                }
            });
            self.closeMenu();

        },
        upload: function() {
            var svg_canvs = this.canvas;
            var svg = svg_canvs.toSVG();
            var canvas = document.getElementById('sSVGPic');
            canvas.width = 1920;
            canvas.height = 1080;
            canvg(canvas, svg, {
                'ignoreClear': false,
                'ignoreDimensions': true,

                'renderCallback': function() {
                    var dataURL = canvas.toDataURL("image/png");
                    $("#myImg").attr('src', dataURL);
                }
            });

        },
        render: function() {
            this.$el.html(this.template(this.resource));
            return this;
        },

        resize: function(h) {},

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
            // if (!TweenMax.isTweening(".configPanel")) {
            //     TweenMax.from(".configPanel", 1, {x: "200px"});
            // };

            //TweenMax.from(".configPanel", 1, {opacity:0.5});

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

            $('#multipleItems').slick({infinite: true, speed: 500, slidesToShow: 10, slidesToScroll: 3, adaptiveHeight: true});

            // TODO: 初始化图列菜单(done)
            $('#mega-menu-1').dcMegaMenu({rowItems: '3', speed: 0, effect: 'slide', fullWidth: false});

        },
        RenderCanvas: function(fun) {
            var self = this;
            var id = self.params.copyId || self.params.id;
            BScreenMgrAction.queryBScreenById(id, function(data) {
                var json = data.topicJson;
                console.log(data.topicJson);
                if (!json) {
                    json = {
                        name: '',
                        attrs: {
                            'w': 1920,
                            'h': 1080
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
                    'type': 'rect'
                }
            });
            self.closeMenu();

        },
        addText: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'text'
                }
            });
            self.closeMenu();
        },
        addBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'bar'
                }
            });
            self.closeMenu();
        },
        addStripBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'StripBar'
                }
            });
            self.closeMenu();
        },
        addPieRing: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'PieRing'
                }
            });
            self.closeMenu();
        },
        addNodes: function() {

            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'Nodes'
                }
            });
            self.closeMenu();
        },
        addStripLine: function() {

            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'StripLine'
                }
            });
            self.closeMenu();
        },
        addPileBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'PileBar'
                }
            });
            self.closeMenu();
        },
        addAnnular: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'Annular'
                }
            });
            self.closeMenu();
        },
        addCharacter: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'Character'
                }
            });
            self.closeMenu();
        },
        addCircleNum: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'CircleNum'
                }
            });
            self.closeMenu();
        },
        addLabelBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'LabelBar'
                }
            });
            self.closeMenu();
        },
        addArcProcess: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'ArcProcess'
                }
            });
            self.closeMenu();
        },
        addProgressBar: function() {

            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'ProgressBar'
                }
            });
            self.closeMenu();

        },
        addIconBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'IconBar'
                }
            });
            self.closeMenu();
        },
        addMoveBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'MoveBar'
                }
            });
            self.closeMenu();
        },
        addNumsBar: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'NumsBar'
                }
            });
            self.closeMenu();
        },
        addCircularRing: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'CircularRing'
                }
            });
            self.closeMenu();
        },
        addPieBase: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'PieBase'
                }
            });
            self.closeMenu();
        },
        addLineBase: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'LineBase'
                }
            });
            self.closeMenu();
        },
        addStripLineBase: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'StripLineBase'
                }
            });
            self.closeMenu();
        },
        addTableBase: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'TableBase'
                }
            });
            self.closeMenu();

        },
        addBarBase: function() {
            var self = this;
            this.canvas.addNode({
                'attrs': {
                    'type': 'BarBase'
                }
            });
            self.closeMenu();
        },
        checkSave: function() {
            var self = this;
            if (self.canvas.name.length <= 0) {
                fish.toast('info', '请输入仪表盘名称');
                return false;
            }
            return true;
        },

        saveButton: function() {
            if (!this.checkSave()) {
                return;
            }
            var self = this;
            var json = self.canvas.json();
            console.log("----save--");
            console.log(json);
            var svg_canvs = this.canvas;
            var svg = svg_canvs.toSVG();
            var canvas = document.getElementById('sSVGPic');
            canvas.width = this.canvas.w;
            canvas.height = this.canvas.h;
            canvg(canvas, svg, {
                'ignoreClear': false,
                'ignoreDimensions': true,
                'renderCallback': function() {
                    var dataURL = canvas.toDataURL("image/png");
                    json.base64 = dataURL;
                    BScreenMgrAction.saveOrUpdate(json, function(result) {
                        var topic = result.data[0];
                        if (topic) {
                            fish.toast('info', self.resource.SUCCESSFULLY);
                            self.canvas.setId(topic.id);
                        }
                    }) //end of saveOfUpdate

                }
            });

        },
        perviewButton: function() {
            var self = this;
            var json = self.canvas.json();
            json.perview = true;
            var id = fish.getUUID();
            fish.store.set(id, json);
            window.open("oss_core/pm/screendesigner/perview.html?id=" + id)

        }

    });
});
