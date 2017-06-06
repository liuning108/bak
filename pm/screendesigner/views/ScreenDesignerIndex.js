/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerIndex.html",
        "text!oss_core/pm/screendesigner/templates/inst_item.html",
        "oss_core/pm/screendesigner/views/SDCreateByExist",
        "oss_core/pm/screendesigner/actions/BScreenMgrAction",
        

    ],
    function(tpl,instItemTpl,SDCreateByExist,BScreenMgrAction) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(options) {
                this.parentView=options.parentView;
            },
            events: {
                'click .add_dashboard': 'add_dashboard',
                'click .add_dashboardFromExist':'add_dashboardFromExist'
            },

            render: function() {
                this.$el.html(this.template());
                return this;

            },

            add_dashboardFromExist:function(){
                var view =new SDCreateByExist().render();
                var w = 1024;
                var options = {
                       width:w,
                       modal: false,
                       draggable: false,
                       content: view.$el,
                       autoResizable: true,
                       modal: true
                };
                   var popup = fish.popup(options);
                   this.listenTo(view,'cancel',function(){
                       popup.close();
                   })
                   this.listenTo(view,'copy',function(params){
                       popup.close();
                       this.parentView.edit(params);
                   })
            },

            resize: function(h) {
            //var height = $('body').height()-80;
            //    $('#SDIndex').height(height);
            },

            add_dashboard: function() {
              var params ={};
              params.userId=portal.appGlobal.get("userId");
              params.id=0;
              this.parentView.edit(params);
            },
            afterRender: function() {
                 var height = $('body').height()-80;
                $('#SDIndex').css({'minHeight':height});
                this.inst_item();
                return this;
            },
              // TODO: topiclist初始页面(done)
            inst_item:function(){

                var self =this;
                var userId=portal.appGlobal.get("userId")
                var parent=this.$el.find('.model_list');
                var inst_item=fish.compile(instItemTpl);
                BScreenMgrAction.queryBScreenListByUserID(userId,function(data){
                        var list =data.topiclist;
                        parent.empty();
                        fish.each(list,function(data){
                          data.operDate=data.operDate.replace('.0','');  //IE,firefox只支持 带参格式"/"
                          data.operDate=data.operDate.replace(/-/g,'/'); //IE,firefox只支持yyyy/mm/dd 带参格式"/"
                          data.operDate=fish.dateutil.format(new Date(data.operDate), 'yyyy/mm/dd hh:ii:ss');
                           var $inst_item=$(inst_item(data)).appendTo(parent);
                           if(data.attrs.bk_attrs){
                             $inst_item.find('.inst_top_pic').css(data.attrs.bk_attrs);
                           }
                           self.inst_itemEvent($inst_item)
                        })
                }); //end of queryBScreenListByUserID();
            },//end of inst_item
           // TODO: topiclist初始事件(done)
            inst_itemEvent:function($inst_item){
                var self =this;
                //删除事件
                $inst_item.find('.delete').off('click');
                $inst_item.find('.delete').on('click',function(){
                      var id=$(this).parent().data('id');
                      fish.confirm('确认是否删除该选项').result.then(function() {
                          BScreenMgrAction.deleteBScreenById(id,function(){
                              $('#item_'+id).remove();
                          })
                      });
                }); //end of click
                //编辑事件
                $inst_item.find('.edit').off('click');
                $inst_item.find('.edit').on('click',function(){
                   var id=$(this).parent().data('id');
                   var params ={};
                   params.userId=portal.appGlobal.get("userId");
                   params.id=id;
                   self.parentView.edit(params);
                })// end of click

               //预览事件
               $inst_item.find('.preview').off('click');
               $inst_item.find('.preview').on('click',function(){
                     var id=$(this).parent().data('id');
                     BScreenMgrAction.queryBScreenById(id,function(data){
                            var json = data.topicJson;
                            var id=fish.getUUID();
                            fish.store.set(id, json);
                            window.open("oss_core/pm/screendesigner/perview.html?id="+id);
                     })

               })//en of click;

            }
        });
    });
