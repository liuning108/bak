define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GIconBarView"
], function(GRoot, View) {

    var GIconBar = GRoot.extend({
        initAttrs: function() {
            this.path="oss_core/pm/screendesigner/js/graphLibs/images/icons/"
            this.attrs.dbServer = this.attrs.dbServer || {
              'serverName': 'NetworkOverviewDemoQryService',
              'islocal': true,
              'xAxis': [],
              'yAxis': ['field_2'],
              'xNums': 0,
              'yNums': 1,
              'xMinNums': 0,
              'yMinNums': 1
            }
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#00abff';
            var icon_path =this.attrs.iconPath || '1.png'
            this.attrs.iconPath=icon_path;
            var paper=this.paper;
            var x=0;
            var y=0;
            var nums=this.attrs.val||0;
            this.attrs.val=nums;

            this.Data2Graph()


            this.doms['icon']=paper.image(this.path+icon_path, x, y, 128, 128);
            this.doms['title'] = this.paper.text(x+128/2, y+128+10, title).attr({
                'fill': titleColor,
                'font-size': 30,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;


            this.doms['nums'] = this.paper.chartsNumbser({
                'x': x+128/2,
                'y': y-20,
                'value': nums,
                'showLabel':'',
                attrs: {
                    'fill': titleColor,
                    'font-size': 32,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });






            self.setTitle(title);
            self.setTitleColor(titleColor);


            this.doms['config'] = this.paper.text(x, y-50, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(x+60, y-50, 'X').attr({
                'fill': 'red',
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },

        

        setIcon:function(icon){
          this.doms['icon'].attr({
              "src":this.path+icon
          });
          this.attrs.iconPath=icon;
        },
        setVal:function(val) {
           this.attrs.val=val;
        },
        getVal:function() {
           return this.attrs.val;
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitle: function(text) {
            this.doms['title'].attr({
                'text': text
            });
            this.attrs.title = text;
        },
        setTitleColor: function(color) {
            this.doms['title'].attr({
                'fill': "" + color
            });
            this.doms['nums'].attr({
                'fill': "" + color
            });
            console.log("" + color)
            this.attrs.titleColor = "" + color;
        },

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        toGraph: function(choiceTreeJson) {
          try {
          var json = {}
          json.series = {}
          json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
          this.setVal(json.series.data[0]);
          console.log(choiceTreeJson);
          }catch(e){
            console.log("GIconBar ToGraph");
            console.log(choiceTreeJson);
          }
        },
        addEvent: function() {
            if(!this.doms['config'])return;
            var self = this;
            // TODO:配置属性(node)
              var view = new View(self);
            this.doms['config'].click(function(e) {
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
                e.stopImmediatePropagation();
            });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm(view.resource.ISDEL).result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GIconBar;


})
