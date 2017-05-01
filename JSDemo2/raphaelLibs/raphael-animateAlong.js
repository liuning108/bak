/**
 * rect.animateAlong({
					path: paper.pathCircle(500,500,120),
					rotate: false,
					duration: 5000,
					easing: 'ease-out',
					debug: true,
					along:0
				},
				{
					along:1,
					opacity: 1
				},
				function() {
					 alert("OK");
				});
 */


Raphael.el.animateAlong = function(params, props, callback) {
	var element = this,
		paper = element.paper,
		path = params.path,
		rotate = params.rotate,
		duration = params.duration,
		easing = params.easing,
		debug = params.debug,
		alongparam  =params.along||0,
		isElem = typeof path !== 'string';
		element.path = 
		isElem
			? path
			: paper.path(path);
	element.pathLen = element.path.getTotalLength();
	element.rotateWith = rotate;
	
	element.path.attr({
		stroke: debug ? 'red' : isElem ? path.attr('stroke') : 'rgba(0,0,0,0)',
		'stroke-width': debug ? 2 : isElem ? path.attr('stroke-width') : 0
	});

	paper.customAttributes.along = function(v) {

		var point = this.path.getPointAtLength(v * this.pathLen),
			attrs = {
				x: point.x,
				y: point.y,
				cx:point.x,
				cy:point.y
			}
		this.rotateWith && (attrs.transform = 'r'+point.alpha);
		// TODO: rotate along a path while also not messing
		//       up existing transformations
		
		return attrs;
	};

	if(props instanceof Function) {
		callback = props;
		props = null;
	}
	if(!props) {

		props = {
			along: 1
		};
	} else {
		if (typeof(props.along) == "undefined"){
			props.along = 1;
		}
	}
	var startAlong = element.attr('along') || 0;
	element.attr({along: alongparam}).animate(props, duration, easing, function() {
		!isElem && element.path.remove();
		callback && callback.call(element);
	});
};