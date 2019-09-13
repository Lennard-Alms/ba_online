export default function(file, imageObject) {
  var image2D = [];
  var reader = new FileReader();
  reader.onload = function () {
    imageObject.src = reader.result;
  }
  reader.onloadend = function () {
    var width = imageObject.naturalWidth;
    var height = imageObject.naturalHeight;

    var canvas = document.createElement("canvas");

    var ctx = canvas.getContext("2d");
    ctx.drawImage(imageObject,0,0);

    var map = ctx.getImageData(0,0,width,height);
    var mapData = map.data;

    for(var row = 0; row < height; row ++) {
      var row1D = [];
      for(var column = 0; column < width; column ++) {
        var rIndex = row * width + column * 4;
        var gIndex = row * width + column * 4 + 1;
        var bIndex = row * width + column * 4 + 2;

        var red = mapData[rIndex];
        var green = mapData[gIndex];
        var blue = mapData[bIndex];

        row1D.push([red,green,blue]);
      }
      image2D.push(row1D);
    }
  }
  reader.readAsDataURL(file);
  return {
    type: 'IMAGE_UPLOADED',
    payload: image2D
  }
}
