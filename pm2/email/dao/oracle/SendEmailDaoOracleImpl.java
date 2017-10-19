/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.plugin.email.dao.oracle;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.pm.plugin.email.dao.SendEmailDao;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年10月19日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.plugin.email.dao.oracle <br>
 */

public class SendEmailDaoOracleImpl extends SendEmailDao {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public boolean isEmailSendOn() throws BaseAppException {
        String sql = "select count(*) from pm_parameter t  where t.para_id='emailOnOff' and t.para_value='1'";
        return this.queryInt(sql) > 0;
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
    public List<HashMap<String, String>> getTopicSendListByCycle(String cycle) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = "select t.topic_type,t.topic_no,t.subject_name,t.recipient from pm_topic_send t where t.report_type like ? and to_date(to_char(sysdate,'yyyy-mm-dd'),'yyyy-mm-dd') between t.eff_date and t.exp_date";

        ParamArray pa = new ParamArray();
        pa.set("", "%" + cycle + "%");
        return this.queryList(sql, pa);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param key
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public String getParamter(String key) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = "select  PARA_VALUE from pm_parameter t  where t.para_id=?";
        ParamArray pa = new ParamArray();
        pa.set("", key);
        return this.queryString(sql, pa).trim();
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param no
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public boolean hasDashBoard(String no) throws BaseAppException {
        String sql = "select count(*) from pm_dashboard_topic_list t where t.topic_no=?";

        ParamArray pa = new ParamArray();
        pa.set("", no);
        return this.queryInt(sql, pa) > 0;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param topicNo
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public boolean hasAdHoc(String topicNo) throws BaseAppException {
        String sql = "select count(*) from pm_topic_list t where t.topic_no=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        return this.queryInt(sql, pa) > 0;
    }

}
