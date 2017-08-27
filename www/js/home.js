myApp.onPageInit('home', homePgSetup)
myApp.onPageReinit('home', homePgSetup)

function homePgSetup() {
    $$("#TFuserName").html(USER.nickname)
    getAlbums();
    loadImage(
        USER_SERVICE + "?PROF_PIC=true&uid=" + USER.id,
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
    var success = function (data, status, xhr) {
        myApp.hidePreloader()
        try {
            var resp = JSON.parse(data)
            if (resp.err) {
                myApp.alert("Error in response: " + resp.msg, "ERR GET_ALBUMS")
            } else {
                USER.albums = resp.albums
                //console.log(USER.albums)
                // USER.urn_albums = resp.urn_albums;

                $$("#albumListContain").html(
                    Template7.templates.albumListTmplt({
                        flag: true,
                        album: USER.albums
                    })
                )

                // $$("#URN_albumListContain").html(
                //     Template7.templates.albumListTmplt({
                //         flag: false,
                //         album: USER.urn_albums
                //     })
                // );

                // console.log(USER.albums)

                // TODO: Change swipeout to be more specific 
                $$(".swipeout").on('swipeout:deleted', function () {
                    for (var i = 0; i < this.children.length; i++) {
                        if (this.children[i].tagName == "INPUT") {
                            delete_album(this.children[i].getAttribute("value"))
                        }
                    }
                })
            }
        } catch (err) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR GET_ALBUMS")
        }
    }
    getReq(USER_SERVICE, {
        GET_ALBUMS: true,
        USER_ID: USER.id
    }, success, "to get albums")
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
        USER_SERVICE, {
            DEL_ALBUM: true,
            USER_ID: USER.id,
            ALBUM_ID: albumId
        }, success, "to delete album")
}