package com.ericsson.inms.pm.taskarchive.model;

import com.ericsson.inms.pm.utils.DBSourceInfo;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月8日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.plugin.cleanmidtable <br>
 */
public class TableObject {

    /**
     * logger <br>
     */
    private static final OpbLogger LOGGER = OpbLogger.getLogger(TableObject.class, "PM");

    /**
     * modelName <br>
     */
    private String modelName;

    /**
     * granu 粒度<br>
     */
    private String granu;

    /**
     * mode 分表规则<br>
     */
    private String mode;

    /**
     * type 模型类型，详单 0/统计 1<br>
     */
    private int type;

    /**
     * dbSourecNo 所在数据库<br>
     */
    private String dbSourecNo;

    /**
     * fileName <br>
     */
    private String fileName;

    /**
     * tableName 物理表名称<br>
     */
    private String tableName;

    /**
     * where <br>
     */
    private String where;

    /**
     * dbInfo <br>
     */
    public DBSourceInfo dbInfo;

    /**
     * extSql 导出sql<br>
     */
    private String extSql;

    // 数据导出状态 0开始 1数据导出文件成功 2数据删除成功 3清理分区成功
    /**
     * extState <br>
     */
    private int extState;

    // 删除语句
    /**
     * deleteSql <br>
     */
    private String deleteSql;

    /**
     * rowSize <br>
     */
    private long rowSize;

    /**
     * timeLife 数据生命周期 ：天<br>
     */
    private int timeLife;

    /**
     * partDeadTime 要删除的分区创建截止时间<br>
     */
    private String partDeadTime;

    // 文件本地目录绝对路径
    /**
     * localPath <br>
     */
    private String localPath;

    /**
     * Description: <br>
     */
    public TableObject() {

    }

    /**
     * Description: <br>
     * 
     * @param mn String
     * @param g String
     * @param m String
     * @param t String
     */
    public TableObject(String mn, String g, String m, int t) {
        this.modelName = mn;
        this.granu = g;
        this.mode = m;
        this.type = t;
        this.tableName = "";
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getGranu() {
        return granu;
    }

    public void setGranu(String granu) {
        this.granu = granu;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDbSourecNo() {
        return dbSourecNo;
    }

    public void setDbSourecNo(String dbSourecNo) {
        this.dbSourecNo = dbSourecNo;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getWhere() {
        return where;
    }

    public void setWhere(String where) {
        this.where = where;
    }

    public String getExtSql() {
        return extSql;
    }

    public void setExtSql(String extSql) {
        this.extSql = extSql;
    }

    public long getRowSize() {
        return rowSize;
    }

    public void setRowSize(long rowSize) {
        this.rowSize = rowSize;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     *         <br>
     */
    public void log() {
        LOGGER.debug(modelName + "|" + granu + "|" + mode + "|" + type + "|" + dbSourecNo + "|" + fileName + "|"
            + tableName + "|" + where + "|" + extSql + "|" + dbInfo.getDriver() + "|" + dbInfo.getUrl() + "|"
            + dbInfo.getUserName() + "|" + dbInfo.getPasswd() + "|" + extState);
    }

    public int getExtState() {
        return extState;
    }

    public void setExtState(int extState) {
        this.extState = extState;
    }

    public String getDeleteSql() {
        return deleteSql;
    }

    public void setDeleteSql(String deleteSql) {
        this.deleteSql = deleteSql;
    }

    public int getTimeLife() {
        return timeLife;
    }

    public void setTimeLife(int timeLife) {
        this.timeLife = timeLife;
    }

    public String getPartDeadTime() {
        return partDeadTime;
    }

    public void setPartDeadTime(String partDeadTime) {
        this.partDeadTime = partDeadTime;
    }

    public String getLocalPath() {
        return localPath;
    }

    public void setLocalPath(String localPath) {
        this.localPath = localPath;
    }

}
