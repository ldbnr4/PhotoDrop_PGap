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
    console.log(USER)
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
            respU = JSON.parse(resp.user)
        } catch (error) {
            myApp.hidePreloader();
            myApp.alert("Got an unexpected response: " + resp, "RESP LOGIN")
        }
        if (!resp.err) {
            // console.log(respU)
            USER.id = resp.id;
            USER.email = resp.email
            USER.joined = getMemDate(resp.joined)
            USER.friends = respU.friends
            // console.log("Successful login "+resp.id)
            goToHomePg()
        } else {
            myApp.hidePreloader();
            console.log("LOGIN error: " + resp.msg);
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
    _setUSER(_username,_password,_email)
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
    $$.post(USER_SERVICE, {USER_EMAIL: true, USERNAME:USER.username, PASSWORD:USER.password}, success, err)
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
                $$("#userSearchLB").html("")
                JResp.result.forEach(function(element) {
                    $$("#userSearchLB").append(
                        Template7.templates.userListTmplt({
                            name: element.nickname,
                            id: element._id.$oid
                        })
                    )
                })
                // console.log("Done!")
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
    
    // If the search is not empty check
    if(handle.query)
        $$.get(USER_SERVICE, {USER_SEARCH: true, nickname:handle.query}, success, err)

}

function updtUserProf(formData){
    formData.nickname = formData.username
    formData.username = encryptStr(formData.nickname)
    formData.pswrd_plain = formData.password
    formData.password = encryptStr(formData.password)

    success = function(data, status, xhr){
        myApp.hidePreloader();
        console.log("FORM_DATA: "+formData)
        console.log("RESP_DATA: "+data)
        USER.email = formData.email
        USER.nickname = formData.nickname
        USER.pswrd_plain = formData.pswrd_plain
        USER.username = formData.username
        USER.password = formData.password
        $$("#TFuserName").html(USER.nickname)
        mainView.router.load({
            pageName: 'user-profile',
        });
    }
    error = function(xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to update user profile.", "ERR USER UPDATE")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }

    $$.post(USER_SERVICE, {EDIT_PROFILE: true, USERNAME:USER.username, PASSWORD:USER.password, FORM_DATA: JSON.stringify(formData)}, success, error)    
}

function getMemDate(date){
    dt = date.split(" ")[0].split("-")
    year = dt[0]
    MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    month = MONTHS[Number(dt[1])-1]
    return month + " " + year
}

function disconnect(profName){
    success = function(data, status, xhr){
        try{
            var JResp = JSON.parse(data);
            USER.friends = JSON.parse(JResp.friends)
            mainView.router.back()
        }catch(error){
            myApp.alert("Did not recieve json response. Resp: "+data,"JSON_ERR DISCONNECT FRIEND");
        }
        console.log(JResp)
    }
    error = function(xhr, status){
        myApp.alert("Failed to diconnect from user.", "ERR DISCONNECT FRIEND")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }

    $$.post(USER_SERVICE, {DISCONNECT_FRIEND: true, UID:USER.id, FRIEND_NAME : profName}, success, error)    
}

function goToProfPg(){
    mainView.router.load({
        pageName: 'user-profile',
        query:{
            nickname : USER.nickname,
            id : USER.id
        }
    });
}

function connect(profid){
    success = function(data, status, xhr){
        try{
            var JResp = JSON.parse(data);
        }catch(error){
            myApp.alert("Did not recieve json response. Resp: "+data,"JSON_ERR CONNECT FRIEND");
        }
        console.log(JResp)
        if(!JResp.err)
            mainView.router.back()
        else
            myApp.alert("Error from server: "+JResp.msg, "SERVER ERR CONNECT FRIEND")
    }
    error = function(xhr, status){
        myApp.alert("Failed to diconnect from user.", "ERR CONNECT FRIEND")
        myApp.alert("XHR: "+JSON.stringify(xhr));
        myApp.alert("STATUS: "+status);
    }

    $$.post(USER_SERVICE, {CONNECT_REQ: true, UID:USER.id, PROF_ID : profid}, success, error)    
}

function clearSearch(){
    $$("#userSearchLB").html("")
    mySearchbar.clear()
}

function profileStart(page) {
    // console.log(page)
    uid = null
    nickname = null
    if(page.query.id == USER.id){
        uid = USER.id
        nickname = USER.nickname
        $$("#editProfBtn").attr("style", "display:flex")
    }
    else{
        uid = page.query.id
        nickname = page.query.nickname
        $$("#editProfBtn").hide()
    }

    getProfile(nickname, uid)

    loadImage(
        USER_SERVICE+"?PROF_PIC=true&uid="+uid,
        function (img) {
            if (img.type === "error") {
                myApp.alert("Error loading image!","ERR PROF PIC");
            } else {
                img = loadImage.scale(
                    img, {
                        maxWidth: 200,
                        maxHeight: 200,
                        downsamplingRatio: 0.4,
                        contain: true,
                        crop: true,
                        canvas: true,
                        cover: true,
                    }
                )
                $$("#profilePic").html("")
                img.setAttribute("style", "border-radius: 50%;")
                $$("#profilePic").prepend(img);
            }
        }, {
            aspectRatio: 1,
        }
    );
}

function getProfile(nickname, uid){
    myApp.showPreloader("Loading profile");
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response.","ERR GET PROFILE");
            console.log(error)
            console.log(data)
        }
        if (JResp.err == false) {
            // console.log(JResp)
            $$("#profCB").html(
                Template7.templates.profTmplt({
                    name: nickname,
                    memDate: getMemDate(JResp.joined),
                    netstat: JResp.netstat,
                    id: uid
                })
            )

        } else {
            myApp.alert("Error message: " + JResp.msg, "ERR PROFILE");
        }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR PROFILE")
    }
    $$.post(USER_SERVICE, {GET_PROF: true, UID:USER.id, PROF_ID:uid}, success, err)
}

