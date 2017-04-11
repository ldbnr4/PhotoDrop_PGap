// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    material: true //enable Material theme
});

var imageUrl = "http://zotime.ddns.net/pd/upload/image1.jpg";
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");

});


// Now we need to run the code that will be executed only for About page.

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

function getImage() {
    navigator.camera.getPicture(uploadPhoto, function (message) {
        alert('get picture failed: ' + message);
        console.log(message)
    }, {
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true
    });
}

function takeImage() {
    navigator.camera.getPicture(uploadPhoto, function (message) {
        alert('get picture failed: ' + message);
        console.log(message)
    }, {
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        correctOrientation: true
    });
}

var myPhotoBrowserDark = myApp.photoBrowser({
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
        }, {
            url: imageUrl,
            caption: 'Sauce!'
        },
        {
            url: 'http://lorempixel.com/1024/1024/sports/3/'
        },
        {
            url: imageUrl,
            caption: 'Sauce!'
        }, {
            url: imageUrl,
            caption: 'Sauce!'
        }, {
            url: imageUrl,
            caption: 'Sauce!'
        },
    ],
    theme: 'dark'
});
$$('.pb-standalone-dark').on('click', function () {
    myPhotoBrowserDark.open();
});

var count = 0;
var rowCount = -1;
var ROW_ID = "#photoUploads" + rowCount;
var COL_COUNT = 3;
var physicalScreenWidth = window.screen.width;
var physicalScreenHeight = window.screen.height;
var ALBUM = "uploads"
var pickerDevice = myApp.picker({
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
        values: ['Family Reunion 2018', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
    }],
    onChange: function (picker, album) {
        ALBUM = album
    },
    onClose: function(picker){
        httpGetAsync("http://zotime.ddns.net/pd/photoUpload.php", function(resp){
            console.log(resp)
            alert(resp)
        })
    }
});

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl+"?album="+ALBUM, true); // true for asynchronous 
    xmlHttp.send(null);
}

function iGotTheSauce() {
    if (count % COL_COUNT == 0) {
        rowCount++;
        ROW_ID = "#photoUploads" + rowCount
        nextRow = document.createElement("div")
        nextRow.setAttribute("class", "row")
        nextRow.setAttribute("id", "photoUploads" + rowCount)
        nextRow.setAttribute("style", "min-height:100px; padding:5px; text-align:center;")
        $$("#inner-body").append(nextRow)

        for (i = 0; i < COL_COUNT; i++) {
            imgSlot = document.createElement("div")
            imgSlot.setAttribute("id", "div" + (count + i));
            imgSlot.setAttribute("class", "short-loder col-auto")
            //alert("ROW_ID: "+ROW_ID+" CONTAIN_ID: #div"+(count+i))
            $$(ROW_ID).append(imgSlot)
            placePic(count + i)

        }
        count += 3
    }
}

function placePic(num) {
    //console.log(physicalScreenWidth)
    loadImage(
        imageUrl,
        function (img) {
            if (img.type === "error") {
                console.log("Error loading image " + imageUrl);
            } else {
                //alert("CONTAIN_ID: " + "#div" + (num))
                img.setAttribute("style", "margin:auto;")
                //console.log(img)
                $$("#div" + (num)).append(img);
            }
        }, {
            maxWidth: physicalScreenWidth / 3.5,
            maxHeight: physicalScreenHeight / 3.5,
            crop: true
        }
    );
}

function uploadPhoto(imageURI) {
    console.log("Sending photo...")

    // alert("count = "+count+"\n"
    //     +   "rowCount = "+rowCount+"\n"
    //     +   
    // )
    if (count % 3 == 0) {
        rowCount++;
        ROW_ID = "#photoUploads" + rowCount
        nextRow = document.createElement("div")
        nextRow.setAttribute("class", "row")
        nextRow.setAttribute("id", "photoUploads" + rowCount)
        nextRow.setAttribute("style", "min-height:100px; padding:5px")
        $$("#inner-body").append(nextRow)

        for (i = 0; i < 3; i++) {
            imgSlot = document.createElement("div")
            imgSlot.setAttribute("id", "div" + (count + i));
            imgSlot.setAttribute("class", "short-loder col-auto")
            //alert("ROW_ID: " + ROW_ID + " CONTAIN_ID: #div" + (count + i))
            $$(ROW_ID).append(imgSlot)
        }
    }

    CONTAIN_ID = "#div" + count;
    count++

    loadImage(
        imageURI,
        function (img) {
            if (img.type === "error") {
                console.log("Error loading image " + imageURI);
            } else {
                //alert("CONTAIN_ID: " + CONTAIN_ID)
                $$(CONTAIN_ID).append(img);
            }
        }, {
            maxWidth: 150,
            maxHeight: 150
        }
    );

    var container = CONTAIN_ID
    myApp.showProgressbar(container, 0);
    var ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            if (progressEvent.loaded < 1) {
                myApp.setProgressbar(container, (progressEvent.loaded / progressEvent.total) * 100); //keep "loading"
            } else {
                myApp.hideProgressbar(container); //hide
                console.log("Photo sent!")
            }
        } else {
            //loadingStatus.increment();
            alert("DONE")
        }
    };

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.fileName = options.fileName.split("?")[0]
    alert(options.fileName);
    var params = new Object();
    params.album = ALBUM.toString();
    alert(ALBUM)
    params.value2 = "param";
    options.params = params;
    options.chunkedMode = false;
    ft.upload(imageURI, "http://zotime.ddns.net/pd/photoUpload.php", function (result) {
        console.log(JSON.stringify(result));
        alert(JSON.stringify(result))
    }, function (error) {
        console.log(JSON.stringify(error));
    }, options);
}