package com.ztesoft.zsmart.oss.itnms.parameter.controller;

import java.util.Collections;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;
import com.ztesoft.zsmart.oss.itnms.parameter.service.ParaMeterService;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("itnms/parameter")
public class ParaMeterController {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ParaMeterController.class);

    @Resource
    private ParaMeterService paraMeterServ;

    @PublicServ
    @RequestMapping(value = "{paraIds}", method = RequestMethod.GET)
    public Map<String, ParaMeterDto> selectParaMetersByIds(@PathVariable String paraIds) {

        LOG.info("Enter ParaMeterController--selectParaMetersByIds");
        if (StringUtils.isEmpty(paraIds)) {
            LOG.debug("ParaMeterController--selectParaMetersByIds, paraIds is Empty.");
            return Collections.emptyMap();
        }
        return this.paraMeterServ.selectParaMetersByIds(paraIds);
    }
}
