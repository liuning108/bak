var until={'version':1.0};
until.GTYPE={
	
	'文字':["js/classLibs/GCharacterNode.js",'GCharacterNode','templates/GCharacterNodeConfig.html'],
	'文字状态饼图':["js/classLibs/GCircleTopNode.js",'GCircleTopNode','templates/GCircleTopNodeConfig.html'],
	'百分比状态饼图':["js/classLibs/GCirclePerTopNode.js",'GCirclePerTopNode','templates/GCirclePerTopNodeConfig.html'],
	'双指标图':["js/classLibs/GDoubleTopNode.js",'GDoubleTopNode','templates/GDoubleTopNodeConfig.html'],
	'横线':["js/classLibs/GXLineNode.js",'GXLineNode','templates/GXLineNodeConfig.html'],
    '竖线':["js/classLibs/GYLineNode.js",'GYLineNode','templates/GXLineNodeConfig.html'],
    '整数值':["js/classLibs/GNumNode.js",'GNumNode','templates/GNumNodeConfig.html'],
    '对比柱状图':["js/classLibs/GBarCompNode.js",'GBarCompNode','templates/GBarCompNodeConfig.html'],
    '竖形列表':["js/classLibs/GVerListNode.js",'GVerListNode','templates/GVerListNodeConfig.html'],
    '横向列表':["js/classLibs/GLanListNode.js",'GLanListNode','templates/GLanListNodeConfig.html'],
    '竖向列表':["js/classLibs/GVerList2Node.js",'GVerList2Node','templates/GVerList2NodeConfig.html'],
    '双值列表':["js/classLibs/GDoubleListNode.js",'GDoubleListNode','templates/GDoubleListNodeConfig.html'],
    '单行列表':["js/classLibs/GSingleListNode.js",'GSingleListNode','templates/GSingleListNodeConfig.html'],
    '饼图':["js/classLibs/GPieNode.js",'GPieNode','templates/GPieNodeConfig.html'],
    '流程':["js/classLibs/GProcessNode.js",'GProcessNode','templates/GProcessNodeConfig.html'],
    '折线图':["js/classLibs/GLineNode.js",'GLineNode','templates/GLineNodeConfig.html'],
    
}



/*!
 * 创建网格背景
 */
until.createGrid=function(jdom,vcolor){
	var color=vcolor||'#f5f5f5';
	jdom.find('#grid').remove();
	var w=$('#canvasPage').width();
	var h=$('#canvasPage').height();
	var canvas=$('<canvas id="grid"/>').appendTo('#canvasPage');
	var ctx=canvas.get(0).getContext("2d");
	 canvas.get(0).width=w;
	 canvas.get(0).height=h;
	 ctx.clearRect(0, 0, w, h);
     ctx.beginPath();
     for (var x=0.5;x<w;x+=16){
    	 ctx.moveTo(x,0);
    	 ctx.lineTo(x,h);
     }
     
     for (var y=0.5;y<h;y+=16){
    	 ctx.moveTo(0,y);
    	 ctx.lineTo(w,y);
     }
	 ctx.strokeStyle = color;
	 ctx.stroke();
}

/*!
 * 生成UUID
 */
until.uuid=function(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    var uuid = s.join("");
    return uuid;
}
/*!
 *  结图表添加修改功能
 */
until.modiferAblity=function(self,v_g_dashboard){
	var $b=$("<div  class='c'>" +
			"<ul class='cul'>" +
			 "<li><a href='#' class='b_remove'>删除</a></li>"+ "<li><a href='#' class='b_config'>配置</a></li>"+
			 "</ul>"+
			"<div class='canvas'/>	" +
			"<div class='csize'></div>"+
			"</div>").appendTo(self.options.targetDiv);
	var $cul=$b.find('.cul');
	$cul.hide();
	  var $dom=$b.find('.canvas');
	    $b.width(self.options.w);
		$b.height(self.options.h);
		$b.css({'left': self.options.x, 'top': self.options.y});

		
if (!self.options.perview){
	//拖动
	$b.draggable({ containment: self.options.targetDiv,stop:function(){
		  self.options.x=$b.position().left;
    	  self.options.y=$b.position().top;
    	  console.log(self.options.x)
	} });
	//大小
    $b.resizable({
    	          grid: v_g_dashboard.grid,
    	          stop:function(){
    	        	  self.options.w=$b.width();
    	        	  self.options.h=$b.height();
    	        	  girdw=Math.floor(self.options.w/v_g_dashboard.grid);
    	        	  girdh=Math.floor(self.options.h/v_g_dashboard.grid);
    	        	  self.options.girdw=girdw;
   	        	      self.options.girdh=girdh;
    	        	  $b.find('.csize').text(girdw+"x"+girdh);
    	        	  
    	        	  self.resize();
    	          }
		         });
    $b.on('mouseover',function(){
   	 $cul.show();
   })
    $b.on('mouseout',function(){
   	 $cul.hide();
   })
    $b.find('.b_remove').on('click',function(){
 			self.remove();
 		})
 		$b.find('.b_config').on('click',function(){
 			var $body=$('#dashboardItemAttrbox').find('.modal-body');
 			$body.empty();
 			$body.load(self.options.configUrl,function(){
 				 self.pageConfig($body);//子类初始配置页面功能
 				 $('#dashboardItemAttrbox').modal('show');
 			})
 			
 		})
 		girdw=Math.floor(self.options.w/v_g_dashboard.grid);
    girdh=Math.floor(self.options.h/v_g_dashboard.grid);
    self.options.girdw=girdw;
    self.options.girdh=girdh;
    
    $b.find('.csize').text(girdw+"x"+girdh);
} else{
	$b.css({"border":"none"});
}//end of perivew check 

       self.elements.dom=$dom.get(0);
       self.elements.$dom=$b;		
	    
	   
 		    
}
/*！
 * 解析dashboard
 */

