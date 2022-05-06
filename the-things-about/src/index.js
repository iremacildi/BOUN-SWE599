import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import { SessionProvider } from "@inrupt/solid-ui-react";

ReactDOM.render(
  <SessionProvider>
    <Router>
      <App />
    </Router>
  </SessionProvider>,
  document.getElementById('root')
);