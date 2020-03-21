import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';

export class Perception extends Component {
    componentDidMount = async () => {
        if (window.localStorage.data == null) {
            this.props.history.push('/login');
            return null;
        }
        this.props.onMountingPerception();
    };

    render() {
        if (window.localStorage.data == null) {
            this.props.history.push('/login');
            return null;
        }

        return (
            <div>
                <h1>PERCEPTION APP</h1>
                <h1>{this.props.topics[this.props.completed]}</h1>
                <label htmlFor='entry'></label>
                <input
                    onChange={this.props.onChangeHandler}
                    type='text'
                    name='entry'
                    value={this.props.entry}
                />

                <ReactCountdownClock
                    key={this.props.completed}
                    seconds={5}
                    color='#000'
                    alpha={0.9}
                    size={100}
                    onComplete={this.props.changeTopicHandler}
                />

                <button
                    onClick={() =>
                        this.props.changeTopicHandler(this.props.history)
                    }>
                    Submit
                </button>
                <button
                    onClick={() => this.props.onEndHandler(this.props.history)}>
                    End
                </button>
            </div>
        );
    }
}

export default Perception;
