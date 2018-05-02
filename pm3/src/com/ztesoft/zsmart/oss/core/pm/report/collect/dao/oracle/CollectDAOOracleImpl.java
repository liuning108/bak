package com.ztesoft.zsmart.oss.core.pm.report.collect.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;


import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.core.pm.report.collect.dao.CollectDAO;

/**
 * 
 * 网元健康度专题相关的Oracle DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-8-31 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.report.collect.dao.oracle <br>
 */
public class CollectDAOOracleImpl extends CollectDAO {
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
    public void getCollectInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        String btime = (String)dict.getValueByName("BTIME");
        String etime = (String)dict.getValueByName("ETIME");
        String flag = (String) dict.getValueByName("FLAG");
        String emsType = (String) dict.getValueByName("EMS_TYPE", "");
        String emsCode = (String) dict.getValueByName("EMS_CODE", "");
        String taskState = (String) dict.getValueByName("COLLECT_TASK_STATE", "");
        String moName = (String) dict.getValueByName("COLLECT_MONAME", "");
        String moFileName = (String) dict.getValueByName("FILE_NAME", "");
        
        String page = dict.getString("page");
        String rowNum = dict.getString("rowNum");
        String isExport = dict.getString("isExport");
        
        if("ems".equals(flag)){ //distinct EMS下的ftp信息
        
            sql ="with distinct_inst as \n"
                +" (select distinct a.ftp_ip, a.ftp_user, b.ems_type_rel_id \n"
                +"    from pm_task_collect_inst_log a, pm_adapter_info b    \n"
                +"   where a.adapter_no = b.adapter_no      \n"
                +"    and btime >= to_date(?,'yyyy-mm-dd hh24:mi:ss')  \n"
                +"    and etime <= to_date(?,'yyyy-mm-dd hh24:mi:ss')  \n"
                +" )    \n"
                +"select distinct a.ems_name, b.ems_code, c.ftp_ip, c.ftp_user  \n"
                +"  from pm_ems a, pm_ems_type_rel b, distinct_inst c   \n"
                +" where a.ems_code = b.ems_code    \n"
                +"   and b.ems_type_rel_id = c.ems_type_rel_id(+)   \n"
                + tool.ternaryExpression("".equals(emsType), "", " and b.ems_type_rel_id in (select ems_type_rel_id from pm_ems_type_rel r where r.ems_type_code = ?) \n")
                + tool.ternaryExpression("".equals(emsCode), "", " and b.ems_code = ? \n")
                +"  and b.ems_code <> 'ANY_VENDOR'  \n"
                +" order by ems_name    \n";
            
            params.clear();
            params.set("", btime);
            params.set("", etime);
            if(!"".equals(emsType)){
                params.set("", emsType);
            }
            if(!"".equals(emsCode)){
                params.set("", emsCode);
            }
            
            dict.set("collectEmsList", queryList(sql, params));
        } else if("collect".equals(flag)){ //采集日志信息
            
            String runSql ="select a.collect_moname,a.source_file_name,a.task_state,    \n"
                + "   to_char(a.btime, 'yyyy-mm-dd hh24:mi:ss') as btime,               \n"
                + "   a.source_file_time,a.remote_path,b.ems_type_rel_id,t.ems_type     \n"
                + "    from pm_task_collect_inst_log a,pm_adapter_info b,               \n"
                + "   (select b.ems_type,a.ems_type_rel_id from pm_ems_type_rel a,pm_ems_type b    \n"
                + "     where a.ems_type_code = b.ems_type_code ) t  \n"
                + "  where  a.adapter_no = b.adapter_no              \n"
                + "   and b.ems_type_rel_id = t.ems_type_rel_id(+)   \n"
                + "   and a.btime >= to_date(?,'yyyy-mm-dd hh24:mi:ss')         \n"
                + "   and a.etime <= to_date(?,'yyyy-mm-dd hh24:mi:ss')         \n"
                + "   and b.ems_code = ?  \n"
                + tool.ternaryExpression("".equals(emsType), "", " and b.ems_type_rel_id in (select ems_type_rel_id from pm_ems_type_rel r where r.ems_type_code = ?) \n") 
                + tool.ternaryExpression("".equals(taskState), "", " and a.task_state = ? \n")
                + tool.ternaryExpression("".equals(moFileName), "", " and upper(a.source_file_name) like upper('%'||?||'%') \n")
                + tool.ternaryExpression("".equals(moName), "", " and upper(a.collect_moname) like upper('%'||?||'%') \n");
            
            params.clear();
            params.set("", btime);
            params.set("", etime);
            params.set("", emsCode);
            if(!"".equals(emsType)){
                params.set("", emsType);
            }
            if(!"".equals(taskState)){
                params.set("", taskState);
            }
            if(!"".equals(moFileName)){
                params.set("", moFileName);
            }
            if(!"".equals(moName)){
                params.set("", moName);
            }
            
            if(isExport!=null || "1".equals(isExport)){//导出
                ArrayList<DynamicDict> colModel =  (ArrayList<DynamicDict>) dict.getList("colModel");
                String fileName = getUtilDmo().exportExcel(colModel, runSql, params);
                dict.set("fileName", fileName);
            }else{
                if(rowNum==null || "".equals(rowNum) || "0".equals(rowNum)){
                    sql = "select count(1) as count  \n"
                        + "  from (  \n"
                        + runSql
                        + ") s   \n" ;
                }else{
                
                    sql = "select w.collect_moname,w.source_file_name,w.task_state, \n"
                        + "   w.btime,w.source_file_time,w.remote_path,w.ems_type    \n"
                        + "  from ( select rownum as num, s.* from ( \n"
                        + runSql
                        + " ) s ) w  \n" 
                        + " where w.num > ((?-1)*?) and w.num <= (?*?)";

                    params.set("", page);
                    params.set("", rowNum);
                    params.set("", page);
                    params.set("", rowNum);
                
                }
                dict.set("collectLogList", queryList(sql, params));
            }
        }
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
