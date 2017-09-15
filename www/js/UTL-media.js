function browserFileTransfer(fl, albumId) {
    if(albumId === undefined){
        myApp.hidePreloader();
        myApp.alert("The variable album_id is undefined","CLEAR-N-FILL")
        return
    }
    
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
                console.log("I fell in here!")
                readBlob(fl, fr, bLoaded);
            }, 10);
        } else if(bLoaded >= bytesTotal){
            console.log("Sending " + fl.name.split(".")[0] + "...")
            var _data = {NEW_PHOTO:true, ALBUM_ID:albumId, USER_ID:USER.id, DATA:fr.result}
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
                        myApp.hidePreloader();
                        myApp.alert("Uh Oh! Check the logs", "ERR NEW_PHOTO");
                        console.log(err)
                        console.log("Response from the server",data)
                    }
            }
            var error = function (xhr, status){
                myApp.alert("Failed to send photo.", "ERR NEW_PHOTO")
                console.log("XHR: "+xhr);
                console.log("STATUS: "+status);
            }
            
            console.log(byteLength(fr.result))

            //postReq(PHOTO_SERVICE, _data, success, "send photo")
            postReq("http://zotime.ddns.net:2500/photo", {
              "Album":albumId,
              "Owner":USER.id,
              "Data":fr.result
            }, success, "send photo to go backend")
        }
    }
    readBlob(fl, fr, bLoaded);
}

function byteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i=str.length-1; i>=0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s+=2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}

function uploadPhoto(imageURI, albumId) {
    myApp.hidePreloader();
    myApp.showPreloader("Uploading photo");
    if(devicePlatform === "browser"){
        browserFileTransfer(imageURI, albumId)
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
        options.params = {NEW_PHOTO:true, ALBUM_ID:albumId, USER_ID:USER.id};
        options.chunkedMode = false;

        ft.upload(encodeURI(imageURI), PHOTO_SERVICE, function (result) {
            try{
                myApp.hidePreloader();
                var resp = JSON.parse(result.response);
                if(resp.err){
                    myApp.alert("Error in response: "+resp.msg,"ERR Pic Upload Resp");
                }
                else {
                    clrNfillPhotoGrid(albumId);
                }
            }catch(err){
                myApp.alert("Did not recieve json response.", "ERR Pic Upload");
                myApp.alert("Error: "+err);
                myApp.alert("Resp: "+JSON.stringify(result.response));
            }
        }, function (error) {
            myApp.hidePreloader();
            myApp.alert("Uplaod error!")
        }, options);
    }
}

function takeImage(albumId) {
    navigator.camera.getPicture(function(imageData){uploadPhoto(imageData, albumId)}, function (message) {
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
    
}

function readBlob(f, read, bload) {
    var bufferSize = 1000000; // 1MB buffer
    blob = f.slice(bload, bload + bufferSize);
    read.readAsDataURL(blob);
}