until.processDashBoard=function(target,v_dashboard,newDashwin){
	for (var itemIndex in v_dashboard.items ){
		var item= v_dashboard.items[itemIndex];
		item.options['targetDiv']='#perviewDiv';
		item.options.perview=true;
		item.options.x=until.vmap(item.options.x,0,v_dashboard.w,0,newDashwin.w);
		item.options.y=until.vmap(item.options.y,0,v_dashboard.h,0,newDashwin.h)
		var grid=newDashwin.w/v_dashboard.gnum;
		item.options.w=item.options.girdw*grid;
		item.options.h=item.options.girdh*grid;
		until.createGNewItem(item);
	}
}

/*！
 * 简单的Log
 */

until.log=function(message){
	if(true){
		console.log(message);
	}
}
/*!
 *  vmap 一个范围的数字映射成别一个范围
*/
until.vmap=function(value,istart,istop,ostart,ostop) {
   return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}


/*!
 * 创建图形
 */	
until.createGNewItem=function(self){
	until.createGraph(until.GTYPE[self.options.type][0],function(){
		 var _class=window[until.GTYPE[self.options.type][1]]
		 self.options.configUrl=until.GTYPE[self.options.type][2];
		 
		 var item=new _class(self.options);
	})
	
}


//图表创建
until.createGraph=function(url,fun){
	 $.getScript(url, function( data, textStatus, jqxhr ) {
         fun();
     }); //end of getScript
}

//创建分段
until.createSectors=function(paper,x,y,r,size1,size2,sectorsCount,mathpi,startAngle,vpathParams){
    var speed=1000
    var beta=mathpi / sectorsCount;
    var  sectors = [];
    var set=paper.set();
    var  pathParams = vpathParams;
    var  opacity = [];    
    for (var i = 0; i < sectorsCount; i++){
         var alpha = (beta) * i+startAngle ;
         var cos = Math.cos(alpha);
         var sin = Math.sin(alpha);
         var rr1=r+size1;
         var rr2=r+size2;
         opacity[i] = 1 / sectorsCount * i; 
         sectors[i] = paper.path([["M", x + rr1 * cos, y + rr1 * sin], ["L", x + rr2 * cos, y + rr2 * sin]]).attr(pathParams);
         set.push(sectors[i]);
    }
  function tick(){
     opacity.unshift(opacity.pop());
     for (var i = 0; i < sectorsCount; i++) {
         sectors[i].attr("opacity", opacity[i]);
       }
       setTimeout(tick, speed / sectorsCount);
    } //end of tick();
      tick();
      return set;
  }

//创建圆的路径
until.getCircleToPath=function(x,y,r){
	 var s = 'M ' + 
	    x + ',' + (y-r)+
	    ' A ' + r + ',' + r +
	    ' 45 1,1 ' + 
	    (x-0.1) + ',' + (y-r) + 
	    ' z';
	//console.log(s);
	return s;
}

// 生成随便数
until.fRandomBy=function(under, over){ 
   return parseInt(Math.random()*(over-under+1) + under); 
} 
//获得URL参数
until.getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

until.ajax=function(url,method,fun_success,fun_error){
	$.ajax({
		  type: "POST",
		  url: "rest/httpclient/ajax",
		  data: JSON.stringify({"url":url,"method":method}),
		  success: function(data){
			  fun_success(data);
		  },
		  error:function(XMLHttpRequest, textStatus, errorThrown){
			  fun_error(XMLHttpRequest, textStatus, errorThrown);
		  },
		  contentType: "application/json",
		});
}


