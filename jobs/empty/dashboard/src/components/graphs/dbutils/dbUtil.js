import dbsourceApi from '../../../api/dbsource';
import lo from 'lodash'
export default {
   async getDsDatas(dsConfig,info) {
     var {datas} = await dbsourceApi.getDsDatas(dsConfig)
     console.log("result", datas)
     console.log("info",info);
     var xAxisData =[];
     var yAxisData =[];
     let xNum = dsConfig.xList.length < info.xNum ? dsConfig.xList.length : info.xNum;
     let yNum = dsConfig.yList.length < info.yNum ? dsConfig.yList.length : info.yNum;
     for (let i = 0; i < xNum; i++) {
         xAxisData.push({...dsConfig.xList[i]});
     }
     for (let i = 0; i < yNum; i++) {
       yAxisData.push({...dsConfig.yList[i]});
     }
     var result = {};
     result.xInfo = xAxisData.map(el=>{
        el.datas = lo.uniq(lo.map(datas, el.field));
        return el;
     })
     let gByF = result.xInfo[0];
     //值标必需是数值型
     result.yInfo = yAxisData.map(el => {
        var gDatas = lo.groupBy(datas,gByF.field)
        //console.log("gDatas", gDatas,el)
        var datas2 = lo.map(gDatas,(gd)=>{
           var dd= lo.map(gd, (d) => {
             console.log(d)
             return Number(d[el.field])
           })
           if (el.aggr=='count'){
             return dd.length;
           }
           if(el.aggr == 'avg'){
             return lo.sum(dd)/dd.length
           }
          //console.log("aggr", el.aggr, lo[el.aggr])
           return lo[el.aggr](dd);
        })
        el.datas = datas2;
      
        // el.datas = lo.map(datas, (d)=>{
        //   return  Number(d[el.field])
        // })
        return el;
     })
     console.log('getDsDatas222', result)
     return result

   }
}