class PhotoFactory {
    loadNPlace(pid, album_id, i) {
        const imgLocation = encodeURI("http://zotime.ddns.net:2500/photo?albumId=" + album_id + "&imageId=" + pid + "&userId=" + USER.id)
        var loadCompRef = this.loadImageComplete
        var setupRef = this.setUpImageContainer;
        const docContainer = document.createElement("div")
        setupRef(pid, i)
        docContainer.setAttribute("class", "grid-item")
        docContainer.id = `image_${i}`
        docContainer.innerHTML = '<div class="progressbar-infinite color-multi"></div>'
        photoGrid.append(docContainer)
        loadImage(
            imgLocation,
            function(img){
                loadCompRef(img, pid, setupRef, i)
            }, {
                // canvas: true,
                // pixelRatio: window.devicePixelRatio,
                aspectRatio: 1,
            }
        )
        return imgLocation
    }

    loadImageComplete(img, pid, setupRef, i) {
        var docContainer = $$(`#image_${i}`) 
        // console.log("PID:",pid)
        if (img.type === "error") {
            // console.log("Error loading image id:" + pid + " from source:" + url)
            docContainer.html(`PID: ${pid}`)
        } else {
            // console.log(img.width)
            img = loadImage.scale(
                img, {
                    maxWidth: window.screen.width / 3.2,
                    maxHeight: window.screen.height / 3.2,
                    // downsamplingRatio: 0.4,
                    contain: true,
                    crop: true,
                    // canvas: true,
                    cover: true,
                }
            )
            // img.setAttribute("class", "imageItem")
            docContainer.html('')
            docContainer.append(img)
            // docContainer.innerHTML = img
            // msnry.prepended(docContainer)
        }
    }

    setUpImageContainer(pid, i) {
        var container = $$(`#image_${i}`) 
        container.click(function (e) {
            myPhotoBrowser.activeIndex = i;
            myPhotoBrowser.open();
        })
        container.on('taphold', function () {
            var buttons = [{
                text: "Delete",
                color: "red",
                onClick: function () {
                    deletePic(pid, this.album_id)
                }
            }]
            myApp.actions(this, buttons)
        })
    }
}