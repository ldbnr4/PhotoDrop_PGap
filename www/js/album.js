myApp.onPageInit('album', initAlbumPg)
myApp.onPageReinit('album', initAlbumPg)

function initAlbumPg(page) {
    albumId = page.query.id
    if (!albumId) {
        myApp.alert("Empty albumId", "BAD PAGE INIT")
    }

    //TODO: check if this is a tagged album
    clrNFill(USER.CreatedAlbums[albumId].PhotoList)

    $$("#album_name_ttl").html(page.query.title)

    albumCntnr = $$('#albumPgCntnt');
    photoCapElement = $$("#photo_capture");
    devUploadBtn = $$("#dev_upload_btn");
    libUploadBtn = $$("#image_lib_sdb");

    photoCapElement.off('click', null);
    photoCapElement.click(function () {
        takeImage(albumId)
    });

    devUploadBtn.off('click', null);
    devUploadBtn.click(devPhotoFactory);

    libUploadBtn.off('click', null);
    libUploadBtn.click(function () {
        openImageLib(albumId)
    })

    albumCntnr.off('ptr:refresh', null)
    albumCntnr.on('ptr:refresh', function (e) {
        ptrAlbumPics(albumId)
    })
}

function openImageLib(albumId) {
    // console.log(e)
    if (devicePlatform === "browser") {
        $$("#cont_file_input").show()
    } else {
        navigator.camera.getPicture(
            function (imageData) {
                myApp.showPreloader("Uploading image...")
                function win(r) {
                    myApp.hidePreloader()
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                }
                
                function fail(error) {
                    myApp.hidePreloader()
                    myApp.alert("An error has occurred: Code = " + error.code);
                    console.log("upload error source " + error.source);
                    console.log("upload error target " + error.target);
                }
                
                var uri = encodeURI(APP_BASE_URL+"/photo");
                
                var options = new FileUploadOptions();
                options.fileKey="file";
                
                var headers={'UID':USER.ObjectID, 'ENV':env};
                
                options.headers = headers;
                options.params = {
                    AID: albumId
                }
                
                var ft = new FileTransfer();
                // ft.onprogress = function (progressEvent) {
                //     if (progressEvent.lengthComputable) {
                //         if (progressEvent.loaded < 1) {
                //             myApp.showProgressbar(IMG_CONTAIN, (progressEvent.loaded / progressEvent.total) * 100); //keep "loading"
                //         } else {
                //             myApp.hideProgressbar(IMG_CONTAIN); //hide
                //             myApp.alert("Photo sent!")
                //         }
                //     } else {
                //         alert("DONE")
                //     }
                // };
                ft.upload(imageData, uri, win, fail, options);
                // uploadPhoto(imageData, albumId)
            },
            function (message) {
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
    fetchPids(albumId)
    myApp.pullToRefreshDone()
}

function clearPhotoGrid(){
    photoGrid = $$("#inner-body").html("")
}

function fillPhotoGrid(albumPids){
    myPhotoBrowser = myApp.photoBrowser({
        theme: 'dark',
        photos: PhotoFactory(albumPids, albumId)
    })
}

function clrNFill(albumPids){
    clearPhotoGrid()
    fillPhotoGrid(albumPids)
}

function fetchPids(album_id) {
    if (album_id === undefined) {
        myApp.alert("The variable album_id is undefined", "CLEAR-N-FILL")
        return
    }
    myApp.hidePreloader()
    myApp.showPreloader("Gathering media")
    // console.log("Data going to server for photos:",pars)
    const goSuccess = function (data, status, xhr) {
        myApp.hidePreloader()
        const resp = JSON.parse(data)
        console.log("Get album response")
        console.log(resp)
        if (!resp || resp.length == 0) {
            console.log("This album has no photos :(")
            return
        }
        clrNFill(resp)
        // TODO Update user albums
    }
    var pars = {
        GET_ALBUM_PHOTOS: true,
        albumId: album_id,
        userId: USER.ObjectID
    }
    getReq("/album/photos/"+album_id, {}, goSuccess, "retrieve album")
}

function deletePic(pid, album_id) {
    myApp.hidePreloader()
    myApp.showPreloader("Deleting photo")
    var success = function (data, status, xhr) {
        try {
            myApp.hidePreloader()
            var resp = JSON.parse(data)
            if (resp.err) {
                myApp.alert("Error in response: " + resp.msg, "ERR DEL_PHOTO")
            } else {
                clrNFill(album_id)
            }
        } catch (err) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR DEL_PHOTO")
        }
    }

    postReq("/del/photo", {
        UID: USER.ObjectID,
        PID: pid
    }, success, "delete photo")
}

function addAlbum() {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && (!USER.CreatedAlbums || USER.CreatedAlbums.indexOf(value) == -1)) {
            addNewAlbum(value)
        }
        else myApp.alert("Failed to create album", "Error add album")
    })
}

function addNewAlbum(ttl) {
    myApp.hidePreloader();
    myApp.showPreloader("Adding a new album");

    var goSuccess = function (data, status, xhr) {
        myApp.hidePreloader();
        resp = JSON.parse(data);
        console.log("Add album response:", resp)
        mainView.router.load({
            pageName: 'album',
            query: {
                title: resp.Title,
                id: resp.ID
            }
        })
        //TODO: Update USER object?
    }

    putReq("/album", {
        Title: ttl
    }, goSuccess, "add a new album");
}