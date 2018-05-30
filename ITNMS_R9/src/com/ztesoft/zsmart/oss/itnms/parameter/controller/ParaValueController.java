package com.ztesoft.zsmart.oss.itnms.parameter.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaValueDto;
import com.ztesoft.zsmart.oss.itnms.parameter.service.ParaValueService;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("itnms/paravalue")
public class ParaValueController {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ParaValueController.class);

    @Resource
    private ParaValueService paraValueServ;

    @PublicServ
    @RequestMapping(value = "{paraIds}", method = RequestMethod.GET)
    public Map<String, List<ParaValueDto>> selectParamValuesByIds(@PathVariable("paraIds") String paraIds) {

        LOG.info("Enter ParaValueController--selectParamValuesByIds");

        if (StringUtils.isEmpty(paraIds)) {
            LOG.debug("ParaValueController--selectParamValuesByIds, paraIds is Empty.");
            return Collections.emptyMap();
        }

        return this.paraValueServ.selectParamValuesByIds(paraIds);

    }
}
