myApp.onPageInit('login', function () {
    $$('#login_link').on('click', function () {
        var formData = myApp.formToData('#login_form')
        var errors = validate(formData, login_const)
        if (!errors) {
            // console.log(formData)
            login(formData.username, formData.password)
        } else {
            myApp.alert(JSON.stringify(errors), "Login errors");
        }
    });
})

function login(_username, _password) {
    _setUSER(_username, _password)
    myApp.hidePreloader();
    myApp.showPreloader("Signing in");
    var goSuccess = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            resp = JSON.parse(data)
        } catch (error) {
            myApp.alert("Got an unexpected response", "RESP LOGIN")
            console.log("Login data:", data)
        }
        if (resp == null) {
            // TODO: send data to next page and fill fields
            myApp.confirm('Would you like to create and account?', 'User not found', function () {
                mainView.router.load({
                    pageName: 'signup',
                });
            });
        } else {
            console.log("Get user returned")
            console.log(resp)
            USER = resp;
            enterApplication(USER.ObjectID);
        }
    }
    getReq("/user", {
            username: USER.username,
            password: USER.password
        },
        goSuccess,
        "login"
    )
}
function enterApplication(id) {
    if(!id){
        myApp.alert("Not allowed to enter the app without id", "Not Auth")
        return
    }
    USER.ObjectID = id;
    mainView.router.load({
        pageName: 'home',
    });
}

