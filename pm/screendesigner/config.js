/**
 * 前端项目的配置，每个项目需要修改此文件，主要配置包括压缩的css路径，自定义文件等等
 */
require.config({
    urlArgs: "v=8.1.10",
    //    paths: {
    //        'frm/portal/Portal': 'frm/portal/portal-all',
    //    },
    baseUrl: './',
    paths: {
        'moment': "frm/fish-desktop/third-party/fullcalendar/lib/moment/moment",
        'oss/opb': 'oss_public/opb',
        'cbp': 'oss_public/cbp',
        'oss/srv/core': 'oss_core/srv',
        'oss/im/core': 'oss_core/im',
        'oss/om/core': 'oss_core/om',
        'oss/epc/core': 'oss_core/epc',
        'oss/prov/core': 'oss_core/prov',
        'oss/im/kpn': 'oss_prj/kpn/im',
        'oss/oss_bp': 'oss_bp',
        'oss/slm/core': 'oss_core/slm'
    },
    deps: ['css!styles/cs-portal-ex', 'css!styles/oss', 'css!styles/animate.min.css', 'oss_core/pm/screendesigner/main']
});