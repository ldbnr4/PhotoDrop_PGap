class PhotoFactory {
    loadNPlace(pid, album_id) {
        const imgLocation = encodeURI("http://zotime.ddns.net:2500/photo?albumId=" + album_id + "&imageId=" + pid + "&userId=" + USER.id)
        var loadCompRef = this.loadImageComplete
        loadImage(
            imgLocation,
            function(img){
                loadCompRef(img, pid)
            }, {
                // canvas: true,
                // pixelRatio: window.devicePixelRatio,
                // aspectRatio: 1,
            }
        )
        return imgLocation
    }

    loadImageComplete(img, pid) {
        // console.log("PID:",pid)
        const docContainer = document.createElement("div")
        if (img.type === "error") {
            // console.log("Error loading image id:" + pid + " from source:" + url)
            docContainer.html(`PID: ${pid}`)
        } else {
            docContainer.setAttribute("class", "grid-item")
            // console.log(img.width)
            // img = loadImage.scale(
            //     img, {
            //         // maxWidth: docContainer.offsetWidth,
            //         // maxHeight: docContainer.offsetHeight,
            //         // downsamplingRatio: 0.4,
            //         // contain: true,
            //         // crop: true,
            //         canvas: true,
            //         // cover: true,
            //     }
            // )
            // img.setAttribute("class", "imageItem")
            docContainer.append(img)
            // docContainer.innerHTML = img
            photoGrid.append(docContainer)
            msnry.appended(docContainer)
            // this.setUpImageContainer(docContainer)
        }
    }

    setUpImageContainer(container) {
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