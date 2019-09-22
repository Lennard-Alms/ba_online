
export default function (textOptionList = null, action) {
  switch(action.type) {
    case 'REFRESHED_TEXT_OPTIONS':
      return action.textOptionList;
    case 'CHANGE_SINGLE_TEXT_OPTION':
      textOptionList = textOptionList.slice();
      textOptionList[action.index] = action.textOptions;
      return textOptionList;
    case 'IMAGE_UPLOAD_SUCCESS':
      console.log('exit1');
      console.log(action);
      return buildTextOptionList(action.success.length);
  }
  if(!textOptionList){
    return buildTextOptionList(15);
  }
  return textOptionList;
}
function buildTextOptionList(n) {
  var textOptionList = [];
  for(var j = 0; j < n; j++){
    var textOptions = [];
    for(var i = 0; i < 22; i++){
      textOptions.push({
        display: 'inline',
        x: -1000,
        y: -1000,
        size: 15,
        scaleX: 1,
        scaleY: 1,
      });
    }
    textOptionList.push(textOptions);
  }
  return textOptionList;
}
