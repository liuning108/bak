package com.ztesoft.zsmart.oss.itnms.parameter.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ztesoft.zsmart.core.jdbc.mybatis.BaseMapper;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaValueDto;

public interface ParaValueMapper extends BaseMapper<ParaValueDto> {
    List<ParaValueDto> selectParamValuesByIds(@Param("paraIds") String[] paraIds);
}
