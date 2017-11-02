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

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }

function getReq(url, params, callback, actionName){
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR GET REQUEST")
        console.log(`XHR: ${JSON.stringify(xhr)}`);
    }
    $$.get(`${APP_BASE_URL}${url}`, params, callback, error)
}

function postReq(url, params, callback, actionName){
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR POST REQUEST")
        console.log(`XHR: ${JSON.stringify(xhr)}`);
    }

    $$.post(`${APP_BASE_URL}${url}`, params, callback, error)
}