import promise from './mock_db/mockpromise'
export default {
  /**
   * 
   *   通过仪表盘ID, 找出所有图表节点信息
   * @param {*} id   仪表盘ID
   */
  getBoardNodes(id) {
    return promise((resolve, reject) => {
           var nodes=localStorage.getItem(id)
           if (nodes==null){
             resolve([]);
           }
           resolve(JSON.parse(nodes));
    })
  },

  /**
   *  保存仪表盘下所有节点信息
   * @param {*} id   仪表盘ID 
   * @param {*} nodes  节点的集合
   */
  saveNodes(id,nodes){
    return promise((resolve, reject) => {
      localStorage.setItem(id, JSON.stringify(nodes))
      resolve({
        "code":0
      })
    })
  },
  /**
   * 保存目录节点信息
   * @param { object} node 目录节点信息 
   */
  saveDashDir(node){
    var dirDB = localStorage.getItem("dashDir");
    if (dirDB == null) {
      dirDB = [];
    }else{
      dirDB = JSON.parse(dirDB);
    }
    dirDB.push({
        'id': node.id,
        'pid': node.pid,
        'label':node.label
    });
    console.log("dirDB", dirDB);
    localStorage.setItem("dashDir", JSON.stringify(dirDB));
  },
  saveDashPage(node){
    var dashPage = localStorage.getItem("dashPage");
    if (dashPage == null) {
      dashPage = [];
    } else {
      dashPage = JSON.parse(dashPage);
    }
    dashPage.push({
        'id': node.id,
        'pid': node.pid,
        'label': node.label
    })
    localStorage.setItem("dashPage", JSON.stringify(dashPage));

  },
  getTree(node) {
     return promise((resolve, reject) => {
          var dirDB = localStorage.getItem("dashDir");
          var dashPage = localStorage.getItem("dashPage");
          if (dirDB == null) {
            dirDB = [];
          } else {
            dirDB = JSON.parse(dirDB);
          }
          if (dashPage==null){
            dashPage=[]
          }else{
            dashPage = JSON.parse(dashPage)
          }
          dirDB = dirDB.map((el)=>{
           el.isPage=false
           el.icon="el-icon-arrow-right"
           el.isOpen=false
           el.children=[]
            return el;
          })
          dashPage.map((el)=>{
            el.isPage= true
            el.isEdit= false
            el.isActive= false
            return el;
          })
          dirDB.push(...dashPage)
          //var arry = [];
          var tree = this.createTree(dirDB);
          
          //console.log("getTree", arr);
          resolve(tree);
     })
  },
  createTree(nodes) {
      var root = nodes.filter(n=>n.pid==0);
            console.log("createTree", root)
       this.buildTree(nodes,root)
       return root
  },
  buildTree(nodes,root){
    console.log('buildTree')
    for (var  i =0 ; i<root.length;i++){
         var curNode = root[i];
         if(!curNode.isPage){ 
         var children = nodes.filter(n => n.pid == curNode.id);
         this.buildTree(nodes, children);
         curNode.children=children;
         }

    }
    return root
  }
}