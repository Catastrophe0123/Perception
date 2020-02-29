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
        response.data.data.topics = response.data.data.topics.map(el => {
            return el.topic_name;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ...response.data.data
                }
            },
            () => {
                console.log(this.state.data.topics);
            }
        );
    };

    render() {
        return (
            <div>
                <h1>PERCEPTION APP</h1>

                <div> {this.state.data.topics} </div>
                <label htmlFor='entry'></label>
                <input type='text' name='entry' />
            </div>
        );
    }
}

export default Perception;
