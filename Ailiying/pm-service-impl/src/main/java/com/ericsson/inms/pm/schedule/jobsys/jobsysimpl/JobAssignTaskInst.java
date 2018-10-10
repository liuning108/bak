package com.ericsson.inms.pm.schedule.jobsys.jobsysimpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.dangdang.ddframe.job.api.ShardingContext;
import com.dangdang.ddframe.job.api.simple.SimpleJob;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ericsson.inms.pm.schedule.config.ScheduleConf;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;

/** 
 * [描述] 扫描一定时间段的 pm_task_inst 依次加入到quartz 队列中，注意过期时间实例<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.job.sysJob <br>
 */
public class JobAssignTaskInst implements SimpleJob {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(JobAssignTaskInst.class, "PM");

    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    /**
     * scheduleConf <br>
     */
    private ScheduleConf scheduleConf = (ScheduleConf) SpringContext.getBean("scheduleConf");

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param arg0 <br>
     */
    @Override
    public void execute(ShardingContext arg0) {
        String jobName = arg0.getJobName();
        int shardingItem = arg0.getShardingItem();
        Date date = new Date();
        String assignDeadline = TimeProcess.getInstance().getDeadline(date, scheduleConf.getAssignTaskFrequency());
        logger.info(" ********** begin JobAssignTaskInst job[" + jobName + "|" + shardingItem
                + "| assign inst deadline [" + assignDeadline + "] ********** ");

        try {
            List<TaskInst> _listAssignInst = sysJobDaoUtil.getWaitAssignInst(assignDeadline);
            if (_listAssignInst.size() == 0) return;
            // 按taskNo分组 Map<String, List<TaskInst>>
            Map<String, List<TaskInst>> mapTaskNoListInst = groupTaskInstByTaskNo(_listAssignInst);
            // 均分每种taskNo 到分片
            setPieceSeqInst(mapTaskNoListInst);
            // 更新数据库
            sysJobDaoUtil.updateTaskInstPiece(mapTaskNoListInst);
        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", "JobAssignTaskInst exception:", e);
        }
        finally {
            logger.info(" ********** finish JobAssignTaskInst job[" + jobName + "|" + shardingItem
                    + "| assign inst deadline [" + assignDeadline + "] ********** \n");
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param mapTaskNoListInst  <br>
     */
    private void setPieceSeqInst(Map<String, List<TaskInst>> mapTaskNoListInst) {
        List<PieceInfo> listPieceInfo = initPiece();
        String pieceTime = TimeProcess.getInstance().getTimeStr(new Date());
        for (Entry<String, List<TaskInst>> en : mapTaskNoListInst.entrySet()) {
            List<TaskInst> _list = en.getValue();
            for (int i = 0; i < _list.size(); i++) {
                _list.get(i).setPieceSeq(listPieceInfo.get(i % scheduleConf.getPieceNum()).getSeq());
                listPieceInfo.get(i % scheduleConf.getPieceNum()).plus(1);
                _list.get(i).setTaskState("A");
                _list.get(i).setTaskAssignDate(pieceTime);
            }
            // 排序
            sortPieceInfo(listPieceInfo);
        }
        String str = "";
        for (PieceInfo info : listPieceInfo)
            str = str + info.getSeq() + "-" + info.getCnt() + "|";
        logger.debug("piece-cnt info [" + str + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listPieceInfo  <br>
     */
    private void sortPieceInfo(List<PieceInfo> listPieceInfo) {
        Collections.sort(listPieceInfo, new Comparator<PieceInfo>() {
            @Override
            public int compare(PieceInfo o1, PieceInfo o2) {
                if (o1.getCnt() > o2.getCnt()) return 1;
                if (o1.getCnt() < o2.getCnt()) return -1;
                return 0;
            }
        });
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    private List<PieceInfo> initPiece() {
        List<PieceInfo> listPieceInfo = new ArrayList<PieceInfo>();
        for (int i = 0; i < scheduleConf.getPieceNum(); i++) {
            listPieceInfo.add(new PieceInfo(i, 0));
        }
        return listPieceInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param _listAssignInst
     * @return  <br>
     */
    private Map<String, List<TaskInst>> groupTaskInstByTaskNo(List<TaskInst> _listAssignInst) {
        Map<String, List<TaskInst>> mapTaskNoListInst = new HashMap<String, List<TaskInst>>();
        for (TaskInst inst : _listAssignInst) {
            if (mapTaskNoListInst.containsKey(inst.getTaskNo())) mapTaskNoListInst.get(inst.getTaskNo()).add(inst);
            else {
                List<TaskInst> ret = new ArrayList<TaskInst>();
                ret.add(inst);
                mapTaskNoListInst.put(inst.getTaskNo(), ret);
            }
        }
        return mapTaskNoListInst;

    }

}

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.jobsysimpl <br>
 */
class PieceInfo {
    /**
     * seq <br>
     */
    private int seq;
    /**
     * cnt <br>
     */
    private int cnt;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param s
     * @param c  <br>
     */
    public PieceInfo(int s, int c) {
        this.seq = s;
        this.cnt = c;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getSeq() {
        return seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getCnt() {
        return cnt;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param c  <br>
     */
    public void plus(int c) {
        this.cnt += c;
    }
}
