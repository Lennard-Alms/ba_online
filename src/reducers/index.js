import {combineReducers} from 'redux';
import ImageUpload from './red-imageUpload';
import PolygonList from './red-polygonList';

const allReducers = combineReducers({
  imageUpload: ImageUpload,
  polygonList: PolygonList
});

export default allReducers;
