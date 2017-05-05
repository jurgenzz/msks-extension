const bluebird = require('bluebird');
import * as MessagesActions from '../../app/actions/messages';
var io = require('socket.io-client')('https://developers.lv', {path: '/msks-server/socket.io'});

global.Promise = bluebird;

function promisifier(method) {
    // return a function
    return function promisified(...args) {
        // which returns a promise
        return new Promise((resolve) => {
            args.push(resolve);
            method.apply(this, args);
        });
    };
}

function promisifyAll(obj, list) {
    list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

const setBadge = (messages) => {
    if (chrome.browserAction) {
        chrome.browserAction.getBadgeText({}, function(result) {
            let resultToUse  = result ? parseInt(result) : 0;
            chrome.browserAction.setBadgeText({ text: (resultToUse + 1).toString() });
        });
    }
}

const emitSubscribe = (payload) => {
    io.emit('action', {type: 'server/SUBSCRIBE_TO_MESSAGES', payload: payload})
}

io.emit('action', {type: 'server/SUBSCRIBE_TO_CHANNELS'});

io.emit('action', {type: 'server/LOAD_MESSAGES', payload: {channelName: '#developerslv'}})

io.on('action', res => {
    if (res.type === 'client/LOADED_MESSAGES') {
        // this.props.actions.storeMessages(res.payload.messages)
        let lastIndex = res.payload.messages.length - 1;
        let lastMessage = res.payload.messages[lastIndex];
        let payload = {channelName: '#developerslv', messageId: lastMessage.id, timestamp: lastMessage.timestamp}
        emitSubscribe(payload);
    }//
    if (res.type === 'client/MESSAGE_CHANGE') {
        // MessagesActions.addMessage(res.payload);
        let nickToLookAfter;
        chrome.storage.local.get('nick', store => {
            if (store.nick && res.payload.new_val.text.indexOf(store.nick) >= 0) {
                chrome.notifications.create('', {
                    type: 'basic',
                    iconUrl: './img/icon-48.png',
                    title: 'From: ' + res.payload.new_val.from,
                    message: res.payload.new_val.text

                }, res => {
                    // console.log(res);
                })

                setBadge()
            }
        })
    }
})

// let chrome extension api support Promise
promisifyAll(chrome, [
    'tabs',
    'windows',
    'browserAction',
    'contextMenus'
]);
promisifyAll(chrome.storage, [
    'local',
]);

require('./background/contextMenus');
require('./background/inject');
require('./background/badge');
