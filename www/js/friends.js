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

        if (!JResp.FriendReqs) {
            // <li class="item-content">
            //      <div class="item-inner">
            //         <div class="item-title" style="width: 100%;">No friend requests</div>
            //      </div>
            // </li>   
        } else {
            JResp.FriendReqs.forEach(function (element, i) {
                $$("#friendReqs-list-block").append(
                    Template7.templates.friendReqTmplt({
                        index: i,
                        name: element.Name
                    })
                )
                $$("#frienReq_"+i).click(function () {
                    mainView.router.load({
                        pageName: 'user-profile',
                        query: {
                            nickname: element.Name,
                            id: element.ID
                        }
                    });
                })
                $$("#swipe_left_"+i).click(function () {
                    acceptReq(element.ID)
                })
                $$("#swipe_right_"+i).click(function () {
                    declineReq(element.ID)
                })
            });
        }
        if (!JResp.Friends) {
            // <li class="item-content">
            //     <div class="item-inner">
            //         <div class="item-title" style="width: 100%;">No friends</div>
            //     </div>
            // </li>
        } else {
            JResp.Friends.forEach(function (element) {
                $$("#friends-list-block").append(
                    Template7.templates.friendListTmplt({
                        name: element.Name
                    })
                )
                $$("#friend_"+i).click(function () {
                    mainView.router.load({
                        pageName: 'user-profile',
                        query: {
                            nickname: element.Name,
                            id: element.ID
                        }
                    });
                })
            })
        }
    }

getReq("/friends/"+USER.ObjectID, {}, success, "load friends")
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
    postReq("/friend/acpt/", {FUID: id}, success, "accept friend request")
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
    postReq("/friend/decl", {FUID:id}, success, "decline friend request")
}