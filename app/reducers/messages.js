import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

const actionsMap = {
    [ActionTypes.ADD_MESSAGE](state, action) {
        return [
            action.data.message,
            ...state
        ];
    },
    [ActionTypes.RESET_MESSAGES](state, action) {
        // return state.map(msg => {
        //     return {
        //         ...msg,
        //         seen: true
        //     }
        // })
    },
    STORE_MESSAGES(state, action) {
        return action.data.messages.reverse();
    }
};

export default function messages(state = initialState, action) {
    const reduceFn = actionsMap[action.type];
    if (!reduceFn) return state;
    return reduceFn(state, action);
}
