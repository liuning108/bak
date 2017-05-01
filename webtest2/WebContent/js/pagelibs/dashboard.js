/*!
 *   dashboard.js
 *   仪表盘画布编辑 页面处理
 *   2017-3-5  刘宁 
 *     
 */
var g_dashboard={}; //仪表盘画布属性，方法

/*!
 * 仪表盘画布属性
 */
g_dashboard.id=null ;
g_dashboard.color='#f5f5f5';
g_dashboard.tabs={};
g_dashboard.gridchkboxflag=true;
g_dashboard.items={};
g_dashboard.style=1;
g_dashboard.isNew=true;
//屏幕的比例为64:36 (16:9)
g_dashboard.gnum=64;	

/*!
 *  仪表盘画布方法
 */

//页面初始
g_dashboard.init=function(data){
	

	g_dashboard.style=data.style;
	if (!g_dashboard.isNew){
		g_dashboard.id=data.id
		g_dashboard.name=data.name
	}else{
		g_dashboard.id=until.uuid();
		g_dashboard.name="仪表盘"
	}
	g_dashboard.canvasTabs(); //创建画布属性栏
	
	
	//创建画布
	var canvasPageWidth=$('#canvasPage').width();
	
	var grid=canvasPageWidth/g_dashboard.gnum;
	g_dashboard.grid=grid;
	$('#canvasPage').height(grid*36);
	  $('#canvasPage').resizable({
		  'grid': grid,
		  handles: 's',
	      'stop':function(){
	    	  g_dashboard.w=$('#canvasPage').width();
	    	  g_dashboard.h=$('#canvasPage').height();
	    	  if(g_dashboard.style==1){
	    	   until.createGrid($('#canvasPage'),g_dashboard.color);
	    	  }
	      }
	  });
	  until.createGrid($('#canvasPage'));
	  g_dashboard.w=$('#canvasPage').width();
	  g_dashboard.h=$('#canvasPage').height();
	  
	  for (var i =0;i<data.items.length;i++){
		  var item= data.items[i];
		 item.x=until.vmap(item.x,0,data.w,0,g_dashboard.w);
		 item.y=until.vmap(item.y,0,data.h,0,g_dashboard.h)
		 item.w=item.girdw*g_dashboard.grid;
		 item.h=item.girdh*g_dashboard.grid;
		  until.createGNewItem({
	    		options:item
	    	})
	  }
	 
	 
   
	
	//预览
	$("#perviewButton").on('click',function(){
		$('#editDiv').hide();
		var w=$("body").width();
	    var h=($("body").width()/g_dashboard.gnum)*36;
		var dashboard_win={
				'w':w,
				'h':h	
		      };
		$('#perviewDiv').width(dashboard_win.w);
		$('#perviewDiv').height(dashboard_win.h);
		$('body').addClass("previewBody");
		if(g_dashboard.style==2){
			$('#perviewDiv').css({'background':'url(images/bk1.jpg)  50% 50% / auto 100% no-repeat'})	
		}
	
		until.processDashBoard('#perviewDiv',g_dashboard,dashboard_win)
	}) //end of preview;
	
	$("#saveButton").on('click',function(){
		var array=[]
		for(var i in g_dashboard.items){
			var item=g_dashboard.items[i];
			var options=item.options;
			array.push(options);
		}
		g_dashboard.name=$("#boardName").val()
		$.ajax({
			  type: "POST",
			  url: "rest/dashboard/add",
			  data: JSON.stringify({'id':g_dashboard.id,'name':g_dashboard.name,'w':g_dashboard.w,'h':g_dashboard.h,'style':g_dashboard.style,"items":array}),
			  success: function(data){
				  alert('保存成功')
				  if(g_dashboard.isNew){
					  location.href="dashboard.html?id="+g_dashboard.id; 
				  }
			  },
			  error:function(XMLHttpRequest, textStatus, errorThrown){
				alert("error"+XMLHttpRequest.status);  
			  },
			  contentType: "application/json",
			});
		
	})
	
	$("#mylist").on("click",function(){
		location.href="index.html";
	})
  
  //图表创建 -start
    $("#character").on('click',function(){
    	until.createGNewItem({
    		options:{
    			  'type':'文字',
	    			  x:0,
	                  y:0,
	                  w:100,
	                  h:100,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}) //end of  #character just test
	
	 $("#gCircleTopNode").on('click',function(){
		 until.createGNewItem({
	    		options:{
	    			  'type':'文字状态饼图',
		    			  x:0,
		                  y:0,
		                  w:100,
		                  h:100,
	                  'targetDiv':'#canvasPage',
	                  'perview':false,
	    		}
	    	})
	}) //end of  #gCircleTopNode just test
	
	 $("#gCirclePerTopNode").on('click',function(){
		 until.createGNewItem({
	    		options:{
	    			  'type':'百分比状态饼图',
		    			  x:0,
		                  y:0,
		                  w:100,
		                  h:100,
	                  'targetDiv':'#canvasPage',
	                  'perview':false,
	    		}
	    	})
	}) //end of  #gCircleTopNode just test
	
	$("#gDoubleTopNode").on('click',function(){
		 until.createGNewItem({
	    		options:{
	    			  'type':'双指标图',
		    			  x:0,
		                  y:0,
		                  w:409,
		                  h:265,
	                  'targetDiv':'#canvasPage',
	                  'perview':false,
	    		}
	    	})
	}) //end of  #gCircleTopNode just test
	
	$("#xline").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'横线',
	    			  x:0,
	                  y:0,
	                  w:200,
	                  h:20,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}); //end of #xline 
	
	$("#yline").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'竖线',
	    			  x:0,
	                  y:0,
	                  w:20,
	                  h:200,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	});//end of  #yline
	
	$("#nums").on("click",function(){
		until.createGNewItem({
    		options:{
    			  'type':'整数值',
	    			  x:0,
	                  y:0,
	                  w:100,
	                  h:100,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	});//end of #nums
	
	$("#gBarCompNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'对比柱状图',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	})//end of gBarCompNode
	
	$("#gVerListNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'竖形列表',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}) // end of gVerListNode
	
	$("#gLanListNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'横向列表',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}); // end of  gLanListNode
	
	$("#gVerList2Node").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'竖向列表',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}) //end of gVerList2Node
	
	$("#gDoubleListNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'双值列表',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	})
	
	$("#gSingleListNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'单行列表',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}) //end of gSingleListNode
	
	$("#gPieNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'饼图',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	})
	
	$("#gProcessNode").on('click',function(){
		until.createGNewItem({
    		options:{
    			  'type':'流程',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	}) //end of gProcessNode
	
	$("#gLineNode").on("click",function(){
		until.createGNewItem({
    		options:{
    			  'type':'折线图',
	    			  x:0,
	                  y:0,
	                  w:245,
	                  h:320,
                  'targetDiv':'#canvasPage',
                  'perview':false,
    		}
    	})
	})
	//图表创建 -end
  
	

	
} //end of init;

//图表创建
g_dashboard.createGraph=function(url,fun){
	until.createGraph(url,fun);
}

//创建画布属性栏
g_dashboard.canvasTabs=function(){
	var canvasTabsInit=function(){
		//名称
		$("#boardName").val(g_dashboard.name);
		//风格
		$('#setW').click(function(){
			$('#canvasPage').css({'background':'#ffffff'});
			g_dashboard.color='#f5f5f5'
			g_dashboard.style=1;
			if(g_dashboard.gridchkboxflag){
			  until.createGrid($('#canvasPage'),g_dashboard.color);
			}
		
		})
		
		$('#setB').on('click',function(){
			$('#canvasPage').css({'background':'url(images/bk1.jpg) 50% 50% / auto 100% no-repeat'});
			g_dashboard.color='#343434'
			g_dashboard.style=2;
			$('#canvasPage').find('#grid').remove();
		})
		
		$('#gridchkBox').click(function(){
			var checked=$(this).prop("checked");
			g_dashboard.gridchkboxflag=checked;
			if(checked){
				until.createGrid($('#canvasPage'),g_dashboard.color);
			}else{
				$('#canvasPage').find('#grid').remove();
			}
		})
		
		 if(g_dashboard.style==2){
			 $('#setB').trigger("click");
		  }
	};
	$("#dashboardTabs").empty();
	//加载Tab面板
	if($('#canvasTabs').length<=0){
		$('#templates').load('templates/canvasTabs.html',function(){
		  $( "#canvasTabs" ).tmpl({}).appendTo( "#dashboardTabs" );
		   canvasTabsInit();
		})
	}else{
		 $( "#canvasTabs" ).tmpl({}).appendTo( "#dashboardTabs" );
		  canvasTabsInit();
	}
	
}
//添加一个元素
g_dashboard.canvasTabsAddItem=function(id,name){
	var $elems=$("#dashboardTabs").find('.canvasTabs_elems');
	$("<li id="+id+"><a href='#'>"+name+"</a></li>").appendTo($elems);
}
g_dashboard.canvasTabsRemoveItem=function(id){
	$(id).remove();
}

g_dashboard.resize=function(){
    var canvasPageWidth=$('#canvasPage').width();
	var grid=canvasPageWidth/g_dashboard.gnum;
	g_dashboard.grid=grid;
	$('#canvasPage').height(grid*36);
	console.log($('#canvasPage').height())
}

/**
 * 页面启动
 */
$(function(){
	 //创建仪表盘菜单
	$('#mega-menu-1').dcMegaMenu({
		rowItems: '3',
		speed: 0,	
		effect: 'slide',
		fullWidth: false
	});
	var id=until.getUrlParameter("id");
	//初始页面，从后台读取页面信息
	if (id=='new'){
		g_dashboard.isNew=true;
		g_dashboard.init({'style':1,items:[]});
	}else{
	$.ajax({
		  type: "get",
		  url: "rest/dashboard/get",
		  data: {'id':id},
		  success: function(data){
			 g_dashboard.isNew=false;
			 g_dashboard.init(data);
		  },
		});
	}
		
})



