import {combineReducers} from 'redux';
import ImageUpload from './red-imageUpload';

const allReducers = combineReducers({
  imageUpload: ImageUpload
});

export default allReducers;
