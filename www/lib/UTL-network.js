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
    errorCheckParams(params)
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR GET REQUEST")
        console.log(`XHR: ${JSON.stringify(xhr)}`);
    }
    var some = $$.get(`${APP_BASE_URL}${url}`, params, callback, error)
    console.log(some)
}

function postReq(url, params, callback, actionName){
    errorCheckParams(params)
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR POST REQUEST")
        console.log(`XHR: ${JSON.stringify(xhr)}`);
    }

    $$.post(`${APP_BASE_URL}${url}`, params, callback, error)
}

function putReq(url, params, callback, actionName){
    errorCheckParams(params)
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to "+actionName, "ERROR PUT REQUEST")
        console.log("XHR:");
        console.log(xhr);
    }

    var parameters = {
        url: APP_BASE_URL+url,
        method: 'PUT',
        data: params,
        success: callback,
        error: error
    }
    $$.ajax(parameters)

    // $$.post(`${APP_BASE_URL}${url}`, params, callback, error)
}

function errorCheckParams(params){
    for(var propertyName in params) {
        if(params[propertyName] == undefined || params[propertyName] == ""){
            console.log(`Sent an empty property ${propertyName} in parameters ${params}`)
        }
     }
}