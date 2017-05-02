function _get_key_value_str(__set){
    var str_ = "";
    for(var ___k in __set){
        str_ = str_ + ___k+"="+__set[___k]+"&";
    }
    return str_.slice(0, -1);
}

function serverComm(url, par_set, post, callback){
    var pars = _get_key_value_str(par_set);
    if(!post){
        url = url+"?"+pars;
    }
    var xhr = createCORSRequest((post ? "POST" :"GET"), encodeURI(url));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.send(pars);
    xhr.onload = function () {
        var responseText = xhr.responseText;
        //console.log(responseText);
        // process the response.
        callback(responseText);
    };

    xhr.onerror = function () {
        console.log('There was an error!');
    };

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
    //console.log("Done loading images!")
}