define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot",
  "oss_core/pm/screendesigner/js/graphLibs/views/GNodesView",
  "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsProcess",
], function(GRoot, View) {

  var GNodes = GRoot.extend({
    initElement: function() {
      var x = 0;
      var y = 0;
      var paper = this.paper;
     this.attrs.names = this.attrs.names || ['CRM下单', '服务单', '资源变更单', '流程启动', '派单', '归档']
     this.attrs.switchWarring=this.attrs.switchWarring||"on";
     this.attrs.normalText=this.attrs.normalText||'正常';
     this.attrs.UrgencyText=this.attrs.UrgencyText||'紧急';
     this.attrs.RiskText=this.attrs.RiskText||'危机';
     this.attrs.colors=this.attrs.colors||['#02b8ed', '#dca708', '#f70202'];
     this.attrs.fontColor=this.attrs.fontColor||"#fff";
     this.attrs.values=this.attrs.values||[50,70,90];
     this.nodes = paper.chartsProcess({
        'x': x,
        'y': y,
        'colors':this.attrs.colors,
        'fontColor':this.attrs.fontColor,
        'waring':this.attrs.values,
        'keys': this.attrs.names
      })
      this.doms['nodes'] = this.nodes.allItem();


      if(this.attrs.switchWarring=="on"){

          var box=this.doms['nodes'].getBBox(true);
           this.createWaring(x,y,box.width/3);
      };



      this.doms['config'] = this.paper.text(-10, 30, '配置').attr({
        'fill': 'red',
        'font-size': 18,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });
      this.doms['remove'] = this.paper.text(30, 30, '删除').attr({
        'fill': 'red',
        'font-size': 18,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });;
    },
    createWaring:function(x,y,w){
        var paper =this.paper;
        this.waring_arr=paper.set();
        var space=14;
        var box={
            'x':x+w,
            'y':y,
            'width':0,
            'height':0,
        }
        var texts =[this.attrs.normalText,this.attrs.UrgencyText,this.attrs.RiskText];

       var items=[];
        for (var i=0;i<texts.length;i++){
            var item=this.createIconTextItem(i,box,space,y,texts)
            items.push(item)
            this.waring_arr.push(item);
        }

        var boxW= this.getMaxBox(items,'width');
        for (var i=1;i<items.length;i++){
              var item =items[i];
              var tx=(boxW+space)*i;
              item.translate(tx,0);
        }



    },
    createIconTextItem:function(i,box,space,y,texts){
        var paper=this.paper;
        var item_x=box.x+box.width+space;
        var item=this.paper.set();
        // draw text
        this.doms['label'+i] = paper.text(item_x, y + 30, texts[i]).attr({
          'fill': this.getColors(i),
          'font-size': 18,
          'font-family': '微软雅黑',
          'font-weight': 'bold'
        })
        box =this.doms['label'+i].getBBox(true);
        //draw icon
        this.doms['icon'+i] = paper.rect(0, y + 20, 20, 20).attr({
          'fill': this.getColors(i),
          'stroke-width': 0
        })


        var iconBox=this.doms['icon'+i].getBBox();
        this.doms['icon'+i].attr({'x':box.x-(iconBox.width+space)});
        item.push(this.doms['label'+i]);
        item.push(this.doms['icon'+i]);
        return item;
    },
    getData: function() {
      var self = this;
      var datas = [];
      var sum = 0;
      for (var i = 0; i < this.attrs.names.length; i++) {
        var val = fish.random(10, 100);
        datas.push({
          name: this.attrs.names[i],
          value: val
        })
        sum += val;
      }
      this.nodes.inputData(datas);
    },
    getMaxBox:function(items,name){
        var max =items[0].getBBox()[name];
        for (var i=1;i<items.length;i++){
            if(max<items[i].getBBox()[name]){
                max=items[i].getBBox()[name]
            }
        }
        return max
    },
    initLocation: function() {
      this.ft.attrs.translate.x = 20;
      this.ft.attrs.translate.y = 30;
    },
    getNames:function(){
     return this.attrs.names;
    },
    setNames:function(names){
      this.attrs.names=names;
      this.redraw();
    },
    setSwitchWarring:function(checked){
          this.attrs.switchWarring=checked?'on':'off';
          this.redraw();
    },
    getSwitchWarring:function(){
        return  this.attrs.switchWarring;
    },
    getNormalText:function(){
      return this.attrs.normalText;
    },
    setNormalText:function(val){
      this.attrs.normalText=val;
      this.redraw();
    },
    getUrgencyText:function(){
      return this.attrs.UrgencyText;
    },
    setUrgencyText:function(val){
        this.attrs.UrgencyText=val;
        this.redraw();
    },
    getRiskText:function(){
      return this.attrs.RiskText;
    },
    setRiskText:function(val){
      this.attrs.RiskText=val;
      this.redraw();
    },
    getColors:function(index){
        return this.attrs.colors[index];
    },
    setColors:function(index,color){
        this.attrs.colors[index]=""+color;
        this.redraw();
    },
    getDefaultWaringColor:function(){
        return ['#02b8ed', '#dca708', '#f70202']
    },
    getValues:function(){
      return this.attrs.values;
    },
    setValues:function(index,val){
       this.attrs.values[index]=val;
       this.redraw();
    },
    getFontColors:function(){
      return this.attrs.fontColor;
    },
    setFontColors:function(color){
      this.attrs.fontColor=""+color;
      this.redraw();
    },
    addEvent: function() {
      var self = this;
      // TODO:配置属性(node)
      this.doms['config'].click(function(e) {
        var view = new View(self);
        view.render();
        var $panel = $('.configPanel');
        $panel.html(view.$el.html());
        view.afterRender();
        e.stopImmediatePropagation();
      });


      // TODO:配置删除(node)
      this.doms['remove'].click(function(e) {
        fish.confirm('确认是否删除该组件').result.then(function() {
          self.remove();
        });
        e.stopImmediatePropagation();
      }) //end of remove

    }

  })

  return GNodes;


})
