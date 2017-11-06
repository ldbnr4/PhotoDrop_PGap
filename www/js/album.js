myApp.onPageInit('album', initAlbumPg)
myApp.onPageReinit('album', initAlbumPg)

function initAlbumPg(page) {
    albumId = page.query.id
    if (!albumId) {
        myApp.alert("Empty albumId", "BAD PAGE INIT")
    }


    clrNfillPhotoGrid(albumId)

    function onLayout(){
        console.log('layout done');
    }

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
                
                var headers={'UID':USER.id, 'ENV':env};
                
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
    clrNfillPhotoGrid(albumId)
    myApp.pullToRefreshDone()
}

function clrNfillPhotoGrid(album_id) {
    if (album_id === undefined) {
        myApp.alert("The variable album_id is undefined", "CLEAR-N-FILL")
        return
    }
    console.log("Clearing and filling album pics")
    myApp.hidePreloader()
    myApp.showPreloader("Gathering media")
    photoGrid = $$("#inner-body")
    photoGrid.html("")
    var pars = {
        GET_ALBUM_PHOTOS: true,
        albumId: album_id,
        userId: USER.id
    }
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

        myPhotoBrowser = myApp.photoBrowser({
            theme: 'dark',
            photos: PhotoFactory(resp, album_id)
        })
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
                clrNfillPhotoGrid(album_id)
            }
        } catch (err) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR DEL_PHOTO")
        }
    }

    postReq("/del/photo", {
        UID: USER.id,
        PID: pid
    }, success, "delete photo")
}

function addAlbum() {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && (!USER.albums || USER.albums.indexOf(value) == -1)) {
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