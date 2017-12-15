
import { combineReducers } from 'redux';
import GPSReducer from './gps-reducer';

export default combineReducers({
   gps: GPSReducer
});
