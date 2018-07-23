import Axios from 'axios'
import { push } from 'react-router-redux'

import { BASE_URL } from './index'
import { fetchMoneyWallet, fetchBond, fetchBondSubscriptionContract, fetchBondWallet } from './asset'

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const requestLogin = (username) => async (dispatch, getState) => {
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
  dispatch(push('/bonds'))
  return Promise.resolve(account)
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const requestLogout = () => (dispatch, getState) => {
  dispatch(push('/login'))
  dispatch({
    type: LOGOUT_SUCCESS
  })
}
