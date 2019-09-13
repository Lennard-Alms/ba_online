import {combineReducers} from 'redux';
import ImageUpload from './red-imageUpload';

const allReducers = combineReducers({
  image2D: ImageUpload
});

export default allReducers;
