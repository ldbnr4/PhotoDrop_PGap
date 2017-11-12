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
        //TODO update USER with response
        if (!JResp.FriendReqs) {
            // <li class="item-content">
            //      <div class="item-inner">
            //         <div class="item-title" style="width: 100%;">No friend requests</div>
            //      </div>
            // </li>   
        } else {
            JResp.FriendReqs.forEach(function (element, i) {
                // console.log(element)
                $$("#friendReqs-list-block").append(
                    Template7.templates.friendReqTmplt({
                        name: element.Nickname,
                        index: i
                    })
                )
                $$("#frienReq_"+i).click(function () {
                    console.log(element.Nickname)
                    mainView.router.load({
                        pageName: 'user-profile',
                        query: {
                            nickname: element.Nickname,
                            joined: element.Joined
                        }
                    });
                })
                $$("#swipe_left_"+i).click(function () {
                    acceptReq(element.Nickname)
                })
                $$("#swipe_right_"+i).click(function () {
                    declineReq(element.Nickname)
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
            JResp.Friends.forEach(function (element, i) {
                // console.log(element)
                $$("#friends-list-block").append(
                    Template7.templates.friendListTmplt({
                        name: element.Nickname,
                        index: i
                    })
                )
                $$("#friend_"+i).click(function () {
                    mainView.router.load({
                        pageName: 'user-profile',
                        query: {
                            nickname: element.Nickname,
                            joined: element.Joined
                        }
                    });
                })
            })
        }
    }

getReq("/friends/"+USER.ObjectID, {}, success, "load friends")
}

function acceptReq(nickname) {
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
        if (JResp == "Completed") {
            mainView.router.load({
                pageName: 'friends'
            });
        }
    }
    postReq("/friend/acpt",{
        "FRIEND_NICKNAME":nickname
    },success, "accept friend request")
}

function declineReq(nickname) {
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
        if(JResp == "Completed"){
            mainView.router.load({
                pageName: 'friends'
            });
        }
    }
    postReq("/friend/decl",{
        "FRIEND_NICKNAME":nickname
    },success, "decline friend request")
}