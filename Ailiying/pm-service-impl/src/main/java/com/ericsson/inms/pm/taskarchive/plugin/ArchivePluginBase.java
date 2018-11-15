package com.ericsson.inms.pm.taskarchive.plugin;

import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.taskarchive.model.PluginObject;

/**
 * [描述] 归档任务插件基类，实现改方法<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年9月8日 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.pm.plugin.cleanmidtable <br>
 */
public abstract class ArchivePluginBase {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskNo 任务no
     * @param taskID 任务实例no
     * @param btime 任务实例开始时间
     * @param etime 任务实例结束时间
     * @param param 备用参数
     * @param pObj 插件参数
     * @return <br>
     */

    public abstract JobResult invokePlugin(String taskNo, String taskID, String btime, String etime, String param,
        PluginObject pObj);
}
