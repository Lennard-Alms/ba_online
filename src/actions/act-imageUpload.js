

export default function(file, imageObject) {
  return (dispatch) => {
    console.log(file);
    dispatch(imageUploadStarted());

    var data = new FormData();
    data.append('file', file);

    fetch('http://cloud.markuslaubenthal.de:50005/image', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          body: data // body data type must match "Content-Type" header
      })
      .then(
        response => response.json() // if the response is a JSON object
      ).then(
        success => {
          dispatch(imageUploadSuccess(success));
          }// Handle the success response object
      ).catch(
        error => console.log(error) // Handle the error response object
      );

    //
    // var reader = new FileReader();
    // reader.onload = function () {
    //   imageObject.src = reader.result;
    //
    // }
    // reader.onloadend = function () {
    //   var width = imageObject.offsetTop;
    //   var height = imageObject.offsetWidth;
    //   console.log(imageObject);
    //
    //   var canvas = document.createElement("canvas");
    //   canvas.height=300;
    //   canvas.width=300;
    //   var ctx = canvas.getContext("2d");
    //   ctx.drawImage(imageObject,0,0);
    //
    //   var map = ctx.getImageData(0,0,width,height);
    //   var mapData = map.data;
    //
    //   var image2D = [];
    //
    //   for(var row = 0; row < height; row ++) {
    //     var row1D = [];
    //     for(var column = 0; column < width; column++) {
    //       var rIndex = row * width + column * 4;
    //       var gIndex = row * width + column * 4 + 1;
    //       var bIndex = row * width + column * 4 + 2;
    //
    //       var red = mapData[rIndex];
    //       var green = mapData[gIndex];
    //       var blue = mapData[bIndex];
    //
    //       row1D.push([red,green,blue]);
    //     }
    //     image2D.push(row1D);
    //   }
    //
    //
    //
    //
    //
    //   dispatch(imageUploadSuccess(image2D));
    // }
    // reader.readAsDataURL(file);
  }
}

const imageUploadStarted = () => {
  return {
    type: 'IMAGE_UPLOAD_STARTED'
  };
}

const imageUploadSuccess = (success) => {
  console.log(success);
  return {
    type: 'IMAGE_UPLOAD_SUCCESS',
    success: success.polygons,
    link: success.link
  }
}
