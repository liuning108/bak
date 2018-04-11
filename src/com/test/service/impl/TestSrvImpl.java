/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.bll.TestManager;
import com.test.service.ITestSrv;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * <Description> <br> 
 *  
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月28日 <br>
 * @since JDK1.8<br>
 * @see com.test.service.impl <br>
 */
@Service("testSrv")
public class TestSrvImpl implements ITestSrv {


    @Autowired
    private TestManager testMgr;
    
    
    @Override
    public String getSrv(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }


    @Override
    public String getSrv1(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest1();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }


    @Override
    public String getSrv2(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest2();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }


    @Override
    public String getSrv3(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest3();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }


    @Override
    public String getSrv4(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest4();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }

    @Override
    public String getSrv5(String userName, String helloInfo) throws BaseAppException {
        testMgr.doTest5();
        return String.format("WellCome %s, %s", userName, helloInfo);
    }
}
