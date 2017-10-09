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

function DEV_uploadPics(albumId) {
    console.log('Sending images...');
    for (file of $$("#inputfile")[0].files) {
        uploadPhoto(file, albumId)
    }
    setTimeout(function () {
        clrNfillPhotoGrid(albumId);
    }, 500);
    //console.log("Done loading images!")
}

function getReq(url, params, callback, actionName){
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR GET REQUEST")
        console.log("XHR: " + xhr);
        console.log("STATUS: " + status);
    }
    // console.log(url)

    $$.get(url, params, callback, error)
}

function postReq(url, params, callback, actionName){
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR POST REQUEST")
        console.log("URL:",url)
        console.log("PARAMS:",params)
        console.log("XHR:", xhr);
        console.log("STATUS: " + status);
    }

    // console.log(url)
    $$.post(url, params, callback, error)
}