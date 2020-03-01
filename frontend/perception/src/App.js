import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Perception from './components/Perception';
import Result from './components/Result';

export class App extends Component {
    state = { savedEntries: [] };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route
                        exact
                        path='/perception'
                        render={() => (
                            <Perception
                                savedEntries={this.state.savedEntries}
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
