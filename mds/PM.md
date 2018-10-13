# PM工作任务

记录工作中遇到的问题

-------------------
[TOC]

## 元数据KPI Management
KPI Management oss_core/pm/meta/kpi/views/KpiMgr

## 元数据Business Model Management
Business Model Management	oss_core/pm/meta/model/busi/views/ModelBusiMgr



## 元数据Physical Model Management
- [X] 建立菜单
Metadata Management ->Physical Model Management
- [X] 显示页面
oss_core/pm/meta/model/phy/views/ModelPhyMgr
- [X] 数据服务
    测试服务


## 元数据Measure Object Management
- [x] 建立菜单
Metadata Management -> Measure Object Management
- [x] 显示页面
oss_core/pm/meta/measure/views/MeasureMgr
- [x] 数据服务
    测试服务


## 元数据Dimesion Management
- [x] 建立菜单
Metadata Management -> Dimesion Management
- [x] 显示页面
oss_core/pm/meta/dim/views/DimMgr
- [x] 数据服务
    测试服务


## 元数据参数管理
- [x] 建立菜单
Metadata Management -> Parameter Management
- [x] 显示页面
oss_core/pm/meta/parammgr/views/ParamMgr
- [x] 数据服务
下载Src
测试服务


## Util 服务
1. 查询ems

POST /util/ems

请求报文样例：

{}

响应报文样例:

{
  "verList": [
    {
      "EMS_CODE": "ANY_VENDOR",
      "EMS_NAME": "Any Vendor",
      "EMS_VER_CODE": "ANY_VENDOR_V1",
      "EMS_VER_NAME": "V1.0"
    },
    {
      "EMS_CODE": "ERICSS_OSS_CN",
      "EMS_NAME": "Ericsson-OSS",
      "EMS_VER_CODE": "ERICSS_OSS_CN_V1",
      "EMS_VER_NAME": "OSS RC 14.2B"
    }
  ],
  "emsList": [
    {
      "EMS_CODE": "ANY_VENDOR",
      "EMS_NAME": "Any Vendor",
      "EMS_TYPE_REL_ID": "10",
      "EMS_TYPE_CODE": "A2",
      "EMS_TYPE": "01-GSM"
    },
    {
      "EMS_CODE": "ERICSS_OSS_CN",
      "EMS_NAME": "Ericsson-OSS",
      "EMS_TYPE_REL_ID": "1",
      "EMS_TYPE_CODE": "A2",
      "EMS_TYPE": "01-GSM"
    }
  ]
}

2. 查询 paraValue

POST /util/paravalue

请求报文样例：
{"PARA_ID": "ALARM_DATE"}

响应报文样例：

[
  {
    "PARA_ID": "ALARM_DATE",
    "PARA_VALUE": "0",
    "PARA_ORDER": 1,
    "PARA_NAME": "Any time",
    "PARA_F_NAME": null,
    "PARA_DESC": null,
    "PARA_NAME_CN": "任何时间"
  },
  {
    "PARA_ID": "ALARM_DATE",
    "PARA_VALUE": "1",
    "PARA_ORDER": 2,
    "PARA_NAME": "Excluding weekends",
    "PARA_F_NAME": null,
    "PARA_DESC": null,
    "PARA_NAME_CN": "非周末"
  }
]

3. 查询pluginSpec MPM_UTIL_PLUGIN_SPEC:PM系统插件规格查询服务对应的处理方法

POST /util/pluginspec

请求报文样例：

{
"PLUGIN_TYPE":"04"
}

响应报文样例:

