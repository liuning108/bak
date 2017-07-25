package test.com.test;

import java.util.ArrayList;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;

import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.service.BScreenService;
/**
 * 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see test.com.test <br>
 */
public class BScreenServiceTest {
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void getSourceServiceById() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "getSourceServiceById");
        dict.add("Id", "PMS_20170724100816_10116957");
        bs.perform(dict);
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void getSourceServiceListByUserID() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "getSourceServiceList");
        dict.add("userId", "1");
        bs.perform(dict);

    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void getFields() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "getFields");
        dict.add("source", "100000");
        dict.add("sql", "select * from dual");
        bs.perform(dict);
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void deleteBScreenById() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "deleteBScreenById");
        dict.add("topicId", "PMS_20170518115329_10001351");
        bs.perform(dict);
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void queryBScreenListByUserID() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "queryBScreenListByUserID");
        dict.add("userId", 1);
        bs.perform(dict);
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void queryBScreenById() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "queryBScreenById");
        dict.add("topId", "PMS_20170518114958_10001347");
        bs.perform(dict);
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws Exception <br>
     */
    @org.junit.Test
    public void testSaveOrUpdate() throws Exception {
        IAction bs = new BScreenService();
        DynamicDict dict = new DynamicDict();
        dict.add("method", "saveOrUpdate");

        Map<String, Object> map = JSON.parseObject(
                "{\"attrs\":{\"bk_attrs\":{\"background\":\"url(oss_core/pm/screendesigner/images/bk1.jpg)"
                + "  repeat\"},\"h\":1080,\"w\":1920},\"id\":\"\",\"imagePath\":\"\",\"isShare\":0,\"name\":\"test\",\"nodes\":"
                + "[{\"attrs\":{\"ft_attrs\":{\"center\":{\"x\":28.9921875,"
                + "\"y\":14.015625},\"ratio\":1,\"rotate\":0,\"scale\":{\"x\":1,\"y\":1},\"size\":"
                + "{\"x\":177.953125,\"y\":91.90625},\"translate\":"
                + "{\"x\":740.4975812024879,\"y\":392.2113022113022}"
                + ",\"x\":-59.984375,\"y\":-31.9375},\"h\":\"100\",\"numColor\":\"#ffffff\","
                + "\"title\":\"\u6307\u6807\u540d\u79f0\",\"titleColor\":\"#ddff00\",\"type"
                + "\":\"text\",\"w\":\"100\",\"x\":0,\"y\":0},\"id\":\"\"},{\"attrs\":"
                + "{\"ft_attrs\":{\"center\":{\"x\":28.9921875,\"y\":14.015625},\"ratio\":1,"
                + "\"rotate\":0,\"scale\":{\"x\":1,\"y\":1},\"size\":{\"x\":177.953125,\"y\":91.90625},\"translate\":"
                + "{\"x\":534.8306841741535,\"y\":246.26535626535627},\"x\":-59.984375,\"y"
                + "\":-31.9375},\"h\":\"100\",\"numColor\":\"#ffffff\",\"title\":"
                + "\"\u6307\u6807\u540d\u79f0\",\"titleColor\":\"#ddff00\",\"type"
                + "\":\"text\",\"w\":\"100\",\"x\":0,\"y\":0},\"id\":\"\"},{\"attrs\":"
                + "{\"ft_attrs\":{\"center\":{\"x\":28.9921875,\"y\":14.015625},"
                + "\"ratio\":1,\"rotate\":0,\"scale\":{\"x\":1,\"y\":1},\"size\":"
                + "{\"x\":177.953125,\"y\":91.90625},\"translate\":{\"x"
                + "\":968.7214927436074,\"y\":130.83538083538085},\"x"
                + "\":-59.984375,\"y\":-31.9375},\"h\":\"100\",\"numColor\":"
                + "\"#ffffff\",\"title\":\"\u6307\u6807\u540d\u79f0\","
                + "\"titleColor\":\"#ddff00\",\"type\":\"text\",\"w\":\"100\",\"x\":0,\"y\":0},\"id\":\"\"}],"
                + "\"state\":0,\"userid\":\"1\"}");

        ArrayList<DynamicDict> ls = new ArrayList<DynamicDict>();
        DynamicDict dic = new DynamicDict();

        for (String key : map.keySet()) {
            if ("nodes".equalsIgnoreCase(key)) {

            }
            else {
                dic.add(key, map.get(key));
            }

        }
        ls.add(dic);
        dict.add("data", ls);

        bs.perform(dict);

    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */
    @org.junit.Test
    public void testSplitNumber() {
        String text = "{nodes=[{id=d5cbdd97ce7c49678ae7830335d23c6f,"
                + " attrs={numColor=#ffffff, titleColor=#ddff00, "
                + "ft_attrs={rotate=0, size={x=177.953125, y=91.90625},"
                + " center={x=28.9921875, y=14.015625}, x=-59.984375, y=-31.9375, "
                + "scale={x=1, y=1}, translate={x=305.27988942639945, y=165.33169533169533}, ratio=1},"
                + " w=100, x=0, h=100, y=0, type=text, title=指标名称}}], w=1920, h=1080}";
        List<String> strings = new ArrayList<String>();
        int index = 0;
        while (index < text.trim().length()) {
            strings.add(text.substring(index, Math.min(index + 1024, text.length())));
            index += 1024;
        }
    }
}
