export default function(file, imageObject) {
  return (dispatch) => {
    dispatch(imageUploadStarted());
    var reader = new FileReader();
    reader.onload = function () {
      imageObject.src = reader.result; //TODO: schrumpfen auf 300px breite bzw höhe
    }
    reader.onloadend = function () {
      var width = imageObject.naturalWidth;
      var height = imageObject.naturalHeight;

      var canvas = document.createElement("canvas");

      var ctx = canvas.getContext("2d");
      ctx.drawImage(imageObject,0,0);

      var map = ctx.getImageData(0,0,width,height);
      var mapData = map.data;

      var image2D = [];

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
      dispatch(imageUploadSuccess(image2D));
    }
    reader.readAsDataURL(file);
  }
}

const imageUploadStarted = () => {
  return {
    type: 'IMAGE_UPLOAD_STARTED'
  };
}

const imageUploadSuccess = (image2D) => {
  return {
    type: 'IMAGE_UPLOAD_SUCCESS',
    image2D: image2D
  }
}
