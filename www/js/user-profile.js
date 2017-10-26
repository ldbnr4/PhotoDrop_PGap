function goToProfPg() {
    mainView.router.load({
        pageName: 'user-profile',
        query: {
            nickname: USER.nickname,
            id: USER.id
        }
    });
}

myApp.onPageReinit('user-profile', profileStart)
myApp.onPageInit('user-profile', profileStart)

function profileStart(page) {
    // console.log(page)
    uid = null
    nickname = null
    if (page.query.id == USER.id) {
        uid = USER.id
        nickname = USER.nickname
        $$("#editProfBtn").attr("style", "display:flex")
    } else {
        uid = page.query.id
        nickname = page.query.nickname
        $$("#editProfBtn").hide()
    }

    $$("#profCB").html(
        Template7.templates.profTmplt({
            name: nickname,
            memDate: USER.joined,
            netstat: null,
            id: uid
        })
    )

    loadImage(
        APP_BASE_URL + "/user/"+ uid,
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
        UID: USER.id,
        PROF_ID: profid
    }, success, "send connect request to user")
}

function disconnect(profName) {
    success = function (data, status, xhr) {
        try {
            var JResp = JSON.parse(data);
            USER.friends = JSON.parse(JResp.friends)
            mainView.router.back()
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: " + data, "JSON_ERR DISCONNECT FRIEND");
        }
        console.log(JResp)
    }

    postReq(USER_SERVICE, {
        DISCONNECT_FRIEND: true,
        UID: USER.id,
        FRIEND_NAME: profName
    }, success, "disconnect from user")
}

function clearSearch() {
    $$("#userSearchLB").html("")
    mySearchbar.clear()
}