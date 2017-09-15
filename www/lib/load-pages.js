[
    {
        name: "guest-list",
        path: "html/guest-list.html"
    },
    {
        name: "signup",
        path: "html/signup.html"
    },
    {
        name: "login",
        path: "html/login.html"
    },
    {
        name: "home",
        path: "html/home.html"
    },
    {
        name: "album",
        path: "html/album.html"
    },
    {
        name: "user-profile",
        path: "html/user-profile.html"
    },
    {
        name: "edit-profile",
        path: "html/edit-profile.html"
    },
    {
        name: "user-search",
        path: "html/user-search.html"
    },
    {
        name: "friends",
        path: "html/friends.html"
    }   
].forEach(function(page) {
    $$.ajax({
        url: page.path,
        success: function(data, xhr, status){
            var htmlPage = document.createElement("div")
            htmlPage.setAttribute("data-page", page.name)
            htmlPage.setAttribute('class', "page cached");
            htmlPage.innerHTML = data
            $$('.pages').append(htmlPage)
        }
    })
});