import React, { Component } from 'react';
import axios from '../axiosconfig';

export class Result extends Component {
    state = { words_stats: {}, alldata: [{}] };

    componentDidMount = async () => {
        if (window.localStorage.data == null) {
            this.props.history.push('/login');
            return null;
        }
        console.log('hello world');
        let data = JSON.parse(window.localStorage.getItem('data'));
        let user_id = data.user_id;
        console.log(data);
        const response = await axios.get('/result', { params: { user_id } });
        console.log(response.data);
        this.setState({
            words_stats: response.data.words_stats,
            alldata: response.data.alldata
        });
    };

    render() {
        return (
            <div>
                YOUR RESULTS
                {this.state.alldata.map((el, index) => {
                    return (
                        <li key={index}>
                            {` ${el['topic']} - ${el['words']} - ${
                                this.state.words_stats[el['words']]
                            } `}
                        </li>
                    );
                })}
            </div>
        );
    }
}

export default Result;
