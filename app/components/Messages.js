import React, { PropTypes, Component } from 'react';
import style from './Messages.css';
import frozenMoment from 'frozen-moment';
import {saveNick} from '../utils/storage';

export default class Messages extends Component {
    constructor() {
        super();
        this.state = {};
        chrome.storage.local.get('nick', res => {
            this.state.nick = res.nick;
        })
    }

    resetMessages() {
        this.props.actions.resetMessages();
    }

    handleInput(value) {
        this.setState({
            nick: value
        })
        saveNick(value);

    }
    render() {
        const messages = this.props.messages.map((msg, i) => {
            const timestamp =  frozenMoment(msg.timestamp).freeze()

            return (
                <li key={i}>
                    <span className={style.messageTime}>[{timestamp.format('HH:mm')}]</span><span className={style.messageUser}>{msg.from}:</span><span className="messageText">{msg.text}</span>
                </li>
            )


        })
        return (
            <div>
                <div className={style.topBar}>
                    #developerslv
                    <input value={this.state.nick} onChange={(e) => this.handleInput(e.target.value)} placeholder="alert on.." />
                    <button className={style.button} onClick={e => this.resetMessages()}>Mark as seen</button>
                </div>
                <ul>
                    {messages.length ? messages : <div style={{textAlign: 'center'}}><img  src='./img/loading.gif' width="100px"/></div>}
                </ul>
            </div>
        );
    }
}
