package com.liuning.web;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.liuning.until.FileUtil;
@RestController
public class DashboardRestController {
	

	
	private DashboardDao dashboardDao ;
	
	@Resource(name="dashboardDao")
	public void setDao(DashboardDao dashboardDao) {
		this.dashboardDao = dashboardDao;
	}
	@Autowired
	private ServletContext context;

	public void setServletContext(ServletContext servletContext) {
	     this.context = servletContext;
	}
	
    /**
     * 保存
     * @param dashboard
     */
	@RequestMapping(value = "dashboard/add", method = RequestMethod.POST)
	public String add(@RequestBody Map<Object, Object> dashboard) {
		System.out.println(dashboard);
		JSONObject json = new JSONObject();
		for (Map.Entry<Object, Object> entry : dashboard.entrySet()) {
			json.put(entry.getKey(), entry.getValue());
		}
	
		dashboardDao.saveOrUpdate(dashboard.get("id")+"",dashboard.get("name")+"",json);
		try (FileWriter file = new FileWriter("test.json")) {
			file.write(json.toJSONString());
			file.flush();
			System.out.println(json.toJSONString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "ok";

	}
	

    /**
     * 读取
     * @param dashboard
     */
	@RequestMapping(value = "dashboard/get", method = RequestMethod.GET)
	public JSONObject get(String id) {
		 System.out.println(id);
		 
		 Map result=dashboardDao.getDashBoardById(id);
		 if(result==null)return null;
		 System.out.println(result);
		 JSONParser parser = new JSONParser();
		 JSONObject jsonObject =null;
		 try {
			Object obj = parser.parse(""+result.get("json"));
		    jsonObject = (JSONObject) obj;
		} catch (Exception e) {
			e.printStackTrace();
		}
		 return jsonObject;
	}
	
	 /**
     * 读取仪表盘列表
     * @param dashboard
     */
	@RequestMapping(value = "dashboard/all", method = RequestMethod.GET)
	public List<Map<String, Object>> list() {
		 return dashboardDao.getAllDashBoard();
	}
	
	
	 /**
	  * 上传背景图
	  * @param uploadForm
	  */
	@RequestMapping(value = "dashboard/upload", method = RequestMethod.POST)
	public String upload( @ModelAttribute("uploadForm")FileUploadForm uploadForm ) {
		MultipartFile multipartFile = uploadForm.getFile();
	    String result="null";
		if(null != multipartFile) {
			String uuidFileName = FileUtil.getUUIDFileName(multipartFile.getOriginalFilename());
			System.out.println(uuidFileName);
			try {
				String path=context.getRealPath("") + File.separator+"upload"+File.separator+uuidFileName;
				File newFile= new File(path);
				System.out.println(newFile.getAbsolutePath());
				FileUtil.save(multipartFile.getInputStream(), newFile);
				result=uuidFileName;
			} catch (IOException e) {
			   e.printStackTrace();
			}
		}//end of if
		return result;
	}
	

	
	
}
