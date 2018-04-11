/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.bll;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.test.dao.TestDAO;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.JdbcUtil;

/**
 * <Description> <br>
 * 
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月28日 <br>
 * @since JDK1.8<br>
 * @see com.test.bll <br>
 */
@Component
public class TestManager {

    @Autowired
    private TestManager1 tmgr;

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void doTest() throws BaseAppException {
        try {
            Map<String, String> parMap = new HashMap<String, String>();
            parMap.put("PWD", "doTestVal");
            TestDAO dao = (TestDAO) GeneralDAOFactory.create(TestDAO.class, JdbcUtil.OSS_KDO);
            
            dao.queryAll();
            dao.update(parMap);
            System.out.println(dao.getDBCurrentTime());

            dao = (TestDAO) GeneralDAOFactory.create(TestDAO.class, JdbcUtil.OSS_CSM);
            dao.queryAll();
            dao.update(parMap);
            System.out.println(dao.getDBCurrentTime());
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRES_NEW)
    public void doTest1() throws BaseAppException {
        try {
            Map<String, String> parMap = new HashMap<String, String>();
            parMap.put("PWD", "doTest1Val");
            TestDAO dao = (TestDAO) GeneralDAOFactory.create(TestDAO.class, JdbcUtil.OSS_OBP);
            dao.queryAll();
            dao.update(parMap);
            System.out.println(dao.getDBCurrentTime());

            dao = (TestDAO) GeneralDAOFactory.create(TestDAO.class, JdbcUtil.OSS_CSM);
            dao.queryAll();
            dao.update(parMap);
            System.out.println(dao.getDBCurrentTime());
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void doTest2() throws BaseAppException {
        try {
            tmgr.doOpbTest();
            tmgr.doScmTest();
            throw new Exception("这个要回滚");
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRES_NEW)
    public void doTest3() throws BaseAppException {
        try {
            tmgr.doOpbTest1();
            tmgr.doScmTest1();
            throw new Exception("这个要回滚");
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void doTest4() throws BaseAppException {
        try {
            tmgr.doOpbTest();
            tmgr.doScmTest1();
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }

    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRES_NEW)
    public void doTest5() throws BaseAppException {
        try {
            tmgr.doOpbTest1();
            tmgr.doScmTest();
        }
        catch (Exception e) {
            ExceptionHandler.publish("OPB-Test-0000", ExceptionHandler.INNER_ERROR);
        }
    }
}
