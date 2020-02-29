import React, { Component } from 'react';
import axios from '../axiosconfig';

export class Perception extends Component {
    // gets the topics using ajax and store in local storage
    // display the topic 1 at a time show the timer
    // get user entered values and store it
    // get more topics if local storage runs out
    // do this till the end

    // state = { data: JSON.parse(window.localStorage.getItem('data') || '[]') };

    state = { data: {}, completed: 0 };
    componentDidMount = async () => {
        // fetch topics
        let response = await axios.get('/topics', { params: { offset: 0 } });
        console.log(response);
        response.data.data.topics = response.data.data.topics.map(el => {
            return el.topic_name;
        });

        let x = [];
        for (let item in response.data.data.topics) {
            let y = response.data.data.topics[item];
            x.push(y);
        }
        console.log(x);

        this.setState({
            ...this.state,
            topics: [...x]
        });
    };

    render() {
        // let x = [];
        // for (let item in this.state.data.topics) {
        //     let y = this.state.data.topics[item];
        //     x.push(y);
        // }
        // let value =
        let y;
        for (let x in this.state.topic) {
            y = this.state.topic[x];
        }
        console.log(y);

        return (
            <div>
                <h1>PERCEPTION APP</h1>
                <h1>{y}</h1>
                <label htmlFor='entry'></label>
                <input type='text' name='entry' />
            </div>
        );
    }
}

export default Perception;
