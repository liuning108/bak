{
  "param": {
    "ACTION_TYPE": "loadData",
    "topic_no": "PMS-20180211-TP10352163",
    "chart_type": "grid",
    "modelCode": "PMPS_RAN_TRAFFIC",
    "modelBusiCode": "PMPS_RAN_TRAFFIC_BM",
    "dateGranu": "_H",
    "dateGranuType": "1",
    "etime": "",
    "btime": "",
    "selectedDimIndiList": [
      {
        "COL_NO": "STTIME",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Day)",
        "COL_INDEX": "DIM_0",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "HH",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Hour)",
        "COL_INDEX": "DIM_1",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "MI",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Minute)",
        "COL_INDEX": "DIM_2",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "CITY_ID",
        "COL_TYPE": "00",
        "COL_NAME": "City",
        "COL_INDEX": "DIM_3",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_CITY"
      }, {
        "COL_NO": "AREA_ID",
        "COL_TYPE": "00",
        "COL_NAME": "Area",
        "COL_INDEX": "DIM_4",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_AREA"
      }, {
        "COL_NO": "SITE_ID",
        "COL_TYPE": "00",
        "COL_NAME": "Site",
        "COL_INDEX": "DIM_5",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_SITE"
      }, {
        "COL_NO": "PB9ANTFC00002",
        "COL_TYPE": "01",
        "COL_NAME": "2G Total voice traffic（Erl）",
        "KPI_FORM": "case when max(PA2EOSB00018)=0 then 0 else round(sum(PA2EOSB00017)/max(PA2EOSB00018),3) end\n+\ncase when max(PA2EOSB00023)=0 then 0 else round(sum(PA2EOSB00022)/max(PA2EOSB00023),3) end+SUM(PA2ZU3B00061)",
        "COL_INDEX": "KPI_6",
        "displayType": "0",
        "isThousandDisplay": "true",
        "precision": "2",
        "showUnit": "false"
      }
    ],
    "dimAndIndiSortList": [],
    "allDimIndiList": [
      {
        "COL_NO": "STTIME",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Day)",
        "COL_INDEX": "DIM_0",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "HH",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Hour)",
        "COL_INDEX": "DIM_1",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "MI",
        "COL_TYPE": "00",
        "COL_NAME": "Statistical Time(Minute)",
        "COL_INDEX": "DIM_2",
        "GL_DIMKPI": "1"
      }, {
        "COL_NO": "CITY_ID",
        "COL_TYPE": "00",
        "COL_NAME": "City",
        "COL_INDEX": "DIM_3",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_CITY"
      }, {
        "COL_NO": "AREA_ID",
        "COL_TYPE": "00",
        "COL_NAME": "Area",
        "COL_INDEX": "DIM_4",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_AREA"
      }, {
        "COL_NO": "SITE_ID",
        "COL_TYPE": "00",
        "COL_NAME": "Site",
        "COL_INDEX": "DIM_5",
        "GL_DIMKPI": "1",
        "META_DIM_CODE": "PMP_DIM_SITE"
      }, {
        "COL_NO": "PB9ANTFC00002",
        "COL_TYPE": "01",
        "COL_NAME": "2G Total voice traffic（Erl）",
        "KPI_FORM": "case when max(PA2EOSB00018)=0 then 0 else round(sum(PA2EOSB00017)/max(PA2EOSB00018),3) end\n+\ncase when max(PA2EOSB00023)=0 then 0 else round(sum(PA2EOSB00022)/max(PA2EOSB00023),3) end+SUM(PA2ZU3B00061)",
        "COL_INDEX": "KPI_6",
        "displayType": "0",
        "isThousandDisplay": "true",
        "precision": "2",
        "showUnit": "false"
      }
    ],
    "hideColList": [],
    "vdimList": [],
    "sortList": [],
    "axisCfgSeries": "",
    "axisCfgXaxis": "",
    "topicFilterList": [],
    "topicFilterPluginList": [],
    "chartFilterStr": "",
    "topn": "",
    "sortCol": "",
    "sortType": ""
  },
  "emailAddress": "122273014@qq.com"
}