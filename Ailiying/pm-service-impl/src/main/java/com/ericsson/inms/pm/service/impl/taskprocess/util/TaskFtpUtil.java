package com.ericsson.inms.pm.service.impl.taskprocess.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Properties;

import com.alibaba.fastjson.JSONObject;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class TaskFtpUtil {

	public static String saveFTP(JSONObject dict) {
		return null;
	}

	public static String saveSFTP(JSONObject dict) {
		try {
			String filePath = dict.getString("filePath");
			File sourceFile = new File(filePath);
			JSONObject ftpInfo = dict.getJSONObject("ftpInfo");
			System.err.println("saveSFTP ftpInfo:" + ftpInfo);
			System.err.println("saveSFTP sourceFile:" + sourceFile);
			ChannelSftp client = TaskFtpUtil.getSFTPClient(ftpInfo);
			System.err.println("saveSFTP client:" + client);
			if (client == null) {
				return null;
			}
			String filepath = TaskFtpUtil.sendSFTP(client, sourceFile, ftpInfo);
			System.err.println("saveSFTP filepath:" + filepath);
			return filepath;
		} catch (Exception e) {
			return null;
		}
	}

	private static String sendSFTP(ChannelSftp client, File sourceFile, JSONObject ftpInfo) {
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
			if (lastString(path, "/")) {
				return path.substring(0, path.length() - 1) + "/" + name;
			} else {
				return path + "/" + name;
			}
		} catch (Exception e) {
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
			return sftp;
		} catch (Exception e) {
			e.printStackTrace();
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
		File target = new File(tagetFile);
		File remote = new File(remoteFile);
		try {
			client.cd(remote.getParent());
			client.get(remote.getName(), new FileOutputStream(target));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return target;
	}

}
