define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GCharacterView"
], function(GRoot, View) {

    var GCharacter = GRoot.extend({
        initAttrs: function() {
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || 'TEXT NAME';
            var titleColor = this.attrs.titleColor || '#ddff00';
            this.attrs.direction=this.attrs.direction||1;
            self.setTitle(title);
            self.setTitleColor(titleColor);
            if(this.attrs.direction==2){

              title=this.handelText(title);
            }


            this.doms['title'] = this.paper.text(0, 0, title).attr({'fill': titleColor, 'font-size': 30, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            var bbox = this.doms['title'].getBBox();

            this.doms['config'] = this.paper.text(bbox.width+10, -30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.doms['remove'] = this.paper.text(bbox.width+10, -30, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

        },
        handelText:function(title) {
            var newTitle="";
            for (var i = 0; i < title.length; i++) {
               newTitle+=title[i]+"\n";
            }
            return newTitle;

        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitle: function(text) {
          //  this.doms['title'].attr({'text':text});
            this.attrs.title = text;
        },
        setTitleColor: function(color) {
            // this.doms['title'].attr({
            //     'fill': "" + color
            // });
            // console.log("" + color)
            this.attrs.titleColor = "" + color;
        },

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        getData:function() {
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

    return GCharacter;

})
