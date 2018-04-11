/**
 * 前端项目的配置，每个项目需要修改此文件，主要配置包括压缩的css路径，自定义文件等等
 * baseUrl设置为static兼容旧的项目,用不到static路径的话，baseUrl配置项不需要
 */

require.config({
	baseUrl:"static",
	urlArgs: "v=9.1.0",
	deps : [ 'main'],
	waitSeconds : 0
});