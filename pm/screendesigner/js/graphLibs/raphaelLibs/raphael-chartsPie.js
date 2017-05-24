(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['oss_core/pm/screendesigner/js/raphael-min'], function(Raphael) {
            return factory(Raphael || root.Raphael);
        });
    } else {
        factory(Raphael);
    }
}(this, function(Raphael) {
    Raphael.fn.chartsPie = function(config) {
        if (!config) config = {};
        var x = config.x || 0;
        var y = config.y || 0;
        var r = config.r || 170;
        var list_x = config.listx
        var list_y = config.listy

        var modes = config.modes || [];

        var paper = this;
        var obj_instance = {};
        obj_instance.set=paper.set();
        paper.customAttributes.arcpie2 = function(centerX, centerY, startAngle, endAngle, innerR, outerR) {
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
            return {
                path: path
            };
        };

        var style = {
            'stroke': "#ffffff",
            'stroke-width': "1.5",
            'fill': '#00000'
        };


        var r2 = r / 3.6
        var r3 = r2 + 5;
        var arc_width = r3 + 100;
        var items = [];

        var outer_cicle = paper.circle(x, y, r);
        obj_instance.set.push(outer_cicle)
        outer_cicle.attr(style)
        var inner_cicle = paper.circle(x, y, r2);
        inner_cicle.attr(style)
        obj_instance.set.push(inner_cicle)

        //start of initiation  data
        for (var i = 0; i < modes.length; i++) {
            modes[i].value = 0;
            if (i == 0) {
                modes[i].sa = 0;
                modes[i].ea = 360 * 0.01;
            } else {
                modes[i].sa = modes[i - 1].ea;
                modes[i].ea = modes[i - 1].ea + (360 * 0.01);
            }
            modes[i].path = paper.path().attr({
                "stroke": "#ffffff",
                "stroke-width": 2,
                'fill': modes[i].color,
                arcpie2: [x, y, modes[i].sa, modes[i].ea, r3, arc_width]
            });
            obj_instance.set.push(modes[i].path);
            items.push(createListItem(modes[i], i));

        }


        //end of initiation  data


        obj_instance.inputData = function(datas) {

            computingPercent(datas);
            drawPie();
            orderby();


        }


        //start of private fun

        function orderby() {
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < items.length; j++) {
                    if (items[i].value > items[j].value) {
                        var temp2 = items[i];
                        items[i] = items[j];
                        items[j] = temp2;
                    }
                } //end of inner_for
            } //end of outer_for

            for (var i = 0; i < items.length; i++) {
                var item = items[i]
                item.cnum.setValue(items[i].value)
                var item_y = list_y + (i * 45)
                item.label.animate({
                    'y': item_y
                }, 1000)
                item.path.animate({
                    arcpie2: [item.x - 60, item_y + 20, 300, 420, 10, 20]
                }, 1000)
                item.cnum.animate({
                    'y': item_y + 20
                }, 1000)

            }

        }

        function drawPie() {

            for (var i = 0; i < modes.length; i++) {
                if (i == 0) {
                    modes[i].sa = 0;
                    modes[i].ea = 360 * modes[i].percent;
                } else {
                    modes[i].sa = modes[i - 1].ea;
                    modes[i].ea = modes[i - 1].ea + (360 * modes[i].percent);
                }
                var width = (100 * modes[i].percent) * modes.length / 2;
                if (width > 100) {
                    width = 100;
                }
                modes[i].path.mycolor = modes[i].color;
                modes[i].path.animate({
                    arcpie2: [x, y, modes[i].sa, modes[i].ea, r3, r3 + width]
                }, 1500, function() {

                });


            }
        } //end of drawPie;

        function computingPercent(datas) {
            for (var i = 0; i < modes.length; i++) {
                for (var j = 0; j < datas.length; j++) {
                    if (modes[i].name == datas[j].name) {
                        modes[i].value = datas[j].value;
                        continue;
                    }
                } //end of for;
            }

            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < datas.length; j++) {

                    if (items[i].name == datas[j].name) {
                        items[i].value = datas[j].value;

                        continue;
                    }
                } //end of for;
            }
            var sum = 0;
            for (var i = 0; i < modes.length; i++) {
                sum = sum + modes[i].value;
            }
            for (var i = 0; i < modes.length; i++) {
                var percent = (modes[i].value / sum);
                modes[i].percent = percent.toFixed(2);
            }
        } //end of   computingPercent

        function createListItem(mode, i) {
            var node = {};
            node.name = mode.name;
            node.value = mode.value;

            node.x = list_x;
            node.y = list_y + (i * 45)

            var title_style = {
                'fill': '#fffee2',
                'font-size': 16,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            };
            node.label = paper.text(node.x + 20, node.y, mode.name);
            obj_instance.set.push(node.label);
            node.label.attr(title_style);
            node.cnum = paper.chartsNumbser({
                'x': node.x + 20,
                'y': node.y + 20,
                'value': 0,
                'format': true,
                attrs: {
                    'fill': '#fffb8e',
                    'font-size': 17,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });
            obj_instance.set.push(node.cnum);
            node.path = paper.path().attr({
                "stroke": "#ffffff",
                "stroke-width": 2,
                'fill': mode.color,
                arcpie2: [node.x - 60, node.y + 20, 300, 420, 10, 20]
            });
            obj_instance.set.push(node.path);
            return node;
        }

        obj_instance.allitem=function(){
            return obj_instance.set;
        }

        //end of private fun
        return obj_instance;
    }
}));
