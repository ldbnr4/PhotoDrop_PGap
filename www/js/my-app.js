// Initialize app
var myApp = new Framework7({
    material: true, //enable Material theme
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
    materialPageLoadDelay: 250,
    uniqueHistory: true,
    precompileTemplates: true
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});

var devicePlatform;
var APP_BASE_URL = "http://zotime.ddns.net/_PD/";
var APP_BASE_FILE_URL = APP_BASE_URL+"photoUpload.php";
var APP_NEW_FILE_URL = APP_BASE_URL+"photoUploadNEW.php";
var ALBUM = "none";
var myPhotoBrowser = myApp.photoBrowser({
    theme: 'dark'
});
var albumPhotos = [];  
var _salt = randomString(17);
var _password = "password";
var USER = {
    _id: "joeSmoe",
    password: encryptPswd(_password, _salt),
    salt : _salt,
    albums : [],
    urn_albums : []
}

USER_SERVICE = APP_BASE_URL+"UserService.php"   

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    devicePlatform = device.platform;
    fillAlbumLists();
});

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

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