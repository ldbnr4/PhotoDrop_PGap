// var friendSearchBar = myApp.searchbar('#friend-searchbar', {
//     searchList: '#friends-list-block',
//     searchIn: '.friend-name'
// });

myApp.onPageInit('friends', loadFriends)
myApp.onPageReinit('friends', loadFriends)

function loadFriends(page) {
    myApp.showPreloader("Loading friends")
    $$("#friendReqs-list-block").html("")
    $$("#friends-list-block").html("")
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
            // console.log(JResp)
        } catch (error) {
            myApp.alert("Did not recieve json response.", "ERR FRIENDS");
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

    postReq(USER_SERVICE, {
        LOAD_FRNDS: true,
        UID: USER.id
    }, success, "load friends")
}

function acceptReq(id) {
    myApp.showPreloader("Accepting friendship");
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response.", "ERR FRIENDS");
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
    var err = function (xhr, status) {
        myApp.hidePreloader();
        myApp.alert("Failed to get user profile.", "ERR FRIENDS")
    }
    $$.post(USER_SERVICE, {
        ACPT_REQ: true,
        UID: USER.id,
        FRND_ID: id
    }, success, err)
}

function declineReq(id) {
    myApp.showPreloader("Declining friendship");
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            var JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response.", "ERR FRIENDS");
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
    postReq(USER_SERVICE, {
        DEC_REQ: true,
        UID: USER.id,
        FRND_ID: id
    }, success, "decline friend request")
}