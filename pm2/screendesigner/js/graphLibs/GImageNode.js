define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GCharacterView"
], function(GRoot, View) {

    var GImageNode = GRoot.extend({
        initAttrs: function() {
            this.path="oss_core/pm/screendesigner/js/graphLibs/images/upload/"

        },
        initElement: function() {
            var self = this;
            var name = this.attrs.name || 'map.png';
            var x=0;
            var y=0;

            var imgURL=this.path+name;
            // var myImg = new Image();
            // myImg.src = imgURL;
            // var width = myImg.width;
            // var height = myImg.height;
            this.doms['icon']=this.paper.image(imgURL, x, y, 1256, 1000).toBack();

            this.doms['config'] = this.paper.text(100, -30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.doms['remove'] = this.paper.text(160, -30, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitle: function(text) {
            // this.doms['title'].attr({'text': text});
            // this.attrs.title = text;
        },
        setTitleColor: function(color) {
            // this.doms['title'].attr({
            //     'fill': "" + color
            // });
            // console.log("" + color)
            // this.attrs.titleColor = "" + color;
        },

        getTitle: function() {
            return this.attrs.name;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        editDone:function() {
            var self =this;
            this.gbox.remove()

            this.doms['icon'].hover(function() {
                this.attr({
                    'fill-opacity': 0.3 ,
                    'cursor':'pointer',
                })

            }, function() {
                this.attr({
                    'fill-opacity': 0,
                    'stroke-width':0
                })
            })
            this.doms['icon'].click(function(e) {
              self.selectEvent(e)
            })

        },

        addEvent: function() {
            var self = this;
            // TODO:配置属性(node)
            var view = new View(self);
            // this.doms['config'].click(function(e) {
            //     view.render();
            //     var $panel = $('.configPanel');
            //     $panel.html(view.$el.html());
            //     view.afterRender();
            //     self.ConfigEffect();
            //     e.stopImmediatePropagation();
            // });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm(view.resource.ISDEL).result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GImageNode;

})
