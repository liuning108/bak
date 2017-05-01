

Raphael.fn.chartsBarSet = function(config) {
	function rect(x,y,w,h){
      return ['M',x,y,'L',x+w,y,'L',x+w,y-h,'L',x,y-h,'z']
	}
    function getMax(datas){
    	if (!datas)return 0;
    	var index=0;
    	var max=datas[index];

    	for (var i=0;i<datas.length;i++){
    		if (max<datas[i]){
    			max=datas[i];
    			index=i;
    		}
    	}
        return {'max':max,'index':index};
    }
	if (!config)config={};
	var paper =this;
	var x=20;
    var y=1020
	var h=140;
	var w=150;
	var item_datas=[10,20,30,40];
	var item_colors=['#35464e','#69e2f3','#6da2aa','#ddfbfb'];
	var item_lables=['语音','增值','数据','短信'];
	var font ={'fill':'#ffffff','font-size':14,'font-family': '微软雅黑','font-weight':'bold'};
	var item_w=w/item_datas.length
	var maxobj = getMax(item_datas);
	var big_limit=maxobj.max+maxobj.max*0.1;
	
	for (var i =0;i<item_datas.length;i++){
		var data=item_datas[i];
		var item_x=x+(i*item_w)
		var per =data/big_limit;
		var color =item_colors[i]||'#35464e';
		var item=paper.path(rect(item_x,y,item_w,h*per)).attr({'fill':color,'stroke-width':0,'opacity':0.9});
		var label=paper.text(item_x+item_w/2,y+10,item_lables[i]).attr(font);
           
	}
   

    function setValues(datas){

    }
	

};