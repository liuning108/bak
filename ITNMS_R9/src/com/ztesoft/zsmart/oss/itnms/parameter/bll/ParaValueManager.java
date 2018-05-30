package com.ztesoft.zsmart.oss.itnms.parameter.bll;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaValueDto;
import com.ztesoft.zsmart.oss.itnms.parameter.mapper.ParaValueMapper;

@Component
public class ParaValueManager {
    @Autowired
    private ParaValueMapper paraValueMapper;

    public List<ParaValueDto> selectParamValuesByIds(String[] paraIds) {
        return this.paraValueMapper.selectParamValuesByIds(paraIds);
    }
}
