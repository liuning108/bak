

Raphael.fn.animateDatabar = function(config) {
	 if (!config)config ={};
      var paper=this;
      var x = config.x||0;
      var y =config.y||0;
      var w =config.w||0;
      var h =config.h||0;
      var item_nums = config.item_nums||18;
      var item_space = config.item_space||0.8;
      var color=config.color||'#00feff';
      var current_value=0;
      var max =current_value;
      var index =0; 
      var items =[];
      var items_rects=[];
      var item_w =Math.round(w/item_nums); 
      function updteall(){
          for (var i=0;i<items_rects.length;i++){
                var per =items[i]/max;
                var item_h=Math.round(h*per);
                try{
                items_rects[i].attr({'height':item_h});
                   }catch(e){}
              }      
      }

      function pushValue(num){
         if (num>max){
               max=num;
               updteall();
         };
         if (index>=item_nums){
            items.shift();
             index--;
           updteall();
           
         }
         items[index]=num;
         var cx=x+(index*item_w)+item_space;
         var cy=y;
         current_value=num;
         var per =num/max
         var item_h=Math.round(h*per);
         if (!items_rects[index]){
            items_rects[index]=paper.rect(cx,cy,item_w,item_h).attr({'fill':color});
         }
         index++;
      }

      return {
           'pushValue':pushValue
      }

      
};