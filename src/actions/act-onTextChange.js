import {drawText} from '../util/centerXStrat';

export default function(event, polygon, index) {
  return (dispatch) => {
    polygon.text = event.target.value;
    try{
      var textOptions = drawText(polygon);
      dispatch(changeSingleTextOption(textOptions, index));
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
      dispatch(changeSingleTextOption(textOptions, index));
    }

  }
}

const changePolygonText = (polygon, index) => {
  return {
    type: 'CHANGED_POLYGON_TEXT',
    polygon: polygon,
    index: index
  }
}

const changeSingleTextOption = (textOptions, index) => {
  return {
    type: 'CHANGE_SINGLE_TEXT_OPTION',
    textOptions: textOptions,
    index: index
  }
}
