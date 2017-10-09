function browserFileTransfer(done, fl, albumId) {
    if (albumId === undefined) {
        myApp.hidePreloader();
        myApp.alert("The variable album_id is undefined", "CLEAR-N-FILL")
        return
    }

    post({
        "Album": albumId,
        "Owner": USER.id
    });

}

function post(params) {
    method = "post"; // Set method to post by default if not specified.
    path = "http://www.zotime.ddns.net:2500/photo"

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = $$("#inputFileForm")
    form.attr("method", method);
    form.attr("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            // console.log("here")
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.append(hiddenField);
        }
    }
    console.log(form)
    alert("read console")
    form.submit();
}

function uploadPhoto(imageURI, albumId) {
    myApp.hidePreloader();
    myApp.showPreloader("Uploading photo");
    if (devicePlatform === "browser") {
        browserFileTransfer(done, imageURI, albumId)
    } else {
        newFunction(done, imageURI, albumId);
    }
}

function done(progressEvent) {
    return (progressEvent.loaded / progressEvent.total);
}

function takeImage(albumId) {
    navigator.camera.getPicture(function (imageData) {
        uploadPhoto(imageData, albumId)
    }, function (message) {
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


function newFunction(done, imageURI, albumId) {
    console.log("Sending photo...");
    IMG_CONTAIN_ID = "#div" + count;
    myApp.showProgressbar(IMG_CONTAIN_ID, 0);
    ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            if (done(progressEvent) < 1) {
                myApp.setProgressbar(IMG_CONTAIN_ID, done(progressEvent) * 100); //keep "loading"
            } else {
                console.log("Photo sent! " + progressEvent.loaded);
                myApp.hideProgressbar(IMG_CONTAIN_ID); //hide
            }
        } else {
            myApp.alert("DONE");
        }
    };
    options = new FileUploadOptions();
    options.fileKey = "file";
    // console.log(imageURI.tpye)
    // options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    // options.mimeType = imageURI.tpye;
    // options.fileName = imageURI.name;
    options.params = {
        "Album": albumId,
        "Owner": USER.id
    };
    options.chunkedMode = false;
    // console.log("encoded:",encodeURI(imageURI))
    ft.upload(imageURI, "http://zotime.ddns.net:2500/photo", function (result) {
        try {
            myApp.hidePreloader();
            var resp = JSON.parse(result.response);
            if (resp.err) {
                myApp.alert("Error in response: " + resp.msg, "ERR Pic Upload Resp");
            } else {
                clrNfillPhotoGrid(albumId);
            }
        } catch (err) {
            myApp.alert("Did not recieve json response.", "ERR Pic Upload");
            myApp.alert("Error: " + err);
            myApp.alert("Resp: " + JSON.stringify(result.response));
        }
    }, function (error) {
        myApp.hidePreloader();
        myApp.alert("Uplaod error!");
        console.log(error)
    }, options);
}