/*!
 *   GCharacterNode
 *   创建文字图形
 *   2017-3-5  刘宁 
 *     
 */
var GCharacterNode=GNode.extend({
	//计算属性值 
	update : function() {
	    var text =this.options.text||'请输入文字';
		this.options.gx=this.options.w/2;
		this.options.gy=this.options.h/2;
		this.options.gsize=this.options.w/text.length;
	},
	//画画
	draw : function() {
        var paper=this.elements.paper;
        var text =this.options.text||'请输入文字';
        var color =this.options.color||"#FF0000";
     
        this.gtxt=paper.text(this.options.gx,this.options.gy,text).attr({'fill':color,'font-size':this.options.gsize,'font-family': '微软雅黑','font-weight':'bold'})
    },
    resize:function(){
      this.initElement();
    },
    gtxtResize:function(){
    	 this.gtxt.attr({'font-size':this.options.gsize})
    },
  //配置页面功能 
	pageConfig:function($pageHtml){
		self=this;
		//文本配置
		var $gtext=$pageHtml.find('#gCharaterNodeText');
		$gtext.val(this.options.text||'请输入文字');
		$gtext.on('change',function(){
			self.options.text=$(this).val();
			self.gtxt.attr({'text':$(this).val()});
		})
		//色彩配置
		var $gColor=$pageHtml.find('#gCharaterNodeColor');
		$gColor.val(this.options.color||'#FF0000');
		$gColor.on('change',function(){
			self.options.color=$(this).val();
			self.gtxt.attr({'fill':$(this).val()});
		})
		
	
	}

});