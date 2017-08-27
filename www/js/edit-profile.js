myApp.onPageInit('edit-profile', function(page) {
    myApp.hidePreloader();
    myApp.showPreloader("Loading profile");
    getProfileInfo();
    $$('#update_link').on('click', function(){
        myApp.hidePreloader();
        myApp.showPreloader("Updating profile");
        var formData = myApp.formToData('#profile_form')
        var errors = validate(formData, signup_const)
        if(!errors){
            console.log(formData)
            updtUserProf(formData)
            // updateProfile()
        }
        else{
            myApp.hidePreloader();
            myApp.alert(JSON.stringify(errors), "Update errors");
        }
    });
})

function getProfileInfo() {
    var success = function (data, status, xhr) {
        try {
            myApp.hidePreloader();
            var JResp = JSON.parse(data);
            if (JResp.err == false) {
                checkNset($$("#profile-unm"), USER.nickname)
                checkNset($$("#profile-eml"), JResp.email)
                checkNset($$("#profile-pswrd"), USER.pswrd_plain)
            } else {
                myApp.alert("Error message: " + JResp.msg, "ERR PROFILE");
            }
        } catch (error) {
            myApp.alert("Did not recieve json response. Resp: " + data, "ERR PROFILE");
            console.log(error)
            console.log("Data: " + data)
            console.log("Status: " + status)
            console.log("XHR: " + xhr)
        }
    }
    postReq(USER_SERVICE, {
        USER_EMAIL: true,
        USERNAME: USER.username,
        PASSWORD: USER.password
    }, success, "to get user profile info")
}