package com.ztesoft.zsmart.oss.itnms.parameter.bll;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;
import com.ztesoft.zsmart.oss.itnms.parameter.mapper.ParaMeterMapper;

@Component
public class ParaMeterManager {
    @Autowired
    private ParaMeterMapper paraMeterMapper;

    public List<ParaMeterDto> selectParaMetersByIds(String[] paraIds) {
        return this.paraMeterMapper.selectParaMetersByIds(paraIds);
    }

}