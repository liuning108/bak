package com.ztesoft.zsmart.oss.itnms.parameter.service.impl;

import java.util.ArrayList;
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
import com.ztesoft.zsmart.oss.itnms.parameter.bll.ParaValueManager;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaValueDto;
import com.ztesoft.zsmart.oss.itnms.parameter.service.ParaValueService;

@Service("paraValueServ")
public class ParaValueServiceImpl implements ParaValueService {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ParaValueServiceImpl.class);

    @Autowired
    private ParaValueManager paraValueManager;

    @Override
    public Map<String, List<ParaValueDto>> selectParamValuesByIds(String paraIds) {

        LOG.debug("Begin  ParaValueServiceImpl--selectParamValuesByIds, paraIds = " + JSON.toJSONString(paraIds));

        if (StringUtils.isEmpty(paraIds)) {
            LOG.debug("End ParaValueServiceImpl--selectParamValuesByIds, paraIds is empty, return empty map.");
            return Collections.emptyMap();
        }

        String[] paraIdsArr = paraIds.split(",");
        List<ParaValueDto> paraValueList = this.paraValueManager.selectParamValuesByIds(paraIdsArr);
        if (CollectionUtils.isEmpty(paraValueList)) {
            LOG.debug("End ParaValueServiceImpl--selectParamValuesByIds, paraValueList is empty, return empty map.");
            return Collections.emptyMap();
        }

        Map<String, List<ParaValueDto>> result = new HashMap<String, List<ParaValueDto>>();
        Iterator<ParaValueDto> it = paraValueList.iterator();
        while (it.hasNext()) {
            ParaValueDto pvDto = (ParaValueDto) it.next();
            String paraId = pvDto.getParaId();
            if (!result.containsKey(paraId)) {
                List<ParaValueDto> dtoList = new ArrayList<ParaValueDto>();
                dtoList.add(pvDto);
                result.put(paraId, dtoList);
            }
            else {
                result.get(paraId).add(pvDto);
            }
        }

        LOG.debug("End ParaValueServiceImpl--selectParamValuesByIds");
        return result;
    }
}
