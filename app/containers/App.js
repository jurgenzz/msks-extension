import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Messages from '../components/Messages';
import * as MessagesActions from '../actions/messages';
import style from './App.css';

var io = require('socket.io-client')('https://developers.lv', {path: '/msks-server/socket.io'});

io.emit('action', {type: 'server/SUBSCRIBE_TO_CHANNELS'})
io.emit('action', {type: 'server/LOAD_MESSAGES', payload: {channelName: '#developerslv'}})

@connect(
    state => ({
        messages: state.messages
    }),
    dispatch => ({
        actions: bindActionCreators(MessagesActions, dispatch)
    })
)


export default class App extends Component {
    componentDidMount() {
        io.on('action', res => {
            if (res.type === 'client/LOADED_MESSAGES') {
                let lastIndex = res.payload.messages.length - 1;
                let lastMessage = res.payload.messages[lastIndex]
                this.props.actions.storeMessages(res.payload.messages)
                io.emit('action', {type: 'server/SUBSCRIBE_TO_MESSAGES', payload: {channelName: '#developerslv', messageId: lastMessage.id, timestamp: lastMessage.timestamp}})
            }
            if (res.type === 'client/MESSAGE_CHANGE') {
                this.props.actions.addMessage(res.payload);

            }
        })
    }
    render() {
        const { messages, actions } = this.props;
        return (
            <div className={style.normal}>
                <Messages messages={messages} actions={actions}/>
            </div>
        );
    }
}
