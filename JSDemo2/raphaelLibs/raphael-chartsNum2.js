Raphael.fn.chartsNum2 = function(config){
  	 if (!config)config ={};
     var x = config.x||820;
     var y = config.y||206;
     var max_limit=config.limit||999999;
     var max_num=config.maxnum||6;
     var size=config.size||60
     var color=config.color||'#f77047'
     var bwidth=size;
     var bh=size;
     var paper=this;
     var    fonts = [0, paper.getFont("20"), paper.getFont("2"), paper.getFont("3")];
     var gfont=fonts[2];
     var arraynums=paper.set();
     var initnum="";
     for (var i=0;i<max_num;i++){
         initnum+="0";
     }
     
     function createNumberText(val,x,y){
            var node ={};
               node.val=val;
               node.x=x;
               node.y=y;
               node.text= paper.print(node.x,node.y, node.val,gfont , size).attr({fill: "#fff"});   
               node.glow= node.text.glow({'color':color,width:20});
               arraynums.push(node.text,node.glow,node.rect);
               return node;
           
      }//end of createNumberText
      
     
     var nums
      
      function setNums(num){
          if (num>max_limit){
              num=max_limit;
          }
          var nums=""+num;
           
          if (nums.length<max_num){
              var k=max_num-nums.length;
              var s="";
              for (var i=0;i<k;i++){
                  s+="0";
              }
              nums=s+nums;
          }
                   
          
          arraynums.remove();
          arraynums=paper.set();
                for (var i=0;i<nums.length;i++){
                       createNumberText(nums[i],x+(i*(size-10))  ,y)
                }
      }
      
       
      setNums(initnum);
      return {
          'setNums':setNums
      }
     
     var obj_instance={};
    return  obj_instance;
}
