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
                console.log("Photo sent! " + progressEvent.loaded)
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
    ft.upload(encodeURI(imageURI), APP_BASE_FILE_URL, function (result) {
        console.log("Result " + JSON.stringify(result));
        //alert(JSON.stringify(result))
    }, function (error) {
        alert("Uplaod error!")
        //console.log("Upload error: "+JSON.stringify(error));
    }, options);
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

function readBlob(f, read, bload) {
    var bufferSize = 1000000; // 1MB buffer
    blob = f.slice(bload, bload + bufferSize);
    read.readAsDataURL(blob);
}

function sendFileToServ(fl) {
    var r = new FileReader()
    var bLoaded = 0
    var bytesTotal = fl.size;
    r.onprogress = function (evt) {
        if (evt.lengthComputable) bLoaded += evt.loaded;
    };
    r.onloadend = function (e) {
        if (e.target.readyState != FileReader.DONE) {
            return;
        }
        if (bLoaded < bytesTotal) {
            setTimeout(function () {
                //reader.readAsText(fl);
                readBlob(fl, r, bLoaded);
            }, 10);
        } else {
            console.log("Sending " + fl.name.split(".")[0] + "...")
            serverComm(APP_BASE_FILE_URL,
                function (resp) {
                    if (!resp) myApp.alert("Empty response from the server", "Uh Oh!")
                    else {
                        //console.log(resp)
                        imgLocation = APP_BASE_URL + resp
                        placeImage(imgLocation)
                        albumPhotos.push(imgLocation)
                        myPhotoBrowser = myApp.photoBrowser({
                            theme: 'dark',
                            photos: albumPhotos
                        });
                    }
                },
                fl.name.split(".")[0],
                r.result,
                false
            )
        }
    };
    readBlob(fl, r, bLoaded);
}