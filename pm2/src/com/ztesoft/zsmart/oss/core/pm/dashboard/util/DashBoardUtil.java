package com.ztesoft.zsmart.oss.core.pm.dashboard.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import sun.misc.BASE64Decoder;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/**
 * 
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.util <br>
 */
public class DashBoardUtil {
    
    public static String [] TOPIC_SEND_MODEL=new String[]{"topicType","topicNo","SubjectName","Recipent","ReportType","EffDate","ExpDate"};
    public static String [] querySendTopicByTopicNo_MODEL=new String[]{"topicType","topicNo"};

    public static String ADHOC_TYPE="00";
    public static String DASHBOARD_TYPE="01";
    public static String REPORT_DAY="_D";
    public static String REPORT_WEEK="_W";
    public static String REPORT_MONTH="_M";
    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param text 
     * @param number 
     * @return <br>
     */
    public static List<String> splitByNumbers(String text, int number) {
        List<String> strings = new ArrayList<String>();
        int index = 0;
        while (index < text.trim().length()) {
            strings.add(text.substring(index, Math.min(index + number, text.length())));
            index += number;
        }
        return strings;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param o 
     * @return result
     * @throws BaseAppException
     *             <br>
     */
    public static String toString(Object o) throws BaseAppException {
        String temp = o + "";
        return temp.trim();
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param paramString 
     * @return result 
     * @throws BaseAppException 
     *             <br>
     */

    public static String getSeq(String paramString) throws BaseAppException {
        String codePrefix = "PMS";
        StringBuffer seq = new StringBuffer(SeqUtil.getSeq(paramString));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String adapterNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;
        return adapterNo;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param topic 
     * @return <br>
     */
    public static HashMap<String, Object> toConvert(HashMap<String, String> topic) {
        HashMap<String, Object> map = new HashMap<String, Object>();
        for (String key : topic.keySet()) {
            String hump = toHump(key);
            String value = toNULL(topic.get(key), "");
            map.put(hump, value);
        }
        return map;
    }
    
    
    public static HashMap<String, String> toConvertQuery(HashMap<String, String> topic) {
        HashMap<String, String> map = new HashMap<String, String>();
        for (String key : topic.keySet()) {
            String hump = toHump(key);
            String value = toNULL(topic.get(key), "");
            map.put(hump, value);
        }
        return map;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param value 
     * @param value2 
     * @return <br>
     */

    private static String toNULL(String value, String value2) {
        if (value == null || "".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value)) {
            return value2;
        }
        return value;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param key 
     * @return <br>
     */
    private static String toHump(String key) {
        String[] keys = key.split("_");
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < keys.length; i++) {
            String keypart = keys[i];
            if (i == 0) {
                sb.append(keypart.toLowerCase());
            }
            else {

                sb.append(keypart.substring(0, 1).toUpperCase());
                sb.append(keypart.substring(1, keypart.length()).toLowerCase());
            }
        }
        return sb.toString();
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dynamicDict 
     * @return map <br>
     */
    public static Map dic2Map(DynamicDict dynamicDict) {
        Map map = new HashMap();
        for (String key : dynamicDict.valueMap.keySet()) {
            Object value = dynamicDict.valueMap.get(key);
            if (value instanceof DynamicDict) {
                map.put(key, DashBoardUtil.dic2Map((DynamicDict) value));
            }
            else {
                map.put(key, value);
            }

        }
        return map;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param list 
     * @return <br>
     */
    public static List<Map<String, Object>> toConvert(List<HashMap<String, String>> list) {
        List<Map<String, Object>> newlist = new ArrayList<Map<String, Object>>();
        for (HashMap<String, String> map : list) {
            HashMap<String, Object> bean = toConvert(map);
            newlist.add(bean);
        }

        return newlist;
    }

   /**
    * 
    * [方法描述] <br> 
    *  
    * @author [刘宁]<br>
    * @taskId <br>
    * @param dirs 
    * @param base64 
    * @param topicId 
    * @return <br>
    */
    public static String saveImage(File dirs, String base64, String topicId) {
        try {
            String base64Image = base64.split(",")[1];
            BufferedImage image = null;
            byte[] imageByte;
            BASE64Decoder decoder = new BASE64Decoder();
            imageByte = decoder.decodeBuffer(base64Image);
            ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
            image = ImageIO.read(bis);
            bis.close();
            File outputfile = new File(dirs.getAbsolutePath() + "/" + topicId + ".png");
            ImageIO.write(image, "png", outputfile);
            return outputfile.getName();
        }
        catch (Exception e) {
            return null;
        }
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dynamicDict 
     * @return <br>
     */
    public static Map dic2Map2(DynamicDict dynamicDict) {
        Map map = new HashMap();
        for (String key : dynamicDict.valueMap.keySet()) {
            Object value = dynamicDict.valueMap.get(key);
            if (value instanceof DynamicDict) {
                map.put(key, DashBoardUtil.dic2Map2((DynamicDict) value));
            }
            else {
                if (value instanceof ArrayList) {
                    ArrayList<DynamicDict> list = (ArrayList<DynamicDict>) value;
                    ArrayList<Map> maps = new ArrayList<Map>();
                    for (DynamicDict dict : list) {
                        Map m = DashBoardUtil.dic2Map2(dict);
                        maps.add(m);
                    }
                    map.put(key, maps);
                }
                else {
                    map.put(key, value);
                }

            }

        }
        return map;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param colModels  
     * @param datas 
     * @return <br>
     */
    public static List<Map<String, Object>> toAxis(List<Map<String, Object>> colModels, List<Map<String, Object>> datas) {
        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> models : colModels) {
            Map<String, Object> item = new HashMap<String, Object>();
            String id = "" + models.get("name");
            String name = "" + models.get("as");
            List<Object> model_datas = DashBoardUtil.pluck(datas, id);
            item.put("id", id);
            item.put("name", name);
            item.put("data", model_datas);
            result.add(item);

        }
        return result;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param datas 
     * @param name 
     * @return <br>
     */

    private static List<Object> pluck(List<Map<String, Object>> datas, String name) {
        List<Object> result = new ArrayList<Object>();
        for (Map<String, Object> item : datas) {
            Object value = item.get(name);
            result.add(value);
        }
        return result;
    }
    
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict
     * @param Model
     * @return <br>
     * @throws BaseAppException 
     */ 
    public static Map<String, String> getHashMap(DynamicDict dict, String[] models) throws BaseAppException {
        Map<String,String> param  = new HashMap<String, String>();
        for(String model:models){
            String value =""+dict.getString(model);
            
            param.put(model, value);
        }
        return param;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param string
     * @return <br>
     * @throws BaseAppException 
     */ 
    public static Date parse(String format,String dateStr) throws BaseAppException {
        
        SimpleDateFormat bartDateFormat =  
                new SimpleDateFormat(format);  
        Date date= null;
        try {
             date=bartDateFormat.parse(dateStr);
        }
        catch (ParseException e) {
          throw new BaseAppException(e.getMessage());
        }
        return date;
    }

}
