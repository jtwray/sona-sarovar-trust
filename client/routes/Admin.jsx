import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import AdminPanel from '../containers/AdminPanel';
import AdminAuth from '../containers/AdminAuth';

export default ({match}) => (
  <BrowserRouter>
    <main>
      <Route exact path={`${match.url}`} component={AdminPanel}/>
      <Route path={`${match.url}/auth`} component={AdminAuth}/>
    </main>
  </BrowserRouter>
);