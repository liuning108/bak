define([
  "oss_core/inms/pm/resMgr/actions/action"
], function(action) {
  return {
    enterDashBoard:function(tid,self,tableH){
       action.qurTmpInfo(tid).then(function(data){
              var model_code =data.result[0].MCODE;
             require([
                   'oss_core/inms/pm/zdashboard/views/DashBoard'
               ], function (dashBoard) {
                  self.dashBoardView = new dashBoard({
                   el: self.$el.find('.res-tpl-graph-container'),
                   'id': tid,
                   'code':model_code,
                   tableH: tableH,
                   callback:function() {
                     self.$el.find('.res-tpl-list-container').show(500);
                     self.$el.find('.res-tpl-graph-container').hide();
                     self.dashBoardView = null;
                   }
               });
               self.$el.find('.res-tpl-list-container').slideUp(500);
               self.$el.find('.res-tpl-graph-container').show();
               self.dashBoardView.render();
           });
           console.log(data)
       })
    },
    hidColByType:function(type,$grid){
      //PIM
       if(type=="1"){
        $grid.jqGrid("hideCol", ['VIM', 'CITY']);
        $grid.jqGrid("showCol", ['PIM']);
       }
       //VIM
       if(type=="2"){
         $grid.jqGrid("hideCol", ['PIM', 'CITY']);
         $grid.jqGrid("showCol", ['VIM']);
       }

       //VNF
       if(type=="3"){
         $grid.jqGrid("hideCol", ['PIM', 'VIM']);
         $grid.jqGrid("showCol", ['CITY']);
       }
    },
    loadResData:function($grid,param){
      action.qurRes().then(function(data){
       $grid.jqGrid("reloadData", data.result);
      })
    },
    loadTree: function($tree) {
      action.loadTree().then(function(data){
          var result = data.result
          if(!result) return ;
          console.log(result)
          var treeData =result;
          var setSelection =result[0].children[0]
          console.log('loadTree',data);
          $tree.jqGrid("reloadData", treeData);
          $tree.jqGrid("setSelection", setSelection);
      })

    }
  }
})
