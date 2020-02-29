import React, { Component } from 'react';

export class Result extends Component {
    state = { asd: { qwe: 10, topics: [{ asd: 123 }, { zxc: 123 }] } };
    render() {
        return <div> {this.state.asd.topics[0]} </div>;
    }
}

export default Result;
