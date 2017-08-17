/** 配置服务**/
insert into tfm_services
  (service_name, env_id, env_desc, env_name, env_type, service_desc, service_type, definition, method_def, service_def_xml, cache_flag, state, project_code, base_service, module_name, version, modifier, modify_date)
values
  ('MPM_BSCREEN_MANAGE_SERVICE', 'OSS_PM', 'OSS_PM', 'OSS_PM', '1', '大屏设计器管理服务', 1, 'com.ztesoft.zsmart.oss.core.pm.bscreen.service.BScreenService', null, null, 0, 1, null, null, null, 1.0, 'liuning', sysdate);



/**创建序列**/
create sequence S_PM_ADHOC_SEQ
minvalue 10000000
maxvalue 99999999
start with 10015700
increment by 1
cache 20;


/**插入序列信息**/
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSCLASS_SEQ', '01', null, null, '大屏主题类别序列', 8, 'S_PM_ADHOC_SEQ', 'PM');
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTOPIC_SEQ', '01', null, null, '大屏主题序列', 8, 'S_PM_ADHOC_SEQ', 'PM');
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTUSER_SEQ', '01', null, null, '大屏主题用户序列', 8, 'S_PM_ADHOC_SEQ', 'PM');
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTNODES_SEQ', '01', null, null, '大屏主题节点序列', 8, 'S_PM_ADHOC_SEQ', 'PM');

/**创建表**/

create table PM_BSCREEN_TOPIC_LIST
(
  TOPIC_NO   VARCHAR2(32) not null,
  TOPIC_NAME VARCHAR2(256) not null,
  ATTRS      VARCHAR2(4000) not null,
  IMAGE_PATH VARCHAR2(1024),
  IS_SHARE   VARCHAR2(2) default 0,
  STATE      VARCHAR2(1) default 0 not null,
  OPER_USER  NUMBER(8),
  OPER_DATE  DATE,
  BP_ID      VARCHAR2(16),
  CLASS_NO   VARCHAR2(32)
);


create table PM_BSCREEN_TOPIC_NODES
(
  TOPIC_NO VARCHAR2(32) not null,
  NODE_NO  VARCHAR2(32) not null,
  ATTRS    VARCHAR2(4000) not null,
  ATTR_SEQ NUMBER(3) not null
);


/*** 插入主表信息**/


insert into PM_BSCREEN_TOPIC_LIST (TOPIC_NO, TOPIC_NAME, ATTRS, IMAGE_PATH, IS_SHARE, STATE, OPER_USER, OPER_DATE, BP_ID, CLASS_NO)
values ('PMS_20170524111313_10002349', 'OSS监控流程', '{"bgitem":0,"bk_attrs":{"background-color":"#000"},"h":1080,"style":"1","w":1920}', 'upload/bsimage/PMS_20170524111313_10002349.png', '0', '0', 1, to_date('24-05-2017 11:18:47', 'dd-mm-yyyy hh24:mi:ss'), null, null);

insert into PM_BSCREEN_TOPIC_LIST (TOPIC_NO, TOPIC_NAME, ATTRS, IMAGE_PATH, IS_SHARE, STATE, OPER_USER, OPER_DATE, BP_ID, CLASS_NO)
values ('PMS_20170607110403_10004370', '码号销售大屏', '{"bgitem":"bgItem1","bk_attrs":{"background":"url(oss_core/pm/screendesigner/images/backgrounds/1.png) 50% 50% / auto 100% repeat"},"h":1080,"style":"1","w":1920}', 'upload/bsimage/PMS_20170607110403_10004370.png', '0', '0', 1, to_date('07-06-2017 11:09:22', 'dd-mm-yyyy hh24:mi:ss'), null, null);


