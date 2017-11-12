myApp.onPageInit('home', homePgSetup)
myApp.onPageReinit('home', homePgSetup)

$$('#homePgCntnt').on('ptr:refresh', function (e) {
    getAlbums()
    myApp.pullToRefreshDone()
})

function homePgSetup() {
    $$("#TFuserName").html(USER.Nickname)
    fillAlbums()
    if(!goodParams({Nickname:USER.Nickname, UID:USER.ObjectID, ENV: env})){
        myApp.alert("Unable to display home page.")
        return
    }
    loadImage(
        APP_BASE_URL + "/photo/prof/" + USER.Nickname + "/" + USER.ObjectID + "/" + env,
        function (img) {
            if (img.type === "error") {
                myApp.alert("Error loading image!", "ERR PROF PIC");
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

function fillAlbums(){
    $$("#albumListContain").html("")
    if(USER.CreatedAlbums && Object.keys(USER.CreatedAlbums).length === 0){
        //TODO indicate they should add one :)
        console.log("This user doesn't have any albums")
    }
    if(USER.TaggedAlbums && Object.keys(USER.TaggedAlbums).length === 0){
        //TODO indicate they should be tagged one :)
        console.log("This user isn't tagged in any albums")
    }
    for (var key in USER.CreatedAlbums){
        var aid = key
        var element = USER.CreatedAlbums[key]
        var template = Template7.templates.albumListTmplt({
            title: element.Title,
            flag: true,
            id: aid
        })
        $$("#albumListContain").append(template)
        $$("#album_"+aid).click(function(){
            mainView.router.load({
                pageName: 'album',
                query: {
                    title: element.Title,
                    id: aid
                }
            })
        })
        $$("#swipeout_"+aid).on('swipeout:deleted', function () {
            console.log("Deleting album")
            delete_album()
        })
    }
    //TODO: create views for tagged albums
    //TODO: look into suggesting friends to tag :)
}

function getAlbums() {
    myApp.hidePreloader()
    myApp.showPreloader("Gathering albums...")
    $$("#albumListContain").html("")
    var success = function (data, status, xhr) {
        myApp.hidePreloader()
        var resp
        try {
            resp = JSON.parse(data)
        } catch (err) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR GET_ALBUMS")
        }
        if (hasError(resp.Error)) {
            myApp.alert("Error in response: " + resp.msg, "ERR GET_ALBUMS")
        } else {
            USER.CreatedAlbums = resp.CreatedAlbums
            USER.TaggedAlbums = resp.TaggedAlbums
            fillAlbums()
        }
    }
    getReq("/albums", {}, success, "to get albums")
}

function delete_album(albumId) {
    myApp.hidePreloader();
    myApp.showPreloader("Deleting album");
    var success = function (data, status, xhr) {
        try {
            myApp.hidePreloader();
            var resp = JSON.parse(data);
            if (resp.err) {
                myApp.alert("Response error message: " + resp.msg, "ERR DEL_ALBUM");
            } else {
                console.log("Deleted album")
            }
        } catch (err) {
            myApp.alert("Did not recieve json response. Resp: " + err, "ERR DEL_ALBUM");
            console.log("Data: " + data)
            console.log("Status: " + status)
            console.log("XHR: " + xhr)
        }
    }
    postReq(
        "/del/album", {
            UID: USER.ObjectID,
            AID: albumId
        }, success, "to delete album")
}