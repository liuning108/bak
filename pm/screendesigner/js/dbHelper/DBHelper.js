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
        dbHelper.choiceY(serverSkeleton.xAxis,server.xAxis);
        dbHelper.choiceY(serverSkeleton.yAxis,server.yAxis);
        serverSkeleton.xNums=server.xNums;
        serverSkeleton.yNums=server.yNums;
        return serverSkeleton;

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
