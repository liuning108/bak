/*****************************************************************************************
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.config.alram.dao;

import java.util.HashMap;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * [描述] <br>
 *
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月3日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.alram.dao <br>
 */

public abstract class AlramDao extends GeneralDAO<Object> {
    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>

        return 0;
    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @throws BaseAppException <br>
     */
    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>

    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }


    public abstract Map<String ,Object > queryAlramList(Map<String,String> param)  throws  BaseAppException;


}
