define([], function() {

    var dbs = [];

    dbs.push({
        serverName: 'NetworkOverviewDemoQryService',
        serverLabel: 'NetworkOverviewDemoQryService',
        xAxis: [
            {
                id: 'field_1',
                name: 'City',
                data: [
                    'Chang',
                    'Zhu',
                    'Xiang',
                    'Heng',
                    'Shao',
                    'Yue',
                    'CHA',
                    'Zhang',
                    'Yiya',
                    'Loudi'
                ]
            }, {
                id: 'field_11',
                name: 'Date',
                data: [
                    '08h',
                    '09h',
                    '10h',
                    '11h',
                    '12h',
                    '13h',
                    '14h',
                    '15h',
                    '16h',
                    '17h'
                ]
            },
            {
              id:'filed_map',
              'name':'area',
              data:[
                "ZW-BU",
                "ZW-HA",
                "ZW-MA",
                "ZW-MC",
                "ZW-ME",
                "ZW-MI",
                "ZW-MN",
                "ZW-MS",
                "ZW-MV",
                "ZW-MW"
              ]
            },
            {
              id:'filed_china_map',
              'name':'Chian Area',
              data:[
                "CN-11",
                "CN-50",
                "CN-43",
                "CN-44",
                "CN-62",
                "CN-45",
                "CN-52",
                "CN-46",
                "CN-32",
                "CN-41"
              ]
            }
        ],
        yAxis: [
            {
                id: 'field_2',
                name: 'Data traffic',
                data: [
                    80,
                    50,
                    40,
                    30,
                    70,
                    90,
                    85,
                    25,
                    95,
                    95,
                ]
            }, {
                id: 'field_3',
                name: '3G Data traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_4',
                name: '4G Data traffic ',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_5',
                name: 'Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_6',
                name: '3G Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_7',
                name: '4G Base station number',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_8',
                name: 'Voice traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_9',
                name: '2G Voice traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]

            }, {
                id: 'field_10',
                name: '3G Voice traffic',
                data: [
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                    fish.random(20,300),
                ]
            }, {
                id: 'field_12',
                name: ' Total Base station',
                data: [
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572,
                    34572
                ]
            }
        ]
    })




    return fish.indexBy(dbs, 'serverName')

});
