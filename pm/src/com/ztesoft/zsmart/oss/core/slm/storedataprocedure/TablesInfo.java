package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.util.ArrayList;
import java.util.List;

/** 
 * [描述] 存储字段信息 pair 关系<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.storedataprocedure <br>
 */
class FieldInfo { 
    /**
     * field 字段名称<br>
     */
    public String field;
    
    /**
     * type 字段类型<br>
     */
    public String type;
    
    /**
     * length <br>
     */
    public int length;
    

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param f 
     * @param t 
     * @param len  <br>
     */ 
    FieldInfo(String f, String t, int len) {
        this.field = f;
        this.type = t;
        if (("char").equals(t)) {
            this.length = len;
        }
    }
}
/** 
 * [描述] 存储表的字段信息 key 为模板表名称<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.storedataprocedure <br>
 */
public class TablesInfo {
    
    /**
     * tableNmae 模板表名称+cycle<br>
     */
    private String tableNmae;
    
    /**
     * separateTableRule 分表规则[0:按天|1:周|2:按月|3:按年|4:不分表] <br>
     * 不分表时间缀填写 .non.
     */
    private int separateTableRule;
    
    /**
     * cycle <br>
     */
    private String cycle;
    
    /**
     * field 表的所有字段信息<br>
     */
    public List<FieldInfo> fields = new ArrayList<FieldInfo>();
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getTableNmae() {
        return tableNmae;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tableNmae <br>
     */ 
    public void setTableNmae(String tableNmae) {
        this.tableNmae = tableNmae;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getSeparateTableRule() {
        return separateTableRule;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param separateTableRule <br>
     */ 
    public void setSeparateTableRule(int separateTableRule) {
        this.separateTableRule = separateTableRule;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getCycle() {
        return cycle;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param cycle <br>
     */ 
    public void setCycle(String cycle) {
        this.cycle = cycle;
    }

}
