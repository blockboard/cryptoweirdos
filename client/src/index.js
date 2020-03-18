import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config();

dotenvExpand(config);

console.log(config);

ReactDOM.render(<App/>, document.getElementById("root"));
