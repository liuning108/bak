var GDoubleTopNode = GNode
		.extend({
			// 计算属性值
			update : function() {
				this.options.gx = this.options.w / 3;
				this.options.gy = this.options.h / 3;
			},
			// 画画
			draw : function() {
				var paper = this.elements.paper;
				var rectTop = this.createRectTop(paper, this.options.gx,
						this.options.gy, this.options.w, this.options.h, '名称');
				rectTop.show();
				paper.setViewBox(0, 0, 409, 265, true);
				paper.setSize("100%", "100%");
				paper.canvas.setAttribute('preserveAspectRatio',
						'xMidYMid meet');
				function run() {
					rectTop.setValue(until.fRandomBy(500, 800), 1000);
					setTimeout(run, 3000)
				}
				run();

			},
			resize : function() {
				 this.initElement();
			},

			// 配置页面功能
			pageConfig : function($pageHtml) {
			},
			createRectTop : function(paper, x, y, w, h, name) {
				var RectTop = function(x, y, w, h, name) {
					this.x = x;
					this.y = y;
					this.w = w;
					this.h = h;
					this.pathUp = "m 0,0 -5.086919,5.52926 -20.347681,-0.66351 1.10586,-38.70482 23.665229,-29.19449 8.183305,-3.98107 134.471601,-0.22117 11.722031,4.64458 22.117039,28.08864 1.548193,38.70482 -20.790017,-0.22117 -4.423408,-5.30809 15.924269,-24.77109 -0.221171,-5.30809 -29.194492,-30.30034 -126.951808,0.44234 -28.530981,30.74269 z";
					this.pathUp2 = "m 0,0 -26.098107,25.65577 14.597246,25.87693 23.886403,-0.22117 5.086919,-7.29862 86.477625,0.22117 4.644578,6.85628 23.222892,0.22117 13.712564,-19.24182 -0.442341,-7.07745 -22.78055,-24.77109 z";
					this.name = name;
					this.path1 = "m 0,0 c 0,0 29.03524,0.621075 29.03524,0 0,-0.621075 0.310538,-10.558269 0.310538,-10.558269 l -2.639568,-2.484299 0.310538,-10.092463 -27.172016,0 z"
					this.path2 = "m 0,0 c 0,0 -29.03524,0.621075 -29.03524,0 0,-0.621075 -0.310538,-10.558269 -0.310538,-10.558269 l 2.639568,-2.484299 -0.310538,-10.092463 27.172016,0 z";
				}
				RectTop.prototype.show = function() {

					var self = this;
					var box = paper.path(self.pathUp).attr("transform",
							[ 't', self.x, self.y ]).attr({
						'fill' : '#28e2df',
						'stroke-width' : 0
					});
					var box2 = paper.path(self.pathUp).attr("transform",
							[ 't', self.x - 3, self.y + 93, 'r', 180 ]).attr({
						'fill' : '#28e2df',
						'stroke-width' : 0
					});
					var box3 = paper.path(self.pathUp2).attr("transform",
							[ 't', self.x + 15, self.y + 35, 'r', 180 ]).attr({
						'fill' : 'none',
						'stroke-width' : 1,
						'stroke' : "#28e2df"
					});
					paper.text(self.x + 75, self.y - 36, self.name).attr({
						'fill' : "#d8ffa0",
						'font-size' : 36,
						'font-family' : '微软雅黑',
						'font-weight' : 'bold'
					})

					self.numobj = paper.chartsNumbser({
						'x' : x + 75,
						'y' : y + 63,
						'value' : 9999,
						attrs : {
							'fill' : "#ffffff",
							'font-size' : 32,
							'font-family' : '微软雅黑',
							'font-weight' : 'bold'
						}
					});
					self.animMaxte();
					self.leftArray = self.bar(box.getBBox().x - 35, self.path1);
					self.rightArray = self.bar(
							self.x + box.getBBox().width + 5, self.path2)

					return self;
				}
				RectTop.prototype.setValue = function(value, max) {
					var self = this;
					self.numobj.setValue(value);
					var per = value / max;
					var k = parseInt(7 * per);
					if (k <= 0)
						k = 1;
					self.arrayInit(self.leftArray);
					self.arrayInit(self.rightArray);
					self.arrayAnima(self.leftArray, k);
					self.arrayAnima(self.rightArray, k);
				}

				RectTop.prototype.arrayInit = function(arry) {
					for (var i = 0; i < arry.length; i++) {
						arry[i].attr({
							'fill' : "#072929",
							'stroke-width' : 0,
							'opacity' : 0.7
						});
					}
				}

				RectTop.prototype.arrayAnima = function(arry, n) {
					var self = this;
					var color = '#26e2e3';

					if (n >= 5) {
						color = '#ffcf28'
					}
					if (n >= 6) {
						color = '#ff4d39'
					}
					for (var i = 0; i < n; i++) {
						arry[i].animate({
							'fill' : color
						}, i * 200);
					}
					self.numobj.numobj.animate({
						'fill' : color
					}, 800);
				}
				RectTop.prototype.bar = function(x, path) {
					var self = this;
					var cx = x;
					var cy = self.y + 100
					var array = [];
					for (var i = 0; i < 7; i++) {
						var item = paper.path(path).attr('transform',
								[ 't', cx, cy - (i * 25) ]).attr({
							'fill' : "#072929",
							'stroke-width' : 0,
							'opacity' : 0.7
						})
						array.push(item);
					}// end of for
					return array;

				}
				RectTop.prototype.animMaxte = function() {
					var self = this;
					var cx = self.x + 34;
					var cy = self.y - 5;
					var count = 1;
					self.items = [];
					for (var j = 0; j < 5; j++) {
						for (var i = 0; i < 3; i++) {
							var item;
							if (count % 2 == 0) {
								item = paper.rect(cx + (i * 29),
										self.y - 5 + (j * 9), 23, 7).attr({
									'fill' : "#63e2e2",
									'stroke-width' : 0
								});
							} else {
								item = paper.rect(cx + (i * 29),
										self.y - 5 + (j * 9), 23, 7).attr({
									'fill' : "#2acccc",
									'stroke-width' : 0
								});
							}
							self.items.push(item);
							count++;
						}
					} // end of for
					var colors = [ "#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#63e2e2", "#2acccc", "#63e2e2", "#2acccc",
							"#ff4d39", "#ffcf28" ]
					function run() {
						var index = until.fRandomBy(0, self.items.length - 1);
						var color_index = until.fRandomBy(0, colors.length - 1);
						var c = colors[color_index];
						var item = self.items[index];
						if (item) {
							item.animate({
								"fill" : c
							}, 300);
						}
						setTimeout(run, 100);
					}
					run();
				}
				return new RectTop(x, y, w, h, name);
			}
		});