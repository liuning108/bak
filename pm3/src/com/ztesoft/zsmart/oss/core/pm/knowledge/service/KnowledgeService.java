/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.service;

import java.lang.reflect.Method;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.dialect.Dialect;
import com.ztesoft.zsmart.core.jdbc.proxy.ConnectionProxy;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.config.alram.domain.AbstractAlramMgr;
import com.ztesoft.zsmart.oss.core.pm.config.alram.service.AlramService;
import com.ztesoft.zsmart.oss.core.pm.knowledge.domain.AbstractKnowledgeMgr;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;
import com.ztesoft.zsmart.web.util.FastJSONUtils;

import ch.qos.logback.core.db.DBHelper;
import serch.ReturnDoc;
import store.SolrjServiceTest;
import serch.Foo;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月14日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.knowledge.service <br>
 */

public class KnowledgeService  implements IAction {
    
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @   Override
    public int perform(DynamicDict dict) throws BaseAppException {
            SessionManage.putSession(dict);
            String userId = SessionManage.getSession().getUserId();
            if ("-1".equalsIgnoreCase(userId)) {
                userId = dict.getString("userId");
                if (userId == null) {
                    userId = "-1";
                }
            }

            dict.set("USERID", userId);
            String methodName = dict.getString("method");
            try {
                Method method = this.getClass().getMethod(methodName, DynamicDict.class);
                method.invoke(this, dict);
            }
            catch (Exception e) {
                e.printStackTrace();
                throw new BaseAppException(e.getMessage());
            }
            return 0;
    }
    
    public void getRootTree(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result",dmo.getRootTree());
    }
    
    public void getTreeUpAndDown(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,String> param = new HashMap<String,String>();
        param.put("id", dict.getString("id"));
        param.put("pid", dict.getString("pid"));
        dict.add("result",dmo.getTreeUpAndDown(param));
        dict.add("navResult", dmo.navTree(param));
    }
    
    public void getFilterResult(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,String> param = new HashMap<String,String>();
        param.put("id", dict.getString("id"));
        param.put("sNo", dict.getString("sNo"));
        param.put("bNo", dict.getString("bNo"));
        dict.add("result",dmo.filterResult(param));
  
    }
    
