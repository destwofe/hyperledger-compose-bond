import Axios from 'axios'
import { push } from 'react-router-redux'

import { BASE_URL } from './index'
import { tabChange } from './view';

import { NotificationManager } from 'react-notifications'

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const requestLogin = (username) => (dispatch) =>
  Axios.get(`${BASE_URL}/api/accounts`, {headers: {authorization: `Bearer ${username}`}})
  .then(response => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: username,
        accountData: response.data
      }
    })
    Axios.defaults.headers.authorization = `Bearer ${username}`
    if (response.data.role.isGateway) {
      tabChange(2)(dispatch)
      dispatch(push('/moneywallets'))
    } else {
      dispatch(push('/bonds'))
    }
    return response.data
  })
  .catch(error => NotificationManager.error(error.toString(), 'Login error'))

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const requestLogout = () => (dispatch, getState) => {
  try {
    dispatch(push('/login'))
    dispatch({
      type: LOGOUT_SUCCESS
    })
  } catch (error) {
    NotificationManager.error(error.toString(), 'Logout error')
  }
}
