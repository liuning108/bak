Raphael.fn.chartsListBar = function(config){
  var paper =this;
  var inst = {};
  inst.config={};
  inst.styles={};
  inst.items=[];
  inst.config.x=config.x;
  inst.config.y=config.y;
  inst.config.keys=config.keys;
  inst.config.item_space=config.item_space||25;
  inst.config.width=config.width||70;
  inst.styles.labelFontStyle={'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}
  inst.styles.rectStyle={'stroke-width':0,'stroke':'none','fill':'#0c0c0c'};
  inst.styles.processStyle={'stroke-width':0,'stroke':'none','fill':'#feff3b'};

  inst.styles.valueFontStyle={'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'}

   //for 
   for (var i =0 ;i<inst.config.keys.length;i++){   
          var item={};
          item.key = inst.config.keys[i];
          item.value=0;
          item.x=inst.config.x-10;
          item.y=inst.config.y+(i*inst.config.item_space);
          item.label=paper.text(item.x,item.y,item.key).attr(inst.styles.labelFontStyle);
          item.rect=paper.rect(item.x+32,item.y,inst.config.width,8,4).attr(inst.styles.rectStyle);
          item.process=paper.rect(item.x+32,item.y,inst.config.width*0.01,8,4).attr(inst.styles.processStyle)
          item.process.glows=item.process.glow({'color':'#feff3b'});
          item.nums=paper.chartsNumbser({'x':item.x+32+105,'y':item.y,'value':item.value,
                                           attrs: inst.styles.valueFontStyle
                                       }); 
          inst.items.push(item);
  }

  inst.inputData=function(datas){
     var max=getMax(datas);
     var limt_max= Math.floor(max+(max*0.1));
     
     for (var i =0 ;i<inst.items.length;i++){
      var item = inst.items[i];
          item.value=findValueByKey(datas,item.key);
          item.nums.setValue(item.value);
          var per=item.value/limt_max;
          item.process.glows.remove();
          item.process.animate({'width':inst.config.width*per},1000,function(){
            this.glows=this.glow({'color':'#feff3b'});
          });
     }
     
  }

  function findValueByKey(datas,key){
    for (var i =0;i<datas.length;i++){
      if (datas[i].name==key){
        return datas[i].value;
      }
    }

  }

  function getMax(datas){
    var max =datas[0].value||-99999;
    for (var i=0;i<datas.length;i++){
        if(datas[i].value>max){
          max=datas[i].value;
        }
     } 
    return max;
  }//end of max;


  return inst;
}


