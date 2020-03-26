import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import history from "./history";
import {AuthContext} from "./context/auth";

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config();

dotenvExpand(config);

ReactDOM.render(
  <Router history={history}>
    <App/>
  </Router>
  , document.getElementById("root"));
