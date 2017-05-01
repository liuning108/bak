package com.liuning.until;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

public class FileUtil {

	public static void save (InputStream ins, File file){
		OutputStream os = null;
		 try {
		   os = new FileOutputStream(file);
		   int bytesRead = 0;
		   byte[] buffer = new byte[8192];
		   while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
		      os.write(buffer, 0, bytesRead);
		   }
		 }catch (Exception e){
			 e.printStackTrace();
		 }finally{
			 try {
			 if (os!=null)  os.close();
			 if (ins!=null)  ins.close();
			 }catch(Exception e){
				 
			 }
		 }
	 }

	public static String getUUIDFileName(String originalFilename) {
		String uuid = UUID.randomUUID().toString().replace("-","");
		String prefix=originalFilename.substring(originalFilename.lastIndexOf(".")+1);
		return uuid+"."+prefix;
	}
}
