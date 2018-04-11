/**
 * [Portal管理相关的和后台交互的代码]
 * @author [wang.hui]
 */
define(["webroot"],function(webroot) {
	return {
		qryPortalList: function(success) {
			fish.get("portals", success,webroot);
		},
		qryPortalIndexList: function(success) {
			fish.get("portals/portalIndexs", success,webroot);
		},
		delPortal: function(portalId, success) {
			fish.remove("portals/" + portalId, success,webroot);
		},
		addPortal: function(portalData, success) {
			fish.post("portals", portalData, success,webroot);
		},
		editPortal: function(portalData, success) {
			fish.put("portals", portalData, success,webroot);
		},
		qryDirMenuListByPortalId: function(portalId, success) {
			fish.get("portals/"+portalId+"/dirmenus", success,webroot);
		},
		addDirMenuToPortal: function(portalId, partyList, success) {
			fish.post("portals/"+portalId+"/dirmenus" , partyList, success,webroot);
		},
		delDirMenuFromPortal: function(portalId, partyId, seq, success) {
			fish.remove("portals/"+portalId+"/dirmenus/"+partyId+"/"+seq, success,webroot);
		},
		modPortalMenuSeq: function(portalID, portalDirMenuList, success) {
			fish.put("portals/"+portalID+"/dirmenus/seq", portalDirMenuList, success,webroot);
		}
	}
});