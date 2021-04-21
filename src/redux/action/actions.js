import { createAction } from 'redux-actions';
import constants from '../constants';

export const setLoader = createAction(constants.LOADER);