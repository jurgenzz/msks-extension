import * as types from '../constants/ActionTypes';

export function addMessage(payload) {
    return { type: types.ADD_MESSAGE, data: {message: payload.new_val} };
}

export function resetMessages() {
    return { type: types.RESET_MESSAGES}
}

export function storeMessages(messages) {
    return { type: 'STORE_MESSAGES', data: {messages: messages}}
}
