define([
    "text!oss_core/inms/pm/resMgr/templates/resGridLevel.html",
    "oss_core/inms/pm/resMgr/actions/action",
    "text!oss_core/inms/pm/resMgr/templates/resBtns.html",
  ],
  function(resTpl, action, resBtnsTpl) {
    var ResGirdLevel = function(props) {
      this.$el = $(props.el);
      this.props = props;
      this.tpl = fish.compile(resTpl);
      this.resBtnsTpl = fish.compile(resBtnsTpl);
    }
    ResGirdLevel.prototype = {
      render: function() {
        this.$el.html("");
        this.$el.html(this.tpl());
        this.afterRender();
      },
      afterRender: function() {
        this.levelspan = this.$el.find('.levelspan')
        this.stack={};
        this.rowId=null;
      },
      update: function(option) {
        this.option =option;
        console.log("ResGirdLevel option ",option)
        if(option.length<=1){
          this.rowId = null;
        }
        this.updateLevel(option);
        this.updateBtns(option)
      },
      updateLevel: function(option) {
        var str = "";
          console.log('updateLevel1',option)
        var jsonNames = fish.map(option, function(d) {
          return d.name;
        })
        console.log('updateLevel2',jsonNames)
        this.levelspan.html(jsonNames.join('>'));
      },
      updateBtns: function(option) {
        var self = this;
        var lastItem = option[option.length - 1];
        var isRoot=false
        if(option.length==1){
          isRoot=true;
        }
        if (lastItem) {
          action.getSubTreeData(lastItem.subIds).then(function(data) {
            var upItem=false;
            var items = [];
            var lastItems=[];
            if(!isRoot){
              upItem=lastItem;
            }
            console.log("upItem",upItem)

            fish.each(data.result, function(d,i) {

              console.log('hfjksdhk',d);
              if(i<=2){
                items.push({
                  'id': d.REL_ID,
                  'name': d.CAT_NAME,
                  'subIds': d.SUBIDS,
                  "code":d.CAT_CODE,
                  'tname':d.TNAME
                })
              }
              if(i>2){
                lastItems.push({
                  'id': d.REL_ID,
                  'name': d.CAT_NAME,
                  'subIds': d.SUBIDS,
                  "code":d.CAT_CODE,
                  'tname':d.TNAME
                })
              }

            })
            console.log('items items ',items)
            self.updateBtnsEvent(items,upItem,lastItems)
          });
        }
      },
      setRowId:function(id){
         this.rowId=id;
         if(this.rowId){
          this.$el.find('.res-btn').removeClass('disabled');
         }
      },
      updateInnerBtn:function(item){
        this.option.push(item);
        console.log('updateInnerBtn',this.option);
        this.update(this.option);
        this.stack[item.code] ={
             "item":item,
             "rowId":""+this.rowId
        }
        this.props.parent.subList(item,this.rowId);
      },
      updateUpInnerBtn:function(item){
          console.log("updateUpInnerBtn",this.option,item);
          this.option.pop();


          var up = fish.last(this.option);
          console.log('updateUpInnerBtn',this.option,this.stack)
          if(up && this.stack[up.code] ){
            var param = this.stack[up.code]
            this.props.parent.subList(param.item,param.rowId);
          }else{
            this.props.parent.getKpiList();
          }
          this.update(this.option);
      },
      updateBtnsEvent: function(items,upItem,lastItems) {
        var el = this.$el.find('.resBtns')
        var self =this;
        var isMore =lastItems.length>0?true:false;
        el.html(this.resBtnsTpl({
          "items":items,
          'upItem':upItem,
          'lastItems':lastItems,
          'isMore':isMore
        }));
        el.find('.res-action').off('click')
          .on('click',function(){
            if($(this).hasClass('disabled')){
              return;
            }
            var id = $(this).data('id');
            var name =$(this).data('name')
            var subIds= $(this).data('subids')
            var code= $(this).data('code');
            var tname= $(this).data('tname');
            self.updateInnerBtn({
               'id':id,
               'name':name,
               'subIds':subIds,
               'code':code,
               'tname':tname,
            });
          })
        //
        el.find('.res-up-action').off('click')
          .on('click',function(){
            if($(this).hasClass('disabled')){
              return;
            }
            var id = $(this).data('id');
            var name =$(this).data('name')
            var subIds= $(this).data('subids')
            var code= $(this).data('code');
            var tname= $(this).data('tname');
            self.updateUpInnerBtn({
               'id':id,
               'name':name,
               'subIds':subIds,
               'code':code,
               'tname':tname,
            });
          })
      }


    }
    return ResGirdLevel;
  })
