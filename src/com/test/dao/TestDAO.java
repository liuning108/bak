/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAO;

/**
 * <Description> <br>
 * 
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月27日 <br>
 * @since JDK1.8<br>
 * @see com.test.dao <br>
 */

public abstract class TestDAO extends GeneralDAO<Map<String, String>> {

    public abstract List<Map<String, Object>> queryAll();
    
    public abstract void update(Map<String, String> map);

}
