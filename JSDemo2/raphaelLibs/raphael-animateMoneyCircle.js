
Raphael.fn.animateMoneyCircle = function(config) {
	if (!config) config={};
    var x = config.x||0;
     var y = config.y||0;
     
     var paper=this;
     var width=3;	
     var speed =config.speed||1000;
    function createSectors(x,y,r,size1,size2,sectorsCount,mathpi,startAngle,vpathParams){
	     var beta=mathpi / sectorsCount;
	     var  sectors = paper.set();
	     var  pathParams = vpathParams;
	     for (var i = 0; i < sectorsCount; i++){
	          var alpha = (beta) * i+startAngle ;
	          var cos = Math.cos(alpha);
	          var sin = Math.sin(alpha);
	          var rr1=r+size1;
	          var rr2=r+size2;
	          sectors.push( paper.path([["M", x + rr1 * cos, y + rr1 * sin], 
	          	                       ["L", x + rr2 * cos, y + rr2 * sin],
	          	                       ]).attr(pathParams));
	     }
	     return sectors;
		
     }	

     var big_items_nums =26;
     var big_r = 26*5;
     var sectors1_style={stroke: '#153743', "stroke-width": big_items_nums-0.9	,'opacity':1};
     var big_sectors=createSectors(x,y,big_r,big_items_nums/1.7,big_items_nums/9,big_items_nums,Math.PI*2,-Math.PI/2,sectors1_style);
     var big_index=0;
     function setBigValue(max,value){
           var per = value/max;
           var nums=Math.round(big_sectors.length*per);
           if (nums>=big_index){
           	     for (var i=0;i<nums;i++){
           	        big_sectors[i].animate({'stroke':'#b7fff5'},100*i);
                 }
           }else{
                for (var i=nums;i<big_sectors.length;i++){
           	        big_sectors[i].animate({'stroke':'#153743'},100*i);
                 }
           }
           big_index=nums;

     }



     return {
     	'setBigValue':setBigValue,
     }
   
}