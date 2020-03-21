import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Perception from './components/Perception';
import Result from './components/Result';
import axios from './axiosconfig';

export class App extends Component {
    state = {
        topics: [],
        completed: 0,
        entry: '',
        savedEntries: [],
        datetime: []
    };

    submitData = async () => {
        let dataToSend = JSON.parse(window.localStorage.getItem('data'));

        let response = await axios.post(
            '/submit',
            {
                datetime: [...this.state.datetime],
                words_input: [...this.state.savedEntries],
                user_id: dataToSend.user_id,
                email: dataToSend.email,
                topic: [...this.state.topics]
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log(response);
    };

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    };

    onMountingPerception = async () => {
        let response = await axios.get('/topics', { params: { offset: 0 } });
        console.log(response);

        this.setState({
            ...this.state,
            topics: [...response.data.data.topics]
        });
    };

    changeTopicHandler = async history => {
        if (this.state.entry === '') {
            this.setState(st => {
                return { ...st, completed: st.completed + 1 };
            });
        } else {
            let date = new Date();
            let date1 =
                date.toISOString().split('T')[0] +
                ' ' +
                date.toTimeString().split(' ')[0];
            this.setState({
                ...this.state,
                savedEntries: [...this.state.savedEntries, this.state.entry],
                datetime: [...this.state.datetime, date1],
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
        }

        if (this.state.completed === this.state.topics.length - 1) {
            this.submitData();
            history.push('/result');
        }

        this.setState(st => {
            return { ...st, completed: st.completed + 1 };
        });
    };

    onEndHandler = history => {
        let entries = [...this.state.savedEntries];
        let dates = [...this.state.datetime];
        for (let i = this.state.completed; i < this.state.topics.length; i++) {
            entries.push('');
            dates.push('');
        }

        this.setState({
            ...this.state,
            savedEntries: entries,
            datetime: dates,
            completed: entries.length + 1
        });

        // move to the results page
        this.submitData();
        history.push('/result');
    };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact
                        path='/perception'
                        render={props => (
                            <Perception
                                {...props}
                                {...this.state}
                                onChangeHandler={this.onChangeHandler}
                                changeTopicHandler={this.changeTopicHandler}
                                onEndHandler={this.onEndHandler}
                                onMountingPerception={this.onMountingPerception}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/result'
                        render={props => <Result {...props} {...this.state} />}
                    />
                    <Route path='/' component={Login} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
