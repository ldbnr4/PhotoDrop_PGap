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

function getReq(url, params, callback, actionName){
    var method = 'GET'
    sendRequest(method, url, params, callback, actionName)
}

function postReq(url, params, callback, actionName){
    var method = 'POST'
    sendRequest(method, url, params, callback, actionName)

    // $$.post(`${APP_BASE_URL}${url}`, params, callback, error)
}

function putReq(url, params, callback, actionName){
    var method = 'PUT'
    sendRequest(method, url, params, callback, actionName)
}


function goodParams(params){
    for(var propertyName in params) {
        if(params[propertyName] == undefined || params[propertyName] == ""){
            console.log("Tried to send an empty property "+propertyName+" in parameters "+params)
            return false
        }
     }
     return true
}

function sendRequest(method, url, params, success, actionName){
    if(!goodParams(params)){
        console.log("Route was "+url)
        return
    }
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR "+method+"REQUEST")
        console.log("XHR:");
        console.log(xhr);
    }

    var parameters = {
        url: APP_BASE_URL+url,
        method: method,
        data: params,
        success: success,
        error: error,
        beforeSend : function(xhr){
            setUpHeaders(xhr, url, method)
        }
    }
    $$.ajax(parameters)
}

//TODO: make "/user" a constant
// TODO: ...Make User a f$#^@ class or something already
function setUpHeaders(xhr, url, method){
    var loginEx = (url === "/user" && method === "GET")
    var signUpEx = (url === "/user" && method === "PUT")
    xhr.setRequestHeader("ENV", env)
    if (!(loginEx || signUpEx)){
        xhr.setRequestHeader("UID", USER.id)
    }
}