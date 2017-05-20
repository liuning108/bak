/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/SDCreateByExist.html",
        "text!oss_core/pm/screendesigner/templates/inst_item_copy.html",
        "oss_core/pm/screendesigner/actions/BScreenMgrAction",

    ],
    function(tpl,instItemTpl,BScreenMgrAction){
        return portal.BaseView.extend({
            className : "ui-dialog dialog SDdialog",
            template: fish.compile(tpl),
            initialize: function() {},
            events: {
                'click .sd_byexist_cancel':'sd_byexist_cancel',
                'click .add_employ_dashboard':'add_employ_dashboard'
            },
            add_employ_dashboard:function(){
                var self =this;
                var params ={};
                params.userId=portal.appGlobal.get("userId");
                params.id=0;
                self.trigger('copy',params);
            },
            sd_byexist_cancel: function() {
                this.trigger('cancel')
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            },

            resize: function(h) {

            },

            afterRender: function() {
                this.inst_item();
                return this;
            },
            inst_item:function(){
                var self =this;
                var userId=portal.appGlobal.get("userId")
                var parent=this.$el.find('.model_list');
                var inst_item=fish.compile(instItemTpl);
                BScreenMgrAction.queryBScreenListByUserID(userId,function(data){
                        var list =data.topiclist;
                        parent.empty();
                        fish.each(list,function(data){
                           data.operDate=fish.dateutil.format(new Date(data.operDate), 'yyyy-mm-dd hh:ii:ss');
                           var $inst_item=$(inst_item(data)).appendTo(parent);
                           self.inst_itemEvent($inst_item);
                           console.log("-----data");
                           console.log(data);
                           $inst_item.css(data.attrs.bk_attrs);
                        })
                }); //end of queryBScreenListByUserID();
            },//end of inst_item;
            inst_itemEvent:function($inst_item){
                var self =this;
                //使用事件
                $inst_item.find('.copy').off('click');
                $inst_item.find('.copy').on('click',function(){
                   var id=$(this).parent().data('id');
                   var params ={};
                   params.userId=portal.appGlobal.get("userId");
                   params.id=0;
                   params.copyId=id;
                   self.trigger('copy',params);
                   //self.parentView.edit(params);
                })// end of click
            }// end of inst_itemEvent


        });
    });
