// Create A User
serverComm(USER_SERVICE,{ADD_USER:true, new_user:JSON.stringify(USER)},true,
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
var test_name = USER.username;
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

var imgAlbum = {
    title: "img",
    date: Date.today().toString('dddd, MMMM d, yyyy')
}

//Add a new album
serverComm(USER_SERVICE, {ADD_ALBUM:true, _id:USER._id, password: USER.password, album:JSON.stringify(imgAlbum)}, true,
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
