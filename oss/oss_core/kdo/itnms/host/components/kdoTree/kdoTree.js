define([ "text!oss_core/kdo/itnms/host/components/kdoTree/ul.html",
     "text!oss_core/kdo/itnms/host/components/kdoTree/rootChild.html",
     "text!oss_core/kdo/itnms/host/components/kdoTree/li.html",

  ],function(ulTpl,rootChildTpl,liTpl){
   var kdoTree = function(option){
     this.option = option;
     this.UL= fish.compile(ulTpl);
     this.RC= fish.compile(rootChildTpl);
     this.LI=fish.compile(liTpl);

   }

   kdoTree.prototype.render  =function(){
     this.remove();
     this.createTree();
     console.log(this.option.data);
    // this.option.el.html(fish.compile(tpl));
   }
   kdoTree.prototype.createTree=function() {
     this.option.el.append(this.UL())
     var self =this;
     var rootChildren=fish.filter(this.option.data,function(data){
       return data.pid ==  self.option.rootId
     })
    fish.each(rootChildren,function(data){
         self.createSubTree(data);
         console.log("--------");
     })


   }
   kdoTree.prototype.createSubTree=function(data){
        var self =this;
       self.createRootChildHTML(data);
       var children =fish.filter(self.option.data,function(c_data) {
         return c_data.pid ==data.id;
       });
       fish.each(children,function(c_data){
         self.createChildHTML(data,c_data)
       })
       console.log(children);
   }
   kdoTree.prototype.createRootChildHTML=function(data){
    var $rootChild = $(this.RC({'name':data.name,'id':data.id}));
      this.option.el.find('.kdo-tree').append($rootChild);
      $rootChild.find('.kdo-tree-head').off('click').on('click',function(){
        var flag =$(this).find('i').hasClass("glyphicon-menu-down");
        if (flag){
          $(this).find('i').removeClass('glyphicon-menu-down')
                           .addClass('glyphicon-menu-up');

          $(this).parent().find('.sub-tree').hide();

        }else{
          $(this).find('i').removeClass('glyphicon-menu-up')
                           .addClass('glyphicon-menu-down');
          $(this).parent().find('.sub-tree').show();

        }
      })

   }

   kdoTree.prototype.createChildHTML=function(data,c_data){
     var self =this;
     var subTree= this.option.el.find('.s'+data.id);
     var $li= $(this.LI({
       'name':c_data.name,
       'id':c_data.id
     }));
     subTree.append($li);
     $li.find('.kdo-tree-head').off('click').on('click',function(){
        var id =$(this).data('id')
        self.option.el.find('.kdo-checked').removeClass('kdo-checked');
        $(this).addClass('kdo-checked');
        self.option.callback(id);
     })

   }

   kdoTree.prototype.remove=function(){
    this.option.el.html("");
   }
   return kdoTree;

})
