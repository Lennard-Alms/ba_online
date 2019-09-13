export default function (state=null, action) {
  switch(action.type) {
    case "IMAGE_UPLOADED":
      return action.payload
    break;
  }
  return state; // basisbild angeben
}
