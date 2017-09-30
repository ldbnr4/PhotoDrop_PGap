// Number of photos in the photo grid layout
var count = 0
// Number of rows in the photo grid layout
var rowCount = -1
// The current row number
var ROW_ID
// The number of photos per row
var COL_COUNT = 2
// List of picture names in the photo grid layout
var loadedPicNames = []
// element argument can be a selector string
//   for an individual element
var msnry = new Masonry( '.grid', {
  // options
  itemSelector: '.grid-item'
});


myApp.onPageInit('album', initAlbumPg)
myApp.onPageReinit('album', initAlbumPg)

$$("#image_lib_sdb").click(openImageLib)

function initAlbumPg(page) {
    albumId = page.query.id
    if(!albumId){
        myApp.alert("Empty albumId","BAD PAGE INIT")
    }
    clrNfillPhotoGrid(albumId)
    $$("#album_name_ttl").html(page.query.title)
    
    albumCntnr = $$('#albumPgCntnt');
    photoCapElement = $$("#photo_capture");
    devUploadBtn = $$("#dev_upload_btn");

    photoCapElement.off('click', null);
    photoCapElement.click(function(){
        takeImage(albumId)
    });

    devUploadBtn.off('click', null);
    devUploadBtn.click(function(){
        DEV_uploadPics(albumId)
    });

    albumCntnr.off('ptr:refresh', null)
    albumCntnr.on('ptr:refresh', function(e){
        ptrAlbumPics(albumId)
    })
}

function openImageLib(e){
    console.log(e)
    if (devicePlatform === "browser") {
        $$("#cont_file_input").show()
    } else {
        navigator.camera.getPicture(uploadPhoto, function (message) {
            alert('get picture failed: ' + message);
            console.log(message)
        }, {
            quality: 100,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            saveToPhotoAlbum: false
        });
    }
}

function ptrAlbumPics(albumId) {
    clrNfillPhotoGrid(albumId)
    myApp.pullToRefreshDone()
}

function clrNfillPhotoGrid(album_id) {
    // return
    if(album_id === undefined){
        myApp.alert("The variable album_id is undefined","CLEAR-N-FILL")
        return
    }
    console.log("Clearing and filling album pics")
    myApp.hidePreloader()
    myApp.showPreloader("Gathering media")
    rowCount = -1
    count = 0
    loadedPicNames = []
    $$("#inner-body").html("")
    var pars = {
        GET_ALBUM_PHOTOS: true,
        albumId: album_id,
        userId: USER.id
    }
    // console.log("Data going to server for photos:",pars)
    var goSuccess = function (data, status, xhr){
        myApp.hidePreloader()
        var resp = JSON.parse(data)
        if (!resp.PhotoIDs || resp.PhotoIDs.length == 0) {
            console.log("This album has no photos :(")
            return
        }
        console.log("Get album response:",resp.PhotoIDs)
        albumPhotos = []
        resp.PhotoIDs.forEach(function(pid) {
            imgLocation = encodeURI("http://zotime.ddns.net:2500/photo?albumId=" + album_id + "&imageId=" + pid + "&userId=" + USER.id)
            placeImage(imgLocation, pid, album_id)
            albumPhotos.push(imgLocation)
        })
        // for (var i = 0, len = resp.length; i < len; i++) {
        //     pid = resp.photoIds[i].$oid
        //     imgLocation = encodeURI("http://zotime.ddns.net:2500/album?albumId=" + album_id + "&imageId=" + pid + "&userId=" + USER.id)
        //     placeImage(imgLocation, pid, album_id)
        //     albumPhotos.push(imgLocation)
        // }
        myPhotoBrowser = myApp.photoBrowser({
            theme: 'dark',
            photos: albumPhotos
        })
    }
    var success = function (data, status, xhr) {
        try {
            myApp.hidePreloader()
            if (data.length == 0) {
                console.log("This album has no photos :(")
                return
            }
            var resp = JSON.parse(data)
            if (resp.err) {
                myApp.alert("Error in response: " + resp.msg, "ERR GET_ALBUM_PHOTOS")
            } else {
                albumPhotos = []
                for (var i = 0, len = resp.photoIds.length; i < len; i++) {
                    pid = resp.photoIds[i].$oid
                    imgLocation = encodeURI(APP_NEW_FILE_URL + "?albumId=" + album_id + "&imageId=" + pid + "&userId=" + USER.id)
                    placeImage(imgLocation, pid, album_id)
                    albumPhotos.push(imgLocation)
                }
                myPhotoBrowser = myApp.photoBrowser({
                    theme: 'dark',
                    photos: albumPhotos
                })
            }
        } catch (err) {
            myApp.alert("Did not recieve json response.", "ERR GET_ALBUM_PHOTOS")
            console.log("Error:",err)
            console.log("Data:",data)
        }
    }

    // getReq(PHOTO_SERVICE, pars, success, "retrieve album")
    params = {UserId:USER.id, AlbumId:album_id}
    console.log("Get album msg:",params)
    getReq("http://zotime.ddns.net:2500/album", params, goSuccess, "retrieve album")
}

