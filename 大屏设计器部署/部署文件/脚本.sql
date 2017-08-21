/** 配置服务**/
insert into tfm_services
  (service_name, env_id, env_desc, env_name, env_type, service_desc, service_type, definition, method_def, service_def_xml, cache_flag, state, project_code, base_service, module_name, version, modifier, modify_date)
values
  ('MPM_BSCREEN_MANAGE_SERVICE', 'OSS_PM', 'OSS_PM', 'OSS_PM', '1', '大屏设计器管理服务', 1, 'com.ztesoft.zsmart.oss.core.pm.bscreen.service.BScreenService', null, null, 0, 1, null, null, null, 1.0, 'liuning', sysdate);



/**创建序列**/
create sequence S_PM_BSCREEN_SEQ
minvalue 10000000
maxvalue 99999999
start with 10015700
increment by 1
cache 20;


/**插入序列信息**/
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSCLASS_SEQ', '01', null, null, '大屏主题类别序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');

insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTOPIC_SEQ', '01', null, null, '大屏主题序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');

insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTUSER_SEQ', '01', null, null, '大屏主题用户序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');

insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSTNODES_SEQ', '01', null, null, '大屏主题节点序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');


insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSSERVICE_SEQ', '01', null, null, '大屏服务序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');

insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_BSSERCOL_SEQ', '01', null, null, '大屏服务序列', 8, 'S_PM_BSCREEN_SEQ', 'PM');

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


create table PM_BSCREEN_NODES_SERVFIELD
(
  CLASS_NO   VARCHAR2(32) not null,
  TOPIC_NO   VARCHAR2(32) not null,
  NODE_NO    VARCHAR2(32) not null,
  SERVICE_NO VARCHAR2(32) not null
);


create table PM_BSCREEN_SERVICE_LIST
(
  SERVICE_NO     VARCHAR2(32) not null,
  SERVICE_NAME   VARCHAR2(256) not null,
  SERVICE_TYPE   CHAR(1) default '1' not null,
  SERVICE_SOURCE VARCHAR2(256) not null,
  OPER_USER      NUMBER(8),
  OPER_DATE      DATE default sysdate,
  BP_ID          VARCHAR2(16)
);


create table PM_BSCREEN_SERVICE_COL
(
  SERVICE_NO     VARCHAR2(32) not null,
  SERVICE_COL_NO VARCHAR2(32) not null,
  ATTR_SEQ       NUMBER(3) not null,
  ATTRS          VARCHAR2(4000) not null
);


create table PM_BSCREEN_TOPIC_CLASS
(
  CLASS_NO     VARCHAR2(32) not null,
  CLASS_NAME   VARCHAR2(256) not null,
  SEQ    NUMBER(3) not null,
  OPER_USER    NUMBER(8),
  OPER_DATE    DATE,
  BP_ID        VARCHAR2(16)
);



create table PM_BSCREEN_TOPIC_USER
(
  CLASS_NO     VARCHAR2(32) not null,
  TOPIC_NO    VARCHAR2(32) not null,
  OPER_USER    NUMBER(8)
);









