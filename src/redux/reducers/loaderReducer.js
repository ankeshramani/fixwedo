import constants from '../constants';
export const initialState = {
    status: false
};
const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.LOADER:
            return {
                ...state,
                status:action.payload
            };
        default:
            return state;
    }
};
export default loaderReducer;