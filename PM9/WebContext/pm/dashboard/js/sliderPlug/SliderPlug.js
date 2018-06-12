define([

    "text!oss_core/pm/dashboard/js/sliderPlug/SliderPlug.html", "css!oss_core/pm/dashboard/js/sliderPlug/SliderPlug.css"
], function(tpl) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        initialize: function(param) {
            var self = this;
            self.param = param;
        },
        render: function() {
            this.$el.html(this.template());
            return this;

        },
        getValue:function() {
            return this.param.datas[this.cIndex];
        },
        setValue:function(value) {
            var self = this;
            var e={
                currentTarget: this.$el.find('.silder')
            }
            this.moveSilder(e,self.posXDatas[self.findInex(value)])
        },
        findInex:function(value) {
            var self =this;
            for (var i =0 ;i <self.param.datas.length;i++){
                var v = self.param.datas[i];
                if(value==v){
                    return i;
                }

            }
            return 0;
        },

        moveSilder:function(e,cposX) {
            var self =this;
            var ww = this.$el.find('.silder').outerWidth();
            var per = this.$el.find('.silder').outerWidth() / (this.labels.length);
            var posX;
            var target = $(e.currentTarget);

            if(!cposX){
             var pos =target.offset();
             posX= e.pageX - pos.left
             }else{
             posX=cposX
             }
            var value = Math.ceil(posX / target.outerWidth() * 100);
            var perv = Math.ceil((per) / target.outerWidth() * 100);

            var str = "" + value;

            if (posX < 0)
                posX = 0;
            if (posX >= target.outerWidth()) {
                posX = target.outerWidth();
            }
            // console.log(value/perv)

            if (posX >= 0 && posX <= target.outerWidth()) {
                var index = 0;
                if (str[1]) {
                    var maxI = 0;
                    fish.find(self.labelDatas, function($label, i) {
                        if ($label.position().left + ($label.outerWidth()) > (posX)) {
                            maxI = i;
                            return true;
                        }
                    })
                    console.log(maxI)
                    var index = maxI;
                } else {
                    index = Math.round(value / perv)
                }
                self.cIndex = index;

                posX = self.posXDatas[index] + 20

                $(target).find(">.progress").css("width", posX + "px");
                $(target).find(">.indicator").css("left", posX + "px");
                var str = ("" + value)
                $('#MyValue').val(this.param.datas[index]);

                for (var i = 0; i < self.labelDatas.length; i++) {
                    if (i <= index) {
                        self.labelDatas[i].css('color', "black");
                        self.labelDatas[i].find('.line').css('background', 'black')
                    } else {
                        self.labelDatas[i].css('color', "#ccc");
                        self.labelDatas[i].find('.line').css('background', '#ccc')
                    }
                }

            }
        },

        afterRender: function() {
            var self =this;
            var datas =this.param.datas;
            this.cIndex = 0;
            this.posXDatas = [];
            this.labelDatas = [];
            this.bettween = 0;
            this.labels = fish.map(datas, function(data) {
                return "<div class='label'><div class='lineDiv'><div class='line'> </div></div><div class='text'>" + data + "</div></div> "
            })

            var $boxs = this.$el.find('.labelbox')

            var ww = this.$el.find('.silder').outerWidth();
            var per = this.$el.find('.silder').outerWidth() / (this.labels.length);
            this.$el.find('.silder').find('.bck').outerWidth(ww - per);
            fish.each(this.labels, function(labelHtml, i) {
                var $label = $(labelHtml).appendTo($boxs);
                var posX = (i) * per - ($label.outerWidth() / 2);
                $label.css("left", posX + 'px');
                self.labelDatas.push($label)
                self.posXDatas.push(posX);

            })
            this.labelDatas[this.cIndex].css('color', "black");
            this.labelDatas[this.cIndex].find('.line').css('background', 'black')
            this.$el.find('.silder').on('mousedown', function(e) {
                self.moveSilder(e)
                $(this).on("mousemove", function(e) {
                    self.moveSilder(e)
                })
            }).on('mouseup', function() {
                $(this).off("mousemove");
            })

            return this;
        }
    });
});
