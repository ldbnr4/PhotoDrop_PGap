function goToAlbumPg() {
    $$("#album_name_ttl").html(ALBUM)
    // Load album page
    mainView.router.load({pageName: 'album'});
}

function photoSwiper(){
    myPhotoBrowserDark.open();
}

function _fillFromResp(resp) {
    console.log(resp)
    respObj = JSON.parse(resp)
    console.log(respObj)
    if (respObj.status == true) {
        albumList = [];
        for (x = 2; x < respObj.photos.length; x++) {
            pUrl = encodeURI("http://zotime.ddns.net/pd/" + ALBUM + "/" + respObj.photos[x])
            placeImage(pUrl)
            albumList.push(pUrl)
        }
        myPhotoBrowserDark = myApp.photoBrowser({
            theme: 'dark',
            photos: albumList
        });
    }
}

function httpGetAsync(theUrl, callback, key = null, value = null, asynchFlag) {
    xmlHttp = new XMLHttpRequest();
    pars = null;
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    if (key == null) {
        xmlHttp.open("GET", theUrl + "?album=" + ALBUM, asynchFlag); // true for asynchronous
        console.log("Asynch call")
    } else {
        pars = "photo=true&album=" + ALBUM + "&" + key + "=" + value
        xmlHttp.open("POST", theUrl, asynchFlag); // true for asynchronous
    }
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlHttp.send(pars);
}


function iGotTheSauce() {
    for (i = 0; i < COL_COUNT; i++) {
        placeImage(imageUrl)
    }
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

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    console.log('Connection type: ' + states[networkState]);

    return networkState = !Connection.NONE
}

function fillPhotoGrid(newAlbum){
    ALBUM = newAlbum
    rowCount = -1;
    count = 0;
    loadedPicNames = []
    $$("#inner-body").html("")
     if (devicePlatform == "browser") {
            httpGetAsync("http://zotime.ddns.net/pd/photoUpload.php",
                function (resp) {
                    _fillFromResp(resp)
                })
        } else {
            cordovaHTTP.get(
                "http://zotime.ddns.net/pd/photoUpload.php", {
                    album: encodeURI(ALBUM),
                    message: "test"
                }, {
                    Authorization: "OAuth2: token"
                },
                function (response) {
                    _fillFromResp(response.data)
                },
                function (response) {
                    alert("Error: " + response);
                }
            );
        }
}