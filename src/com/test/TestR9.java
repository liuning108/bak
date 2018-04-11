/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.interceptor.DelegatingTransactionAttribute;
import org.springframework.transaction.interceptor.RollbackRuleAttribute;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.transaction.interceptor.TransactionAttribute;
import org.springframework.transaction.support.DefaultTransactionStatus;

import com.alibaba.druid.pool.DruidDataSource;
import com.test.dao.TestDAO;
import com.test.service.ITestSrv;

import com.ztesoft.zsmart.core.boot.autoconfigure.druid.DruidDataSourceBuilder;
import com.ztesoft.zsmart.core.boot.autoconfigure.druid.DruidDataSourceProperties;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.MultiDataSourceTransactionManager;
import com.ztesoft.zsmart.core.jdbc.transaction.MultiDataSourceTransactionObject;
import com.ztesoft.zsmart.core.jdbc.transaction.support.TransactionTemplateTransactionStatusContext;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.framework.test.AbstractAppTest;

/**
 * <Description> <br>
 * 
 * @author zhu.dajiang<br>
 * @version 8.1<br>
 * @taskId <br>
 * @CreateDate 2018年3月16日 <br>
 * @since JDK1.7<br>
 * @see com.test <br>
 */
public class TestR9 extends AbstractAppTest {

    /** 
     *  
     */
    public TestR9() {
    }

    /**
     * Description: <br>
     * 
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param args <br>
     */
    public static void main(String[] args) {
        init("test1");
        // addSpring();
        // testFile();
        // testDB();
        // testFileCls();
        // testField();
        testSrv();
    }

