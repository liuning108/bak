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
            el.hide();
            $parent.find('.db_sure').show();
            $parent.find('.db_cancel').show();
            $parent.find('.serverCommand').show();
            $parent.find('[data-choice=n]').show();
            $parent.find('[data-choice=y]').addClass('dbChoice');
            $parent.find('.coa').text('所有数据字段');

            $parent.find('.xAxisUL').find('[data-choice]').off('click')
                   .on('click',function() {
                         $parent.find('.xAxisUL').find('li').removeClass('dbChoice');
                        $(this).addClass('dbChoice');
                   })

           $parent.find('.yAxisUL').find('[data-choice]').off('click')
                          .on('click',function() {
                               var array=$parent.find('.yAxisUL').find('.dbChoice')
                               $(array.get(0)).removeClass('dbChoice');
                               $(this).addClass('dbChoice');
                          })


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
