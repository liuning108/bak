/** 配置服务**/
insert into tfm_services
  (service_name, env_id, env_desc, env_name, env_type, service_desc, service_type, definition, method_def, service_def_xml, cache_flag, state, project_code, base_service, module_name, version, modifier, modify_date)
values
  ('MPM_DASHBOARD_TOPIC_SERVICE', 'OSS_PM', 'OSS_PM', 'OSS_PM', '1', 'DASHBOARD TOPIC SERVICE', 1, 'com.ztesoft.zsmart.oss.core.pm.dashboard.service.DashBoardService', null, null, 0, 1, null, null, null, 1.0, 'liuning', sysdate);




/**创建序列**/
create sequence S_PM_DASHBOARD_SEQ
minvalue 10000000
maxvalue 99999999
start with 10015700
increment by 1
cache 20;


/**插入序列信息**/
insert into OPBS_ID_CONF (ID_NAME, ID_FORMAT, SCRIPT, PREFIX, NOTES, LENGTH, SEQUENCE, SYSTEM_ID)
values ('PM_DASHBOARD_SEQ', '01', null, null, 'PM_DASHBOARD', 8, 'S_PM_DASHBOARD_SEQ', 'PM');


/**创建表**/

create table PM_DASHBOARD_CLASS
(
  CLASS_NO   VARCHAR2(32) not null,
  CLASS_NAME VARCHAR2(256) not null,
  SEQ        NUMBER(3) default 0 not null,
  OPER_USER  NUMBER(8),
  OPER_DATE  DATE,
  BP_ID      VARCHAR2(16)
);


create table PM_DASHBOARD_SYSCLASS
(
  CLASS_TYPE VARCHAR2(2) default '00' not null,
  TOPIC_NO   VARCHAR2(32) not null,
  SEQ        NUMBER(3) default 0 not null,
  OPER_USER  NUMBER(8) not null,
  OPER_DATE  DATE
);

create table PM_DASHBOARD_TOPIC_LIST
(
  TOPIC_NO   VARCHAR2(32) not null,
  TOPIC_NAME VARCHAR2(256) not null,
  ATTRS      VARCHAR2(4000) not null,
  IS_SHARE   VARCHAR2(2) default 0,
  STATE      VARCHAR2(1) default 0 not null,
  OPER_USER  NUMBER(8),
  OPER_DATE  DATE,
  BP_ID      VARCHAR2(16),
  CLASS_NO   VARCHAR2(32)
);


create table PM_DASHBOARD_TOPIC_NODES
(
  TOPIC_NO VARCHAR2(32) not null,
  NODE_NO  VARCHAR2(32) not null,
  ATTRS    VARCHAR2(4000) not null,
  ATTR_SEQ NUMBER(3) not null
);



       




