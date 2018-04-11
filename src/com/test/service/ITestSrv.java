/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * <Description> <br> 
 *  
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月28日 <br>
 * @since JDK1.8<br>
 * @see com.test.service <br>
 */

public interface ITestSrv {

    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv(String userName, String helloInfo) throws BaseAppException;
    
    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv1(String userName, String helloInfo) throws BaseAppException;
    
    
    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv2(String userName, String helloInfo) throws BaseAppException;
    
    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv3(String userName, String helloInfo) throws BaseAppException;
    
    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv4(String userName, String helloInfo) throws BaseAppException;
    
    /**
     * 
     * Description: <br> 
     *  
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param userName <br>
     * @param helloInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSrv5(String userName, String helloInfo) throws BaseAppException;
}
