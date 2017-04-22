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
    swipePanel: "left"
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});
var devicePlatform

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    devicePlatform = device.platform;
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
var tagInptFiles = $$("#inputfile")

var imageUrl = "http://zotime.ddns.net/pd/img/gates.jpg",
    loadedPicNames = []
var myPhotoBrowserDark = myApp.photoBrowser({
    theme: 'dark',
    photos: [{
            html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/92ISlO9U-84" style="height: 70%" frameborder="0" allowfullscreen></iframe>',
            caption: 'zotime :)'
        },
        'http://lorempixel.com/1024/1024/sports/1/',
        {
            url: imageUrl,
            caption: 'Sauce!'
        },
        'http://lorempixel.com/1024/1024/sports/2/',
        {
            url: imageUrl,
            caption: 'Sauce!'
        },
        {
            url: imageUrl,
            caption: 'Sauce!'
        },
        'http://lorempixel.com/1024/1024/sports/3/',
        {
            url: imageUrl,
            caption: 'Sauce!'
        }, {
            url: imageUrl,
            caption: 'Sauce!'
        },
        {
            url: imageUrl,
            caption: 'Sauce!'
        },
    ]
});

var count = 0;
var rowCount = -1;
var ROW_ID;
var COL_COUNT = 3;
var ALBUM = "none";
var albumPickerList = ['uploads', 'Dali', 'Family Reunion 2018'];
var myPicker = myApp.picker({
    input: '#picker-device',
    toolbarTemplate: '<div class="toolbar theme-teal">' +
        '<div class="toolbar-inner">' +
        '<div class="right">' +
        '<a href="#" class="link close-picker">Done</a>' +
        '</div>' +
        '</div>' +
        '</div>',
    cols: [{
        textAlign: 'center',
        values: albumPickerList
    }],
    onClose: function (picker) {
        if (picker.cols[0].value != ALBUM) {
            fillPhotoGrid(picker.cols[0].value)
        }
        goToAlbumPg()
    }
});

// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');

ptrContent.on('ptr:refresh', function(e){
    fillPhotoGrid(ALBUM);
    // When loading done, we need to reset it
    myApp.pullToRefreshDone();
});

function addToPicker(album_name) {
    albumPickerList.push(album_name)
    ALBUM = album_name
    myApp.pullToRefreshTrigger(ptrContent)
    myPicker.setValue(albumPickerList, 0)
    $$("#picker-device")[0].value = album_name
    goToAlbumPg()
}

function addAlbum() {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0) {
            addToPicker(value)
        }
    });
}