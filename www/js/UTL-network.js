function delete_album(albumId) {
    myApp.hidePreloader();
    myApp.showPreloader("Deleting album");
    var success = function (data, status, xhr) {
        try{
            myApp.hidePreloader();
            var resp = JSON.parse(data);
            if(resp.err){
                myApp.alert("Response error message: "+resp.msg,"ERR DEL_ALBUM");
            }
            else {
                console.log("Deleted album")    
            }
        }catch(err){
            myApp.alert("Did not recieve json response. Resp: "+err,"ERR DEL_ALBUM");
            console.log("Data: "+data)
            console.log("Status: "+status)
            console.log("XHR: "+xhr)
        }
    }
    var error = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to delete album.", "ERR DEL_ALBUM")
        console.log("XHR: "+xhr);
        console.log("STATUS: "+status);
    }
    $$.post(USER_SERVICE, {DEL_ALBUM: true, USER_ID: USER.id, ALBUM_ID: albumId}, success, error)
    return
}

//Add a new album
function addNewAlbum(ttl) {
    myApp.hidePreloader();
    myApp.showPreloader("Adding a new album");
    var success = function (data, status, xhr) {
            try {
                myApp.hidePreloader();
                resp = JSON.parse(data)
                if (!resp.err) {
                    if(resp.dup){
                        console.log("Duplicate album name.")
                        ALBUM.title = resp.title
                        ALBUM.id = resp.id
                        goToAlbumPg()
                        getAlbums()
                    }
                    else if (resp.mod_cnt == 1) {
                        console.log("Created a new album.")
                        ALBUM.title = resp.title
                        ALBUM.id = resp.id
                        goToAlbumPg()
                        getAlbums()
                    } else {
                        myApp.alert("Did not create a new album.", "ERR ADD_ALBUM");
                    }
                } else {
                    myApp.alert("Response error: " + resp.msg, "ERR ADD_ALBUM");
                }
            }catch (error) {
                    myApp.alert("Did not recieve json response. Resp: "+data,"ERR ADD_ALBUM");
                }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to add a new album.", "ERR ADD_ALBUM")
        console.log("XHR: "+xhr);
        console.log("STATUS: "+status);
    }
    
    $$.post(USER_SERVICE, {ADD_ALBUM:true, USER_ID:USER.id, TITLE:ttl},success, err);
}

function _get_key_value_str(__set){
    var str_ = "";
    for(var ___k in __set){
        str_ = str_ + ___k+"="+__set[___k]+"&";
    }
    return str_.slice(0, -1);
}

//$$.get(USER_SERVICE, {FIND_USER: true, username: _username}, success, error)

function serverComm(url, par_set, post, success, fail){
    var pars = _get_key_value_str(par_set);
    if(!post){
        url = url+"?"+pars;
        pars = null;
    }
    var xhr = createCORSRequest((post ? "POST" :"GET"), encodeURI(url));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (!xhr) {
        myApp.alert('CORS not supported')
        throw new Error('CORS not supported');
    }
    xhr.onload = function () {
        if(xhr.status != 200){
            fail(xhr, xhr.status);
        }else{
            success(xhr.responseText);
        }
    };
    xhr.onerror = function () {
        myApp.alert('There was a server communication error!');
    };
    xhr.send(pars);

}

function createCORSRequest(methd, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(methd, url, true);
        //console.log("Made a CORS req")

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(methd, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;
        console.log("CORS not supported")

    }
    return xhr;
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

function DEV_uploadPics() {
    console.log('Sending images...');
    for (file of $$("#inputfile")[0].files) {
        uploadPhoto(file)
    }
    setTimeout(function () {
        clrNfillPhotoGrid();
    }, 500);
    //console.log("Done loading images!")
}