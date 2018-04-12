(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fishTopoLink"] = factory();
	else
		root["fishTopoLink"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Export fishTopo as CommonJS module
	 */
	module.exports = __webpack_require__(2);
	//兼容IE8 引入VML 如果不需要兼容IE8请删除
	__webpack_require__(92);
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 流程对象
	 * @class fish.topo.FishTopoLink
	 */
	
	    var graphic = __webpack_require__(3);
	    var util = __webpack_require__(59);
	    var Point = __webpack_require__(60);
	    var ExtensionAPI = __webpack_require__(62);
	    var Eventful = __webpack_require__(11);
	    var zrender = __webpack_require__(63);
	    var zrUtil = __webpack_require__(4);
	    var OperationNode = __webpack_require__(74);
	    var LinkConnectionManager = __webpack_require__(81);
	    var LinkUtil = __webpack_require__(87);
	    var Constants = __webpack_require__(84);
	    var Model = __webpack_require__(85);
	    var eventTool = __webpack_require__(68);
	    var Connector = __webpack_require__(76);
	    var LineOperationManager = __webpack_require__(88);
	    var Link = __webpack_require__(89);
	    var textContain = __webpack_require__(24);
	    var ImagePool = __webpack_require__(90);
	    __webpack_require__(91);
	    function FishTopoLink(dom, opts) {
	        this.id;
	        this.group;
	        this._dom = dom;
	        this.nowZoom = 1;
	        this.canScale = true;
	        this.eagleEye = false;
	        this.eagleEyeNode;
	        this.initScaleRatio;
	        this.operationNode;
	        this.selectedNode = null;
	        this.allNodes = [];
	        this.linkConnectionManager = new LinkConnectionManager();
	        this.lineOperationManager = new LineOperationManager(this.linkConnectionManager);
	        this.minimap;
	        this._layoutTimeout = null;
	        this._zr = zrender.init(dom, {
	            renderer: opts.renderer || 'canvas',
	            devicePixelRatio: opts.devicePixelRatio
	        });
	
	        this._api = new ExtensionAPI(this);
	        this.Shape = graphic;
	        this.model = new Model({});
	        this.model.set(Constants.ELEMENT_TYPE, "scene");
	        this.model.set(Constants.MODE, "normal");
	        this.options = opts;
	        Eventful.call(this);
	    }
	
	    var fishTopoProto = FishTopoLink.prototype;
	
	    /**
	     * 获取 fishTopo 实例容器的 dom 节点
	     * @return {HTMLElement}
	     */
	    fishTopoProto.getDom = function() {
	        return this._dom;
	    };
	
	    /**
	     * @private
	     */
	    fishTopoProto.getZr = function() {
	        return this._zr;
	    };
	    /**
	     * 获取 fishTopo 实例容器的宽度。
	     * @return {number}
	     */
	    fishTopoProto.getWidth = function() {
	        return this._zr.getWidth();
	    };
	
	    /**
	     * 获取 fishTopo 实例容器的高度。
	     * @return {number}
	     */
	    fishTopoProto.getHeight = function() {
	        return this._zr.getHeight();
	    };
	
	
	    /**
	     * 当前实例是否已经被释放。
	     * @return {boolean}
	     */
	    fishTopoProto.isDisposed = function() {
	        return this._disposed;
	    };
	
	    /**
	     * Dispose instance
	     */
	    fishTopoProto.dispose = function() {
	        this._disposed = true;
	
	        this._zr.dispose();
	
	        instances[this.id] = null;
	    };
	
	
	    /**
	     * 调整尺寸  在窗口大小发生改变时需要手工调用
	     * @param {number} width 宽度
	     * @param {number} height 高度
	     */
	    fishTopoProto.resize = function() {
	        this._zr.resize();
	
	    };
	
	    /**
	     * @private
	     * 初始化
	     */
	    fishTopoProto.init = function() {
	        var that = this;
	        this.group = new graphic.Group();
	        this.group.isBg = true;
	        this._zr.add(this.group);
	        this.linkConnectionManager.connectors = [];
	        //mouseup 会在各个node或线的click事件之点执行  在选中节点或线前 先清空选中效果
	        this._zr.on("mouseup", function(e) {
	            clearSelect(e);
	        });
	        that._zr.on("globalout", function(e) {
	            clearSelect(e);
	        });
	        function clearSelect(e){
	            if (that.operationNode) {
	                that.group.remove(that.operationNode);
	                that.operationNode = null;
	            }
	            var shape = e.target;
	            if (shape && shape.model && Link.isLink(shape.model)) {
	                return;
	            }
	            if (shape && shape.connector instanceof Connector) {
	                return;
	            }
	            that.linkConnectionManager.clearSelectCon();
	            if (shape && shape.operation && shape.operation == true) {
	                return;
	            }
	            that.lineOperationManager.hideAllLineOperation();
	        }
	        this._zr.on("click", function(e) {
	            var nodeTarget = e.target;
	            var shape;
	            if(nodeTarget){
	                shape = nodeTarget.model;
	            }
	            if ((nodeTarget && shape && Link.isLink(shape)) || (nodeTarget && shape && Link.isNode(shape))) {
	                return;
	            }
	            var params = {};
	            params.event = e;
	            params.type = "click";
	            params.target = that;
	            that._api.trigger(params.type, params);
	        });
	        this.on('conPointsGroup:click', function(argument) {
	            that.linkConnectionManager.bindOperation(argument.lineNode);
	        });
	    };
	
	    /**
	     * 导出json
	     * @return {Object} json对象
	     */
	    fishTopoProto.toJson = function() {
	        return LinkUtil.toJson(this.model, this.group);
	    };
	
	    /**
	     * 导入json
	     * @param  {Object} json对象
	     */
	    fishTopoProto.fromJson = function(json) {
	        this.clear();
	        var model = new Model(json);
	        this.setBackground(model.get(Constants.BACKGROUND));
	        var layoutRootNode = [];
	        LinkUtil.fromJson(this, this.group, model.get(Constants.CHILDS), false, layoutRootNode);
	    };
	
	    /**
	     * 清空当前实例，会移除实例中所有的节点与线
	     * @method clear
	     */
	    fishTopoProto.clear = function() {
	        for (var i = 0; i < this.allNodes.length; i++) {
	            var parentZr;
	            if (this.allNodes.parent) {
	                parentZr = this.allNodes.parent;
	            } else {
	                parentZr = this._zr;
	            }
	            this.linkConnectionManager.deleteSelectCon(this.allNodes[i], parentZr)
	        }
	        this.linkConnectionManager.connectorMap.clear();
	        this.allNodes = [];
	        this.operationNode = null;
	        this.selectedNode = null;
	        this.linkConnectionManager.connectors = [];
	        this._zr.clear();
	        this.group = new graphic.Group();
	        this.group.isBg = true;
	        this._zr.add(this.group);
	    };
	
	
	    /**
	     * 移除场景中的某个节点
	     * @param  {Object} selectedNode 待删除的节点
	     */
	    fishTopoProto.removeNode = function(selectedNode) {
	        var that = this;
	        //1.如果是子节点 内 节点  则 调用子节点的删除
	        if (selectedNode.parent) {
	            selectedNode.parent.remove(selectedNode);
	        } else {
	            that.group.remove(selectedNode);
	        }
	        //2.从allNodes数组中删除
	        for (var i = 0; i < that.allNodes.length; i++) {
	            if (selectedNode.id == that.allNodes[i].id) {
	                that.allNodes.splice(i, 1);
	            }
	        }
	        this.linkConnectionManager.deleteSelectCon(selectedNode, that.group);
	    };
	
	    /**
	     * @private
	     * 派发delete事件
	     */
	    fishTopoProto._triggerDeleteEvent = function(target) {
	        var eventParams = {};
	        eventParams.type = "delete";
	        eventParams.target = target;
	        this._api.trigger(eventParams.type, eventParams);
	    };
	
	    /**
	     * @private
	     */
	    fishTopoProto._createConnectorByNodes = function(startNode, endNode, lineType) {
	        var that = this;
	        var connector = this.linkConnectionManager.connectorCreate(startNode, endNode, {
	            style: {
	                lineType: lineType
	            }
	        }, this._api);
	        if (startNode.parent && endNode.parent) {
	            endNode.parent.add(connector);
	        } else {
	            this.group.add(connector);
	        }
	
	        connector.on("mousedown", zrUtil.bind(function() {
	            this.linkConnectionManager.connectorForbidEdit(!this.options.linkModify);
	            this.isNode = false;
	        }, this));
	        connector.on("dblclick", function() {
	            if (that.options.isAllowEdit) {
	                that.connectorEdit(this);
	            }
	        });
	
	        this._triggerCreateEvent(connector);
	        return connector;
	    };
	
	    /**
	     * @private
	     * 派发创建完成事件
	     */
	    fishTopoProto._triggerCreateEvent = function(target) {
	        var eventParams = {};
	        eventParams.type = "create";
	        eventParams.target = target;
	        this._api.trigger(eventParams.type, eventParams);
	    };
	    /**
	     * 添加节点
	     * @method addNode
	     * @param {Object} node createNode返回的对象
	     */
	    fishTopoProto.addNode = function(node) {
	        this.group.add(node);
	    };
	
	    /**
	     * 根据name获取节点
	     * @param  {String} name 在创建节点中  name属性设置的值
	     * @return {Object}      name对应的节点
	     */
	    fishTopoProto.childOfName = function(name) {
	        var arrResult = [];
	        var childrenNode = this.allNodes;
	        var childrenLine = this.linkConnectionManager.connectors;
	        for (var i = 0; i < childrenNode.length; i++) {
	            if (childrenNode[i].model.get("options.name") && childrenNode[i].model.get("options.name") == name) {
	                arrResult.push(childrenNode[i]);
	            } else if (childrenNode[i].model.get("userData.name") == name) {
	                arrResult.push(childrenNode[i]);
	            }
	        }
	        for (var j = 0; j < childrenLine.length; j++) {
	            if (childrenLine[j].model.get("options.name") && childrenLine[j].model.get("options.name") == name) {
	                arrResult.push(childrenLine[j]);
	            } else if (childrenLine[j].model.get("userData.name") == name) {
	                arrResult.push(childrenLine[j]);
	            }
	        }
	        if (arrResult.length > 1) {
	            return arrResult;
	        } else {
	            return arrResult[0];
	        }
	    };
	
	    /**
	     * 查找场景中的对象   例如: x坐标大于100的节点 findElements(function(e){ return e.position[0] > 100; });
	     * @param  {Function} cb      回调函数
	     * @param  {Object}   context 回调函数执行的上下文
	     * @return {Array}           返回查找到的对象
	     */
	    fishTopoProto.findElements = function(cb, context) {
	        var childrenNode = this.allNodes;
	        var childrenLine = this.linkConnectionManager.connectors;
	        var arr = [];
	        for (var i = 0; i < childrenNode.length; i++) {
	            var child = childrenNode[i];
	            if (cb.call(context, child, i)) {
	                arr.push(child);
	            }
	        }
	        for (var j = 0; j < childrenLine.length; j++) {
	            var childL = childrenLine[j];
	            if (cb.call(context, childL, j)) {
	                arr.push(childL);
	            }
	        }
	        return arr;
	    };
	
	    /**
	     * 设置背景色  或 背景图片
	     * @param {string} imageUrl 背景色  或 背景图片 eg. 'img/bg.jpg'，为‘gridLine’时网格背景
	     */
	    fishTopoProto.setBackground = function(imageUrl) {
	        var that = this;
	        if (imageUrl && imageUrl.length > 0) {
	            this.model.set(Constants.BACKGROUND, imageUrl);
	            if (imageUrl.substr(0, 1) == "#" || imageUrl.substr(0, 4) == "rgba") { //如果是颜色创建rect为背景
	                if (!document.createElement('canvas').getContext) {
	                    that._dom.style.backgroundColor = imageUrl;
	                } else {
	                    var imageShape = new this.Shape.Rect({
	                        shape: {
	                            width: that._zr.getWidth(),
	                            height: that._zr.getHeight()
	                        },
	                        style: {
	                            fill: imageUrl
	                        },
	                        cursor: 'default',
	                        z: -1
	                    });
	                    that._zr.add(imageShape);
	                }
	
	            } else if(imageUrl == "gridLine" ){
	                this.gridLineGroup = new graphic.Group();
	                this.gridLine(0.2);
	                this._zr.add(this.gridLineGroup);
	            }else{
	                if (!document.createElement('canvas').getContext) {
	                    that._dom.style.backgroundImage = "url(" + imageUrl + ")";
	                    that._dom.style.backgroundRepeat = "repeat";
	                } else {
	                    var imageShape1 = new this.Shape.Image({ //如果是图片创建image为背景
	                        position: [0, 0],
	                        scale: [1, 1],
	                        style: {
	                            x: 0,
	                            y: 0,
	                            image: imageUrl,
	                            width: this._zr.getWidth(),
	                            height: this._zr.getHeight()
	                        },
	                        cursor: 'default',
	                        z: -1
	                    });
	                    that._zr.add(imageShape1);
	                }
	
	            }
	
	        }
	
	    };
	    //背景网格线
	    fishTopoProto.gridLine = function(opacity) {
	        var pixel = 10;
	        var widthLen = parseInt(this.getWidth() / pixel);
	        for (var x = 0; x <= widthLen; x++) {
	            var lineX = new graphic.Line({
	                shape: {
	                    x1: x * pixel,
	                    y1: 0,
	                    x2: x * pixel,
	                    y2: this.getHeight()
	                },
	                style: {
	                    lineDash: [1],
	                    opacity: opacity
	                },
	                z: 0,
	                draggable: false,
	                cursor: 'default'
	            });
	            this.gridLineGroup.add(lineX);
	        }
	
	        var heightLen = parseInt(this.getHeight() / pixel, pixel);
	        for (var y = 0; y <= heightLen; y++) {
	            var lineY = new graphic.Line({
	                shape: {
	                    x1: 0,
	                    y1: y * pixel,
	                    x2: this.getWidth(),
	                    y2: y * pixel
	                },
	                style: {
	                    lineDash: [1],
	                    opacity: opacity
	                },
	                z: 0,
	                draggable: false,
	                cursor: 'default'
	            });
	            this.gridLineGroup.add(lineY);
	        }
	    };
	
	
	    /**
	     * 根据点数组创建线段
	     * @method createLinkOfPoints
	     * @param  {Object} options 线段选项
	     * @param {Object} [options.style] 节点的样式
	     * @param {Number} [options.style.lineWidth=1] 线段的宽度
	     * @param {String} [options.style.lineType='straight'] 线段的类型 eg. 'straight', 'jagged','curve'
	     * @param {String} [options.style.stroke="#000000"] 线段的颜色值 eg. '#157cff'  'rgb(122,122,122)'
	     * @param {Array}  [options.style.lineDash] 虚线的间隔 eg. [3,3]
	     * @param {Object} [options.symbol] 线段的箭头
	     * @param {String} [options.symbol.type='arrow'] 线段的箭头的类型 可选值为： 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
	     * @param {Number} [options.symbol.size=10] 线段的箭头的尺寸
	     * @param {String} [options.symbol.color='#000000'] 线段的箭头的颜色
	     * @param {Object} [options.text] 线段上的文字
	     * @param {String} [options.text.text] 线段上的文字内容
	     * @param {String} [options.text.color] 线段上的文字颜色
	     * @param {String} [options.text.textPos] 文字位置可选值 'start','center','end',默认值为center
	     * @param {String} [options.text.xOffset] 文字位置x偏移量
	     * @param {String} [options.pos] 指定线段起始与终止 在节点的什么位置 默认值为'left,right'  可取值四个方向top,bottom,left,right 方向可加偏移量如如 "left+10,top"
	     * @param {String} [options.position] 指定线段位置
	     * @param {Object} [options.effect] 线上动态效果
	     * @param {String} [options.effect.show] 是否显示箭头动效
	     * @param {Number} [options.effect.period] 动效移动速度
	     * @param {String} [options.position.points] 不使用自动计算 指定连线的折点位置数组
	     * @param {Object} userData 用户传递的业务数据
	     * @return {Object} 创建的线段对象
	     *
	     * **使用范例**：
	     *
	     *      @example
	     *      var link = me.fishTopo.createLinkOfPoints({
	     *              symbol: { type: 'arrow', size: 10, color: "rgb(0,200,255)" }, //箭头  可选值为： 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
	     *              style: { lineWidth: 3, stroke: "rgb(0,200,255)", lineDash: [3,3], lineType: "jagged"  }, //样式
	     *              text: {
	     *                  text: text,
	     *                  color: '#ffffff',
	     *                  textPos:textPos,//文字位置可选值 'start','center','end',默认值为center
	     *                  xOffset:10, //文字位置x偏移量
	     *              }
	     *              position:{
	                        points:[
	                            {x:0,y:0},
	                            {x:50,y:0},
	                            {x:that.fishTopoLink.getWidth()-50, y:50},
	                            {x:that.fishTopoLink.getWidth(), y:50}
	                        ]  //不使用自动计算 指定连线的位置数组
	                    }
	     *          });
	     */
	    fishTopoProto.createLinkOfPoints = function(options, userData) {
	        var that = this;
	        options.isEdit = !!this.options.linkModify;
	        var connector = this.linkConnectionManager.connectorCreateOfPoints(options, this._api);
	        connector.model.set(Constants.USERDATA, zrUtil.clone(userData));
	        connector.on("dblclick", function() {
	            if (typeof this.options.text.isAllowEdit == "undefined") {
	                if (that.options.isAllowEdit) {
	                    that.connectorEdit(this);
	                }
	            } else {
	                if (this.options.text.isAllowEdit) {
	                    that.connectorEdit(this);
	                }
	            }
	        });
	        return connector;
	    };
	
	
	    /**
	     * @private
	     * 返回当前画布的数据
	     */
	    fishTopoProto.toDataURL = function(opts) {
	        return LinkUtil.toDataURL(this._zr, opts);
	    };
	
	    zrUtil.mixin(FishTopoLink, Eventful);
	
	    // ---------对外暴露fishTopoLink------------------
	    var idBase = new Date() - 0;
	    var instances = {};
	    var DOM_ATTRIBUTE_KEY = '_fishTopoLink_instance_';
	
	    /**
	     * fishTopoLink全局对象，如果是amd方式加载，则直接返回
	     * @class fishTopoLink
	     * @singleton
	     */
	    var fishTopoLink = {
	        /**
	         * 版本号
	         * @type {String}
	         */
	        version: '1.7.0',
	        dependencies: {
	            zrender: '3.0.4'
	        }
	    };
	
	    /**
	     * 初始化dom元素为 flow对象
	     * @member fishTopoLink
	     * @param {HTMLElement} dom  一个div元素
	     * @param {Object} opts  传递的选项参数
	     * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg' or 'vml'
	     * @param {number} [opts.devicePixelRatio=1] retina 屏幕优化
	     * @param {number} [opts.linkModify=false] 是否允许调整线段
	     * @return {fish.topo.FishTopoLink}
	     */
	    fishTopoLink.init = function(dom, opts) {
	        if (!dom) {
	            throw new Error('Initialize failed: invalid dom.');
	        }
	
	        opts = opts || {};
	        // Default value
	        zrUtil.defaults(opts, {
	            type: "flow",
	            devicePixelRatio: 1,
	            linkModify: false,
	            isAllowEdit: false
	        });
	
	        var fishTopoLink = new FishTopoLink(dom, opts);
	        fishTopoLink.init();
	        fishTopoLink.Link = Link;
	        fishTopoLink.id = 'ft_' + idBase++;
	        instances[fishTopoLink.id] = fishTopoLink;
	
	        dom.setAttribute && dom.setAttribute(DOM_ATTRIBUTE_KEY, fishTopoLink.id);
	
	        return fishTopoLink;
	    };
	
	
	    /**
	     * 获取 dom 容器上的实例。
	     * @member fishTopoLink
	     * @param  {HTMLElement} dom 一个div元素
	     * @return {fish.topo.FishTopoLink}
	     */
	    fishTopoLink.getInstanceByDom = function(dom) {
	        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
	        return instances[key];
	    };
	
	    /**
	     * 销毁实例，实例销毁后无法再被使用。
	     *
	     * @member fishTopoLink
	     * @param  {Object|string} chart fishTopoLink实例 或 fishTopoLink的id
	     */
	    fishTopoLink.dispose = function(chart) {
	        var topo;
	        if (zrUtil.isDom(chart)) {
	            topo = fishTopoLink.getInstanceByDom(chart);
	        } else if (typeof chart === 'string') {
	            topo = instances[chart];
	        }
	        if ((topo instanceof fishTopoLink) && !topo.isDisposed()) {
	            topo.dispose();
	        }
	        clearTimeout(this._layoutTimeout);
	    };
	
	    //暴露出去的类
	    fishTopoLink.util = {};
	    fishTopoLink.util['initImagePool'] = ImagePool.initImagePool;
	    zrUtil.each([
	            'map', 'each', 'filter', 'indexOf', 'inherits',
	            'reduce', 'filter', 'bind', 'curry', 'isArray',
	            'isString', 'isObject', 'isFunction', 'extend'
	        ],
	        function(name) {
	            fishTopoLink.util[name] = zrUtil[name];
	        }
	    );
	
	    module.exports = fishTopoLink;
	


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var zrUtil = __webpack_require__(4);
	
	    var pathTool = __webpack_require__(5);
	    var round = Math.round;
	    var Path = __webpack_require__(6);
	    var colorTool = __webpack_require__(19);
	    var matrix = __webpack_require__(13);
	    var vector = __webpack_require__(14);
	    var Gradient = __webpack_require__(38);
	    var Draggable = __webpack_require__(39);
	
	    var graphic = {};
	    graphic.Util = zrUtil;
	    graphic.Group = __webpack_require__(40);
	
	    graphic.Image = __webpack_require__(41);
	
	    graphic.Text = __webpack_require__(42);
	
	    graphic.textContain = __webpack_require__(24);
	
	    graphic.Circle = __webpack_require__(43);
	
	    graphic.Sector = __webpack_require__(44);
	
	    graphic.Ring = __webpack_require__(46);
	
	    graphic.Polygon = __webpack_require__(47);
	
	    graphic.Polyline = __webpack_require__(51);
	
	    graphic.Rect = __webpack_require__(52);
	
	    graphic.Line = __webpack_require__(54);
	
	    graphic.BezierCurve = __webpack_require__(55);
	
	    graphic.Arc = __webpack_require__(56);
	
	    graphic.LinearGradient = __webpack_require__(57);
	
	    graphic.RadialGradient = __webpack_require__(58);
	
	    graphic.BoundingRect = __webpack_require__(25);
	
	    /**
	     * Extend shape with parameters
	     */
	    graphic.extendShape = function (opts) {
	        return Path.extend(opts);
	    };
	
	    /**
	     * Extend path
	     */
	    graphic.extendPath = function (pathData, opts) {
	        return pathTool.extendFromString(pathData, opts);
	    };
	
	    /**
	     * Create a path element from path data string
	     * @param {string} pathData
	     * @param {Object} opts
	     * @param {module:zrender/core/BoundingRect} rect
	     * @param {string} [layout=cover] 'center' or 'cover'
	     */
	    graphic.makePath = function (pathData, opts, rect, layout) {
	        var path = pathTool.createFromString(pathData, opts);
	        Draggable.call(path);
	        var boundingRect = path.getBoundingRect();
	        if (rect) {
	            var aspect = boundingRect.width / boundingRect.height;
	
	            if (layout === 'center') {
	                // Set rect to center, keep width / height ratio.
	                var width = rect.height * aspect;
	                var height;
	                if (width <= rect.width) {
	                    height = rect.height;
	                }
	                else {
	                    width = rect.width;
	                    height = width / aspect;
	                }
	                var cx = rect.x + rect.width / 2;
	                var cy = rect.y + rect.height / 2;
	
	                rect.x = cx - width / 2;
	                rect.y = cy - height / 2;
	                rect.width = width;
	                rect.height = height;
	            }
	
	            this.resizePath(path, rect);
	        }
	
	        zrUtil.inherits(path, Draggable);
	        return path;
	    };
	
	    graphic.mergePath = pathTool.mergePath;
	
	    /**
	     * Resize a path to fit the rect
	     * @param {module:zrender/graphic/Path} path
	     * @param {Object} rect
	     */
	    graphic.resizePath = function (path, rect) {
	        if (!path.applyTransform) {
	            return;
	        }
	
	        var pathRect = path.getBoundingRect();
	
	        var m = pathRect.calculateTransform(rect);
	
	        path.applyTransform(m);
	    };
	
	    /**
	     * Sub pixel optimize line for canvas
	     *
	     * @param {Object} param
	     * @param {Object} [param.shape]
	     * @param {number} [param.shape.x1]
	     * @param {number} [param.shape.y1]
	     * @param {number} [param.shape.x2]
	     * @param {number} [param.shape.y2]
	     * @param {Object} [param.style]
	     * @param {number} [param.style.lineWidth]
	     * @return {Object} Modified param
	     */
	    graphic.subPixelOptimizeLine = function (param) {
	        var subPixelOptimize = graphic.subPixelOptimize;
	        var shape = param.shape;
	        var lineWidth = param.style.lineWidth;
	
	        if (round(shape.x1 * 2) === round(shape.x2 * 2)) {
	            shape.x1 = shape.x2 = subPixelOptimize(shape.x1, lineWidth, true);
	        }
	        if (round(shape.y1 * 2) === round(shape.y2 * 2)) {
	            shape.y1 = shape.y2 = subPixelOptimize(shape.y1, lineWidth, true);
	        }
	        return param;
	    };
	
	    /**
	     * Sub pixel optimize rect for canvas
	     *
	     * @param {Object} param
	     * @param {Object} [param.shape]
	     * @param {number} [param.shape.x]
	     * @param {number} [param.shape.y]
	     * @param {number} [param.shape.width]
	     * @param {number} [param.shape.height]
	     * @param {Object} [param.style]
	     * @param {number} [param.style.lineWidth]
	     * @return {Object} Modified param
	     */
	    graphic.subPixelOptimizeRect = function (param) {
	        var subPixelOptimize = graphic.subPixelOptimize;
	        var shape = param.shape;
	        var lineWidth = param.style.lineWidth;
	        var originX = shape.x;
	        var originY = shape.y;
	        var originWidth = shape.width;
	        var originHeight = shape.height;
	        shape.x = subPixelOptimize(shape.x, lineWidth, true);
	        shape.y = subPixelOptimize(shape.y, lineWidth, true);
	        shape.width = Math.max(
	            subPixelOptimize(originX + originWidth, lineWidth, false) - shape.x,
	            originWidth === 0 ? 0 : 1
	        );
	        shape.height = Math.max(
	            subPixelOptimize(originY + originHeight, lineWidth, false) - shape.y,
	            originHeight === 0 ? 0 : 1
	        );
	        return param;
	    };
	
	    /**
	     * Sub pixel optimize for canvas
	     *
	     * @param {number} position Coordinate, such as x, y
	     * @param {number} lineWidth Should be nonnegative integer.
	     * @param {boolean=} positiveOrNegative Default false (negative).
	     * @return {number} Optimized position.
	     */
	    graphic.subPixelOptimize = function (position, lineWidth, positiveOrNegative) {
	        // Assure that (position + lineWidth / 2) is near integer edge,
	        // otherwise line will be fuzzy in canvas.
	        var doubledPosition = round(position * 2);
	        return (doubledPosition + round(lineWidth)) % 2 === 0
	            ? doubledPosition / 2
	            : (doubledPosition + (positiveOrNegative ? 1 : -1)) / 2;
	    };
	
	    /**
	     * @private
	     */
	    function doSingleEnterHover(el) {
	        if (el.__isHover) {
	            return;
	        }
	        if (el.__hoverStlDirty) {
	            var stroke = el.style.stroke;
	            var fill = el.style.fill;
	
	            // Create hoverStyle on mouseover
	            var hoverStyle = el.__hoverStl;
	            var lift = colorTool.lift;
	            hoverStyle.fill = hoverStyle.fill
	                || (fill && (fill instanceof Gradient ? fill : lift(fill, -0.1)));
	            hoverStyle.stroke = hoverStyle.stroke
	                || (stroke && (stroke instanceof Gradient ? stroke : lift(stroke, -0.1)));
	
	            var normalStyle = {};
	            for (var name in hoverStyle) {
	                if (hoverStyle.hasOwnProperty(name)) {
	                    normalStyle[name] = el.style[name];
	                }
	            }
	
	            el.__normalStl = normalStyle;
	
	            el.__hoverStlDirty = false;
	        }
	        el.setStyle(el.__hoverStl);
	        el.z2 += 1;
	
	        el.__isHover = true;
	    }
	
	    /**
	     * @inner
	     */
	    function doSingleLeaveHover(el) {
	        if (!el.__isHover) {
	            return;
	        }
	
	        var normalStl = el.__normalStl;
	        normalStl && el.setStyle(normalStl);
	        el.z2 -= 1;
	
	        el.__isHover = false;
	    }
	
	    /**
	     * @inner
	     */
	    function doEnterHover(el) {
	        el.type === 'group'
	            ? el.traverse(function (child) {
	                if (child.type !== 'group') {
	                    doSingleEnterHover(child);
	                }
	            })
	            : doSingleEnterHover(el);
	    }
	    graphic.doEnterHover = doEnterHover;
	    function doLeaveHover(el) {
	        el.type === 'group'
	            ? el.traverse(function (child) {
	                if (child.type !== 'group') {
	                    doSingleLeaveHover(child);
	                }
	            })
	            : doSingleLeaveHover(el);
	    }
	    graphic.doLeaveHover = doLeaveHover;
	    /**
	     * @inner
	     */
	    function setElementHoverStl(el, hoverStl) {
	        // If element has sepcified hoverStyle, then use it instead of given hoverStyle
	        // Often used when item group has a label element and it's hoverStyle is different
	        el.__hoverStl = el.hoverStyle || hoverStl || {};
	        el.__hoverStlDirty = true;
	    }
	    graphic.setElementHoverStl = setElementHoverStl;
	    /**
	     * @inner
	     */
	    function onElementMouseOver() {
	        // Only if element is not in emphasis status
	        !this.__isEmphasis && doEnterHover(this);
	    }
	
	    /**
	     * @inner
	     */
	    function onElementMouseOut() {
	        // Only if element is not in emphasis status
	        !this.__isEmphasis && doLeaveHover(this);
	    }
	
	    /**
	     * @inner
	     */
	    function enterEmphasis() {
	        this.__isEmphasis = true;
	        doEnterHover(this);
	    }
	
	    /**
	     * @inner
	     */
	    function leaveEmphasis() {
	        this.__isEmphasis = false;
	        doLeaveHover(this);
	    }
	
	    /**
	     * Set hover style of element
	     * @param {module:zrender/Element} el
	     * @param {Object} [hoverStyle]
	     */
	    graphic.setHoverStyle = function (el, hoverStyle) {
	        el.type === 'group'
	            ? el.traverse(function (child) {
	                if (child.type !== 'group') {
	                    setElementHoverStl(child, hoverStyle);
	                }
	            })
	            : setElementHoverStl(el, hoverStyle);
	        // Remove previous bound handlers
	        el.on('mouseover', onElementMouseOver)
	          .on('mouseout', onElementMouseOut);
	
	        // Emphasis, normal can be triggered manually
	        el.on('emphasis', enterEmphasis)
	          .on('normal', leaveEmphasis);
	    };
	
	    graphic.setNormalStyle = function(el, options) {
	        if (el.__normalStl) {
	            for (var name in options) {
	                if (el.__normalStl.hasOwnProperty(name)) {
	                    el.__normalStl[name] = options[name];
	                }
	            }
	        }
	    };
	
	    /**
	     * Set text option in the style
	     * @param {Object} textStyle
	     * @param {module:echarts/model/Model} labelModel
	     * @param {string} color
	     */
	    graphic.setText = function (textStyle, labelModel, color) {
	        var labelPosition = labelModel.getShallow('position') || 'inside';
	        var labelColor = labelPosition.indexOf('inside') >= 0 ? 'white' : color;
	        var textStyleModel = labelModel.getModel('textStyle');
	        zrUtil.extend(textStyle, {
	            textDistance: labelModel.getShallow('distance') || 5,
	            textFont: textStyleModel.getFont(),
	            textPosition: labelPosition,
	            textFill: textStyleModel.getTextColor() || labelColor
	        });
	    };
	
	    function animateOrSetProps(isUpdate, el, props, animatableModel, cb) {
	        var postfix = isUpdate ? 'Update' : '';
	        var duration = animatableModel
	            && animatableModel.getShallow('animationDuration' + postfix);
	        var animationEasing = animatableModel
	            && animatableModel.getShallow('animationEasing' + postfix);
	
	        animatableModel && animatableModel.getShallow('animation')
	            ? el.animateTo(props, duration, animationEasing, cb)
	            : (el.attr(props), cb && cb());
	    }
	    /**
	     * Update graphic element properties with or without animation according to the configuration in series
	     * @param {module:zrender/Element} el
	     * @param {Object} props
	     * @param {module:echarts/model/Model} [animatableModel]
	     * @param {Function} cb
	     */
	    graphic.updateProps = zrUtil.curry(animateOrSetProps, true);
	
	    /**
	     * Init graphic element properties with or without animation according to the configuration in series
	     * @param {module:zrender/Element} el
	     * @param {Object} props
	     * @param {module:echarts/model/Model} [animatableModel]
	     * @param {Function} cb
	     */
	    graphic.initProps = zrUtil.curry(animateOrSetProps, false);
	
	    /**
	     * Get transform matrix of target (param target),
	     * in coordinate of its ancestor (param ancestor)
	     *
	     * @param {module:zrender/mixin/Transformable} target
	     * @param {module:zrender/mixin/Transformable} ancestor
	     */
	    graphic.getTransform = function (target, ancestor) {
	        var mat = matrix.identity([]);
	
	        while (target && target !== ancestor) {
	            matrix.mul(mat, target.getLocalTransform(), mat);
	            target = target.parent;
	        }
	
	        return mat;
	    };
	
	    /**
	     * Apply transform to an vertex.
	     * @param {Array.<number>} vertex [x, y]
	     * @param {Array.<number>} transform Transform matrix: like [1, 0, 0, 1, 0, 0]
	     * @param {boolean=} invert Whether use invert matrix.
	     * @return {Array.<number>} [x, y]
	     */
	    graphic.applyTransform = function (vertex, transform, invert) {
	        if (invert) {
	            transform = matrix.invert([], transform);
	        }
	        return vector.applyTransform([], vertex, transform);
	    };
	
	    /**
	     * @param {string} direction 'left' 'right' 'top' 'bottom'
	     * @param {Array.<number>} transform Transform matrix: like [1, 0, 0, 1, 0, 0]
	     * @param {boolean=} invert Whether use invert matrix.
	     * @return {string} Transformed direction. 'left' 'right' 'top' 'bottom'
	     */
	    graphic.transformDirection = function (direction, transform, invert) {
	
	        // Pick a base, ensure that transform result will not be (0, 0).
	        var hBase = (transform[4] === 0 || transform[5] === 0 || transform[0] === 0)
	            ? 1 : Math.abs(2 * transform[4] / transform[0]);
	        var vBase = (transform[4] === 0 || transform[5] === 0 || transform[2] === 0)
	            ? 1 : Math.abs(2 * transform[4] / transform[2]);
	
	        var vertex = [
	            direction === 'left' ? -hBase : direction === 'right' ? hBase : 0,
	            direction === 'top' ? -vBase : direction === 'bottom' ? vBase : 0
	        ];
	
	        vertex = graphic.applyTransform(vertex, transform, invert);
	
	        return Math.abs(vertex[0]) > Math.abs(vertex[1])
	            ? (vertex[0] > 0 ? 'right' : 'left')
	            : (vertex[1] > 0 ? 'bottom' : 'top');
	    };
	
	    module.exports = graphic;
	


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * @module zrender/core/util
	 */
	
	
	    // 用于处理merge时无法遍历Date等对象的问题
	    var BUILTIN_OBJECT = {
	        '[object Function]': 1,
	        '[object RegExp]': 1,
	        '[object Date]': 1,
	        '[object Error]': 1,
	        '[object CanvasGradient]': 1,
	        '[object CanvasPattern]': 1,
	        // For node-canvas
	        '[object Image]': 1,
	        '[object Canvas]': 1
	    };
	
	    var TYPED_ARRAY = {
	        '[object Int8Array]': 1,
	        '[object Uint8Array]': 1,
	        '[object Uint8ClampedArray]': 1,
	        '[object Int16Array]': 1,
	        '[object Uint16Array]': 1,
	        '[object Int32Array]': 1,
	        '[object Uint32Array]': 1,
	        '[object Float32Array]': 1,
	        '[object Float64Array]': 1
	    };
	
	    var objToString = Object.prototype.toString;
	
	    var arrayProto = Array.prototype;
	    var nativeForEach = arrayProto.forEach;
	    var nativeFilter = arrayProto.filter;
	    var nativeSlice = arrayProto.slice;
	    var nativeMap = arrayProto.map;
	    var nativeReduce = arrayProto.reduce;
	
	    /**
	     * Those data types can be cloned:
	     *     Plain object, Array, TypedArray, number, string, null, undefined.
	     * Those data types will be assgined using the orginal data:
	     *     BUILTIN_OBJECT
	     * Instance of user defined class will be cloned to a plain object, without
	     * properties in prototype.
	     * Other data types is not supported (not sure what will happen).
	     *
	     * Caution: do not support clone Date, for performance consideration.
	     * (There might be a large number of date in `series.data`).
	     * So date should not be modified in and out of echarts.
	     *
	     * @param {*} source
	     * @return {*} new
	     */
	    function clone(source) {
	        if (source == null || typeof source != 'object') {
	            return source;
	        }
	
	        var result = source;
	        var typeStr = objToString.call(source);
	
	        if (typeStr === '[object Array]') {
	            result = [];
	            for (var i = 0, len = source.length; i < len; i++) {
	                result[i] = clone(source[i]);
	            }
	        }
	        else if (TYPED_ARRAY[typeStr]) {
	            result = source.constructor.from(source);
	        }
	        else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
	            result = {};
	            for (var key in source) {
	                if (source.hasOwnProperty(key)) {
	                    result[key] = clone(source[key]);
	                }
	            }
	        }
	
	        return result;
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} target
	     * @param {*} source
	     * @param {boolean} [overwrite=false]
	     */
	    function merge(target, source, overwrite) {
	        // We should escapse that source is string
	        // and enter for ... in ...
	        if (!isObject(source) || !isObject(target)) {
	            return overwrite ? clone(source) : target;
	        }
	
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                var targetProp = target[key];
	                var sourceProp = source[key];
	
	                if (isObject(sourceProp)
	                    && isObject(targetProp)
	                    && !isArray(sourceProp)
	                    && !isArray(targetProp)
	                    && !isDom(sourceProp)
	                    && !isDom(targetProp)
	                    && !isBuiltInObject(sourceProp)
	                    && !isBuiltInObject(targetProp)
	                    && !isPrimitive(sourceProp)
	                    && !isPrimitive(targetProp)
	                ) {
	                    // 如果需要递归覆盖，就递归调用merge
	                    merge(targetProp, sourceProp, overwrite);
	                }
	                else if (overwrite || !(key in target)) {
	                    // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
	                    // NOTE，在 target[key] 不存在的时候也是直接覆盖
	                    target[key] = clone(source[key], true);
	                }
	            }
	        }
	
	        return target;
	    }
	
	    /**
	     * @param {Array} targetAndSources The first item is target, and the rests are source.
	     * @param {boolean} [overwrite=false]
	     * @return {*} target
	     */
	    function mergeAll(targetAndSources, overwrite) {
	        var result = targetAndSources[0];
	        for (var i = 1, len = targetAndSources.length; i < len; i++) {
	            result = merge(result, targetAndSources[i], overwrite);
	        }
	        return result;
	    }
	
	    /**
	     * @param {*} target
	     * @param {*} source
	     * @memberOf module:zrender/core/util
	     */
	    function extend(target, source) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }
	
	    /**
	     * @param {*} target
	     * @param {*} source
	     * @param {boolen} [overlay=false]
	     * @memberOf module:zrender/core/util
	     */
	    function defaults(target, source, overlay) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)
	                && (overlay ? source[key] != null : target[key] == null)
	            ) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }
	
	    function createCanvas() {
	        return document.createElement('canvas');
	    }
	    // FIXME
	    var _ctx;
	    function getContext() {
	        if (!_ctx) {
	            // Use util.createCanvas instead of createCanvas
	            // because createCanvas may be overwritten in different environment
	            _ctx = util.createCanvas().getContext('2d');
	        }
	        return _ctx;
	    }
	
	    /**
	     * 查询数组中元素的index
	     * @memberOf module:zrender/core/util
	     */
	    function indexOf(array, value) {
	        if (array) {
	            if (array.indexOf) {
	                return array.indexOf(value);
	            }
	            for (var i = 0, len = array.length; i < len; i++) {
	                if (array[i] === value) {
	                    return i;
	                }
	            }
	        }
	        return -1;
	    }
	
	    /**
	     * 构造类继承关系
	     *
	     * @memberOf module:zrender/core/util
	     * @param {Function} clazz 源类
	     * @param {Function} baseClazz 基类
	     */
	    function inherits(clazz, baseClazz) {
	        var clazzPrototype = clazz.prototype;
	        function F() {}
	        F.prototype = baseClazz.prototype;
	        clazz.prototype = new F();
	
	        for (var prop in clazzPrototype) {
	            clazz.prototype[prop] = clazzPrototype[prop];
	        }
	        clazz.prototype.constructor = clazz;
	        clazz.superClass = baseClazz;
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Object|Function} target
	     * @param {Object|Function} sorce
	     * @param {boolean} overlay
	     */
	    function mixin(target, source, overlay) {
	        target = 'prototype' in target ? target.prototype : target;
	        source = 'prototype' in source ? source.prototype : source;
	
	        defaults(target, source, overlay);
	    }
	
	    /**
	     * @param {Array|TypedArray} data
	     */
	    function isArrayLike(data) {
	        if (! data) {
	            return;
	        }
	        if (typeof data == 'string') {
	            return false;
	        }
	        return typeof data.length == 'number';
	    }
	
	    /**
	     * 数组或对象遍历
	     * @memberOf module:zrender/core/util
	     * @param {Object|Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     */
	    function each(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.forEach && obj.forEach === nativeForEach) {
	            obj.forEach(cb, context);
	        }
	        else if (obj.length === +obj.length) {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                cb.call(context, obj[i], i, obj);
	            }
	        }
	        else {
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    cb.call(context, obj[key], key, obj);
	                }
	            }
	        }
	    }
	
	    /**
	     * 数组映射
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function map(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.map && obj.map === nativeMap) {
	            return obj.map(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                result.push(cb.call(context, obj[i], i, obj));
	            }
	            return result;
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {Object} [memo]
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function reduce(obj, cb, memo, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.reduce && obj.reduce === nativeReduce) {
	            return obj.reduce(cb, memo, context);
	        }
	        else {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                memo = cb.call(context, memo, obj[i], i, obj);
	            }
	            return memo;
	        }
	    }
	
	    /**
	     * 数组过滤
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function filter(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.filter && obj.filter === nativeFilter) {
	            return obj.filter(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                if (cb.call(context, obj[i], i, obj)) {
	                    result.push(obj[i]);
	                }
	            }
	            return result;
	        }
	    }
	
	    /**
	     * 数组项查找
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function find(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        for (var i = 0, len = obj.length; i < len; i++) {
	            if (cb.call(context, obj[i], i, obj)) {
	                return obj[i];
	            }
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @param {*} context
	     * @return {Function}
	     */
	    function bind(func, context) {
	        var args = nativeSlice.call(arguments, 2);
	        return function () {
	            return func.apply(context, args.concat(nativeSlice.call(arguments)));
	        };
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @return {Function}
	     */
	    function curry(func) {
	        var args = nativeSlice.call(arguments, 1);
	        return function () {
	            return func.apply(this, args.concat(nativeSlice.call(arguments)));
	        };
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isArray(value) {
	        return objToString.call(value) === '[object Array]';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isFunction(value) {
	        return typeof value === 'function';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isString(value) {
	        return objToString.call(value) === '[object String]';
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isObject(value) {
	        // Avoid a V8 JIT bug in Chrome 19-20.
	        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	        var type = typeof value;
	        return type === 'function' || (!!value && type == 'object');
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isBuiltInObject(value) {
	        return !!BUILTIN_OBJECT[objToString.call(value)];
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isDom(value) {
	        return typeof value === 'object'
	            && typeof value.nodeType === 'number'
	            && typeof value.ownerDocument === 'object';
	    }
	
	    /**
	     * Whether is exactly NaN. Notice isNaN('a') returns true.
	     * @param {*} value
	     * @return {boolean}
	     */
	    function eqNaN(value) {
	        return value !== value;
	    }
	
	    /**
	     * If value1 is not null, then return value1, otherwise judget rest of values.
	     * @memberOf module:zrender/core/util
	     * @return {*} Final value
	     */
	    function retrieve(values) {
	        for (var i = 0, len = arguments.length; i < len; i++) {
	            if (arguments[i] != null) {
	                return arguments[i];
	            }
	        }
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} arr
	     * @param {number} startIndex
	     * @param {number} endIndex
	     * @return {Array}
	     */
	    function slice() {
	        return Function.call.apply(nativeSlice, arguments);
	    }
	
	    /**
	     * @memberOf module:zrender/core/util
	     * @param {boolean} condition
	     * @param {string} message
	     */
	    function assert(condition, message) {
	        if (!condition) {
	            throw new Error(message);
	        }
	    }
	
	    var primitiveKey = '__ec_primitive__';
	    /**
	     * Set an object as primitive to be ignored traversing children in clone or merge
	     */
	    function setAsPrimitive(obj) {
	        obj[primitiveKey] = true;
	    }
	
	    function isPrimitive(obj) {
	        return obj[primitiveKey];
	    }
	
	    var util = {
	        inherits: inherits,
	        mixin: mixin,
	        clone: clone,
	        merge: merge,
	        mergeAll: mergeAll,
	        extend: extend,
	        defaults: defaults,
	        getContext: getContext,
	        createCanvas: createCanvas,
	        indexOf: indexOf,
	        slice: slice,
	        find: find,
	        isArrayLike: isArrayLike,
	        each: each,
	        map: map,
	        reduce: reduce,
	        filter: filter,
	        bind: bind,
	        curry: curry,
	        isArray: isArray,
	        isString: isString,
	        isObject: isObject,
	        isFunction: isFunction,
	        isBuiltInObject: isBuiltInObject,
	        isDom: isDom,
	        eqNaN: eqNaN,
	        retrieve: retrieve,
	        assert: assert,
	        setAsPrimitive: setAsPrimitive,
	        noop: function () {}
	    };
	    module.exports = util;
	


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var Path = __webpack_require__(6);
	    var PathProxy = __webpack_require__(26);
	    var transformPath = __webpack_require__(37);
	    var matrix = __webpack_require__(13);
	
	    // command chars
	    var cc = [
	        'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
	        'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
	    ];
	
	    var mathSqrt = Math.sqrt;
	    var mathSin = Math.sin;
	    var mathCos = Math.cos;
	    var PI = Math.PI;
	
	    var vMag = function(v) {
	        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
	    };
	    var vRatio = function(u, v) {
	        return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
	    };
	    var vAngle = function(u, v) {
	        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
	                * Math.acos(vRatio(u, v));
	    };
	
	    function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
	        var psi = psiDeg * (PI / 180.0);
	        var xp = mathCos(psi) * (x1 - x2) / 2.0
	                 + mathSin(psi) * (y1 - y2) / 2.0;
	        var yp = -1 * mathSin(psi) * (x1 - x2) / 2.0
	                 + mathCos(psi) * (y1 - y2) / 2.0;
	
	        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
	
	        if (lambda > 1) {
	            rx *= mathSqrt(lambda);
	            ry *= mathSqrt(lambda);
	        }
	
	        var f = (fa === fs ? -1 : 1)
	            * mathSqrt((((rx * rx) * (ry * ry))
	                    - ((rx * rx) * (yp * yp))
	                    - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
	                    + (ry * ry) * (xp * xp))
	                ) || 0;
	
	        var cxp = f * rx * yp / ry;
	        var cyp = f * -ry * xp / rx;
	
	        var cx = (x1 + x2) / 2.0
	                 + mathCos(psi) * cxp
	                 - mathSin(psi) * cyp;
	        var cy = (y1 + y2) / 2.0
	                + mathSin(psi) * cxp
	                + mathCos(psi) * cyp;
	
	        var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
	        var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
	        var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
	        var dTheta = vAngle(u, v);
	
	        if (vRatio(u, v) <= -1) {
	            dTheta = PI;
	        }
	        if (vRatio(u, v) >= 1) {
	            dTheta = 0;
	        }
	        if (fs === 0 && dTheta > 0) {
	            dTheta = dTheta - 2 * PI;
	        }
	        if (fs === 1 && dTheta < 0) {
	            dTheta = dTheta + 2 * PI;
	        }
	
	        path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
	    }
	
	    function createPathProxyFromString(data) {
	        if (!data) {
	            return [];
	        }
	
	        // command string
	        var cs = data.replace(/-/g, ' -')
	            .replace(/  /g, ' ')
	            .replace(/ /g, ',')
	            .replace(/,,/g, ',');
	
	        var n;
	        // create pipes so that we can split the data
	        for (n = 0; n < cc.length; n++) {
	            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
	        }
	
	        // create array
	        var arr = cs.split('|');
	        // init context point
	        var cpx = 0;
	        var cpy = 0;
	
	        var path = new PathProxy();
	        var CMD = PathProxy.CMD;
	
	        var prevCmd;
	        for (n = 1; n < arr.length; n++) {
	            var str = arr[n];
	            var c = str.charAt(0);
	            var off = 0;
	            var p = str.slice(1).replace(/e,-/g, 'e-').split(',');
	            var cmd;
	
	            if (p.length > 0 && p[0] === '') {
	                p.shift();
	            }
	
	            for (var i = 0; i < p.length; i++) {
	                p[i] = parseFloat(p[i]);
	            }
	            while (off < p.length && !isNaN(p[off])) {
	                if (isNaN(p[0])) {
	                    break;
	                }
	                var ctlPtx;
	                var ctlPty;
	
	                var rx;
	                var ry;
	                var psi;
	                var fa;
	                var fs;
	
	                var x1 = cpx;
	                var y1 = cpy;
	
	                // convert l, H, h, V, and v to L
	                switch (c) {
	                    case 'l':
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'L':
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'm':
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        cmd = CMD.M;
	                        path.addData(cmd, cpx, cpy);
	                        c = 'l';
	                        break;
	                    case 'M':
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        cmd = CMD.M;
	                        path.addData(cmd, cpx, cpy);
	                        c = 'L';
	                        break;
	                    case 'h':
	                        cpx += p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'H':
	                        cpx = p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'v':
	                        cpy += p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'V':
	                        cpy = p[off++];
	                        cmd = CMD.L;
	                        path.addData(cmd, cpx, cpy);
	                        break;
	                    case 'C':
	                        cmd = CMD.C;
	                        path.addData(
	                            cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]
	                        );
	                        cpx = p[off - 2];
	                        cpy = p[off - 1];
	                        break;
	                    case 'c':
	                        cmd = CMD.C;
	                        path.addData(
	                            cmd,
	                            p[off++] + cpx, p[off++] + cpy,
	                            p[off++] + cpx, p[off++] + cpy,
	                            p[off++] + cpx, p[off++] + cpy
	                        );
	                        cpx += p[off - 2];
	                        cpy += p[off - 1];
	                        break;
	                    case 'S':
	                        ctlPtx = cpx;
	                        ctlPty = cpy;
	                        var len = path.len();
	                        var pathData = path.data;
	                        if (prevCmd === CMD.C) {
	                            ctlPtx += cpx - pathData[len - 4];
	                            ctlPty += cpy - pathData[len - 3];
	                        }
	                        cmd = CMD.C;
	                        x1 = p[off++];
	                        y1 = p[off++];
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
	                        break;
	                    case 's':
	                        ctlPtx = cpx;
	                        ctlPty = cpy;
	                        var len = path.len();
	                        var pathData = path.data;
	                        if (prevCmd === CMD.C) {
	                            ctlPtx += cpx - pathData[len - 4];
	                            ctlPty += cpy - pathData[len - 3];
	                        }
	                        cmd = CMD.C;
	                        x1 = cpx + p[off++];
	                        y1 = cpy + p[off++];
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
	                        break;
	                    case 'Q':
	                        x1 = p[off++];
	                        y1 = p[off++];
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        cmd = CMD.Q;
	                        path.addData(cmd, x1, y1, cpx, cpy);
	                        break;
	                    case 'q':
	                        x1 = p[off++] + cpx;
	                        y1 = p[off++] + cpy;
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        cmd = CMD.Q;
	                        path.addData(cmd, x1, y1, cpx, cpy);
	                        break;
	                    case 'T':
	                        ctlPtx = cpx;
	                        ctlPty = cpy;
	                        var len = path.len();
	                        var pathData = path.data;
	                        if (prevCmd === CMD.Q) {
	                            ctlPtx += cpx - pathData[len - 4];
	                            ctlPty += cpy - pathData[len - 3];
	                        }
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        cmd = CMD.Q;
	                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
	                        break;
	                    case 't':
	                        ctlPtx = cpx;
	                        ctlPty = cpy;
	                        var len = path.len();
	                        var pathData = path.data;
	                        if (prevCmd === CMD.Q) {
	                            ctlPtx += cpx - pathData[len - 4];
	                            ctlPty += cpy - pathData[len - 3];
	                        }
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        cmd = CMD.Q;
	                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
	                        break;
	                    case 'A':
	                        rx = p[off++];
	                        ry = p[off++];
	                        psi = p[off++];
	                        fa = p[off++];
	                        fs = p[off++];
	
	                        x1 = cpx, y1 = cpy;
	                        cpx = p[off++];
	                        cpy = p[off++];
	                        cmd = CMD.A;
	                        processArc(
	                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
	                        );
	                        break;
	                    case 'a':
	                        rx = p[off++];
	                        ry = p[off++];
	                        psi = p[off++];
	                        fa = p[off++];
	                        fs = p[off++];
	
	                        x1 = cpx, y1 = cpy;
	                        cpx += p[off++];
	                        cpy += p[off++];
	                        cmd = CMD.A;
	                        processArc(
	                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
	                        );
	                        break;
	                }
	            }
	
	            if (c === 'z' || c === 'Z') {
	                cmd = CMD.Z;
	                path.addData(cmd);
	            }
	
	            prevCmd = cmd;
	        }
	
	        path.toStatic();
	
	        return path;
	    }
	
	    // TODO Optimize double memory cost problem
	    function createPathOptions(str, opts) {
	        var pathProxy = createPathProxyFromString(str);
	        var transform;
	        opts = opts || {};
	        opts.buildPath = function (path) {
	            path.setData(pathProxy.data);
	            transform && transformPath(path, transform);
	            // Svg and vml renderer don't have context
	            var ctx = path.getContext();
	            if (ctx) {
	                path.rebuildPath(ctx);
	            }
	        };
	
	        opts.applyTransform = function (m) {
	            if (!transform) {
	                transform = matrix.create();
	            }
	            matrix.mul(transform, m, transform);
	            this.dirty(true);
	        };
	
	        return opts;
	    }
	
	    module.exports = {
	        /**
	         * Create a Path object from path string data
	         * http://www.w3.org/TR/SVG/paths.html#PathData
	         * @param  {Object} opts Other options
	         */
	        createFromString: function (str, opts) {
	            return new Path(createPathOptions(str, opts));
	        },
	
	        /**
	         * Create a Path class from path string data
	         * @param  {string} str
	         * @param  {Object} opts Other options
	         */
	        extendFromString: function (str, opts) {
	            return Path.extend(createPathOptions(str, opts));
	        },
	
	        /**
	         * Merge multiple paths
	         */
	        // TODO Apply transform
	        // TODO stroke dash
	        // TODO Optimize double memory cost problem
	        mergePath: function (pathEls, opts) {
	            var pathList = [];
	            var len = pathEls.length;
	            for (var i = 0; i < len; i++) {
	                var pathEl = pathEls[i];
	                if (pathEl.__dirty) {
	                    pathEl.buildPath(pathEl.path, pathEl.shape, true);
	                }
	                pathList.push(pathEl.path);
	            }
	
	            var pathBundle = new Path(opts);
	            pathBundle.buildPath = function (path) {
	                path.appendPath(pathList);
	                // Svg and vml renderer don't have context
	                var ctx = path.getContext();
	                if (ctx) {
	                    path.rebuildPath(ctx);
	                }
	            };
	
	            return pathBundle;
	        }
	    };


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Path element
	 * @module zrender/graphic/Path
	 */
	
	
	
	    var Displayable = __webpack_require__(7);
	    var zrUtil = __webpack_require__(4);
	    var PathProxy = __webpack_require__(26);
	    var pathContain = __webpack_require__(29);
	
	    var Pattern = __webpack_require__(36);
	    var getCanvasPattern = Pattern.prototype.getCanvasPattern;
	
	    var abs = Math.abs;
	
	    /**
	     * @alias module:zrender/graphic/Path
	     * @extends module:zrender/graphic/Displayable
	     * @constructor
	     * @param {Object} opts
	     */
	    function Path(opts) {
	        Displayable.call(this, opts);
	
	        /**
	         * @type {module:zrender/core/PathProxy}
	         * @readOnly
	         */
	        this.path = new PathProxy();
	    }
	
	    Path.prototype = {
	
	        constructor: Path,
	
	        type: 'path',
	
	        __dirtyPath: true,
	
	        strokeContainThreshold: 5,
	
	        brush: function (ctx, prevEl) {
	            var style = this.style;
	            var path = this.path;
	            var hasStroke = style.hasStroke();
	            var hasFill = style.hasFill();
	            var fill = style.fill;
	            var stroke = style.stroke;
	            var hasFillGradient = hasFill && !!(fill.colorStops);
	            var hasStrokeGradient = hasStroke && !!(stroke.colorStops);
	            var hasFillPattern = hasFill && !!(fill.image);
	            var hasStrokePattern = hasStroke && !!(stroke.image);
	
	            style.bind(ctx, this, prevEl);
	            this.setTransform(ctx);
	
	            if (this.__dirty) {
	                var rect = this.getBoundingRect();
	                // Update gradient because bounding rect may changed
	                if (hasFillGradient) {
	                    this._fillGradient = style.getGradient(ctx, fill, rect);
	                }
	                if (hasStrokeGradient) {
	                    this._strokeGradient = style.getGradient(ctx, stroke, rect);
	                }
	            }
	            // Use the gradient or pattern
	            if (hasFillGradient) {
	                // PENDING If may have affect the state
	                ctx.fillStyle = this._fillGradient;
	            }
	            else if (hasFillPattern) {
	                ctx.fillStyle = getCanvasPattern.call(fill, ctx);
	            }
	            if (hasStrokeGradient) {
	                ctx.strokeStyle = this._strokeGradient;
	            }
	            else if (hasStrokePattern) {
	                ctx.strokeStyle = getCanvasPattern.call(stroke, ctx);
	            }
	
	            var lineDash = style.lineDash;
	            var lineDashOffset = style.lineDashOffset;
	
	            var ctxLineDash = !!ctx.setLineDash;
	
	            // Update path sx, sy
	            var scale = this.getGlobalScale();
	            path.setScale(scale[0], scale[1]);
	
	            // Proxy context
	            // Rebuild path in following 2 cases
	            // 1. Path is dirty
	            // 2. Path needs javascript implemented lineDash stroking.
	            //    In this case, lineDash information will not be saved in PathProxy
	            if (this.__dirtyPath || (
	                lineDash && !ctxLineDash && hasStroke
	            )) {
	                path = this.path.beginPath(ctx);
	
	                // Setting line dash before build path
	                if (lineDash && !ctxLineDash) {
	                    path.setLineDash(lineDash);
	                    path.setLineDashOffset(lineDashOffset);
	                }
	
	                this.buildPath(path, this.shape, false);
	
	                // Clear path dirty flag
	                this.__dirtyPath = false;
	            }
	            else {
	                // Replay path building
	                ctx.beginPath();
	                this.path.rebuildPath(ctx);
	            }
	
	            hasFill && path.fill(ctx);
	
	            if (lineDash && ctxLineDash) {
	                ctx.setLineDash(lineDash);
	                ctx.lineDashOffset = lineDashOffset;
	            }
	
	            hasStroke && path.stroke(ctx);
	
	            if (lineDash && ctxLineDash) {
	                // PENDING
	                // Remove lineDash
	                ctx.setLineDash([]);
	            }
	
	
	            this.restoreTransform(ctx);
	
	            // Draw rect text
	            if (style.text != null) {
	                // var rect = this.getBoundingRect();
	                this.drawRectText(ctx, this.getBoundingRect());
	            }
	        },
	
	        // When bundling path, some shape may decide if use moveTo to begin a new subpath or closePath
	        // Like in circle
	        buildPath: function (ctx, shapeCfg, inBundle) {},
	
	        getBoundingRect: function () {
	            var rect = this._rect;
	            var style = this.style;
	            var needsUpdateRect = !rect;
	            if (needsUpdateRect) {
	                var path = this.path;
	                if (this.__dirtyPath) {
	                    path.beginPath();
	                    this.buildPath(path, this.shape, false);
	                }
	                rect = path.getBoundingRect();
	            }
	            this._rect = rect;
	
	            if (style.hasStroke()) {
	                // Needs update rect with stroke lineWidth when
	                // 1. Element changes scale or lineWidth
	                // 2. Shape is changed
	                var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());
	                if (this.__dirty || needsUpdateRect) {
	                    rectWithStroke.copy(rect);
	                    // FIXME Must after updateTransform
	                    var w = style.lineWidth;
	                    // PENDING, Min line width is needed when line is horizontal or vertical
	                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
	
	                    // Only add extra hover lineWidth when there are no fill
	                    if (!style.hasFill()) {
	                        w = Math.max(w, this.strokeContainThreshold || 4);
	                    }
	                    // Consider line width
	                    // Line scale can't be 0;
	                    if (lineScale > 1e-10) {
	                        rectWithStroke.width += w / lineScale;
	                        rectWithStroke.height += w / lineScale;
	                        rectWithStroke.x -= w / lineScale / 2;
	                        rectWithStroke.y -= w / lineScale / 2;
	                    }
	                }
	
	                // Return rect with stroke
	                return rectWithStroke;
	            }
	
	            return rect;
	        },
	
	        contain: function (x, y) {
	            var localPos = this.transformCoordToLocal(x, y);
	            var rect = this.getBoundingRect();
	            var style = this.style;
	            x = localPos[0];
	            y = localPos[1];
	
	            if (rect.contain(x, y)) {
	                var pathData = this.path.data;
	                if (style.hasStroke()) {
	                    var lineWidth = style.lineWidth;
	                    var lineScale = style.strokeNoScale ? this.getLineScale() : 1;
	                    // Line scale can't be 0;
	                    if (lineScale > 1e-10) {
	                        // Only add extra hover lineWidth when there are no fill
	                        if (!style.hasFill()) {
	                            lineWidth = Math.max(lineWidth, this.strokeContainThreshold);
	                        }
	                        if (pathContain.containStroke(
	                            pathData, lineWidth / lineScale, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                }
	                if (style.hasFill()) {
	                    return pathContain.contain(pathData, x, y);
	                }
	            }
	            return false;
	        },
	
	        /**
	         * @param  {boolean} dirtyPath
	         */
	        dirty: function (dirtyPath) {
	            if (dirtyPath == null) {
	                dirtyPath = true;
	            }
	            // Only mark dirty, not mark clean
	            if (dirtyPath) {
	                this.__dirtyPath = dirtyPath;
	                this._rect = null;
	            }
	
	            this.__dirty = true;
	
	            this.__zr && this.__zr.refresh();
	
	            // Used as a clipping path
	            if (this.__clipTarget) {
	                this.__clipTarget.dirty();
	            }
	        },
	
	        /**
	         * Alias for animate('shape')
	         * @param {boolean} loop
	         */
	        animateShape: function (loop) {
	            return this.animate('shape', loop);
	        },
	
	        // Overwrite attrKV
	        attrKV: function (key, value) {
	            // FIXME
	            if (key === 'shape') {
	                this.setShape(value);
	                this.__dirtyPath = true;
	                this._rect = null;
	            }
	            else {
	                Displayable.prototype.attrKV.call(this, key, value);
	            }
	        },
	
	        /**
	         * @param {Object|string} key
	         * @param {*} value
	         */
	        setShape: function (key, value) {
	            var shape = this.shape;
	            // Path from string may not have shape
	            if (shape) {
	                if (zrUtil.isObject(key)) {
	                    for (var name in key) {
	                        if (key.hasOwnProperty(name)) {
	                            shape[name] = key[name];
	                        }
	                    }
	                }
	                else {
	                    shape[key] = value;
	                }
	                this.dirty(true);
	            }
	            return this;
	        },
	
	        getLineScale: function () {
	            var m = this.transform;
	            // Get the line scale.
	            // Determinant of `m` means how much the area is enlarged by the
	            // transformation. So its square root can be used as a scale factor
	            // for width.
	            return m && abs(m[0] - 1) > 1e-10 && abs(m[3] - 1) > 1e-10
	                ? Math.sqrt(abs(m[0] * m[3] - m[2] * m[1]))
	                : 1;
	        }
	    };
	
	    /**
	     * 扩展一个 Path element, 比如星形，圆等。
	     * Extend a path element
	     * @param {Object} props
	     * @param {string} props.type Path type
	     * @param {Function} props.init Initialize
	     * @param {Function} props.buildPath Overwrite buildPath method
	     * @param {Object} [props.style] Extended default style config
	     * @param {Object} [props.shape] Extended default shape config
	     */
	    Path.extend = function (defaults) {
	        var Sub = function (opts) {
	            Path.call(this, opts);
	
	            if (defaults.style) {
	                // Extend default style
	                this.style.extendFrom(defaults.style, false);
	            }
	
	            // Extend default shape
	            var defaultShape = defaults.shape;
	            if (defaultShape) {
	                this.shape = this.shape || {};
	                var thisShape = this.shape;
	                for (var name in defaultShape) {
	                    if (
	                        ! thisShape.hasOwnProperty(name)
	                        && defaultShape.hasOwnProperty(name)
	                    ) {
	                        thisShape[name] = defaultShape[name];
	                    }
	                }
	            }
	
	            defaults.init && defaults.init.call(this, opts);
	        };
	
	        zrUtil.inherits(Sub, Path);
	
	        // FIXME 不能 extend position, rotation 等引用对象
	        for (var name in defaults) {
	            // Extending prototype values and methods
	            if (name !== 'style' && name !== 'shape') {
	                Sub.prototype[name] = defaults[name];
	            }
	        }
	
	        return Sub;
	    };
	
	    zrUtil.inherits(Path, Displayable);
	
	    module.exports = Path;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 可绘制的图形基类
	 * Base class of all displayable graphic objects
	 * @module zrender/graphic/Displayable
	 */
	
	
	
	    var zrUtil = __webpack_require__(4);
	
	    var Style = __webpack_require__(8);
	
	    var Element = __webpack_require__(9);
	    var RectText = __webpack_require__(23);
	    // var Stateful = require('./mixin/Stateful');
	
	    /**
	     * @alias module:zrender/graphic/Displayable
	     * @extends module:zrender/Element
	     * @extends module:zrender/graphic/mixin/RectText
	     */
	    function Displayable(opts) {
	
	        opts = opts || {};
	
	        Element.call(this, opts);
	
	        // Extend properties
	        for (var name in opts) {
	            if (
	                opts.hasOwnProperty(name) &&
	                name !== 'style'
	            ) {
	                this[name] = opts[name];
	            }
	        }
	
	        /**
	         * @type {module:zrender/graphic/Style}
	         */
	        this.style = new Style(opts.style);
	
	        this._rect = null;
	        // Shapes for cascade clipping.
	        this.__clipPaths = [];
	
	        // FIXME Stateful must be mixined after style is setted
	        // Stateful.call(this, opts);
	    }
	
	    Displayable.prototype = {
	
	        constructor: Displayable,
	
	        type: 'displayable',
	
	        /**
	         * Displayable 是否为脏，Painter 中会根据该标记判断是否需要是否需要重新绘制
	         * Dirty flag. From which painter will determine if this displayable object needs brush
	         * @name module:zrender/graphic/Displayable#__dirty
	         * @type {boolean}
	         */
	        __dirty: true,
	
	        /**
	         * 图形是否可见，为true时不绘制图形，但是仍能触发鼠标事件
	         * If ignore drawing of the displayable object. Mouse event will still be triggered
	         * @name module:/zrender/graphic/Displayable#invisible
	         * @type {boolean}
	         * @default false
	         */
	        invisible: false,
	
	        /**
	         * @name module:/zrender/graphic/Displayable#z
	         * @type {number}
	         * @default 0
	         */
	        z: 0,
	
	        /**
	         * @name module:/zrender/graphic/Displayable#z
	         * @type {number}
	         * @default 0
	         */
	        z2: 0,
	
	        /**
	         * z层level，决定绘画在哪层canvas中
	         * @name module:/zrender/graphic/Displayable#zlevel
	         * @type {number}
	         * @default 0
	         */
	        zlevel: 0,
	
	        /**
	         * 是否可拖拽
	         * @name module:/zrender/graphic/Displayable#draggable
	         * @type {boolean}
	         * @default false
	         */
	        draggable: false,
	
	        /**
	         * 是否正在拖拽
	         * @name module:/zrender/graphic/Displayable#draggable
	         * @type {boolean}
	         * @default false
	         */
	        dragging: false,
	
	        /**
	         * 是否相应鼠标事件
	         * @name module:/zrender/graphic/Displayable#silent
	         * @type {boolean}
	         * @default false
	         */
	        silent: false,
	
	        /**
	         * If enable culling
	         * @type {boolean}
	         * @default false
	         */
	        culling: false,
	
	        /**
	         * Mouse cursor when hovered
	         * @name module:/zrender/graphic/Displayable#cursor
	         * @type {string}
	         */
	        cursor: 'pointer',
	
	        /**
	         * If hover area is bounding rect
	         * @name module:/zrender/graphic/Displayable#rectHover
	         * @type {string}
	         */
	        rectHover: false,
	
	        /**
	         * Render the element progressively when the value >= 0,
	         * usefull for large data.
	         * @type {number}
	         */
	        progressive: -1,
	
	        beforeBrush: function (ctx) {},
	
	        afterBrush: function (ctx) {},
	
	        /**
	         * 图形绘制方法
	         * @param {Canvas2DRenderingContext} ctx
	         */
	        // Interface
	        brush: function (ctx, prevEl) {},
	
	        /**
	         * 获取最小包围盒
	         * @return {module:zrender/core/BoundingRect}
	         */
	        // Interface
	        getBoundingRect: function () {},
	
	        /**
	         * 判断坐标 x, y 是否在图形上
	         * If displayable element contain coord x, y
	         * @param  {number} x
	         * @param  {number} y
	         * @return {boolean}
	         */
	        contain: function (x, y) {
	            return this.rectContain(x, y);
	        },
	
	        /**
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {
	            cb.call(context, this);
	        },
	
	        /**
	         * 判断坐标 x, y 是否在图形的包围盒上
	         * If bounding rect of element contain coord x, y
	         * @param  {number} x
	         * @param  {number} y
	         * @return {boolean}
	         */
	        rectContain: function (x, y) {
	            var coord = this.transformCoordToLocal(x, y);
	            var rect = this.getBoundingRect();
	            return rect.contain(coord[0], coord[1]);
	        },
	
	        /**
	         * 标记图形元素为脏，并且在下一帧重绘
	         * Mark displayable element dirty and refresh next frame
	         */
	        dirty: function () {
	            this.__dirty = true;
	
	            this._rect = null;
	
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * 图形是否会触发事件
	         * If displayable object binded any event
	         * @return {boolean}
	         */
	        // TODO, 通过 bind 绑定的事件
	        // isSilent: function () {
	        //     return !(
	        //         this.hoverable || this.draggable
	        //         || this.onmousemove || this.onmouseover || this.onmouseout
	        //         || this.onmousedown || this.onmouseup || this.onclick
	        //         || this.ondragenter || this.ondragover || this.ondragleave
	        //         || this.ondrop
	        //     );
	        // },
	        /**
	         * Alias for animate('style')
	         * @param {boolean} loop
	         */
	        animateStyle: function (loop) {
	            return this.animate('style', loop);
	        },
	
	        attrKV: function (key, value) {
	            if (key !== 'style') {
	                Element.prototype.attrKV.call(this, key, value);
	            }
	            else {
	                this.style.set(value);
	            }
	        },
	
	        /**
	         * @param {Object|string} key
	         * @param {*} value
	         */
	        setStyle: function (key, value) {
	            this.style.set(key, value);
	            this.dirty(false);
	            return this;
	        },
	
	        /**
	         * Use given style object
	         * @param  {Object} obj
	         */
	        useStyle: function (obj) {
	            this.style = new Style(obj);
	            this.dirty(false);
	            return this;
	        }
	    };
	
	    zrUtil.inherits(Displayable, Element);
	
	    zrUtil.mixin(Displayable, RectText);
	    // zrUtil.mixin(Displayable, Stateful);
	
	    module.exports = Displayable;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * @module zrender/graphic/Style
	 */
	
	
	    var STYLE_COMMON_PROPS = [
	        ['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'],
	        ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
	    ];
	
	    // var SHADOW_PROPS = STYLE_COMMON_PROPS.slice(0, 4);
	    // var LINE_PROPS = STYLE_COMMON_PROPS.slice(4);
	
	    var Style = function (opts) {
	        this.extendFrom(opts);
	    };
	
	    function createLinearGradient(ctx, obj, rect) {
	        // var size =
	        var x = obj.x;
	        var x2 = obj.x2;
	        var y = obj.y;
	        var y2 = obj.y2;
	
	        if (!obj.global) {
	            x = x * rect.width + rect.x;
	            x2 = x2 * rect.width + rect.x;
	            y = y * rect.height + rect.y;
	            y2 = y2 * rect.height + rect.y;
	        }
	
	        var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);
	
	        return canvasGradient;
	    }
	
	    function createRadialGradient(ctx, obj, rect) {
	        var width = rect.width;
	        var height = rect.height;
	        var min = Math.min(width, height);
	
	        var x = obj.x;
	        var y = obj.y;
	        var r = obj.r;
	        if (!obj.global) {
	            x = x * width + rect.x;
	            y = y * height + rect.y;
	            r = r * min;
	        }
	
	        var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
	
	        return canvasGradient;
	    }
	
	
	    Style.prototype = {
	
	        constructor: Style,
	
	        /**
	         * @type {string}
	         */
	        fill: '#000000',
	
	        /**
	         * @type {string}
	         */
	        stroke: null,
	
	        /**
	         * @type {number}
	         */
	        opacity: 1,
	
	        /**
	         * @type {Array.<number>}
	         */
	        lineDash: null,
	
	        /**
	         * @type {number}
	         */
	        lineDashOffset: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowBlur: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowOffsetX: 0,
	
	        /**
	         * @type {number}
	         */
	        shadowOffsetY: 0,
	
	        /**
	         * @type {number}
	         */
	        lineWidth: 1,
	
	        /**
	         * If stroke ignore scale
	         * @type {Boolean}
	         */
	        strokeNoScale: false,
	
	        // Bounding rect text configuration
	        // Not affected by element transform
	        /**
	         * @type {string}
	         */
	        text: null,
	
	        /**
	         * @type {string}
	         */
	        textFill: '#000',
	
	        /**
	         * @type {string}
	         */
	        textStroke: null,
	
	        /**
	         * 'inside', 'left', 'right', 'top', 'bottom'
	         * [x, y]
	         * @type {string|Array.<number>}
	         * @default 'inside'
	         */
	        textPosition: 'inside',
	
	        /**
	         * [x, y]
	         * @type {Array.<number>}
	         */
	        textOffset: null,
	
	        /**
	         * @type {string}
	         */
	        textBaseline: null,
	
	        /**
	         * @type {string}
	         */
	        textAlign: null,
	
	        /**
	         * @type {string}
	         */
	        textVerticalAlign: null,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textDistance: 5,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowBlur: 0,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowOffsetX: 0,
	
	        /**
	         * Only useful in Path and Image element
	         * @type {number}
	         */
	        textShadowOffsetY: 0,
	
	        /**
	         * If transform text
	         * Only useful in Path and Image element
	         * @type {boolean}
	         */
	        textTransform: false,
	
	        /**
	         * Text rotate around position of Path or Image
	         * Only useful in Path and Image element and textTransform is false.
	         */
	        textRotation: 0,
	
	        /**
	         * @type {string}
	         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
	         */
	        blend: null,
	
	        /**
	         * @param {CanvasRenderingContext2D} ctx
	         */
	        bind: function (ctx, el, prevEl) {
	            var style = this;
	            var prevStyle = prevEl && prevEl.style;
	            var firstDraw = !prevStyle;
	
	            for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
	                var prop = STYLE_COMMON_PROPS[i];
	                var styleName = prop[0];
	
	                if (firstDraw || style[styleName] !== prevStyle[styleName]) {
	                    // FIXME Invalid property value will cause style leak from previous element.
	                    ctx[styleName] = style[styleName] || prop[1];
	                }
	            }
	
	            if ((firstDraw || style.fill !== prevStyle.fill)) {
	                ctx.fillStyle = style.fill;
	            }
	            if ((firstDraw || style.stroke !== prevStyle.stroke)) {
	                ctx.strokeStyle = style.stroke;
	            }
	            if ((firstDraw || style.opacity !== prevStyle.opacity)) {
	                ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
	            }
	
	            if ((firstDraw || style.blend !== prevStyle.blend)) {
	                ctx.globalCompositeOperation = style.blend || 'source-over';
	            }
	            if (this.hasStroke()) {
	                var lineWidth = style.lineWidth;
	                ctx.lineWidth = lineWidth / (
	                    (this.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1
	                );
	            }
	        },
	
	        hasFill: function () {
	            var fill = this.fill;
	            return fill != null && fill !== 'none';
	        },
	
	        hasStroke: function () {
	            var stroke = this.stroke;
	            return stroke != null && stroke !== 'none' && this.lineWidth > 0;
	        },
	
	        /**
	         * Extend from other style
	         * @param {zrender/graphic/Style} otherStyle
	         * @param {boolean} overwrite
	         */
	        extendFrom: function (otherStyle, overwrite) {
	            if (otherStyle) {
	                var target = this;
	                for (var name in otherStyle) {
	                    if (otherStyle.hasOwnProperty(name)
	                        && (overwrite || ! target.hasOwnProperty(name))
	                    ) {
	                        target[name] = otherStyle[name];
	                    }
	                }
	            }
	        },
	
	        /**
	         * Batch setting style with a given object
	         * @param {Object|string} obj
	         * @param {*} [obj]
	         */
	        set: function (obj, value) {
	            if (typeof obj === 'string') {
	                this[obj] = value;
	            }
	            else {
	                this.extendFrom(obj, true);
	            }
	        },
	
	        /**
	         * Clone
	         * @return {zrender/graphic/Style} [description]
	         */
	        clone: function () {
	            var newStyle = new this.constructor();
	            newStyle.extendFrom(this, true);
	            return newStyle;
	        },
	
	        getGradient: function (ctx, obj, rect) {
	            var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
	            var canvasGradient = method(ctx, obj, rect);
	            var colorStops = obj.colorStops;
	            for (var i = 0; i < colorStops.length; i++) {
	                canvasGradient.addColorStop(
	                    colorStops[i].offset, colorStops[i].color
	                );
	            }
	            return canvasGradient;
	        }
	    };
	
	    var styleProto = Style.prototype;
	    for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
	        var prop = STYLE_COMMON_PROPS[i];
	        if (!(prop[0] in styleProto)) {
	            styleProto[prop[0]] = prop[1];
	        }
	    }
	
	    // Provide for others
	    Style.getGradient = styleProto.getGradient;
	
	    module.exports = Style;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module zrender/Element
	 */
	
	
	    var guid = __webpack_require__(10);
	    var Eventful = __webpack_require__(11);
	    var Transformable = __webpack_require__(12);
	    var Animatable = __webpack_require__(15);
	    var zrUtil = __webpack_require__(4);
	
	    /**
	     * @alias module:zrender/Element
	     * @constructor
	     * @extends {module:zrender/mixin/Animatable}
	     * @extends {module:zrender/mixin/Transformable}
	     * @extends {module:zrender/mixin/Eventful}
	     */
	    var Element = function (opts) {
	
	        Transformable.call(this, opts);
	        Eventful.call(this, opts);
	        Animatable.call(this, opts);
	
	        /**
	         * 画布元素ID
	         * @type {string}
	         */
	        this.id = opts.id || guid();
	    };
	
	    Element.prototype = {
	
	        /**
	         * 元素类型
	         * Element type
	         * @type {string}
	         */
	        type: 'element',
	
	        /**
	         * 元素名字
	         * Element name
	         * @type {string}
	         */
	        name: '',
	
	        /**
	         * ZRender 实例对象，会在 element 添加到 zrender 实例中后自动赋值
	         * ZRender instance will be assigned when element is associated with zrender
	         * @name module:/zrender/Element#__zr
	         * @type {module:zrender/ZRender}
	         */
	        __zr: null,
	
	        /**
	         * 图形是否忽略，为true时忽略图形的绘制以及事件触发
	         * If ignore drawing and events of the element object
	         * @name module:/zrender/Element#ignore
	         * @type {boolean}
	         * @default false
	         */
	        ignore: false,
	
	        /**
	         * 用于裁剪的路径(shape)，所有 Group 内的路径在绘制时都会被这个路径裁剪
	         * 该路径会继承被裁减对象的变换
	         * @type {module:zrender/graphic/Path}
	         * @see http://www.w3.org/TR/2dcontext/#clipping-region
	         * @readOnly
	         */
	        clipPath: null,
	
	        /**
	         * Drift element
	         * @param  {number} dx dx on the global space
	         * @param  {number} dy dy on the global space
	         */
	        drift: function (dx, dy) {
	            switch (this.draggable) {
	                case 'horizontal':
	                    dy = 0;
	                    break;
	                case 'vertical':
	                    dx = 0;
	                    break;
	            }
	
	            var m = this.transform;
	            if (!m) {
	                m = this.transform = [1, 0, 0, 1, 0, 0];
	            }
	            m[4] += dx;
	            m[5] += dy;
	
	            this.decomposeTransform();
	            this.dirty(false);
	        },
	
	        /**
	         * Hook before update
	         */
	        beforeUpdate: function () {},
	        /**
	         * Hook after update
	         */
	        afterUpdate: function () {},
	        /**
	         * Update each frame
	         */
	        update: function () {
	            this.updateTransform();
	        },
	
	        /**
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {},
	
	        /**
	         * @protected
	         */
	        attrKV: function (key, value) {
	            if (key === 'position' || key === 'scale' || key === 'origin') {
	                // Copy the array
	                if (value) {
	                    var target = this[key];
	                    if (!target) {
	                        target = this[key] = [];
	                    }
	                    target[0] = value[0];
	                    target[1] = value[1];
	                }
	            }
	            else {
	                this[key] = value;
	            }
	        },
	
	        /**
	         * Hide the element
	         */
	        hide: function () {
	            this.ignore = true;
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * Show the element
	         */
	        show: function () {
	            this.ignore = false;
	            this.__zr && this.__zr.refresh();
	        },
	
	        /**
	         * @param {string|Object} key
	         * @param {*} value
	         */
	        attr: function (key, value) {
	            if (typeof key === 'string') {
	                this.attrKV(key, value);
	            }
	            else if (zrUtil.isObject(key)) {
	                for (var name in key) {
	                    if (key.hasOwnProperty(name)) {
	                        this.attrKV(name, key[name]);
	                    }
	                }
	            }
	
	            this.dirty(false);
	
	            return this;
	        },
	
	        /**
	         * @param {module:zrender/graphic/Path} clipPath
	         */
	        setClipPath: function (clipPath) {
	            var zr = this.__zr;
	            if (zr) {
	                clipPath.addSelfToZr(zr);
	            }
	
	            // Remove previous clip path
	            if (this.clipPath && this.clipPath !== clipPath) {
	                this.removeClipPath();
	            }
	
	            this.clipPath = clipPath;
	            clipPath.__zr = zr;
	            clipPath.__clipTarget = this;
	
	            this.dirty(false);
	        },
	
	        /**
	         */
	        removeClipPath: function () {
	            var clipPath = this.clipPath;
	            if (clipPath) {
	                if (clipPath.__zr) {
	                    clipPath.removeSelfFromZr(clipPath.__zr);
	                }
	
	                clipPath.__zr = null;
	                clipPath.__clipTarget = null;
	                this.clipPath = null;
	
	                this.dirty(false);
	            }
	        },
	
	        /**
	         * Add self from zrender instance.
	         * Not recursively because it will be invoked when element added to storage.
	         * @param {module:zrender/ZRender} zr
	         */
	        addSelfToZr: function (zr) {
	            this.__zr = zr;
	            // 添加动画
	            var animators = this.animators;
	            if (animators) {
	                for (var i = 0; i < animators.length; i++) {
	                    zr.animation.addAnimator(animators[i]);
	                }
	            }
	
	            if (this.clipPath) {
	                this.clipPath.addSelfToZr(zr);
	            }
	        },
	
	        /**
	         * Remove self from zrender instance.
	         * Not recursively because it will be invoked when element added to storage.
	         * @param {module:zrender/ZRender} zr
	         */
	        removeSelfFromZr: function (zr) {
	            this.__zr = null;
	            // 移除动画
	            var animators = this.animators;
	            if (animators) {
	                for (var i = 0; i < animators.length; i++) {
	                    zr.animation.removeAnimator(animators[i]);
	                }
	            }
	
	            if (this.clipPath) {
	                this.clipPath.removeSelfFromZr(zr);
	            }
	        }
	    };
	
	    zrUtil.mixin(Element, Animatable);
	    zrUtil.mixin(Element, Transformable);
	    zrUtil.mixin(Element, Eventful);
	
	    module.exports = Element;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * zrender: 生成唯一id
	 *
	 * @author errorrik (errorrik@gmail.com)
	 */
	
	
	    var idStart = 0x0907;
	
	    module.exports = function () {
	        return idStart++;
	    };
	


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * 事件扩展
	 * @module zrender/mixin/Eventful
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 */
	
	
	    var arrySlice = Array.prototype.slice;
	
	    /**
	     * 事件分发器
	     * @alias module:zrender/mixin/Eventful
	     * @constructor
	     */
	    var Eventful = function () {
	        this._$handlers = {};
	    };
	
	    Eventful.prototype = {
	
	        constructor: Eventful,
	
	        /**
	         * 单次触发绑定，trigger后销毁
	         *
	         * @param {string} event 事件名
	         * @param {Function} handler 响应函数
	         * @param {Object} context
	         */
	        one: function (event, handler, context) {
	            var _h = this._$handlers;
	
	            if (!handler || !event) {
	                return this;
	            }
	
	            if (!_h[event]) {
	                _h[event] = [];
	            }
	
	            for (var i = 0; i < _h[event].length; i++) {
	                if (_h[event][i].h === handler) {
	                    return this;
	                }
	            }
	
	            _h[event].push({
	                h: handler,
	                one: true,
	                ctx: context || this
	            });
	
	            return this;
	        },
	
	        /**
	         * 绑定事件
	         * @param {string} event 事件名
	         * @param {Function} handler 事件处理函数
	         * @param {Object} [context]
	         */
	        on: function (event, handler, context) {
	            var _h = this._$handlers;
	
	            if (!handler || !event) {
	                return this;
	            }
	
	            if (!_h[event]) {
	                _h[event] = [];
	            }
	
	            for (var i = 0; i < _h[event].length; i++) {
	                if (_h[event][i].h === handler) {
	                    return this;
	                }
	            }
	
	            _h[event].push({
	                h: handler,
	                one: false,
	                ctx: context || this
	            });
	
	            return this;
	        },
	
	        /**
	         * 是否绑定了事件
	         * @param  {string}  event
	         * @return {boolean}
	         */
	        isSilent: function (event) {
	            var _h = this._$handlers;
	            return _h[event] && _h[event].length;
	        },
	
	        /**
	         * 解绑事件
	         * @param {string} event 事件名
	         * @param {Function} [handler] 事件处理函数
	         */
	        off: function (event, handler) {
	            var _h = this._$handlers;
	
	            if (!event) {
	                this._$handlers = {};
	                return this;
	            }
	
	            if (handler) {
	                if (_h[event]) {
	                    var newList = [];
	                    for (var i = 0, l = _h[event].length; i < l; i++) {
	                        if (_h[event][i]['h'] != handler) {
	                            newList.push(_h[event][i]);
	                        }
	                    }
	                    _h[event] = newList;
	                }
	
	                if (_h[event] && _h[event].length === 0) {
	                    delete _h[event];
	                }
	            }
	            else {
	                delete _h[event];
	            }
	
	            return this;
	        },
	
	        /**
	         * 事件分发
	         *
	         * @param {string} type 事件类型
	         */
	        trigger: function (type) {
	            if (this._$handlers[type]) {
	                var args = arguments;
	                var argLen = args.length;
	
	                if (argLen > 3) {
	                    args = arrySlice.call(args, 1);
	                }
	
	                var _h = this._$handlers[type];
	                var len = _h.length;
	                for (var i = 0; i < len;) {
	                    // Optimize advise from backbone
	                    switch (argLen) {
	                        case 1:
	                            _h[i]['h'].call(_h[i]['ctx']);
	                            break;
	                        case 2:
	                            _h[i]['h'].call(_h[i]['ctx'], args[1]);
	                            break;
	                        case 3:
	                            _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);
	                            break;
	                        default:
	                            // have more than 2 given arguments
	                            _h[i]['h'].apply(_h[i]['ctx'], args);
	                            break;
	                    }
	
	                    if (_h[i]['one']) {
	                        _h.splice(i, 1);
	                        len--;
	                    }
	                    else {
	                        i++;
	                    }
	                }
	            }
	
	            return this;
	        },
	
	        /**
	         * 带有context的事件分发, 最后一个参数是事件回调的context
	         * @param {string} type 事件类型
	         */
	        triggerWithContext: function (type) {
	            if (this._$handlers[type]) {
	                var args = arguments;
	                var argLen = args.length;
	
	                if (argLen > 4) {
	                    args = arrySlice.call(args, 1, args.length - 1);
	                }
	                var ctx = args[args.length - 1];
	
	                var _h = this._$handlers[type];
	                var len = _h.length;
	                for (var i = 0; i < len;) {
	                    // Optimize advise from backbone
	                    switch (argLen) {
	                        case 1:
	                            _h[i]['h'].call(ctx);
	                            break;
	                        case 2:
	                            _h[i]['h'].call(ctx, args[1]);
	                            break;
	                        case 3:
	                            _h[i]['h'].call(ctx, args[1], args[2]);
	                            break;
	                        default:
	                            // have more than 2 given arguments
	                            _h[i]['h'].apply(ctx, args);
	                            break;
	                    }
	
	                    if (_h[i]['one']) {
	                        _h.splice(i, 1);
	                        len--;
	                    }
	                    else {
	                        i++;
	                    }
	                }
	            }
	
	            return this;
	        }
	    };
	
	    // 对象可以通过 onxxxx 绑定事件
	    /**
	     * @event module:zrender/mixin/Eventful#onclick
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseout
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousemove
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousewheel
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousedown
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseup
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondrag
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragstart
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragend
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragenter
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragleave
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondrop
	     * @type {Function}
	     * @default null
	     */
	
	    module.exports = Eventful;
	


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 提供变换扩展
	 * @module zrender/mixin/Transformable
	 * @author pissang (https://www.github.com/pissang)
	 */
	
	
	    var matrix = __webpack_require__(13);
	    var vector = __webpack_require__(14);
	    var mIdentity = matrix.identity;
	
	    var EPSILON = 5e-5;
	
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }
	
	    /**
	     * @alias module:zrender/mixin/Transformable
	     * @constructor
	     */
	    var Transformable = function (opts) {
	        opts = opts || {};
	        // If there are no given position, rotation, scale
	        if (!opts.position) {
	            /**
	             * 平移
	             * @type {Array.<number>}
	             * @default [0, 0]
	             */
	            this.position = [0, 0];
	        }
	        if (opts.rotation == null) {
	            /**
	             * 旋转
	             * @type {Array.<number>}
	             * @default 0
	             */
	            this.rotation = 0;
	        }
	        if (!opts.scale) {
	            /**
	             * 缩放
	             * @type {Array.<number>}
	             * @default [1, 1]
	             */
	            this.scale = [1, 1];
	        }
	        /**
	         * 旋转和缩放的原点
	         * @type {Array.<number>}
	         * @default null
	         */
	        this.origin = this.origin || null;
	    };
	
	    var transformableProto = Transformable.prototype;
	    transformableProto.transform = null;
	
	    /**
	     * 判断是否需要有坐标变换
	     * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
	     */
	    transformableProto.needLocalTransform = function () {
	        return isNotAroundZero(this.rotation)
	            || isNotAroundZero(this.position[0])
	            || isNotAroundZero(this.position[1])
	            || isNotAroundZero(this.scale[0] - 1)
	            || isNotAroundZero(this.scale[1] - 1);
	    };
	
	    transformableProto.updateTransform = function () {
	        var parent = this.parent;
	        var parentHasTransform = parent && parent.transform;
	        var needLocalTransform = this.needLocalTransform();
	
	        var m = this.transform;
	        if (!(needLocalTransform || parentHasTransform)) {
	            m && mIdentity(m);
	            return;
	        }
	
	        m = m || matrix.create();
	
	        if (needLocalTransform) {
	            this.getLocalTransform(m);
	        }
	        else {
	            mIdentity(m);
	        }
	
	        // 应用父节点变换
	        if (parentHasTransform) {
	            if (needLocalTransform) {
	                matrix.mul(m, parent.transform, m);
	            }
	            else {
	                matrix.copy(m, parent.transform);
	            }
	        }
	        // 保存这个变换矩阵
	        this.transform = m;
	
	        this.invTransform = this.invTransform || matrix.create();
	        matrix.invert(this.invTransform, m);
	    };
	
	    transformableProto.getLocalTransform = function (m) {
	        m = m || [];
	        mIdentity(m);
	
	        var origin = this.origin;
	
	        var scale = this.scale;
	        var rotation = this.rotation;
	        var position = this.position;
	        if (origin) {
	            // Translate to origin
	            m[4] -= origin[0];
	            m[5] -= origin[1];
	        }
	        matrix.scale(m, m, scale);
	        if (rotation) {
	            matrix.rotate(m, m, rotation);
	        }
	        if (origin) {
	            // Translate back from origin
	            m[4] += origin[0];
	            m[5] += origin[1];
	        }
	
	        m[4] += position[0];
	        m[5] += position[1];
	
	        return m;
	    };
	    /**
	     * 将自己的transform应用到context上
	     * @param {Context2D} ctx
	     */
	    transformableProto.setTransform = function (ctx) {
	        var m = this.transform;
	        var dpr = ctx.dpr || 1;
	        if (m) {
	            ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
	        }
	        else {
	            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	        }
	    };
	
	    transformableProto.restoreTransform = function (ctx) {
	        var m = this.transform;
	        var dpr = ctx.dpr || 1;
	        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	    }
	
	    var tmpTransform = [];
	
	    /**
	     * 分解`transform`矩阵到`position`, `rotation`, `scale`
	     */
	    transformableProto.decomposeTransform = function () {
	        if (!this.transform) {
	            return;
	        }
	        var parent = this.parent;
	        var m = this.transform;
	        if (parent && parent.transform) {
	            // Get local transform and decompose them to position, scale, rotation
	            matrix.mul(tmpTransform, parent.invTransform, m);
	            m = tmpTransform;
	        }
	        var sx = m[0] * m[0] + m[1] * m[1];
	        var sy = m[2] * m[2] + m[3] * m[3];
	        var position = this.position;
	        var scale = this.scale;
	        if (isNotAroundZero(sx - 1)) {
	            sx = Math.sqrt(sx);
	        }
	        if (isNotAroundZero(sy - 1)) {
	            sy = Math.sqrt(sy);
	        }
	        if (m[0] < 0) {
	            sx = -sx;
	        }
	        if (m[3] < 0) {
	            sy = -sy;
	        }
	        position[0] = m[4];
	        position[1] = m[5];
	        scale[0] = sx;
	        scale[1] = sy;
	        this.rotation = Math.atan2(-m[1] / sy, m[0] / sx);
	    };
	
	    /**
	     * Get global scale
	     * @return {Array.<number>}
	     */
	    transformableProto.getGlobalScale = function () {
	        var m = this.transform;
	        if (!m) {
	            return [1, 1];
	        }
	        var sx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
	        var sy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
	        if (m[0] < 0) {
	            sx = -sx;
	        }
	        if (m[3] < 0) {
	            sy = -sy;
	        }
	        return [sx, sy];
	    };
	    /**
	     * 变换坐标位置到 shape 的局部坐标空间
	     * @method
	     * @param {number} x
	     * @param {number} y
	     * @return {Array.<number>}
	     */
	    transformableProto.transformCoordToLocal = function (x, y) {
	        var v2 = [x, y];
	        var invTransform = this.invTransform;
	        if (invTransform) {
	            vector.applyTransform(v2, v2, invTransform);
	        }
	        return v2;
	    };
	
	    /**
	     * 变换局部坐标位置到全局坐标空间
	     * @method
	     * @param {number} x
	     * @param {number} y
	     * @return {Array.<number>}
	     */
	    transformableProto.transformCoordToGlobal = function (x, y) {
	        var v2 = [x, y];
	        var transform = this.transform;
	        if (transform) {
	            vector.applyTransform(v2, v2, transform);
	        }
	        return v2;
	    };
	
	    module.exports = Transformable;
	


/***/ },
/* 13 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;
	    /**
	     * 3x2矩阵操作类
	     * @exports zrender/tool/matrix
	     */
	    var matrix = {
	        /**
	         * 创建一个单位矩阵
	         * @return {Float32Array|Array.<number>}
	         */
	        create : function() {
	            var out = new ArrayCtor(6);
	            matrix.identity(out);
	
	            return out;
	        },
	        /**
	         * 设置矩阵为单位矩阵
	         * @param {Float32Array|Array.<number>} out
	         */
	        identity : function(out) {
	            out[0] = 1;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            out[4] = 0;
	            out[5] = 0;
	            return out;
	        },
	        /**
	         * 复制矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m
	         */
	        copy: function(out, m) {
	            out[0] = m[0];
	            out[1] = m[1];
	            out[2] = m[2];
	            out[3] = m[3];
	            out[4] = m[4];
	            out[5] = m[5];
	            return out;
	        },
	        /**
	         * 矩阵相乘
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m1
	         * @param {Float32Array|Array.<number>} m2
	         */
	        mul : function (out, m1, m2) {
	            // Consider matrix.mul(m, m2, m);
	            // where out is the same as m2.
	            // So use temp variable to escape error.
	            var out0 = m1[0] * m2[0] + m1[2] * m2[1];
	            var out1 = m1[1] * m2[0] + m1[3] * m2[1];
	            var out2 = m1[0] * m2[2] + m1[2] * m2[3];
	            var out3 = m1[1] * m2[2] + m1[3] * m2[3];
	            var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	            var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	            out[0] = out0;
	            out[1] = out1;
	            out[2] = out2;
	            out[3] = out3;
	            out[4] = out4;
	            out[5] = out5;
	            return out;
	        },
	        /**
	         * 平移变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        translate : function(out, a, v) {
	            out[0] = a[0];
	            out[1] = a[1];
	            out[2] = a[2];
	            out[3] = a[3];
	            out[4] = a[4] + v[0];
	            out[5] = a[5] + v[1];
	            return out;
	        },
	        /**
	         * 旋转变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {number} rad
	         */
	        rotate : function(out, a, rad) {
	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];
	            var st = Math.sin(rad);
	            var ct = Math.cos(rad);
	
	            out[0] = aa * ct + ab * st;
	            out[1] = -aa * st + ab * ct;
	            out[2] = ac * ct + ad * st;
	            out[3] = -ac * st + ct * ad;
	            out[4] = ct * atx + st * aty;
	            out[5] = ct * aty - st * atx;
	            return out;
	        },
	        /**
	         * 缩放变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        scale : function(out, a, v) {
	            var vx = v[0];
	            var vy = v[1];
	            out[0] = a[0] * vx;
	            out[1] = a[1] * vy;
	            out[2] = a[2] * vx;
	            out[3] = a[3] * vy;
	            out[4] = a[4] * vx;
	            out[5] = a[5] * vy;
	            return out;
	        },
	        /**
	         * 求逆矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         */
	        invert : function(out, a) {
	
	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];
	
	            var det = aa * ad - ab * ac;
	            if (!det) {
	                return null;
	            }
	            det = 1.0 / det;
	
	            out[0] = ad * det;
	            out[1] = -ab * det;
	            out[2] = -ac * det;
	            out[3] = aa * det;
	            out[4] = (ac * aty - ad * atx) * det;
	            out[5] = (ab * atx - aa * aty) * det;
	            return out;
	        }
	    };
	
	    module.exports = matrix;
	


/***/ },
/* 14 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;
	
	    /**
	     * @typedef {Float32Array|Array.<number>} Vector2
	     */
	    /**
	     * 二维向量类
	     * @exports zrender/tool/vector
	     */
	    var vector = {
	        /**
	         * 创建一个向量
	         * @param {number} [x=0]
	         * @param {number} [y=0]
	         * @return {Vector2}
	         */
	        create: function (x, y) {
	            var out = new ArrayCtor(2);
	            if (x == null) {
	                x = 0;
	            }
	            if (y == null) {
	                y = 0;
	            }
	            out[0] = x;
	            out[1] = y;
	            return out;
	        },
	
	        /**
	         * 复制向量数据
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        copy: function (out, v) {
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },
	
	        /**
	         * 克隆一个向量
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        clone: function (v) {
	            var out = new ArrayCtor(2);
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },
	
	        /**
	         * 设置向量的两个项
	         * @param {Vector2} out
	         * @param {number} a
	         * @param {number} b
	         * @return {Vector2} 结果
	         */
	        set: function (out, a, b) {
	            out[0] = a;
	            out[1] = b;
	            return out;
	        },
	
	        /**
	         * 向量相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        add: function (out, v1, v2) {
	            out[0] = v1[0] + v2[0];
	            out[1] = v1[1] + v2[1];
	            return out;
	        },
	
	        /**
	         * 向量缩放后相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} a
	         */
	        scaleAndAdd: function (out, v1, v2, a) {
	            out[0] = v1[0] + v2[0] * a;
	            out[1] = v1[1] + v2[1] * a;
	            return out;
	        },
	
	        /**
	         * 向量相减
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        sub: function (out, v1, v2) {
	            out[0] = v1[0] - v2[0];
	            out[1] = v1[1] - v2[1];
	            return out;
	        },
	
	        /**
	         * 向量长度
	         * @param {Vector2} v
	         * @return {number}
	         */
	        len: function (v) {
	            return Math.sqrt(this.lenSquare(v));
	        },
	
	        /**
	         * 向量长度平方
	         * @param {Vector2} v
	         * @return {number}
	         */
	        lenSquare: function (v) {
	            return v[0] * v[0] + v[1] * v[1];
	        },
	
	        /**
	         * 向量乘法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        mul: function (out, v1, v2) {
	            out[0] = v1[0] * v2[0];
	            out[1] = v1[1] * v2[1];
	            return out;
	        },
	
	        /**
	         * 向量除法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        div: function (out, v1, v2) {
	            out[0] = v1[0] / v2[0];
	            out[1] = v1[1] / v2[1];
	            return out;
	        },
	
	        /**
	         * 向量点乘
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        dot: function (v1, v2) {
	            return v1[0] * v2[0] + v1[1] * v2[1];
	        },
	
	        /**
	         * 向量缩放
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {number} s
	         */
	        scale: function (out, v, s) {
	            out[0] = v[0] * s;
	            out[1] = v[1] * s;
	            return out;
	        },
	
	        /**
	         * 向量归一化
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        normalize: function (out, v) {
	            var d = vector.len(v);
	            if (d === 0) {
	                out[0] = 0;
	                out[1] = 0;
	            }
	            else {
	                out[0] = v[0] / d;
	                out[1] = v[1] / d;
	            }
	            return out;
	        },
	
	        /**
	         * 计算向量间距离
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distance: function (v1, v2) {
	            return Math.sqrt(
	                (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1])
	            );
	        },
	
	        /**
	         * 向量距离平方
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distanceSquare: function (v1, v2) {
	            return (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1]);
	        },
	
	        /**
	         * 求负向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        negate: function (out, v) {
	            out[0] = -v[0];
	            out[1] = -v[1];
	            return out;
	        },
	
	        /**
	         * 插值两个点
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} t
	         */
	        lerp: function (out, v1, v2, t) {
	            out[0] = v1[0] + t * (v2[0] - v1[0]);
	            out[1] = v1[1] + t * (v2[1] - v1[1]);
	            return out;
	        },
	
	        /**
	         * 矩阵左乘向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {Vector2} m
	         */
	        applyTransform: function (out, v, m) {
	            var x = v[0];
	            var y = v[1];
	            out[0] = m[0] * x + m[2] * y + m[4];
	            out[1] = m[1] * x + m[3] * y + m[5];
	            return out;
	        },
	        /**
	         * 求两个向量最小值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        min: function (out, v1, v2) {
	            out[0] = Math.min(v1[0], v2[0]);
	            out[1] = Math.min(v1[1], v2[1]);
	            return out;
	        },
	        /**
	         * 求两个向量最大值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        max: function (out, v1, v2) {
	            out[0] = Math.max(v1[0], v2[0]);
	            out[1] = Math.max(v1[1], v2[1]);
	            return out;
	        }
	    };
	
	    vector.length = vector.len;
	    vector.lengthSquare = vector.lenSquare;
	    vector.dist = vector.distance;
	    vector.distSquare = vector.distanceSquare;
	
	    module.exports = vector;
	


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module zrender/mixin/Animatable
	 */
	
	
	    var Animator = __webpack_require__(16);
	    var util = __webpack_require__(4);
	    var isString = util.isString;
	    var isFunction = util.isFunction;
	    var isObject = util.isObject;
	    var log = __webpack_require__(21);
	
	    /**
	     * @alias modue:zrender/mixin/Animatable
	     * @constructor
	     */
	    var Animatable = function () {
	
	        /**
	         * @type {Array.<module:zrender/animation/Animator>}
	         * @readOnly
	         */
	        this.animators = [];
	    };
	
	    Animatable.prototype = {
	
	        constructor: Animatable,
	
	        /**
	         * 动画
	         *
	         * @param {string} path 需要添加动画的属性获取路径，可以通过a.b.c来获取深层的属性
	         * @param {boolean} [loop] 动画是否循环
	         * @return {module:zrender/animation/Animator}
	         * @example:
	         *     el.animate('style', false)
	         *         .when(1000, {x: 10} )
	         *         .done(function(){ // Animation done })
	         *         .start()
	         */
	        animate: function (path, loop) {
	            var target;
	            var animatingShape = false;
	            var el = this;
	            var zr = this.__zr;
	            if (path) {
	                var pathSplitted = path.split('.');
	                var prop = el;
	                // If animating shape
	                animatingShape = pathSplitted[0] === 'shape';
	                for (var i = 0, l = pathSplitted.length; i < l; i++) {
	                    if (!prop) {
	                        continue;
	                    }
	                    prop = prop[pathSplitted[i]];
	                }
	                if (prop) {
	                    target = prop;
	                }
	            }
	            else {
	                target = el;
	            }
	
	            if (!target) {
	                log(
	                    'Property "'
	                    + path
	                    + '" is not existed in element '
	                    + el.id
	                );
	                return;
	            }
	
	            var animators = el.animators;
	
	            var animator = new Animator(target, loop);
	
	            animator.during(function (target) {
	                el.dirty(animatingShape);
	            })
	            .done(function () {
	                // FIXME Animator will not be removed if use `Animator#stop` to stop animation
	                animators.splice(util.indexOf(animators, animator), 1);
	            });
	
	            animators.push(animator);
	
	            // If animate after added to the zrender
	            if (zr) {
	                zr.animation.addAnimator(animator);
	            }
	
	            return animator;
	        },
	
	        /**
	         * 停止动画
	         * @param {boolean} forwardToLast If move to last frame before stop
	         */
	        stopAnimation: function (forwardToLast) {
	            var animators = this.animators;
	            var len = animators.length;
	            for (var i = 0; i < len; i++) {
	                animators[i].stop(forwardToLast);
	            }
	            animators.length = 0;
	
	            return this;
	        },
	
	        /**
	         * @param {Object} target
	         * @param {number} [time=500] Time in ms
	         * @param {string} [easing='linear']
	         * @param {number} [delay=0]
	         * @param {Function} [callback]
	         *
	         * @example
	         *  // Animate position
	         *  el.animateTo({
	         *      position: [10, 10]
	         *  }, function () { // done })
	         *
	         *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
	         *  el.animateTo({
	         *      shape: {
	         *          width: 500
	         *      },
	         *      style: {
	         *          fill: 'red'
	         *      }
	         *      position: [10, 10]
	         *  }, 100, 100, 'cubicOut', function () { // done })
	         */
	         // TODO Return animation key
	        animateTo: function (target, time, delay, easing, callback) {
	            // animateTo(target, time, easing, callback);
	            if (isString(delay)) {
	                callback = easing;
	                easing = delay;
	                delay = 0;
	            }
	            // animateTo(target, time, delay, callback);
	            else if (isFunction(easing)) {
	                callback = easing;
	                easing = 'linear';
	                delay = 0;
	            }
	            // animateTo(target, time, callback);
	            else if (isFunction(delay)) {
	                callback = delay;
	                delay = 0;
	            }
	            // animateTo(target, callback)
	            else if (isFunction(time)) {
	                callback = time;
	                time = 500;
	            }
	            // animateTo(target)
	            else if (!time) {
	                time = 500;
	            }
	            // Stop all previous animations
	            this.stopAnimation();
	            this._animateToShallow('', this, target, time, delay, easing, callback);
	
	            // Animators may be removed immediately after start
	            // if there is nothing to animate
	            var animators = this.animators.slice();
	            var count = animators.length;
	            function done() {
	                count--;
	                if (!count) {
	                    callback && callback();
	                }
	            }
	
	            // No animators. This should be checked before animators[i].start(),
	            // because 'done' may be executed immediately if no need to animate.
	            if (!count) {
	                callback && callback();
	            }
	            // Start after all animators created
	            // Incase any animator is done immediately when all animation properties are not changed
	            for (var i = 0; i < animators.length; i++) {
	                animators[i]
	                    .done(done)
	                    .start(easing);
	            }
	        },
	
	        /**
	         * @private
	         * @param {string} path=''
	         * @param {Object} source=this
	         * @param {Object} target
	         * @param {number} [time=500]
	         * @param {number} [delay=0]
	         *
	         * @example
	         *  // Animate position
	         *  el._animateToShallow({
	         *      position: [10, 10]
	         *  })
	         *
	         *  // Animate shape, style and position in 100ms, delayed 100ms
	         *  el._animateToShallow({
	         *      shape: {
	         *          width: 500
	         *      },
	         *      style: {
	         *          fill: 'red'
	         *      }
	         *      position: [10, 10]
	         *  }, 100, 100)
	         */
	        _animateToShallow: function (path, source, target, time, delay) {
	            var objShallow = {};
	            var propertyCount = 0;
	            for (var name in target) {
	                if (!target.hasOwnProperty(name)) {
	                    continue;
	                }
	
	                if (source[name] != null) {
	                    if (isObject(target[name]) && !util.isArrayLike(target[name])) {
	                        this._animateToShallow(
	                            path ? path + '.' + name : name,
	                            source[name],
	                            target[name],
	                            time,
	                            delay
	                        );
	                    }
	                    else {
	                        objShallow[name] = target[name];
	                        propertyCount++;
	                    }
	                }
	                else if (target[name] != null) {
	                    // Attr directly if not has property
	                    // FIXME, if some property not needed for element ?
	                    if (!path) {
	                        this.attr(name, target[name]);
	                    }
	                    else {  // Shape or style
	                        var props = {};
	                        props[path] = {};
	                        props[path][name] = target[name];
	                        this.attr(props);
	                    }
	                }
	            }
	
	            if (propertyCount > 0) {
	                this.animate(path, false)
	                    .when(time == null ? 500 : time, objShallow)
	                    .delay(delay || 0);
	            }
	
	            return this;
	        }
	    };
	
	    module.exports = Animatable;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module echarts/animation/Animator
	 */
	
	
	    var Clip = __webpack_require__(17);
	    var color = __webpack_require__(19);
	    var util = __webpack_require__(4);
	    var isArrayLike = util.isArrayLike;
	
	    var arraySlice = Array.prototype.slice;
	
	    function defaultGetter(target, key) {
	        return target[key];
	    }
	
	    function defaultSetter(target, key, value) {
	        target[key] = value;
	    }
	
	    /**
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} percent
	     * @return {number}
	     */
	    function interpolateNumber(p0, p1, percent) {
	        return (p1 - p0) * percent + p0;
	    }
	
	    /**
	     * @param  {string} p0
	     * @param  {string} p1
	     * @param  {number} percent
	     * @return {string}
	     */
	    function interpolateString(p0, p1, percent) {
	        return percent > 0.5 ? p1 : p0;
	    }
	
	    /**
	     * @param  {Array} p0
	     * @param  {Array} p1
	     * @param  {number} percent
	     * @param  {Array} out
	     * @param  {number} arrDim
	     */
	    function interpolateArray(p0, p1, percent, out, arrDim) {
	        var len = p0.length;
	        if (arrDim == 1) {
	            for (var i = 0; i < len; i++) {
	                out[i] = interpolateNumber(p0[i], p1[i], percent);
	            }
	        }
	        else {
	            var len2 = p0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    out[i][j] = interpolateNumber(
	                        p0[i][j], p1[i][j], percent
	                    );
	                }
	            }
	        }
	    }
	
	    // arr0 is source array, arr1 is target array.
	    // Do some preprocess to avoid error happened when interpolating from arr0 to arr1
	    function fillArr(arr0, arr1, arrDim) {
	        var arr0Len = arr0.length;
	        var arr1Len = arr1.length;
	        if (arr0Len !== arr1Len) {
	            // FIXME Not work for TypedArray
	            var isPreviousLarger = arr0Len > arr1Len;
	            if (isPreviousLarger) {
	                // Cut the previous
	                arr0.length = arr1Len;
	            }
	            else {
	                // Fill the previous
	                for (var i = arr0Len; i < arr1Len; i++) {
	                    arr0.push(
	                        arrDim === 1 ? arr1[i] : arraySlice.call(arr1[i])
	                    );
	                }
	            }
	        }
	        // Handling NaN value
	        var len2 = arr0[0] && arr0[0].length;
	        for (var i = 0; i < arr0.length; i++) {
	            if (arrDim === 1) {
	                if (isNaN(arr0[i])) {
	                    arr0[i] = arr1[i];
	                }
	            }
	            else {
	                for (var j = 0; j < len2; j++) {
	                    if (isNaN(arr0[i][j])) {
	                        arr0[i][j] = arr1[i][j];
	                    }
	                }
	            }
	        }
	    }
	
	    /**
	     * @param  {Array} arr0
	     * @param  {Array} arr1
	     * @param  {number} arrDim
	     * @return {boolean}
	     */
	    function isArraySame(arr0, arr1, arrDim) {
	        if (arr0 === arr1) {
	            return true;
	        }
	        var len = arr0.length;
	        if (len !== arr1.length) {
	            return false;
	        }
	        if (arrDim === 1) {
	            for (var i = 0; i < len; i++) {
	                if (arr0[i] !== arr1[i]) {
	                    return false;
	                }
	            }
	        }
	        else {
	            var len2 = arr0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    if (arr0[i][j] !== arr1[i][j]) {
	                        return false;
	                    }
	                }
	            }
	        }
	        return true;
	    }
	
	    /**
	     * Catmull Rom interpolate array
	     * @param  {Array} p0
	     * @param  {Array} p1
	     * @param  {Array} p2
	     * @param  {Array} p3
	     * @param  {number} t
	     * @param  {number} t2
	     * @param  {number} t3
	     * @param  {Array} out
	     * @param  {number} arrDim
	     */
	    function catmullRomInterpolateArray(
	        p0, p1, p2, p3, t, t2, t3, out, arrDim
	    ) {
	        var len = p0.length;
	        if (arrDim == 1) {
	            for (var i = 0; i < len; i++) {
	                out[i] = catmullRomInterpolate(
	                    p0[i], p1[i], p2[i], p3[i], t, t2, t3
	                );
	            }
	        }
	        else {
	            var len2 = p0[0].length;
	            for (var i = 0; i < len; i++) {
	                for (var j = 0; j < len2; j++) {
	                    out[i][j] = catmullRomInterpolate(
	                        p0[i][j], p1[i][j], p2[i][j], p3[i][j],
	                        t, t2, t3
	                    );
	                }
	            }
	        }
	    }
	
	    /**
	     * Catmull Rom interpolate number
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @param  {number} t2
	     * @param  {number} t3
	     * @return {number}
	     */
	    function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
	        var v0 = (p2 - p0) * 0.5;
	        var v1 = (p3 - p1) * 0.5;
	        return (2 * (p1 - p2) + v0 + v1) * t3
	                + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                + v0 * t + p1;
	    }
	
	    function cloneValue(value) {
	        if (isArrayLike(value)) {
	            var len = value.length;
	            if (isArrayLike(value[0])) {
	                var ret = [];
	                for (var i = 0; i < len; i++) {
	                    ret.push(arraySlice.call(value[i]));
	                }
	                return ret;
	            }
	
	            return arraySlice.call(value);
	        }
	
	        return value;
	    }
	
	    function rgba2String(rgba) {
	        rgba[0] = Math.floor(rgba[0]);
	        rgba[1] = Math.floor(rgba[1]);
	        rgba[2] = Math.floor(rgba[2]);
	
	        return 'rgba(' + rgba.join(',') + ')';
	    }
	
	    function createTrackClip (animator, easing, oneTrackDone, keyframes, propName) {
	        var getter = animator._getter;
	        var setter = animator._setter;
	        var useSpline = easing === 'spline';
	
	        var trackLen = keyframes.length;
	        if (!trackLen) {
	            return;
	        }
	        // Guess data type
	        var firstVal = keyframes[0].value;
	        var isValueArray = isArrayLike(firstVal);
	        var isValueColor = false;
	        var isValueString = false;
	
	        // For vertices morphing
	        var arrDim = (
	                isValueArray
	                && isArrayLike(firstVal[0])
	            )
	            ? 2 : 1;
	        var trackMaxTime;
	        // Sort keyframe as ascending
	        keyframes.sort(function(a, b) {
	            return a.time - b.time;
	        });
	
	        trackMaxTime = keyframes[trackLen - 1].time;
	        // Percents of each keyframe
	        var kfPercents = [];
	        // Value of each keyframe
	        var kfValues = [];
	        var prevValue = keyframes[0].value;
	        var isAllValueEqual = true;
	        for (var i = 0; i < trackLen; i++) {
	            kfPercents.push(keyframes[i].time / trackMaxTime);
	            // Assume value is a color when it is a string
	            var value = keyframes[i].value;
	
	            // Check if value is equal, deep check if value is array
	            if (!((isValueArray && isArraySame(value, prevValue, arrDim))
	                || (!isValueArray && value === prevValue))) {
	                isAllValueEqual = false;
	            }
	            prevValue = value;
	
	            // Try converting a string to a color array
	            if (typeof value == 'string') {
	                var colorArray = color.parse(value);
	                if (colorArray) {
	                    value = colorArray;
	                    isValueColor = true;
	                }
	                else {
	                    isValueString = true;
	                }
	            }
	            kfValues.push(value);
	        }
	        if (isAllValueEqual) {
	            return;
	        }
	
	        var lastValue = kfValues[trackLen - 1];
	        // Polyfill array and NaN value
	        for (var i = 0; i < trackLen - 1; i++) {
	            if (isValueArray) {
	                fillArr(kfValues[i], lastValue, arrDim);
	            }
	            else {
	                if (isNaN(kfValues[i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
	                    kfValues[i] = lastValue;
	                }
	            }
	        }
	        isValueArray && fillArr(getter(animator._target, propName), lastValue, arrDim);
	
	        // Cache the key of last frame to speed up when
	        // animation playback is sequency
	        var lastFrame = 0;
	        var lastFramePercent = 0;
	        var start;
	        var w;
	        var p0;
	        var p1;
	        var p2;
	        var p3;
	
	        if (isValueColor) {
	            var rgba = [0, 0, 0, 0];
	        }
	
	        var onframe = function (target, percent) {
	            // Find the range keyframes
	            // kf1-----kf2---------current--------kf3
	            // find kf2 and kf3 and do interpolation
	            var frame;
	            // In the easing function like elasticOut, percent may less than 0
	            if (percent < 0) {
	                frame = 0;
	            }
	            else if (percent < lastFramePercent) {
	                // Start from next key
	                // PENDING start from lastFrame ?
	                start = Math.min(lastFrame + 1, trackLen - 1);
	                for (frame = start; frame >= 0; frame--) {
	                    if (kfPercents[frame] <= percent) {
	                        break;
	                    }
	                }
	                // PENDING really need to do this ?
	                frame = Math.min(frame, trackLen - 2);
	            }
	            else {
	                for (frame = lastFrame; frame < trackLen; frame++) {
	                    if (kfPercents[frame] > percent) {
	                        break;
	                    }
	                }
	                frame = Math.min(frame - 1, trackLen - 2);
	            }
	            lastFrame = frame;
	            lastFramePercent = percent;
	
	            var range = (kfPercents[frame + 1] - kfPercents[frame]);
	            if (range === 0) {
	                return;
	            }
	            else {
	                w = (percent - kfPercents[frame]) / range;
	            }
	            if (useSpline) {
	                p1 = kfValues[frame];
	                p0 = kfValues[frame === 0 ? frame : frame - 1];
	                p2 = kfValues[frame > trackLen - 2 ? trackLen - 1 : frame + 1];
	                p3 = kfValues[frame > trackLen - 3 ? trackLen - 1 : frame + 2];
	                if (isValueArray) {
	                    catmullRomInterpolateArray(
	                        p0, p1, p2, p3, w, w * w, w * w * w,
	                        getter(target, propName),
	                        arrDim
	                    );
	                }
	                else {
	                    var value;
	                    if (isValueColor) {
	                        value = catmullRomInterpolateArray(
	                            p0, p1, p2, p3, w, w * w, w * w * w,
	                            rgba, 1
	                        );
	                        value = rgba2String(rgba);
	                    }
	                    else if (isValueString) {
	                        // String is step(0.5)
	                        return interpolateString(p1, p2, w);
	                    }
	                    else {
	                        value = catmullRomInterpolate(
	                            p0, p1, p2, p3, w, w * w, w * w * w
	                        );
	                    }
	                    setter(
	                        target,
	                        propName,
	                        value
	                    );
	                }
	            }
	            else {
	                if (isValueArray) {
	                    interpolateArray(
	                        kfValues[frame], kfValues[frame + 1], w,
	                        getter(target, propName),
	                        arrDim
	                    );
	                }
	                else {
	                    var value;
	                    if (isValueColor) {
	                        interpolateArray(
	                            kfValues[frame], kfValues[frame + 1], w,
	                            rgba, 1
	                        );
	                        value = rgba2String(rgba);
	                    }
	                    else if (isValueString) {
	                        // String is step(0.5)
	                        return interpolateString(kfValues[frame], kfValues[frame + 1], w);
	                    }
	                    else {
	                        value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
	                    }
	                    setter(
	                        target,
	                        propName,
	                        value
	                    );
	                }
	            }
	        };
	
	        var clip = new Clip({
	            target: animator._target,
	            life: trackMaxTime,
	            loop: animator._loop,
	            delay: animator._delay,
	            onframe: onframe,
	            ondestroy: oneTrackDone
	        });
	
	        if (easing && easing !== 'spline') {
	            clip.easing = easing;
	        }
	
	        return clip;
	    }
	
	    /**
	     * @alias module:zrender/animation/Animator
	     * @constructor
	     * @param {Object} target
	     * @param {boolean} loop
	     * @param {Function} getter
	     * @param {Function} setter
	     */
	    var Animator = function(target, loop, getter, setter) {
	        this._tracks = {};
	        this._target = target;
	
	        this._loop = loop || false;
	
	        this._getter = getter || defaultGetter;
	        this._setter = setter || defaultSetter;
	
	        this._clipCount = 0;
	
	        this._delay = 0;
	
	        this._doneList = [];
	
	        this._onframeList = [];
	
	        this._clipList = [];
	    };
	
	    Animator.prototype = {
	        /**
	         * 设置动画关键帧
	         * @param  {number} time 关键帧时间，单位是ms
	         * @param  {Object} props 关键帧的属性值，key-value表示
	         * @return {module:zrender/animation/Animator}
	         */
	        when: function(time /* ms */, props) {
	            var tracks = this._tracks;
	            for (var propName in props) {
	                if (!props.hasOwnProperty(propName)) {
	                    continue;
	                }
	
	                if (!tracks[propName]) {
	                    tracks[propName] = [];
	                    // Invalid value
	                    var value = this._getter(this._target, propName);
	                    if (value == null) {
	                        // zrLog('Invalid property ' + propName);
	                        continue;
	                    }
	                    // If time is 0
	                    //  Then props is given initialize value
	                    // Else
	                    //  Initialize value from current prop value
	                    if (time !== 0) {
	                        tracks[propName].push({
	                            time: 0,
	                            value: cloneValue(value)
	                        });
	                    }
	                }
	                tracks[propName].push({
	                    time: time,
	                    value: props[propName]
	                });
	            }
	            return this;
	        },
	        /**
	         * 添加动画每一帧的回调函数
	         * @param  {Function} callback
	         * @return {module:zrender/animation/Animator}
	         */
	        during: function (callback) {
	            this._onframeList.push(callback);
	            return this;
	        },
	
	        pause: function () {
	            for (var i = 0; i < this._clipList.length; i++) {
	                this._clipList[i].pause();
	            }
	            this._paused = true;
	        },
	
	        resume: function () {
	            for (var i = 0; i < this._clipList.length; i++) {
	                this._clipList[i].resume();
	            }
	            this._paused = false;
	        },
	
	        isPaused: function () {
	            return !!this._paused;
	        },
	
	        _doneCallback: function () {
	            // Clear all tracks
	            this._tracks = {};
	            // Clear all clips
	            this._clipList.length = 0;
	
	            var doneList = this._doneList;
	            var len = doneList.length;
	            for (var i = 0; i < len; i++) {
	                doneList[i].call(this);
	            }
	        },
	        /**
	         * 开始执行动画
	         * @param  {string|Function} easing
	         *         动画缓动函数，详见{@link module:zrender/animation/easing}
	         * @return {module:zrender/animation/Animator}
	         */
	        start: function (easing) {
	
	            var self = this;
	            var clipCount = 0;
	
	            var oneTrackDone = function() {
	                clipCount--;
	                if (!clipCount) {
	                    self._doneCallback();
	                }
	            };
	
	            var lastClip;
	            for (var propName in this._tracks) {
	                if (!this._tracks.hasOwnProperty(propName)) {
	                    continue;
	                }
	                var clip = createTrackClip(
	                    this, easing, oneTrackDone,
	                    this._tracks[propName], propName
	                );
	                if (clip) {
	                    this._clipList.push(clip);
	                    clipCount++;
	
	                    // If start after added to animation
	                    if (this.animation) {
	                        this.animation.addClip(clip);
	                    }
	
	                    lastClip = clip;
	                }
	            }
	
	            // Add during callback on the last clip
	            if (lastClip) {
	                var oldOnFrame = lastClip.onframe;
	                lastClip.onframe = function (target, percent) {
	                    oldOnFrame(target, percent);
	
	                    for (var i = 0; i < self._onframeList.length; i++) {
	                        self._onframeList[i](target, percent);
	                    }
	                };
	            }
	
	            if (!clipCount) {
	                this._doneCallback();
	            }
	            return this;
	        },
	        /**
	         * 停止动画
	         * @param {boolean} forwardToLast If move to last frame before stop
	         */
	        stop: function (forwardToLast) {
	            var clipList = this._clipList;
	            var animation = this.animation;
	            for (var i = 0; i < clipList.length; i++) {
	                var clip = clipList[i];
	                if (forwardToLast) {
	                    // Move to last frame before stop
	                    clip.onframe(this._target, 1);
	                }
	                animation && animation.removeClip(clip);
	            }
	            clipList.length = 0;
	        },
	        /**
	         * 设置动画延迟开始的时间
	         * @param  {number} time 单位ms
	         * @return {module:zrender/animation/Animator}
	         */
	        delay: function (time) {
	            this._delay = time;
	            return this;
	        },
	        /**
	         * 添加动画结束的回调
	         * @param  {Function} cb
	         * @return {module:zrender/animation/Animator}
	         */
	        done: function(cb) {
	            if (cb) {
	                this._doneList.push(cb);
	            }
	            return this;
	        },
	
	        /**
	         * @return {Array.<module:zrender/animation/Clip>}
	         */
	        getClips: function () {
	            return this._clipList;
	        }
	    };
	
	    module.exports = Animator;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 动画主控制器
	 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
	 * @config life(1000) 动画时长
	 * @config delay(0) 动画延迟时间
	 * @config loop(true)
	 * @config gap(0) 循环的间隔时间
	 * @config onframe
	 * @config easing(optional)
	 * @config ondestroy(optional)
	 * @config onrestart(optional)
	 *
	 * TODO pause
	 */
	
	
	    var easingFuncs = __webpack_require__(18);
	
	    function Clip(options) {
	
	        this._target = options.target;
	
	        // 生命周期
	        this._life = options.life || 1000;
	        // 延时
	        this._delay = options.delay || 0;
	        // 开始时间
	        // this._startTime = new Date().getTime() + this._delay;// 单位毫秒
	        this._initialized = false;
	
	        // 是否循环
	        this.loop = options.loop == null ? false : options.loop;
	
	        this.gap = options.gap || 0;
	
	        this.easing = options.easing || 'Linear';
	
	        this.onframe = options.onframe;
	        this.ondestroy = options.ondestroy;
	        this.onrestart = options.onrestart;
	
	        this._pausedTime = 0;
	        this._paused = false;
	    }
	
	    Clip.prototype = {
	
	        constructor: Clip,
	
	        step: function (globalTime, deltaTime) {
	            // Set startTime on first step, or _startTime may has milleseconds different between clips
	            // PENDING
	            if (!this._initialized) {
	                this._startTime = globalTime + this._delay;
	                this._initialized = true;
	            }
	
	            if (this._paused) {
	                this._pausedTime += deltaTime;
	                return;
	            }
	
	            var percent = (globalTime - this._startTime - this._pausedTime) / this._life;
	
	            // 还没开始
	            if (percent < 0) {
	                return;
	            }
	
	            percent = Math.min(percent, 1);
	
	            var easing = this.easing;
	            var easingFunc = typeof easing == 'string' ? easingFuncs[easing] : easing;
	            var schedule = typeof easingFunc === 'function'
	                ? easingFunc(percent)
	                : percent;
	
	            this.fire('frame', schedule);
	
	            // 结束
	            if (percent == 1) {
	                if (this.loop) {
	                    this.restart (globalTime);
	                    // 重新开始周期
	                    // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
	                    return 'restart';
	                }
	
	                // 动画完成将这个控制器标识为待删除
	                // 在Animation.update中进行批量删除
	                this._needsRemove = true;
	                return 'destroy';
	            }
	
	            return null;
	        },
	
	        restart: function (globalTime) {
	            var remainder = (globalTime - this._startTime - this._pausedTime) % this._life;
	            this._startTime = globalTime - remainder + this.gap;
	            this._pausedTime = 0;
	
	            this._needsRemove = false;
	        },
	
	        fire: function (eventType, arg) {
	            eventType = 'on' + eventType;
	            if (this[eventType]) {
	                this[eventType](this._target, arg);
	            }
	        },
	
	        pause: function () {
	            this._paused = true;
	        },
	
	        resume: function () {
	            this._paused = false;
	        }
	    };
	
	    module.exports = Clip;
	


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
	 * @see http://sole.github.io/tween.js/examples/03_graphs.html
	 * @exports zrender/animation/easing
	 */
	
	    var easing = {
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        linear: function (k) {
	            return k;
	        },
	
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticIn: function (k) {
	            return k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticOut: function (k) {
	            return k * (2 - k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quadraticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k;
	            }
	            return -0.5 * (--k * (k - 2) - 1);
	        },
	
	        // 三次方的缓动（t^3）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicIn: function (k) {
	            return k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicOut: function (k) {
	            return --k * k * k + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        cubicInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k;
	            }
	            return 0.5 * ((k -= 2) * k * k + 2);
	        },
	
	        // 四次方的缓动（t^4）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticIn: function (k) {
	            return k * k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticOut: function (k) {
	            return 1 - (--k * k * k * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quarticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k * k;
	            }
	            return -0.5 * ((k -= 2) * k * k * k - 2);
	        },
	
	        // 五次方的缓动（t^5）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticIn: function (k) {
	            return k * k * k * k * k;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticOut: function (k) {
	            return --k * k * k * k * k + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        quinticInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return 0.5 * k * k * k * k * k;
	            }
	            return 0.5 * ((k -= 2) * k * k * k * k + 2);
	        },
	
	        // 正弦曲线的缓动（sin(t)）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalIn: function (k) {
	            return 1 - Math.cos(k * Math.PI / 2);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalOut: function (k) {
	            return Math.sin(k * Math.PI / 2);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        sinusoidalInOut: function (k) {
	            return 0.5 * (1 - Math.cos(Math.PI * k));
	        },
	
	        // 指数曲线的缓动（2^t）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialIn: function (k) {
	            return k === 0 ? 0 : Math.pow(1024, k - 1);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialOut: function (k) {
	            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        exponentialInOut: function (k) {
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if ((k *= 2) < 1) {
	                return 0.5 * Math.pow(1024, k - 1);
	            }
	            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
	        },
	
	        // 圆形曲线的缓动（sqrt(1-t^2)）
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularIn: function (k) {
	            return 1 - Math.sqrt(1 - k * k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularOut: function (k) {
	            return Math.sqrt(1 - (--k * k));
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        circularInOut: function (k) {
	            if ((k *= 2) < 1) {
	                return -0.5 * (Math.sqrt(1 - k * k) - 1);
	            }
	            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
	        },
	
	        // 创建类似于弹簧在停止前来回振荡的动画
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticIn: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            return -(a * Math.pow(2, 10 * (k -= 1)) *
	                        Math.sin((k - s) * (2 * Math.PI) / p));
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticOut: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            return (a * Math.pow(2, -10 * k) *
	                    Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        elasticInOut: function (k) {
	            var s;
	            var a = 0.1;
	            var p = 0.4;
	            if (k === 0) {
	                return 0;
	            }
	            if (k === 1) {
	                return 1;
	            }
	            if (!a || a < 1) {
	                a = 1; s = p / 4;
	            }
	            else {
	                s = p * Math.asin(1 / a) / (2 * Math.PI);
	            }
	            if ((k *= 2) < 1) {
	                return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
	                    * Math.sin((k - s) * (2 * Math.PI) / p));
	            }
	            return a * Math.pow(2, -10 * (k -= 1))
	                    * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
	
	        },
	
	        // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backIn: function (k) {
	            var s = 1.70158;
	            return k * k * ((s + 1) * k - s);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backOut: function (k) {
	            var s = 1.70158;
	            return --k * k * ((s + 1) * k + s) + 1;
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        backInOut: function (k) {
	            var s = 1.70158 * 1.525;
	            if ((k *= 2) < 1) {
	                return 0.5 * (k * k * ((s + 1) * k - s));
	            }
	            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
	        },
	
	        // 创建弹跳效果
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceIn: function (k) {
	            return 1 - easing.bounceOut(1 - k);
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceOut: function (k) {
	            if (k < (1 / 2.75)) {
	                return 7.5625 * k * k;
	            }
	            else if (k < (2 / 2.75)) {
	                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	            }
	            else if (k < (2.5 / 2.75)) {
	                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	            }
	            else {
	                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	            }
	        },
	        /**
	        * @param {number} k
	        * @return {number}
	        */
	        bounceInOut: function (k) {
	            if (k < 0.5) {
	                return easing.bounceIn(k * 2) * 0.5;
	            }
	            return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
	        }
	    };
	
	    module.exports = easing;
	
	


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module zrender/tool/color
	 */
	
	
	    var LRU = __webpack_require__(20);
	
	    var kCSSColorTable = {
	        'transparent': [0,0,0,0], 'aliceblue': [240,248,255,1],
	        'antiquewhite': [250,235,215,1], 'aqua': [0,255,255,1],
	        'aquamarine': [127,255,212,1], 'azure': [240,255,255,1],
	        'beige': [245,245,220,1], 'bisque': [255,228,196,1],
	        'black': [0,0,0,1], 'blanchedalmond': [255,235,205,1],
	        'blue': [0,0,255,1], 'blueviolet': [138,43,226,1],
	        'brown': [165,42,42,1], 'burlywood': [222,184,135,1],
	        'cadetblue': [95,158,160,1], 'chartreuse': [127,255,0,1],
	        'chocolate': [210,105,30,1], 'coral': [255,127,80,1],
	        'cornflowerblue': [100,149,237,1], 'cornsilk': [255,248,220,1],
	        'crimson': [220,20,60,1], 'cyan': [0,255,255,1],
	        'darkblue': [0,0,139,1], 'darkcyan': [0,139,139,1],
	        'darkgoldenrod': [184,134,11,1], 'darkgray': [169,169,169,1],
	        'darkgreen': [0,100,0,1], 'darkgrey': [169,169,169,1],
	        'darkkhaki': [189,183,107,1], 'darkmagenta': [139,0,139,1],
	        'darkolivegreen': [85,107,47,1], 'darkorange': [255,140,0,1],
	        'darkorchid': [153,50,204,1], 'darkred': [139,0,0,1],
	        'darksalmon': [233,150,122,1], 'darkseagreen': [143,188,143,1],
	        'darkslateblue': [72,61,139,1], 'darkslategray': [47,79,79,1],
	        'darkslategrey': [47,79,79,1], 'darkturquoise': [0,206,209,1],
	        'darkviolet': [148,0,211,1], 'deeppink': [255,20,147,1],
	        'deepskyblue': [0,191,255,1], 'dimgray': [105,105,105,1],
	        'dimgrey': [105,105,105,1], 'dodgerblue': [30,144,255,1],
	        'firebrick': [178,34,34,1], 'floralwhite': [255,250,240,1],
	        'forestgreen': [34,139,34,1], 'fuchsia': [255,0,255,1],
	        'gainsboro': [220,220,220,1], 'ghostwhite': [248,248,255,1],
	        'gold': [255,215,0,1], 'goldenrod': [218,165,32,1],
	        'gray': [128,128,128,1], 'green': [0,128,0,1],
	        'greenyellow': [173,255,47,1], 'grey': [128,128,128,1],
	        'honeydew': [240,255,240,1], 'hotpink': [255,105,180,1],
	        'indianred': [205,92,92,1], 'indigo': [75,0,130,1],
	        'ivory': [255,255,240,1], 'khaki': [240,230,140,1],
	        'lavender': [230,230,250,1], 'lavenderblush': [255,240,245,1],
	        'lawngreen': [124,252,0,1], 'lemonchiffon': [255,250,205,1],
	        'lightblue': [173,216,230,1], 'lightcoral': [240,128,128,1],
	        'lightcyan': [224,255,255,1], 'lightgoldenrodyellow': [250,250,210,1],
	        'lightgray': [211,211,211,1], 'lightgreen': [144,238,144,1],
	        'lightgrey': [211,211,211,1], 'lightpink': [255,182,193,1],
	        'lightsalmon': [255,160,122,1], 'lightseagreen': [32,178,170,1],
	        'lightskyblue': [135,206,250,1], 'lightslategray': [119,136,153,1],
	        'lightslategrey': [119,136,153,1], 'lightsteelblue': [176,196,222,1],
	        'lightyellow': [255,255,224,1], 'lime': [0,255,0,1],
	        'limegreen': [50,205,50,1], 'linen': [250,240,230,1],
	        'magenta': [255,0,255,1], 'maroon': [128,0,0,1],
	        'mediumaquamarine': [102,205,170,1], 'mediumblue': [0,0,205,1],
	        'mediumorchid': [186,85,211,1], 'mediumpurple': [147,112,219,1],
	        'mediumseagreen': [60,179,113,1], 'mediumslateblue': [123,104,238,1],
	        'mediumspringgreen': [0,250,154,1], 'mediumturquoise': [72,209,204,1],
	        'mediumvioletred': [199,21,133,1], 'midnightblue': [25,25,112,1],
	        'mintcream': [245,255,250,1], 'mistyrose': [255,228,225,1],
	        'moccasin': [255,228,181,1], 'navajowhite': [255,222,173,1],
	        'navy': [0,0,128,1], 'oldlace': [253,245,230,1],
	        'olive': [128,128,0,1], 'olivedrab': [107,142,35,1],
	        'orange': [255,165,0,1], 'orangered': [255,69,0,1],
	        'orchid': [218,112,214,1], 'palegoldenrod': [238,232,170,1],
	        'palegreen': [152,251,152,1], 'paleturquoise': [175,238,238,1],
	        'palevioletred': [219,112,147,1], 'papayawhip': [255,239,213,1],
	        'peachpuff': [255,218,185,1], 'peru': [205,133,63,1],
	        'pink': [255,192,203,1], 'plum': [221,160,221,1],
	        'powderblue': [176,224,230,1], 'purple': [128,0,128,1],
	        'red': [255,0,0,1], 'rosybrown': [188,143,143,1],
	        'royalblue': [65,105,225,1], 'saddlebrown': [139,69,19,1],
	        'salmon': [250,128,114,1], 'sandybrown': [244,164,96,1],
	        'seagreen': [46,139,87,1], 'seashell': [255,245,238,1],
	        'sienna': [160,82,45,1], 'silver': [192,192,192,1],
	        'skyblue': [135,206,235,1], 'slateblue': [106,90,205,1],
	        'slategray': [112,128,144,1], 'slategrey': [112,128,144,1],
	        'snow': [255,250,250,1], 'springgreen': [0,255,127,1],
	        'steelblue': [70,130,180,1], 'tan': [210,180,140,1],
	        'teal': [0,128,128,1], 'thistle': [216,191,216,1],
	        'tomato': [255,99,71,1], 'turquoise': [64,224,208,1],
	        'violet': [238,130,238,1], 'wheat': [245,222,179,1],
	        'white': [255,255,255,1], 'whitesmoke': [245,245,245,1],
	        'yellow': [255,255,0,1], 'yellowgreen': [154,205,50,1]
	    };
	
	    function clampCssByte(i) {  // Clamp to integer 0 .. 255.
	        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
	        return i < 0 ? 0 : i > 255 ? 255 : i;
	    }
	
	    function clampCssAngle(i) {  // Clamp to integer 0 .. 360.
	        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
	        return i < 0 ? 0 : i > 360 ? 360 : i;
	    }
	
	    function clampCssFloat(f) {  // Clamp to float 0.0 .. 1.0.
	        return f < 0 ? 0 : f > 1 ? 1 : f;
	    }
	
	    function parseCssInt(str) {  // int or percentage.
	        if (str.length && str.charAt(str.length - 1) === '%') {
	            return clampCssByte(parseFloat(str) / 100 * 255);
	        }
	        return clampCssByte(parseInt(str, 10));
	    }
	
	    function parseCssFloat(str) {  // float or percentage.
	        if (str.length && str.charAt(str.length - 1) === '%') {
	            return clampCssFloat(parseFloat(str) / 100);
	        }
	        return clampCssFloat(parseFloat(str));
	    }
	
	    function cssHueToRgb(m1, m2, h) {
	        if (h < 0) {
	            h += 1;
	        }
	        else if (h > 1) {
	            h -= 1;
	        }
	
	        if (h * 6 < 1) {
	            return m1 + (m2 - m1) * h * 6;
	        }
	        if (h * 2 < 1) {
	            return m2;
	        }
	        if (h * 3 < 2) {
	            return m1 + (m2 - m1) * (2/3 - h) * 6;
	        }
	        return m1;
	    }
	
	    function lerp(a, b, p) {
	        return a + (b - a) * p;
	    }
	
	    function setRgba(out, r, g, b, a) {
	        out[0] = r; out[1] = g; out[2] = b; out[3] = a;
	        return out;
	    }
	    function copyRgba(out, a) {
	        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
	        return out;
	    }
	    var colorCache = new LRU(20);
	    var lastRemovedArr = null;
	    function putToCache(colorStr, rgbaArr) {
	        // Reuse removed array
	        if (lastRemovedArr) {
	            copyRgba(lastRemovedArr, rgbaArr);
	        }
	        lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || (rgbaArr.slice()));
	    }
	    /**
	     * @param {string} colorStr
	     * @param {Array.<number>} out
	     * @return {Array.<number>}
	     * @memberOf module:zrender/util/color
	     */
	    function parse(colorStr, rgbaArr) {
	        if (!colorStr) {
	            return;
	        }
	        rgbaArr = rgbaArr || [];
	
	        var cached = colorCache.get(colorStr);
	        if (cached) {
	            return copyRgba(rgbaArr, cached);
	        }
	
	        // colorStr may be not string
	        colorStr = colorStr + '';
	        // Remove all whitespace, not compliant, but should just be more accepting.
	        var str = colorStr.replace(/ /g, '').toLowerCase();
	
	        // Color keywords (and transparent) lookup.
	        if (str in kCSSColorTable) {
	            copyRgba(rgbaArr, kCSSColorTable[str]);
	            putToCache(colorStr, rgbaArr);
	            return rgbaArr;
	        }
	
	        // #abc and #abc123 syntax.
	        if (str.charAt(0) === '#') {
	            if (str.length === 4) {
	                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	                if (!(iv >= 0 && iv <= 0xfff)) {
	                    setRgba(rgbaArr, 0, 0, 0, 1);
	                    return;  // Covers NaN.
	                }
	                setRgba(rgbaArr,
	                    ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
	                    (iv & 0xf0) | ((iv & 0xf0) >> 4),
	                    (iv & 0xf) | ((iv & 0xf) << 4),
	                    1
	                );
	                putToCache(colorStr, rgbaArr);
	                return rgbaArr;
	            }
	            else if (str.length === 7) {
	                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	                if (!(iv >= 0 && iv <= 0xffffff)) {
	                    setRgba(rgbaArr, 0, 0, 0, 1);
	                    return;  // Covers NaN.
	                }
	                setRgba(rgbaArr,
	                    (iv & 0xff0000) >> 16,
	                    (iv & 0xff00) >> 8,
	                    iv & 0xff,
	                    1
	                );
	                putToCache(colorStr, rgbaArr);
	                return rgbaArr;
	            }
	
	            return;
	        }
	        var op = str.indexOf('('), ep = str.indexOf(')');
	        if (op !== -1 && ep + 1 === str.length) {
	            var fname = str.substr(0, op);
	            var params = str.substr(op + 1, ep - (op + 1)).split(',');
	            var alpha = 1;  // To allow case fallthrough.
	            switch (fname) {
	                case 'rgba':
	                    if (params.length !== 4) {
	                        setRgba(rgbaArr, 0, 0, 0, 1);
	                        return;
	                    }
	                    alpha = parseCssFloat(params.pop()); // jshint ignore:line
	                // Fall through.
	                case 'rgb':
	                    if (params.length !== 3) {
	                        setRgba(rgbaArr, 0, 0, 0, 1);
	                        return;
	                    }
	                    setRgba(rgbaArr,
	                        parseCssInt(params[0]),
	                        parseCssInt(params[1]),
	                        parseCssInt(params[2]),
	                        alpha
	                    );
	                    putToCache(colorStr, rgbaArr);
	                    return rgbaArr;
	                case 'hsla':
	                    if (params.length !== 4) {
	                        setRgba(rgbaArr, 0, 0, 0, 1);
	                        return;
	                    }
	                    params[3] = parseCssFloat(params[3]);
	                    hsla2rgba(params, rgbaArr);
	                    putToCache(colorStr, rgbaArr);
	                    return rgbaArr;
	                case 'hsl':
	                    if (params.length !== 3) {
	                        setRgba(rgbaArr, 0, 0, 0, 1);
	                        return;
	                    }
	                    hsla2rgba(params, rgbaArr);
	                    putToCache(colorStr, rgbaArr);
	                    return rgbaArr;
	                default:
	                    return;
	            }
	        }
	
	        setRgba(rgbaArr, 0, 0, 0, 1);
	        return;
	    }
	
	    /**
	     * @param {Array.<number>} hsla
	     * @param {Array.<number>} rgba
	     * @return {Array.<number>} rgba
	     */
	    function hsla2rgba(hsla, rgba) {
	        var h = (((parseFloat(hsla[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
	        // NOTE(deanm): According to the CSS spec s/l should only be
	        // percentages, but we don't bother and let float or percentage.
	        var s = parseCssFloat(hsla[1]);
	        var l = parseCssFloat(hsla[2]);
	        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	        var m1 = l * 2 - m2;
	
	        rgba = rgba || [];
	        setRgba(rgba,
	            clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255),
	            clampCssByte(cssHueToRgb(m1, m2, h) * 255),
	            clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255),
	            1
	        );
	
	        if (hsla.length === 4) {
	            rgba[3] = hsla[3];
	        }
	
	        return rgba;
	    }
	
	    /**
	     * @param {Array.<number>} rgba
	     * @return {Array.<number>} hsla
	     */
	    function rgba2hsla(rgba) {
	        if (!rgba) {
	            return;
	        }
	
	        // RGB from 0 to 255
	        var R = rgba[0] / 255;
	        var G = rgba[1] / 255;
	        var B = rgba[2] / 255;
	
	        var vMin = Math.min(R, G, B); // Min. value of RGB
	        var vMax = Math.max(R, G, B); // Max. value of RGB
	        var delta = vMax - vMin; // Delta RGB value
	
	        var L = (vMax + vMin) / 2;
	        var H;
	        var S;
	        // HSL results from 0 to 1
	        if (delta === 0) {
	            H = 0;
	            S = 0;
	        }
	        else {
	            if (L < 0.5) {
	                S = delta / (vMax + vMin);
	            }
	            else {
	                S = delta / (2 - vMax - vMin);
	            }
	
	            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
	            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
	            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;
	
	            if (R === vMax) {
	                H = deltaB - deltaG;
	            }
	            else if (G === vMax) {
	                H = (1 / 3) + deltaR - deltaB;
	            }
	            else if (B === vMax) {
	                H = (2 / 3) + deltaG - deltaR;
	            }
	
	            if (H < 0) {
	                H += 1;
	            }
	
	            if (H > 1) {
	                H -= 1;
	            }
	        }
	
	        var hsla = [H * 360, S, L];
	
	        if (rgba[3] != null) {
	            hsla.push(rgba[3]);
	        }
	
	        return hsla;
	    }
	
	    /**
	     * @param {string} color
	     * @param {number} level
	     * @return {string}
	     * @memberOf module:zrender/util/color
	     */
	    function lift(color, level) {
	        var colorArr = parse(color);
	        if (colorArr) {
	            for (var i = 0; i < 3; i++) {
	                if (level < 0) {
	                    colorArr[i] = colorArr[i] * (1 - level) | 0;
	                }
	                else {
	                    colorArr[i] = ((255 - colorArr[i]) * level + colorArr[i]) | 0;
	                }
	            }
	            return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
	        }
	    }
	
	    /**
	     * @param {string} color
	     * @return {string}
	     * @memberOf module:zrender/util/color
	     */
	    function toHex(color, level) {
	        var colorArr = parse(color);
	        if (colorArr) {
	            return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + (+colorArr[2])).toString(16).slice(1);
	        }
	    }
	
	    /**
	     * Map value to color. Faster than mapToColor methods because color is represented by rgba array
	     * @param {number} normalizedValue A float between 0 and 1.
	     * @param {Array.<Array.<number>>} colors List of rgba color array
	     * @param {Array.<number>} [out] Mapped gba color array
	     * @return {Array.<number>}
	     */
	    function fastMapToColor(normalizedValue, colors, out) {
	        out = out || [0, 0, 0, 0];
	        if (!(colors && colors.length)
	            || !(normalizedValue >= 0 && normalizedValue <= 1)
	        ) {
	            return out;
	        }
	        var value = normalizedValue * (colors.length - 1);
	        var leftIndex = Math.floor(value);
	        var rightIndex = Math.ceil(value);
	        var leftColor = colors[leftIndex];
	        var rightColor = colors[rightIndex];
	        var dv = value - leftIndex;
	        out[0] = clampCssByte(lerp(leftColor[0], rightColor[0], dv));
	        out[1] = clampCssByte(lerp(leftColor[1], rightColor[1], dv));
	        out[2] = clampCssByte(lerp(leftColor[2], rightColor[2], dv));
	        out[3] = clampCssFloat(lerp(leftColor[3], rightColor[3], dv));
	        return out;
	    }
	    /**
	     * @param {number} normalizedValue A float between 0 and 1.
	     * @param {Array.<string>} colors Color list.
	     * @param {boolean=} fullOutput Default false.
	     * @return {(string|Object)} Result color. If fullOutput,
	     *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
	     * @memberOf module:zrender/util/color
	     */
	    function mapToColor(normalizedValue, colors, fullOutput) {
	        if (!(colors && colors.length)
	            || !(normalizedValue >= 0 && normalizedValue <= 1)
	        ) {
	            return;
	        }
	
	        var value = normalizedValue * (colors.length - 1);
	        var leftIndex = Math.floor(value);
	        var rightIndex = Math.ceil(value);
	        var leftColor = parse(colors[leftIndex]);
	        var rightColor = parse(colors[rightIndex]);
	        var dv = value - leftIndex;
	
	        var color = stringify(
	            [
	                clampCssByte(lerp(leftColor[0], rightColor[0], dv)),
	                clampCssByte(lerp(leftColor[1], rightColor[1], dv)),
	                clampCssByte(lerp(leftColor[2], rightColor[2], dv)),
	                clampCssFloat(lerp(leftColor[3], rightColor[3], dv))
	            ],
	            'rgba'
	        );
	
	        return fullOutput
	            ? {
	                color: color,
	                leftIndex: leftIndex,
	                rightIndex: rightIndex,
	                value: value
	            }
	            : color;
	    }
	
	    /**
	     * @param {string} color
	     * @param {number=} h 0 ~ 360, ignore when null.
	     * @param {number=} s 0 ~ 1, ignore when null.
	     * @param {number=} l 0 ~ 1, ignore when null.
	     * @return {string} Color string in rgba format.
	     * @memberOf module:zrender/util/color
	     */
	    function modifyHSL(color, h, s, l) {
	        color = parse(color);
	
	        if (color) {
	            color = rgba2hsla(color);
	            h != null && (color[0] = clampCssAngle(h));
	            s != null && (color[1] = parseCssFloat(s));
	            l != null && (color[2] = parseCssFloat(l));
	
	            return stringify(hsla2rgba(color), 'rgba');
	        }
	    }
	
	    /**
	     * @param {string} color
	     * @param {number=} alpha 0 ~ 1
	     * @return {string} Color string in rgba format.
	     * @memberOf module:zrender/util/color
	     */
	    function modifyAlpha(color, alpha) {
	        color = parse(color);
	
	        if (color && alpha != null) {
	            color[3] = clampCssFloat(alpha);
	            return stringify(color, 'rgba');
	        }
	    }
	
	    /**
	     * @param {Array.<string>} colors Color list.
	     * @param {string} type 'rgba', 'hsva', ...
	     * @return {string} Result color. (If input illegal, return undefined).
	     */
	    function stringify(arrColor, type) {
	        if (!arrColor) {
	            return;
	        }
	        var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
	        if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
	            colorStr += ',' + arrColor[3];
	        }
	        return type + '(' + colorStr + ')';
	    }
	
	    module.exports = {
	        parse: parse,
	        lift: lift,
	        toHex: toHex,
	        fastMapToColor: fastMapToColor,
	        mapToColor: mapToColor,
	        modifyHSL: modifyHSL,
	        modifyAlpha: modifyAlpha,
	        stringify: stringify
	    };
	
	


/***/ },
/* 20 */
/***/ function(module, exports) {

	// Simple LRU cache use doubly linked list
	// @module zrender/core/LRU
	
	
	    /**
	     * Simple double linked list. Compared with array, it has O(1) remove operation.
	     * @constructor
	     */
	    var LinkedList = function () {
	
	        /**
	         * @type {module:zrender/core/LRU~Entry}
	         */
	        this.head = null;
	
	        /**
	         * @type {module:zrender/core/LRU~Entry}
	         */
	        this.tail = null;
	
	        this._len = 0;
	    };
	
	    var linkedListProto = LinkedList.prototype;
	    /**
	     * Insert a new value at the tail
	     * @param  {} val
	     * @return {module:zrender/core/LRU~Entry}
	     */
	    linkedListProto.insert = function (val) {
	        var entry = new Entry(val);
	        this.insertEntry(entry);
	        return entry;
	    };
	
	    /**
	     * Insert an entry at the tail
	     * @param  {module:zrender/core/LRU~Entry} entry
	     */
	    linkedListProto.insertEntry = function (entry) {
	        if (!this.head) {
	            this.head = this.tail = entry;
	        }
	        else {
	            this.tail.next = entry;
	            entry.prev = this.tail;
	            entry.next = null;
	            this.tail = entry;
	        }
	        this._len++;
	    };
	
	    /**
	     * Remove entry.
	     * @param  {module:zrender/core/LRU~Entry} entry
	     */
	    linkedListProto.remove = function (entry) {
	        var prev = entry.prev;
	        var next = entry.next;
	        if (prev) {
	            prev.next = next;
	        }
	        else {
	            // Is head
	            this.head = next;
	        }
	        if (next) {
	            next.prev = prev;
	        }
	        else {
	            // Is tail
	            this.tail = prev;
	        }
	        entry.next = entry.prev = null;
	        this._len--;
	    };
	
	    /**
	     * @return {number}
	     */
	    linkedListProto.len = function () {
	        return this._len;
	    };
	
	    /**
	     * Clear list
	     */
	    linkedListProto.clear = function () {
	        this.head = this.tail = null;
	        this._len = 0;
	    };
	
	    /**
	     * @constructor
	     * @param {} val
	     */
	    var Entry = function (val) {
	        /**
	         * @type {}
	         */
	        this.value = val;
	
	        /**
	         * @type {module:zrender/core/LRU~Entry}
	         */
	        this.next;
	
	        /**
	         * @type {module:zrender/core/LRU~Entry}
	         */
	        this.prev;
	    };
	
	    /**
	     * LRU Cache
	     * @constructor
	     * @alias module:zrender/core/LRU
	     */
	    var LRU = function (maxSize) {
	
	        this._list = new LinkedList();
	
	        this._map = {};
	
	        this._maxSize = maxSize || 10;
	
	        this._lastRemovedEntry = null;
	    };
	
	    var LRUProto = LRU.prototype;
	
	    /**
	     * @param  {string} key
	     * @param  {} value
	     * @return {} Removed value
	     */
	    LRUProto.put = function (key, value) {
	        var list = this._list;
	        var map = this._map;
	        var removed = null;
	        if (map[key] == null) {
	            var len = list.len();
	            // Reuse last removed entry
	            var entry = this._lastRemovedEntry;
	
	            if (len >= this._maxSize && len > 0) {
	                // Remove the least recently used
	                var leastUsedEntry = list.head;
	                list.remove(leastUsedEntry);
	                delete map[leastUsedEntry.key];
	
	                removed = leastUsedEntry.value;
	                this._lastRemovedEntry = leastUsedEntry;
	            }
	
	            if (entry) {
	                entry.value = value;
	            }
	            else {
	                entry = new Entry(value);
	            }
	            entry.key = key;
	            list.insertEntry(entry);
	            map[key] = entry;
	        }
	
	        return removed;
	    };
	
	    /**
	     * @param  {string} key
	     * @return {}
	     */
	    LRUProto.get = function (key) {
	        var entry = this._map[key];
	        var list = this._list;
	        if (entry != null) {
	            // Put the latest used entry in the tail
	            if (entry !== list.tail) {
	                list.remove(entry);
	                list.insertEntry(entry);
	            }
	
	            return entry.value;
	        }
	    };
	
	    /**
	     * Clear the cache
	     */
	    LRUProto.clear = function () {
	        this._list.clear();
	        this._map = {};
	    };
	
	    module.exports = LRU;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	
	        var config = __webpack_require__(22);
	
	        /**
	         * @exports zrender/tool/log
	         * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	         */
	        module.exports = function() {
	            if (config.debugMode === 0) {
	                return;
	            }
	            else if (config.debugMode == 1) {
	                for (var k in arguments) {
	                    throw new Error(arguments[k]);
	                }
	            }
	            else if (config.debugMode > 1) {
	                for (var k in arguments) {
	                    console.log(arguments[k]);
	                }
	            }
	        };
	
	        /* for debug
	        return function(mes) {
	            document.getElementById('wrong-message').innerHTML =
	                mes + ' ' + (new Date() - 0)
	                + '<br/>'
	                + document.getElementById('wrong-message').innerHTML;
	        };
	        */
	    


/***/ },
/* 22 */
/***/ function(module, exports) {

	
	    var dpr = 1;
	    // If in browser environment
	    if (typeof window !== 'undefined') {
	        dpr = Math.max(window.devicePixelRatio || 1, 1);
	    }
	    /**
	     * config默认配置项
	     * @exports zrender/config
	     * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	     */
	    var config = {
	        /**
	         * debug日志选项：catchBrushException为true下有效
	         * 0 : 不生成debug数据，发布用
	         * 1 : 异常抛出，调试用
	         * 2 : 控制台输出，调试用
	         */
	        debugMode: 0,
	
	        // retina 屏幕优化
	        devicePixelRatio: dpr
	    };
	    module.exports = config;
	
	


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Mixin for drawing text in a element bounding rect
	 * @module zrender/mixin/RectText
	 */
	
	
	
	    var textContain = __webpack_require__(24);
	    var BoundingRect = __webpack_require__(25);
	
	    var tmpRect = new BoundingRect();
	
	    var RectText = function () {};
	
	    function parsePercent(value, maxValue) {
	        if (typeof value === 'string') {
	            if (value.lastIndexOf('%') >= 0) {
	                return parseFloat(value) / 100 * maxValue;
	            }
	            return parseFloat(value);
	        }
	        return value;
	    }
	
	    RectText.prototype = {
	
	        constructor: RectText,
	
	        /**
	         * Draw text in a rect with specified position.
	         * @param  {CanvasRenderingContext} ctx
	         * @param  {Object} rect Displayable rect
	         * @return {Object} textRect Alternative precalculated text bounding rect
	         */
	        drawRectText: function (ctx, rect, textRect) {
	            var style = this.style;
	            var text = style.text;
	            // Convert to string
	            text != null && (text += '');
	            if (!text) {
	                return;
	            }
	
	            // FIXME
	            ctx.save();
	
	            var x;
	            var y;
	            var textPosition = style.textPosition;
	            var textOffset = style.textOffset;
	            var distance = style.textDistance;
	            var align = style.textAlign;
	            var font = style.textFont || style.font;
	            var baseline = style.textBaseline;
	            var verticalAlign = style.textVerticalAlign;
	
	            textRect = textRect || textContain.getBoundingRect(text, font, align, baseline);
	
	            // Transform rect to view space
	            var transform = this.transform;
	            if (!style.textTransform) {
	                if (transform) {
	                    tmpRect.copy(rect);
	                    tmpRect.applyTransform(transform);
	                    rect = tmpRect;
	                }
	            }
	            else {
	                this.setTransform(ctx);
	            }
	
	            // Text position represented by coord
	            if (textPosition instanceof Array) {
	                // Percent
	                x = rect.x + parsePercent(textPosition[0], rect.width);
	                y = rect.y + parsePercent(textPosition[1], rect.height);
	                align = align || 'left';
	                baseline = baseline || 'top';
	
	                if (verticalAlign) {
	                    switch (verticalAlign) {
	                        case 'middle':
	                            y -= textRect.height / 2 - textRect.lineHeight / 2;
	                            break;
	                        case 'bottom':
	                            y -= textRect.height - textRect.lineHeight / 2;
	                            break;
	                        default:
	                            y += textRect.lineHeight / 2;
	                    }
	                    // Force bseline to be middle
	                    baseline = 'middle';
	                }
	            }
	            else {
	                var res = textContain.adjustTextPositionOnRect(
	                    textPosition, rect, textRect, distance
	                );
	                x = res.x;
	                y = res.y;
	                // Default align and baseline when has textPosition
	                align = align || res.textAlign;
	                baseline = baseline || res.textBaseline;
	            }
	
	            if (textOffset) {
	                x += textOffset[0];
	                y += textOffset[1];
	            }
	
	            // Use canvas default left textAlign. Giving invalid value will cause state not change
	            ctx.textAlign = align || 'left';
	            // Use canvas default alphabetic baseline
	            ctx.textBaseline = baseline || 'alphabetic';
	
	            var textFill = style.textFill;
	            var textStroke = style.textStroke;
	            textFill && (ctx.fillStyle = textFill);
	            textStroke && (ctx.strokeStyle = textStroke);
	
	            // TODO Invalid font
	            ctx.font = font || '12px sans-serif';
	
	            // Text shadow
	            // Always set shadowBlur and shadowOffset to avoid leak from displayable
	            ctx.shadowBlur = style.textShadowBlur;
	            ctx.shadowColor = style.textShadowColor || 'transparent';
	            ctx.shadowOffsetX = style.textShadowOffsetX;
	            ctx.shadowOffsetY = style.textShadowOffsetY;
	
	            var textLines = text.split('\n');
	
	            if (style.textRotation) {
	                transform && ctx.translate(transform[4], transform[5]);
	                ctx.rotate(style.textRotation);
	                transform && ctx.translate(-transform[4], -transform[5]);
	            }
	
	            for (var i = 0; i < textLines.length; i++) {
	                    // Fill after stroke so the outline will not cover the main part.
	                textStroke && ctx.strokeText(textLines[i], x, y);
	                textFill && ctx.fillText(textLines[i], x, y);
	                y += textRect.lineHeight;
	            }
	
	            ctx.restore();
	        }
	    };
	
	    module.exports = RectText;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var textWidthCache = {};
	    var textWidthCacheCounter = 0;
	    var TEXT_CACHE_MAX = 5000;
	
	    var util = __webpack_require__(4);
	    var BoundingRect = __webpack_require__(25);
	    var retrieve = util.retrieve;
	
	    function getTextWidth(text, textFont) {
	        var key = text + ':' + textFont;
	        if (textWidthCache[key]) {
	            return textWidthCache[key];
	        }
	
	        var textLines = (text + '').split('\n');
	        var width = 0;
	
	        for (var i = 0, l = textLines.length; i < l; i++) {
	            // measureText 可以被覆盖以兼容不支持 Canvas 的环境
	            width = Math.max(textContain.measureText(textLines[i], textFont).width, width);
	        }
	
	        if (textWidthCacheCounter > TEXT_CACHE_MAX) {
	            textWidthCacheCounter = 0;
	            textWidthCache = {};
	        }
	        textWidthCacheCounter++;
	        textWidthCache[key] = width;
	
	        return width;
	    }
	
	    function getTextRect(text, textFont, textAlign, textBaseline) {
	        var textLineLen = ((text || '') + '').split('\n').length;
	
	        var width = getTextWidth(text, textFont);
	        // FIXME 高度计算比较粗暴
	        var lineHeight = getTextWidth('国', textFont);
	        var height = textLineLen * lineHeight;
	
	        var rect = new BoundingRect(0, 0, width, height);
	        // Text has a special line height property
	        rect.lineHeight = lineHeight;
	
	        switch (textBaseline) {
	            case 'bottom':
	            case 'alphabetic':
	                rect.y -= lineHeight;
	                break;
	            case 'middle':
	                rect.y -= lineHeight / 2;
	                break;
	            // case 'hanging':
	            // case 'top':
	        }
	
	        // FIXME Right to left language
	        switch (textAlign) {
	            case 'end':
	            case 'right':
	                rect.x -= rect.width;
	                break;
	            case 'center':
	                rect.x -= rect.width / 2;
	                break;
	            // case 'start':
	            // case 'left':
	        }
	
	        return rect;
	    }
	
	    function adjustTextPositionOnRect(textPosition, rect, textRect, distance) {
	
	        var x = rect.x;
	        var y = rect.y;
	
	        var height = rect.height;
	        var width = rect.width;
	
	        var textHeight = textRect.height;
	
	        var halfHeight = height / 2 - textHeight / 2;
	
	        var textAlign = 'left';
	
	        switch (textPosition) {
	            case 'left':
	                x -= distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'right':
	                x += distance + width;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'top':
	                x += width / 2;
	                y -= distance + textHeight;
	                textAlign = 'center';
	                break;
	            case 'bottom':
	                x += width / 2;
	                y += height + distance;
	                textAlign = 'center';
	                break;
	            case 'inside':
	                x += width / 2;
	                y += halfHeight;
	                textAlign = 'center';
	                break;
	            case 'insideLeft':
	                x += distance;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'insideRight':
	                x += width - distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'insideTop':
	                x += width / 2;
	                y += distance;
	                textAlign = 'center';
	                break;
	            case 'insideBottom':
	                x += width / 2;
	                y += height - textHeight - distance;
	                textAlign = 'center';
	                break;
	            case 'insideTopLeft':
	                x += distance;
	                y += distance;
	                textAlign = 'left';
	                break;
	            case 'insideTopRight':
	                x += width - distance;
	                y += distance;
	                textAlign = 'right';
	                break;
	            case 'insideBottomLeft':
	                x += distance;
	                y += height - textHeight - distance;
	                break;
	            case 'insideBottomRight':
	                x += width - distance;
	                y += height - textHeight - distance;
	                textAlign = 'right';
	                break;
	        }
	
	        return {
	            x: x,
	            y: y,
	            textAlign: textAlign,
	            textBaseline: 'top'
	        };
	    }
	
	    /**
	     * Show ellipsis if overflow.
	     *
	     * @param  {string} text
	     * @param  {string} containerWidth
	     * @param  {string} textFont
	     * @param  {number} [ellipsis='...']
	     * @param  {Object} [options]
	     * @param  {number} [options.maxIterations=3]
	     * @param  {number} [options.minChar=0] If truncate result are less
	     *                  then minChar, ellipsis will not show, which is
	     *                  better for user hint in some cases.
	     * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
	     * @return {string}
	     */
	    function truncateText(text, containerWidth, textFont, ellipsis, options) {
	        if (!containerWidth) {
	            return '';
	        }
	
	        options = options || {};
	
	        ellipsis = retrieve(ellipsis, '...');
	        var maxIterations = retrieve(options.maxIterations, 2);
	        var minChar = retrieve(options.minChar, 0);
	        // FIXME
	        // Other languages?
	        var cnCharWidth = getTextWidth('国', textFont);
	        // FIXME
	        // Consider proportional font?
	        var ascCharWidth = getTextWidth('a', textFont);
	        var placeholder = retrieve(options.placeholder, '');
	
	        // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
	        // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
	        var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
	        for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
	            contentWidth -= ascCharWidth;
	        }
	
	        var ellipsisWidth = getTextWidth(ellipsis);
	        if (ellipsisWidth > contentWidth) {
	            ellipsis = '';
	            ellipsisWidth = 0;
	        }
	
	        contentWidth = containerWidth - ellipsisWidth;
	
	        var textLines = (text + '').split('\n');
	
	        for (var i = 0, len = textLines.length; i < len; i++) {
	            var textLine = textLines[i];
	            var lineWidth = getTextWidth(textLine, textFont);
	
	            if (lineWidth <= containerWidth) {
	                continue;
	            }
	
	            for (var j = 0;; j++) {
	                if (lineWidth <= contentWidth || j >= maxIterations) {
	                    textLine += ellipsis;
	                    break;
	                }
	
	                var subLength = j === 0
	                    ? estimateLength(textLine, contentWidth, ascCharWidth, cnCharWidth)
	                    : lineWidth > 0
	                    ? Math.floor(textLine.length * contentWidth / lineWidth)
	                    : 0;
	
	                textLine = textLine.substr(0, subLength);
	                lineWidth = getTextWidth(textLine, textFont);
	            }
	
	            if (textLine === '') {
	                textLine = placeholder;
	            }
	
	            textLines[i] = textLine;
	        }
	
	        return textLines.join('\n');
	    }
	
	    function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
	        var width = 0;
	        var i = 0;
	        for (var len = text.length; i < len && width < contentWidth; i++) {
	            var charCode = text.charCodeAt(i);
	            width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
	        }
	        return i;
	    }
	
	    var textContain = {
	
	        getWidth: getTextWidth,
	
	        getBoundingRect: getTextRect,
	
	        adjustTextPositionOnRect: adjustTextPositionOnRect,
	
	        truncateText: truncateText,
	
	        measureText: function (text, textFont) {
	            var ctx = util.getContext();
	            ctx.font = textFont || '12px sans-serif';
	            return ctx.measureText(text);
	        }
	    };
	
	    module.exports = textContain;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module echarts/core/BoundingRect
	 */
	
	
	    var vec2 = __webpack_require__(14);
	    var matrix = __webpack_require__(13);
	
	    var v2ApplyTransform = vec2.applyTransform;
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    /**
	     * @alias module:echarts/core/BoundingRect
	     */
	    function BoundingRect(x, y, width, height) {
	
	        if (width < 0) {
	            x = x + width;
	            width = -width;
	        }
	        if (height < 0) {
	            y = y + height;
	            height = -height;
	        }
	
	        /**
	         * @type {number}
	         */
	        this.x = x;
	        /**
	         * @type {number}
	         */
	        this.y = y;
	        /**
	         * @type {number}
	         */
	        this.width = width;
	        /**
	         * @type {number}
	         */
	        this.height = height;
	    }
	
	    BoundingRect.prototype = {
	
	        constructor: BoundingRect,
	
	        /**
	         * @param {module:echarts/core/BoundingRect} other
	         */
	        union: function (other) {
	            var x = mathMin(other.x, this.x);
	            var y = mathMin(other.y, this.y);
	
	            this.width = mathMax(
	                    other.x + other.width,
	                    this.x + this.width
	                ) - x;
	            this.height = mathMax(
	                    other.y + other.height,
	                    this.y + this.height
	                ) - y;
	            this.x = x;
	            this.y = y;
	        },
	
	        /**
	         * @param {Array.<number>} m
	         * @methods
	         */
	        applyTransform: (function () {
	            var lt = [];
	            var rb = [];
	            var lb = [];
	            var rt = [];
	            return function (m) {
	                // In case usage like this
	                // el.getBoundingRect().applyTransform(el.transform)
	                // And element has no transform
	                if (!m) {
	                    return;
	                }
	                lt[0] = lb[0] = this.x;
	                lt[1] = rt[1] = this.y;
	                rb[0] = rt[0] = this.x + this.width;
	                rb[1] = lb[1] = this.y + this.height;
	
	                v2ApplyTransform(lt, lt, m);
	                v2ApplyTransform(rb, rb, m);
	                v2ApplyTransform(lb, lb, m);
	                v2ApplyTransform(rt, rt, m);
	
	                this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
	                this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
	                var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
	                var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
	                this.width = maxX - this.x;
	                this.height = maxY - this.y;
	            };
	        })(),
	
	        /**
	         * Calculate matrix of transforming from self to target rect
	         * @param  {module:zrender/core/BoundingRect} b
	         * @return {Array.<number>}
	         */
	        calculateTransform: function (b) {
	            var a = this;
	            var sx = b.width / a.width;
	            var sy = b.height / a.height;
	
	            var m = matrix.create();
	
	            // 矩阵右乘
	            matrix.translate(m, m, [-a.x, -a.y]);
	            matrix.scale(m, m, [sx, sy]);
	            matrix.translate(m, m, [b.x, b.y]);
	
	            return m;
	        },
	
	        /**
	         * @param {(module:echarts/core/BoundingRect|Object)} b
	         * @return {boolean}
	         */
	        intersect: function (b) {
	            if (!b) {
	                return false;
	            }
	
	            if (!(b instanceof BoundingRect)) {
	                // Normalize negative width/height.
	                b = BoundingRect.create(b);
	            }
	
	            var a = this;
	            var ax0 = a.x;
	            var ax1 = a.x + a.width;
	            var ay0 = a.y;
	            var ay1 = a.y + a.height;
	
	            var bx0 = b.x;
	            var bx1 = b.x + b.width;
	            var by0 = b.y;
	            var by1 = b.y + b.height;
	
	            return ! (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
	        },
	
	        contain: function (x, y) {
	            var rect = this;
	            return x >= rect.x
	                && x <= (rect.x + rect.width)
	                && y >= rect.y
	                && y <= (rect.y + rect.height);
	        },
	
	        /**
	         * @return {module:echarts/core/BoundingRect}
	         */
	        clone: function () {
	            return new BoundingRect(this.x, this.y, this.width, this.height);
	        },
	
	        /**
	         * Copy from another rect
	         */
	        copy: function (other) {
	            this.x = other.x;
	            this.y = other.y;
	            this.width = other.width;
	            this.height = other.height;
	        },
	
	        plain: function () {
	            return {
	                x: this.x,
	                y: this.y,
	                width: this.width,
	                height: this.height
	            };
	        }
	    };
	
	    /**
	     * @param {Object|module:zrender/core/BoundingRect} rect
	     * @param {number} rect.x
	     * @param {number} rect.y
	     * @param {number} rect.width
	     * @param {number} rect.height
	     * @return {module:zrender/core/BoundingRect}
	     */
	    BoundingRect.create = function (rect) {
	        return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
	    };
	
	    module.exports = BoundingRect;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
	 * 可以用于 isInsidePath 判断以及获取boundingRect
	 *
	 * @module zrender/core/PathProxy
	 * @author Yi Shen (http://www.github.com/pissang)
	 */
	
	 // TODO getTotalLength, getPointAtLength
	
	
	    var curve = __webpack_require__(27);
	    var vec2 = __webpack_require__(14);
	    var bbox = __webpack_require__(28);
	    var BoundingRect = __webpack_require__(25);
	    var dpr = __webpack_require__(22).devicePixelRatio;
	
	    var CMD = {
	        M: 1,
	        L: 2,
	        C: 3,
	        Q: 4,
	        A: 5,
	        Z: 6,
	        // Rect
	        R: 7
	    };
	
	    var min = [];
	    var max = [];
	    var min2 = [];
	    var max2 = [];
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    var mathCos = Math.cos;
	    var mathSin = Math.sin;
	    var mathSqrt = Math.sqrt;
	    var mathAbs = Math.abs;
	
	    var hasTypedArray = typeof Float32Array != 'undefined';
	
	    /**
	     * @alias module:zrender/core/PathProxy
	     * @constructor
	     */
	    var PathProxy = function () {
	
	        /**
	         * Path data. Stored as flat array
	         * @type {Array.<Object>}
	         */
	        this.data = [];
	
	        this._len = 0;
	
	        this._ctx = null;
	
	        this._xi = 0;
	        this._yi = 0;
	
	        this._x0 = 0;
	        this._y0 = 0;
	
	        // Unit x, Unit y. Provide for avoiding drawing that too short line segment
	        this._ux = 0;
	        this._uy = 0;
	    };
	
	    /**
	     * 快速计算Path包围盒（并不是最小包围盒）
	     * @return {Object}
	     */
	    PathProxy.prototype = {
	
	        constructor: PathProxy,
	
	        _lineDash: null,
	
	        _dashOffset: 0,
	
	        _dashIdx: 0,
	
	        _dashSum: 0,
	
	        /**
	         * @readOnly
	         */
	        setScale: function (sx, sy) {
	            this._ux = mathAbs(1 / dpr / sx) || 0;
	            this._uy = mathAbs(1 / dpr / sy) || 0;
	        },
	
	        getContext: function () {
	            return this._ctx;
	        },
	
	        /**
	         * @param  {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        beginPath: function (ctx) {
	
	            this._ctx = ctx;
	
	            ctx && ctx.beginPath();
	
	            ctx && (this.dpr = ctx.dpr);
	
	            // Reset
	            this._len = 0;
	
	            if (this._lineDash) {
	                this._lineDash = null;
	
	                this._dashOffset = 0;
	            }
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x
	         * @param  {number} y
	         * @return {module:zrender/core/PathProxy}
	         */
	        moveTo: function (x, y) {
	            this.addData(CMD.M, x, y);
	            this._ctx && this._ctx.moveTo(x, y);
	
	            // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
	            // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
	            // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
	            // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持
	            this._x0 = x;
	            this._y0 = y;
	
	            this._xi = x;
	            this._yi = y;
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x
	         * @param  {number} y
	         * @return {module:zrender/core/PathProxy}
	         */
	        lineTo: function (x, y) {
	            var exceedUnit = mathAbs(x - this._xi) > this._ux
	                || mathAbs(y - this._yi) > this._uy
	                // Force draw the first segment
	                || this._len < 5;
	
	            this.addData(CMD.L, x, y);
	
	            if (this._ctx && exceedUnit) {
	                this._needsDash() ? this._dashedLineTo(x, y)
	                    : this._ctx.lineTo(x, y);
	            }
	            if (exceedUnit) {
	                this._xi = x;
	                this._yi = y;
	            }
	
	            return this;
	        },
	
	        /**
	         * @param  {number} x1
	         * @param  {number} y1
	         * @param  {number} x2
	         * @param  {number} y2
	         * @param  {number} x3
	         * @param  {number} y3
	         * @return {module:zrender/core/PathProxy}
	         */
	        bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
	            this.addData(CMD.C, x1, y1, x2, y2, x3, y3);
	            if (this._ctx) {
	                this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3)
	                    : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
	            }
	            this._xi = x3;
	            this._yi = y3;
	            return this;
	        },
	
	        /**
	         * @param  {number} x1
	         * @param  {number} y1
	         * @param  {number} x2
	         * @param  {number} y2
	         * @return {module:zrender/core/PathProxy}
	         */
	        quadraticCurveTo: function (x1, y1, x2, y2) {
	            this.addData(CMD.Q, x1, y1, x2, y2);
	            if (this._ctx) {
	                this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2)
	                    : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
	            }
	            this._xi = x2;
	            this._yi = y2;
	            return this;
	        },
	
	        /**
	         * @param  {number} cx
	         * @param  {number} cy
	         * @param  {number} r
	         * @param  {number} startAngle
	         * @param  {number} endAngle
	         * @param  {boolean} anticlockwise
	         * @return {module:zrender/core/PathProxy}
	         */
	        arc: function (cx, cy, r, startAngle, endAngle, anticlockwise) {
	            this.addData(
	                CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1
	            );
	            this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
	
	            this._xi = mathCos(endAngle) * r + cx;
	            this._yi = mathSin(endAngle) * r + cx;
	            return this;
	        },
	
	        // TODO
	        arcTo: function (x1, y1, x2, y2, radius) {
	            if (this._ctx) {
	                this._ctx.arcTo(x1, y1, x2, y2, radius);
	            }
	            return this;
	        },
	
	        // TODO
	        rect: function (x, y, w, h) {
	            this._ctx && this._ctx.rect(x, y, w, h);
	            this.addData(CMD.R, x, y, w, h);
	            return this;
	        },
	
	        /**
	         * @return {module:zrender/core/PathProxy}
	         */
	        closePath: function () {
	            this.addData(CMD.Z);
	
	            var ctx = this._ctx;
	            var x0 = this._x0;
	            var y0 = this._y0;
	            if (ctx) {
	                this._needsDash() && this._dashedLineTo(x0, y0);
	                ctx.closePath();
	            }
	
	            this._xi = x0;
	            this._yi = y0;
	            return this;
	        },
	
	        /**
	         * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
	         * stroke 同样
	         * @param {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        fill: function (ctx) {
	            ctx && ctx.fill();
	            this.toStatic();
	        },
	
	        /**
	         * @param {CanvasRenderingContext2D} ctx
	         * @return {module:zrender/core/PathProxy}
	         */
	        stroke: function (ctx) {
	            ctx && ctx.stroke();
	            this.toStatic();
	        },
	
	        /**
	         * 必须在其它绘制命令前调用
	         * Must be invoked before all other path drawing methods
	         * @return {module:zrender/core/PathProxy}
	         */
	        setLineDash: function (lineDash) {
	            if (lineDash instanceof Array) {
	                this._lineDash = lineDash;
	
	                this._dashIdx = 0;
	
	                var lineDashSum = 0;
	                for (var i = 0; i < lineDash.length; i++) {
	                    lineDashSum += lineDash[i];
	                }
	                this._dashSum = lineDashSum;
	            }
	            return this;
	        },
	
	        /**
	         * 必须在其它绘制命令前调用
	         * Must be invoked before all other path drawing methods
	         * @return {module:zrender/core/PathProxy}
	         */
	        setLineDashOffset: function (offset) {
	            this._dashOffset = offset;
	            return this;
	        },
	
	        /**
	         *
	         * @return {boolean}
	         */
	        len: function () {
	            return this._len;
	        },
	
	        /**
	         * 直接设置 Path 数据
	         */
	        setData: function (data) {
	
	            var len = data.length;
	
	            if (! (this.data && this.data.length == len) && hasTypedArray) {
	                this.data = new Float32Array(len);
	            }
	
	            for (var i = 0; i < len; i++) {
	                this.data[i] = data[i];
	            }
	
	            this._len = len;
	        },
	
	        /**
	         * 添加子路径
	         * @param {module:zrender/core/PathProxy|Array.<module:zrender/core/PathProxy>} path
	         */
	        appendPath: function (path) {
	            if (!(path instanceof Array)) {
	                path = [path];
	            }
	            var len = path.length;
	            var appendSize = 0;
	            var offset = this._len;
	            for (var i = 0; i < len; i++) {
	                appendSize += path[i].len();
	            }
	            if (hasTypedArray && (this.data instanceof Float32Array)) {
	                this.data = new Float32Array(offset + appendSize);
	            }
	            for (var i = 0; i < len; i++) {
	                var appendPathData = path[i].data;
	                for (var k = 0; k < appendPathData.length; k++) {
	                    this.data[offset++] = appendPathData[k];
	                }
	            }
	            this._len = offset;
	        },
	
	        /**
	         * 填充 Path 数据。
	         * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
	         */
	        addData: function (cmd) {
	            var data = this.data;
	            if (this._len + arguments.length > data.length) {
	                // 因为之前的数组已经转换成静态的 Float32Array
	                // 所以不够用时需要扩展一个新的动态数组
	                this._expandData();
	                data = this.data;
	            }
	            for (var i = 0; i < arguments.length; i++) {
	                data[this._len++] = arguments[i];
	            }
	
	            this._prevCmd = cmd;
	        },
	
	        _expandData: function () {
	            // Only if data is Float32Array
	            if (!(this.data instanceof Array)) {
	                var newData = [];
	                for (var i = 0; i < this._len; i++) {
	                    newData[i] = this.data[i];
	                }
	                this.data = newData;
	            }
	        },
	
	        /**
	         * If needs js implemented dashed line
	         * @return {boolean}
	         * @private
	         */
	        _needsDash: function () {
	            return this._lineDash;
	        },
	
	        _dashedLineTo: function (x1, y1) {
	            var dashSum = this._dashSum;
	            var offset = this._dashOffset;
	            var lineDash = this._lineDash;
	            var ctx = this._ctx;
	
	            var x0 = this._xi;
	            var y0 = this._yi;
	            var dx = x1 - x0;
	            var dy = y1 - y0;
	            var dist = mathSqrt(dx * dx + dy * dy);
	            var x = x0;
	            var y = y0;
	            var dash;
	            var nDash = lineDash.length;
	            var idx;
	            dx /= dist;
	            dy /= dist;
	
	            if (offset < 0) {
	                // Convert to positive offset
	                offset = dashSum + offset;
	            }
	            offset %= dashSum;
	            x -= offset * dx;
	            y -= offset * dy;
	
	            while ((dx > 0 && x <= x1) || (dx < 0 && x >= x1)
	            || (dx == 0 && ((dy > 0 && y <= y1) || (dy < 0 && y >= y1)))) {
	                idx = this._dashIdx;
	                dash = lineDash[idx];
	                x += dx * dash;
	                y += dy * dash;
	                this._dashIdx = (idx + 1) % nDash;
	                // Skip positive offset
	                if ((dx > 0 && x < x0) || (dx < 0 && x > x0) || (dy > 0 && y < y0) || (dy < 0 && y > y0)) {
	                    continue;
	                }
	                ctx[idx % 2 ? 'moveTo' : 'lineTo'](
	                    dx >= 0 ? mathMin(x, x1) : mathMax(x, x1),
	                    dy >= 0 ? mathMin(y, y1) : mathMax(y, y1)
	                );
	            }
	            // Offset for next lineTo
	            dx = x - x1;
	            dy = y - y1;
	            this._dashOffset = -mathSqrt(dx * dx + dy * dy);
	        },
	
	        // Not accurate dashed line to
	        _dashedBezierTo: function (x1, y1, x2, y2, x3, y3) {
	            var dashSum = this._dashSum;
	            var offset = this._dashOffset;
	            var lineDash = this._lineDash;
	            var ctx = this._ctx;
	
	            var x0 = this._xi;
	            var y0 = this._yi;
	            var t;
	            var dx;
	            var dy;
	            var cubicAt = curve.cubicAt;
	            var bezierLen = 0;
	            var idx = this._dashIdx;
	            var nDash = lineDash.length;
	
	            var x;
	            var y;
	
	            var tmpLen = 0;
	
	            if (offset < 0) {
	                // Convert to positive offset
	                offset = dashSum + offset;
	            }
	            offset %= dashSum;
	            // Bezier approx length
	            for (t = 0; t < 1; t += 0.1) {
	                dx = cubicAt(x0, x1, x2, x3, t + 0.1)
	                    - cubicAt(x0, x1, x2, x3, t);
	                dy = cubicAt(y0, y1, y2, y3, t + 0.1)
	                    - cubicAt(y0, y1, y2, y3, t);
	                bezierLen += mathSqrt(dx * dx + dy * dy);
	            }
	
	            // Find idx after add offset
	            for (; idx < nDash; idx++) {
	                tmpLen += lineDash[idx];
	                if (tmpLen > offset) {
	                    break;
	                }
	            }
	            t = (tmpLen - offset) / bezierLen;
	
	            while (t <= 1) {
	
	                x = cubicAt(x0, x1, x2, x3, t);
	                y = cubicAt(y0, y1, y2, y3, t);
	
	                // Use line to approximate dashed bezier
	                // Bad result if dash is long
	                idx % 2 ? ctx.moveTo(x, y)
	                    : ctx.lineTo(x, y);
	
	                t += lineDash[idx] / bezierLen;
	
	                idx = (idx + 1) % nDash;
	            }
	
	            // Finish the last segment and calculate the new offset
	            (idx % 2 !== 0) && ctx.lineTo(x3, y3);
	            dx = x3 - x;
	            dy = y3 - y;
	            this._dashOffset = -mathSqrt(dx * dx + dy * dy);
	        },
	
	        _dashedQuadraticTo: function (x1, y1, x2, y2) {
	            // Convert quadratic to cubic using degree elevation
	            var x3 = x2;
	            var y3 = y2;
	            x2 = (x2 + 2 * x1) / 3;
	            y2 = (y2 + 2 * y1) / 3;
	            x1 = (this._xi + 2 * x1) / 3;
	            y1 = (this._yi + 2 * y1) / 3;
	
	            this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
	        },
	
	        /**
	         * 转成静态的 Float32Array 减少堆内存占用
	         * Convert dynamic array to static Float32Array
	         */
	        toStatic: function () {
	            var data = this.data;
	            if (data instanceof Array) {
	                data.length = this._len;
	                if (hasTypedArray) {
	                    this.data = new Float32Array(data);
	                }
	            }
	        },
	
	        /**
	         * @return {module:zrender/core/BoundingRect}
	         */
	        getBoundingRect: function () {
	            min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
	            max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
	
	            var data = this.data;
	            var xi = 0;
	            var yi = 0;
	            var x0 = 0;
	            var y0 = 0;
	
	            for (var i = 0; i < data.length;) {
	                var cmd = data[i++];
	
	                if (i == 1) {
	                    // 如果第一个命令是 L, C, Q
	                    // 则 previous point 同绘制命令的第一个 point
	                    //
	                    // 第一个命令为 Arc 的情况下会在后面特殊处理
	                    xi = data[i];
	                    yi = data[i + 1];
	
	                    x0 = xi;
	                    y0 = yi;
	                }
	
	                switch (cmd) {
	                    case CMD.M:
	                        // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
	                        // 在 closePath 的时候使用
	                        x0 = data[i++];
	                        y0 = data[i++];
	                        xi = x0;
	                        yi = y0;
	                        min2[0] = x0;
	                        min2[1] = y0;
	                        max2[0] = x0;
	                        max2[1] = y0;
	                        break;
	                    case CMD.L:
	                        bbox.fromLine(xi, yi, data[i], data[i + 1], min2, max2);
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.C:
	                        bbox.fromCubic(
	                            xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            min2, max2
	                        );
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.Q:
	                        bbox.fromQuadratic(
	                            xi, yi, data[i++], data[i++], data[i], data[i + 1],
	                            min2, max2
	                        );
	                        xi = data[i++];
	                        yi = data[i++];
	                        break;
	                    case CMD.A:
	                        // TODO Arc 判断的开销比较大
	                        var cx = data[i++];
	                        var cy = data[i++];
	                        var rx = data[i++];
	                        var ry = data[i++];
	                        var startAngle = data[i++];
	                        var endAngle = data[i++] + startAngle;
	                        // TODO Arc 旋转
	                        var psi = data[i++];
	                        var anticlockwise = 1 - data[i++];
	
	                        if (i == 1) {
	                            // 直接使用 arc 命令
	                            // 第一个命令起点还未定义
	                            x0 = mathCos(startAngle) * rx + cx;
	                            y0 = mathSin(startAngle) * ry + cy;
	                        }
	
	                        bbox.fromArc(
	                            cx, cy, rx, ry, startAngle, endAngle,
	                            anticlockwise, min2, max2
	                        );
	
	                        xi = mathCos(endAngle) * rx + cx;
	                        yi = mathSin(endAngle) * ry + cy;
	                        break;
	                    case CMD.R:
	                        x0 = xi = data[i++];
	                        y0 = yi = data[i++];
	                        var width = data[i++];
	                        var height = data[i++];
	                        // Use fromLine
	                        bbox.fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
	                        break;
	                    case CMD.Z:
	                        xi = x0;
	                        yi = y0;
	                        break;
	                }
	
	                // Union
	                vec2.min(min, min, min2);
	                vec2.max(max, max, max2);
	            }
	
	            // No data
	            if (i === 0) {
	                min[0] = min[1] = max[0] = max[1] = 0;
	            }
	
	            return new BoundingRect(
	                min[0], min[1], max[0] - min[0], max[1] - min[1]
	            );
	        },
	
	        /**
	         * Rebuild path from current data
	         * Rebuild path will not consider javascript implemented line dash.
	         * @param {CanvasRenderingContext} ctx
	         */
	        rebuildPath: function (ctx) {
	            var d = this.data;
	            var x0, y0;
	            var xi, yi;
	            var x, y;
	            var ux = this._ux;
	            var uy = this._uy;
	            var len = this._len;
	            for (var i = 0; i < len;) {
	                var cmd = d[i++];
	
	                if (i == 1) {
	                    // 如果第一个命令是 L, C, Q
	                    // 则 previous point 同绘制命令的第一个 point
	                    //
	                    // 第一个命令为 Arc 的情况下会在后面特殊处理
	                    xi = d[i];
	                    yi = d[i + 1];
	
	                    x0 = xi;
	                    y0 = yi;
	                }
	                switch (cmd) {
	                    case CMD.M:
	                        x0 = xi = d[i++];
	                        y0 = yi = d[i++];
	                        ctx.moveTo(xi, yi);
	                        break;
	                    case CMD.L:
	                        x = d[i++];
	                        y = d[i++];
	                        // Not draw too small seg between
	                        if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len - 1) {
	                            ctx.lineTo(x, y);
	                            xi = x;
	                            yi = y;
	                        }
	                        break;
	                    case CMD.C:
	                        ctx.bezierCurveTo(
	                            d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]
	                        );
	                        xi = d[i - 2];
	                        yi = d[i - 1];
	                        break;
	                    case CMD.Q:
	                        ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
	                        xi = d[i - 2];
	                        yi = d[i - 1];
	                        break;
	                    case CMD.A:
	                        var cx = d[i++];
	                        var cy = d[i++];
	                        var rx = d[i++];
	                        var ry = d[i++];
	                        var theta = d[i++];
	                        var dTheta = d[i++];
	                        var psi = d[i++];
	                        var fs = d[i++];
	                        var r = (rx > ry) ? rx : ry;
	                        var scaleX = (rx > ry) ? 1 : rx / ry;
	                        var scaleY = (rx > ry) ? ry / rx : 1;
	                        var isEllipse = Math.abs(rx - ry) > 1e-3;
	                        var endAngle = theta + dTheta;
	                        if (isEllipse) {
	                            ctx.translate(cx, cy);
	                            ctx.rotate(psi);
	                            ctx.scale(scaleX, scaleY);
	                            ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
	                            ctx.scale(1 / scaleX, 1 / scaleY);
	                            ctx.rotate(-psi);
	                            ctx.translate(-cx, -cy);
	                        }
	                        else {
	                            ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
	                        }
	
	                        if (i == 1) {
	                            // 直接使用 arc 命令
	                            // 第一个命令起点还未定义
	                            x0 = mathCos(theta) * rx + cx;
	                            y0 = mathSin(theta) * ry + cy;
	                        }
	                        xi = mathCos(endAngle) * rx + cx;
	                        yi = mathSin(endAngle) * ry + cy;
	                        break;
	                    case CMD.R:
	                        x0 = xi = d[i];
	                        y0 = yi = d[i + 1];
	                        ctx.rect(d[i++], d[i++], d[i++], d[i++]);
	                        break;
	                    case CMD.Z:
	                        ctx.closePath();
	                        xi = x0;
	                        yi = y0;
	                }
	            }
	        }
	    };
	
	    PathProxy.CMD = CMD;
	
	    module.exports = PathProxy;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 曲线辅助模块
	 * @module zrender/core/curve
	 * @author pissang(https://www.github.com/pissang)
	 */
	
	
	    var vec2 = __webpack_require__(14);
	    var v2Create = vec2.create;
	    var v2DistSquare = vec2.distSquare;
	    var mathPow = Math.pow;
	    var mathSqrt = Math.sqrt;
	
	    var EPSILON = 1e-8;
	    var EPSILON_NUMERIC = 1e-4;
	
	    var THREE_SQRT = mathSqrt(3);
	    var ONE_THIRD = 1 / 3;
	
	    // 临时变量
	    var _v0 = v2Create();
	    var _v1 = v2Create();
	    var _v2 = v2Create();
	    // var _v3 = vec2.create();
	
	    function isAroundZero(val) {
	        return val > -EPSILON && val < EPSILON;
	    }
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }
	    /**
	     * 计算三次贝塞尔值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return onet * onet * (onet * p0 + 3 * t * p1)
	             + t * t * (t * p3 + 3 * onet * p2);
	    }
	
	    /**
	     * 计算三次贝塞尔导数值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicDerivativeAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return 3 * (
	            ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
	            + (p3 - p2) * t * t
	        );
	    }
	
	    /**
	     * 计算三次贝塞尔方程根，使用盛金公式
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} val
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function cubicRootAt(p0, p1, p2, p3, val, roots) {
	        // Evaluate roots of cubic functions
	        var a = p3 + 3 * (p1 - p2) - p0;
	        var b = 3 * (p2 - p1 * 2 + p0);
	        var c = 3 * (p1  - p0);
	        var d = p0 - val;
	
	        var A = b * b - 3 * a * c;
	        var B = b * c - 9 * a * d;
	        var C = c * c - 3 * b * d;
	
	        var n = 0;
	
	        if (isAroundZero(A) && isAroundZero(B)) {
	            if (isAroundZero(b)) {
	                roots[0] = 0;
	            }
	            else {
	                var t1 = -c / b;  //t1, t2, t3, b is not zero
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = B * B - 4 * A * C;
	
	            if (isAroundZero(disc)) {
	                var K = B / A;
	                var t1 = -b / a + K;  // t1, a is not zero
	                var t2 = -K / 2;  // t2, t3
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var Y1 = A * b + 1.5 * a * (-B + discSqrt);
	                var Y2 = A * b + 1.5 * a * (-B - discSqrt);
	                if (Y1 < 0) {
	                    Y1 = -mathPow(-Y1, ONE_THIRD);
	                }
	                else {
	                    Y1 = mathPow(Y1, ONE_THIRD);
	                }
	                if (Y2 < 0) {
	                    Y2 = -mathPow(-Y2, ONE_THIRD);
	                }
	                else {
	                    Y2 = mathPow(Y2, ONE_THIRD);
	                }
	                var t1 = (-b - (Y1 + Y2)) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else {
	                var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt(A * A * A));
	                var theta = Math.acos(T) / 3;
	                var ASqrt = mathSqrt(A);
	                var tmp = Math.cos(theta);
	
	                var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
	                var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
	                var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	                if (t3 >= 0 && t3 <= 1) {
	                    roots[n++] = t3;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 计算三次贝塞尔方程极限值的位置
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {Array.<number>} extrema
	     * @return {number} 有效数目
	     */
	    function cubicExtrema(p0, p1, p2, p3, extrema) {
	        var b = 6 * p2 - 12 * p1 + 6 * p0;
	        var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
	        var c = 3 * p1 - 3 * p0;
	
	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <=1) {
	                    extrema[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                extrema[0] = -b / (2 * a);
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    extrema[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    extrema[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 细分三次贝塞尔曲线
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function cubicSubdivide(p0, p1, p2, p3, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p23 = (p3 - p2) * t + p2;
	
	        var p012 = (p12 - p01) * t + p01;
	        var p123 = (p23 - p12) * t + p12;
	
	        var p0123 = (p123 - p012) * t + p012;
	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;
	        out[3] = p0123;
	        // Seg1
	        out[4] = p0123;
	        out[5] = p123;
	        out[6] = p23;
	        out[7] = p3;
	    }
	
	    /**
	     * 投射点到三次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x3
	     * @param {number} y3
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} [out] 投射点
	     * @return {number}
	     */
	    function cubicProjectPoint(
	        x0, y0, x1, y1, x2, y2, x3, y3,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;
	        var prev;
	        var next;
	        var d1;
	        var d2;
	
	        _v0[0] = x;
	        _v0[1] = y;
	
	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = cubicAt(x0, x1, x2, x3, _t);
	            _v1[1] = cubicAt(y0, y1, y2, y3, _t);
	            d1 = v2DistSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;
	
	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON_NUMERIC) {
	                break;
	            }
	            prev = t - interval;
	            next = t + interval;
	            // t - interval
	            _v1[0] = cubicAt(x0, x1, x2, x3, prev);
	            _v1[1] = cubicAt(y0, y1, y2, y3, prev);
	
	            d1 = v2DistSquare(_v1, _v0);
	
	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = cubicAt(x0, x1, x2, x3, next);
	                _v2[1] = cubicAt(y0, y1, y2, y3, next);
	                d2 = v2DistSquare(_v2, _v0);
	
	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = cubicAt(x0, x1, x2, x3, t);
	            out[1] = cubicAt(y0, y1, y2, y3, t);
	        }
	        // console.log(interval, i);
	        return mathSqrt(d);
	    }
	
	    /**
	     * 计算二次方贝塞尔值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticAt(p0, p1, p2, t) {
	        var onet = 1 - t;
	        return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
	    }
	
	    /**
	     * 计算二次方贝塞尔导数值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticDerivativeAt(p0, p1, p2, t) {
	        return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
	    }
	
	    /**
	     * 计算二次方贝塞尔方程根
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function quadraticRootAt(p0, p1, p2, val, roots) {
	        var a = p0 - 2 * p1 + p2;
	        var b = 2 * (p1 - p0);
	        var c = p0 - val;
	
	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                var t1 = -b / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = mathSqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }
	
	    /**
	     * 计算二次贝塞尔方程极限值
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @return {number}
	     */
	    function quadraticExtremum(p0, p1, p2) {
	        var divider = p0 + p2 - 2 * p1;
	        if (divider === 0) {
	            // p1 is center of p0 and p2
	            return 0.5;
	        }
	        else {
	            return (p0 - p1) / divider;
	        }
	    }
	
	    /**
	     * 细分二次贝塞尔曲线
	     * @memberOf module:zrender/core/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function quadraticSubdivide(p0, p1, p2, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p012 = (p12 - p01) * t + p01;
	
	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;
	
	        // Seg1
	        out[3] = p012;
	        out[4] = p12;
	        out[5] = p2;
	    }
	
	    /**
	     * 投射点到二次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} out 投射点
	     * @return {number}
	     */
	    function quadraticProjectPoint(
	        x0, y0, x1, y1, x2, y2,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;
	
	        _v0[0] = x;
	        _v0[1] = y;
	
	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = quadraticAt(x0, x1, x2, _t);
	            _v1[1] = quadraticAt(y0, y1, y2, _t);
	            var d1 = v2DistSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;
	
	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON_NUMERIC) {
	                break;
	            }
	            var prev = t - interval;
	            var next = t + interval;
	            // t - interval
	            _v1[0] = quadraticAt(x0, x1, x2, prev);
	            _v1[1] = quadraticAt(y0, y1, y2, prev);
	
	            var d1 = v2DistSquare(_v1, _v0);
	
	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = quadraticAt(x0, x1, x2, next);
	                _v2[1] = quadraticAt(y0, y1, y2, next);
	                var d2 = v2DistSquare(_v2, _v0);
	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = quadraticAt(x0, x1, x2, t);
	            out[1] = quadraticAt(y0, y1, y2, t);
	        }
	        // console.log(interval, i);
	        return mathSqrt(d);
	    }
	
	    module.exports = {
	
	        cubicAt: cubicAt,
	
	        cubicDerivativeAt: cubicDerivativeAt,
	
	        cubicRootAt: cubicRootAt,
	
	        cubicExtrema: cubicExtrema,
	
	        cubicSubdivide: cubicSubdivide,
	
	        cubicProjectPoint: cubicProjectPoint,
	
	        quadraticAt: quadraticAt,
	
	        quadraticDerivativeAt: quadraticDerivativeAt,
	
	        quadraticRootAt: quadraticRootAt,
	
	        quadraticExtremum: quadraticExtremum,
	
	        quadraticSubdivide: quadraticSubdivide,
	
	        quadraticProjectPoint: quadraticProjectPoint
	    };


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Yi Shen(https://github.com/pissang)
	 */
	
	
	    var vec2 = __webpack_require__(14);
	    var curve = __webpack_require__(27);
	
	    var bbox = {};
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    var mathSin = Math.sin;
	    var mathCos = Math.cos;
	
	    var start = vec2.create();
	    var end = vec2.create();
	    var extremity = vec2.create();
	
	    var PI2 = Math.PI * 2;
	    /**
	     * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
	     * @module zrender/core/bbox
	     * @param {Array<Object>} points 顶点数组
	     * @param {number} min
	     * @param {number} max
	     */
	    bbox.fromPoints = function(points, min, max) {
	        if (points.length === 0) {
	            return;
	        }
	        var p = points[0];
	        var left = p[0];
	        var right = p[0];
	        var top = p[1];
	        var bottom = p[1];
	        var i;
	
	        for (i = 1; i < points.length; i++) {
	            p = points[i];
	            left = mathMin(left, p[0]);
	            right = mathMax(right, p[0]);
	            top = mathMin(top, p[1]);
	            bottom = mathMax(bottom, p[1]);
	        }
	
	        min[0] = left;
	        min[1] = top;
	        max[0] = right;
	        max[1] = bottom;
	    };
	
	    /**
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromLine = function (x0, y0, x1, y1, min, max) {
	        min[0] = mathMin(x0, x1);
	        min[1] = mathMin(y0, y1);
	        max[0] = mathMax(x0, x1);
	        max[1] = mathMax(y0, y1);
	    };
	
	    var xDim = [];
	    var yDim = [];
	    /**
	     * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x3
	     * @param {number} y3
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromCubic = function(
	        x0, y0, x1, y1, x2, y2, x3, y3, min, max
	    ) {
	        var cubicExtrema = curve.cubicExtrema;
	        var cubicAt = curve.cubicAt;
	        var i;
	        var n = cubicExtrema(x0, x1, x2, x3, xDim);
	        min[0] = Infinity;
	        min[1] = Infinity;
	        max[0] = -Infinity;
	        max[1] = -Infinity;
	
	        for (i = 0; i < n; i++) {
	            var x = cubicAt(x0, x1, x2, x3, xDim[i]);
	            min[0] = mathMin(x, min[0]);
	            max[0] = mathMax(x, max[0]);
	        }
	        n = cubicExtrema(y0, y1, y2, y3, yDim);
	        for (i = 0; i < n; i++) {
	            var y = cubicAt(y0, y1, y2, y3, yDim[i]);
	            min[1] = mathMin(y, min[1]);
	            max[1] = mathMax(y, max[1]);
	        }
	
	        min[0] = mathMin(x0, min[0]);
	        max[0] = mathMax(x0, max[0]);
	        min[0] = mathMin(x3, min[0]);
	        max[0] = mathMax(x3, max[0]);
	
	        min[1] = mathMin(y0, min[1]);
	        max[1] = mathMax(y0, max[1]);
	        min[1] = mathMin(y3, min[1]);
	        max[1] = mathMax(y3, max[1]);
	    };
	
	    /**
	     * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromQuadratic = function(x0, y0, x1, y1, x2, y2, min, max) {
	        var quadraticExtremum = curve.quadraticExtremum;
	        var quadraticAt = curve.quadraticAt;
	        // Find extremities, where derivative in x dim or y dim is zero
	        var tx =
	            mathMax(
	                mathMin(quadraticExtremum(x0, x1, x2), 1), 0
	            );
	        var ty =
	            mathMax(
	                mathMin(quadraticExtremum(y0, y1, y2), 1), 0
	            );
	
	        var x = quadraticAt(x0, x1, x2, tx);
	        var y = quadraticAt(y0, y1, y2, ty);
	
	        min[0] = mathMin(x0, x2, x);
	        min[1] = mathMin(y0, y2, y);
	        max[0] = mathMax(x0, x2, x);
	        max[1] = mathMax(y0, y2, y);
	    };
	
	    /**
	     * 从圆弧中计算出最小包围盒，写入`min`和`max`中
	     * @method
	     * @memberOf module:zrender/core/bbox
	     * @param {number} x
	     * @param {number} y
	     * @param {number} rx
	     * @param {number} ry
	     * @param {number} startAngle
	     * @param {number} endAngle
	     * @param {number} anticlockwise
	     * @param {Array.<number>} min
	     * @param {Array.<number>} max
	     */
	    bbox.fromArc = function (
	        x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max
	    ) {
	        var vec2Min = vec2.min;
	        var vec2Max = vec2.max;
	
	        var diff = Math.abs(startAngle - endAngle);
	
	
	        if (diff % PI2 < 1e-4 && diff > 1e-4) {
	            // Is a circle
	            min[0] = x - rx;
	            min[1] = y - ry;
	            max[0] = x + rx;
	            max[1] = y + ry;
	            return;
	        }
	
	        start[0] = mathCos(startAngle) * rx + x;
	        start[1] = mathSin(startAngle) * ry + y;
	
	        end[0] = mathCos(endAngle) * rx + x;
	        end[1] = mathSin(endAngle) * ry + y;
	
	        vec2Min(min, start, end);
	        vec2Max(max, start, end);
	
	        // Thresh to [0, Math.PI * 2]
	        startAngle = startAngle % (PI2);
	        if (startAngle < 0) {
	            startAngle = startAngle + PI2;
	        }
	        endAngle = endAngle % (PI2);
	        if (endAngle < 0) {
	            endAngle = endAngle + PI2;
	        }
	
	        if (startAngle > endAngle && !anticlockwise) {
	            endAngle += PI2;
	        }
	        else if (startAngle < endAngle && anticlockwise) {
	            startAngle += PI2;
	        }
	        if (anticlockwise) {
	            var tmp = endAngle;
	            endAngle = startAngle;
	            startAngle = tmp;
	        }
	
	        // var number = 0;
	        // var step = (anticlockwise ? -Math.PI : Math.PI) / 2;
	        for (var angle = 0; angle < endAngle; angle += Math.PI / 2) {
	            if (angle > startAngle) {
	                extremity[0] = mathCos(angle) * rx + x;
	                extremity[1] = mathSin(angle) * ry + y;
	
	                vec2Min(min, extremity, min);
	                vec2Max(max, extremity, max);
	            }
	        }
	    };
	
	    module.exports = bbox;
	


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var CMD = __webpack_require__(26).CMD;
	    var line = __webpack_require__(30);
	    var cubic = __webpack_require__(31);
	    var quadratic = __webpack_require__(32);
	    var arc = __webpack_require__(33);
	    var normalizeRadian = __webpack_require__(34).normalizeRadian;
	    var curve = __webpack_require__(27);
	
	    var windingLine = __webpack_require__(35);
	
	    var containStroke = line.containStroke;
	
	    var PI2 = Math.PI * 2;
	
	    var EPSILON = 1e-4;
	
	    function isAroundEqual(a, b) {
	        return Math.abs(a - b) < EPSILON;
	    }
	
	    // 临时数组
	    var roots = [-1, -1, -1];
	    var extrema = [-1, -1];
	
	    function swapExtrema() {
	        var tmp = extrema[0];
	        extrema[0] = extrema[1];
	        extrema[1] = tmp;
	    }
	
	    function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
	        // Quick reject
	        if (
	            (y > y0 && y > y1 && y > y2 && y > y3)
	            || (y < y0 && y < y1 && y < y2 && y < y3)
	        ) {
	            return 0;
	        }
	        var nRoots = curve.cubicRootAt(y0, y1, y2, y3, y, roots);
	        if (nRoots === 0) {
	            return 0;
	        }
	        else {
	            var w = 0;
	            var nExtrema = -1;
	            var y0_, y1_;
	            for (var i = 0; i < nRoots; i++) {
	                var t = roots[i];
	
	                // Avoid winding error when intersection point is the connect point of two line of polygon
	                var unit = (t === 0 || t === 1) ? 0.5 : 1;
	
	                var x_ = curve.cubicAt(x0, x1, x2, x3, t);
	                if (x_ < x) { // Quick reject
	                    continue;
	                }
	                if (nExtrema < 0) {
	                    nExtrema = curve.cubicExtrema(y0, y1, y2, y3, extrema);
	                    if (extrema[1] < extrema[0] && nExtrema > 1) {
	                        swapExtrema();
	                    }
	                    y0_ = curve.cubicAt(y0, y1, y2, y3, extrema[0]);
	                    if (nExtrema > 1) {
	                        y1_ = curve.cubicAt(y0, y1, y2, y3, extrema[1]);
	                    }
	                }
	                if (nExtrema == 2) {
	                    // 分成三段单调函数
	                    if (t < extrema[0]) {
	                        w += y0_ < y0 ? unit : -unit;
	                    }
	                    else if (t < extrema[1]) {
	                        w += y1_ < y0_ ? unit : -unit;
	                    }
	                    else {
	                        w += y3 < y1_ ? unit : -unit;
	                    }
	                }
	                else {
	                    // 分成两段单调函数
	                    if (t < extrema[0]) {
	                        w += y0_ < y0 ? unit : -unit;
	                    }
	                    else {
	                        w += y3 < y0_ ? unit : -unit;
	                    }
	                }
	            }
	            return w;
	        }
	    }
	
	    function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
	        // Quick reject
	        if (
	            (y > y0 && y > y1 && y > y2)
	            || (y < y0 && y < y1 && y < y2)
	        ) {
	            return 0;
	        }
	        var nRoots = curve.quadraticRootAt(y0, y1, y2, y, roots);
	        if (nRoots === 0) {
	            return 0;
	        }
	        else {
	            var t = curve.quadraticExtremum(y0, y1, y2);
	            if (t >= 0 && t <= 1) {
	                var w = 0;
	                var y_ = curve.quadraticAt(y0, y1, y2, t);
	                for (var i = 0; i < nRoots; i++) {
	                    // Remove one endpoint.
	                    var unit = (roots[i] === 0 || roots[i] === 1) ? 0.5 : 1;
	
	                    var x_ = curve.quadraticAt(x0, x1, x2, roots[i]);
	                    if (x_ < x) {   // Quick reject
	                        continue;
	                    }
	                    if (roots[i] < t) {
	                        w += y_ < y0 ? unit : -unit;
	                    }
	                    else {
	                        w += y2 < y_ ? unit : -unit;
	                    }
	                }
	                return w;
	            }
	            else {
	                // Remove one endpoint.
	                var unit = (roots[0] === 0 || roots[0] === 1) ? 0.5 : 1;
	
	                var x_ = curve.quadraticAt(x0, x1, x2, roots[0]);
	                if (x_ < x) {   // Quick reject
	                    return 0;
	                }
	                return y2 < y0 ? unit : -unit;
	            }
	        }
	    }
	
	    // TODO
	    // Arc 旋转
	    function windingArc(
	        cx, cy, r, startAngle, endAngle, anticlockwise, x, y
	    ) {
	        y -= cy;
	        if (y > r || y < -r) {
	            return 0;
	        }
	        var tmp = Math.sqrt(r * r - y * y);
	        roots[0] = -tmp;
	        roots[1] = tmp;
	
	        var diff = Math.abs(startAngle - endAngle);
	        if (diff < 1e-4) {
	            return 0;
	        }
	        if (diff % PI2 < 1e-4) {
	            // Is a circle
	            startAngle = 0;
	            endAngle = PI2;
	            var dir = anticlockwise ? 1 : -1;
	            if (x >= roots[0] + cx && x <= roots[1] + cx) {
	                return dir;
	            } else {
	                return 0;
	            }
	        }
	
	        if (anticlockwise) {
	            var tmp = startAngle;
	            startAngle = normalizeRadian(endAngle);
	            endAngle = normalizeRadian(tmp);
	        }
	        else {
	            startAngle = normalizeRadian(startAngle);
	            endAngle = normalizeRadian(endAngle);
	        }
	        if (startAngle > endAngle) {
	            endAngle += PI2;
	        }
	
	        var w = 0;
	        for (var i = 0; i < 2; i++) {
	            var x_ = roots[i];
	            if (x_ + cx > x) {
	                var angle = Math.atan2(y, x_);
	                var dir = anticlockwise ? 1 : -1;
	                if (angle < 0) {
	                    angle = PI2 + angle;
	                }
	                if (
	                    (angle >= startAngle && angle <= endAngle)
	                    || (angle + PI2 >= startAngle && angle + PI2 <= endAngle)
	                ) {
	                    if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
	                        dir = -dir;
	                    }
	                    w += dir;
	                }
	            }
	        }
	        return w;
	    }
	
	    function containPath(data, lineWidth, isStroke, x, y) {
	        var w = 0;
	        var xi = 0;
	        var yi = 0;
	        var x0 = 0;
	        var y0 = 0;
	
	        for (var i = 0; i < data.length;) {
	            var cmd = data[i++];
	            // Begin a new subpath
	            if (cmd === CMD.M && i > 1) {
	                // Close previous subpath
	                if (!isStroke) {
	                    w += windingLine(xi, yi, x0, y0, x, y);
	                }
	                // 如果被任何一个 subpath 包含
	                // if (w !== 0) {
	                //     return true;
	                // }
	            }
	
	            if (i == 1) {
	                // 如果第一个命令是 L, C, Q
	                // 则 previous point 同绘制命令的第一个 point
	                //
	                // 第一个命令为 Arc 的情况下会在后面特殊处理
	                xi = data[i];
	                yi = data[i + 1];
	
	                x0 = xi;
	                y0 = yi;
	            }
	
	            switch (cmd) {
	                case CMD.M:
	                    // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
	                    // 在 closePath 的时候使用
	                    x0 = data[i++];
	                    y0 = data[i++];
	                    xi = x0;
	                    yi = y0;
	                    break;
	                case CMD.L:
	                    if (isStroke) {
	                        if (containStroke(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
	                        w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.C:
	                    if (isStroke) {
	                        if (cubic.containStroke(xi, yi,
	                            data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingCubic(
	                            xi, yi,
	                            data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1],
	                            x, y
	                        ) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.Q:
	                    if (isStroke) {
	                        if (quadratic.containStroke(xi, yi,
	                            data[i++], data[i++], data[i], data[i + 1],
	                            lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingQuadratic(
	                            xi, yi,
	                            data[i++], data[i++], data[i], data[i + 1],
	                            x, y
	                        ) || 0;
	                    }
	                    xi = data[i++];
	                    yi = data[i++];
	                    break;
	                case CMD.A:
	                    // TODO Arc 判断的开销比较大
	                    var cx = data[i++];
	                    var cy = data[i++];
	                    var rx = data[i++];
	                    var ry = data[i++];
	                    var theta = data[i++];
	                    var dTheta = data[i++];
	                    // TODO Arc 旋转
	                    var psi = data[i++];
	                    var anticlockwise = 1 - data[i++];
	                    var x1 = Math.cos(theta) * rx + cx;
	                    var y1 = Math.sin(theta) * ry + cy;
	                    // 不是直接使用 arc 命令
	                    if (i > 1) {
	                        w += windingLine(xi, yi, x1, y1, x, y);
	                    }
	                    else {
	                        // 第一个命令起点还未定义
	                        x0 = x1;
	                        y0 = y1;
	                    }
	                    // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
	                    var _x = (x - cx) * ry / rx + cx;
	                    if (isStroke) {
	                        if (arc.containStroke(
	                            cx, cy, ry, theta, theta + dTheta, anticlockwise,
	                            lineWidth, _x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        w += windingArc(
	                            cx, cy, ry, theta, theta + dTheta, anticlockwise,
	                            _x, y
	                        );
	                    }
	                    xi = Math.cos(theta + dTheta) * rx + cx;
	                    yi = Math.sin(theta + dTheta) * ry + cy;
	                    break;
	                case CMD.R:
	                    x0 = xi = data[i++];
	                    y0 = yi = data[i++];
	                    var width = data[i++];
	                    var height = data[i++];
	                    var x1 = x0 + width;
	                    var y1 = y0 + height;
	                    if (isStroke) {
	                        if (containStroke(x0, y0, x1, y0, lineWidth, x, y)
	                          || containStroke(x1, y0, x1, y1, lineWidth, x, y)
	                          || containStroke(x1, y1, x0, y1, lineWidth, x, y)
	                          || containStroke(x0, y1, x0, y0, lineWidth, x, y)
	                        ) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // FIXME Clockwise ?
	                        w += windingLine(x1, y0, x1, y1, x, y);
	                        w += windingLine(x0, y1, x0, y0, x, y);
	                    }
	                    break;
	                case CMD.Z:
	                    if (isStroke) {
	                        if (containStroke(
	                            xi, yi, x0, y0, lineWidth, x, y
	                        )) {
	                            return true;
	                        }
	                    }
	                    else {
	                        // Close a subpath
	                        w += windingLine(xi, yi, x0, y0, x, y);
	                        // 如果被任何一个 subpath 包含
	                        // FIXME subpaths may overlap
	                        // if (w !== 0) {
	                        //     return true;
	                        // }
	                    }
	                    xi = x0;
	                    yi = y0;
	                    break;
	            }
	        }
	        if (!isStroke && !isAroundEqual(yi, y0)) {
	            w += windingLine(xi, yi, x0, y0, x, y) || 0;
	        }
	        return w !== 0;
	    }
	
	    module.exports = {
	        contain: function (pathData, x, y) {
	            return containPath(pathData, 0, false, x, y);
	        },
	
	        containStroke: function (pathData, lineWidth, x, y) {
	            return containPath(pathData, lineWidth, true, x, y);
	        }
	    };


/***/ },
/* 30 */
/***/ function(module, exports) {

	
	    module.exports = {
	        /**
	         * 线段包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function (x0, y0, x1, y1, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            var _a = 0;
	            var _b = x0;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l)
	                || (y < y0 - _l && y < y1 - _l)
	                || (x > x0 + _l && x > x1 + _l)
	                || (x < x0 - _l && x < x1 - _l)
	            ) {
	                return false;
	            }
	
	            if (x0 !== x1) {
	                _a = (y0 - y1) / (x0 - x1);
	                _b = (x0 * y1 - x1 * y0) / (x0 - x1) ;
	            }
	            else {
	                return Math.abs(x - x0) <= _l / 2;
	            }
	            var tmp = _a * x - y + _b;
	            var _s = tmp * tmp / (_a * _a + 1);
	            return _s <= _l / 2 * _l / 2;
	        }
	    };


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var curve = __webpack_require__(27);
	
	    module.exports = {
	        /**
	         * 三次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  x3
	         * @param  {number}  y3
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
	            ) {
	                return false;
	            }
	            var d = curve.cubicProjectPoint(
	                x0, y0, x1, y1, x2, y2, x3, y3,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }
	    };


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var curve = __webpack_require__(27);
	
	    module.exports = {
	        /**
	         * 二次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        containStroke: function (x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l)
	            ) {
	                return false;
	            }
	            var d = curve.quadraticProjectPoint(
	                x0, y0, x1, y1, x2, y2,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }
	    };


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var normalizeRadian = __webpack_require__(34).normalizeRadian;
	    var PI2 = Math.PI * 2;
	
	    module.exports = {
	        /**
	         * 圆弧描边包含判断
	         * @param  {number}  cx
	         * @param  {number}  cy
	         * @param  {number}  r
	         * @param  {number}  startAngle
	         * @param  {number}  endAngle
	         * @param  {boolean}  anticlockwise
	         * @param  {number} lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {Boolean}
	         */
	        containStroke: function (
	            cx, cy, r, startAngle, endAngle, anticlockwise,
	            lineWidth, x, y
	        ) {
	
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = lineWidth;
	
	            x -= cx;
	            y -= cy;
	            var d = Math.sqrt(x * x + y * y);
	
	            if ((d - _l > r) || (d + _l < r)) {
	                return false;
	            }
	            if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
	                // Is a circle
	                return true;
	            }
	            if (anticlockwise) {
	                var tmp = startAngle;
	                startAngle = normalizeRadian(endAngle);
	                endAngle = normalizeRadian(tmp);
	            } else {
	                startAngle = normalizeRadian(startAngle);
	                endAngle = normalizeRadian(endAngle);
	            }
	            if (startAngle > endAngle) {
	                endAngle += PI2;
	            }
	
	            var angle = Math.atan2(y, x);
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return (angle >= startAngle && angle <= endAngle)
	                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle);
	        }
	    };


/***/ },
/* 34 */
/***/ function(module, exports) {

	
	
	    var PI2 = Math.PI * 2;
	    module.exports = {
	        normalizeRadian: function(angle) {
	            angle %= PI2;
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return angle;
	        }
	    };


/***/ },
/* 35 */
/***/ function(module, exports) {

	
	    module.exports = function windingLine(x0, y0, x1, y1, x, y) {
	        if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
	            return 0;
	        }
	        // Ignore horizontal line
	        if (y1 === y0) {
	            return 0;
	        }
	        var dir = y1 < y0 ? 1 : -1;
	        var t = (y - y0) / (y1 - y0);
	
	        // Avoid winding error when intersection point is the connect point of two line of polygon
	        if (t === 1 || t === 0) {
	            dir = y1 < y0 ? 0.5 : -0.5;
	        }
	
	        var x_ = t * (x1 - x0) + x0;
	
	        return x_ > x ? dir : 0;
	    };


/***/ },
/* 36 */
/***/ function(module, exports) {

	
	
	    var Pattern = function (image, repeat) {
	        this.image = image;
	        this.repeat = repeat;
	
	        // Can be cloned
	        this.type = 'pattern';
	    };
	
	    Pattern.prototype.getCanvasPattern = function (ctx) {
	
	        return this._canvasPattern
	            || (this._canvasPattern = ctx.createPattern(this.image, this.repeat));
	    };
	
	    module.exports = Pattern;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var CMD = __webpack_require__(26).CMD;
	    var vec2 = __webpack_require__(14);
	    var v2ApplyTransform = vec2.applyTransform;
	
	    var points = [[], [], []];
	    var mathSqrt = Math.sqrt;
	    var mathAtan2 = Math.atan2;
	    function transformPath(path, m) {
	        var data = path.data;
	        var cmd;
	        var nPoint;
	        var i;
	        var j;
	        var k;
	        var p;
	
	        var M = CMD.M;
	        var C = CMD.C;
	        var L = CMD.L;
	        var R = CMD.R;
	        var A = CMD.A;
	        var Q = CMD.Q;
	
	        for (i = 0, j = 0; i < data.length;) {
	            cmd = data[i++];
	            j = i;
	            nPoint = 0;
	
	            switch (cmd) {
	                case M:
	                    nPoint = 1;
	                    break;
	                case L:
	                    nPoint = 1;
	                    break;
	                case C:
	                    nPoint = 3;
	                    break;
	                case Q:
	                    nPoint = 2;
	                    break;
	                case A:
	                    var x = m[4];
	                    var y = m[5];
	                    var sx = mathSqrt(m[0] * m[0] + m[1] * m[1]);
	                    var sy = mathSqrt(m[2] * m[2] + m[3] * m[3]);
	                    var angle = mathAtan2(-m[1] / sy, m[0] / sx);
	                    // cx
	                    data[i++] += x;
	                    // cy
	                    data[i++] += y;
	                    // Scale rx and ry
	                    // FIXME Assume psi is 0 here
	                    data[i++] *= sx;
	                    data[i++] *= sy;
	
	                    // Start angle
	                    data[i++] += angle;
	                    // end angle
	                    data[i++] += angle;
	                    // FIXME psi
	                    i += 2;
	                    j = i;
	                    break;
	                case R:
	                    // x0, y0
	                    p[0] = data[i++];
	                    p[1] = data[i++];
	                    v2ApplyTransform(p, p, m);
	                    data[j++] = p[0];
	                    data[j++] = p[1];
	                    // x1, y1
	                    p[0] += data[i++];
	                    p[1] += data[i++];
	                    v2ApplyTransform(p, p, m);
	                    data[j++] = p[0];
	                    data[j++] = p[1];
	            }
	
	            for (k = 0; k < nPoint; k++) {
	                var p = points[k];
	                p[0] = data[i++];
	                p[1] = data[i++];
	
	                v2ApplyTransform(p, p, m);
	                // Write back
	                data[j++] = p[0];
	                data[j++] = p[1];
	            }
	        }
	    }
	
	    module.exports = transformPath;


/***/ },
/* 38 */
/***/ function(module, exports) {

	
	
	    /**
	     * @param {Array.<Object>} colorStops
	     */
	    var Gradient = function (colorStops) {
	
	        this.colorStops = colorStops || [];
	    };
	
	    Gradient.prototype = {
	
	        constructor: Gradient,
	
	        addColorStop: function (offset, color) {
	            this.colorStops.push({
	
	                offset: offset,
	
	                color: color
	            });
	        }
	    };
	
	    module.exports = Gradient;


/***/ },
/* 39 */
/***/ function(module, exports) {

	// TODO Draggable for group
	// FIXME Draggable on element which has parent rotation or scale
	
	    function Draggable() {
	
	        this.on('mousedown', this._dragStart, this);
	        this.on('mousemove', this._drag, this);
	        this.on('mouseup', this._dragEnd, this);
	        this.on('globalout', this._dragEnd, this);
	        // this._dropTarget = null;
	        // this._draggingTarget = null;
	
	        // this._x = 0;
	        // this._y = 0;
	    }
	
	    Draggable.prototype = {
	
	        constructor: Draggable,
	
	        _dragStart: function (e) {
	            var draggingTarget = e.target;
	            if (draggingTarget && draggingTarget.draggable) {
	                this._draggingTarget = draggingTarget;
	                draggingTarget.dragging = true;
	                this._x = e.offsetX;
	                this._y = e.offsetY;
	
	                this.dispatchToElement(draggingTarget, 'dragstart', e.event);
	            }
	        },
	
	        _drag: function (e) {
	            var draggingTarget = this._draggingTarget;
	            if (draggingTarget) {
	
	                var x = e.offsetX;
	                var y = e.offsetY;
	
	                var dx = x - this._x;
	                var dy = y - this._y;
	                this._x = x;
	                this._y = y;
	
	                draggingTarget.drift(dx, dy, e);
	                this.dispatchToElement(draggingTarget, 'drag', e.event);
	
	                var dropTarget = this.findHover(x, y, draggingTarget);
	                var lastDropTarget = this._dropTarget;
	                this._dropTarget = dropTarget;
	
	                if (draggingTarget !== dropTarget) {
	                    if (lastDropTarget && dropTarget !== lastDropTarget) {
	                        this.dispatchToElement(lastDropTarget, 'dragleave', e.event);
	                    }
	                    if (dropTarget && dropTarget !== lastDropTarget) {
	                        this.dispatchToElement(dropTarget, 'dragenter', e.event);
	                    }
	                }
	            }
	        },
	
	        _dragEnd: function (e) {
	            var draggingTarget = this._draggingTarget;
	
	            if (draggingTarget) {
	                draggingTarget.dragging = false;
	            }
	
	            this.dispatchToElement(draggingTarget, 'dragend', e.event);
	
	            if (this._dropTarget) {
	                this.dispatchToElement(this._dropTarget, 'drop', e.event);
	            }
	
	            this._draggingTarget = null;
	            this._dropTarget = null;
	        }
	
	    };
	
	    module.exports = Draggable;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Group是一个容器，可以插入子节点，Group的变换也会被应用到子节点上
	 * @module zrender/graphic/Group
	 * @example
	 *     var Group = require('zrender/lib/container/Group');
	 *     var Circle = require('zrender/lib/graphic/shape/Circle');
	 *     var g = new Group();
	 *     g.position[0] = 100;
	 *     g.position[1] = 100;
	 *     g.add(new Circle({
	 *         style: {
	 *             x: 100,
	 *             y: 100,
	 *             r: 20,
	 *         }
	 *     }));
	 *     zr.add(g);
	 */
	
	
	    var zrUtil = __webpack_require__(4);
	    var Element = __webpack_require__(9);
	    var BoundingRect = __webpack_require__(25);
	
	    /**
	     * @alias module:zrender/graphic/Group
	     * @constructor
	     * @extends module:zrender/mixin/Transformable
	     * @extends module:zrender/mixin/Eventful
	     */
	    var Group = function (opts) {
	
	        opts = opts || {};
	
	        Element.call(this, opts);
	
	        for (var key in opts) {
	            if (opts.hasOwnProperty(key)) {
	                this[key] = opts[key];
	            }
	        }
	
	        this._children = [];
	
	        this.__storage = null;
	
	        this.__dirty = true;
	    };
	
	    Group.prototype = {
	
	        constructor: Group,
	
	        isGroup: true,
	
	        /**
	         * @type {string}
	         */
	        type: 'group',
	
	        /**
	         * 所有子孙元素是否响应鼠标事件
	         * @name module:/zrender/container/Group#silent
	         * @type {boolean}
	         * @default false
	         */
	        silent: false,
	
	        /**
	         * @return {Array.<module:zrender/Element>}
	         */
	        children: function () {
	            return this._children.slice();
	        },
	
	        /**
	         * 获取指定 index 的儿子节点
	         * @param  {number} idx
	         * @return {module:zrender/Element}
	         */
	        childAt: function (idx) {
	            return this._children[idx];
	        },
	
	        /**
	         * 获取指定名字的儿子节点
	         * @param  {string} name
	         * @return {module:zrender/Element}
	         */
	        childOfName: function (name) {
	            var children = this._children;
	            for (var i = 0; i < children.length; i++) {
	                if (children[i].name === name) {
	                    return children[i];
	                }
	             }
	        },
	
	        /**
	         * @return {number}
	         */
	        childCount: function () {
	            return this._children.length;
	        },
	
	        /**
	         * 添加子节点到最后
	         * @param {module:zrender/Element} child
	         */
	        add: function (child) {
	            if (child && child !== this && child.parent !== this) {
	
	                this._children.push(child);
	
	                this._doAdd(child);
	            }
	
	            return this;
	        },
	
	        /**
	         * 添加子节点在 nextSibling 之前
	         * @param {module:zrender/Element} child
	         * @param {module:zrender/Element} nextSibling
	         */
	        addBefore: function (child, nextSibling) {
	            if (child && child !== this && child.parent !== this
	                && nextSibling && nextSibling.parent === this) {
	
	                var children = this._children;
	                var idx = children.indexOf(nextSibling);
	
	                if (idx >= 0) {
	                    children.splice(idx, 0, child);
	                    this._doAdd(child);
	                }
	            }
	
	            return this;
	        },
	
	        _doAdd: function (child) {
	            if (child.parent) {
	                child.parent.remove(child);
	            }
	
	            child.parent = this;
	
	            var storage = this.__storage;
	            var zr = this.__zr;
	            if (storage && storage !== child.__storage) {
	
	                storage.addToMap(child);
	
	                if (child instanceof Group) {
	                    child.addChildrenToStorage(storage);
	                }
	            }
	
	            zr && zr.refresh();
	        },
	
	        /**
	         * 移除子节点
	         * @param {module:zrender/Element} child
	         */
	        remove: function (child) {
	            var zr = this.__zr;
	            var storage = this.__storage;
	            var children = this._children;
	
	            var idx = zrUtil.indexOf(children, child);
	            if (idx < 0) {
	                return this;
	            }
	            children.splice(idx, 1);
	
	            child.parent = null;
	
	            if (storage) {
	
	                storage.delFromMap(child.id);
	
	                if (child instanceof Group) {
	                    child.delChildrenFromStorage(storage);
	                }
	            }
	
	            zr && zr.refresh();
	
	            return this;
	        },
	
	        /**
	         * 移除所有子节点
	         */
	        removeAll: function () {
	            var children = this._children;
	            var storage = this.__storage;
	            var child;
	            var i;
	            for (i = 0; i < children.length; i++) {
	                child = children[i];
	                if (storage) {
	                    storage.delFromMap(child.id);
	                    if (child instanceof Group) {
	                        child.delChildrenFromStorage(storage);
	                    }
	                }
	                child.parent = null;
	            }
	            children.length = 0;
	
	            return this;
	        },
	
	        /**
	         * 遍历所有子节点
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        eachChild: function (cb, context) {
	            var children = this._children;
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	                cb.call(context, child, i);
	            }
	            return this;
	        },
	
	        /**
	         * 深度优先遍历所有子孙节点
	         * @param  {Function} cb
	         * @param  {}   context
	         */
	        traverse: function (cb, context) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                cb.call(context, child);
	
	                if (child.type === 'group') {
	                    child.traverse(cb, context);
	                }
	            }
	            return this;
	        },
	
	        addChildrenToStorage: function (storage) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                storage.addToMap(child);
	                if (child instanceof Group) {
	                    child.addChildrenToStorage(storage);
	                }
	            }
	        },
	
	        delChildrenFromStorage: function (storage) {
	            for (var i = 0; i < this._children.length; i++) {
	                var child = this._children[i];
	                storage.delFromMap(child.id);
	                if (child instanceof Group) {
	                    child.delChildrenFromStorage(storage);
	                }
	            }
	        },
	
	        dirty: function () {
	            this.__dirty = true;
	            this.__zr && this.__zr.refresh();
	            return this;
	        },
	
	        /**
	         * @return {module:zrender/core/BoundingRect}
	         */
	        getBoundingRect: function (includeChildren) {
	            // TODO Caching
	            var rect = null;
	            var tmpRect = new BoundingRect(0, 0, 0, 0);
	            var children = includeChildren || this._children;
	            var tmpMat = [];
	
	            for (var i = 0; i < children.length; i++) {
	                var child = children[i];
	                if (child.ignore || child.invisible) {
	                    continue;
	                }
	
	                var childRect = child.getBoundingRect();
	                var transform = child.getLocalTransform(tmpMat);
	                // TODO
	                // The boundingRect cacluated by transforming original
	                // rect may be bigger than the actual bundingRect when rotation
	                // is used. (Consider a circle rotated aginst its center, where
	                // the actual boundingRect should be the same as that not be
	                // rotated.) But we can not find better approach to calculate
	                // actual boundingRect yet, considering performance.
	                if (transform) {
	                    tmpRect.copy(childRect);
	                    tmpRect.applyTransform(transform);
	                    rect = rect || tmpRect.clone();
	                    rect.union(tmpRect);
	                }
	                else {
	                    rect = rect || childRect.clone();
	                    rect.union(childRect);
	                }
	            }
	            return rect || tmpRect;
	        }
	    };
	
	    zrUtil.inherits(Group, Element);
	
	    module.exports = Group;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Image element
	 * @module zrender/graphic/Image
	 */
	
	
	
	    var Displayable = __webpack_require__(7);
	    var BoundingRect = __webpack_require__(25);
	    var zrUtil = __webpack_require__(4);
	
	    var LRU = __webpack_require__(20);
	    var globalImageCache = new LRU(50);
	    /**
	     * @alias zrender/graphic/Image
	     * @extends module:zrender/graphic/Displayable
	     * @constructor
	     * @param {Object} opts
	     */
	    function ZImage(opts) {
	        Displayable.call(this, opts);
	    }
	
	    ZImage.prototype = {
	
	        constructor: ZImage,
	
	        type: 'image',
	
	        brush: function (ctx, prevEl) {
	            var style = this.style;
	            var src = style.image;
	            var image;
	
	            // Must bind each time
	            style.bind(ctx, this, prevEl);
	            // style.image is a url string
	            if (typeof src === 'string') {
	                image = this._image;
	            }
	            // style.image is an HTMLImageElement or HTMLCanvasElement or Canvas
	            else {
	                image = src;
	            }
	            // FIXME Case create many images with src
	            if (!image && src) {
	                // Try get from global image cache
	                var cachedImgObj = globalImageCache.get(src);
	                if (!cachedImgObj) {
	                    // Create a new image
	                    image = new Image();
	                    image.onload = function () {
	                        image.onload = null;
	                        for (var i = 0; i < cachedImgObj.pending.length; i++) {
	                            cachedImgObj.pending[i].dirty();
	                        }
	                    };
	                    cachedImgObj = {
	                        image: image,
	                        pending: [this]
	                    };
	                    image.src = src;
	                    globalImageCache.put(src, cachedImgObj);
	                    this._image = image;
	                    return;
	                }
	                else {
	                    image = cachedImgObj.image;
	                    this._image = image;
	                    // Image is not complete finish, add to pending list
	                    if (!image.width || !image.height) {
	                        cachedImgObj.pending.push(this);
	                        return;
	                    }
	                }
	            }
	
	            if (image) {
	                // 图片已经加载完成
	                // if (image.nodeName.toUpperCase() == 'IMG') {
	                //     if (!image.complete) {
	                //         return;
	                //     }
	                // }
	                // Else is canvas
	
	                var x = style.x || 0;
	                var y = style.y || 0;
	                // 图片加载失败
	                if (!image.width || !image.height) {
	                    return;
	                }
	                var width = style.width;
	                var height = style.height;
	                var aspect = image.width / image.height;
	                if (width == null && height != null) {
	                    // Keep image/height ratio
	                    width = height * aspect;
	                }
	                else if (height == null && width != null) {
	                    height = width / aspect;
	                }
	                else if (width == null && height == null) {
	                    width = image.width;
	                    height = image.height;
	                }
	
	                // 设置transform
	                this.setTransform(ctx);
	
	                if (style.sWidth && style.sHeight) {
	                    var sx = style.sx || 0;
	                    var sy = style.sy || 0;
	                    ctx.drawImage(
	                        image,
	                        sx, sy, style.sWidth, style.sHeight,
	                        x, y, width, height
	                    );
	                }
	                else if (style.sx && style.sy) {
	                    var sx = style.sx;
	                    var sy = style.sy;
	                    var sWidth = width - sx;
	                    var sHeight = height - sy;
	                    ctx.drawImage(
	                        image,
	                        sx, sy, sWidth, sHeight,
	                        x, y, width, height
	                    );
	                }
	                else {
	                    ctx.drawImage(image, x, y, width, height);
	                }
	
	                this.restoreTransform(ctx);
	
	                // Draw rect text
	                if (style.text != null) {
	                    this.drawRectText(ctx, this.getBoundingRect());
	                }
	
	            }
	        },
	
	        getBoundingRect: function () {
	            var style = this.style;
	            if (! this._rect) {
	                this._rect = new BoundingRect(
	                    style.x || 0, style.y || 0, style.width || 0, style.height || 0
	                );
	            }
	            return this._rect;
	        }
	    };
	
	    zrUtil.inherits(ZImage, Displayable);
	
	    module.exports = ZImage;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Text element
	 * @module zrender/graphic/Text
	 *
	 * TODO Wrapping
	 *
	 * Text not support gradient
	 */
	
	
	
	    var Displayable = __webpack_require__(7);
	    var zrUtil = __webpack_require__(4);
	    var textContain = __webpack_require__(24);
	
	    /**
	     * @alias zrender/graphic/Text
	     * @extends module:zrender/graphic/Displayable
	     * @constructor
	     * @param {Object} opts
	     */
	    var Text = function (opts) {
	        Displayable.call(this, opts);
	    };
	
	    Text.prototype = {
	
	        constructor: Text,
	
	        type: 'text',
	
	        brush: function (ctx, prevEl) {
	            var style = this.style;
	            var x = style.x || 0;
	            var y = style.y || 0;
	            // Convert to string
	            var text = style.text;
	
	            // Convert to string
	            text != null && (text += '');
	
	            // Always bind style
	            style.bind(ctx, this, prevEl);
	
	            if (text) {
	
	                this.setTransform(ctx);
	
	                var textBaseline;
	                var textAlign = style.textAlign;
	                var font = style.textFont || style.font;
	                if (style.textVerticalAlign) {
	                    var rect = textContain.getBoundingRect(
	                        text, font, style.textAlign, 'top'
	                    );
	                    // Ignore textBaseline
	                    textBaseline = 'middle';
	                    switch (style.textVerticalAlign) {
	                        case 'middle':
	                            y -= rect.height / 2 - rect.lineHeight / 2;
	                            break;
	                        case 'bottom':
	                            y -= rect.height - rect.lineHeight / 2;
	                            break;
	                        default:
	                            y += rect.lineHeight / 2;
	                    }
	                }
	                else {
	                    textBaseline = style.textBaseline;
	                }
	
	                // TODO Invalid font
	                ctx.font = font || '12px sans-serif';
	                ctx.textAlign = textAlign || 'left';
	                // Use canvas default left textAlign. Giving invalid value will cause state not change
	                if (ctx.textAlign !== textAlign) {
	                    ctx.textAlign = 'left';
	                }
	                // FIXME in text contain default is top
	                ctx.textBaseline = textBaseline || 'alphabetic';
	                // Use canvas default alphabetic baseline
	                if (ctx.textBaseline !== textBaseline) {
	                    ctx.textBaseline = 'alphabetic';
	                }
	
	                var lineHeight = textContain.measureText('国', ctx.font).width;
	
	                var textLines = text.split('\n');
	                for (var i = 0; i < textLines.length; i++) {
	                    // Fill after stroke so the outline will not cover the main part.
	                    style.hasStroke() && ctx.strokeText(textLines[i], x, y);
	                    style.hasFill() && ctx.fillText(textLines[i], x, y);
	                    y += lineHeight;
	                }
	
	                this.restoreTransform(ctx);
	            }
	        },
	
	        getBoundingRect: function () {
	            var style = this.style;
	            if (!this._rect) {
	                var textVerticalAlign = style.textVerticalAlign;
	                var rect = textContain.getBoundingRect(
	                    style.text + '', style.textFont || style.font, style.textAlign,
	                    textVerticalAlign ? 'top' : style.textBaseline
	                );
	                switch (textVerticalAlign) {
	                    case 'middle':
	                        rect.y -= rect.height / 2;
	                        break;
	                    case 'bottom':
	                        rect.y -= rect.height;
	                        break;
	                }
	                rect.x += style.x || 0;
	                rect.y += style.y || 0;
	                if (style.hasStroke()) {
	                    var w = style.lineWidth;
	                    rect.x -= w / 2;
	                    rect.y -= w / 2;
	                    rect.width += w;
	                    rect.height += w;
	                }
	                this._rect = rect;
	            }
	
	            return this._rect;
	        }
	    };
	
	    zrUtil.inherits(Text, Displayable);
	
	    module.exports = Text;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 圆形
	 * @module zrender/shape/Circle
	 */
	
	
	
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'circle',
	
	        shape: {
	            cx: 0,
	            cy: 0,
	            r: 0
	        },
	
	
	        buildPath : function (ctx, shape, inBundle) {
	            // Better stroking in ShapeBundle
	            // Always do it may have performence issue ( fill may be 2x more cost)
	            if (inBundle) {
	                ctx.moveTo(shape.cx + shape.r, shape.cy);
	            }
	            // Better stroking in ShapeBundle
	            // ctx.moveTo(shape.cx + shape.r, shape.cy);
	            ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true);
	        }
	    });
	


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 扇形
	 * @module zrender/graphic/shape/Sector
	 */
	
	
	
	    var env = __webpack_require__(45);
	    var Path = __webpack_require__(6);
	
	    var shadowTemp = [
	        ['shadowBlur', 0],
	        ['shadowColor', '#000'],
	        ['shadowOffsetX', 0],
	        ['shadowOffsetY', 0]
	    ];
	
	    module.exports = Path.extend({
	
	        type: 'sector',
	
	        shape: {
	
	            cx: 0,
	
	            cy: 0,
	
	            r0: 0,
	
	            r: 0,
	
	            startAngle: 0,
	
	            endAngle: Math.PI * 2,
	
	            clockwise: true
	        },
	
	        brush: (env.browser.ie && env.browser.version >= 11) // version: '11.0'
	            // Fix weird bug in some version of IE11 (like 11.0.9600.17801),
	            // where exception "unexpected call to method or property access"
	            // might be thrown when calling ctx.fill after a path whose area size
	            // is zero is drawn and ctx.clip() is called and shadowBlur is set.
	            // (e.g.,
	            //  ctx.moveTo(10, 10);
	            //  ctx.lineTo(20, 10);
	            //  ctx.closePath();
	            //  ctx.clip();
	            //  ctx.shadowBlur = 10;
	            //  ...
	            //  ctx.fill();
	            // )
	            ? function () {
	                var clipPaths = this.__clipPaths;
	                var style = this.style;
	                var modified;
	
	                if (clipPaths) {
	                    for (var i = 0; i < clipPaths.length; i++) {
	                        var shape = clipPaths[i] && clipPaths[i].shape;
	                        if (shape && shape.startAngle === shape.endAngle) {
	                            for (var j = 0; j < shadowTemp.length; j++) {
	                                shadowTemp[j][2] = style[shadowTemp[j][0]];
	                                style[shadowTemp[j][0]] = shadowTemp[j][1];
	                            }
	                            modified = true;
	                            break;
	                        }
	                    }
	                }
	
	                Path.prototype.brush.apply(this, arguments);
	
	                if (modified) {
	                    for (var j = 0; j < shadowTemp.length; j++) {
	                        style[shadowTemp[j][0]] = shadowTemp[j][2];
	                    }
	                }
	            }
	            : Path.prototype.brush,
	
	        buildPath: function (ctx, shape) {
	
	            var x = shape.cx;
	            var y = shape.cy;
	            var r0 = Math.max(shape.r0 || 0, 0);
	            var r = Math.max(shape.r, 0);
	            var startAngle = shape.startAngle;
	            var endAngle = shape.endAngle;
	            var clockwise = shape.clockwise;
	
	            var unitX = Math.cos(startAngle);
	            var unitY = Math.sin(startAngle);
	
	            ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
	
	            ctx.lineTo(unitX * r + x, unitY * r + y);
	
	            ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
	
	            ctx.lineTo(
	                Math.cos(endAngle) * r0 + x,
	                Math.sin(endAngle) * r0 + y
	            );
	
	            if (r0 !== 0) {
	                ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
	            }
	
	            ctx.closePath();
	        }
	    });
	


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * echarts设备环境识别
	 *
	 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
	 * @author firede[firede@firede.us]
	 * @desc thanks zepto.
	 */
	
	    var env = {};
	    if (typeof navigator === 'undefined') {
	        // In node
	        env = {
	            browser: {},
	            os: {},
	            node: true,
	            // Assume canvas is supported
	            canvasSupported: true
	        };
	    }
	    else {
	        env = detect(navigator.userAgent);
	    }
	
	    module.exports = env;
	
	    // Zepto.js
	    // (c) 2010-2013 Thomas Fuchs
	    // Zepto.js may be freely distributed under the MIT license.
	
	    function detect(ua) {
	        var os = {};
	        var browser = {};
	        // var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
	        // var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	        // var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	        // var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	        // var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	        // var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
	        // var touchpad = webos && ua.match(/TouchPad/);
	        // var kindle = ua.match(/Kindle\/([\d.]+)/);
	        // var silk = ua.match(/Silk\/([\d._]+)/);
	        // var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
	        // var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
	        // var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
	        // var playbook = ua.match(/PlayBook/);
	        // var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
	        var firefox = ua.match(/Firefox\/([\d.]+)/);
	        // var safari = webkit && ua.match(/Mobile\//) && !chrome;
	        // var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;
	        var ie = ua.match(/MSIE\s([\d.]+)/)
	            // IE 11 Trident/7.0; rv:11.0
	            || ua.match(/Trident\/.+?rv:(([\d.]+))/);
	        var edge = ua.match(/Edge\/([\d.]+)/); // IE 12 and 12+
	
	        var weChat = (/micromessenger/i).test(ua);
	
	        // Todo: clean this up with a better OS/browser seperation:
	        // - discern (more) between multiple browsers on android
	        // - decide if kindle fire in silk mode is android or not
	        // - Firefox on Android doesn't specify the Android version
	        // - possibly devide in os, device and browser hashes
	
	        // if (browser.webkit = !!webkit) browser.version = webkit[1];
	
	        // if (android) os.android = true, os.version = android[2];
	        // if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
	        // if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
	        // if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	        // if (webos) os.webos = true, os.version = webos[2];
	        // if (touchpad) os.touchpad = true;
	        // if (blackberry) os.blackberry = true, os.version = blackberry[2];
	        // if (bb10) os.bb10 = true, os.version = bb10[2];
	        // if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
	        // if (playbook) browser.playbook = true;
	        // if (kindle) os.kindle = true, os.version = kindle[1];
	        // if (silk) browser.silk = true, browser.version = silk[1];
	        // if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
	        // if (chrome) browser.chrome = true, browser.version = chrome[1];
	        if (firefox) {
	            browser.firefox = true;
	            browser.version = firefox[1];
	        }
	        // if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
	        // if (webview) browser.webview = true;
	
	        if (ie) {
	            browser.ie = true;
	            browser.version = ie[1];
	        }
	
	        if (edge) {
	            browser.edge = true;
	            browser.version = edge[1];
	        }
	
	        // It is difficult to detect WeChat in Win Phone precisely, because ua can
	        // not be set on win phone. So we do not consider Win Phone.
	        if (weChat) {
	            browser.weChat = true;
	        }
	
	        // os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
	        //     (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
	        // os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos ||
	        //     (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
	        //     (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
	
	        return {
	            browser: browser,
	            os: os,
	            node: false,
	            // 原生canvas支持，改极端点了
	            // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
	            canvasSupported : document.createElement('canvas').getContext ? true : false,
	            // @see <http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript>
	            // works on most browsers
	            // IE10/11 does not support touch event, and MS Edge supports them but not by
	            // default, so we dont check navigator.maxTouchPoints for them here.
	            touchEventsSupported: 'ontouchstart' in window && !browser.ie && !browser.edge,
	            // <http://caniuse.com/#search=pointer%20event>.
	            pointerEventsSupported: 'onpointerdown' in window
	                // Firefox supports pointer but not by default, only MS browsers are reliable on pointer
	                // events currently. So we dont use that on other browsers unless tested sufficiently.
	                // Although IE 10 supports pointer event, it use old style and is different from the
	                // standard. So we exclude that. (IE 10 is hardly used on touch device)
	                && (browser.edge || (browser.ie && browser.version >= 11))
	        };
	    }


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 圆环
	 * @module zrender/graphic/shape/Ring
	 */
	
	
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'ring',
	
	        shape: {
	            cx: 0,
	            cy: 0,
	            r: 0,
	            r0: 0
	        },
	
	        buildPath: function (ctx, shape) {
	            var x = shape.cx;
	            var y = shape.cy;
	            var PI2 = Math.PI * 2;
	            ctx.moveTo(x + shape.r, y);
	            ctx.arc(x, y, shape.r, 0, PI2, false);
	            ctx.moveTo(x + shape.r0, y);
	            ctx.arc(x, y, shape.r0, 0, PI2, true);
	        }
	    });
	


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 多边形
	 * @module zrender/shape/Polygon
	 */
	
	
	    var polyHelper = __webpack_require__(48);
	
	    module.exports = __webpack_require__(6).extend({
	        
	        type: 'polygon',
	
	        shape: {
	            points: null,
	
	            smooth: false,
	
	            smoothConstraint: null
	        },
	
	        buildPath: function (ctx, shape) {
	            polyHelper.buildPath(ctx, shape, true);
	        }
	    });


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var smoothSpline = __webpack_require__(49);
	    var smoothBezier = __webpack_require__(50);
	
	    module.exports = {
	        buildPath: function (ctx, shape, closePath) {
	            var points = shape.points;
	            var smooth = shape.smooth;
	            if (points && points.length >= 2) {
	                if (smooth && smooth !== 'spline') {
	                    var controlPoints = smoothBezier(
	                        points, smooth, closePath, shape.smoothConstraint
	                    );
	
	                    ctx.moveTo(points[0][0], points[0][1]);
	                    var len = points.length;
	                    for (var i = 0; i < (closePath ? len : len - 1); i++) {
	                        var cp1 = controlPoints[i * 2];
	                        var cp2 = controlPoints[i * 2 + 1];
	                        var p = points[(i + 1) % len];
	                        ctx.bezierCurveTo(
	                            cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
	                        );
	                    }
	                }
	                else {
	                    if (smooth === 'spline') {
	                        points = smoothSpline(points, closePath);
	                    }
	
	                    ctx.moveTo(points[0][0], points[0][1]);
	                    for (var i = 1, l = points.length; i < l; i++) {
	                        ctx.lineTo(points[i][0], points[i][1]);
	                    }
	                }
	
	                closePath && ctx.closePath();
	            }
	        }
	    };


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Catmull-Rom spline 插值折线
	 * @module zrender/shape/util/smoothSpline
	 * @author pissang (https://www.github.com/pissang)
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	
	    var vec2 = __webpack_require__(14);
	
	    /**
	     * @inner
	     */
	    function interpolate(p0, p1, p2, p3, t, t2, t3) {
	        var v0 = (p2 - p0) * 0.5;
	        var v1 = (p3 - p1) * 0.5;
	        return (2 * (p1 - p2) + v0 + v1) * t3
	                + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                + v0 * t + p1;
	    }
	
	    /**
	     * @alias module:zrender/shape/util/smoothSpline
	     * @param {Array} points 线段顶点数组
	     * @param {boolean} isLoop
	     * @return {Array}
	     */
	    module.exports = function (points, isLoop) {
	        var len = points.length;
	        var ret = [];
	
	        var distance = 0;
	        for (var i = 1; i < len; i++) {
	            distance += vec2.distance(points[i - 1], points[i]);
	        }
	
	        var segs = distance / 2;
	        segs = segs < len ? len : segs;
	        for (var i = 0; i < segs; i++) {
	            var pos = i / (segs - 1) * (isLoop ? len : len - 1);
	            var idx = Math.floor(pos);
	
	            var w = pos - idx;
	
	            var p0;
	            var p1 = points[idx % len];
	            var p2;
	            var p3;
	            if (!isLoop) {
	                p0 = points[idx === 0 ? idx : idx - 1];
	                p2 = points[idx > len - 2 ? len - 1 : idx + 1];
	                p3 = points[idx > len - 3 ? len - 1 : idx + 2];
	            }
	            else {
	                p0 = points[(idx - 1 + len) % len];
	                p2 = points[(idx + 1) % len];
	                p3 = points[(idx + 2) % len];
	            }
	
	            var w2 = w * w;
	            var w3 = w * w2;
	
	            ret.push([
	                interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
	                interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
	            ]);
	        }
	        return ret;
	    };
	


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 贝塞尔平滑曲线
	 * @module zrender/shape/util/smoothBezier
	 * @author pissang (https://www.github.com/pissang)
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	
	
	    var vec2 = __webpack_require__(14);
	    var v2Min = vec2.min;
	    var v2Max = vec2.max;
	    var v2Scale = vec2.scale;
	    var v2Distance = vec2.distance;
	    var v2Add = vec2.add;
	
	    /**
	     * 贝塞尔平滑曲线
	     * @alias module:zrender/shape/util/smoothBezier
	     * @param {Array} points 线段顶点数组
	     * @param {number} smooth 平滑等级, 0-1
	     * @param {boolean} isLoop
	     * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
	     *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
	     *                           整个折线的包围盒做一个并集用来约束控制点。
	     * @param {Array} 计算出来的控制点数组
	     */
	    module.exports = function (points, smooth, isLoop, constraint) {
	        var cps = [];
	
	        var v = [];
	        var v1 = [];
	        var v2 = [];
	        var prevPoint;
	        var nextPoint;
	
	        var min, max;
	        if (constraint) {
	            min = [Infinity, Infinity];
	            max = [-Infinity, -Infinity];
	            for (var i = 0, len = points.length; i < len; i++) {
	                v2Min(min, min, points[i]);
	                v2Max(max, max, points[i]);
	            }
	            // 与指定的包围盒做并集
	            v2Min(min, min, constraint[0]);
	            v2Max(max, max, constraint[1]);
	        }
	
	        for (var i = 0, len = points.length; i < len; i++) {
	            var point = points[i];
	
	            if (isLoop) {
	                prevPoint = points[i ? i - 1 : len - 1];
	                nextPoint = points[(i + 1) % len];
	            }
	            else {
	                if (i === 0 || i === len - 1) {
	                    cps.push(vec2.clone(points[i]));
	                    continue;
	                }
	                else {
	                    prevPoint = points[i - 1];
	                    nextPoint = points[i + 1];
	                }
	            }
	
	            vec2.sub(v, nextPoint, prevPoint);
	
	            // use degree to scale the handle length
	            v2Scale(v, v, smooth);
	
	            var d0 = v2Distance(point, prevPoint);
	            var d1 = v2Distance(point, nextPoint);
	            var sum = d0 + d1;
	            if (sum !== 0) {
	                d0 /= sum;
	                d1 /= sum;
	            }
	
	            v2Scale(v1, v, -d0);
	            v2Scale(v2, v, d1);
	            var cp0 = v2Add([], point, v1);
	            var cp1 = v2Add([], point, v2);
	            if (constraint) {
	                v2Max(cp0, cp0, min);
	                v2Min(cp0, cp0, max);
	                v2Max(cp1, cp1, min);
	                v2Min(cp1, cp1, max);
	            }
	            cps.push(cp0);
	            cps.push(cp1);
	        }
	
	        if (isLoop) {
	            cps.push(cps.shift());
	        }
	
	        return cps;
	    };
	


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module zrender/graphic/shape/Polyline
	 */
	
	
	    var polyHelper = __webpack_require__(48);
	
	    module.exports = __webpack_require__(6).extend({
	        
	        type: 'polyline',
	
	        shape: {
	            points: null,
	
	            smooth: false,
	
	            smoothConstraint: null
	        },
	
	        style: {
	            stroke: '#000',
	
	            fill: null
	        },
	
	        buildPath: function (ctx, shape) {
	            polyHelper.buildPath(ctx, shape, false);
	        }
	    });


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 矩形
	 * @module zrender/graphic/shape/Rect
	 */
	
	
	    var roundRectHelper = __webpack_require__(53);
	
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'rect',
	
	        shape: {
	            // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
	            // r缩写为1         相当于 [1, 1, 1, 1]
	            // r缩写为[1]       相当于 [1, 1, 1, 1]
	            // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
	            // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
	            r: 0,
	
	            x: 0,
	            y: 0,
	            width: 0,
	            height: 0
	        },
	
	        buildPath: function (ctx, shape) {
	            var x = shape.x;
	            var y = shape.y;
	            var width = shape.width;
	            var height = shape.height;
	            if (!shape.r) {
	                ctx.rect(x, y, width, height);
	            }
	            else {
	                roundRectHelper.buildPath(ctx, shape);
	            }
	            ctx.closePath();
	            return;
	        }
	    });
	


/***/ },
/* 53 */
/***/ function(module, exports) {

	
	
	    module.exports = {
	        buildPath: function (ctx, shape) {
	            var x = shape.x;
	            var y = shape.y;
	            var width = shape.width;
	            var height = shape.height;
	            var r = shape.r;
	            var r1;
	            var r2;
	            var r3;
	            var r4;
	
	            // Convert width and height to positive for better borderRadius
	            if (width < 0) {
	                x = x + width;
	                width = -width;
	            }
	            if (height < 0) {
	                y = y + height;
	                height = -height;
	            }
	
	            if (typeof r === 'number') {
	                r1 = r2 = r3 = r4 = r;
	            }
	            else if (r instanceof Array) {
	                if (r.length === 1) {
	                    r1 = r2 = r3 = r4 = r[0];
	                }
	                else if (r.length === 2) {
	                    r1 = r3 = r[0];
	                    r2 = r4 = r[1];
	                }
	                else if (r.length === 3) {
	                    r1 = r[0];
	                    r2 = r4 = r[1];
	                    r3 = r[2];
	                }
	                else {
	                    r1 = r[0];
	                    r2 = r[1];
	                    r3 = r[2];
	                    r4 = r[3];
	                }
	            }
	            else {
	                r1 = r2 = r3 = r4 = 0;
	            }
	
	            var total;
	            if (r1 + r2 > width) {
	                total = r1 + r2;
	                r1 *= width / total;
	                r2 *= width / total;
	            }
	            if (r3 + r4 > width) {
	                total = r3 + r4;
	                r3 *= width / total;
	                r4 *= width / total;
	            }
	            if (r2 + r3 > height) {
	                total = r2 + r3;
	                r2 *= height / total;
	                r3 *= height / total;
	            }
	            if (r1 + r4 > height) {
	                total = r1 + r4;
	                r1 *= height / total;
	                r4 *= height / total;
	            }
	            ctx.moveTo(x + r1, y);
	            ctx.lineTo(x + width - r2, y);
	            r2 !== 0 && ctx.quadraticCurveTo(
	                x + width, y, x + width, y + r2
	            );
	            ctx.lineTo(x + width, y + height - r3);
	            r3 !== 0 && ctx.quadraticCurveTo(
	                x + width, y + height, x + width - r3, y + height
	            );
	            ctx.lineTo(x + r4, y + height);
	            r4 !== 0 && ctx.quadraticCurveTo(
	                x, y + height, x, y + height - r4
	            );
	            ctx.lineTo(x, y + r1);
	            r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
	        }
	    };


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 直线
	 * @module zrender/graphic/shape/Line
	 */
	
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'line',
	
	        shape: {
	            // Start point
	            x1: 0,
	            y1: 0,
	            // End point
	            x2: 0,
	            y2: 0,
	
	            percent: 1
	        },
	
	        style: {
	            stroke: '#000',
	            fill: null
	        },
	
	        buildPath: function (ctx, shape) {
	            var x1 = shape.x1;
	            var y1 = shape.y1;
	            var x2 = shape.x2;
	            var y2 = shape.y2;
	            var percent = shape.percent;
	
	            if (percent === 0) {
	                return;
	            }
	
	            ctx.moveTo(x1, y1);
	
	            if (percent < 1) {
	                x2 = x1 * (1 - percent) + x2 * percent;
	                y2 = y1 * (1 - percent) + y2 * percent;
	            }
	            ctx.lineTo(x2, y2);
	        },
	
	        /**
	         * Get point at percent
	         * @param  {number} percent
	         * @return {Array.<number>}
	         */
	        pointAt: function (p) {
	            var shape = this.shape;
	            return [
	                shape.x1 * (1 - p) + shape.x2 * p,
	                shape.y1 * (1 - p) + shape.y2 * p
	            ];
	        }
	    });
	


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 贝塞尔曲线
	 * @module zrender/shape/BezierCurve
	 */
	
	
	    var curveTool = __webpack_require__(27);
	    var vec2 = __webpack_require__(14);
	    var quadraticSubdivide = curveTool.quadraticSubdivide;
	    var cubicSubdivide = curveTool.cubicSubdivide;
	    var quadraticAt = curveTool.quadraticAt;
	    var cubicAt = curveTool.cubicAt;
	    var quadraticDerivativeAt = curveTool.quadraticDerivativeAt;
	    var cubicDerivativeAt = curveTool.cubicDerivativeAt;
	
	    var out = [];
	
	    function someVectorAt(shape, t, isTangent) {
	        var cpx2 = shape.cpx2;
	        var cpy2 = shape.cpy2;
	        if (cpx2 === null || cpy2 === null) {
	            return [
	                (isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
	                (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
	            ];
	        }
	        else {
	            return [
	                (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t),
	                (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)
	            ];
	        }
	    }
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'bezier-curve',
	
	        shape: {
	            x1: 0,
	            y1: 0,
	            x2: 0,
	            y2: 0,
	            cpx1: 0,
	            cpy1: 0,
	            // cpx2: 0,
	            // cpy2: 0
	
	            // Curve show percent, for animating
	            percent: 1
	        },
	
	        style: {
	            stroke: '#000',
	            fill: null
	        },
	
	        buildPath: function (ctx, shape) {
	            var x1 = shape.x1;
	            var y1 = shape.y1;
	            var x2 = shape.x2;
	            var y2 = shape.y2;
	            var cpx1 = shape.cpx1;
	            var cpy1 = shape.cpy1;
	            var cpx2 = shape.cpx2;
	            var cpy2 = shape.cpy2;
	            var percent = shape.percent;
	            if (percent === 0) {
	                return;
	            }
	
	            ctx.moveTo(x1, y1);
	
	            if (cpx2 == null || cpy2 == null) {
	                if (percent < 1) {
	                    quadraticSubdivide(
	                        x1, cpx1, x2, percent, out
	                    );
	                    cpx1 = out[1];
	                    x2 = out[2];
	                    quadraticSubdivide(
	                        y1, cpy1, y2, percent, out
	                    );
	                    cpy1 = out[1];
	                    y2 = out[2];
	                }
	
	                ctx.quadraticCurveTo(
	                    cpx1, cpy1,
	                    x2, y2
	                );
	            }
	            else {
	                if (percent < 1) {
	                    cubicSubdivide(
	                        x1, cpx1, cpx2, x2, percent, out
	                    );
	                    cpx1 = out[1];
	                    cpx2 = out[2];
	                    x2 = out[3];
	                    cubicSubdivide(
	                        y1, cpy1, cpy2, y2, percent, out
	                    );
	                    cpy1 = out[1];
	                    cpy2 = out[2];
	                    y2 = out[3];
	                }
	                ctx.bezierCurveTo(
	                    cpx1, cpy1,
	                    cpx2, cpy2,
	                    x2, y2
	                );
	            }
	        },
	
	        /**
	         * Get point at percent
	         * @param  {number} t
	         * @return {Array.<number>}
	         */
	        pointAt: function (t) {
	            return someVectorAt(this.shape, t, false);
	        },
	
	        /**
	         * Get tangent at percent
	         * @param  {number} t
	         * @return {Array.<number>}
	         */
	        tangentAt: function (t) {
	            var p = someVectorAt(this.shape, t, true);
	            return vec2.normalize(p, p);
	        }
	    });
	


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 圆弧
	 * @module zrender/graphic/shape/Arc
	 */
	 
	
	    module.exports = __webpack_require__(6).extend({
	
	        type: 'arc',
	
	        shape: {
	
	            cx: 0,
	
	            cy: 0,
	
	            r: 0,
	
	            startAngle: 0,
	
	            endAngle: Math.PI * 2,
	
	            clockwise: true
	        },
	
	        style: {
	
	            stroke: '#000',
	
	            fill: null
	        },
	
	        buildPath: function (ctx, shape) {
	
	            var x = shape.cx;
	            var y = shape.cy;
	            var r = Math.max(shape.r, 0);
	            var startAngle = shape.startAngle;
	            var endAngle = shape.endAngle;
	            var clockwise = shape.clockwise;
	
	            var unitX = Math.cos(startAngle);
	            var unitY = Math.sin(startAngle);
	
	            ctx.moveTo(unitX * r + x, unitY * r + y);
	            ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
	        }
	    });


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var zrUtil = __webpack_require__(4);
	
	    var Gradient = __webpack_require__(38);
	
	    /**
	     * x, y, x2, y2 are all percent from 0 to 1
	     * @param {number} [x=0]
	     * @param {number} [y=0]
	     * @param {number} [x2=1]
	     * @param {number} [y2=0]
	     * @param {Array.<Object>} colorStops
	     * @param {boolean} [globalCoord=false]
	     */
	    var LinearGradient = function (x, y, x2, y2, colorStops, globalCoord) {
	        this.x = x == null ? 0 : x;
	
	        this.y = y == null ? 0 : y;
	
	        this.x2 = x2 == null ? 1 : x2;
	
	        this.y2 = y2 == null ? 0 : y2;
	
	        // Can be cloned
	        this.type = 'linear';
	
	        // If use global coord
	        this.global = globalCoord || false;
	
	        Gradient.call(this, colorStops);
	    };
	
	    LinearGradient.prototype = {
	
	        constructor: LinearGradient
	    };
	
	    zrUtil.inherits(LinearGradient, Gradient);
	
	    module.exports = LinearGradient;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var zrUtil = __webpack_require__(4);
	
	    var Gradient = __webpack_require__(38);
	
	    /**
	     * x, y, r are all percent from 0 to 1
	     * @param {number} [x=0.5]
	     * @param {number} [y=0.5]
	     * @param {number} [r=0.5]
	     * @param {Array.<Object>} [colorStops]
	     * @param {boolean} [globalCoord=false]
	     */
	    var RadialGradient = function (x, y, r, colorStops, globalCoord) {
	        this.x = x == null ? 0.5 : x;
	
	        this.y = y == null ? 0.5 : y;
	
	        this.r = r == null ? 0.5 : r;
	
	        // Can be cloned
	        this.type = 'radial';
	
	        // If use global coord
	        this.global = globalCoord || false;
	
	        Gradient.call(this, colorStops);
	    };
	
	    RadialGradient.prototype = {
	
	        constructor: RadialGradient
	    };
	
	    zrUtil.inherits(RadialGradient, Gradient);
	
	    module.exports = RadialGradient;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 工具方法类
	 * @author wang.xiaohu
	 */
	
	    var Point = __webpack_require__(60);
	    var Line = __webpack_require__(61);
	    var graphic = __webpack_require__(3);
	    var BoundingRect = __webpack_require__(25);
	    var zrUtil = __webpack_require__(4);
	    /**
	     * 构造类继承关系
	     *
	     * @param {Function} clazz 源类
	     * @param {Function} baseClazz 基类
	     */
	    function inherits(clazz, baseClazz) {
	        var clazzPrototype = clazz.prototype;
	
	        function F() {}
	        F.prototype = baseClazz.prototype;
	        clazz.prototype = new F();
	
	        for (var prop in clazzPrototype) {
	            clazz.prototype[prop] = clazzPrototype[prop];
	        }
	        clazz.prototype.constructor = clazz;
	        clazz.superClass = baseClazz;
	    }
	
	    function getUUID() {
	        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
	            uuid = new Array(36),
	            rnd = 0,
	            r;
	        for (var i = 0; i < 36; i++) {
	            if (i == 8 || i == 13 || i == 18 || i == 23) {
	                uuid[i] = '-';
	            } else if (i == 14) {
	                uuid[i] = '4';
	            } else {
	                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
	                r = rnd & 0xf;
	                rnd = rnd >> 4;
	                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	            }
	        }
	        return "sid-" + uuid.join('');
	    }
	
	
	    /**
	     * 计算两点之间的距离
	     *@param {Point} p1 - first {Point}
	     *@param {Point} p2 - second {Point}
	     *@return {Number} - the distance between those 2 points. It is always positive.
	     **/
	    function distance(p1, p2) {
	        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	    }
	
	    /**
	     * 返回一条折线 最长的两个点
	     * @param  {[type]} points [description]
	     * @return {[type]}        [description]
	     */
	    function getMaxLineLength(points) {
	        var m = distance(points[0], points[1]);
	        var result = [points[0], points[1]];
	        for (var i = 1; i < points.length - 1; i++) {
	
	            if (m < distance(points[i], points[i + 1])) {
	                m = distance(points[i], points[i + 1])
	                result = [points[i], points[i + 1]];
	            }
	        }
	
	        return result;
	    }
	
	    /**Returns the length of a Polyline that would be created with a set of points
	     *@param {Array} v - an {Array} of {Points}
	     *@return {Number} - a positive number equal with total length*/
	    function getPolylineLength(v) {
	        var l = 0;
	        for (var i = 0; i < v.length - 1; i++) {
	            l += distance(v[i], v[i + 1]);
	        }
	
	        return l;
	    }
	
	
	    /**Returns the max of a vector
	     *@param {Array} v - vector of {Number}s
	     *@return {Number} - the maximum number from the vector or NaN if vector is empty
	     **/
	    function max(v) {
	        if (v.lenght == 0) {
	            return NaN;
	        } else {
	            var m = v[0];
	            for (var i = 0; i < v.length; i++) {
	                if (m < v[i]) {
	                    m = v[i];
	                }
	            }
	
	            return m;
	        }
	    }
	
	
	    /**Returns the min of a vector
	     *@param {Array} v - vector of {Number}s
	     *@return {Number} - the minimum number from the vector or NaN if vector is empty
	     *@author alex@scriptoid.com
	     **/
	    function min(v) {
	        if (v.lenght == 0) {
	            return NaN;
	        } else {
	            var m = v[0];
	            for (var i = 0; i < v.length; i++) {
	                if (m > v[i]) {
	                    m = v[i];
	                }
	            }
	
	            return m;
	        }
	    }
	
	    /**
	     * 判断 点数组 是否正交直线路径
	     *Tests if a vector of points is an orthogonal path (moving in multiples of 90 degrees)
	     *@param {Array} v - an {Array} of {Point}s
	     *@return {Boolean} - true if path is valid, false otherwise
	     **/
	    function orthogonalPath(v) {
	        if (v.length <= 1) {
	            return true;
	        }
	
	        for (var i = 0; i < v.length - 1; i++) {
	            if (v[i].x != v[i + 1].x && v[i].y != v[i + 1].y) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	
	    /**
	     *Test to see if 2 {Line}s intersects. They are considered finite segments
	     *and not the infinite lines from geometry
	     *@param {Line} l1 - fist line/segment
	     *@param {Line} l2 - last line/segment
	     *@return {Boolean} true - if the lines intersect or false if not
	     **/
	    function lineIntersectsLine(l1, l2) {
	        // check for two vertical lines
	        if (l1.startPoint.x == l1.endPoint.x && l2.startPoint.x == l2.endPoint.x) {
	            return l1.startPoint.x == l2.startPoint.x ? // if 'infinite 'lines do coincide,
	                // then check segment bounds for overlapping
	                l1.contains(l2.startPoint.x, l2.startPoint.y) ||
	                l1.contains(l2.endPoint.x, l2.endPoint.y) :
	                // lines are paralel
	                false;
	        }
	        // if one line is vertical, and another line is not vertical
	        else if (l1.startPoint.x == l1.endPoint.x || l2.startPoint.x == l2.endPoint.x) {
	            // let assume l2 is vertical, otherwise exchange them
	            if (l1.startPoint.x == l1.endPoint.x) {
	                var l = l1;
	                l1 = l2;
	                l2 = l;
	            }
	            // finding intersection of 'infinite' lines
	            // equation of the first line is y = ax + b, second: x = c
	            var a = (l1.endPoint.y - l1.startPoint.y) / (l1.endPoint.x - l1.startPoint.x);
	            var b = l1.startPoint.y - a * l1.startPoint.x;
	            var x0 = l2.startPoint.x;
	            var y0 = a * x0 + b;
	            return l1.contains(x0, y0) && l2.contains(x0, y0);
	        }
	
	        // check normal case - both lines are not vertical
	        else {
	            //line equation is : y = a*x + b, b = y - a * x
	            var a1 = (l1.endPoint.y - l1.startPoint.y) / (l1.endPoint.x - l1.startPoint.x);
	            var b1 = l1.startPoint.y - a1 * l1.startPoint.x;
	
	            var a2 = (l2.endPoint.y - l2.startPoint.y) / (l2.endPoint.x - l2.startPoint.x);
	            var b2 = l2.startPoint.y - a2 * l2.startPoint.x;
	
	            if (a1 == a2) { //paralel lines
	                return b1 == b2 ?
	                    // for coincide lines, check for segment bounds overlapping
	                    l1.contains(l2.startPoint.x, l2.startPoint.y) || l1.contains(l2.endPoint.x, l2.endPoint.y) :
	                    // not coincide paralel lines have no chance to intersect
	                    false;
	            } else { //usual case - non paralel, the 'infinite' lines intersects...we only need to know if inside the segment
	
	                /*
	                 * if one of the lines are vertical, then x0 is equal to their x,
	                 * otherwise:
	                 * y1 = a1 * x + b1
	                 * y2 = a2 * x + b2
	                 * => x0 = (b2 - b1) / (a1 - a2)
	                 * => y0 = a1 * x0 + b1
	                 **/
	                x0 = (b2 - b1) / (a1 - a2);
	                y0 = a1 * x0 + b1;
	                return l1.contains(x0, y0) && l2.contains(x0, y0);
	            }
	        }
	    }
	
	    /**
	     *
	     *Tests if a a polyline defined by a set of points intersects a rectangle
	     *@param {Array} points - and {Array} of {Point}s
	     *@param {Array} bounds - the bounds of the rectangle defined by (x1, y1, x2, y2)
	     *@param {Boolean} closedPolyline - incase polyline is closed figure then true, else false
	     *
	     *@return true - if line intersects the rectangle, false - if not
	     **/
	    function polylineIntersectsRectangle(points, bounds, closedPolyline) {
	
	
	        //get the 4 lines/segments represented by the bounds
	        var lines = [];
	        lines.push(new Line(new Point(bounds[0], bounds[1]), new Point(bounds[2], bounds[1])));
	        lines.push(new Line(new Point(bounds[2], bounds[1]), new Point(bounds[2], bounds[3])));
	        lines.push(new Line(new Point(bounds[2], bounds[3]), new Point(bounds[0], bounds[3])));
	        lines.push(new Line(new Point(bounds[0], bounds[3]), new Point(bounds[0], bounds[1])));
	
	        for (var k = 0; k < points.length - 1; k++) {
	            //create a line out of each 2 consecutive points
	            var tempLine = new Line(points[k], points[k + 1]);
	
	            //see if that line intersect any of the line on bounds border
	            for (var i = 0; i < lines.length; i++) {
	                if (lineIntersectsLine(tempLine, lines[i])) {
	                    return true;
	                }
	            }
	        }
	
	        //check the closed figure - that is last point connected to the first
	        if (closedPolyline) {
	            //create a line out of each 2 consecutive points
	            var tempLine1 = new Line(points[points.length - 1], points[0]);
	
	            //see if that line intersect any of the line on bounds border
	            for (var j = 0; j < lines.length; j++) {
	                if (lineIntersectsLine(tempLine1, lines[j])) {
	                    return true;
	                }
	            }
	        }
	
	        return false;
	    }
	
	    /**
	     * 计算路径的分数
	     * Score a ortogonal path made out of Points
	     *Iterates over a set of points (minimum 3)
	     *For each 3 points (i, i+1, i+2) :
	     *  - if the 3rd one is after the 2nd on the same line we add +1
	     *  - if the 3rd is up or down related to the 2nd we do not do anything +0
	     *  - if the 3rd goes back we imediatelly return -1
	     *@param {Array} v - an array of {Point}s
	     *@return {Number} - -1 if the path is wrong (goes back) or something >= 0 if is fine
	     *  The bigger the number the smooth the path is
	     **/
	    function scorePath(v) {
	        if (v.length <= 2) {
	            return -1;
	        }
	
	        var score = 0;
	        for (var i = 1; i < v.length - 1; i++) {
	            if (v[i - 1].x == v[i].x && v[i].x == v[i + 1].x) { //on the same vertical
	                if (signum(v[i + 1].y - v[i].y) == signum(v[i].y - v[i - 1].y)) { //same direction
	                    score++;
	                } else { //going back - no good
	                    return -1;
	                }
	            } else if (v[i - 1].y == v[i].y && v[i].y == v[i + 1].y) { //on the same horizontal
	                if (signum(v[i + 1].x - v[i].x) == signum(v[i].x - v[i - 1].x)) { //same direction
	                    score++;
	                } else { //going back - no good
	                    return -1;
	                }
	            } else { //not on same vertical nor horizontal
	                score--;
	            }
	        }
	
	        return score;
	    }
	
	    /**
	     * 返回数字符号（+ -)
	     * Returns the sign of a number
	     *@param {Number} x - the number
	     *@returns {Number}
	     *@see <a href="http://en.wikipedia.org/wiki/Sign_function">http://en.wikipedia.org/wiki/Sign_function</a>
	     **/
	    function signum(x) {
	        if (x > 0)
	            return 1;
	        else if (x < 0)
	            return -1;
	        else
	            return 0;
	    }
	
	    /**
	     * 判断 点数组 是不是有效路径（没有回路）
	     *Tests if a vector of points is a valid path (not going back)
	     *There are a few problems here. If you have p1, p2, p3 and p4 and p2 = p3 you need to ignore that
	     *@param {Array} v - an {Array} of {Point}s
	     *@return {Boolean} - true if path is valid, false otherwise
	     **/
	    function forwardPath(v) {
	        if (v.length <= 2) {
	            return true;
	        }
	
	        for (var i = 0; i < v.length - 2; i++) {
	            if (v[i].x == v[i + 1].x && v[i + 1].x == v[i + 2].x) { //on the same vertical
	                if (signum(v[i + 1].y - v[i].y) != 0) { //test only we have a progressing path
	                    if (signum(v[i + 1].y - v[i].y) == -1 * signum(v[i + 2].y - v[i + 1].y)) { //going back (ignore zero)
	                        return false;
	                    }
	                }
	            } else if (v[i].y == v[i + 1].y && v[i + 1].y == v[i + 2].y) { //on the same horizontal
	                if (signum(v[i + 1].x - v[i].x) != 0) { //test only we have a progressing path
	                    if (signum(v[i + 1].x - v[i].x) == -1 * signum(v[i + 2].x - v[i + 1].x)) { //going back (ignore zero)
	                        return false;
	                    }
	                }
	            }
	        }
	
	        return true;
	    }
	
	    /**
	     * 将[x:0,y:0]转化为[0, 0]  给zrender使用
	     * @param  {[type]} points [description]
	     * @param  {[type]} isRevert [description]
	     * @return {[type]}        [description]
	     */
	    function traslatePoints(points, isRevert) {
	        var newPoints = [];
	        if (isRevert) {
	            for (var i = 0; i < points.length; i++) {
	                var point = points[i];
	                newPoints.push(new Point(point[0], point[1]));
	            }
	            return newPoints;
	        } else {
	            for (var j = 0; j < points.length; j++) {
	                var point1 = points[j];
	                newPoints.push([point1.x, point1.y]);
	            }
	            return newPoints;
	        }
	
	
	    }
	
	    function rotationMatrix(angle) {
	        var mReturn = [
	            [Math.cos(angle), -Math.sin(angle), 0],
	            [Math.sin(angle), Math.cos(angle), 0],
	            [0, 0, 1]
	        ];
	        return mReturn;
	    }
	
	    function translationMatrix(dx, dy) {
	        return [
	            [1, 0, dx],
	            [0, 1, dy],
	            [0, 0, 1]
	        ];
	    }
	
	    function scaleMatrix(sx, sy) {
	        if (sy == null) {
	            sy = sx;
	        }
	        return [
	            [sx, 0, 0],
	            [0, sy, 0],
	            [0, 0, 1]
	        ];
	    }
	
	    /** It will return the end point of a line on a given angle (clockwise).
	     * @param {Point} startPoint - the start of the line
	     * @param {Number} length - the length of the line
	     * @param {Number} angle - the angle of the line in radians
	     * @return {Point} - the endPoint of the line
	     */
	    function getEndPoint(startPoint, length, angle) {
	        var endPoint = startPoint.clone();
	        endPoint.transform(translationMatrix(-startPoint.x, -startPoint.y));
	        endPoint.y -= length;
	        endPoint.transform(rotationMatrix(angle));
	        endPoint.transform(translationMatrix(startPoint.x, startPoint.y));
	        return endPoint;
	    }
	
	    /**
	     * 获取获取两个图形的外面四个连接点
	     * @param  {[type]} node [description]
	     * @return {[type]}      [description]
	     */
	    function getConnectorPoints(node) {
	        return {
	            left: new Point(node.x, node.y + node.height / 2), //矩形 左中的位置
	            top: new Point(node.x + node.width / 2, node.y), //矩形 上中的位置
	            right: new Point(node.x + node.width, node.y + node.height / 2), //矩形 右中的位置
	            bottom: new Point(node.x + node.width / 2, node.y + node.height), //矩形 下中的位置
	            center: new Point(node.x + node.width / 2, node.y + node.height / 2) //中间位置
	
	        };
	    }
	
	    /**
	     * 获取获取两个图形的外面四个连接点
	     * @param  {[type]} node [description]
	     * @return {[type]}      [description]
	     */
	    function getSoltPoints(node) {
	        return [
	            //top
	            [Math.round(node.getRect().width / 3 /10)*10, 0 ],
	            [Math.round(2*node.getRect().width / 3 /10)*10, 0 ],
	            //right
	            [node.getRect().width, Math.round(node.getRect().height / 3 /10)*10 ],
	            [node.getRect().width, Math.round(2*node.getRect().height / 3 /10)*10 ],
	            //bottom
	            [Math.round(node.getRect().width / 3 /10)*10, node.getRect().height ],
	            [Math.round(2*node.getRect().width / 3 /10)*10, node.getRect().height ],
	            //left
	            [0, Math.round(node.getRect().height / 3 /10)*10 ],
	            [0, Math.round(2*node.getRect().height / 3 /10)*10 ]
	
	        ]
	    }
	
	    /**
	     * 计算 p1 p2两点所连接的直线的角度
	     * @param  {[type]} p1 [description]
	     * @param  {[type]} p2 [description]
	     * @return {[type]}    [description]
	     */
	    function tangentRotation(p1, p2) {
	        return -Math.PI / 2 - Math.atan2(
	            p2.y - p1.y, p2.x - p1.x
	        );
	    }
	
	    /**
	     * 判断3点是否在一条直线上
	     * Tests if 3 points are coliniar with matrix determinants.
	     * If the determinat of matrix
	     * /         \
	     * | x1 y1 1 |
	     * | x2 y2 1 |
	     * | x3 y3 1 |
	     * \         /
	     * is zero it means that the points are colinear
	     *@param {Point} p1 - first point
	     *@param {Point} p2 - second point
	     *@param {Point} p3 - third point
	     * @param {Number} precission
	     *@return {Boolean} - true if coliniar and false if not
	     *@author Alex
	     *@see http://en.wikipedia.org/wiki/Determinant
	     *@see https://people.richland.edu/james/lecture/m116/matrices/applications.html
	     **/
	    function collinearity(p1, p2, p3, precission) {
	        var determinant = (p1.x * p2.y + p1.y * p3.x + p2.x * p3.y) - (p2.y * p3.x + p1.y * p2.x + p1.x * p3.y);
	
	        if (precission) {
	            return Math.abs(determinant) <= precission;
	        } else {
	            return determinant === 0;
	        }
	    }
	
	
	    /**
	     * 四舍五入 保存decimals的小数
	     **/
	    function enhancedRound(number, decimals) {
	        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
	    }
	
	    /**
	     * 获取两点之间的长度
	     **/
	    function getLength(startPoint, endPoint) {
	        return Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
	    }
	
	    /**
	     * 获取角度
	     * @param  {[type]} centerPoint  [description]
	     * @param  {[type]} outsidePoint [description]
	     * @param  {[type]} round        [description]
	     * @return {[type]}              [description]
	     */
	    function getAngle(centerPoint, outsidePoint, round) {
	        centerPoint.x = enhancedRound(centerPoint.x, 5);
	        centerPoint.y = enhancedRound(centerPoint.y, 5);
	        outsidePoint.x = enhancedRound(outsidePoint.x, 5);
	        outsidePoint.y = enhancedRound(outsidePoint.y, 5);
	        var angle = Math.atan((outsidePoint.x - centerPoint.x) / (outsidePoint.y - centerPoint.y));
	        angle = -angle;
	
	        //endAngle+=90;
	        if (outsidePoint.x >= centerPoint.x && outsidePoint.y >= centerPoint.y) {
	            angle += Math.PI;
	        } else if (outsidePoint.x <= centerPoint.x && outsidePoint.y >= centerPoint.y) {
	            angle += Math.PI;
	        } else if (outsidePoint.x <= centerPoint.x && outsidePoint.y <= centerPoint.y) {
	            angle += Math.PI * 2;
	        }
	        while (angle >= Math.PI * 2) {
	            angle -= Math.PI * 2;
	        }
	        if (isNaN(angle)) { //Nan
	            angle = 0; //we are at center point;
	        }
	        if (round) {
	            angle = Math.round(angle / round) * round
	        }
	        return angle;
	    }
	
	    function getRect(node) {
	        var boundingRect = node.getBoundingRect();
	        //创建最小包围盒虚线
	        var points = [];
	        points[0] = [-boundingRect.width / 2, -boundingRect.height / 2];
	        points[1] = [boundingRect.width / 2, -boundingRect.height / 2];
	        points[2] = [boundingRect.width / 2, boundingRect.height / 2];
	        points[3] = [-boundingRect.width / 2, boundingRect.height / 2];
	        points[4] = [-boundingRect.width / 2, -boundingRect.height / 2];
	
	        var boundRect, cx, cy;
	        if (node instanceof graphic.Circle) {
	            //注: 因事件为圆形  所以 x y 为圆心的位置  包围矩形要减去宽度一半
	            boundRect = new BoundingRect(Number(node.position[0]) - Number(boundingRect.width / 2),
	                Number(node.position[1]) - Number(boundingRect.height / 2),
	                Number(boundingRect.width), Number(boundingRect.height));
	            cx = Number(node.position[0]);
	            cy = Number(node.position[1]);
	        } else {
	            boundRect = new BoundingRect(Number(node.position[0]),
	                Number(node.position[1]),
	                Number(boundingRect.width), Number(boundingRect.height));
	            cx = Number(node.position[0]) + Number(boundingRect.width) / 2;
	            cy = Number(node.position[1]) + Number(boundingRect.height) / 2;
	        }
	        return {
	            x: Number(cx),
	            y: Number(cy),
	            width: Number(boundingRect.width),
	            height: Number(boundingRect.height),
	            points: points,
	            boundingRect: boundRect
	        };
	    }
	
	    var StackedMap = {
	        createNew: function() {
	            var stack = [];
	
	            return {
	                add: function(key, value) {
	                    var arrKey = this.get(key);
	                    arrKey.push(value)
	
	                },
	                get: function(key) {
	                    for (var i = 0; i < stack.length; i++) {
	                        if (key == stack[i].key) {
	                            return stack[i].value;
	                        }
	                    }
	                    //如果没有找到的话，则创建一个新的数组
	                    var value = [];
	                    stack.push({ key: key, value: value });
	                    return value;
	                },
	                keys: function() {
	                    var keys = [];
	                    for (var i = 0; i < stack.length; i++) {
	                        keys.push(stack[i].key);
	                    }
	                    return keys;
	                },
	                top: function() {
	                    return stack[stack.length - 1];
	                },
	                remove: function(key) {
	                    var idx = -1;
	                    for (var i = 0; i < stack.length; i++) {
	                        if (key == stack[i].key) {
	                            idx = i;
	                            break;
	                        }
	                    }
	                    return stack.splice(idx, 1)[0];
	                },
	                removeItem: function(key, item) {
	                    var arrKey = this.get(key);
	                    var index = zrUtil.indexOf(arrKey, item);
	                    arrKey.splice(index, 1);
	
	                },
	                removeTop: function() {
	                    return stack.splice(stack.length - 1, 1)[0];
	                },
	                length: function() {
	                    return stack.length;
	                },
	                clear: function() {
	                    stack.splice(0, stack.length);
	                }
	            };
	        }
	    };
	
	    function randomColor() {
	        var arrHex = ["0", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d"],
	            strHex = "#",
	            index;
	        for (var i = 0; i < 6; i++) {
	            index = Math.round(Math.random() * 15);
	            strHex += arrHex[index];
	        }
	        return strHex;
	    }
	
	    function isUndefined(obj) {
	        return obj === void 0;
	    }
	
	    function collinearReduction (v) {
	        var r = [];
	
	        if(v.length < 3){
	            return Point.cloneArray(v);
	        }
	
	        r.push( v[0].clone() );
	        for(var i=1; i < v.length-1; i++){
	            if( (v[i-1].x == v[i].x && v[i].x == v[i+1].x)  ||  (v[i-1].y == v[i].y && v[i].y == v[i+1].y) )
	            {
	                continue;
	            }
	            else{
	                r.push( v[i].clone() );
	            }
	        }
	        r.push( v[v.length-1].clone() );
	
	        return r;
	    }
	
	    // By default, Underscore uses ERB-style template delimiters, change the
	    // following template settings to use alternative delimiters.
	    var templateSettings = {
	        evaluate: /<%([\s\S]+?)%>/g,
	        interpolate: /<%=([\s\S]+?)%>/g,
	        escape: /<%-([\s\S]+?)%>/g
	    };
	
	    // When customizing `templateSettings`, if you don't want to define an
	    // interpolation, evaluation or escaping regex, we need one that is
	    // guaranteed not to match.
	    var noMatch = /(.)^/;
	
	    // Certain characters need to be escaped so that they can be put into a
	    // string literal.
	    var escapes = {
	        "'": "'",
	        '\\': '\\',
	        '\r': 'r',
	        '\n': 'n',
	        '\u2028': 'u2028',
	        '\u2029': 'u2029'
	    };
	
	    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	    var escapeChar = function(match) {
	        return '\\' + escapes[match];
	    };
	
	    // JavaScript micro-templating, similar to John Resig's implementation.
	    // Underscore templating handles arbitrary delimiters, preserves whitespace,
	    // and correctly escapes quotes within interpolated code.
	    // NB: `oldSettings` only exists for backwards compatibility.
	    function template(text, settings, oldSettings) {
	        if (!settings && oldSettings) settings = oldSettings;
	        settings = settings || {};
	        settings = zrUtil.defaults(settings, templateSettings, true);
	
	        // Combine delimiters into one regular expression via alternation.
	        var matcher = RegExp([
	            (settings.escape || noMatch).source,
	            (settings.interpolate || noMatch).source,
	            (settings.evaluate || noMatch).source
	        ].join('|') + '|$', 'g');
	
	        // Compile the template source, escaping string literals appropriately.
	        var index = 0;
	        var source = "__p+='";
	        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	            source += text.slice(index, offset).replace(escaper, escapeChar);
	            index = offset + match.length;
	
	            if (escape) {
	                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	            } else if (interpolate) {
	                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	            } else if (evaluate) {
	                source += "';\n" + evaluate + "\n__p+='";
	            }
	
	            // Adobe VMs need the match returned to produce the correct offest.
	            return match;
	        });
	        source += "';\n";
	
	        // If a variable is not specified, place data values in local scope.
	        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	        source = "var __t,__p='',__j=Array.prototype.join," +
	            "print=function(){__p+=__j.call(arguments,'');};\n" +
	            source + 'return __p;\n';
	
	        try {
	            var render = new Function(settings.variable || 'obj', source);
	        } catch (e) {
	            e.source = source;
	            throw e;
	        }
	
	        var template = function(data) {
	            return render.call(this, data);
	        };
	
	        // Provide the compiled source as a convenience for precompilation.
	        var argument = settings.variable || 'obj';
	        template.source = 'function(' + argument + '){\n' + source + '}';
	
	        return template;
	    }
	
	    function isEmpty(obj) {
	        if (obj == null) return true;
	        if (zrUtil.isArrayLike(obj) && (zrUtil.isArray(obj) || zrUtil.isString(obj))) return obj.length === 0;
	    }
	
	    module.exports = {
	        inherits: inherits,
	        getUUID: getUUID,
	        distance: distance,
	        getPolylineLength: getPolylineLength,
	        max: max,
	        min: min,
	        isEmpty: isEmpty,
	        orthogonalPath: orthogonalPath,
	        polylineIntersectsRectangle: polylineIntersectsRectangle,
	        scorePath: scorePath,
	        forwardPath: forwardPath,
	        traslatePoints: traslatePoints,
	        getEndPoint: getEndPoint,
	        getConnectorPoints: getConnectorPoints,
	        tangentRotation: tangentRotation,
	        collinearity: collinearity,
	        translationMatrix: translationMatrix,
	        scaleMatrix: scaleMatrix,
	        round: enhancedRound,
	        getLength: getLength,
	        getAngle: getAngle,
	        getRect: getRect,
	        StackedMap: StackedMap,
	        getMaxLineLength: getMaxLineLength,
	        randomColor: randomColor,
	        template: template,
	        isUndefined: isUndefined,
	        getSoltPoints:getSoltPoints,
	        collinearReduction: collinearReduction
	    };
	


/***/ },
/* 60 */
/***/ function(module, exports) {

	
	
	    /**
	      * Creates an instance of Point
	      *
	      *
	      * @constructor
	      * @this {Point}
	      * @param {Number} x The x coordinate of point.
	      * @param {Number} y The y coordinate of point.
	      * Note: Even if it is named Point this class should be named Dot as Dot is closer
	      * then Point from math perspective.
	      **/
	    function Point(x, y){
	        /**The x coordinate of point*/
	        this.x = x;
	        
	        /**The y coordinate of point*/
	        this.y = y;
	        
	
	    }
	
	    /**Creates a {Point} out of JSON parsed object
	     *@param {JSONObject} o - the JSON parsed object
	     *@return {Point} a newly constructed Point
	     **/
	    Point.load = function(o){
	        var newPoint = new Point(Number(o.x), Number(o.y));
	        return newPoint;
	    };
	
	
	    /**Creates an array of points from an array of {JSONObject}s
	     *@param {Array} v - the array of JSONObjects
	     *@return an {Array} of {Point}s
	     **/
	    Point.loadArray = function(v){
	        var newPoints = [];
	        for(var i=0; i< v.length; i++){
	            newPoints.push(Point.load(v[i]));
	        }
	        return newPoints;
	    };
	
	
	    /**Clones an array of points
	     *@param {Array} v - the array of {Point}s
	     *@return an {Array} of {Point}s
	     **/
	    Point.cloneArray = function(v){
	        var newPoints = [];
	        for(var i=0; i< v.length; i++){
	            newPoints.push(v[i].clone());
	        }
	        return newPoints;
	    };
	
	    Point.prototype = {
	        constructor : Point,
	        
	        transform:function(matrix){
	            var oldX = this.x;
	            var oldY = this.y;
	            this.x = matrix[0][0] * oldX + matrix[0][1] * oldY + matrix[0][2];
	            this.y = matrix[1][0] * oldX + matrix[1][1] * oldY + matrix[1][2];
	        },
	        
	        /**Tests if this point is similar to other point
	         *@param {Point} anotherPoint - the other point
	         **/
	        equals:function(anotherPoint){
	            if(! (anotherPoint instanceof Point) ){
	                return false;
	            }
	            return (this.x == anotherPoint.x)
	            && (this.y == anotherPoint.y)
	        },
	
	        /**Clone current Point
	         **/
	        clone: function(){
	            var newPoint = new Point(this.x, this.y);
	            return newPoint;
	        },
	
	        /**Tests to see if a point (x, y) is within a range of current Point
	         *@param {Numeric} x - the x coordinate of tested point
	         *@param {Numeric} y - the x coordinate of tested point
	         *@param {Numeric} radius - the radius of the vicinity
	         **/
	        near:function(x, y, radius){
	            var distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	
	            return (distance <= radius);
	        },
	
	        contains: function(x,y){
	            return this.x == x && this.y == y;
	        },
	
	        toString:function(){
	            return '[' + this.x + ',' + this.y + ']';
	        },
	
	        getPoints:function(){
	            return [this];
	        }
	    };
	    module.exports = Point;
	    

/***/ },
/* 61 */
/***/ function(module, exports) {

	
	
	    /**
	      * Creates an instance of a Line. A Line is actually a segment and not a pure
	      * geometrical Line
	      *
	      * @constructor
	      * @this {Line}
	      * @param {Point} startPoint - starting point of the line
	      * @param {Point} endPoint - the ending point of the line
	      **/
	    function Line(startPoint, endPoint){
	        /**Starting {@link Point} of the line*/
	        this.startPoint = startPoint;
	
	        /**Ending {@link Point} of the line*/
	        this.endPoint = endPoint;
	
	        /**Serialization type*/
	        this.oType = 'Line'; //object type used for JSON deserialization
	    }
	
	    /**Creates a {Line} out of JSON parsed object
	     *@param {JSONObject} o - the JSON parsed object
	     *@return {Line} a newly constructed Line
	     **/
	    Line.load = function(o){
	        var newLine = new Line(
	            Point.load(o.startPoint),
	            Point.load(o.endPoint)
	        );
	
	        return newLine;
	    };
	
	    Line.prototype = {
	        contructor: Line,
	
	
	
	        clone:function(){
	            var ret = new Line(this.startPoint.clone(), this.endPoint.clone());
	            return ret;
	        },
	
	        equals:function(anotherLine){
	            if(!anotherLine instanceof Line){
	                return false;
	            }
	            return this.startPoint.equals(anotherLine.startPoint)
	            && this.endPoint.equals(anotherLine.endPoint)
	        },
	
	        /** Tests to see if a point belongs to this line (not as infinite line but more like a segment)
	         * Algorithm: Compute line's equation and see if (x, y) verifies it.
	         * @param {Number} x - the X coordinates
	         * @param {Number} y - the Y coordinates
	         **/
	        contains: function(x, y){
	            // if the point is inside rectangle bounds of the segment
	            if (Math.min(this.startPoint.x, this.endPoint.x) <= x
	                && x <= Math.max(this.startPoint.x, this.endPoint.x)
	                && Math.min(this.startPoint.y, this.endPoint.y) <= y
	                && y <= Math.max(this.startPoint.y, this.endPoint.y)) {
	
	                // check for vertical line
	                if (this.startPoint.x == this.endPoint.x) {
	                    return x == this.startPoint.x;
	                } else { // usual (not vertical) line can be represented as y = a * x + b
	                    var a = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
	                    var b = this.startPoint.y - a * this.startPoint.x;
	                    return y == a * x + b;
	                }
	            } else {
	                return false;
	            }
	        },
	
	        /*
	         *See if we are near a {Line} by a certain radius (also includes the extremities into computation)
	         *@param {Number} x - the x coordinates
	         *@param {Number} y - the y coordinates
	         *@param {Number} radius - the radius to search for
	         *@see http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	         *@see "Mathematics for Computer Graphics, 2nd Ed., by John Vice, page 227"
	         **/
	        near:function(x,y,radius){
	
	            if(this.endPoint.x === this.startPoint.x){ //Vertical line, so the vicinity area is a rectangle
	                return ( (this.startPoint.y-radius<=y && this.endPoint.y+radius>=y)
	                        || (this.endPoint.y-radius<=y && this.startPoint.y+radius>=y))
	                && x > this.startPoint.x - radius && x < this.startPoint.x + radius ;
	            }
	
	            if(this.startPoint.y === this.endPoint.y){ //Horizontal line, so the vicinity area is a rectangle
	                return ( (this.startPoint.x - radius<=x && this.endPoint.x+radius>=x)
	                        || (this.endPoint.x-radius<=x && this.startPoint.x+radius>=x))
	                        && y>this.startPoint.y-radius && y<this.startPoint.y+radius ;
	            }
	
	
	            var startX = Math.min(this.endPoint.x,this.startPoint.x);
	            var startY = Math.min(this.endPoint.y,this.startPoint.y);
	            var endX = Math.max(this.endPoint.x,this.startPoint.x);
	            var endY = Math.max(this.endPoint.y,this.startPoint.y);
	
	            /*We will compute the distance from point to the line
	             * by using the algorithm from
	             * http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	             * */
	
	            //First we need to find a,b,c of the line equation ax + by + c = 0
	            var a = this.endPoint.y - this.startPoint.y;
	            var b = this.startPoint.x - this.endPoint.x;
	            var c = -(this.startPoint.x * this.endPoint.y - this.endPoint.x * this.startPoint.y);
	
	            //Secondly we get the distance "Mathematics for Computer Graphics, 2nd Ed., by John Vice, page 227"
	            var d = Math.abs( (a*x + b*y + c) / Math.sqrt(Math.pow(a,2) + Math.pow(b,2)) );
	
	            //Thirdly we get coordinates of closest line's point to target point
	            //http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Cartesian_coordinates
	            var closestX = (b * (b*x - a*y) - a*c) / ( Math.pow(a,2) + Math.pow(b,2) );
	            var closestY = (a * (-b*x + a*y) - b*c) / ( Math.pow(a,2) + Math.pow(b,2) );
	
	            var r = ( d <= radius && endX>=closestX && closestX>=startX && endY>=closestY && closestY>=startY ) //the projection of the point falls INSIDE of the segment
	                || this.startPoint.near(x,y,radius) || this.endPoint.near(x,y,radius); //the projection of the point falls OUTSIDE of the segment
	
	            return  r;
	
	        },
	
	        /**we need to create a new array each time, or we will affect the actual shape*/
	        getPoints:function(){
	            var points = [];
	            points.push(this.startPoint);
	            points.push(this.endPoint);
	            return points;
	        },
	
	        /**Return the {Point} corresponding the t certain t value
	         * @param {Number} t the value of parameter t, where t in [0,1], t is like a percent*/
	        getPoint: function(t){
	            var Xp = t * (this.endPoint.x - this.startPoint.x) + this.startPoint.x;
	            var Yp = t * (this.endPoint.y - this.startPoint.y) + this.startPoint.y;
	
	            return new Point(Xp, Yp);
	        },
	
	        // /**
	        //  * Returns the middle of the line
	        //  * @return {Point} the middle point
	        //  * */
	        // getMiddle : function(){
	        //     return Util.getMiddle(this.startPoint, this.endPoint);
	        // },
	
	
	        // getLength : function(){
	        //     return Util.getLength(this.startPoint, this.endPoint);
	        // },
	
	        // /**
	        //  *Get bounds for this line
	        //  *@author Alex Gheorghiu <alex@scriptoid.com>
	        //  **/
	        // getBounds:function(){
	        //     return Util.getBounds(this.getPoints());
	        // },
	
	        /**String representation*/
	        toString:function(){
	            return 'line(' + this.startPoint + ',' + this.endPoint + ')';
	        }
	    };
	    module.exports = Line;
	
	


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	    var zrUtil = __webpack_require__(4);
	
	    var apiList = [
	        'getDom', 'getZr', 'getWidth', 'getHeight', 'dispatchAction',
	        'on', 'off', 'trigger', 'getDataURL', 'getConnectedDataURL', 'getModel', 'getOption'
	    ];
	
	    function ExtensionAPI(instance) {
	        zrUtil.each(apiList, function (name) {
	            this[name] = zrUtil.bind(instance[name], instance);
	        }, this);
	    }
	
	    module.exports = ExtensionAPI;
	


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * ZRender, a high performance 2d drawing library.
	 *
	 * Copyright (c) 2013, Baidu Inc.
	 * All rights reserved.
	 *
	 * LICENSE
	 * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
	 */
	// Global defines
	
	    var guid = __webpack_require__(10);
	    var env = __webpack_require__(45);
	    var zrUtil = __webpack_require__(4);
	
	    var Handler = __webpack_require__(64);
	    var Storage = __webpack_require__(65);
	    var Animation = __webpack_require__(67);
	    var HandlerProxy = __webpack_require__(70);
	
	    var useVML = !env.canvasSupported;
	
	    var painterCtors = {
	        canvas: __webpack_require__(72)
	    };
	
	    var instances = {};    // ZRender实例map索引
	
	    var zrender = {};
	
	    /**
	     * @type {string}
	     */
	    zrender.version = '3.4.1';
	
	    /**
	     * Initializing a zrender instance
	     * @param {HTMLElement} dom
	     * @param {Object} opts
	     * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
	     * @param {number} [opts.devicePixelRatio]
	     * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
	     * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
	     * @return {module:zrender/ZRender}
	     */
	    zrender.init = function(dom, opts) {
	        var zr = new ZRender(guid(), dom, opts);
	        instances[zr.id] = zr;
	        return zr;
	    };
	
	    /**
	     * Dispose zrender instance
	     * @param {module:zrender/ZRender} zr
	     */
	    zrender.dispose = function (zr) {
	        if (zr) {
	            zr.dispose();
	        }
	        else {
	            for (var key in instances) {
	                if (instances.hasOwnProperty(key)) {
	                    instances[key].dispose();
	                }
	            }
	            instances = {};
	        }
	
	        return zrender;
	    };
	
	    /**
	     * Get zrender instance by id
	     * @param {string} id zrender instance id
	     * @return {module:zrender/ZRender}
	     */
	    zrender.getInstance = function (id) {
	        return instances[id];
	    };
	
	    zrender.registerPainter = function (name, Ctor) {
	        painterCtors[name] = Ctor;
	    };
	
	    function delInstance(id) {
	        delete instances[id];
	    }
	
	    /**
	     * @module zrender/ZRender
	     */
	    /**
	     * @constructor
	     * @alias module:zrender/ZRender
	     * @param {string} id
	     * @param {HTMLDomElement} dom
	     * @param {Object} opts
	     * @param {string} [opts.renderer='canvas'] 'canvas' or 'svg'
	     * @param {number} [opts.devicePixelRatio]
	     * @param {number} [opts.width] Can be 'auto' (the same as null/undefined)
	     * @param {number} [opts.height] Can be 'auto' (the same as null/undefined)
	     */
	    var ZRender = function(id, dom, opts) {
	
	        opts = opts || {};
	
	        /**
	         * @type {HTMLDomElement}
	         */
	        this.dom = dom;
	
	        /**
	         * @type {string}
	         */
	        this.id = id;
	
	        var self = this;
	        var storage = new Storage();
	
	        var rendererType = opts.renderer;
	        // TODO WebGL
	        if (useVML) {
	            if (!painterCtors.vml) {
	                throw new Error('You need to require \'zrender/vml/vml\' to support IE8');
	            }
	            rendererType = 'vml';
	        }
	        else if (!rendererType || !painterCtors[rendererType]) {
	            rendererType = 'canvas';
	        }
	        var painter = new painterCtors[rendererType](dom, storage, opts);
	
	        this.storage = storage;
	        this.painter = painter;
	
	        var handerProxy = !env.node ? new HandlerProxy(painter.getViewportRoot()) : null;
	        this.handler = new Handler(storage, painter, handerProxy, painter.root);
	
	        /**
	         * @type {module:zrender/animation/Animation}
	         */
	        this.animation = new Animation({
	            stage: {
	                update: zrUtil.bind(this.flush, this)
	            }
	        });
	        this.animation.start();
	
	        /**
	         * @type {boolean}
	         * @private
	         */
	        this._needsRefresh;
	
	        // 修改 storage.delFromMap, 每次删除元素之前删除动画
	        // FIXME 有点ugly
	        var oldDelFromMap = storage.delFromMap;
	        var oldAddToMap = storage.addToMap;
	
	        storage.delFromMap = function (elId) {
	            var el = storage.get(elId);
	
	            oldDelFromMap.call(storage, elId);
	
	            el && el.removeSelfFromZr(self);
	        };
	
	        storage.addToMap = function (el) {
	            oldAddToMap.call(storage, el);
	
	            el.addSelfToZr(self);
	        };
	    };
	
	    ZRender.prototype = {
	
	        constructor: ZRender,
	        /**
	         * 获取实例唯一标识
	         * @return {string}
	         */
	        getId: function () {
	            return this.id;
	        },
	
	        /**
	         * 添加元素
	         * @param  {module:zrender/Element} el
	         */
	        add: function (el) {
	            this.storage.addRoot(el);
	            this._needsRefresh = true;
	        },
	
	        /**
	         * 删除元素
	         * @param  {module:zrender/Element} el
	         */
	        remove: function (el) {
	            this.storage.delRoot(el);
	            this._needsRefresh = true;
	        },
	
	        /**
	         * Change configuration of layer
	         * @param {string} zLevel
	         * @param {Object} config
	         * @param {string} [config.clearColor=0] Clear color
	         * @param {string} [config.motionBlur=false] If enable motion blur
	         * @param {number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
	        */
	        configLayer: function (zLevel, config) {
	            this.painter.configLayer(zLevel, config);
	            this._needsRefresh = true;
	        },
	
	        /**
	         * Repaint the canvas immediately
	         */
	        refreshImmediately: function () {
	            // Clear needsRefresh ahead to avoid something wrong happens in refresh
	            // Or it will cause zrender refreshes again and again.
	            this._needsRefresh = false;
	            this.painter.refresh();
	            /**
	             * Avoid trigger zr.refresh in Element#beforeUpdate hook
	             */
	            this._needsRefresh = false;
	        },
	
	        /**
	         * Mark and repaint the canvas in the next frame of browser
	         */
	        refresh: function() {
	            this._needsRefresh = true;
	        },
	
	        /**
	         * Perform all refresh
	         */
	        flush: function () {
	            if (this._needsRefresh) {
	                this.refreshImmediately();
	            }
	            if (this._needsRefreshHover) {
	                this.refreshHoverImmediately();
	            }
	        },
	
	        /**
	         * Add element to hover layer
	         * @param  {module:zrender/Element} el
	         * @param {Object} style
	         */
	        addHover: function (el, style) {
	            if (this.painter.addHover) {
	                this.painter.addHover(el, style);
	                this.refreshHover();
	            }
	        },
	
	        /**
	         * Add element from hover layer
	         * @param  {module:zrender/Element} el
	         */
	        removeHover: function (el) {
	            if (this.painter.removeHover) {
	                this.painter.removeHover(el);
	                this.refreshHover();
	            }
	        },
	
	        /**
	         * Clear all hover elements in hover layer
	         * @param  {module:zrender/Element} el
	         */
	        clearHover: function () {
	            if (this.painter.clearHover) {
	                this.painter.clearHover();
	                this.refreshHover();
	            }
	        },
	
	        /**
	         * Refresh hover in next frame
	         */
	        refreshHover: function () {
	            this._needsRefreshHover = true;
	        },
	
	        /**
	         * Refresh hover immediately
	         */
	        refreshHoverImmediately: function () {
	            this._needsRefreshHover = false;
	            this.painter.refreshHover && this.painter.refreshHover();
	        },
	
	        /**
	         * Resize the canvas.
	         * Should be invoked when container size is changed
	         * @param {Object} [opts]
	         * @param {number|string} [opts.width] Can be 'auto' (the same as null/undefined)
	         * @param {number|string} [opts.height] Can be 'auto' (the same as null/undefined)
	         */
	        resize: function(opts) {
	            opts = opts || {};
	            this.painter.resize(opts.width, opts.height);
	            this.handler.resize();
	        },
	
	        /**
	         * Stop and clear all animation immediately
	         */
	        clearAnimation: function () {
	            this.animation.clear();
	        },
	
	        /**
	         * Get container width
	         */
	        getWidth: function() {
	            return this.painter.getWidth();
	        },
	
	        /**
	         * Get container height
	         */
	        getHeight: function() {
	            return this.painter.getHeight();
	        },
	
	        /**
	         * Export the canvas as Base64 URL
	         * @param {string} type
	         * @param {string} [backgroundColor='#fff']
	         * @return {string} Base64 URL
	         */
	        // toDataURL: function(type, backgroundColor) {
	        //     return this.painter.getRenderedCanvas({
	        //         backgroundColor: backgroundColor
	        //     }).toDataURL(type);
	        // },
	
	        /**
	         * Converting a path to image.
	         * It has much better performance of drawing image rather than drawing a vector path.
	         * @param {module:zrender/graphic/Path} e
	         * @param {number} width
	         * @param {number} height
	         */
	        pathToImage: function(e, dpr) {
	            return this.painter.pathToImage(e, dpr);
	        },
	
	        /**
	         * Set default cursor
	         * @param {string} [cursorStyle='default'] 例如 crosshair
	         */
	        setCursorStyle: function (cursorStyle) {
	            this.handler.setCursorStyle(cursorStyle);
	        },
	
	        /**
	         * Bind event
	         *
	         * @param {string} eventName Event name
	         * @param {Function} eventHandler Handler function
	         * @param {Object} [context] Context object
	         */
	        on: function(eventName, eventHandler, context) {
	            this.handler.on(eventName, eventHandler, context);
	        },
	
	        /**
	         * Unbind event
	         * @param {string} eventName Event name
	         * @param {Function} [eventHandler] Handler function
	         */
	        off: function(eventName, eventHandler) {
	            this.handler.off(eventName, eventHandler);
	        },
	
	        /**
	         * Trigger event manually
	         *
	         * @param {string} eventName Event name
	         * @param {event=} event Event object
	         */
	        trigger: function (eventName, event) {
	            this.handler.trigger(eventName, event);
	        },
	
	
	        /**
	         * Clear all objects and the canvas.
	         */
	        clear: function () {
	            this.storage.delRoot();
	            this.painter.clear();
	        },
	
	        /**
	         * Dispose self.
	         */
	        dispose: function () {
	            this.animation.stop();
	
	            this.clear();
	            this.storage.dispose();
	            this.painter.dispose();
	            this.handler.dispose();
	
	            this.animation =
	            this.storage =
	            this.painter =
	            this.handler = null;
	
	            delInstance(this.id);
	        }
	    };
	
	    module.exports = zrender;
	


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Handler
	 * @module zrender/Handler
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 *         pissang (shenyi.914@gmail.com)
	 */
	
	
	    var util = __webpack_require__(4);
	    var Draggable = __webpack_require__(39);
	
	    var Eventful = __webpack_require__(11);
	
	    function makeEventPacket(eveType, target, event) {
	        return {
	            type: eveType,
	            event: event,
	            target: target,
	            cancelBubble: false,
	            offsetX: event.zrX,
	            offsetY: event.zrY,
	            gestureEvent: event.gestureEvent,
	            pinchX: event.pinchX,
	            pinchY: event.pinchY,
	            pinchScale: event.pinchScale,
	            wheelDelta: event.zrDelta,
	            zrByTouch: event.zrByTouch
	        };
	    }
	
	    function EmptyProxy () {}
	    EmptyProxy.prototype.dispose = function () {};
	
	    var handlerNames = [
	        'click', 'dblclick', 'mousewheel', 'mouseout',
	        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
	    ];
	    /**
	     * @alias module:zrender/Handler
	     * @constructor
	     * @extends module:zrender/mixin/Eventful
	     * @param {module:zrender/Storage} storage Storage instance.
	     * @param {module:zrender/Painter} painter Painter instance.
	     * @param {module:zrender/dom/HandlerProxy} proxy HandlerProxy instance.
	     * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
	     */
	    var Handler = function(storage, painter, proxy, painterRoot) {
	        Eventful.call(this);
	
	        this.storage = storage;
	
	        this.painter = painter;
	
	        this.painterRoot = painterRoot;
	
	        proxy = proxy || new EmptyProxy();
	
	        /**
	         * Proxy of event. can be Dom, WebGLSurface, etc.
	         */
	        this.proxy = proxy;
	
	        // Attach handler
	        proxy.handler = this;
	
	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._hovered;
	
	        /**
	         * @private
	         * @type {Date}
	         */
	        this._lastTouchMoment;
	
	        /**
	         * @private
	         * @type {number}
	         */
	        this._lastX;
	
	        /**
	         * @private
	         * @type {number}
	         */
	        this._lastY;
	
	
	        Draggable.call(this);
	
	        util.each(handlerNames, function (name) {
	            proxy.on && proxy.on(name, this[name], this);
	        }, this);
	    };
	
	    Handler.prototype = {
	
	        constructor: Handler,
	
	        mousemove: function (event) {
	            var x = event.zrX;
	            var y = event.zrY;
	
	            var hovered = this.findHover(x, y, null);
	            var lastHovered = this._hovered;
	            var proxy = this.proxy;
	
	            this._hovered = hovered;
	
	            proxy.setCursor && proxy.setCursor(hovered ? hovered.cursor : 'default');
	
	            // Mouse out on previous hovered element
	            if (lastHovered && hovered !== lastHovered && lastHovered.__zr) {
	                this.dispatchToElement(lastHovered, 'mouseout', event);
	            }
	
	            // Mouse moving on one element
	            this.dispatchToElement(hovered, 'mousemove', event);
	
	            // Mouse over on a new element
	            if (hovered && hovered !== lastHovered) {
	                this.dispatchToElement(hovered, 'mouseover', event);
	            }
	        },
	
	        mouseout: function (event) {
	            this.dispatchToElement(this._hovered, 'mouseout', event);
	
	            // There might be some doms created by upper layer application
	            // at the same level of painter.getViewportRoot() (e.g., tooltip
	            // dom created by echarts), where 'globalout' event should not
	            // be triggered when mouse enters these doms. (But 'mouseout'
	            // should be triggered at the original hovered element as usual).
	            var element = event.toElement || event.relatedTarget;
	            var innerDom;
	            do {
	                element = element && element.parentNode;
	            }
	            while (element && element.nodeType != 9 && !(
	                innerDom = element === this.painterRoot
	            ));
	
	            !innerDom && this.trigger('globalout', {event: event});
	        },
	
	        /**
	         * Resize
	         */
	        resize: function (event) {
	            this._hovered = null;
	        },
	
	        /**
	         * Dispatch event
	         * @param {string} eventName
	         * @param {event=} eventArgs
	         */
	        dispatch: function (eventName, eventArgs) {
	            var handler = this[eventName];
	            handler && handler.call(this, eventArgs);
	        },
	
	        /**
	         * Dispose
	         */
	        dispose: function () {
	
	            this.proxy.dispose();
	
	            this.storage =
	            this.proxy =
	            this.painter = null;
	        },
	
	        /**
	         * 设置默认的cursor style
	         * @param {string} [cursorStyle='default'] 例如 crosshair
	         */
	        setCursorStyle: function (cursorStyle) {
	            var proxy = this.proxy;
	            proxy.setCursor && proxy.setCursor(cursorStyle);
	        },
	
	        /**
	         * 事件分发代理
	         *
	         * @private
	         * @param {Object} targetEl 目标图形元素
	         * @param {string} eventName 事件名称
	         * @param {Object} event 事件对象
	         */
	        dispatchToElement: function (targetEl, eventName, event) {
	            var eventHandler = 'on' + eventName;
	            var eventPacket = makeEventPacket(eventName, targetEl, event);
	
	            var el = targetEl;
	
	            while (el) {
	                el[eventHandler]
	                    && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));
	
	                el.trigger(eventName, eventPacket);
	
	                el = el.parent;
	
	                if (eventPacket.cancelBubble) {
	                    break;
	                }
	            }
	
	            if (!eventPacket.cancelBubble) {
	                // 冒泡到顶级 zrender 对象
	                this.trigger(eventName, eventPacket);
	                // 分发事件到用户自定义层
	                // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在
	                this.painter && this.painter.eachOtherLayer(function (layer) {
	                    if (typeof(layer[eventHandler]) == 'function') {
	                        layer[eventHandler].call(layer, eventPacket);
	                    }
	                    if (layer.trigger) {
	                        layer.trigger(eventName, eventPacket);
	                    }
	                });
	            }
	        },
	
	        /**
	         * @private
	         * @param {number} x
	         * @param {number} y
	         * @param {module:zrender/graphic/Displayable} exclude
	         * @method
	         */
	        findHover: function(x, y, exclude) {
	            var list = this.storage.getDisplayList();
	            for (var i = list.length - 1; i >= 0 ; i--) {
	                if (!list[i].silent
	                 && list[i] !== exclude
	                 // getDisplayList may include ignored item in VML mode
	                 && !list[i].ignore
	                 && isHover(list[i], x, y)) {
	                    return list[i];
	                }
	            }
	        }
	    };
	
	    // Common handlers
	    util.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
	        Handler.prototype[name] = function (event) {
	            // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
	            var hovered = this.findHover(event.zrX, event.zrY, null);
	
	            if (name === 'mousedown') {
	                this._downel = hovered;
	                // In case click triggered before mouseup
	                this._upel = hovered;
	            }
	            else if (name === 'mosueup') {
	                this._upel = hovered;
	            }
	            else if (name === 'click') {
	                if (this._downel !== this._upel) {
	                    return;
	                }
	            }
	
	            this.dispatchToElement(hovered, name, event);
	        };
	    });
	
	    function isHover(displayable, x, y) {
	        if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
	            var el = displayable;
	            while (el) {
	                // If ancestor is silent or clipped by ancestor
	                if (el.silent || (el.clipPath && !el.clipPath.contain(x, y)))  {
	                    return false;
	                }
	                el = el.parent;
	            }
	            return true;
	        }
	
	        return false;
	    }
	
	    util.mixin(Handler, Eventful);
	    util.mixin(Handler, Draggable);
	
	    module.exports = Handler;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Storage内容仓库模块
	 * @module zrender/Storage
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @author errorrik (errorrik@gmail.com)
	 * @author pissang (https://github.com/pissang/)
	 */
	
	
	    var util = __webpack_require__(4);
	    var env = __webpack_require__(45);
	
	    var Group = __webpack_require__(40);
	
	    // Use timsort because in most case elements are partially sorted
	    // https://jsfiddle.net/pissang/jr4x7mdm/8/
	    var timsort = __webpack_require__(66);
	
	    function shapeCompareFunc(a, b) {
	        if (a.zlevel === b.zlevel) {
	            if (a.z === b.z) {
	                // if (a.z2 === b.z2) {
	                //     // FIXME Slow has renderidx compare
	                //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
	                //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
	                //     return a.__renderidx - b.__renderidx;
	                // }
	                return a.z2 - b.z2;
	            }
	            return a.z - b.z;
	        }
	        return a.zlevel - b.zlevel;
	    }
	    /**
	     * 内容仓库 (M)
	     * @alias module:zrender/Storage
	     * @constructor
	     */
	    var Storage = function () {
	        // 所有常规形状，id索引的map
	        this._elements = {};
	
	        this._roots = [];
	
	        this._displayList = [];
	
	        this._displayListLen = 0;
	    };
	
	    Storage.prototype = {
	
	        constructor: Storage,
	
	        /**
	         * @param  {Function} cb
	         *
	         */
	        traverse: function (cb, context) {
	            for (var i = 0; i < this._roots.length; i++) {
	                this._roots[i].traverse(cb, context);
	            }
	        },
	
	        /**
	         * 返回所有图形的绘制队列
	         * @param {boolean} [update=false] 是否在返回前更新该数组
	         * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
	         *
	         * 详见{@link module:zrender/graphic/Displayable.prototype.updateDisplayList}
	         * @return {Array.<module:zrender/graphic/Displayable>}
	         */
	        getDisplayList: function (update, includeIgnore) {
	            includeIgnore = includeIgnore || false;
	            if (update) {
	                this.updateDisplayList(includeIgnore);
	            }
	            return this._displayList;
	        },
	
	        /**
	         * 更新图形的绘制队列。
	         * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
	         * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
	         * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
	         */
	        updateDisplayList: function (includeIgnore) {
	            this._displayListLen = 0;
	            var roots = this._roots;
	            var displayList = this._displayList;
	            for (var i = 0, len = roots.length; i < len; i++) {
	                this._updateAndAddDisplayable(roots[i], null, includeIgnore);
	            }
	            displayList.length = this._displayListLen;
	
	            // for (var i = 0, len = displayList.length; i < len; i++) {
	            //     displayList[i].__renderidx = i;
	            // }
	
	            // displayList.sort(shapeCompareFunc);
	            env.canvasSupported && timsort(displayList, shapeCompareFunc);
	        },
	
	        _updateAndAddDisplayable: function (el, clipPaths, includeIgnore) {
	
	            if (el.ignore && !includeIgnore) {
	                return;
	            }
	
	            el.beforeUpdate();
	
	            if (el.__dirty) {
	
	                el.update();
	
	            }
	
	            el.afterUpdate();
	
	            var userSetClipPath = el.clipPath;
	            if (userSetClipPath) {
	
	                // FIXME 效率影响
	                if (clipPaths) {
	                    clipPaths = clipPaths.slice();
	                }
	                else {
	                    clipPaths = [];
	                }
	
	                var currentClipPath = userSetClipPath;
	                var parentClipPath = el;
	                // Recursively add clip path
	                while (currentClipPath) {
	                    // clipPath 的变换是基于使用这个 clipPath 的元素
	                    currentClipPath.parent = parentClipPath;
	                    currentClipPath.updateTransform();
	
	                    clipPaths.push(currentClipPath);
	
	                    parentClipPath = currentClipPath;
	                    currentClipPath = currentClipPath.clipPath;
	                }
	            }
	
	            if (el.isGroup) {
	                var children = el._children;
	
	                for (var i = 0; i < children.length; i++) {
	                    var child = children[i];
	
	                    // Force to mark as dirty if group is dirty
	                    // FIXME __dirtyPath ?
	                    if (el.__dirty) {
	                        child.__dirty = true;
	                    }
	
	                    this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
	                }
	
	                // Mark group clean here
	                el.__dirty = false;
	
	            }
	            else {
	                el.__clipPaths = clipPaths;
	
	                this._displayList[this._displayListLen++] = el;
	            }
	        },
	
	        /**
	         * 添加图形(Shape)或者组(Group)到根节点
	         * @param {module:zrender/Element} el
	         */
	        addRoot: function (el) {
	            // Element has been added
	            if (this._elements[el.id]) {
	                return;
	            }
	
	            if (el instanceof Group) {
	                el.addChildrenToStorage(this);
	            }
	
	            this.addToMap(el);
	            this._roots.push(el);
	        },
	
	        /**
	         * 删除指定的图形(Shape)或者组(Group)
	         * @param {string|Array.<string>} [elId] 如果为空清空整个Storage
	         */
	        delRoot: function (elId) {
	            if (elId == null) {
	                // 不指定elId清空
	                for (var i = 0; i < this._roots.length; i++) {
	                    var root = this._roots[i];
	                    if (root instanceof Group) {
	                        root.delChildrenFromStorage(this);
	                    }
	                }
	
	                this._elements = {};
	                this._roots = [];
	                this._displayList = [];
	                this._displayListLen = 0;
	
	                return;
	            }
	
	            if (elId instanceof Array) {
	                for (var i = 0, l = elId.length; i < l; i++) {
	                    this.delRoot(elId[i]);
	                }
	                return;
	            }
	
	            var el;
	            if (typeof(elId) == 'string') {
	                el = this._elements[elId];
	            }
	            else {
	                el = elId;
	            }
	
	            var idx = util.indexOf(this._roots, el);
	            if (idx >= 0) {
	                this.delFromMap(el.id);
	                this._roots.splice(idx, 1);
	                if (el instanceof Group) {
	                    el.delChildrenFromStorage(this);
	                }
	            }
	        },
	
	        addToMap: function (el) {
	            if (el instanceof Group) {
	                el.__storage = this;
	            }
	            el.dirty(false);
	
	            this._elements[el.id] = el;
	
	            return this;
	        },
	
	        get: function (elId) {
	            return this._elements[elId];
	        },
	
	        delFromMap: function (elId) {
	            var elements = this._elements;
	            var el = elements[elId];
	            if (el) {
	                delete elements[elId];
	                if (el instanceof Group) {
	                    el.__storage = null;
	                }
	            }
	
	            return this;
	        },
	
	        /**
	         * 清空并且释放Storage
	         */
	        dispose: function () {
	            this._elements =
	            this._renderList =
	            this._roots = null;
	        },
	
	        displayableSortFunc: shapeCompareFunc
	    };
	
	    module.exports = Storage;
	


/***/ },
/* 66 */
/***/ function(module, exports) {

	// https://github.com/mziccard/node-timsort
	
	    var DEFAULT_MIN_MERGE = 32;
	
	    var DEFAULT_MIN_GALLOPING = 7;
	
	    var DEFAULT_TMP_STORAGE_LENGTH = 256;
	
	    function minRunLength(n) {
	        var r = 0;
	
	        while (n >= DEFAULT_MIN_MERGE) {
	            r |= n & 1;
	            n >>= 1;
	        }
	
	        return n + r;
	    }
	
	    function makeAscendingRun(array, lo, hi, compare) {
	        var runHi = lo + 1;
	
	        if (runHi === hi) {
	            return 1;
	        }
	
	        if (compare(array[runHi++], array[lo]) < 0) {
	            while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
	                runHi++;
	            }
	
	            reverseRun(array, lo, runHi);
	        }
	        else {
	            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
	                runHi++;
	            }
	        }
	
	        return runHi - lo;
	    }
	
	    function reverseRun(array, lo, hi) {
	        hi--;
	
	        while (lo < hi) {
	            var t = array[lo];
	            array[lo++] = array[hi];
	            array[hi--] = t;
	        }
	    }
	
	    function binaryInsertionSort(array, lo, hi, start, compare) {
	        if (start === lo) {
	            start++;
	        }
	
	        for (; start < hi; start++) {
	            var pivot = array[start];
	
	            var left = lo;
	            var right = start;
	            var mid;
	
	            while (left < right) {
	                mid = left + right >>> 1;
	
	                if (compare(pivot, array[mid]) < 0) {
	                    right = mid;
	                }
	                else {
	                    left = mid + 1;
	                }
	            }
	
	            var n = start - left;
	
	            switch (n) {
	                case 3:
	                    array[left + 3] = array[left + 2];
	
	                case 2:
	                    array[left + 2] = array[left + 1];
	
	                case 1:
	                    array[left + 1] = array[left];
	                    break;
	                default:
	                    while (n > 0) {
	                        array[left + n] = array[left + n - 1];
	                        n--;
	                    }
	            }
	
	            array[left] = pivot;
	        }
	    }
	
	    function gallopLeft(value, array, start, length, hint, compare) {
	        var lastOffset = 0;
	        var maxOffset = 0;
	        var offset = 1;
	
	        if (compare(value, array[start + hint]) > 0) {
	            maxOffset = length - hint;
	
	            while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            lastOffset += hint;
	            offset += hint;
	        }
	        else {
	            maxOffset = hint + 1;
	            while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            var tmp = lastOffset;
	            lastOffset = hint - offset;
	            offset = hint - tmp;
	        }
	
	        lastOffset++;
	        while (lastOffset < offset) {
	            var m = lastOffset + (offset - lastOffset >>> 1);
	
	            if (compare(value, array[start + m]) > 0) {
	                lastOffset = m + 1;
	            }
	            else {
	                offset = m;
	            }
	        }
	        return offset;
	    }
	
	    function gallopRight(value, array, start, length, hint, compare) {
	        var lastOffset = 0;
	        var maxOffset = 0;
	        var offset = 1;
	
	        if (compare(value, array[start + hint]) < 0) {
	            maxOffset = hint + 1;
	
	            while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            var tmp = lastOffset;
	            lastOffset = hint - offset;
	            offset = hint - tmp;
	        }
	        else {
	            maxOffset = length - hint;
	
	            while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
	                lastOffset = offset;
	                offset = (offset << 1) + 1;
	
	                if (offset <= 0) {
	                    offset = maxOffset;
	                }
	            }
	
	            if (offset > maxOffset) {
	                offset = maxOffset;
	            }
	
	            lastOffset += hint;
	            offset += hint;
	        }
	
	        lastOffset++;
	
	        while (lastOffset < offset) {
	            var m = lastOffset + (offset - lastOffset >>> 1);
	
	            if (compare(value, array[start + m]) < 0) {
	                offset = m;
	            }
	            else {
	                lastOffset = m + 1;
	            }
	        }
	
	        return offset;
	    }
	
	    function TimSort(array, compare) {
	        var minGallop = DEFAULT_MIN_GALLOPING;
	        var length = 0;
	        var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
	        var stackLength = 0;
	        var runStart;
	        var runLength;
	        var stackSize = 0;
	
	        length = array.length;
	
	        if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
	            tmpStorageLength = length >>> 1;
	        }
	
	        var tmp = [];
	
	        stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;
	
	        runStart = [];
	        runLength = [];
	
	        function pushRun(_runStart, _runLength) {
	            runStart[stackSize] = _runStart;
	            runLength[stackSize] = _runLength;
	            stackSize += 1;
	        }
	
	        function mergeRuns() {
	            while (stackSize > 1) {
	                var n = stackSize - 2;
	
	                if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
	                    if (runLength[n - 1] < runLength[n + 1]) {
	                        n--;
	                    }
	                }
	                else if (runLength[n] > runLength[n + 1]) {
	                    break;
	                }
	                mergeAt(n);
	            }
	        }
	
	        function forceMergeRuns() {
	            while (stackSize > 1) {
	                var n = stackSize - 2;
	
	                if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
	                    n--;
	                }
	
	                mergeAt(n);
	            }
	        }
	
	        function mergeAt(i) {
	            var start1 = runStart[i];
	            var length1 = runLength[i];
	            var start2 = runStart[i + 1];
	            var length2 = runLength[i + 1];
	
	            runLength[i] = length1 + length2;
	
	            if (i === stackSize - 3) {
	                runStart[i + 1] = runStart[i + 2];
	                runLength[i + 1] = runLength[i + 2];
	            }
	
	            stackSize--;
	
	            var k = gallopRight(array[start2], array, start1, length1, 0, compare);
	            start1 += k;
	            length1 -= k;
	
	            if (length1 === 0) {
	                return;
	            }
	
	            length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
	
	            if (length2 === 0) {
	                return;
	            }
	
	            if (length1 <= length2) {
	                mergeLow(start1, length1, start2, length2);
	            }
	            else {
	                mergeHigh(start1, length1, start2, length2);
	            }
	        }
	
	        function mergeLow(start1, length1, start2, length2) {
	            var i = 0;
	
	            for (i = 0; i < length1; i++) {
	                tmp[i] = array[start1 + i];
	            }
	
	            var cursor1 = 0;
	            var cursor2 = start2;
	            var dest = start1;
	
	            array[dest++] = array[cursor2++];
	
	            if (--length2 === 0) {
	                for (i = 0; i < length1; i++) {
	                    array[dest + i] = tmp[cursor1 + i];
	                }
	                return;
	            }
	
	            if (length1 === 1) {
	                for (i = 0; i < length2; i++) {
	                    array[dest + i] = array[cursor2 + i];
	                }
	                array[dest + length2] = tmp[cursor1];
	                return;
	            }
	
	            var _minGallop = minGallop;
	            var count1, count2, exit;
	
	            while (1) {
	                count1 = 0;
	                count2 = 0;
	                exit = false;
	
	                do {
	                    if (compare(array[cursor2], tmp[cursor1]) < 0) {
	                        array[dest++] = array[cursor2++];
	                        count2++;
	                        count1 = 0;
	
	                        if (--length2 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    else {
	                        array[dest++] = tmp[cursor1++];
	                        count1++;
	                        count2 = 0;
	                        if (--length1 === 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                } while ((count1 | count2) < _minGallop);
	
	                if (exit) {
	                    break;
	                }
	
	                do {
	                    count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
	
	                    if (count1 !== 0) {
	                        for (i = 0; i < count1; i++) {
	                            array[dest + i] = tmp[cursor1 + i];
	                        }
	
	                        dest += count1;
	                        cursor1 += count1;
	                        length1 -= count1;
	                        if (length1 <= 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest++] = array[cursor2++];
	
	                    if (--length2 === 0) {
	                        exit = true;
	                        break;
	                    }
	
	                    count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
	
	                    if (count2 !== 0) {
	                        for (i = 0; i < count2; i++) {
	                            array[dest + i] = array[cursor2 + i];
	                        }
	
	                        dest += count2;
	                        cursor2 += count2;
	                        length2 -= count2;
	
	                        if (length2 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    array[dest++] = tmp[cursor1++];
	
	                    if (--length1 === 1) {
	                        exit = true;
	                        break;
	                    }
	
	                    _minGallop--;
	                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
	
	                if (exit) {
	                    break;
	                }
	
	                if (_minGallop < 0) {
	                    _minGallop = 0;
	                }
	
	                _minGallop += 2;
	            }
	
	            minGallop = _minGallop;
	
	            minGallop < 1 && (minGallop = 1);
	
	            if (length1 === 1) {
	                for (i = 0; i < length2; i++) {
	                    array[dest + i] = array[cursor2 + i];
	                }
	                array[dest + length2] = tmp[cursor1];
	            }
	            else if (length1 === 0) {
	                throw new Error();
	                // throw new Error('mergeLow preconditions were not respected');
	            }
	            else {
	                for (i = 0; i < length1; i++) {
	                    array[dest + i] = tmp[cursor1 + i];
	                }
	            }
	        }
	
	        function mergeHigh (start1, length1, start2, length2) {
	            var i = 0;
	
	            for (i = 0; i < length2; i++) {
	                tmp[i] = array[start2 + i];
	            }
	
	            var cursor1 = start1 + length1 - 1;
	            var cursor2 = length2 - 1;
	            var dest = start2 + length2 - 1;
	            var customCursor = 0;
	            var customDest = 0;
	
	            array[dest--] = array[cursor1--];
	
	            if (--length1 === 0) {
	                customCursor = dest - (length2 - 1);
	
	                for (i = 0; i < length2; i++) {
	                    array[customCursor + i] = tmp[i];
	                }
	
	                return;
	            }
	
	            if (length2 === 1) {
	                dest -= length1;
	                cursor1 -= length1;
	                customDest = dest + 1;
	                customCursor = cursor1 + 1;
	
	                for (i = length1 - 1; i >= 0; i--) {
	                    array[customDest + i] = array[customCursor + i];
	                }
	
	                array[dest] = tmp[cursor2];
	                return;
	            }
	
	            var _minGallop = minGallop;
	
	            while (true) {
	                var count1 = 0;
	                var count2 = 0;
	                var exit = false;
	
	                do {
	                    if (compare(tmp[cursor2], array[cursor1]) < 0) {
	                        array[dest--] = array[cursor1--];
	                        count1++;
	                        count2 = 0;
	                        if (--length1 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                    else {
	                        array[dest--] = tmp[cursor2--];
	                        count2++;
	                        count1 = 0;
	                        if (--length2 === 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	                } while ((count1 | count2) < _minGallop);
	
	                if (exit) {
	                    break;
	                }
	
	                do {
	                    count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
	
	                    if (count1 !== 0) {
	                        dest -= count1;
	                        cursor1 -= count1;
	                        length1 -= count1;
	                        customDest = dest + 1;
	                        customCursor = cursor1 + 1;
	
	                        for (i = count1 - 1; i >= 0; i--) {
	                            array[customDest + i] = array[customCursor + i];
	                        }
	
	                        if (length1 === 0) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest--] = tmp[cursor2--];
	
	                    if (--length2 === 1) {
	                        exit = true;
	                        break;
	                    }
	
	                    count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
	
	                    if (count2 !== 0) {
	                        dest -= count2;
	                        cursor2 -= count2;
	                        length2 -= count2;
	                        customDest = dest + 1;
	                        customCursor = cursor2 + 1;
	
	                        for (i = 0; i < count2; i++) {
	                            array[customDest + i] = tmp[customCursor + i];
	                        }
	
	                        if (length2 <= 1) {
	                            exit = true;
	                            break;
	                        }
	                    }
	
	                    array[dest--] = array[cursor1--];
	
	                    if (--length1 === 0) {
	                        exit = true;
	                        break;
	                    }
	
	                    _minGallop--;
	                } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
	
	                if (exit) {
	                    break;
	                }
	
	                if (_minGallop < 0) {
	                    _minGallop = 0;
	                }
	
	                _minGallop += 2;
	            }
	
	            minGallop = _minGallop;
	
	            if (minGallop < 1) {
	                minGallop = 1;
	            }
	
	            if (length2 === 1) {
	                dest -= length1;
	                cursor1 -= length1;
	                customDest = dest + 1;
	                customCursor = cursor1 + 1;
	
	                for (i = length1 - 1; i >= 0; i--) {
	                    array[customDest + i] = array[customCursor + i];
	                }
	
	                array[dest] = tmp[cursor2];
	            }
	            else if (length2 === 0) {
	                throw new Error();
	                // throw new Error('mergeHigh preconditions were not respected');
	            }
	            else {
	                customCursor = dest - (length2 - 1);
	                for (i = 0; i < length2; i++) {
	                    array[customCursor + i] = tmp[i];
	                }
	            }
	        }
	
	        this.mergeRuns = mergeRuns;
	        this.forceMergeRuns = forceMergeRuns;
	        this.pushRun = pushRun;
	    }
	
	    function sort(array, compare, lo, hi) {
	        if (!lo) {
	            lo = 0;
	        }
	        if (!hi) {
	            hi = array.length;
	        }
	
	        var remaining = hi - lo;
	
	        if (remaining < 2) {
	            return;
	        }
	
	        var runLength = 0;
	
	        if (remaining < DEFAULT_MIN_MERGE) {
	            runLength = makeAscendingRun(array, lo, hi, compare);
	            binaryInsertionSort(array, lo, hi, lo + runLength, compare);
	            return;
	        }
	
	        var ts = new TimSort(array, compare);
	
	        var minRun = minRunLength(remaining);
	
	        do {
	            runLength = makeAscendingRun(array, lo, hi, compare);
	            if (runLength < minRun) {
	                var force = remaining;
	                if (force > minRun) {
	                    force = minRun;
	                }
	
	                binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
	                runLength = force;
	            }
	
	            ts.pushRun(lo, runLength);
	            ts.mergeRuns();
	
	            remaining -= runLength;
	            lo += runLength;
	        } while (remaining !== 0);
	
	        ts.forceMergeRuns();
	    }
	
	    module.exports = sort;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 动画主类, 调度和管理所有动画控制器
	 *
	 * @module zrender/animation/Animation
	 * @author pissang(https://github.com/pissang)
	 */
	// TODO Additive animation
	// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
	// https://developer.apple.com/videos/wwdc2014/#236
	
	
	    var util = __webpack_require__(4);
	    var Dispatcher = __webpack_require__(68).Dispatcher;
	
	    var requestAnimationFrame = __webpack_require__(69);
	
	    var Animator = __webpack_require__(16);
	    /**
	     * @typedef {Object} IZRenderStage
	     * @property {Function} update
	     */
	
	    /**
	     * @alias module:zrender/animation/Animation
	     * @constructor
	     * @param {Object} [options]
	     * @param {Function} [options.onframe]
	     * @param {IZRenderStage} [options.stage]
	     * @example
	     *     var animation = new Animation();
	     *     var obj = {
	     *         x: 100,
	     *         y: 100
	     *     };
	     *     animation.animate(node.position)
	     *         .when(1000, {
	     *             x: 500,
	     *             y: 500
	     *         })
	     *         .when(2000, {
	     *             x: 100,
	     *             y: 100
	     *         })
	     *         .start('spline');
	     */
	    var Animation = function (options) {
	
	        options = options || {};
	
	        this.stage = options.stage || {};
	
	        this.onframe = options.onframe || function() {};
	
	        // private properties
	        this._clips = [];
	
	        this._running = false;
	
	        this._time;
	
	        this._pausedTime;
	
	        this._pauseStart;
	
	        this._paused = false;
	
	        Dispatcher.call(this);
	    };
	
	    Animation.prototype = {
	
	        constructor: Animation,
	        /**
	         * 添加 clip
	         * @param {module:zrender/animation/Clip} clip
	         */
	        addClip: function (clip) {
	            this._clips.push(clip);
	        },
	        /**
	         * 添加 animator
	         * @param {module:zrender/animation/Animator} animator
	         */
	        addAnimator: function (animator) {
	            animator.animation = this;
	            var clips = animator.getClips();
	            for (var i = 0; i < clips.length; i++) {
	                this.addClip(clips[i]);
	            }
	        },
	        /**
	         * 删除动画片段
	         * @param {module:zrender/animation/Clip} clip
	         */
	        removeClip: function(clip) {
	            var idx = util.indexOf(this._clips, clip);
	            if (idx >= 0) {
	                this._clips.splice(idx, 1);
	            }
	        },
	
	        /**
	         * 删除动画片段
	         * @param {module:zrender/animation/Animator} animator
	         */
	        removeAnimator: function (animator) {
	            var clips = animator.getClips();
	            for (var i = 0; i < clips.length; i++) {
	                this.removeClip(clips[i]);
	            }
	            animator.animation = null;
	        },
	
	        _update: function() {
	
	            var time = new Date().getTime() - this._pausedTime;
	            var delta = time - this._time;
	            var clips = this._clips;
	            var len = clips.length;
	
	            var deferredEvents = [];
	            var deferredClips = [];
	            for (var i = 0; i < len; i++) {
	                var clip = clips[i];
	                var e = clip.step(time, delta);
	                // Throw out the events need to be called after
	                // stage.update, like destroy
	                if (e) {
	                    deferredEvents.push(e);
	                    deferredClips.push(clip);
	                }
	            }
	
	            // Remove the finished clip
	            for (var i = 0; i < len;) {
	                if (clips[i]._needsRemove) {
	                    clips[i] = clips[len - 1];
	                    clips.pop();
	                    len--;
	                }
	                else {
	                    i++;
	                }
	            }
	
	            len = deferredEvents.length;
	            for (var i = 0; i < len; i++) {
	                deferredClips[i].fire(deferredEvents[i]);
	            }
	
	            this._time = time;
	
	            this.onframe(delta);
	
	            this.trigger('frame', delta);
	
	            if (this.stage.update) {
	                this.stage.update();
	            }
	        },
	
	        _startLoop: function () {
	            var self = this;
	
	            this._running = true;
	
	            function step() {
	                if (self._running) {
	
	                    requestAnimationFrame(step);
	
	                    !self._paused && self._update();
	                }
	            }
	
	            requestAnimationFrame(step);
	        },
	
	        /**
	         * 开始运行动画
	         */
	        start: function () {
	
	            this._time = new Date().getTime();
	            this._pausedTime = 0;
	
	            this._startLoop();
	        },
	        /**
	         * 停止运行动画
	         */
	        stop: function () {
	            this._running = false;
	        },
	
	        /**
	         * Pause
	         */
	        pause: function () {
	            if (!this._paused) {
	                this._pauseStart = new Date().getTime();
	                this._paused = true;
	            }
	        },
	
	        /**
	         * Resume
	         */
	        resume: function () {
	            if (this._paused) {
	                this._pausedTime += (new Date().getTime()) - this._pauseStart;
	                this._paused = false;
	            }
	        },
	
	        /**
	         * 清除所有动画片段
	         */
	        clear: function () {
	            this._clips = [];
	        },
	        /**
	         * 对一个目标创建一个animator对象，可以指定目标中的属性使用动画
	         * @param  {Object} target
	         * @param  {Object} options
	         * @param  {boolean} [options.loop=false] 是否循环播放动画
	         * @param  {Function} [options.getter=null]
	         *         如果指定getter函数，会通过getter函数取属性值
	         * @param  {Function} [options.setter=null]
	         *         如果指定setter函数，会通过setter函数设置属性值
	         * @return {module:zrender/animation/Animation~Animator}
	         */
	        // TODO Gap
	        animate: function (target, options) {
	            options = options || {};
	
	            var animator = new Animator(
	                target,
	                options.loop,
	                options.getter,
	                options.setter
	            );
	
	            this.addAnimator(animator);
	
	            return animator;
	        }
	    };
	
	    util.mixin(Animation, Dispatcher);
	
	    module.exports = Animation;
	


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 事件辅助类
	 * @module zrender/core/event
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 */
	
	
	    var Eventful = __webpack_require__(11);
	    var env = __webpack_require__(45);
	
	    var isDomLevel2 = (typeof window !== 'undefined') && !!window.addEventListener;
	
	    function getBoundingClientRect(el) {
	        // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
	        return el.getBoundingClientRect ? el.getBoundingClientRect() : {left: 0, top: 0};
	    }
	
	    // `calculate` is optional, default false
	    function clientToLocal(el, e, out, calculate) {
	        out = out || {};
	
	        // According to the W3C Working Draft, offsetX and offsetY should be relative
	        // to the padding edge of the target element. The only browser using this convention
	        // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
	        // not support the properties.
	        // (see http://www.jacklmoore.com/notes/mouse-position/)
	        // In zr painter.dom, padding edge equals to border edge.
	
	        // FIXME
	        // When mousemove event triggered on ec tooltip, target is not zr painter.dom, and
	        // offsetX/Y is relative to e.target, where the calculation of zrX/Y via offsetX/Y
	        // is too complex. So css-transfrom dont support in this case temporarily.
	        if (calculate || !env.canvasSupported) {
	            defaultGetZrXY(el, e, out);
	        }
	        // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
	        // ancestor element, so we should make sure el is positioned (e.g., not position:static).
	        // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
	        // zoom-factor, overflow / opacity layers, transforms ...)
	        // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
	        // <https://bugs.jquery.com/ticket/8523#comment:14>
	        // BTW3, In ff, offsetX/offsetY is always 0.
	        else if (env.browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
	            out.zrX = e.layerX;
	            out.zrY = e.layerY;
	        }
	        // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
	        else if (e.offsetX != null) {
	            out.zrX = e.offsetX;
	            out.zrY = e.offsetY;
	        }
	        // For some other device, e.g., IOS safari.
	        else {
	            defaultGetZrXY(el, e, out);
	        }
	
	        return out;
	    }
	
	    function defaultGetZrXY(el, e, out) {
	        // This well-known method below does not support css transform.
	        var box = getBoundingClientRect(el);
	        out.zrX = e.clientX - box.left;
	        out.zrY = e.clientY - box.top;
	    }
	
	    /**
	     * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标.
	     * `calculate` is optional, default false.
	     */
	    function normalizeEvent(el, e, calculate) {
	
	        e = e || window.event;
	
	        if (e.zrX != null) {
	            return e;
	        }
	
	        var eventType = e.type;
	        var isTouch = eventType && eventType.indexOf('touch') >= 0;
	
	        if (!isTouch) {
	            clientToLocal(el, e, e, calculate);
	            e.zrDelta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
	        }
	        else {
	            var touch = eventType != 'touchend'
	                ? e.targetTouches[0]
	                : e.changedTouches[0];
	            touch && clientToLocal(el, touch, e, calculate);
	        }
	
	        return e;
	    }
	
	    function addEventListener(el, name, handler) {
	        if (isDomLevel2) {
	            el.addEventListener(name, handler);
	        }
	        else {
	            el.attachEvent('on' + name, handler);
	        }
	    }
	
	    function removeEventListener(el, name, handler) {
	        if (isDomLevel2) {
	            el.removeEventListener(name, handler);
	        }
	        else {
	            el.detachEvent('on' + name, handler);
	        }
	    }
	
	    /**
	     * preventDefault and stopPropagation.
	     * Notice: do not do that in zrender. Upper application
	     * do that if necessary.
	     *
	     * @memberOf module:zrender/core/event
	     * @method
	     * @param {Event} e : event对象
	     */
	    var stop = isDomLevel2
	        ? function (e) {
	            e.preventDefault();
	            e.stopPropagation();
	            e.cancelBubble = true;
	        }
	        : function (e) {
	            e.returnValue = false;
	            e.cancelBubble = true;
	        };
	
	    module.exports = {
	        clientToLocal: clientToLocal,
	        normalizeEvent: normalizeEvent,
	        addEventListener: addEventListener,
	        removeEventListener: removeEventListener,
	
	        stop: stop,
	        // 做向上兼容
	        Dispatcher: Eventful
	    };
	


/***/ },
/* 69 */
/***/ function(module, exports) {

	
	
	    module.exports = (typeof window !== 'undefined' &&
	                                    (window.requestAnimationFrame
	                                    || window.msRequestAnimationFrame
	                                    || window.mozRequestAnimationFrame
	                                    || window.webkitRequestAnimationFrame))
	                                || function (func) {
	                                    setTimeout(func, 16);
	                                };
	


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var eventTool = __webpack_require__(68);
	    var zrUtil = __webpack_require__(4);
	    var Eventful = __webpack_require__(11);
	    var env = __webpack_require__(45);
	    var GestureMgr = __webpack_require__(71);
	
	    var addEventListener = eventTool.addEventListener;
	    var removeEventListener = eventTool.removeEventListener;
	    var normalizeEvent = eventTool.normalizeEvent;
	
	    var TOUCH_CLICK_DELAY = 300;
	
	    var mouseHandlerNames = [
	        'click', 'dblclick', 'mousewheel', 'mouseout',
	        'mouseup', 'mousedown', 'mousemove', 'contextmenu'
	    ];
	
	    var touchHandlerNames = [
	        'touchstart', 'touchend', 'touchmove'
	    ];
	
	    var pointerEventNames = {
	        pointerdown: 1, pointerup: 1, pointermove: 1, pointerout: 1
	    };
	
	    var pointerHandlerNames = zrUtil.map(mouseHandlerNames, function (name) {
	        var nm = name.replace('mouse', 'pointer');
	        return pointerEventNames[nm] ? nm : name;
	    });
	
	    function eventNameFix(name) {
	        return (name === 'mousewheel' && env.browser.firefox) ? 'DOMMouseScroll' : name;
	    }
	
	    function processGesture(proxy, event, stage) {
	        var gestureMgr = proxy._gestureMgr;
	
	        stage === 'start' && gestureMgr.clear();
	
	        var gestureInfo = gestureMgr.recognize(
	            event,
	            proxy.handler.findHover(event.zrX, event.zrY, null),
	            proxy.dom
	        );
	
	        stage === 'end' && gestureMgr.clear();
	
	        // Do not do any preventDefault here. Upper application do that if necessary.
	        if (gestureInfo) {
	            var type = gestureInfo.type;
	            event.gestureEvent = type;
	
	            proxy.handler.dispatchToElement(gestureInfo.target, type, gestureInfo.event);
	        }
	    }
	
	    // function onMSGestureChange(proxy, event) {
	    //     if (event.translationX || event.translationY) {
	    //         // mousemove is carried by MSGesture to reduce the sensitivity.
	    //         proxy.handler.dispatchToElement(event.target, 'mousemove', event);
	    //     }
	    //     if (event.scale !== 1) {
	    //         event.pinchX = event.offsetX;
	    //         event.pinchY = event.offsetY;
	    //         event.pinchScale = event.scale;
	    //         proxy.handler.dispatchToElement(event.target, 'pinch', event);
	    //     }
	    // }
	
	    /**
	     * Prevent mouse event from being dispatched after Touch Events action
	     * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
	     * 1. Mobile browsers dispatch mouse events 300ms after touchend.
	     * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
	     * Result: Blocking Mouse Events for 700ms.
	     */
	    function setTouchTimer(instance) {
	        instance._touching = true;
	        clearTimeout(instance._touchTimer);
	        instance._touchTimer = setTimeout(function () {
	            instance._touching = false;
	        }, 700);
	    }
	
	
	    var domHandlers = {
	        /**
	         * Mouse move handler
	         * @inner
	         * @param {Event} event
	         */
	        mousemove: function (event) {
	            event = normalizeEvent(this.dom, event);
	
	            this.trigger('mousemove', event);
	        },
	
	        /**
	         * Mouse out handler
	         * @inner
	         * @param {Event} event
	         */
	        mouseout: function (event) {
	            event = normalizeEvent(this.dom, event);
	
	            var element = event.toElement || event.relatedTarget;
	            if (element != this.dom) {
	                while (element && element.nodeType != 9) {
	                    // 忽略包含在root中的dom引起的mouseOut
	                    if (element === this.dom) {
	                        return;
	                    }
	
	                    element = element.parentNode;
	                }
	            }
	
	            this.trigger('mouseout', event);
	        },
	
	        /**
	         * Touch开始响应函数
	         * @inner
	         * @param {Event} event
	         */
	        touchstart: function (event) {
	            // Default mouse behaviour should not be disabled here.
	            // For example, page may needs to be slided.
	            event = normalizeEvent(this.dom, event);
	
	            // Mark touch, which is useful in distinguish touch and
	            // mouse event in upper applicatoin.
	            event.zrByTouch = true;
	
	            this._lastTouchMoment = new Date();
	
	            processGesture(this, event, 'start');
	
	            // In touch device, trigger `mousemove`(`mouseover`) should
	            // be triggered, and must before `mousedown` triggered.
	            domHandlers.mousemove.call(this, event);
	
	            domHandlers.mousedown.call(this, event);
	
	            setTouchTimer(this);
	        },
	
	        /**
	         * Touch移动响应函数
	         * @inner
	         * @param {Event} event
	         */
	        touchmove: function (event) {
	
	            event = normalizeEvent(this.dom, event);
	
	            // Mark touch, which is useful in distinguish touch and
	            // mouse event in upper applicatoin.
	            event.zrByTouch = true;
	
	            processGesture(this, event, 'change');
	
	            // Mouse move should always be triggered no matter whether
	            // there is gestrue event, because mouse move and pinch may
	            // be used at the same time.
	            domHandlers.mousemove.call(this, event);
	
	            setTouchTimer(this);
	        },
	
	        /**
	         * Touch结束响应函数
	         * @inner
	         * @param {Event} event
	         */
	        touchend: function (event) {
	
	            event = normalizeEvent(this.dom, event);
	
	            // Mark touch, which is useful in distinguish touch and
	            // mouse event in upper applicatoin.
	            event.zrByTouch = true;
	
	            processGesture(this, event, 'end');
	
	            domHandlers.mouseup.call(this, event);
	
	            // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
	            // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
	            // we can conveniently implement "hover style" in both PC and touch device just
	            // by listening to `mouseover` to add "hover style" and listening to `mouseout`
	            // to remove "hover style" on an element, without any additional code for
	            // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
	            // style" will remain for user view)
	
	            // click event should always be triggered no matter whether
	            // there is gestrue event. System click can not be prevented.
	            if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
	                domHandlers.click.call(this, event);
	            }
	
	            setTouchTimer(this);
	        },
	
	        pointerdown: function (event) {
	            domHandlers.mousedown.call(this, event);
	
	            // if (useMSGuesture(this, event)) {
	            //     this._msGesture.addPointer(event.pointerId);
	            // }
	        },
	
	        pointermove: function (event) {
	            // FIXME
	            // pointermove is so sensitive that it always triggered when
	            // tap(click) on touch screen, which affect some judgement in
	            // upper application. So, we dont support mousemove on MS touch
	            // device yet.
	            if (!isPointerFromTouch(event)) {
	                domHandlers.mousemove.call(this, event);
	            }
	        },
	
	        pointerup: function (event) {
	            domHandlers.mouseup.call(this, event);
	        },
	
	        pointerout: function (event) {
	            // pointerout will be triggered when tap on touch screen
	            // (IE11+/Edge on MS Surface) after click event triggered,
	            // which is inconsistent with the mousout behavior we defined
	            // in touchend. So we unify them.
	            // (check domHandlers.touchend for detailed explanation)
	            if (!isPointerFromTouch(event)) {
	                domHandlers.mouseout.call(this, event);
	            }
	        }
	    };
	
	    function isPointerFromTouch(event) {
	        var pointerType = event.pointerType;
	        return pointerType === 'pen' || pointerType === 'touch';
	    }
	
	    // function useMSGuesture(handlerProxy, event) {
	    //     return isPointerFromTouch(event) && !!handlerProxy._msGesture;
	    // }
	
	    // Common handlers
	    zrUtil.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
	        domHandlers[name] = function (event) {
	            event = normalizeEvent(this.dom, event);
	            this.trigger(name, event);
	        };
	    });
	
	    /**
	     * 为控制类实例初始化dom 事件处理函数
	     *
	     * @inner
	     * @param {module:zrender/Handler} instance 控制类实例
	     */
	    function initDomHandler(instance) {
	        zrUtil.each(touchHandlerNames, function (name) {
	            instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
	        });
	
	        zrUtil.each(pointerHandlerNames, function (name) {
	            instance._handlers[name] = zrUtil.bind(domHandlers[name], instance);
	        });
	
	        zrUtil.each(mouseHandlerNames, function (name) {
	            instance._handlers[name] = makeMouseHandler(domHandlers[name], instance);
	        });
	
	        function makeMouseHandler(fn, instance) {
	            return function () {
	                if (instance._touching) {
	                    return;
	                }
	                return fn.apply(instance, arguments);
	            };
	        }
	    }
	
	
	    function HandlerDomProxy(dom) {
	        Eventful.call(this);
	
	        this.dom = dom;
	
	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._touching = false;
	
	        /**
	         * @private
	         * @type {number}
	         */
	        this._touchTimer;
	
	        /**
	         * @private
	         * @type {module:zrender/core/GestureMgr}
	         */
	        this._gestureMgr = new GestureMgr();
	
	        this._handlers = {};
	
	        initDomHandler(this);
	
	        if (env.pointerEventsSupported) { // Only IE11+/Edge
	            // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
	            // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
	            // at the same time.
	            // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
	            // screen, which do not occurs in pointer event.
	            // So we use pointer event to both detect touch gesture and mouse behavior.
	            mountHandlers(pointerHandlerNames, this);
	
	            // FIXME
	            // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
	            // which does not prevent defuault behavior occasionally (which may cause view port
	            // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
	            // So we have to not to use MSGesture and not to support touchmove and pinch on MS
	            // touch screen. And we only support click behavior on MS touch screen now.
	
	            // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
	            // We dont support touch on IE on win7.
	            // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
	            // if (typeof MSGesture === 'function') {
	            //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
	            //     dom.addEventListener('MSGestureChange', onMSGestureChange);
	            // }
	        }
	        else {
	            if (env.touchEventsSupported) {
	                mountHandlers(touchHandlerNames, this);
	                // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
	                // addEventListener(root, 'mouseout', this._mouseoutHandler);
	            }
	
	            // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
	            // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
	            // mouse event can not be handle in those devices.
	            // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
	            // mouseevent after touch event triggered, see `setTouchTimer`.
	            mountHandlers(mouseHandlerNames, this);
	        }
	
	        function mountHandlers(handlerNames, instance) {
	            zrUtil.each(handlerNames, function (name) {
	                addEventListener(dom, eventNameFix(name), instance._handlers[name]);
	            }, instance);
	        }
	    }
	
	    var handlerDomProxyProto = HandlerDomProxy.prototype;
	    handlerDomProxyProto.dispose = function () {
	        var handlerNames = mouseHandlerNames.concat(touchHandlerNames);
	
	        for (var i = 0; i < handlerNames.length; i++) {
	            var name = handlerNames[i];
	            removeEventListener(this.dom, eventNameFix(name), this._handlers[name]);
	        }
	    };
	
	    handlerDomProxyProto.setCursor = function (cursorStyle) {
	        this.dom.style.cursor = cursorStyle || 'default';
	    };
	
	    zrUtil.mixin(HandlerDomProxy, Eventful);
	
	    module.exports = HandlerDomProxy;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Only implements needed gestures for mobile.
	 */
	
	
	    var eventUtil = __webpack_require__(68);
	
	    var GestureMgr = function () {
	
	        /**
	         * @private
	         * @type {Array.<Object>}
	         */
	        this._track = [];
	    };
	
	    GestureMgr.prototype = {
	
	        constructor: GestureMgr,
	
	        recognize: function (event, target, root) {
	            this._doTrack(event, target, root);
	            return this._recognize(event);
	        },
	
	        clear: function () {
	            this._track.length = 0;
	            return this;
	        },
	
	        _doTrack: function (event, target, root) {
	            var touches = event.touches;
	
	            if (!touches) {
	                return;
	            }
	
	            var trackItem = {
	                points: [],
	                touches: [],
	                target: target,
	                event: event
	            };
	
	            for (var i = 0, len = touches.length; i < len; i++) {
	                var touch = touches[i];
	                var pos = eventUtil.clientToLocal(root, touch, {});
	                trackItem.points.push([pos.zrX, pos.zrY]);
	                trackItem.touches.push(touch);
	            }
	
	            this._track.push(trackItem);
	        },
	
	        _recognize: function (event) {
	            for (var eventName in recognizers) {
	                if (recognizers.hasOwnProperty(eventName)) {
	                    var gestureInfo = recognizers[eventName](this._track, event);
	                    if (gestureInfo) {
	                        return gestureInfo;
	                    }
	                }
	            }
	        }
	    };
	
	    function dist(pointPair) {
	        var dx = pointPair[1][0] - pointPair[0][0];
	        var dy = pointPair[1][1] - pointPair[0][1];
	
	        return Math.sqrt(dx * dx + dy * dy);
	    }
	
	    function center(pointPair) {
	        return [
	            (pointPair[0][0] + pointPair[1][0]) / 2,
	            (pointPair[0][1] + pointPair[1][1]) / 2
	        ];
	    }
	
	    var recognizers = {
	
	        pinch: function (track, event) {
	            var trackLen = track.length;
	
	            if (!trackLen) {
	                return;
	            }
	
	            var pinchEnd = (track[trackLen - 1] || {}).points;
	            var pinchPre = (track[trackLen - 2] || {}).points || pinchEnd;
	
	            if (pinchPre
	                && pinchPre.length > 1
	                && pinchEnd
	                && pinchEnd.length > 1
	            ) {
	                var pinchScale = dist(pinchEnd) / dist(pinchPre);
	                !isFinite(pinchScale) && (pinchScale = 1);
	
	                event.pinchScale = pinchScale;
	
	                var pinchCenter = center(pinchEnd);
	                event.pinchX = pinchCenter[0];
	                event.pinchY = pinchCenter[1];
	
	                return {
	                    type: 'pinch',
	                    target: track[0].target,
	                    event: event
	                };
	            }
	        }
	
	        // Only pinch currently.
	    };
	
	    module.exports = GestureMgr;
	


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Default canvas painter
	 * @module zrender/Painter
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 */
	 
	
	    var config = __webpack_require__(22);
	    var util = __webpack_require__(4);
	    var log = __webpack_require__(21);
	    var BoundingRect = __webpack_require__(25);
	    var timsort = __webpack_require__(66);
	
	    var Layer = __webpack_require__(73);
	
	    var requestAnimationFrame = __webpack_require__(69);
	
	    // PENDIGN
	    // Layer exceeds MAX_PROGRESSIVE_LAYER_NUMBER may have some problem when flush directly second time.
	    //
	    // Maximum progressive layer. When exceeding this number. All elements will be drawed in the last layer.
	    var MAX_PROGRESSIVE_LAYER_NUMBER = 5;
	
	    function parseInt10(val) {
	        return parseInt(val, 10);
	    }
	
	    function isLayerValid(layer) {
	        if (!layer) {
	            return false;
	        }
	
	        if (layer.__builtin__) {
	            return true;
	        }
	
	        if (typeof(layer.resize) !== 'function'
	            || typeof(layer.refresh) !== 'function'
	        ) {
	            return false;
	        }
	
	        return true;
	    }
	
	    function preProcessLayer(layer) {
	        layer.__unusedCount++;
	    }
	
	    function postProcessLayer(layer) {
	        if (layer.__unusedCount == 1) {
	            layer.clear();
	        }
	    }
	
	    var tmpRect = new BoundingRect(0, 0, 0, 0);
	    var viewRect = new BoundingRect(0, 0, 0, 0);
	    function isDisplayableCulled(el, width, height) {
	        tmpRect.copy(el.getBoundingRect());
	        if (el.transform) {
	            tmpRect.applyTransform(el.transform);
	        }
	        viewRect.width = width;
	        viewRect.height = height;
	        return !tmpRect.intersect(viewRect);
	    }
	
	    function isClipPathChanged(clipPaths, prevClipPaths) {
	        if (clipPaths == prevClipPaths) { // Can both be null or undefined
	            return false;
	        }
	
	        if (!clipPaths || !prevClipPaths || (clipPaths.length !== prevClipPaths.length)) {
	            return true;
	        }
	        for (var i = 0; i < clipPaths.length; i++) {
	            if (clipPaths[i] !== prevClipPaths[i]) {
	                return true;
	            }
	        }
	    }
	
	    function doClip(clipPaths, ctx) {
	        for (var i = 0; i < clipPaths.length; i++) {
	            var clipPath = clipPaths[i];
	            var path = clipPath.path;
	
	            clipPath.setTransform(ctx);
	            path.beginPath(ctx);
	            clipPath.buildPath(path, clipPath.shape);
	            ctx.clip();
	            // Transform back
	            clipPath.restoreTransform(ctx);
	        }
	    }
	
	    function createRoot(width, height) {
	        var domRoot = document.createElement('div');
	
	        // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬
	        domRoot.style.cssText = [
	            'position:relative',
	            'overflow:hidden',
	            'width:' + width + 'px',
	            'height:' + height + 'px',
	            'padding:0',
	            'margin:0',
	            'border-width:0'
	        ].join(';') + ';';
	
	        return domRoot;
	    }
	
	    /**
	     * @alias module:zrender/Painter
	     * @constructor
	     * @param {HTMLElement} root 绘图容器
	     * @param {module:zrender/Storage} storage
	     * @param {Ojbect} opts
	     */
	    var Painter = function (root, storage, opts) {
	        // In node environment using node-canvas
	        var singleCanvas = !root.nodeName // In node ?
	            || root.nodeName.toUpperCase() === 'CANVAS';
	
	        this._opts = opts = util.extend({}, opts || {});
	
	        /**
	         * @type {number}
	         */
	        this.dpr = opts.devicePixelRatio || config.devicePixelRatio;
	        /**
	         * @type {boolean}
	         * @private
	         */
	        this._singleCanvas = singleCanvas;
	        /**
	         * 绘图容器
	         * @type {HTMLElement}
	         */
	        this.root = root;
	
	        var rootStyle = root.style;
	
	        if (rootStyle) {
	            rootStyle['-webkit-tap-highlight-color'] = 'transparent';
	            rootStyle['-webkit-user-select'] =
	            rootStyle['user-select'] =
	            rootStyle['-webkit-touch-callout'] = 'none';
	
	            root.innerHTML = '';
	        }
	
	        /**
	         * @type {module:zrender/Storage}
	         */
	        this.storage = storage;
	
	        /**
	         * @type {Array.<number>}
	         * @private
	         */
	        var zlevelList = this._zlevelList = [];
	
	        /**
	         * @type {Object.<string, module:zrender/Layer>}
	         * @private
	         */
	        var layers = this._layers = {};
	
	        /**
	         * @type {Object.<string, Object>}
	         * @type {private}
	         */
	        this._layerConfig = {};
	
	        if (!singleCanvas) {
	            this._width = this._getSize(0);
	            this._height = this._getSize(1);
	
	            var domRoot = this._domRoot = createRoot(
	                this._width, this._height
	            );
	            root.appendChild(domRoot);
	        }
	        else {
	            if (opts.width != null) {
	                root.width = opts.width;
	            }
	            if (opts.height != null) {
	                root.height = opts.height;
	            }
	            // Use canvas width and height directly
	            var width = root.width;
	            var height = root.height;
	            this._width = width;
	            this._height = height;
	
	            // Create layer if only one given canvas
	            // Device pixel ratio is fixed to 1 because given canvas has its specified width and height
	            var mainLayer = new Layer(root, this, 1);
	            mainLayer.initContext();
	            // FIXME Use canvas width and height
	            // mainLayer.resize(width, height);
	            layers[0] = mainLayer;
	            zlevelList.push(0);
	
	            this._domRoot = root;
	        }
	
	        // Layers for progressive rendering
	        this._progressiveLayers = [];
	
	        /**
	         * @type {module:zrender/Layer}
	         * @private
	         */
	        this._hoverlayer;
	
	        this._hoverElements = [];
	    };
	
	    Painter.prototype = {
	
	        constructor: Painter,
	
	        /**
	         * If painter use a single canvas
	         * @return {boolean}
	         */
	        isSingleCanvas: function () {
	            return this._singleCanvas;
	        },
	        /**
	         * @return {HTMLDivElement}
	         */
	        getViewportRoot: function () {
	            return this._domRoot;
	        },
	
	        /**
	         * 刷新
	         * @param {boolean} [paintAll=false] 强制绘制所有displayable
	         */
	        refresh: function (paintAll) {
	
	            var list = this.storage.getDisplayList(true);
	
	            var zlevelList = this._zlevelList;
	
	            this._paintList(list, paintAll);
	
	            // Paint custum layers
	            for (var i = 0; i < zlevelList.length; i++) {
	                var z = zlevelList[i];
	                var layer = this._layers[z];
	                if (!layer.__builtin__ && layer.refresh) {
	                    layer.refresh();
	                }
	            }
	
	            this.refreshHover();
	
	            if (this._progressiveLayers.length) {
	                this._startProgessive();
	            }
	
	            return this;
	        },
	
	        addHover: function (el, hoverStyle) {
	            if (el.__hoverMir) {
	                return;
	            }
	            var elMirror = new el.constructor({
	                style: el.style,
	                shape: el.shape
	            });
	            elMirror.__from = el;
	            el.__hoverMir = elMirror;
	            elMirror.setStyle(hoverStyle);
	            this._hoverElements.push(elMirror);
	        },
	
	        removeHover: function (el) {
	            var elMirror = el.__hoverMir;
	            var hoverElements = this._hoverElements;
	            var idx = util.indexOf(hoverElements, elMirror);
	            if (idx >= 0) {
	                hoverElements.splice(idx, 1);
	            }
	            el.__hoverMir = null;
	        },
	
	        clearHover: function (el) {
	            var hoverElements = this._hoverElements;
	            for (var i = 0; i < hoverElements.length; i++) {
	                var from = hoverElements[i].__from;
	                if (from) {
	                    from.__hoverMir = null;
	                }
	            }
	            hoverElements.length = 0;
	        },
	
	        refreshHover: function () {
	            var hoverElements = this._hoverElements;
	            var len = hoverElements.length;
	            var hoverLayer = this._hoverlayer;
	            hoverLayer && hoverLayer.clear();
	
	            if (!len) {
	                return;
	            }
	            timsort(hoverElements, this.storage.displayableSortFunc);
	
	            // Use a extream large zlevel
	            // FIXME?
	            if (!hoverLayer) {
	                hoverLayer = this._hoverlayer = this.getLayer(1e5);
	            }
	
	            var scope = {};
	            hoverLayer.ctx.save();
	            for (var i = 0; i < len;) {
	                var el = hoverElements[i];
	                var originalEl = el.__from;
	                // Original el is removed
	                // PENDING
	                if (!(originalEl && originalEl.__zr)) {
	                    hoverElements.splice(i, 1);
	                    originalEl.__hoverMir = null;
	                    len--;
	                    continue;
	                }
	                i++;
	
	                // Use transform
	                // FIXME style and shape ?
	                if (!originalEl.invisible) {
	                    el.transform = originalEl.transform;
	                    el.invTransform = originalEl.invTransform;
	                    el.__clipPaths = originalEl.__clipPaths;
	                    // el.
	                    this._doPaintEl(el, hoverLayer, true, scope);
	                }
	            }
	            hoverLayer.ctx.restore();
	        },
	
	        _startProgessive: function () {
	            var self = this;
	
	            if (!self._furtherProgressive) {
	                return;
	            }
	
	            // Use a token to stop progress steps triggered by
	            // previous zr.refresh calling.
	            var token = self._progressiveToken = +new Date();
	
	            self._progress++;
	            requestAnimationFrame(step);
	
	            function step() {
	                // In case refreshed or disposed
	                if (token === self._progressiveToken && self.storage) {
	
	                    self._doPaintList(self.storage.getDisplayList());
	
	                    if (self._furtherProgressive) {
	                        self._progress++;
	                        requestAnimationFrame(step);
	                    }
	                    else {
	                        self._progressiveToken = -1;
	                    }
	                }
	            }
	        },
	
	        _clearProgressive: function () {
	            this._progressiveToken = -1;
	            this._progress = 0;
	            util.each(this._progressiveLayers, function (layer) {
	                layer.__dirty && layer.clear();
	            });
	        },
	
	        _paintList: function (list, paintAll) {
	
	            if (paintAll == null) {
	                paintAll = false;
	            }
	
	            this._updateLayerStatus(list);
	
	            this._clearProgressive();
	
	            this.eachBuiltinLayer(preProcessLayer);
	
	            this._doPaintList(list, paintAll);
	
	            this.eachBuiltinLayer(postProcessLayer);
	        },
	
	        _doPaintList: function (list, paintAll) {
	            var currentLayer;
	            var currentZLevel;
	            var ctx;
	
	            // var invTransform = [];
	            var scope;
	
	            var progressiveLayerIdx = 0;
	            var currentProgressiveLayer;
	
	            var width = this._width;
	            var height = this._height;
	            var layerProgress;
	            var frame = this._progress;
	            function flushProgressiveLayer(layer) {
	                var dpr = ctx.dpr || 1;
	                ctx.save();
	                ctx.globalAlpha = 1;
	                ctx.shadowBlur = 0;
	                // Avoid layer don't clear in next progressive frame
	                currentLayer.__dirty = true;
	                ctx.setTransform(1, 0, 0, 1, 0, 0);
	                ctx.drawImage(layer.dom, 0, 0, width * dpr, height * dpr);
	                ctx.restore();
	            }
	
	            for (var i = 0, l = list.length; i < l; i++) {
	                var el = list[i];
	                var elZLevel = this._singleCanvas ? 0 : el.zlevel;
	
	                var elFrame = el.__frame;
	
	                // Flush at current context
	                // PENDING
	                if (elFrame < 0 && currentProgressiveLayer) {
	                    flushProgressiveLayer(currentProgressiveLayer);
	                    currentProgressiveLayer = null;
	                }
	
	                // Change draw layer
	                if (currentZLevel !== elZLevel) {
	                    if (ctx) {
	                        ctx.restore();
	                    }
	
	                    // Reset scope
	                    scope = {};
	
	                    // Only 0 zlevel if only has one canvas
	                    currentZLevel = elZLevel;
	                    currentLayer = this.getLayer(currentZLevel);
	
	                    if (!currentLayer.__builtin__) {
	                        log(
	                            'ZLevel ' + currentZLevel
	                            + ' has been used by unkown layer ' + currentLayer.id
	                        );
	                    }
	
	                    ctx = currentLayer.ctx;
	                    ctx.save();
	
	                    // Reset the count
	                    currentLayer.__unusedCount = 0;
	
	                    if (currentLayer.__dirty || paintAll) {
	                        currentLayer.clear();
	                    }
	                }
	
	                if (!(currentLayer.__dirty || paintAll)) {
	                    continue;
	                }
	
	                if (elFrame >= 0) {
	                    // Progressive layer changed
	                    if (!currentProgressiveLayer) {
	                        currentProgressiveLayer = this._progressiveLayers[
	                            Math.min(progressiveLayerIdx++, MAX_PROGRESSIVE_LAYER_NUMBER - 1)
	                        ];
	
	                        currentProgressiveLayer.ctx.save();
	                        currentProgressiveLayer.renderScope = {};
	
	                        if (currentProgressiveLayer
	                            && (currentProgressiveLayer.__progress > currentProgressiveLayer.__maxProgress)
	                        ) {
	                            // flushProgressiveLayer(currentProgressiveLayer);
	                            // Quick jump all progressive elements
	                            // All progressive element are not dirty, jump over and flush directly
	                            i = currentProgressiveLayer.__nextIdxNotProg - 1;
	                            // currentProgressiveLayer = null;
	                            continue;
	                        }
	
	                        layerProgress = currentProgressiveLayer.__progress;
	
	                        if (!currentProgressiveLayer.__dirty) {
	                            // Keep rendering
	                            frame = layerProgress;
	                        }
	
	                        currentProgressiveLayer.__progress = frame + 1;
	                    }
	
	                    if (elFrame === frame) {
	                        this._doPaintEl(el, currentProgressiveLayer, true, currentProgressiveLayer.renderScope);
	                    }
	                }
	                else {
	                    this._doPaintEl(el, currentLayer, paintAll, scope);
	                }
	
	                el.__dirty = false;
	            }
	
	            if (currentProgressiveLayer) {
	                flushProgressiveLayer(currentProgressiveLayer);
	            }
	
	            // Restore the lastLayer ctx
	            ctx && ctx.restore();
	            // If still has clipping state
	            // if (scope.prevElClipPaths) {
	            //     ctx.restore();
	            // }
	
	            this._furtherProgressive = false;
	            util.each(this._progressiveLayers, function (layer) {
	                if (layer.__maxProgress >= layer.__progress) {
	                    this._furtherProgressive = true;
	                }
	            }, this);
	        },
	
	        _doPaintEl: function (el, currentLayer, forcePaint, scope) {
	            var ctx = currentLayer.ctx;
	            var m = el.transform;
	            if (
	                (currentLayer.__dirty || forcePaint)
	                // Ignore invisible element
	                && !el.invisible
	                // Ignore transparent element
	                && el.style.opacity !== 0
	                // Ignore scale 0 element, in some environment like node-canvas
	                // Draw a scale 0 element can cause all following draw wrong
	                // And setTransform with scale 0 will cause set back transform failed.
	                && !(m && !m[0] && !m[3])
	                // Ignore culled element
	                && !(el.culling && isDisplayableCulled(el, this._width, this._height))
	            ) {
	
	                var clipPaths = el.__clipPaths;
	
	                // Optimize when clipping on group with several elements
	                if (scope.prevClipLayer !== currentLayer
	                    || isClipPathChanged(clipPaths, scope.prevElClipPaths)
	                ) {
	                    // If has previous clipping state, restore from it
	                    if (scope.prevElClipPaths) {
	                        scope.prevClipLayer.ctx.restore();
	                        scope.prevClipLayer = scope.prevElClipPaths = null;
	
	                        // Reset prevEl since context has been restored
	                        scope.prevEl = null;
	                    }
	                    // New clipping state
	                    if (clipPaths) {
	                        ctx.save();
	                        doClip(clipPaths, ctx);
	                        scope.prevClipLayer = currentLayer;
	                        scope.prevElClipPaths = clipPaths;
	                    }
	                }
	                el.beforeBrush && el.beforeBrush(ctx);
	
	                el.brush(ctx, scope.prevEl || null);
	                scope.prevEl = el;
	
	                el.afterBrush && el.afterBrush(ctx);
	            }
	        },
	
	        /**
	         * 获取 zlevel 所在层，如果不存在则会创建一个新的层
	         * @param {number} zlevel
	         * @return {module:zrender/Layer}
	         */
	        getLayer: function (zlevel) {
	            if (this._singleCanvas) {
	                return this._layers[0];
	            }
	
	            var layer = this._layers[zlevel];
	            if (!layer) {
	                // Create a new layer
	                layer = new Layer('zr_' + zlevel, this, this.dpr);
	                layer.__builtin__ = true;
	
	                if (this._layerConfig[zlevel]) {
	                    util.merge(layer, this._layerConfig[zlevel], true);
	                }
	
	                this.insertLayer(zlevel, layer);
	
	                // Context is created after dom inserted to document
	                // Or excanvas will get 0px clientWidth and clientHeight
	                layer.initContext();
	            }
	
	            return layer;
	        },
	
	        insertLayer: function (zlevel, layer) {
	
	            var layersMap = this._layers;
	            var zlevelList = this._zlevelList;
	            var len = zlevelList.length;
	            var prevLayer = null;
	            var i = -1;
	            var domRoot = this._domRoot;
	
	            if (layersMap[zlevel]) {
	                log('ZLevel ' + zlevel + ' has been used already');
	                return;
	            }
	            // Check if is a valid layer
	            if (!isLayerValid(layer)) {
	                log('Layer of zlevel ' + zlevel + ' is not valid');
	                return;
	            }
	
	            if (len > 0 && zlevel > zlevelList[0]) {
	                for (i = 0; i < len - 1; i++) {
	                    if (
	                        zlevelList[i] < zlevel
	                        && zlevelList[i + 1] > zlevel
	                    ) {
	                        break;
	                    }
	                }
	                prevLayer = layersMap[zlevelList[i]];
	            }
	            zlevelList.splice(i + 1, 0, zlevel);
	
	            layersMap[zlevel] = layer;
	
	            // Vitual layer will not directly show on the screen.
	            // (It can be a WebGL layer and assigned to a ZImage element)
	            // But it still under management of zrender.
	            if (!layer.virtual) {
	                if (prevLayer) {
	                    var prevDom = prevLayer.dom;
	                    if (prevDom.nextSibling) {
	                        domRoot.insertBefore(
	                            layer.dom,
	                            prevDom.nextSibling
	                        );
	                    }
	                    else {
	                        domRoot.appendChild(layer.dom);
	                    }
	                }
	                else {
	                    if (domRoot.firstChild) {
	                        domRoot.insertBefore(layer.dom, domRoot.firstChild);
	                    }
	                    else {
	                        domRoot.appendChild(layer.dom);
	                    }
	                }
	            }
	        },
	
	        // Iterate each layer
	        eachLayer: function (cb, context) {
	            var zlevelList = this._zlevelList;
	            var z;
	            var i;
	            for (i = 0; i < zlevelList.length; i++) {
	                z = zlevelList[i];
	                cb.call(context, this._layers[z], z);
	            }
	        },
	
	        // Iterate each buildin layer
	        eachBuiltinLayer: function (cb, context) {
	            var zlevelList = this._zlevelList;
	            var layer;
	            var z;
	            var i;
	            for (i = 0; i < zlevelList.length; i++) {
	                z = zlevelList[i];
	                layer = this._layers[z];
	                if (layer.__builtin__) {
	                    cb.call(context, layer, z);
	                }
	            }
	        },
	
	        // Iterate each other layer except buildin layer
	        eachOtherLayer: function (cb, context) {
	            var zlevelList = this._zlevelList;
	            var layer;
	            var z;
	            var i;
	            for (i = 0; i < zlevelList.length; i++) {
	                z = zlevelList[i];
	                layer = this._layers[z];
	                if (!layer.__builtin__) {
	                    cb.call(context, layer, z);
	                }
	            }
	        },
	
	        /**
	         * 获取所有已创建的层
	         * @param {Array.<module:zrender/Layer>} [prevLayer]
	         */
	        getLayers: function () {
	            return this._layers;
	        },
	
	        _updateLayerStatus: function (list) {
	
	            var layers = this._layers;
	            var progressiveLayers = this._progressiveLayers;
	
	            var elCountsLastFrame = {};
	            var progressiveElCountsLastFrame = {};
	
	            this.eachBuiltinLayer(function (layer, z) {
	                elCountsLastFrame[z] = layer.elCount;
	                layer.elCount = 0;
	                layer.__dirty = false;
	            });
	
	            util.each(progressiveLayers, function (layer, idx) {
	                progressiveElCountsLastFrame[idx] = layer.elCount;
	                layer.elCount = 0;
	                layer.__dirty = false;
	            });
	
	            var progressiveLayerCount = 0;
	            var currentProgressiveLayer;
	            var lastProgressiveKey;
	            var frameCount = 0;
	            for (var i = 0, l = list.length; i < l; i++) {
	                var el = list[i];
	                var zlevel = this._singleCanvas ? 0 : el.zlevel;
	                var layer = layers[zlevel];
	                var elProgress = el.progressive;
	                if (layer) {
	                    layer.elCount++;
	                    layer.__dirty = layer.__dirty || el.__dirty;
	                }
	
	                /////// Update progressive
	                if (elProgress >= 0) {
	                    // Fix wrong progressive sequence problem.
	                    if (lastProgressiveKey !== elProgress) {
	                        lastProgressiveKey = elProgress;
	                        frameCount++;
	                    }
	                    var elFrame = el.__frame = frameCount - 1;
	                    if (!currentProgressiveLayer) {
	                        var idx = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER - 1);
	                        currentProgressiveLayer = progressiveLayers[idx];
	                        if (!currentProgressiveLayer) {
	                            currentProgressiveLayer = progressiveLayers[idx] = new Layer(
	                                'progressive', this, this.dpr
	                            );
	                            currentProgressiveLayer.initContext();
	                        }
	                        currentProgressiveLayer.__maxProgress = 0;
	                    }
	                    currentProgressiveLayer.__dirty = currentProgressiveLayer.__dirty || el.__dirty;
	                    currentProgressiveLayer.elCount++;
	
	                    currentProgressiveLayer.__maxProgress = Math.max(
	                        currentProgressiveLayer.__maxProgress, elFrame
	                    );
	
	                    if (currentProgressiveLayer.__maxProgress >= currentProgressiveLayer.__progress) {
	                        // Should keep rendering this  layer because progressive rendering is not finished yet
	                        layer.__dirty = true;
	                    }
	                }
	                else {
	                    el.__frame = -1;
	
	                    if (currentProgressiveLayer) {
	                        currentProgressiveLayer.__nextIdxNotProg = i;
	                        progressiveLayerCount++;
	                        currentProgressiveLayer = null;
	                    }
	                }
	            }
	
	            if (currentProgressiveLayer) {
	                progressiveLayerCount++;
	                currentProgressiveLayer.__nextIdxNotProg = i;
	            }
	
	            // 层中的元素数量有发生变化
	            this.eachBuiltinLayer(function (layer, z) {
	                if (elCountsLastFrame[z] !== layer.elCount) {
	                    layer.__dirty = true;
	                }
	            });
	
	            progressiveLayers.length = Math.min(progressiveLayerCount, MAX_PROGRESSIVE_LAYER_NUMBER);
	            util.each(progressiveLayers, function (layer, idx) {
	                if (progressiveElCountsLastFrame[idx] !== layer.elCount) {
	                    el.__dirty = true;
	                }
	                if (layer.__dirty) {
	                    layer.__progress = 0;
	                }
	            });
	        },
	
	        /**
	         * 清除hover层外所有内容
	         */
	        clear: function () {
	            this.eachBuiltinLayer(this._clearLayer);
	            return this;
	        },
	
	        _clearLayer: function (layer) {
	            layer.clear();
	        },
	
	        /**
	         * 修改指定zlevel的绘制参数
	         *
	         * @param {string} zlevel
	         * @param {Object} config 配置对象
	         * @param {string} [config.clearColor=0] 每次清空画布的颜色
	         * @param {string} [config.motionBlur=false] 是否开启动态模糊
	         * @param {number} [config.lastFrameAlpha=0.7]
	         *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         */
	        configLayer: function (zlevel, config) {
	            if (config) {
	                var layerConfig = this._layerConfig;
	                if (!layerConfig[zlevel]) {
	                    layerConfig[zlevel] = config;
	                }
	                else {
	                    util.merge(layerConfig[zlevel], config, true);
	                }
	
	                var layer = this._layers[zlevel];
	
	                if (layer) {
	                    util.merge(layer, layerConfig[zlevel], true);
	                }
	            }
	        },
	
	        /**
	         * 删除指定层
	         * @param {number} zlevel 层所在的zlevel
	         */
	        delLayer: function (zlevel) {
	            var layers = this._layers;
	            var zlevelList = this._zlevelList;
	            var layer = layers[zlevel];
	            if (!layer) {
	                return;
	            }
	            layer.dom.parentNode.removeChild(layer.dom);
	            delete layers[zlevel];
	
	            zlevelList.splice(util.indexOf(zlevelList, zlevel), 1);
	        },
	
	        /**
	         * 区域大小变化后重绘
	         */
	        resize: function (width, height) {
	            var domRoot = this._domRoot;
	            // FIXME Why ?
	            domRoot.style.display = 'none';
	
	            // Save input w/h
	            var opts = this._opts;
	            width != null && (opts.width = width);
	            height != null && (opts.height = height);
	
	            width = this._getSize(0);
	            height = this._getSize(1);
	
	            domRoot.style.display = '';
	
	            // 优化没有实际改变的resize
	            if (this._width != width || height != this._height) {
	                domRoot.style.width = width + 'px';
	                domRoot.style.height = height + 'px';
	
	                for (var id in this._layers) {
	                    if (this._layers.hasOwnProperty(id)) {
	                        this._layers[id].resize(width, height);
	                    }
	                }
	                util.each(this._progressiveLayers, function (layer) {
	                    layer.resize(width, height);
	                });
	
	                this.refresh(true);
	            }
	
	            this._width = width;
	            this._height = height;
	
	            return this;
	        },
	
	        /**
	         * 清除单独的一个层
	         * @param {number} zlevel
	         */
	        clearLayer: function (zlevel) {
	            var layer = this._layers[zlevel];
	            if (layer) {
	                layer.clear();
	            }
	        },
	
	        /**
	         * 释放
	         */
	        dispose: function () {
	            this.root.innerHTML = '';
	
	            this.root =
	            this.storage =
	
	            this._domRoot =
	            this._layers = null;
	        },
	
	        /**
	         * Get canvas which has all thing rendered
	         * @param {Object} opts
	         * @param {string} [opts.backgroundColor]
	         */
	        getRenderedCanvas: function (opts) {
	            opts = opts || {};
	            if (this._singleCanvas) {
	                return this._layers[0].dom;
	            }
	
	            var imageLayer = new Layer('image', this, opts.pixelRatio || this.dpr);
	            imageLayer.initContext();
	
	            imageLayer.clearColor = opts.backgroundColor;
	            imageLayer.clear();
	
	            var displayList = this.storage.getDisplayList(true);
	
	            var scope = {};
	            for (var i = 0; i < displayList.length; i++) {
	                var el = displayList[i];
	                this._doPaintEl(el, imageLayer, true, scope);
	            }
	
	            return imageLayer.dom;
	        },
	        /**
	         * 获取绘图区域宽度
	         */
	        getWidth: function () {
	            return this._width;
	        },
	
	        /**
	         * 获取绘图区域高度
	         */
	        getHeight: function () {
	            return this._height;
	        },
	
	        _getSize: function (whIdx) {
	            var opts = this._opts;
	            var wh = ['width', 'height'][whIdx];
	            var cwh = ['clientWidth', 'clientHeight'][whIdx];
	            var plt = ['paddingLeft', 'paddingTop'][whIdx];
	            var prb = ['paddingRight', 'paddingBottom'][whIdx];
	
	            if (opts[wh] != null && opts[wh] !== 'auto') {
	                return parseFloat(opts[wh]);
	            }
	
	            var root = this.root;
	            var stl = document.defaultView.getComputedStyle(root);
	
	            return (
	                (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh]))
	                - (parseInt10(stl[plt]) || 0)
	                - (parseInt10(stl[prb]) || 0)
	            ) | 0;
	        },
	
	        pathToImage: function (path, dpr) {
	            dpr = dpr || this.dpr;
	
	            var canvas = document.createElement('canvas');
	            var ctx = canvas.getContext('2d');
	            var rect = path.getBoundingRect();
	            var style = path.style;
	            var shadowBlurSize = style.shadowBlur;
	            var shadowOffsetX = style.shadowOffsetX;
	            var shadowOffsetY = style.shadowOffsetY;
	            var lineWidth = style.hasStroke() ? style.lineWidth : 0;
	
	            var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
	            var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
	            var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
	            var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
	            var width = rect.width + leftMargin + rightMargin;
	            var height = rect.height + topMargin + bottomMargin;
	
	            canvas.width = width * dpr;
	            canvas.height = height * dpr;
	
	            ctx.scale(dpr, dpr);
	            ctx.clearRect(0, 0, width, height);
	            ctx.dpr = dpr;
	
	            var pathTransform = {
	                position: path.position,
	                rotation: path.rotation,
	                scale: path.scale
	            };
	            path.position = [leftMargin - rect.x, topMargin - rect.y];
	            path.rotation = 0;
	            path.scale = [1, 1];
	            path.updateTransform();
	            if (path) {
	                path.brush(ctx);
	            }
	
	            var ImageShape = __webpack_require__(41);
	            var imgShape = new ImageShape({
	                style: {
	                    x: 0,
	                    y: 0,
	                    image: canvas
	                }
	            });
	
	            if (pathTransform.position != null) {
	                imgShape.position = path.position = pathTransform.position;
	            }
	
	            if (pathTransform.rotation != null) {
	                imgShape.rotation = path.rotation = pathTransform.rotation;
	            }
	
	            if (pathTransform.scale != null) {
	                imgShape.scale = path.scale = pathTransform.scale;
	            }
	
	            return imgShape;
	        }
	    };
	
	    module.exports = Painter;
	


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @module zrender/Layer
	 * @author pissang(https://www.github.com/pissang)
	 */
	
	
	    var util = __webpack_require__(4);
	    var config = __webpack_require__(22);
	    var Style = __webpack_require__(8);
	    var Pattern = __webpack_require__(36);
	
	    function returnFalse() {
	        return false;
	    }
	
	    /**
	     * 创建dom
	     *
	     * @inner
	     * @param {string} id dom id 待用
	     * @param {string} type dom type，such as canvas, div etc.
	     * @param {Painter} painter painter instance
	     * @param {number} number
	     */
	    function createDom(id, type, painter, dpr) {
	        var newDom = document.createElement(type);
	        var width = painter.getWidth();
	        var height = painter.getHeight();
	
	        var newDomStyle = newDom.style;
	        // 没append呢，请原谅我这样写，清晰~
	        newDomStyle.position = 'absolute';
	        newDomStyle.left = 0;
	        newDomStyle.top = 0;
	        newDomStyle.width = width + 'px';
	        newDomStyle.height = height + 'px';
	        newDom.width = width * dpr;
	        newDom.height = height * dpr;
	
	        // id不作为索引用，避免可能造成的重名，定义为私有属性
	        newDom.setAttribute('data-zr-dom-id', id);
	        return newDom;
	    }
	
	    /**
	     * @alias module:zrender/Layer
	     * @constructor
	     * @extends module:zrender/mixin/Transformable
	     * @param {string} id
	     * @param {module:zrender/Painter} painter
	     * @param {number} [dpr]
	     */
	    var Layer = function(id, painter, dpr) {
	        var dom;
	        dpr = dpr || config.devicePixelRatio;
	        if (typeof id === 'string') {
	            dom = createDom(id, 'canvas', painter, dpr);
	        }
	        // Not using isDom because in node it will return false
	        else if (util.isObject(id)) {
	            dom = id;
	            id = dom.id;
	        }
	        this.id = id;
	        this.dom = dom;
	
	        var domStyle = dom.style;
	        if (domStyle) { // Not in node
	            dom.onselectstart = returnFalse; // 避免页面选中的尴尬
	            domStyle['-webkit-user-select'] = 'none';
	            domStyle['user-select'] = 'none';
	            domStyle['-webkit-touch-callout'] = 'none';
	            domStyle['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
	            domStyle['padding'] = 0;
	            domStyle['margin'] = 0;
	            domStyle['border-width'] = 0;
	        }
	
	        this.domBack = null;
	        this.ctxBack = null;
	
	        this.painter = painter;
	
	        this.config = null;
	
	        // Configs
	        /**
	         * 每次清空画布的颜色
	         * @type {string}
	         * @default 0
	         */
	        this.clearColor = 0;
	        /**
	         * 是否开启动态模糊
	         * @type {boolean}
	         * @default false
	         */
	        this.motionBlur = false;
	        /**
	         * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         * @type {number}
	         * @default 0.7
	         */
	        this.lastFrameAlpha = 0.7;
	
	        /**
	         * Layer dpr
	         * @type {number}
	         */
	        this.dpr = dpr;
	    };
	
	    Layer.prototype = {
	
	        constructor: Layer,
	
	        elCount: 0,
	
	        __dirty: true,
	
	        initContext: function () {
	            this.ctx = this.dom.getContext('2d');
	
	            this.ctx.dpr = this.dpr;
	        },
	
	        createBackBuffer: function () {
	            var dpr = this.dpr;
	
	            this.domBack = createDom('back-' + this.id, 'canvas', this.painter, dpr);
	            this.ctxBack = this.domBack.getContext('2d');
	
	            if (dpr != 1) {
	                this.ctxBack.scale(dpr, dpr);
	            }
	        },
	
	        /**
	         * @param  {number} width
	         * @param  {number} height
	         */
	        resize: function (width, height) {
	            var dpr = this.dpr;
	
	            var dom = this.dom;
	            var domStyle = dom.style;
	            var domBack = this.domBack;
	
	            domStyle.width = width + 'px';
	            domStyle.height = height + 'px';
	
	            dom.width = width * dpr;
	            dom.height = height * dpr;
	
	            if (domBack) {
	                domBack.width = width * dpr;
	                domBack.height = height * dpr;
	
	                if (dpr != 1) {
	                    this.ctxBack.scale(dpr, dpr);
	                }
	            }
	        },
	
	        /**
	         * 清空该层画布
	         * @param {boolean} clearAll Clear all with out motion blur
	         */
	        clear: function (clearAll) {
	            var dom = this.dom;
	            var ctx = this.ctx;
	            var width = dom.width;
	            var height = dom.height;
	
	            var clearColor = this.clearColor;
	            var haveMotionBLur = this.motionBlur && !clearAll;
	            var lastFrameAlpha = this.lastFrameAlpha;
	
	            var dpr = this.dpr;
	
	            if (haveMotionBLur) {
	                if (!this.domBack) {
	                    this.createBackBuffer();
	                }
	
	                this.ctxBack.globalCompositeOperation = 'copy';
	                this.ctxBack.drawImage(
	                    dom, 0, 0,
	                    width / dpr,
	                    height / dpr
	                );
	            }
	
	            ctx.clearRect(0, 0, width, height);
	            if (clearColor) {
	                var clearColorGradientOrPattern;
	                // Gradient
	                if (clearColor.colorStops) {
	                    // Cache canvas gradient
	                    clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(ctx, clearColor, {
	                        x: 0,
	                        y: 0,
	                        width: width,
	                        height: height
	                    });
	
	                    clearColor.__canvasGradient = clearColorGradientOrPattern;
	                }
	                // Pattern
	                else if (clearColor.image) {
	                    clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, ctx);
	                }
	                ctx.save();
	                ctx.fillStyle = clearColorGradientOrPattern || clearColor;
	                ctx.fillRect(0, 0, width, height);
	                ctx.restore();
	            }
	
	            if (haveMotionBLur) {
	                var domBack = this.domBack;
	                ctx.save();
	                ctx.globalAlpha = lastFrameAlpha;
	                ctx.drawImage(domBack, 0, 0, width, height);
	                ctx.restore();
	            }
	        }
	    };
	
	    module.exports = Layer;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 选中节点后，出现的操作框及按钮
	 * @author wang.xiaohu
	 */
	
	    var Node = __webpack_require__(75);
	    var zrUtil = __webpack_require__(4);
	    var graphic = __webpack_require__(3);
	    var Connector = __webpack_require__(76);
	    var env = __webpack_require__(45);
	
	    function OperationNode(node, zr, forbidEdit) {
	        Node.call(this);
	        this.node = node;
	        this.zr = zr;
	        this.forbidEdit = forbidEdit; //
	        this.render();
	    }
	
	    //事件
	    OperationNode.ARROW_DRAGEND = "OperationNode:dragendArrow";
	    OperationNode.ARROW_DRAG = "OperationNode:dragArrow";
	    OperationNode.ARROW_DRAGSTART = "OperationNode:dragstartArrow";
	    OperationNode.DELETE_CLICK = "OperationNode:deleteClick";
	
	    if(!env.canvasSupported) {
	        //内置操作图标的图像
	        OperationNode.opicons = {
	            STRAIGHT: 'M13.961,2.309c-0.051-0.122-0.148-0.22-0.27-0.27L13.5,2h-5C8.224,2,8,2.224,8,2.5S8.224,3,8.5,3h3.793L2.146,13.146c-0.195,0.195-0.195,0.512,0,0.707s0.512,0.195,0.707,0L13,3.707V7.5C13,7.776,13.225,8,13.5,8S14,7.776,14,7.5v-5L13.961,2.309z',
	            JAGGED: 'M96.046,13.604H84.213c-1.104,0-2,0.896-2,2v42.188H38.314v-10.77c0-0.715-0.381-1.375-1-1.732c-0.619-0.357-1.382-0.355-2,0L2.954,63.977c-0.619,0.357-1,1.018-1,1.732s0.381,1.375,1,1.732l32.36,18.687c0.309,0.179,0.655,0.268,1,0.268s0.69-0.089,1-0.268c0.619-0.357,1-1.018,1-1.732V73.625h57.732c1.104,0,2-0.896,2-2V15.604C98.046,14.5,97.151,13.604,96.046,13.604z',
	            CURVE: 'M510.536,268.098c13.541,0,27.078-5.207,37.347-15.6c20.379-20.625,20.18-53.866-0.445-74.245L414.167,46.57c-9.905-9.786-23.325-15.244-37.215-15.154c-13.923,0.083-27.244,5.695-37.03,15.599l-129.912,131.48c-20.379,20.625-20.18,53.866,0.445,74.245c20.625,20.379,53.866,20.18,74.245-0.445l40.618-41.108c0.021,0.464,0.029,0.927,0.062,1.394c4.178,59.008,4.668,119.832,16.633,177.931c23.937,116.232,103.705,191.961,191.489,264.024c47.292,38.823,79.66,94.122,98.601,151.673c9.765,29.669,14.714,77.115,17.215,107.157c2.261,27.161,25.08,47.978,52.333,47.709l1.061-0.01c30.228-0.298,53.81-26.211,51.306-56.336c-2.921-35.15-8.858-89.828-20.925-127.49c-16.283-50.821-40.016-99.463-74.766-140.245c-33.993-39.892-75.456-72.403-113.338-108.373c-47.091-44.713-84.977-95.161-98.006-159.719c-10.541-52.231-12.789-105.215-16.461-158.562l43.118,42.604C483.87,263.053,497.205,268.098,510.536,268.098z',
	            DEL: 'M73.641,45.957l-0.021,0.252c0,0.032,0.021,0.06,0.021,0.088c0,0.065-0.022,0.126-0.026,0.191l-2.685,54.878H70.91c-0.231,4.304-5.166,10.81-31.748,10.81c-26.58,0-31.509-6.506-31.746-10.81H7.41L4.731,46.488c-0.009-0.06-0.028-0.126-0.028-0.191c0-0.032,0.01-0.06,0.01-0.088l-0.01-0.252h0.028c0.099-0.466,0.364-0.919,0.784-1.353c3.439,3.477,17.191,4.051,33.646,4.051s30.221-0.574,33.642-4.051c0.426,0.434,0.711,0.887,0.784,1.353H73.641z M78.335,25.102v6.407c0,1.316-1.34,2.567-3.715,3.696c-6.266,2.936-19.777,4.975-35.459,4.975c-15.666,0-29.189-2.039-35.442-4.975C1.33,34.075,0,32.825,0,31.509v-6.407c0-3.374,8.681-6.286,21.359-7.724V3.929c0-2.16,1.768-3.929,3.93-3.929h26.314c2.164,0,3.938,1.773,3.938,3.938v13.296C68.98,18.606,78.333,21.611,78.335,25.102z M48.416,11.395c0-2.348-0.321-4.27-0.715-4.27c-0.393,0-2.641,0-4.979,0h-8.545c-2.352,0-4.592,0-4.989,0c-0.388,0-0.714,1.922-0.714,4.27v5.367l1.083-0.065c3.067-0.173,6.286-0.27,9.595-0.271c3.202,0,6.292,0.098,9.264,0.252V11.395z'
	        };
	    }else{
	        OperationNode.opicons = {
	            STRAIGHT: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABQSURBVHjalJFBDoAwCMCqH5ef1wshIeqGSzgstEAAla8AArDFSniTTvbP/ltXv1KI6jSB23hTuHJ/4Iewg5swgUuYwsnOYZUj94sagyNyDwDa1hn7ZCOKwwAAAABJRU5ErkJggg==',
	            JAGGED: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACgSURBVHjahNGxDcJADIXhL6GKREdFiVgkI5A9aBEFDQVDMAULULABEyDRI7oI2qOxkAiX5CQ3J7/n389SSvoKe6SfGhLkRKWBVxTFBA+8v58DzjWu4XzBMYuEBU7ReEfzg9dpXsf4FjtUf4YdwSqct72oGaQznpjlBGUnlTlemGGTjS5cq2BuY4cDpj3paXAL9hOWI4eUIu967OopJZ8BAPdW/uDOuwrzAAAAAElFTkSuQmCC',
	            CURVE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACaSURBVHjajNA9DgEBEIbhZ0UUoheRKF1Bq3UeF1iVQqVQaSQO4gCi5AISjUYphNEsySa7dieZYr7M+82PiFCWSBG5/AcUQQ3V0cb7W9QBurhgBs0awAiniEiTJFG1/zDbffrTKoAN7uhVAphkxy5yeknzGDcc0CoFMMASTxzRLzAzxxp7vPDACp2i6Unmds0cd9hGxLnsx58BAG8c3pZpbM8/AAAAAElFTkSuQmCC',
	            DEL: 'M73.641,45.957l-0.021,0.252c0,0.032,0.021,0.06,0.021,0.088c0,0.065-0.022,0.126-0.026,0.191l-2.685,54.878H70.91c-0.231,4.304-5.166,10.81-31.748,10.81c-26.58,0-31.509-6.506-31.746-10.81H7.41L4.731,46.488c-0.009-0.06-0.028-0.126-0.028-0.191c0-0.032,0.01-0.06,0.01-0.088l-0.01-0.252h0.028c0.099-0.466,0.364-0.919,0.784-1.353c3.439,3.477,17.191,4.051,33.646,4.051s30.221-0.574,33.642-4.051c0.426,0.434,0.711,0.887,0.784,1.353H73.641z M78.335,25.102v6.407c0,1.316-1.34,2.567-3.715,3.696c-6.266,2.936-19.777,4.975-35.459,4.975c-15.666,0-29.189-2.039-35.442-4.975C1.33,34.075,0,32.825,0,31.509v-6.407c0-3.374,8.681-6.286,21.359-7.724V3.929c0-2.16,1.768-3.929,3.93-3.929h26.314c2.164,0,3.938,1.773,3.938,3.938v13.296C68.98,18.606,78.333,21.611,78.335,25.102z M48.416,11.395c0-2.348-0.321-4.27-0.715-4.27c-0.393,0-2.641,0-4.979,0h-8.545c-2.352,0-4.592,0-4.989,0c-0.388,0-0.714,1.922-0.714,4.27v5.367l1.083-0.065c3.067-0.173,6.286-0.27,9.595-0.271c3.202,0,6.292,0.098,9.264,0.252V11.395z'
	        };
	    }
	
	
	
	
	    OperationNode.prototype.render = function() {
	        this.renderBase();
	        if (!this.forbidEdit) {
	            this.renderOther();
	        }
	
	    };
	
	    OperationNode.prototype.renderBase = function() {
	        this.createOperation();
	    };
	
	    OperationNode.prototype.createOperation = function() {
	        var me = this;
	        this.virtualRect = new graphic.Polyline({ style: { lineDash: [2] } });
	        this.virtualRect.isSelfComputePos = true;  // 自己计算位置
	        this.add(this.virtualRect);
	
	
	
	        if (this.node.operationIcons) {
	            zrUtil.each(this.node.operationIcons, function(item) {
	                //检查是否是内置图标
	                var opIconInstance = null;
	                if (OperationNode.opicons[item.name + ""]) {
	
	                    if (this.forbidEdit) {
	                        return;
	                    }
	                    if (item.name == "DEL") {
	                        //垃圾桶
	                        var rect1 = { x: 0, y: 0, width: 10, height: 15 };
	                        opIconInstance = graphic.makePath(OperationNode.opicons[item.name + ""], { style: { fill: '#000000' },z:me.node.z+1 }, rect1);
	                        if(item.callback){
	                            opIconInstance.on("click", function(e) {
	                                e.data = item;
	                                e.node = me.node;  // 将所附的节点也传递出去
	                                if (item.callback) {
	                                    item.callback(e);
	                                }
	                            });
	                        }else{
	                            opIconInstance.on("click", function(e) {
	                                var params = {};
	                                params.event = e;
	                                params.target = this;
	                                params.type = OperationNode.DELETE_CLICK;
	                                me.trigger(params.type, params);
	                            });
	                        }
	
	
	                    } else {
	                        if(!env.canvasSupported){
	                            var rect = { x: 0, y: 0, width: 15, height: 15 };
	                            opIconInstance = graphic.makePath(OperationNode.opicons[item.name + ""], { style: { fill: '#000000' },draggable:true,z:me.node.z+1,lineType: Connector["TYPE_" + item.name] }, rect);
	                        }else{
	                            var imageUrl = document.createElement('img');
	                            imageUrl.src = OperationNode.opicons[item.name + ""];
	                            opIconInstance = new graphic.Image({
	                                style: {
	                                    image:imageUrl,
	                                    cursor: 'default',
	                                    width:15,
	                                    height:15
	                                },
	                                draggable: true,
	                                z: me.node.z+1, //zIndex 置于最高
	                                lineType: Connector["TYPE_" + item.name] //区分不同的线段
	                            });
	                        }
	
	                        var MOUSE_EVENT_NAMES = ['dragstart', 'drag', 'dragend'];
	                        zrUtil.each(MOUSE_EVENT_NAMES, function(eveName) {
	                            opIconInstance.on(eveName, function(e) {
	                                var params = {};
	                                params.event = e;
	                                params.data = item.options
	                                params.type = "OperationNode:" + eveName + "Arrow";
	                                me.trigger(params.type, params);
	                            });
	                        });
	                    }
	
	                } else {
	                    //用户自定义的图标放在这里，用户传进来的图标只能响应click事件，其它事件暂不支持
	                    opIconInstance = new graphic.Image({
	                        style: {
	                            image: item.iconPath,
	                            width: item.width || 15,
	                            height: item.height || 15
	                        },
	                        z:me.node.z+1 //zIndex 置于最高
	                    });
	                    opIconInstance.on("click", function(e) {
	                        e.data = item;
	                        e.node = me.node;  // 将所附的节点也传递出去
	                        if (item.callback) {
	                            item.callback(e);
	                        }
	
	                        //todo 用户自定图标click事件是否要派发到外面
	                    });
	                }
	                opIconInstance.name = item.name;
	                me.add(opIconInstance);
	            });
	        }
	    };
	
	    OperationNode.prototype.refreshPostion = function(node,nodeRect) {
	        var me = this;
	        var i = 0;
	        var rbPoint = nodeRect.points[2]; //取右下角坐标
	        //1.定位虚框
	        this.virtualRect.setShape({ points: nodeRect.points });
	        //2.定位每个小图标
	        this.eachChild(function(nodeItem) {
	            if (!nodeItem.isSelfComputePos) {
	                // 8px是第一个操作按钮图标的距离 靠太近不好看    20px是每个图标的间隔  10px是图标向偏的距离
	                nodeItem.attr("position", [rbPoint[0] + 8 + (i++ * 20), rbPoint[1] - 10]);
	            }
	        });
	
	        this.refreshPositionOther(node,nodeRect);
	    };
	
	    OperationNode.prototype.renderOther = function() {
	        //留给扩展使用
	    };
	    OperationNode.prototype.refreshPositionOther = function(node,nodeRect) {
	        //留给扩展使用
	        //3.定位整个operationNode
	        if (node.parent && node.parent.isBg && node.parent.isBg == true) {
	            this.attr("position", [nodeRect.x, nodeRect.y])
	        } else {
	            this.attr("position", [nodeRect.x + node.parent.position[0]+node.shape.x, nodeRect.y + node.parent.position[1]+node.shape.y])
	        }
	    };
	    zrUtil.inherits(OperationNode, Node);
	    module.exports = OperationNode;
	


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	
	    var graphic = __webpack_require__(3);
	    var util = __webpack_require__(59)
	    //创建Node类 所有形状都继承Node  包括fromJSON toJSON
	    function Node() {
	        this.resourceId = util.getUUID(); // 生成节点ID
	        graphic.Group.call(this);
	    }
	
	    /**
	     * 由父类实现
	     * @return {[type]} [description]
	     */
	    Node.prototype.render = function() {};
	
	    /**
	     * 由父类实现
	     * @param  {[type]} json [description]
	     * @return {[type]}      [description]
	     */
	    Node.prototype.getRect = function(json) {};
	
	    /**
	     * drawText
	     * @description 画一个文本
	     * @param {string} name
	     * @param {string} color
	     */
	    Node.prototype.drawText = function(name,color) {
	        var textName = this.bpmnInfo.name;
	        if(name != null){
	            textName = name;
	        }
	        var text = new graphic.Text({
	            style: {
	                text: textName,
	                color: color ? color : this.options.text.color,
	                textFont: '12px Microsoft YaHei'
	            },
	            zlevel: 20
	        });
	        //文字绘制的位置  
	        //x = 中心点.x - 起始位置.x - 文字宽度的一半
	        var x = this.getRect().x - this.position[0] - text.getBoundingRect().width / 2;
	        //y = 中心点.y - 起始位置.y + 节点高度的一半 + 偏移值（6）
	        var y = this.getRect().y - this.position[1] + this.getBoundingRect().height / 2 + text.getBoundingRect().height + 6;
	        text.attr("style", { x: x, y: y });
	        return {
	            text: text,
	            rect: text.getBoundingRect()
	        };
	    };
	    /**
	     * refreshText
	     * @description 刷新文本
	     */
	    Node.prototype.refreshText = function() {
	        var text = this.childOfName("Title");
	        var x = this.getRect().x - this.position[0] - text.getBoundingRect().width / 2;
	        var y = this.getRect().y - this.position[1] + this.getBoundingRect().height / 2 + text.getBoundingRect().height + 6;
	        text.attr("style", { x: x, y: y });
	    };
	    /**
	     * 由父类实现
	     * @return {[type]} [description]
	     */
	    Node.prototype.toJSON = function() {};
	
	    graphic.Util.inherits(Node, graphic.Group);
	    module.exports = Node;
	


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 连接线
	 * @author wang.xiaohu
	 */
	
	    var Util = __webpack_require__(59);
	    var zrUtil = __webpack_require__(4);
	    var graphic = __webpack_require__(3);
	    var Node = __webpack_require__(75);
	    var symbolUtil = __webpack_require__(77);
	    var Handle = __webpack_require__(78);
	    var EffectLine = __webpack_require__(79);
	    var ConnectionPoint = __webpack_require__(80);
	    var Point = __webpack_require__(60);
	    /**
	     * 构造函数
	     * @param {[type]} options [description]
	     */
	    function Connector(options) {
	        Node.call(this);
	        if (options.model && options.model.option && options.model.option.resourceId) {
	            this.resourceId = options.model.option.resourceId;
	        } else {
	            this.resourceId = Util.getUUID(); // 生成节点ID
	        }
	        var defaultOptions = {
	            symbol: { type: "arrow", size: 10, color: "#000000" }, //箭头  可选值为： 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
	            style: { lineWidth: 1, stroke: "#000000", lineType: Connector.TYPE_STRAIGHT }, //样式
	            hoverStyle: { lineWidth: 2, stroke: "lime" }, //移上去的样式
	            arrowHoverStyle: { fill: "lime" },
	            shape: { points: null, smooth: false, smoothConstraint: null }, //形状
	            position: [0, 0],
	            isEdit: true, //是否可编辑
	            text: {
	                text: "",
	                color: '#000000', // 文本颜色
	                textFont: '12px Microsoft YaHei'
	            },
	            z: 0
	        }
	        var opt = options || {};
	        this.options = zrUtil.merge(defaultOptions, opt, true);
	        this.model = options.model;
	        this.handles = [];
	        this.connectionPoints = [];
	        this.conPointsGroup = null;
	        this.startNode = null;
	        this.endNode = null;
	        this.autoChangePosition = false
	        this.line = null;
	        this.groupCurve = new graphic.Group();
	        this.icons = []; // 用于存储线段上面的操作图标
	        this.render();
	    }
	
	    Connector.TYPE_STRAIGHT = 'straight';
	
	    Connector.TYPE_JAGGED = 'jagged';
	
	    Connector.TYPE_CURVE = 'curve';
	
	    Connector.RADIUS = 3;
	
	    Connector.START_NODE = "startNode";
	
	    Connector.END_NODE = "endNode";
	
	    Connector.LEFT = "left";
	
	    Connector.RIGHT = "right";
	
	    Connector.TOP = "top";
	
	    Connector.BOTTOM = "bottom";
	
	    Connector.BOTTOM = "bottom";
	
	    Connector.SEPERATOR = "-";
	    /**
	     * 重新画线，如果传空则根据turningPoints 重新画线
	     * @param  {[type]} points [description]
	     * @return {[type]}        [description]
	     */
	    Connector.prototype.refresh = function(points) {
	        if (points) {
	            this.turningPoints = points;
	        }
	        //将[x:0,y:0]转化为[0, 0]  给zrender使用
	        var points = Util.traslatePoints(this.turningPoints);
	
	        if ((this.options.style.lineType == Connector.TYPE_CURVE) && (points.length > 2)) {
	            this.modifyCurve(this.turningPoints);
	        } else {
	            this.line.attr('shape', { points: points });
	        }
	
	        var lineText = this.childOfName('lineText');
	        //开始没有创建文本，后来传进来text了，需要先创建文本
	        if (!lineText && this.options.text.text) {
	            var text = this.drawText("lineText", this.options.text.text, 0, 0);
	            this.add(text.text);
	            lineText = this.childOfName('lineText');
	        }
	        if (lineText) {
	            lineText.setStyle("text", this.options.text.text);
	
	            var textPoint = this.getTextPostion(this.options.text);
	
	            // if (this.options.style.lineType == Connector.TYPE_STRAIGHT ) {
	            //     lineText.attr('rotation', this.getTextRotation(textPoint));
	            // }
	
	            lineText.attr("position", textPoint);
	        }
	        var symbolTo = this.childOfName('toSymbol');
	        if (symbolTo) {
	            if (this.options.effect && this.options.effect.show) {
	                new EffectLine(symbolTo, this.options, this.groupCurve, this.polyLine);
	            } else {
	                symbolTo.attr('position', points[points.length - 1]);
	                symbolTo.attr('rotation', Util.tangentRotation(this.turningPoints[this.turningPoints.length - 2], this.turningPoints[this.turningPoints.length - 1]));
	            }
	        }
	    };
	    /**
	     * 渲染
	     * @return {[type]} [description]
	     */
	    Connector.prototype.render = function() {
	        var that = this;
	        //1.创建箭头
	        var symbolTo = this.createSymbol('toSymbol', this.options); //arrow,triangle
	        if (symbolTo) {
	            this.add(symbolTo);
	        }
	
	        //2.创建线
	        this.curveLine = new graphic.BezierCurve({
	            position: this.options.position,
	            style: this.options.style,
	            z: this.options.z
	        });
	        this.groupCurve.add(this.curveLine);
	        this.add(this.groupCurve);
	
	        this.polyLine = new graphic.Polyline({
	            position: this.options.position,
	            shape: this.options.shape,
	            style: this.options.style,
	            z: this.options.z
	        });
	        this.add(this.polyLine);
	
	        if ((this.options.style.lineType == Connector.TYPE_CURVE)) {
	            this.line = this.groupCurve;
	            this.createHoverStyle(this.curveLine);
	            this.polyLine.hide();
	        } else {
	            this.line = this.polyLine;
	            this.createHoverStyle(this.polyLine);
	            this.curveLine.hide();
	        }
	
	        //3.侦听线事件
	        var MOUSE_EVENT_NAMES = ['dblclick', 'click']; //'click', 'dblclick', 'mouseover', 'mouseout'
	        zrUtil.each(MOUSE_EVENT_NAMES, function(eveName) {
	            this.line.on(eveName, zrUtil.bind(function(e) {
	                e.cancelBubble = true;
	                var params = {};
	                params.event = e;
	                params.type = "Connector:" + eveName;
	                params.target = that;
	                this.trigger(params.type, params);
	                if (this.options.isEdit == false) {
	                    return; }
	
	                if (this.options.isEdit && this.connectionPoints.length < 1 && this.turningPoints.length >= 2) {
	                    this.createAllconnectionPoint()
	                }
	                if (this.handles.length < 1) {
	                    this.shapeSetHandle();
	                }
	            }, this));
	        }, this);
	
	        //3.创建调整线的连接点
	        if (this.options.isEdit) {
	            this.conPointsGroup = new graphic.Group();
	            this.add(this.conPointsGroup);
	        }
	
	        //4.创建线上文本
	        if (this.options.text.text && this.options.text.text != "") {
	            var text = this.drawText("lineText", this.options.text.text, 0, 0);
	            this.add(text.text);
	        }
	
	
	    };
	
	    //设置style
	    Connector.prototype.setStyle = function(options) {
	        if (options.color) {
	            if (this.options.style.lineType == Connector.TYPE_CURVE) {
	                this.groupCurve.eachChild(function(curve) {
	                    curve.attr("style", { stroke: options.color });
	                    graphic.setNormalStyle(curve, { stroke: options.color });
	                });
	            } else {
	                this.polyLine.attr("style", { stroke: options.color });
	                graphic.setNormalStyle(this.polyLine, { stroke: options.color });
	            }
	            var symbolTo = this.childOfName('toSymbol');
	            if (symbolTo) {
	                symbolTo.attr("style", { fill: options.color });
	                graphic.setNormalStyle(symbolTo, { fill: options.color });
	            }
	            this.options.style.stroke = options.color;
	            this.model.set("options.style.stroke", options.color);
	            this.model.set("options.symbol.color", options.color);
	            this.options.symbol.color = options.color;
	        }
	
	        if (options.text) {
	            var lineText = this.childOfName('lineText');
	            //开始没有创建文本，后来传进来text了，需要先创建文本
	            if (!lineText && options.text.text) {
	                var text = this.drawText("lineText", options.text.text, 0, 0);
	                this.add(text.text);
	                lineText = this.childOfName('lineText');
	            }
	
	            if (options.text.text || options.text.text == "") {
	                lineText.setStyle("text", options.text.text);
	                this.options.text.text = options.text.text;
	            }
	            var textPoint = this.getTextPostion(options.text);
	            lineText.attr("position", textPoint);
	            if (options.text.textPos) {
	                this.options.text.textPos = options.text.textPos;
	            } else {
	                this.options.text.textPos = 'center';
	            }
	            if (options.text.color) {
	                lineText.attr("style", {
	                    fill: options.text.color
	                });
	                this.options.text.color = options.text.color;
	            }
	            this.model.set("options.text", options.text);
	        }
	
	        if (options.symbol) {
	            if (options.symbol.type) {
	                this.options.symbol.type = options.symbol.type;
	                this.model.set("options.symbol.type", options.symbol.type);
	            }
	            if (options.symbol.size) {
	                this.options.symbol.size = options.symbol.size;
	                this.model.set("options.symbol.size", options.symbol.size);
	            }
	            if (options.symbol.color) {
	                this.options.symbol.color = options.symbol.color;
	                this.model.set("options.symbol.color", options.symbol.color);
	            }
	            if (options.symbol.z) {
	                this.options.symbol.z = options.symbol.z;
	                this.model.set("options.symbol.z", options.symbol.z);
	            };
	
	            var symbolTo = this.childOfName('toSymbol');
	            if (symbolTo) {
	                this.remove(symbolTo);
	            }
	            var symbol = this.createSymbol("toSymbol", this.model.get("options"))
	            if (symbol) {
	                this.add(symbol);
	            }
	            this.refresh();
	        }
	
	    };
	
	    /**
	     * 获取线段的位置
	     * @param  {Object} text {text:'', color:'', textPos:''}
	     * @return {Object}      {x,y}
	     */
	    Connector.prototype.getTextPostion = function(text) {
	        var textPostion = [];
	        var textWidth = graphic.textContain.getWidth(text.text, text.textFont);
	        if (text && text.textPos) {
	            if (text.textPos == 'start') {
	                var xOffset = text.xOffset || 0;
	                textPostion = [this.turningPoints[0].x + xOffset, this.turningPoints[0].y];
	            } else if (text.textPos == 'end') {
	                var points = Util.getMaxLineLength([this.turningPoints[this.turningPoints.length - 2], this.turningPoints[this.turningPoints.length - 1]]);
	                var angle = Util.getAngle(points[0], points[1]);
	                var length = Util.distance(points[0], points[1]) - textWidth;
	                var newPoint = Util.getEndPoint(points[0], length, angle);
	                textPostion = [newPoint.x, newPoint.y];
	            } else {
	                textPostion = this.middle(text);
	            }
	        } else {
	            var position = this.middle(text);
	            textPostion = [position[0] - textWidth / 2, position[1]];
	        }
	
	        return textPostion;
	    };
	
	    /**
	     * 获取线段的旋转角度
	     * @param  {Object} textPostion {x,y}
	     * @return {Number}             角度值
	     */
	    Connector.prototype.getTextRotation = function(textPostion) {
	        //计算出极坐标的角度
	        var points = Util.getMaxLineLength(this.turningPoints);
	        var angle = -Math.atan2(points[1].y - textPostion[1], points[1].x - textPostion[0]); //,Math.PI/2
	        return angle;
	    };
	
	    Connector.prototype.createHoverStyle = function(el) {
	        if (this.options.hoverStyle) {
	            graphic.setElementHoverStl(el, this.options.hoverStyle);
	
	            var symbolTo = this.childOfName('toSymbol');
	            if (symbolTo) { graphic.setElementHoverStl(symbolTo, this.options.arrowHoverStyle); }
	
	            el.on('mouseover', zrUtil.bind(function() {
	                    graphic.doEnterHover(el);
	                    if (symbolTo) { graphic.doEnterHover(symbolTo); }
	
	                    this.groupCurve.eachChild(function(line) {
	                        graphic.doEnterHover(line);
	                    });
	                }, this))
	                .on('mouseout', zrUtil.bind(function() {
	                    graphic.doLeaveHover(el);
	                    if (symbolTo) { graphic.doLeaveHover(symbolTo); }
	                    this.groupCurve.eachChild(function(line) {
	                        graphic.doLeaveHover(line);
	                    });
	                }, this));
	        }
	    };
	    /**
	     * 创建Node的连接点
	     * @private
	     *
	     * @return {[type]} [description]
	     */
	    Connector.prototype.createAllconnectionPoint = function() {
	        var sRect = this.startNode.getRect ? this.startNode.getRect().boundingRect : Util.getRect(this.startNode).boundingRect;
	
	        var eRect = this.endNode.getRect ? this.endNode.getRect().boundingRect : Util.getRect(this.endNode).boundingRect;
	
	        var sConnectorPoint = Util.getConnectorPoints(sRect);
	        var eConnectorPoint = Util.getConnectorPoints(eRect);
	
	        this.connectionPointCreate(this.startNode, sConnectorPoint.left, Connector.START_NODE + Connector.SEPERATOR + Connector.LEFT);
	        this.connectionPointCreate(this.startNode, sConnectorPoint.right, Connector.START_NODE + Connector.SEPERATOR + Connector.RIGHT);
	        this.connectionPointCreate(this.startNode, sConnectorPoint.top, Connector.START_NODE + Connector.SEPERATOR + Connector.TOP);
	        this.connectionPointCreate(this.startNode, sConnectorPoint.bottom, Connector.START_NODE + Connector.SEPERATOR + Connector.BOTTOM);
	
	        this.connectionPointCreate(this.endNode, eConnectorPoint.left, Connector.END_NODE + Connector.SEPERATOR + Connector.LEFT);
	        this.connectionPointCreate(this.endNode, eConnectorPoint.right, Connector.END_NODE + Connector.SEPERATOR + Connector.RIGHT);
	        this.connectionPointCreate(this.endNode, eConnectorPoint.top, Connector.END_NODE + Connector.SEPERATOR + Connector.TOP);
	        this.connectionPointCreate(this.endNode, eConnectorPoint.bottom, Connector.END_NODE + Connector.SEPERATOR + Connector.BOTTOM);
	
	
	        this.connectionPointCreate(this, this.turningPoints[0].clone(), ConnectionPoint.TYPE_CONNECTOR);
	
	        this.connectionPointCreate(this, this.turningPoints[this.turningPoints.length - 1].clone(), ConnectionPoint.TYPE_CONNECTOR);
	    };
	
	    /**
	     * 创建连接点
	     * @private
	     * @param  {[type]} shape [description]
	     * @param  {[type]} point [description]
	     * @param  {[type]} type  [description]
	     * @return {[type]}       [description]
	     */
	    Connector.prototype.connectionPointCreate = function(shape, point, type) {
	        var conPoint = new ConnectionPoint(this, point, type, this.options);
	        this.conPointsGroup.add(conPoint.shape);
	    };
	
	    /**
	     * 清空控制点
	     * @return {[type]} [description]
	     */
	    Connector.prototype.clearHandles = function() {
	        for (var i = 0; i < this.handles.length; i++) {
	            this.remove(this.handles[i].handleShape);
	        }
	        this.handles = [];
	        if (this.conPointsGroup) {
	            this.conPointsGroup.removeAll();
	        }
	    };
	
	    /**
	     * 创建拆线 线断的控制点
	     * @return {[type]} [description]
	     */
	    Connector.prototype.shapeSetHandle = function() {
	        for (var i = 1; i < this.turningPoints.length - 2; i++) {
	            var h;
	            var x, y;
	            //是否在一条线上
	            var isCollineaityFirst = Util.collinearity(this.turningPoints[i - 1], this.turningPoints[i], this.turningPoints[i + 1]);
	            var isCollineaitySecond = Util.collinearity(this.turningPoints[i], this.turningPoints[i + 1], this.turningPoints[i + 2]);
	            if ((!isCollineaityFirst && (!isCollineaitySecond || this.turningPoints[i + 1].equals(this.turningPoints[i + 2]))) || ((!isCollineaityFirst || this.turningPoints[i - 1].equals(this.turningPoints[i])) && !isCollineaitySecond)) {
	
	                if (this.turningPoints[i].x === this.turningPoints[i + 1].x) { //same vertical
	                    x = this.turningPoints[i].x;
	                    y = (this.turningPoints[i].y + this.turningPoints[i + 1].y) / 2;
	
	                    h = new Handle('h', x, y, this);
	
	
	                } else if (this.turningPoints[i].y === this.turningPoints[i + 1].y) { // same horizontal
	                    x = (this.turningPoints[i].x + this.turningPoints[i + 1].x) / 2;
	                    y = this.turningPoints[i].y;
	                    h = new Handle('v', x, y, this);
	                }
	                if (h) {
	                    this.add(h.handleShape);
	                    this.handles.push(h);
	                }
	
	            }
	        }
	    };
	
	
	    /**
	     * 创建箭头
	     * @param  {[type]} name       [description]
	     * @param  {[type]} options [description]
	     * @return {[type]}            [description]
	     */
	    Connector.prototype.createSymbol = function(name, options) {
	        var symbolType = options.symbol.type;
	        var symbolSize = options.symbol.size;
	        if (symbolType === 'none') {
	            return;
	        }
	
	        if (!zrUtil.isArray(symbolSize)) {
	            symbolSize = [symbolSize, symbolSize];
	        }
	
	        var symbolZIndex = options.z;
	
	        if (options.symbol.z) { symbolZIndex = options.symbol.z };
	
	        var symbolPath = symbolUtil.createSymbol(
	            symbolType, -symbolSize[0] / 2, -symbolSize[1] / 2,
	            symbolSize[0], symbolSize[1], options.symbol.color, symbolZIndex
	        );
	        symbolPath.name = name;
	
	        return symbolPath;
	    };
	
	    /**
	     * 绘制线段上的文本
	     * @param  {[type]} content [description]
	     * @param  {[type]} name [description]
	     * @param  {[type]} x       [description]
	     * @param  {[type]} y       [description]
	     * @param  {[type]} color   [description]
	     * @return {[type]}         [description]
	     */
	    Connector.prototype.drawText = function(name, content, x, y, color) {
	        var text = new graphic.Text({
	            style: {
	                text: content,
	                x: x,
	                y: y,
	                fill: color ? color : this.options.text.color,
	                textFont: this.options.text.textFont
	            },
	            zlevel: 20
	        });
	        text.name = name;
	        return {
	            text: text,
	            rect: text.getBoundingRect()
	        };
	    };
	
	    /**
	     * 获取线段的中间值
	     * @return {[type]} text
	     */
	    Connector.prototype.middle = function(text) {
	
	        if (this.options.style.lineType == Connector.TYPE_STRAIGHT) {
	            var points = Util.getMaxLineLength(this.turningPoints);
	            //如果是求线段上的文字的中间值
	            // if(text) {
	            //     //取出字的长度，计算角度，
	            //     var textWidth = graphic.textContain.getWidth(text.text, text.textFont);
	            //     var angle = Util.getAngle(points[0],points[1]);
	            //     var length =  Util.distance(points[0],points[1])/2 - textWidth/2;
	            //     var newPoint = Util.getEndPoint(points[0], length, angle);
	            //     return [newPoint.x, newPoint.y];
	            // } else {
	            //     var middleX = (points[0].x + points[1].x)/2;
	            //     var middleY = (points[0].y + points[1].y) /2;
	            //     return [middleX, middleY];
	            // }
	            var middleX = (points[0].x + points[1].x) / 2;
	            var middleY = (points[0].y + points[1].y) / 2;
	            return [middleX, middleY];
	        } else if (this.options.style.lineType == Connector.TYPE_JAGGED) {
	
	            //find total distance
	            var distance = this.getLength();
	
	            //find between what turning points the half distance is
	            var index = -1;
	            var ellapsedDistance = 0;
	            for (var i = 0; i < this.turningPoints.length - 1; i++) {
	                index = i;
	                var segment = Util.getLength(this.turningPoints[i], this.turningPoints[i + 1]);
	                if (ellapsedDistance + segment < distance / 2) {
	                    ellapsedDistance += segment;
	                } else {
	                    break;
	                }
	            }
	
	            //we have the middle distance somewhere between i(ndex) and i(ndex)+1
	            if (index != -1) {
	                var missingDistance = distance / 2 - ellapsedDistance;
	                if (Util.round(this.turningPoints[index].x, 3) == Util.round(this.turningPoints[index + 1].x, 3)) { //vertical segment (same x)
	                    return [this.turningPoints[index].x, Math.min(this.turningPoints[index].y, this.turningPoints[index + 1].y) + missingDistance];
	                } else if (Util.round(this.turningPoints[index].y, 3) == Util.round(this.turningPoints[index + 1].y, 3)) { //horizontal segment (same y)
	                    return [Math.min(this.turningPoints[index].x, this.turningPoints[index + 1].x) + missingDistance, this.turningPoints[index].y];
	                } else {
	                    console.error("Connector:middle() - this should never happen " + this.turningPoints[index] + " " + this.turningPoints[index + 1] + " nr of points " + this.turningPoints.length);
	                }
	
	            }
	        } else if (this.options.style.lineType == Connector.TYPE_CURVE) {
	            var t = 0.5;
	            var l = this.getLength();
	
	            var walked = 0;
	            for (var j = 0; j < this.turningPoints.length - 1; j++) {
	                if (walked + Util.distance(this.turningPoints[j], this.turningPoints[j + 1]) > l * t) {
	                    break;
	                }
	
	                walked += Util.distance(this.turningPoints[j], this.turningPoints[j + 1]);
	            }
	
	            var rest = l * t - walked;
	            var currentSegmentLength = Util.distance(this.turningPoints[j], this.turningPoints[j + 1]);
	
	            //find the position/ration of the middle of Polyline on current segment
	            var segmentPercent = rest / currentSegmentLength;
	
	            var Xp = segmentPercent * (this.turningPoints[j + 1].x - this.turningPoints[j].x) + this.turningPoints[j].x;
	            var Yp = segmentPercent * (this.turningPoints[j + 1].y - this.turningPoints[j].y) + this.turningPoints[j].y;
	
	            return [Xp, Yp];
	
	        }
	
	        return null;
	    };
	
	    /**
	     * find total distance
	     * @return {Number} [description]
	     */
	    Connector.prototype.getLength = function() {
	        //find total distance
	        var distance = 0;
	        for (var i = 0; i < this.turningPoints.length - 1; i++) {
	            distance += Util.getLength(this.turningPoints[i], this.turningPoints[i + 1]);
	        }
	        return distance;
	    };
	
	    /**
	     * 转JSON对象
	     * @return {[type]} [description]
	     */
	    Connector.prototype.toJSON = function() {
	
	        this.model.set("resourceId", this.resourceId);
	        this.model.set("properties.type", 14);
	
	        this.model.set("bounds.upperLeft.x", this.position[0]);
	        this.model.set("bounds.upperLeft.y", this.position[1]);
	        this.model.set("bounds.lowerRight.x", parseInt(this.position[0] + this.getBoundingRect().width));
	        this.model.set("bounds.lowerRight.y", parseInt(this.position[1] + this.getBoundingRect().height));
	        this.model.set("style.sPos", this.sPos);
	        this.model.set("style.ePos", this.ePos);
	        this.model.set("dockers", this.turningPoints);
	        return this.model.option;
	    };
	
	    /**
	     * refreshModel
	     * @return {[type]} [description]
	     */
	    Connector.prototype.refreshModel = function() {
	        this.model.set("options.dockers", this.turningPoints);
	        var icons = [];
	        for (var i = 0; i < this.icons.length; i++) {
	            var iconNode = this.icons[i];
	            var option = [iconNode.key, {
	                icon: iconNode.style.image,
	                width: iconNode.style.width,
	                height: iconNode.style.height
	            }];
	            icons.push(option);
	        }
	        this.model.set("icons", icons);
	    };
	
	    /**
	     * 调整曲线的形状
	     * @param  {array} points 点数组
	     * @return {void}
	     */
	    Connector.prototype.modifyCurve = function(points) {
	        var sol = this.getCurvePoint(points);
	
	        // 1. 如果曲线的数量 比数量的中数量要少 则删除多余的线段
	        var willDelCurves = [];
	        for (var j = sol.length, cntCurve = this.groupCurve.childCount(); j < cntCurve; j++) {
	            willDelCurves.push(this.groupCurve.childAt(j));
	        }
	        zrUtil.each(willDelCurves, function(curve) {
	            this.groupCurve.remove(curve);
	        }, this);
	        // 2. 遍历曲线   如果存在则直接设置形状，否则创建
	        for (var i = 0; i < sol.length; i++) {
	            var line = this.groupCurve.childAt(i);
	            if (line) {
	                line.attr('shape', sol[i]);
	            } else {
	                var cure = new graphic.BezierCurve({
	                    position: this.options.position,
	                    style: this.options.style,
	                    shape: sol[i],
	                    z: this.options.z
	                });
	                this.groupCurve.add(cure);
	                this.createHoverStyle(cure);
	            }
	        }
	    };
	
	
	    /**
	     * 根据传入的点数组计算曲线的点
	     * @param  {array} P 点数组
	     * @return {object}        曲线的点数组
	     */
	    Connector.prototype.getCurvePoint = function(P) {
	        var n = P.length;
	        var sol = [];
	        if (n === 3) {
	            sol.push({
	                x1: P[0].x,
	                y1: P[0].y,
	                cpx1: P[1].x,
	                cpy1: P[1].y,
	                x2: P[2].x,
	                y2: P[2].y
	            });
	            return sol;
	        } else if (n === 4) {
	            sol.push({
	                x1: P[0].x,
	                y1: P[0].y,
	                cpx1: P[1].x,
	                cpy1: P[1].y,
	                cpx2: P[2].x,
	                cpy2: P[2].y,
	                x2: P[3].x,
	                y2: P[3].y
	            });
	            return sol;
	        }
	
	        /**Computes factorial
	         * @param {Number} k the number
	         * */
	        function fact(k) {
	            if (k === 0 || k === 1) {
	                return 1;
	            } else {
	                return k * fact(k - 1);
	            }
	        }
	
	        /**Computes Bernstain*/
	        function B(i, n, u) {
	            return fact(n) / (fact(i) * fact(n - i)) * Math.pow(u, i) * Math.pow(1 - u, n - i);
	        }
	
	        /**Computes the sum between two point
	         *@param p1 - {Point}
	         *@param p2 - {Point}
	         *@return {Point} the sum of initial points
	         **/
	        function sum(p1, p2) {
	            return new Point(p1.x + p2.x, p1.y + p2.y);
	        }
	
	        /**Computes the difference between first {Point} and second {Point}
	         *@param p1 - {Point}
	         *@param p2 - {Point}
	         *@return {Point} the sum of initial points
	         **/
	        function minus(p1, p2) {
	            return new Point(p1.x - p2.x, p1.y - p2.y);
	        }
	
	        /**Computes the division of a {Point} by a number
	         *@param p - {Point}
	         *@param nr - {Number}
	         *@return {Point}
	         **/
	        function divide(p, nr) {
	            if (nr == 0) {
	                throw "Division by zero not allowed (yet :) " + this.callee;
	            }
	            return new Point(p.x / nr, p.y / nr);
	        }
	
	        /**Computes the multiplication of a {Point} by a number
	         *@param p - {Point}
	         *@param nr - {Number}
	         *@return {Point}
	         **/
	        function multiply(p, nr) {
	            return new Point(p.x * nr, p.y * nr);
	        }
	
	
	
	
	        /*
	         *I do not get why first 4 must be 0 and last 3 of same value.....
	         *but otherwise we will get division by zero
	         */
	        var k = [0, 0, 0];
	
	        var j;
	        for (j = 0; j <= n - 3; j++) {
	            k.push(j);
	        }
	
	        k.push(n - 3, n - 3);
	
	
	
	        for (i = 1; i <= n - 3; i++) {
	            //q1 - compute start point
	            var q1 = divide(sum(multiply(P[i], k[i + 4] - k[i + 2]), multiply(P[i + 1], k[i + 2] - k[i + 1])), k[i + 4] - k[i + 1]);
	
	            //q0 - compute 1st controll point
	            var q_01 = (k[i + 3] - k[i + 2]) / (k[i + 3] - k[i + 1]);
	            var q_02 = divide(sum(multiply(P[i - 1], k[i + 3] - k[i + 2]), multiply(P[i], k[i + 2] - k[i])), k[i + 3] - k[i]);
	            var q_03 = multiply(q1, (k[i + 2] - k[i + 1]) / (k[i + 3] - k[i + 1]));
	            var q0 = sum(multiply(q_02, q_01), q_03);
	
	            //q2 - compute 2nd controll point
	            var q2 = divide(sum(multiply(P[i], k[i + 4] - k[i + 3]), multiply(P[i + 1], k[i + 3] - k[i + 1])), k[i + 4] - k[i + 1]);
	
	            //q3 - compute end point
	            var q_31 = (k[i + 3] - k[i + 2]) / (k[i + 4] - k[i + 2]);
	            var q_32 = divide(sum(multiply(P[i + 1], k[i + 5] - k[i + 3]), multiply(P[i + 2], k[i + 3] - k[i + 2])), k[i + 5] - k[i + 2]);
	            var q_33 = multiply(q2, (k[i + 4] - k[i + 3]) / (k[i + 4] - k[i + 2]));
	            var q3 = sum(multiply(q_32, q_31), q_33);
	
	            //store solution
	            //
	            sol.push({
	                x1: q0.x,
	                y1: q0.y,
	                cpx1: q1.x,
	                cpy1: q1.y,
	                cpx2: q2.x,
	                cpy2: q2.y,
	                x2: q3.x,
	                y2: q3.y
	            });
	        }
	
	        return sol;
	    };
	
	
	    Util.inherits(Connector, Node);
	
	    module.exports = Connector;
	
	


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Symbol factory
	
	
	    var graphic = __webpack_require__(3);
	    var BoundingRect = __webpack_require__(25);
	    /**
	     * Triangle shape
	     * @inner
	     */
	    var Triangle = graphic.extendShape({
	        type: 'triangle',
	        shape: {
	            cx: 0,
	            cy: 0,
	            width: 0,
	            height: 0
	        },
	        buildPath: function (path, shape) {
	            var cx = shape.cx;
	            var cy = shape.cy;
	            var width = shape.width / 2;
	            var height = shape.height / 2;
	            path.moveTo(cx, cy - height);
	            path.lineTo(cx + width, cy + height);
	            path.lineTo(cx - width, cy + height);
	            path.closePath();
	        }
	    });
	    /**
	     * Diamond shape
	     * @inner
	     */
	    var Diamond = graphic.extendShape({
	        type: 'diamond',
	        shape: {
	            cx: 0,
	            cy: 0,
	            width: 0,
	            height: 0
	        },
	        buildPath: function (path, shape) {
	            var cx = shape.cx;
	            var cy = shape.cy;
	            var width = shape.width / 2;
	            var height = shape.height / 2;
	            path.moveTo(cx, cy - height);
	            path.lineTo(cx + width, cy);
	            path.lineTo(cx, cy + height);
	            path.lineTo(cx - width, cy);
	            path.closePath();
	        }
	    });
	
	    /**
	     * Pin shape
	     * @inner
	     */
	    var Pin = graphic.extendShape({
	        type: 'pin',
	        shape: {
	            // x, y on the cusp
	            x: 0,
	            y: 0,
	            width: 0,
	            height: 0
	        },
	
	        buildPath: function (path, shape) {
	            var x = shape.x;
	            var y = shape.y;
	            var w = shape.width / 5 * 3;
	            // Height must be larger than width
	            var h = Math.max(w, shape.height);
	            var r = w / 2;
	
	            // Dist on y with tangent point and circle center
	            var dy = r * r / (h - r);
	            var cy = y - h + r + dy;
	            var angle = Math.asin(dy / r);
	            // Dist on x with tangent point and circle center
	            var dx = Math.cos(angle) * r;
	
	            var tanX = Math.sin(angle);
	            var tanY = Math.cos(angle);
	
	            path.arc(
	                x, cy, r,
	                Math.PI - angle,
	                Math.PI * 2 + angle
	            );
	
	            var cpLen = r * 0.6;
	            var cpLen2 = r * 0.7;
	            path.bezierCurveTo(
	                x + dx - tanX * cpLen, cy + dy + tanY * cpLen,
	                x, y - cpLen2,
	                x, y
	            );
	            path.bezierCurveTo(
	                x, y - cpLen2,
	                x - dx + tanX * cpLen, cy + dy + tanY * cpLen,
	                x - dx, cy + dy
	            );
	            path.closePath();
	        }
	    });
	
	    /**
	     * Arrow shape
	     * @inner
	     */
	    var Arrow = graphic.extendShape({
	
	        type: 'arrow',
	
	        shape: {
	            x: 0,
	            y: 0,
	            width: 0,
	            height: 0
	        },
	
	        buildPath: function (ctx, shape) {
	            var height = shape.height;
	            var width = shape.width;
	            var x = shape.x;
	            var y = shape.y;
	            var dx = width / 3 * 2;
	            ctx.moveTo(x, y);
	            ctx.lineTo(x + dx, y + height);
	            ctx.lineTo(x, y + height / 4 * 3);
	            ctx.lineTo(x - dx, y + height);
	            ctx.lineTo(x, y);
	            ctx.closePath();
	        }
	    });
	
	    /**
	     * Map of path contructors
	     * @type {Object.<string, module:zrender/graphic/Path>}
	     */
	    var symbolCtors = {
	        line: graphic.Line,
	
	        rect: graphic.Rect,
	
	        roundRect: graphic.Rect,
	
	        square: graphic.Rect,
	
	        circle: graphic.Circle,
	
	        diamond: Diamond,
	
	        pin: Pin,
	
	        arrow: Arrow,
	
	        triangle: Triangle
	    };
	
	    var symbolShapeMakers = {
	
	        line: function (x, y, w, h, shape) {
	            // FIXME
	            shape.x1 = x;
	            shape.y1 = y + h / 2;
	            shape.x2 = x + w;
	            shape.y2 = y + h / 2;
	        },
	
	        rect: function (x, y, w, h, shape) {
	            shape.x = x;
	            shape.y = y;
	            shape.width = w;
	            shape.height = h;
	        },
	
	        roundRect: function (x, y, w, h, shape) {
	            shape.x = x;
	            shape.y = y;
	            shape.width = w;
	            shape.height = h;
	            shape.r = Math.min(w, h) / 4;
	        },
	
	        square: function (x, y, w, h, shape) {
	            var size = Math.min(w, h);
	            shape.x = x;
	            shape.y = y;
	            shape.width = size;
	            shape.height = size;
	        },
	
	        circle: function (x, y, w, h, shape) {
	            // Put circle in the center of square
	            shape.cx = x + w / 2;
	            shape.cy = y + h / 2;
	            shape.r = Math.min(w, h) / 2;
	        },
	
	        diamond: function (x, y, w, h, shape) {
	            shape.cx = x + w / 2;
	            shape.cy = y + h / 2;
	            shape.width = w;
	            shape.height = h;
	        },
	
	        pin: function (x, y, w, h, shape) {
	            shape.x = x + w / 2;
	            shape.y = y + h / 2;
	            shape.width = w;
	            shape.height = h;
	        },
	
	        arrow: function (x, y, w, h, shape) {
	            shape.x = x + w / 2;
	            shape.y = y + h / 2;
	            shape.width = w;
	            shape.height = h;
	        },
	
	        triangle: function (x, y, w, h, shape) {
	            shape.cx = x + w / 2;
	            shape.cy = y + h / 2;
	            shape.width = w;
	            shape.height = h;
	        }
	    };
	
	    var symbolBuildProxies = {};
	    for (var name in symbolCtors) {
	        symbolBuildProxies[name] = new symbolCtors[name]();
	    }
	
	    var Symbol = graphic.extendShape({
	
	        type: 'symbol',
	
	        shape: {
	            symbolType: '',
	            x: 0,
	            y: 0,
	            width: 0,
	            height: 0
	        },
	
	        beforeBrush: function () {
	            var style = this.style;
	            var shape = this.shape;
	            // FIXME
	            if (shape.symbolType === 'pin' && style.textPosition === 'inside') {
	                style.textPosition = ['50%', '40%'];
	                style.textAlign = 'center';
	                style.textVerticalAlign = 'middle';
	            }
	        },
	
	        buildPath: function (ctx, shape) {
	            var symbolType = shape.symbolType;
	            var proxySymbol = symbolBuildProxies[symbolType];
	            if (shape.symbolType !== 'none') {
	                if (!proxySymbol) {
	                    // Default rect
	                    symbolType = 'rect';
	                    proxySymbol = symbolBuildProxies[symbolType];
	                }
	                symbolShapeMakers[symbolType](
	                    shape.x, shape.y, shape.width, shape.height, proxySymbol.shape
	                );
	                proxySymbol.buildPath(ctx, proxySymbol.shape);
	            }
	        }
	    });
	
	    // Provide setColor helper method to avoid determine if set the fill or stroke outside
	    var symbolPathSetColor = function (color) {
	        if (this.type !== 'image') {
	            var symbolStyle = this.style;
	            var symbolShape = this.shape;
	            if (symbolShape && symbolShape.symbolType === 'line') {
	                symbolStyle.stroke = color;
	            }
	            else if (this.__isEmptyBrush) {
	                symbolStyle.stroke = color;
	                symbolStyle.fill = '#fff';
	            }
	            else {
	                // FIXME 判断图形默认是填充还是描边，使用 onlyStroke ?
	                symbolStyle.fill && (symbolStyle.fill = color);
	                symbolStyle.stroke && (symbolStyle.stroke = color);
	            }
	            this.dirty();
	        }
	    };
	
	    var symbolUtil = {
	        /**
	         * Create a symbol element with given symbol configuration: shape, x, y, width, height, color
	         * @param {string} symbolType
	         * @param {number} x
	         * @param {number} y
	         * @param {number} w
	         * @param {number} h
	         * @param {number} z
	         * @param {string} color
	         */
	        createSymbol: function (symbolType, x, y, w, h, color, z) {
	            var isEmpty = symbolType.indexOf('empty') === 0;
	            if (isEmpty) {
	                symbolType = symbolType.substr(5, 1).toLowerCase() + symbolType.substr(6);
	            }
	            var symbolPath;
	
	            if (symbolType.indexOf('image://') === 0) {
	                symbolPath = new graphic.Image({
	                    style: {
	                        image: symbolType.slice(8),
	                        x: x,
	                        y: y,
	                        width: w,
	                        height: h
	                    },
	                    z: z
	                });
	            }
	            else if (symbolType.indexOf('path://') === 0) {
	                symbolPath = graphic.makePath(symbolType.slice(7), {z: z}, new BoundingRect(x, y, w, h));
	            }
	            else {
	                symbolPath = new Symbol({
	                    shape: {
	                        symbolType: symbolType,
	                        x: x,
	                        y: y,
	                        width: w,
	                        height: h
	                    },
	                    z: z
	                });
	            }
	
	            symbolPath.__isEmptyBrush = isEmpty;
	
	            symbolPath.setColor = symbolPathSetColor;
	
	            symbolPath.setColor(color);
	
	            return symbolPath;
	        }
	    };
	
	    module.exports = symbolUtil;
	


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画句柄
	 * @author wang.xiaohu
	 */
	
	    var graphic = __webpack_require__(3);
	    var Util = __webpack_require__(59);
	    function Handle(type, x, y, connector){
	        this.type = type;
	
	        this.x = x;
	
	        this.y = y;
	
	        this.visible = true;
	
	        this.connector = connector;
	
	        this.handleShape = new graphic.Circle({
	            shape: {
	                cx: x,
	                cy: y,
	                r: Handle.RADIUS
	            },
	
	            style: {
	                fill: "rgb(0,255,0)",
	                stroke:"rgb(0,0,0)"
	            },
	            z : connector.options.z + 2,  //节点Z为1 线段为0;
	            draggable:true
	        });
	
	        var that = this;
	        this.handleShape.on("drag", function(e) {
	            that.actionConnector(e.offsetX,e.offsetY);
	        });
	       // return this.circle;
	    }
	
	    Handle.RADIUS = 4;
	
	    Handle.prototype = {
	
	        constructor : Handle,
	
	        equals : function(anotherHandle){
	            if(!anotherHandle instanceof Handle){
	                return false;
	            }
	
	            return this.type == anotherHandle.type
	            && this.x == anotherHandle.x
	            && this.y == anotherHandle.y
	            && this.visible == anotherHandle.visible;
	        },
	
	        /**
	         * 移动句柄
	         * @param  {[type]} newX [description]
	         * @param  {[type]} newY [description]
	         * @return {[type]}      [description]
	         */
	        actionConnector: function(newX, newY){
	            switch(this.type){
	                case 'v':
	                    var index;
	                    // 找出两个转折点（可移动句柄在这两个转折点中间）
	                    for(var i = 1; i < this.connector.turningPoints.length-1; i++){
	                        if(this.connector.turningPoints[i-1].y == this.connector.turningPoints[i].y
	                            && this.connector.turningPoints[i].y == this.y
	                            && Math.min(this.connector.turningPoints[i].x, this.connector.turningPoints[i-1].x) <= this.x
	                            && Math.max(this.connector.turningPoints[i].x, this.connector.turningPoints[i-1].x) >= this.x)
	                        {
	                            index = i;
	                        }
	                    }
	                    var deltaY = newY - this.y;
	                    var translationMatrix = Util.translationMatrix(0, deltaY);
	
	                    this.connector.turningPoints[index-1].transform(translationMatrix);
	                    this.connector.turningPoints[index].transform(translationMatrix);
	                    this.connector.refresh();
	                    this.y = newY;  //将句柄新的位置赋值给y
	
	                    break;
	
	                case 'h':
	                    var index;
	                    // 找出两个转折点（可移动句柄在这两个转折点中间）
	                    for(var i = 1; i < this.connector.turningPoints.length-1; i++){
	                        if(this.connector.turningPoints[i-1].x == this.connector.turningPoints[i].x
	                            && this.connector.turningPoints[i].x == this.x
	                            && Math.min(this.connector.turningPoints[i].y, this.connector.turningPoints[i-1].y) <= this.y
	                            && Math.max(this.connector.turningPoints[i].y, this.connector.turningPoints[i-1].y) >= this.y)
	                            {
	                            index = i;
	                        }
	                    }
	                    var deltaX = newX-this.x;
	                    var translationMatrix = Util.translationMatrix(deltaX, 0);
	                    this.connector.turningPoints[index-1].transform(translationMatrix);
	                    this.connector.turningPoints[index].transform(translationMatrix);
	                    this.connector.refresh();
	                    this.x = newX; //将句柄新的位置赋值给x
	
	                    break;
	            }
	           //. this.shape.updateMiddleText();
	        }
	    };
	    module.exports = Handle;
	
	
	


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 连线动态效果
	 * @author miao.cunzhi
	 */
	
	    var zrUtil = __webpack_require__(4);
	    var vec2 = __webpack_require__(14);
	    var curveUtil = __webpack_require__(27);
	    var symbolUtil = __webpack_require__(77);
	
	    function EffectLine(symbol, options, groupCurve, polyLine) {
	        this._lastFrame = 0;
	        this._lastFramePercent = 0;
	        this.symbol = symbol;
	        this.groupCurve = groupCurve;
	        this.initSymbol(options, polyLine);
	    }
	    var EffectLineProto = EffectLine.prototype;
	
	    EffectLineProto.initSymbol = function(options, polyLine) {
	        var that = this;
	        this.symbol.z2 = 100;
	        this.symbol.culling = true;
	        var period = options.effect.period * 1000;
	        this.symbol.__t = 0;
	        this.symbol.stopAnimation();
	        if ((options.style.lineType == "curve")) {
	            if (this.groupCurve) {
	                var i = 0;
	                period = period / this.groupCurve._children.length;
	                this.groupCurveAnimate(this.groupCurve._children[0], i, period);
	            }
	
	        } else {
	            this.symbol.animate('', true)
	                .when(period, {
	                    __t: 1
	                })
	                .delay(0)
	                .during(function() {
	                    that.updateSymbolPositionPolyline();
	                })
	                .start();
	            this.setAnimationPointsPolyline(polyLine.shape.points);
	        }
	
	    };
	
	    EffectLineProto.groupCurveAnimate = function(curveLine, i, period) {
	        var that = this;
	        if (curveLine == undefined) {
	            curveLine = this.groupCurve._children[0];
	            i = 0;
	        }
	        var points;
	        var pos = curveLine.shape;
	        points = [
	            [pos.x1, pos.y1],
	            [pos.x2, pos.y2],
	            [pos.cpx1, pos.cpy1],
	            [pos.cpx2, pos.cpy2]
	        ];
	        this.setAnimationPointsBezierCurve(points);
	        this.symbol.animate('')
	            .when(period, {
	                __t: 1
	            })
	            .delay(0)
	            .during(function() {
	                that.updateSymbolPositionBezierCurve();
	            })
	            .done(function() {
	                that.symbol.__t = 0;
	                that.groupCurveAnimate(that.groupCurve._children[i + 1], i + 1, period);
	            })
	            .start();
	
	    };
	
	
	    EffectLineProto.setAnimationPointsBezierCurve = function(points) {
	        this.symbol.__p1 = points[0];
	        this.symbol.__p2 = points[1];
	        this.symbol.__cp1 = points[2] || [
	            (points[0][0] + points[1][0]) / 2,
	            (points[0][1] + points[1][1]) / 2
	        ];
	        this.symbol.__cp2 = points[3];
	    };
	
	    EffectLineProto.updateSymbolPositionBezierCurve = function() {
	        var p1 = this.symbol.__p1;
	        var p2 = this.symbol.__p2;
	        var cp1 = this.symbol.__cp1;
	        var cp2 = this.symbol.__cp2;
	        var t = this.symbol.__t;
	        var pos = this.symbol.position;
	        var tx, ty;
	        if (cp2[0] != undefined) {
	            var cubicAt = curveUtil.cubicAt;
	            var cubicDerivativeAt = curveUtil.cubicDerivativeAt;
	            pos[0] = cubicAt(p1[0], cp1[0], cp2[0], p2[0], t);
	            pos[1] = cubicAt(p1[1], cp1[1], cp2[1], p2[1], t);
	            // Tangent
	            tx = cubicDerivativeAt(p1[0], cp1[0], cp2[0], p2[0], t);
	            ty = cubicDerivativeAt(p1[1], cp1[1], cp2[1], p2[1], t);
	        } else {
	            var quadraticAt = curveUtil.quadraticAt;
	            var quadraticDerivativeAt = curveUtil.quadraticDerivativeAt;
	            pos[0] = quadraticAt(p1[0], cp1[0], p2[0], t);
	            pos[1] = quadraticAt(p1[1], cp1[1], p2[1], t);
	            // Tangent
	            tx = quadraticDerivativeAt(p1[0], cp1[0], p2[0], t);
	            ty = quadraticDerivativeAt(p1[1], cp1[1], p2[1], t);
	        }
	        this.symbol.rotation = -Math.atan2(ty, tx) - Math.PI / 2;
	
	        this.symbol.ignore = false;
	    };
	
	    EffectLineProto.setAnimationPointsPolyline = function(points) {
	        this._points = points;
	        var accLenArr = [0];
	        var len = 0;
	        for (var i = 1; i < points.length; i++) {
	            var p1 = points[i - 1];
	            var p2 = points[i];
	            len += vec2.dist(p1, p2);
	            accLenArr.push(len);
	        }
	        if (len === 0) {
	            return;
	        }
	
	        for (var j = 0; j < accLenArr.length; j++) {
	            accLenArr[j] /= len;
	        }
	        this._offsets = accLenArr;
	        this._length = len;
	        this.symbol._lastFrame = 0;
	        this.symbol.__lastFramePercent = 0;
	    };
	
	    EffectLineProto.updateSymbolPositionPolyline = function() {
	        var t = this.symbol.__t;
	        var points = this._points;
	        var offsets = this._offsets;
	        var len = points.length;
	
	        if (!offsets) {
	            // Has length 0
	            return;
	        }
	
	        var lastFrame = this._lastFrame;
	        var frame;
	
	        if (t < this._lastFramePercent) {
	            // Start from the next frame
	            // PENDING start from lastFrame ?
	            var start = Math.min(lastFrame + 1, len - 1);
	            for (frame = start; frame >= 0; frame--) {
	                if (offsets[frame] <= t) {
	                    break;
	                }
	            }
	            // PENDING really need to do this ?
	            frame = Math.min(frame, len - 2);
	        } else {
	            for (var frame = lastFrame; frame < len; frame++) {
	                if (offsets[frame] > t) {
	                    break;
	                }
	            }
	            frame = Math.min(frame - 1, len - 2);
	        }
	        vec2.lerp(
	            this.symbol.position, points[frame], points[frame + 1],
	            (t - offsets[frame]) / (offsets[frame + 1] - offsets[frame])
	        );
	
	        this._lastFrame = frame;
	        this._lastFramePercent = t;
	        var angle = -Math.atan2(points[frame + 1][1] - points[frame][1], points[frame + 1][0] - points[frame][0]);
	        this.symbol.rotation = angle - Math.PI / 2;
	        this.symbol.ignore = false;
	    };
	    module.exports = EffectLine;
	


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 控制点
	 * @author wang.xiaohu
	 */
	
	    var graphic = __webpack_require__(3);
	    var Util = __webpack_require__(59);
	    function ConnectionPoint(connector, point, type, options){
	        this.connector = connector;
	
	        this.point = point.clone();
	
	        this.type = type;
	
	        this.color = ConnectionPoint.NORMAL_COLOR;
	
	        this.oType = 'ConnectionPoint';
	
	        this.shape = new graphic.Circle({
	            shape: {
	                cx: this.point.x,
	                cy: this.point.y,
	                r: ConnectionPoint.RADIUS
	            },
	
	            style: {
	                fill: this.color,
	                stroke:'#000000'
	            },
	            z : options.z + 2  //节点Z为1 线段为0;
	        });
	        this.shape.type =  this.type;
	
	        this.shape.connector = connector;
	        //return this.circle;
	    }
	
	    ConnectionPoint.NORMAL_COLOR = "#FFFF33"; //yellow.
	
	    ConnectionPoint.OVER_COLOR = "#FF9900"; //orange
	
	    ConnectionPoint.CONNECTED_COLOR = "#ff0000"; //red
	
	    ConnectionPoint.RADIUS = 4;
	
	    ConnectionPoint.TYPE_FIGURE = 'figure';
	
	    ConnectionPoint.TYPE_CONNECTOR = 'connector';
	
	    ConnectionPoint.prototype = {
	
	        constructor : ConnectionPoint,
	
	        equals : function(anotherConnectionPoint){
	            return this.point.equals(anotherConnectionPoint.point)
	            && this.connector == anotherConnectionPoint.connector
	            && this.type == anotherConnectionPoint.type
	            && this.color == anotherConnectionPoint.color
	            && this.radius == anotherConnectionPoint.radius;
	        }
	
	
	    };
	    module.exports = ConnectionPoint;
	
	
	


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * flow连线管理类
	 * @author miao.cunzhi
	 */
	
	    var zrUtil = __webpack_require__(4);
	    var ConnectionManager = __webpack_require__(82);
	    var Connector = __webpack_require__(76);
	    var Util = __webpack_require__(59);
	    var graphic = __webpack_require__(3);
	    var Point = __webpack_require__(60);
	    var Constants = __webpack_require__(84);
	    var Model = __webpack_require__(85);
	    var Log = __webpack_require__(83);
	
	    function LinkConnectionManager() {
	        ConnectionManager.call(this);
	        this.LineOperations = []; //存放线的操作按钮
	        this.bundleOffset = 30; //多线段的偏移
	        this.bundleGap = 20; // 多线段的间隔
	        this.connectorMap = Util.StackedMap.createNew(); //存放多线段
	    }
	
	    /**
	     * 根据起始点创建连线
	     * @param  {[type]} options      [类型]
	     * @param {[type]} [api] [description]
	     * @return {[type]}           [返回连线]
	     */
	    LinkConnectionManager.prototype.connectorCreateOfPoints = function(options, api) {
	        var that = this;
	        var model = options.model;
	        //1.创建线段
	        var connector = new Connector(options);
	        if (options.startDemoId && options.endDemoId) {
	            connector.startDemoId = options.startDemoId;
	            connector.endDemoId = options.endDemoId;
	        }
	        if (options.pos) {
	            var pos = options.pos.split(",");
	            connector.sPos = pos[0];
	            connector.ePos = pos[1];
	        };
	        this.connectors.push(connector);
	
	        if (connector.conPointsGroup) {
	            connector.conPointsGroup.on("click", function(e) {
	                var arrSplit = e.target.type.split(Connector.SEPERATOR);
	                var connector = e.target.connector;
	                if (arrSplit[0] === Connector.START_NODE) {
	                    connector.sPos = arrSplit[1];
	                } else if (arrSplit[0] === Connector.END_NODE) {
	                    connector.ePos = arrSplit[1];
	                };
	                that.refreshConnector(connector, true);
	                e.cancelBubble = true;
	                var params = {};
	                params.event = e;
	                params.type = "conPointsGroup:click";
	                params.lineNode = that.selConnector;
	                api.trigger(params.type, params);
	            });
	        }
	
	
	        var MOUSE_EVENT_NAMES = ['click', 'dblclick'];
	        zrUtil.each(MOUSE_EVENT_NAMES, function(eveName) {
	            connector.on("Connector:" + eveName, function(e) {
	
	                var selected = e.target;
	
	                if (that.selConnector !== selected) {
	                    that.selConnector && that.refreshConnector(that.selConnector);
	                    that.selConnector = selected;
	                };
	                e.cancelBubble = true;
	                var params = {};
	                params.event = e;
	                params.type = eveName;
	                params.target = that.selConnector;
	                api.trigger(params.type, params);
	            });
	        });
	
	        this.bundleOffset = options.bundleOffset || this.bundleOffset;
	        this.bundleGap = options.bundleGap || this.bundleGap;
	        var dockers = options.dockers;
	        if (dockers && dockers.length >= 2) {
	            var points = Point.loadArray(dockers);
	            connector.refresh(points);
	        } else {
	            if (options.position && options.position.points) {
	                var points = options.position.points;
	                connector.refresh(points);
	            }
	        }
	
	        //3.设置模型
	        var model = new Model({});
	        model.set(Constants.ELEMENT_TYPE, Constants.CONNECTION);
	        model.set(Constants.OPTIONS, zrUtil.clone(options));
	        model.set(Constants.DOCKERS, connector.turningPoints);
	        model.set(Constants.STYLE_LINETYPE, options.style.lineType);
	        connector.model = model;
	        return connector;
	    }
	    LinkConnectionManager.prototype.getTwoNodeId = function(startNode, endNode) {
	            return startNode.id + "," + endNode.id;
	        }
	        //处理多条线段
	    LinkConnectionManager.prototype.refreshCons = function(arrCons) {
	        //如果是折线的话
	        if (arrCons[0].options.style.lineType == Connector.TYPE_JAGGED) {
	            for (var i = 0; i < arrCons.length; i++) {
	                this.refreshConnector(arrCons[i], true);
	            };
	        } else {
	            this.refreshConsStraight(arrCons);
	        };
	    }
	
	    //处理多条线段(直线)
	    LinkConnectionManager.prototype.refreshConsStraight = function(arrCons) {
	        var half = parseInt(arrCons.length / 2);
	        var arrConnectResult = []
	
	        var startNode = arrCons[0].startNode;
	        var endNode = arrCons[0].endNode;
	        var sRect = Util.getRect(startNode).boundingRect;
	        var eRect = Util.getRect(endNode).boundingRect;
	        var sConnectorPoint = Util.getConnectorPoints(sRect);
	        var eConnectorPoint = Util.getConnectorPoints(eRect);
	        //判断如果没有指定位置的话, 判断开始节点在结束结果左边则采用 right-left 否则采用left-right
	
	        if (!arrCons[0].sPos || !arrCons[0].ePos) {
	            if (sRect.x < eRect.x) {
	                arrCons[0].sPos = "right";
	                arrCons[0].ePos = "left";
	            } else {
	                arrCons[0].sPos = "left";
	                arrCons[0].ePos = "right";
	            }
	        }
	        var startPoint = sConnectorPoint[arrCons[0].sPos];
	        var endPoint = eConnectorPoint[arrCons[0].ePos];
	        var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
	        for (var i = half; i >= 1; i--) {
	            var points = [];
	            points.push(startPoint); //
	            // points.push(new Point(startPoint.x + bundleOffset , startPoint.y + i * bundleGap));
	            // points.push(new Point(endPoint.x - bundleOffset , startPoint.y + i * bundleGap)); //startPoint.x + bundleOffset
	            var secondPoint = startPoint.clone();
	
	            //secondPoint.x =  secondPoint.x + this.bundleOffset;
	            secondPoint.transform(Util.translationMatrix(0, this.bundleGap * i));
	            //secondPoint = this.boundOffsetXY(secondPoint, true);
	            //
	            //直角坐标 x, 和 y, 计算出极坐标
	
	
	            //从极坐标计算出直角坐标
	            secondPoint.x = secondPoint.x + this.bundleOffset * Math.cos(angle);
	            secondPoint.y = secondPoint.y + this.bundleOffset * Math.sin(angle);
	
	
	
	            //secondPoint.transform(Util.scaleMatrix(0.5));
	            points.push(secondPoint);
	
	            var thirdPoint = endPoint.clone();
	            //thirdPoint.x =  thirdPoint.x - this.bundleOffset;
	
	
	
	            thirdPoint.transform(Util.translationMatrix(0, this.bundleGap * i));
	            //thirdPoint = this.boundOffsetXY(thirdPoint, false);
	            //secondPoint.transform(Util.scaleMatrix(0.5));
	            //
	            //直角坐标 x, 和 y, 计算出极坐标
	
	            //从极坐标计算出直角坐标
	            thirdPoint.x = thirdPoint.x - this.bundleOffset * Math.cos(angle);
	            thirdPoint.y = thirdPoint.y - this.bundleOffset * Math.sin(angle);
	
	            points.push(thirdPoint);
	
	            points.push(endPoint);
	            arrConnectResult.push(points);
	        };
	
	        arrConnectResult.push([startPoint, endPoint]);
	
	        var upHalf = Math.ceil(arrCons.length / 2);
	        for (var i = 1; i < upHalf; i++) {
	            var points = [];
	            points.push(startPoint);
	            var secondPoint = startPoint.clone();
	            //secondPoint.x =  secondPoint.x + this.bundleOffset;
	            secondPoint.transform(Util.translationMatrix(0, -this.bundleGap * i));
	            secondPoint.x = secondPoint.x + this.bundleOffset * Math.cos(angle);
	            secondPoint.y = secondPoint.y + this.bundleOffset * Math.sin(angle);
	            points.push(secondPoint);
	
	            var thirdPoint = endPoint.clone();
	            //thirdPoint.x =  thirdPoint.x - this.bundleOffset;
	            thirdPoint.transform(Util.translationMatrix(0, -this.bundleGap * i));
	            //从极坐标计算出直角坐标
	            thirdPoint.x = thirdPoint.x - this.bundleOffset * Math.cos(angle);
	            thirdPoint.y = thirdPoint.y - this.bundleOffset * Math.sin(angle);
	            //secondPoint.transform(Util.scaleMatrix(0.5));
	            points.push(thirdPoint);
	
	            points.push(endPoint);
	            arrConnectResult.push(points);
	        };
	
	
	        for (var i = 0; i < arrConnectResult.length; i++) {
	            arrCons[i].refresh(arrConnectResult[i]);
	        };
	
	    }
	    LinkConnectionManager.prototype.boundOffsetXY = function(point, isPositive) {
	        var resultPoint = point.clone();
	        //直角坐标 x, 和 y, 计算出极坐标
	        var angle = Math.atan2(resultPoint.y, resultPoint.x);
	        var r = Math.sqrt(Math.pow(resultPoint.x, 2) + Math.pow(resultPoint.y, 2));
	        if (isPositive) {
	            r = r + this.bundleOffset;
	        } else {
	            r = r - this.bundleOffset;
	        }
	
	
	        //从极坐标计算出直角坐标
	        resultPoint.x = r * Math.cos(angle);
	        resultPoint.y = r * Math.sin(angle);
	        return resultPoint;
	    }
	
	    /**
	     * 设置线段的模型数据  (类型 文字)
	     * @param {[type]} connector [description]
	     * @param {[type]} option    [description]
	     */
	    LinkConnectionManager.prototype.setModel = function(connector, option) {
	        var originLineType = connector.model.get("style.lineType");
	        connector.model.mergeOption(option);
	        if (originLineType !== option.style.lineType) {
	            this.refreshConnector(connector, true);
	        };
	    }
	
	
	    /**
	     * 刷新连接线
	     * @param  {[type]} node [description]
	     * @return {[type]}      [description]
	     */
	    LinkConnectionManager.prototype.refreshLineByNode = function(node) {
	        // 判断这个节点是否有多条线段
	        var keys = this.connectorMap.keys();
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            if (key.indexOf(node.id) != -1) {
	                var arrCons = this.connectorMap.get(key);
	                if (arrCons.length == 1) {
	                    //两个节点只有一个连线的情况
	                    this.refreshConnector(arrCons[0], true);
	                } else if (arrCons.length > 1) {
	                    //两个节点有多个连线的情况
	                    this.refreshCons(arrCons);
	                };
	            };
	        };
	    }
	
	    zrUtil.inherits(LinkConnectionManager, ConnectionManager);
	    module.exports = LinkConnectionManager;
	


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 连线管理类
	 * @author wang.xiaohu
	 */
	
	    var Node = __webpack_require__(75);
	    var Util = __webpack_require__(59);
	    var graphic = __webpack_require__(3);
	    var Point = __webpack_require__(60);
	    var Connector = __webpack_require__(76);
	    var Log = __webpack_require__(83);
	    var zrUtil = __webpack_require__(4);
	
	    function ConnectionManager() {
	        this.connectors = []; //当前画布所有的线段
	        this.selConnector = null; //当前选中的线段
	        this.tempConnector = null; //临时线段
	    }
	
	    /**
	     * 设置线的不可编辑
	     * @param  {[type]} forbidEdit [description]
	     * @return {[type]}            [description]
	     */
	    ConnectionManager.prototype.connectorForbidEdit = function(forbidEdit) {
	        for (var i = 0; i < this.connectors.length; i++) {
	            this.connectors[i].options.isEdit = !forbidEdit;
	        }
	    }
	
	
	    /**
	     * 清空连接线
	     * @return {[type]} [description]
	     */
	    ConnectionManager.prototype.clearSelectCon = function() {
	            if (this.selConnector != null) {
	                this.refreshConnector(this.selConnector);
	            }
	        }
	        /**
	         * 删除连接线
	         * @return {[type]} [description]
	         */
	    ConnectionManager.prototype.deleteSelectCon = function(node, _zr) {
	            var deleteLine = [];
	            for (var i = 0; i < this.connectors.length; i++) {
	                if (this.connectors[i].startNode == node || this.connectors[i].endNode == node) {
	                    //1.将线 所联的startNode的outgoing数据删除
	                    var startNodeOutgoing = this.connectors[i].startNode.model.get("outgoing");
	                    index = zrUtil.indexOf(startNodeOutgoing, this.connectors[i].resourceId);
	                    if (index != -1) {
	                        startNodeOutgoing.splice(index, 1);
	                    }
	                    //2.从_zr上删除
	                    _zr.remove(this.connectors[i]);
	                    this.connectors.splice(i, 1);
	                    i--;
	                    this.selConnector = null;
	                }
	            }
	        }
	        /**
	         * 删除选定的线
	         * @return {[type]} [description]
	         */
	    ConnectionManager.prototype.deleteLine = function(_zr) {
	        //1.将线 所联的startNode的outgoing数据删除
	        var startNodeOutgoing = this.selConnector.startNode.model.get("outgoing");
	        index = zrUtil.indexOf(startNodeOutgoing, this.selConnector.resourceId);
	        if (index != -1) {
	            startNodeOutgoing.splice(index, 1);
	        }
	
	        if (this.connectorMap) {
	            var key = this.getTwoNodeId(this.selConnector.startNode, this.selConnector.endNode);
	            this.connectorMap.removeItem(key, this.selConnector);
	        }
	
	        //2.从_zr上删除
	        _zr.remove(this.selConnector);
	
	
	        //3.从线数据中删除
	        var index = zrUtil.indexOf(this.connectors, this.selConnector);
	        if (index != -1) {
	            this.connectors.splice(index, 1);
	        }
	        this.selConnector = null;
	    }
	
	    /**
	     * 重新画线
	     * @param  {[type]} connector          [description]
	     * @param  {[type]} force
	     * @return {[type]}                    [description]
	     */
	    ConnectionManager.prototype.refreshConnector = function(connector, force) {
	        // 只有需要强制刷新  或者 连线为空（<2)时 才进行重新计算重绘
	        if (force || (!connector.turningPoints) || (connector.turningPoints.length < 2)) {
	            if (connector.model && connector.model.get("style.lineType")) { connector.options.style.lineType = connector.model.get("style.lineType"); }
	            var arrStartEndPoint = this.getStartEndPoint(connector);
	            var escapeDistance = null;
	            if (connector.options.position && connector.options.position.escapeDistance) {
	                escapeDistance = connector.options.position.escapeDistance;
	            }
	            var solutions = this.connector2Points(connector.options.style.lineType, arrStartEndPoint[0], arrStartEndPoint[1],
	                arrStartEndPoint[2], arrStartEndPoint[3], escapeDistance); // TYPE_STRAIGHT TYPE_JAGGED
	
	            connector.refresh(solutions[0][2]);
	        }
	
	        connector.clearHandles(); //清空handle
	    }
	
	
	    ConnectionManager.prototype.getStartEndPoint = function(connector) {
	        var startNode = connector.startNode;
	        var endNode = connector.endNode;
	
	        var sRect = startNode.getRect ? startNode.getRect().boundingRect : Util.getRect(startNode).boundingRect;
	        var sBounds = [Number(sRect.x), Number(sRect.y), Number(sRect.x) + Number(sRect.width), Number(sRect.y) + Number(sRect.height)];
	
	        var eRect = endNode.getRect ? endNode.getRect().boundingRect : Util.getRect(endNode).boundingRect;
	        var eBounds = [Number(eRect.x), Number(eRect.y), Number(eRect.x) + Number(eRect.width), Number(eRect.y) + Number(eRect.height)];
	
	
	        var sConnectorPoint = Util.getConnectorPoints(sRect);
	        var eConnectorPoint = Util.getConnectorPoints(eRect);
	
	        //判断如果没有指定位置的话, 判断开始节点在结束结果左边则采用 right-left 否则采用left-right
	        if (!connector.sPos || !connector.ePos) {
	            if (sRect.x < eRect.x) {
	                connector.sPos = "right";
	                connector.ePos = "left";
	            } else {
	                connector.sPos = "left";
	                connector.ePos = "right";
	            }
	        }
	        var startPoint = this.calcPointExpression(connector.sPos, sConnectorPoint);
	        var endPoint = this.calcPointExpression(connector.ePos, eConnectorPoint);
	        return [startPoint, endPoint, sBounds, eBounds];
	    }
	
	    ConnectionManager.prototype.calcPointExpression = function(pos, point) {
	        var variable = {
	            top: point.top.x,
	            left: point.left.y,
	            right: point.right.y,
	            bottom: point.bottom.x,
	            center: point.center.x
	        };
	
	        var expression = "<% print(" + pos + ") %>";
	        var val = parseInt(Util.template(expression)(variable));
	        if (pos.indexOf("top") != -1) {
	            return new Point(val, point.top.y);
	        } else if (pos.indexOf("left") != -1) {
	            return new Point(point.left.x, val);
	        } else if (pos.indexOf("right") != -1) {
	            return new Point(point.right.x, val);
	        } else if (pos.indexOf("bottom") != -1) {
	            return new Point(val, point.bottom.y);
	        } else if (pos.indexOf("center") != -1) {
	            return new Point(val, point.bottom.y);
	        } else {
	            throw new Error("pos参数错误");
	        }
	    }
	
	    /**
	     * 创建或修改临时线
	     * @param  {[type]} startNode             [description]
	     * @param  {[type]} rEndPoint             [description]
	     * @param  {[type]} lineType [description]
	     * @return {[type]}                       [description]
	     */
	    ConnectionManager.prototype.manageTempConnector = function(startNode, rEndPoint, lineType) {
	
	        var sRect = startNode.getRect ? startNode.getRect().boundingRect : Util.getRect(startNode).boundingRect;
	
	        var sBounds = [sRect.x, sRect.y, sRect.x + sRect.width, sRect.y + sRect.height];
	        var sConnectorPoint = Util.getConnectorPoints(sRect);
	
	        if (!this.tempConnector) {
	            this.tempConnector = new Connector({ isEdit: false, style: { lineType: lineType } });
	        }
	
	        var connector = this.tempConnector;
	        //判断如果没有指定位置的话, 判断开始节点在结束结果左边则采用 right-left 否则采用left-right
	        if (sRect.x < rEndPoint.x) {
	            connector.sPos = "right";
	            connector.ePos = "left";
	        } else {
	            connector.sPos = "left";
	            connector.ePos = "right";
	        }
	
	        connector.options.style.lineType = lineType;
	        var solutions = this.connector2Points(lineType, sConnectorPoint[connector.sPos], rEndPoint,
	            sBounds, null); // TYPE_STRAIGHT TYPE_JAGGED
	
	        connector.refresh(solutions[0][2]);
	        return connector;
	    }
	
	    /**
	     * 删除临时线
	     * @param  {[type]} zr             [description]
	     */
	    ConnectionManager.prototype.removeTempConnector = function(zr) {
	        if (this.tempConnector) {
	            zr.remove(this.tempConnector);
	            this.tempConnector = null;
	        }
	    }
	
	
	    /**
	     * 算出 两个节点 指定两个点如何联线
	     * @param  {[type]} type       [description]
	     * @param  {[type]} startPoint [description]
	     * @param  {[type]} endPoint   [description]
	     * @param  {[type]} sBounds    [description]
	     * @param  {[type]} eBounds    [description]
	     * @return {[type]}            [description]
	     */
	    ConnectionManager.prototype.connector2Points = function(type, startPoint, endPoint, sBounds, eBounds, escapeDistance) {
	        var figureEscapeDistance = [30, 30];
	        if (escapeDistance) {
	            if (!zrUtil.isArray(escapeDistance)) {
	                figureEscapeDistance = [escapeDistance, escapeDistance];
	            } else {
	                figureEscapeDistance = escapeDistance;
	            }
	        }
	
	        Log.group("connectionManager: connector2Points");
	
	
	        Log.info("ConnectionManager: connector2Points (" + type + ", " + startPoint + ", " + endPoint + ", " + sBounds + ", " + eBounds + ')');
	        var solutions = [];
	
	
	
	        switch (type) {
	            case Connector.TYPE_STRAIGHT: //直线
	                var points = [startPoint.clone(), endPoint.clone()];
	                solutions.push(['straight', 'straight', points]);
	                break;
	
	            case Connector.TYPE_CURVE: //曲线
	
	            case Connector.TYPE_JAGGED: //折线
	                var startExitPoint = null;
	                var endExitPoint = null;
	
	                //find start exit point  寻找开始出口
	                if (sBounds != null) {
	                    var potentialExits = [];
	
	                    potentialExits.push(new Point(startPoint.x, sBounds[1] - figureEscapeDistance[0])); //north 北
	                    potentialExits.push(new Point(sBounds[2] + figureEscapeDistance[0], startPoint.y)); //east  东
	                    potentialExits.push(new Point(startPoint.x, sBounds[3] + figureEscapeDistance[0])); //south  南
	                    potentialExits.push(new Point(sBounds[0] - figureEscapeDistance[0], startPoint.y)); //west  西
	
	                    //pick closest exit point  寻找与 startPoint 最靠近的出口点
	                    startExitPoint = potentialExits[0];
	                    for (var i = 1; i < potentialExits.length; i++) {
	                        if (Util.distance(startPoint, potentialExits[i]) < Util.distance(startPoint, startExitPoint)) {
	                            startExitPoint = potentialExits[i];
	                        }
	                    }
	                }
	
	
	                //find end exit point  寻找结束出口
	                if (eBounds != null) {
	                    var potentialExits = [];
	
	                    potentialExits.push(new Point(endPoint.x, eBounds[1] - figureEscapeDistance[1])); //north
	                    potentialExits.push(new Point(eBounds[2] + figureEscapeDistance[1], endPoint.y)); //east
	                    potentialExits.push(new Point(endPoint.x, eBounds[3] + figureEscapeDistance[1])); //south
	                    potentialExits.push(new Point(eBounds[0] - figureEscapeDistance[1], endPoint.y)); //west
	
	                    //pick closest exit point  寻找与 endPoint 最靠近的出口点
	                    endExitPoint = potentialExits[0];
	                    for (var i = 1; i < potentialExits.length; i++) {
	                        if (Util.distance(endPoint, potentialExits[i]) < Util.distance(endPoint, endExitPoint)) {
	                            endExitPoint = potentialExits[i];
	                        }
	                    }
	                }
	
	                //Basic solution 最基本的解决方案   为其他解决方案做准备
	                var s = [startPoint];
	                var gapIndex = 0; //the index of the gap (where do we need to insert new points) DO NOT CHANGE IT
	                if (startExitPoint) {
	                    s.push(startExitPoint);
	                    gapIndex = 1;
	                }
	                if (endExitPoint) {
	                    s.push(endExitPoint);
	                }
	                s.push(endPoint);
	
	
	
	                //SO - no additional points     S0 解决方案 不添加任何点  基本不会被采用
	                var s0 = Point.cloneArray(s);
	                solutions.push(['s0', 's0', s0]);
	
	
	
	                //S1   S1 解决方案  只有一个折点
	                var s1 = Point.cloneArray(s);
	
	                //first variant   第一个变体 s1 s1_1方案  折线点在 startExitPoint的X 与 endExitPoint的 Y位置
	                var s1_1 = Point.cloneArray(s1);
	                s1_1.splice(gapIndex + 1, 0, new Point(s1_1[gapIndex].x, s1_1[gapIndex + 1].y));
	                solutions.push(['s1', 's1_1', s1_1]);
	
	                //second variant  第二变体 s1 s1-2方案  折线点在 endExitPoint的X 与  startExitPoint的Y位置
	                var s1_2 = Point.cloneArray(s1);
	                s1_2.splice(gapIndex + 1, 0, new Point(s1_2[gapIndex + 1].x, s1_2[gapIndex].y));
	                solutions.push(['s1', 's1_2', s1_2]);
	
	
	                //S2  S2 解决方案  添加两个折点
	
	                //Variant I   s2_1方案
	                var s2_1 = Point.cloneArray(s);
	                var s2_1_1 = new Point((s2_1[gapIndex].x + s2_1[gapIndex + 1].x) / 2, s2_1[gapIndex].y);
	                var s2_1_2 = new Point((s2_1[gapIndex].x + s2_1[gapIndex + 1].x) / 2, s2_1[gapIndex + 1].y);
	                s2_1.splice(gapIndex + 1, 0, s2_1_1, s2_1_2);
	                solutions.push(['s2', 's2_1', s2_1]);
	
	
	                //Variant II  s2_1方案  1折线点 x: startExitPoint的X 位置 y: startExitPoint的y+endExitPoint的y/2
	                //1折线点 x:endExitPoint的x  y:startExitPoint的y+endExitPoint的y/2
	                var s2_2 = Point.cloneArray(s);
	                var s2_2_1 = new Point(s2_2[gapIndex].x, (s2_2[gapIndex].y + s2_2[gapIndex + 1].y) / 2);
	                var s2_2_2 = new Point(s2_2[gapIndex + 1].x, (s2_2[gapIndex].y + s2_2[gapIndex + 1].y) / 2);
	                s2_2.splice(gapIndex + 1, 0, s2_2_1, s2_2_2);
	                solutions.push(['s2', 's2_2', s2_2]);
	
	
	                //Variant III
	                var s2_3 = Point.cloneArray(s);
	                //find the amount (stored in delta) of pixels we need to move right so no intersection with a figure will be present
	                //!See:  /documents/specs/connected_figures_deltas.jpg file
	
	                var eastExits = [s2_3[gapIndex].x + 20, s2_3[gapIndex + 1].x + 20]; //add points X coordinates to be able to generate Variant III even in the absence of figures :p
	
	                if (sBounds) {
	                    eastExits.push(sBounds[2] + 20);
	                }
	
	                if (eBounds) {
	                    eastExits.push(eBounds[2] + 20);
	                }
	
	                var eastExit = Util.max(eastExits);
	                var s2_3_1 = new Point(eastExit, s2_3[gapIndex].y);
	                var s2_3_2 = new Point(eastExit, s2_3[gapIndex + 1].y);
	                s2_3.splice(gapIndex + 1, 0, s2_3_1, s2_3_2);
	                solutions.push(['s2', 's2_3', s2_3]);
	
	
	                //Variant IV  s2_4方案
	                var s2_4 = Point.cloneArray(s);
	                //find the amount (stored in delta) of pixels we need to move up so no intersection with a figure will be present
	                //!See:  /documents/specs/connected_figures_deltas.jpg file
	
	                var northExits = [s2_4[gapIndex].y - 20, s2_4[gapIndex + 1].y - 20]; //add points y coordinates to be able to generate Variant III even in the absence of figures :p
	
	                if (sBounds) {
	                    northExits.push(sBounds[1] - 20);
	                }
	
	                if (eBounds) {
	                    northExits.push(eBounds[1] - 20);
	                }
	
	                var northExit = Util.min(northExits);
	                var s2_4_1 = new Point(s2_4[gapIndex].x, northExit);
	                var s2_4_2 = new Point(s2_4[gapIndex + 1].x, northExit);
	                s2_4.splice(gapIndex + 1, 0, s2_4_1, s2_4_2);
	                solutions.push(['s2', 's2_4', s2_4]);
	
	
	                //Variant V
	                var s2_5 = Point.cloneArray(s);
	                //find the amount (stored in delta) of pixels we need to move left so no intersection with a figure will be present
	                //!See:  /documents/specs/connected_figures_deltas.jpg file
	
	                var westExits = [s2_5[gapIndex].x - 20, s2_5[gapIndex + 1].x - 20]; //add points x coordinates to be able to generate Variant III even in the absence of figures :p
	
	                if (sBounds) {
	                    westExits.push(sBounds[0] - 20);
	                }
	
	                if (eBounds) {
	                    westExits.push(eBounds[0] - 20);
	                }
	
	                var westExit = Util.min(westExits);
	                var s2_5_1 = new Point(westExit, s2_5[gapIndex].y);
	                var s2_5_2 = new Point(westExit, s2_5[gapIndex + 1].y);
	                s2_5.splice(gapIndex + 1, 0, s2_5_1, s2_5_2);
	                solutions.push(['s2', 's2_5', s2_5]);
	
	
	                //Variant VI
	                var s2_6 = Point.cloneArray(s);
	                //find the amount (stored in delta) of pixels we need to move down so no intersection with a figure will be present
	                //!See:  /documents/specs/connected_figures_deltas.jpg file
	
	                var southExits = [s2_6[gapIndex].y + 20, s2_6[gapIndex + 1].y + 20]; //add points y coordinates to be able to generate Variant III even in the absence of figures :p
	
	                if (sBounds) {
	                    southExits.push(sBounds[3] + 20);
	                }
	
	                if (eBounds) {
	                    southExits.push(eBounds[3] + 20);
	                }
	
	                var southExit = Util.max(southExits);
	                var s2_6_1 = new Point(s2_6[gapIndex].x, southExit);
	                var s2_6_2 = new Point(s2_6[gapIndex + 1].x, southExit);
	                s2_6.splice(gapIndex + 1, 0, s2_6_1, s2_6_2);
	                solutions.push(['s2', 's2_6', s2_6]);
	
	
	
	                //FILTER solutions
	
	                /*Algorithm
	                 * 0. solutions are ordered from minimmun nr of points to maximum >:)
	                 * 1. remove all solutions that are not orthogonal (mainly s0 solution)
	                 * 2. remove all solutions that go backward (we will not need them ever)
	                 * 3. remove all solutions with intersections
	                 * 4. pick first class of solutions with same nr of points (ex: 2)
	                 * 5. pick the first solution with 90 degree angles (less turnarounds)
	                 * (not interesteted) sort by length :p
	                 */
	
	                //1. filter non ortogonal solutions 删除不是正交直线的方案
	                if (true) {
	                    Log.info("Filter orthogonal solutions. Initial number of solutions = " + solutions.length);
	                    var orthogonalSolution = [];
	                    for (var l = 0; l < solutions.length; l++) {
	                        var solution = solutions[l][2];
	                        if (Util.orthogonalPath(solution)) {
	                            orthogonalSolution.push(solutions[l]);
	                        }
	                    }
	                    solutions = orthogonalSolution;
	                    Log.info("\n\tOrthogonalSolutions = " + solutions.length);
	                }
	
	                //2. filter backward solutions  过滤 倒退的方案
	                if (true) {
	                    //do not allow start and end points to coincide - ignore them
	                    if (startPoint.equals(endPoint)) {
	                        Log.info("Start and end point coincide...skip backward solution. I think we will just fall on s0 :)");
	                    } else {
	                        Log.info("Filter backward solutions. Initial number of solutions = " + solutions.length);
	                        var forwardSolutions = [];
	                        var temp = '';
	                        for (var l = 0; l < solutions.length; l++) {
	                            var solution = solutions[l][2];
	                            if (Util.forwardPath(solution)) {
	                                forwardSolutions.push(solutions[l]);
	                            } else {
	                                temp = temp + "\n\t" + solution;
	                            }
	                        }
	                        solutions = forwardSolutions;
	                        Log.info("\n\t ForwardSolutions = " + solutions.length);
	                        if (solutions.length == 0) {
	                            Log.info("Discarded solutions: " + temp);
	                        }
	                    }
	                }
	
	
	                //3. Filter non intersecting solutions  去除没有交集()的方案
	                if (true) {
	                    Log.info("Filter non intersecting solutions. Initial number of solutions = " + solutions.length);
	                    var nonIntersectionSolutions = []
	                    for (var l = 0; l < solutions.length; l++) {
	                        var solution = solutions[l][2];
	                        //Log.info("Solution id= " + solutions[l][1] + ' nr points = ' + solution.length + ", points = " + solution);
	                        var intersect = false;
	
	                        var innerLines = solution.slice(); //just a shallow copy
	
	                        /*If any bounds just trim the solution. So we avoid the strange case when a connection
	                         *startes from a point on a figure and ends inside of the same figure, but not on a connection point*/
	                        if (eBounds || sBounds) {
	                            //i0nnerLines = innerLines.slice(0, innerLines.length - 1);
	                            innerLines = innerLines.slice(1, innerLines.length - 1);
	                            //Log.info("\t eBounds present,innerLines nr. points = " + innerLines.length + ", points = " + innerLines);
	                        }
	
	
	
	                        //now test for intersection
	                        if (sBounds) {
	                            intersect = intersect || Util.polylineIntersectsRectangle(innerLines, sBounds);
	                        }
	                        if (eBounds) {
	                            intersect = intersect || Util.polylineIntersectsRectangle(innerLines, eBounds);
	                        }
	
	                        if (!intersect) {
	                            nonIntersectionSolutions.push(solutions[l]);
	                        }
	                    }
	
	                    //If all solutions intersect than this is destiny  :) and just ignore the intersection filter
	                    if (nonIntersectionSolutions.length != 0) {
	                        //reasign to solutions
	                        solutions = nonIntersectionSolutions;
	                    }
	
	                    Log.info("\n\t nonIntersectionSolutions = " + solutions.length);
	                }
	
	
	                //4. get first class of solutions with same nr of points 选择与第一个方案点数一样多的方案（因为第一个方案点数最少）
	                if (true) {
	                    Log.info("Get first class of solutions with same nr of points");
	                    if (solutions.length == 0) {
	                        Log.info("This is not possible");
	                    }
	
	                    var firstSolution = solutions[0][2]; //pick first solution
	                    var nrOfPoints = firstSolution.length;
	                    var sameNrPointsSolution = [];
	
	                    for (var l = 0; l < solutions.length; l++) {
	                        var solution = solutions[l][2];
	                        if (solution.length == nrOfPoints) {
	                            sameNrPointsSolution.push(solutions[l]);
	                        }
	                    }
	
	                    solutions = sameNrPointsSolution;
	                }
	
	
	
	
	                /*5.  计算路径分数 ，取最分数高的
	                 Pick the first solution with 90 degree angles (less turnarounds)
	                 *in case we have more than one solution in our class
	                 */
	                if (true) {
	                    Log.info("pick the first solution with 90 degree angles (less turnarounds)");
	                    var solIndex = 0;
	                    for (var l = 0; l < solutions.length; l++) {
	                        var solution = solutions[l][2];
	                        if (Util.scorePath(solutions[solIndex][2]) < Util.scorePath(solutions[l][2])) {
	                            solIndex = l;
	                        }
	                    }
	                    solutions = [solutions[solIndex]];
	                }
	
	
	                break;
	        }
	
	        //SMOOTHING curve
	        if (type === Connector.TYPE_CURVE) {
	            this.smoothCurve(solutions);
	        }
	        //END SMOOTHING curve
	
	        Log.groupEnd();
	
	        return solutions;
	    }
	
	    ConnectionManager.prototype.smoothCurve = function(solutions) {
	        var option = 3;
	
	        switch (option) {
	            case 0:
	                //do nothing
	                break;
	
	            case 1: //add intermediate points
	                //Add the middle point for start and end segment so that we "force" the
	                //curve to both come "perpendicular" on bounds and also make the curve
	                //"flee" more from bounds (on exit)
	                for (var s = 0; s < solutions.length; s++) {
	                    var solTurningPoints = solutions[s][2];
	
	                    //first segment
	                    var a1 = solTurningPoints[0];
	                    var a2 = solTurningPoints[1];
	                    var startMiddlePoint = Util.getMiddle(a1, a2);
	                    solTurningPoints.splice(1, 0, startMiddlePoint);
	
	                    //last segment
	                    var a3 = solTurningPoints[solTurningPoints.length - 2];
	                    var a4 = solTurningPoints[solTurningPoints.length - 1];
	                    var endMiddlePoint = Util.getMiddle(a3, a4);
	                    solTurningPoints.splice(solTurningPoints.length - 1, 0, endMiddlePoint);
	                }
	                break;
	
	            case 2: //remove points
	                for (var s = 0; s < solutions.length; s++) {
	                    var solType = solutions[s][0];
	                    if (solType == 's1' || solType == 's2') {
	                        var solTurningPoints = solutions[s][2];
	                        solTurningPoints.splice(1, 1);
	                        solTurningPoints.splice(solTurningPoints.length - 2, 1);
	                    }
	                }
	                break;
	
	            case 3:
	                /*remove colinear point for s1 as it seems that more colinear points do not look good
	                 * on organic solutions >:D*/
	                for (var s = 0; s < solutions.length; s++) {
	                    var solType = solutions[s][0];
	                    if (solType == 's1') {
	                        var solTurningPoints = solutions[s][2];
	                        var reducedSolution = Util.collinearReduction(solTurningPoints);
	                        solutions[s][2] = reducedSolution;
	                    }
	                }
	                break;
	        } //end switch
	
	    }
	
	    module.exports = ConnectionManager;
	


/***/ },
/* 83 */
/***/ function(module, exports) {

	/**
	 * 日志类
	 * @author wang.xiaohu
	 */
	
	
	    var Log  = {
	        LOG_LEVEL_NONE  : 0,
	
	        LOG_LEVEL_DEBUG : 1,
	
	        LOG_LEVEL_INFO : 2,
	
	        LOG_LEVEL_ERROR : 3,
	
	        level : this.LOG_LEVEL_ERROR,
	        
	        /**
	        * The less important of all messages
	        * @param {String} message - the message to be logged
	        **/
	        debug: function (message){
	            if(typeof console !== 'undefined'){
	                if(this.level <= this.LOG_LEVEL_DEBUG){
	                    
	                    //in FF is debug
	                    if(typeof console.debug == 'function'){
	                        console.debug(message);
	                    }
	                    else{//TODO: in IE is log
	    //                    console.info(message);
	                    }
	                }
	            }
	        },
	
	
	        /**
	        * The commonly used log message
	        * @param {String} message - the message to be logged
	        **/
	        info : function (message){
	            if(typeof console !== 'undefined'){
	                if(this.level <= this.LOG_LEVEL_INFO){
	                    console.info(message);
	                }
	            }
	        },
	
	        /**
	        * The worse kind of message. Usually a crash
	        * @param {String} message - the message to be logged
	        **/
	        error : function (message){
	            if(typeof console !== 'undefined'){
	                if(this.level <= this.LOG_LEVEL_ERROR){
	                    console.error(message);
	                }
	            }
	        },
	
	        /**
	         *Start grouping the log messages
	         *@param {String} title - the title of the group
	         *@see <a href="http://getfirebug.com/logging">http://getfirebug.com/logging</a>
	         **/
	        group : function(title){
	            if(this.level <= this.LOG_LEVEL_INFO){ //ignore group if level not debug or info
	                if(typeof console !== 'undefined'){           
	                    /**If we do not test for group() function you will get an error in Opera
	                     *as Opera has it's own console...which does not have a group() function*/
	                    if(typeof console.group === 'function'){
	                        console.group(title);
	                    }
	                }
	            }
	        },
	
	        /**Ends current message grouping*/
	        groupEnd : function(){
	            if(this.level <= this.LOG_LEVEL_INFO){ //ignore group if level not debug or info
	                if(typeof console !== 'undefined'){
	                    /**If we do not test for groupEnd() function you will get an error in Opera
	                     *as Opera has it's own console...which does not have a group() function*/
	                    if(typeof console.groupEnd === 'function'){
	                        console.groupEnd();
	                    }
	                }
	            }
	        }
	
	    };
	
	    //Log.level = Log.LOG_LEVEL_DEBUG; 
	    Log.level = Log.LOG_LEVEL_ERROR; 
	    //Log.level = Log.LOG_LEVEL_ERROR;
	    //Log.level = Log.LOG_LEVEL_NONE;
	    module.exports = Log;
	    


/***/ },
/* 84 */
/***/ function(module, exports) {

	/**
	 * 常量定义
	 */
	
		module.exports = 	{
			ELEMENT_TYPE: "elementType",
			MODE: "mode",
			BACKGROUND: "backgroud",
			OPTIONS: "options",
			USERDATA: "userData",
			ID: "id",
			START_ID: "startNodeId",
			END_ID: "endNodeId",
			ALARM: "Alarm",
			RELATIONID:"relationId",
			RELATION_IMAGE:"relationImage",
			GROUP: "Group",
			CONNECTION: "connection",
			CHILDS: "childs",
			TREE_ROOT: "treeRoot",
			DOCKERS:"options.dockers",
			STYLE_LINETYPE:"style.lineType",
			LINEOPERATIONICON:"LineOperationIcon",
		};
	


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 节点等的模型
	 * 里面存的数据用来处理序列化和反序列化
	 * @class fish.topo.model
	 */
	
	
	    var zrUtil = __webpack_require__(4);
	    var clazzUtil = __webpack_require__(86);
	
	    function Model(option, parentModel,  extraOpt) {
	        this.parentModel = parentModel;
	        this.option = option;
	
	        // Simple optimization
	        if (this.init) {
	            if (arguments.length <= 3) {
	                this.init(option, parentModel,  extraOpt);
	            }
	            else {
	                this.init.apply(this, arguments);
	            }
	        }
	    }
	
	    Model.prototype = {
	
	        constructor: Model,
	
	        /**
	         * Model 的初始化函数
	         * @private
	         * @param {Object} option
	         */
	        init: function (option) {
	            zrUtil.merge(option, this.getDefaultOption());
	        },
	
	        getDefaultOption: function () {
	            if (!this.hasOwnProperty('__defaultOption')) {
	                var optList = [];
	                var Class = this.constructor;
	                while (Class) {
	                    var opt = Class.prototype.defaultOption;
	                    opt && optList.push(opt);
	                    Class = Class.superClass;
	                }
	
	                var defaultOption = {};
	                for (var i = optList.length - 1; i >= 0; i--) {
	                    defaultOption = zrUtil.merge(defaultOption, optList[i], true);
	                }
	                this.__defaultOption = defaultOption;
	            }
	            return this.__defaultOption;
	        },
	
	        /**
	         * @private
	         */
	        mergeOption: function (option) {
	            zrUtil.merge(this.option, option, true);
	        },
	
	        /**
	         * 获取model的某个属性的值
	         * @param {string} path model中的属性
	         * @return {String}
	         *
	         * **使用范例**：
	         *
	         *      @example
	         *          node.model.get("options.text");
	         */
	        get: function (path, ignoreParent) {
	            if (!path) {
	                return this.option;
	            }
	
	            if (typeof path === 'string') {
	                path = path.split('.');
	            }
	
	            var obj = this.option;
	            var parentModel = this.parentModel;
	            for (var i = 0; i < path.length; i++) {
	                // obj could be number/string/... (like 0)
	                obj = (obj && typeof obj === 'object') ? obj[path[i]] : null;
	                if (obj == null) {
	                    break;
	                }
	            }
	            if (obj == null && parentModel && !ignoreParent) {
	                obj = parentModel.get(path);
	            }
	            return obj;
	        },
	
	        /**
	         * 设置model的某个属性的值
	         * @param {string} path model中的属性
	         * @param {String} value 所需要设置的值
	         * @return {String}
	         *
	         * **使用范例**：
	         *
	         *      @example
	         *          node.model.set("options.text","例子");
	         */
	        set: function (path, value) {
	            var obj = this.option;
	
	            if (path.indexOf(".") == -1) {
	                obj[path] = value;
	            } else {
	                var fieldArray  = path.split('.');
	                var n = fieldArray.length;
	                var currentRef = obj;
	                var fieldName;
	
	                for (var i = 0; i < n - 1; i++) {
	                    fieldName = fieldArray[i];
	                    if(currentRef[fieldName] == null) {
	                        currentRef[fieldName] = {};
	                    }
	                    currentRef = currentRef[fieldName];
	                }
	                fieldName = fieldArray[n-1];
	                currentRef[fieldName] = value;
	            }
	        },
	
	        /**
	         * @private
	         */
	        getShallow: function (key, ignoreParent) {
	            var option = this.option;
	            var val = option && option[key];
	            var parentModel = this.parentModel;
	            if (val == null && parentModel && !ignoreParent) {
	                val = parentModel.getShallow(key);
	            }
	            return val;
	        },
	
	        /**
	         * @private
	         */
	        getModel: function (path, parentModel) {
	            var obj = this.get(path, true);
	            var thisParentModel = this.parentModel;
	            var model = new Model(
	                obj, parentModel || (thisParentModel && thisParentModel.getModel(path))
	            );
	            return model;
	        },
	
	        /**
	         *清空model的option
	         * @private
	         */
	        isEmpty: function () {
	            return this.option == null;
	        },
	
	        restoreData: function () {},
	
	        /**
	         * @private
	         */
	        clone: function () {
	            var Ctor = this.constructor;
	            return new Ctor(zrUtil.clone(this.option));
	        }
	    };
	
	    // Enable Model.extend.
	    clazzUtil.enableClassExtend(Model);
	
	    module.exports = Model;
	


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	
	
	    var zrUtil = __webpack_require__(4);
	
	    var clazz = {};
	
	    var TYPE_DELIMITER = '.';
	    var IS_CONTAINER = '___FT__COMPONENT__CONTAINER___';
	    /**
	     * @public
	     */
	    var parseClassType = clazz.parseClassType = function (componentType) {
	        var ret = {main: '', sub: ''};
	        if (componentType) {
	            componentType = componentType.split(TYPE_DELIMITER);
	            ret.main = componentType[0] || '';
	            ret.sub = componentType[1] || '';
	        }
	        return ret;
	    };
	    /**
	     * @public  相比 直接用zrUtil.inherits 好处是  可以直接调用父类的构造函数
	     */
	    clazz.enableClassExtend = function (RootClass, preConstruct) {
	        RootClass.extend = function (proto) {
	            var ExtendedClass = function () {
	                preConstruct && preConstruct.apply(this, arguments);
	                RootClass.apply(this, arguments);
	            };
	
	            zrUtil.extend(ExtendedClass.prototype, proto);
	
	            ExtendedClass.extend = this.extend;
	            ExtendedClass.superCall = superCall;
	            ExtendedClass.superApply = superApply;
	            zrUtil.inherits(ExtendedClass, this);
	            ExtendedClass.superClass = this;
	
	            return ExtendedClass;
	        };
	    };
	
	    // superCall should have class info, which can not be fetch from 'this'.
	    // Consider this case:
	    // class A has method f,
	    // class B inherits class A, overrides method f, f call superApply('f'),
	    // class C inherits class B, do not overrides method f,
	    // then when method of class C is called, dead loop occured.
	    function superCall(context, methodName) {
	        var args = zrUtil.slice(arguments, 2);
	        return this.superClass.prototype[methodName].apply(context, args);
	    }
	
	    function superApply(context, methodName, args) {
	        return this.superClass.prototype[methodName].apply(context, args);
	    }
	
	    /**
	     * @param {Object} entity
	     * @param {Object} options
	     * @param {boolean} [options.registerWhenExtend]
	     * @public
	     */
	    clazz.enableClassManagement = function (entity, options) {
	        options = options || {};
	
	        /**
	         * Component model classes
	         * key: componentType,
	         * value:
	         *     componentClass, when componentType is 'xxx'
	         *     or Object.<subKey, componentClass>, when componentType is 'xxx.yy'
	         * @type {Object}
	         */
	        var storage = {};
	
	        entity.registerClass = function (Clazz, componentType) {
	            if (componentType) {
	                componentType = parseClassType(componentType);
	
	                if (!componentType.sub) {
	                    if (storage[componentType.main]) {
	                        //已经注册过了，直接返回
	                        return;
	                    }
	                    storage[componentType.main] = Clazz;
	                }
	                else if (componentType.sub !== IS_CONTAINER) {
	                    var container = makeContainer(componentType);
	                    container[componentType.sub] = Clazz;
	                }
	            }
	            return Clazz;
	        };
	
	        entity.getClass = function (componentTypeMain, subType, throwWhenNotFound) {
	            var Clazz = storage[componentTypeMain];
	
	            if (Clazz && Clazz[IS_CONTAINER]) {
	                Clazz = subType ? Clazz[subType] : null;
	            }
	
	            if (throwWhenNotFound && !Clazz) {
	                throw new Error(
	                    'Component ' + componentTypeMain + '.' + (subType || '') + ' not exists. Load it first.'
	                );
	            }
	
	            return Clazz;
	        };
	
	        entity.getClassesByMainType = function (componentType) {
	            componentType = parseClassType(componentType);
	
	            var result = [];
	            var obj = storage[componentType.main];
	
	            if (obj && obj[IS_CONTAINER]) {
	                zrUtil.each(obj, function (o, type) {
	                    type !== IS_CONTAINER && result.push(o);
	                });
	            }
	            else {
	                result.push(obj);
	            }
	
	            return result;
	        };
	
	        entity.hasClass = function (componentType) {
	            // Just consider componentType.main.
	            componentType = parseClassType(componentType);
	            return !!storage[componentType.main];
	        };
	
	        /**
	         * @return {Array.<string>} Like ['aa', 'bb'], but can not be ['aa.xx']
	         */
	        entity.getAllClassMainTypes = function () {
	            var types = [];
	            zrUtil.each(storage, function (obj, type) {
	                types.push(type);
	            });
	            return types;
	        };
	
	        /**
	         * If a main type is container and has sub types
	         * @param  {string}  componentType
	         * @return {boolean}
	         */
	        entity.hasSubTypes = function (componentType) {
	            componentType = parseClassType(componentType);
	            var obj = storage[componentType.main];
	            return obj && obj[IS_CONTAINER];
	        };
	
	        entity.parseClassType = parseClassType;
	
	        function makeContainer(componentType) {
	            var container = storage[componentType.main];
	            if (!container || !container[IS_CONTAINER]) {
	                container = storage[componentType.main] = {};
	                container[IS_CONTAINER] = true;
	            }
	            return container;
	        }
	
	        if (options.registerWhenExtend) {
	            var originalExtend = entity.extend;
	            if (originalExtend) {
	                entity.extend = function (proto) {
	                    var ExtendedClass = originalExtend.call(this, proto);
	                    return entity.registerClass(ExtendedClass, proto.type);
	                };
	            }
	        }
	
	        return entity;
	    };
	
	    module.exports = clazz;
	


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Link工具类
	 */
	
	    var Model = __webpack_require__(85);
	    var Constants = __webpack_require__(84);
	    var zrUtil = __webpack_require__(4);
	    var Connector = __webpack_require__(76);
	    /**
	     * 根据结点数组 导出JSON格式的数据
	     *
	     * @param {Array} model 总的模型
	     * @return {JSON} JSON格式的数据
	     */
	    function toJson(model, group) {
	        var jsonArr = [];
	        group.eachChild(function(node) {
	            if (node.model) {
	                if (node instanceof Connector) {
	                    node.refreshModel();
	                };
	                jsonArr.push(node.model.option);
	
	            }
	
	
	        })
	        model.set(Constants.CHILDS, jsonArr);
	        return model.option;
	    }
	
	    /**
	     * 根据 JSON 生成节点
	     * @param  {[type]} fishTopolink [description]
	     * @param  {[type]} json         [description]
	     * @return {[type]}              [description]
	     */
	    function fromJson(fishTopolink, group, childShapes, isChild, layoutRootNode) {
	        // 1.清空画布
	
	        var connectors = [];
	        // 2.先创建节点  遍历形状 获取模型
	
	
	        for (var i = 0; i < childShapes.length; i++) {
	            var line = childShapes[i];
	            var link = fishTopolink.creatLinkOfPoints(line.options,line.userData);
	            if (isChild) {
	                group.add(link);
	            } else {
	                fishTopolink.addNode(link);
	            }
	        }
	    }
	
	    /**
	     * 根据id在group中查找
	     * @param  {[type]} group  [description]
	     * @param  {[type]} nodeId [description]
	     * @return {[type]}        [description]
	     */
	    function findNodeById (group, nodeId) {
	        var retNode = null;
	        group.eachChild(function(node) {
	            if (node.model && node.model.get(Constants.ID) === nodeId) {
	                retNode = node;
	            };
	        })
	        return retNode;
	    }
	
	
	    /**
	     * Get canvas which has all thing rendered
	     * @param {Object} opts
	     * @param {string} [opts.backgroundColor]
	     */
	    function getRenderedCanvas(zr, opts) {
	        opts = opts || {};
	        opts.pixelRatio = opts.pixelRatio || 1;
	        opts.backgroundColor = opts.backgroundColor
	            || "#FFFFFF";
	        var list = zr.storage.getDisplayList();
	        // Stop animations
	        zrUtil.each(list, function (el) {
	            el.stopAnimation(true);
	        });
	        return zr.painter.getRenderedCanvas(opts);
	    }
	
	    function toDataURL (zr, opts) {
	        opts = opts || {};
	        var url = getRenderedCanvas(zr, opts).toDataURL(
	            'image/' + (opts && opts.type || 'png')
	        );
	        return url;
	    }
	
	
	    function initNodeEvent (node, api) {
	        var MOUSE_EVENT_NAMES = ['dblclick', 'click'];//'click', 'dblclick', 'mouseover', 'mouseout'
	
	
	        zrUtil.each(MOUSE_EVENT_NAMES, function (eveName) {
	            node.on(eveName, function (e) {
	                var params = {};
	                params.event = e;
	                params.type = eveName;
	                params.target = node;
	                api.trigger(eveName, params);
	            });
	        });
	    }
	
	    module.exports = {
	        toJson: toJson,
	        fromJson: fromJson,
	        toDataURL:toDataURL
	    };
	


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 连线操作类
	 * @author miao.cunzhi
	 */
	
	    var Node = __webpack_require__(75);
	    var Util = __webpack_require__(59);
	    var graphic = __webpack_require__(3);
	    var Point = __webpack_require__(60);
	    var zrUtil = __webpack_require__(4);
	
	    function LineOperationManager(connectionManager) {
	        this.lineOperations = [],
	            this.isEdit = true;
	        this.connectionManager = connectionManager;
	    }
	
	    LineOperationManager.prototype.creatOperation = function(key, obj, api) {
	        var lineOperation = new graphic.Image({
	            style: {
	                image: obj.icon,
	                width: obj.width || 15,
	                height: obj.height || 15
	            }
	        });
	        lineOperation.key = key;
	        lineOperation.operation = true;
	        lineOperation.hide();
	        obj.lineNode.icons.push(lineOperation);
	        this.lineOperations.push(lineOperation);
	
	        //小图标 点击事件  如果有回调则调用回调，否则派发事件
	        lineOperation.on("click", function(e) {
	            if (obj.callback) {
	                obj.callback(obj.lineNode);
	            } else {
	                var params = {};
	                params.event = e;
	                params.type = "click";
	                params.elementType = "LineOperationIcon";
	                api.trigger(params.type, params);
	            }
	
	        });
	        return lineOperation;
	    }
	
	    /**
	     * 计算小图标的位置，并显示
	     * @param  {[type]} connector [description]
	     * @return {[type]}           [description]
	     */
	    LineOperationManager.prototype.bindOperation = function(connector) {
	        if (this.isEdit == false) {
	            return;
	        }
	        var pointPosition = connector.middle();
	        var length = [];
	        for (var j = 0; j < connector.icons.length; j++) {
	            length.push(connector.icons[j].style.width);
	        }
	        var totalLength = 0;
	        for (var m = 0; m < connector.icons.length; m++) {
	            totalLength += length[m] + 10;
	        }
	        for (var i = 0; i < connector.icons.length; i++) {
	            var connectorPosition = 0;
	            for (var k = 0; k < i; k++) {
	                connectorPosition += length[k] + 10;
	            }
	            connector.icons[i].attr("position", [pointPosition[0] + connectorPosition - totalLength / 2, pointPosition[1] + 5]);
	            connector.icons[i].show();
	        }
	    }
	
	    LineOperationManager.prototype.hideAllLineOperation = function() {
	        for (var li = 0; li < this.lineOperations.length; li++) {
	            var icon = this.lineOperations[li];
	            icon.hide();
	        }
	    }
	
	    LineOperationManager.prototype.addIcon = function(key, obj, zr, api) {
	        //判断是小图标否存在 ，存在则直接返回
	        if (obj.lineNode.icons) {
	            for (var i = 0; i < obj.lineNode.icons.length; i++) {
	                if (obj.lineNode.icons[i].key == key) {
	                    this.bindOperation(obj.lineNode);
	                    return;
	                }
	            }
	        }
	
	        var lineOperation = this.creatOperation(key, obj, api);
	        zr.add(lineOperation);
	        this.bindOperation(obj.lineNode);
	        return lineOperation;
	    }
	
	    LineOperationManager.prototype.deleteIconObj = function(parentZr, lineNode) {
	        return {
	            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOBAMAAADpk+DfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMGgKD4AAAAPdFJOUwDH/g+agESj4Y6zUiRnh7lnwbkAAABLSURBVAjXY2BgYDZgAIEnnkCa7a5cYGwCwwklIOhhMBEEgmIGnlAgOMDAprhQUGgDA5vWdJciXJRGR0dTAgPzQ0FBSaBpzMbGBgwAIoUW3sQ2EdkAAAAASUVORK5CYII=",
	            width: 12,
	            height: 14,
	            lineNode: lineNode,
	            callback: function(e) {
	                for (var i = 0; i < lineNode.icons.length; i++) {
	                    parentZr.remove(lineNode.icons[i])
	                }
	                this.connectionManager.deleteLine(parentZr);
	                this.hideAllLineOperation();
	                e.cancelBubble = true;
	            }.bind(this)
	        }
	    }
	
	    module.exports = LineOperationManager;
	


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Link静态方法类
	 * @class fish.topo.FishTopoLink.Link
	 */
	
	
	    var Constants = __webpack_require__(84);
	    var Flow = {
	        FLOW_TYPE: "elementType",
	        LINK: "connection",
	        RECT: "Rect",
	        Group: 'Group',
	        IMAGE: 'Image',
	        TEXT: 'Text',
	        CIRCLE: 'Circle',
	        SECTOR: 'Sector',
	        RING: 'Ring',
	        POLYGON: 'Polygon',
	        POLYLINE: 'Polyline',
	        LINE: 'Line',
	        BEZIERCURVE: 'Beziercurve',
	        ARC: 'Arc',
	        SCENE:'scene',
	
	        /**
	         * @method setUserData
	         * 设置用户数据
	         * @param {Object} node 需要设置数据的节点
	         * @param {Object} obj 数据
	         * **使用范例**：
	         *
	         *      @example
	         *      //设置自定义数据
	         *      this.fishTopo.Flow.setUserData(rect, { customObj: "rect" });
	         */
	        setUserData: function(node, obj) {
	            node.model.set(Constants.USERDATA, obj);
	        },
	        /**
	         * 获取设置的用户数据
	         * @param {Object} node 需要获取数据的节点
	         * @return {String}      数据
	         * **使用范例**：
	         *
	         *      @example
	         *      //获取自定义数据
	         *      this.fishTopo.Flow.getUserData(rect);
	         */
	        getUserData: function(node) {
	            return node.model.get(Constants.USERDATA);
	        },
	        /**
	         * 判断是否是连线
	         * @param {Object} model 对象的model
	         * @return {Boolean}      是 否
	         * **使用范例**：
	         *
	         *      @example
	         *      //判断是否是连线
	         *      var nodeModel = e.target.model;
	         *      if (this.fishTopo.Flow.isLink(nodeModel)) { return true;}
	         */
	        isLink: function(model) {
	            var elementType = model.get(Flow.FLOW_TYPE);
	            return elementType == Flow.LINK;
	        },
	        /**
	         * 获取节点的类型
	         * @param {Object} model 节点的model
	         * **使用范例**：
	         *
	         *      @example
	         *      //获取节点类型
	         *      var nodeModel = e.target.model;
	         *      return this.fishTopo.Flow.getType(nodeModel);
	         */
	        getType: function(model) {
	            var elementType = model.get(Flow.FLOW_TYPE);
	            return elementType;
	        }
	    };
	
	    module.exports = Flow;
	


/***/ },
/* 90 */
/***/ function(module, exports) {

	/**
	 * 工具类
	 * @class fish.topo.FishTopoFlow.util
	 */
	
	/**
	 * @method initImagePool
	 * 初始化图片池  用于对图片加载进行管理
	 * @param {number} max 最大连接数。数值。
	 * @returns {{load: Function, info: Function}}
	 *
	 * **使用范例**：
	 *
	 *      @example
	        var imagepool = fishTopoFlow.util.initImagePool(100);
	        imagepool.load(grayArray, {
	            success: function(imgs) {
	            },
	            once: true
	        });
	 */
	
	/**
	 * @method inherits
	 * 构造类继承关系
	 *
	 * @param {Function} clazz 源类
	 * @param {Function} baseClazz 基类
	 */
	
	
	    var emptyFn = function() {};
	    //初始默认配置
	    var config_default = {
	        //线程池"线程"数量
	        thread: 5,
	        //图片加载失败重试次数
	        //重试2次，加上原有的一次，总共是3次
	        "tries": 2
	    };
	    //工具
	    var _helpers = {
	        //设置dom属性
	        setAttr: (function() {
	            var img = new Image();
	            //判断浏览器是否支持HTML5 dataset
	            if (img.dataset) {
	                return function(dom, name, value) {
	                    dom.dataset[name] = value;
	                    return value;
	                };
	            } else {
	                return function(dom, name, value) {
	                    dom.setAttribute("data-" + name, value);
	                    return value;
	                };
	            }
	        }()),
	        //获取dom属性
	        getAttr: (function() {
	            var img = new Image();
	            //判断浏览器是否支持HTML5 dataset
	            if (img.dataset) {
	                return function(dom, name) {
	                    if(!dom.dataset[name]){
	                        return dom.getAttribute("data-" + name);
	                    }else{
	                        return dom.dataset[name];
	                    }
	                };
	            } else {
	                return function(dom, name) {
	                    return dom.getAttribute("data-" + name);
	                };
	            }
	        }())
	    };
	    /**
	     * 构造方法
	     * @private
	     * @param max 最大连接数。数值。
	     */
	    function ImagePool(max) {
	        //最大并发数量
	        this.max = max || config_default.thread;
	        this.linkHead = null;
	        this.linkNode = null;
	        //加载池
	        //[{img: dom,free: true, node: node}]
	        //node
	        //{src: "", options: {success: "fn",error: "fn", once: true}, tries: 0}
	        this.pool = [];
	    }
	    /**
	     * 初始化
	     * @private
	     */
	    ImagePool.prototype.initPool = function() {
	        var i, img, obj, _s;
	        _s = this;
	        for (i = 0; i < this.max; i++) {
	            obj = {};
	            img = new Image();
	            _helpers.setAttr(img, "id", i);
	            img.onload = function() {
	                //回调
	                _s.notice(_s.getNode(this), "success", this);
	                //处理任务
	                _s.executeLink(this);
	            };
	            img.onerror = function() {
	                var node = _s.getNode(this);
	                //判断尝试次数
	                if (node.tries < config_default.tries) {
	                    node.tries = node.tries+1;
	                    //再次追加到任务链表末尾
	                    _s.appendNode(_s.createNode(node.src, node.options, node.notice, node.group, node.tries));
	                } else {
	                    //error回调
	                    //node.options.error.call(null, this.src);
	                    _s.notice(node, "error", this);
	                }
	                //处理任务
	                _s.executeLink(this);
	            };
	            obj.img = img;
	            obj.free = true;
	            this.pool.push(obj);
	        }
	    };
	    /**
	     * 回调封装
	     * @private
	     * @param node 节点。对象。
	     * @param status 状态。字符串。可选值：success(成功)|error(失败)
	     * @param img 图片。
	     */
	    ImagePool.prototype.notice = function(node, status, img) {
	        node.notice(status, img);
	    };
	    /**
	     * 处理链表任务
	     * @private
	     * @param dom 图像dom对象。对象。
	     */
	    ImagePool.prototype.executeLink = function(dom) {
	        //判断链表是否存在节点
	        if (this.linkHead) {
	            //加载下一个图片
	            this.setSrc(dom, this.linkHead);
	            //去除链表头
	            this.shiftNode();
	        } else {
	            //设置自身状态为空闲
	            this.status(dom, true);
	        }
	    };
	    /**
	     * 获取空闲"线程"
	     * @private
	     */
	    ImagePool.prototype.getFree = function() {
	        var length, i;
	        for (i = 0, length = this.pool.length; i < length; i++) {
	            if (this.pool[i].free) {
	                return this.pool[i];
	            }
	        }
	        return null;
	    };
	    /**
	     * 封装src属性设置
	     * 因为改变src属性相当于加载图片，所以把操作封装起来
	     * @private
	     * @param dom 图像dom对象。对象。
	     * @param node 节点。对象。
	     */
	    ImagePool.prototype.setSrc = function(dom, node) {
	        //设置池中的"线程"为非空闲状态
	        this.status(dom, false);
	        //关联节点
	        this.setNode(dom, node);
	        //加载图片
	        dom.src = node.src;
	    };
	    /**
	     * 更新池中的"线程"状态
	     * @private
	     * @param dom 图像dom对象。对象。
	     * @param status 状态。布尔。可选值：true(空闲)|false(非空闲)
	     */
	    ImagePool.prototype.status = function(dom, status) {
	        var id = _helpers.getAttr(dom, "id");
	        if(id){
	            this.pool[id].free = status;
	        }
	
	        //空闲状态，清除关联的节点
	        if (status) {
	            this.pool[id].node = null;
	        }
	    };
	    /**
	     * 更新池中的"线程"的关联节点
	     * @private
	     * @param dom 图像dom对象。对象。
	     * @param node 节点。对象。
	     */
	    ImagePool.prototype.setNode = function(dom, node) {
	        var id = _helpers.getAttr(dom, "id");
	        if(id){
	            this.pool[id].node = node;
	            return this.pool[id].node === node;
	        }
	
	    };
	    /**
	     * 获取池中的"线程"的关联节点
	     * @private
	     * @param dom 图像dom对象。对象。
	     */
	    ImagePool.prototype.getNode = function(dom) {
	        var id = _helpers.getAttr(dom, "id");
	        if(id){
	            return this.pool[id].node;
	        }
	
	    };
	    /**
	     * 对外接口，加载图片
	     * @private
	     * @param src 可以是src字符串，也可以是src字符串数组。
	     * @param options 用户自定义参数。包含：success回调、error回调、once标识。
	     */
	    ImagePool.prototype._load = function(src, options) {
	        var srcs = [],
	            free = null,
	            length = 0,
	            i = 0,
	            //只初始化一次回调策略
	            notice = (function() {
	                if (options.once) {
	                    return function(status, img) {
	                        var g = this.group,
	                            o = this.options;
	                        //记录
	                        g[status].push(img);
	                        //判断改组是否全部处理完成
	                        if (g.success.length + g.error.length === g.count) {
	                            //异步
	                            //实际上是作为另一个任务单独执行，防止回调函数执行时间过长影响图片加载速度
	                            setTimeout(function() {
	                                o.success.call(null, g.success, g.error, g.count);
	                            }, 1);
	                        }
	                    };
	                } else {
	                    return function(status, img) {
	                        var o = this.options;
	                        //直接回调
	                        setTimeout(function() {
	                            o[status].call(null, img);
	                        }, 1);
	                    };
	                }
	            }()),
	            group = {
	                count: 0,
	                success: [],
	                error: []
	            },
	            node = null;
	        options = options || {};
	        options.success = options.success || emptyFn;
	        options.error = options.error || emptyFn;
	        srcs = srcs.concat(src);
	        //设置组元素个数
	        group.count = srcs.length;
	        //遍历需要加载的图片
	        for (i = 0, length = srcs.length; i < length; i++) {
	            //创建节点
	            node = this.createNode(srcs[i], options, notice, group);
	            //判断线程池是否有空闲
	            free = this.getFree();
	            if (free) {
	                //有空闲，则立即加载图片
	                this.setSrc(free.img, node);
	            } else {
	                //没有空闲，将任务添加到链表
	                this.appendNode(node);
	            }
	        }
	    };
	    /**
	     * 获取内部状态信息
	     * @private
	     * @returns {Object}
	     */
	    ImagePool.prototype._info = function() {
	        var info = {},
	            length = 0,
	            i = 0,
	            node = null;
	        //线程
	        info.thread = {};
	        //线程总数量
	        info.thread.count = this.pool.length;
	        //空闲线程数量
	        info.thread.free = 0;
	        //任务
	        info.task = {};
	        //待处理任务数量
	        info.task.count = 0;
	        //获取空闲"线程"数量
	        for (i = 0, length = this.pool.length; i < length; i++) {
	            if (this.pool[i].free) {
	                info.thread.free = info.thread.free + 1;
	            }
	        }
	        //获取任务数量(任务链长度)
	        node = this.linkHead;
	        if (node) {
	            info.task.count = info.task.count + 1;
	            while (node.next) {
	                info.task.count = info.task.count + 1;
	                node = node.next;
	            }
	        }
	        return info;
	    };
	
	    /**
	     * 创建节点
	     * @private
	     * @param src 图片路径。字符串。
	     * @param options 用户自定义参数。包含：success回调、error回调、once标识。
	     * @param notice 回调策略。 函数。
	     * @param group 组信息。对象。{count: 0, success: [], error: []}
	     * @param tr 出错重试次数。数值。默认为0。
	     * @returns {Object}
	     */
	    ImagePool.prototype.createNode = function(src, options, notice, group, tr) {
	        var node = {};
	        node.src = src;
	        node.options = options;
	        node.notice = notice;
	        node.group = group;
	        node.tries = tr || 0;
	        return node;
	    };
	    /**
	     * 向任务链表末尾追加节点
	     * @private
	     * @param node 节点。对象。
	     */
	    ImagePool.prototype.appendNode = function(node) {
	        //判断链表是否为空
	        if (!this.linkHead) {
	            this.linkHead = node;
	            this.linkNode = node;
	        } else {
	            this.linkNode.next = node;
	            this.linkNode = node;
	        }
	    };
	    /**
	     * 删除链表头
	     * @private
	     */
	    ImagePool.prototype.shiftNode = function() {
	        //判断链表是否存在节点
	        if (this.linkHead) {
	            //修改链表头
	            this.linkHead = this.linkHead.next || null;
	        }
	    };
	    /**
	     * 初始化图片池
	     * @param {number} max 最大连接数。数值。
	     * @returns {{load: Function, info: Function}}
	     */
	    var initImagePool = function(max) {
	        var instance = new ImagePool(max);
	        instance.initPool();
	        return {
	            /**
	             * 加载图片
	             * @param {string|Array} src 可以是src字符串，也可以是src字符串数组。
	             * @param {Object} options 用户自定义参数。包含：success回调、error回调、once标识。
	             * @param {Function} [options.success] success回调
	             * @param {Function} [options.error] error回调
	             * @param {boolean} [options.once] 是否全部加载完毕后，一次回调
	             */
	            load: function() {
	                instance._load.apply(instance, arguments);
	            },
	            /**
	             * 获取内部状态信息
	             * @returns {*|any|void}
	             */
	            info: function() {
	                return instance._info.call(instance);
	            }
	        };
	    };
	
	    module.exports = { initImagePool: initImagePool }
	


/***/ },
/* 91 */
/***/ function(module, exports) {

	
	    //polyfill bind
	    if (!Function.prototype.bind) {
	        Function.prototype.bind = function(oThis) {
	            if (typeof this !== "function") {
	                // closest thing possible to the ECMAScript 5 internal IsCallable function
	                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	            }
	
	            var aArgs = Array.prototype.slice.call(arguments, 1),
	                fToBind = this,
	                fNOP = function() {},
	                fBound = function() {
	                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis || window,
	                        aArgs.concat(Array.prototype.slice.call(arguments)));
	                };
	
	            fNOP.prototype = this.prototype;
	            fBound.prototype = new fNOP();
	
	            return fBound;
	        };
	    }
	
	    //polyfill remove
	    if (!('remove' in Element.prototype)) {
	        Element.prototype.remove = function() {
	            if (this.parentNode) {
	                this.parentNode.removeChild(this);
	            }
	        };
	    }
	


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	
	    __webpack_require__(93);
	    __webpack_require__(63).registerPainter('vml', __webpack_require__(95));


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// http://www.w3.org/TR/NOTE-VML
	// TODO Use proxy like svg instead of overwrite brush methods
	
	
	if (!__webpack_require__(45).canvasSupported) {
	    var vec2 = __webpack_require__(14);
	    var BoundingRect = __webpack_require__(25);
	    var CMD = __webpack_require__(26).CMD;
	    var colorTool = __webpack_require__(19);
	    var textContain = __webpack_require__(24);
	    var RectText = __webpack_require__(23);
	    var Displayable = __webpack_require__(7);
	    var ZImage = __webpack_require__(41);
	    var Text = __webpack_require__(42);
	    var Path = __webpack_require__(6);
	
	    var Gradient = __webpack_require__(38);
	
	    var vmlCore = __webpack_require__(94);
	
	    var round = Math.round;
	    var sqrt = Math.sqrt;
	    var abs = Math.abs;
	    var cos = Math.cos;
	    var sin = Math.sin;
	    var mathMax = Math.max;
	
	    var applyTransform = vec2.applyTransform;
	
	    var comma = ',';
	    var imageTransformPrefix = 'progid:DXImageTransform.Microsoft';
	
	    var Z = 21600;
	    var Z2 = Z / 2;
	
	    var ZLEVEL_BASE = 100000;
	    var Z_BASE = 1000;
	
	    var initRootElStyle = function (el) {
	        el.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;';
	        el.coordsize = Z + ','  + Z;
	        el.coordorigin = '0,0';
	    };
	
	    var encodeHtmlAttribute = function (s) {
	        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
	    };
	
	    var rgb2Str = function (r, g, b) {
	        return 'rgb(' + [r, g, b].join(',') + ')';
	    };
	
	    var append = function (parent, child) {
	        if (child && parent && child.parentNode !== parent) {
	            parent.appendChild(child);
	        }
	    };
	
	    var remove = function (parent, child) {
	        if (child && parent && child.parentNode === parent) {
	            parent.removeChild(child);
	        }
	    };
	
	    var getZIndex = function (zlevel, z, z2) {
	        // z 的取值范围为 [0, 1000]
	        return (parseFloat(zlevel) || 0) * ZLEVEL_BASE + (parseFloat(z) || 0) * Z_BASE + z2;
	    };
	
	    var parsePercent = function (value, maxValue) {
	        if (typeof value === 'string') {
	            if (value.lastIndexOf('%') >= 0) {
	                return parseFloat(value) / 100 * maxValue;
	            }
	            return parseFloat(value);
	        }
	        return value;
	    };
	
	    /***************************************************
	     * PATH
	     **************************************************/
	
	    var setColorAndOpacity = function (el, color, opacity) {
	        var colorArr = colorTool.parse(color);
	        opacity = +opacity;
	        if (isNaN(opacity)) {
	            opacity = 1;
	        }
	        if (colorArr) {
	            el.color = rgb2Str(colorArr[0], colorArr[1], colorArr[2]);
	            el.opacity = opacity * colorArr[3];
	        }
	    };
	
	    var getColorAndAlpha = function (color) {
	        var colorArr = colorTool.parse(color);
	        return [
	            rgb2Str(colorArr[0], colorArr[1], colorArr[2]),
	            colorArr[3]
	        ];
	    };
	
	    var updateFillNode = function (el, style, zrEl) {
	        // TODO pattern
	        var fill = style.fill;
	        if (fill != null) {
	            // Modified from excanvas
	            if (fill instanceof Gradient) {
	                var gradientType;
	                var angle = 0;
	                var focus = [0, 0];
	                // additional offset
	                var shift = 0;
	                // scale factor for offset
	                var expansion = 1;
	                var rect = zrEl.getBoundingRect();
	                var rectWidth = rect.width;
	                var rectHeight = rect.height;
	                if (fill.type === 'linear') {
	                    gradientType = 'gradient';
	                    var transform = zrEl.transform;
	                    var p0 = [fill.x * rectWidth, fill.y * rectHeight];
	                    var p1 = [fill.x2 * rectWidth, fill.y2 * rectHeight];
	                    if (transform) {
	                        applyTransform(p0, p0, transform);
	                        applyTransform(p1, p1, transform);
	                    }
	                    var dx = p1[0] - p0[0];
	                    var dy = p1[1] - p0[1];
	                    angle = Math.atan2(dx, dy) * 180 / Math.PI;
	                    // The angle should be a non-negative number.
	                    if (angle < 0) {
	                        angle += 360;
	                    }
	
	                    // Very small angles produce an unexpected result because they are
	                    // converted to a scientific notation string.
	                    if (angle < 1e-6) {
	                        angle = 0;
	                    }
	                }
	                else {
	                    gradientType = 'gradientradial';
	                    var p0 = [fill.x * rectWidth, fill.y * rectHeight];
	                    var transform = zrEl.transform;
	                    var scale = zrEl.scale;
	                    var width = rectWidth;
	                    var height = rectHeight;
	                    focus = [
	                        // Percent in bounding rect
	                        (p0[0] - rect.x) / width,
	                        (p0[1] - rect.y) / height
	                    ];
	                    if (transform) {
	                        applyTransform(p0, p0, transform);
	                    }
	
	                    width /= scale[0] * Z;
	                    height /= scale[1] * Z;
	                    var dimension = mathMax(width, height);
	                    shift = 2 * 0 / dimension;
	                    expansion = 2 * fill.r / dimension - shift;
	                }
	
	                // We need to sort the color stops in ascending order by offset,
	                // otherwise IE won't interpret it correctly.
	                var stops = fill.colorStops.slice();
	                stops.sort(function(cs1, cs2) {
	                    return cs1.offset - cs2.offset;
	                });
	
	                var length = stops.length;
	                // Color and alpha list of first and last stop
	                var colorAndAlphaList = [];
	                var colors = [];
	                for (var i = 0; i < length; i++) {
	                    var stop = stops[i];
	                    var colorAndAlpha = getColorAndAlpha(stop.color);
	                    colors.push(stop.offset * expansion + shift + ' ' + colorAndAlpha[0]);
	                    if (i === 0 || i === length - 1) {
	                        colorAndAlphaList.push(colorAndAlpha);
	                    }
	                }
	
	                if (length >= 2) {
	                    var color1 = colorAndAlphaList[0][0];
	                    var color2 = colorAndAlphaList[1][0];
	                    var opacity1 = colorAndAlphaList[0][1] * style.opacity;
	                    var opacity2 = colorAndAlphaList[1][1] * style.opacity;
	
	                    el.type = gradientType;
	                    el.method = 'none';
	                    el.focus = '100%';
	                    el.angle = angle;
	                    el.color = color1;
	                    el.color2 = color2;
	                    el.colors = colors.join(',');
	                    // When colors attribute is used, the meanings of opacity and o:opacity2
	                    // are reversed.
	                    el.opacity = opacity2;
	                    // FIXME g_o_:opacity ?
	                    el.opacity2 = opacity1;
	                }
	                if (gradientType === 'radial') {
	                    el.focusposition = focus.join(',');
	                }
	            }
	            else {
	                // FIXME Change from Gradient fill to color fill
	                setColorAndOpacity(el, fill, style.opacity);
	            }
	        }
	    };
	
	    var updateStrokeNode = function (el, style) {
	        // if (style.lineJoin != null) {
	        //     el.joinstyle = style.lineJoin;
	        // }
	        // if (style.miterLimit != null) {
	        //     el.miterlimit = style.miterLimit * Z;
	        // }
	        // if (style.lineCap != null) {
	        //     el.endcap = style.lineCap;
	        // }
	        if (style.lineDash != null) {
	            el.dashstyle = style.lineDash.join(' ');
	        }
	        if (style.stroke != null && !(style.stroke instanceof Gradient)) {
	            setColorAndOpacity(el, style.stroke, style.opacity);
	        }
	    };
	
	    var updateFillAndStroke = function (vmlEl, type, style, zrEl) {
	        var isFill = type == 'fill';
	        var el = vmlEl.getElementsByTagName(type)[0];
	        // Stroke must have lineWidth
	        if (style[type] != null && style[type] !== 'none' && (isFill || (!isFill && style.lineWidth))) {
	            vmlEl[isFill ? 'filled' : 'stroked'] = 'true';
	            // FIXME Remove before updating, or set `colors` will throw error
	            if (style[type] instanceof Gradient) {
	                remove(vmlEl, el);
	            }
	            if (!el) {
	                el = vmlCore.createNode(type);
	            }
	
	            isFill ? updateFillNode(el, style, zrEl) : updateStrokeNode(el, style);
	            append(vmlEl, el);
	        }
	        else {
	            vmlEl[isFill ? 'filled' : 'stroked'] = 'false';
	            remove(vmlEl, el);
	        }
	    };
	
	    var points = [[], [], []];
	    var pathDataToString = function (data, m) {
	        var M = CMD.M;
	        var C = CMD.C;
	        var L = CMD.L;
	        var A = CMD.A;
	        var Q = CMD.Q;
	
	        var str = [];
	        var nPoint;
	        var cmdStr;
	        var cmd;
	        var i;
	        var xi;
	        var yi;
	        for (i = 0; i < data.length;) {
	            cmd = data[i++];
	            cmdStr = '';
	            nPoint = 0;
	            switch (cmd) {
	                case M:
	                    cmdStr = ' m ';
	                    nPoint = 1;
	                    xi = data[i++];
	                    yi = data[i++];
	                    points[0][0] = xi;
	                    points[0][1] = yi;
	                    break;
	                case L:
	                    cmdStr = ' l ';
	                    nPoint = 1;
	                    xi = data[i++];
	                    yi = data[i++];
	                    points[0][0] = xi;
	                    points[0][1] = yi;
	                    break;
	                case Q:
	                case C:
	                    cmdStr = ' c ';
	                    nPoint = 3;
	                    var x1 = data[i++];
	                    var y1 = data[i++];
	                    var x2 = data[i++];
	                    var y2 = data[i++];
	                    var x3;
	                    var y3;
	                    if (cmd === Q) {
	                        // Convert quadratic to cubic using degree elevation
	                        x3 = x2;
	                        y3 = y2;
	                        x2 = (x2 + 2 * x1) / 3;
	                        y2 = (y2 + 2 * y1) / 3;
	                        x1 = (xi + 2 * x1) / 3;
	                        y1 = (yi + 2 * y1) / 3;
	                    }
	                    else {
	                        x3 = data[i++];
	                        y3 = data[i++];
	                    }
	                    points[0][0] = x1;
	                    points[0][1] = y1;
	                    points[1][0] = x2;
	                    points[1][1] = y2;
	                    points[2][0] = x3;
	                    points[2][1] = y3;
	
	                    xi = x3;
	                    yi = y3;
	                    break;
	                case A:
	                    var x = 0;
	                    var y = 0;
	                    var sx = 1;
	                    var sy = 1;
	                    var angle = 0;
	                    if (m) {
	                        // Extract SRT from matrix
	                        x = m[4];
	                        y = m[5];
	                        sx = sqrt(m[0] * m[0] + m[1] * m[1]);
	                        sy = sqrt(m[2] * m[2] + m[3] * m[3]);
	                        angle = Math.atan2(-m[1] / sy, m[0] / sx);
	                    }
	
	                    var cx = data[i++];
	                    var cy = data[i++];
	                    var rx = data[i++];
	                    var ry = data[i++];
	                    var startAngle = data[i++] + angle;
	                    var endAngle = data[i++] + startAngle + angle;
	                    // FIXME
	                    // var psi = data[i++];
	                    i++;
	                    var clockwise = data[i++];
	
	                    var x0 = cx + cos(startAngle) * rx;
	                    var y0 = cy + sin(startAngle) * ry;
	
	                    var x1 = cx + cos(endAngle) * rx;
	                    var y1 = cy + sin(endAngle) * ry;
	
	                    var type = clockwise ? ' wa ' : ' at ';
	                    if (Math.abs(x0 - x1) < 1e-4) {
	                        // IE won't render arches drawn counter clockwise if x0 == x1.
	                        if (Math.abs(endAngle - startAngle) > 1e-2) {
	                            // Offset x0 by 1/80 of a pixel. Use something
	                            // that can be represented in binary
	                            if (clockwise) {
	                                x0 += 270 / Z;
	                            }
	                        }
	                        else {
	                            // Avoid case draw full circle
	                            if (Math.abs(y0 - cy) < 1e-4) {
	                                if ((clockwise && x0 < cx) || (!clockwise && x0 > cx)) {
	                                    y1 -= 270 / Z;
	                                }
	                                else {
	                                    y1 += 270 / Z;
	                                }
	                            }
	                            else if ((clockwise && y0 < cy) || (!clockwise && y0 > cy)) {
	                                x1 += 270 / Z;
	                            }
	                            else {
	                                x1 -= 270 / Z;
	                            }
	                        }
	                    }
	                    str.push(
	                        type,
	                        round(((cx - rx) * sx + x) * Z - Z2), comma,
	                        round(((cy - ry) * sy + y) * Z - Z2), comma,
	                        round(((cx + rx) * sx + x) * Z - Z2), comma,
	                        round(((cy + ry) * sy + y) * Z - Z2), comma,
	                        round((x0 * sx + x) * Z - Z2), comma,
	                        round((y0 * sy + y) * Z - Z2), comma,
	                        round((x1 * sx + x) * Z - Z2), comma,
	                        round((y1 * sy + y) * Z - Z2)
	                    );
	
	                    xi = x1;
	                    yi = y1;
	                    break;
	                case CMD.R:
	                    var p0 = points[0];
	                    var p1 = points[1];
	                    // x0, y0
	                    p0[0] = data[i++];
	                    p0[1] = data[i++];
	                    // x1, y1
	                    p1[0] = p0[0] + data[i++];
	                    p1[1] = p0[1] + data[i++];
	
	                    if (m) {
	                        applyTransform(p0, p0, m);
	                        applyTransform(p1, p1, m);
	                    }
	
	                    p0[0] = round(p0[0] * Z - Z2);
	                    p1[0] = round(p1[0] * Z - Z2);
	                    p0[1] = round(p0[1] * Z - Z2);
	                    p1[1] = round(p1[1] * Z - Z2);
	                    str.push(
	                        // x0, y0
	                        ' m ', p0[0], comma, p0[1],
	                        // x1, y0
	                        ' l ', p1[0], comma, p0[1],
	                        // x1, y1
	                        ' l ', p1[0], comma, p1[1],
	                        // x0, y1
	                        ' l ', p0[0], comma, p1[1]
	                    );
	                    break;
	                case CMD.Z:
	                    // FIXME Update xi, yi
	                    str.push(' x ');
	            }
	
	            if (nPoint > 0) {
	                str.push(cmdStr);
	                for (var k = 0; k < nPoint; k++) {
	                    var p = points[k];
	
	                    m && applyTransform(p, p, m);
	                    // 不 round 会非常慢
	                    str.push(
	                        round(p[0] * Z - Z2), comma, round(p[1] * Z - Z2),
	                        k < nPoint - 1 ? comma : ''
	                    );
	                }
	            }
	        }
	
	        return str.join('');
	    };
	
	    // Rewrite the original path method
	    Path.prototype.brushVML = function (vmlRoot) {
	        var style = this.style;
	
	        var vmlEl = this._vmlEl;
	        if (!vmlEl) {
	            vmlEl = vmlCore.createNode('shape');
	            initRootElStyle(vmlEl);
	
	            this._vmlEl = vmlEl;
	        }
	
	        updateFillAndStroke(vmlEl, 'fill', style, this);
	        updateFillAndStroke(vmlEl, 'stroke', style, this);
	
	        var m = this.transform;
	        var needTransform = m != null;
	        var strokeEl = vmlEl.getElementsByTagName('stroke')[0];
	        if (strokeEl) {
	            var lineWidth = style.lineWidth;
	            // Get the line scale.
	            // Determinant of this.m_ means how much the area is enlarged by the
	            // transformation. So its square root can be used as a scale factor
	            // for width.
	            if (needTransform && !style.strokeNoScale) {
	                var det = m[0] * m[3] - m[1] * m[2];
	                lineWidth *= sqrt(abs(det));
	            }
	            strokeEl.weight = lineWidth + 'px';
	        }
	
	        var path = this.path;
	        if (this.__dirtyPath) {
	            path.beginPath();
	            this.buildPath(path, this.shape);
	            path.toStatic();
	            this.__dirtyPath = false;
	        }
	
	        vmlEl.path = pathDataToString(path.data, this.transform);
	
	        vmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);
	
	        // Append to root
	        append(vmlRoot, vmlEl);
	
	        // Text
	        if (style.text != null) {
	            this.drawRectText(vmlRoot, this.getBoundingRect());
	        }
	        else {
	            this.removeRectText(vmlRoot);
	        }
	    };
	
	    Path.prototype.onRemove = function (vmlRoot) {
	        remove(vmlRoot, this._vmlEl);
	        this.removeRectText(vmlRoot);
	    };
	
	    Path.prototype.onAdd = function (vmlRoot) {
	        append(vmlRoot, this._vmlEl);
	        this.appendRectText(vmlRoot);
	    };
	
	    /***************************************************
	     * IMAGE
	     **************************************************/
	    var isImage = function (img) {
	        // FIXME img instanceof Image 如果 img 是一个字符串的时候，IE8 下会报错
	        return (typeof img === 'object') && img.tagName && img.tagName.toUpperCase() === 'IMG';
	        // return img instanceof Image;
	    };
	
	    // Rewrite the original path method
	    ZImage.prototype.brushVML = function (vmlRoot) {
	        var style = this.style;
	        var image = style.image;
	
	        // Image original width, height
	        var ow;
	        var oh;
	
	        if (isImage(image)) {
	            var src = image.src;
	            if (src === this._imageSrc) {
	                ow = this._imageWidth;
	                oh = this._imageHeight;
	            }
	            else {
	                var imageRuntimeStyle = image.runtimeStyle;
	                var oldRuntimeWidth = imageRuntimeStyle.width;
	                var oldRuntimeHeight = imageRuntimeStyle.height;
	                imageRuntimeStyle.width = 'auto';
	                imageRuntimeStyle.height = 'auto';
	
	                // get the original size
	                ow = image.width;
	                oh = image.height;
	
	                // and remove overides
	                imageRuntimeStyle.width = oldRuntimeWidth;
	                imageRuntimeStyle.height = oldRuntimeHeight;
	
	                // Caching image original width, height and src
	                this._imageSrc = src;
	                this._imageWidth = ow;
	                this._imageHeight = oh;
	            }
	            image = src;
	        }
	        else {
	            if (image === this._imageSrc) {
	                ow = this._imageWidth;
	                oh = this._imageHeight;
	            }
	        }
	        if (!image) {
	            return;
	        }
	
	        var x = style.x || 0;
	        var y = style.y || 0;
	
	        var dw = style.width;
	        var dh = style.height;
	
	        var sw = style.sWidth;
	        var sh = style.sHeight;
	        var sx = style.sx || 0;
	        var sy = style.sy || 0;
	
	        var hasCrop = sw && sh;
	
	        var vmlEl = this._vmlEl;
	        if (!vmlEl) {
	            // FIXME 使用 group 在 left, top 都不是 0 的时候就无法显示了。
	            // vmlEl = vmlCore.createNode('group');
	            vmlEl = vmlCore.doc.createElement('div');
	            initRootElStyle(vmlEl);
	
	            this._vmlEl = vmlEl;
	        }
	
	        var vmlElStyle = vmlEl.style;
	        var hasRotation = false;
	        var m;
	        var scaleX = 1;
	        var scaleY = 1;
	        if (this.transform) {
	            m = this.transform;
	            scaleX = sqrt(m[0] * m[0] + m[1] * m[1]);
	            scaleY = sqrt(m[2] * m[2] + m[3] * m[3]);
	
	            hasRotation = m[1] || m[2];
	        }
	        if (hasRotation) {
	            // If filters are necessary (rotation exists), create them
	            // filters are bog-slow, so only create them if abbsolutely necessary
	            // The following check doesn't account for skews (which don't exist
	            // in the canvas spec (yet) anyway.
	            // From excanvas
	            var p0 = [x, y];
	            var p1 = [x + dw, y];
	            var p2 = [x, y + dh];
	            var p3 = [x + dw, y + dh];
	            applyTransform(p0, p0, m);
	            applyTransform(p1, p1, m);
	            applyTransform(p2, p2, m);
	            applyTransform(p3, p3, m);
	
	            var maxX = mathMax(p0[0], p1[0], p2[0], p3[0]);
	            var maxY = mathMax(p0[1], p1[1], p2[1], p3[1]);
	
	            var transformFilter = [];
	            transformFilter.push('M11=', m[0] / scaleX, comma,
	                        'M12=', m[2] / scaleY, comma,
	                        'M21=', m[1] / scaleX, comma,
	                        'M22=', m[3] / scaleY, comma,
	                        'Dx=', round(x * scaleX + m[4]), comma,
	                        'Dy=', round(y * scaleY + m[5]));
	
	            vmlElStyle.padding = '0 ' + round(maxX) + 'px ' + round(maxY) + 'px 0';
	            // FIXME DXImageTransform 在 IE11 的兼容模式下不起作用
	            vmlElStyle.filter = imageTransformPrefix + '.Matrix('
	                + transformFilter.join('') + ', SizingMethod=clip)';
	
	        }
	        else {
	            if (m) {
	                x = x * scaleX + m[4];
	                y = y * scaleY + m[5];
	            }
	            vmlElStyle.filter = '';
	            vmlElStyle.left = round(x) + 'px';
	            vmlElStyle.top = round(y) + 'px';
	        }
	
	        var imageEl = this._imageEl;
	        var cropEl = this._cropEl;
	
	        if (!imageEl) {
	            imageEl = vmlCore.doc.createElement('div');
	            this._imageEl = imageEl;
	        }
	        var imageELStyle = imageEl.style;
	        if (hasCrop) {
	            // Needs know image original width and height
	            if (! (ow && oh)) {
	                var tmpImage = new Image();
	                var self = this;
	                tmpImage.onload = function () {
	                    tmpImage.onload = null;
	                    ow = tmpImage.width;
	                    oh = tmpImage.height;
	                    // Adjust image width and height to fit the ratio destinationSize / sourceSize
	                    imageELStyle.width = round(scaleX * ow * dw / sw) + 'px';
	                    imageELStyle.height = round(scaleY * oh * dh / sh) + 'px';
	
	                    // Caching image original width, height and src
	                    self._imageWidth = ow;
	                    self._imageHeight = oh;
	                    self._imageSrc = image;
	                };
	                tmpImage.src = image;
	            }
	            else {
	                imageELStyle.width = round(scaleX * ow * dw / sw) + 'px';
	                imageELStyle.height = round(scaleY * oh * dh / sh) + 'px';
	            }
	
	            if (! cropEl) {
	                cropEl = vmlCore.doc.createElement('div');
	                cropEl.style.overflow = 'hidden';
	                this._cropEl = cropEl;
	            }
	            var cropElStyle = cropEl.style;
	            cropElStyle.width = round((dw + sx * dw / sw) * scaleX);
	            cropElStyle.height = round((dh + sy * dh / sh) * scaleY);
	            cropElStyle.filter = imageTransformPrefix + '.Matrix(Dx='
	                    + (-sx * dw / sw * scaleX) + ',Dy=' + (-sy * dh / sh * scaleY) + ')';
	
	            if (! cropEl.parentNode) {
	                vmlEl.appendChild(cropEl);
	            }
	            if (imageEl.parentNode != cropEl) {
	                cropEl.appendChild(imageEl);
	            }
	        }
	        else {
	            imageELStyle.width = round(scaleX * dw) + 'px';
	            imageELStyle.height = round(scaleY * dh) + 'px';
	
	            vmlEl.appendChild(imageEl);
	
	            if (cropEl && cropEl.parentNode) {
	                vmlEl.removeChild(cropEl);
	                this._cropEl = null;
	            }
	        }
	
	        var filterStr = '';
	        var alpha = style.opacity;
	        if (alpha < 1) {
	            filterStr += '.Alpha(opacity=' + round(alpha * 100) + ') ';
	        }
	        filterStr += imageTransformPrefix + '.AlphaImageLoader(src=' + image + ', SizingMethod=scale)';
	
	        imageELStyle.filter = filterStr;
	
	        vmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);
	
	        // Append to root
	        append(vmlRoot, vmlEl);
	
	        // Text
	        if (style.text != null) {
	            this.drawRectText(vmlRoot, this.getBoundingRect());
	        }
	    };
	
	    ZImage.prototype.onRemove = function (vmlRoot) {
	        remove(vmlRoot, this._vmlEl);
	
	        this._vmlEl = null;
	        this._cropEl = null;
	        this._imageEl = null;
	
	        this.removeRectText(vmlRoot);
	    };
	
	    ZImage.prototype.onAdd = function (vmlRoot) {
	        append(vmlRoot, this._vmlEl);
	        this.appendRectText(vmlRoot);
	    };
	
	
	    /***************************************************
	     * TEXT
	     **************************************************/
	
	    var DEFAULT_STYLE_NORMAL = 'normal';
	
	    var fontStyleCache = {};
	    var fontStyleCacheCount = 0;
	    var MAX_FONT_CACHE_SIZE = 100;
	    var fontEl = document.createElement('div');
	
	    var getFontStyle = function (fontString) {
	        var fontStyle = fontStyleCache[fontString];
	        if (!fontStyle) {
	            // Clear cache
	            if (fontStyleCacheCount > MAX_FONT_CACHE_SIZE) {
	                fontStyleCacheCount = 0;
	                fontStyleCache = {};
	            }
	
	            var style = fontEl.style;
	            var fontFamily;
	            try {
	                style.font = fontString;
	                fontFamily = style.fontFamily.split(',')[0];
	            }
	            catch (e) {
	            }
	
	            fontStyle = {
	                style: style.fontStyle || DEFAULT_STYLE_NORMAL,
	                variant: style.fontVariant || DEFAULT_STYLE_NORMAL,
	                weight: style.fontWeight || DEFAULT_STYLE_NORMAL,
	                size: parseFloat(style.fontSize || 12) | 0,
	                family: fontFamily || 'Microsoft YaHei'
	            };
	
	            fontStyleCache[fontString] = fontStyle;
	            fontStyleCacheCount++;
	        }
	        return fontStyle;
	    };
	
	    var textMeasureEl;
	    // Overwrite measure text method
	    textContain.measureText = function (text, textFont) {
	        var doc = vmlCore.doc;
	        if (!textMeasureEl) {
	            textMeasureEl = doc.createElement('div');
	            textMeasureEl.style.cssText = 'position:absolute;top:-20000px;left:0;'
	                + 'padding:0;margin:0;border:none;white-space:pre;';
	            vmlCore.doc.body.appendChild(textMeasureEl);
	        }
	
	        try {
	            textMeasureEl.style.font = textFont;
	        } catch (ex) {
	            // Ignore failures to set to invalid font.
	        }
	        textMeasureEl.innerHTML = '';
	        // Don't use innerHTML or innerText because they allow markup/whitespace.
	        textMeasureEl.appendChild(doc.createTextNode(text));
	        return {
	            width: textMeasureEl.offsetWidth
	        };
	    };
	
	    var tmpRect = new BoundingRect();
	
	    var drawRectText = function (vmlRoot, rect, textRect, fromTextEl) {
	
	        var style = this.style;
	        var text = style.text;
	        // Convert to string
	        text != null && (text += '');
	        if (!text) {
	            return;
	        }
	
	        var x;
	        var y;
	        var align = style.textAlign;
	        var fontStyle = getFontStyle(style.textFont);
	        // FIXME encodeHtmlAttribute ?
	        var font = fontStyle.style + ' ' + fontStyle.variant + ' ' + fontStyle.weight + ' '
	            + fontStyle.size + 'px "' + fontStyle.family + '"';
	
	        var baseline = style.textBaseline;
	        var verticalAlign = style.textVerticalAlign;
	
	        textRect = textRect || textContain.getBoundingRect(text, font, align, baseline);
	
	        // Transform rect to view space
	        var m = this.transform;
	        // Ignore transform for text in other element
	        if (m && !fromTextEl) {
	            tmpRect.copy(rect);
	            tmpRect.applyTransform(m);
	            rect = tmpRect;
	        }
	
	        if (!fromTextEl) {
	            var textPosition = style.textPosition;
	            var distance = style.textDistance;
	            // Text position represented by coord
	            if (textPosition instanceof Array) {
	                x = rect.x + parsePercent(textPosition[0], rect.width);
	                y = rect.y + parsePercent(textPosition[1], rect.height);
	
	                align = align || 'left';
	                baseline = baseline || 'top';
	            }
	            else {
	                var res = textContain.adjustTextPositionOnRect(
	                    textPosition, rect, textRect, distance
	                );
	                x = res.x;
	                y = res.y;
	
	                // Default align and baseline when has textPosition
	                align = align || res.textAlign;
	                baseline = baseline || res.textBaseline;
	            }
	        }
	        else {
	            x = rect.x;
	            y = rect.y;
	        }
	        if (verticalAlign) {
	            switch (verticalAlign) {
	                case 'middle':
	                    y -= textRect.height / 2;
	                    break;
	                case 'bottom':
	                    y -= textRect.height;
	                    break;
	                // 'top'
	            }
	            // Ignore baseline
	            baseline = 'top';
	        }
	
	        var fontSize = fontStyle.size;
	        // 1.75 is an arbitrary number, as there is no info about the text baseline
	        switch (baseline) {
	            case 'hanging':
	            case 'top':
	                y += fontSize / 1.75;
	                break;
	            case 'middle':
	                break;
	            default:
	            // case null:
	            // case 'alphabetic':
	            // case 'ideographic':
	            // case 'bottom':
	                y -= fontSize / 2.25;
	                break;
	        }
	        switch (align) {
	            case 'left':
	                break;
	            case 'center':
	                x -= textRect.width / 2;
	                break;
	            case 'right':
	                x -= textRect.width;
	                break;
	            // case 'end':
	                // align = elementStyle.direction == 'ltr' ? 'right' : 'left';
	                // break;
	            // case 'start':
	                // align = elementStyle.direction == 'rtl' ? 'right' : 'left';
	                // break;
	            // default:
	            //     align = 'left';
	        }
	
	        var createNode = vmlCore.createNode;
	
	        var textVmlEl = this._textVmlEl;
	        var pathEl;
	        var textPathEl;
	        var skewEl;
	        if (!textVmlEl) {
	            textVmlEl = createNode('line');
	            pathEl = createNode('path');
	            textPathEl = createNode('textpath');
	            skewEl = createNode('skew');
	
	            // FIXME Why here is not cammel case
	            // Align 'center' seems wrong
	            textPathEl.style['v-text-align'] = 'left';
	
	            initRootElStyle(textVmlEl);
	
	            pathEl.textpathok = true;
	            textPathEl.on = true;
	
	            textVmlEl.from = '0 0';
	            textVmlEl.to = '1000 0.05';
	
	            append(textVmlEl, skewEl);
	            append(textVmlEl, pathEl);
	            append(textVmlEl, textPathEl);
	
	            this._textVmlEl = textVmlEl;
	        }
	        else {
	            // 这里是在前面 appendChild 保证顺序的前提下
	            skewEl = textVmlEl.firstChild;
	            pathEl = skewEl.nextSibling;
	            textPathEl = pathEl.nextSibling;
	        }
	
	        var coords = [x, y];
	        var textVmlElStyle = textVmlEl.style;
	        // Ignore transform for text in other element
	        if (m && fromTextEl) {
	            applyTransform(coords, coords, m);
	
	            skewEl.on = true;
	
	            skewEl.matrix = m[0].toFixed(3) + comma + m[2].toFixed(3) + comma +
	            m[1].toFixed(3) + comma + m[3].toFixed(3) + ',0,0';
	
	            // Text position
	            skewEl.offset = (round(coords[0]) || 0) + ',' + (round(coords[1]) || 0);
	            // Left top point as origin
	            skewEl.origin = '0 0';
	
	            textVmlElStyle.left = '0px';
	            textVmlElStyle.top = '0px';
	        }
	        else {
	            skewEl.on = false;
	            textVmlElStyle.left = round(x) + 'px';
	            textVmlElStyle.top = round(y) + 'px';
	        }
	
	        textPathEl.string = encodeHtmlAttribute(text);
	        // TODO
	        try {
	            textPathEl.style.font = font;
	        }
	        // Error font format
	        catch (e) {}
	
	        updateFillAndStroke(textVmlEl, 'fill', {
	            fill: fromTextEl ? style.fill : style.textFill,
	            opacity: style.opacity
	        }, this);
	        updateFillAndStroke(textVmlEl, 'stroke', {
	            stroke: fromTextEl ? style.stroke : style.textStroke,
	            opacity: style.opacity,
	            lineDash: style.lineDash
	        }, this);
	
	        textVmlEl.style.zIndex = getZIndex(this.zlevel, this.z, this.z2);
	
	        // Attached to root
	        append(vmlRoot, textVmlEl);
	    };
	
	    var removeRectText = function (vmlRoot) {
	        remove(vmlRoot, this._textVmlEl);
	        this._textVmlEl = null;
	    };
	
	    var appendRectText = function (vmlRoot) {
	        append(vmlRoot, this._textVmlEl);
	    };
	
	    var list = [RectText, Displayable, ZImage, Path, Text];
	
	    // In case Displayable has been mixed in RectText
	    for (var i = 0; i < list.length; i++) {
	        var proto = list[i].prototype;
	        proto.drawRectText = drawRectText;
	        proto.removeRectText = removeRectText;
	        proto.appendRectText = appendRectText;
	    }
	
	    Text.prototype.brushVML = function (vmlRoot) {
	        var style = this.style;
	        if (style.text != null) {
	            this.drawRectText(vmlRoot, {
	                x: style.x || 0, y: style.y || 0,
	                width: 0, height: 0
	            }, this.getBoundingRect(), true);
	        }
	        else {
	            this.removeRectText(vmlRoot);
	        }
	    };
	
	    Text.prototype.onRemove = function (vmlRoot) {
	        this.removeRectText(vmlRoot);
	    };
	
	    Text.prototype.onAdd = function (vmlRoot) {
	        this.appendRectText(vmlRoot);
	    };
	}


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	
	
	if (!__webpack_require__(45).canvasSupported) {
	    var urn = 'urn:schemas-microsoft-com:vml';
	
	    var createNode;
	    var win = window;
	    var doc = win.document;
	
	    var vmlInited = false;
	
	    try {
	        !doc.namespaces.zrvml && doc.namespaces.add('zrvml', urn);
	        createNode = function (tagName) {
	            return doc.createElement('<zrvml:' + tagName + ' class="zrvml">');
	        };
	    }
	    catch (e) {
	        createNode = function (tagName) {
	            return doc.createElement('<' + tagName + ' xmlns="' + urn + '" class="zrvml">');
	        };
	    }
	
	    // From raphael
	    var initVML = function () {
	        if (vmlInited) {
	            return;
	        }
	        vmlInited = true;
	
	        var styleSheets = doc.styleSheets;
	        if (styleSheets.length < 31) {
	            doc.createStyleSheet().addRule('.zrvml', 'behavior:url(#default#VML)');
	        }
	        else {
	            // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
	            styleSheets[0].addRule('.zrvml', 'behavior:url(#default#VML)');
	        }
	    };
	
	    // Not useing return to avoid error when converting to CommonJS module
	    module.exports = {
	        doc: doc,
	        initVML: initVML,
	        createNode: createNode
	    };
	}


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * VML Painter.
	 *
	 * @module zrender/vml/Painter
	 */
	
	
	
	    var zrLog = __webpack_require__(21);
	    var vmlCore = __webpack_require__(94);
	
	    function parseInt10(val) {
	        return parseInt(val, 10);
	    }
	
	    /**
	     * @alias module:zrender/vml/Painter
	     */
	    function VMLPainter(root, storage) {
	
	        vmlCore.initVML();
	
	        this.root = root;
	
	        this.storage = storage;
	
	        var vmlViewport = document.createElement('div');
	
	        var vmlRoot = document.createElement('div');
	
	        vmlViewport.style.cssText = 'display:inline-block;overflow:hidden;position:relative;width:300px;height:150px;';
	
	        vmlRoot.style.cssText = 'position:absolute;left:0;top:0;';
	
	        root.appendChild(vmlViewport);
	
	        this._vmlRoot = vmlRoot;
	        this._vmlViewport = vmlViewport;
	
	        this.resize();
	
	        // Modify storage
	        var oldDelFromMap = storage.delFromMap;
	        var oldAddToMap = storage.addToMap;
	        storage.delFromMap = function (elId) {
	            var el = storage.get(elId);
	
	            oldDelFromMap.call(storage, elId);
	
	            if (el) {
	                el.onRemove && el.onRemove(vmlRoot);
	            }
	        };
	
	        storage.addToMap = function (el) {
	            // Displayable already has a vml node
	            el.onAdd && el.onAdd(vmlRoot);
	
	            oldAddToMap.call(storage, el);
	        };
	
	        this._firstPaint = true;
	    }
	
	    VMLPainter.prototype = {
	
	        constructor: VMLPainter,
	
	        /**
	         * @return {HTMLDivElement}
	         */
	        getViewportRoot: function () {
	            return this._vmlViewport;
	        },
	
	        /**
	         * 刷新
	         */
	        refresh: function () {
	
	            var list = this.storage.getDisplayList(true, true);
	
	            this._paintList(list);
	        },
	
	        _paintList: function (list) {
	            var vmlRoot = this._vmlRoot;
	            for (var i = 0; i < list.length; i++) {
	                var el = list[i];
	                if (el.invisible || el.ignore) {
	                    if (!el.__alreadyNotVisible) {
	                        el.onRemove(vmlRoot);
	                    }
	                    // Set as already invisible
	                    el.__alreadyNotVisible = true;
	                }
	                else {
	                    if (el.__alreadyNotVisible) {
	                        el.onAdd(vmlRoot);
	                    }
	                    el.__alreadyNotVisible = false;
	                    if (el.__dirty) {
	                        el.beforeBrush && el.beforeBrush();
	                        (el.brushVML || el.brush).call(el, vmlRoot);
	                        el.afterBrush && el.afterBrush();
	                    }
	                }
	                el.__dirty = false;
	            }
	
	            if (this._firstPaint) {
	                // Detached from document at first time
	                // to avoid page refreshing too many times
	
	                // FIXME 如果每次都先 removeChild 可能会导致一些填充和描边的效果改变
	                this._vmlViewport.appendChild(vmlRoot);
	                this._firstPaint = false;
	            }
	        },
	
	        resize: function (width, height) {
	            var width = width == null ? this._getWidth() : width;
	            var height = height == null ? this._getHeight() : height;
	
	            if (this._width != width || this._height != height) {
	                this._width = width;
	                this._height = height;
	
	                var vmlViewportStyle = this._vmlViewport.style;
	                vmlViewportStyle.width = width + 'px';
	                vmlViewportStyle.height = height + 'px';
	            }
	        },
	
	        dispose: function () {
	            this.root.innerHTML = '';
	
	            this._vmlRoot =
	            this._vmlViewport =
	            this.storage = null;
	        },
	
	        getWidth: function () {
	            return this._width;
	        },
	
	        getHeight: function () {
	            return this._height;
	        },
	
	        clear: function () {
	            if (this._vmlViewport) {
	                this.root.removeChild(this._vmlViewport);
	            }
	        },
	
	        _getWidth: function () {
	            var root = this.root;
	            var stl = root.currentStyle;
	
	            return ((root.clientWidth || parseInt10(stl.width))
	                    - parseInt10(stl.paddingLeft)
	                    - parseInt10(stl.paddingRight)) | 0;
	        },
	
	        _getHeight: function () {
	            var root = this.root;
	            var stl = root.currentStyle;
	
	            return ((root.clientHeight || parseInt10(stl.height))
	                    - parseInt10(stl.paddingTop)
	                    - parseInt10(stl.paddingBottom)) | 0;
	        }
	    };
	
	    // Not supported methods
	    function createMethodNotSupport(method) {
	        return function () {
	            zrLog('In IE8.0 VML mode painter not support method "' + method + '"');
	        };
	    }
	
	    var notSupportedMethods = [
	        'getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer', 'eachOtherLayer', 'getLayers',
	        'modLayer', 'delLayer', 'clearLayer', 'toDataURL', 'pathToImage'
	    ];
	
	    for (var i = 0; i < notSupportedMethods.length; i++) {
	        var name = notSupportedMethods[i];
	        VMLPainter.prototype[name] = createMethodNotSupport(name);
	    }
	
	    module.exports = VMLPainter;


/***/ }
/******/ ])
});
;