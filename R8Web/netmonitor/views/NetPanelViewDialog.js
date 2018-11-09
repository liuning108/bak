define([
  'text!oss_core/pm/netmonitor/templates/NetPanelViewDialog.html',
],
   function(tpl){
  var NetPanelViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  NetPanelViewDialog.prototype.content=function(props){
    this.$el=$(this.tpl({data:props.data}))
    return this.$el;
  }
  NetPanelViewDialog.prototype.popup=function(options,props,callback){
    options.content=this.content(props),
    this.$popup=fish.popup(options);
    this.props=props;
    this.callback=callback;
    this.afterPopup();
  }
  NetPanelViewDialog.prototype.afterPopup=function(){
    this.initGird()

  }
  NetPanelViewDialog.prototype.initGird=function(){
    var self =this;
    var coldatas=fish.map(this.props.data.datas,function(ds,index){
      var c={};
       for (var i =0;i<ds.length;i++){
          c['v'+i]=ds[i];
       }
      return c
    })
        console.log("initGird");
    console.log(coldatas);
    var colModels=fish.map(this.props.data.colTitles,function(d,index){

          var opt= {
             name:"v"+index,
             label:d,
             formatter:function(cellval, opts, rwdat, _act){
               if(cellval=='getD'){
                 return self.props.cd.datetimepicker('value');
               }else{
                 if (self.props.flag=='Q'){
                   if(index==self.props.data.colTitles.length-1){
                    return "连续<span style='color:red'>"+fish.random(3,15)+"</span>天出现"+cellval;
                   }else{
                     return cellval
                   }
                 }else {
                   return cellval
                 }

               }
             }
         }
         if (index==0){
           opt.width=100;
         }
         return opt;
    });
    var opt = {
     data: coldatas,
     height:400,
     width:1020,
     "colModel": colModels
    };
   $grid = this.$el.find("#lookDbSourceGird").jqGrid(opt);
   this.$el.find("#lookDbSourceGird").jqGrid("setGridWidth", opt.width-20);
  }
  return NetPanelViewDialog;
})
