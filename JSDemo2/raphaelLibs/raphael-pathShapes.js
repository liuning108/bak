

Raphael.fn.pathCircle=function(x,y,r){
	   var s = 'M ' + 
            x + ',' + (y-r)+
            ' A ' + r + ',' + r +
            ' 45 1,1 ' + (x-0.1) + ',' + (y-r) +' z';
    return s;
}


Raphael.fn.pathLine=function(x1,y1,x2,y2){
	var s ='M '+
	        x1+','+y1+
	       'L'+
	        x2+','+y2;
	 return s;
}


Raphael.fn.sector=function(cx, cy, r, startAngle, endAngle, params) {
	    var paper =this;
     	var rad = Math.PI / 180;
        var x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
}

Raphael.fn.fRandomBy=function(under, over){ 
  	 return parseInt(Math.random()*(over-under+1) + under); 
 } 