define([
    "oss_core/pm/screendesigner/actions/BScreenMgrAction",
       'oss_core/pm/screendesigner/js/dbHelper/virtualDB'],
        function(action,virtualDB) {
    var dbHelper = {}

    dbHelper.getServiceDataInfo = function(g) {
        var server = g.attrs.dbServer;
        var deferred = $.Deferred();
        setTimeout(function() {
            if (!server) {
                deferred.resolve();
                return;
            }
            dbHelper.queryServer(server,g).done(function(serverSkeleton) {
                fish.store.set(server.serverName,serverSkeleton);
                deferred.resolve(this);
            });
        }, 100)
        return deferred;
    }

    dbHelper.getJson = function(g) {
        var server = g.attrs.dbServer;
        var json = dbHelper.getLocalJson(server);
        return json

    }

    dbHelper.queryServer = function(server,g) {
        var deferred = $.Deferred();
        action.getServerSkeleton(server.serverName,function(data) {
            console.log('getServerSkeleton')
            console.log(data);
            //如果找不到server.serverName不存在，用默认的
             var skeleton = data.serverSkeleton||{'data':virtualDB[server.serverName]}
             var serverSkeleton=skeleton.data;
            if (!serverSkeleton) {
                //还有显示error信息。
                g.error=true; //图表数据产生问题
                if(g.attrs.oldServerSkeleton){
                 fish.toast('warn',"use the old data")
                 console.log(JSON.parse(g.attrs.oldServerSkeleton));
                 serverSkeleton=JSON.parse(g.attrs.oldServerSkeleton);
                }else{
                    //数据出现问题
                    fish.toast('warn',"Can't find "+server.serverName+" service, use the default service")
                    console.log("Can't find "+server.serverName+" service, use the default service");
                    server.serverName = "NetworkOverviewDemoQryService"
                    serverSkeleton = virtualDB[server.serverName];
                }

            }else{
                g.error=false;
                g.attrs.oldServerSkeleton=JSON.stringify(serverSkeleton);
            }

            deferred.resolve(serverSkeleton)
        }, 100);
        return deferred
    }

    dbHelper.getLocalJson = function(server) {
        var serverSkeleton= fish.store.get(server.serverName);
       console.log("getLocalJson222");
       console.log(serverSkeleton);

        if(!serverSkeleton) return null;

        dbHelper.choiceY(serverSkeleton.xAxis, server.xAxis, 'x');
        dbHelper.choiceY(serverSkeleton.yAxis, server.yAxis, 'y');
        serverSkeleton.xNums = server.xNums;
        serverSkeleton.yNums = server.yNums;
        serverSkeleton.xMinNums = server.xMinNums;
        serverSkeleton.yMinNums = server.yMinNums;
        serverSkeleton.colModels = dbHelper.createColModel(serverSkeleton);
        serverSkeleton.datas = dbHelper.createLocalDatas(serverSkeleton);
         return serverSkeleton;
    }

    dbHelper.createColModel = function(serverSkeleton) {
        var heards = serverSkeleton.xAxis.concat(serverSkeleton.yAxis);
        var colModels = fish.map(heards, function(head) {
            var col = {
                name: head.id,
                label: head.name,
                axis: head.axis,
                choice: head.choice
            }
            return col;
        });
        return colModels;
    }

    dbHelper.createLocalDatas = function(serverSkeleton) {
        var table = {};
        var data_len = 0;
        fish.each(serverSkeleton.xAxis, function(xItem) {
            table[xItem.id] = xItem.data
            if (xItem.data.length > data_len) {
                data_len = xItem.data.length;
            }
        })
        console.log("serverSkeleton.yAxis");

        console.log(serverSkeleton.yAxis);
        console.log(serverSkeleton.xAxis);
        fish.each(serverSkeleton.yAxis, function(yItem) {
            if(data_len<=0){
                data_len=yItem.data.length;
            }
            var nums = [];
            for(var i =0;i<data_len;i++){
              var numValue =fish.isNaN(Number(yItem.data[i]))?yItem.data[i]:Number(yItem.data[i]);
              nums.push(numValue)
            }
            table[yItem.id] = nums
            if (serverSkeleton.xAxis.length <= 0) {
                if (table[yItem.id].length > data_len) {
                    data_len = table[yItem.id].length;
                }
            }
        })

        var keys = fish.keys(table)
        var datas = [];
        for (var i = 0; i < data_len; i++) {
            var data = {};
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                data[key] = table[key][i] ;
            }
            datas.push(data);
        }

        console.log("createLocalDatas datas");
        console.log(datas);

        return datas;

    }

    dbHelper.choiceY = function(array, ids, xy) {
        fish.each(array, function(item) {
            item.choice = fish.contains(ids, item.id)
                ? 'y'
                : 'n';
            item.axis = xy
        })
    }

    dbHelper.toChoiceDB = function(db) {
        var cDB = {}

        var tables = this.toTable(db.datas);
        var colModels = db.colModels;
        arrayXY = fish.partition(tables, function(col) {
            var model = fish.find(colModels, function(model) {
                return model.name == col.name;
            });
            return model.axis == 'x'
        })
        cDB.xAxis = this.choiceFilter(arrayXY[0], colModels);
        cDB.yAxis = this.choiceFilter(arrayXY[1], colModels);
        return cDB;
    }
    dbHelper.choiceFilter = function(array, colModels) {
        var mapArray = fish.map(array, function(item) {

            var info = fish.find(colModels, function(mode) {
                return mode.name == item.name
            })
            item.label = info.label;
            item.choice = info.choice
            return item;
        })
        return fish.where(mapArray, {'choice': 'y'})
    }
    dbHelper.toTable = function(datas) {
        var keys = fish.keys(datas[0])
        return fish.map(keys, function(key) {
            var item = {};
            item.name = key
            item.data = fish.pluck(datas, key);
            return item
        })
    }

    return dbHelper

});