function placeImage(url, pid = null, album_id) {
    picName = url.substr(url.lastIndexOf('/') + 1)
    // console.log(url)
    if (loadedPicNames.indexOf(picName) != -1) return
    if (picName != "gates.jpg") loadedPicNames.push(picName)
    if (count % COL_COUNT == 0) {
        createNewRow(count)
    }

    //console.log("show")
    loader = document.createElement("span")
    loader.setAttribute("class", "progressbar-infinite color-multi")
    loader.setAttribute("id", "loader" + count)
    $$("#div" + count).append(loader)
    // imgDIV = $$("#div" + count)

    startLoadingImg(url, count, pid, album_id)

    count++
}

function createNewRow (c) {
    rowCount++
    ROW_ID = "#photoUploads" + rowCount
    nextRow = document.createElement("div")
    nextRow.setAttribute("class", "row")
    nextRow.setAttribute("id", "photoUploads" + rowCount)
    nextRow.setAttribute("style", "min-height:100px; padding:5px")
    $$("#inner-body").append(nextRow)

    for (j = 0; j < COL_COUNT; j++) {
        imgSlot = document.createElement("div")
        imgSlot.setAttribute("id", "div" + (c + j))
        imgSlot.setAttribute("class", "short-loder col-auto")
        imgSlot.setAttribute("style", "margin:auto;text-align: center;")
        $$(ROW_ID).append(imgSlot)
    }
}

function startLoadingImg(url, c, pid, album_id) {
    const container = $$("#div" + c);
    //console.log(url)
    loadImage(
        url,
        function (img) {
            if (img.type === "error") {
                console.log("Error loading image id:" + pid + " from source:" + url)
                container.html("ERROR. You should delete me :(")
            } else {
                img = loadImage.scale(
                    img, {
                        maxWidth: window.screen.width / 2.15,
                        maxHeight: window.screen.height / 3.2,
                        downsamplingRatio: 0.4,
                        contain: true,
                        crop: true,
                        canvas: true,
                        cover: true,
                    }
                )
                if (!(container.children()[0] == $$("#loader" + c)[0])) {
                    myApp.alert("attempt to double load image slot")
                    return
                }
                container.append(img)
            }
            // container.attr("val", pid)
            container.on("click", function (e) {
                myPhotoBrowser.activeIndex = c
                myPhotoBrowser.open()
            })

            container.on('taphold', function () {
                var buttons = [
                    {
                        text: "Delete",
                        color: "red",
                        onClick: function() {
                            deletePic(pid, album_id)
                        }
                    }
                ]
                myApp.actions(this, buttons)
            })

            $$("#loader" + c).remove()
        }, {
            aspectRatio: 1,
        }
    )
}

function deletePic (pid, album_id){
    myApp.hidePreloader()
    myApp.showPreloader("Deleting photo")
    var success = function (data, status, xhr) {
        try{
            myApp.hidePreloader()
            var resp = JSON.parse(data)
            if(resp.err){
                myApp.alert("Error in response: "+resp.msg,"ERR DEL_PHOTO")
            }
            else {
                clrNfillPhotoGrid(album_id)
            }
        }catch(err){
            myApp.alert("Did not recieve json response. Resp: "+data,"ERR DEL_PHOTO")
        }
    }

    postReq(PHOTO_SERVICE,
        {
            DEL_PHOTO:true, 
            USER_ID:USER.id, 
            PID:pid
        }, success, "delete photo")
}

function addAlbum () {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && USER.albums.indexOf(value) == -1) {
            addNewAlbum(value)
        }
    })
}