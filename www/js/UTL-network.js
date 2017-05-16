function delete_album(albm_nm) {
    serverComm(USER_SERVICE, {
            DEL_ALBUM: true,
            id: USER.id,
            key: encryptStr(albm_nm),
            album_ttl: JSON.stringify(albm_nm)
        }, true,
        function (resp) {
            try {
                resp = JSON.parse(resp)
                if (!resp.err) {
                    if (resp.mod_cnt == 1) {
                        console.log("Deleted album " + albm_nm)
                    } else if (resp.mod_cnt == 0) {
                        console.log("Album not deleted.")
                    } else {
                        console.log("ADD_ALBUM did not create a new album.");
                    }
                } else {
                    console.log("DEL_ALBUM error: " + resp.msg);
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "DEL_ALBUM")
            }
        }
    )
}

//Add a new album
function addNewAlbum(imgAlbum) {
    serverComm(USER_SERVICE, {
            ADD_ALBUM: true,
            id: JSON.stringify(USER.id),
            album: JSON.stringify(imgAlbum)
        }, true,
        function (resp) {
            try {
                resp = JSON.parse(resp)
                if (!resp.err) {
                    if (resp.mod_cnt == 1) {
                        console.log("Created a new album.")
                    } else {
                        console.log("ADD_ALBUM did not create a new album.");
                    }
                } else {
                    console.log("ADD_ALBUM error: " + resp.msg);
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "ADD_ALBUM")
            }
        }
    )
}

function createNewUser(_url, _USER) {
    // Create A User
    serverComm(_url, {
            ADD_USER: true,
            new_user: JSON.stringify(_USER)
        }, true,
        function (resp) {
            try {
                var JResp = JSON.parse(resp);
                if (JResp.err == false) {
                    _USER.id = JResp.id;
                } else if (JResp.msg == "ERR_USERNAME") {
                    console.log("Username taken.");
                } else {
                    console.log("ADD_USER resp: " + resp);
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "ADD_USER")
            }
        },
        "Failed to create a user."
    )
}

function _get_key_value_str(__set){
    var str_ = "";
    for(var ___k in __set){
        str_ = str_ + ___k+"="+__set[___k]+"&";
    }
    return str_.slice(0, -1);
}

function serverComm(url, par_set, post, success, fail_msg){
    var pars = _get_key_value_str(par_set);
    if(!post){
        url = url+"?"+pars;
        pars = null;
    }
    var xhr = createCORSRequest((post ? "POST" :"GET"), encodeURI(url));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function () {
        var rsp = xhr.responseText;
        if(!rsp){
            myApp.alert(fail_msg);
        }else{
            success(xhr.responseText);
        }
    };
    xhr.onerror = function () {
        console.log('There was a server communication error!');
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

function uploadInputFiles() {
    console.log('Sending images...');
    for (file of $$("#inputfile")[0].files) {
        sendFileToServ(file)
    }
    setTimeout(function () {
        fillPhotoGrid();
    }, 500);
    //console.log("Done loading images!")
}