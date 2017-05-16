function uploadPhoto(imageURI) {
    console.log("Sending photo...")

    IMG_CONTAIN_ID = "#div" + count;

    myApp.showProgressbar(IMG_CONTAIN_ID, 0);
    ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            if (progressEvent.loaded < 1) {
                myApp.setProgressbar(IMG_CONTAIN_ID, (progressEvent.loaded / progressEvent.total) * 100); //keep "loading"
            } else {
                console.log("Photo sent! " + progressEvent.loaded)
                myApp.hideProgressbar(IMG_CONTAIN_ID); //hide
                placeImage(imageURI, false)
            }
        } else {
            alert("DONE")
        }
    };
    params = new Object();
    params.album = ALBUM;
    //alert(ALBUM)
    params.username = USER.username;
    params.password = USER.password;

    options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.fileName = options.fileName.split("?")[0]
    //alert(options.fileName);
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
    var fr = new FileReader()
    var bLoaded = 0
    var bytesTotal = fl.size;
    fr.onprogress = function (evt) {
        if (evt.lengthComputable) bLoaded += evt.loaded;
    };
    fr.onloadend = function (e) {
        if (e.target.readyState != FileReader.DONE) {
            return;
        }
        if (bLoaded < bytesTotal) {
            setTimeout(function () {
                //reader.readAsText(fl);
                readBlob(fl, fr, bLoaded);
            }, 10);
        } else if(bLoaded >= bytesTotal){
            fl_name = fl.name.split(".")[0]
            console.log("Sending " + fl_name + "...")
            var _data = {NEW_PHOTO:true, WEB:true, ALBUM:encryptStr(ALBUM), ID:USER.id, DATA:fr.result}
            var success = function (data, status, xhr) {
                    try{
                        var resp = JSON.parse(data);
                        if(resp.err){
                            myApp.alert("Error in response: "+resp.msg,"ERR Pic Upload Resp");
                        }
                        else {
                            imgLocation = encodeURI(APP_NEW_FILE_URL+"?album="+encryptStr(ALBUM)+"&image="+resp.image+"&id="+USER.id);                      
                            albumPhotos.push(imgLocation)
                            myPhotoBrowser = myApp.photoBrowser({
                                theme: 'dark',
                                photos: albumPhotos
                            });
                        }
                    }catch(error){
                        myApp.alert("Did not recieve json response. Resp: "+error,"ERR Pic Upload");
                        console.log("Data: "+data)
                        console.log("Status: "+status)
                        console.log("XHR: "+xhr)
                    }
            }
            var error = function (xhr, status){
                myApp.alert("Failed to send photos, to the server")
                console.log("XHR: "+xhr);
                console.log("STATUS: "+status);
            }
            // console.log(fr.result);

            $$.post(PHOTO_SERVICE, _data, success, error)
        }
    };
    readBlob(fl, fr, bLoaded);
}