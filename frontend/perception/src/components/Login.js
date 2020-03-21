import React, { Component } from 'react';
import axios from '../axiosconfig';

export class Login extends Component {
    // this is the login page

    state = { name: '', email: '', image: '' };

    onSubmitHandler = async event => {
        event.preventDefault();
        console.log('submitting');

        let bodyFormData = new FormData();
        bodyFormData.set('name', this.state.name);
        bodyFormData.set('email', this.state.email);
        bodyFormData.set('image', this.state.image);
        try {
            const response = await axios.post('/login', bodyFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response.data.data);
            window.localStorage.setItem(
                'data',
                JSON.stringify(response.data.data)
            );
            this.props.history.push('/perception');
        } catch (err) {
            console.error(err);
        }
    };

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmitHandler}>
                    <div>
                        <label htmlFor='name'>Enter Name : </label>
                        <input
                            type='text'
                            name='name'
                            placeholder='name'
                            value={this.state.name}
                            onChange={this.onChangeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Enter your Email-id : </label>
                        <input
                            type='text'
                            name='email'
                            placeholder='email'
                            value={this.state.email}
                            onChange={this.onChangeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor='image'>Enter an image : </label>
                        <input
                            type='text'
                            name='image'
                            placeholder='image'
                            value={this.state.image}
                            onChange={this.onChangeHandler}
                        />
                    </div>
                    <button>SUBMIT</button>
                </form>
            </div>
        );
    }
}

export default Login;
