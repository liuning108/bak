define(["oss_core/inms/pm/graphs/utils/util.js"],function(util){
  var DBUtil={};
  DBUtil.getFakeDatas=function(config){
    if(!config)return null;
    var result ={};
    var config =DBUtil.createFakeConfig(config);
    console.log("getFakeDatas",config);
    return config;
  }
  DBUtil.createFakeConfig =function(config){
    if(!config)return {};
    var hostPage = config.tabsConfig.hostPage;
    if(!hostPage)return{};
    var result = {};
    result.T={};
    result.P={};
    result.C={};
    //生成维度数据（10条）
       //得到所有值标
       var yAxis =hostPage.selItems;
      //得到维度标识(时间 OR 监测点)
       var xAxisFlag =  hostPage.xAxis||"T";
      //生成维度数据(根据这个分割数据)
       var curDate =new Date();
       var xAxis  = fish.map(fish.range(10),function(i){
          var d  =fish.dateutil.addHours(curDate,i);
          return d.getTime();
       })
      //生成10条假数据（ALL数据）
      result.T.xAxis = xAxis;
      var fakeDatasALL = fish.map(xAxis,function(d){
          var item ={};
          item.xName=d;
          fish.each(yAxis,function(d){
          item[d.value]=fish.random(20,96);
          });
          return item
      })
      result.T.data = fakeDatasALL;
      var aggregation = {};
      fish.each(yAxis,function(d){
        aggregation[d.value]={};
        var array =fish.pluck(fakeDatasALL,d.value);
        aggregation[d.value]['min'] =fish.min(array);
        aggregation[d.value]['max'] =fish.max(array);
        aggregation[d.value]['sum'] =fish.reduce(array, function(memo, num){
                                                  return memo + num;
                                               }, 0);
        aggregation[d.value]['avg'] =aggregation[d.value]['sum']/array.length;
        aggregation[d.value]['last'] =fish.last(array);
      });
      console.log("fakeDatasALL aggregation",aggregation);
      result.T.aggr=aggregation;
      //checkPoint (4)
      var xAxis_checkpoit = fish.map(fish.range(4),function(i){
           return 'checkPoint'+i;
      })
      var pointData =fish.map(xAxis_checkpoit,function(d){
            var item ={};
            item.xName = d;
            item.min= fish.random(40,93);
            item.max= fish.random(item.min,93);
            item.avg = fish.random(item.min,item.max);
            item.sum =item.avg*4;
            item.last=fish.random(40,93);
            return item;
      })
      result.P.xAxis=xAxis_checkpoit;
      result.P.data=pointData;

      var yAxis_notALl = fish.filter(yAxis,function(d){
         return  d.type != 'all'
      });

      var xAxis_C = fish.map(yAxis_notALl,function(i){
           return i.name+"("+i.type+")";
      })
      var cData =fish.map(yAxis_notALl,function(d){
            var item ={};
            item.xName = d.name;
            item.id=d.value;
            item[d.type]=fish.random(40,93);
            return item;
      })
      result.C.xAxis=xAxis_C;
      result.C.data=cData;
      var result =result[xAxisFlag];
      result.selItems=yAxis
      result.xAxisFlag=xAxisFlag;
      result.gtype=config.gtype
      return result;
  }
  return DBUtil;
})
