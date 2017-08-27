var mySearchbar = myApp.searchbar('#user-search-bar', {
    customSearch:true,
    onSearch: function(s){
        search4Handle(s)
    }
});

function search4Handle(handle) {
    var success = function (data, status, xhr) {
        try {
            var JResp = JSON.parse(data);
            if (JResp.err == false) {
                // $$(".searchbar-overlay").hide()
                $$("#userSearchLB").html("")
                JResp.result.forEach(function (element) {
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
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR USER SEARCH");
            console.log(error)
            console.log("Data: " + data)
            console.log("Status: " + status)
            console.log("XHR: " + xhr)
        }
    }

    // If the search is not empty check
    if (handle.query)
        getReq(USER_SERVICE, {
            USER_SEARCH: true,
            nickname: handle.query
        }, success, "search for user")

}