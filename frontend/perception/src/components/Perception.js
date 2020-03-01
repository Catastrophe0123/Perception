import React, { Component } from 'react';
import axios from '../axiosconfig';
import Timer from 'react-compound-timer';
import ReactCountdownClock from 'react-countdown-clock';

export class Perception extends Component {
    // gets the topics using ajax and store in local storage
    // display the topic 1 at a time show the timer
    // get user entered values and store it
    // get more topics if local storage runs out
    // do this till the end

    // state = { data: JSON.parse(window.localStorage.getItem('data') || '[]') };

    state = { topics: [], completed: 0, entry: '', savedEntries: [] };

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    };

    componentDidMount = async () => {
        // fetch topics
        let response = await axios.get('/topics', { params: { offset: 0 } });
        console.log(response);
        // response.data.data.topics = response.data.data.topics.map(el => {
        //     return el.topic_name;
        // });

        // let x = [];
        // for (let item in response.data.data.topics) {
        //     let y = response.data.data.topics[item];
        //     x.push(y);
        // }
        // console.log(x);

        this.setState({
            ...this.state,
            topics: [...response.data.data.topics]
        });
    };

    changeTopicHandler = async () => {
        // force a rerender by setting state - done

        this.setState({
            ...this.state,
            savedEntries: [...this.state.savedEntries, this.state.entry],
            entry: ''
        });

        if (this.state.completed === this.state.topics.length - 2) {
            let response = await axios.get('/topics', {
                params: { offset: this.state.completed + 2 }
            });
            console.log(response);
            this.setState(st => {
                return {
                    ...st,
                    topics: [...st.topics, ...response.data.data.topics]
                };
            });
        }

        if (this.state.completed === this.state.topics.length - 1) {
            // there are no more topics to show
            // redirect to results page
            this.props.history.push('/result');
        }

        this.setState(st => {
            return { ...st, completed: st.completed + 1 };
        });
    };

    onEndHandler = () => {
        // end handler

        let entries = [...this.state.savedEntries];
        for (
            let i = this.state.completed + 1;
            i < this.state.topics.length;
            i++
        ) {
            entries.push('');
        }

        this.setState({
            ...this.state,
            savedEntries: entries,
            completed: entries.length + 1
        });

        // move to the results page
        this.props.history.push('/result');
    };

    render() {
        // let x = [];
        // for (let item in this.state.data.topics) {
        //     let y = this.state.data.topics[item];
        //     x.push(y);
        // }
        // let value =
        // let y;
        // for (let x in this.state.topic) {
        //     y = this.state.topic[x];
        // }
        // console.log(y);

        return (
            <div>
                <h1>PERCEPTION APP</h1>
                <h1>{this.state.topics[this.state.completed]}</h1>
                <label htmlFor='entry'></label>
                <input
                    onChange={this.onChangeHandler}
                    type='text'
                    name='entry'
                    value={this.state.entry}
                />
                {/* <Timer initialTime={15000} direction='backward'>
                    {() => (
                        <React.Fragment>
                            <Timer.Seconds /> seconds
                        </React.Fragment>
                    )}
                </Timer> */}

                <ReactCountdownClock
                    key={this.state.completed}
                    seconds={5}
                    color='#000'
                    alpha={0.9}
                    size={100}
                    onComplete={this.changeTopicHandler}
                />

                <button onClick={this.changeTopicHandler}>Submit</button>
                <button onClick={this.onEndHandler}>End</button>
            </div>
        );
    }
}

export default Perception;
