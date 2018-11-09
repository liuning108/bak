define([
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView", "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GTextView"
], function(DBConfigTreeView, GRoot, View) {

    var GText = GRoot.extend({
        initAttrs: function() {
            this.attrs.backW = this.attrs.backW ||260
            this.attrs.backH = this.attrs.backH ||125
            this.attrs.offsetX =this.attrs.offsetX||0;
            this.attrs.offsetY =this.attrs.offsetY||0;
            this.attrs.fcolor= this.attrs.fcolor||'#9a26f9'
            this.attrs.scolor= this.attrs.scolor||'#1cb5cf'


            this.attrs.isBackground=this.attrs.isBackground||false
            this.attrs.dbServer = this.attrs.dbServer || {
                'serverName': 'NetworkOverviewDemoQryService',
                'islocal': true,
                'xAxis': [],
                'yAxis': [
                    'field_2'
                ],
                'xNums': 0,
                'yNums': 1,
                'xMinNums': 0,
                'yMinNums': 1
            }
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var numColor = this.attrs.numColor || '#ffffff';
            this.attrs.value = this.attrs.value || 0;
            this.Data2Graph()
            var setBase=this.paper.set();

            this.doms['title'] = this.paper.text(0, 0, title).attr({'fill': titleColor, 'font-size': 30, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            self.setTitle(title);
            self.setTitleColor(titleColor);
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': 0,
                'y': 0 + 40,
                'value': this.attrs.value,
                attrs: {
                    'fill': numColor,
                    'font-size': 30,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });
            if(this.attrs.isBackground){
              setBase.push(this.doms['title'])
              setBase.push(this.doms['nums'])

              var bbox =setBase.getBBox();
              this.doms['title'].attr({'font-size':24})
              var w= this.attrs.backW ;
              var h =this.attrs.backH ;
              this.doms['bgRect']=this.paper.rect(bbox.x-this.attrs.offsetX,bbox.y-this.attrs.offsetY,w,h);
              this.doms['bgRect'].attr({
                "fill":"0-"+this.attrs.fcolor+"-"+this.attrs.scolor,
                'stroke-width':0,
                'opacity':0.8
              }).toBack();
            }


            // this.doms['makepp']=this.paper.path('M46.1,40.7L32,58.6L17.9,40.7c-2.5-2.6-4.2-5.7-5.2-9.3c-0.9-3.5-0.9-7.1,0-10.6s2.6-6.6,5.2-9.3s5.5-4.4,8.9-5.4s6.8-0.9,10.3,0s6.4,2.7,8.9,5.4s4.3,5.7,5.2,9.3s0.9,7.1,0,10.6C50.4,35,48.6,38,46.1,40.7z')
            //
            // this.doms['makepp'].attr({
            //   'fill':'red',
            //   'stroke-width':0,
            // })
            // var ppb=this.doms['nums'].getBBox(true);
            // this.doms['makepp'].translate(ppb.x-ppb.width,ppb.y);


            self.setNumColor(numColor);

            this.doms['config'] = this.paper.text(100, -20, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.doms['remove'] = this.paper.text(100, 10, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

        },
        getValue: function() {
            return this.attrs.value;
        },
        setValue: function(val) {
            this.attrs.value = val;
        },

        toGraph: function(choiceTreeJson) {
            try {
            var json = {}
            json.series = {}
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setValue(json.series.data[0]);
          }catch(e){
            console.log("GText ToGraph");
            console.log(choiceTreeJson);
          }
        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitle: function(text) {
            this.doms['title'].attr({'text': text});
            this.attrs.title = text;
        },
        setTitleColor: function(color) {
            this.doms['title'].attr({
                'fill': "" + color
            });
            console.log("" + color)
            this.attrs.titleColor = "" + color;
        },
        setNumColor: function(color) {
            this.doms['nums'].attr({
                'fill': "" + color
            });
            this.attrs.numColor = "" + color;
        },
        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        getNumColor: function() {

            return this.attrs.numColor;
        },
        addEvent: function() {
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

    return GText;

})