{
  "pluginList": [
    {
      "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00005",
      "SEQ": 0,
      "PLUGIN_TYPE": "04",
      "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filedelayplug.ericsson.ASNTransferCSV",
      "PLUGIN_NAME": "ASN interface file processing component",
      "BP_ID": null
    },
    {
      "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00019",
      "SEQ": 0,
      "PLUGIN_TYPE": "04",
      "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm .plugin.filedelayplug.ericsson.GGSNXmlTransferCsv",
      "PLUGIN_NAME": "ggsn XML interface file processing component",
      "BP_ID": null
    }
}


4. 查询       * MPM_UTIL_PLUGIN_PARAM:PM系统插件参数查询服务对应的处理方法

POST /util/pluginparam


请求报文样例：

{
"PLUGIN_NO":"PPMS_20170803121121_10215769",
"PLUGIN_TYPE":"04"
}

响应报文样例:

{
  "pluginParam": [
    {
      "PLUGIN_NO": "PPMS_20170803121121_10215769",
      "PLUGIN_TYPE": "04",
      "SEQ": 0,
      "PLUGIN_NAME": null,
      "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filedelayplug.ericsson.ASNTransferCSV",
      "PARAM_SEQ": 0,
      "PARAM_NAME": null,
      "PARAM_CODE": "INTERFACE_MO_CODE",
      "PARAM_VALUE": "TRUNKROUTE",
      "BP_ID": null
    }
  ]
}



###新增测量对象
addMeasure
POST /measure/measureadd
请求报文样例：
{
    "MO_NAME": "Test11111",
    "CODE_PREFIX": "P",
    "MO_CODE": "PTESTAAAAA",
    "EFF_TIME": "2018-06-13",
    "EXP_TIME": "2048-06-13",
    "MO_TYPE": "1",
    "IS_COL_HEADER": "0",
    "IS_QUOT": "0",
    "SEPA_STR": "/",
    "FILENAME_RULE_SPEC": "PPMS_SEPC_20170807093000_00010",
    "PROC_RULE_SPEC": "PPMS_SEPC_20170807093000_00005",
    "MO_NAME_DESC": "DESC",
    "COMMENTS": "COMMENTS",
    "OPER_TYPE": "add",
    "EMS_TYPE_REL_ID": "1",
    "EMS_VER_CODE": "ERICSS_OSS_CN_V1",
    "EMS_CODE": "ERICSS_OSS_CN",
    "fileNamePlugin": {
        "OPER_TYPE": "add",
        "CODE_PREFIX": "P",
        "PLUGIN_TYPE": "03",
        "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00010",
        "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filenameplug.ericsson.ASNFileName",
        "PLUGIN_NAME": "ASN interface file name component",
        "PLUGIN_NO": "",
        "pluginParam": [
            {
                "_id_": "jqg150",
                "PARAM_CODE": "a",
                "PARAM_VALUE": "a"
            }
        ]
    },
    "procRulePlugin": {
        "OPER_TYPE": "add",
        "CODE_PREFIX": "P",
        "PLUGIN_TYPE": "04",
        "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00005",
        "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filedelayplug.ericsson.ASNTransferCSV",
        "PLUGIN_NAME": "ASN interface file processing component",
        "PLUGIN_NO": "",
        "pluginParam": [
            {
                "_id_": "jqg152",
                "PARAM_CODE": "b",
                "PARAM_VALUE": "b"
            }
        ]
    },
    "moField": [
        {
            "FIELD_NAME": "MSC_V",
            "FIELD_CODE": "aaa",
            "EFF_TIME": "2018-06-13",
            "FIELD_TYPE": "1",
            "DATA_TYPE": "1",
            "VAFIELD": "ad",
            "_id_": "jqg154"
        },
        {
            "FIELD_NAME": "MSC_V1",
            "FIELD_CODE": "aaaa",
            "EFF_TIME": "2018-06-13",
            "FIELD_TYPE": "1",
            "DATA_TYPE": "1",
            "VAFIELD": "ada",
            "_id_": "jqg155"
        }
    ]
}

响应报文样例：

{
  "PROC_RULE": "PPMS_20180613103443_00100028",
  "fileNamePlugin": {
    "OPER_TYPE": "add",
    "PLUGIN_TYPE": "03",
    "PLUGIN_NO": "PPMS_20180613103443_00100027",
    "PLUGIN_NAME": "ASN interface file name component",
    "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00010",
    "pluginParam": [
      {
        "_id_": "jqg150",
        "PARAM_CODE": "a",
        "PARAM_VALUE": "a"
      }
    ],
    "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filenameplug.ericsson.ASNFileName",
    "CODE_PREFIX": "P"
  },
  "MO_CODE": "PTESTAAAAA",
  "procRulePlugin": {
    "OPER_TYPE": "add",
    "PLUGIN_TYPE": "04",
    "PLUGIN_NO": "PPMS_20180613103443_00100028",
    "PLUGIN_NAME": "ASN interface file processing component",
    "PLUGIN_SPEC_NO": "PPMS_SEPC_20170807093000_00005",
    "pluginParam": [
      {
        "_id_": "jqg152",
        "PARAM_CODE": "b",
        "PARAM_VALUE": "b"
      }
    ],
    "PLUGIN_CLASSPATH": "com.ztesoft.zsmart.oss.core.pm.plugin.filedelayplug.ericsson.ASNTransferCSV",
    "CODE_PREFIX": "P"
  },
  "moField": [
    {
      "FIELD_NAME": "MSC_V",
      "FIELD_CODE": "aaa",
      "EFF_TIME": "2018-06-13",
      "FIELD_TYPE": "1",
      "DATA_TYPE": "1",
      "VAFIELD": "ad",
      "_id_": "jqg154"
    },
    {
      "FIELD_NAME": "MSC_V1",
      "FIELD_CODE": "aaaa",
      "EFF_TIME": "2018-06-13",
      "FIELD_TYPE": "1",
      "DATA_TYPE": "1",
      "VAFIELD": "ada",
      "_id_": "jqg155"
    }
  ],
  "MO_NAME": "Test11111",
  "SEPA_STR": "/",
  "EMS_VER_CODE": "ERICSS_OSS_CN_V1",
  "FILENAME_RULE": "PPMS_20180613103443_00100027",
  "MO_TYPE": "1",
  "EMS_TYPE_REL_ID": "1",
  "PROC_RULE_SPEC": "PPMS_SEPC_20170807093000_00005",
  "MO_NAME_DESC": "DESC",
  "COMMENTS": "COMMENTS",
  "EMS_CODE": "ERICSS_OSS_CN",
  "OPER_TYPE": "add",
  "EXP_TIME": "2048-06-13",
  "IS_QUOT": "0",
  "IS_COL_HEADER": "0",
  "FILENAME_RULE_SPEC": "PPMS_SEPC_20170807093000_00010",
  "EFF_TIME": "2018-06-13",
  "CODE_PREFIX": "P"
}
