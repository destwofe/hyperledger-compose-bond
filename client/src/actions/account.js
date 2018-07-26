import Axios from 'axios'
import { push } from 'react-router-redux'

import { BASE_URL } from './index'
import { fetchMoneyWallet, fetchBond, fetchBondSubscriptionContract, fetchBondWallet } from './asset'
import { tabChange } from './view';

import { NotificationManager } from 'react-notifications'

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const requestLogin = (username) => async (dispatch, getState) => {
  try {
    const { data: account } = await Axios.get(`${BASE_URL}/api/account`, { headers: { accessToken: username } })
    Axios.defaults.headers = { accessToken: username }

    // eslint-disable-next-line
    const [bonds, moneyWallets] = await Promise.all([
      fetchBond()(dispatch),
      fetchMoneyWallet()(dispatch)
    ])
    if (bonds.length > 0) {
      await Promise.all([
        fetchBondSubscriptionContract(bonds[0].id)(dispatch),
        fetchBondWallet(bonds[0].id)(dispatch)
      ])
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: username,
        accountData: account
      }
    })
    if (account.role.isGateway) {
      tabChange(2)(dispatch)
      dispatch(push('/moneywallets'))
    } else {
      dispatch(push('/bonds'))
    }

    return Promise.resolve(account)
  } catch (error) {
    NotificationManager.error(error.toString(), 'Login error')
  }
}

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
