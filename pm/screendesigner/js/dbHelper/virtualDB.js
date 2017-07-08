define([], function() {

    var dbs = [];
    dbs.push({serverName:'新装量预览服务',
               xAxis:[{id:'field'+1,name:'area'}]  ,
               yAxis:[{id:'field'+2, name:'3G'},{id:'field'+3,name:'4G'},{id:'field'+4, name:'2G'}]
             })
    return fish.indexBy(dbs,'serverName')

});
