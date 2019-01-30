import promise from './mock_db/mockpromise'
import datasource from './mock_db/datasource'
import {
   groupBy,
   flatten
} from 'lodash'
export default {
   getNodeById({bid,cid}) {
     return promise((resolve, reject) => {
          var nodes = JSON.parse(localStorage.getItem(bid))
          console.log(nodes);
          var item =nodes.find(element=>{
             return element.i == cid;
           })
        
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
   },
   getNodeDSInfo(id){
      return promise((resolve, reject) => {
         const ds = _.find(datasource, {id});
         const cardset ={
                  id:ds.id,
                  name:ds.name,
                  updateDate:ds.updateDate,
                  xlist: [{id:1,name:1},{id:2,name:2}],
                  ylist: [{id:3,name:3},{id:4,name:4}],
         }
         var group_arr=groupBy(ds.meta.cols,'type')
         var xlist = flatten([group_arr['date'], group_arr['string']])
         cardset.xlist = xlist;
         var ylist = group_arr['number'].map((e)=>{
              e.aggr = "sum"
              return e;
         })
         cardset.ylist = ylist;
         resolve(cardset)
      })
   }
}