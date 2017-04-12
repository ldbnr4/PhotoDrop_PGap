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

var imageUrl = "http://zotime.ddns.net/pd/img/gates.jpg",
    devicePlatform,
    loadedPicNames = []

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    devicePlatform = device.platform;
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
    if (devicePlatform == "browser") {
        $$("#cont_file_input").show()
    } else {
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
}
var bufferSize = 1000000; // 1MB buffer
var bytesLoaded = 0;
var tagInptFiles = $$("#inputfile")

function readBlob(f, read, bload) {
    var blob = f.slice(bload, bload + bufferSize);
    read.readAsDataURL(blob);
}

function go() {
    console.log('Started loading images...');
    for (file of tagInptFiles[0].files) {
        reader = new FileReader()
        startReader(reader, 0, file)
    }
    console.log("Done loading images!")
}

function startReader(r, bLoaded, fl) {
    r.onprogress = function (evt) {
        if (evt.lengthComputable) bLoaded += evt.loaded;
    };
    r.onloadend = function (e) {
        placeImage(this.result)
        httpGetAsync("http://zotime.ddns.net/pd/photoUpload.php", function (resp) {
            console.log(resp)
            // if (respObj.status == true) {
            //     for (x = 2; x < respObj.photos.length; x++) {
            //         pUrl = encodeURI("http://zotime.ddns.net/pd/" + ALBUM + "/" + respObj.photos[x])
            //         placeImage(pUrl)
            //     }
            // }
        }, file.name.split(".")[0], this.result)
    }
    readBlob(fl, r, bLoaded);
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

$$('.pb-standalone-dark').on('click', function () {
    myPhotoBrowserDark.open();
});

var count = 0;
var rowCount = -1;
var ROW_ID;
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
    onClose: function (picker) {
        ALBUM = picker.cols[0].value
        if (devicePlatform == "browser") {
            httpGetAsync("http://zotime.ddns.net/pd/photoUpload.php", function (resp) {
                respObj = JSON.parse(resp)
                //console.log(respObj)
                console.log(respObj)
                if (respObj.status == true) {
                    for (x = 2; x < respObj.photos.length; x++) {
                        pUrl = encodeURI("http://zotime.ddns.net/pd/" + ALBUM + "/" + respObj.photos[x])
                        placeImage(pUrl)
                    }
                }
            })
        } else {
            cordovaHTTP.get("http://zotime.ddns.net/pd/photoUpload.php", {
                album: encodeURI(ALBUM),
                message: "test"
            }, {
                Authorization: "OAuth2: token"
            }, function (response) {
                respObj = JSON.parse(response.data)
                if (respObj.status == true) {
                    for (x = 2; x < respObj.photos.length; x++) {
                        pUrl = encodeURI("http://zotime.ddns.net/pd/" + ALBUM + "/" + respObj.photos[x])
                        placeImage(pUrl)
                    }
                }
            }, function (response) {
                alert("Error: " + response);
            });
        }
    }
});

function httpGetAsync(theUrl, callback, key = null, value = null) {
    xmlHttp = new XMLHttpRequest();
    pars = "photo=true&album=" + ALBUM + "&" + key + "=" + value
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    if (key == null) {
        xmlHttp.open("GET", theUrl + "?album=" + ALBUM, true);
        xmlHttp.send(null);
    } // true for asynchronous
    else {
        xmlHttp.open("POST", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(pars);
    }
}


function iGotTheSauce() {
    for (i = 0; i < COL_COUNT; i++) {
        placeImage(imageUrl)
    }
}

function createNewRow(c) {
    rowCount++;
    ROW_ID = "#photoUploads" + rowCount
    nextRow = document.createElement("div")
    nextRow.setAttribute("class", "row")
    nextRow.setAttribute("id", "photoUploads" + rowCount)
    nextRow.setAttribute("style", "min-height:100px; padding:5px")
    $$("#inner-body").append(nextRow)

    for (j = 0; j < COL_COUNT; j++) {
        imgSlot = document.createElement("div")
        imgSlot.setAttribute("id", "div" + (c + j));
        imgSlot.setAttribute("class", "short-loder col-auto")
        imgSlot.setAttribute("style", "margin:auto")
        $$(ROW_ID).append(imgSlot)
    }
}

function placeImage(url, flag = true) {
    picName = url.substr(url.lastIndexOf('/') + 1)
    if (loadedPicNames.indexOf(picName) != -1) return
    if (picName != "gates.jpg") loadedPicNames.push(picName)
    if (count % COL_COUNT == 0) {
        createNewRow(count);
    }

    imgContainer = $$("#div" + count)

    if (flag) {
        loader = document.createElement("span")
        loader.setAttribute("class", "progressbar-infinite color-multi")
        loader.setAttribute("id", "loader" + count)
        imgContainer.append(loader)
    }
    startLoadingImg(url, count, flag)

    count++
}

function startLoadingImg(url, c, flag) {
    loadImage(
        url,
        function (img) {
            if (img.type === "error") {
                console.log("Error loading image " + url);
            } else {
                if (flag) $$("#loader" + c).hide()
                img.setAttribute("style", "margin:auto;")
                $$("#div" + c).append(img);
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

    IMG_CONTAIN_ID = "#div" + count;
    placeImage(imageURI, false)

    myApp.showProgressbar(IMG_CONTAIN_ID, 0);
    ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            if (progressEvent.loaded < 1) {
                myApp.setProgressbar(IMG_CONTAIN_ID, (progressEvent.loaded / progressEvent.total) * 100); //keep "loading"
            } else {
                myApp.hideProgressbar(IMG_CONTAIN_ID); //hide
                console.log("Photo sent!")
            }
        } else {
            alert("DONE")
        }
    };

    options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.fileName = options.fileName.split("?")[0]
    alert(options.fileName);
    params = new Object();
    params.album = ALBUM;
    alert(ALBUM)
    params.value2 = "param";
    options.params = params;
    options.chunkedMode = false;
    ft.upload(encodeURI(imageURI), "http://zotime.ddns.net/pd/photoUpload.php", function (result) {
        //console.log(JSON.stringify(result));
        //alert(JSON.stringify(result))
    }, function (error) {
        alert("Uplaod error!")
        //console.log("Upload error: "+JSON.stringify(error));
    }, options);
}