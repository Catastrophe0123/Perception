import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Perception from './components/Perception';
import Result from './components/Result';
import axios from './axiosconfig';

export class App extends Component {
    state = { topics: [], completed: 0, entry: '', savedEntries: [] };

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    };

    onMountingPerception = async () => {
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

    changeTopicHandler = async history => {
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
            // this.props.history.push('/result');
            history.push('/result');
        }

        this.setState(st => {
            return { ...st, completed: st.completed + 1 };
        });
    };

    onEndHandler = history => {
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
        // this.props.history.push('/result');
        history.push('/result');
    };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Login} />
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
                    <Route exact path='/result' component={Result} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
