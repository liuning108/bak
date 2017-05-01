Raphael.fn.chartsBarcode=function(config){
   if(!config)config={};
   var paper =this;
   var x  =config.x||1280;
   var y = config.y||236;
   var w = config.w||230;
   var h = config.h||54;
   var item_nums =config.item_nums||18;
   var item_space=config.item_space||0.8;
   var debug=config.debug||false;
   var removefont=config.removefont||false;
   var fontAttr=config.fontAttr||{'fill':'#fffee2','font-size':31,'font-family': '微软雅黑','font-weight':'bold'};
   var color =config.color||'#00b8ee'
   if (debug){paper.rect(x,y,w,h).attr({'stroke-width':'3','stroke':'red',})}
   var item_w = Math.round((w-(item_nums*item_space))/item_nums);
   var items=[];
   for (var i =0;i<item_nums;i++){
        var item=paper.rect(x+(i*(item_w+item_space)),y,item_w,h).attr({'stroke-width':'0','fill':color,'opacity':0.2});
        items[i]=item;
   }
   if (!removefont){
     var currentNum =paper.chartsNumbser({'x':x+(w/2)-5,'y':y+(h/2),'value':0,  attrs: fontAttr});
  }
   var show_nums=0;
   function setValue(max_nums,current_num){

       var per =current_num/max_nums;
       var  new_show_nums =Math.round(items.length*per);
         if (new_show_nums>show_nums){
           for (var i =0;i<new_show_nums;i++){
            try{
            items[i].animate({'opacity':1},i*200);
            }catch(e){
              console.log("big->error-->"+items[i]+"i:"+i)
            }
           }//end of for 
         }else{
           for (var i=items.length-1;i>=new_show_nums;i--){
               var temp=items.length-1-i;
                try{
                 items[i].animate({'opacity':0.2},temp*200);
               }catch(e){
                 console.log("samll-->error-->"+items[i]+"i:"+i)
               }
           }//end of for
         }
         show_nums=new_show_nums;
           if (!removefont){
              currentNum.setValue(current_num); 
         }
    }//end of setValue;
    

    return {
       'setValue': setValue
    }
  
} //end of chartsBarcode