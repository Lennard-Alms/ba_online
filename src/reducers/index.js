import {combineReducers} from 'redux';
import ImageUpload from './red-imageUpload';
import PolygonList from './red-polygonList';
import TextOptionList from './red-textOptionList';

const allReducers = combineReducers({
  imageUpload: ImageUpload,
  polygonList: PolygonList,
  textOptionList: TextOptionList,
});

export default allReducers;
