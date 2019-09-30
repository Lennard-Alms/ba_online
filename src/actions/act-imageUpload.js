

export default function(file, imageObject) {
  return (dispatch) => {
    console.log(file);
    dispatch(imageUploadStarted());

    var data = new FormData();
    data.append('file', file);

    fetch('http://127.0.0.1:3333/image', {
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
