function _setUSER(_username, _password, _email) {
    USER = {
        nickname: _username,
        username: encryptStr(_username),
        password: encryptStr(_password),
        pswrd_plain: _password,
        albums: [],
        urn_albums: [],
        email: _email
    }
    // console.log(USER)
}

function createNewUser(_username, _password, _email) {
    _setUSER(_username, _password, _email)
    myApp.hidePreloader()
    myApp.showPreloader("Creating a new user...")
    // Create A User
    var goSuccess = function (data, status, xhr) {
        myApp.hidePreloader();
        var JResp;
        try {
            JResp = JSON.parse(data);
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR ADD USER");
            console.log("Error:", error)
            console.log("Data: ",data)
            console.log("Status: ", status)
            console.log("XHR: ", xhr)
        }
        if(hasError(JResp.Error)){
            if(JResp.Error.Username) myApp.alert("That username already exists", "Sorry")
            else if(JResp.Error.Email) myApp.alert("That email already has an account", "Sorry")
            else{
                myApp.alert("Unable to sign up", "Sorry")
                console.log(JResp.Error)
            }
        }
        else{
            USER.id = JResp.ID
            mainView.router.load({
                pageName: 'home',
            });
        }
    }

    postReq("/user", {
        Username: USER.username,
        Password: USER.password,
        Email: USER.email,
        Nickname: USER.nickname
    }, goSuccess, "create a new user")
}

function updtUserProf(formData) {
    formData.nickname = formData.username
    formData.username = encryptStr(formData.nickname)
    formData.pswrd_plain = formData.password
    formData.password = encryptStr(formData.password)

    success = function (data, status, xhr) {
        myApp.hidePreloader();
        console.log("FORM_DATA: " + formData)
        console.log("RESP_DATA: " + data)
        USER.email = formData.email
        USER.nickname = formData.nickname
        USER.pswrd_plain = formData.pswrd_plain
        USER.username = formData.username
        USER.password = formData.password
        $$("#TFuserName").html(USER.nickname)
        mainView.router.load({
            pageName: 'user-profile',
        });
    }

    postReq(USER_SERVICE, {
        EDIT_PROFILE: true,
        USERNAME: USER.username,
        PASSWORD: USER.password,
        FORM_DATA: JSON.stringify(formData)
    }, success, "update user profile")
}

function checkNset(tag, value) {
    if (!value) {
        console.log("Empty value for tag: " + tag)
    } else {
        tag.val(value)
        tag.addClass('not-empty-state')
        tag.parent().addClass('not-empty-state')
        tag.parent().parent().addClass('not-empty-state')
    }
}

function getMemDate(date) {
    dt = date.split(" ")[0].split("-")
    year = dt[0]
    MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    month = MONTHS[Number(dt[1]) - 1]
    return month + " " + year
}