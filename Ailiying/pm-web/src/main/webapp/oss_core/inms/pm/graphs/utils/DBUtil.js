define([
  "oss_core/inms/pm/graphs/actions/GraphsAction.js",
  "oss_core/inms/pm/graphs/utils/util.js"
],function(action,util){
  var DBUtil={};
  DBUtil.getLoadDatas=function(config,callback){
    if(!config)return null;
    var result ={};
    DBUtil.loadConfig(config,callback);
  }
  DBUtil.loadConfig=function(config,callback){
    console.log('createConfig',config);
    var hostPage = config.tabsConfig.hostPage;
//  var tableName= config.tableName+timePage.granus;
    var kpiCodes = fish.map(hostPage.selItems,function(d){
        return d.value;
    })
    if(kpiCodes.length<=0)return {"error":"没有KPICODE"};
    kpiCodes=kpiCodes.join(",");
    action.getKpiInfo(kpiCodes).then(function(result){
       console.log('dataConfig getKpiInfo',result)
         config.kpiInfo=result.kpiFormular
         DBUtil.createGConfig(config,callback)
    })

  }
  DBUtil.createGConfig =function(config,callback){
    console.log('dataConfig createGConfig',config);
    var sql = this.createSql(config);
    action.loadKpiData({"sql":sql}).then(function(data){
      if(data.error){
         callback(data);
      }else{
        config.kpiDatas=data;
        callback(config);
      }
    })
  }
  DBUtil.createSql =function(config){
    var timePage =config.tabsConfig.timePage
    var hostPage = config.tabsConfig.hostPage;
    var tableName =config.tableName+timePage.granus;
    console.log('createSql tableName',tableName);
    var cols =fish.map(config.kpiInfo,function(d){
      return d.KPI_FORM +" as "+d.KPI_CODE+" "
    })
    console.log('createSql tableName',cols);
    var dim = hostPage.xAxis;
    var topNum=hostPage.topNum||"";
    var orderStr=DBUtil.getOrder(hostPage);
    var sql ="select "+dim+" as "+dim+" , "+cols.join(',') +" from "+tableName
            +" group by  "+ dim
     if(orderStr.length>0){
       sql+=orderStr
     }
     if(topNum.length>0){
       sql+=' limit ' + topNum
     }
    console.log('createSql sql',sql);
    return sql

  }
  DBUtil.getOrder=function(hostPage){
    var order1 = hostPage.order1;
    var order2 = hostPage.order2;
    var order3 = hostPage.order3;
    //NONE
    if(order1=="01"){
      return ""
    }
    //按维度
    if(order1=="02"){
      return " order by "+ hostPage.xAxis +" "+ order3
    }
    //按指标
    if(order1=="03"){
      return " order by "+ order2 +" "+ order3
    }
    return ""
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
      var yAxis_notALl = fish.filter(yAxis,function(d){
         return  d.type != 'all'
      });
      var pointData =fish.map(xAxis_checkpoit,function(d){
            var item ={};
            item.xName = d;
            var temp={};
            temp.min= fish.random(40,50);
            temp.max= fish.random(temp.min,60);
            temp.avg = fish.random(temp.min,temp.max);
            temp.sum =temp.avg*4;
            temp.last=fish.random(40,83);
            fish.each(yAxis_notALl,function(dd){
               var id = dd.value+"_"+dd.type;
               item[id]=temp[dd.type] + fish.random(5,10);
            })
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
            item.xName = d.name+"("+d.type+")";
            item.id=d.value;
            item[d.type]=fish.random(40,93);
            item.type=d.type;
            return item;
      })
      result.C.xAxis=xAxis_C;
      result.C.data=cData;
      var result =result[xAxisFlag];
      result.selItems=yAxis
      result.xAxisFlag=xAxisFlag;
      result.gtype=config.gtype
      result.axisPage =config.tabsConfig.aixsPage;
      result.lengedPage = config.tabsConfig.lengedPage;
      result.propPage =  config.tabsConfig.propPage;
      result.showPage  = config.tabsConfig.showPage;
      return result;
  }
  return DBUtil;
})
