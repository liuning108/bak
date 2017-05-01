Raphael.fn.animLine=function(config){
	var x1=config.x1||520;
	var y1=config.y1||470;
	var x2=config.x2||810;
	var y2=config.y2||470;
    var pathLine =this.pathLine(x1,y1,x2,y2);
    this.path(pathLine).attr({'stroke':'#7dcad4','stroke-width':1});
    function anim(item,i){
			item.animateAlong({
						path:pathLine,
						rotate: true,
						duration: 2200+(i*100),
						easing: 'linear',
						along:0
					},
					{
						along:1,
						opacity: 1
					},
					function() {
						 anim(item,i);
					});
	         }//end of anim;

     var paper =this;
        var items=[];
        var colors=['#1bb699','#ffe168','#ff5f4f','#1f9585','#ffe168','#ff5f4f','#ff5f4f'];
		for (var i = 0;i<colors.length;i++){
	        items[i]=this.circle(x1,y1,4).attr({'fill':colors[i],'stroke-width':"0"})
	        setTimeout(anim(items[i],i),i+1000);        
        }

    return ;
}