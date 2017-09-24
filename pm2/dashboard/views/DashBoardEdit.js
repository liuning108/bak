  /**
 * 指标筛选弹出窗
 */
define([
    "oss_core/pm/dashboard/js/webupload/js/webuploader",
    "oss_core/pm/dashboard/actions/DashBoardAction",
    "oss_core/pm/dashboard/views/DashBoardConfigConfig",
    "oss_core/pm/dashboard/js/html2canvas",
    "oss_core/pm/dashboard/js/Dcharts",
    "oss_core/pm/dashboard/js/echarts-all-3",
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
    "text!oss_core/pm/dashboard/templates/DashBoardEdit.html",
    "oss_core/pm/adhocdesigner/views/AdhocFactory",
    "css!oss_core/pm/dashboard/js/webupload/css/webuploader.css"
], function(WebUploader,action, DashBoardConfigConfigView, html2canvas, Dcharts, echarts, i18nData, tpl, adhocFactory) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
        resource: fish.extend({}, i18nData),
        initialize: function(options) {
            this.parentView = options.parentView;
            this.params = options.params;
            this.fullScreen=options.fullScreen||false;
        },
        events: {
            'click #saveButton': 'saveButton',
            'click #perviewButton': 'perviewButton',
            'click .canvaset': 'RenderView',
            'click #canvasPage': 'RenderView',
            'click #showListButton': 'showListButton',
            'click #uplodImage': 'upload',
            'click .addAdHoc': 'addAdHoc',
            'click .addText': 'addText',
            'click #dashboardCanvasEdit':'RenderView',
            'click .fullScreen':'fullScreen',
            'click .normalScreen':'normalScreen',
            'click .hiddenButton':'hiddenButton',
            'click .DashboardAttrsPanle':'DashboardAttrsPanle'

        },
        DashboardAttrsPanle:function() {
             $('.fullPanel').show();
        },
        hiddenButton:function() {
              $('.fullPanel').hide();
        },
        normalScreen:function() {
          var canvasjson = this.dcharts.getJson();
          this.parentView.edit(canvasjson);
        },

        fullScreen:function() {
            var canvasjson = this.dcharts.getJson();
            this.parentView.fullScreen(canvasjson);
        },

        showListButton: function() {
            var json = this.dcharts.getJson();
            this.parentView.showDesigner({classNo: json.classNo, topicId: json.id});
        },

        render: function() {
            this.resource.isFullScreen= this.fullScreen
            this.$el.html(this.template(this.resource));
            return this;
        },

        resize: function(h) {},

        RenderView: function() {
             $('.selectedNode').removeClass("selectedNode");
            var dashBoardConfigConfigView = new DashBoardConfigConfigView(this.dcharts);
            dashBoardConfigConfigView.render();
            $(".dashBoardConfigPanel").html(dashBoardConfigConfigView.$el);
            dashBoardConfigConfigView.afterRender();

        },
        createGirds: function(w, h, pos) {
            var canvas = document.getElementById("dashBoardGirdCanvas");
            canvas.width = w;
            canvas.height = h
            $("#dashBoardGirdCanvas").css("top", 10);
            $("#dashBoardGirdCanvas").css("left", pos.left);
            var ctx = $("#dashBoardGirdCanvas")[0].getContext("2d");
            // ctx.fillStyle='#FF0000';
            // ctx.fillRect(0,0,80,100);
            var g=15;

            var rows = parseInt(w / g);
            var cols = parseInt(h+g / g);
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < cols; ++j) {
                    ctx.lineWidth=0.1;
                    ctx.strokeRect(i*g,j*g,g,g);
                }
            }
        },
        afterRender: function() {
            var self = this;
            this.RenderHTML();
            var dash_w = $("#dashboardCanvasEdit").outerWidth()
            var ratio = (9 / 16);

            var canvas_json = this.params

            if (canvas_json.id == 0) {
                canvas_json = {
                    ratio: ratio,
                    id: 0,
                    classNo: canvas_json.classNo,
                    size: {
                        w: dash_w,
                        h: dash_w * ratio
                    },
                    name: canvas_json.name||"dashboardName",
                    attrs: {
                        nodes: []
                    }
                }
            }

            if(!canvas_json.canvasAttrs)canvas_json.canvasAttrs={};
            var factor = dash_w / canvas_json.size.w;
            this.dcharts = Dcharts.init({

                containment: "#dashboardCanvasEdit",
                ratio: canvas_json.ratio,
                bgitem:canvas_json.canvasAttrs.bgitem||0,
                bk:canvas_json.canvasAttrs.bk||{"background":"#fff"},
                size: {
                    w: dash_w,
                    h: canvas_json.size.h*factor
                },
                factor: factor,
                nodes: canvas_json.attrs.nodes,
                classNo: canvas_json.classNo,
                id: canvas_json.id,
                name: canvas_json.name,
                parent:self,
                resize: function(h) {
                    self.resizeCanvas(h)
                }
            });

            this.RenderView();
            this.resizeCanvas(canvas_json.size.h * factor)
            this.endLoad();
            $('.fullPanel').draggable({containment: "parent"});

            return this;
        },
        endLoad:function() {
            var canvas_json = this.params
            if(canvas_json.id==0)this.saveButton();
        },

        resizeCanvas: function(h) {
            var self = this;
            var pos = $("#dashboardCanvasEdit").position();
            pos.left = $("#dashboardCanvasEdit").css("marginLeft")
            var dash_w = $("#dashboardCanvasEdit").outerWidth()
            this.createGirds(dash_w, h, pos);
        },

        // TODO: 单击子节点,关闭子节点页板(done)
        closeMenu: function() {
            var $menu = $('#mega-menu-dash')
            var subNav = $menu.find('.sub');
            $menu.removeClass('mega-hover');
            $(subNav).hide();
        },

        addAdHoc: function() {
           var w = 360;
            var h = 270
            var point = this.dcharts.getCenterLocation(w, h)
            this.dcharts.addNode({
                type: 'adhoc',
                w: 360,
                h: 270,
                x: point.x,
                y: point.y
            }, function(node) {
                node.setSelected()
                node.bounceIn();
            })
            this.closeMenu();
            // var view = adhocFactory.adhocConfigForDashBoard(600);
            // var content = view.$el;
            // var option = {
            //     content: content,
            //     width: 1300,
            //     height: 600
            // };
            // this.adhocCfgView = fish.popup(option);
            // this.listenTo(view, 'AdhocCancelEvent', this.wrap(function () {
            //     this.adhocCfgView.close();
            // }));
        },

        addImage: function(config) {
            var w = config.w;
            var h = config.h
            var point = this.dcharts.getCenterLocation(w, h)
            this.dcharts.addNode({
                type: 'imageNode',
                w: w,
                h: h,
                attrs:{
                    src:config.src,
                },
                x: point.x,
                y: point.y
            }, function(node) {
                node.setSelected()
                node.bounceIn();
            })
            this.closeMenu();
        },

        addText: function() {

            var w = 360;
            var h = 270
            var point = this.dcharts.getCenterLocation(w, h)
            this.dcharts.addNode({
                type: 'text',
                w: 360,
                h: 270,
                x: point.x,
                y: point.y
            }, function(node) {
                node.setSelected()
                node.bounceIn();
            })
            this.closeMenu();
        },
        RenderHTML: function() {
            var self = this;

            var height = $('body').height() - 150;
            var w = $('.mainContent2').width();

            $('.mainContent2').slimscroll({'height': height, 'alwaysVisible': false, 'opacity ': .1, 'size': 1, 'color': '#e3e3e3'});

            $('#multipleItems').slick({infinite: true, speed: 500, slidesToShow: 10, slidesToScroll: 3, adaptiveHeight: true});

            // TODO: 初始化图列菜单(done)
            $('#mega-menu-dash').dcMegaMenu({rowItems: '3', speed: 0, effect: 'slide', fullWidth: true});


            //添加图添点
            this.shiftUploader = WebUploader.create({
               auto : true,
                swf: portal.appGlobal.get('webroot') + "frm/fish-desktop/third-party/fileupload/Uploader.swf",
                server: portal.appGlobal.get('webroot') + "/upload?modelName=dashboard/import/&genName=true",
                pick: ".dashBoardAddImage",
                accept: {
                        title: 'Image',
                        extensions: 'jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    },
              //  fileNumLimit: 1,
                resize: false
            });
            this.shiftUploader.on( 'uploadSuccess', function( file, response ) {

              var config =response.data;
              action.moveFile("upload/bscreen/import/",config.filePath,function() {
                  // fileName:"170817142623246836.png"
                  // filePath:"shift/import/170817142623246836.png"
                  // fileSize:"837999"
                  // fileSrc:"QQ图片20170714164501.png"
                  var filePath= portal.appGlobal.get('webroot')+"/upload/"+config.filePath;
                  var myImg = new Image();
                  myImg.src =filePath
                  myImg.onload=function(){
                    self.addImage({
                        'src':filePath,
                        'w':this.width*0.3,
                        'h':this.height*0.3,
                        'filename':config.filePath
                    })
                  }


              })

              // var width = myImg.width;
              // var height = myImg.height;


            });

        },
        RenderCanvas: function(fun) {},

        saveButton: function() {
            var self = this;
            var json = this.dcharts.getJson();
            fish.store.set("canvas_json", json)
            action.saveUpdateDashBoard(json, function(data) {
                 var oldId= self.dcharts.options.id;
                self.dcharts.options.id = data.result.id;
                if(oldId!=0)fish.toast('success','Save Success');
            })

            //   var hh =$("#dashboardCanvasEdit").outerHeight() *2;
            //   html2canvas(document.getElementById('dashboardCanvasEdit'),{
            //         allowTaint:true,
            //         height: hh,
            //      onrendered:function(canvas) {
            //          var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            //           window.location.href=image; // it will save locally
            //      },
            //  });

        },
        perviewButton: function() {
            var id = "dashboard-perview";
            var $tpl = $("<div class='container-fluid editBody' style='margin:10px'>").data({menuId: false, menuUrl: '', privCode: '', menuName: '', menuType: ''}).attr({menuId: false, menuUrl: null});
            $("#divContent").tabs("option", "panelTemplate", $tpl).tabs("add", {
                active: true,
                id: id,
                label: 'perview'
            });
            $tpl.append("<div id='dashboard-perview-canvas' class='dashboardCanvas' ></div>");
            $("#dashboard-perview-canvas").empty();
            var ratio = (9 / 16);
            var dash_w = $("#dashboard-perview-canvas").outerWidth()
            var canvasjson = this.dcharts.getJson();
            var factor = dash_w / canvasjson.size.w;
            if(!canvasjson.canvasAttrs)canvasjson.canvasAttrs={};
            Dcharts.init({
                containment: "#dashboard-perview-canvas",
                ratio: ratio,
                bgitem:canvasjson.canvasAttrs.bk||0,
                bk:canvasjson.canvasAttrs.bk||{"background":"#fff"},
                size: {
                    w: dash_w,
                    h: canvasjson.size.h*factor
                },
                factor: factor,
                nodes: canvasjson.attrs.nodes,
                perview: true,
                parent:self,
            });
        } //end of div

    });
});
