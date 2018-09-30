/**
 * AdhocFactory
 */
define([
        'oss_core/inms/pm/adhocdesigner/views/TopicMain',
        'oss_core/inms/pm/adhoc/views/AdhocMain',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction'
    ],
    function(topicMain, adhocMain, action) {
        return {

            adhocConfigForDashBoard: function(uiContainerHeight, topicNo) {
                var catalogList = [
                    {id:-1, name:'DashBoard Catalog'},
                    {id:-1, name:'DashBoard Catalog'},
                    {id:-1, name:'DashBoard Catalog'}
                ];
                var view = new topicMain({
                    uiContainerHeight: uiContainerHeight,
                    topicName: 'DashBoard Topic',
                    topicNo: topicNo,
                    classNo: this.CLASS_NO,
                    catalogList: catalogList,
                    detailParam: null,
                    forDashBoard: true
                });
                view.render();
                return view;
            },

            adhocForDashBoard: function(uiContainerHeight, adhocNo) {
                var view = new adhocMain({
                    topicNo: adhocNo,
                    previewType: 2,
                    forDashBoard: true,
                    uiContainerHeight: uiContainerHeight
                });
                view.render();
                return view;
            },

            adhocForMailSend: function(uiContainerHeight, adhocNo, param) {
                var view = new adhocMain({
                    topicNo: adhocNo,
                    previewType: 2,
                    forDashBoard: true,
                    uiContainerHeight: uiContainerHeight,
                    dateGranu: param.dateGranu,
                    btime: param.btime,
                    etime: param.etime,
                    loadDataParam: param
                });
                view.render();
                return view;
            }

        }
    }
);
