<%@ page language="java" contentType="text/html; charset=UTF-8"
	  pageEncoding="UTF-8" isErrorPage="true"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="com.baidu.ueditor.ActionEnter"%>
<%@page import="com.alibaba.fastjson.JSONObject"%>
<%

    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");

	String rootPath = application.getRealPath( "/" );
  try{
	ActionEnter a = new ActionEnter(request,rootPath);
		out.write(a.exec());

	}catch(java.lang.Throwable t){
     out.write("E"+t.getMessage());
	}



%>
