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
                    console.log("Data: "+data)
                    console.log("Status: "+status)
                    console.log("XHR: "+xhr)
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
    serverComm(USER_SERVICE, {
            LOGIN: true,
            username: USER.username,
            password: USER.password
        }, true,
        function (resp) {
            try {
                resp = JSON.parse(resp)
                if (!resp.err) {
                    USER.id = resp.id;
                    console.log("Successful login")
                    getAlbums();
                } else {
                    console.log("LOGIN error: " + resp.msg);
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "LOGIN")
            }
        }
    )
}