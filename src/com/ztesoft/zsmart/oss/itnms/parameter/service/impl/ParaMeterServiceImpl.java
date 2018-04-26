package com.ztesoft.zsmart.oss.itnms.parameter.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.itnms.parameter.bll.ParaMeterManager;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;
import com.ztesoft.zsmart.oss.itnms.parameter.service.ParaMeterService;

@Service("paraMeterServ")
public class ParaMeterServiceImpl implements ParaMeterService {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ParaMeterServiceImpl.class);

    @Autowired
    private ParaMeterManager paraMeterManager;

    @Override
    public Map<String, ParaMeterDto> selectParaMetersByIds(String paraIds) {

        LOG.debug("Begin  ParaMeterServiceImpl--selectParaMetersByIds, paraIds = " + JSON.toJSONString(paraIds));

        if (StringUtils.isEmpty(paraIds)) {
            LOG.debug("End  ParaMeterServiceImpl--selectParaMetersByIds, paraIds is empty, return empty map ");
            return Collections.emptyMap();
        }

        String[] paraIdsArr = paraIds.split(",");
        List<ParaMeterDto> paraMeterList = this.paraMeterManager.selectParaMetersByIds(paraIdsArr);
        if (CollectionUtils.isEmpty(paraMeterList)) {
            LOG.debug("End  ParaMeterServiceImpl--selectParaMetersByIds, paraMeterList is empty, return empty map ");
            return Collections.emptyMap();
        }

        Map<String, ParaMeterDto> result = new HashMap<String, ParaMeterDto>();
        Iterator<ParaMeterDto> it = paraMeterList.iterator();
        while (it.hasNext()) {
            ParaMeterDto pmDto = (ParaMeterDto) it.next();
            String paraId = pmDto.getParaId();
            result.put(paraId, pmDto);
        }

        LOG.debug("End  ParaMeterServiceImpl--selectParaMetersByIds");

        return result;
    }

}
