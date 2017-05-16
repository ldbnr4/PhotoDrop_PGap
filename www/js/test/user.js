var imageAlbum = {
    title: "img",
    date: new Date().toString('dddd, MMMM d, yyyy')
}

function checkForUsername(_username) {
// Check for a username
    serverComm(USER_SERVICE, {
            FIND_USER: true,
            username: _username
        }, false,
        function (resp) {
            try {
                switch (JSON.parse(resp)) {
                    //console.log(resp);
                    case 1:
                        console.log("Username taken :(");
                        break;
                    case 0:
                        console.log("I'ts all yours!");
                        break;
                    default:
                        console.log("FIND_USER resp: " + resp)
                        break;
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "FIND_USER")
            }
        },
        "Failed to check for username."
    )
}

function login() {
    serverComm(USER_SERVICE, {
            LOGIN: true,
            username: USER.username,
            password: USER.password
        }, true,
        function (resp) {
            try {
                resp = JSON.parse(resp)
                if (!resp.err) {
                    USER.id = resp.id;
                    console.log("Successful login")
                    //addNewAlbum(imageAlbum);
                    fillAlbumLists();
                    //delete_album("img");
                } else {
                    console.log("LOGIN error: " + resp.msg);
                }
            } catch (error) {
                myApp.alert("Got an unexpected response: " + resp, "LOGIN")
            }
        }
    )
}