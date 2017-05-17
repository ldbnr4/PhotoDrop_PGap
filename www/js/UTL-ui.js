// Number of photos in the photo grid layout
var count = 0;
// Number of rows in the photo grid layout
var rowCount = -1;
// The current row number
var ROW_ID;
// The number of photos per row
var COL_COUNT = 3;
// List of picture names in the photo grid layout
var loadedPicNames = []

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
    //console.log(url)
    loadImage(
        url,
        function (img) {
            if (img.type === "error") {
                console.log("Error loading image from source: "+url);
                console.log(img);
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
                $$("#div" + c).on("click", function (e) {
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

function clrNfillPhotoGrid() {
    rowCount = -1;
    count = 0;
    loadedPicNames = []
    $$("#inner-body").html("")
    // console.log("ALBUM before clear and fill: ")
    // console.log(ALBUM)
    var pars = {
        GET_ALBUM_PHOTOS: true,
        albumId: ALBUM.id,
        userId: USER.id
    };
    var success = function (data, status, xhr) {
            try{
                if(data.length == 0){
                    console.log("This album has no photos :(")
                    return
                }
                var resp = JSON.parse(data);
                if(resp.err){
                    myApp.alert("Error in response: "+resp.msg,"ERR GET_ALBUM_PHOTOS");
                }
                else {
                    albumPhotos = [];
                    for (var i = 0, len = resp.photoIds.length; i < len; i++) {
                        imgLocation = encodeURI(APP_NEW_FILE_URL+"?albumId="+ALBUM.id+"&imageId="+resp.photoIds[i].$oid+"&userId="+USER.id);
                        placeImage(imgLocation);
                        albumPhotos.push(imgLocation)
                    }
                    myPhotoBrowser = myApp.photoBrowser({
                        theme: 'dark',
                        photos: albumPhotos
                    }); 
                }
            }catch(err){
                myApp.alert("Did not recieve json response. Resp: "+err,"ERR GET_ALBUM_PHOTOS");
                console.log("Data: "+data)
                console.log("Status: "+status)
                console.log("XHR: "+xhr)
            }
    }
    var error = function (xhr, status){
        myApp.alert("Failed to send photo.", "ERR GET_ALBUM_PHOTOS")
        console.log("XHR: "+xhr);
        console.log("STATUS: "+status);
    }
    $$.get(PHOTO_SERVICE, pars, success, error)
}

$$('.pull-to-refresh-content').on('ptr:refresh', function (e) {
    clrNfillPhotoGrid();
    // When loading done, we need to reset it
    myApp.pullToRefreshDone();
});

function getAlbums() {
    var success = function (data, status, xhr) {
        try{
            var resp = JSON.parse(data);
            if(resp.err){
                myApp.alert("Error in response: "+resp.msg,"ERR GET_ALBUMS");
            }
            else {
                USER.albums = resp.albums;
                //console.log(USER.albums)
                // USER.urn_albums = resp.urn_albums;

                $$("#albumListContain").html(
                    Template7.templates.albumListTmplt({
                        flag: true,
                        album: USER.albums
                    })
                );

                // $$("#URN_albumListContain").html(
                //     Template7.templates.albumListTmplt({
                //         flag: false,
                //         album: USER.urn_albums
                //     })
                // );

                // console.log(USER.albums)

                $$(".swipeout").on('swipeout:deleted', function () {
                    for (var i = 0; i < this.children.length; i++) {
                        if(this.children[i].tagName == "INPUT"){
                            delete_album(this.children[i].getAttribute("value"));
                        }
                    }
                });
            }
        }
        catch(err){
            myApp.alert("Did not recieve json response. Resp: "+data,"ERR GET_ALBUMS");
            console.log("Data: "+data)
            console.log("Status: "+status)
            console.log("XHR: "+xhr)
        }
    }
    var error = function (xhr, status){
        myApp.alert("Failed to get albums", "FAIL GET_ALBUMS")
        console.log("XHR: "+xhr);
        console.log("STATUS: "+status);
    }

    $$.get(USER_SERVICE, {GET_ALBUMS:true, USER_ID:USER.id}, success, error)
    
}

function addAlbum() {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && USER.albums.indexOf(value) == -1) {
            addNewAlbum(value)
        }
    });
}

function goToAlbumPg(name = null, id = null) {
    if(name != null){
        ALBUM.title = name
        ALBUM.id = id
    }
    clrNfillPhotoGrid()
    $$("#album_name_ttl").html(ALBUM.title)
    // Load album page
    mainView.router.load({
        pageName: 'album'
    });
    // console.log(ALBUM)
}

function photoSwiper() {
    myPhotoBrowser.open();
}

function _fillFromResp(resp, browser) {
    try{
        respObj = JSON.parse(resp)
        if (respObj.status == true) {
            albumPhotos = [];
            for (x = 2; x < respObj.photos.length; x++) {
                purl = encodeURI(PHOTO_SERVICE+"?albumId="+resp.albumId+"&imageId="+resp.image+"&userId="+USER.id);
                placeImage(purl)
                albumPhotos.push(purl)
            }
            myPhotoBrowser = myApp.photoBrowser({
                theme: 'dark',
                photos: albumPhotos
            });
        }
    }catch(error){
        myApp.alert("Resp: "+resp, "_fillFromResp ERR");
    }
}