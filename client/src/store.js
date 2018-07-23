import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, persistReducer } from 'redux-persist'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

import Reducers from './reducers';

export const history = createHistory()

const persistedReducer = persistReducer({ key: 'Bondbook', storage, stateReconciler: hardSet }, Reducers)
export const store = createStore(persistedReducer, compose(applyMiddleware(thunk, routerMiddleware(history))))
export const persistor = persistStore(store, null, () => {
  if (!store.getState().account.accessToken) {
    history.push('/login')
  } else if (history.location.pathname === '/Login' || history.location.pathname === '/') {
    history.push('/bonds')
  }
})

/*
import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './modules'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers
)

export default store
*/
