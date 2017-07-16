var test = true;
// Initialize app
var myApp = new Framework7({
    material: true, //enable Material theme
    materialPageLoadDelay: 250,
    uniqueHistory: true,
    precompileTemplates: true,
    tapHold: true
});

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});

var devicePlatform;
// var GATES_IMG_URL = "http://zotime.ddns.net/ProfPic.php"
var APP_BASE_URL = test?"http://localhost:8000/":"http://zotime.ddns.net/_PD/";
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

var signup_const = {
    email: {
        presence: {message: "is required"},
        email: true
    },
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

myApp.onPageInit('login', function(){
    $$('#login_link').on('click', function(){
        var formData = myApp.formToData('#login_form')
        var errors = validate(formData, login_const)
        if(!errors){
            // console.log(formData)
            login(formData.username, formData.password)
        }
        else{
            myApp.alert(JSON.stringify(errors), "Login errors");
        }
    });
})

myApp.onPageInit('signup', function(){
    $$('#signup_link').on('click', function(){
        var formData = myApp.formToData('#signup_form')
        var errors = validate(formData, signup_const)
        if(!errors){
            createNewUser(USER_SERVICE, formData.username, formData.password, formData.email)
            // console.log(formData)
        }
        else{
            myApp.alert(JSON.stringify(errors), "Login errors");
        }
    });
})

myApp.onPageInit('album', function (page) {
    // Do something here for "about" page
    
})

myApp.onPageInit('edit-profile', function(page) {
    myApp.hidePreloader();
    myApp.showPreloader("Loading profile");
    getProfileInfo();
    $$('#update_link').on('click', function(){
        myApp.hidePreloader();
        myApp.showPreloader("Updating profile");
        var formData = myApp.formToData('#profile_form')
        var errors = validate(formData, signup_const)
        if(!errors){
            console.log(formData)
            updtUserProf(formData)
            // updateProfile()
        }
        else{
            myApp.hidePreloader();
            myApp.alert(JSON.stringify(errors), "Update errors");
        }
    });
})

myApp.onPageReinit('user-profile', profileStart)
myApp.onPageInit('user-profile', profileStart)

var mySearchbar = myApp.searchbar('.searchbar', {
    customSearch:true,
    onSearch: function(s){
        search4Handle(s)
    }
});

var friendSearchBar = myApp.searchbar('#friend-searchbar', {
    searchList: '#friends-list-block',
    searchIn: '.friend-name'
});

myApp.onPageInit('friends', loadFriends)
myApp.onPageReinit('friends', loadFriends)

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
