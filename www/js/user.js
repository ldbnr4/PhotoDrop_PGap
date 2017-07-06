function checkNsignin(_username) {
    // Check for a username
    var success = function (data) {
        if (data.length == 0) {
            console.log("No user found, I'ts all yours!");
            // myApp.alert("No user found, I'ts all yours!");
            createNewUser(USER_SERVICE, USER.username, USER.password)
        } else {
            try {
                var resp = JSON.parse(data);
                if (resp.err) {
                    myApp.alert("Error in response: " + resp.msg, "ERR FIND_USER");
                } else if (resp) {
                    // myApp.alert("Username taken :(");
                    console.log("Username taken :(");
                    login();
                } else {
                    myApp.alert("FIND_USER resp: " + resp, "ERR FIND_USER")
                }
            } catch (err) {
                myApp.alert("Did not recieve json response. Resp: " + err, "ERR FIND_USER");
            }
        }
    }
    var error = function (xhr, status) {
        myApp.alert("Failed to search for username.", "ERR FIND_USER")
        console.log(xhr);
        $$("#debugBox").html("XHR: " + JSON.stringify(xhr));
        console.log(status);
        myApp.alert("STATUS: " + status);
    }
    // serverComm(USER_SERVICE, {FIND_USER: true, username: _username}, false, success, error)
    $$.get(USER_SERVICE, {
        FIND_USER: true,
        username: _username
    }, success, error)
}

function _setUSER(_username, _password, _email) {
    ALBUM = {};
    albumPhotos = [];
    USER = {
        nickname: _username,
        username: encryptStr(_username),
        password: encryptStr(_password),
        pswrd_plain: _password,
        albums: [],
        urn_albums: [],
        email:_email
    }
}

function goToHomePg() {
    $$("#TFuserName").html(USER.nickname)
    getAlbums();
    loadImage(
        USER_SERVICE+"?PROF_PIC=true&uid="+USER.id,
        function (img) {
            if (img.type === "error") {
                myApp.alert("Error loading image!","ERR PROF PIC");
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
                $$("#profPicThumb").html("")
                img.setAttribute("style", "border-radius: 50%;")
                $$("#profPicThumb").prepend(img);
            }

            $$("#profileBox").on("click", function (e) {

                // myApp.alert("Go to the userf's home page")
            })
            mainView.router.load({
                pageName: 'home'
            });
            myApp.hidePreloader();
        }, {
            aspectRatio: 1,
        }
    );
}

function login(_username, _password) {
    _setUSER(_username, _password)
    myApp.hidePreloader();
    myApp.showPreloader("Signing in");
    var success = function (data, status, xhr) {
        try {
            resp = JSON.parse(data)
            if (!resp.err) {
                USER.id = resp.id;
                console.log("Successful login "+resp.id)
                goToHomePg()
            } else {
                myApp.hidePreloader();
                console.log("LOGIN error: " + resp.msg);
            }

        } catch (error) {
            myApp.alert("Got an unexpected response: " + resp, "RESP LOGIN")
        }
    }
    var error = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to login.", "ERR LOGIN")
        console.log("XHR: " + xhr);
        console.log("STATUS: " + status);
    }

    $$.post(
        USER_SERVICE, {
            LOGIN: true,
            username: USER.username,
            password: USER.password
        },
        success,
        error)
}

function createNewUser(_url, _username, _password, _email) {
    _setUSER(_username,_password)
    myApp.hidePreloader()
    myApp.showPreloader("Creating a new user...")
    // Create A User
    var success = function (data, status, xhr) {
            try {
                    myApp.hidePreloader();
                    var JResp = JSON.parse(data);
                    if (JResp.err == false) {
                        console.log("Successfully created a new user!")
                        USER.id = JResp.id;
                        goToHomePg()
                    } else {
                        myApp.alert("Error message: " + JResp.msg, "ERR ADD USER");
                    }
                } catch (error) {
                    myApp.alert("Did not recieve json response. Resp: "+data,"ERR ADD USER");
                    console.log("Data: "+data)
                    console.log("Status: "+status)
                    console.log("XHR: "+xhr)
                }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to create a user.", "ERR ADD USER")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }
    // serverComm(_url, {ADD_USER: true, USERNAME:_username, PASSWORD:_password}, success, err)
    $$.post(_url, {ADD_USER: true, USERNAME:USER.username, PASSWORD:USER.password, EMAIL:USER.email, NICKNAME:USER.nickname}, success, err)
}

function getProfileInfo(){
    var success = function (data, status, xhr) {
        try {
                myApp.hidePreloader();
                var JResp = JSON.parse(data);
                if (JResp.err == false) {
                    checkNset($$("#profile-unm"), USER.nickname)
                    checkNset($$("#profile-eml"), JResp.email)
                    checkNset($$("#profile-pswrd"), USER.pswrd_plain)
                } else {
                    myApp.alert("Error message: " + JResp.msg, "ERR PROFILE");
                }
            } catch (error) {
                myApp.alert("Did not recieve json response. Resp: "+data,"ERR PROFILE");
                console.log(error)
                console.log("Data: "+data)
                console.log("Status: "+status)
                console.log("XHR: "+xhr)
            }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR PROFILE")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }
    $$.post(USER_SERVICE, {EDIT_PROFILE: true, USERNAME:USER.username, PASSWORD:USER.password}, success, err)
}

function checkNset(tag, value){
    if(!value){
        console.log("Empty value for tag: "+tag)
    }
    else{
        tag.val(value)
        tag.addClass('not-empty-state')
        tag.parent().addClass('not-empty-state')
        tag.parent().parent().addClass('not-empty-state')
    }
}

function search4Handle(handle){
    var success = function (data, status, xhr) {
        try {
            var JResp = JSON.parse(data);
            if (JResp.err == false) {
                // $$(".searchbar-overlay").hide()
                $$(".searchbar-found").html("")
                JResp.result.forEach(function(element) {
                    _date = element.joined['date'].split(" ")[0]
                    console.log(_date)
                    dt = element.joined['date'].split(" ")[0].split("-")
                    // year = 2044
                    // month = "Jan"
                    year = dt[0]
                    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                    month = months[Number(dt[1])-1]
                    console.log(month)
                    $$(".searchbar-found").append(
                        Template7.templates.userListTmplt({
                            name: element.nickname,
                            joined: month + " " + year
                        })
                    )
                })
                console.log("Done!")
            } else {
                myApp.alert("Error message: " + JResp.msg, "ERR USER SEARCH");
            }
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: "+data,"ERR USER SEARCH");
            console.log(error)
            console.log("Data: "+data)
            console.log("Status: "+status)
            console.log("XHR: "+xhr)
        }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR USER SEARCH")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }
    
    if(handle.query)
        $$.get(USER_SERVICE, {USER_SEARCH: true, nickname:handle.query}, success, err)

}