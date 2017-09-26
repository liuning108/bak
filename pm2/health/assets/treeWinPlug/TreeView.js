/**
 *
 */
define([

    "text!oss_core/pm/report/health/assets/treeWinPlug/treeWin.html",
    "css!oss_core/pm/report/health/assets/treeWinPlug/style.css",
    "oss_core/pm/report/health/assets/treeWinPlug/raphael-min",
    "oss_core/pm/report/health/assets/treeWinPlug/raphael.pan-zoom"
  ],
  function(tpl) {
    return portal.CommonView.extend({
      className: "ui-dialog dialog",
      //加载模板
      template: fish.compile(tpl),
      events: {

      },

      initialize: function(datas,len) {
          this.treeDatas = datas
          this.maxLen =len;

      },

      render: function() {
        this.$el.html(this.template());
        return this;
      },
      afterRender: function() {

   var container = this.$el.find("#treeCanvas");
   var w =container.width();
   var h =container.height();

   var paper = Raphael(container[0], w, h);
   var panZoom = paper.panzoom({ initialZoom: -7, initialPosition: { x: -w/2, y: -h/5 } });
   var isHandling = false;

   panZoom.enable();
   paper.safari();



    console.log(this.treeDatas);
    var treeJson=this.treeDatas;
 //   var treeJson = {
 //   "name": "flare",
 //   "children": [{
 //       "name": "analytics",
 //       "children": [{
 //           "name": "cluster1",
 //           "children": [{
 //               "name": "AgglomerativeCluster",
 //               "size": 3938
 //           }, {
 //               "name": "CommunityStructure",
 //               "size": 3812
 //           }, {
 //               "name": "HierarchicalCluster",
 //               "size": 6714
 //           }, {
 //               "name": "MergeEdge",
 //               "size": 743
 //           }]
 //       },
 //       {
 //           "name": "cluster2",
 //           "children": [{
 //               "name": "AgglomerativeCluster",
 //               "size": 3938
 //           }, {
 //               "name": "CommunityStructure",
 //               "size": 3812
 //           }, {
 //               "name": "HierarchicalCluster",
 //               "size": 6714
 //           }, {
 //               "name": "MergeEdge",
 //               "size": 743
 //           }, {
 //               "name": "MergeEdge",
 //               "size": 743
 //           }]
 //       },
 //       {
 //           "name": "cluster3",
 //           "children": [{
 //               "name": "AgglomerativeCluster",
 //               "size": 3938
 //           }, {
 //               "name": "CommunityStructure",
 //               "size": 3812
 //           }, {
 //               "name": "HierarchicalCluster",
 //               "size": 6714
 //           }, {
 //               "name": "MergeEdge",
 //               "size": 743
 //           }]
 //       }
 //     ]
 // },{
 //     "name": "analytics",
 //     "children": [{
 //         "name": "cluster1",
 //         "children": [{
 //             "name": "AgglomerativeCluster",
 //             "size": 3938
 //         }, {
 //             "name": "CommunityStructure",
 //             "size": 3812
 //         }, {
 //             "name": "HierarchicalCluster",
 //             "size": 6714
 //         }, {
 //             "name": "MergeEdge",
 //             "size": 743
 //         }]
 //     },
 //     {
 //         "name": "cluster2",
 //         "children": [{
 //             "name": "AgglomerativeCluster",
 //             "size": 3938
 //         }, {
 //             "name": "CommunityStructure",
 //             "size": 3812
 //         }, {
 //             "name": "HierarchicalCluster",
 //             "size": 6714
 //         }, {
 //             "name": "MergeEdge",
 //             "size": 743
 //         }, {
 //             "name": "MergeEdge",
 //             "size": 743
 //         }]
 //     },
 //     {
 //         "name": "cluster3",
 //         "children": [{
 //             "name": "AgglomerativeCluster",
 //             "size": 3938
 //         }, {
 //             "name": "CommunityStructure",
 //             "size": 3812
 //         }, {
 //             "name": "HierarchicalCluster",
 //             "size": 6714
 //         }, {
 //             "name": "MergeEdge",
 //             "size": 743
 //         }]
 //     }
 //   ]
 //   }]}

   var maxLevel =1;
   var mapLevel={}
   var count =0;
   function setLevel(treeJson,level){
      if(level>maxLevel){
          maxLevel=level
      }
      treeJson.id=count++
      treeJson.level=level
      var arrayLevel =mapLevel[level];
      if(arrayLevel){
       mapLevel[level].push(treeJson)
      }else{
        mapLevel[level]=[];
        mapLevel[level].push(treeJson);
      }
        if(treeJson.children &&treeJson.children.length>0){
          for(var i =0;i<treeJson.children.length;i++){
              setLevel(treeJson.children[i],level+1)
          }
      }
   }


   setLevel(treeJson,maxLevel)
   console.log(mapLevel);

   console.log(maxLevel);

   function findI(dnode,currEntLevel) {
       var levelNodes=mapLevel[currEntLevel]
       for(var i = 0;i<levelNodes.length;i++){
          if(dnode.id==levelNodes[i].id){
              return i;
          }
       }

   }

   function findSubY() {
       return false
   }



   var nodes =[];
   var r =10;
   var maxH =this.maxLen*r*2.5;
   function createTree(treeJson,x,y){
     //创建自己
     treeJson.x =x;
     treeJson.y =y;
     console.log(treeJson.y)
     var color = "red";


     var node =paper.ellipse(treeJson.x , treeJson.y, r, r);
     node.attr({'fill':"#fff",'stroke':"steelblue",'stroke-width':1.5})


     //创建子树

     if(treeJson.children && treeJson.children.length>0){
       var ccnods=paper.set();
      for (var i =0 ;i<treeJson.children.length;i++){
        var dnode =treeJson.children[i];
        var currEntLevel =dnode.level;

        var ph =maxH/mapLevel[currEntLevel].length
       var indI=findI(dnode,currEntLevel);

        var ty=(indI*ph);
        var cNode = createTree(dnode,treeJson.x+150,ty);
       //  var line = paper.connection(node,cNode, "#ccc")
       //  connections.push(line);
       ccnods.push(cNode)
       }
       var cbbox=ccnods.getBBox();
       node.attr({cy:cbbox.y+cbbox.height/2})

       for(var i  =0;i<ccnods.length;i++){
           var cNode =ccnods[i];
            var line = paper.connection(node,cNode, "#ccc")
             connections.push(line);
       }
       var text =paper.text(treeJson.x , cbbox.y+cbbox.height/2,treeJson.name)
       var bbox=text.getBBox();
       text.attr({"x":treeJson.x-bbox.width/2-r-2}).toFront()


   }else{
       var text =paper.text(treeJson.x , treeJson.y,treeJson.name)
       var bbox=text.getBBox();
       text.attr({"x":treeJson.x+bbox.width/2+r+2}).toFront()
   }



     return node;

   }







   var  connections = [];

   var RootNode = {

   }
 createTree(treeJson,0,0);
   // var shapes = [  paper.ellipse(190, 100, r, r),
   //                 paper.ellipse(290, 100, r,r),
   //                 paper.ellipse(290, 180, r,r),
   //                 paper.ellipse(290, 280, r, r)
   //               ];




   // connections.push(paper.connection(shapes[0], shapes[1], "#000"));
   // connections.push(paper.connection(shapes[0], shapes[2], "#000", "#fff|5"));
   // connections.push(paper.connection(shapes[0], shapes[3], "#000", "#fff"))
      },

    });
  }
);
