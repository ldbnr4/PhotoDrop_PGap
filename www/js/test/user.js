var imageAlbum = {
    title: "img",
    date: new Date().toString('dddd, MMMM d, yyyy')
}

function checkForUsername(_username) {
// Check for a username
    var success = function (data) {
            if(data.length == 0){
                console.log("No user found, I'ts all yours!");
                // myApp.alert("No user found, I'ts all yours!");
                createNewUser(USER_SERVICE, USER.username, USER.password)
            }
            else{
                try{
                    var resp = JSON.parse(data);
                    if(resp.err){
                        myApp.alert("Error in response: "+resp.msg,"ERR FIND_USER");
                    }
                    else if(resp) {
                        // myApp.alert("Username taken :(");
                        console.log("Username taken :(");             
                        login();
                    }else{
                        myApp.alert("FIND_USER resp: " + resp, "ERR FIND_USER")
                    }
                }catch(err){
                    myApp.alert("Did not recieve json response. Resp: "+err,"ERR FIND_USER");
                }
            }
    }
    var error = function (xhr, status){
        myApp.alert("Failed to search for username.", "ERR FIND_USER")
        console.log(xhr);
        $$("#debugBox").html("XHR: "+JSON.stringify(xhr));
        console.log(status);
        myApp.alert("STATUS: "+status);
    }
    // serverComm(USER_SERVICE, {FIND_USER: true, username: _username}, false, success, error)
    $$.get(USER_SERVICE, {FIND_USER: true, username: _username}, success, error)
}

function login() {
    myApp.showPreloader();
    var success = function (data, status, xhr) {
            try {
                resp = JSON.parse(data)
                if (!resp.err) {
                    USER.id = resp.id;
                    console.log("Successful login")
                    getAlbums();
                } else {
                    console.log("LOGIN error: " + resp.msg);
                }
                myApp.hidePreloader();
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "LOGIN")
            }
    }
    var error = function (xhr, status){
        myApp.alert("Failed to send photo.", "ERR NEW_PHOTO")
        console.log("XHR: "+xhr);
        console.log("STATUS: "+status);
    }

    $$.post(
        USER_SERVICE,
        {
            LOGIN: true,
            username: USER.username,
            password: USER.password
        },
        success,
        error)
    return
}