define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
"oss_core/pm/screendesigner/js/graphLibs/views/GNumsBarView"
], function(GRoot, View) {

    var GNumsBar = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#fde148';
            var panelColor =this.attrs.PanelColor||'#006699';
            this.attrs.titleColor=titleColor;
            this.attrs.PanelColor=panelColor;
            this.attrs.unit=this.attrs.unit||'元';
            var paper =this.paper;
            var x=0;
            var y =0;
            this.val=297270446;
            this.digits=[];
            this.digits_text=this.paper.set();
            this.digits_panel=this.paper.set();
            this.attrs.digits =this.attrs.digits|| 9;


            for (var i =0 ;i<this.attrs.digits; i++){
              var digit_Item=self.createdigit(i,x,y,titleColor,panelColor)
              this.digits.push(digit_Item);
              this.doms['digit'+i]=digit_Item.set;
              this.digits_text.push(digit_Item.set[0]);
              this.digits_panel.push(digit_Item.set[1]);
            }


             var unitxy=self.getUnitXY();
            var unit=paper.text(unitxy.x,unitxy.y,this.attrs.unit).attr({
                'fill': titleColor,
                'font-size': 42,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
             this.digits_text.push(unit);
            this.doms['unit']=unit;

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

            this.setValue(this.val);

        },
        getUnitXY:function(){
            var lastDig = this.digits[this.digits.length-1];
            var unit_x=(lastDig.x+(lastDig.w+this.attrs.unit.length*12))+lastDig.w/2;
            var unit_y=lastDig.y+lastDig.h/2;
            return {
                x:unit_x,
                y:unit_y
            };
        },
        getData:function(){

            var self = this;
            var intervalTime=1000*2 ;
            this.setValue(this.val);
            this.val=fish.random(this.val,this.val+3000);
            setTimeout(function() {
                self.getData();
            }, intervalTime);
        },
        setValue:function(val){
           var text=this.prefixInteger(val,this.attrs.digits);
           for(var i=0;i<text.length;i++){
               var num = text.charAt(i);
               this.digits[i].num.attr({"text":num});
           }
        },
        prefixInteger:function(val,length){
          return (Array(length).join('0') + val).slice(-length);
        },
        createdigit:function(index,x,y,titleColor,panelColor){
             var paper =this.paper;
             var item ={};
             var w=60;
             var h=w+10;
             var space=10;
             item.x = x+(index*(w+space));
             item.y = y
             item.w=w;
             item.h=h;
             item.set =paper.set();
             item.bgRect=paper.rect(item.x,item.y,w,h).attr({'fill':panelColor,'stroke-width':0});
             var num_x=item.x+w/2;
             var num_y=item.y+h/2;

             item.num=paper.text(num_x,num_y,"0").attr({
                 'fill': titleColor,
                 'font-size': 42,
                 'font-family': '微软雅黑',
                 'font-weight': 'bold'
             });
             item.set.push(item.num);
             item.set.push(item.bgRect);
             return item;

        },
        getDigits:function(){
            return this.attrs.digits;
        },
        setDigits:function(digits){
             var self =this;
             if (this.attrs.digits==digits)return;
             this.attrs.digits=digits;
             self.redarw();
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
            this.digits_text.attr({
               'fill': "" + color
            })
            this.attrs.titleColor = "" + color;
        },
        setPanelColor:function(color){
            this.digits_panel.attr({
               'fill': "" + color
            })
            this.attrs.PanelColor = "" + color;
        },

        getUnit:function(){
          return this.attrs.unit;
        },
       setUnit:function(text){
               this.attrs.unit=text;
               var unit_x=this.getUnitXY().x;
               this.doms['unit'].attr({"text":text,'x':unit_x});
        },
        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        getPanelColor:function(){
              return this.attrs.PanelColor;
        },
        addEvent: function() {
                var self = this;
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })
            if(!this.doms['config'])return;

            // TODO:配置属性(node)
            this.doms['config'].click(function(e) {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                e.stopImmediatePropagation();
            });


        }

    })

    return GNumsBar;


})
