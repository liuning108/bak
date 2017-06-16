define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GProgressBarView"
], function(GRoot, View) {

    var GProgressBar = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#e7e7e7';
            var processColor= this.attrs.processColor||'#01b1f1';
            this.attrs.memberTitle=this.attrs.memberTitle||'增幅';
            this.attrs.denominatorTitle=this.attrs.denominatorTitle||'总量'
            this.attrs.processColor=processColor;
            var paper =this.paper;
            var set =paper.set();
            var x=0;
            var y=0;
            var w=400;
            var h=12;
            var rect =paper.rect(x,y,w,h,6).attr({
                                                 'fill':'#e7e7e7',
                                                 'stroke-width':0
                                              });
            var p_w=w*0.6;
            this.process = paper.rect(x,y,0,h,6).attr({
                                                'fill':processColor,
                                                'stroke-width':0
                                              });

            this.process.animate({"width":p_w},1900);
            set.push(rect);
            set.push(this.process);
            this.doms['process']=set;
            var title_x=x+40;
            var title_y=y-20;
            this.doms['title'] = this.paper.text(title_x, title_y, title).attr({
                'fill': titleColor,
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

            var nums_x=title_x+(w/1.5);
            var nums_y=title_y;
            var num1=fish.random(200,999);
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': nums_x,
                'y': nums_y,
                'value': num1,
                'showLabel':self.getValueUnit(),
                attrs: {
                    'fill': titleColor,
                    'font-size': 20,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });



            // var nums_box =this.doms['nums'].getBBox(true);
            // var nums2_x=nums_box.x+nums_box.width*1.7;
            // var nums2_y=title_y;
            //
            //
            // this.doms['nums2'] = this.paper.chartsNumbser({
            //     'x': nums2_x,
            //     'y': nums2_y,
            //     'value': 999,
            //     'showLabel':'('+this.attrs.denominatorTitle+')',
            //     attrs: {
            //         'fill': titleColor,
            //         'font-size': 20,
            //         'font-family': '微软雅黑',
            //         'font-weight': 'bold'
            //     }
            // });
            //
            // this.doms['nums'].setValue(num1,function(){
            //     self.changePostions(nums_box);
            // })

            var nums3_x=nums_x+40;
            var nums3_y=nums_y-30;

            var perValue=(num1/999)*100;

            this.doms['nums3'] = this.paper.chartsNumbser({
                'x': nums3_x,
                'y': nums3_y,
                'value': perValue,
                'showLabel':'%',
                attrs: {
                    'fill': processColor,
                    'font-size': 30,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

            self.setTitle(title);
            self.setTitleColor(titleColor);

            this.doms['config'] = this.paper.text(100, -30, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(160, -30, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        getValueUnit:function(){
            var num2_text='999('+this.attrs.denominatorTitle+')';
           return '('+this.attrs.memberTitle+')/'+num2_text;
        },
        getMemberTitle:function(){
         return this.attrs.memberTitle;
        },
        setMemberTitle:function(title){
            var self =this;
            this.attrs.memberTitle=title;
            this.doms['nums'].setUnit(self.getValueUnit());
        },
        getDenominatorTitle:function(){
          return this.attrs.denominatorTitle;
        },
        setDenominatorTitle:function(title){
            var self =this;
            this.attrs.denominatorTitle=title;
            this.doms['nums'].setUnit(self.getValueUnit());
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

        getProcessColor:function(){


            return this.attrs.processColor
        },

        setProcessColor:function(color){
            this.doms['nums3'].attr({
                'fill': "" + color
            });
            this.process.attr({
                'fill': "" + color
            });

           this.attrs.processColor=""+color;
        },
        //setProcessColor

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },

        addEvent: function() {
            if(!this.doms['config'])return;
            var self = this;
            // TODO:配置属性(node)
            this.doms['config'].click(function(e) {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
                e.stopImmediatePropagation();
            });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GProgressBar;


})
