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
    ft.upload(encodeURI(imageURI), "http://zotime.ddns.net/pd/photoUpload.php", function (result) {
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

function go() {
    console.log('Started loading images...');
    for (file of tagInptFiles[0].files) {
        console.log("loading " + file.name + "...")
        startReader(file)
    }
    //console.log("Done loading images!")
}

function readBlob(f, read, bload) {
    var bufferSize = 1000000; // 1MB buffer
    blob = f.slice(bload, bload + bufferSize);
    read.readAsDataURL(blob);
}

function startReader(fl) {
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
            console.log("sending " + fl.name.split(".")[0] + "...")
            httpGetAsync("http://zotime.ddns.net/pd/photoUpload.php",
                function (resp) {
                    if (!resp) myApp.alert("Empty response from the server", "Uh Oh!")
                    else {
                        //console.log(resp)
                        imgLocation = "http://zotime.ddns.net/pd/" + resp
                        placeImage(imgLocation)
                        albumList.push(imgLocation)
                        myPhotoBrowserDark = myApp.photoBrowser({
                            theme: 'dark',
                            photos: albumList
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

function placeImage(url, flag = true) {
    picName = url.substr(url.lastIndexOf('/') + 1)
    if (loadedPicNames.indexOf(picName) != -1) return
    if (picName != "gates.jpg") loadedPicNames.push(picName)
    if (count % COL_COUNT == 0) {
        createNewRow(count);
    }

    imgContainer = $$("#div" + count)

    if (flag) {
        //console.log("show")
        loader = document.createElement("span")
        loader.setAttribute("class", "progressbar-infinite color-multi")
        loader.setAttribute("id", "loader" + count)
        imgContainer.append(loader)
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
                if (flag) $$("#loader" + c).hide()
            }
        }, {}
    );
}