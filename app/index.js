import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import RouterHistory from 'history/lib/createBrowserHistory';

// Custom App Components
import App from './components/App';
import AuthAxxToken from './components/AuthAxxToken';
import RoomSelection from './components/RoomSelection';

var history = RouterHistory();

var routes = (
  <Router history={history}>
    <Route path='/' component={App}>
      <IndexRoute component={AuthorizeApp}/>
      <Route path='/sparkaxxs' component={AuthAxxToken}/>
      <Route path='/roomselector' component={RoomSelection}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, document.querySelector('.container'));
