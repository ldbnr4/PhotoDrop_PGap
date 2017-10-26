class PhotoFactory {

    constructor(pidArray, album_id) {
        if (album_id === "FAKE_ALBUM") {
            this.FAKE = true
            this.heros = ["ironMan.png", "thor.png", "hulk.png", "spiderMan.png"]
            this.offset = $$(".grid-item").length
        }
        this.pidArray = pidArray
        this.album_id = album_id
    }

    loadNPlace(pid, i) {
        var self = this
        const imgLocation = this.FAKE ? encodeURI(`${APP_BASE_URL}/dev/hero/${this.heros[getRandomInt(0,this.heros.length)]}`) : encodeURI(APP_BASE_URL + "/photo?albumId=" + this.album_id + "&imageId=" + pid + "&userId=" + USER.id)
        const docContainer = document.createElement("div")
        docContainer.id = `image_${i}`
        docContainer.innerHTML = '<div class="progressbar-infinite color-multi"></div>'
        docContainer.className = "grid-item"
        photoGrid.append(docContainer)
        this.setUpImageContainer(pid, i)
        loadImage(
            imgLocation,
            function (img) {
                self.loadImageComplete(img, pid, $$(`#image_${i}`))
            }, {
                // canvas: true,
                // pixelRatio: window.devicePixelRatio,
                aspectRatio: 1,
            }
        )
        return imgLocation
    }

    loadImageComplete(img, pid, docContainer) {
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
                    if (this.FAKE) container.hide()
                    else deletePic(pid, this.album_id)
                }
            }]
            myApp.actions(this, buttons)
        })
    }

    run() {
        var self = this
        return this.pidArray.map(function (pid, i) {
            return self.loadNPlace(pid, i+self.offset)
        });
    }
}