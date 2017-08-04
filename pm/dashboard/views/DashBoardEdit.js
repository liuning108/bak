/**
 * 指标筛选弹出窗
 */
define([
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
  "i18n!oss_core/pm/dashboard/i18n/SDesinger",
  "text!oss_core/pm/dashboard/templates/DashBoardEdit.html"
], function(Dcharts, echarts, i18nData, tpl) {
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
      this.parentView.showDesigner();

    },

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    resize: function(h) {},

    afterRender: function() {

      var self = this;
      this.RenderHTML();
      //this.ecartBar()

      var dash_w = $("#dashboardCanvas").outerWidth()
      var radio = (9 / 16);
      this.dcharts = Dcharts.init({
        containment: "#dashboardCanvas",
        ratio: radio,
        oSize: {
          w: dash_w,
          h: dash_w * radio,
        },
        tSize: {
          w: dash_w,
          h: dash_w * radio
        }

      });




      return this;
    },
    ecartBar: function() {

      var node = $('.dashNode').find(".dashCanvas");
      $(".dashNode").draggable({
        containment: "#dashboardCanvas",
        scroll: false
      });


      var myChart = echarts.init(node[0]);
      // 指定图表的配置项和数据
      var option = {

        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };

      myChart.setOption(option);
      $(".dashNode").resizable({
        containment: "#dashboardCanvas",
        stop: function() {
          myChart.resize();
        }
      });

    },

    RenderView: function() {
      // var sdConfigView = new SDconfigView(this.canvas);
      // sdConfigView.render();
      // $(".configPanel").html(sdConfigView.$el);
      // sdConfigView.afterRender();
      // if (!TweenMax.isTweening(".configPanel")) {
      //     TweenMax.from(".configPanel", 1, {x: "200px"});
      // };

      //TweenMax.from(".configPanel", 1, {opacity:0.5});

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
        w:400,
        h:400
      })
      this.closeMenu();
    },
    RenderHTML: function() {
      //  var   radio = 9/16;
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

      //
      //  var wout=$("#dashboardCanvas").outerWidth()
      // $("#dashboardCanvas").css({
      //   'height': ww*radio
      // })
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


    },
    perviewButton: function() {
      // var self = this;
      // var json = self.canvas.json();
      // json.perview = true;
      // var id = fish.getUUID();
      // fish.store.set(id, json);
      // window.open("oss_core/pm/screendesigner/perview.html?id=" + id)

    }

  });
});
