

function getRandom(under, over){ 
     return parseInt(Math.random()*(over-under+1) + under); 
  } 
function todayLoadNumberClass(paper,config){

	this.paper = paper;
	this.config = config;
	this.elements=[]
}

todayLoadNumberClass.prototype.add=function(element){
     this.elements[this.elements.length]=element;
}

todayLoadNumberClass.prototype.show=function(){
     //this.sum3gkpi=sum3gkpi;
		 //this.sum4gkpi=sum4gkpi;
	  for ( var i = 0 ;  i<this.elements.length ; i++){
	      this.darwElem(i);
	  }
	      var sum=this.getSum()
        // this.sum3gkpi.setValue({'value':sum.sum_3g,'rate':sum.rate3});
         //this.sum4gkpi.setValue({'value':sum.sum_4g,'rate':sum.rate4});

}

todayLoadNumberClass.prototype.darwElem = function(index){
        var element = this.elements[index];

        var rate =this.computingRate(element);

        var paper  = this.paper;
        var interval=index*this.config.element_distance;
       // var rect =paper.rect(this.config.x,this.config.y+interval,this.config.element_width,this.config.element_high);
       // rect.attr({'fill':'#104b6c','stroke-width':0,'fill-opacity':0.7});
       // var rect =paper.rect(this.config.x,this.config.y+interval+this.config.element_high+1,this.config.element_width,1);
       //rect.attr({'fill':'#00c8ff','stroke-width':0,'fill-opacity':1});


        var text= paper.text(this.config.x+10,this.config.y+interval+11,element.name);
        text.attr({'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'});
        text.attr({'font-size':18})

        var rect_3g =paper.rect(this.config.x+40,this.config.y+interval,(this.config.element_width-40)/2*rate.value3,this.config.element_high);
        rect_3g.attr({'fill':'#00a0e9','stroke-width':0,'fill-opacity':1});
        var rect_3g_value= paper.text(this.config.x+(this.config.element_width)/2-40/2,this.config.y+interval+11,element.value_3g);
        rect_3g_value.attr({'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'});
        rect_3g_value.attr({'font-size':20})
        element.rect_3g_value=rect_3g_value;
        element.rect_3g=rect_3g;


        var rect_4g =paper.rect(this.config.x+(this.config.element_width)/2+21,this.config.y+interval,(this.config.element_width-39)/2*rate.value4,this.config.element_high);
        rect_4g.attr({'fill':'#e89f21','stroke-width':0,'fill-opacity':1});
        var rect_4g_value= paper.text(this.config.x+(this.config.element_width)-35,this.config.y+interval+11,element.value_4g);
        rect_4g_value.attr({'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'});
        rect_4g_value.attr({'font-size':20})
        element.rect_4g_value=rect_4g_value;
        element.rect_4g=rect_4g;




        var rect =paper.rect(this.config.x+(this.config.element_width)/2+20,this.config.y+interval,2,this.config.element_high);
         rect.attr({'fill':'#ffffff','stroke-width':0,'fill-opacity':1});



}

todayLoadNumberClass.prototype.computingRate=function(element){

	     var sum =element.value_3g+element.value_4g;
	     var rate3 = Math.round(element.value_3g/sum*100);
	     var rate4 = Math.round(element.value_4g/sum*100);

          return {
          	 value3:rate3*0.01,
          	 value4:rate4*0.01,

          };
}


todayLoadNumberClass.prototype.getSum = function(){
	 var sum_3g=0;
	 var sum_4g=0;

	for ( var i = 0 ;  i<this.elements.length ; i++){
        var element = this.elements[i];
        sum_3g+=element.value_3g
        sum_4g+=element.value_4g
  }

   var sum =sum_3g+sum_4g;
   var rate3 = Math.round(sum_3g/sum*100);
   var rate4 = Math.round(sum_4g/sum*100);
   return {
   	      'sum_3g':sum_3g,
   	      'sum_4g':sum_4g,
   	      'rate3':rate3*0.01,
   	      'rate4':rate4*0.01
   }

}

