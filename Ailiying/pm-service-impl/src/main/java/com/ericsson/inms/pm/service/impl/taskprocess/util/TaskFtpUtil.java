package com.ericsson.inms.pm.service.impl.taskprocess.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Properties;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.taskprocess.TaskProcessServiceImpl;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

public class TaskFtpUtil {

	private static OpbLogger logger = OpbLogger.getLogger(TaskFtpUtil.class, "PM");

	public static String saveFTP(JSONObject dict) {
		logger.info("USE FTP");
		try {
			String filePath = dict.getString("filePath");
			File sourceFile = new File(filePath);
			JSONObject ftpInfo = dict.getJSONObject("ftpInfo");
			logger.info("saveFTP ftpInfo:" + ftpInfo);
			logger.info("saveFTP sourceFile:" + sourceFile);
			FTPClient client = TaskFtpUtil.getClient(ftpInfo);
			logger.info("saveFTP client Obj:" + client);
			if (client == null) {
				logger.info("saveFTP Client is null");
				return null;
			}
			String filepath = TaskFtpUtil.sendFTP(client, sourceFile, ftpInfo);
			client.logout();
			return filepath;
		} catch (Exception e) {
			return null;
		}
	}

	public static FTPClient getClient(JSONObject ftpInfo) {
		try {
			logger.info("GET FTP Client");
			FTPClient client = new FTPClient();
			client.connect(ftpInfo.getString("ip"), Integer.parseInt(ftpInfo.getString("port")));
			Boolean isLogin = client.login(ftpInfo.getString("user"), ftpInfo.getString("pass"));
			if (isLogin) {
				logger.info("GET FTP Client:" + client);
				return client;
			} else {
				logger.info("GET FTP is NULL");
				return null;
			}

		} catch (Exception e) {
			logger.info("GET FTP Client Error:" + e.getMessage());
			return null;
		}

	}

	public static String saveSFTP(JSONObject dict) {
		logger.info("USE SFTP");
		try {
			String filePath = dict.getString("filePath");
			File sourceFile = new File(filePath);
			JSONObject ftpInfo = dict.getJSONObject("ftpInfo");
			logger.info("saveSFTP ftpInfo:" + ftpInfo);
			logger.info("saveSFTP sourceFile:" + sourceFile);
			ChannelSftp client = TaskFtpUtil.getSFTPClient(ftpInfo);
			logger.info("saveSFTP client:" + client);
			if (client == null) {
				return null;
			}
			String filepath = TaskFtpUtil.sendSFTP(client, sourceFile, ftpInfo);
			logger.info("saveSFTP filepath:" + filepath);
			client.exit();
			return filepath;
		} catch (Exception e) {
			logger.info("saveSFTP Error" + e.getMessage());
			return null;
		}
	}

	private static String sendFTP(FTPClient client, File sourceFile, JSONObject ftpInfo) {
		try {
			logger.info("sendFTP Begin");
			logger.info("sourceFile:" + sourceFile);
			logger.info("ftpInfo:" + ftpInfo);
			String name = sourceFile.getName();
			String FtpDir = "pm_expdata_ftp";
			boolean makdirFlag = client.makeDirectory(FtpDir);
			Boolean flag = client.changeWorkingDirectory(FtpDir);
			String path = client.printWorkingDirectory();
			client.enterLocalPassiveMode();
			client.setFileType(FTP.BINARY_FILE_TYPE);
			InputStream instream = new BufferedInputStream(new FileInputStream(sourceFile));
			boolean result = client.storeFile(name, instream);
			logger.info("sendFTP End");
			if (result) {
				if (lastString(path, "/")) {
					return path.substring(0, path.length() - 1) + "/" + name;
				} else {
					return path + "/" + name;
				}

			} else {
				return null;
			}

		} catch (Exception e) {
			logger.info("sendFTP Error" + e.getMessage());
			return null;
		}
	}

