

Raphael.fn.animateMatrix = function(config) {
	 if (!config)config ={};
   var x =config.x||0;
   var y =config.y||0;
   var paper =this;
   var matrix =[];
   var rect_style_bg={'stroke':'#74d5ed','stroke-width':1};
   var rect_style={'fill':'none','stroke-width':0};

   function drawItem(cx,cy){
      var item={};
      item.bg=paper.rect(cx,cy,20,10).attr(rect_style_bg);
      item.light=paper.rect(cx+10/3,cy+5/2,13,5).attr(rect_style);
      matrix[matrix.length]=item;
   }
   function drawGroup(x,y){
    drawItem(x,y);
    drawItem(x+20+3,y);

    drawItem(x+60,y);
    drawItem(x+60+20+3,y);
    drawItem(x+60+20+20+7,y);
    drawItem(x+60+20+20+20+9,y);

    drawItem(x+60+20+20+65,y);
    drawItem(x+60+20+20+65+20+5,y);
    drawItem(x+60+20+20+65+20+20+10,y);
    
    drawItem(x+60+20+20+65+20+20+45+3,y);
    drawItem(x+60+20+20+65+20+20+45+30+3,y);
    
   }
  
    drawGroup(x,y)
    drawGroup(x,y+15);
    drawGroup(x,y+40);
    drawGroup(x,y+40+15);
   
     var colors=['#59bacb','#f6603b','#ffcf11','#59bacb','#f6603b','#ffcf11'];

     function setPer(val){
      if (val>=80){
        colors=['#59bacb','#59bacb','#59bacb','#59bacb','#f6603b','#ffcf11','#59bacb','none'];
      }else if (val>=70){
        colors=['#59bacb','#59bacb','#59bacb','#ffcf11','#f6603b','#ffcf11','none','#59bacb'];
      }else if (val>=60){
          colors=['#59bacb','#59bacb','#f6603b','#ffcf11','#f6603b','#ffcf11','none','#59bacb'];
      }
     }
     setPer(80);
     function tick(){
        var index =paper.fRandomBy(0,matrix.length);
        var item =matrix[index];
        try{
            if (item){
               var index_c=paper.fRandomBy(0,colors.length);
               var color =colors[index_c];
               item.light.animate({'fill':color},100,function(){
                     tick();
               });
            }else{
              tick();
            }
        }catch(e){
          tick();
        }
     }
     tick();
     return {
       'setPer':setPer
     }

   
};