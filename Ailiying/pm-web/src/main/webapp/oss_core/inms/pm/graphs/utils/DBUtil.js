define([
  "oss_core/inms/pm/graphs/actions/GraphsAction.js", "oss_core/inms/pm/graphs/utils/util.js"
], function(action, util) {
  var DBUtil = {};
  DBUtil.getbusField = function(code) {

    return action.getbusField(code);
  }
  DBUtil.getTimeConfig = function() {
    return action.getTimeConfig();
  }
  DBUtil.deepCopy = function(sourceObj) {
    return JSON.parse(JSON.stringify(sourceObj))
  }
  DBUtil.getLoadDatas = function(config, timeRangeObj,rmUID, callback) {
    if (!config)
      return null;
    var result = {};
    DBUtil.getTimeConfig().then(function(data) {
      config.paramvalues = data;
      DBUtil.getbusField(config.code).then(function(fielData) {
        var GRANU_MODE = JSON.parse(fielData.modelField[0].GRANU_MODE);
        config.GRANU_MODES = GRANU_MODE;
        if (GRANU_MODE.length > 0) {
          config.minGranu = [GRANU_MODE[0]]
        }
        DBUtil.loadConfig(DBUtil.deepCopy(config), timeRangeObj,rmUID, callback);
      })
    })

  }
  DBUtil.loadConfig = function(config, timeRangeObj,rmUID, callback) {
    console.log('createConfig', config);
    var hostPage = config.tabsConfig.hostPage;
    //  var tableName= config.tableName+timePage.granus;
    var kpiCodes = fish.map(hostPage.selItems, function(d) {
      return d.value;
    })
    if (kpiCodes.length <= 0)
      return {"error": "没有KPICODE"};
    kpiCodes = kpiCodes.join(",");
    action.getKpiInfo(kpiCodes).then(function(result) {
      console.log('dataConfig getKpiInfo', result)
      config.kpiInfo = result.kpiFormular
      DBUtil.createGConfig(config, timeRangeObj,rmUID, callback)
    })

  }
  DBUtil.createGConfig = function(config, timeRangeObj,rmUID, callback) {
    console.log('dataConfig createGConfig', config);
    var timePage = config.tabsConfig.timePage
    var hostPage = config.tabsConfig.hostPage;
    var isSwitch = timePage.isSwitch || 'c';
    var useMinGranModes = config.minGranu;
    var useItemGranModes = null;
    if (timePage.useRange) {
      if (timePage.useRange.length > 0) {
        useItemGranModes = fish.map(timePage.useRange, function(d) {
          return {"GRANU": d.value}
        })
      } else {
        isSwitch = 'c'
      }
    }
    var USE_GRANU_MODES = useItemGranModes || useMinGranModes;
    if (isSwitch == 'c') {
      USE_GRANU_MODES = useMinGranModes;
    }

    config.USE_GRANU_MODES = USE_GRANU_MODES;
    if (!timeRangeObj) {
      if (isSwitch == 'c') {
        timePage.granus = config.minGranu[0].GRANU;
        var rangeTemps = fish.filter(config.paramvalues.result, function(d) {
          //console.log('rangeTemps',d,timePage.granus);
          return d.ID == 'TGRANU' + timePage.granus
        })
        var rangeTemp = "01";
        if (rangeTemps.length > 0) {
          rangeTemp = rangeTemps[0].VALUE;
        }
        timePage.timeRange = rangeTemp || '01'
      }
      var timeRange = timePage.timeRange + timePage.granus;
      timeRangeObj = util.getTimeRange(timeRange);

    }
    var sql = null;
    var minG = config.minGranu[0].GRANU;
    var tempGranus = timeRangeObj.g || timePage.granus;
    if (tempGranus == minG) {
      sql = this.createMinGraunsSql(config,rmUID, timeRangeObj); //最小粒度SQL
    } else {
      sql = this.createGraunsSql(config,rmUID, timeRangeObj); //最小粒度SQL
    }
    if (sql == null) {
      return;
    }
    action.loadKpiData({"sql": sql}).then(function(data) {
      if (data.error) {
        callback(data);
      } else {
        var precData =DBUtil.getPrecData(config.kpiInfo,data)
        config.kpiDatas = precData;
        callback(config);
      }
    })
  }
  DBUtil.getPrecData = function(kpiInfo,data){
     console.log('getPrecData',kpiInfo,data);
     fish.each(kpiInfo,function(info){
         var key = info.KPI_CODE;
         var precNum = info.PREC

         if(!precNum){
            console.log("getPrecData isEmpty",key,precNum)
           if(precNum===0){
             precNum =0;
           }else{
             precNum=2;
           }

         }
         fish.each(data.result,function(d){
           console.log("getPrecData",key,precNum)
              var value = Number(d[key]);
              if(fish.isNumber(value)){
                var percNum = Number(precNum);
                if(fish.isNaN(percNum))percNum=2;
                d[key] = Number(value.toFixed(precNum));
              }
         });

     })
     return data;
  }
  DBUtil.createGraunsSql = function(config,rmUID,timeRangeObj) {
    var timePage = config.tabsConfig.timePage
    var hostPage = config.tabsConfig.hostPage;
    var tempGranus = timeRangeObj.g || timePage.granus;
    var granus = tempGranus;
    var tableName = config.tableName + granus;
    console.log('createSql tableName', tableName);
    var cols = fish.map(hostPage.selItems, function(d) {
      var val = d.value;
      var itemKpi = fish.find(config.kpiInfo, function(item) {
        if (d.type == util.prop.NONE) {
          d.typeAgg = item.KPI_AGG
        }
        return item.KPI_CODE == val
      })
      var type = d.type;

      if (itemKpi.KPI_TYPE == '1') {
        var name = d.name + "(" + type + ")"
        d.value = itemKpi.KPI_CODE + "_" + type;
        if (d.type == util.prop.NONE) {
          d.value = itemKpi.KPI_CODE
          var aggVal ="c_str_split_agg_varchar("+val+"_AGG,',','"+d.typeAgg.trim()+"')"
          return d.typeAgg.trim() + "(" + aggVal + ") as " + val;
        } else {
          d.name = name;
          var aggVal ="c_str_split_agg_varchar("+val+"_AGG,',','"+type.trim()+"')"
          return type.trim() + "(" + aggVal + ") as " + val + "_" + type + " "
        }
      } else {
        return itemKpi.KPI_FORM + " as " + val + " "
      }

    })
    console.log('createSql tableName', cols);
    var dim = hostPage.xAxis;
    var asDimName = hostPage.xAxis;
    var xAxisData = hostPage.xAxisData;
    if (xAxisData) {
      if (xAxisData.dataType == 2) {
        if (hostPage.xAxisFromat) {
          if (hostPage.xAxisFromat != util.prop.NONE && hostPage.xAxisFromat != util.prop.BYGRANU) {
            dim = "DATE_FORMAT(" + hostPage.xAxis + ",'" + hostPage.xAxisFromat + "')";
          }
          if (hostPage.xAxisFromat == util.prop.BYGRANU) {
            var fromat = fish.find(config.paramvalues.result, function(p) {
              console.log('PPPPPP', p.VALUE, granus)
              return p.ID == 'GRANU_FORMAT' && p.VALUE == granus
            })
            dim = "DATE_FORMAT(" + hostPage.xAxis + ",'" + fromat.NAME + "')";
          }
        }
      }
    }
    var topNum = hostPage.topNum || "";
    var orderStr = DBUtil.getOrder(hostPage);

    var sql = "select " + dim + " as " + asDimName + " , " + cols.join(',') + " from " + tableName + " where STTIME >= '" + timeRangeObj.s + "' and  STTIME < '" + timeRangeObj.e + "' " + " group by  " + dim
    if(rmUID){
      var sql = "select " + dim + " as " + asDimName + " , " + cols.join(',') + " from " + tableName + " where MO_GID= '"+ rmUID +"' and  STTIME >= '" + timeRangeObj.s + "' and  STTIME < '" + timeRangeObj.e + "' " + " group by  " + dim
    }
    if (orderStr.length > 0) {
      sql += orderStr
    }
    if (topNum.length > 0) {
      sql += ' limit ' + topNum
    }
    console.log('createSql sql', sql);
    return sql

  }
  DBUtil.createMinGraunsSql = function(config,rmUID,timeRangeObj) {
    var timePage = config.tabsConfig.timePage
    var hostPage = config.tabsConfig.hostPage;
    var tempGranus = timeRangeObj.g || timePage.granus;
    var granus = config.minGranu[0].GRANU || tempGranus;
    var tableName = config.tableName + granus;
    console.log('createSql tableName', tableName);
    var cols = fish.map(hostPage.selItems, function(d) {
      var val = d.value;
      var itemKpi = fish.find(config.kpiInfo, function(item) {
        if (d.type == util.prop.NONE) {
          d.typeAgg = item.KPI_AGG
        }
        return item.KPI_CODE == val
      })
      var type = d.type;

      if (itemKpi.KPI_TYPE == '1') {
        var name = d.name + "(" + type + ")"
        d.value = itemKpi.KPI_CODE + "_" + type;
        if (d.type == util.prop.NONE) {
          d.value = itemKpi.KPI_CODE

          return d.typeAgg.trim() + "(" + val + ") as " + val;
        } else {
          d.name = name;
          return type.trim() + "(" + val + ") as " + val + "_" + type + " "
        }
      } else {
        return itemKpi.KPI_FORM + " as " + val + " "
      }

    })
    console.log('createSql tableName', cols);
    var dim = hostPage.xAxis;
    var asDimName = hostPage.xAxis;
    var xAxisData = hostPage.xAxisData;
    if (xAxisData) {
      if (xAxisData.dataType == 2) {
        if (hostPage.xAxisFromat) {
          if (hostPage.xAxisFromat != util.prop.NONE && hostPage.xAxisFromat != util.prop.BYGRANU) {
            dim = "DATE_FORMAT(" + hostPage.xAxis + ",'" + hostPage.xAxisFromat + "')";
          }
          if (hostPage.xAxisFromat == util.prop.BYGRANU) {
            var fromat = fish.find(config.paramvalues.result, function(p) {
              console.log('PPPPPP', p.VALUE, granus)
              return p.ID == 'GRANU_FORMAT' && p.VALUE == granus
            })
            dim = "DATE_FORMAT(" + hostPage.xAxis + ",'" + fromat.NAME + "')";
          }
        }
      }
    }
    var topNum = hostPage.topNum || "";
    var orderStr = DBUtil.getOrder(hostPage);
    var sql = "select " + dim + " as " + asDimName + " , " + cols.join(',') + " from " + tableName + " where STTIME >= '" + timeRangeObj.s + "' and  STTIME < '" + timeRangeObj.e + "' " + " group by  " + dim
    if(rmUID){
      var sql = "select " + dim + " as " + asDimName + " , " + cols.join(',') + " from " + tableName + " where MO_GID= '"+rmUID+"' and STTIME >= '" + timeRangeObj.s + "' and  STTIME < '" + timeRangeObj.e + "' " + " group by  " + dim
    }
    if (orderStr.length > 0) {
      sql += orderStr
    }
    if (topNum.length > 0) {
      sql += ' limit ' + topNum
    }
    console.log('createSql sql', sql);
    return sql

  }
  DBUtil.getOrder = function(hostPage) {
    var order1 = hostPage.order1;
    var order2 = hostPage.order2;
    var order3 = hostPage.order3;
    //NONE
    if (order1 == "01") {
      return ""
    }
    //按维度
    if (order1 == "02") {
      return " order by " + hostPage.xAxis + " " + order3
    }
    //按指标
    if (order1 == "03") {
      return " order by " + order2 + " " + order3
    }
    return ""
  }
  DBUtil.createFakeConfig = function(config) {
    if (!config)
      return {};
    var hostPage = config.tabsConfig.hostPage;
    if (!hostPage)
      return {};
    var result = {};
    result.T = {};
    result.P = {};
    result.C = {};
    //生成维度数据（10条）
    //得到所有值标
    var yAxis = hostPage.selItems;
    //得到维度标识(时间 OR 监测点)
    var xAxisFlag = hostPage.xAxis || "T";
    //生成维度数据(根据这个分割数据)
    var curDate = new Date();
    var xAxis = fish.map(fish.range(10), function(i) {
      var d = fish.dateutil.addHours(curDate, i);
      return d.getTime();
    })
    //生成10条假数据（ALL数据）
    result.T.xAxis = xAxis;
    var fakeDatasALL = fish.map(xAxis, function(d) {
      var item = {};
      item.xName = d;
      fish.each(yAxis, function(d) {
        item[d.value] = fish.random(20, 96);
      });
      return item
    })
    result.T.data = fakeDatasALL;
    var aggregation = {};
    fish.each(yAxis, function(d) {
      aggregation[d.value] = {};
      var array = fish.pluck(fakeDatasALL, d.value);
      aggregation[d.value]['min'] = fish.min(array);
      aggregation[d.value]['max'] = fish.max(array);
      aggregation[d.value]['sum'] = fish.reduce(array, function(memo, num) {
        return memo + num;
      }, 0);
      aggregation[d.value]['avg'] = aggregation[d.value]['sum'] / array.length;
      aggregation[d.value]['last'] = fish.last(array);
    });
    console.log("fakeDatasALL aggregation", aggregation);
    result.T.aggr = aggregation;
    //checkPoint (4)
    var xAxis_checkpoit = fish.map(fish.range(4), function(i) {
      return 'checkPoint' + i;
    })
    var yAxis_notALl = fish.filter(yAxis, function(d) {
      return d.type != 'all'
    });
    var pointData = fish.map(xAxis_checkpoit, function(d) {
      var item = {};
      item.xName = d;
      var temp = {};
      temp.min = fish.random(40, 50);
      temp.max = fish.random(temp.min, 60);
      temp.avg = fish.random(temp.min, temp.max);
      temp.sum = temp.avg * 4;
      temp.last = fish.random(40, 83);
      fish.each(yAxis_notALl, function(dd) {
        var id = dd.value + "_" + dd.type;
        item[id] = temp[dd.type] + fish.random(5, 10);
      })
      return item;
    })
    result.P.xAxis = xAxis_checkpoit;
    result.P.data = pointData;

    var yAxis_notALl = fish.filter(yAxis, function(d) {
      return d.type != 'all'
    });

    var xAxis_C = fish.map(yAxis_notALl, function(i) {
      return i.name + "(" + i.type + ")";
    })
    var cData = fish.map(yAxis_notALl, function(d) {
      var item = {};
      item.xName = d.name + "(" + d.type + ")";
      item.id = d.value;
      item[d.type] = fish.random(40, 93);
      item.type = d.type;
      return item;
    })
    result.C.xAxis = xAxis_C;
    result.C.data = cData;
    var result = result[xAxisFlag];
    result.selItems = yAxis
    result.xAxisFlag = xAxisFlag;
    result.gtype = config.gtype
    result.axisPage = config.tabsConfig.aixsPage;
    result.lengedPage = config.tabsConfig.lengedPage;
    result.propPage = config.tabsConfig.propPage;
    result.showPage = config.tabsConfig.showPage;
    return result;
  }
  return DBUtil;
})