	private static String sendSFTP(ChannelSftp client, File sourceFile, JSONObject ftpInfo) {
		logger.info("sendSFTP Begin");
		logger.info("sourceFile:" + sourceFile);
		logger.info("ftpInfo:" + ftpInfo);
		String name = sourceFile.getName();
		String FtpDir = "pm_expdata_ftp";
		try {
			try {
				client.mkdir(FtpDir);
			} catch (Exception e) {
				// logger.info("mkdir may be exist:"+e.getMessage());
			}
			client.cd(FtpDir);
			String path = client.pwd();
			// logger.info("send SFTP path:"+path);
			client.put(new FileInputStream(sourceFile), name);
			logger.info("sendSFTP END");
			if (lastString(path, "/")) {
				return path.substring(0, path.length() - 1) + "/" + name;
			} else {
				return path + "/" + name;
			}

		} catch (Exception e) {
			logger.info("sendSFTP Error:" + e.getMessage());
			e.printStackTrace();
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

	public static ChannelSftp getSFTPClient(JSONObject ftpInfo) {
		// TODO Auto-generated method stub
		logger.info("getSFTPClient Begin" + ftpInfo);
		ChannelSftp sftp = null;
		JSch jsch = new JSch();
		String username = ftpInfo.getString("user");
		String host = ftpInfo.getString("ip");
		int port = Integer.parseInt(ftpInfo.getString("port"));
		String pass = ftpInfo.getString("pass");
		try {
			Session sshSession = jsch.getSession(username, host, port);
			sshSession.setPassword(pass);
			Properties sshConfig = new Properties();
			sshConfig.put("StrictHostKeyChecking", "no");
			sshSession.setConfig(sshConfig);
			sshSession.connect(10000);
			if (!sshSession.isConnected()) {
				return null;
			}
			Channel channel = sshSession.openChannel("sftp");
			channel.connect();
			sftp = (ChannelSftp) channel;
			logger.info("getSFTPClient End");
			return sftp;
		} catch (Exception e) {
			logger.info("getSFTPClient Error" + e.getMessage());
			return null;
		}
	}

	public static String getFilePath(String path, String name) {
		if (lastString(path, "/")) {
			return path.substring(0, path.length() - 1) + "/" + name;
		} else {
			return path + "/" + name;
		}
	}

	public static File getSFTPFile(ChannelSftp client, String remoteFile, String tagetFile) {
		logger.info("getSFTPClient Begin");
		File target = new File(tagetFile);
		File remote = new File(remoteFile);
		try {
			client.cd(remote.getParent());
			client.get(remote.getName(), new FileOutputStream(target));
			logger.info("getSFTPFile End");
			return target;
		} catch (Exception e) {
			logger.info("getSFTPFile Error" + e.getMessage());
			return null;

		}

	}

	public static File getFTPFile(FTPClient client, String remoteFile, String tagetFile) {
		// TODO Auto-generated method stub
		try {
			File target = new File(tagetFile);
			FileOutputStream fos = new FileOutputStream(target);
			String FtpDir = "pm_expdata_ftp";
			boolean makdirFlag = client.makeDirectory(FtpDir);
			Boolean changeFlag = client.changeWorkingDirectory(FtpDir);
			String path = client.printWorkingDirectory();
			client.enterLocalPassiveMode();
			client.setBufferSize(1024);
			client.setFileType(FTPClient.BINARY_FILE_TYPE);
			boolean flag = client.retrieveFile(remoteFile, fos);

			System.err.println("getFTPFile" + flag);
			if (flag) {
				return target;
			} else {
				return null;
			}
		} catch (Exception e) {
			return null;
		}

	}

	public static void delFTPfiles(JSONArray datas, JSONObject ftpInfo) {
		// TODO Auto-generated method stub
		try {
			FTPClient client = TaskFtpUtil.getClient(ftpInfo);
			String FtpDir = "pm_expdata_ftp";
			boolean makdirFlag = client.makeDirectory(FtpDir);
			Boolean changeFlag = client.changeWorkingDirectory(FtpDir);
			String path = client.printWorkingDirectory();
			client.enterLocalPassiveMode();
			client.setBufferSize(1024);
			client.setFileType(FTPClient.BINARY_FILE_TYPE);
			for (int i = 0; i < datas.size(); i++) {
				JSONObject item = datas.getJSONObject(i);
				String pathfile = item.getString("PATH");
				if (pathfile != null) {
					boolean isDel = client.deleteFile(pathfile);
					logger.info("Delete File" + pathfile + "[" + isDel + "]");
				}

			}
			client.logout();
		} catch (Exception e) {
			logger.info("delFTPfiles Error" + e.getMessage());
		}
	}

	public static void delSFTPfiles(JSONArray datas, JSONObject ftpInfo) {
		// TODO Auto-generated method stub
		ChannelSftp client = TaskFtpUtil.getSFTPClient(ftpInfo);
		try {
			for (int i = 0; i < datas.size(); i++) {
				JSONObject item = datas.getJSONObject(i);
				String pathfile = item.getString("PATH");
				if (pathfile != null) {
					
					try {
						client.rm(pathfile);
						logger.info("Delete File" + pathfile+" [ture] ");
					} catch (Exception e) {
						logger.info("Delete File" + pathfile+" [false] "+" "+e.getMessage());
					}
				}

			}

		} catch (Exception e) {
			logger.info("delSFTPfiles Error" + e.getMessage());
		}

	}

}
