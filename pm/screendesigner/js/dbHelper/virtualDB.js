define([], function() {

    var dbs = [];
    dbs.push({ serverName:'新装量预览服务',
               xAxis:[{id:'field_1',name:'area',data:['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港']}]  ,
               yAxis:[{id:'field_2', name:'3G'},{id:'field_3',name:'4G'},{id:'field_4', name:'2G'}]
             })

    dbs.push({ serverName:'停复机预览服务',
                        xAxis:[{id:'field_1',name:'area',data:['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港']}]  ,
                        yAxis:[{id:'field_2', name:'在途'},{id:'field_3',name:'停止'}]
                      })

    return fish.indexBy(dbs,'serverName')

});
