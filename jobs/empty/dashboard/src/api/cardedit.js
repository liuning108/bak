import promise from './mock_db/mockpromise'
export default {
   getNodeById({bid,cid}) {
     return promise((resolve, reject) => {
          var nodes = JSON.parse(localStorage.getItem(bid))
          console.log(nodes);
          var item =nodes.find(element=>{
             return element.i == cid;
           })
           item.name = "未命名的卡片"
           console.log(item)
         resolve({card:item,bid});
     })
   },
   saveNode(bid,card) {
     return promise((resolve, reject) => {
          var nodes = JSON.parse(localStorage.getItem(bid))
          var newNodes =nodes.map(element => {
             if (element.i==card.i){
                return card;
             }else{
                return element
             }
          });
          localStorage.setItem(bid, JSON.stringify(newNodes))
          resolve({code:0});
     })
   }
}