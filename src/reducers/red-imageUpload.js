const initialState = {
  imageLoading: false,
  image: '' // basisbild angeben
};

export default function (state=initialState, action) {
  switch(action.type) {
    case 'IMAGE_UPLOAD_STARTED':
      return {
        imageLoading: true,
        image: ''
      }
    case 'IMAGE_UPLOAD_SUCCESS':
      return {
        imageLoading: false,
        image: action.link
      }

  }
  return state;
}
