package com.ericsson.inms.pm.taskarchive.model;

import java.util.ArrayList;
import java.util.List;

/**
 * [描述] 一个归档任务的所有插件参数<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年9月8日 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.pm.plugin.cleanmidtable <br>
 */
public class ArchiveTaskArgs {
    /**
     * taskNo <br>
     */
    private String taskNo;

    /**
     * version <br>
     */
    private String version;

    /**
     * listPlugins 任务下的所有插件<br>
     */
    public List<PluginObject> listPlugins = new ArrayList<PluginObject>();

    /**
     * param <br>
     */
    private String param = "";

    /**
     * [方法描述] <br>
     */
    public ArchiveTaskArgs() {
    }

    /**
     * [方法描述] <br>
     * 
     * @param no String
     * @param ver String
     */
    public ArchiveTaskArgs(String no, String ver) {
        this.taskNo = no;
        this.version = ver;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getTaskNo() {
        return taskNo;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskNo <br>
     */
    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getVersion() {
        return version;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param version <br>
     */
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getParam() {
        return param;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param param <br>
     */
    public void setParam(String param) {
        this.param = param;
    }
}
