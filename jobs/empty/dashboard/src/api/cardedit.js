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
          var item =nodes.find(element=>{
             return element.i == cid;
           })
        
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
                  xlist: [],
                  ylist: [],
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