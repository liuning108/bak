/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.config.alram.domain;

import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月3日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.alram.domain <br>
 */

public abstract class AbstractAlramMgr {
   public abstract Map<String ,Object > queryAlramList(Map<String,String> param)  throws  BaseAppException;
   
}
