import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Switch, Router, Route } from 'react-router-dom'
import { store, history, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'

import Home from './components/home'
import Login from './components/login'

const provider =
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>

render(provider, document.getElementById('root'))
