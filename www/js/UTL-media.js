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
            console.log("Sending " + fl.name.split(".")[0] + "...")
            var _data = {NEW_PHOTO:true, ALBUM_ID:ALBUM.id, USER_ID:USER.id, DATA:fr.result}
            var success = function (data, status, xhr) {
                    try{
                        var resp = JSON.parse(data);
                        if(resp.err){
                            myApp.alert("Error in response: "+resp.msg,"ERR NEW_PHOTO");
                        }
                        else {
                            imgLocation = encodeURI(APP_NEW_FILE_URL+"?albumId="+resp.id+"&imageId="+resp.image+"&userId="+USER.id);                      
                        }
                    }catch(err){
                        myApp.alert("Did not recieve json response. Resp: "+err,"ERR NEW_PHOTO");
                    }
            }
            var error = function (xhr, status){
                myApp.alert("Failed to send photo.", "ERR NEW_PHOTO")
                console.log("XHR: "+xhr);
                console.log("STATUS: "+status);
            }

            $$.post(PHOTO_SERVICE, _data, success, error)
        }
    };
    readBlob(fl, fr, bLoaded);
}

function uploadPhoto(imageURI) {
    if(devicePlatform == "browser"){
        sendFileToServ(imageURI)
    }else{
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
                    clrNfillPhotoGrid();

                }
            }else {
                myApp.alert("DONE")
            }
        };

        options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.fileName = options.fileName.split("?")[0]
        options.params = {NEW_PHOTO:true, ALBUM_ID:ALBUM.id, USER_ID:USER.id};
        options.chunkedMode = false;

        ft.upload(encodeURI(imageURI), PHOTO_SERVICE, function (result) {
            try{
                var resp = JSON.parse(result.response);
                if(resp.err){
                    myApp.alert("Error in response: "+resp.msg,"ERR Pic Upload Resp");
                }
                else {
                    // imgLocation = encodeURI(APP_NEW_FILE_URL+"?album="+encryptStr(ALBUM)+"&image="+resp.image+"&id="+USER.id);                      
                    // $$("#debugBox").html(imgLocation)
                    clrNfillPhotoGrid();
                }
            }catch(err){
                myApp.alert("Did not recieve json response.", "ERR Pic Upload");
                myApp.alert("Error: "+err);
                myApp.alert("Resp: "+JSON.stringify(result.response));
            }
        }, function (error) {
            myApp.alert("Uplaod error!")
        }, options);
    }
}

function takeImage() {
    navigator.camera.getPicture(uploadPhoto, function (message) {
        alert('get picture failed: ' + message);
        console.log(message)
    }, {
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: false
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
            correctOrientation: true,
            saveToPhotoAlbum: false
        });
    }
}

function readBlob(f, read, bload) {
    var bufferSize = 1000000; // 1MB buffer
    blob = f.slice(bload, bload + bufferSize);
    read.readAsDataURL(blob);
}