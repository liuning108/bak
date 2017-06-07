define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GLabelBarView"
], function(GRoot, View) {

    var GLabelBar = GRoot.extend({
        initElement: function() {
            var self = this;
            var paper=this.paper;
            self.createRoundedRectangleFN();
            var x=0;
            var y=0;
  　　var hn_area=['长沙', '株洲', '湘潭', '衡阳','邵阳','岳阳','常德','张家界','益阳','娄底','郴州','永州','怀化','湘西'];
           //this.names = this.attrs.names || ['华北', '西南', '华东', '华南']
            this.names = this.attrs.names || hn_area
            this.colors=['#5a9bd5','#01d15e','#ffc101','#e97870']

            for (var i =0;i<this.names.length;i++)
            {

                var name=this.names[i];
                var value=fish.random(80, 98);
                var per=value/100;
                var color=this.colors[i%this.colors.length];
                var item=self.createItem(i,x,y,name,color,per,value);
                this.doms['item'+i]=item.set;
            }

            // this.doms['title'] = this.paper.text(0, 0, title).attr({
            //     'fill': titleColor,
            //     'font-size': 30,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            // self.setTitle(title);
            // self.setTitleColor(titleColor);
            //
            //
            // this.doms['config'] = this.paper.text(100, -30, '配置').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            this.doms['remove'] = this.paper.text(0,-30, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        createItem:function(index,x,y,name,color,per,value){
            var self =this;
            var paper =this.paper;
            var set =paper.set();
            var item={};
            var item_x=x;
            var item_h=40;
            var item_y=y+(index*(item_h+20));
            var item_w=100;

            var font_style={
                'fill': '#ffffff',
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            }

            // darw header
            item.header=paper.roundedRectangle(item_x, item_y, item_w, item_h, 20, 0, 0, 20).attr({fill: color});
            item.text=paper.text(item_x+item_w/2,item_y+item_h/2,name).attr(font_style);
            var process_w=300*per;
            var process_x=item_x+item_w+20;
            item.process=paper.rect(process_x,item_y+13,0,13,6).attr({fill: color})
            item.process.animate({'width':process_w},1900)
            var num_x=process_x+process_w+30;
            item.num=paper.chartsNumbser({
                'x': num_x,
                'y': item_y+15,
                'value': value,
                attrs: {
                    'fill': color,
                    'font-size': 24,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

            set.push(item.header)
            set.push(item.text)
            set.push(item.process)
            set.push(item.num)
            item.set=set;
            return item;
        },
        createRoundedRectangleFN:function(){

            Raphael.fn.roundedRectangle = function (x, y, w, h, r1, r2, r3, r4){
                    var array = [];
                    array = array.concat(["M",x,r1+y, "Q",x,y, x+r1,y]); //A
                    array = array.concat(["L",x+w-r2,y, "Q",x+w,y, x+w,y+r2]); //B
                    array = array.concat(["L",x+w,y+h-r3, "Q",x+w,y+h, x+w-r3,y+h]); //C
                    array = array.concat(["L",x+r4,y+h, "Q",x,y+h, x,y+h-r4, "Z"]); //D
                   return this.path(array);
          };

        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },


        addEvent: function() {
          //  if(!this.doms['config'])return;
            var self = this;
            // TODO:配置属性(node)
            // this.doms['config'].click(function(e) {
            //     var view = new View(self);
            //     view.render();
            //     var $panel = $('.configPanel');
            //     $panel.html(view.$el.html());
            //     view.afterRender();
            //     e.stopImmediatePropagation();
            // });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GLabelBar;


})
