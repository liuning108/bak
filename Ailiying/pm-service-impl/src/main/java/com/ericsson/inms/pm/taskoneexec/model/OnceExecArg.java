package com.ericsson.inms.pm.taskoneexec.model;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月14日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.taskoneexec.model <br>
 */
public class OnceExecArg {

    /**
     * classPath 一次性任务的实现类路径<br>
     */
    private String classPath;

    /**
     * jsonParam 该任务的参数<br>
     */
    private String jsonParam;

    public String getClassPath() {
        return classPath;
    }

    public void setClassPath(String classPath) {
        this.classPath = classPath;
    }

    public String getJsonParam() {
        return jsonParam;
    }

    public void setJsonParam(String jsonParam) {
        this.jsonParam = jsonParam;
    }
}
