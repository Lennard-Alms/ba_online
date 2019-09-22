import calcualteTextOptions from '../util/centerXStrat'

export default function(polygonList){
  return (dispatch) => {
    if(polygonList.length > 0){

      var textOptionList = [];
      polygonList.forEach((polygon) => {
        try{
          textOptionList.push(calcualteTextOptions(polygon));
        } catch (error) {
          console.log(error);
          var textOptions = [];
          for(var i = 0; i < polygon.text.length; i++){
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
      });
      dispatch(calculationFinished(textOptionList));
    }
     // dispatch each one
  }
}

const calculationFinished = (textOptionList) => {
  return {
    type: 'REFRESHED_TEXT_OPTIONS',
    textOptionList: textOptionList
  };
}
