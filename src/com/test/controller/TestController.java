/****************************************************************************************
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.test.dto.TestDto;
import com.test.service.ITestSrv;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/**
 * <Description> <br>
 *
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月28日 <br>
 * @since JDK1.8<br>
 * @see com.test.controller <br>
 */
@RestController
//@IgnoreSession
@RequestMapping("test")
public class TestController {

    @Autowired
    private ITestSrv testSrv;


    @RequestMapping(value = "info", method = RequestMethod.GET)
    @PublicServ
    public TestDto sayHello() throws BaseAppException {
        TestDto dto = new TestDto();
        dto.setErrCode(0);
      //  dto.setMsg(testSrv.getSrv(userName, helloInfo));
        return dto;
    }

}
