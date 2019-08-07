import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends Component {
    state = {
        name: '',
        password: '',
        email: '',
    }

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

    render() {
        return (
            <Mutation 
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                mutation={SIGNIN_MUTATION} 
                variables={this.state}
            >
                {(signin, { error, loading }) => (
                <Form method="post" onSubmit={(e) => {
                    e.preventDefault();
                    signin();
                }}>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Sign into your Account</h2>
                        <Error error={error} />
                        <label htmlFor="">
                            Email
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="email" 
                                value={this.state.email} 
                                onChange={this.saveToState} 
                        />
                        </label>
                        <label htmlFor="">
                            Password
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="password" 
                                value={this.state.password} 
                                onChange={this.saveToState} 
                        />
                        </label>
                    </fieldset>
                    <button type="submit">Sign In</button>
                </Form>
                )}
            </Mutation>
        );
    }
}

export default Signin;