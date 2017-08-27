$$('#homePgCntnt').on('ptr:refresh', function (e) {
    getAlbums()
    myApp.pullToRefreshDone()
})

function addAlbum () {
    myApp.prompt('', 'Create a new album', function (value) {
        if (value.length != 0 && USER.albums.indexOf(value) == -1) {
            addNewAlbum(value)
        }
    })
}

function goToAlbumPg (name = null, id = null) {
    if(name != null){
        ALBUM.title = name
        ALBUM.id = id
    }
    clrNfillPhotoGrid()
    $$("#album_name_ttl").html(ALBUM.title)
    // Load album page
    mainView.router.load({
        pageName: 'album'
    })
    // console.log(ALBUM)
}

function photoSwiper () {
    myPhotoBrowser.open()
}