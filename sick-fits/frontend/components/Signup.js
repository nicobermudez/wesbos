import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import RequestReset from './RequestReset'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
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
                mutation={SIGNUP_MUTATION} 
                variables={this.state}
            >
                {(signup, { error, loading }) => (
                <Form method="post" onSubmit={(e) => {
                    e.preventDefault();
                    signup();
                }}>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Signup for An Account</h2>
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
                            Name
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="name" 
                                value={this.state.name} 
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
                    <button type="submit">Sign Up</button>
                </Form>
                )}
            </Mutation>
        );
    }
}

export default Signup;