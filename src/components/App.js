import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import NextArrival from '../components/TimeTable';
import './App.css';


export const client = new ApolloClient({
    uri: 'https://api.entur.io/journey-planner/v2/graphql'
});

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <NextArrival/>
                </header>
            </div>
        </ApolloProvider>
    );
}

export default App;
