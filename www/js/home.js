myApp.onPageInit('home', homePgSetup)
myApp.onPageReinit('home', homePgSetup)

$$('#homePgCntnt').on('ptr:refresh', function (e) {
    getAlbums()
    myApp.pullToRefreshDone()
})

function homePgSetup() {
    $$("#TFuserName").html(USER.nickname)
    getAlbums();
    loadImage(
        APP_BASE_URL + "/user/pic/" + USER.id,
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
            USER.albums = resp.CreatedAlbums
            USER.tagged = resp.TaggedAlbums
            if(!USER.albums || !(USER.albums.length > 0)){
                //TODO indicate they should add one :)
                console.log("This user doesn't have any albums")
                console.log("Resp")
                console.log(resp)
                console.log("User")
                console.log(USER)
                return
            }
            console.log("TODO: I need to use the full elements")
            console.log(USER.albums)
            USER.albums.forEach(function(element) {
                var aid = element.AID
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
            });
            //TODO: create views for tagged albums
            //TODO: look into suggesting friends to tag :)
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
            UID: USER.id,
            AID: albumId
        }, success, "to delete album")
}