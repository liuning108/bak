(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['oss_core/pm/screendesigner/js/raphael-min'], function(Raphael) {
            return factory(Raphael || root.Raphael);
        });
    } else {
        factory(Raphael);
    }
}(this, function(Raphael) {

    Raphael.fn.areaLineBar = function(config) {
        if (!config) config = {};
        var paper = this;
        var obj_instance = {};

        var x = config.x ||0
        var y = config.y ||0;

        var obj_instance = {};
        obj_instance.colors=config.colors||['#ffffff','#ffcc00','#ff3600'];
        obj_instance.labelColor=config.labelColor||'#fff';
        obj_instance.valueColor=config.valueColor||'#fff';
        obj_instance.LineColor=config.LineColor||'#51f711'
        obj_instance.waring = config.waring;
        obj_instance.curve=paper.path("");

        var item_w = 30;
        var item_h = 140;
        var span_w = 8;
        var keys = config.keys;
        var fontStyle = {
            'fill': obj_instance.labelColor,
            'font-size': 17.59,
            'font-family': '微软雅黑',
            'font-weight': 'bold'
        };
        var circleStyle = {
            'fill': '#171724',
            'stroke-width': 0
        };
        var lineStyle = {
            'fill': '#171724',
            'stroke-width': 0
        };
        var r = 6;
        var items = [];
        var allItem=paper.set();
        for (var i = 0; i < keys.length; i++) {
            var node = {};
            node.name = keys[i];

            var spanw = i * (item_w + span_w);
            var spanw2 = (i - 1) * (item_w + span_w);
            if (node.name.length > 2) {
                node.x = x + spanw + 5;
            } else {
                node.x = x + spanw;
            }
            node.value = 0;
            var linex = x + spanw2;
            node.valuebg = paper.rect(node.x, (item_h + y - r) - item_h * 0.01, item_w, item_h * 0.01).attr({
                "stroke-width": '0',
                'fill': "#ffffff",
                opacity: 0.1
            });
            node.label = paper.text(node.x + item_w / 2, y + item_h + 10, node.name).attr(fontStyle);

            node.num = paper.chartsNumbser({
                'x': node.x + item_w / 2,
                'y': (item_h + y - 6) - item_h * 0.01 - 10,
                'value': 0,
                'format': false,
                attrs: {
                    'fill': obj_instance.valueColor,
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });
            allItem.push(node.valuebg);
            allItem.push(node.label);
            allItem.push(node.num);


            items.push(node);
        }
        obj_instance.inputData = function(datas) {
            //console.log(datas);
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < datas.length; j++) {
                    if (items[i].name == datas[j].name) {
                        items[i].value = datas[j].value;
                        items[i].num.setValue(items[i].value)
                        continue;
                    }
                } //end of inner for;
            } //end of outer for;
            //find max;
            var max = items[0].value;
            for (var i = 0; i < items.length; i++) {
                if (max < items[i].value) {
                    max = items[i].value;
                }
            } //end of for

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var allhy = (item_h + y - r);
                var per = item.value / (max + (max * 0.1));

                if (item.value > 0) {
                    item.y = allhy - item_h * per;
                    item.valuebg.animate({
                        'y': item.y,
                        'height': item_h * per
                    }, 1000);

                    item.num.animate({
                        'y': allhy - item_h * per - 25
                    }, 1000);
                    if (item.value >= obj_instance.waring[2]) {
                        item.valuebg.animate({
                            'fill': obj_instance.colors[2],
                            opacity: '0.4'
                        }, 1000)
                    } else if (item.value >= obj_instance.waring[1]) {
                        item.valuebg.animate({
                            'fill': obj_instance.colors[1],
                            opacity: '0.4'
                        }, 1000)
                    } else {
                        item.valuebg.animate({
                            'fill': obj_instance.colors[0],
                            opacity: '0.1'
                        }, 1000)
                    }
                }
            } //end of for

            var points = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.value > 0) {
                    points.push({
                        'x': item.x + item_w / 2,
                        'y': item.y
                    })
                }
            }



            var point_paths = [];
            var circles_point = [];
            if (!this.circles_obj) {
                this.circles_obj = [];
            }

            if (points.length > 1) {
                try {
                    point_paths = ['M', points[0].x, points[0].y];
                    point_paths.push('L');
                    if (points.length > 2) {
                        point_paths[3] = 'L';
                    }

                    for (var i = 1; i < points.length; i++) {
                        point_paths.push(points[i].x);
                        point_paths.push(points[i].y);
                        var item = {};
                        item.x = points[i].x;
                        item.y = points[i].y;
                        circles_point.push(item);
                    }

                    if (!obj_instance.curve) {
                        for (var i = 0; i < circles_point.length; i++) {
                            var item = circles_point[i];
                            var circleItem = paper.circle(item.x, item.y, 6).attr({
                                'fill': "#ffffff",
                                'stroke-width': 0
                            }).toFront();
                            this.circles_obj.push(circleItem)
                        }
                    } else {
                        obj_instance.curve.animate({
                            'path': point_paths,
                            'stroke': obj_instance.LineColor,
                            'stroke-width': 3

                        }, 1000);

                        for (var i = 0; i < circles_point.length; i++) {
                            var item = this.circles_obj[i];
                            item.animate({
                                'cx': circles_point[i].x,
                                'cy': circles_point[i].y
                            }, 1000)
                        }
                        // curve.toFront();
                        //curve.g.remove();
                        // curve.g=curve.glow({'color':'#51f711'});

                    }

                } catch (e) {}
            } //end of if;

        } //end of obj_instance;
       allItem.push(obj_instance.curve)
       obj_instance.allItem=allItem;

        return obj_instance;
    }

}));
