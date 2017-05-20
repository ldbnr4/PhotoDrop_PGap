var imageAlbum = {
    title: "img",
    date: new Date().toString('dddd, MMMM d, yyyy')
}

function checkNsignin(_username) {
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
    myApp.hidePreloader();
    myApp.showPreloader("Signing in");
    var success = function (data, status, xhr) {
            try {
                myApp.hidePreloader();
                resp = JSON.parse(data)
                if (!resp.err) {
                    USER.id = resp.id;
                    console.log("Successful login")
                    $$("#TFuserName").html(USER.nickname)
                    getAlbums();
                    loadImage(
                        "http://zotime.ddns.net/_PD/photoUploadNEW.php?albumId=591e86a35e5d87785d59b8e2&imageId=591e87035e5d87785c64cd22&userId=591daa6f5e5d87148c6c1954",
                        function (img) {
                            if (img.type === "error") {
                                console.log("Error loading static image from source:"+url);
                            } else {
                                img = loadImage.scale(
                                    img, {
                                        maxWidth: 60,
                                        maxHeight: 60,
                                        downsamplingRatio: 0.4,
                                        contain: true,
                                        crop: true,
                                        canvas: true,
                                        cover: true,
                                    }
                                )
                                // if($$("#profileBox").children().length != 1){
                                //     myApp.alert("attempt to double load image slot", "ERR PROFILE PIC")
                                //     return
                                // }
                                
                                img.setAttribute("style", "border-radius: 50%;")
                                // img.setAttribute("style", "")
                                $$("#profileBox").prepend(img);
                            }
                            
                            $$("#profileBox").on("click", function (e) {myApp.alert("Go to the user's home page")})
                        }, {
                            aspectRatio: 1, 
                        }
                    );
                } else {
                    console.log("LOGIN error: " + resp.msg);
                }
                
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "LOGIN")
            }
    }
    var error = function (xhr, status){
        myApp.hidePreloader();
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
}