function loadFriends(page){
    myApp.showPreloader("Loading friends")
    $$("#friendReqs-list-block").html("")
    $$("#friends-list-block").html("")
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
            // console.log(JResp)
        } catch (error) {
            myApp.alert("Did not recieve json response.","ERR FRIENDS");
            console.log(error)
            console.log(data)
        }

        if (JResp.err == false) {
            // console.log(friendReqList)
            // console.log(JResp)
            // JResp.result.forEach(function(elem){
            //     console.log(elem.id['$oid'])
            // })
            $$("#friendReqs-list-block").html(
                Template7.templates.friendReqTmplt({
                    friendReqs: JResp.friendReqs
                })
            )
            $$("#friends-list-block").html(
                Template7.templates.friendListTmplt({
                    friends: JResp.friends
                })
            )
        } else {
            myApp.alert("Error message: " + JResp.msg, "ERR FRIENDS");
        }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR FRIENDS")
    }
    $$.post(USER_SERVICE, {LOAD_FRNDS: true, UID:USER.id}, success, err)
}

function acceptReq(id){
    myApp.showPreloader("Accepting friendship");
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response.","ERR FRIENDS");
            console.log(error)
            console.log(data)
        }
        if (JResp.err == false) {
            mainView.router.load({
                pageName: 'friends'
            });
        } else {
            myApp.alert("Error message: " + JResp.msg, "ERR FRIENDS");
        }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR FRIENDS")
    }
    $$.post(USER_SERVICE, {ACPT_REQ: true, UID:USER.id, FRND_ID:id}, success, err)
}

function declineReq(id){
    myApp.showPreloader("Declining friendship");
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response.","ERR FRIENDS");
            console.log(error)
            console.log(data)
        }
        if (JResp.err == false) {
            mainView.router.load({
                pageName: 'friends'
            });
        } else {
            myApp.alert("Error message: " + JResp.msg, "ERR FRIENDS");
        }
    }
    var err = function (xhr, status){
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR FRIENDS")
    }
    $$.post(USER_SERVICE, {DEC_REQ: true, UID:USER.id, FRND_ID:id}, success, err)
}