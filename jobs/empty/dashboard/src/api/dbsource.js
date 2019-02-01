import promise from './mock_db/mockpromise'
import datasource from './mock_db/datasource'
import db from './mock_db/db'
import {
  find
} from 'lodash'
export default {
  /**
   * 
   * @param { object } dsConfig 数据配置对象
   * @returns SQL拼接后的 数据集
   */
  getDsDatas(dsConfig){
    return promise((resolve, reject) => {
      console.log('db', db)
      console.log("getDsDatas", dsConfig)
      const  {id} = dsConfig
      const ds = find(datasource, {id});
      const result = find(db,{"id":ds.meta.sourceId})
      resolve({"datas":result.datas});
    })
  }
}