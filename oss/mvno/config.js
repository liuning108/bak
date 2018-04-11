define([
	"mvno/modules/mvnomgr/actions/MvnoAction",
	"frm/portal/Portal"], function (MvnoAction) {
    	var currentSpId = "";
		portal.appEvent.onFrameReady(initMvnoHead);
	      function initMvnoHead($def){
	    	  var that = this;
	    	  MvnoAction.qryCurrentUserSpList(function (data) {
	    		  LoadSpList(data);
	    		 
	    	  });
	    	  
	    	 
	    	
	    	  $def.resolve();
	      } 
	      
	      function  LoadSpList(data) {
	    	  var that = this;
	    	  that.$("#mvnoDropdown").hide();
	    	  if(data!=null && data.SP_LIST.length > 1){
	    			 that.$("#getProfile").after( "<li id='mvnoDropdown' style='display:none'>" +
		    			 		"<span class='iconfont icon-directory-mgr portal__nav_icon' data-toggle='dropdown'>" +
		    			 			"<span class='caret'></span>" +
		    			 		"</span>" +
		    			 	"<ul class='dropdown-menu portal-menu MVNOMenu portal-menu-scrollbar' role='menu'></ul>" +
		    			 	"</li>");
	    			 currentSpId = data.CURRENT_SP;
	    			 for (var i = 0; i < data.SP_LIST.length; i++) {
	    				 	var mvnoObj =  data.SP_LIST[i];
	                        if (currentSpId == mvnoObj.spId) {
	                            that.$(".MVNOMenu").append("<li class='portal-menu__item active'>" +
	                                "<a href='javascript:void 0' data-id='"+mvnoObj.spId+"'> "+mvnoObj.spName+"</a>" +
	                                "</li>");
	                        }
	                        else {
	                            that.$(".MVNOMenu").append("<li class=" + "portal-menu__item" + ">" +
	                                "<a href='javascript:void 0' data-id='"+mvnoObj.spId+"' >"+mvnoObj.spName+" test</a>" +
	                                "</li>");
	                        }
	                   }                   
	                    that.$("#mvnoDropdown").show();
	                    that.$(".MVNOMenu > li").on('click',function(e){
	  	    			  var _spId = $(e.target).data("id");
	  	    			  setSpId(_spId);
	  	    		  });
	                    
	    	}
	      }
	      
	      function setSpId(spId) {
            if (spId !== currentSpId) {
            	MvnoAction.setCurentSpId(spId,function (data) {
            		window.location.reload();
  	    	  });
               
            }
	    	  
	      }
	        

});
