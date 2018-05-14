define(function() {
	var action={};
	action.service="MPM_KNOWLEDGE_MANAGE_SERVICE";

	action.getRootTree=function(success) {
		var param={};
		param.method="getRootTree"
		portal.callService(this.service,param, success);
	}

	action.getTreeUpAndDown=function(id,pid,success) {
		var param={};
		param.method="getTreeUpAndDown"
		param.id=id;
		param.pid=pid;
		portal.callService(this.service,param, success);
	}

	action.getFilterResult=function(id,sNo,bNo,success){
		var param={};
    param.method="getFilterResult"
		param.id=id;
		param.sNo=sNo;
		param.bNo=bNo;
		portal.callService(this.service,param, success)
	}

	action.getDocOpers=function(success){
		var param = {}
		param.method = "getDocOpers"
		portal.callService(this.service,param,success);
	}

	action.getIndexDoclist=function(json,success){
		var param=json;
		param.method = "getIndexDoclist"
		portal.callService(this.service,param,success);
	}

	action.queryDocList=function(json,success){
		var param=json;
		param.method = "queryDocList"
		portal.callService(this.service,param,success);
	}

	action.saveOrUpdate=function(json,success) {
		var param=json;
		param.method = "saveOrUpdate"
		portal.callService(this.service,param,success);
	}
	action.queryKnowLedge=function(json,success){
		var param=json;
		param.method = "queryKnowLedge"
		portal.callService(this.service,param,success);
	}

	action.delKnowLedge=function(json,success){
		var param=json;
		param.method = "delKnowLedge"
		portal.callService(this.service,param,success);
	}

	action.queryLikeTags=function(json,success){
		var param=json;
		param.method = "queryLikeTags"
		portal.callService(this.service,param,success);
	}

	action.queryAttrValues=function(json,success){
		var param=json;
		param.method = "queryAttrValues"
		portal.callService(this.service,param,success);
	}

	action.updownVote=function(json,success){
		var param=json;
		param.method = "updownVote"
		portal.callService(this.service,param,success);
	}

	action.addComment=function(json,success){
		var param=json;
		param.method = "addComment"
		portal.callService(this.service,param,success);
	}

	action.queryComments=function(json,success){
		var param=json;
		param.method = "queryComments"
		portal.callService(this.service,param,success);
	}

	action.delComments=function(json,success){
		var param=json;
		param.method = "delComments"
		portal.callService(this.service,param,success);
	}

	action.addAttach=function(json,success){
		var param=json;
		param.method = "addAttach"
		portal.callService(this.service,param,success);
	}

	action.delAttachById=function(json,success){
		var param=json;
		param.method = "delAttachById"
		portal.callService(this.service,param,success);
	}

	action.queryAttachByDocId=function(json,success){
		var param=json;
		param.method = "queryAttachByDocId"
		portal.callService(this.service,param,success);
	}


	action.querySolrByKey=function(json,success){
    var param=json;
		param.method = "querySolrByKey"
		portal.callService(this.service,param,success);
	}





	return action;
});
