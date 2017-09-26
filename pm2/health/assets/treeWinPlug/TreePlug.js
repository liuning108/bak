/**
 * AdhocFactory
 */
define([
    "oss_core/pm/report/health/assets/treeWinPlug/TreeView"
  ],
  function(TreeView) {
    return {
      createSubTree:function(datas,pid) {
        var sub=[];
          for(var i =0 ;i<datas.length;i++){
            var data = datas[i];
            if(data.pid ==pid ){
              data.children=this.createSubTree(datas,data.id);
              sub.push(data);
            }
          }
          return sub ;

      },
      toTree: function(datas) {
        var root = {
          id: "-1",
          name: 'Health scoring rules',
          'children': []
        }
        //找到LEVEL1
        var level1 = fish.uniq(fish.map(datas, function(data) {
          return {
            id: data.TEMPLATE_ID,
            name: data.TEMPLATE_NAME,
            "pid": "-1"
          }
        }), function(value) {
          return value.id
        })

        //找LEVLE2
        var level2 = fish.uniq(fish.map(datas, function(data) {
          return {
            id: data.NETTYPE_ID,
            name: data.NETTYPE_NAME,
            'pid': data.TEMPLATE_ID
          }
        }), function(value) {
          return value.id
        })
        //找LEVE3
        var level3 = fish.uniq(fish.map(datas, function(data) {
          return {
            id: data.ITEM_NO,
            name: data.ITEM_NAME,
            'pid': data.NETTYPE_ID
          }
        }), function(value) {
          return value.id
        })

        var level4 = fish.uniq(fish.map(datas, function(data) {
          return {
            id: fish.uniqueId("level4"),
            name: data.NQI_NAME,
            'pid': data.ITEM_NO
          }
        }), function(value) {
          return value.id
        })

        var pidTableData = fish.flatten([level1,level2,level3,level4])
        root.children=this.createSubTree(pidTableData,root.id);
        return root ;
      },
      popup: function(param) {
        var self = this;
        portal.callService("MPM_HEALTH_BASE_QUERY", {
            "FLAG": "healthRule",
            healthRule: "网元健康度检查规则"
          },
          function(result) {
            var len =result.healthRuleList.length;
            var datas = self.toTree(result.healthRuleList);
             var view =new TreeView(datas,len).render();
             var content = view.$el;
             var option = {
                 content: content,
                 width: param.width,
                 height: param.height
             };
             this.view = fish.popup(option);
             view.afterRender();
          });


      },
    }
  }
);
