package com.ztesoft.zsmart.oss.itnms.parameter.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.ztesoft.zsmart.core.jdbc.mybatis.BaseMapper;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;

public interface ParaMeterMapper extends BaseMapper<ParaMeterDto> {
    List<ParaMeterDto> selectParaMetersByIds(@Param("paraIds")String[] paraIds);
}
