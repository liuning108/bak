define([], function() {
    return {
        pmtemplate: function(data) {
            return fish.post("template/pmtemplate", data);
        },
        pmtemplatedel: function(data) {
			return fish.post("template/pmtemplatedel",data);
		},
        pmtemplateConfigInfoadd: function(data) {
            return fish.post("template/pmtemplateConfigInfoadd",data);
        },
        pmtemplateConfigInfoupdate: function(data) {
            return fish.post("template/pmtemplateConfigInfoupdate",data);
        },
        updateStatusInfoStart: function(data) {
            return fish.post("template/updateStatusInfoStart", data);
        },
        updateStatusInfoStop: function(data) {
            return fish.post("template/updateStatusInfoStop", data);
        },
        pmtemplateCPInfo: function(data) {
            return fish.post("template/pmtemplateCPInfo",data);
        },
        pmtemplateMacroInfo: function(data) {
            return fish.post("template/pmtemplateMacroInfo",data);
        },
        pmtemplateIconInfo: function(data) {
            return fish.post("template/pmtemplateIconInfo",data);
        },
        pmcpSchemeInfo: function(data) {
            return fish.post("template/pmcpSchemeInfo",data);
        },
        getParamvalueInfo: function(data) {
            return fish.get("param/getParamvalueInfo?paraIds="+data);
        },
        pmIsDeleteCheckPoint: function(data) {
            return fish.post("template/pmIsDeleteCheckPoint",data);
        }
    }
})