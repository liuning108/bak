define(function() {
	function getWebRootPath() {
		var webroot = document.location.href;
		webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
		webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
		webroot = webroot.substring(0, webroot.indexOf('/'));
		var rootpath = webroot.length<=0 ? "" :  "/" + webroot;
		return rootpath;
	};
	var AppGlobal = fish.Model.extend({
		defaults: {
			currentStatus: "", //当前的状态
				//login表示登录状态
				//logged表示登录成功调跳转到主页，
				//running表示已经登录并且session没有过期，
				//sessionTimeOut表示session过期，
				//beenKickedFromLogin表示从登录状态踢出
			defaultLanguage: "en", //默认的语言,未使用到
			shortLanguage: "en", //默认的是英语,系统语言,从后台返回
			language: "en", //默认是英语,未使用到
			charset: "UTF-8", //默认编码,未使用到
			webroot: getWebRootPath(), //项目应用的路径,未使用到
			version: "V9.0.11", //默认的版本信息,
			leftMenu : false, //是否使用左侧菜单的方式显示
			defaultPortal: null, //默认的portal信息
			portalId: null, //当前的portalId信息
			currentMenu: null, //当前的菜单,
			userId: null,//当前用户
			deployMode:"prod", //发布模式,如果配置的是dev,则禁用requirejs的缓存 #583
			origin: {}, //基本没用到,待确认
			spId: null, //当前的spId
			staffId: null, //当前员工ID
			staffName: null, // 当前员工名称
			staffJobId: null, //当前员工的staffJobId
			jobId: null, // 当前员工选择的staffJob对应的职位ID
			orgId: null, // 当前员工选择的staffJob对应的组织ID
			orgName: null, // 当前员工选择的staffJob对应的组织名称
			areaName: null, // 当前员工选择的staffJob对应的区域名称
			areaId: null, // 当前员工选择的staffJob对应的区域ID
			businessDef: null, // 业务侧deferred对象，用于门户对业务侧异步操作的等待
			_csrf: "",
			_csrf_header: ""
		}
	});
	return new AppGlobal(); //单例
});