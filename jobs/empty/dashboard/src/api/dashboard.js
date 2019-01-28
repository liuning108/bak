import promise from './mock_db/mockpromise'
export default {
  /**
   * 通过仪表盘ID, 找出所有图表节点信息
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
  saveNodes(id,nodes){
    return promise((resolve, reject) => {
      localStorage.setItem(id, JSON.stringify(nodes))
      console.log(id, nodes);
      resolve({
        "code":0
      })
    })
  }
}