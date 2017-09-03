define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GTableBaseView"
], function(GRoot, View) {

    var GTableBase = GRoot.extend({
        initAttrs: function() {
            this.attrs.dbServer = this.attrs.dbServer||{
                                                            'serverName':'NetworkOverviewDemoQryService',
                                                            'islocal':true,
                                                            'xAxis':['field_1'],
                                                            'yAxis':['field_2','field_3'],
                                                            'xNums':99,
                                                            'yNums':99,
                                                            'xMinNums':0,
                                                            'yMinNums':1
                                                        }
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            this.attrs.titleColor = this.attrs.titleColor || '#ddff00';
            this.attrs.divideColor = this.attrs.divideColor || '#006598';
            this.attrs.valueColor=this.attrs.valueColor||'#fff';
            var paper = this.paper;
            var x = 0;
            var y = 0;
            var space = 50;
            this.attrs.titles = this.attrs.titles || ['地区', '3G', '4G'];
            this.attrs.isSeqPos = this.attrs.isSeqPos || 1;
            this.attrs.seqColor = this.attrs.seqColor || '#beb148';
            this.attrs.seqName  =  this.attrs.seqName || "序号";
            this.attrs.seqShow =this.attrs.seqShow || 'on'

          this.Data2Graph();


            //this.attrs.titles.push('序号');


            var condiFmts = JSON.parse(this.attrs.condiFmtItemList||'[]')
            console.log("condiFmts");
            console.log(condiFmts);
            var heardes = this.attrs.titles;
            if (this.attrs.seqShow=='on'){
                if (this.attrs.isSeqPos == 1) {
                    heardes = [this.attrs.seqName].concat(heardes);
                } else {
                    heardes = heardes.concat([this.attrs.seqName]);
                };
            }
            console.log(heardes);
            console.log("----------");
            var datas =this.attrs.datas || [
                ['长沙', fish.random(800, 999), fish.random(800, 999)],
                ['株洲', fish.random(700, 800), fish.random(700, 800)],
                ['湘潭', fish.random(600, 700), fish.random(600, 700)],
                ['邵阳', fish.random(500, 600), fish.random(500, 600)],
                ['岳阳', fish.random(400, 500), fish.random(400, 999)],
                ['常德', fish.random(300, 400), fish.random(300, 400)],
                ['益阳', fish.random(200, 300), fish.random(200, 300)],
                ['娄底', fish.random(100, 200), fish.random(100, 200)],
                ['郴州', fish.random(90, 100), fish.random(90, 100)],
                ['衡阳', fish.random(80, 90), fish.random(80, 90)],
            ]
            this.attrs.datas =datas;

            var set = paper.set();
            var maxBoxW=this.getHearderMaxBox(heardes);
            var item_box;
            for (var i = 0; i < heardes.length; i++) {
                var name = heardes[i];
                var item_x = x + (i * (space+maxBoxW));
                this.doms['header' + i] = paper.text(item_x, y, name).attr({
                    'fill': this.attrs.titleColor,
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                })
                item_box = this.doms['header' + i].getBBox();
                set.push(this.doms['header' + i])
            }
            var box = set.getBBox();

            this.titlesSet = set;
            this.doms['headerLine'] = paper.rect(x - item_box.width, y + box.height, box.width + item_box.width, 1).attr({
                'stroke': this.attrs.divideColor,
                'stroke-width': 1
            });
            var data_x = x;
            var data_y = y + box.height + box.height;
              console.log("adhsahkjdhkjdhasjkdasjhj");

            for (var i = 0; i < datas.length; i++) {
                var data;
                if (this.attrs.seqShow=='on'){
                    if (this.attrs.isSeqPos == 1) {
                        data = ([i + 1]).concat(datas[i]);
                    } else {
                        data = (datas[i]).concat([i + 1]);
                    }
                }else{
                    data=datas[i];
                }

                var item_x = data_x;
                var item_y = data_y + (box.height * i);

                for (var j = 0; j < data.length; j++) {

                    var j_x = data_x + (j * (space+maxBoxW));
                    var color = this.attrs.valueColor;
                    if (this.attrs.seqShow=='on'){
                        if (j == data.length - 1 && this.attrs.isSeqPos == 2) color = this.attrs.seqColor;
                        if (j == 0 && this.attrs.isSeqPos == 1) color = this.attrs.seqColor;
                    }

                    var color2 =  this.getColorByCondiFmts(heardes[j], data[j],condiFmts)
                    this.doms['data' + i + '_' + j] = paper.text(j_x, item_y, data[j]).attr({
                        'fill': color2||color,
                        'font-size': 18,
                        'font-family': '微软雅黑',
                        'font-weight': 'bold'
                    })

                }

            }
            this.doms['config'] = this.paper.text(100, -30, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(160, -30, 'X').attr({
                'fill': 'red',
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        getColorByCondiFmts:function(name,value,condiFmts) {
            var codi = fish.find(condiFmts,function(codi) {
               return codi.KPI_INDEX==name
            });
            if(codi){

              if(codi.KPI_FMT=="GT"){
                 if(value>codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }
              if(codi.KPI_FMT=="BT"){
                 var values= codi.KPI_VALUE.split('~');
                 if(value>=values[0] && value<=values[1]){
                     return codi.KPI_COLOR
                 }
                 return null;
              }
              if(codi.KPI_FMT=="EQ"){
                 if(value==codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }

              if(codi.KPI_FMT=="NEQ"){
                 if(value!=codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }


              if(codi.KPI_FMT=="LW"){
                 if(value<codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }

              if(codi.KPI_FMT=="GE"){
                 if(value>=codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }


              if(codi.KPI_FMT=="LE"){
                 if(value<=codi.KPI_VALUE){
                    return codi.KPI_COLOR
                 }
                 return null;
              }

              return null;
            }else {
              return null;
            }
        },
        getDatas:function() {
            return this.attrs.datas;
        },
        setDatas:function(datas) {
           this.attrs.datas=datas;
        },
        setSeqShow:function(val){
          this.attrs.seqShow=val;
          this.redraw();
        },
        getSeqShow:function(){
            return this.attrs.seqShow;
        },
        setSeqColor:function(color){
            this.attrs.seqColor=""+color;
            this.redraw();
        },
        getSeqColor:function(){
            return this.attrs.seqColor;
        },
        getSeqName:function(){
            return this.attrs.seqName;
        },
        setSeqName:function(val){
            this.attrs.seqName = val;
            this.redraw();
        },
        setSeqPos: function(val) {

            this.attrs.isSeqPos = val

            this.redraw();
        },
        getSeqPos: function() {
            return this.attrs.isSeqPos;
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitleColor: function(color) {
            this.titlesSet.attr({
                'fill': "" + color
            });
            this.attrs.titleColor = "" + color;
        },
        getTitle: function() {
            return this.attrs.titles;
        },
        setTitle: function(titles) {
            this.attrs.titles = titles;

        },
        getDivideColor: function() {
            return this.attrs.divideColor;
        },
        setDivideColor: function(color) {
            this.doms['headerLine'].attr({
                'stroke': "" + color
            })
            this.attrs.divideColor = "" + color;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },

        toGraph:function(choiceTreeJson) {
          try {
            var array = choiceTreeJson.xAxis.concat( choiceTreeJson.yAxis)
            var labels =fish.pluck(array,'label')
            var mids =fish.pluck(array,'data');
            var datas=fish.zip.apply(null,mids)
            var json = {};
            json.xAxis={};
            json.series={};
            json.xAxis.data=labels;
            json.series.data=datas;
            this.setTitle(json.xAxis.data);
            this.setDatas(json.series.data);
          }catch(e){
            console.log("GTableBase ToGraph");
            console.log(choiceTreeJson);
          }

        },

        getHearderMaxBox:function (names) {
          var paper = this.paper;
          var name =fish.max(names,function(name) {
              return name.length;
          });
          var text = paper.text(0, 0, name).attr({
              'fill': this.attrs.titleColor,
              'font-size': 12,
              'font-family': '微软雅黑',
              'font-weight': 'bold'
             });
          var box =text.getBBox();
          text.remove();
          return box.width;

        },
        addEvent: function() {
            if (!this.doms['config']) return;
            var self = this;
            // TODO:配置属性(node)
              var view = new View(self);
            this.doms['config'].click(function(e) {
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
                e.stopImmediatePropagation();
            });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm(view.resource.ISDEL).result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GTableBase;


})
