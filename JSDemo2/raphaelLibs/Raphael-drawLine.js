Raphael.fn.drawLine=function(config){
	var x1=config.x1||520;
	var y1=config.y1||470;
	var x2=config.x2||810;
	var y2=config.y2||470;
	var color=config.color||'#a8e7ff';
	var removeflag =config.removeflag||false
	var opacity=config.opacity||0.9
	var w=config.w||1
	var r=2;
    var pathLine =this.pathLine(x1,y1,x2,y2);
    this.path(pathLine).attr({'stroke':color,'stroke-width':w,'opacity':opacity});
    if (!removeflag){
     this.circle(x1+r/2,y1+r/2,r).attr({'fill':'#a8e7ff'});
     this.circle(x2+r/2,y2+r/2,r).attr({'fill':'#a8e7ff'});
    }
    return ;
}