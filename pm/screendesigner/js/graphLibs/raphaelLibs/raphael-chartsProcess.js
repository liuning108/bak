(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['oss_core/pm/screendesigner/js/raphael-min'], function(Raphael) {
            return factory(Raphael || root.Raphael);
        });
    } else {
        factory(Raphael);
    }
}(this, function(Raphael) {
    Raphael.fn.chartsProcess = function(config) {
        var paper = this;

        paper.customAttributes.wrokflowarcpie = function(centerX, centerY, startAngle, endAngle, innerR, outerR) {
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

        var inst = {};
        inst.set=paper.set();
        inst.config = {};
        inst.styles = {};
        inst.items = [];
        inst.waring = config.waring || [100, 200, 300];
        inst.config.x = config.x;
        inst.config.y = config.y;
        inst.config.keys = config.keys;
        inst.config.space = config.space || 118;
        inst.config.circle_r = 20;
        var colors = ['#02b8ed', '#dca708', '#f70202'];
        inst.styles.labelFontStyle = {
            'fill': '#ffffff',
            'font-size': 18,
            'font-family': '微软雅黑',
            'font-weight': 'bold'
        }
        inst.styles.rectStyle = {
            'stroke-width': 0,
            'stroke': 'none',
            'fill': '#0c0c0c'
        };
        inst.styles.processStyle = {
            'stroke-width': 0,
            'stroke': 'none',
            'fill': '#feff3b'
        };
        inst.styles.circleStyle = {
            'fill': colors[0],
            'stroke-width': 0,
            'stroke': 'none'
        };
        inst.styles.circle1Style = {
            'fill': 'none',
            'stroke-width': 3,
            'stroke': '#47494c',
            'opacity': 0.9
        }
        inst.styles.valueFontStyle = {
            'fill': '#ffffff',
            'font-size': 18,
            'font-family': '微软雅黑',
            'font-weight': 'bold'
        }


        for (var i = 0; i < inst.config.keys.length; i++) {
            var item = {};
            item.key = inst.config.keys[i];
            item.colorsSet = paper.set();
            item.x = inst.config.x + (i * inst.config.space);
            item.y = inst.config.y;
            item.value = 0;
            item.name = paper.text(item.x, item.y, item.key).attr(inst.styles.labelFontStyle);
            inst.set.push(item.name);
            item.circle = paper.circle(item.x, item.y - 55, inst.config.circle_r).attr(inst.styles.circleStyle)
            inst.set.push(item.circle);
            if (i < inst.config.keys.length - 1) {
                item.small_circle = paper.circle(item.x + inst.config.space / 2, item.y - 55, inst.config.circle_r / 2.8).attr(inst.styles.circleStyle);
                inst.set.push(item.small_circle);
                item.line1 = paper.rect(item.x, item.y - 58, inst.config.space / 2, inst.config.circle_r / 3).attr({
                    'stroke-width': 1,
                    'fill': colors[0]
                }).toBack();
                inst.set.push(item.line1);
                item.line2 = paper.rect(item.x + inst.config.space / 2, item.y - 58, inst.config.space / 2, inst.config.circle_r / 3).attr({
                    'stroke-width': 1,
                    'fill': colors[0]
                }).toBack();
                inst.set.push(item.line2);
                item.colorsSet.push(item.small_circle);
                item.colorsSet.push(item.line1);
                item.colorsSet.push(item.line2);

            }
            item.colorsSet.push(item.circle);
            item.circle1 = paper.circle(item.x, item.y - 55, inst.config.circle_r + inst.config.space / 9).attr(inst.styles.circle1Style)
            inst.set.push(item.circle1);
            item.circle2 = paper.path().attr({
                "stroke": "none",
                "stroke-width": 0,
                'fill': colors[0],
                wrokflowarcpie: [item.x, item.y - 55, 0, 30, inst.config.circle_r + inst.config.space / 9 - 2, inst.config.circle_r + inst.config.space / 9 + 2]
            });
            inst.set.push(item.circle2);
            item.nums = paper.chartsNumbser({
                'x': item.x,
                'y': item.y - 55,
                'value': item.value,
                attrs: inst.styles.valueFontStyle
            });
            inst.set.push(item.nums);
            item.colorsSet.push(item.circle2);
            inst.items.push(item);

        }

        inst.inputData = function(datas) {
            var max = getMax(datas);
            var limit_max = max + (max * 0.1);
            for (var i = 0; i < inst.items.length; i++) {
                var item = inst.items[i];
                item.value = findValueByKey(datas, item.key);
                var per = item.value / limit_max;
                item.nums.setValue(item.value);
                item.circle2.animate({
                    wrokflowarcpie: [item.x, item.y - 55, 0, 359 * per, inst.config.circle_r + inst.config.space / 9 - 2, inst.config.circle_r + inst.config.space / 9 + 2]
                }, 1000);

                if (item.value >= inst.waring[2]) {
                    item.colorsSet.animate({
                        'fill': colors[2]
                    });
                } else if (item.value >= inst.waring[1]) {
                    item.colorsSet.animate({
                        'fill': colors[1]
                    });
                } else {
                    item.colorsSet.animate({
                        'fill': colors[0]
                    });
                }


            }


        }

        function findValueByKey(datas, key) {
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].name == key) {
                    return datas[i].value;
                }
            }

        }

        function getMax(datas) {
            var max = datas[0].value || -99999;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].value > max) {
                    max = datas[i].value;
                }
            }
            return max;
        } //end of max;

         inst.allItem=function(){
             return inst.set;
         }

        return inst;
    }
}));
