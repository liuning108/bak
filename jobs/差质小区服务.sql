
delete from tfm_error_log
 where service_name in ('MPM_BADQUALITYCELL_INDEX_SERVICE');

delete from tfm_service_cat_list
 where service_name in ('MPM_BADQUALITYCELL_INDEX_SERVICE');

delete from tfm_services
 where service_name in ('MPM_BADQUALITYCELL_INDEX_SERVICE');

insert into tfm_services (SERVICE_NAME, ENV_ID, ENV_DESC, ENV_NAME, ENV_TYPE, SERVICE_DESC, SERVICE_TYPE, DEFINITION, METHOD_DEF, SERVICE_DEF_XML, CACHE_FLAG, STATE, PROJECT_CODE, BASE_SERVICE, MODULE_NAME, VERSION, MODIFIER, MODIFY_DATE)
values ('MPM_BADQUALITYCELL_INDEX_SERVICE', 'OSS_PM', 'OSS_PM', 'OSS_PM', '0', '差质小区首页服务', '1', 'com.ztesoft.zsmart.oss.core.pm.badqualitycell.index.service.CellIndexService', '', '', '0', '1', '', '', '', '1.0', 'Tizen', to_date('07-04-2017', 'dd-mm-yyyy'));

insert into tfm_service_cat_list (SERVICE_NAME, CAT_CODE)
values ('MPM_BADQUALITYCELL_INDEX_SERVICE', 'OSS_PM');