    public void getDocOpers(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,String> param0 = new HashMap<String,String>();
        Map<String,String> param1 = new HashMap<String,String>();
        param0.put("classNo", "0");
        param1.put("classNo", "1");
        dict.add("result0",dmo.getDocOpers(param0));
        dict.add("result1",dmo.getDocOpers(param1));
        dict.add("result2",dmo.getSubTypeList());
        
        
    }
    public void getIndexDoclist(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("state", dict.getString("state"));
        param.put("page", dict.getString("page"));
        param.put("oderByF", dict.getString("oderByF"));
        param.put("oderByM", dict.getString("oderByM"));
        param.put("rowNums", dict.getString("rowNums"));
        param.put("userId", dict.getString("USERID"));
        
        param.put("filterSearchValues", dict.getList("filterSearchValues"));
        dict.add("result",dmo.getIndexDocList(param));
    }
    
    
    public void queryDocList(DynamicDict dict) throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("bNo", dict.getString("bNo"));
        param.put("sNo", dict.getString("sNo"));
        param.put("oderByF", dict.getString("oderByF"));
        param.put("oderByM", dict.getString("oderByM"));
        param.put("state", dict.getString("state"));
        param.put("filterArray", dict.getList("filterArray"));
        param.put("filterSearchValues", dict.getList("filterSearchValues"));
        param.put("page", dict.getString("page"));
        param.put("rowNums", dict.getString("rowNums"));
        param.put("userId", dict.getString("USERID"));
       dict.add("result",dmo.queryDocList(param));
    }
    
    public void saveOrUpdate(DynamicDict dict)  throws BaseAppException{
        
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        Map<String,Object> param = new HashMap<String,Object>();
        param.put("id", dict.getString("id"));
        param.put("bNo", dict.getString("bNo"));
        param.put("sNo", dict.getString("sNo"));
        param.put("state", dict.getString("state"));
        param.put("title", dict.getString("title"));
        param.put("context", dict.getString("context"));
        param.put("keys", dict.getString("keys"));
        param.put("tags", dict.getString("tags"));
        param.put("domainNo",  dict.getString("domainNo"));
        param.put("rRole", dict.getString("rRole"));
        param.put("wRole", dict.getString("wRole"));
        param.put("attrNos", dict.getList("attrNos"));
        param.put("attachIds", dict.getString("attachIds"));
        param.put("userId", dict.get("USERID"));
        Map<String,String>  result =dmo.saveOrUpdate(param);
        String id = result.get("id");
        
        try {
            if("02".equalsIgnoreCase(dict.getString("state"))) {
                SolrjServiceTest st = new SolrjServiceTest();
                st.setUp();
                st.testDelete(id);
                st.testAdd(id, dict.getString("title"), dict.getString("keys"), dict.getString("tags"), dict.getString("sNo"),dict.getString("context"));
             }
        }
        catch (Exception e) {
           e.printStackTrace();
           dict.add("result", result);
           dict.add("result_error", e.getMessage());
        }
        
         dict.add("result",result);
        
    }
    
    public void queryKnowLedge(DynamicDict dict)  throws BaseAppException{
         String id = dict.getString("id");
         AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
         dict.add("result",dmo.queryKnowLedge(id));
    }
    
    public void delKnowLedge(DynamicDict dict) throws BaseAppException{
        String id = dict.getString("id");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dmo.delKnowLedge(id);
        try {
                SolrjServiceTest st = new SolrjServiceTest();
                st.setUp();
                st.testDelete(id);
        } catch (Exception e) {
           e.printStackTrace();
           dict.add("result", id);
           dict.add("result_error", e.getMessage());
        }
         dict.add("result",id);
    }
    
    public void queryLikeTags(DynamicDict dict) throws BaseAppException  {
        String tag = dict.getString("tag");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result",dmo.queryLikeTags(tag));
    }
    
    public void queryAttrValues(DynamicDict dict) throws BaseAppException  {
        String no = dict.getString("no");
        String sno = dict.getString("sno");
        String bno = dict.getString("bno");
       
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result",dmo.queryAttrValues(no,sno,bno));
    }
    
    public void updownVote(DynamicDict dict) throws BaseAppException  {
        String id = dict.getString("id");
        String type = dict.getString("type");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dmo.updownVote(id,type);
        dict.add("result","ok");
    }
    
    
    public void addComment(DynamicDict dict) throws BaseAppException  {
        String id = dict.getString("id");
        String isPublic = dict.getString("isPublic");
        String txt = dict.getString("txt");
        String userId=dict.getString("USERID");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dmo.addComment(id,isPublic,txt,userId);
        dict.add("result","ok");
    }
    
    public void queryComments(DynamicDict dict) throws BaseAppException {
        String id = dict.getString("id");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result", dmo.queryComments(id));
    }
    
    public void delComments(DynamicDict dict) throws BaseAppException {
        String id = dict.getString("id");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
       dmo.delComments(id);
        dict.add("result", "ok");
    }
    
    public void addAttach(DynamicDict dict) throws BaseAppException{
    
        String doc_id = dict.getString("docId");
        String filePath=dict.getString("filePath");
        String fileName=dict.getString("fileName");
        String state =dict.getString("state");
        String type =dict.getString("type");
        String userId =dict.getString("USERID");
        
        
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
     
        dict.add("result",  dmo.addAttach(doc_id,filePath,fileName,state,type,userId));
        
    }
    
    public void delAttachById(DynamicDict dict) throws BaseAppException{
        String id = dict.getString("id");
        String filePath=dict.getString("filePath");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dmo.delAttachById(id,filePath);
        dict.add("result", "ok");
    }
    
    public void queryAttachByDocId(DynamicDict dict) throws BaseAppException{
        String docId= dict.getString("docId");
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result", dmo.queryAttachByDocId(docId));
     }
    
    
    public void querySolrByKey(DynamicDict dict)  throws BaseAppException{
        SolrjServiceTest st = new SolrjServiceTest();
        try {
            st.setUp();
            ReturnDoc rd = new ReturnDoc();
            String type =dict.getString("type");
            String searchKey =dict.getString("searchKey");
            Integer page =Integer.parseInt(dict.getString("page"));
            Integer rowNums =Integer.parseInt(dict.getString("rowNums"));
            rd = st.testSearch(searchKey, page, rowNums,type);
            Map<String,Object> result = new HashMap<String, Object>();
            result.put("count", rd.getNumber());
            result.put("foos", rd.getFoos());
            dict.add("result", result);
        }
        catch (Exception e) {
            e.printStackTrace();
           dict.add("result", e.getMessage());
        }
    }
    
    public void getSubTypeList(DynamicDict dict)  throws BaseAppException{
        AbstractKnowledgeMgr dmo = (AbstractKnowledgeMgr) GeneralDMOFactory.create(AbstractKnowledgeMgr.class);
        dict.add("result", dmo.getSubTypeList()); 
    }
    
    
    
    
        
    public static void main(String[] args) throws BaseAppException {
       // System.out.println("hacker");
       KnowledgeService  s = new KnowledgeService();
        DynamicDict dict = new DynamicDict();

        List<DynamicDict> attrNos = new ArrayList<DynamicDict>();
        DynamicDict d = new DynamicDict();
        d.set("no","SPECIALTY_TYPE");
        d.set("val","IT");
        attrNos.add(d);
        dict.set("method", "exportMap");
       /// dict.set(arg0, arg1);
//        dict.set("docId", "DOC_29ff4a7a2e6f419ba5c267c90e6dfd87");
//        dict.set("filePath", "repository/import/180102155310271773.pdf");
//        dict.set("fileName", "2222");
//        dict.set("state", "A");
//        dict.set("type", "1");
//        dict.set("sNo", "PKBM_S001");
//        dict.set("context", "<p>aa3432848932748923784723987482397487239432984732942937492374932794327473947923749327492374939237497329437947239</p>");
//        dict.set("domainNo", "CT");
//        dict.set("keys", "keys2");
//        dict.set("tags", "java,kkk");
//        dict.set("title", "aa");
//        dict.set("rRole", "0");
//        dict.set("wRole", "1");
//        dict.set("state", "02");
         s.perform(dict);
       System.err.println(dict);
    }
    
   

}
