var test = true;
// Initialize app
const myApp = new Framework7({
    material: true, //enable Material theme
    materialPageLoadDelay: 250,
    uniqueHistory: true,
    precompileTemplates: true,
    tapHold: true
});

// Add view
const mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});

var devicePlatform;
// var GATES_IMG_URL = "http://zotime.ddns.net/ProfPic.php"
var APP_BASE_URL = test?"http://www.localhost:8000/":"http://zotime.ddns.net/_PD/";
var APP_BASE_FILE_URL = APP_BASE_URL+"photoUpload.php";
var APP_NEW_FILE_URL = APP_BASE_URL+"photoUploadNEW.php";
var myPhotoBrowser = myApp.photoBrowser({
    theme: 'dark'
});
var ALBUM = {};
var albumPhotos = [];
var USER;

USER_SERVICE = APP_BASE_URL+"UserService.php"
PHOTO_SERVICE = APP_BASE_URL+"PhotoService.php"

var login_const = {
    username: {
        presence: {message: "is required"}
    },
    password: {
        presence: {message: "is required"}
    }
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    devicePlatform = device.platform;
    // checkNsignin(USER.username)
});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})