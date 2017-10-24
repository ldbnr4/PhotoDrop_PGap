var devPhotoFactory = function () {
  var photoFact = new PhotoFactory(fillArray(),"FAKE_ALBUM");
  myPhotoBrowser = myApp.photoBrowser({
    theme: 'dark',
    photos: photoFact.run()
  })
}

function fillArray() {
  var len = getRandomInt(3,7)
  if (len == 0) return [];
  var a = [4];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}