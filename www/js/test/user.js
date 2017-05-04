// Create A User
serverComm(USER_SERVICE,{ADD_USER:true, username:USER._id, new_user:JSON.stringify(USER)},true,
    function(resp){
        try {
            switch (JSON.parse(resp)) {
                case 0:
                    console.log("DB did not insert.")
                    break;
                case 1:
                    console.log("Created a user!");
                    break;
                case 2:
                    console.log("User already exist.");
                    break;
                default:
                    console.log("ADD_USER resp: "+resp);
                    break;
            }
        } catch (error) {
            myApp.alert("Got an unexpected response: "+resp, "ADD_USER")
        }
    },
    "Failed to create a user."
)

// Check for a username
var test_name = USER._id;
//test_name = "test";
serverComm(USER_SERVICE,{FIND_USER:true, username:test_name}, false,
    function (resp){
        try{
                switch(JSON.parse(resp)){
                //console.log(resp);
                case 1:
                    console.log("Username taken :(");
                    break;
                case 0:
                    console.log("I'ts all yours!");
                    break;
                default:
                    console.log("FIND_USER resp: "+resp)
                    break;
            }
        }catch(error){
            myApp.alert("Got an unexpected response: "+resp, "FIND_USER")
        }
    },
    "Failed to check for username."
)

// Ask for album lists
serverComm(USER_SERVICE,{GET_ALBUMS:true, username:test_name}, false,
    function(resp){
        try{
            resp = JSON.parse(resp)
        }catch(error){
            myApp.alert("Got an unexpected response: "+resp, "GET_ALBUMS")
        }
    },
    "Failed to get user album lists."
)

var imgAlbum = {
    title: "img",
    date: Date.today().toString('dddd, MMMM d, yyyy')
}
serverComm(USER_SERVICE, {ADD_ALBUM:true, username:test_name, password: USER.password, album:JSON.stringify(imgAlbum)}, true,
    function (resp){
        try{
            resp = JSON.parse(resp)
            if(resp == 1){
                console.log("Added an album");
            }
            else if(resp == 0){
                console.log("Album already exists");
            }
            else{
                console.log("ADD_ALBUM resp: "+resp);
            }
        }catch(error){
            myApp.alert("Got an unexpected response: "+resp, "ADD_ALBUM")
        }
    }
)
