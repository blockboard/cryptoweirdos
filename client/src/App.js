import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import Cryptofaces from "./containers/Cryptofaces/Cryptofaces";

class App extends Component {
    render () {
        return (
            <div>
                <Layout>
                    <Cryptofaces />
                </Layout>
            </div>
        );
    }
}

export default App;
