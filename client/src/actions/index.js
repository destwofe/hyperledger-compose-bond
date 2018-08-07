import Axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { store } from '../store'
import { getSafe } from '../utils';

export const BASE_URL = 'http://localhost:3335'
export const AUTHORIZE_FAIL = 'AUTHORIZE_FAIL'

export const GLOBAL_LODING_START = 'GLOBAL_LODING_START'
export const GLOBAL_LOGING_STOP = 'GLOBAL_LOGING_STOP'

Axios.interceptors.request.use((config) => {
  store.dispatch({type: GLOBAL_LODING_START})
  return config
}, (error) => {
  store.dispatch({type: GLOBAL_LODING_START})
})

Axios.interceptors.response.use((response) => {
  store.dispatch({type: GLOBAL_LOGING_STOP})
  return response
}, (error) => {
  store.dispatch({type: GLOBAL_LOGING_STOP})
  if (error) {
    const errorMessage = getSafe(() => error.response.data[Object.keys(error.response.data)[0]]) || error.toString()
    const errorTitle = getSafe(() => error.message.toString()) || 'Unexpected Error'
    NotificationManager.error(errorMessage, errorTitle)
    return Promise.reject(error)
  }
})
