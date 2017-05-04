String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Create A User
var _salt = randomString(17);
var _pswrd = (USER.password+_salt).hashCode()
serverComm(USER_SERVICE,{username:USER.username, password:_pswrd, salt:_salt, ADD_USER:true},true,
    function(resp){
        switch (JSON.parse(resp)) {
            case 0:
                console.log("DB did not aknowledge the write.")
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
    },
    "Failed to create a user."
)

// Check for a username
var test_name = USER.username;
//test_name = "test";
serverComm(USER_SERVICE,{username:test_name, FIND_USER:true}, false,
    function (resp){
        resp = JSON.parse(resp);
        //console.log(resp);
        if(resp){
            console.log("Username taken :(");
        }
        else if(!resp){
            console.log("I'ts all yours!");
        }
        else{
            console.log(resp)
        }
    },
    "Failed to check for username."
)

// Ask for album lists
serverComm(USER_SERVICE,{username:test_name, GET_ALBUMS:true}, false,
    function(resp){
        resp = JSON.parse(resp)
        console.log(resp)
    },
    "Failed to get user album lists."
)
