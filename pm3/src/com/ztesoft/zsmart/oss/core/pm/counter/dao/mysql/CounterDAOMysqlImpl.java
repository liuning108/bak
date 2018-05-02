package com.ztesoft.zsmart.oss.core.pm.counter.dao.mysql;

import java.util.ArrayList;
import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.ServiceFlow;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.Security;
import com.ztesoft.zsmart.oss.opb.util.StringUtil;
import com.ztesoft.zsmart.oss.core.pm.counter.dao.CounterDAO;

/**
 * 
 * Counter查询操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-9-27 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.counter.dao.oracle <br>
 */
public class CounterDAOMysqlImpl extends CounterDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    
    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public void getCounterData(DynamicDict dict) throws BaseAppException {
        
        ParamArray params = new ParamArray();
        String btime = (String)dict.getValueByName("BTIME","");
        String etime = (String)dict.getValueByName("ETIME","");
        String moCode = dict.getString("MO_CODE", true);
        String modelCode = dict.getString("MODEL_CODE", true);
        String page = dict.getString("page");
        String rowNum = dict.getString("rowNum");
        String isExport = dict.getString("isExport");
            
        sql = "select a.mo_code,          \n"
            + "       b.template_no,      \n"
            + "       b.disp_name,        \n"
            + "       b.disp_no,          \n"
            + "       b.dim_table_code,   \n"
            + "       b.dim_col_no,       \n"
            + "       b.cond_where,       \n"
            + "       b.disp_order,       \n"
            + "       b.cnt_phy_col       \n"
            + "  from pm_cntqry_modisp a, pm_cntqry_modisp_detail b   \n"
            + " where a.mo_code = ?                                   \n"
            + "   and a.template_no = b.template_no                   \n"
            + "  order by b.disp_order                                \n";
        
        DynamicDict dimFieldDict = new DynamicDict();
        params.clear();
        params.set("", moCode);
        dimFieldDict.set("dimFieldList", queryList(sql, params));
        
        HashMap<String, DynamicDict> dimFieldMap = new HashMap<String, DynamicDict>();
        for (int i = 0; i < dimFieldDict.getCount("dimFieldList"); i++) {
            DynamicDict fieldDict = tool.getDict(dimFieldDict, "dimFieldList", i);
            String fieldCode = fieldDict.getString("CNT_PHY_COL",true);
            dimFieldMap.put(fieldCode.toUpperCase(), fieldDict);
        }        
        
        DynamicDict moFieldDict = new DynamicDict();
        moFieldDict.set("MO_CODE",moCode);
        moFieldDict.setServiceName("MPM_META_MEASURE_FIELD_QUERY");
        ServiceFlow.callService(moFieldDict, true);
        
        HashMap<String, DynamicDict> moFieldMap = new HashMap<String, DynamicDict>();
        for (int i = 0; i < moFieldDict.getCount("moField"); i++) {
            DynamicDict fieldDict = tool.getDict(moFieldDict, "moField", i);
            String fieldCode = fieldDict.getString("FIELD_CODE",true).toUpperCase();
            moFieldMap.put(fieldCode, fieldDict);
        }
        
        HashMap<String, DynamicDict> dimValMap = new HashMap<String, DynamicDict>();
        for (int i = 0; i < dict.getCount("dimValList"); i++) {
            DynamicDict dimValDict = tool.getDict(dict, "dimValList", i);
            String fieldCode = dimValDict.getString("FIELD_CODE",true).toUpperCase();
            String fieldValue = dimValDict.getString("FIELD_VALUE");
            
            if("BTIME".equals(fieldCode)){  //对开始、结束字段特殊处理
                btime = fieldValue ;
            }else if("ETIME".equals(fieldCode)){
                etime = fieldValue ;
            }else{
                dimValMap.put(fieldCode, dimValDict);
            }
        }
        
        String sql = ""
            + "select upper(a.column_name) as column_name "
            + "  from   information_schema.COLUMNS    a left join "
            + "       (select upper(a.field_code) as field_code, a.field_no "
            + "          from pm_mo_detail a "
            + "         where a.mo_code = 'CELLGPRS') x on a.column_name = x.field_code "
            + "         left join "
            + "       (select b.disp_order, upper(b.cnt_phy_col) as cnt_phy_col "
            + "          from pm_cntqry_modisp a, pm_cntqry_modisp_detail b "
            + "         where a.mo_code = 'CELLGPRS' "
            + "           and a.template_no = b.template_no) y    on    a.column_name = y.cnt_phy_col "
            + " where a.table_name = 'PMPI_ERIC_CELLGPRS' "
            + "                  "
            + "   and not exists (select 1 "
            + "          from pm_mo_detail m "
            + "         where m.mo_code = 'CELLGPRS' "
            + "           and m.field_type = '1' "
            + "           and m.field_code = upper(a.column_name)) "
            + " order by x.field_no, y.disp_order";
        DynamicDict phyColDict = new DynamicDict();
        params.clear();
        params.set("", moCode);
        params.set("", moCode);
        params.set("", modelCode);
        params.set("", moCode);
        phyColDict.set("phyColList", queryList(sql, params));
        
        String colStr = "";
        String dimTables = "";
        String dimWheres = "";
        String wheres = "";
        
        for (int i = 0; i < phyColDict.getCount("phyColList"); i++) {
            DynamicDict colDict = tool.getDict(phyColDict, "phyColList", i);
            String colCode = colDict.getString("COLUMN_NAME",true).toUpperCase();
            DynamicDict dimColDict = dimFieldMap.get(colCode);
            
            if(dimColDict!=null){//物理列为翻译维度字段，需要显示
                String dimCol = dimColDict.getString("DIM_COL_NO");
                String dispNo = dimColDict.getString("DISP_NO");
                String dispName = dimColDict.getString("DISP_NAME");
                String condWhere = dimColDict.getString("COND_WHERE");
                String dimTable = dimColDict.getString("DIM_TABLE_CODE");
                 
                if(!StringUtil.isEmpty(dimCol) && !StringUtil.isEmpty(dispNo)){
                    String tableA = "dim"+i ;
                    dimCol = dimCol.replaceAll("['$']", "a") ;
                    condWhere = condWhere.replaceAll("['$']", "a") ;
                    if(!StringUtil.isEmpty(dimTable)){
                        dimCol = dimCol.replaceAll(dimTable, tableA) ;
                        condWhere = condWhere.replaceAll(dimTable, tableA) ;
                        dimTables += ","+dimTable+" "+tableA ;
                    }
                    if(StringUtil.isEmpty(colStr)){
                        colStr = dimCol + " as "+dispNo;
                    }else{
                        colStr += "," + dimCol + " as "+dispNo;
                    }
                    
                    if(!StringUtil.isEmpty(condWhere)){
                        dimWheres += " and "+condWhere+" \n" ;
                    }
                    DynamicDict colModelDict = new DynamicDict();

                    colModelDict.set("field_type", "1");
                    colModelDict.set("data_type", "3");
                    colModelDict.set("sortable", false);
                    colModelDict.set("name", dispNo.toUpperCase());
                    colModelDict.set("label", dispName);
                    colModelDict.set("width", "150");
                    dict.setValueByName("colModel", colModelDict, 1) ;
                }
                
            }else{
            
                DynamicDict moColDict = moFieldMap.get(colCode);

                if(moColDict!=null){ //物理列为Mo配置中的非counter字段，需要显示
                    String fieldType = moColDict.getString("FIELD_TYPE");
                    String dataType = moColDict.getString("DATA_TYPE");
                    String fieldName = moColDict.getString("FIELD_NAME");
                    
                    if("0".equals(fieldType)){// UR:1164707改为仅自动展示维度列（非counter、属性列）
                        DynamicDict colModelDict = new DynamicDict();
                        colModelDict.set("width", "120");
                        
                        if("0".equals(fieldType)){//维度列
                            if("2".equals(dataType)){//时间维度
                                colModelDict.set("width", "150");
                                colModelDict.set("formatter", "date");
                                if(StringUtil.isEmpty(colStr)){
                                    colStr = " to_char("+colCode+",'yyyy-mm-dd hh24:mi:ss') as "+colCode ;
                                }else{
                                    colStr += ", to_char("+colCode+",'yyyy-mm-dd hh24:mi:ss') as "+colCode ;
                                }
                                
                            }else{
                                if(StringUtil.isEmpty(colStr)){
                                    colStr = colCode ;
                                }else{
                                    colStr += ","+colCode ;
                                }
                                
                            }
                        }else{//这段先冗余在这里吧。
                            if(StringUtil.isEmpty(colStr)){
                                colStr = colCode ;
                            }else{
                                colStr += ","+colCode ;
                            }
                        }
                        colModelDict.set("field_type", fieldType);
                        colModelDict.set("data_type", dataType);
                        colModelDict.set("sortable", false);
                        colModelDict.set("name", colCode);
                        colModelDict.set("label", fieldName);
                        
                        dict.setValueByName("colModel", colModelDict, 1) ;
                    }
                }
            
            }
            
            
            
            //拼接钻取条件
            DynamicDict dimValDict = dimValMap.get(colCode);
            if(dimValDict!=null){ //物理列为钻取条件字段，需要做过滤条件用
                DynamicDict moColDict = moFieldMap.get(colCode);
                String value = dimValDict.getString("FIELD_VALUE");
                String dataType = "";
                
                if(moColDict!=null){ 
                    dataType = moColDict.getString("DATA_TYPE");
                }
                if("2".equals(dataType)){
                    value = " to_date('"+value+"', 'yyyy-mm-dd hh24:mi:ss') \n";
                }else if("1".equals(dataType)){
                    value = "'"+value+"'";
                }
                
                wheres += " and "+colCode+" = "+ value +" \n" ;
            }
            
        }
        
        //拼接Counter列
        for (int i = 0; i < dict.getCount("counterList"); i++) {
            DynamicDict fieldDict = tool.getDict(dict, "counterList", i);
            String fieldCode = fieldDict.getString("FIELD_CODE",true);
            String fieldName = fieldDict.getString("FIELD_NAME");
            
            if(StringUtil.isEmpty(colStr)){
                colStr = fieldCode ;
            }else{
                colStr += ","+fieldCode ;
            }
                        
            DynamicDict colModelDict = new DynamicDict();
            colModelDict.set("field_type", "2");
            colModelDict.set("data_type", "1");
            colModelDict.set("sortable", false);
            colModelDict.set("name", fieldCode.toUpperCase());
            colModelDict.set("label", fieldName);
            colModelDict.set("width", "150");
            dict.setValueByName("colModel", colModelDict, 1) ;
        }
        
        if(phyColDict.getCount("phyColList") < 1){ //物理列不存在，在物理表不存在，不要做查询，直接返回
            return ;
        }
        
        
        //拼接时间条件
        if(btime!=null && !StringUtil.isEmpty(btime)){
            wheres += " and collecttime >= to_date(?, 'yyyy-mm-dd hh24:mi:ss') \n";
        }
        if(etime!=null && !StringUtil.isEmpty(etime)){
            wheres += " and collecttime <= to_date(?, 'yyyy-mm-dd hh24:mi:ss') \n";
        }
        
        //拼接二次过滤、排序条件
        String filter_condition = tool.secondFilter(dict);
        String order_condition = tool.secondOrder(dict);
        
        if(filter_condition==null) filter_condition = "";
        if(order_condition==null) order_condition = "";
        
        sql = " select x.*  from ( select "+colStr+" from ( \n"
            + "     select m.* from "+modelCode+" m  \n" 
            + "      where 1=1 \n"
            + wheres
            + " )  a  \n"
            + tool.ternaryExpression(StringUtil.isEmpty(dimTables), "", dimTables )
            + " where 1=1 \n"
            + tool.ternaryExpression(StringUtil.isEmpty(dimWheres), "", dimWheres ) 
            + ") x  where 1=1 "
            + tool.ternaryExpression(StringUtil.isEmpty(filter_condition), "", "and ("+filter_condition+") \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(order_condition), "", " order by "+order_condition+" \n" );
        
        params.clear();
        if(btime!=null && !StringUtil.isEmpty(btime)){
            params.set("", btime);
        }
        if(etime!=null && !StringUtil.isEmpty(etime)){
            params.set("", etime);
        }
        
        if(isExport!=null || "1".equals(isExport)){//导出
            
            ArrayList<DynamicDict> colModel =  (ArrayList<DynamicDict>) dict.getList("colModel");
            String fileName = getUtilDmo().exportExcel(colModel, sql, params);
            dict.set("fileName", fileName);
        }else{
            if(rowNum==null || StringUtil.isEmpty(rowNum) || "0".equals(rowNum)){
                sql = "select count(1) as count \n" 
                    + " from (" +sql +") w";
            }else{
                sql = "select w.*   \n"
                    + "  from (     \n" 
                    + "     select rownum as num,s.* from ( "+ sql +") s  \n" 
                    + ") w \n"
                    + " where w.num > (?-1)*?   \n"
                    + " and w.num <= ?*?        \n";
                params.set("", page);
                params.set("", rowNum);
                params.set("", page);
                params.set("", rowNum);
            }
            
            dict.set("counterData", queryList(sql, params));
        }
        
    }

    @Override
    public void getCounterBase(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        String emsType = (String) dict.getValueByName("EMS_TYPE", "");
        String emsCode = (String) dict.getValueByName("EMS_CODE", "");
        String emsVer = (String) dict.getValueByName("EMS_VER_CODE", "");
        String moCode = (String) dict.getValueByName("MO_CODE", "");
        String fieldName = (String) dict.getValueByName("FIELD_NAME", "");
        String maxRowNum = dict.getString("maxRowNum");
        String exFieldCode = "";
        
        for (int i = 0; i < dict.getCount("exFieldCode"); i++) {
            DynamicDict fieldDict = tool.getDict(dict, "exFieldCode", i);
            String fieldCode = fieldDict.getString("FIELD_CODE",true);
            
            if(Security.checkSQLinject(fieldCode)) continue;

            if(StringUtil.isEmpty(exFieldCode)){
                exFieldCode = "'"+fieldCode.trim()+"'" ;
            }else{
                exFieldCode += ",'"+fieldCode.trim()+"'" ;
            }
        }
        
        sql = "select a.mo_code,     \n"
            + "       a.field_code,  \n"
            + "       a.field_name,  \n"
            + "       a.field_type,  \n"
            + "       a.data_type,   \n"
            + "       b.mo_name, \n"
            + "       b.mo_name, \n"
            + "       (select m.model_code   \n"
            + "          from pm_adapter_mo m    \n"
            + "         where m.mo_code = a.mo_code  \n"
            + "           and rownum = 1) as model_code  \n"
            + "  from pm_mo_detail a, pm_mo b, pm_ems_type_rel c  \n"
            + " where a.mo_code = b.mo_code  \n"
            + "   and a.field_type = '1'   \n"
            + "   and b.ems_type_rel_id = c.ems_type_rel_id   \n"
            + tool.ternaryExpression(StringUtil.isEmpty(emsType), "", " and c.ems_type_code = ? \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(emsCode), "", " and c.ems_code = ? \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(emsVer), "", " and b.ems_ver_code = ? \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(moCode), "", " and b.mo_code = ? \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(fieldName), "", " and upper(a.field_name) like upper('%'||?||'%') \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(exFieldCode), "", " and a.mo_code||'.'||a.field_code not in ("+exFieldCode+") \n" )
            + tool.ternaryExpression(StringUtil.isEmpty(maxRowNum), "", " and rownum <= ? \n" )
            + " order by b.mo_name,a.field_name   \n";
        
        params.clear();
        if(!StringUtil.isEmpty(emsType)){
            params.set("", emsType);
        }
        if(!StringUtil.isEmpty(emsCode)){
            params.set("", emsCode);
        }
        if(!StringUtil.isEmpty(emsVer)){
            params.set("", emsVer);
        }
        if(!StringUtil.isEmpty(moCode)){
            params.set("", moCode);
        }
        if(!StringUtil.isEmpty(fieldName)){
            params.set("", fieldName);
        }
        if(!StringUtil.isEmpty(maxRowNum)){
            params.set("", maxRowNum);
        }
        
        dict.set("counterList", queryList(sql, params));
    }
    
    @Override
    public void getCounterList(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        String kpiCode = dict.getString("KPI_CODE", true);
        
        String counterStr = this.getKpiForm(kpiCode);
        
        //获得item的信息
        sql = "select a.mo_code,    \n"
            + "       a.field_code, \n"
            + "       a.field_name, \n"
            + "       a.field_type, \n"
            + "       a.data_type,  \n"
            + "       b.mo_name,    \n"
            + "       (select m.model_code  \n"
            + "          from pm_adapter_mo m   \n"
            + "         where m.mo_code = a.mo_code \n"
            + "           and rownum = 1) as model_code \n"
            + "  from pm_mo_detail a, pm_mo b   \n"
            + " where a.mo_code = b.mo_code \n"
            + "   and ? like '%[' || field_code || ']%'  \n";
        
        params.set("", counterStr);
        dict.set("counterList", queryList(sql, params));
    }
    
    private String getKpiForm(String kpiCode) throws BaseAppException {
        
        ParamArray params = new ParamArray();
        
        //获得所有KPI的公式
        sql = "select kpi_form   \n"
            + "  from pm_kpi_form    \n"
            + " where (case  \n"
            + "         when (select kpi_type from pm_kpi where kpi_code = ?) = '2' then \n"
            + "          (select kpi_form from pm_kpi_form where kpi_code = ?)   \n"
            + "         else \n"
            + "          ?   \n"
            + "       end) like '%' || kpi_code || '%'   \n";
        params.clear();
        params.set("", kpiCode);
        params.set("", kpiCode);
        params.set("", kpiCode);
        
        DynamicDict kpiDict = new DynamicDict();
        
        kpiDict.set("kpiFormList", queryList(sql, params)); 
        
        String counterStr = "";
        for (int i = 0; i < kpiDict.getCount("kpiFormList"); i++) {
            DynamicDict kDict = tool.getDict(kpiDict, "kpiFormList", i);
            String kpiForm = (String)kDict.getValueByName("KPI_FORM","");
            counterStr += kpiForm;
        }
        
        return counterStr;
    }

    
    @Override
    public void insert(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public int update(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int delete(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String paramString) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public HashMap<String, String> selectById(String paramString) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }
    
    /**
     * 
     * 获取Util DOMAIN对象 <br> 
     *  
     * @author Srd <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractUtilInfo getUtilDmo() throws BaseAppException {
        return (AbstractUtilInfo) GeneralDMOFactory.create(AbstractUtilInfo.class);
    }
    
}
