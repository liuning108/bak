define([
    "oss_core/inms/pm/graphs/components/gLibs/GLine.js",
    "oss_core/inms/pm/graphs/components/gLibs/GArea.js",
    "oss_core/inms/pm/graphs/components/gLibs/GPie.js",
    "oss_core/inms/pm/graphs/components/gLibs/GPie2.js",
    "oss_core/inms/pm/graphs/components/gLibs/GBar.js",
    "oss_core/inms/pm/graphs/components/gLibs/GBar2.js",
    "oss_core/inms/pm/graphs/components/gLibs/GTable.js",
    "oss_core/inms/pm/graphs/components/gLibs/GError.js",
], function(GLine,GArea,GPie,GPie2,GBar,GBar2,GTable,GError) {
  var typeMap={
    "1":GLine,
    "2":GPie,
    "3":GPie2,
    "4":GArea,
    "5":GBar,
    "6":GBar2,
    "10":GTable,
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
