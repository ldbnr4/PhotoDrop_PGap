// Number of photos in the photo grid layout
var count = 0;
// Number of rows in the photo grid layout
var rowCount = -1;
// The current row number
var ROW_ID;
// The number of photos per row
var COL_COUNT = 3;
// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
// List of picture names in the photo grid layout
var loadedPicNames = []
// List of albums to open
var albumList = ['rand', 'uploads', 'Family Reunion 2018'];

function placeImage(url, flag = true) {
    picName = url.substr(url.lastIndexOf('/') + 1)
    if (loadedPicNames.indexOf(picName) != -1) return
    if (picName != "gates.jpg") loadedPicNames.push(picName)
    if (count % COL_COUNT == 0) {
        createNewRow(count);
    }

    if (flag) {
        //console.log("show")
        loader = document.createElement("span")
        loader.setAttribute("class", "progressbar-infinite color-multi")
        loader.setAttribute("id", "loader" + count)
         $$("#div" + count).append(loader)
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
                img = loadImage.scale(
                    img, {
                        maxWidth: window.screen.width / 3.5,
                        maxHeight: window.screen.height / 3.5,
                        //crop: true,
                        contain: true,
                    }
                )
                //console.log("hide")
                img.setAttribute("style", "margin:auto;")
                $$("#div" + c).append(img);
                $$("#div" + c).on("click", function(e){
                    myPhotoBrowser.activeIndex = c;
                    myPhotoBrowser.open();
                })
                if (flag) $$("#loader" + c).hide()
            }
        }, {}
    );
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

function fillPhotoGrid() {
    rowCount = -1;
    count = 0;
    loadedPicNames = []
    $$("#inner-body").html("")
    if (devicePlatform == "browser") {
        serverComm(APP_BASE_FILE_URL,
            function (resp) {
                if(!resp) myApp.alert("Empty response from the server", "Uh Oh!")
                else
                    _fillFromResp(resp)
            })
    } else {
        cordovaHTTP.get(
            APP_BASE_FILE_URL, {
                album: encodeURI(ALBUM),
                message: "test"
            }, {
                Authorization: "OAuth2: token"
            },
            function (response) {
                _fillFromResp(response.data)
            },
            function (response) {
                alert("Error: " + response);
            }
        );
    }
}

ptrContent.on('ptr:refresh', function(e){
    fillPhotoGrid();
    // When loading done, we need to reset it
    myApp.pullToRefreshDone();
});

function fillAlbumListContain(){
    $$("#albumListContain").html(
        Template7.templates.albumListTmplt({
            albums: albumList
        })
    )
}

function addAlbum() {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && albumList.indexOf(value) == -1) {
            albumList.push(value)
            fillAlbumListContain()
            goToAlbumPg(value)
        }
    });
}

function goToAlbumPg(val) {
    if(val != ALBUM){
        ALBUM = val;
        fillPhotoGrid()
    }
    $$("#album_name_ttl").html(ALBUM)
    // Load album page
    mainView.router.load({
        pageName: 'album'
    });
}

function photoSwiper() {
    myPhotoBrowser.open();
}

function _fillFromResp(resp) {
    //console.log(resp)
    respObj = JSON.parse(resp)
    //console.log(respObj)
    if (respObj.status == true) {
        albumPhotos = [];
        for (x = 2; x < respObj.photos.length; x++) {
            pUrl = encodeURI(APP_BASE_URL + ALBUM + "/" + respObj.photos[x])
            placeImage(pUrl)
            albumPhotos.push(pUrl)
        }
        myPhotoBrowser = myApp.photoBrowser({
            theme: 'dark',
            photos: albumPhotos
        });
    }
}