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
                    'Jun.',
                    'Feb.',
                    'Mar.',
                    'Apr.',
                    'May',
                    'Jun.',
                    'Jul.',
                    'Aug.',
                    'Sept.',
                    'Oct.'
                ]
            }
        ],
        yAxis: [
            {
                id: 'field_2',
                name: 'Data traffic'
            }, {
                id: 'field_3',
                name: '3G Data traffic'
            }, {
                id: 'field_4',
                name: '4G Data traffic '
            }, {
                id: 'field_5',
                name: 'Base station number'
            }, {
                id: 'field_6',
                name: '3G Base station number'
            }, {
                id: 'field_7',
                name: '4G Base station number'
            }, {
                id: 'field_8',
                name: 'Voice traffic'
            }, {
                id: 'field_9',
                name: '2G Voice traffic'
            }, {
                id: 'field_10',
                name: '3G Voice traffic'
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


    dbs.push({
        serverName: 'NetworkOverviewDemoQryService2',
        serverLabel: 'NetworkOverviewDemoQryService2',
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
                    'Jun.',
                    'Feb.',
                    'Mar.',
                    'Apr.',
                    'May',
                    'Jun.',
                    'Jul.',
                    'Aug.',
                    'Sept.',
                    'Oct.'
                ]
            }
        ],
        yAxis: [
            {
                id: 'field_2',
                name: '3G'
            }, {
                id: 'field_3',
                name: '4G'
            }
        ]
    })






    return fish.indexBy(dbs, 'serverName')

});
