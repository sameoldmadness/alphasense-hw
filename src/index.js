import React from "react";
import ReactDOM from "react-dom";

import './index.css';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedChannel: null,
            messages: {},
            message: '',
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/channels');
        const { channels } = await res.json();

        this.setState({
            messages: channels.reduce((acc, channel) => Object.assign(acc, { [channel]: [] }), {})
        });

        // TODO use websockets connection
        this._fetchInterval = setInterval(_ => this.fetchMessages(), 5000);
    }

    async componentWillUnmount() {
        clearInterval(this._fetchInterval);
    }

    get canSendMessage() {
        return this.state.message && this.state.selectedChannel;
    }

    get messages() {
        return this.state.messages[this.state.selectedChannel] || [];
    }

    get channels() {
        return Object.keys(this.state.messages);
    }

    async fetchMessages() {
        if (!this.state.selectedChannel) {
            return;
        }

        const res = await fetch(`/api/messages/${this.state.selectedChannel}`);
        const { messages } = await res.json();

        this.setState({
            // TODO setup stage2 babel plugin to use object spread
            messages: Object.assign({}, this.state.messages, { [this.state.selectedChannel]: messages })
        });
    }

    handleChannelClick(channel) {
        this.setState({ selectedChannel: channel }, _ => this.fetchMessages());
    }

    handleMessageChange(e) {
        this.setState({ message: e.target.value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        fetch(`/api/${this.state.selectedChannel}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ message: this.state.message }),
        });
    }

    render() {
        return (
            <div>
                <ul className="navigation">
                    {this.channels.map((channel, i) => (
                        <li
                            key={i}
                            onClick={_ => this.handleChannelClick(channel)}
                            className={channel === this.state.selectedChannel ? '_active' : ''}
                        >{channel}</li>
                    ))}
                </ul>
                <ul className="message-list">
                    {this.messages.map((message, i) => (
                        <li key={i}>{message}</li>
                    ))}
                </ul>
                <div className="editor">
                    <form onSubmit={e => this.handleFormSubmit(e)}>
                        <input onChange={e => this.handleMessageChange(e)}>{this.statemessage}</input>
                        <button disabled={this.canSendMessage ? '' : 'disabled'}>Send</button>
                    </form>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById('index'));