todayLoadNumberClass.prototype.animate = function(sum3gkpi){
	var self = this;

	  function run (){

         for (var i =0 ; i<self.elements.length;i++){
         	        var element = self.elements[i];
         	        element.value_3g = getRandom(20,100);
         	        element.value_4g =getRandom(20,100);


         }


          for (var i =0 ; i<self.elements.length;i++){
         	        var element = self.elements[i];
         	         var rate =self.computingRate(element);
         	        element.rect_3g_value.attr({'text':element.value_3g});
         	        element.rect_4g_value.attr({'text':element.value_4g});
         	        var width_3g=(self.config.element_width-40)/2*rate.value3;
         	        var width_4g=(self.config.element_width-40)/2*rate.value4;
         	        element.rect_3g.animate({'width':width_3g},400);
         	        element.rect_4g.animate({'width':width_4g},400);
           }

           var sum =self.getSum();

             setTimeout(run,2000);
      }

      run();



}

function sumkpi(paper,config){
        this.paper =paper;
        this.config=config;
        this.element={};

}

sumkpi.prototype.show =function(){
  var self = this;
  var target_number = this.config.nums-Math.round(this.config.nums * this.config.rate);
      this.element.arrys=[];

  for (var i = 0 ; i<this.config.nums;i++){
      var rect = this.paper.rect(this.config.x ,this.config.y+(i*this.config.space_high),this.config.item_width,this.config.item_high,5);
      rect.attr({'fill':this.config.fill,'stroke-width':0});
       if (this.config.redfill && i>=0 && i<=2) {
        rect.attr({'fill':'red','stroke-width':0});
       }

       if (this.config.redfill && i>=3 && i<=5) {
        rect.attr({'fill':'yellow','stroke-width':0});
       }


      if (i<target_number){
        rect.attr({'fill-opacity':0.1});
      }else{
        rect.attr({'fill-opacity':1});
      }
      this.element.arrys[this.element.arrys.length]=rect;

  }

    var  trident=this.paper.path('M20.834,8.037L9.641,14.5c-1.43,0.824-1.43,2.175,0,3l11.193,6.463c1.429,0.826,2.598,0.15,2.598-1.5V9.537C23.432,7.887,22.263,7.211,20.834,8.037z')
    trident.attr({'fill':'yellow'});


    var trident_x = this.config.x;
    var trident_y = this.config.y+((target_number-1)*this.config.space_high)

    trident.attr({'transform': ['t',trident_x+this.config.item_width-10,trident_y+2,'s',0.5,0.5]});
    this.element.trident=trident;

     var lable_title= this.paper.text(trident_x+this.config.item_width+13+13,trident_y+30,this.config.currentvalue);
       lable_title.attr({'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'})
         lable_title.attr({'font-size':20})
         lable_title.attr({'fill':'#ffffff'})
         this.element.lable_title=lable_title;

}

sumkpi.prototype.setValue =function(element){
         var oldvalue=this.config.currentvalue;
         this.config.currentvalue=element.value;
         var disnums= Math.abs(element.value-this.config.currentvalue);
           var target_number = this.config.nums-Math.round(this.config.nums * element.rate);
           this.element.lable_title.attr({'fill-opacity':0});
           for (var i = 0 ; i<this.config.nums;i++){
                   var rect= this.element.arrys[i];
                    if (i<target_number){
              rect.animate({'fill-opacity':0.1},500);

              var trident_x = this.config.x+this.config.item_width-10;
                        var trident_y = this.config.y+((i)*this.config.space_high);
                        this.element.trident.animate({'transform': ['t',trident_x,trident_y,'s',0.5,0.5]},500);

            }else{

              rect.animate({'fill-opacity':1},1500);
                this.element.lable_title.attr({'text':element.value});
                this.element.lable_title.animate({'y':trident_y+30},500);
                this.element.lable_title.animate({'fill-opacity':1},500);
            }
           }

}
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}



