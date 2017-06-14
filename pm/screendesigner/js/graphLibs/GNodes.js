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
     this.nodes = paper.chartsProcess({
        'x': x,
        'y': y,
        'colors':this.attrs.colors,
        'fontColor':this.attrs.fontColor,
        'keys': this.attrs.names
      })
      this.doms['nodes'] = this.nodes.allItem();


      if(this.attrs.switchWarring=="on"){
           this.createWaring(x,y);
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
    createWaring:function(x,y){
        var paper =this.paper;
        this.waring_arr=paper.set();
        this.doms['label_t1'] = paper.text(x + 235, y + 30, this.attrs.normalText).attr({
          'fill': '#02b7ec',
          'font-size': 18,
          'font-family': '微软雅黑',
          'font-weight': 'bold'
        })
        this.waring_arr.push(this.doms['label_t1']);

        this.doms['label_r1'] = paper.rect(x + 235 - 45, y + 20, 20, 20).attr({
          'fill': '#02b7ec',
          'stroke-width': 0
        })
        this.waring_arr.push(this.doms['label_r1']);

        this.doms['label_t2'] = paper.text(x + 235 + 75, y + 30, this.attrs.UrgencyText).attr({
          'fill': '#fcc314',
          'font-size': 18,
          'font-family': '微软雅黑',
          'font-weight': 'bold'
        })
        this.waring_arr.push(this.doms['label_t2']);
        this.doms['label_r2'] = paper.rect(x + 235 - 45 + 75, y + 20, 20, 20).attr({
          'fill': '#fcc314',
          'stroke-width': 0
        })
            this.waring_arr.push(this.doms['label_r2']);
        this.doms['label_t3'] = paper.text(x + 235 + 75 + 75, y + 30, this.attrs.RiskText).attr({
          'fill': '#ff0000',
          'font-size': 18,
          'font-family': '微软雅黑',
          'font-weight': 'bold'
        })
         this.waring_arr.push(this.doms['label_t3']);
        this.doms['label_r3'] = paper.rect(x + 235 - 45 + 75 + 75, y + 20, 20, 20).attr({
          'fill': '#ff0000',
          'stroke-width': 0
        })
        this.waring_arr.push(this.doms['label_r3']);
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
