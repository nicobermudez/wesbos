import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import PropTypes from 'prop-types';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
        id
        name
        email
    }
  }
`;

class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired,
    }
    state = {
        password: '',
        confirmPassword: ''
    }

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

    render() {
        return (
            <Mutation 
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                mutation={RESET_MUTATION} 
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword
                }}
            >
                {(reset, { error, loading, called }) => (
                <Form method="post" onSubmit={(e) => {
                    e.preventDefault();
                    reset();
                    this.setState({ password: '', confirmPassword: ''})
                }}>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Reset Password</h2>
                        <Error error={error} />
                        <label htmlFor="password">
                            Password
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="password" 
                                value={this.state.password} 
                                onChange={this.saveToState} 
                        />
                        </label>
                        <label htmlFor="confirmPassword">
                            Confirm Password
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                placeholder="confirmPassword" 
                                value={this.state.confirmPassword} 
                                onChange={this.saveToState} 
                        />
                        </label>
                    </fieldset>
                    <button type="submit">Reset Password</button>
                </Form>
                )}
            </Mutation>
        );
    }
}

export default Reset;