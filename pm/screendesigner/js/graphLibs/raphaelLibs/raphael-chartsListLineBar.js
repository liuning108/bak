(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['oss_core/pm/screendesigner/js/raphael-min'], function(Raphael) {
            return factory(Raphael || root.Raphael);
        });
    } else {
        factory(Raphael);
    }
}(this, function(Raphael) {
    Raphael.fn.chartListLineBar = function(config) {
        var paper = this;
        var inst = {};
        inst.config = {};
        inst.styles = {};
        inst.items = [];
        inst.datas = [];
        inst.config.x = config.x || 0;
        inst.config.y = config.y || 0;
        inst.config.keys = config.keys;
        inst.config.item_space = config.item_space || 80;
        inst.config.width = config.width || 70;
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
            'stroke-width': 0,
            'fill': '#ffffff',
            'stroke': 'none'
        }
        inst.config.circleR = 10;
        inst.config.high = 350;
        inst.styles.valueFontStyle = {
            'fill': '#ffffff',
            'font-size': 24,
            'font-family': '微软雅黑',
            'font-weight': 'bold'
        }
        inst.styles.FontStyle2 = {
            'fill': '#ffffff',
            'font-size': 20,
            'font-family': '微软雅黑',
            'font-weight': 'bold'
        }

        inst.index = 0;
        inst.maxItem = 7;
        inst.elements = [];
        inst.max = 0;
        inst.limit_max = 0;
        inst.set = paper.set();

        inst.inputData = function(datas, now) {
            if (inst.datas.length > inst.maxItem) {
                inst.datas.shift();
                inst.index--;
                updateAll();
                drawListBar();
            }
            var item = {};
            item.value = sum(datas);
            var newMax = findMax(inst.max, item.value);
            if (inst.max != newMax) {
                inst.max = newMax;
                inst.limit_max = inst.max + (inst.max * 0.1);
                updateAll();
            }
            item.datas = datas;
            item.x = inst.config.x + (inst.index * inst.config.item_space);
            item.y = inst.config.y;
            item.now = now;
            inst.datas.push(item);

            if (!inst.elements[inst.index] && inst.index < inst.maxItem) {
                var element = drawElement(item);
                inst.elements.push(element);

                drawLineBar();
                drawListBar();
            }

            inst.index++;

        } //end of inputData()

        inst.listbar = null;

        function drawListBar() {
            var item = inst.datas[inst.datas.length - 1];
            var max_big = 0;
            var max_limit = 0;
            for (var i = 0; i < item.datas.length; i++) {
                if (max_big < item.datas[i].value) {
                    max_big = item.datas[i].value;
                }
            }
            max_limit = max_big + (max_big * 0.2);
            if (!inst.listbar) {
                inst.listbar = {};
                var colors = ['#f49b2b', '#e792b4', '#f73e45', '#c6512d', '#d3d300', '#8e228f']


                for (var i = 0; i < inst.config.keys.length; i++) {
                    var key = inst.config.keys[i];
                    inst.listbar[key] = {};
                    var item_x = item.x + 50;
                    var item_y = item.y - (inst.config.high - (35 * i));
                    var val = findValueByKey(item.datas, key);
                    inst.listbar[key].text = paper.text(item_x + 100 / 2, item_y + 30 / 2, key).attr(inst.styles.FontStyle2);
                    inst.set.push(inst.listbar[key].text)
                    inst.listbar[key].value = paper.chartsNumbser({
                        'x': item_x + 80 + 100 / 2,
                        'y': item_y + 30 / 2,
                        'value': val,
                        attrs: inst.styles.FontStyle2
                    });
                    inst.set.push(inst.listbar[key].value)
                    var per_list = val / max_limit;
                    inst.listbar[key].rect = paper.rect(item_x, item_y, 100 * per_list, 30).attr({
                        'fill': colors[i],
                        'stroke-width': 0,
                        'stroke': '#ffffff',
                        'opacity': 0.5
                    }).toBack();
                    inst.set.push(inst.listbar[key].rect)
                }
            } else {
                for (var i = 0; i < inst.config.keys.length; i++) {
                    var key = inst.config.keys[i];
                    var item_x = item.x + 50;
                    var item_y = item.y - (inst.config.high - (35 * i));
                    inst.listbar[key].text.animate({
                        'x': item_x + 100 / 2,
                        'y': item_y + 30 / 2
                    }, 500);
                    var val = findValueByKey(item.datas, key);
                    inst.listbar[key].value.setValue(val);
                    inst.listbar[key].value.animate({
                        'x': item_x + 80 + 100 / 2,
                        'y': item_y + 30 / 2
                    }, 500);
                    var per_list = val / max_limit;
                    inst.listbar[key].rect.animate({
                        'x': item_x,
                        'y': item_y,
                        'width': 100 * per_list
                    }, 500);

                }
            }

        }

        inst.curve = null;

        function drawLineBar() {
            var points = inst.datas;
            if (points.length > 1) {
                var per = points[0].value / inst.limit_max;
                var per_y = points[0].y - (inst.config.high * per);

                inst.point_paths = ['M', points[0].x, per_y];
                inst.point_paths.push('L');
                if (points.length > 2) {
                    inst.point_paths[3] = 'L';
                }

                for (var i = 1; i < points.length; i++) {
                    inst.point_paths.push(points[i].x);
                    var per = points[i].value / inst.limit_max;
                    var per_y = points[i].y - (inst.config.high * per);
                    inst.point_paths.push(per_y);
                }
                if (!inst.curve) {
                    inst.curve = paper.path(inst.point_paths).attr({
                        'stroke': '#c7f404',
                        'stroke-width': 3
                    }).toBack();
                    inst.set.push(inst.curve);


                } else {
                    inst.curve.attr({
                        'path': inst.point_paths
                    });
                }

            } //end of if;
        }

        function updateAll() {

            for (var i = 0; i < inst.elements.length; i++) {
                try {
                    var item = inst.datas[i];
                    var element = inst.elements[i];
                    // element.nowLabel.attr({
                    //     'text': item.now
                    // });
                    item.x = inst.config.x + (i * inst.config.item_space);
                    var per = item.value / inst.limit_max;
                    var per_y = item.y - (inst.config.high * per);
                    element.circleObj.attr({
                        'cx': item.x,
                        'cy': per_y
                    });

                    element.valueLabel.attr({
                        'x': item.x,
                        'y': per_y - 25,
                        'text': item.value
                    });

                    drawLineBar();

                } catch (e) {

                }

            }

        } //end of updataAll

        function drawElement(item) {
            var element = {};

            //element.nowLabel = paper.text(item.x, item.y, item.now).attr(inst.styles.labelFontStyle);
            var per = item.value / inst.limit_max;
            var per_y = item.y - (inst.config.high * per);
            element.circleObj = paper.circle(item.x, per_y, inst.config.circleR).attr(inst.styles.circleStyle);
            inst.set.push(element.circleObj)
            element.valueLabel = paper.text(item.x, per_y - 25, item.value).attr(inst.styles.valueFontStyle);
            inst.set.push(element.valueLabel)
            return element;
        }

        function sum(datas) {
            var sum = 0;
            for (var i = 0; i < config.keys.length; i++) {
                var key = config.keys[i];
                var value = findValueByKey(datas, key);
                sum = sum + value;
            }
            return sum;
        }

        function findValueByKey(datas, key) {
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].name == key) {
                    return datas[i].value;
                }
            }

        }

        function findMax(v1, v2) {
            if (v1 > v2) {
                return v1;
            } else {
                return v2;
            }
        } //end of max;

        for (var i = 0; i < inst.maxItem + 1; i++) {
            var initDatas = []
            fish.each(inst.config.keys, function(name) {
                initDatas.push({
                    'name': name,
                    'value': fish.random(99, 999),
                })
            })
            inst.inputData(initDatas, '' + i);
        }

        inst.allItem = function() {
            return inst.set;
        }


        return inst;
    }
}));