define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GCircularRingView"
], function(GRoot, View) {

    var GCircularRing = GRoot.extend({
        initElement: function() {
            var self = this;
            var paper =this.paper;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var x=0;
            var y=0;
            var r=300;
            var thickness=40;
            this.thickness=thickness;
            var outR=r+thickness;
            var paper=this.paper;
            var colors=['#1c7099','#1790cf','#1bb2d8','#99d2dd','#88b0bb'];
            var hn_area=['长沙', '株洲', '湘潭', '衡阳','邵阳','岳阳','常德','张家界','益阳','娄底','郴州','永州','怀化','湘西'];
            var datas=[];
            var sum =0;
            for (var i=0;i<hn_area.length;i++){
                var item={};
                item.name=hn_area[i];

                item.value=fish.random(200,999);
                sum=sum+item.value;
                datas.push(item);
            }
            this.createArcRingAttrs();

             var start=0;
             var end=0;
            for(var i=0;i<datas.length;i++){
                 var data_item=datas[i];
                 var per=data_item.value/sum;
                 start=0+end;

                 end=start+(359.99*per);
                 var color=colors[i%colors.length];
                 item=paper.path();
                 item.data('id','item'+i)
                 item.data('color',color);
                 item.data('name',data_item.name);
                 item.data('val',Math.floor(per*100)+"%");
                 if(this.canvas.perview){
                     item.attr({
                        'stroke-width':0,
                        'fill':colors[i%colors.length],
                        'arcRing':[x,y,start,start,r,outR]
                    })

                    item.animate({
                       'stroke-width':0,
                       'fill':colors[i%colors.length],
                       'arcRing':[x,y,start,end,r,outR]
                   },1900)

                 }else{
                     item.attr({
                        'stroke-width':0,
                        'fill':colors[i%colors.length],
                        'arcRing':[x,y,start,end,r,outR]
                    })
                 }


                this.doms['item'+i]=item;

            }

            // this.doms['config'] = this.paper.text(100, -30, '配置').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            // this.doms['remove'] = this.paper.text(160, -30, '删除').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;



        },

        createArcRingAttrs:function(){
            var paper=this.paper;
            var self =this;
            paper.customAttributes.arcRing = function(centerX, centerY, startAngle, endAngle, innerR, outerR) {
                var radians = Math.PI / 180,
                    largeArc = +(endAngle - startAngle > 180);
                    outerX1 = centerX + outerR * Math.cos((startAngle - 90) * radians),
                    outerY1 = centerY + outerR * Math.sin((startAngle - 90) * radians),
                    outerX2 = centerX + outerR * Math.cos((endAngle - 90) * radians),
                    outerY2 = centerY + outerR * Math.sin((endAngle - 90) * radians),
                    innerX1 = centerX + innerR * Math.cos((endAngle - 90) * radians),
                    innerY1 = centerY + innerR * Math.sin((endAngle - 90) * radians),
                    innerX2 = centerX + innerR * Math.cos((startAngle - 90) * radians),
                    innerY2 = centerY + innerR * Math.sin((startAngle - 90) * radians);

                // build the path array
                var path = [
                    ["M", outerX1, outerY1], //move to the start point
                    ["A", outerR, outerR, 0, largeArc, 1, outerX2, outerY2], //draw the outer edge of the arc
                    ["L", innerX1, innerY1], //draw a line inwards to the start of the inner edge of the arc
                    ["A", innerR, innerR, 0, largeArc, 0, innerX2, innerY2], //draw the inner arc
                    ["z"] //close the path
                ];
                var center_endAngle = endAngle - (endAngle - startAngle) / 2;
                var space_font=20;
                var c_outerX1 = centerX + (outerR+space_font) * Math.cos((center_endAngle - 90) * radians);
                var c_outerY1 = centerY + (outerR+space_font) * Math.sin((center_endAngle - 90) * radians);

                var c_outerX2 = centerX + (outerR-self.thickness/2) * Math.cos((center_endAngle - 90) * radians);
                var c_outerY2 = centerY + (outerR-self.thickness/2)* Math.sin((center_endAngle - 90) * radians);

                if (!this.label){

                    this.label=paper.text(c_outerX1,c_outerY1,this.data('val')).attr({
                        'fill': this.data('color'),
                        'font-family': '微软雅黑',
                        'font-weight': 'bold'
                    });
                    this.label2=paper.text(c_outerX2,c_outerY2,this.data('name')).attr({
                        'fill': '#fff',
                        'font-family': '微软雅黑',
                        'font-weight': 'bold'
                    });
                    self.doms['text'+this.data('id')]=this.label;
                    self.doms['text2'+this.data('id')]=this.label2;
                }else{
                      this.label.attr({'x':c_outerX1,'y':c_outerY1});
                     this.label2.attr({'x':c_outerX2,'y':c_outerY2});

                }
                return {
                    path: path
                };
            };

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
            console.log("" + color)
            this.attrs.titleColor = "" + color;
        },

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

    return GCircularRing;


})
