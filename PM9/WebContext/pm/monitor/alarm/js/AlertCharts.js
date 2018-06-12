define(["oss_core/pm/screendesigner/js/raphael-min"], function() {
    return {

        bigCircleChart: function(opt) {

            var labelFontStyle = {
                'fill': "black",
                'font-size': 22,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            }

            var valueFontStyle = {
                'fill': "black",
                'font-size': 36,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            }
            opt.dom.html("");
            var paper = Raphael(opt.dom[0]);
            paper.customAttributes.alertCircle = function(centerX, centerY, startAngle, endAngle, innerR, outerR) {
                var radians = Math.PI / 180,
                    largeArc = + (endAngle - startAngle > 180);
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
                    [
                        "M", outerX1, outerY1
                    ], //move to the start point
                    [
                        "A",
                        outerR,
                        outerR,
                        0,
                        largeArc,
                        1,
                        outerX2,
                        outerY2
                    ], //draw the outer edge of the arc
                    [
                        "L", innerX1, innerY1
                    ], //draw a line inwards to the start of the inner edge of the arc
                    [
                        "A",
                        innerR,
                        innerR,
                        0,
                        largeArc,
                        0,
                        innerX2,
                        innerY2
                    ], //draw the inner arc
                    ["z"] //close the path
                ];
                return {path: path};
            };
            var r = 130;
            var center_x = opt.dom.width() / 2;
            var center_y = opt.dom.height() / 2;
            var circle = paper.circle(center_x, center_y, r-41);
            circle.attr({fill: '#fff', stroke: '#fff', 'stroke-width': 5});


            var datas = opt.datas;
            var sum = fish.reduce(datas, function(memo, num) {
                return memo + num.value;
            }, 0);
            var ss=sum;
            if(ss===0){
                ss=datas.length;
                for (var i = 0; i < datas.length; i++) {
                    datas[i].label=1;
                }

            }
            var ccy=center_y+10;
            var title = paper.text(center_x, ccy+20,opt.title).attr(labelFontStyle);
            var gvalue= paper.text(center_x, ccy-10,sum).attr(valueFontStyle);
            var img = paper.image('oss_core/pm/monitor/alarm/css/img/alarms-2.png', center_x-(56*0.8)/2, ccy-70, 56*0.8, 47*0.8);


            var start_a = 0;
            var end_a = 0;
            var sset=paper.set();
            for (var i = 0; i < datas.length; i++) {
                var num = datas[i];
                start_a = end_a;
                end_a = start_a + (num.label / ss) * 359.9;
                var alertC1 = paper.path().attr({
                    "stroke-width": 1,
                    "stroke": "#fff",
                    'fill': num.color,
                    'opacity': 1,
                    'cursor': 'pointer',
                    alertCircle: [
                        center_x, center_y, start_a, end_a, r - 40,
                        r
                    ]
                });
                alertC1.data=num;
                sset.push(alertC1);

                alertC1.mouseover(function(){
                    title.attr({
                        'text': this.data.name
                    })
                    gvalue.attr({
                        'text': this.data.value
                    })
                    circle.attr({
                        'stroke':this.data.color
                    })
                    sset.scale(1.01,1.01,center_x,center_y);
                })

                alertC1.mouseout(function(){
                    title.attr({
                        'text': opt.title
                    })
                    gvalue.attr({
                        'text': sum
                    })
                    circle.attr({
                        'stroke':"#fff"
                    })
                    sset.transform('');

                })



            }

        },

        circleChart: function(opt) {
            var colorFontStyle = {
                'fill': "#33ea7c",
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'

            }
            var labelFontStyle = {
                'fill': "black",
                'font-size': 24,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            }
            var nameFontStyle = {
                'fill': "black",
                'font-size': 12,
                'font-family': '微软雅黑'
            }
            opt.dom.html("");
            var paper = Raphael(opt.dom[0]);
            paper.customAttributes.alertCircle = function(centerX, centerY, startAngle, endAngle, innerR, outerR) {
                var radians = Math.PI / 180,
                    largeArc = + (endAngle - startAngle > 180);
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
                    [
                        "M", outerX1, outerY1
                    ], //move to the start point
                    [
                        "A",
                        outerR,
                        outerR,
                        0,
                        largeArc,
                        1,
                        outerX2,
                        outerY2
                    ], //draw the outer edge of the arc
                    [
                        "L", innerX1, innerY1
                    ], //draw a line inwards to the start of the inner edge of the arc
                    [
                        "A",
                        innerR,
                        innerR,
                        0,
                        largeArc,
                        0,
                        innerX2,
                        innerY2
                    ], //draw the inner arc
                    ["z"] //close the path
                ];
                return {path: path};
            };

            var center_x = opt.dom.width() / 2;
            var center_y = opt.dom.height() / 2;
            center_y = center_y - 10;

            var value = paper.text(center_x, center_y, opt.value).attr(labelFontStyle);

            var name = paper.text(center_x, center_y + 54 + 15, opt.name).attr(nameFontStyle);
              var bbox =name.getBBox(true);

            var name2 = paper.text(center_x-bbox.width/1.5, center_y + 54 + 15, "✓").attr(colorFontStyle);
            name2.hide();
            console.log("name2 -==");
            console.log(opt.json);
            console.log(opt.level);
            var bbflag =false;

            if(fish.contains(opt.json.level,opt.level)){
                name2.show();
                bbflag=true;
            }

            var alertC1 = paper.path().attr({
                "stroke-width": 0,
                'fill': opt.color,
                'opacity': 0.3,
                alertCircle: [
                    center_x,
                    center_y,
                    0,
                    359.9,
                    50,
                    54
                ]
            });

            var per = (opt.value / 100) * 359.9;

            var alertC2 = paper.path().attr({
                "stroke-width": 0,
                'fill': opt.color,
                alertCircle: [
                    center_x,
                    center_y,
                    0,
                    per,
                    50,
                    54
                ]
            });

            return {
                sele:bbflag,
                vv:opt.level,
                toggleFilter:function(){
                    this.sele=!this.sele;
                    if(this.sele){
                        name2.show();
                        if(opt.json.level[opt.json.level.length-1]===","){
                            opt.json.level=opt.json.level+this.vv;
                        }else{
                            if(opt.json.level.length<=0){
                                opt.json.level=this.vv;
                            }else{
                                opt.json.level=opt.json.level+","+this.vv;
                            }
                        }
                    }else{
                        name2.hide();
                        opt.json.level=opt.json.level.replace(this.vv,"");
                        opt.json.level=fish.compact(opt.json.level.split(",")).join(',');
                    }
                }
            }

        }
    }
})