    public static void testSrv() {
        try {
            ITestSrv testSrv = SpringContext.getBean(ITestSrv.class);
            System.err.println(testSrv.getSrv1("Yso", "这是一个测试."));
            TransactionStatus status = TransactionTemplateTransactionStatusContext.getCurrentTransactionContext();
            if (null != status && status instanceof DefaultTransactionStatus) {
                DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;
                MultiDataSourceTransactionObject txObject = (MultiDataSourceTransactionObject) defStatus
                    .getTransaction();
                System.out.println(txObject.getTransactionId());
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void testField() {
        try {
            // System.out.println(DataSourcePwdUtil.encrypt("123456"));

            MultiDataSourceTransactionManager transactionManager = new MultiDataSourceTransactionManager();
            transactionManager.getTransaction(null);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void testFileCls() {
        BufferedReader br = null;
        try {
            br = new BufferedReader(
                new InputStreamReader(new FileInputStream("j:/doc/druidDataSourceConfig.properties")));
            String tmp = br.readLine();
            while (null != tmp) {
                if (-1 != tmp.indexOf("ftf.datasource.druid")) {
                    int sLen = "ftf.datasource.druid.".length();
                    int llx = tmp.indexOf("ftf.datasource.druid.");
                    int lle = tmp.indexOf("=");
                    String key = tmp.substring(llx + sLen, lle);
                    System.out.println(String.format(
                        "    /**\n     * key - %s\n     */\n    public static final String KEY_%s = \"%s\";\n", key,
                        key.replaceAll("-", "_").replaceAll("\\.", "_").toUpperCase(), key));
                }
                tmp = br.readLine();
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void testDB() {
        try {
            DruidDataSourceProperties dsp = new DruidDataSourceProperties();
            DruidDataSource druidDataSource = new DruidDataSourceBuilder().properties(dsp).build();
            System.out.println(druidDataSource.getConnectProperties());

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void testFile() {
        try {
            /*
             * File file = new File("j:\\OsspublicR9.0\\Zsmart_OMPublic_V9.0\\ZSMART_HOME\\etc"); Collection<File> files
             * = FileUtils.listFiles(file, new String[] { "properties" }, true); for (File child : files) {
             * System.out.println(child.getAbsolutePath()); }
             */

            Properties prop = new Properties();
            prop.load(new FileInputStream(
                "j:\\OsspublicR9.0\\Zsmart_OMPublic_V9.0\\ZSMART_HOME\\etc\\coreConfig.properties"));
            String key = prop.getProperty("ftf.datasource.druid.connection-properties");
            String[] attr = StringUtils.splitByWholeSeparator(key, ";");
            String[] itemArr = null;
            System.out.println(key);
            for (String attrInfo : attr) {
                itemArr = StringUtils.splitByWholeSeparator(attrInfo, "=");
                if (2 == itemArr.length) {
                    System.out.println(itemArr[0] + ":" + itemArr[1]);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("serial")
    public static void addSpring() {
        try {

            /*
             * CommonConfiguration ccf = appContext.getBean(CommonConfiguration.class); ConfigurableEnvironment cfe =
             * ConfigurableEnvironment.class.cast(ccf.getEnv()); PropertySource<?> proSrc = null;
             * Iterator<PropertySource<?>> its = cfe.getPropertySources().iterator(); while (its.hasNext()) { proSrc =
             * its.next(); System.out.println(proSrc.getName()); System.out.println(proSrc.getSource());
             * System.out.println("-------"); } System.out.println(CommonHelper.getProperty(Const.KEY_PATH_PREFIX));
             * System.out.println(CommonHelper.getProperty("ftf.datasource.druid.driver-class-name"));
             */
            // SqlSettings sqlSettings = appContext.getBean(SqlSettings.class);
            // System.out.println(sqlSettings);

            /*
             * Connection conn = DruidDataSourceConfigurationHelper.dataSource("test").getConnection(); Statement sta =
             * conn.createStatement(); ResultSet sRs = sta.executeQuery("select * from opb_trigger_message");
             * while(sRs.next()) { System.out.println(sRs.getString(1)); }
             */

            /*
             * System.out.println(JdbcUtil.getDataSource(JdbcUtil.OSS_CSM) +":" + (new
             * Timestamp(System.currentTimeMillis()))); System.out.println(JdbcUtil.getDBType(JdbcUtil.OSS_CSM)+":" +
             * (new Timestamp(System.currentTimeMillis()))); System.out.println(JdbcUtil.getDBType(JdbcUtil.OSS_CSM)+":"
             * + (new Timestamp(System.currentTimeMillis())));
             * System.out.println(JdbcUtil.getDBType(JdbcUtil.OSS_OBP)+":" + (new
             * Timestamp(System.currentTimeMillis()))); System.out.println(JdbcUtil.getDBType(JdbcUtil.OSS_OBP)+":" +
             * (new Timestamp(System.currentTimeMillis())));
             */

            JdbcUtil.initDataSource("com.ztesoft.zsmart.oss.opb");

            JdbcUtil.initDataSource("com.ztesoft.zsmart.oss.csm.ret");

            MultiDataSourceTransactionManager transactionManager = SpringContext
                .getBean(MultiDataSourceTransactionManager.class);

            RuleBasedTransactionAttribute ruleAttr = new RuleBasedTransactionAttribute();
            ruleAttr.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
            ruleAttr.setTimeout(20);
            RollbackRuleAttribute attr = new RollbackRuleAttribute(BaseAppException.class);
            ruleAttr.getRollbackRules().add(attr);
            // attr = new RollbackRuleAttribute(BaseAppRuntimeException.class);
            // ruleAttr.getRollbackRules().add(attr);

            TransactionAttribute definition = new DelegatingTransactionAttribute(ruleAttr) {
                @Override
                public String getName() {
                    return "addSpring";
                }
            };

            TransactionStatus status = transactionManager.getTransaction(definition);
            TransactionTemplateTransactionStatusContext.setCurrentTransactionContext(status);

            TestDAO dao = (TestDAO) GeneralDAOFactory.create(TestDAO.class, JdbcUtil.OSS_OBP);

            dao.update(null);

            Thread.sleep(20000);

            System.out.println(dao.queryAll());

            TransactionTemplateTransactionStatusContext.removeCurrentTransactionContext();

            transactionManager.commit(status);
            MultiDataSourceTransactionObject sObj = (MultiDataSourceTransactionObject) ((DefaultTransactionStatus) status)
                .getTransaction();

            System.out
                .println(sObj.getTransactionId() + ":" + sObj.getTimeout() + ":" + sObj.getPreviousIsolationLevel());

            System.out.println(dao.getDBCurrentTime());
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
