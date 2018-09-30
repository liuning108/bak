package com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dangdang.ddframe.job.api.ShardingContext;
import com.dangdang.ddframe.job.api.simple.SimpleJob;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.dao.SysJobDaoUtil;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.PublicConstant;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.TimeProcess;

/** 
 * [描述] 扫描一定时间段的 pm_task_inst 依次加入到quartz 队列中，注意过期时间实例<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.job.sysJob <br>
 */
public class JobAssignTaskInst implements SimpleJob {
    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(JobAssignTaskInst.class);

    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    @Override
    public void execute(ShardingContext arg0) {
        String jobName = arg0.getJobName();
        int shardingItem = arg0.getShardingItem();
        Date date = new Date();
        String assignDeadline = TimeProcess.getInstance().getDeadline(date, PublicConstant.assignTaskFrequency);
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
            logger.error("JobAssignTaskInst exception[" + e + "]");
        }
        finally {
            logger.info(" ********** finish JobAssignTaskInst job[" + jobName + "|" + shardingItem
                    + "| assign inst deadline [" + assignDeadline + "] ********** ");
        }
    }

    private void setPieceSeqInst(Map<String, List<TaskInst>> mapTaskNoListInst) {
        List<PieceInfo> listPieceInfo = initPiece();
        String pieceTime = TimeProcess.getInstance().getTimeStr(new Date());
        for (Entry<String, List<TaskInst>> en : mapTaskNoListInst.entrySet()) {
            List<TaskInst> _list = en.getValue();
            for (int i = 0; i < _list.size(); i++) {
                _list.get(i).setPieceSeq(listPieceInfo.get(i % PublicConstant.pieceNum).getSeq());
                listPieceInfo.get(i % PublicConstant.pieceNum).plus(1);
                _list.get(i).setTaskState("A");
                _list.get(i).setTaskAssignDate(pieceTime);
            }
            // 排序
            sortPieceInfo(listPieceInfo);
        }
        String str = "";
        for (PieceInfo info : listPieceInfo)
            str = str + info.getSeq() + "-" + info.getCnt() + "|";
        logger.debug("piece info [" + str + "]");
    }

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

    private List<PieceInfo> initPiece() {
        List<PieceInfo> listPieceInfo = new ArrayList<PieceInfo>();
        for (int i = 0; i < PublicConstant.pieceNum; i++) {
            listPieceInfo.add(new PieceInfo(i, 0));
        }
        return listPieceInfo;
    }

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

class PieceInfo {
    private int seq;
    private int cnt;

    public PieceInfo(int s, int c) {
        this.seq = s;
        this.cnt = c;
    }

    public int getSeq() {
        return seq;
    }

    public int getCnt() {
        return cnt;
    }

    public void plus(int c) {
        this.cnt += c;
    }
}
