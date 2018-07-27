
##图形管理
主路径
oss_core/inms/pmgraphs/views/GraphsMainView


##Session
//        Long userId = PrincipalUtil.getPrincipal().getUserId();
//        dict.put("userId", userId);
Long userId = PrincipalUtil.getPrincipal().getUserId();
      String sessionId = "zabbixSessionId_" + userId;
      SessionRegistry sessionRegistry = SpringContext.getBean(SessionRegistry.class);
      SessionInformation sessionInformation = sessionRegistry.getSessionInformation(sessionId);
      Map<String, String> zabbixInfo = null;
      if (sessionInformation == null) {
          zabbixInfo = loginZabbix(userId);
          sessionRegistry.registerNewSession(sessionId, zabbixInfo);
          return zabbixInfo;
      }
      else {
          return (Map<String, String>) sessionInformation.getPrincipal();
      }
