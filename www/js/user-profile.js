function goToProfPg() {
    mainView.router.load({
        pageName: 'user-profile',
        query: {
            nickname: USER.Nickname,
            id: USER.ObjectID
        }
    });
}

myApp.onPageReinit('user-profile', profileStart)
myApp.onPageInit('user-profile', profileStart)

function sendDisconnnect(nickname, joined){
    //TODO: make this the standard for success parameters (data, status)
    var success = function(data, status){
        data = JSON.parse(data)
        if (status == 200 && data == "Completed") {
            $$("#profCB").html(
                Template7.templates.profTmplt({
                    name: nickname,
                    memDate: joined,
                    netstat: "ISO",
                })
            )
        }
    }
    postReq("/friend/disconnect",{
        "FRIEND_NICKNAME":nickname
    },success, "send friend request")
}

function sendConnectRequest(nickname, joined){
    //TODO: make this the standard for success parameters (data, status)
    var success = function(data, status){
        data = JSON.parse(data)
        if (status == 200 && data == "Completed") {
            $$("#profCB").html(
                Template7.templates.profTmplt({
                    name: nickname,
                    memDate: joined,
                    netstat: "PEND",
                })
            )
        }
    }
    postReq("/friend/connect",{
        "FRIEND_NICKNAME":nickname
    },success, "send friend request")
}

function acceptConnectRequest(nickname, joined){
    //TODO: make this the standard for success parameters (data, status)
    var success = function(data, status){
        data = JSON.parse(data)
        if (status == 200 && data == "Completed") {
            $$("#profCB").html(
                Template7.templates.profTmplt({
                    name: nickname,
                    memDate: joined,
                    netstat: "FRND",
                })
            )
        }
    }
    postReq("/friend/acpt",{
        "FRIEND_NICKNAME":nickname
    },success, "accept friend request")
}

function declineConnectRequest(nickname, joined){
    //TODO: make this the standard for success parameters (data, status)
    var success = function(data, status){
        data = JSON.parse(data)
        if (status == 200 && data == "Completed") {
            $$("#profCB").html(
                Template7.templates.profTmplt({
                    name: nickname,
                    memDate: joined,
                    netstat: "ISO",
                })
            )
        }
    }
    postReq("/friend/decl",{
        "FRIEND_NICKNAME":nickname
    },success, "decline friend request")
}

function profileStart(page) {
    //TODO: remove the need of uid
    nickname = page.query.nickname
    // console.log(nickname)

    var success = function (data, status, xhr) {
        console.log(data)
        try {
            resp = JSON.parse(data)
        } catch (error) {
            myApp.alert("Got an unexpected response", "ERR(Profile)")
            console.log("Profile data:", data)
        }
        var joined = page.query.joined
        $$("#profCB").html(
            Template7.templates.profTmplt({
                name: nickname,
                memDate: joined,
                netstat: resp,
            })
        )
        if (resp == "OWN") {
            $$("#editProfBtn").show()
            $$("#editProfBtn").attr("style", "display:flex")
            //TODO hide all other buttons
        } else {
            $$("#editProfBtn").hide()
            if (resp == "ISO") {
                click = function() {
                    sendConnectRequest(nickname, joined)
                }
            }
            else if (resp == "FRND") {
                click = function() {
                    sendDisconnnect(nickname, joined)
                }
            }
            else if (resp == "PEND_ACTION"){
                $$("#acceptBtn").click(function(){
                    acceptConnectRequest(nickname, joined)
                })
                $$('#declineBtn').click(function(){
                    declineConnectRequest(nickname, joined)
                })
                return
            }
            else {
                // TODO what is this case?
                // disable $$("#networkActionBtn")
                return
            }
            $$("#networkActionBtn").click(click)
        }
    }

    // TODO: make a loader for server call
    getReq("/friend/relation/" + nickname, {}, success, "load this profile")

    if(!goodParams({Nickname:nickname, UID:USER.ObjectID, ENV:env})){
        myApp.alert("Unable to display user profile")
        return
    }
    loadImage(
        APP_BASE_URL + "/photo/prof/" + nickname + "/" + USER.ObjectID + "/" + env,
        function (img) {
            if (img.type === "error") {
                myApp.alert("Error loading image!", "ERR PROF PIC");
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
                // console.log(img)
                $$("#profilePic").html("")
                img.setAttribute("style", "border-radius: 50%;")
                $$("#profilePic").prepend(img);
            }
        }, {
            aspectRatio: 1,
        }
    );
}

function connect(profid) {
    success = function (data, status, xhr) {
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: " + data, "JSON_ERR CONNECT FRIEND");
        }
        console.log(JResp)
        if (!JResp.err)
            mainView.router.back()
        else
            myApp.alert("Error from server: " + JResp.msg, "SERVER ERR CONNECT FRIEND")
    }

    postReq(USER_SERVICE, {
        CONNECT_REQ: true,
        UID: USER.ObjectID,
        PROF_ID: profid
    }, success, "send connect request to user")
}

function disconnect(profName) {
    success = function (data, status, xhr) {
        try {
            var JResp = JSON.parse(data);
            USER.Friends = JSON.parse(JResp.friends)
            mainView.router.back()
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: " + data, "JSON_ERR DISCONNECT FRIEND");
        }
        console.log(JResp)
    }

    postReq(USER_SERVICE, {
        DISCONNECT_FRIEND: true,
        UID: USER.ObjectID,
        FRIEND_NAME: profName
    }, success, "disconnect from user")
}

function clearSearch() {
    $$("#userSearchLB").html("")
    mySearchbar.clear()
}