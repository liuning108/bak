package com.ztesoft.zsmart.oss.core.slm.slaeval.report.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaeval.report.dao.SlaEvalReportDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaaccept.domain <br>
 */
public class SlaEvalReport extends AbstractSlaEvalReport {
        
    @Override
    public void qrySlaEvalReport(DynamicDict dict) throws BaseAppException {
        SlaEvalReportDAO dao = (SlaEvalReportDAO) GeneralDAOFactory.create(SlaEvalReportDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.qrySlaEvalReport(dict);
    }

}
