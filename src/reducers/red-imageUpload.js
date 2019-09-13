const initialState = {
  imageLoading: false,
  image2D: [] // basisbild angeben
};

export default function (state=initialState, action) {
  switch(action.type) {
    case 'IMAGE_UPLOAD_STARTED':
      return {
        imageLoading: true,
        image2D: []
      }
    case 'IMAGE_UPLOAD_SUCCESS':
      return {
        imageLoading: false,
        image2D: action.image2D
      };
    break;
  }
  return state;
}