insert into PM_BSCREEN_TOPIC_LIST (TOPIC_NO, TOPIC_NAME, ATTRS, IMAGE_PATH, IS_SHARE, STATE, OPER_USER, OPER_DATE, BP_ID, CLASS_NO)
values ('PMS_20170605093752_10002904', '网络概览', '{"bgitem":0,"bk_attrs":{"background-color":"#000"},"h":1080,"style":"1","w":1920}', 'upload/bsimage/PMS_20170605093752_10002904.png', '0', '0', 1, to_date('05-06-2017 09:43:14', 'dd-mm-yyyy hh24:mi:ss'), null, null);

/*** 插入子表信息**/


insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013462', '{"datas":[167,137,70,174,172,62],"dbServer":{"islocal":true,"serverName":"流程预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"dotColor":"#fff","ft_attrs":{"center":{"x":318.2890625,"y":-206.2386018026985},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":695.734375,"y":311.397796394603},"translate":{"x":1198.687747862644,"y":1080.2533613274054},"x":-29.59375,"y":-359.09375},"labelColor":"#ffffff","labelStyle":"1","lineColor":"#c7f404","names":["CRM下单","服务单","资源变更单","流程启动","派单","归档"],"titleColor":"#fff","type":"StripLine"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013463', '{"dbServer":{"islocal":true,"serverName":"流程预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":0,"y":-32.2421875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":370.5520001521626,"y":434.484375},"translate":{"x":1528.2483589496892,"y":314.05565235623334},"x":-185.2760000760813,"y":-249.484375},"labelStyle":"1","names":["CRM下单","服务单","资源变更单","流程启动","派单","归档"],"seriesData":[122,108,74,109,101,105],"title":"流程总数","type":"PieRing"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013464', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":0,"y":13.9765625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":239.96875,"y":91.828125},"translate":{"x":228.09965918439295,"y":96.03556344936548},"x":-59.984375,"y":-31.9375},"numColor":"#ffffff","title":"当日施工调度人数","titleColor":"#ddff00","type":"text","value":77}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013465', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":36.4921875,"y":13.9765625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":162.953125,"y":91.828125},"translate":{"x":544.3107298154895,"y":96.03556344936547},"x":-59.984375,"y":-31.9375},"numColor":"#ffffff","title":"装机数","titleColor":"#ddff00","type":"text","value":992}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013466', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_4"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":13.9921875,"y":13.9765625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":207.953125,"y":91.828125},"translate":{"x":861.7839153070198,"y":92.6480519614626},"x":-59.984375,"y":-31.9375},"numColor":"#ffffff","title":"自动激活单数","titleColor":"#ddff00","type":"text","value":523}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013467', '{"barColor":"#19d5ff","bgColor":"#595959","bgShow":true,"chartColor":"#ffffff","dbServer":{"islocal":true,"serverName":"停复机预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":266,"y":180.546875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":532,"y":392.90625},"translate":{"x":576.6660621301667,"y":662.6597637977437},"x":1,"y":-15.90625},"hh":377,"title":"停复机在途复机量","titleColor":"#ebeb6d","type":"StripBar","valueColor":"#ffffff","ww":532,"xAxisDatas":[71,140,44,189,163,106,75,39,89,98,130,123,122],"xAxisNames":["南京","无锡","徐州","常州","苏州","南通","淮安","盐城","扬州","镇江","泰州","宿迁","连云港"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013468', '{"bgColor":"#595959","bgShow":true,"c1Color":"#00cbe9","c2Color":"#e89f21","chartColor":"#ffffff","datas":[[169,112,103,78,56,118,167,129,56,167,100,67,120],[165,88,185,173,146,44,152,178,132,38,90,96,116]],"dbServer":{"islocal":true,"serverName":"新装量预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2","field_3"],"yMinNums":2,"yNums":2},"ft_attrs":{"center":{"x":266,"y":180.546875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":532,"y":392.90625},"translate":{"x":574.5357857724381,"y":263.47074341441544},"x":0,"y":-15.90625},"hh":377,"labelStyle":1,"labels":["3G","4G"],"title":"宽带今日新装量","titleColor":"#ebeb6d","type":"PileBar","valueColor":"#fff","ww":532,"xAxisNames":["南京","无锡","徐州","常州","苏州","南通","淮安","盐城","扬州","镇江","泰州","宿迁","连云港"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013469', '{"bgShow":true,"boradColor":"#595959","dbServer":{"islocal":true,"serverName":"当月新装用户数预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":266,"y":180.546875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":532,"y":392.90625},"translate":{"x":29.17815254822387,"y":260.9980242456604},"x":12,"y":-16.84375},"hh":377,"labelStyle":"1","names":["流量升级包-30","乐享4G-99","飞Young4G-99","乐享4G-399","乐享4G-59","乐享4G-129","乐享4G-199"],"seriesData":[200,150,149,147,193,71,103],"title":"当月新装用户数","titleColor":"#ebeb6d","type":"Annular","ww":532}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013470', '{"LineColor":"#51f711","bgColor":"#595959","bgShow":true,"datas":[176,149,127,168,145,76,105,128,38,147,177,125,114],"dbServer":{"islocal":true,"serverName":"峻工量预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":241,"y":40.546875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":532,"y":392.90625},"translate":{"x":50.849273144605974,"y":795.6462034206396},"x":-25,"y":-156.015625},"hh":377,"labelColor":"#fff","normalColor":"#ffffff","normalText":"正常","normalValue":"80","riskColor":"#ff3600","riskText":"危险","riskValue":"150","s":false,"switch":true,"title":"C网超3分钟未峻工量","titleColor":"#ebeb6d","type":"bar","urgencyColor":"#ffcc00","urgencyText":"紧急","urgencyValue":"100","valueColor":"#fff","ww":532,"xAxisNames":["南京","无锡","徐州","常州","苏州","南通","淮安","盐城","扬州","镇江","泰州","宿迁","连云港"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170524111313_10002349', 'PMS_20170712170455_10013471', '{"RiskText":"危机","UrgencyText":"紧急","colors":["#02b8ed","#dca708","#f70202"],"datas":[115,51,173,53,99,98],"dbServer":{"islocal":true,"serverName":"流程预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"fontColor":"#fff","ft_attrs":{"center":{"x":291.7990046614632,"y":-24.086805555555557},"ratio":1,"rotate":0,"scale":{"x":1.0452367599868755,"y":1.0452367599868755},"size":{"x":662.7230093229264,"y":132.04861111111111},"translate":{"x":1238.3624853289443,"y":651.3896726117813},"x":-39.578125,"y":-90.11111111111111},"names":["CRM下单","服务单","资源变更单","流程启动","派单","归档"],"normalText":"正常","switchWarring":"on","type":"Nodes","values":["70","120","150"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013398', '{"ft_attrs":{"center":{"x":44.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.6937754643390505,"y":0.6937754643390505},"size":{"x":269.859375,"y":61.8125},"translate":{"x":705.9066422159481,"y":124.41176470588236},"x":-60.53125,"y":-42.375},"title":"码号销售金额","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013399', '{"ft_attrs":{"center":{"x":29.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.8051298409430321,"y":0.8051298409430321},"size":{"x":299.859375,"y":61.8125},"translate":{"x":616.740289422192,"y":293.8235294117647},"x":-60.53125,"y":-42.375},"title":"码号地区销售比列","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013400', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.7112041104625957,"y":0.7112041104625957},"size":{"x":290.578125,"y":61.8125},"translate":{"x":91.53633854645813,"y":79.74171126172116},"x":-60.53125,"y":-42.375},"title":"3G地区销售指标","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013401', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.6937754643390509,"y":0.6937754643390509},"size":{"x":290.578125,"y":61.8125},"translate":{"x":1498.9885189408792,"y":85.58823529411765},"x":-60.53125,"y":-42.375},"title":"4G地区销售指标","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013402', '{"ft_attrs":{"center":{"x":29.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.7402661327487801,"y":0.7402661327487801},"size":{"x":299.859375,"y":61.8125},"translate":{"x":93.23610945135766,"y":410.0029480282862},"x":-60.53125,"y":-42.375},"title":"码号销售年度指标","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013403', '{"ft_attrs":{"center":{"x":37.4453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.6659368701880545,"y":0.6659368701880545},"size":{"x":284.859375,"y":61.8125},"translate":{"x":79.07219545578529,"y":670.5882352941176},"x":-60.53125,"y":-42.375},"title":"码号地区排行榜","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013404', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.7494526526410418,"y":0.7494526526410418},"size":{"x":290.578125,"y":61.8125},"translate":{"x":1505.6288936019587,"y":396.1764705882353},"x":-60.53125,"y":-42.375},"title":"3G码号销售十强","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013405', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.7091435789047764,"y":0.7091435789047764},"size":{"x":290.578125,"y":61.8125},"translate":{"x":1499.0550773828058,"y":710.7812148407552},"x":-60.53125,"y":-42.375},"title":"4G码号销售十强","titleColor":"#ddff00","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013406', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.6223438367587781,"y":0.6223438367587781},"size":{"x":290.578125,"y":61.8125},"translate":{"x":955.2713891444341,"y":418.61830518263616},"x":-60.53125,"y":-42.375},"title":"3G销售月度指标","titleColor":"#faf54a","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013407', '{"ft_attrs":{"center":{"x":34.5859375,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.665936870188058,"y":0.665936870188058},"size":{"x":290.578125,"y":61.8125},"translate":{"x":967.5358569093275,"y":656.4705882352941},"x":-60.53125,"y":-42.375},"title":"4G销售月度指标","titleColor":"#faf54a","type":"Character"}', 0);


insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013408', '{"datas":[90,61,178,199,156,199],"dbServer":{"islocal":true,"serverName":"流程预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"dotColor":"#fff","ft_attrs":{"center":{"x":318.2890625,"y":-207.79353952294872},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":695.734375,"y":308.25667095410256},"translate":{"x":20,"y":30},"x":-29.578125,"y":-361.9375},"labelColor":"#fff","labelStyle":1,"lineColor":"#c7f404","names":["CRM下单","服务单","资源变更单","流程启动","派单","归档"],"titleColor":"#fff","type":"StripLine"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013409', '{"datas":[180,57,182,56,95,44],"dbServer":{"islocal":true,"serverName":"流程预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"dotColor":"#fff","ft_attrs":{"center":{"x":318.2890625,"y":-200.3387309069923},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":695.734375,"y":323.1662881860154},"translate":{"x":20,"y":30},"x":-29.578125,"y":-361.9375},"labelColor":"#fff","labelStyle":1,"lineColor":"#c7f404","names":["CRM下单","服务单","资源变更单","流程启动","派单","归档"],"titleColor":"#fff","type":"StripLine"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013410', '{"PanelColor":"#006699","dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_11"],"yMinNums":1,"yNums":1},"digits":9,"ft_attrs":{"center":{"x":341.7109375,"y":14.0390625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":683.421875,"y":111.921875},"translate":{"x":651.3656971343814,"y":150.72409307703427},"x":0,"y":-41.9375},"titleColor":"#fde148","type":"NumsBar","unit":"元","val":123123230}', 0);


insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013411', '{"axisColor":"#11bde8","barColor":"#11bde8","datas":[182,133,90,93,121,176],"dbServer":{"islocal":true,"serverName":"码号销售预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":73.7265625,"y":-62.5},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":242.546875,"y":170.90625},"translate":{"x":899.3376996154734,"y":591.4311758488124},"x":-46.03125,"y":-148.671875},"names":["1月","2月","3月","4月","5月","6月"],"titleColor":"#ffffff","type":"BarBase"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013412', '{"axisColor":"#11bde8","barColor":"#11bde8","datas":[88,54,126,138,112,151],"dbServer":{"islocal":true,"serverName":"码号销售预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":73.7265625,"y":-62.5},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":242.546875,"y":170.90625},"translate":{"x":910.2365146391375,"y":818.8148362793394},"x":-46.03125,"y":-148.671875},"names":["1月","2月","3月","4月","5月","6月"],"titleColor":"#fff","type":"BarBase"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013023', '{"datas":[89,145,138,69,167,98,182,84,89,141,46,127,146,193],"dbServer":{"islocal":true,"serverName":"指标完成率预览服务","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":205.5859375,"y":389.0390625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":449.796875,"y":861.921875},"translate":{"x":1386.1438076927197,"y":135.9647347882642},"x":0,"y":0},"labelStyle":"1","names":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","娄底","郴州","永州","怀化","湘西"],"type":"LabelBar"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013024', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_6"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":136.6025404000326,"y":271.6876130755031},"ratio":1,"rotate":0,"scale":{"x":1.1236430542547864,"y":1.1236430542547864},"size":{"x":200.00000003727115,"y":270.46852384899375},"translate":{"x":978.3888301965188,"y":60.92814914813798},"x":36.602540381397034,"y":136.4533511510062},"ratevalue":99.7,"title":"端到端接通率","titleColor":"#01b1f1","type":"ArcProcess"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013025', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_5"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":136.6025404000326,"y":271.6876130755031},"ratio":1,"rotate":0,"scale":{"x":1.150137994452242,"y":1.150137994452242},"size":{"x":200.00000003727115,"y":270.46852384899375},"translate":{"x":651.4575692627346,"y":57.584401689355595},"x":36.602540381397034,"y":136.45335115100622},"ratevalue":"98.7","title":"呼叫全程成功率","titleColor":"#01b150","type":"ArcProcess"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013026', '{"avgColor":"#d9ff5d","datas":[77,29,70,34,84,40,13,39,58,79,61,50],"dbServer":{"islocal":true,"serverName":"投诉数预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":182.5078125,"y":31.078125},"ratio":1,"rotate":0,"scale":{"x":1.2381451309971367,"y":1.2381451309971367},"size":{"x":400.984375,"y":217.84375},"translate":{"x":146.2710931183574,"y":820.3082107416474},"x":-59.984375,"y":-41.9375},"title":"文字名称","titleColor":"#ffe613","type":"MoveBar"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013027', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_7"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":0,"y":15.6640625},"ratio":1,"rotate":0,"scale":{"x":1.194006790912753,"y":1.194006790912753},"size":{"x":200.29837846062838,"y":255.171875},"translate":{"x":803.0376542861952,"y":804.5090512545095},"x":-100.14918923031419,"y":-100},"title":"基站数","titleColor":"#01d15e","type":"CircleNum","unit":"万","val":3.5}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013028', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_8"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":0,"y":15.6640625},"ratio":1,"rotate":0,"scale":{"x":1.2380992433929265,"y":1.2380992433929265},"size":{"x":200.29837846062838,"y":255.171875},"translate":{"x":1126.0792332796834,"y":795.3165395552},"x":-100.14918923031419,"y":-100},"title":"HLR","titleColor":"#01b1f7","type":"CircleNum","unit":"","val":300}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013029', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_10"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":63.5859375,"y":47.984375},"ratio":1,"rotate":0,"scale":{"x":0.744969447437011,"y":0.744969447437011},"size":{"x":248.484375,"y":219.8125},"translate":{"x":344.72384255977363,"y":130.67027003167485},"x":-59.984375,"y":-41.9375},"iconPath":"1.png","title":"WLAN注册用户数","titleColor":"#1e9afa","type":"IconBar","val":230}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013030', '{"dbServer":{"islocal":true,"serverName":"实时数据预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_9"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":63.59375,"y":47.984375},"ratio":1,"rotate":0,"scale":{"x":0.721761020872064,"y":0.721761020872064},"size":{"x":270.59375,"y":219.8125},"translate":{"x":104.4993979409062,"y":131.06301488654452},"x":0,"y":0},"iconPath":"2.png","title":"VLR注册用户增幅数","titleColor":"#01c689","type":"IconBar","val":130}', 0);


insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013031', '{"dbServer":{"islocal":true,"serverName":"网络规模预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"den":800,"denominatorTitle":"总量","ft_attrs":{"center":{"x":197,"y":-28.9453125},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":406,"y":81.890625},"translate":{"x":94.64996879756708,"y":552.4526665703137},"x":-6,"y":-69.828125},"memberTitle":"增幅","num":344,"processColor":"#01b1f1","title":"流量","titleColor":"#e7e7e7","type":"ProgressBar"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013032', '{"dbServer":{"islocal":true,"serverName":"网络规模预览服务","xAxis":[],"xMinNums":0,"xNums":0,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"den":777,"denominatorTitle":"总量","ft_attrs":{"center":{"x":197,"y":-28.9453125},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":406,"y":81.890625},"translate":{"x":99.06759906759908,"y":452.15469613259677},"x":-6,"y":-69.890625},"memberTitle":"增幅","num":255,"processColor":"#41f101","title":"话务量","titleColor":"#e7e7e7","type":"ProgressBar"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013016', '{"ft_attrs":{"center":{"x":59.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":239.859375,"y":61.8125},"translate":{"x":757.8610169026074,"y":63.84174908901619},"x":-59.984375,"y":-41.9375},"title":"网络质量","titleColor":"#ffffff","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013017', '{"ft_attrs":{"center":{"x":37.4453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":284.859375,"y":61.8125},"translate":{"x":1439.5740707685125,"y":64.92712129099428},"x":-59.984375,"y":-41.9375},"title":"地区指标完成率","titleColor":"#ecece9","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013018', '{"ft_attrs":{"center":{"x":52.4453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":254.859375,"y":61.8125},"translate":{"x":148.6027939670249,"y":64.23086614132946},"x":-59.984375,"y":-41.9375},"title":"用户发展量","titleColor":"#eeeeee","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013413', '{"SeriesData":[196,155,62,185,65,40,58,73,122,30,121,125,62,95],"dbServer":{"islocal":true,"serverName":"地区码号销售指标","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":17.03125,"y":0.7734375},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":325.6875,"y":299.859375},"translate":{"x":1694.787583572645,"y":206.16337223148375},"x":0,"y":-149.99999999999997},"labelStyle":"3","type":"PieBase","xAxisData":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","娄底","郴州","永州","怀化","湘西"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013414', '{"SeriesData":[134,125,43,84,178,36,68,123,131,184,148,77,112,141],"dbServer":{"islocal":true,"serverName":"地区码号销售指标","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":14.40625,"y":1.328125},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":330.9375,"y":298.6875},"translate":{"x":254.92180312787485,"y":222.35294117647058},"x":-154.203125,"y":-140.765625},"labelStyle":"2","type":"PieBase","xAxisData":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","娄底","郴州","永州","怀化","湘西"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013415', '{"areaColor":"#164e62","axisColor":"#11bde8","dbServer":{"islocal":true,"serverName":"码号销售年度指标","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"dotColor":"#28ffc3","ft_attrs":{"center":{"x":159.1953125,"y":-62.5},"ratio":1,"rotate":0,"scale":{"x":1.2696617378605952,"y":1.2696617378605952},"size":{"x":381.609375,"y":170.90625},"translate":{"x":121.98404465037211,"y":606.8793442057653},"x":-5.007459461515737,"y":-111.4},"lineColor":"#11bde8","titleColor":"#ffffff","type":"StripLineBase","xAxisDatas":[83,194,148,147,93,93,136,100,136,58],"xAxisNames":["2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013019', '{"ft_attrs":{"center":{"x":59.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":239.859375,"y":61.8125},"translate":{"x":712.8833294429415,"y":597.4778761061945},"x":-59.984375,"y":-41.9375},"title":"网络容量","titleColor":"#fffffe","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013020', '{"ft_attrs":{"center":{"x":52.4453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":254.859375,"y":61.8125},"translate":{"x":150.90279970890722,"y":684.9791775117126},"x":-59.984375,"y":-41.9375},"title":"网络投诉数","titleColor":"#f1f2ef","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013021', '{"ft_attrs":{"center":{"x":39.1015625,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":0.7491210749911753,"y":0.7491210749911753},"size":{"x":281.546875,"y":61.8125},"translate":{"x":366.77708256846034,"y":689.2152524726705},"x":-59.984375,"y":-41.9375},"title":"(当前时点数据)","titleColor":"#a2a39d","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170605093752_10002904', 'PMS_20170711172535_10013022', '{"ft_attrs":{"center":{"x":59.9453125,"y":-11.015625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":239.859375,"y":61.8125},"translate":{"x":134.090501191348,"y":346.0079401724378},"x":-59.984375,"y":-41.9375},"title":"网络规模","titleColor":"#ffffff","type":"Character"}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013416', '{"dbServer":{"islocal":true,"serverName":"地区码号销售","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_2"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":142.4453125,"y":104.0390625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":311.515625,"y":291.921875},"translate":{"x":1546.1535280733149,"y":434.04830676956226},"x":0,"y":0},"lineColor":"#4cd5f4","names":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","怀化","益阳","娄底"],"titleColor":"#ffffff","type":"LineBase","xAxisDatas":[76,162,182,100,102,188,79,93,127,55]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013417', '{"dbServer":{"islocal":true,"serverName":"地区码号销售","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":142.4453125,"y":104.0390625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":311.515625,"y":291.921875},"translate":{"x":1552.1001166032386,"y":767.1826625386997},"x":-14.484375,"y":-8.3828125},"lineColor":"#4cd5f4","names":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","怀化","益阳","娄底"],"titleColor":"#ffffff","type":"LineBase","xAxisDatas":[166,159,116,163,147,92,162,189,108,135]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013418', '{"dbServer":{"islocal":true,"serverName":"地区码号销售指标","xAxis":["field_1"],"xMinNums":1,"xNums":1,"yAxis":["field_3"],"yMinNums":1,"yNums":1},"ft_attrs":{"center":{"x":1.4140625,"y":1.2421875},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":743.265625,"y":740.546875},"translate":{"x":978.7933897959385,"y":642.1666285379322},"x":-110.16320725962447,"y":-110},"labelStyle":"1","seriesData":[106,110,147,82,157,147,186,73,164,143,87,192,47,69],"type":"CircularRing","xAxisData":["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","娄底","郴州","永州","怀化","湘西"]}', 0);

insert into PM_BSCREEN_TOPIC_NODES (TOPIC_NO, NODE_NO, ATTRS, ATTR_SEQ)
values ('PMS_20170607110403_10004370', 'PMS_20170712151714_10013419', '{"datas":[["长沙",54,150],["株洲",197,155],["湘潭",78,107],["衡阳",86,130],["邵阳",163,169],["岳阳",143,195],["常德",72,148],["怀化",31,157],["益阳",133,75],["娄底",97,90]],"dbServer":{"islocal":true,"serverName":"地区码号销售","xAxis":["field_1"],"xMinNums":0,"xNums":99,"yAxis":["field_2","field_3"],"yMinNums":1,"yNums":99},"divideColor":"#006598","ft_attrs":{"center":{"x":150.0546875,"y":116.2265625},"ratio":1,"rotate":0,"scale":{"x":1,"y":1},"size":{"x":374.734375,"y":316.296875},"translate":{"x":116.9065011469443,"y":712.019528459157},"x":-18,"y":-12.375},"isSeqPos":"2","seqColor":"#beb148","seqName":"排名","seqShow":"on","titleColor":"#ddff00","titles":["area","3G","4G"],"type":"TableBase","valueColor":"#f1fff7"}', 0);

