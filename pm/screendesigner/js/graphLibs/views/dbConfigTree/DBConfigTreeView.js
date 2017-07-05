define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dbConfigTree.html",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/xLi.html",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/yLi.html",
    "css!oss_core/pm/screendesigner/css/dbconfigtree.css",


], function(tpl,tplXLi,tplYLi) {

    return portal.CommonView.extend({
        template: fish.compile(tpl),
        xLiTpl:fish.compile(tplXLi),
        yLiTpl:fish.compile(tplYLi),
        initialize: function(config) {
            this.config = config;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },

        renderDBtoHTML:function (el,db) {
            this.renderServerName(el,db);
            this.renderServerXAxis(el,db);
            this.renderServerYAxis(el,db);
        },
        renderServerName:function(el,db) {
           el.find('.dbServerName')
             .text(db.serverName);
        },

        renderServerXAxis:function (el,db) {
              var self =this;
              el.find('.xnums').text(db.xNums);
              el.find('.xAxisUL').empty();
              fish.each(db.xAxis,function(obj) {
                 $li = $(self.xLiTpl(obj)).appendTo(el.find('.xAxisUL'));
                 if(obj.choice=='y'){
                     $li.show();
                 }else{
                     $li.hide();
                 }

              });

        },

        renderServerYAxis:function(el,db) {
            var self =this;
            el.find('.ynums').text(db.yNums);
            el.find('.yAxisUL').empty();
            fish.each(db.yAxis,function(obj) {
                 $li = $(self.yLiTpl(obj)).appendTo(el.find('.yAxisUL'));
                 if(obj.choice=='y'){
                     $li.show();
                 }else{
                     $li.hide();
                 }
            });
        },
        renderBtn:function ($parent) {
            var self =this;
            $parent.find('.db_edit_btn').show()
                   .off('click')
                   .on('click',function() {
                      self.dbEdit($(this),$parent);
                   })
            $parent.find('.db_sure').hide()
                   .off('click')
                   .on('click',function() {
                      self.dbSure($(this),$parent);
                   })
            $parent.find('.db_cancel').hide()
                   .off('click')
                   .on('click',function() {
                     self.dbCancel($(this),$parent);
                   })
            $parent.find('.serverCommand').hide()
                   .find('.choiceDBSource')
                   .off('click')
                   .on('click',function() {
                       self.choiceDBSource($parent);
                   });
        },
        choiceDBSource:function($parent) {
             $parent.find('.db_edit_plane').show();

        },
        dbEdit:function(el,$parent){
           var self =this;
            el.hide();
            $parent.find('.db_sure').show();
            $parent.find('.db_cancel').show();
            $parent.find('.serverCommand').show();
            $parent.find('[data-choice=n]').show();

            fish.each($parent.find('.xAxisUL').find('[data-choice=y]'),function(dom,index) {
              $(dom).addClass('dbChoice').data('index',index);
            });
            fish.each($parent.find('.yAxisUL').find('[data-choice=y]'),function(dom,index) {
              $(dom).addClass('dbChoice').data('index',index);
            });

            $parent.find('.coa').text('所有数据字段');
            var xClickIndex=0;
            $parent.find('.xAxisUL').find('[data-choice]').off('click')
                   .on('click',function() {
                      self.choiceFieldByNums($(this),$parent,'.xAxisUL',self.config.db.xNums,xClickIndex++);
                   })

            var yClickIndex=0;
           $parent.find('.yAxisUL').find('[data-choice]').off('click')
                          .on('click',function() {
                              self.choiceFieldByNums($(this),$parent,'.yAxisUL',self.config.db.yNums,yClickIndex++);
                          })
        },
        choiceFieldByNums:function(el,$parent,className,nums,clickIndex) {
          if (el.hasClass("dbChoice")){
              el.removeClass('dbChoice');
          }else{
            var array=$parent.find(className).find('.dbChoice')
            minDom=fish.min(array,function(dom){
              return $(dom).data('index');
            })
            if(array.length>=nums){
              $(minDom).removeClass('dbChoice');
            }
            el.addClass('dbChoice');
            el.data("index",clickIndex);
          }
        },
        dbCancel:function (el,$parent) {
            el.hide();
            $parent.find('.db_edit_btn').show();
            $parent.find('.db_sure').hide();
            $parent.find('.serverCommand').hide();
            $parent.find('[data-choice=n]').hide();
            $parent.find('[data-choice=y]').removeClass('dbChoice');
            $parent.find('.db_edit_plane').hide();
            $parent.find('.coa').text('所选数据字段');

        },
        dbSure:function(el,$parent) {
            el.hide();

            $parent.find('.db_edit_btn').show();
            $parent.find('.db_cancel').hide();
            $parent.find('.serverCommand').hide();
            $parent.find('[data-choice=n]').hide();
            $parent.find('[data-choice=y]').removeClass('dbChoice');
            $parent.find('.db_edit_plane').hide();
            $parent.find('.coa').text('所有数据字段');

        },
        afterRender: function() {
            var self =this;
            var $parent = $(".db_panel_side");

            $fange = $('input[type=radio][name="dbServer"]');
            $fange.icheck();
            $parent.find('.db_edit_plane_sure').off('click')
                   .on('click',function() {
                       $parent.find('.db_edit_plane').hide();
                   })
            $parent.find('.db_edit_plane_cancel').off('click')
                          .on('click',function() {
                              $parent.find('.db_edit_plane').hide();
                          })



            this.renderBtn($parent);
            this.renderDBtoHTML($parent,this.config.db)

            var bodyOutH=$('body').outerHeight();
            var outH=bodyOutH*(0.9/2);
            $parent.find('.g_field_context').slimscroll({
                height:outH,
                axis:'y'
            });
        }


    })
});
