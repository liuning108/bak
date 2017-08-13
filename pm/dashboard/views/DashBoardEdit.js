/**
 * 指标筛选弹出窗
 */
define([
  "oss_core/pm/dashboard/actions/DashBoardAction",
  "oss_core/pm/dashboard/views/DashBoardConfigConfig",
  "oss_core/pm/dashboard/js/html2canvas",
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
  "i18n!oss_core/pm/dashboard/i18n/SDesinger",
  "text!oss_core/pm/dashboard/templates/DashBoardEdit.html"
], function(action,DashBoardConfigConfigView,html2canvas,Dcharts, echarts, i18nData, tpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(options) {
      this.parentView = options.parentView;
      this.params = options.params;
    },
    events: {
      'click #saveButton': 'saveButton',
      'click #perviewButton': 'perviewButton',
      'click .canvaset': 'RenderView',
      'click #canvasPage': 'RenderView',
      'click #showListButton': 'showListButton',
      'click #uplodImage': 'upload',
      'click .BarBase': 'addBarBase'
    },
    showListButton: function() {
      var json =this.dcharts.getJson();
      this.parentView.showDesigner({
          classNo:json.classNo,
          topicId:json.id
      });
    },

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    resize: function(h) {},

    RenderView: function() {
        var dashBoardConfigConfigView = new DashBoardConfigConfigView(this.dcharts);
        dashBoardConfigConfigView.render();
        $(".dashBoardConfigPanel").html(dashBoardConfigConfigView.$el);
        dashBoardConfigConfigView.afterRender();
    },
    afterRender: function() {
      var self = this;
      this.RenderHTML();
      var dash_w = $("#dashboardCanvasEdit").outerWidth()
      var ratio = (9 / 16);

      var canvas_json = this.params
      console.log(canvas_json);
      if(canvas_json.id==0){
        canvas_json ={
          ratio: ratio,
          id :0,
          classNo:canvas_json.classNo,
          size:{
            w: dash_w,
            h: dash_w * ratio
          },
          name:"dashboardName",
          attrs:{nodes:[]}
        }
      }
      var factor=dash_w/canvas_json.size.w;
      this.dcharts = Dcharts.init({

        containment: "#dashboardCanvasEdit",
        ratio: canvas_json.ratio,
        size: {
          w: dash_w,
          h: canvas_json.size.h*factor
        },
        factor: factor,
        nodes:canvas_json.attrs.nodes,
        classNo: canvas_json.classNo,
        id : canvas_json.id,
        name:canvas_json.name
      });

      this.RenderView();


      return this;
    },

    // TODO: 单击子节点,关闭子节点页板(done)
    closeMenu: function() {
      var $menu = $('#mega-menu-dash')
      var subNav = $menu.find('.sub');
      $menu.removeClass('mega-hover');
      $(subNav).hide();
    },
    addBarBase: function() {
      this.dcharts.addNode({
        type: 'bar',
        w: 400,
        h: 400,
        x:1,
        y:1,
      })
      this.closeMenu();
    },
    RenderHTML: function() {
      var self = this;


      var height = $('body').height() - 150;
      var w = $('.mainContent2').width();

      $('.mainContent2').slimscroll({
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
        adaptiveHeight: true
      });

      // TODO: 初始化图列菜单(done)
      $('#mega-menu-dash').dcMegaMenu({
        rowItems: '3',
        speed: 0,
        effect: 'slide',
        fullWidth: true
      });

    },
    RenderCanvas: function(fun) {

    },



    saveButton: function() {
     var self =this;
      var json = this.dcharts.getJson();
      console.log(json);
      fish.store.set("canvas_json",json)


      action.saveUpdateDashBoard(json,function(data){
         self.dcharts.options.id = data.result.id;
         fish.success('Save Success');
         console.log(data);
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
      var $tpl = $("<div class='container-fluid editBody' style='margin:10px'>").data({
        menuId: false,
        menuUrl: '',
        privCode: '',
        menuName: '',
        menuType: ''
      }).attr({
        menuId: false,
        menuUrl: null
      });
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
          var factor=dash_w/canvasjson.size.w;


      Dcharts.init({
        containment: "#dashboard-perview-canvas",
        ratio: ratio,
        size: {
          w: dash_w,
          h: canvasjson.size.h*factor
        },
        factor: factor,
        nodes:canvasjson.attrs.nodes
      });
    } //end of div

  });
});
