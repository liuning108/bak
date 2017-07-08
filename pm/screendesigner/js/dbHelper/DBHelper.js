define([
    'oss_core/pm/screendesigner/js/dbHelper/virtualDB'
], function(virtualDB) {
    var dbHelper = {}


    dbHelper.getJson = function(g) {
        var server = g.attrs.dbServer;
        var json = (server.islocal)
            ? dbHelper.getLocalJson(server)
            : dbHelper.getAjaxJson(server);
        return json

    }

    dbHelper.getLocalJson=function(server) {
        var serverSkeleton =virtualDB[server.serverName];
        serverSkeleton.islocal=true;
        dbHelper.choiceY(serverSkeleton.xAxis,server.xAxis);
        dbHelper.choiceY(serverSkeleton.yAxis,server.yAxis);
        serverSkeleton.xNums=server.xNums;
        serverSkeleton.yNums=server.yNums;
        serverSkeleton.xMinNums=server.xMinNums;
        serverSkeleton.yMinNums=server.yMinNums;
        serverSkeleton.colModels=dbHelper.createColModel(serverSkeleton);
        serverSkeleton.datas=dbHelper.createLocalDatas(serverSkeleton)
        return serverSkeleton;
    }

    dbHelper.createColModel=function(serverSkeleton) {
         var heards=serverSkeleton.xAxis.concat(serverSkeleton.yAxis);
         console.log('createColModel')
         console.log(heards);
         var colModels= fish.map(heards,function(head) {
                     var col={
                         name: head.id,
                         label:head.name
                     }
                     return col;
                });
         console.log(colModels);
         return colModels;
    }

    dbHelper.createLocalDatas=function(serverSkeleton) {
        var table={};
        var data_len=0;
        fish.each(serverSkeleton.xAxis,function(xItem) {
             table[xItem.id]=xItem.data
             if(xItem.data.length>data_len){
                 data_len=xItem.data.length;
             }
        })
        fish.each(serverSkeleton.yAxis,function(yItem) {
            var nums=[];
            for (var i=0;i<data_len;i++){
                nums.push(fish.random(30,200));
            }
            table[yItem.id]=nums
        })
        var keys =fish.keys(table)
        var datas=[];
        for(var i =0 ;i<data_len;i++){
            var data={};
            for (var j=0;j<keys.length;j++){
               var key = keys[j];
               data[key]=table[key][i]||'';
            }
            datas.push(data);
        }


        return datas;

    }

    dbHelper.choiceY=function(array,ids) {
        fish.each(array,function(item) {
            item.choice=fish.contains(ids,item.id)?'y':'n';
        })
    }

    dbHelper.getAjaxJson=function(server) {
    }

    return dbHelper

});
