package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * [描述] 根据指定目录下的获取所有表的xml信息<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.storedataprocedure <br>
 */
public class TablesInfoByXml {

    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /**
     * tableInfoMap key=模板表名称<br>
     */
    public static HashMap<String, TablesInfo> tableInfoMap = new HashMap<String, TablesInfo>();

    /**
     * info <br>
     */
    private static TablesInfoByXml tablesInfo = new TablesInfoByXml();

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static TablesInfoByXml instance() {
        return tablesInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void initConfig() {
        scanXmlDir(LoadConfig.instance().getXmlDir());
        print();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param xmlDirPath <br>
     */ 
    private void scanXmlDir(String xmlDirPath) {
        File xmls = new File(xmlDirPath);
        if (!xmls.exists() || !xmls.isDirectory()) {
            logger.error("xml dir is not exist .[" + xmlDirPath + "]");
            return;
        }
        String files[] = xmls.list();
        for (int i = 0; i < files.length; i++) {
            File file = new File(xmlDirPath + "/" + files[i]);
            if (readXml(file.toString())) {
                logger.info("success load XML:" + file.toString());
            } 
            else {
                logger.error("failed load XML:" + file.toString() + " please check or delete it.");
            }
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param xmlName 
     * @return <br>
     */ 
    private boolean readXml(String xmlName) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document document = builder.parse(xmlName);
            org.w3c.dom.Element root = document.getDocumentElement();
            NodeList childNodes = root.getChildNodes();

            for (int i = 0; i < childNodes.getLength(); i++) {
                readXmlNode(childNodes, i);
            }
        }
        catch (FileNotFoundException e) {
            logger.error("read xml:" + xmlName + " error.", e);
            return false;
        } 
        catch (ParserConfigurationException e) {
            logger.error("read xml:" + xmlName + " error.", e);
            return false;
        } 
        catch (SAXException e) {
            logger.error("read xml:" + xmlName + " error.", e);
            return false;
        } 
        catch (IOException e) {
            logger.error("read xml:" + xmlName + " error.", e);
            return false;
        } 
        catch (NullPointerException e) {
            logger.error("read xml:" + xmlName + " error.", e);
            return false;
        }
        return true;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param childNodes 
     * @param i <br>
     */ 
    private void readXmlNode(NodeList childNodes, int i) {
        Node node = childNodes.item(i);
        if (node.getNodeType() == Node.ELEMENT_NODE && "table".equals(node.getNodeName())) {
            String tableName = node.getAttributes().getNamedItem("tableName").getNodeValue().trim();
            List<FieldInfo> fields = new ArrayList<FieldInfo>();
            getFields(node, fields);
            
            String cycle_sep = node.getAttributes().getNamedItem("cycle_sep").getNodeValue().trim();
            String str[] = cycle_sep.split(",");
            for (int k = 0; k < str.length; k++) {
                String cy[] = str[k].split(":");
                if (cy.length != 2 || ("").equals(cy[0])) {
                    logger.error("tableName[" + tableName + "] can not get cycle_seq [" + cycle_sep + "]");
                    return;
                }
                if (!("0").equals(cy[1]) && !("2").equals(cy[1]) && !("3").equals(cy[1]) && !("4").equals(cy[1])) {
                    logger.error("tableName[" + tableName + "] can not get seq must in (0,1,2,3,4)[" + cycle_sep
                            + "]");
                    return;
                }
                TablesInfo tableInfo = new TablesInfo();
                tableInfo.setTableNmae(tableName + "_" + cy[0]);
                tableInfo.setCycle(cy[0]);
                tableInfo.setSeparateTableRule(Integer.parseInt(cy[1]));
                tableInfo.fields = fields;
                tableInfoMap.put(tableInfo.getTableNmae(), tableInfo);
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param node 
     * @param fields  <br>
     */ 
    private void getFields(Node node, List<FieldInfo> fields) {
        NodeList infos = node.getChildNodes();
        for (int j = 0; j < infos.getLength(); j++) {
            Node info = infos.item(j);
            if (info.getNodeType() == Node.ELEMENT_NODE && "field".equals(info.getNodeName())) {
                String field = info.getAttributes().getNamedItem("name").getNodeValue().trim();
                String type = info.getAttributes().getNamedItem("type").getNodeValue().trim();
                int len = 0;
                if (("char").equals(type)) {
                    len = Integer
                            .parseInt(info.getAttributes().getNamedItem("length").getNodeValue().trim());
                }
                FieldInfo f = new FieldInfo(field, type, len);
                fields.add(f);
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void print() {
        for (Entry<String, TablesInfo> entry : tableInfoMap.entrySet()) {
            logger.info("tablename:" + entry.getValue().getTableNmae() + " cycle:"
                    + entry.getValue().getCycle() + " SeparateTableRule:" + entry.getValue().getSeparateTableRule()
                    + " fiels size:" + entry.getValue().fields.size());

        }
    }
}
