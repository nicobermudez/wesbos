import App, { Container } from 'next/app'
import Page from '../components/Page'

export default class MyApp extends App {
    render() {
        const { Component } = this.props;
        return (
            <Container>
                <Component />
                <Page />
            </Container>
        )
    }
}