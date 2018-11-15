package com.ericsson.inms.pm.api.controller.taskprocess;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;
import com.ztesoft.zsmart.pot.utils.ThreadLocalMap;

@RestController
@RequestMapping("pm/api/taskprocessweb")
public class TaskProcessController {

	private OpbLogger logger = OpbLogger.getLogger(TaskProcessController.class, "PM");

	@Resource(name = "taskProcessServiceImpl")
	private TaskProcessService taskProcessService;

	@PublicServ
	@IgnoreSession
	@RequestMapping(value = "onceDownloadFile", method = RequestMethod.POST)
	public JSONObject onceDownloadFile(@RequestBody JSONObject dict) throws BaseAppException {
		return taskProcessService.onceDownloadFile(dict);
	}

	@PublicServ
	@RequestMapping(value = "addExportTask", method = RequestMethod.POST)
	public JSONObject addExportTask(@RequestBody JSONObject dict) throws BaseAppException {
		Long userId = PrincipalUtil.getPrincipal().getUserId();
	    if(userId==null) {
	    	   userId = ThreadLocalMap.getUserId();
	    }
		dict.put("userId", "" + userId);
		return taskProcessService.addExportTask(dict);
	}
	
	@PublicServ
	@RequestMapping(value = "exportTasklist", method = RequestMethod.POST)
	public JSONObject exportTasklist(@RequestBody JSONObject dict) throws BaseAppException { 
		Long userId = PrincipalUtil.getPrincipal().getUserId();
		if(userId==null) {
	    	   userId = ThreadLocalMap.getUserId();
	    }
		dict.put("userId", "" + userId); 
		return taskProcessService.exportTasklist(dict);
	}
	
	
	@PublicServ
	@RequestMapping(value = "moveFTPFile", method = RequestMethod.POST)
	public JSONObject moveFTPFile(@RequestBody JSONObject dict) throws BaseAppException { 
		return taskProcessService.moveFTPFile(dict);
	}
	
	@PublicServ
	@IgnoreSession
	@RequestMapping(value = "clearTempFile", method = RequestMethod.POST)
	public JSONObject clearTempFile(@RequestBody JSONObject dict) throws BaseAppException { 
		JSONObject result = new JSONObject();
		logger.info("clearTempFile Begin");
		try {
	      taskProcessService.clearTempFile();
		  result.put("OK", "OK");
		}catch(Exception e) {
			result.put("error", e.getMessage());
		}
		return result;
	}
	
 
	
}
