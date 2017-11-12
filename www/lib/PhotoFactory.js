var PhotoFactory = function (pidArray, album_id) {
    var heros = ["ironMan.png", "thor.png", "hulk.png", "spiderMan.png"];
    var offset = $$(".grid-item").length;
    var fake = (album_id === "FAKE_ALBUM")

    return pidArray.map(function (pid, i) {
        i = i + offset
        var container = setUpImageContainer(pid, i, fake, album_id)
        var imgLocation = encodeURI(APP_BASE_URL + "/photo/" + pid + "/" + USER.ObjectID + "/" + env)
        if (fake) {
            imgLocation = encodeURI(APP_BASE_URL + "/photo/hero/" + heros[getRandomInt(0, heros.length)])
        }
        return loadNPlace(container, imgLocation)
    });

}

var PhotoPlacer = function (pid, album_id) {
    var offset = $$(".grid-item").length;
    var imgLocation = encodeURI(APP_BASE_URL + "/photo/" + pid + "/" + USER.id)
    var container = setUpImageContainer(pid, offset+1, false, album_id)
    loadNPlace(container, imgLocation)
}

function loadNPlace(container, imgLocation) {
    loadImage(
        imgLocation,
        function (img) {
            loadImageComplete(img, container)
        }, {
            // canvas: true,
            // pixelRatio: window.devicePixelRatio,
            aspectRatio: 1,
        }
    )
    return imgLocation
}

function loadImageComplete(img, docContainer) {
    // console.log("PID:",pid)
    if (img.type === "error") {
        // console.log("Error loading image id:" + pid + " from source:" + url)
        docContainer.html("BAD IMAGE")
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
        docContainer.html('')
        docContainer.append(img)
    }
}

function setUpImageContainer(pid, i, FAKE, album_id) {
    const docContainer = document.createElement("div")
    docContainer.id = "image_" + i
    docContainer.innerHTML = '<div class="progressbar-infinite color-multi"></div>'
    docContainer.className = "grid-item"
    photoGrid.append(docContainer)

    var container = $$("#image_" + i)
    container.click(function (e) {
        myPhotoBrowser.activeIndex = i;
        myPhotoBrowser.open();
    })
    container.on('taphold', function () {
        var buttons = [{
            text: "Delete",
            color: "red",
            onClick: function () {
                if (FAKE) container.hide()
                else deletePic(pid, album_id)
            }
        }]
        myApp.actions(this, buttons)
    })
    return container
}