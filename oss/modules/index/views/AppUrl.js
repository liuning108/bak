/**
 * 为webroot集成使用,后期考虑不使用App Management
 */
define(function() {
    return {
        addAppUrls: function(userAppList) {
            if (userAppList) {
                var projectUrls = [];
                fish.forEach(userAppList, function(app) {
                    projectUrls.push(app.appUrl);
                });
                require.config({
                    projectUrls: projectUrls
                });
            }
        }
    }
});

