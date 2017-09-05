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
    var success = function (data, status, xhr) {
        myApp.hidePreloader();
        try {
            resp = JSON.parse(data)
            respU = JSON.parse(resp.user)
        } catch (error) {
            myApp.alert("Got an unexpected response", "RESP LOGIN")
            console.log(data)
        }
        if (!resp.err) {
            // console.log(respU)
            USER.id = resp.id;
            USER.email = resp.email
            USER.joined = getMemDate(resp.joined)
            USER.friends = respU.friends
            mainView.router.load({
                pageName: 'home',
            });
        } else {
            console.log("LOGIN error:", resp);
        }
    }
    postReq(
        USER_SERVICE, {
            LOGIN: true,
            username: USER.username,
            password: USER.password
        },
        success,
        "login"
    )
}