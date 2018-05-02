package com.ztesoft.zsmart.oss.core.pm.bscreen.service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

import ch.qos.logback.core.net.SyslogOutputStream;

/**
 * [描述] <br>
 *
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.service <br>
 */
public class BScreenService implements IAction {
//    public static final RestApplication ra = new RestApplication();

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @return int
     * @throws BaseAppException <br>
     */
    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);

        String methodName = dict.getString("method");
        try {
            Method method = this.getClass().getMethod(methodName, DynamicDict.class);
            method.invoke(this, dict);
        }
        catch (Exception e) {
            dict.add("method error", e.getMessage());
            new BaseAppException(e.getMessage());
        }
        return 0;
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getServerSkeleton(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("serverSkeleton", bsm.getServerSkeleton(param));
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */

    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.saveOrUpdate(dict);
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void queryBScreenById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.queryBScreenById(dict);
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void queryBScreenListByUserID(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Long userId = dict.getLong("userId");
        Boolean isAll = dict.getBoolean("isAll");
        List<Map<String, Object>> topiclist = new ArrayList<Map<String, Object>>();
        if(isAll){
            topiclist = bsm.queryBScreenList();
            dict.add("topiclistMethod", "queryBScreenList");
        }else{
            topiclist = bsm.queryBScreenListByUserID(userId);

            dict.add("topiclistMethod", "queryBScreenListByUserID");
        }

        dict.add("topiclist", topiclist);

    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void deleteBScreenById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        String id = dict.getString("topicId");
        boolean b = bsm.deleteBScreenById(id);
        dict.add("deleteTopic", b);

    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void saveOrUpdateSourceService(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        DynamicDict json = dict.getBO("json");
        Map<String, String> map = new HashMap<String, String>();
        map.put("no", json.getString("no"));
        map.put("name", json.getString("name"));
        map.put("type", json.getString("type"));
        map.put("source", json.getString("source"));
        map.put("userId", json.getString("userId"));
        String attrs = JSON.toJSONString(BScreenUtil.dic2Map2((DynamicDict) json.get("attrs")));
        map.put("attrs", attrs);
        dict.add("saveUpdateSourceService", bsm.saveOrUpdateSourceService(map));
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getFields(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("source", dict.getString("source"));
        param.put("sql", dict.getString("sql"));
        dict.add("fields", bsm.getFields(param));

    }

    public void getAPIField(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("source", dict.getString("source"));
        param.put("sql", dict.getString("sql"));
        dict.add("result", bsm.getAPIField(param));

    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getSourceServiceList(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", dict.getString("userId"));
        dict.add("serviceList", bsm.getSourceServiceList(param));

    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getSourceServiceById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("sourceService", bsm.getSourceServiceById(param));

    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void delSourceServiceById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("delSourceService", bsm.delSourceServiceById(param));
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getSource(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        dict.add("sourceList", bsm.getSource());

    }

    /**
     *
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void getApiSource(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        dict.add("sourceList", bsm.getApiSource());
    }

    /**
     * [方法描述] <br>
     *
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void delFile(DynamicDict dict) throws BaseAppException {
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
        String fileName = dict.getString("fileName");
        String filePath = fileDirectory + "/" + fileName;
        File file = new File(filePath);
        file.delete();
    }




    public void moveFile(DynamicDict dict) throws Exception{
        String path = this.getClass().getClassLoader().getResource("").getPath();
        String webPath = URLDecoder.decode(path, "UTF-8");
        String pathArr[] = webPath.split("/WEB-INF/classes/");
        webPath = pathArr[0]+"/"+dict.getString("targetDirs");
        File webPathDir = new File(webPath);
        webPathDir.mkdirs();
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
        String fileName = dict.getString("sourceFile");
        String filePath = fileDirectory + "/"+fileName ;
        File file = new File(filePath);
        FileUtils.copyFileToDirectory(file, webPathDir);

    }

    public void getTaskParam(DynamicDict dict) throws Exception{
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        String taskid= dict.getString("taskid");
        dict.add("result", bsm.getTaskParam(taskid));
    }

    public static void main(String[] args) throws Exception {
        BScreenService bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.set("id", "PMS_20180119145357_10005439");
        dict.set("name", "zimbabweLow");
        bs.renameMap(dict);

      //   bs.getMapList(dict);
      System.err.println(dict);
    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict <br>
     */
    public void getMapList(DynamicDict dict)  throws BaseAppException {
        // TODO Auto-generated method stub <br>
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        dict.add("result", bsm.getMapList());
    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict <br>
     */
    public  void exportMap(DynamicDict dict)  throws BaseAppException{
        // TODO Auto-generated method stub <br> ]
        try {
            String filePath =dict.getString("filePath");
            String filename=dict.getString("fileName");
            String json =BScreenUtil.svgMapToJson(filePath);
            AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
            String id = bsm.addMap(filename,filePath,json);
            dict.add("result", id);
        }
        catch (Exception e) {
            e.printStackTrace();
            dict.add("error_result", e.getMessage());
        }

    }


    public  void getMap(DynamicDict dict)  throws BaseAppException{
            String id =dict.getString("id");
            AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
            String json =bsm.getMap(id);
//             System.err.println(json);
//            System.out.println(JSONObject.parseArray(json));
            dict.add("result", JSONObject.parseArray(json));

    }


    public void delMap(DynamicDict dict) throws BaseAppException{
        String id =dict.getString("id");
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.delMap(id);
        dict.add("result",  "OK");
    }

    public void renameMap(DynamicDict dict) throws BaseAppException{
        String id =dict.getString("id");
        String name =dict.getString("name");
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.renameMap(id,name);
        dict.add("result",  "OK");
    }



}
