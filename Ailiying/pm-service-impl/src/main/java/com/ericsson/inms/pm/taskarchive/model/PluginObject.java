package com.ericsson.inms.pm.taskarchive.model;

import java.util.HashMap;

/**
 * [描述] 插件实例<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年9月8日 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.pm.plugin.cleanmidtable <br>
 */
public class PluginObject {

    /**
     * instPluginNo 实例编码<br>
     */
    private String instPluginNo;
    /**
     * specPluginNo 规格编码<br>
     */
    private String specPluginNo;
    
    /**
     * classPath 类路径<br>
     */
    private String classPath;
    
    /**
     * specArgs 实例参数 key=param_code value=param_value<br>
     */
    public HashMap<String, String> specArgs = new HashMap<String, String>();
    /**
     * instArgs 实例参数 key=param_code value=param_value<br>
     */
    public HashMap<String, String> instArgs = new HashMap<String, String>();

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getClassPath() {
        return classPath;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param classPath <br>
     */ 
    public void setClassPath(String classPath) {
        this.classPath = classPath;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getInstPluginNo() {
        return instPluginNo;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param instPluginNo <br>
     */ 
    public void setInstPluginNo(String instPluginNo) {
        this.instPluginNo = instPluginNo;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSpecPluginNo() {
        return specPluginNo;
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param specPluginNo <br>
     */ 
    public void setSpecPluginNo(String specPluginNo) {
        this.specPluginNo = specPluginNo;
    }

    
}
