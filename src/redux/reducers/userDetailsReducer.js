import constants from '../constants';
export const initialState = {
    status: false
};
const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_USER_DETAIL:
            return {
                ...state,
                status:action.payload
            };
        case constants.CLEAR_USER_DETAIL:
            return {
                ...state,
                status:action.payload
            };
        default:
            return state;
    }
};
export default loaderReducer;