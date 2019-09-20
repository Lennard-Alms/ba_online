const initialState = ["ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text", "ein beispiel text",]

export default function (textOptionList = null, action) {
  switch(action.type) {
    case 'REFRESHED_TEXT_OPTIONS':
      return action.textOptionList;
    case 'CHANGE_SINGLE_TEXT_OPTION':
      textOptionList = textOptionList.slice();
      textOptionList[action.index] = action.textOptions;
      return textOptionList;
  }
  if(!textOptionList){
    textOptionList = [];
    initialState.forEach((text) => {
      var textOptions = [];
      for(var i = 0; i < text.length; i++){
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
    });
    return textOptionList;
  }
  return textOptionList;
}
