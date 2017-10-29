var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var encryptStr = function(str){
    return md5(str)
}

var hasError = function (someObject){
    for (var key in someObject) {
        // skip loop if the property is from prototype
        if (!someObject.hasOwnProperty(key)) continue;

        var obj = someObject[key];
        if (obj) return true
    }
    return false
}

// Make this the standard
var parseJson = function (data, action) {
    try {
        var JResp = JSON.parse(data);
    } catch (error) {
        myApp.alert("Did not recieve json response. Resp: " + data, "ERROR "+action);
        console.log(error)
        console.log("Data: " + data)
    }
    return JResp
}