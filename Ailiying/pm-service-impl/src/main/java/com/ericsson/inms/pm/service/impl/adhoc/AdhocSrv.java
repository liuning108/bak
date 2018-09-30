/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.adhoc;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ericsson.inms.pm.api.service.adhoc.IAdhocSrv;
import com.ericsson.inms.pm.service.impl.adhoc.dao.AdhocDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.itnms.templatemgr.service.impl <br>
 */
@Service("adhoc")
public class AdhocSrv implements IAdhocSrv {
       
    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(AdhocSrv.class);
    
    @Override
    public String addTopicClass(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.addTopicClass(params);
    }
    
    @Override
    public String saveTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.saveTopic(params);
    }
    
    @Override
    public String saveSharedTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.saveSharedTopic(params);
    }
    
    @Override
    public List<Map<String, Object>> cacheOperUser() throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.cacheOperUser();
    }
    
    @Override
    public List<Map<String, Object>> qryPluginList() throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.qryPluginList();
    }
    
    @Override
    public List<Map<String, Object>> cacheMapType() throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.cacheMapType();
    }
    
    @Override
    public List<Map<String, Object>> loadSharedTopicList() throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.loadSharedTopicList();
    }
    
    @Override
    public Map<String, Object> qryCatalogAndTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.qryCatalogAndTopic(params);
    }
    
    @Override
    public String delCatalog(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.delCatalog(params);
    }
    
    @Override
    public String delTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        String operUser = PrincipalUtil.getPrincipal().getUserId() + "";
        String topicNo = "" + params.get("TOPIC_NO");
        String saveType = "" + params.get("SAVE_TYPE");
        if ("0".equals(saveType)) {
            dao.delLinkedTopic(topicNo, operUser);
        }
        else if ("1".equals(saveType)) {
            dao.delTopic(topicNo);
            // 删除主题时连同收藏夹和最近浏览一并删除
            dao.delTopicFromTopicSysclass(topicNo);
        }
        return "1";
    }
    
    @Override
    public String modCatalog(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        dao.delCatalog(params);
        return dao.addTopicClass(params);
    }
    
    @Override
    public String favTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.favTopic(params);
    }
    
    @Override
    public String moveTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.moveTopic(params);
    }
    
    @Override
    public String expressionCheck(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.expressionCheck(params);
    }
    
    @Override
    public void shareTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        dao.shareTopic(params);
    }
    
    @Override
    public Map<String, Object> loadTopic(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.loadTopic(params);
    }
    
    @Override
    public Map<String, Object> loadData(Map<String, Object> params) throws BaseAppException {
        AdhocDAO dao = (AdhocDAO) GeneralDAOFactory.create(AdhocDAO.class, JdbcUtil.OSS_KDO);
        return dao.loadData(params);
    }
    
    @Override
    public Map<String, Object> gridExport(Map<String, Object> params) throws BaseAppException {
        ArrayList<Map<String, Object>> colModel =  (ArrayList<Map<String, Object>>) params.get("colModel");
        ArrayList<Map<String, Object>> dataList =  (ArrayList<Map<String, Object>>) params.get("dataList");
        Workbook wb = new XSSFWorkbook();
        // 创建sheet对象  
        Sheet sheet1 = (Sheet) wb.createSheet("sheet1");  
        Row row = (Row) sheet1.createRow(0); 
        for (int j = 0; j < colModel.size(); j++) {  
            Cell cell = row.createCell(j);  
            cell.setCellValue("" + colModel.get(j).get("label"));  
        }  
        // 循环写入行数据  
        for (int i = 0; i < dataList.size(); i++) {  
            Row datarow = (Row) sheet1.createRow(i + 1);  
            Map<String, Object> dataItem = dataList.get(i);
            // 循环写入列数据  
            for (int j = 0; j < colModel.size(); j++) {  
                Cell cell = datarow.createCell(j);  
                cell.setCellValue("" + dataItem.get(colModel.get(j).get("name")));  
            }  
        }  
        // 创建文件流  
        String fileDirectory = CommonHelper.getProperty("file.upload.directory") + File.separator;
        String fileName = getRandomFileName() + ".xlsx";
        params.put("fileName", fileName);
        OutputStream stream;
        try {
            stream = new FileOutputStream(fileDirectory + fileName);
            wb.write(stream);
            stream.close();
        }
        catch (FileNotFoundException e) {
            LOG.error(e);
        }
        catch (IOException e) {
            LOG.error(e);
        }
        finally {
            return params;
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    private String getRandomFileName() {
        SimpleDateFormat simpleDateFormat;  
        simpleDateFormat = new SimpleDateFormat("yyyyMMdd");  
        Date date = new Date(); 
        String str = simpleDateFormat.format(date);  
        Random random = new Random();  
        int rannum = (int) (random.nextDouble() * (99999 - 10000 + 1)) + 10000; 
        return rannum + str; 
    }
    
}