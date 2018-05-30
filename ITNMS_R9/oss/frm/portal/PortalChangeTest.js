/**
 * Portal门户的enter,leave事件示例，由于门户没有代码,需要配置门户的extraUrl来引用到这个文件
 * 在enter的时候加入了自定义的内容,离开门户的时候需要做一些清理还原的操作
 */
define(["frm/portal/Portal"],function() {

	portal.appEvent.onceFrameReady(function($def){
		console.log("portalenter, syn, do something initialize.");
		//在合适的地方执行$def.resovle(),继续流程
		$def.resolve();
	});

	portal.appEvent.onceFrameOff(function($def){
		console.log("portalleave, do something cleanup. ");
		$def.resolve();
	});

});
