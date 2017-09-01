$$('#homePgCntnt').on('ptr:refresh', function (e) {
    getAlbums()
    myApp.pullToRefreshDone()
})

function photoSwiper () {
    myPhotoBrowser.open()
}