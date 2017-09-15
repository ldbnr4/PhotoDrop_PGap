[
    "cordova.js",

    "lib/validate.min.js",
    "lib/masonry.pkgd.min.js",
    "lib/load-image.all.min.js",
    
    "lib/helper_funcs.js",
    "lib/md5.js",

    "js/my-app.js",

    "js/UTL-media.js",
    "js/UTL-network.js",

    "js/user.js",
    "js/home.js",
    "js/login.js",
    "js/sign-up.js",
    "js/album.js",
    "js/friends.js",
    "js/edit-profile.js",
    "js/user-profile.js",
    "js/user-search.js",
    
    
].forEach(function(scriptPath) {
    var script = document.createElement("script")
    script.type = "text/javascript"
    script.src = scriptPath
    // console.log(scriptPath)
    $$('body').append(script)
});