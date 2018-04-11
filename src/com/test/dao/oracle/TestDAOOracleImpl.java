/****************************************************************************************
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.dao.oracle;

import java.util.List;
import java.util.Map;

import com.test.dao.TestDAO;

/**
 * <Description> <br>
 *
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月27日 <br>
 * @since JDK1.8<br>
 * @see com.test.dao.oracle <br>
 */

public class TestDAOOracleImpl extends TestDAO {

    @Override
    public List<Map<String, Object>> queryAll() {
        return queryForList("select * from bfm_portal_menu where parent_id = ?", new Object[] {
            4
        });
    }

    @Override
    public void update(Map<String, String> map) {
        update("update bfm_user_his set pwd = ? where user_id = ?", new Object[] {
            map.get("PWD"), 1
        });
    }
}
