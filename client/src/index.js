import React from 'react';
import ReactDOM from 'react-dom';

import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import history from "./history";
import { HelmetProvider } from 'react-helmet-async';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config();

dotenvExpand(config);

ReactDOM.render(
  <Router history={history}>
    <HelmetProvider>
      <App/>
    </HelmetProvider>
  </Router>
  , document.getElementById("root"));
