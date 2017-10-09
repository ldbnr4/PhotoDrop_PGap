class PhotoFactory {
    constructor(album_id) {
        this.album_id = album_id
    }

    loadNPlace(pid, i) {
        const imgLocation = encodeURI("http://zotime.ddns.net:2500/photo?albumId=" + this.album_id + "&imageId=" + pid + "&userId=" + USER.id)
        loadImage(
            imgLocation,
            function (img) {
                // console.log("PID:",pid)
                if (img.type === "error") {
                    // console.log("Error loading image id:" + pid + " from source:" + url)
                    docContainer.html(`PID: ${pid}`)
                } else {
                    const docContainer = document.createElement("div")
                    docContainer.setAttribute("class", "grid-item")
                    docContainer.setAttribute("id", `imageContainer_${i}`)
                    photoGrid.append(docContainer)
                    // console.log(img.width)
                    img = loadImage.scale(
                        img, {
                            maxWidth: docContainer.offsetWidth,
                            maxHeight: docContainer.offsetHeight,
                            downsamplingRatio: 0.4,
                            contain: true,
                            crop: true,
                            canvas: true,
                            cover: true,
                        }
                    )
                    docContainer.append(img)
                    // docContainer.innerHTML = img
                    PhotoFactory._setUpImageContainer(i, pid)
                }
            }, {
                // canvas: true,
                // pixelRatio: window.devicePixelRatio,
                // aspectRatio: 1,
            }
        )
        return imgLocation
    }

    static _setUpImageContainer(i, pid) {
        const container = $$(`#imageContainer_${i}`)
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