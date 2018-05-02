/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.dao.oracle;

import java.io.File;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;

import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.core.pm.knowledge.dao.KnowledgeDao;
import com.ztesoft.zsmart.oss.core.pm.knowledge.util.KnowUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;
import com.baidu.ueditor.ActionEnter;
import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月14日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.knowledge.dao.oracle <br>
 */

public class KnowledgeDaoOracleImpl extends KnowledgeDao {

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getRootTree() throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = ""
            + "select doc_type_no id , doc_type_name name, '0' pid from KBM_DOC_TYPE_SPEC "
            + "union "
            + "select sub_doc_type_no id , sub_doc_type_name name ,doc_type_no id from KBM_DOC_SUBTYPE_SPEC t where t.doc_type_no in ( select doc_type_no  from  KBM_DOC_TYPE_SPEC)";
        ParamArray pa = new ParamArray();
        return this.queryList(sql,pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getTreeUpAndDown(Map<String, String> param) throws com.ztesoft.zsmart.core.exception.BaseAppException {
        // TODO Auto-generated method stub <br>
        String id =param.get("id");
        String pid =param.get("pid");
        String sql = ""
            + "select * from( "
            + "select doc_type_no id , doc_type_name name, '0' pid, doc_type_no bNo, doc_type_no sNo from KBM_DOC_TYPE_SPEC "
            + "union "
            + "select sub_doc_type_no id , sub_doc_type_name name ,doc_type_no pid ,doc_type_no bNo, sub_doc_type_no sNo  from KBM_DOC_SUBTYPE_SPEC t where t.doc_type_no in ( select doc_type_no  from  KBM_DOC_TYPE_SPEC) "
            + "union "
            + "select c.nav_no id,c.nav_name , nvl(c.up_nav_no,c.SUB_DOC_TYPE_NO)  pid,c.doc_type_no bNo,c.sub_doc_type_no sNo  from KBM_DOC_NAV_SPEC c "
            + ")  t where t.id in (?,?)  or t.pid=?";
        ParamArray pa = new ParamArray();
        pa.set("",id);
        pa.set("",pid);
        pa.set("",id);
        return this.queryList(sql,pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> navTree(Map<String, String> param) throws  BaseAppException {
        String id =param.get("id");
        String sql = ""
            + "select * from  ( "
            + "select doc_type_no id , doc_type_name name, '0' pid from KBM_DOC_TYPE_SPEC "
            + "union "
            + "select sub_doc_type_no id , sub_doc_type_name name ,doc_type_no pid from KBM_DOC_SUBTYPE_SPEC t where t.doc_type_no in ( select doc_type_no  from  KBM_DOC_TYPE_SPEC) "
            + "union "
            + "select c.nav_no id,c.nav_name , nvl(c.up_nav_no,c.SUB_DOC_TYPE_NO)  pid   from KBM_DOC_NAV_SPEC c "
            + ") t  start with t.id =?  CONNECT BY   id = prior pid";
        ParamArray pa = new ParamArray();
        pa.set("",id);
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, Object>> filterResult(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String bNo=param.get("bNo");
        String sNo =param.get("sNo");
        String id=param.get("id");
        String sql = "";
        ParamArray pa  = new ParamArray();
        if(id.equalsIgnoreCase(sNo)) {
            sql = ""
                + "select a.attr_no,a.ATTR_NAME,a.FILTER_CTLTYPE "
                + "from KBM_DOC_FILTERATTR_SPEC a,KBM_DOC_FILTERATTR_RELA b "
                + "where b.doc_type_no = a.doc_type_no "
                + "and b.attr_no = a.attr_no "
                + "and a.DOC_TYPE_NO=? "
                + "and B.SUB_DOC_TYPE_NO=?"
                + "order by B.DISP_ORDER asc";
            pa.set("", bNo);
            pa.set("", sNo);
        }else {
            sql = ""
                + "select a.attr_no,a.ATTR_NAME,a.FILTER_CTLTYPE "
                + "from KBM_DOC_FILTERATTR_SPEC a,KBM_DOC_FILTERATTR_RELA b "
                + "where b.doc_type_no = a.doc_type_no "
                + "and b.attr_no = a.attr_no "
                + "and a.DOC_TYPE_NO=? "
                + "and B.SUB_DOC_TYPE_NO=? "
                + "and B.NAV_NO=? "
                + "order by B.DISP_ORDER asc";
            pa.set("", bNo);
            pa.set("", sNo);
            pa.set("", id);
            
        }
        List<HashMap<String, String>> relas= this.queryList(sql,pa);
        List<HashMap<String, Object>>  result = new ArrayList<HashMap<String,Object>>();
           for(Map<String,String> rela : relas) {
               HashMap<String,Object>  item= new HashMap<String, Object>();
               for(String key :rela.keySet()) {
                   item.put(key, ""+rela.get(key));
               }
               
               item.put("values", this.getRelaValues(id,sNo,bNo,rela.get("ATTR_NO")));
               result.add(item);
        
           }
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param sNo
     * @param bNo
     * @param string
     * @return <br>
     * @throws com.ztesoft.zsmart.core.exception.BaseAppException 
     */ 
    private List<HashMap<String,String>> getRelaValues(String id, String sNo, String bNo, String attrNo) throws BaseAppException {
        System.err.println(id+"--"+sNo+"---"+bNo+"--"+attrNo);
        String sql = ""
            + "select ATTR_VALUE from ( "
            + "select ATTR_VALUE, COUNT(1) CNT from KBM_DOC_FILTERATTR where  doc_type_no =? "
            + "and sub_doc_type_no =? "
            + "and ATTR_NO =? "
            + "and seq = 0 "
            + "group by ATTR_VALUE "
            + "order by COUNT(1) desc ) "
            + "where rownum <= 11";
       ParamArray pa = new ParamArray();
       pa.set("", bNo);
       pa.set("", sNo);
       pa.set("", attrNo);
       
        
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getDocOpers(Map<String, String> param) throws BaseAppException {
         String classNo = param.get("classNo");
         List<HashMap<String, String>>  result  = new ArrayList<HashMap<String,String>>();
         if("0".equalsIgnoreCase(classNo)) {
             String sql = ""
                 + "select oper_name name ,OPER_FIELDNO fNo, oper_type  oper from KBM_DOC_OPER "
                 + "where oper_class=0 "
                 + "order by DISP_ORDER";
             return this.queryList(sql, new ParamArray());
             
         }
         if("1".equalsIgnoreCase(classNo)) {
             String sql = ""
                 + "select oper_name name ,OPER_FIELDNO fNo, orderby oper from KBM_DOC_OPER "
                 + "where oper_class=1 "
                 + "order by DISP_ORDER";
             return this.queryList(sql, new ParamArray());
         }
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public   HashMap<String, Object> getIndexDocList(Map<String, Object> param) throws BaseAppException {
        HashMap<String,Object> result = new HashMap<String, Object>();
        String state = ""+param.get("state");
        Long rowNums =Long.parseLong(""+param.get("rowNums"));
        Long page =Long.parseLong(""+param.get("page"));
        long start = ((page-1)*rowNums)+1;
        long end = page*rowNums;
        String oderByF =""+param.get("oderByF");
        String oderByM =""+param.get("oderByM");
        String userId =""+param.get("userId");
        List<DynamicDict> filterSearchValues=(List<DynamicDict>) param.get("filterSearchValues");

        String sql = ""
            + "SELECT "
            + "    t.doc_id, "
            + "    t.title, "
            + "    t.view_count, "
            + "    t.reply_count, "
            + "    t.vote_help_count, "
            + "    t.vote_nohelp_count, "
            + "    t.W_ROLE, "
            + "    TO_CHAR(t.create_date, 'yyyy-mm-dd hh24:mi:ss') create_date, "
            + "    u.user_name, "
            + "    u.user_id "
            + "FROM "
            + "    kbm_doc t,bfm_user u "
            + "WHERE "
            + "    t.create_user=u.user_id and "
            + "    t.state = ? "
            +this.stateAuthority(state,userId)
            +this.filterValuesSql(filterSearchValues)
            + this.OrderBy(oderByF,oderByM);
        
        ParamArray pa = new ParamArray();
        pa.set("", state);
        
        result.put("cnt", this.queryLong(KnowUtil.getCountSql(sql), pa));
        result.put("doclists", this.queryList(KnowUtil.getPageSql(sql, start, end), pa));
       
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param state
     * @param userId 
     * @return <br>
     */ 
    private String stateAuthority(String state, String userId) {
        // TODO Auto-generated method stub <br>
        if("00".equalsIgnoreCase(state)) {
            return " and t.oper_user= "+userId+"  ";
        }
        if("02".equalsIgnoreCase(state)) {
            return " and (t.R_ROLE='0' or  t.oper_user="+userId+")  ";
        }
        return "";
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public HashMap<String, Object> queryDocList(Map<String, Object> param) throws BaseAppException {
        HashMap<String,Object> result = new HashMap<String, Object>();
        String state =""+param.get("state");
        String bNo =""+param.get("bNo");
        String sNo =""+param.get("sNo");
        String oderByF =""+param.get("oderByF");
        String oderByM =""+param.get("oderByM");
        String userId=""+param.get("userId");
        List<DynamicDict> filterArray=(List<DynamicDict>) param.get("filterArray");
        List<DynamicDict> filterSearchValues=(List<DynamicDict>) param.get("filterSearchValues");
        
        Long rowNums =Long.parseLong(""+param.get("rowNums"));
        Long page =Long.parseLong(""+param.get("page"));
        long start = ((page-1)*rowNums)+1;
        long end = page*rowNums;
        
        
        String sql = ""
            + "SELECT "
            + "    t.doc_id, "
            + "    t.title, "
            + "    t.view_count, "
            + "    t.reply_count, "
            + "    t.vote_help_count, "
            + "    t.vote_nohelp_count, "
            + "    t.W_ROLE, "
            + "    TO_CHAR(t.create_date, 'yyyy-mm-dd hh24:mi:ss') create_date, "
            + "    u.user_name, "
            +"     u.user_id  "
            + "FROM "
            + "    kbm_doc t,bfm_user u "
            + "WHERE "
            + "    t.create_user=u.user_id and "
            + "    t.state = ? and "
            + "    t.doc_type_no=? "
            + "    and "
            + "    t.SUB_DOC_TYPE_NO=? "
            +this.stateAuthority(state,userId)
            +this.filterSQL(filterArray,bNo,sNo)
            +this.filterValuesSql(filterSearchValues)
            + this.OrderBy(oderByF,oderByM);
  
        ParamArray pa = new ParamArray();
        pa.set("", state);
        pa.set("", bNo);
        pa.set("", sNo);
        result.put("cnt", this.queryLong(KnowUtil.getCountSql(sql), pa));
        result.put("doclists", this.queryList(KnowUtil.getPageSql(sql, start, end), pa));
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param filterSearchValues
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String filterValuesSql(List<DynamicDict> filterSearchValues) throws BaseAppException {
        if(filterSearchValues==null) return "";
        if(filterSearchValues.size()<=0) return "";
        DynamicDict dd =filterSearchValues.get(0);
        System.err.println(dd);
        if("Like".equalsIgnoreCase(dd.getString("oper"))) {
            String value =dd.getString("value").toLowerCase();
            String field =dd.getString("field").toLowerCase();
            
            return  "  and "+
                        "   LOWER(t."+field+") like '%"+value+"%' ";
        }
        return "";
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param filterArray
     * @param bNo
     * @param sNo
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String filterSQL(List<DynamicDict> filterArray, String bNo, String sNo) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        if(filterArray==null) return "";
        if(filterArray.size()<=0) return"";
        String sql= "";
        
        for (DynamicDict dd:filterArray) {
            sql+=this.createFilterSql(dd,bNo,sNo);
        }
        
        return sql;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dd
     * @param bNo
     * @param sNo
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String createFilterSql(DynamicDict dd, String bNo, String sNo) throws BaseAppException {
        if("0".equalsIgnoreCase(dd.getString("type"))) {
           String  [] values=   dd.getString("values").split(",");
           String [] sqlValues = new String[values.length];
          for(int i =0;i<values.length;i++) {
              sqlValues[i]="'"+values[i]+"'";
          }
           String attrNo = dd.getString("attrNo");
           String sql = ""
               + "and "
               + "     doc_id in ( "
               + "        select distinct doc_id from KBM_DOC_FILTERATTR where doc_type_no =  '"+bNo+ "' " 
               + "        and sub_doc_type_no = '"+sNo+"'  "
               + "        and attr_no =  '" + attrNo + "' "
               + "        and attr_value in ("+StringUtils.join(sqlValues,",")+"))";
           return sql;
        }
        
        if("1".equalsIgnoreCase(dd.getString("type"))) {
            String  values=   dd.getString("values");
            String attrNo = dd.getString("attrNo");
            String sql = ""
                + "and "
                + "     doc_id in ( "
                + "        select distinct doc_id from KBM_DOC_FILTERATTR where doc_type_no =  '"+bNo+ "' " 
                + "        and sub_doc_type_no = '"+sNo+"'  "
                + "        and attr_no =  '" + attrNo + "' "
                + "        and attr_value = '"+values+"' )";
            return sql;
        }
        
        if("2".equalsIgnoreCase(dd.getString("type"))) {
            String  values=   dd.getString("values");
            String attrNo = dd.getString("attrNo");
            String sql = ""
                + "and "
                + "     doc_id in ( "
                + "        select distinct doc_id from KBM_DOC_FILTERATTR where doc_type_no =  '"+bNo+ "' " 
                + "        and sub_doc_type_no = '"+sNo+"'  "
                + "        and attr_no =  '" + attrNo + "' "
                + "        and attr_value like '%"+values+"%' )";
            return sql;
        }
        
        return "";
            
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param oderByF
     * @param oderByM <br>
     */ 
    private String OrderBy(String oderByF, String oderByM) {
        // TODO Auto-generated method stub <br>
        return  " order by t."+oderByF+" "+oderByM;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, String> saveOrUpdate(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String,String> result = new HashMap<String,String>();
        String id=""+param.get("id");
        String newId= id;
        String attachIds=""+param.get("attachIds");
        
        if("0".equalsIgnoreCase(id)) {
            newId = saveKnowledge(param) ;
            updateAttch(newId,attachIds);
        }else {
            newId = updateKnowledge(param) ;
        }
        saveContext(newId,param);
        saveFilter(newId,param);
        saveTags(newId,param);
        result.put("id", newId);
        try {
            this.getConnection().commit();
        }
        catch (SQLException e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param newId
     * @param attachIds <br>
     * @throws BaseAppException 
     */ 
    private void updateAttch(String newId, String attachIds) throws BaseAppException {
        if(attachIds==null)return;
        if(attachIds.length()<=0)return;
        // TODO Auto-generated method stub <br>
        StringBuffer sb = new StringBuffer();
        for (String id : attachIds.split(",")) {
            sb.append("'"+id+"'"+",");
        }
        sb.delete(sb.length()-1,sb.length());
        String sql = ""
            + "UPDATE kbm_doc_attach "
            + "    SET "
            + "        doc_id = ? "
            + "WHERE "
            + "        doc_id ='0' "
            + "        and "
            + "        id in (" +sb.toString()+ ")";
            ParamArray pa = new ParamArray();
           pa.set("", newId);
           this.executeUpdate(sql, pa);
    }
  

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param newId
     * @param param <br>
     * @throws BaseAppException 
     */ 
    private void saveTags(String newId, Map<String, Object> param) throws BaseAppException {
        
        if(param.get("tags")==null)return ;
        String  tags = ""+param.get("tags");
        if("".equalsIgnoreCase(tags)) return ;
        if(tags.length()<=2) return ;
        String userId=""+param.get("userId");
        String sql = ""
            + "select nvl(REF_CNT,0) CNT from KBM_DOC_ATTR "
            + "where attr_code=? and lower(attr_value)=?";
        for (String tag :tags.split(",")) {
            ParamArray pa =new ParamArray();
            pa.set("", "TAG");
            pa.set("", tag.toLowerCase());
            HashMap<String,String > result = this.query(sql, pa);
            if(result ==null) {
                addTag(result,tag,userId);
            }else {
                updateTag(result,tag);
            }
            
        }

        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param result <br>
     * @param tag 
     * @throws BaseAppException 
     */ 
    private void updateTag(HashMap<String, String> result, String tag) throws BaseAppException {
        String sql = ""
            + "UPDATE kbm_doc_attr "
            + "    SET "
            + "        ref_cnt = ref_cnt+1 "
            + "WHERE "
            + "        attr_code =? "
            + "    AND "
            + "        lower(attr_value) =?";
        
        ParamArray pa = new ParamArray();
        pa.set("", "TAG");
        pa.set("", tag.toLowerCase());
        this.executeUpdate(sql, pa);
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param result <br>
     * @param tag 
     * @throws BaseAppException 
     */ 
    private void addTag(HashMap<String, String> result, String tag,String userId) throws BaseAppException {
        String sql = ""
            + "INSERT INTO kbm_doc_attr ( "
            + "    attr_code, "
            + "    attr_seq, "
            + "    attr_value, "
            + "    oper_user, "
            + "    oper_date, "
            + "    ref_cnt "
            + ") VALUES ( "
            + "    'TAG', "
            + "    0, "
            + "    ?, "
            + "    ?, "
            + "    sysdate, "
            + "    ? "
            + ")";
        
        ParamArray pa = new ParamArray();
        pa.set("", tag);
        pa.set("", userId);
        pa.set("", 1);
        this.executeUpdate(sql, pa);
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param newId
     * @param param <br>
     * @throws BaseAppException 
     */ 
    private void saveFilter(String newId, Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        List<DynamicDict> filters=(List<DynamicDict>)param.get("attrNos");
        String sql ="delete  KBM_DOC_FILTERATTR where doc_id=?";
        ParamArray pa = new ParamArray();
        pa.set("", newId);
        this.executeUpdate(sql, pa);
        if(filters==null)return ;
        if(filters.size()<=0)return ;
        String addSql = ""
            + "INSERT INTO kbm_doc_filterattr ( "
            + "    doc_id, "
            + "    seq, "
            + "    doc_type_no, "
            + "    sub_doc_type_no, "
            + "    attr_no, "
            + "    attr_seq, "
            + "    attr_value "
            + ") VALUES ( "
            + "    ?, "
            + "   0, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    1, "
            + "    ? "
            + ")";
        String bNo=""+param.get("bNo");
        String sNo=""+param.get("sNo");
        
        for (DynamicDict d  :filters ) {
            ParamArray pa2 =new ParamArray();
            pa2.set("", newId);
            pa2.set("", bNo);
            pa2.set("", sNo);
            pa2.set("", d.getString("no"));
            pa2.set("", d.getString("val"));
           this.executeUpdate(addSql, pa2);
        }
        
        
        
        
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param newId
     * @param param <br>
     * @throws BaseAppException 
     */ 
    private void saveContext(String newId, Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
      String delsql="delete KBM_DOC_CONTENT where doc_id=?";
      ParamArray delPa= new ParamArray();
      delPa.set("", newId);
      this.executeUpdate(delsql, delPa);
      String context = ""+param.get("context");
      String add_sql = ""
          + "INSERT INTO kbm_doc_content ( "
          + "    doc_id, "
          + "    seq, "
          + "    content_seq, "
          + "    content "
          + ") VALUES ( "
          + "    ?, "
          + "    ?, "
          + "    ?, "
          + "    ? "
          + ")";
      List<String> attrs_parts = KnowUtil.splitByNumbers(context, 1024); // 按字符大小分割问题。
      for (int i = 0; i < attrs_parts.size(); i++) {
          ParamArray add_pa = new ParamArray();
          String attr = attrs_parts.get(i);
          add_pa.set("", newId);
          add_pa.set("","0");
          add_pa.set("", i);
          add_pa.set("", attr);
          this.executeUpdate(add_sql, add_pa);
      }
      
      
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String updateKnowledge(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String id=""+param.get("id");
        String bNo=""+param.get("bNo");
        String sNo=""+param.get("sNo");
        String title=""+param.get("title");
        String rRole=""+param.get("rRole");
        String wRole=""+param.get("wRole");
        String keys=""+param.get("keys");
        String tags=""+param.get("tags");
        String domainNo=""+param.get("domainNo");
        String state =""+param.get("state");
        String userId =""+param.get("userId");
        String sql = ""
            + "UPDATE kbm_doc "
            + "    SET "
            + "        doc_type_no =? "
            + "    , "
            + "        sub_doc_type_no =? "
            + "    , "
            + "        seq =? "
            + "    , "
            + "        title =? "
            + "    , "
            + "        summary =  ? "
            + "    , "
            + "        view_count =? "
            + "    , "
            + "        reply_count =? "
            + "    , "
            + "        vote_nohelp_count =? "
            + "    , "
            + "        vote_help_count =? "
            + "    , "
            + "        r_role =? "
            + "    , "
            + "        w_role =? "
            + "    , "
            + "        keys =? "
            + "    , "
            + "        tags =? "
            + "    , "
            + "        domain_no =? "
            + "    , "
            + "        state =? "
            + "    "
            + "    , "
            + "        oper_user =? "
            + "    , "
            + "        oper_date =sysdate"
            + "  WHERE doc_id = ?  ";
         
        ParamArray pa = new  ParamArray();
      
        pa.set("",bNo);
        pa.set("",sNo);
        pa.set("","0");
        pa.set("",title);
        pa.set("", "");
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", rRole);
        pa.set("", wRole);
        pa.set("", keys);
        pa.set("", tags);
        pa.set("", domainNo);
        pa.set("", state);
        pa.set("", userId);
        pa.set("", id); 
        this.executeUpdate(sql, pa);
        
        return id;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String saveKnowledge(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        
        String id="DOC_"+uuid;
        String bNo=""+param.get("bNo");
        String sNo=""+param.get("sNo");
        String title=""+param.get("title");
        String rRole=""+param.get("rRole");
        String wRole=""+param.get("wRole");
        String keys=""+param.get("keys");
        String tags=""+param.get("tags");
        String domainNo=""+param.get("domainNo");
        String state =""+param.get("state");
        String userId =""+param.get("userId");
        
        String sql = ""
            + "INSERT INTO kbm_doc ( "
            + "    doc_id, "
            + "    doc_type_no, "
            + "    sub_doc_type_no, "
            + "    seq, "
            + "    title, "
            + "    summary, "
            + "    view_count, "
            + "    reply_count, "
            + "    vote_nohelp_count, "
            + "    vote_help_count, "
            + "    r_role, "
            + "    w_role, "
            + "    keys, "
            + "    tags, "
            + "    domain_no, "
            + "    state, "
            + "    create_user, "
            + "    create_date, "
            + "    oper_user, "
            + "    oper_date "
            + ") VALUES ( "
            + "   ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "   ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "  sysdate, "
            + "    ?, "
            + "    sysdate "
            + ")";
        ParamArray pa = new  ParamArray();
        pa.set("", id); 
        pa.set("",bNo);
        pa.set("",sNo);
        pa.set("","0");
        pa.set("",title);
        pa.set("", "");
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", 0);
        pa.set("", rRole);
        pa.set("", wRole);
        pa.set("", keys);
        pa.set("", tags);
        pa.set("", domainNo);
        pa.set("", state);
        pa.set("", userId);
        pa.set("", userId);
        this.executeUpdate(sql, pa);
        return id;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, Object> queryKnowLedge(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String,Object> result= new HashMap<String, Object>();
        String sql = ""
            + "SELECT "
            + "    doc_id id, "
            + "    doc_type_no, "   
            + "    sub_doc_type_no, "
            + "    title, "
            + "    view_count, "
            + "    reply_count, "
            + "    vote_nohelp_count, "
            + "    vote_help_count, "
            + "    r_role, "
            + "    w_role, "
            + "    keys, "
            + "    tags, "
            + "    domain_no, "
            + "    state,  "
            +"     oper_user "
            + "FROM "
            + "    kbm_doc "
            + "where doc_id=?";
        ParamArray pa = new ParamArray();
        pa.set("", id);
        HashMap<String,String> doc =this.query(sql, pa);
        if(doc==null)return  result;
        doc.put("content", getDocContext(id));
       
        result.put("doc", doc);
        result.put("attrNos", getAttrNos(id));
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     * @throws BaseAppException 
     */ 
    private List<HashMap<String,String>> getAttrNos(String id) throws BaseAppException {
        String sql = ""
            + "select attr_no, attr_value from KBM_DOC_FILTERATTR "
            + "where doc_id=?";
        ParamArray pa  = new ParamArray();
        pa.set("", id);
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    private String getDocContext(String id)  throws BaseAppException {
        String sql = ""
            + "select t.CONTENT_SEQ,t.content from KBM_DOC_CONTENT t "
            + "where t.DOC_ID=? "
            + "order by t.CONTENT_SEQ asc";
        ParamArray pa = new ParamArray();
        pa.set("", id);
        StringBuffer sb = new StringBuffer("");
       for(HashMap<String,String> p : this.queryList(sql, pa))
        {
           sb.append(p.get("CONTENT"));
       }
       
       return  sb.toString();
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delKnowLedge(String id) throws BaseAppException {
       String sql1="DELETE FROM KBM_DOC_CONTENT WHERE  doc_id =?";
       String sql2="DELETE FROM KBM_DOC_FILTERATTR WHERE  doc_id =?";
       String sql3="DELETE FROM kbm_doc WHERE  doc_id =?";
       ParamArray pa = new ParamArray();
       pa.set("", id);
       this.executeUpdate(sql1, pa);
       this.executeUpdate(sql2, pa);
       this.executeUpdate(sql3, pa);
       this.delAttachFiles(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id <br>
     * @throws BaseAppException 
     */ 
    public  void delAttachFiles(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql ="select ATTACH_TYPE type ,attach_path path from KBM_DOC_ATTACH where doc_id= ? ";
        ParamArray pa = new ParamArray();
        pa.set("", id);
        for (HashMap<String,String> recode : this.queryList(sql, pa)) {
            if("0".equalsIgnoreCase(recode.get("TYPE"))) {
                  //删除内容中的图片信息
                URL path = this.getClass().getResource("/../../"); // 得到当前目录真实目录文件
               File file = new File(path.getPath()+"/"+recode.get("PATH"));
               System.out.println(file.getAbsolutePath());
               file.delete();
            }
            if("1".equalsIgnoreCase(recode.get("TYPE"))) {
                //删除内容中的图片信息
                this.delAttachFile(recode.get("PATH"));
            }
            
        }
    }
    
    public static void main(String[] args) throws BaseAppException {
        String id ="0";
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.delAttachFiles(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tag
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryLikeTags(String tag) throws BaseAppException {
        String sql = ""
            + "select attr_value,ref_cnt from ( "
            + "select attr_value ,ref_cnt from kbm_doc_attr where lower(attr_value) like ? "
            + "order by ref_cnt desc "
            + ") t where rownum<=50";
        ParamArray pa  = new ParamArray();
        pa.set("", "%"+tag.toLowerCase()+"%");
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param no
     * @param sno
     * @param bno
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryAttrValues(String no, String sno, String bno) throws BaseAppException {
        String sql = ""
            + "SELECT "
            + "    attr_value value, "
            + "    COUNT(1) cnt "
            + "FROM "
            + "    kbm_doc_filterattr "
            + "WHERE "
            + "        doc_type_no = ? "
            + "    AND "
            + "        sub_doc_type_no = ?  "
            + "    AND "
            + "        attr_no = ? "
            + "    AND "
            + "        seq = 0 "
            + "GROUP BY "
            + "    attr_value "
            + "ORDER BY COUNT(1) DESC";
        ParamArray pa = new ParamArray();
        pa.set("", bno);
        pa.set("", sno);
        pa.set("", no);
        
         
        
         return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param type
     * @throws BaseAppException <br>
     */ 
    @Override
    public void updownVote(String id, String type) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        if(type.equalsIgnoreCase("up")) {
            String sql="update KBM_DOC t set  t.VOTE_HELP_COUNT=t.VOTE_HELP_COUNT+1    where t.doc_id= ? ";
            ParamArray pa = new ParamArray();
            pa.set("", id);
            this.executeUpdate(sql, pa);
        }
        if(type.equalsIgnoreCase("down")) {
            String sql="update KBM_DOC t set  t.VOTE_NOHELP_COUNT=t.VOTE_NOHELP_COUNT+1    where t.doc_id= ? ";
            ParamArray pa = new ParamArray();
            pa.set("", id);
            this.executeUpdate(sql, pa);
        }
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param isPublic
     * @param txt
     * @param userId
     * @throws BaseAppException <br>
     */ 
    @Override
    public void addComment(String doc_id, String isPublic, String txt, String userId) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = ""
            + "INSERT INTO kbm_doc_comment ( "
            + "    doc_id, "
            + "    seq, "
            + "    doc_comment, "
            + "    is_public, "
            + "    oper_user, "
            + "    oper_date, "
            +"     id"
            + ") VALUES ( "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    sysdate,"
            +"    ?  "
            + ")";
        ParamArray pa =new ParamArray();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String id="COM_"+uuid;
        pa.set("", doc_id);
        pa.set("", "0");
        pa.set("", txt);
        pa.set("", isPublic);
        pa.set("", userId);
        pa.set("",id);
        this.executeUpdate(sql, pa);
        this.updateReplyCont(doc_id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    private void updateReplyCont(String id) {
        try {
            String sql = ""
                + "update kbm_doc t set t.REPLY_COUNT=(select count(1) from KBM_DOC_COMMENT c where c.doc_id=t.doc_id)   where t.doc_id= ? ";
            ParamArray pa  = new ParamArray();
            pa.set("", id);
            this.executeUpdate(sql, pa);
        }catch(Exception e) {
            
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryComments(String id) throws BaseAppException {
        String sql = ""
            + "select t.id, t.doc_id,t.DOC_COMMENT,t.IS_PUBLIC, TO_CHAR(t.OPER_DATE, 'yyyy-mm-dd hh24:mi:ss')  OPER_DATE ,U.USER_NAME from kbm_doc_comment t,bfm_user u "
            + "where t.OPER_USER=u.user_id "
            + "and t.doc_id=?  order by t.OPER_DATE desc";
        ParamArray pa  = new ParamArray();
        pa.set("",id);
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delComments(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql ="delete kbm_doc_comment  t where t.id= ? ";
        ParamArray pa = new ParamArray();
            pa.set("", id);
        this.executeUpdate(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param filePath
     * @param fileName
     * @param state
     * @param type
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public String addAttach(String doc_id, String filePath, String fileName, String state, String type,String userId) throws BaseAppException {
        String id ="att_"+ UUID.randomUUID().toString().replaceAll("-", "");
        String sql = ""
            + "INSERT INTO kbm_doc_attach ( "
            + "    doc_id, "
            + "    seq, "
            + "    attach_type, "
            + "    attach_name, "
            + "    attach_path, "
            + "    state, "
            + "    oper_user, "
            + "    oper_date, "
            + "    id "
            + ") VALUES ( "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    sysdate, "
            + "    ? "
            + ")";
        ParamArray pa = new ParamArray();
        pa.set("", doc_id);
        pa.set("", 0);
        pa.set("", type);
        pa.set("", fileName);
        pa.set("", filePath);
        pa.set("", state);
        pa.set("", userId);
        pa.set("", id);
        this.executeUpdate(sql, pa);
        return id;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param filePath
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delAttachById(String id, String filePath) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        delAttachFile(filePath);
        delAttachRecode(id);
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id <br>
     */ 
    private void delAttachRecode(String id)   throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql ="delete kbm_doc_attach where id= ? ";
        ParamArray pa = new ParamArray();
        pa.set("", id);
        this.executeUpdate(sql, pa);
 
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param filePath <br>
     */ 
    private void delAttachFile(String filePath)  throws BaseAppException  {
        // TODO Auto-generated method stub <br>
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
        String fileFullPath = fileDirectory + "/" + filePath;
        File file = new File(fileFullPath);
        file.delete();
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param docId
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryAttachByDocId(String docId) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        if("0".equalsIgnoreCase(docId)) {
           return new ArrayList<HashMap<String, String>>();
        }
        String sql = ""
            + "SELECT "
            + "    doc_id, "
            + "    seq, "
            + "    attach_type, "
            + "    attach_name, "
            + "    attach_path, "
            + "    state, "
            + "    oper_user, "
            + "    oper_date, "
            + "    id "
            + "FROM "
            + "    kbm_doc_attach "
            + "where "
            + "    doc_id= ?  and  attach_type= '1' ";
        ParamArray pa = new ParamArray();
        pa.set("", docId);
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getSubTypeList() throws BaseAppException {
        String sql = ""
            + "select t.SUB_DOC_TYPE_NO id,t2.doc_type_name||'-'|| t.SUB_DOC_TYPE_NAME name from KBM_DOC_SUBTYPE_SPEC t,KBM_DOC_TYPE_SPEC t2 "
            + "where  t.DOC_TYPE_NO = T2.DOC_TYPE_NO";
        return  this.queryList(sql,new ParamArray());
    }
    
   

}
