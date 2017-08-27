[
    "js/my-app.js",

    "js/UTL-media.js",
    "js/UTL-network.js",
    "js/UTL-ui.js",

    "js/user.js",
    "js/home.js",
    "js/login.js",
    "js/sign-up.js",
    "js/album.js",
    "js/friends.js",
    "js/edit-profile.js",
    "js/user-profile.js",
    "js/user-search.js",
    
    
].forEach(function(element) {
    loadScripts(element)
});

function loadScripts(scriptPath) {
    var script = document.createElement("script")
    script.type = "text/javascript"
    script.src = scriptPath
    // console.log(scriptPath)
    $$('body').append(script)
}