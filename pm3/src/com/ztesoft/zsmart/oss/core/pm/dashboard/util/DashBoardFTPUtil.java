package com.ztesoft.zsmart.oss.core.pm.dashboard.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.log4j.Logger;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.SftpException;
import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.pm.dashboard.dao.DashBoardMgrDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

public class DashBoardFTPUtil {
	/**
	 * 日志记录者
	 */
	private static Logger logger = Logger.getLogger(DashBoardFTPUtil.class);

	public static void main(String[] args) throws Exception {
		try {
			Map<String, String> ftpInfo = getFtpInfo();
			FTPClient client = DashBoardFTPUtil.getClient(ftpInfo);
			if (client == null) {
				System.err.println("Client is null");
			}
			File target= DashBoardFTPUtil.getFTPFile(client, "/home/oss_pm/ossftp/json.text","/Users/liuning/testftp.txt");
			System.out.println(target);
		} catch (Exception e) {
			logger.info("saveFTP:"+e.getMessage());
		}
	}

	private static File getFTPFile(FTPClient client, String remoteFile, String tagetFile) throws Exception {
		// TODO Auto-generated method stub
		  File target =new File(tagetFile);
		  FileOutputStream fos = new FileOutputStream(target);
		  client.setBufferSize(1024);
		  client.setFileType(FTPClient.BINARY_FILE_TYPE);
		  boolean flag =client.retrieveFile(remoteFile, fos);
		  if(flag) {
			  return target;
		  }else {
			  return null;
		  }
	}

	public static FTPClient getClient(Map<String, String> ftpInfo) throws Exception {

		FTPClient client = new FTPClient();
		client.connect(ftpInfo.get("ip"), Integer.parseInt(ftpInfo.get("port")));
		Boolean isLogin = client.login(ftpInfo.get("user"), ftpInfo.get("pass"));
		if (isLogin) {
			return client;
		} else {
			return null;
		}
	}
	
	private static ChannelSftp getSFTPClient(Map<String, String> ftpInfo) {
        // TODO Auto-generated method stub
        ChannelSftp sftp = null;
        JSch jsch = new JSch();
        String username = ftpInfo.get("user");
        String host = ftpInfo.get("ip");
        int port = Integer.parseInt(ftpInfo.get("port"));
        String pass =ftpInfo.get("pass");
        try {
            com.jcraft.jsch.Session sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(pass);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            Channel channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp) channel;
            return sftp;
        } catch (Exception e) {
            logger.info("saveSFTP:"+e.getMessage());
            e.printStackTrace();
            return null;
        }
    
    }

	public static String sendFTP(FTPClient client, File sourceFile, Map<String, String> ftpInfo)
			throws SocketException, IOException {
		// TODO Auto-generated method stub
		String path = ftpInfo.get("path");
		String name = sourceFile.getName();
		Boolean flag = client.changeWorkingDirectory(path);
		InputStream instream = new BufferedInputStream(new FileInputStream(sourceFile));
		boolean result = client.storeFile(name, instream);

		client.disconnect();
		if (result) {
			if (lastString(path, "/")) {
				return path.substring(0, path.length() - 1) + "/" + name;
			} else {
				return path + "/" + name;
			}

		} else {
			return null;
		}
	}

	private static boolean lastString(String path, String c) {
		// TODO Auto-generated method stub
		String last = "" + path.charAt(path.length() - 1);
		if (c.equalsIgnoreCase(last)) {
			return true;
		}
		return false;
	}

	private static Map<String, String> getFtpInfo() throws BaseAppException {
		// TODO Auto-generated method stub
		Map<String, String> ftpInfo = new HashMap<String, String>();
		String ftpUrl =getParamter("ftpUrl");
		String path =getParamter("ftpDir");
		Pattern p = Pattern.compile("&(\\b\\w+)=(.*?(?=\\s\\w+=|&(\\b\\w+)=|$))");
		
		Matcher m = p.matcher("&" + ftpUrl);
		while (m.find()) {
			;
			ftpInfo.put(m.group(1), m.group(2));
		}
		logger.info("ftpinfo:" + ftpInfo);
		ftpInfo.put("path", path);

		return ftpInfo;
	}
	
	public static String getParamter(String key) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
		return dao.getParamter(key);
	}

	public static String saveFTP(String excelFile) {
		try {
			File sourceFile = new File(excelFile);
			Map<String, String> ftpInfo = getFtpInfo();
			FTPClient client = DashBoardFTPUtil.getClient(ftpInfo);
			if (client == null) {
				System.err.println("Client is null");
				return null;
			}
			String filepath = DashBoardFTPUtil.sendFTP(client, sourceFile, ftpInfo);
			return filepath;
		} catch (Exception e) {
			logger.info("saveFTP:"+e.getMessage());
			return null;
		}

	}

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param target
     * @return <br>
     */ 
    public static File downlaodFtpFile(File source) {
        try {
            logger.info("downlaodFtpFile");
            Map<String, String> ftpInfo = getFtpInfo();
            FTPClient client = DashBoardFTPUtil.getClient(ftpInfo);
            if (client == null) {
                System.err.println("Client is null");
            } 
            String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
           String fileName =source.getName();
            String ftpFile=source.getAbsolutePath();
            String locaFile =getFilePath(fileDirectory,fileName);
            logger.info("fileName:"+fileName);
            logger.info("ftpFile:"+ftpFile);
            logger.info("locaFile:"+locaFile);
            File target= DashBoardFTPUtil.getFTPFile(client, ftpFile,locaFile);
            System.out.println(target);
            return target;
        } catch (Exception e) {
            logger.info("saveFTP:"+e.getMessage());
            return null;
        }
     
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param string
     * @param name
     * @return <br>
     */ 
    private static String getFilePath(String path, String name) {
            if (lastString(path, "/")) {
                return path.substring(0, path.length() - 1) + "/" + name;
            } else {
                return path + "/" + name;
            }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param target
     * @return <br>
     */ 
    public static File downlaodSFtpFile(File source) {
        try {
            logger.info("downlaod SFtp File");
            Map<String, String> ftpInfo = getFtpInfo();
            ChannelSftp client = DashBoardFTPUtil.getSFTPClient(ftpInfo);
            if (client == null) {
                System.err.println("Client is null");
            } 
            String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
           String fileName =source.getName();
            String ftpFile= source.getAbsolutePath();
            String locaFile =getFilePath(fileDirectory,fileName);
            logger.info("fileName:"+fileName);
            logger.info("ftpFile:"+ftpFile);
            logger.info("locaFile:"+locaFile);
            File target= DashBoardFTPUtil.getSFTPFile(client, ftpFile,locaFile);
            System.out.println(target);
            return target;
        } catch (Exception e) {
            logger.info("saveFTP:"+e.getMessage());
            return null;
        }
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param client
     * @param string
     * @param string2
     * @return <br>
     */ 
    private static File getSFTPFile(ChannelSftp client,  String remoteFile, String tagetFile) {
        File target =new File(tagetFile);
        
        
        File remote=new File (remoteFile);
        try {
            client.cd(remote.getParent());
            client.get(remote.getName(), new FileOutputStream(target));
        }
        catch (Exception e) {
            logger.info("get SFTP File ERROR:"+e.getMessage());
            e.printStackTrace();
        }
    
        return target;
    }
}
