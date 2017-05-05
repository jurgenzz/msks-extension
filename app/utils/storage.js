export const saveNick = (nick) => {
    chrome.storage.local.set({ nick: nick });
}

// todos unmarked count
function setBadge(messages) {
    if (chrome.browserAction) {
         chrome.browserAction.setBadgeText({text: ''})
    }
}

export default function () {
    return next => (reducer, initialState) => {
        const store = next(reducer, initialState);
        store.subscribe(() => {
            const state = store.getState();
            // saveState(state);
            setBadge(state.messages);
        });
        return store;
    };
}
