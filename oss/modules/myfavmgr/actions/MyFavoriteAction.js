define(function() {
	return {
		qryUserFavMenuListByPortalId: function(portalId, success) {
			var url = "portals/" + portalId + "/user/favorites";
			return fish.get(url, success);
		},
		addFavoriteMenu: function(param, success) {
			fish.post("favorites", param , success);
		},
		delFavoriteMenu: function(favId, success) {
			fish.remove("favorites/"+favId, success);
		},
		modFavoriteMenu: function(param, success) {
			//TODO 多余的熟悉需要自己剔除嘛?
			fish.put("favorites", fish.pick(param,"menuFavId","seq","isDefaultOpen","alias"), success);
		},
		modFavoriteMenuSeq: function(menuList, success) {
			
//			menuList = fish.map(menuList,function(item,index){
//				return fish.pick(item,"menuFavId","seq","alias");
//			})
//			for(var i=0;i<menuList.length;i++){
//				menuList[i] = fish.pick(menuList[i],"menuFavId","seq","alias")
//			}
			//TODO 多余的熟悉需要自己剔除嘛?
			fish.put("favorites/seqs", menuList, success);
		}
	}
});