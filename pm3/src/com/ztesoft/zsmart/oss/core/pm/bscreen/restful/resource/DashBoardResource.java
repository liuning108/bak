/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.bscreen.restful.resource;


import java.util.HashMap;

import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.jdbc.datasource.SingleConnectionDataSource;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.SQLUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;
/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年11月1日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.restful.resource <br>
 */
@Path("/test")
public class DashBoardResource {

    @GET
    @Path("/helloworld")
    @Produces("text/plain")
    public String getHelloWorld() {
        return "Hello World";
    }
    
    
    @POST
    @Path("/zteCELL")
    @Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
    public String  zteCELL (String param) {
        Map<String,Object> result = new HashMap<String,Object>();
        String msg ="";
        try {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        javax.sql.DataSource ds =  new SingleConnectionDataSource(dao.getConnection(), false);
        JSONObject json =JSON.parseObject(param);
        
        String sql = "select sttime, gcell_id,pa3zu3b00001,pa3zu3b00001 From pmps_zte3gcell01_m where rownum <=5";
        String type =json.getString("type");
        result.put("code", 1);
        result.put("msg", "succeed");
        
        
        if("meta".equalsIgnoreCase(type)){
            result.put("data", SQLUtil.getFields(ds, sql).get("fields"));
        }else if ("data".equalsIgnoreCase(type)){
            result.put("data", SQLUtil.getDatas(ds, sql).get("datas"));
        }else{
            result.put("code", 0);
            result.put("msg", "send type code is error:"+type);
        }
        }catch(Exception e){
            result.put("code", 0);
            result.put("msg", e.getMessage());
            return JSON.toJSONString(result);
        }
        
        
        return JSON.toJSONString(result);
    }
    
    

}
