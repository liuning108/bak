define([
    "oss_core/inms/pm/graphs/components/gLibs/GLine.js",
    "oss_core/inms/pm/graphs/components/gLibs/GArea.js",
    "oss_core/inms/pm/graphs/components/gLibs/GError.js",
], function(GLine,GArea,GError) {
  var typeMap={
    "1":GLine,
    "4":GArea,
  }
  var GCharts = {}
  GCharts.init =function(el,config){
       console.log("GCharts",config);
       var G = GCharts.type(config.gtype);
       return new G({
          el: el,
          "config":config
       })
   }
  GCharts.type=function(type){
     return typeMap[""+type]||GError
  }
  return GCharts;
});
