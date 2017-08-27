var signup_const = {
    email: {
        presence: {message: "is required"},
        email: true
    },
    username: {
        presence: {message: "is required"}
    },
    password: {
        presence: {message: "is required"}
    }
}

myApp.onPageInit('signup', function(){
    $$('#signup_link').on('click', function(){
        var formData = myApp.formToData('#signup_form')
        var errors = validate(formData, signup_const)
        if(!errors){
            createNewUser(formData.username, formData.password, formData.email)
        }
        else{
            myApp.alert(JSON.stringify(errors), "Login errors");
        }
    });
})