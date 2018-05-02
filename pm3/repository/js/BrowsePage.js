
portal.define([
  'text!oss_core/pm/repository/templates/BrowsePageView.html',
  'text!oss_core/pm/repository/templates/comment.html',
  "oss_core/pm/repository/actions/Action.js",
  "oss_core/pm/repository/js/attachTool.js",

],function(tpl,comment,action,attachTool){
     return {
       browserTpl:fish.compile(tpl),
       commentTpl:fish.compile(comment),
       show:function($el,json,parent,queryObj,fflag){
         this.$el=$el;
         this.json=json;
         this.parent=parent;
         this.queryObj=queryObj;
         this.fflag=fflag;
         this.render();
       },
       render:function(){
          var self =this;
          this.json.stateName=(this.json.state=='00')?'草稿':'已发布';
          console.log("BrowsePage");
          console.log(self.json);
          this.$el.html(this.browserTpl(this.json));
          this.afterRender();
       },
       afterRender:function(){
         var self =this;
         self.$el.find('.body').html(self.json.context);
         self.$el.find('.comebackList').on('click',function(){
           self.parent.comeback(self.queryObj,self.fflag);
         })
         self.$el.find('.attachIcon').on('click',function(){
          var docId= $(this).data('docid');
          attachTool.show(docId);
         })
         self.resizeHight();
         this.VEvent('.VHC');
         this.VEvent('.VNC');
         console.log("portal");
         var shortName=portal.appGlobal.get('userCode').substr(0,2);
         self.$el.find('.knowledgeInfo_shortName').text(shortName);
         this.clearMessageEvent();
         this.addMessageEvent();
         this.queryMessageList(self.json.id);

       },
       addMessageEvent:function(){
          var self =this;
          self.$el.find('.addMessage').off('click').on('click',function(){
              var id =$(this).data('id');
              var isPublic=self.$el.find('.isPublicCheckBox').is(':checked');
              isPublic =(isPublic)?'0':'1';
              var txt = self.$el.find('.messageTextArea').val();

              if(txt.length<=0){
                fish.toast('warn', '请输入你的评论');
                return;
              }
              action.addComment({
                'id':id,
                'isPublic':isPublic,
                'txt':txt
              },function(data){
                console.log("crash 0000");
                console.log(data);
                self.queryMessageList(id);
                self.$el.find('.messageTextArea').val('')
              })

          })

       },
       queryMessageList:function(id){
         var self =this;
         var docId=id;
         action.queryComments({
           'id':docId
         },function(data){

            var result = data.result
            console.log(result);
            var result = fish.map(result,function(d){
               d.pname=(d.IS_PUBLIC=='0')?"私有评论":"公开评论"
               d.shortName=d.USER_NAME.substr(0,2);
               return d
            })
            self.$el.find('.CNT_SPAN').text(result.length)
            self.$el.find('.cmt-container').html('').append(self.commentTpl({
              'data':result
            }))
            self.$el.find('.cmt-container').find('.removeMessage')
                    .off('click')
                    .on('click',function(){
                        var id=$(this).data('id');
                        var docId=$(this).data('docid');
                        action.delComments({
                          'id':id
                        },function(){
                          self.queryMessageList(docId)
                        })
                    })
            self.resizeHight();

         })
       },
       clearMessageEvent:function(){
         var self =this;
         self.$el.find('.clearMessage').off('click').on('click',function(){
           self.$el.find('.messageTextArea').val('')
         })
       },
       VEvent:function(selector){
         var self =this;
         self.$el.find(selector).off('click').on('click',function(){
              var _this= this;
              var id=$(this).data('id');
              var type=$(this).data('type');
              action.updownVote({
                  'id':id,
                  'type':type,
              },function(){
                var v = Number($(_this).data('value'))+1;
                $(_this).data('value',v);
                $(_this).find('span').text("("+v+")");
              })


         })
       },
       resizeHight:function(){
      
       },
       create:function(){
         return fish.create(this,{});
       }

     };

})
