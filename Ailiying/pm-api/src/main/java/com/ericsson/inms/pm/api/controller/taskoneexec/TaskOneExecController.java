package com.ericsson.inms.pm.api.controller.taskoneexec;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ericsson.inms.pm.api.service.taskoneexec.ITaskOneExecService;

@RestController
// @IgnoreSession
@RequestMapping("pm/api/pm_taskoneexec")
public class TaskOneExecController {
    @Autowired
    private ITaskOneExecService taskOneExecService;

    /**
     * [方法描述] 预设3个key 
     * mapParam.put("EXEC_TIME","2019-10-10 19:12:12")
     * mapParam.put("CLASS_PATH","com.xxx.xx")
     * mapParam.put("PARAM","{}")<br> 
     *  
     * @author [作者名]<br>
     * @param mapParam
     * @return 0 成功，null 失败<br>
     */ 
    @RequestMapping(value = "insertInst", method = RequestMethod.POST)
    public String insertInst(@RequestParam Map<String, Object> mapParam) {
        return taskOneExecService.insertInst(mapParam);
    }
}
