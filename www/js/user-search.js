var mySearchbar = myApp.searchbar('#user-search-bar', {
    customSearch: true,
    onSearch: function (s) {
        search4Handle(s)
    }
});

function search4Handle(handle) {
    var success = function (data, status, xhr) {
        var JResp = parseJson(data, "USER SEARCH")
        
        // $$(".searchbar-overlay").hide()
        $$("#userSearchLB").html("")
        if (JResp) {
            JResp.forEach(function (element, i) {
                $$("#userSearchLB").append(
                    Template7.templates.userListTmplt({
                        name: element.Nickname,
                        i: i
                    })
                )

                $$(`#user_${i}`).click(function () {
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
        // console.log("Done!")
    }

    // If the search is not empty check
    if (handle.query)
        getReq(`/user/s/${handle.query}`, {}, success, "search for user")

}