
var boardItems={};
boardItems.init=function(data){
	//alert(data);
	$("#boardItem").tmpl(data).appendTo('#content');
    $(".boardItem").on("click",function(){
    	var id= $(this).data("id");
    	location.href="dashboard.html?id="+id;
    })
	$("#new").on("click",function(){
			location.href="dashboard.html?id=new"
	})
}

$(function(){
	
	$.ajax({
		  type: "get",
		  url: "rest/dashboard/all",
		  success: function(data){
			  boardItems.init(data);
		  },
		});
	
})